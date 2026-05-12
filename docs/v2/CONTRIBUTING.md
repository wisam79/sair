# 🤝 Contributing Guidelines

Welcome to the UniRide engineering team! Please adhere to the following strict guidelines to maintain the integrity and cleanliness of the v2 architecture.

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
- **No "Any"**: Use strict TypeScript typing. Leverage `@uniride/core` Zod schemas to infer types.
- **No Inline SQL**: All database schema changes must be done via Drizzle (`packages/db/schema.ts`) and pushed via `drizzle-kit`.

## 4. Writing Tests

- All new business logic added to `@uniride/core` must be accompanied by Unit Tests.
- Run `pnpm test` to ensure you haven't broken existing functionality.

## 5. Architectural Boundaries

- Never import from `apps/*` into `packages/*`.
- `apps/mobile` and `apps/admin` should not share UI components directly. Share only logic via `packages/core`.
