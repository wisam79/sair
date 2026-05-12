# UniRide: V1 Sunset & Migration Justification 🌅

This document serves as the official engineering justification for deprecating and safely deleting the legacy `v1` codebase. It outlines the comparative advantages of `v2` and provides a safe deletion protocol.

## 1. Why V2 is Categorically Better (v1 vs v2)

The decision to rewrite was not taken lightly. `v1` suffered from fundamental architectural flaws that could not be patched without rewriting the core.

| Feature Area              | Legacy V1 (The Problem)                                                                                                                    | UniRide V2 (The Solution)                                                                                                         |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Concurrency (Booking)** | Vulnerable to **Overbooking**. Used a "check-then-act" pattern in SQL/TS, allowing multiple students to book the same seat simultaneously. | **Zero Overbooking Guarantee**. Uses strictly atomic `FOR UPDATE` pessimistic locking inside Postgres RPCs.                       |
| **Security (RLS)**        | Relied on slow `SELECT` subqueries (N+1 problem) to verify user roles for every row accessed.                                              | **Blazing Fast**. Uses **JWT Claims** (`auth.jwt()->'user_metadata'`). Zero database reads required for role verification.        |
| **State Management**      | Spread across SQL RPCs, React state, and Edge functions inconsistently.                                                                    | Centralized in `@uniride/core` via strict Zod schemas and a unified Edge Function (`trip-engine`).                                |
| **Monorepo Structure**    | Tangled dependencies. `admin` and `mobile` apps had conflicting React versions causing runtime errors.                                     | **Symmetric Workspaces**. `packages/*` for logic, `apps/*` for presentation. Strictly managed by PNPM with synchronized versions. |
| **Developer Experience**  | Required manual database manipulation to test features. Poor CI/CD integration.                                                            | Automated DB Seeding (`pnpm seed`), enforced formatting (Husky/Lint-staged), and comprehensive architecture docs.                 |

## 2. Feature Parity Checklist

Before deleting V1, we confirm that V2 handles all original business requirements:

- [x] **User Management**: Unified Auth flow with Role-based access (Student/Driver/Admin).
- [x] **Route Management**: Admins and Drivers can manage routes and capacities.
- [x] **Booking System**: Students can subscribe to routes (Now mathematically safe).
- [x] **Trip Tracking**: State machine for daily trips (Now includes GPS verification).
- [x] **Admin Dashboard**: Refine-based dashboard for system oversight.

## 3. Safe Deletion Protocol (Sunset Guide)

If you are reading this, `v2` is operational. Follow these steps to safely delete `v1` and free up workspace context:

### Step A: Verify Data Migration (If Production)

If `v1` was ever used in production, ensure you have exported the raw data from the old Supabase project. (If `v1` was just a prototype, skip to Step B).

```bash
# Export data from V1 (Optional)
supabase db dump --data-only -f v1_backup.sql
```

### Step B: Delete the Legacy Folder

The `legacy_v1` folder is no longer needed. Its presence in the workspace only slows down IDE indexing and AI context windows.

You can safely run the following command to permanently delete it:

**Windows (PowerShell):**

```powershell
Remove-Item -Path "legacy_v1" -Recurse -Force
```

**Mac/Linux:**

```bash
rm -rf legacy_v1
```

## Conclusion

The `legacy_v1` codebase represents "how we learned the domain." The `v2` codebase represents "how we built the enterprise product." Keeping V1 around adds no value and poses a distraction risk. **It is safe to delete.**
