# UniRide v2 - Smart Transit Platform 🎓

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB.svg?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000.svg?logo=next.js)
![Expo](https://img.shields.io/badge/Expo-55-000020.svg?logo=expo)
![Supabase](https://img.shields.io/badge/Supabase-DB_&_Edge-3ECF8E.svg?logo=supabase)

UniRide is a robust, scalable, and highly secure platform designed to manage university student transportation in Iraq. Rebuilt from scratch (v2) to eliminate technical debt, introduce atomic transactions, and provide a seamless developer experience.

## 📚 Documentation Hub

Welcome to the UniRide engineering documentation. Everything you need to understand, run, and scale this platform is documented below.

- 🚀 [**Getting Started Guide**](./docs/v2/GETTING_STARTED.md) - Local setup, environment variables, and database seeding.
- 🏗️ [**Architecture Deep-Dive**](./docs/v2/ARCHITECTURE.md) - Clean architecture, monorepo structure, and design philosophy.
- 🔄 [**State Machine & Logic**](./docs/v2/STATE_MACHINE.md) - How trips and bookings work under the hood.
- 🛡️ [**Security & RLS**](./docs/v2/SECURITY.md) - JWT claims, Row Level Security, and Atomic Locking.
- 📡 [**API & Functions Reference**](./docs/v2/API_REFERENCE.md) - Edge functions and Postgres RPCs.
- 🤝 [**Contributing Guidelines**](./docs/v2/CONTRIBUTING.md) - Code quality, formatting, and PR standards.

## 🌟 Key Engineering Highlights

1. **Zero Overbooking Guarantee**: Utilizes strict `FOR UPDATE` pessimistic locking in PostgreSQL to ensure seat availability is absolute, regardless of concurrency.
2. **Symmetric Monorepo**: Powered by `pnpm` workspaces, strictly separating domain logic (`@uniride/core`, `@uniride/db`) from presentation (`mobile`, `admin`).
3. **Blazing Fast Security**: Row Level Security (RLS) policies rely purely on JWT claims, bypassing expensive database lookups on every query.
4. **Developer Experience (DX)**: Automated database seeding (`pnpm seed`), pre-commit hooks (Husky), and fully typed interfaces end-to-end.

---

_Architected and documented for operational excellence._
