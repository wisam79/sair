# UniRide v2 - Project Map

## [TECH_STACK]
- **Frontend**: Next.js 16.2.6 (Admin), Expo 55 (Mobile)
- **Database**: Supabase + Drizzle ORM 0.45.2
- **Shared**: Zod, TypeScript 5.4+
- **Security**: Custom JWT Claims (app_metadata) + RLS

## [SYSTEM_FLOW]
- Auth -> Profile Management (Trigger: syncs full_name to auth.users metadata)
- Booking -> Atomic Seat Reservation (Edge Function with JWT Auth)
- Subscription Cancellation -> Postgres Trigger (returns seat to routes.available_seats)
- Trip Tracking -> GPS Verification + State Machine (Edge Function with JWT Auth)
- GPS Location Updates -> Direct RPC update_trip_location (bypasses state machine)
- Real-time -> Supabase Realtime Subscriptions (routes, trips)
- Offline -> Zustand persist middleware (auth, trips, i18n)
- Network Status -> Periodic connectivity check with offline banner
- Audit -> log_audit RPC for booking, trip, and profile changes
- Subscription Expiry -> pg_cron job (hourly, sets expired status)
- Role Resolution -> app_metadata.role (primary), user_metadata.role (fallback)

## [ARCHITECTURE]
- **Naming Convention**: snake_case everywhere (DB columns, TypeScript types, Supabase queries). Database is source of truth.
- `packages/core`: Validation, Shared Types (snake_case), i18n, Theme, State Machine Logic.
- `packages/db`: Drizzle schemas, Migrations, Seed data (5 students, 3 drivers, 6 routes, 3 trips, 5 subscriptions). audit_logs.details is JSONB.
- `supabase/functions`: atomic-booking (seat reservation with auth + rate limiting), trip-engine (state machine with auth + rate limiting). CORS strict (no wildcard fallback).
- `supabase/migrations`:
  - 001: Core RLS + booking RPC
  - 002: Trip state machine + RLS policies
  - 003: Indexes + audit_logs + cancel RLS
  - 004: Phase 0 fixes (GPS RPC, cancel trigger, app_metadata role, pg_cron, profile sync trigger, CHECK constraint, ON DELETE CASCADE)
- `apps/mobile`: Student & Driver Unified App (Expo Router).
  - All Supabase queries use snake_case column names.
  - All TypeScript types use snake_case property names matching DB columns.
  - Screens: Login, Discovery, Booking, Subscriptions, Profile, Live Tracking, Driver Dashboard.
  - Hooks: useAuth, useRoutes, useTrips, useLocationTracker, useTranslation, useNetworkStatus.
  - Components: ErrorBoundary (i18n-aware), LoadingSkeleton.
  - Features: Tab navigation, offline banner, subscription cancellation with seat return, real GPS, route name display, trip lookup for tracking.

