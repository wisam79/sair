# 🛡️ Security Model

Security in UniRide v2 is built around **Supabase Row Level Security (RLS)** and **JWT Claims**, ensuring that users can only access their own data without sacrificing database performance.

## 1. High-Performance RLS via JWT Claims

In v1, checking if a user was an admin required a database query:

```sql
-- BAD (v1): Causes N+1 query performance issues
SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
```

In **v2**, we inject the user's role directly into the Supabase Auth JWT token during sign-up/login. Our RLS policies simply decode the token:

```sql
-- GOOD (v2): Zero database reads required — app_metadata is admin-only (not client-writable)
CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql STABLE;
```

## 2. Atomic Operations vs. TypeScript Concurrency

We **never** use the "Check-then-Act" pattern in Edge Functions or Next.js API routes for sensitive data (like decreasing seat counts or handling money).

### Why?

If two students press "Book" at the exact same millisecond:

- **TypeScript**: Both read `seats = 1`. Both update `seats = 0`. Result: 2 students booked 1 seat. (Overbooking).
- **Postgres RPC (Our Approach)**: Request A locks the row. Request B waits. Request A updates `seats = 0` and unlocks. Request B reads `seats = 0` and fails. Result: 1 student booked, 1 rejected. (Perfect consistency).

## 3. Data Validation

All inputs from clients (Mobile, Admin) MUST pass through Zod schemas defined in `@uniride/core` before hitting Edge Functions or the Database.

```typescript
// Example from packages/core/index.ts
export const GeoCoordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
```
