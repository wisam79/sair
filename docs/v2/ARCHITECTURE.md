# Sair v2 - Architectural Deep-Dive 🧠

## 1. Design Philosophy

Sair v2 follows the **Clean Architecture** and **Domain-Driven Design (DDD)** principles. The goal is to separate business rules from technical implementation details.

## 2. Layered Structure

- **Core Layer (`packages/core`)**: The "Pure" layer. Contains no dependencies on databases or frameworks. It defines the "What" (Schemas, Types, State Machines, i18n keys). **Strictly uses `snake_case` for all properties.**
- **Service Layer (`supabase/functions`)**: Orchestrates business processes. Edge functions act as secure gateways and MUST utilize `@sair/core` Zod schemas for input validation before touching the database.
- **Data/Logic Layer (`supabase/migrations`)**: The "How" of data. The database acts as a logic engine. High-integrity operations (like transactions and concurrency controls) are offloaded to PostgreSQL RPCs. Note: We do **NOT** use `packages/db` or any external ORM for logic; Supabase Migrations are the single source of truth.
- **Presentation Layer (`apps/*`)**: Pure UI.
  - **Admin App**: Built with Next.js App Router. Should heavily leverage React Server Components (RSC) for initial data fetching and Server Actions for mutations to reduce waterfalls.
  - **Mobile App**: Built with Expo & React Native. Must optimize React renders (avoiding inline functions in lists) and rely on Zustand for persistent state.

## 3. Atomic Licensing Strategy

To prevent concurrency issues, the system uses a prepaid **License Code** system rather than legacy direct reservations.

1. The Student calls the `activate_license` RPC with an exactly 8-character code.
2. Postgres locks the specific License row (`FOR UPDATE NOWAIT`).
3. Check `status == 'active'`.
4. If yes, mark as `used`, link to student, and create the active subscription for the given route.
5. Release lock.
   This ensures 100% accuracy and prevents multiple students from redeeming the same license simultaneously. Note: Available seats are decremented at the subscription level, not the trip level.

## 4. Security Model (JWT Claims)

Instead of checking the DB for every request:

- Admin Role -> `auth.jwt() -> 'app_metadata' -> 'role' == 'admin'`
- Student/Driver -> Metadata-based filtering.
  This reduces DB latency by ~80% for RLS checks.

**Important:** The `user_metadata` field is client-writable and must never be used for authorization. We exclusively rely on `app_metadata` managed securely by the backend.
