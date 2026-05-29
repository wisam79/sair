# Sair v2 - Architectural Deep-Dive 🧠

## 1. Design Philosophy

Sair v2 is built using **Clean Architecture** and **Domain-Driven Design (DDD)** principles to enforce a strict separation of concerns. By keeping the core business domain pure and offloading data-integrity constraints to atomic PostgreSQL transactions, the platform guarantees a robust runtime posture free of race conditions.

---

## 2. Layered Monorepo Architecture

Sair v2 is structured as a symmetric monorepo using `pnpm` workspaces. This architecture divides the codebase into four logical layers:

```
┌────────────────────────────────────────────────────────┐
│ Presentation Layer (apps/mobile, apps/admin)           │
├────────────────────────────────────────────────────────┤
│ Service Layer (supabase/functions)                     │
├────────────────────────────────────────────────────────┤
│ Logic & Data Layer (supabase/migrations - Postgres RPCs)│
├────────────────────────────────────────────────────────┤
│ Domain/Core Layer (packages/core)                      │
└────────────────────────────────────────────────────────┘
```

### 2.1 Domain/Core Layer (`packages/core`)

- The **Pure** layer of the application. It contains zero external frameworks or database dependencies.
- Defines the shared validation schemas (Zod schemas), typescript interfaces, internationalization translation keys, and the trip state machine logic (via a lightweight finite state machine config).
- **Strict Naming Convention**: Strictly enforces `snake_case` properties to match database tables, minimizing structural mapping code in client apps.

### 2.2 Service Layer (`supabase/functions`)

- Deno-based Edge Functions that act as secure orchestration gateways for operations spanning external systems or requiring special keys (e.g., push notifications, third-party payment checkout webhooks).
- Gateways **must** validate incoming payloads against the `@sair/core` Zod schemas before interacting with the database layer.

### 2.3 Logic & Data Layer (`supabase/migrations`)

- The database is treated as the **Single Source of Truth** and the **Logic Engine** of the platform.
- We do **not** use Drizzle ORM or any server-side database libraries for business logic execution. High-integrity mutations are offloaded to PL/pgSQL database functions (RPCs).
- Features like RLS (Row Level Security), triggers for updated timestamps, cascading deletes, indexes, constraint checks, and database-backed rate-limiting are fully implemented at this level.

### 2.4 Presentation Layer (`apps/*`)

- **Admin Dashboard (`apps/admin`)**: A Refine + Next.js App Router dashboard built on top of Material UI. Fetches data directly using a custom Supabase data provider and leverages React Server Components (RSC) to minimize network waterfalls.
- **Mobile App (`apps/mobile`)**: A unified student/driver app built with Expo and Expo Router. Leverages Zustand persisted stores for offline-first state synchronization and React Query for network status and data management.

---

## 3. Concurrency Control & Atomic Licensing Flow

Sair v2 guarantees a **Zero Overbooking Rule** by utilizing pessimistic locking and database constraints rather than application-level checks.

### 3.1 The Prepaid Licensing Pattern

To subscribe to a bus route, students purchase a license batch voucher (an 8-character code) and redeem it. The activation workflow is fully atomic:

1. The student submits the 8-character code to the `activate_license` RPC.
2. The database locks the matching license row using `SELECT ... FOR UPDATE NOWAIT` to prevent concurrent redemption.
3. The RPC verifies the license is in an `'active'` status.
4. The RPC atomically checks and decrements the available seats on the route (`UPDATE routes SET available_seats = available_seats - 1 WHERE id = route_id AND available_seats > 0`).
5. The license status is changed to `'used'`, and an active subscription is created.
6. The transaction commits. If any step fails (e.g., no seats, concurrent activation), the entire transaction rolls back.

### 3.2 Duplicate Subscription Prevention

Under concurrent network requests, a student could trigger multiple activations for the same route. While row locking handles license codes, it does not lock non-existent subscription rows. Sair v2 solves this by enforcing subscription uniqueness at the PostgreSQL storage level:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_sub_per_route
ON subscriptions (student_id, route_id)
WHERE status IN ('active', 'pending');
```

Any concurrent insert attempt will fail with a `unique_violation` constraint error, rolling back the transaction and preventing duplicate charges or seat double-allocations.

---

## 4. High-Performance Security Model (JWT Claims)

To achieve microsecond latency on query execution, Row Level Security (RLS) policies do not perform recursive database queries to check user roles.

### 4.1 app_metadata vs. user_metadata

- **user_metadata**: Client-writable. The mobile client can modify user metadata on request. **Never use user metadata to authorize operations or check roles.**
- **app_metadata**: Backend-only. Only accessible and writeable by the Supabase auth administrator or database triggers. Sair v2 stores the user role (`admin`, `student`, `driver`) strictly in `app_metadata`.

### 4.2 Zero-Read RLS Policies

When a user signs in, their role is encoded inside their JWT token. The database reads this token directly from the connection context, bypassing table queries:

```sql
CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql STABLE;
```

RLS policies evaluate this role claim instantly (e.g., `USING (get_my_role() = 'admin')`), resulting in an ~80% latency reduction compared to query-based role resolution.
