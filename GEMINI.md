# sair v2

## Project Overview

UniRide v2 is a scalable, secure, and clean architecture-based platform designed to manage university student transportation in Iraq. It is structured as a symmetric monorepo using `pnpm` workspaces, separating domain logic from presentation layers.

**Key Technologies:**

- **Frontend Admin:** Next.js (App Router), Refine, Material UI
- **Frontend Mobile:** React Native, Expo, Expo Router, Zustand
- **Backend & Auth:** Supabase (Database, Auth, Realtime, Edge Functions)
- **Database ORM:** Drizzle ORM
- **Shared/Core:** TypeScript, Zod, i18next (AR/EN)

**Architectural Highlights:**

- **Domain-Driven Design:** The `@uniride/core` package acts as the single source of truth for types, validation schemas, and state machine logic.
- **Database as Logic Engine:** High-integrity operations (like the atomic seat booking to prevent overbooking) are offloaded to PostgreSQL RPCs using pessimistic locking (`FOR UPDATE`).
- **Edge Functions:** Supabase Edge Functions act as secure gateways for complex operations, handling rate limiting, idempotency, and CORS before interacting with the database.
- **Security:** Heavy reliance on Row Level Security (RLS) driven by custom JWT claims stored in `app_metadata` to minimize database query overhead.

## Building and Running

The project utilizes `pnpm` (v10+) as its package manager.

**Key Commands:**

- **Install Dependencies:** `pnpm install`
- **Run Development Servers:** `pnpm dev` (Starts all apps/packages in dev mode)
- **Build All:** `pnpm build`
- **Run Unit/Integration Tests:** `pnpm test` (Powered by Vitest)
- **Run E2E Tests:** `pnpm test:e2e` (Powered by Playwright)
- **Type Checking:** `pnpm typecheck`
- **Code Formatting:** `pnpm format` (Powered by Prettier)

## Development Conventions

- **Naming Conventions:** `snake_case` is strictly enforced across the stack. This applies to database columns, Supabase RPC parameters, and their corresponding TypeScript interfaces in the core and client apps. The database is considered the ultimate source of truth for naming.
- **Type Safety:** Strict TypeScript is required. The use of `any` is prohibited in both the mobile and admin applications. Input and output validation must utilize Zod schemas defined in `@uniride/core`.
- **Business Logic Enforcement:** Critical business rules, such as trip state transitions (`scheduled` -> `completed`) and seat reservations, must be enforced at the database level via PL/pgSQL to guarantee consistency.
- **Internationalization (i18n):** The platform is bilingual (Arabic/English) with full RTL support. Hardcoded UI strings are prohibited; developers must utilize centralized translation keys from `@uniride/core`.
- **Pre-commit Standards:** The project utilizes Husky and lint-staged to automatically format code using Prettier prior to any commit.
