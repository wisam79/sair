-- ============================================================
-- Sair v2 — Base Schema (Fresh Project Bootstrap)
-- ============================================================
-- This migration creates the core tables that subsequent
-- migrations depend on. Run this FIRST on any new project.
-- ============================================================

-- ── Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ── Institutions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institutions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  city       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Profiles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT,
  phone          TEXT,
  role           TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'driver', 'admin')),
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  avatar_url     TEXT,
  is_verified    BOOLEAN NOT NULL DEFAULT false,
  expo_push_token TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Drivers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  license_number  TEXT,
  vehicle_model   TEXT,
  vehicle_plate   TEXT,
  capacity        INT NOT NULL DEFAULT 4,
  is_verified     BOOLEAN NOT NULL DEFAULT false,
  rating          NUMERIC(3,2),
  total_trips     INT NOT NULL DEFAULT 0,
  balance         NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Routes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id        UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  start_location   TEXT NOT NULL,
  end_location     TEXT NOT NULL,
  price            NUMERIC(12,2) NOT NULL,
  capacity         INT NOT NULL DEFAULT 4,
  available_seats  INT NOT NULL DEFAULT 4,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  departure_time   TEXT,
  days_of_week     TEXT[],
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT routes_available_seats_check CHECK (available_seats >= 0 AND available_seats <= capacity)
);

-- ── Subscriptions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  route_id      UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled', 'expired')),
  start_date    TIMESTAMPTZ DEFAULT NOW(),
  end_date      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trips ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id     UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  driver_id    UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('scheduled', 'driver_waiting', 'in_transit', 'completed', 'absent', 'cancelled')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  last_lat     NUMERIC(10,7),
  last_lng     NUMERIC(10,7),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  route_id             UUID REFERENCES routes(id) ON DELETE SET NULL,
  subscription_id      UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount               NUMERIC(12,2) NOT NULL,
  status               TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  zaincash_order_id    TEXT,
  zaincash_transaction_id TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Ratings ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  driver_id  UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  rating     INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, student_id)
);

-- ── License System ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS license_batches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id    UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  batch_name  TEXT NOT NULL,
  quantity    INT NOT NULL,
  price       NUMERIC(12,2) NOT NULL,
  valid_days  INT NOT NULL DEFAULT 30,
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS licenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id    UUID NOT NULL REFERENCES license_batches(id) ON DELETE CASCADE,
  route_id    UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  code        CHAR(8) NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'revoked')),
  used_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Feature Flags ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Rate Limits ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action        TEXT NOT NULL,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INT NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Audit Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id UUID,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Support Requests ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject     TEXT NOT NULL,
  body        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Conversations & Messages ────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  driver_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  route_id    UUID REFERENCES routes(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Notification Log ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB,
  status      TEXT NOT NULL DEFAULT 'sent',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payouts ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id   UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  amount      NUMERIC(12,2) NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── updated_at trigger function ────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','drivers','routes','subscriptions','trips','payments','support_requests','conversations','payouts'] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;
      CREATE TRIGGER trg_%s_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;

-- ── Enable RLS on all tables ────────────────────────────────
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_batches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts          ENABLE ROW LEVEL SECURITY;
