# 🚀 Getting Started with UniRide v2

This guide will walk you through setting up the UniRide v2 environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v22.0.0 or higher.
- **PNPM**: v10.0.0 or higher (`npm install -g pnpm`).
- **Supabase CLI**: Latest version for local database development.
- **Docker**: Required by Supabase CLI to run the local database.

## 1. Installation

Clone the repository and install all monorepo dependencies:

```bash
git clone <your-repo-url> uniride
cd uniride
pnpm install
```

## 2. Environment Setup

Create `.env` files across the necessary projects.

```bash
cp .env.example .env
```

Ensure your `.env` contains:

```env
DATABASE_URL="postgres://postgres:postgres@127.0.0.1:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
```

## 3. Database Initialization & Seeding

Start your local Supabase instance:

```bash
supabase start
```

Push the latest Drizzle schema to your local database:

```bash
pnpm --filter @uniride/db push
```

Seed the database with mock data (Admin, Drivers, Routes):

```bash
pnpm --filter @uniride/db run seed
```

## 4. Running the Applications

### Admin Dashboard (Next.js)

```bash
pnpm --filter admin-dashboard dev
```

Accessible at `http://localhost:3000`.

### Mobile Application (Expo)

```bash
pnpm --filter mobile-app start
```

Use the Expo Go app on your phone to scan the QR code, or press `i` / `a` to run on iOS/Android emulators.

## 5. Deploying Edge Functions Locally

If you are testing the booking or trip tracking logic, you need to serve the edge functions:

```bash
supabase functions serve
```