## [COMPLETED PHASES]
- [x] Monorepo structure initialization.
- [x] Core shared package (Zod schemas, i18n, theme, state machine).
- [x] Database schema design (Drizzle + Supabase migrations).
- [x] Atomic Booking RPC & Edge Function (with JWT auth + input validation + rate limiting).
- [x] Trip Engine State Machine (PL/pgSQL + Edge Function with JWT auth + rate limiting).
- [x] Base Admin Dashboard (Next.js + Refine).
- [x] Base Mobile App (Expo Router).
- [x] Phase 1: Frontend Auth Slice (Mobile & Admin).
- [x] Phase 2: Frontend Discovery Slice (Routes & Discovery with Realtime).
- [x] Phase 3: Frontend Transaction Slice (Atomic Booking with real routes, idempotency).
- [x] Phase 4: Frontend Operations Slice (Live Tracking, Driver Workflow, GPS).
- [x] Mobile: Profile screen with language toggle (AR/EN).
- [x] Mobile: My Subscriptions screen with tracking navigation (trip lookup by route_id).
- [x] Mobile: Driver Dashboard (trip management, status transitions, GPS tracking).
- [x] Mobile: Offline support (zustand persist middleware).
- [x] Mobile: Tab navigation (Home/Subscriptions/Profile for students, Dashboard/Profile for drivers).
- [x] Mobile: Subscription cancellation flow (with seat return via DB trigger).
- [x] Mobile: Route name display in tracking screen (instead of UUID).
- [x] Mobile: Real GPS for driver status transitions (no hardcoded coordinates).
- [x] Mobile: Network connectivity detection with offline banner.
- [x] Mobile: Error boundary component (i18n-aware).
- [x] Mobile: Loading skeleton components.
- [x] Mobile: All hardcoded English strings replaced with i18n keys.
- [x] Admin: Trips management page with status chips.
- [x] Admin: Profiles management page with role chips.
- [x] Admin: Subscriptions management page.
- [x] Admin: Real stats dashboard (Revenue IQD instead of duplicate Total Routes).
- [x] Admin: Sidebar navigation layout (MUI Drawer, responsive).
- [x] Admin: Proper server-side cookie handling for Supabase SSR.
- [x] Internationalization (AR/EN) with RTL support + new keys (retry, go_back, are_you_sure, no, yes, updated_successfully, something_went_wrong, try_again, check_inbox, invalid_transition, cancel_confirmation).
- [x] Real-time subscriptions (routes, trips).
- [x] RLS policies for all tables (profiles, drivers, routes, subscriptions, trips, audit_logs).
- [x] Trip state machine validation (SQL + TypeScript).
- [x] Double-booking prevention (SQL check in reserve_seat).
- [x] All Edge Functions have JWT auth verification + rate limiting.
- [x] Input validation with Zod schemas throughout (client-side + server-side).
- [x] Tightened CORS on Edge Functions (strict origin check, no wildcard fallback).
- [x] Production database indexes (FK, composite, partial).
- [x] Audit logging (audit_logs table + log_audit RPC + edge function integration). audit_logs.details is JSONB.
- [x] Subscription cancellation RLS (students can cancel own active/pending).
- [x] Subscription cancellation trigger (returns seat to routes.available_seats).
- [x] GPS location-only RPC (update_trip_location) bypasses state machine for tracking updates.
- [x] JWT role from app_metadata (secure, not user-writable) with user_metadata fallback.
- [x] Profile update sync trigger (profiles.full_name -> auth.users raw_user_meta_data).
- [x] Subscription auto-expiry via pg_cron (hourly).
- [x] CHECK constraint: routes.available_seats >= 0 AND <= capacity.
- [x] ON DELETE CASCADE on all foreign keys (subscriptions, trips, routes, audit_logs).
- [x] Strict TypeScript - no `any` types in mobile or admin code.
- [x] Comprehensive seed data (5 students, 3 drivers, 6 routes, 3 trips, 5 subscriptions).
- [x] Unit tests: Core schemas, state machine, translation consistency, new schema validations.
- [x] Integration tests: Booking system, trip state machine lifecycle.
- [x] E2E tests: Edge Function security (auth rejection, input validation, rate limiting), RLS enforcement, data integrity checks (13 tests via Playwright).
- [x] CI/CD Pipeline (GitHub Actions).
- [x] Deployment Automation Script.
- [x] Production Documentation (README, API Reference, Architecture, Security).
- [x] Clean admin globals.css (no gradient conflicts with MUI).
- [x] .env.example with all required variables (including EXPO_PUBLIC_).
- [x] snake_case column names in ALL Supabase queries and TypeScript types (database as source of truth).

## [ORPHANS & PENDING]
- [ ] Phase 1 evaluation: Does the app work correctly with real data? Are TanStack Query / PowerSync / react-native-maps needed?
- [ ] Rate limiter in-memory doesn't work across serverless instances (H1) - consider Supabase table or Redis
- [ ] SERVICE_ROLE_KEY in Edge Functions bypasses RLS (H3) - strengthen validation
- [ ] Offline-First architecture (H5) - evaluate PowerSync if internet instability is confirmed
- [ ] Pagination for large datasets (M3) - evaluate TanStack Query
- [ ] Realtime refetch optimization (M4) - incremental updates instead of full refetch
- [ ] useNetworkStatus improvements (M5) - more responsive detection
- [ ] No mechanism to create trips (L1) - driver/admin UI needed
- [ ] Driver verification not enforced (L2) - block unverified drivers
- [ ] institutionId unused (L3)
- [ ] Error monitoring / Sentry (L4)
- [ ] Push notifications (L9) - expo-notifications
- [ ] Real map in tracking screen (L10) - react-native-maps

## [TEST RESULTS]
- Unit + Integration (vitest): 46 passed
- E2E API (playwright): 13 passed (Edge Function security, RLS, data integrity)
- Database: Seeded (9 profiles, 3 drivers, 6 routes, 3 trips, 5 subscriptions)
- Edge Functions: atomic-booking v2, trip-engine v2 (deployed with rate limiting + CORS)
