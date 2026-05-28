# Sair v2 - Security Model & Hardening 🛡️

Security in Sair v2 is built using a defense-in-depth approach spanning the client, Deno edge gateways, and the database storage layers. It guarantees that users can only interact with authorized data without impacting database performance.

---

## 1. High-Performance RLS via JWT Claims

In legacy implementations, checking if a user was an admin or verifying their role required executing subqueries on every database read:

```sql
-- BAD: Causes N+1 query performance problems under load
SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
```

In **v2**, user roles (`admin`, `student`, `driver`) are securely stored in the Supabase Auth system inside `app_metadata` (which is client-read-only and cannot be modified by the client app). The role is automatically injected into the JWT token claims upon sign-in. RLS policies query this token claim directly:

```sql
-- GOOD: Zero database reads required for role verification
CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql STABLE SET search_path = public;
```

---

## 2. Secure Search Paths (Path Injection Protection)

All `SECURITY DEFINER` functions in Sair v2 run with the privileges of the database owner. If the function's search path is not explicitly set, a malicious user could create a temporary table or function with a common name (like `coalesce` or `sum`) in another schema and manipulate the search path to hijack execution.

To prevent this, every `SECURITY DEFINER` function strictly enforces a static search path:

```sql
CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
...
$$;
```

---

## 3. Strict Execution Privilege Control (Revoking PUBLIC)

By default, PostgreSQL allows `PUBLIC` (all roles, including anonymous users) to execute newly created functions. In Sair v2, we enforce a strict privilege containment policy:

1. **Sensitive RPCs**: Execution privileges are explicitly revoked from `PUBLIC` and granted only to `authenticated` or `service_role` accounts.
   ```sql
   REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) FROM PUBLIC;
   GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) TO authenticated;
   ```
2. **Internal Functions**: Functions used only inside database triggers or called by other functions (e.g., `validate_trip_transition`, `check_rate_limit`) have all execution privileges revoked from client roles:
   ```sql
   REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM PUBLIC, authenticated, anon;
   GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;
   ```

---

## 4. RLS Policy Hardening against IDOR

Row Level Security policies prevent Insecure Direct Object Reference (IDOR) attacks across all tables:

- **`notification_log`**: Writing notifications is restricted to the `service_role` (backend) or the matching `user_id` itself. Clients cannot inject spoofed alerts.
- **`conversations` & `messages`**: Users can only view or insert conversations and messages if they are active participants (matching `student_id` or `driver_id` from the profiles/drivers tables).
- **`emergency_reports`**: Inserting a distress signal (SOS) is only allowed if the user is a student currently subscribed to the route of the trip, or the driver assigned to the trip.
- **`support_requests`**: Users can only view their own requests and can only update pending support requests. Admins have full access.

---

## 5. Optimized Rate-Limiting & WAL Bloat Protection

Standard database-backed rate limiters write a "request log" on every hit, even when a request is blocked. Under a brute-force or DDoS attack, this causes transaction log (WAL) bloat and disk I/O exhaustion.

Sair v2 implements a read-first check:

1. The function checks the request counts in the active window.
2. If the user is over the limit, it returns `FALSE` immediately **without writing any rows to the database** (zero I/O overhead on rejection).
3. If under the limit, it writes a request tick record.
4. Old rate limit logs are deleted in the background using a scheduled `pg_cron` job running every 10 minutes, rather than cleaning them up during client request execution.

```sql
SELECT cron.schedule(
  'cleanup-expired-rate-limits',
  '*/10 * * * *',
  $$DELETE FROM public.rate_limits WHERE window_start < NOW() - INTERVAL '1 hour'$$
);
```

---

## 6. Concurrency & Double-Spending Prevention

When calculating driver balances for payout requests, Sair v2 performs pessimistic locking (`FOR UPDATE`) on subscription and driver records:

1. Locks the driver's profile row (`SELECT id FROM drivers ... FOR UPDATE NOWAIT`) to block concurrent payout requests.
2. Locks all active and expired subscriptions assigned to the driver.
3. Computes the earned balance (`SUM(purchase_price)`) and deducts pending/completed payouts.
4. Validates that the requested amount is available, preventing double-spending race conditions.
