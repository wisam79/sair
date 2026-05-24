# 🤝 Contributing Guidelines

Welcome to the Sair engineering team! Please adhere to the following strict guidelines to maintain the integrity and cleanliness of the v2 architecture.

## 1. Branching Strategy

- `main`: Production-ready code only.
- `feature/*`: For new features (e.g., `feature/driver-payouts`).
- `fix/*`: For bug fixes (e.g., `fix/booking-race-condition`).

## 2. Code Quality & Pre-commit Hooks

We use **Husky** and **Lint-Staged** to enforce code quality.

- You **cannot** commit code that is poorly formatted. Prettier will automatically format your files on commit.
- You **cannot** commit code with TypeScript errors.

Ensure you run `pnpm format` and `pnpm typecheck` before opening a Pull Request.

## 3. The "No Tech Debt" Policy

- **No `// TODO` or `// FIXME`**: Code must be complete. If a feature is partial, use feature flags, do not leave broken code in `main`.
- **No "Any"**: Use strict TypeScript typing. Leverage `@sair/core` Zod schemas to infer types.
- **No Inline SQL / Drizzle**: All database schema changes must be managed via Supabase Migrations (`supabase/migrations/`). Do not use any ORM.

## 4. Writing Tests

- All new business logic added to `@sair/core` must be accompanied by Unit Tests.
- Run `pnpm test` to ensure you haven't broken existing functionality.

## 5. Architectural Boundaries

- Never import from `apps/*` into `packages/*`.
- `apps/mobile` and `apps/admin` should not share UI components directly. Share only logic via `packages/core`.
