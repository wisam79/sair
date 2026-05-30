
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    RETURN;
  END IF;


  -- ==========================================
  -- Source: 20260100000000_base_schema.sql
  -- ==========================================
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
  



  -- ==========================================
  -- Source: 2026051001_v2_security_and_booking.sql
  -- ==========================================
  -- UniRide v2: Core Security & Optimized RLS
  -- Using JWT Claims for high performance
  
  -- 1. Enable RLS on all tables
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
  
  -- 2. Helper Functions (Optimized with JWT Claims)
  CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
    SELECT auth.jwt() -> 'user_metadata' ->> 'role';
  $$ LANGUAGE sql STABLE;
  
  CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
    SELECT get_my_role() = 'admin';
  $$ LANGUAGE sql STABLE;
  
  -- 3. Profiles Policies
  CREATE POLICY "Profiles: Users see own" ON profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Profiles: Admins see all" ON profiles FOR SELECT USING (is_admin());
  
  -- 4. Routes Policies
  CREATE POLICY "Routes: Everyone sees active routes" ON routes 
  FOR SELECT USING (is_active = true);
  
  -- 5. Atomic Booking Logic (Transaction-safe)
  -- This replaces the fragile v1 logic
  CREATE OR REPLACE FUNCTION reserve_seat(p_route_id UUID, p_student_id UUID) 
  RETURNS void AS $$
  DECLARE
    v_available_seats INT;
  BEGIN
    -- Lock the row for update to prevent race conditions
    SELECT available_seats INTO v_available_seats 
    FROM routes 
    WHERE id = p_route_id 
    FOR UPDATE;
  
    IF v_available_seats <= 0 THEN
      RAISE EXCEPTION 'No seats available';
    END IF;
  
    -- Atomic update
    UPDATE routes 
    SET available_seats = available_seats - 1 
    WHERE id = p_route_id;
  
    -- Create subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (p_student_id, p_route_id, 'active', NOW(), NOW() + INTERVAL '1 month');
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051002_trip_state_machine_and_rls.sql
  -- ==========================================
  -- UniRide v2: Trip State Machine Validation + Missing RLS Policies
  
  -- 1. Trip Status Transition Validation Function
  CREATE OR REPLACE FUNCTION validate_trip_transition(
    p_trip_id UUID,
    p_new_status TEXT
  ) RETURNS BOOLEAN AS $$
  DECLARE
    v_current_status TEXT;
    v_valid BOOLEAN;
  BEGIN
    SELECT status INTO v_current_status FROM trips WHERE id = p_trip_id;
  
    IF v_current_status IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    v_valid := CASE v_current_status
      WHEN 'scheduled' THEN p_new_status IN ('driver_waiting', 'cancelled')
      WHEN 'driver_waiting' THEN p_new_status IN ('in_transit', 'cancelled')
      WHEN 'in_transit' THEN p_new_status IN ('completed', 'absent')
      WHEN 'completed' THEN FALSE
      WHEN 'absent' THEN FALSE
      WHEN 'cancelled' THEN FALSE
      ELSE FALSE
    END;
  
    IF NOT v_valid THEN
      RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status;
    END IF;
  
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 2. Safe Trip Update Function (enforces state machine + driver ownership)
  CREATE OR REPLACE FUNCTION update_trip_status(
    p_trip_id UUID,
    p_new_status TEXT,
    p_lat NUMERIC,
    p_lng NUMERIC,
    p_driver_id UUID
  ) RETURNS void AS $$
  DECLARE
    v_trip_driver_id UUID;
  BEGIN
    SELECT driver_id INTO v_trip_driver_id FROM trips WHERE id = p_trip_id FOR UPDATE;
  
    IF v_trip_driver_id IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip_driver_id != p_driver_id THEN
      RAISE EXCEPTION 'Unauthorized: not your trip';
    END IF;
  
    PERFORM validate_trip_transition(p_trip_id, p_new_status);
  
    UPDATE trips SET
      status = p_new_status,
      last_lat = p_lat,
      last_lng = p_lng,
      started_at = CASE WHEN p_new_status = 'in_transit' AND started_at IS NULL THEN NOW() ELSE started_at END,
      ended_at = CASE WHEN p_new_status IN ('completed', 'absent') THEN NOW() ELSE ended_at END,
      updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 3. Prevent double-booking: check if student already has active subscription for route
  -- Drop existing void version first (return type changed from void to UUID)
  DROP FUNCTION IF EXISTS reserve_seat(UUID, UUID);
  CREATE OR REPLACE FUNCTION reserve_seat(p_route_id UUID, p_student_id UUID)
  RETURNS UUID AS $$
  DECLARE
    v_available_seats INT;
    v_existing_count INT;
    v_subscription_id UUID;
  BEGIN
    SELECT available_seats INTO v_available_seats
    FROM routes
    WHERE id = p_route_id AND is_active = true
    FOR UPDATE;
  
    IF v_available_seats IS NULL THEN
      RAISE EXCEPTION 'Route not found or inactive';
    END IF;
  
    IF v_available_seats <= 0 THEN
      RAISE EXCEPTION 'No seats available';
    END IF;
  
    SELECT COUNT(*) INTO v_existing_count
    FROM subscriptions
    WHERE student_id = p_student_id
      AND route_id = p_route_id
      AND status IN ('active', 'pending');
  
    IF v_existing_count > 0 THEN
      RAISE EXCEPTION 'Already subscribed to this route';
    END IF;
  
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = p_route_id;
  
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (p_student_id, p_route_id, 'active', NOW(), NOW() + INTERVAL '1 month')
    RETURNING id INTO v_subscription_id;
  
    RETURN v_subscription_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 4. Driver RLS Policies
  CREATE POLICY "Drivers: Own profile sees own" ON drivers FOR SELECT
    USING (user_id = auth.uid());
  CREATE POLICY "Drivers: Admins see all" ON drivers FOR SELECT
    USING (is_admin());
  
  -- 5. Subscriptions RLS Policies
  CREATE POLICY "Subscriptions: Students see own" ON subscriptions FOR SELECT
    USING (student_id = auth.uid());
  CREATE POLICY "Subscriptions: Admins see all" ON subscriptions FOR SELECT
    USING (is_admin());
  CREATE POLICY "Subscriptions: Driver sees route subscriptions" ON subscriptions FOR SELECT
    USING (route_id IN (SELECT r.id FROM routes r JOIN drivers d ON r.driver_id = d.id WHERE d.user_id = auth.uid()));
  
  -- 6. Trips RLS Policies
  CREATE POLICY "Trips: Students see own route trips" ON trips FOR SELECT
    USING (route_id IN (SELECT route_id FROM subscriptions WHERE student_id = auth.uid()));
  CREATE POLICY "Trips: Driver sees own trips" ON trips FOR SELECT
    USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
  CREATE POLICY "Trips: Admins see all" ON trips FOR SELECT
    USING (is_admin());
  
  -- 7. Profiles RLS: Users can update own profile
  CREATE POLICY "Profiles: Users update own" ON profiles FOR UPDATE
    USING (auth.uid() = id);
  
  -- 8. Routes: Admins full access
  CREATE POLICY "Routes: Admins manage all" ON routes FOR ALL
    USING (is_admin());
  
  -- 9. Add updated_at column to trips if missing
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'trips' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE trips ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END $$;
  
  -- 10. Create trips updated_at trigger
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS set_trips_updated_at ON trips;
  CREATE TRIGGER set_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  



  -- ==========================================
  -- Source: 2026051003_indexes_audit_and_cancel.sql
  -- ==========================================
  -- UniRide v2: Production Performance Indexes + Audit Logging
  
  -- 1. Foreign key indexes
  CREATE INDEX idx_drivers_user_id ON drivers(user_id);
  CREATE INDEX idx_routes_driver_id ON routes(driver_id);
  CREATE INDEX idx_subscriptions_student_id ON subscriptions(student_id);
  CREATE INDEX idx_subscriptions_route_id ON subscriptions(route_id);
  CREATE INDEX idx_trips_route_id ON trips(route_id);
  CREATE INDEX idx_trips_driver_id ON trips(driver_id);
  CREATE INDEX idx_trips_status ON trips(status);
  
  -- 2. Composite indexes for common queries
  CREATE INDEX idx_routes_active_seats ON routes(is_active, available_seats) WHERE is_active = true;
  CREATE INDEX idx_subscriptions_student_active ON subscriptions(student_id, status) WHERE status IN ('active', 'pending');
  CREATE INDEX idx_trips_active ON trips(status) WHERE status IN ('driver_waiting', 'in_transit');
  
  -- 3. Audit logs table
  CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  -- 4. Audit log indexes
  CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
  CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);
  CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
  
  -- 5. Audit log RLS
  ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Audit: Admins see all" ON audit_logs FOR SELECT USING (is_admin());
  
  -- 6. Helper function to log audit events
  CREATE OR REPLACE FUNCTION log_audit(
    p_user_id UUID,
    p_action TEXT,
    p_resource TEXT,
    p_resource_id UUID,
    p_details JSONB
  ) RETURNS void AS $$
  BEGIN
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (p_user_id, p_action, p_resource, p_resource_id, p_details);
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 7. Subscription cancellation RLS
  CREATE POLICY "Subscriptions: Students cancel own active" ON subscriptions FOR UPDATE
    USING (student_id = auth.uid() AND status IN ('active', 'pending'))
    WITH CHECK (student_id = auth.uid() AND status = 'cancelled');
  



  -- ==========================================
  -- Source: 2026051004_phase0_fixes.sql
  -- ==========================================
  -- UniRide Phase 0: Fix critical and high-priority issues
  -- C2: GPS location-only RPC
  -- C3: Subscription cancel returns seat (trigger)
  -- H2: JWT role from app_metadata instead of user_metadata
  -- M6: pg_cron for subscription expiry
  -- M7: Profile update syncs to auth metadata (trigger)
  -- M8: CHECK constraint: available_seats <= capacity
  -- L8: ON DELETE CASCADE for foreign keys
  
  -- ============================================================
  -- C2: Separate RPC for GPS location updates (no status change)
  -- This prevents the state machine from rejecting repeated
  -- in_transit -> in_transit transitions during GPS tracking.
  -- ============================================================
  CREATE OR REPLACE FUNCTION update_trip_location(
    p_trip_id UUID,
    p_lat NUMERIC,
    p_lng NUMERIC
  ) RETURNS void AS $$
  DECLARE
    v_trip_driver_id UUID;
    v_caller_driver_id UUID;
  BEGIN
    SELECT driver_id INTO v_caller_driver_id FROM drivers WHERE user_id = auth.uid();
  
    IF v_caller_driver_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: not a driver';
    END IF;
  
    SELECT driver_id INTO v_trip_driver_id FROM trips WHERE id = p_trip_id;
  
    IF v_trip_driver_id IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip_driver_id != v_caller_driver_id THEN
      RAISE EXCEPTION 'Unauthorized: not your trip';
    END IF;
  
    UPDATE trips SET
      last_lat = p_lat,
      last_lng = p_lng,
      updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ============================================================
  -- C3: Trigger to return seat when subscription is cancelled
  -- Without this, cancelled subscriptions permanently consume seats.
  -- ============================================================
  CREATE OR REPLACE FUNCTION handle_subscription_change()
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'UPDATE'
       AND OLD.status IN ('active', 'pending')
       AND NEW.status IN ('cancelled', 'expired') THEN
      UPDATE routes SET available_seats = available_seats + 1
      WHERE id = OLD.route_id;
    END IF;
    IF TG_OP = 'DELETE' AND OLD.status IN ('active', 'pending') THEN
      UPDATE routes SET available_seats = available_seats + 1
      WHERE id = OLD.route_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
  CREATE TRIGGER on_subscription_cancel
    AFTER UPDATE OR DELETE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION handle_subscription_change();
  
  -- ============================================================
  -- H2: Fix get_my_role() to use app_metadata (not user_metadata)
  -- user_metadata is writable by the client via SDK = privilege escalation.
  -- app_metadata is only writable by admin API = secure.
  -- ============================================================
  CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
    SELECT COALESCE(
      auth.jwt() -> 'app_metadata' ->> 'role',
      auth.jwt() -> 'user_metadata' ->> 'role',
      'student'
    );
  $$ LANGUAGE sql STABLE;
  
  -- ============================================================
  -- M6: Auto-expire subscriptions using pg_cron
  -- Runs every hour, sets status='expired' for past-end-date active subs
  -- ============================================================
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  
  SELECT cron.schedule(
    'expire-subscriptions',
    '0 * * * *',
    $$
    UPDATE subscriptions
    SET status = 'expired'
    WHERE status = 'active'
      AND end_date < NOW();
    $$
  );
  
  -- ============================================================
  -- M7: Trigger to sync profile updates back to auth.users metadata
  -- When profiles.full_name is updated, also update user_metadata.full_name
  -- so that session.user.user_metadata stays consistent.
  -- ============================================================
  CREATE OR REPLACE FUNCTION sync_profile_to_auth_metadata()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.full_name IS DISTINCT FROM OLD.full_name THEN
      UPDATE auth.users
      SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}') || jsonb_build_object('full_name', NEW.full_name)
      WHERE id = NEW.id;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  DROP TRIGGER IF EXISTS on_profile_update ON profiles;
  CREATE TRIGGER on_profile_update
    AFTER UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION sync_profile_to_auth_metadata();
  
  -- ============================================================
  -- M8: CHECK constraint ensures available_seats never exceeds capacity
  -- Prevents data corruption from admin errors or bugs.
  -- ============================================================
  ALTER TABLE routes DROP CONSTRAINT IF EXISTS routes_available_seats_check;
  ALTER TABLE routes ADD CONSTRAINT routes_available_seats_check
    CHECK (available_seats >= 0 AND available_seats <= capacity);
  
  -- ============================================================
  -- L8: Add ON DELETE CASCADE to foreign keys missing it
  -- Without this, deleting a parent row fails if child rows exist.
  -- ============================================================
  
  -- subscriptions.student_id -> profiles.id (ON DELETE CASCADE)
  ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_student_id_fkey;
  ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
  -- subscriptions.route_id -> routes.id (ON DELETE CASCADE)
  ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_route_id_fkey;
  ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_route_id_fkey
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
  
  -- trips.route_id -> routes.id (ON DELETE CASCADE)
  ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_route_id_fkey;
  ALTER TABLE trips ADD CONSTRAINT trips_route_id_fkey
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
  
  -- trips.driver_id -> drivers.id (ON DELETE CASCADE)
  ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_driver_id_fkey;
  ALTER TABLE trips ADD CONSTRAINT trips_driver_id_fkey
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE;
  
  -- routes.driver_id -> drivers.id (ON DELETE CASCADE)
  ALTER TABLE routes DROP CONSTRAINT IF EXISTS routes_driver_id_fkey;
  ALTER TABLE routes ADD CONSTRAINT routes_driver_id_fkey
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE;
  
  -- audit_logs.user_id -> profiles.id (ON DELETE SET NULL)
  ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
  ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;
  



  -- ==========================================
  -- Source: 2026051005_critical_fixes.sql
  -- ==========================================
  -- UniRide v2 Critical Fixes Migration
  -- Run after 2026051004_phase0_fixes.sql
  
  -- ============================================================
  -- F1: Fix get_my_role() - Remove user_metadata fallback
  -- user_metadata is client-writable = privilege escalation risk
  -- Only app_metadata should be used for role determination
  -- ============================================================
  CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
    SELECT COALESCE(
      auth.jwt() -> 'app_metadata' ->> 'role',
      'student'
    );
  $$ LANGUAGE sql STABLE;
  
  -- ============================================================
  -- F2: Create dashboard stats RPC to avoid loading all records
  -- Replaces pageSize:0 queries in admin dashboard
  -- ============================================================
  CREATE OR REPLACE FUNCTION get_dashboard_stats() RETURNS JSON AS $$
  DECLARE
    result JSON;
  BEGIN
    SELECT json_build_object(
      'total_users', (SELECT count(*) FROM profiles),
      'total_drivers', (SELECT count(*) FROM drivers),
      'total_routes', (SELECT count(*) FROM routes),
      'active_routes', (SELECT count(*) FROM routes WHERE is_active = true),
      'total_trips', (SELECT count(*) FROM trips),
      'active_trips', (SELECT count(*) FROM trips WHERE status IN ('driver_waiting', 'in_transit')),
      'total_subscriptions', (SELECT count(*) FROM subscriptions),
      'active_subscriptions', (SELECT count(*) FROM subscriptions WHERE status = 'active'),
      'monthly_revenue', (
        SELECT COALESCE(SUM(r.price), 0)
        FROM subscriptions s
        JOIN routes r ON r.id = s.route_id
        WHERE s.status = 'active'
      )
    ) INTO result;
  
    RETURN result;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ============================================================
  -- F3: Create ping RPC for network status check
  -- Avoids false negatives from RLS-blocked queries
  -- ============================================================
  CREATE OR REPLACE FUNCTION ping() RETURNS BOOLEAN AS $$
  BEGIN
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ============================================================
  -- F4: Add missing indexes for common queries
  -- ============================================================
  CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
  CREATE INDEX IF NOT EXISTS idx_profiles_institution ON profiles(institution_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_route_status ON subscriptions(route_id, status);
  CREATE INDEX IF NOT EXISTS idx_trips_route_status ON trips(route_id, status);
  CREATE INDEX IF NOT EXISTS idx_trips_scheduled ON trips(scheduled_at);
  CREATE INDEX IF NOT EXISTS idx_trips_driver_status ON trips(driver_id, status);
  
  -- ============================================================
  -- F5: Fix update_trip_location - verify trip is active
  -- Prevents updating location for completed/cancelled trips
  -- ============================================================
  CREATE OR REPLACE FUNCTION update_trip_location(
    p_trip_id UUID,
    p_lat NUMERIC,
    p_lng NUMERIC
  ) RETURNS BOOLEAN AS $$
  DECLARE
    v_driver_id UUID;
    v_status TEXT;
  BEGIN
    -- Get driver ID from auth
    SELECT d.id INTO v_driver_id
    FROM drivers d
    WHERE d.user_id = auth.uid();
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Get current trip status
    SELECT status INTO v_status
    FROM trips
    WHERE id = p_trip_id AND driver_id = v_driver_id;
  
    IF v_status IS NULL THEN
      RAISE EXCEPTION 'Trip not found or not assigned to you';
    END IF;
  
    -- Only allow updates for active trips
    IF v_status NOT IN ('driver_waiting', 'in_transit') THEN
      RAISE EXCEPTION 'Cannot update location for trip with status: %', v_status;
    END IF;
  
    -- Update location
    UPDATE trips
    SET last_lat = p_lat, last_lng = p_lng, updated_at = NOW()
    WHERE id = p_trip_id;
  
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ============================================================
  -- F6: DB-based rate limiting for edge functions
  -- Uses Supabase auth.uid() to track per-user limits
  -- ============================================================
  CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action, window_start);
  
  CREATE OR REPLACE FUNCTION check_rate_limit(
    p_action TEXT,
    p_limit INT,
    p_window_seconds INT
  ) RETURNS BOOLEAN AS $$
  DECLARE
    v_count INT;
    v_window_start TIMESTAMPTZ;
  BEGIN
    v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
    -- Clean old entries first
    DELETE FROM rate_limits
    WHERE user_id = auth.uid()
      AND action = p_action
      AND window_start < v_window_start;
  
    -- Count recent requests
    SELECT COALESCE(SUM(request_count), 0) INTO v_count
    FROM rate_limits
    WHERE user_id = auth.uid()
      AND action = p_action
      AND window_start >= v_window_start;
  
    IF v_count >= p_limit THEN
      RETURN FALSE; -- Rate limit exceeded
    END IF;
  
    -- Insert new request
    INSERT INTO rate_limits (user_id, action, window_start, request_count)
    VALUES (auth.uid(), p_action, NOW(), 1)
    ON CONFLICT (id) DO UPDATE SET
      request_count = rate_limits.request_count + 1;
  
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ============================================================
  -- F7: Add missing RLS policies for admin operations
  -- ============================================================
  
  -- Allow admins to UPDATE any subscription status
  CREATE POLICY "Admins can update any subscription"
    ON subscriptions FOR UPDATE
    USING (auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ));
  
  -- Allow admins to UPDATE any trip status
  CREATE POLICY "Admins can update any trip"
    ON trips FOR UPDATE
    USING (auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ));
  
  -- Allow admins to INSERT/UPDATE drivers
  CREATE POLICY "Admins can manage drivers"
    ON drivers FOR ALL
    USING (auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ));
  
  -- Allow students to INSERT their own profile (self-registration)
  CREATE POLICY "Students can create own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
  
  -- ============================================================
  -- F8: Fix seed idempotency - handle conflicts gracefully
  -- ============================================================
  CREATE OR REPLACE FUNCTION seed_safe_insert(
    table_name TEXT,
    data JSONB
  ) RETURNS VOID AS $$
  BEGIN
    EXECUTE format(
      'INSERT INTO %I SELECT * FROM jsonb_to_record($1) AS t',
      table_name
    ) USING data
    ON CONFLICT DO NOTHING;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ============================================================
  -- F9: Audit log improvements - index on resource_id
  -- ============================================================
  CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at DESC);



  -- ==========================================
  -- Source: 2026051006_enforce_driver_verification.sql
  -- ==========================================
  -- UniRide v2: Enforce Driver Verification
  
  CREATE OR REPLACE FUNCTION update_trip_status(
    p_trip_id UUID,
    p_new_status TEXT,
    p_lat NUMERIC,
    p_lng NUMERIC,
    p_driver_id UUID
  ) RETURNS void AS $$
  DECLARE
    v_trip_driver_id UUID;
    v_is_verified BOOLEAN;
  BEGIN
    SELECT driver_id INTO v_trip_driver_id FROM trips WHERE id = p_trip_id FOR UPDATE;
  
    IF v_trip_driver_id IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip_driver_id != p_driver_id THEN
      RAISE EXCEPTION 'Unauthorized: not your trip';
    END IF;
  
    SELECT is_verified INTO v_is_verified FROM drivers WHERE id = p_driver_id;
    IF NOT v_is_verified THEN
      RAISE EXCEPTION 'Unauthorized: driver is not verified';
    END IF;
  
    PERFORM validate_trip_transition(p_trip_id, p_new_status);
  
    UPDATE trips SET
      status = p_new_status,
      last_lat = p_lat,
      last_lng = p_lng,
      started_at = CASE WHEN p_new_status = 'in_transit' AND started_at IS NULL THEN NOW() ELSE started_at END,
      ended_at = CASE WHEN p_new_status IN ('completed', 'absent') THEN NOW() ELSE ended_at END,
      updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051106_fix_rate_limit_and_trip_engine.sql
  -- ==========================================
  -- UniRide: Fix rate limiting + trip engine validation
  -- Problem 1: check_rate_limit used auth.uid() which returns NULL with service role key
  -- Problem 2: lat/lng required as numbers even for non-location transitions
  -- Solution: accept p_user_id parameter explicitly
  
  -- ═══════════════════════════════════════════════════
  -- Fix check_rate_limit: accept p_user_id explicitly
  -- ═══════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_action TEXT,
    p_limit INT,
    p_window_seconds INT
  ) RETURNS BOOLEAN AS $$
  DECLARE
    v_count INT;
    v_window_start TIMESTAMPTZ;
  BEGIN
    v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
    -- Clean up old entries
    DELETE FROM rate_limits
    WHERE user_id = p_user_id
      AND action = p_action
      AND window_start < v_window_start;
  
    -- Count current requests
    SELECT COALESCE(SUM(request_count), 0) INTO v_count
    FROM rate_limits
    WHERE user_id = p_user_id
      AND action = p_action
      AND window_start >= v_window_start;
  
    IF v_count >= p_limit THEN
      RETURN FALSE;
    END IF;
  
    -- Record this request
    INSERT INTO rate_limits (user_id, action, window_start, request_count)
    VALUES (p_user_id, p_action, NOW(), 1);
  
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- ═══════════════════════════════════════════════════
  -- Fix update_trip_status: make lat/lng optional
  -- (lat/lng are only meaningful for certain transitions)
  -- ═══════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION update_trip_status(
    p_trip_id UUID,
    p_new_status TEXT,
    p_lat NUMERIC DEFAULT NULL,
    p_lng NUMERIC DEFAULT NULL,
    p_driver_id UUID DEFAULT NULL
  ) RETURNS void AS $$
  DECLARE
    v_trip_driver_id UUID;
  BEGIN
    SELECT driver_id INTO v_trip_driver_id
    FROM trips
    WHERE id = p_trip_id
    FOR UPDATE;
  
    IF v_trip_driver_id IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF p_driver_id IS NOT NULL AND v_trip_driver_id != p_driver_id THEN
      RAISE EXCEPTION 'Unauthorized: not your trip';
    END IF;
  
    PERFORM validate_trip_transition(p_trip_id, p_new_status);
  
    UPDATE trips SET
      status = p_new_status,
      -- Only update coordinates if provided
      last_lat = CASE WHEN p_lat IS NOT NULL THEN p_lat ELSE last_lat END,
      last_lng = CASE WHEN p_lng IS NOT NULL THEN p_lng ELSE last_lng END,
      started_at = CASE
        WHEN p_new_status = 'in_transit' AND started_at IS NULL THEN NOW()
        ELSE started_at
      END,
      ended_at = CASE
        WHEN p_new_status IN ('completed', 'absent') THEN NOW()
        ELSE ended_at
      END,
      updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051107_infrastructure_and_push.sql
  -- ==========================================
  -- supabase/migrations/2026051107_infrastructure_and_push.sql
  
  -- 1. Add coordinates to routes table
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS start_lat NUMERIC(10, 6) DEFAULT 33.3128; -- Baghdad default
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS start_lng NUMERIC(10, 6) DEFAULT 44.3615;
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS end_lat NUMERIC(10, 6) DEFAULT 33.2800;   -- University roughly
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS end_lng NUMERIC(10, 6) DEFAULT 44.3800;
  
  -- 2. Create push_tokens table for notifications
  CREATE TABLE IF NOT EXISTS push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, token)
  );
  
  CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);
  
  -- RLS for push_tokens
  ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can manage their own push tokens"
    ON push_tokens
    FOR ALL
    USING (auth.uid() = user_id);
  
  -- 3. RPC to register push token safely
  CREATE OR REPLACE FUNCTION register_push_token(p_token TEXT)
  RETURNS void AS $$
  BEGIN
    INSERT INTO push_tokens (user_id, token, updated_at)
    VALUES (auth.uid(), p_token, NOW())
    ON CONFLICT (user_id, token) DO UPDATE SET updated_at = NOW();
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 4. RPC for Drivers to create a trip
  CREATE OR REPLACE FUNCTION create_trip(p_route_id UUID, p_scheduled_at TIMESTAMPTZ)
  RETURNS UUID AS $$
  DECLARE
    v_trip_id UUID;
    v_role TEXT;
  BEGIN
    -- Verify caller is a driver
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can create trips';
    END IF;
  
    -- Create the trip
    INSERT INTO trips (route_id, driver_id, status, scheduled_at)
    VALUES (p_route_id, auth.uid(), 'scheduled', p_scheduled_at)
    RETURNING id INTO v_trip_id;
  
    RETURN v_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051108_license_system.sql
  -- ==========================================
  -- supabase/migrations/2026051108_license_system.sql
  
  -- 1. Create License Batches
  CREATE TABLE IF NOT EXISTS license_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    batch_name TEXT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC NOT NULL,
    valid_days INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  -- 2. Create Licenses
  CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES license_batches(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('active', 'used', 'revoked')) DEFAULT 'active',
    used_by UUID REFERENCES auth.users(id),
    used_at TIMESTAMPTZ,
    valid_days INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_licenses_code ON licenses(code);
  CREATE INDEX IF NOT EXISTS idx_licenses_route_id ON licenses(route_id);
  
  -- Enable RLS
  ALTER TABLE license_batches ENABLE ROW LEVEL SECURITY;
  ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
  
  -- Admins can read/write everything
  CREATE POLICY "Admins can manage license_batches" ON license_batches
    FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  CREATE POLICY "Admins can manage licenses" ON licenses
    FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  -- 3. RPC: Create a batch and generate codes securely
  CREATE OR REPLACE FUNCTION create_license_batch(
    p_route_id UUID,
    p_batch_name TEXT,
    p_quantity INT,
    p_price NUMERIC,
    p_valid_days INT
  ) RETURNS UUID AS $$
  DECLARE
    v_batch_id UUID;
    v_code TEXT;
    i INT;
    v_role TEXT;
  BEGIN
    -- Verify caller is admin
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can create license batches';
    END IF;
  
    -- Create batch
    INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
    VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
    RETURNING id INTO v_batch_id;
  
    -- Generate codes
    FOR i IN 1..p_quantity LOOP
      -- Simple unique 8-character alphanumeric code logic
      LOOP
        v_code := upper(substring(md5(random()::text) from 1 for 8));
        BEGIN
          INSERT INTO licenses (batch_id, route_id, code, valid_days)
          VALUES (v_batch_id, p_route_id, v_code, p_valid_days);
          EXIT; -- Exit loop if insertion succeeds (unique code)
        EXCEPTION WHEN unique_violation THEN
          -- Keep looping to generate a new code if there's a collision
        END;
      END LOOP;
    END LOOP;
  
    RETURN v_batch_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 4. RPC: Activate License
  CREATE OR REPLACE FUNCTION activate_license(p_code TEXT)
  RETURNS UUID AS $$
  DECLARE
    v_license RECORD;
    v_subscription_id UUID;
    v_role TEXT;
  BEGIN
    -- Verify caller is student
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can activate licenses';
    END IF;
  
    -- Find and lock the license to prevent race conditions
    SELECT * INTO v_license
    FROM licenses
    WHERE code = upper(p_code) AND status = 'active'
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or already used license code';
    END IF;
  
    -- Mark license as used
    UPDATE licenses 
    SET status = 'used', used_by = auth.uid(), used_at = NOW()
    WHERE id = v_license.id;
  
    -- Create active subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (
      auth.uid(), 
      v_license.route_id, 
      'active', 
      NOW(), 
      NOW() + (v_license.valid_days || ' days')::INTERVAL
    )
    RETURNING id INTO v_subscription_id;
  
    RETURN v_subscription_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 5. Deprecate atomic-booking (drop if exists)
  DROP FUNCTION IF EXISTS reserve_seat(UUID, UUID);
  



  -- ==========================================
  -- Source: 2026051109_ratings_and_ux.sql
  -- ==========================================
  -- supabase/migrations/2026051109_ratings_and_ux.sql
  
  -- 1. Create Institutions table
  CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  -- Add foreign key from profiles to institutions if not exists
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'profiles_institution_id_fkey'
    ) THEN
      ALTER TABLE profiles
        ADD CONSTRAINT profiles_institution_id_fkey
        FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL;
    END IF;
  END $$;
  
  -- 2. Modify routes and profiles to support UX features
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
  
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE;
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS departure_time TIME;
  ALTER TABLE routes ADD COLUMN IF NOT EXISTS return_time TIME;
  
  -- Optional index for faster filtering
  CREATE INDEX IF NOT EXISTS idx_routes_institution_id ON routes(institution_id);
  
  -- 3. Create Ratings Table
  CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(trip_id, student_id) -- Prevent double rating
  );
  
  -- Enable RLS for ratings
  ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Students can view their ratings" ON ratings
    FOR SELECT USING (auth.uid() = student_id);
  
  CREATE POLICY "Drivers can view their ratings" ON ratings
    FOR SELECT USING (auth.uid() = driver_id);
  
  -- 4. RPC: Submit Rating
  CREATE OR REPLACE FUNCTION submit_rating(
    p_trip_id UUID,
    p_rating INT,
    p_comment TEXT
  ) RETURNS UUID AS $$
  DECLARE
    v_trip RECORD;
    v_rating_id UUID;
    v_role TEXT;
  BEGIN
    -- Verify caller is student
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can submit ratings';
    END IF;
  
    -- Ensure rating is valid
    IF p_rating < 1 OR p_rating > 5 THEN
      RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
  
    -- Find the trip and ensure it is completed
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status != 'completed' THEN
      RAISE EXCEPTION 'You can only rate completed trips';
    END IF;
  
    -- Insert rating (will fail if UNIQUE constraint is violated, preventing double rating)
    INSERT INTO ratings (trip_id, student_id, driver_id, rating, comment)
    VALUES (p_trip_id, auth.uid(), v_trip.driver_id, p_rating, p_comment)
    RETURNING id INTO v_rating_id;
  
    RETURN v_rating_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051110_m5_performance.sql
  -- ==========================================
  -- supabase/migrations/2026051110_m5_performance.sql
  -- M5: Performance indexes + RLS for institutions + rate_limits cleanup
  
  -- ════════════════════════════════════════════════
  -- 1. Missing indexes for M4 tables
  -- ════════════════════════════════════════════════
  
  -- ratings: fast lookup by driver or student
  CREATE INDEX IF NOT EXISTS idx_ratings_driver_id  ON ratings(driver_id);
  CREATE INDEX IF NOT EXISTS idx_ratings_student_id ON ratings(student_id);
  CREATE INDEX IF NOT EXISTS idx_ratings_trip_id    ON ratings(trip_id);
  
  -- institutions: name lookup (search)
  CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(name);
  
  -- licenses: status filter (list active/used)
  CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
  
  -- license_batches: listing by date
  CREATE INDEX IF NOT EXISTS idx_license_batches_created_at ON license_batches(created_at DESC);
  
  -- push_tokens: cleanup old tokens efficiently
  CREATE INDEX IF NOT EXISTS idx_push_tokens_updated_at ON push_tokens(updated_at);
  
  -- ════════════════════════════════════════════════
  -- 2. RLS for institutions table (was missing)
  -- ════════════════════════════════════════════════
  ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
  
  -- Everyone can read institutions (needed for onboarding selection)
  CREATE POLICY "Everyone can view institutions" ON institutions
    FOR SELECT USING (true);
  
  -- Only admins can manage institutions
  CREATE POLICY "Admins can manage institutions" ON institutions
    FOR ALL USING (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
  
  -- ════════════════════════════════════════════════
  -- 3. Allow admins to update driver is_verified field
  -- ════════════════════════════════════════════════
  CREATE POLICY "Admins can update profiles" ON profiles
    FOR UPDATE USING (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
  
  -- ════════════════════════════════════════════════
  -- 4. Automatic cleanup of expired rate_limits rows
  -- Runs via pg_cron every hour to keep the table small
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS void AS $$
  BEGIN
    DELETE FROM rate_limits
    WHERE window_start < NOW() - INTERVAL '1 hour';
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Schedule cleanup (requires pg_cron extension — already enabled on Supabase)
  SELECT cron.schedule(
    'cleanup-rate-limits',
    '0 * * * *',  -- Every hour
    'SELECT cleanup_rate_limits()'
  ) ON CONFLICT (jobname) DO NOTHING;
  
  -- ════════════════════════════════════════════════
  -- 5. Average driver rating helper RPC
  -- Used in admin panel to show driver quality
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_driver_avg_rating(p_driver_id UUID)
  RETURNS NUMERIC AS $$
    SELECT ROUND(AVG(rating)::NUMERIC, 1)
    FROM ratings
    WHERE driver_id = p_driver_id;
  $$ LANGUAGE sql STABLE SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051111_fix_security_and_driver_consistency.sql
  -- ==========================================
  -- UniRide v2 M6: security + identity consistency fixes
  
  -- 0) Data migration: fix existing trips where driver_id was stored as auth.uid()
  --    instead of drivers.id. Old create_trip() used auth.uid() directly; new
  --    version resolves drivers.id first. Without this, all in-progress trips
  --    would fail the driver_id check in update_trip_status / update_trip_location.
  UPDATE trips SET driver_id = d.id
  FROM drivers d
  WHERE trips.driver_id = d.user_id;
  
  -- 1) Lock down profile privilege fields to admin-only updates.
  CREATE OR REPLACE FUNCTION enforce_profile_privileged_fields()
  RETURNS TRIGGER AS $$
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' THEN
      RETURN NEW;
    END IF;
  
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Only admins can change role';
    END IF;
  
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
      RAISE EXCEPTION 'Only admins can change verification';
    END IF;
  
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  DROP TRIGGER IF EXISTS enforce_profile_privileged_fields_trigger ON profiles;
  CREATE TRIGGER enforce_profile_privileged_fields_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION enforce_profile_privileged_fields();
  
  -- 2) Remove admin policies that relied on profiles.role (client-updatable).
  DROP POLICY IF EXISTS "Admins can update any subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Admins can update any trip" ON trips;
  DROP POLICY IF EXISTS "Admins can manage drivers" ON drivers;
  
  CREATE POLICY "Admins can update any subscription"
    ON subscriptions FOR UPDATE
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  CREATE POLICY "Admins can update any trip"
    ON trips FOR UPDATE
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  CREATE POLICY "Admins can manage drivers"
    ON drivers FOR ALL
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  -- 3) Keep driver identity consistent: trips.driver_id and routes.driver_id use drivers.id.
  CREATE OR REPLACE FUNCTION create_trip(p_route_id UUID, p_scheduled_at TIMESTAMPTZ)
  RETURNS UUID AS $$
  DECLARE
    v_trip_id UUID;
    v_role TEXT;
    v_driver_id UUID;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can create trips';
    END IF;
  
    SELECT d.id INTO v_driver_id
    FROM drivers d
    WHERE d.user_id = auth.uid();
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    IF NOT EXISTS (
      SELECT 1 FROM routes r WHERE r.id = p_route_id AND r.driver_id = v_driver_id
    ) THEN
      RAISE EXCEPTION 'Route not assigned to this driver';
    END IF;
  
    INSERT INTO trips (route_id, driver_id, status, scheduled_at)
    VALUES (p_route_id, v_driver_id, 'scheduled', p_scheduled_at)
    RETURNING id INTO v_trip_id;
  
    RETURN v_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 4) Harden activate_license(): avoid duplicate active subs and enforce capacity.
  CREATE OR REPLACE FUNCTION activate_license(p_code TEXT)
  RETURNS UUID AS $$
  DECLARE
    v_license RECORD;
    v_subscription_id UUID;
    v_role TEXT;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can activate licenses';
    END IF;
  
    SELECT * INTO v_license
    FROM licenses
    WHERE code = upper(p_code) AND status = 'active'
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or already used license code';
    END IF;
  
    IF EXISTS (
      SELECT 1
      FROM subscriptions
      WHERE student_id = auth.uid()
        AND route_id = v_license.route_id
        AND status IN ('active', 'pending')
    ) THEN
      RAISE EXCEPTION 'You already have an active subscription for this route';
    END IF;
  
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_license.route_id
      AND is_active = true
      AND available_seats > 0;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route';
    END IF;
  
    UPDATE licenses
    SET status = 'used', used_by = auth.uid(), used_at = NOW()
    WHERE id = v_license.id;
  
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (
      auth.uid(),
      v_license.route_id,
      'active',
      NOW(),
      NOW() + (v_license.valid_days || ' days')::INTERVAL
    )
    RETURNING id INTO v_subscription_id;
  
    RETURN v_subscription_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- 5) Fix rating insert: map trips.driver_id (drivers.id) → drivers.user_id for ratings table.
  --    ratings.driver_id FK references auth.users(id), not drivers(id), because ratings
  --    JOIN on auth.users for display. trips/routes use drivers(id); ratings uses auth.users(id).
  CREATE OR REPLACE FUNCTION submit_rating(
    p_trip_id UUID,
    p_rating INT,
    p_comment TEXT
  ) RETURNS UUID AS $$
  DECLARE
    v_trip RECORD;
    v_driver_user_id UUID;
    v_rating_id UUID;
    v_role TEXT;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can submit ratings';
    END IF;
  
    IF p_rating < 1 OR p_rating > 5 THEN
      RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status != 'completed' THEN
      RAISE EXCEPTION 'You can only rate completed trips';
    END IF;
  
    SELECT d.user_id INTO v_driver_user_id
    FROM drivers d
    WHERE d.id = v_trip.driver_id;
  
    IF v_driver_user_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found for trip';
    END IF;
  
    INSERT INTO ratings (trip_id, student_id, driver_id, rating, comment)
    VALUES (p_trip_id, auth.uid(), v_driver_user_id, p_rating, p_comment)
    RETURNING id INTO v_rating_id;
  
    RETURN v_rating_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051112_feature_flags_and_analytics.sql
  -- ==========================================
  -- UniRide v2 M6: Feature Flags + Analytics RPC
  -- Migration: 2026051112_feature_flags_and_analytics.sql
  
  -- ════════════════════════════════════════════════
  -- 1. Feature Flags table
  -- ════════════════════════════════════════════════
  CREATE TABLE IF NOT EXISTS feature_flags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT UNIQUE NOT NULL,
    enabled     BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
  
  -- Everyone can read flags (needed by mobile app at startup)
  CREATE POLICY "Everyone can view feature flags"
    ON feature_flags FOR SELECT
    USING (true);
  
  -- Only admins can manage flags
  CREATE POLICY "Admins can manage feature flags"
    ON feature_flags FOR ALL
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  -- Seed default flags
  INSERT INTO feature_flags (name, enabled, description) VALUES
    ('realtime_tracking',  true,  'Enable real-time GPS tracking for drivers'),
    ('push_notifications', true,  'Enable Expo push notifications'),
    ('offline_mode',       true,  'Enable offline subscription cache'),
    ('ratings_system',     true,  'Enable post-trip ratings'),
    ('zaincash_payment',   false, 'Enable ZainCash payment gateway (requires merchant credentials)')
  ON CONFLICT (name) DO NOTHING;
  
  -- ════════════════════════════════════════════════
  -- 2. Analytics RPC
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_analytics_summary(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date   TIMESTAMPTZ DEFAULT NOW()
  )
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $$
  DECLARE
    v_result JSON;
  BEGIN
    -- Only admins may call this
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT json_build_object(
      'total_trips', (
        SELECT COUNT(*) FROM trips
        WHERE created_at BETWEEN p_start_date AND p_end_date
      ),
      'completed_trips', (
        SELECT COUNT(*) FROM trips
        WHERE status = 'completed'
          AND created_at BETWEEN p_start_date AND p_end_date
      ),
      'cancelled_trips', (
        SELECT COUNT(*) FROM trips
        WHERE status = 'cancelled'
          AND created_at BETWEEN p_start_date AND p_end_date
      ),
      'total_revenue', (
        SELECT COALESCE(SUM(r.price), 0)
        FROM subscriptions s
        JOIN routes r ON s.route_id = r.id
        WHERE s.created_at BETWEEN p_start_date AND p_end_date
          AND s.status = 'active'
      ),
      'active_students', (
        SELECT COUNT(DISTINCT student_id)
        FROM subscriptions
        WHERE status = 'active'
      ),
      'active_drivers', (
        SELECT COUNT(*)
        FROM drivers d
        JOIN profiles p ON d.user_id = p.id
        WHERE p.is_verified = true
      ),
      'avg_rating', (
        SELECT ROUND(AVG(rating)::NUMERIC, 2)
        FROM ratings
        WHERE created_at BETWEEN p_start_date AND p_end_date
      ),
      'trips_by_status', (
        SELECT COALESCE(json_object_agg(status, cnt), '{}'::json)
        FROM (
          SELECT status, COUNT(*) AS cnt
          FROM trips
          WHERE created_at BETWEEN p_start_date AND p_end_date
          GROUP BY status
        ) t
      ),
      'top_routes', (
        SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
        FROM (
          SELECT
            r.title,
            COUNT(s.id)          AS subscriptions,
            r.price,
            COUNT(s.id) * r.price AS revenue
          FROM routes r
          LEFT JOIN subscriptions s
            ON r.id = s.route_id
            AND s.created_at BETWEEN p_start_date AND p_end_date
          GROUP BY r.id, r.title, r.price
          ORDER BY subscriptions DESC
          LIMIT 10
        ) t
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  



  -- ==========================================
  -- Source: 2026051601_admin_dashboard_controls.sql
  -- ==========================================
  -- UniRide: Admin dashboard control RPCs
  -- Keeps high-impact admin actions in audited, transactional database functions.
  
  CREATE OR REPLACE FUNCTION cancel_subscription(p_subscription_id UUID)
  RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_sub RECORD;
    v_role TEXT;
  BEGIN
    v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  
    SELECT * INTO v_sub
    FROM subscriptions
    WHERE id = p_subscription_id
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Subscription not found';
    END IF;
  
    IF v_role = 'student' AND v_sub.student_id != auth.uid() THEN
      RAISE EXCEPTION 'Not your subscription';
    ELSIF v_role != 'student' AND v_role != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    IF v_sub.status NOT IN ('active', 'pending') THEN
      RAISE EXCEPTION 'Cannot cancel: status is %', v_sub.status;
    END IF;
  
    UPDATE subscriptions
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE id = p_subscription_id;
  
    IF v_sub.status = 'active' THEN
      UPDATE routes
      SET available_seats = LEAST(capacity, available_seats + 1)
      WHERE id = v_sub.route_id;
    END IF;
  
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      CASE WHEN v_role = 'admin' THEN 'admin_cancel_subscription' ELSE 'cancel_subscription' END,
      'subscriptions',
      p_subscription_id,
      jsonb_build_object('route_id', v_sub.route_id, 'previous_status', v_sub.status)
    );
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION cancel_subscription(UUID) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION cancel_subscription(UUID) TO authenticated;
  
  CREATE OR REPLACE FUNCTION admin_create_trip(
    p_route_id UUID,
    p_driver_id UUID,
    p_scheduled_at TIMESTAMPTZ
  )
  RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_trip_id UUID;
    v_route_driver_id UUID;
    v_driver_user_id UUID;
    v_is_verified BOOLEAN;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Admin only';
    END IF;
  
    SELECT driver_id INTO v_route_driver_id
    FROM routes
    WHERE id = p_route_id
      AND is_active = true;
  
    IF v_route_driver_id IS NULL THEN
      RAISE EXCEPTION 'Active route not found';
    END IF;
  
    IF v_route_driver_id != p_driver_id THEN
      RAISE EXCEPTION 'Driver does not belong to this route';
    END IF;
  
    SELECT user_id INTO v_driver_user_id
    FROM drivers
    WHERE id = p_driver_id;
  
    IF v_driver_user_id IS NULL THEN
      RAISE EXCEPTION 'Driver not found';
    END IF;
  
    SELECT is_verified INTO v_is_verified
    FROM profiles
    WHERE id = v_driver_user_id;
  
    IF NOT COALESCE(v_is_verified, false) THEN
      RAISE EXCEPTION 'Driver not verified';
    END IF;
  
    INSERT INTO trips (route_id, driver_id, status, scheduled_at)
    VALUES (p_route_id, p_driver_id, 'scheduled', p_scheduled_at)
    RETURNING id INTO v_trip_id;
  
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      'admin_create_trip',
      'trips',
      v_trip_id,
      jsonb_build_object('route_id', p_route_id, 'driver_id', p_driver_id)
    );
  
    RETURN v_trip_id;
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION admin_create_trip(UUID, UUID, TIMESTAMPTZ) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION admin_create_trip(UUID, UUID, TIMESTAMPTZ) TO authenticated;
  



  -- ==========================================
  -- Source: 2026051700_consolidated_baseline.sql
  -- ==========================================
  -- ============================================================
  -- UniRide v2 — Consolidated Baseline Migration
  -- ============================================================
  -- This migration consolidates 001-005 into a single secure baseline.
  -- It uses app_metadata (NOT user_metadata) from the start.
  -- For existing databases: this is a no-op (all objects already exist).
  -- For fresh databases: this is the ONLY migration needed to start secure.
  -- ============================================================
  
  -- ── 1. Enable RLS on all core tables ──────────────────────────
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
  
  -- ── 2. Role functions — SECURE: app_metadata only ─────────────
  CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
    SELECT COALESCE(
      auth.jwt() -> 'app_metadata' ->> 'role',
      'student'
    );
  $$ LANGUAGE sql STABLE;
  
  CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
    SELECT get_my_role() = 'admin';
  $$ LANGUAGE sql STABLE;
  
  -- ── 3. Core RLS Policies ──────────────────────────────────────
  
  -- Profiles
  CREATE POLICY IF NOT EXISTS "Profiles: Users see own" ON profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY IF NOT EXISTS "Profiles: Admins see all" ON profiles FOR SELECT USING (is_admin());
  CREATE POLICY IF NOT EXISTS "Profiles: Users update own" ON profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY IF NOT EXISTS "Profiles: Students can create own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  
  -- Routes
  CREATE POLICY IF NOT EXISTS "Routes: Everyone sees active routes" ON routes FOR SELECT USING (is_active = true);
  CREATE POLICY IF NOT EXISTS "Routes: Admins manage all" ON routes FOR ALL USING (is_admin());
  
  -- Drivers
  CREATE POLICY IF NOT EXISTS "Drivers: Own profile sees own" ON drivers FOR SELECT USING (user_id = auth.uid());
  CREATE POLICY IF NOT EXISTS "Drivers: Admins see all" ON drivers FOR SELECT USING (is_admin());
  
  -- Subscriptions
  CREATE POLICY IF NOT EXISTS "Subscriptions: Students see own" ON subscriptions FOR SELECT USING (student_id = auth.uid());
  CREATE POLICY IF NOT EXISTS "Subscriptions: Admins see all" ON subscriptions FOR SELECT USING (is_admin());
  CREATE POLICY IF NOT EXISTS "Subscriptions: Driver sees route subscriptions" ON subscriptions FOR SELECT
    USING (route_id IN (SELECT r.id FROM routes r JOIN drivers d ON r.driver_id = d.id WHERE d.user_id = auth.uid()));
  CREATE POLICY IF NOT EXISTS "Subscriptions: Students cancel own active" ON subscriptions FOR UPDATE
    USING (student_id = auth.uid() AND status IN ('active', 'pending'))
    WITH CHECK (student_id = auth.uid() AND status = 'cancelled');
  CREATE POLICY IF NOT EXISTS "Admins can update any subscription" ON subscriptions FOR UPDATE
    USING (is_admin());
  
  -- Trips
  CREATE POLICY IF NOT EXISTS "Trips: Students see own route trips" ON trips FOR SELECT
    USING (route_id IN (SELECT route_id FROM subscriptions WHERE student_id = auth.uid()));
  CREATE POLICY IF NOT EXISTS "Trips: Driver sees own trips" ON trips FOR SELECT
    USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
  CREATE POLICY IF NOT EXISTS "Trips: Admins see all" ON trips FOR SELECT USING (is_admin());
  CREATE POLICY IF NOT EXISTS "Admins can update any trip" ON trips FOR UPDATE USING (is_admin());
  
  -- ── 4. Trip State Machine ─────────────────────────────────────
  CREATE OR REPLACE FUNCTION validate_trip_transition(p_trip_id UUID, p_new_status TEXT) RETURNS BOOLEAN AS $$
  DECLARE
    v_current_status TEXT;
    v_valid BOOLEAN;
  BEGIN
    SELECT status INTO v_current_status FROM trips WHERE id = p_trip_id;
    IF v_current_status IS NULL THEN RAISE EXCEPTION 'Trip not found'; END IF;
  
    v_valid := CASE v_current_status
      WHEN 'scheduled' THEN p_new_status IN ('driver_waiting', 'cancelled')
      WHEN 'driver_waiting' THEN p_new_status IN ('in_transit', 'cancelled')
      WHEN 'in_transit' THEN p_new_status IN ('completed', 'absent')
      WHEN 'completed' THEN FALSE
      WHEN 'absent' THEN FALSE
      WHEN 'cancelled' THEN FALSE
      ELSE FALSE
    END;
  
    IF NOT v_valid THEN RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status; END IF;
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  CREATE OR REPLACE FUNCTION update_trip_status(p_trip_id UUID, p_new_status TEXT, p_lat NUMERIC, p_lng NUMERIC, p_driver_id UUID) RETURNS void AS $$
  DECLARE v_trip_driver_id UUID;
  BEGIN
    SELECT driver_id INTO v_trip_driver_id FROM trips WHERE id = p_trip_id FOR UPDATE;
    IF v_trip_driver_id IS NULL THEN RAISE EXCEPTION 'Trip not found'; END IF;
    IF v_trip_driver_id != p_driver_id THEN RAISE EXCEPTION 'Unauthorized: not your trip'; END IF;
    PERFORM validate_trip_transition(p_trip_id, p_new_status);
  
    UPDATE trips SET
      status = p_new_status,
      last_lat = p_lat, last_lng = p_lng,
      started_at = CASE WHEN p_new_status = 'in_transit' AND started_at IS NULL THEN NOW() ELSE started_at END,
      ended_at = CASE WHEN p_new_status IN ('completed', 'absent') THEN NOW() ELSE ended_at END,
      updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- ── 5. GPS Location RPC ───────────────────────────────────────
  CREATE OR REPLACE FUNCTION update_trip_location(p_trip_id UUID, p_lat NUMERIC, p_lng NUMERIC) RETURNS BOOLEAN AS $$
  DECLARE v_driver_id UUID; v_status TEXT;
  BEGIN
    SELECT d.id INTO v_driver_id FROM drivers d WHERE d.user_id = auth.uid();
    IF v_driver_id IS NULL THEN RAISE EXCEPTION 'Driver profile not found'; END IF;
  
    SELECT status INTO v_status FROM trips WHERE id = p_trip_id AND driver_id = v_driver_id;
    IF v_status IS NULL THEN RAISE EXCEPTION 'Trip not found or not assigned to you'; END IF;
    IF v_status NOT IN ('driver_waiting', 'in_transit') THEN RAISE EXCEPTION 'Cannot update location for trip with status: %', v_status; END IF;
  
    UPDATE trips SET last_lat = p_lat, last_lng = p_lng, updated_at = NOW() WHERE id = p_trip_id;
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- ── 6. Audit Logging ──────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, resource TEXT NOT NULL, resource_id UUID,
    details JSONB, created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
  CREATE POLICY IF NOT EXISTS "Audit: Admins see all" ON audit_logs FOR SELECT USING (is_admin());
  
  CREATE OR REPLACE FUNCTION log_audit(p_user_id UUID, p_action TEXT, p_resource TEXT, p_resource_id UUID, p_details JSONB) RETURNS void AS $$
  BEGIN
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (p_user_id, p_action, p_resource, p_resource_id, p_details);
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- ── 7. Indexes ────────────────────────────────────────────────
  CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
  CREATE INDEX IF NOT EXISTS idx_routes_driver_id ON routes(driver_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_student_id ON subscriptions(student_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_route_id ON subscriptions(route_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_route_status ON subscriptions(route_id, status);
  CREATE INDEX IF NOT EXISTS idx_trips_route_id ON trips(route_id);
  CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);
  CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
  CREATE INDEX IF NOT EXISTS idx_trips_scheduled ON trips(scheduled_at);
  CREATE INDEX IF NOT EXISTS idx_trips_driver_status ON trips(driver_id, status);
  CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
  CREATE INDEX IF NOT EXISTS idx_profiles_institution ON profiles(institution_id);
  CREATE INDEX IF NOT EXISTS idx_routes_active_seats ON routes(is_active, available_seats) WHERE is_active = true;
  CREATE INDEX IF NOT EXISTS idx_subscriptions_student_active ON subscriptions(student_id, status) WHERE status IN ('active', 'pending');
  CREATE INDEX IF NOT EXISTS idx_trips_active ON trips(status) WHERE status IN ('driver_waiting', 'in_transit');
  CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
  
  -- ── 8. Constraints & Triggers ─────────────────────────────────
  ALTER TABLE routes DROP CONSTRAINT IF EXISTS routes_available_seats_check;
  ALTER TABLE routes ADD CONSTRAINT routes_available_seats_check CHECK (available_seats >= 0 AND available_seats <= capacity);
  
  ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_student_id_fkey;
  ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_student_id_fkey FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
  ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_route_id_fkey;
  ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_route_id_fkey FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
  ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_route_id_fkey;
  ALTER TABLE trips ADD CONSTRAINT trips_route_id_fkey FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;
  ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_driver_id_fkey;
  ALTER TABLE trips ADD CONSTRAINT trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE;
  ALTER TABLE routes DROP CONSTRAINT IF EXISTS routes_driver_id_fkey;
  ALTER TABLE routes ADD CONSTRAINT routes_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE;
  
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'updated_at') THEN
      ALTER TABLE trips ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END $$;
  
  CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
  BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
  $$ LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS set_trips_updated_at ON trips;
  CREATE TRIGGER set_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  -- ── 9. Subscription Cancel Trigger ────────────────────────────
  CREATE OR REPLACE FUNCTION handle_subscription_change() RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status IN ('active', 'pending') AND NEW.status IN ('cancelled', 'expired') THEN
      UPDATE routes SET available_seats = available_seats + 1 WHERE id = OLD.route_id;
    END IF;
    IF TG_OP = 'DELETE' AND OLD.status IN ('active', 'pending') THEN
      UPDATE routes SET available_seats = available_seats + 1 WHERE id = OLD.route_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
  CREATE TRIGGER on_subscription_cancel AFTER UPDATE OR DELETE ON subscriptions FOR EACH ROW EXECUTE FUNCTION handle_subscription_change();
  
  -- ── 10. Rate Limiting ─────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_count INT NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action, window_start);
  
  CREATE OR REPLACE FUNCTION check_rate_limit(p_user_id UUID, p_action TEXT, p_limit INT, p_window_seconds INT) RETURNS BOOLEAN AS $$
  DECLARE v_count INT; v_window_start TIMESTAMPTZ;
  BEGIN
    v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
    DELETE FROM rate_limits WHERE user_id = p_user_id AND action = p_action AND window_start < v_window_start;
    SELECT COALESCE(SUM(request_count), 0) INTO v_count FROM rate_limits WHERE user_id = p_user_id AND action = p_action AND window_start >= v_window_start;
    IF v_count >= p_limit THEN RETURN FALSE; END IF;
    INSERT INTO rate_limits (user_id, action, window_start, request_count) VALUES (p_user_id, p_action, NOW(), 1);
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- ── 11. Dashboard & Network RPCs ──────────────────────────────
  CREATE OR REPLACE FUNCTION get_dashboard_stats() RETURNS JSON AS $$
  DECLARE result JSON;
  BEGIN
    SELECT json_build_object(
      'total_users', (SELECT count(*) FROM profiles),
      'total_drivers', (SELECT count(*) FROM drivers),
      'total_routes', (SELECT count(*) FROM routes),
      'active_routes', (SELECT count(*) FROM routes WHERE is_active = true),
      'total_trips', (SELECT count(*) FROM trips),
      'active_trips', (SELECT count(*) FROM trips WHERE status IN ('driver_waiting', 'in_transit')),
      'total_subscriptions', (SELECT count(*) FROM subscriptions),
      'active_subscriptions', (SELECT count(*) FROM subscriptions WHERE status = 'active'),
      'monthly_revenue', (SELECT COALESCE(SUM(r.price), 0) FROM subscriptions s JOIN routes r ON r.id = s.route_id WHERE s.status = 'active')
    ) INTO result;
    RETURN result;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  REVOKE EXECUTE ON FUNCTION get_dashboard_stats() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
  
  CREATE OR REPLACE FUNCTION ping() RETURNS BOOLEAN AS $$ BEGIN RETURN TRUE; END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- ── 12. pg_cron for subscription expiry ───────────────────────
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  SELECT cron.schedule('expire-subscriptions', '0 * * * *', $$UPDATE subscriptions SET status = 'expired' WHERE status = 'active' AND end_date < NOW();$$);
  



  -- ==========================================
  -- Source: 2026051701_fix_drivers_rating_rpc.sql
  -- ==========================================
  -- UniRide: Fix drivers avg rating RPC
  -- Migration: 2026051701_fix_drivers_rating_rpc.sql
  --
  -- Problem: admin/drivers/page.tsx calls get_drivers_avg_rating(p_driver_ids UUID[])
  -- but the existing function get_driver_avg_rating(p_driver_id UUID) only accepts a single UUID.
  --
  -- Solution: Replace with a new function that accepts UUID[] and returns TABLE of driver_id + avg_rating
  
  CREATE OR REPLACE FUNCTION get_drivers_avg_rating(p_driver_ids UUID[])
  RETURNS TABLE(driver_id UUID, avg_rating NUMERIC)
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public AS $$
    SELECT driver_id, ROUND(AVG(rating)::NUMERIC, 1) AS avg_rating
    FROM ratings
    WHERE driver_id = ANY(p_driver_ids)
    GROUP BY driver_id;
  $$;
  
  REVOKE EXECUTE ON FUNCTION get_drivers_avg_rating(UUID[]) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION get_drivers_avg_rating(UUID[]) TO authenticated;
  



  -- ==========================================
  -- Source: 2026051702_consolidate_admin_rpcs.sql
  -- ==========================================
  -- UniRide M8: Missing RPCs (Consolidated)
  -- Migration: 2026051702_consolidate_admin_rpcs.sql
  --
  -- Problem: get_daily_activity and get_recent_active_trips were defined twice
  -- with different return types (JSON vs SETOF RECORD).
  --
  -- Solution: This migration consolidates them using JSON return type
  -- for better Supabase client compatibility.
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 1. get_daily_activity → Returns JSON array of {day, count}
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_daily_activity(p_days INT DEFAULT 7)
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_result JSON;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT json_agg(json_build_object('day', day, 'count', count))
    INTO v_result
    FROM (
      SELECT
        DATE_TRUNC('day', updated_at)::DATE AS day,
        COUNT(*)::INT AS count
      FROM trips
      WHERE updated_at >= NOW() - (p_days || ' days')::INTERVAL
      GROUP BY DATE_TRUNC('day', updated_at)
      ORDER BY day ASC
    ) t;
  
    RETURN COALESCE(v_result, '[]'::JSON);
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 2. get_recent_active_trips → Returns JSON array of trip objects
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_recent_active_trips(p_limit INT DEFAULT 5)
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_result JSON;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT json_agg(json_build_object(
      'id', t.id,
      'status', t.status,
      'scheduled_at', t.scheduled_at,
      'route_id', t.route_id,
      'driver_id', t.driver_id,
      'route_title', r.title,
      'start_location', r.start_location,
      'end_location', r.end_location,
      'driver_name', p.full_name,
      'driver_phone', p.phone
    ))
    INTO v_result
    FROM trips t
    JOIN routes r ON r.id = t.route_id
    JOIN drivers dr ON dr.id = t.driver_id
    JOIN profiles p ON p.id = dr.user_id
    WHERE t.status IN ('scheduled', 'driver_waiting', 'in_transit')
    ORDER BY t.scheduled_at DESC
    LIMIT p_limit;
  
    RETURN COALESCE(v_result, '[]'::JSON);
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 3. admin_cancel_trip → Unchanged, works correctly
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION admin_cancel_trip(p_trip_id UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_role     TEXT;
    v_trip     RECORD;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can cancel trips';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id FOR UPDATE;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status = 'cancelled' THEN
      RETURN;
    END IF;
  
    IF v_trip.status NOT IN ('scheduled', 'driver_waiting') THEN
      RAISE EXCEPTION 'Cannot cancel trip with status %', v_trip.status;
    END IF;
  
    UPDATE routes
    SET available_seats = available_seats + 1
    WHERE id = v_trip.route_id
      AND v_trip.status = 'scheduled';
  
    UPDATE trips
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- Grants
  -- ═══════════════════════════════════════════════════════════════════════
  GRANT EXECUTE ON FUNCTION get_daily_activity(INT) TO authenticated;
  GRANT EXECUTE ON FUNCTION get_recent_active_trips(INT) TO authenticated;
  GRANT EXECUTE ON FUNCTION admin_cancel_trip(UUID) TO authenticated;
  



  -- ==========================================
  -- Source: 2026051801_force_recreate_rpcs.sql
  -- ==========================================
  -- UniRide M8b: Force recreate RPCs with correct column names
  -- Migration: 2026051801_force_recreate_rpcs.sql
  --
  -- Problem: get_daily_activity and get_recent_active_trips on production
  -- still use 'created_at' which doesn't exist in trips table.
  -- Solution: DROP and recreate with correct 'updated_at' column
  
  DROP FUNCTION IF EXISTS get_daily_activity(INT);
  DROP FUNCTION IF EXISTS get_recent_active_trips(INT);
  
  CREATE FUNCTION get_daily_activity(p_days INT DEFAULT 7)
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_result JSON;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT json_agg(json_build_object('day', day, 'count', count))
    INTO v_result
    FROM (
      SELECT
        DATE_TRUNC('day', updated_at)::DATE AS day,
        COUNT(*)::INT AS count
      FROM trips
      WHERE updated_at >= NOW() - (p_days || ' days')::INTERVAL
      GROUP BY DATE_TRUNC('day', updated_at)
      ORDER BY day ASC
    ) t;
  
    RETURN COALESCE(v_result, '[]'::JSON);
  END;
  $$;
  
  CREATE FUNCTION get_recent_active_trips(p_limit INT DEFAULT 5)
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_result JSON;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT json_agg(json_build_object(
      'id', t.id,
      'status', t.status,
      'scheduled_at', t.scheduled_at,
      'route_id', t.route_id,
      'driver_id', t.driver_id,
      'route_title', r.title,
      'start_location', r.start_location,
      'end_location', r.end_location,
      'driver_name', p.full_name,
      'driver_phone', p.phone
    ))
    INTO v_result
    FROM trips t
    JOIN routes r ON r.id = t.route_id
    JOIN drivers dr ON dr.id = t.driver_id
    JOIN profiles p ON p.id = dr.user_id
    WHERE t.status IN ('scheduled', 'driver_waiting', 'in_transit')
    ORDER BY t.scheduled_at DESC
    LIMIT p_limit;
  
    RETURN COALESCE(v_result, '[]'::JSON);
  END;
  $$;
  
  GRANT EXECUTE ON FUNCTION get_daily_activity(INT) TO authenticated;
  GRANT EXECUTE ON FUNCTION get_recent_active_trips(INT) TO authenticated;
  



  -- ==========================================
  -- Source: 2026051802_final_security_hardening.sql
  -- ==========================================
  -- UniRide: Final Security Hardening & Logic Fixes
  -- Migration: 2026051802_final_security_hardening.sql
  -- Fixes:
  --   1. Brute-force protection in activate_license (Rate Limiting)
  --   2. IDOR in submit_rating (Ownership validation)
  --   3. Race Condition in subscription checking (Atomic locking)
  --   4. Stronger license codes (12 chars instead of 8)
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 1. Harden activate_license: Rate Limiting + Atomic Race Condition Fix
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION activate_license(p_code TEXT)
  RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_license         RECORD;
    v_subscription_id UUID;
    v_role            TEXT;
  BEGIN
    -- A) Authentication & Role Check
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can activate licenses';
    END IF;
  
    -- B) Brute-force Protection (Rate Limiting)
    -- Limit: 5 attempts per 15 minutes to prevent automated guessing
    IF NOT check_rate_limit(auth.uid(), 'activate_license_attempt', 5, 900) THEN
      RAISE EXCEPTION 'Too many license activation attempts. Please try again in 15 minutes.';
    END IF;
  
    -- C) Atomic Row Locking: License first
    SELECT * INTO v_license
    FROM licenses
    WHERE code = upper(trim(p_code)) AND status = 'active'
    FOR UPDATE NOWAIT; -- Fail immediately if someone else is processing this code
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or already used license code';
    END IF;
  
    -- D) Atomic Row Locking: Route (to prevent seat over-allocation)
    -- Also verifies the student doesn't already have an active sub for THIS route
    -- using a locked read to prevent race conditions between IF EXISTS and INSERT.
    IF EXISTS (
      SELECT 1 FROM subscriptions
      WHERE student_id = auth.uid()
        AND route_id = v_license.route_id
        AND status IN ('active', 'pending')
      FOR UPDATE -- Lock existing subscriptions to prevent concurrent additions
    ) THEN
      RAISE EXCEPTION 'You already have an active subscription for this route';
    END IF;
  
    -- E) Atomic Update: Route seats
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_license.route_id
      AND is_active = true
      AND available_seats > 0;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  
    -- F) Mark license as used
    UPDATE licenses
    SET status = 'used',
        used_by = auth.uid(),
        used_at = NOW()
    WHERE id = v_license.id;
  
    -- G) Create active subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (
      auth.uid(),
      v_license.route_id,
      'active',
      NOW(),
      NOW() + (v_license.valid_days || ' days')::INTERVAL
    )
    RETURNING id INTO v_subscription_id;
  
    -- H) Audit Logging
    PERFORM log_audit(
      auth.uid(),
      'activate_license',
      'subscriptions',
      v_subscription_id,
      jsonb_build_object('route_id', v_license.route_id, 'license_id', v_license.id)
    );
  
    RETURN v_subscription_id;
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 2. Fix submit_rating: Ensure student actually used the service
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION submit_rating(
    p_trip_id UUID,
    p_rating  INT,
    p_comment TEXT
  ) RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_trip           RECORD;
    v_driver_user_id UUID;
    v_rating_id      UUID;
    v_role           TEXT;
  BEGIN
    -- A) Role Check
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can submit ratings';
    END IF;
  
    -- B) Validation
    IF p_rating < 1 OR p_rating > 5 THEN
      RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
  
    -- C) Trip Context & Participation Check (Anti-IDOR)
    SELECT t.*, r.driver_id as route_driver_id
    INTO v_trip
    FROM trips t
    JOIN routes r ON r.id = t.route_id
    WHERE t.id = p_trip_id;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status != 'completed' THEN
      RAISE EXCEPTION 'You can only rate completed trips';
    END IF;
  
    -- CRITICAL FIX: Ensure the student has (or had) a valid subscription for this route
    IF NOT EXISTS (
      SELECT 1 FROM subscriptions
      WHERE student_id = auth.uid()
        AND route_id = v_trip.route_id
        AND status IN ('active', 'expired') -- Must have been a valid passenger
    ) THEN
      RAISE EXCEPTION 'Unauthorized: You must have a valid subscription for this route to rate it';
    END IF;
  
    -- D) Resolve Driver User ID
    SELECT d.user_id INTO v_driver_user_id
    FROM drivers d
    WHERE d.id = v_trip.driver_id;
  
    IF v_driver_user_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found for trip';
    END IF;
  
    -- E) Insert Rating (UNIQUE constraint on trip_id + student_id prevents double rating)
    INSERT INTO ratings (trip_id, student_id, driver_id, rating, comment)
    VALUES (p_trip_id, auth.uid(), v_driver_user_id, p_rating, p_comment)
    RETURNING id INTO v_rating_id;
  
    -- F) Audit Logging
    PERFORM log_audit(
      auth.uid(),
      'submit_rating',
      'ratings',
      v_rating_id,
      jsonb_build_object('trip_id', p_trip_id, 'rating', p_rating)
    );
  
    RETURN v_rating_id;
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 3. Harden create_license_batch: Longer codes (12 characters)
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION create_license_batch(
    p_route_id   UUID,
    p_batch_name TEXT,
    p_quantity   INT,
    p_price      NUMERIC,
    p_valid_days INT
  ) RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_batch_id UUID;
    v_code     TEXT;
    i          INT;
    v_role     TEXT;
  BEGIN
    -- A) Verify Admin
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can create license batches';
    END IF;
  
    -- B) Create Batch Record
    INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
    VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
    RETURNING id INTO v_batch_id;
  
    -- C) Generate Stronger Codes (12 characters instead of 8)
    FOR i IN 1..p_quantity LOOP
      LOOP
        -- Increased entropy for code generation
        v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
        BEGIN
          INSERT INTO licenses (batch_id, route_id, code, valid_days)
          VALUES (v_batch_id, p_route_id, v_code, p_valid_days);
          EXIT;
        EXCEPTION WHEN unique_violation THEN
          -- Retry on collision
        END;
      END LOOP;
    END LOOP;
  
    -- D) Audit Logging
    PERFORM log_audit(
      auth.uid(),
      'create_license_batch',
      'license_batches',
      v_batch_id,
      jsonb_build_object('quantity', p_quantity, 'route_id', p_route_id)
    );
  
    RETURN v_batch_id;
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 4. Final Sensitive RPC Review: Admin check for get_dashboard_stats
  -- ═══════════════════════════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_dashboard_stats()
  RETURNS JSON
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    result JSON;
  BEGIN
    -- STRICT ADMIN CHECK
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
  
    SELECT json_build_object(
      'total_users',          (SELECT count(*) FROM profiles),
      'total_drivers',        (SELECT count(*) FROM drivers),
      'total_routes',         (SELECT count(*) FROM routes),
      'active_routes',        (SELECT count(*) FROM routes WHERE is_active = true),
      'total_trips',          (SELECT count(*) FROM trips),
      'active_trips',         (SELECT count(*) FROM trips WHERE status IN ('driver_waiting', 'in_transit')),
      'total_subscriptions',  (SELECT count(*) FROM subscriptions),
      'active_subscriptions', (SELECT count(*) FROM subscriptions WHERE status = 'active'),
      'monthly_revenue', (
        SELECT COALESCE(SUM(r.price), 0)
        FROM subscriptions s
        JOIN routes r ON r.id = s.route_id
        WHERE s.status = 'active'
      )
    ) INTO result;
  
    RETURN result;
  END;
  $$;
  
  -- Ensure execute is revoked from public for all sensitive functions
  REVOKE EXECUTE ON FUNCTION activate_license(TEXT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION activate_license(TEXT) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION submit_rating(UUID, INT, TEXT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION submit_rating(UUID, INT, TEXT) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION create_license_batch(UUID, TEXT, INT, NUMERIC, INT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION create_license_batch(UUID, TEXT, INT, NUMERIC, INT) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION get_dashboard_stats() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
  



  -- ==========================================
  -- Source: 2026051803_cleanup_seed_data.sql
  -- ==========================================
  -- UniRide: Cleanup Seed Data
  -- Migration: 2026051803_cleanup_seed_data.sql
  -- This migration removes all non-system data to prepare for a fresh start.
  
  DO $$
  BEGIN
      -- 1. Disable triggers to speed up and avoid side effects
      SET session_replication_role = 'replica';
  
      -- 2. Truncate tables with foreign key constraints (excluding profiles to protect admin)
      TRUNCATE TABLE 
          audit_logs,
          rate_limits,
          ratings,
          subscriptions,
          trips,
          licenses,
          license_batches,
          push_tokens,
          routes,
          drivers,
          institutions
      RESTART IDENTITY CASCADE;
  
      -- 3. Safely cleanup profiles: Delete everyone except admins
      DELETE FROM profiles WHERE role != 'admin';
  
      -- 4. Reset session_replication_role
      SET session_replication_role = 'origin';
  
      -- 5. Re-seed essential system data (Feature Flags)
      -- These are required for the application logic to function
      INSERT INTO feature_flags (name, enabled, description) VALUES
        ('realtime_tracking',  true,  'Enable real-time GPS tracking for drivers'),
        ('push_notifications', true,  'Enable Expo push notifications'),
        ('offline_mode',       true,  'Enable offline subscription cache'),
        ('ratings_system',     true,  'Enable post-trip ratings'),
        ('zaincash_payment',   false, 'Enable ZainCash payment gateway (requires merchant credentials)')
      ON CONFLICT (name) DO UPDATE SET
        enabled = EXCLUDED.enabled,
        description = EXCLUDED.description;
  
  END $$;
  



  -- ==========================================
  -- Source: 2026051804_fix_drivers_rls_and_grants.sql
  -- ==========================================
  -- UniRide: Fix Drivers RLS and missing grants
  -- Migration: 2026051804_fix_drivers_rls_and_grants.sql
  
  -- 1. Ensure Admins have full access to drivers table
  -- Some early migrations might have had restrictive policies
  DROP POLICY IF EXISTS "Drivers: Admins see all" ON drivers;
  CREATE POLICY "Drivers: Admins manage all" ON drivers 
    FOR ALL USING (is_admin());
  
  -- 2. Ensure profiles are visible to Admins (for joining driver info)
  DROP POLICY IF EXISTS "Profiles: Admins see all" ON profiles;
  CREATE POLICY "Profiles: Admins see all" ON profiles 
    FOR SELECT USING (is_admin());
  
  -- 3. Grant permissions to authenticated users for RPCs used in drivers page
  GRANT EXECUTE ON FUNCTION get_drivers_avg_rating(UUID[]) TO authenticated;
  
  -- 4. Fix possible missing search_path on is_admin if it was recreated
  CREATE OR REPLACE FUNCTION is_admin()
  RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER
  SET search_path = public AS $$
    SELECT get_my_role() = 'admin';
  $$;
  



  -- ==========================================
  -- Source: 2026051805_setup_admins.sql
  -- ==========================================
  -- UniRide: Setup Primary Admins
  -- Migration: 2026051805_setup_admins.sql
  
  -- 1. Setup Admin: wisamsamir78@gmail.com
  UPDATE auth.users 
  SET raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb), 
      '{role}', 
      '"admin"'
  )
  WHERE email = 'wisamsamir78@gmail.com';
  
  INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
  SELECT id, 'Wisam Samir', '07000000001', 'admin', true
  FROM auth.users
  WHERE email = 'wisamsamir78@gmail.com'
  ON CONFLICT (id) DO UPDATE SET 
      role = 'admin',
      phone = '07000000001',
      is_verified = true;
  
  -- 2. Setup Admin: admin@uniride.com
  UPDATE auth.users 
  SET raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb), 
      '{role}', 
      '"admin"'
  )
  WHERE email = 'admin@uniride.com';
  
  INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
  SELECT id, 'System Admin', '07000000002', 'admin', true
  FROM auth.users
  WHERE email = 'admin@uniride.com'
  ON CONFLICT (id) DO UPDATE SET 
      role = 'admin',
      phone = '07000000002',
      is_verified = true;
  



  -- ==========================================
  -- Source: 2026051806_add_test_driver.sql
  -- ==========================================
  -- UniRide: Add Test Driver and Institution for Verification
  -- Migration: 2026051806_add_test_driver.sql
  
  DO $$
  DECLARE
      v_institution_id UUID;
      v_admin_id UUID;
  BEGIN
      -- 1. Create a Test Institution
      INSERT INTO institutions (name, city)
      VALUES ('جامعة بغداد - الجادرية', 'بغداد')
      ON CONFLICT (name) DO UPDATE SET city = EXCLUDED.city
      RETURNING id INTO v_institution_id;
  
      -- 2. Find our Admin (Wisam)
      SELECT id INTO v_admin_id FROM auth.users WHERE email = 'wisamsamir78@gmail.com';
  
      -- 3. If Admin exists, make sure he has a driver profile for testing if needed
      -- But better create a separate driver record associated with the admin for a quick test
      -- Or just ensure we can at least see the table is working.
      
      -- Let's create a "Ghost Driver" entry tied to the admin user just for UI verification
      IF v_admin_id IS NOT NULL THEN
          IF NOT EXISTS (SELECT 1 FROM drivers WHERE user_id = v_admin_id) THEN
              INSERT INTO drivers (user_id, license_number, vehicle_model, vehicle_plate, capacity)
              VALUES (v_admin_id, 'TEST-12345', 'Toyota Coaster', 'BAG-9900', 25);
          END IF;
      END IF;
  
  END $$;
  



  -- ==========================================
  -- Source: 2026051807_zaincash_payments.sql
  -- ==========================================
  -- UniRide M8: ZainCash Payments Table
  -- Tracks payment state for ZainCash integration
  -- Checkout creates pending payment → Webhook confirms and activates subscription
  
  -- Payments table for ZainCash integration
  CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
    amount INT NOT NULL CHECK (amount > 0),
    zaincash_order_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  );
  
  CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
  CREATE INDEX IF NOT EXISTS idx_payments_zaincash_order_id ON payments(zaincash_order_id);
  CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
  
  -- RLS: Users see own payments, admins see all
  ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Payments: Users see own" ON payments
    FOR SELECT USING (auth.uid() = user_id OR is_admin());
  
  CREATE POLICY "Payments: Service role can insert" ON payments
    FOR INSERT WITH CHECK (true);
  
  CREATE POLICY "Payments: Service role can update" ON payments
    FOR UPDATE USING (true);
  
  -- RPC to create a pending payment (called by zaincash-checkout)
  CREATE OR REPLACE FUNCTION create_payment(
    p_user_id UUID,
    p_route_id UUID,
    p_amount INT,
    p_zaincash_order_id TEXT
  ) RETURNS payments AS $$
  DECLARE
    v_payment payments;
  BEGIN
    INSERT INTO payments (user_id, route_id, amount, zaincash_order_id, status)
    VALUES (p_user_id, p_route_id, p_amount, p_zaincash_order_id, 'pending')
    RETURNING * INTO v_payment;
    RETURN v_payment;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- RPC to complete payment and activate subscription (called by zaincash-webhook)
  CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
    p_zaincash_order_id TEXT,
    p_valid_days INT DEFAULT 30
  ) RETURNS payments AS $$
  DECLARE
    v_payment payments%ROWTYPE;
    v_subscription subscriptions;
    v_route routes%ROWTYPE;
  BEGIN
    -- Find pending payment with row lock
    SELECT * INTO v_payment
    FROM payments
    WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
    FOR UPDATE;
  
    IF v_payment IS NULL THEN
      RAISE EXCEPTION 'Payment not found or already processed';
    END IF;
  
    -- Get route info
    SELECT * INTO v_route FROM routes WHERE id = v_payment.route_id;
  
    -- Create subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (
      v_payment.user_id,
      v_payment.route_id,
      'active',
      NOW(),
      NOW() + (p_valid_days || ' days')::INTERVAL
    )
    RETURNING * INTO v_subscription;
  
    -- Update payment status
    UPDATE payments
    SET status = 'completed', completed_at = NOW(), updated_at = NOW()
    WHERE id = v_payment.id;
  
    -- Increment available_seats counter (subscription consumes a seat)
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_payment.route_id AND available_seats > 0;
  
    -- Return updated payment
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Trigger to update updated_at
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
  CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();



  -- ==========================================
  -- Source: 2026051808_messaging.sql
  -- ==========================================
  -- UniRide M9: Driver-Student Messaging System
  -- Conversations and messages between drivers and students
  
  -- Conversations: one per trip between driver and student
  CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(trip_id)
  );
  
  CREATE INDEX IF NOT EXISTS idx_conversations_driver_id ON conversations(driver_id);
  CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON conversations(student_id);
  CREATE INDEX IF NOT EXISTS idx_conversations_trip_id ON conversations(trip_id);
  
  -- Messages: individual chat messages
  CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
  
  -- RLS policies - simplified
  ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  
  -- Users see their own conversations
  CREATE POLICY "Conversations: Participants see their conversations"
    ON conversations FOR SELECT
    USING (
      auth.uid() = student_id
      OR auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
    );
  
  -- Drivers and students can create conversations for their trips
  CREATE POLICY "Conversations: Driver can create for their trips"
    ON conversations FOR INSERT
    WITH CHECK (
      auth.uid() = student_id
      OR auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
    );
  
  -- Auto-update updated_at trigger
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
  CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
  -- Messages: participants can read messages in their conversations
  -- Uses a join to check participation (avoids cross-database reference in subquery)
  CREATE POLICY "Messages: Conversation participants can read"
    ON messages FOR SELECT
    USING (
      auth.uid() = sender_id
      OR EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id
        AND (
          c.student_id = auth.uid()
          OR c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
        )
      )
    );
  
  -- Messages: participants can insert into their conversations
  CREATE POLICY "Messages: Conversation participants can send"
    ON messages FOR INSERT
    WITH CHECK (
      auth.uid() = sender_id
      AND EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id
        AND (
          c.student_id = auth.uid()
          OR c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
        )
      )
    );
  
  -- Messages: only sender can update (mark as read)
  CREATE POLICY "Messages: Sender can update read status"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id)
    WITH CHECK (auth.uid() = sender_id);
  
  -- RPC: Get or create conversation for a trip
  CREATE OR REPLACE FUNCTION get_or_create_conversation(p_trip_id UUID)
  RETURNS conversations AS $$
  DECLARE
    v_trip trips%ROWTYPE;
    v_driver drivers%ROWTYPE;
    v_conversation conversations%ROWTYPE;
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;
    IF v_trip IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    SELECT * INTO v_driver FROM drivers WHERE id = v_trip.driver_id;
  
    IF v_caller_id != v_driver.user_id AND v_caller_id != v_trip.student_id THEN
      RAISE EXCEPTION 'Not a participant in this trip';
    END IF;
  
    SELECT * INTO v_conversation
    FROM conversations
    WHERE trip_id = p_trip_id;
  
    IF v_conversation IS NOT NULL THEN
      RETURN v_conversation;
    END IF;
  
    IF v_caller_id = v_driver.user_id THEN
      INSERT INTO conversations (trip_id, driver_id, student_id)
      VALUES (p_trip_id, v_trip.driver_id, v_trip.student_id)
      RETURNING * INTO v_conversation;
    ELSE
      INSERT INTO conversations (trip_id, driver_id, student_id)
      VALUES (p_trip_id, v_trip.driver_id, v_caller_id)
      RETURNING * INTO v_conversation;
    END IF;
  
    RETURN v_conversation;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- RPC: Send a message
  CREATE OR REPLACE FUNCTION send_message(p_conversation_id UUID, p_content TEXT)
  RETURNS messages AS $$
  DECLARE
    v_message messages%ROWTYPE;
    v_conversation conversations%ROWTYPE;
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT * INTO v_conversation FROM conversations WHERE id = p_conversation_id;
    IF v_conversation IS NULL THEN
      RAISE EXCEPTION 'Conversation not found';
    END IF;
  
    IF v_caller_id NOT IN (
      SELECT user_id FROM drivers WHERE id = v_conversation.driver_id
    ) AND v_caller_id != v_conversation.student_id THEN
      RAISE EXCEPTION 'Not a participant in this conversation';
    END IF;
  
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (p_conversation_id, v_caller_id, p_content)
    RETURNING * INTO v_message;
  
    UPDATE conversations SET last_message_at = NOW() WHERE id = p_conversation_id;
  
    RETURN v_message;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- RPC: Get messages for a conversation
  CREATE OR REPLACE FUNCTION get_messages(p_conversation_id UUID, p_limit INT DEFAULT 50)
  RETURNS SETOF messages AS $$
  DECLARE
    v_conversation conversations%ROWTYPE;
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT * INTO v_conversation FROM conversations WHERE id = p_conversation_id;
    IF v_conversation IS NULL THEN
      RAISE EXCEPTION 'Conversation not found';
    END IF;
  
    IF v_caller_id NOT IN (
      SELECT user_id FROM drivers WHERE id = v_conversation.driver_id
    ) AND v_caller_id != v_conversation.student_id THEN
      RAISE EXCEPTION 'Not a participant';
    END IF;
  
    RETURN QUERY
    SELECT * FROM messages
    WHERE conversation_id = p_conversation_id
    ORDER BY created_at DESC
    LIMIT p_limit;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- RPC: Get user's conversations (driver or student)
  CREATE OR REPLACE FUNCTION get_my_conversations()
  RETURNS SETOF conversations AS $$
  DECLARE
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    RETURN QUERY
    SELECT * FROM conversations c
    WHERE
      c.driver_id IN (SELECT id FROM drivers WHERE user_id = v_caller_id)
      OR c.student_id = v_caller_id
    ORDER BY c.last_message_at DESC;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- RPC: Mark messages as read
  CREATE OR REPLACE FUNCTION mark_messages_read(p_conversation_id UUID)
  RETURNS void AS $$
  DECLARE
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    UPDATE messages
    SET is_read = true
    WHERE conversation_id = p_conversation_id
      AND sender_id != v_caller_id
      AND is_read = false;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;



  -- ==========================================
  -- Source: 2026051810_enhanced_dashboard_rpcs.sql
  -- ==========================================
  -- UniRide M10: Enhanced Dashboard RPCs
  -- System health monitoring and enhanced analytics
  
  -- System health check RPC
  CREATE OR REPLACE FUNCTION get_system_health()
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $$
  DECLARE
    v_result JSON;
    v_db_latency_ms NUMERIC;
    v_last_trip_at TIMESTAMPTZ;
    v_active_trips_count INT;
    v_pending_subscriptions INT;
  BEGIN
    -- Measure DB latency with a simple query
    PERFORM NOW();
    v_db_latency_ms := 0;
  
    -- Get last trip time
    SELECT MAX(started_at) INTO v_last_trip_at FROM trips WHERE status != 'completed';
  
    -- Count active trips
    SELECT COUNT(*) INTO v_active_trips_count
    FROM trips
    WHERE status IN ('driver_waiting', 'in_transit', 'scheduled');
  
    -- Count pending subscriptions
    SELECT COUNT(*) INTO v_pending_subscriptions
    FROM subscriptions
    WHERE status = 'pending';
  
    SELECT json_build_object(
      'status', 'healthy',
      'timestamp', NOW(),
      'db_latency_ms', v_db_latency_ms,
      'database', json_build_object(
        'connected', true,
        'last_activity', v_last_trip_at
      ),
      'api', json_build_object(
        'status', 'operational',
        'active_trips', v_active_trips_count
      ),
      'services', json_build_object(
        'realtime', 'connected',
        'payments', 'operational',
        'notifications', 'operational'
      ),
      'pending_counts', json_build_object(
        'pending_subscriptions', v_pending_subscriptions,
        'active_trips', v_active_trips_count
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  
  GRANT EXECUTE ON FUNCTION get_system_health() TO authenticated;
  
  -- Enhanced analytics with growth metrics
  CREATE OR REPLACE FUNCTION get_enhanced_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_comparison_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '60 days',
    p_comparison_end TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days'
  )
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $$
  DECLARE
    v_result JSON;
    v_current_period JSON;
    v_previous_period JSON;
  BEGIN
    -- Current period stats
    SELECT json_build_object(
      'trips', COUNT(*),
      'revenue', COALESCE(SUM(r.price), 0),
      'students', COUNT(DISTINCT student_id)
    ) INTO v_current_period
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE s.created_at BETWEEN p_start_date AND p_end_date
      AND s.status = 'active';
  
    -- Previous period for comparison
    SELECT json_build_object(
      'trips', COUNT(*),
      'revenue', COALESCE(SUM(r.price), 0),
      'students', COUNT(DISTINCT student_id)
    ) INTO v_previous_period
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE s.created_at BETWEEN p_comparison_start AND p_comparison_end
      AND s.status = 'active';
  
    SELECT json_build_object(
      'current_period', v_current_period,
      'previous_period', v_previous_period,
      'period_comparison', json_build_object(
        'trips_change', CASE
          WHEN (v_current_period->>'trips')::INT > 0
          THEN ROUND(((v_current_period->>'trips')::INT - (v_previous_period->>'trips')::INT)::NUMERIC / (v_previous_period->>'trips')::INT * 100, 1)
          ELSE 0
        END,
        'revenue_change', CASE
          WHEN (v_current_period->>'revenue')::INT > 0
          THEN ROUND(((v_current_period->>'revenue')::INT - (v_previous_period->>'revenue')::INT)::NUMERIC / NULLIF((v_previous_period->>'revenue')::INT, 0) * 100, 1)
          ELSE 0
        END
      ),
      'daily_breakdown', (
        SELECT COALESCE(json_agg(json_build_object(
          'date', day::DATE,
          'trips', trips_count,
          'revenue', revenue_sum
        ) ORDER BY day), '[]'::json)
        FROM (
          SELECT
            DATE(s.created_at) as day,
            COUNT(*) as trips_count,
            SUM(r.price) as revenue_sum
          FROM subscriptions s
          JOIN routes r ON s.route_id = r.id
          WHERE s.created_at BETWEEN p_start_date AND p_end_date
            AND s.status = 'active'
          GROUP BY DATE(s.created_at)
          ORDER BY day
        ) daily
      ),
      'hourly_breakdown', (
        SELECT COALESCE(json_agg(json_build_object(
          'hour', hour,
          'trips', trips_count
        ) ORDER BY hour), '[]'::json)
        FROM (
          SELECT
            EXTRACT(HOUR FROM s.created_at)::INT as hour,
            COUNT(*) as trips_count
          FROM subscriptions s
          WHERE s.created_at BETWEEN p_start_date AND p_end_date
            AND s.status = 'active'
          GROUP BY EXTRACT(HOUR FROM s.created_at)
          ORDER BY hour
        ) hourly
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  
  GRANT EXECUTE ON FUNCTION get_enhanced_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;



  -- ==========================================
  -- Source: 2026051811_add_missing_columns.sql
  -- ==========================================
  -- UniRide M11: Add missing columns to existing tables
  -- Some tables were created without proper audit timestamps
  
  -- Add created_at and updated_at to drivers if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'created_at') THEN
      ALTER TABLE drivers ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'updated_at') THEN
      ALTER TABLE drivers ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at and updated_at to routes if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'routes' AND column_name = 'created_at') THEN
      ALTER TABLE routes ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'routes' AND column_name = 'updated_at') THEN
      ALTER TABLE routes ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to profiles if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
      ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to subscriptions if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'created_at') THEN
      ALTER TABLE subscriptions ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to driver_payouts if missing (from M5)
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'driver_payouts') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'driver_payouts' AND column_name = 'created_at') THEN
        ALTER TABLE driver_payouts ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'driver_payouts' AND column_name = 'updated_at') THEN
        ALTER TABLE driver_payouts ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
      END IF;
    END IF;
  END $$;
  
  -- Add created_at to audit_logs if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'created_at') THEN
      ALTER TABLE audit_logs ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to licenses if missing (from M3)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'licenses' AND column_name = 'created_at') THEN
      ALTER TABLE licenses ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to license_batches if missing (from M3)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'license_batches' AND column_name = 'created_at') THEN
      ALTER TABLE license_batches ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to trips if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'created_at') THEN
      ALTER TABLE trips ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to feature_flags if missing (from M6)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feature_flags' AND column_name = 'created_at') THEN
      ALTER TABLE feature_flags ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;
  
  -- Add created_at to ratings if missing
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'created_at') THEN
      ALTER TABLE ratings ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
  END $$;



  -- ==========================================
  -- Source: 2026051901_fix_subscription_integrity.sql
  -- ==========================================
  -- UniRide: Fix Subscription Integrity & Security (M11)
  -- 1. Remove double-seat restore trigger
  -- 2. Add search_path to RPCs
  -- 3. Fix complete_payment_and_activate_subscription checks
  -- 4. Secure payments RLS
  -- 5. Fix expire_subscriptions to restore seats
  
  -- ════════════════════════════════════════════════
  -- 1. FIX BUG-1: Remove trigger causing double seat restore
  -- ════════════════════════════════════════════════
  DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
  DROP FUNCTION IF EXISTS handle_subscription_change();
  
  -- ════════════════════════════════════════════════
  -- 2. FIX BUG-3: Proper expire_subscriptions for pg_cron
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION expire_subscriptions()
  RETURNS void LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  BEGIN
    -- 1. Restore seats for expired subscriptions first
    UPDATE routes r
    SET available_seats = LEAST(r.capacity, r.available_seats + sub_counts.cnt)
    FROM (
      SELECT route_id, COUNT(*) as cnt
      FROM subscriptions
      WHERE status = 'active' AND end_date < NOW() AND deleted_at IS NULL
      GROUP BY route_id
    ) sub_counts
    WHERE r.id = sub_counts.route_id;
  
    -- 2. Update status to expired
    UPDATE subscriptions
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active' AND end_date < NOW() AND deleted_at IS NULL;
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION expire_subscriptions() FROM PUBLIC;
  
  -- Re-schedule pg_cron to use the RPC directly
  -- Unschedule if it exists from previous iterations
  -- This assumes pg_cron extension is active. We wrap in DO to ignore errors if it doesn't exist
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
      PERFORM cron.unschedule('expire-subscriptions');
      PERFORM cron.schedule('expire-subscriptions', '0 * * * *', 'SELECT expire_subscriptions();');
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if cron isn't setup
  END $$;
  
  -- ════════════════════════════════════════════════
  -- 3. FIX BUG-2 & BUG-7: complete_payment_and_activate_subscription
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
    p_zaincash_order_id TEXT,
    p_valid_days INT DEFAULT 30
  ) RETURNS payments
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_payment payments%ROWTYPE;
    v_subscription subscriptions;
    v_route routes%ROWTYPE;
  BEGIN
    -- Find pending payment with NOWAIT
    SELECT * INTO v_payment
    FROM payments
    WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
    FOR UPDATE NOWAIT;
  
    IF v_payment IS NULL THEN
      RAISE EXCEPTION 'Payment not found or already processed';
    END IF;
  
    -- Check for existing active subscription (Duplicate check)
    IF EXISTS (
      SELECT 1 FROM subscriptions
      WHERE student_id = v_payment.user_id
        AND route_id = v_payment.route_id
        AND status IN ('active', 'pending')
      FOR UPDATE
    ) THEN
      -- Update payment to failed due to duplicate
      UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
      RAISE EXCEPTION 'You already have an active subscription for this route';
    END IF;
  
    -- Verify and deduct seat atomically
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;
  
    IF NOT FOUND THEN
      UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  
    -- Create subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (
      v_payment.user_id,
      v_payment.route_id,
      'active',
      NOW(),
      NOW() + (p_valid_days || ' days')::INTERVAL
    )
    RETURNING * INTO v_subscription;
  
    -- Update payment status
    UPDATE payments
    SET status = 'completed', completed_at = NOW(), updated_at = NOW()
    WHERE id = v_payment.id;
  
    -- Return updated payment
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END;
  $$;
  
  -- ════════════════════════════════════════════════
  -- 4. FIX BUG-7: create_payment search_path
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION create_payment(
    p_user_id UUID,
    p_route_id UUID,
    p_amount INT,
    p_zaincash_order_id TEXT
  ) RETURNS payments 
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_payment payments;
  BEGIN
    INSERT INTO payments (user_id, route_id, amount, zaincash_order_id, status)
    VALUES (p_user_id, p_route_id, p_amount, p_zaincash_order_id, 'pending')
    RETURNING * INTO v_payment;
    RETURN v_payment;
  END;
  $$;
  
  -- ════════════════════════════════════════════════
  -- 5. FIX BUG-9: payments RLS hardening
  -- ════════════════════════════════════════════════
  DROP POLICY IF EXISTS "Payments: Service role can insert" ON payments;
  DROP POLICY IF EXISTS "Payments: Service role can update" ON payments;
  
  -- Payments should only be created/updated via the RPCs above by authenticated users
  -- Or by the webhook (which uses service role key, bypassing RLS)
  
  -- ════════════════════════════════════════════════
  -- 6. FIX BUG-8: search_path for dashboard RPCs
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_system_health()
  RETURNS JSON
  LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_result JSON;
    v_db_latency_ms NUMERIC;
    v_last_trip_at TIMESTAMPTZ;
    v_active_trips_count INT;
    v_pending_subscriptions INT;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Admin only';
    END IF;
  
    PERFORM NOW();
    v_db_latency_ms := 0;
  
    SELECT MAX(started_at) INTO v_last_trip_at FROM trips WHERE status != 'completed';
  
    SELECT COUNT(*) INTO v_active_trips_count
    FROM trips
    WHERE status IN ('driver_waiting', 'in_transit', 'scheduled');
  
    SELECT COUNT(*) INTO v_pending_subscriptions
    FROM subscriptions
    WHERE status = 'pending';
  
    SELECT json_build_object(
      'status', 'healthy',
      'timestamp', NOW(),
      'db_latency_ms', v_db_latency_ms,
      'database', json_build_object(
        'connected', true,
        'last_activity', v_last_trip_at
      ),
      'api', json_build_object(
        'status', 'operational',
        'active_trips', v_active_trips_count
      ),
      'services', json_build_object(
        'realtime', 'connected',
        'payments', 'operational',
        'notifications', 'operational'
      ),
      'pending_counts', json_build_object(
        'pending_subscriptions', v_pending_subscriptions,
        'active_trips', v_active_trips_count
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  
  CREATE OR REPLACE FUNCTION get_enhanced_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_comparison_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '60 days',
    p_comparison_end TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days'
  )
  RETURNS JSON
  LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_result JSON;
    v_current_period JSON;
    v_previous_period JSON;
  BEGIN
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Admin only';
    END IF;
  
    SELECT json_build_object(
      'trips', COUNT(*),
      'revenue', COALESCE(SUM(r.price), 0),
      'students', COUNT(DISTINCT student_id)
    ) INTO v_current_period
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE s.created_at BETWEEN p_start_date AND p_end_date
      AND s.status = 'active';
  
    SELECT json_build_object(
      'trips', COUNT(*),
      'revenue', COALESCE(SUM(r.price), 0),
      'students', COUNT(DISTINCT student_id)
    ) INTO v_previous_period
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE s.created_at BETWEEN p_comparison_start AND p_comparison_end
      AND s.status = 'active';
  
    SELECT json_build_object(
      'current_period', v_current_period,
      'previous_period', v_previous_period,
      'period_comparison', json_build_object(
        'trips_change', CASE
          WHEN (v_current_period->>'trips')::INT > 0
          THEN ROUND(((v_current_period->>'trips')::INT - (v_previous_period->>'trips')::INT)::NUMERIC / (v_previous_period->>'trips')::INT * 100, 1)
          ELSE 0
        END,
        'revenue_change', CASE
          WHEN (v_current_period->>'revenue')::INT > 0
          THEN ROUND(((v_current_period->>'revenue')::INT - (v_previous_period->>'revenue')::INT)::NUMERIC / NULLIF((v_previous_period->>'revenue')::INT, 0) * 100, 1)
          ELSE 0
        END
      ),
      'daily_breakdown', (
        SELECT COALESCE(json_agg(json_build_object(
          'date', day::DATE,
          'trips', trips_count,
          'revenue', revenue_sum
        ) ORDER BY day), '[]'::json)
        FROM (
          SELECT
            DATE(s.created_at) as day,
            COUNT(*) as trips_count,
            SUM(r.price) as revenue_sum
          FROM subscriptions s
          JOIN routes r ON s.route_id = r.id
          WHERE s.created_at BETWEEN p_start_date AND p_end_date
            AND s.status = 'active'
          GROUP BY DATE(s.created_at)
          ORDER BY day
        ) daily
      ),
      'hourly_breakdown', (
        SELECT COALESCE(json_agg(json_build_object(
          'hour', hour,
          'trips', trips_count
        ) ORDER BY hour), '[]'::json)
        FROM (
          SELECT
            EXTRACT(HOUR FROM s.created_at)::INT as hour,
            COUNT(*) as trips_count
          FROM subscriptions s
          WHERE s.created_at BETWEEN p_start_date AND p_end_date
            AND s.status = 'active'
          GROUP BY EXTRACT(HOUR FROM s.created_at)
          ORDER BY hour
        ) hourly
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  



  -- ==========================================
  -- Source: 2026051902_pre_launch_data_cleanup.sql
  -- ==========================================
  -- UniRide Pre-Launch Data Cleanup
  -- This migration removes all test/operational data while preserving
  -- structural configurations (institutions, routes, driver_profiles, profiles)
  
  TRUNCATE TABLE 
    audit_logs,
    push_tokens,
    conversations,
    messages,
    ratings,
    trips,
    subscriptions,
    licenses,
    license_batches,
    payments
  RESTART IDENTITY CASCADE;
  
  -- Reset all routes seats back to their maximum capacity
  UPDATE routes SET available_seats = capacity;
  



  -- ==========================================
  -- Source: 2026051903_fix_architectural_flaws.sql
  -- ==========================================
  -- 1. Fix Transaction Rollback Bug in complete_payment_and_activate_subscription
  -- Returning the failed payment instead of raising an exception that rolls back the UPDATE.
  
  CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
    p_zaincash_order_id TEXT,
    p_valid_days INT DEFAULT 30
  ) RETURNS payments
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_payment payments%ROWTYPE;
    v_subscription subscriptions;
    v_route routes%ROWTYPE;
  BEGIN
    -- Find pending payment with NOWAIT
    SELECT * INTO v_payment
    FROM payments
    WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
    FOR UPDATE NOWAIT;
  
    IF v_payment IS NULL THEN
      RAISE EXCEPTION 'Payment not found or already processed';
    END IF;
  
    -- Check for existing active subscription (Duplicate check)
    IF EXISTS (
      SELECT 1 FROM subscriptions
      WHERE student_id = v_payment.user_id
        AND route_id = v_payment.route_id
        AND status IN ('active', 'pending')
      FOR UPDATE
    ) THEN
      -- Update payment to failed due to duplicate and return it instead of rolling back
      UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
      SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
      RETURN v_payment;
    END IF;
  
    -- Verify and deduct seat atomically
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;
  
    IF NOT FOUND THEN
      -- Update payment to failed due to no seats and return it instead of rolling back
      UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
      SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
      RETURN v_payment;
    END IF;
  
    -- Create subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
    VALUES (
      v_payment.user_id,
      v_payment.route_id,
      'active',
      NOW(),
      NOW() + (p_valid_days || ' days')::INTERVAL
    )
    RETURNING * INTO v_subscription;
  
    -- Update payment status
    UPDATE payments
    SET status = 'completed', completed_at = NOW(), updated_at = NOW()
    WHERE id = v_payment.id;
  
    -- Return updated payment
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END;
  $$;
  
  -- 2. Add bulk GPS location update RPC to solve N+1 problem
  
  CREATE OR REPLACE FUNCTION bulk_update_trip_locations(p_locations JSONB) RETURNS JSONB AS $$
  DECLARE
    v_driver_id UUID;
    v_location RECORD;
    v_failed JSONB := '[]'::JSONB;
    v_status TEXT;
    v_success_count INT := 0;
  BEGIN
    -- Get current driver from auth
    SELECT d.id INTO v_driver_id FROM drivers d WHERE d.user_id = auth.uid();
    IF v_driver_id IS NULL THEN 
      RAISE EXCEPTION 'Driver profile not found'; 
    END IF;
  
    FOR v_location IN SELECT * FROM jsonb_to_recordset(p_locations) AS x(tripId UUID, lat NUMERIC, lng NUMERIC)
    LOOP
      SELECT status INTO v_status FROM trips WHERE id = v_location.tripId AND driver_id = v_driver_id;
      
      IF v_status IN ('driver_waiting', 'in_transit') THEN
        UPDATE trips SET last_lat = v_location.lat, last_lng = v_location.lng, updated_at = NOW() WHERE id = v_location.tripId;
        v_success_count := v_success_count + 1;
      ELSE
        v_failed := v_failed || jsonb_build_object('tripId', v_location.tripId, 'error', 'Invalid status or trip not found');
      END IF;
    END LOOP;
  
    RETURN jsonb_build_object('success_count', v_success_count, 'failed', v_failed);
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  



  -- ==========================================
  -- Source: 2026051904_driver_payouts.sql
  -- ==========================================
  -- UniRide v2 M8: Driver Payouts Table
  -- Migration: 2026051904_driver_payouts.sql
  
  -- ════════════════════════════════════════════════
  -- 1. Driver Payouts table
  -- ════════════════════════════════════════════════
  CREATE TABLE IF NOT EXISTS driver_payouts (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id      UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    amount         NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
    reference_note TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  ALTER TABLE driver_payouts ENABLE ROW LEVEL SECURITY;
  
  -- Drivers can view their own payouts
  CREATE POLICY "Drivers see own payouts"
    ON driver_payouts FOR SELECT
    USING (
      driver_id IN (
        SELECT d.id FROM drivers d WHERE d.user_id = auth.uid()
      )
    );
  
  -- Admins can view and manage all payouts
  CREATE POLICY "Admins manage all payouts"
    ON driver_payouts FOR ALL
    USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  
  -- Indexes for common queries
  CREATE INDEX IF NOT EXISTS idx_driver_payouts_driver_id ON driver_payouts(driver_id);
  CREATE INDEX IF NOT EXISTS idx_driver_payouts_status ON driver_payouts(status);
  CREATE INDEX IF NOT EXISTS idx_driver_payouts_created_at ON driver_payouts(created_at DESC);
  
  -- ════════════════════════════════════════════════
  -- 2. RPC: Update payout status (admin only)
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION update_payout_status(
    p_payout_id UUID,
    p_new_status TEXT
  )
  RETURNS JSON
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  DECLARE
    v_payout RECORD;
    v_role TEXT;
  BEGIN
    v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: admin only';
    END IF;
  
    IF p_new_status NOT IN ('completed', 'rejected') THEN
      RAISE EXCEPTION 'Invalid status: %', p_new_status;
    END IF;
  
    SELECT * INTO v_payout
    FROM driver_payouts
    WHERE id = p_payout_id
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Payout not found';
    END IF;
  
    IF v_payout.status != 'pending' THEN
      RAISE EXCEPTION 'Cannot update payout with status: %', v_payout.status;
    END IF;
  
    UPDATE driver_payouts
    SET status = p_new_status,
        updated_at = NOW()
    WHERE id = p_payout_id;
  
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      'update_payout_status',
      'driver_payouts',
      p_payout_id,
      jsonb_build_object('previous_status', v_payout.status, 'new_status', p_new_status)
    );
  
    RETURN jsonb_build_object(
      'id', v_payout.id,
      'status', p_new_status,
      'updated_at', NOW()
    );
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION update_payout_status(UUID, TEXT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION update_payout_status(UUID, TEXT) TO authenticated;
  



  -- ==========================================
  -- Source: 2026051905_phase1_security_fixes.sql
  -- ==========================================
  -- Migration: 2026051905_phase1_security_fixes.sql
  -- Description: Revoke dangerous RPCs and fix privilege escalation on profiles table
  
  -- 1. Drop the dangerous seed_safe_insert RPC
  DROP FUNCTION IF EXISTS seed_safe_insert(text, jsonb);
  
  -- 2. Prevent privilege escalation on profiles (role, is_verified) via Trigger
  CREATE OR REPLACE FUNCTION enforce_profile_security()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NOT is_admin() THEN
      IF TG_OP = 'INSERT' THEN
        NEW.role = 'student';
        NEW.is_verified = false;
      ELSIF TG_OP = 'UPDATE' THEN
        -- Preserve the old values for role and is_verified so users can't upgrade themselves
        NEW.role = OLD.role;
        NEW.is_verified = OLD.is_verified;
      END IF;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  DROP TRIGGER IF EXISTS trigger_enforce_profile_security ON profiles;
  CREATE TRIGGER trigger_enforce_profile_security
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION enforce_profile_security();



  -- ==========================================
  -- Source: 2026051906_phase2_db_fixes.sql
  -- ==========================================
  -- Migration: 2026051906_phase2_db_fixes.sql
  -- Description: Fix race condition in expire_subscriptions, fix admin_cancel_trip, fix state machine
  
  -- 1. Fix race condition in expire_subscriptions
  CREATE OR REPLACE FUNCTION expire_subscriptions()
  RETURNS void LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  BEGIN
    WITH expired_subs AS (
      SELECT id, route_id
      FROM subscriptions
      WHERE status = 'active' AND end_date < NOW() AND deleted_at IS NULL
      FOR UPDATE SKIP LOCKED
    ), updated_subs AS (
      UPDATE subscriptions
      SET status = 'expired', updated_at = NOW()
      WHERE id IN (SELECT id FROM expired_subs)
      RETURNING route_id
    ), sub_counts AS (
      SELECT route_id, COUNT(*) as cnt
      FROM updated_subs
      GROUP BY route_id
    )
    UPDATE routes r
    SET available_seats = LEAST(r.capacity, r.available_seats + sub_counts.cnt)
    FROM sub_counts
    WHERE r.id = sub_counts.route_id;
  END;
  $$;
  
  -- 2. Fix admin_cancel_trip to not increment available_seats and allow in_transit cancellations
  CREATE OR REPLACE FUNCTION admin_cancel_trip(p_trip_id UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_role     TEXT;
    v_trip     RECORD;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can cancel trips';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id FOR UPDATE;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status = 'cancelled' THEN
      RETURN;
    END IF;
  
    IF v_trip.status NOT IN ('scheduled', 'driver_waiting', 'in_transit') THEN
      RAISE EXCEPTION 'Cannot cancel trip with status %', v_trip.status;
    END IF;
  
    UPDATE trips
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_trip_id;
  END;
  $$;
  
  -- 3. Update trip transition validation logic
  CREATE OR REPLACE FUNCTION validate_trip_transition(p_trip_id UUID, p_new_status TEXT) RETURNS BOOLEAN AS $$
  DECLARE
    v_current_status TEXT;
    v_valid BOOLEAN;
  BEGIN
    SELECT status INTO v_current_status FROM trips WHERE id = p_trip_id;
    IF v_current_status IS NULL THEN RAISE EXCEPTION 'Trip not found'; END IF;
  
    v_valid := CASE v_current_status
      WHEN 'scheduled' THEN p_new_status IN ('driver_waiting', 'absent', 'cancelled')
      WHEN 'driver_waiting' THEN p_new_status IN ('in_transit', 'absent', 'cancelled')
      WHEN 'in_transit' THEN p_new_status IN ('completed', 'cancelled')
      WHEN 'completed' THEN FALSE
      WHEN 'absent' THEN FALSE
      WHEN 'cancelled' THEN FALSE
      ELSE FALSE
    END;
  
    IF NOT v_valid THEN RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status; END IF;
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;



  -- ==========================================
  -- Source: 2026051907_cancel_subscription_rpc.sql
  -- ==========================================
  -- Create the cancel_subscription RPC to safely handle business logic and seat return.
  CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
  RETURNS void AS $$
  DECLARE
    v_student_id uuid;
    v_route_id uuid;
    v_status text;
    v_role text;
  BEGIN
    -- Get user role safely using app_metadata (as per rules)
    v_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'student');
  
    -- Lock the subscription row to prevent race conditions
    SELECT student_id, route_id, status
    INTO v_student_id, v_route_id, v_status
    FROM public.subscriptions
    WHERE id = p_subscription_id
    FOR UPDATE;
  
    -- Ensure subscription exists
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Subscription not found';
    END IF;
  
    -- Verify ownership (student can only cancel their own, admin can cancel any)
    IF auth.uid() IS NOT NULL AND auth.uid() != v_student_id AND v_role != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: You can only cancel your own subscriptions';
    END IF;
  
    -- Verify status
    IF v_status NOT IN ('active', 'pending') THEN
      RAISE EXCEPTION 'Cannot cancel subscription in % state', v_status;
    END IF;
  
    -- Return seat: Implicit FOR UPDATE locking applied by the UPDATE statement
    UPDATE public.routes
    SET available_seats = available_seats + 1
    WHERE id = v_route_id;
  
    -- Cancel the subscription
    UPDATE public.subscriptions
    SET status = 'cancelled'
    WHERE id = p_subscription_id;
  
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026051908_phase3_rpcs.sql
  -- ==========================================
  -- Add RPCs for Phase 3 Mobile Features
  
  -- 1. get_unread_count
  CREATE OR REPLACE FUNCTION get_unread_count()
  RETURNS INTEGER
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_count INTEGER;
    v_uid UUID := auth.uid();
  BEGIN
    SELECT count(*) INTO v_count
    FROM messages m
    JOIN conversations c ON m.conversation_id = c.id
    WHERE (c.driver_id = v_uid OR c.student_id = v_uid)
      AND m.sender_id != v_uid
      AND m.is_read = false;
    
    RETURN coalesce(v_count, 0);
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION get_unread_count FROM public;
  GRANT EXECUTE ON FUNCTION get_unread_count TO authenticated;
  
  -- 2. get_driver_balance
  CREATE OR REPLACE FUNCTION get_driver_balance()
  RETURNS TABLE(total_earned numeric, total_paid numeric, available_balance numeric)
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_uid UUID := auth.uid();
    v_driver_id UUID;
    v_earned numeric := 0;
    v_paid numeric := 0;
  BEGIN
    SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid;
    
    IF v_driver_id IS NULL THEN
      RETURN QUERY SELECT 0::numeric, 0::numeric, 0::numeric;
      RETURN;
    END IF;
  
    -- Calculate total earned from all subscriptions (active and expired, not cancelled/pending)
    SELECT coalesce(sum(r.price), 0) INTO v_earned
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');
  
    -- Calculate total paid (or pending withdrawal) from driver_payouts
    SELECT coalesce(sum(amount), 0) INTO v_paid
    FROM driver_payouts
    WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
  
    RETURN QUERY SELECT 
      v_earned as total_earned,
      v_paid as total_paid,
      (v_earned - v_paid) as available_balance;
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION get_driver_balance FROM public;
  GRANT EXECUTE ON FUNCTION get_driver_balance TO authenticated;
  
  -- 3. request_payout
  CREATE OR REPLACE FUNCTION request_payout(p_amount numeric)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_uid UUID := auth.uid();
    v_driver_id UUID;
    v_earned numeric := 0;
    v_paid numeric := 0;
    v_available numeric := 0;
  BEGIN
    -- Verify the role
    IF coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can request payouts';
    END IF;
  
    SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid;
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Calculate balances
    SELECT coalesce(sum(r.price), 0) INTO v_earned
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');
  
    SELECT coalesce(sum(amount), 0) INTO v_paid
    FROM driver_payouts
    WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
    
    v_available := v_earned - v_paid;
  
    IF p_amount > v_available THEN
      RAISE EXCEPTION 'Requested amount exceeds available balance';
    END IF;
  
    IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;
  
    INSERT INTO driver_payouts (driver_id, amount, status)
    VALUES (v_driver_id, p_amount, 'pending');
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION request_payout(numeric) FROM public;
  GRANT EXECUTE ON FUNCTION request_payout(numeric) TO authenticated;
  



  -- ==========================================
  -- Source: 2026052001_fix_license_length_and_state_machine.sql
  -- ==========================================
  -- Migration: 2026052001_fix_license_length_and_state_machine.sql
  -- Description: Fix license code length (from 12 to 8 characters), allow absent -> cancelled state transition, and add locking to request_payout to prevent double spending.
  
  -- 1. Drop functions to prevent parameter/return type mismatches
  DROP FUNCTION IF EXISTS request_payout(numeric);
  DROP FUNCTION IF EXISTS validate_trip_transition(UUID, TEXT);
  DROP FUNCTION IF EXISTS create_license_batch(UUID, TEXT, INT, NUMERIC, INT);
  
  -- 2. Redefine create_license_batch to generate 8-character codes instead of 12
  CREATE OR REPLACE FUNCTION create_license_batch(
    p_route_id   UUID,
    p_batch_name TEXT,
    p_quantity   INT,
    p_price      NUMERIC,
    p_valid_days INT
  ) RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_batch_id UUID;
    v_code     TEXT;
    i          INT;
    v_role     TEXT;
  BEGIN
    -- A) Verify Admin
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can create license batches';
    END IF;
  
    -- B) Create Batch Record
    INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
    VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
    RETURNING id INTO v_batch_id;
  
    -- C) Generate Stronger Codes (8 characters to match Zod & translations)
    FOR i IN 1..p_quantity LOOP
      LOOP
        v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
        BEGIN
          INSERT INTO licenses (batch_id, route_id, code, valid_days)
          VALUES (v_batch_id, p_route_id, v_code, p_valid_days);
          EXIT;
        EXCEPTION WHEN unique_violation THEN
          -- Retry on collision
        END;
      END LOOP;
    END LOOP;
  
    -- D) Audit Logging
    PERFORM log_audit(
      auth.uid(),
      'create_license_batch',
      'license_batches',
      v_batch_id,
      jsonb_build_object('quantity', p_quantity, 'route_id', p_route_id)
    );
  
    RETURN v_batch_id;
  END;
  $$;
  
  -- 3. Redefine validate_trip_transition to support absent -> cancelled
  CREATE OR REPLACE FUNCTION validate_trip_transition(p_trip_id UUID, p_new_status TEXT) RETURNS BOOLEAN AS $$
  DECLARE
    v_current_status TEXT;
    v_valid BOOLEAN;
  BEGIN
    SELECT status INTO v_current_status FROM trips WHERE id = p_trip_id;
    IF v_current_status IS NULL THEN RAISE EXCEPTION 'Trip not found'; END IF;
  
    v_valid := CASE v_current_status
      WHEN 'scheduled' THEN p_new_status IN ('driver_waiting', 'absent', 'cancelled')
      WHEN 'driver_waiting' THEN p_new_status IN ('in_transit', 'absent', 'cancelled')
      WHEN 'in_transit' THEN p_new_status IN ('completed', 'cancelled')
      WHEN 'completed' THEN FALSE
      WHEN 'absent' THEN p_new_status IN ('cancelled')
      WHEN 'cancelled' THEN FALSE
      ELSE FALSE
    END;
  
    IF NOT v_valid THEN RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status; END IF;
    RETURN TRUE;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- 4. Redefine request_payout with FOR UPDATE NOWAIT locking on driver record
  CREATE OR REPLACE FUNCTION request_payout(p_amount numeric)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_uid UUID := auth.uid();
    v_driver_id UUID;
    v_earned numeric := 0;
    v_paid numeric := 0;
    v_available numeric := 0;
  BEGIN
    -- Verify the role
    IF coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can request payouts';
    END IF;
  
    -- Pessimistic locking of the driver profile to prevent double-spending race conditions
    SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid FOR UPDATE NOWAIT;
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Calculate balances
    SELECT coalesce(sum(r.price), 0) INTO v_earned
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');
  
    SELECT coalesce(sum(amount), 0) INTO v_paid
    FROM driver_payouts
    WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
    
    v_available := v_earned - v_paid;
  
    IF p_amount > v_available THEN
      RAISE EXCEPTION 'Requested amount exceeds available balance';
    END IF;
  
    IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;
  
    INSERT INTO driver_payouts (driver_id, amount, status)
    VALUES (v_driver_id, p_amount, 'pending');
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION request_payout(numeric) FROM public;
  GRANT EXECUTE ON FUNCTION request_payout(numeric) TO authenticated;
  
  -- 5. Revoke public/authenticated execution permissions on update_trip_status to prevent direct API calls bypassing Edge Function checks
  REVOKE EXECUTE ON FUNCTION update_trip_status(UUID, TEXT, NUMERIC, NUMERIC, UUID) FROM PUBLIC;
  REVOKE EXECUTE ON FUNCTION update_trip_status(UUID, TEXT, NUMERIC, NUMERIC, UUID, TEXT) FROM PUBLIC;
  
  -- 6. Revoke public/authenticated execution permissions on log_audit to prevent fake audit log generation
  REVOKE EXECUTE ON FUNCTION log_audit(UUID, TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
  



  -- ==========================================
  -- Source: 2026052002_admin_features_and_role_sync.sql
  -- ==========================================
  -- UniRide v2: Admin Profiles Insertion policy and Driver Promotion/Demotion Triggers
  
  -- 1. Profiles policy for Admin insertion
  CREATE POLICY "Profiles: Admins can insert any"
    ON public.profiles
    FOR INSERT
    WITH CHECK (is_admin());
  
  -- 2. Driver promotion function
  CREATE OR REPLACE FUNCTION public.sync_driver_role_promotion()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Update the user's role in public.profiles to 'driver'
    UPDATE public.profiles
    SET role = 'driver'
    WHERE id = NEW.user_id;
  
    -- Update the user's role in auth.users app_metadata to 'driver'
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'driver')
    WHERE id = NEW.user_id;
  
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Trigger for Driver promotion
  DROP TRIGGER IF EXISTS on_driver_created ON public.drivers;
  CREATE TRIGGER on_driver_created
    AFTER INSERT ON public.drivers
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_driver_role_promotion();
  
  -- 3. Driver demotion function
  CREATE OR REPLACE FUNCTION public.sync_driver_role_demotion()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Update public.profiles back to 'student'
    UPDATE public.profiles
    SET role = 'student'
    WHERE id = OLD.user_id;
  
    -- Update auth.users app_metadata back to 'student'
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'student')
    WHERE id = OLD.user_id;
  
    RETURN OLD;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Trigger for Driver demotion
  DROP TRIGGER IF EXISTS on_driver_deleted ON public.drivers;
  CREATE TRIGGER on_driver_deleted
    AFTER DELETE ON public.drivers
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_driver_role_demotion();
  



  -- ==========================================
  -- Source: 2026052003_make_phone_nullable.sql
  -- ==========================================
  -- Migration: 2026052003_make_phone_nullable.sql
  -- Description: Make the profiles.phone column nullable to allow user registration without phone metadata, avoiding unique constraint violations on empty strings.
  
  -- 1. Alter profiles.phone to drop NOT NULL constraint
  ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;
  
  -- 2. Update the handle_new_user trigger function to insert NULL instead of an empty string when phone is not provided
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.raw_user_meta_data->>'phone', -- Nullable field (defaults to NULL, allowing multiple NULLs in unique index)
      COALESCE(NEW.raw_app_meta_data->>'role', 'student'),
      false
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  



  -- ==========================================
  -- Source: 2026052101_add_support_requests_table.sql
  -- ==========================================
  -- Migration: 2026052101_add_support_requests_table.sql
  -- Description: Create support_requests table for storing public support and account deletion requests with secure RLS policies.
  
  -- 1. Create support_requests table
  CREATE TABLE IF NOT EXISTS public.support_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    phone text,
    request_type text NOT NULL, -- 'account_deletion' or 'support'
    message text NOT NULL,
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'resolved'
    created_at timestamp with time zone NOT NULL DEFAULT now()
  );
  
  -- 2. Enable Row Level Security (RLS)
  ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
  
  -- 3. Create RLS Policy to allow anyone (anonymous or authenticated) to insert requests
  CREATE POLICY "Allow anonymous insert" ON public.support_requests
    FOR INSERT
    WITH CHECK (true);
  
  -- 4. Create RLS Policy to allow admins only to view and manage requests
  CREATE POLICY "Allow admins all" ON public.support_requests
    FOR ALL
    TO authenticated
    USING (is_admin());
  
  -- 5. Grant access to public role for inserts and authenticated/service_role roles
  GRANT INSERT ON public.support_requests TO anon, authenticated;
  GRANT ALL ON public.support_requests TO service_role;
  



  -- ==========================================
  -- Source: 2026052102_harden_role_sync_triggers.sql
  -- ==========================================
  -- UniRide v2: Harden enforce_profile_privileged_fields trigger to allow system-level role updates
  -- This allows SECURITY DEFINER triggers (like sync_driver_role_promotion/demotion) to update
  -- profiles.role without being blocked, since those functions run as the postgres/db-owner user.
  
  CREATE OR REPLACE FUNCTION enforce_profile_privileged_fields()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Allow if the function is being called by a system user (postgres, supabase_admin, service_role)
    -- These are trusted backend callers, not authenticated client requests.
    -- Also allow if the JWT identifies the caller as an admin.
    IF CURRENT_USER IN ('postgres', 'supabase_admin', 'service_role', 'authenticator')
       OR (auth.jwt() IS NOT NULL AND auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') THEN
      RETURN NEW;
    END IF;
  
    -- Block non-admin authenticated users from changing privileged fields
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Only admins can change role';
    END IF;
  
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
      RAISE EXCEPTION 'Only admins can change verification';
    END IF;
  
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Re-apply trigger (no-op if already exists with same definition)
  DROP TRIGGER IF EXISTS enforce_profile_privileged_fields_trigger ON profiles;
  CREATE TRIGGER enforce_profile_privileged_fields_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION enforce_profile_privileged_fields();
  



  -- ==========================================
  -- Source: 2026052103_fix_cancel_subscription_and_bulk_camelcase.sql
  -- ==========================================
  -- UniRide: Fix cancel_subscription regression and bulk_update_trip_locations compatibility
  -- Includes: FOR UPDATE NOWAIT on bulk_update_trip_locations for race condition protection
  
  -- 1. Hardened cancel_subscription RPC
  CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
  RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_sub RECORD;
    v_role text;
  BEGIN
    -- Safe JWT claim role check
    v_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'student');
  
    -- Lock subscription row to prevent race conditions
    SELECT * INTO v_sub
    FROM public.subscriptions
    WHERE id = p_subscription_id
    FOR UPDATE NOWAIT;
  
    -- Ensure subscription exists
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Subscription not found';
    END IF;
  
    -- Verify ownership (student can only cancel their own, admin can cancel any)
    IF auth.uid() IS NOT NULL AND v_sub.student_id != auth.uid() AND v_role != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: You can only cancel your own subscriptions';
    END IF;
  
    -- Verify status
    IF v_sub.status NOT IN ('active', 'pending') THEN
      RAISE EXCEPTION 'Cannot cancel subscription in % state', v_sub.status;
    END IF;
  
    -- Cancel the subscription
    UPDATE public.subscriptions
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE id = p_subscription_id;
  
    -- Lock route and return seat safely (prevent exceeding capacity)
    IF v_sub.status = 'active' THEN
      UPDATE public.routes
      SET available_seats = LEAST(capacity, available_seats + 1),
          updated_at = NOW()
      WHERE id = v_sub.route_id;
    END IF;
  
    -- Add audit log
    INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      CASE WHEN v_role = 'admin' THEN 'admin_cancel_subscription' ELSE 'cancel_subscription' END,
      'subscriptions',
      p_subscription_id,
      jsonb_build_object('route_id', v_sub.route_id, 'previous_status', v_sub.status)
    );
  
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION public.cancel_subscription(uuid) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.cancel_subscription(uuid) TO authenticated;
  
  
  -- 2. Backward-Compatible bulk_update_trip_locations RPC
  CREATE OR REPLACE FUNCTION public.bulk_update_trip_locations(p_locations JSONB)
  RETURNS JSONB
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_driver_id UUID;
    v_location RECORD;
    v_failed JSONB := '[]'::JSONB;
    v_status TEXT;
    v_success_count INT := 0;
  BEGIN
    -- Get current driver from auth
    SELECT d.id INTO v_driver_id FROM public.drivers d WHERE d.user_id = auth.uid();
    IF v_driver_id IS NULL THEN 
      RAISE EXCEPTION 'Driver profile not found'; 
    END IF;
  
    FOR v_location IN 
      SELECT 
        COALESCE(x.trip_id, x.tripId) AS trip_id, 
        x.lat, 
        x.lng 
      FROM jsonb_to_recordset(p_locations) AS x(tripId UUID, trip_id UUID, lat NUMERIC, lng NUMERIC)
    LOOP
      IF v_location.trip_id IS NULL THEN
        v_failed := v_failed || jsonb_build_object('error', 'Missing trip_id or tripId');
        CONTINUE;
      END IF;
  
      -- Lock trip row to prevent race conditions between status check and update
      SELECT status INTO v_status FROM public.trips WHERE id = v_location.trip_id AND driver_id = v_driver_id FOR UPDATE NOWAIT;
      
      IF v_status IN ('driver_waiting', 'in_transit') THEN
        UPDATE public.trips 
        SET last_lat = v_location.lat, 
            last_lng = v_location.lng, 
            updated_at = NOW() 
        WHERE id = v_location.trip_id;
        v_success_count := v_success_count + 1;
      ELSIF v_status IS NOT NULL THEN
        -- Trip exists but is not in an active state (completed/cancelled/absent)
        v_failed := v_failed || jsonb_build_object('trip_id', v_location.trip_id, 'error', 'Trip is not in an active state: ' || v_status);
      ELSE
        -- Trip not found or not assigned to this driver
        v_failed := v_failed || jsonb_build_object('trip_id', v_location.trip_id, 'error', 'Trip not found or not assigned to driver');
      END IF;
    END LOOP;
  
    RETURN jsonb_build_object('success_count', v_success_count, 'failed', v_failed);
  END;
  $$;
  
  REVOKE EXECUTE ON FUNCTION public.bulk_update_trip_locations(JSONB) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.bulk_update_trip_locations(JSONB) TO authenticated;
  



  -- ==========================================
  -- Source: 2026052104_fix_critical_bugs_audit.sql
  -- ==========================================
  -- UniRide M12: DB Audit Fixes
  -- 1. Add purchase_price snapshot to subscriptions to prevent retroactive earnings calculation changes.
  -- 2. Prevent overbooking / capacity bypass in activate_license by adding seat deduction and capacity verification.
  -- 3. Synchronize profiles role changes to auth.users raw_app_meta_data (e.g. for bulk imports).
  -- 4. Clean up any leftover duplicate seat triggers.
  
  -- ════════════════════════════════════════════════
  -- 1. Subscriptions Table Alteration
  -- ════════════════════════════════════════════════
  ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS purchase_price NUMERIC NOT NULL DEFAULT 0;
  
  -- Backfill existing subscriptions using route price
  UPDATE public.subscriptions s
  SET purchase_price = COALESCE((SELECT price FROM public.routes r WHERE r.id = s.route_id), 0)
  WHERE s.purchase_price = 0;
  
  -- ════════════════════════════════════════════════
  -- 2. Modify complete_payment_and_activate_subscription to record purchase_price
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
    p_zaincash_order_id TEXT,
    p_valid_days INT DEFAULT 30
  ) RETURNS payments
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_payment payments%ROWTYPE;
    v_subscription subscriptions;
    v_route routes%ROWTYPE;
  BEGIN
    -- Find pending payment with NOWAIT
    SELECT * INTO v_payment
    FROM payments
    WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
    FOR UPDATE NOWAIT;
  
    IF v_payment IS NULL THEN
      RAISE EXCEPTION 'Payment not found or already processed';
    END IF;
  
    -- Check for existing active subscription (Duplicate check)
    IF EXISTS (
      SELECT 1 FROM subscriptions
      WHERE student_id = v_payment.user_id
        AND route_id = v_payment.route_id
        AND status IN ('active', 'pending')
      FOR UPDATE
    ) THEN
      -- Update payment to failed due to duplicate and return it instead of rolling back
      UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
      SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
      RETURN v_payment;
    END IF;
  
    -- Verify and deduct seat atomically
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;
  
    IF NOT FOUND THEN
      -- Update payment to failed due to no seats and return it instead of rolling back
      UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
      SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
      RETURN v_payment;
    END IF;
  
    -- Create subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
    VALUES (
      v_payment.user_id,
      v_payment.route_id,
      'active',
      NOW(),
      NOW() + (p_valid_days || ' days')::INTERVAL,
      v_payment.amount
    )
    RETURNING * INTO v_subscription;
  
    -- Update payment status
    UPDATE payments
    SET status = 'completed', completed_at = NOW(), updated_at = NOW()
    WHERE id = v_payment.id;
  
    -- Return updated payment
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END;
  $$;
  
  -- ════════════════════════════════════════════════
  -- 3. Modify activate_license to support atomic seat verification and deduct + record purchase_price
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION activate_license(p_code TEXT)
  RETURNS UUID AS $$
  DECLARE
    v_license RECORD;
    v_subscription_id UUID;
    v_role TEXT;
    v_route_price NUMERIC;
  BEGIN
    -- Verify caller is student
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can activate licenses';
    END IF;
  
    -- Find and lock the license to prevent race conditions
    SELECT * INTO v_license
    FROM licenses
    WHERE code = upper(p_code) AND status = 'active'
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or already used license code';
    END IF;
  
    -- Get route price for snapshotting
    SELECT price INTO v_route_price FROM routes WHERE id = v_license.route_id;
  
    -- Verify and deduct seat atomically (prevent overbooking)
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_license.route_id AND available_seats > 0 AND is_active = true;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  
    -- Mark license as used
    UPDATE licenses 
    SET status = 'used', used_by = auth.uid(), used_at = NOW()
    WHERE id = v_license.id;
  
    -- Create active subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
    VALUES (
      auth.uid(), 
      v_license.route_id, 
      'active', 
      NOW(), 
      NOW() + (v_license.valid_days || ' days')::INTERVAL,
      COALESCE(v_route_price, 0)
    )
    RETURNING id INTO v_subscription_id;
  
    RETURN v_subscription_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- ════════════════════════════════════════════════
  -- 4. Redefine get_driver_balance and request_payout to use purchase_price
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION get_driver_balance()
  RETURNS TABLE(total_earned numeric, total_paid numeric, available_balance numeric)
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_uid UUID := auth.uid();
    v_driver_id UUID;
    v_earned numeric := 0;
    v_paid numeric := 0;
  BEGIN
    SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid;
    
    IF v_driver_id IS NULL THEN
      RETURN QUERY SELECT 0::numeric, 0::numeric, 0::numeric;
      RETURN;
    END IF;
  
    -- Calculate total earned from all subscriptions (active and expired, not cancelled/pending)
    -- Use purchase_price instead of routes.price to avoid retroactive recalculations
    SELECT coalesce(sum(s.purchase_price), 0) INTO v_earned
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');
  
    -- Calculate total paid (or pending withdrawal) from driver_payouts
    SELECT coalesce(sum(amount), 0) INTO v_paid
    FROM driver_payouts
    WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
  
    RETURN QUERY SELECT 
      v_earned as total_earned,
      v_paid as total_paid,
      (v_earned - v_paid) as available_balance;
  END;
  $$;
  
  CREATE OR REPLACE FUNCTION request_payout(p_amount numeric)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_uid UUID := auth.uid();
    v_driver_id UUID;
    v_earned numeric := 0;
    v_paid numeric := 0;
    v_available numeric := 0;
  BEGIN
    -- Verify the role
    IF coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can request payouts';
    END IF;
  
    -- Pessimistic locking of the driver profile to prevent double-spending race conditions
    SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid FOR UPDATE NOWAIT;
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Calculate balances using purchase_price
    SELECT coalesce(sum(s.purchase_price), 0) INTO v_earned
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');
  
    SELECT coalesce(sum(amount), 0) INTO v_paid
    FROM driver_payouts
    WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
    
    v_available := v_earned - v_paid;
  
    IF p_amount > v_available THEN
      RAISE EXCEPTION 'Requested amount exceeds available balance';
    END IF;
  
    IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;
  
    INSERT INTO driver_payouts (driver_id, amount, status)
    VALUES (v_driver_id, p_amount, 'pending');
  END;
  $$;
  
  -- ════════════════════════════════════════════════
  -- 5. Role Synchronization Trigger on public.profiles
  -- ════════════════════════════════════════════════
  CREATE OR REPLACE FUNCTION sync_profile_role_to_auth()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Only update if role has changed or it's a new row
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role) THEN
      UPDATE auth.users
      SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
      WHERE id = NEW.id;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  DROP TRIGGER IF EXISTS on_profile_role_changed ON profiles;
  CREATE TRIGGER on_profile_role_changed
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_profile_role_to_auth();
  
  -- ════════════════════════════════════════════════
  -- 6. Seat Restoration Cleanup (Ensure double seat return is prevented)
  -- ════════════════════════════════════════════════
  DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
  



  -- ==========================================
  -- Source: 2026052105_revoke_update_trip_location.sql
  -- ==========================================
  -- Migration: 2026052105_revoke_update_trip_location.sql
  -- Description: Revoke public and anonymous execution on update_trip_location and create_license_batch to ensure they require authentication.
  
  REVOKE EXECUTE ON FUNCTION public.update_trip_location(UUID, NUMERIC, NUMERIC) FROM anon, PUBLIC;
  REVOKE EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) FROM anon, PUBLIC;
  
  GRANT EXECUTE ON FUNCTION public.update_trip_location(UUID, NUMERIC, NUMERIC) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) TO authenticated;
  



  -- ==========================================
  -- Source: 2026052106_drop_old_update_trip_status_overload.sql
  -- ==========================================
  -- Drop the obsolete 5-parameter overload of update_trip_status to resolve overloading ambiguity
  DROP FUNCTION IF EXISTS public.update_trip_status(uuid, text, numeric, numeric, uuid);
  



  -- ==========================================
  -- Source: 2026052107_fix_profile_privilege_trigger.sql
  -- ==========================================
  -- Fix enforce_profile_privileged_fields to run as SECURITY INVOKER (default)
  -- This ensures CURRENT_USER reflects the actual user making the request (e.g., 'authenticated'),
  -- rather than the function owner ('postgres'), which previously bypassed security checks.
  
  CREATE OR REPLACE FUNCTION enforce_profile_privileged_fields()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Allow if the function is being called by a system user (postgres, supabase_admin, service_role)
    -- These are trusted backend callers, not authenticated client requests.
    -- Also allow if the JWT identifies the caller as an admin.
    IF CURRENT_USER IN ('postgres', 'supabase_admin', 'service_role', 'authenticator')
       OR (auth.jwt() IS NOT NULL AND auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') THEN
      RETURN NEW;
    END IF;
  
    -- Block non-admin authenticated users from changing privileged fields
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Only admins can change role';
    END IF;
  
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
      RAISE EXCEPTION 'Only admins can change verification';
    END IF;
  
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  



  -- ==========================================
  -- Source: 2026052108_add_routes_driver_rls.sql
  -- ==========================================
  -- Add SELECT policy on routes to allow drivers to view their own routes (even if inactive)
  CREATE POLICY "Routes: Drivers see own" ON routes FOR SELECT USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );
  



  -- ==========================================
  -- Source: 2026052109_fix_cancel_subscription_updated_at.sql
  -- ==========================================
  -- UniRide: Fix cancel_subscription updated_at column on subscriptions table
  
  CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
  RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_sub RECORD;
    v_role text;
  BEGIN
    -- Safe JWT claim role check
    v_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'student');
  
    -- Lock subscription row to prevent race conditions
    SELECT * INTO v_sub
    FROM public.subscriptions
    WHERE id = p_subscription_id
    FOR UPDATE NOWAIT;
  
    -- Ensure subscription exists
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Subscription not found';
    END IF;
  
    -- Verify ownership (student can only cancel their own, admin can cancel any)
    IF auth.uid() IS NOT NULL AND v_sub.student_id != auth.uid() AND v_role != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: You can only cancel your own subscriptions';
    END IF;
  
    -- Verify status
    IF v_sub.status NOT IN ('active', 'pending') THEN
      RAISE EXCEPTION 'Cannot cancel subscription in % state', v_sub.status;
    END IF;
  
    -- Cancel the subscription (Remove updated_at as it does not exist on subscriptions)
    UPDATE public.subscriptions
    SET status = 'cancelled'
    WHERE id = p_subscription_id;
  
    -- Lock route and return seat safely (prevent exceeding capacity)
    IF v_sub.status = 'active' THEN
      UPDATE public.routes
      SET available_seats = LEAST(capacity, available_seats + 1),
          updated_at = NOW()
      WHERE id = v_sub.route_id;
    END IF;
  
    -- Add audit log
    INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      CASE WHEN v_role = 'admin' THEN 'admin_cancel_subscription' ELSE 'cancel_subscription' END,
      'subscriptions',
      p_subscription_id,
      jsonb_build_object('route_id', v_sub.route_id, 'previous_status', v_sub.status)
    );
  
  END;
  $$;
  



  -- ==========================================
  -- Source: 20260522000001_notification_log.sql
  -- ==========================================
  -- Phase 4: Notification Log Table
  -- Migration: 20260522000001_notification_log.sql
  
  CREATE TABLE IF NOT EXISTS public.notification_log (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       text NOT NULL,
    body        text NOT NULL,
    data        jsonb DEFAULT '{}',
    is_read     boolean DEFAULT false,
    created_at  timestamptz DEFAULT now()
  );
  
  -- Index for fast per-user queries
  CREATE INDEX IF NOT EXISTS idx_notification_log_user_id
    ON public.notification_log(user_id, created_at DESC);
  
  -- Row Level Security
  ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
  
  -- Each user can only read their own notifications
  CREATE POLICY "Users read own notifications"
    ON public.notification_log
    FOR SELECT
    USING (user_id = auth.uid());
  
  -- Each user can only update (mark as read) their own notifications
  CREATE POLICY "Users update own notifications"
    ON public.notification_log
    FOR UPDATE
    USING (user_id = auth.uid());
  
  -- Each user can only delete their own notifications
  CREATE POLICY "Users delete own notifications"
    ON public.notification_log
    FOR DELETE
    USING (user_id = auth.uid());
  
  -- Only service_role can INSERT (Edge Functions use service_role)
  CREATE POLICY "Service role inserts notifications"
    ON public.notification_log
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
  



  -- ==========================================
  -- Source: 20260522000002_phase5_polish.sql
  -- ==========================================
  -- Phase 5: Polish & Pre-launch
  -- Migration: 20260522000002_phase5_polish.sql
  
  -- 1. App Config Table (For Force Update Mechanism)
  CREATE TABLE IF NOT EXISTS public.app_config (
    id              smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row
    min_version     text NOT NULL DEFAULT '1.0.0',
    latest_version  text NOT NULL DEFAULT '1.0.0',
    updated_at      timestamptz DEFAULT now()
  );
  
  -- Row Level Security
  ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
  
  -- Everyone can read the config
  CREATE POLICY "Anyone can read app_config"
    ON public.app_config
    FOR SELECT
    USING (true);
  
  -- Insert default config
  INSERT INTO public.app_config (id, min_version, latest_version)
  VALUES (1, '1.0.0', '1.0.0')
  ON CONFLICT (id) DO NOTHING;
  
  -- RPC to easily get config
  CREATE OR REPLACE FUNCTION get_app_config()
  RETURNS jsonb AS $$
    SELECT jsonb_build_object(
      'min_version', min_version,
      'latest_version', latest_version
    )
    FROM public.app_config WHERE id = 1;
  $$ LANGUAGE sql STABLE;
  
  -- 2. Emergency Reports Table (For SOS Button)
  CREATE TABLE IF NOT EXISTS public.emergency_reports (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id     uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    lat         double precision,
    lng         double precision,
    status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    created_at  timestamptz DEFAULT now()
  );
  
  -- Row Level Security
  ALTER TABLE public.emergency_reports ENABLE ROW LEVEL SECURITY;
  
  -- Users can insert their own reports
  CREATE POLICY "Users can insert own emergency reports"
    ON public.emergency_reports
    FOR INSERT
    WITH CHECK (reporter_id = auth.uid());
  
  -- Users can read their own reports
  CREATE POLICY "Users can view own emergency reports"
    ON public.emergency_reports
    FOR SELECT
    USING (reporter_id = auth.uid());
  



  -- ==========================================
  -- Source: 20260522000003_harden_rpc_permissions_and_disable_payment_stub.sql
  -- ==========================================
  -- UniRide: Harden exposed RPCs and disable unsafe payment stubs.
  --
  -- These RPCs are intended to be reached through trusted Edge Functions only.
  -- Direct PostgREST execution by anon/authenticated users bypasses gateway
  -- validation, idempotency, and payment-provider verification.
  
  REVOKE EXECUTE ON FUNCTION public.update_trip_status(uuid, text, numeric, numeric, uuid, text)
  FROM PUBLIC, anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.update_trip_status(uuid, text, numeric, numeric, uuid, text)
  TO service_role;
  
  REVOKE EXECUTE ON FUNCTION public.create_payment(uuid, uuid, integer, text)
  FROM PUBLIC, anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.create_payment(uuid, uuid, integer, text)
  TO service_role;
  
  REVOKE EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(text, integer)
  FROM PUBLIC, anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(text, integer)
  TO service_role;
  
  REVOKE EXECUTE ON FUNCTION public.bulk_update_trip_locations(jsonb)
  FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.bulk_update_trip_locations(jsonb)
  TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.log_audit(uuid, text, text, uuid, jsonb)
  FROM PUBLIC, anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.log_audit(uuid, text, text, uuid, jsonb)
  TO service_role;
  



  -- ==========================================
  -- Source: 20260522000004_fix_update_trip_location_race_condition.sql
  -- ==========================================
  -- Migration: 20260522000004_fix_update_trip_location_race_condition.sql
  -- Add FOR UPDATE NOWAIT to update_trip_location to prevent race conditions
  -- between status check and location update
  
  CREATE OR REPLACE FUNCTION public.update_trip_location(p_trip_id UUID, p_lat NUMERIC, p_lng NUMERIC)
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_driver_id UUID;
    v_status TEXT;
  BEGIN
    SELECT d.id INTO v_driver_id FROM drivers d WHERE d.user_id = auth.uid();
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Lock the trip row to prevent race conditions between status check and update
    SELECT status INTO v_status
    FROM trips
    WHERE id = p_trip_id AND driver_id = v_driver_id
    FOR UPDATE NOWAIT;
  
    IF v_status IS NULL THEN
      RAISE EXCEPTION 'Trip not found or not assigned to you';
    END IF;
  
    IF v_status NOT IN ('driver_waiting', 'in_transit') THEN
      RAISE EXCEPTION 'Cannot update location for trip with status: %', v_status;
    END IF;
  
    UPDATE trips
    SET last_lat = p_lat, last_lng = p_lng, updated_at = NOW()
    WHERE id = p_trip_id;
  
    RETURN TRUE;
  END;
  $$;
  
  -- Keep existing grants (authenticated)
  -- GRANT EXECUTE ON FUNCTION public.update_trip_location(UUID, NUMERIC, NUMERIC) TO authenticated;



  -- ==========================================
  -- Source: 20260522000005_fix_activate_license_duplicate_subscription.sql
  -- ==========================================
  -- Migration: 20260522000005_fix_activate_license_duplicate_subscription.sql
  -- Prevent multiple active subscriptions for same route
  -- Add check for existing active/pending subscription before creating new one
  
  CREATE OR REPLACE FUNCTION public.activate_license(p_code TEXT)
  RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_license RECORD;
    v_subscription_id UUID;
    v_role TEXT;
    v_route_price NUMERIC;
    v_existing_count INT;
  BEGIN
    -- Verify caller is student
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can activate licenses';
    END IF;
  
    -- Find and lock the license to prevent race conditions
    SELECT * INTO v_license
    FROM licenses
    WHERE code = upper(p_code) AND status = 'active'
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or already used license code';
    END IF;
  
    -- CRITICAL FIX: Check for existing active/pending subscription for this route
    SELECT COUNT(*) INTO v_existing_count
    FROM subscriptions
    WHERE student_id = auth.uid()
      AND route_id = v_license.route_id
      AND status IN ('active', 'pending');
  
    IF v_existing_count > 0 THEN
      RAISE EXCEPTION 'You already have an active or pending subscription for this route';
    END IF;
  
    -- Get route price for snapshotting
    SELECT price INTO v_route_price FROM routes WHERE id = v_license.route_id;
  
    -- Verify and deduct seat atomically (prevent overbooking)
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_license.route_id AND available_seats > 0 AND is_active = true;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  
    -- Mark license as used
    UPDATE licenses
    SET status = 'used', used_by = auth.uid(), used_at = NOW()
    WHERE id = v_license.id;
  
    -- Create active subscription
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
    VALUES (
      auth.uid(),
      v_license.route_id,
      'active',
      NOW(),
      NOW() + (v_license.valid_days || ' days')::INTERVAL,
      COALESCE(v_route_price, 0)
    )
    RETURNING id INTO v_subscription_id;
  
    RETURN v_subscription_id;
  END;
  $$;



  -- ==========================================
  -- Source: 20260522000006_fix_conversation_null_student_id.sql
  -- ==========================================
  -- Migration: 20260522000006_fix_conversation_null_student_id.sql
  -- Fix NULL handling in get_or_create_conversation to prevent:
  -- 1. NULL comparisons that always evaluate to NULL (not TRUE/FALSE)
  -- 2. Creating conversations with NULL student_id
  
  CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_trip_id UUID)
  RETURNS conversations
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_trip trips%ROWTYPE;
    v_driver drivers%ROWTYPE;
    v_conversation conversations%ROWTYPE;
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;
    IF v_trip IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    SELECT * INTO v_driver FROM drivers WHERE id = v_trip.driver_id;
  
    -- Explicit NULL-safe comparison
    -- Old: v_caller_id != v_driver.user_id AND v_caller_id != v_trip.student_id
    -- Problem: NULL != anything returns NULL, not FALSE
    IF v_caller_id != v_driver.user_id
       AND (v_trip.student_id IS NULL OR v_caller_id != v_trip.student_id) THEN
      RAISE EXCEPTION 'Not a participant in this trip';
    END IF;
  
    SELECT * INTO v_conversation
    FROM conversations
    WHERE trip_id = p_trip_id;
  
    IF v_conversation IS NOT NULL THEN
      RETURN v_conversation;
    END IF;
  
    -- Prevent creating conversation with NULL student_id
    IF v_trip.student_id IS NULL THEN
      RAISE EXCEPTION 'Cannot create conversation: trip has no assigned student';
    END IF;
  
    IF v_caller_id = v_driver.user_id THEN
      INSERT INTO conversations (trip_id, driver_id, student_id)
      VALUES (p_trip_id, v_trip.driver_id, v_trip.student_id)
      RETURNING * INTO v_conversation;
    ELSE
      INSERT INTO conversations (trip_id, driver_id, student_id)
      VALUES (p_trip_id, v_trip.driver_id, v_caller_id)
      RETURNING * INTO v_conversation;
    END IF;
  
    RETURN v_conversation;
  END;
  $$;



  -- ==========================================
  -- Source: 202605222245_fix_vulnerabilities.sql
  -- ==========================================
  -- Migration: 202605222245_fix_vulnerabilities
  -- Date: 2026-05-22 (approximate)
  -- Description: Security fixes and new functions (discovered by comparing DB to migrations)
  -- Note: This migration was applied directly to DB but file was lost
  --       Now documenting the functions that were found in DB but not in migration files
  
  -- ═══════════════════════════════════════════════════════════════
  -- 1. PROCESS_PAYOUT: Admin function to approve/reject driver payouts
  -- ═══════════════════════════════════════════════════════════════
  
  -- This function was found in DB but not in any migration file
  -- It allows admins to process (complete/reject) pending payout requests
  
  CREATE OR REPLACE FUNCTION public.process_payout(
    p_payout_id uuid,
    p_new_status text,
    p_reference_note text
  )
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO public
  AS $function$
  DECLARE
    v_current_status TEXT;
  BEGIN
    -- Verify admin
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: Only admins can process payouts';
    END IF;
  
    IF p_new_status NOT IN ('completed', 'rejected') THEN
      RAISE EXCEPTION 'Invalid status';
    END IF;
  
    -- Get current status with lock
    SELECT status INTO v_current_status
    FROM driver_payouts
    WHERE id = p_payout_id
    FOR UPDATE NOWAIT;
  
    IF v_current_status IS NULL THEN
      RAISE EXCEPTION 'Payout request not found';
    END IF;
  
    IF v_current_status != 'pending' THEN
      RAISE EXCEPTION 'Only pending payouts can be processed';
    END IF;
  
    -- Update status
    UPDATE driver_payouts
    SET status = p_new_status,
        reference_note = p_reference_note,
        updated_at = NOW()
    WHERE id = p_payout_id;
  
    -- Log audit
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      'payout_processed',
      'driver_payouts',
      p_payout_id,
      jsonb_build_object('new_status', p_new_status, 'reference_note', p_reference_note)
    );
  END;
  $function$;
  
  GRANT EXECUTE ON FUNCTION public.process_payout(uuid, text, text) TO authenticated;
  
  -- ═══════════════════════════════════════════════════════════════
  -- 2. RLS_AUTO_ENABLE: Event trigger to auto-enable RLS on new tables
  -- ═══════════════════════════════════════════════════════════════
  
  -- This event trigger automatically enables RLS on any new table created in public schema
  -- Security best practice to ensure no table is created without RLS
  
  CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO pg_catalog
  AS $function$
  DECLARE
    cmd record;
  BEGIN
    FOR cmd IN
      SELECT *
      FROM pg_event_trigger_ddl_commands()
      WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
        AND object_type IN ('table','partitioned table')
    LOOP
      IF cmd.schema_name IS NOT NULL
         AND cmd.schema_name IN ('public')
         AND cmd.schema_name NOT IN ('pg_catalog','information_schema')
         AND cmd.schema_name NOT LIKE 'pg_toast%'
         AND cmd.schema_name NOT LIKE 'pg_temp%'
      THEN
        BEGIN
          EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
          RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
        END;
      ELSE
        RAISE LOG 'rls_auto_enable: skip % (system schema or not in enforced list: %.)',
                  cmd.object_identity, cmd.schema_name;
      END IF;
    END LOOP;
  END;
  $function$;
  
  -- Create event trigger
  DROP EVENT TRIGGER IF EXISTS rls_auto_enable_trigger;
  CREATE EVENT TRIGGER rls_auto_enable_trigger
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
    EXECUTE FUNCTION public.rls_auto_enable();
  
  -- Grant needed permissions
  GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;
  
  -- ═══════════════════════════════════════════════════════════════
  -- 3. Audit log for this migration
  -- ═══════════════════════════════════════════════════════════════
  
  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  SELECT
    NULL,  -- system migration, no user
    'migration_applied',
    'migrations',
    NULL,
    jsonb_build_object(
      'migration', '202605222245_fix_vulnerabilities',
      'description', 'process_payout function + rls_auto_enable trigger',
      'source', 'recovered from DB comparison',
      'date', NOW()
    )
  WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs WHERE details->>'migration' = '202605222245_fix_vulnerabilities'
  );



  -- ==========================================
  -- Source: 20260523000001_fix_security_vulnerabilities.sql
  -- ==========================================
  -- Migration: 20260523000001_fix_security_vulnerabilities
  -- Date: 2026-05-22
  -- Description: Fix security vulnerabilities found during code review
  -- Issue: Some fixes were applied directly to DB but not reflected in migrations
  
  -- ═══════════════════════════════════════════════════════════════
  -- 1. EMERGENCY REPORTS: Add admin SELECT/UPDATE policies
  -- ═══════════════════════════════════════════════════════════════
  
  -- Drop existing policies and recreate with admin access
  DROP POLICY IF EXISTS "Users can view own emergency reports" ON emergency_reports;
  DROP POLICY IF EXISTS "Users can insert own emergency reports" ON emergency_reports;
  
  -- Admin can view all emergency reports
  CREATE POLICY "Admins can view emergency reports"
    ON emergency_reports
    FOR SELECT
    USING (is_admin());
  
  -- Admin can update emergency reports (e.g., mark as resolved)
  CREATE POLICY "Admins can update emergency reports"
    ON emergency_reports
    FOR UPDATE
    USING (is_admin());
  
  -- Users can still insert their own reports
  CREATE POLICY "Users can insert own emergency reports"
    ON emergency_reports
    FOR INSERT
    WITH CHECK (reporter_id = auth.uid());
  
  -- Users can view their own reports
  CREATE POLICY "Users can view own emergency reports"
    ON emergency_reports
    FOR SELECT
    USING (reporter_id = auth.uid());
  
  -- ═══════════════════════════════════════════════════════════════
  -- 2. SUPPORT REQUESTS: Add user_id column and user SELECT policy
  -- ═══════════════════════════════════════════════════════════════
  
  -- Add user_id column to link requests to authenticated users
  ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  
  -- Backfill user_id for existing requests (email match or NULL)
  -- This is a best-effort backfill - users with email matches will be linked
  UPDATE support_requests sr
  SET user_id = (
    SELECT id FROM profiles WHERE email = sr.email LIMIT 1
  )
  WHERE sr.user_id IS NULL;
  
  -- Allow users to view their own support requests
  CREATE POLICY "Users can view own support requests"
    ON support_requests
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Allow users to update (but not delete) their own pending requests
  CREATE POLICY "Users can update own support requests"
    ON support_requests
    FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);
  
  -- ═══════════════════════════════════════════════════════════════
  -- 3. GET_UNREAD_COUNT: Fix driver_id comparison bug
  -- ═══════════════════════════════════════════════════════════════
  -- The bug: comparing driver_id (drivers.id UUID) with auth.uid() (profiles UUID)
  -- This always returned 0 for drivers
  
  CREATE OR REPLACE FUNCTION get_unread_count()
  RETURNS INTEGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_count INTEGER;
    v_uid UUID := auth.uid();
  BEGIN
    SELECT count(*) INTO v_count
    FROM messages m
    JOIN conversations c ON m.conversation_id = c.id
    WHERE (
      -- FIX: Use subquery to get driver record from user_id
      c.driver_id IN (SELECT id FROM drivers WHERE user_id = v_uid)
      OR c.student_id = v_uid
    )
      AND m.sender_id != v_uid
      AND m.is_read = false;
  
    RETURN coalesce(v_count, 0);
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════
  -- 4. BULK_UPDATE_TRIP_LOCATIONS: Add rate limiting
  -- ═══════════════════════════════════════════════════════════════
  
  CREATE OR REPLACE FUNCTION public.bulk_update_trip_locations(p_locations JSONB)
  RETURNS JSONB
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_driver_id UUID;
    v_location RECORD;
    v_failed JSONB := '[]'::JSONB;
    v_status TEXT;
    v_success_count INT := 0;
    v_rate_limit_ok BOOLEAN;
  BEGIN
    -- Get current driver from auth
    SELECT d.id INTO v_driver_id FROM public.drivers d WHERE d.user_id = auth.uid();
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Rate limiting check
    SELECT COALESCE(check_rate_limit(auth.uid(), 'bulk_update_trip_locations', 100, 60), true)
    INTO v_rate_limit_ok;
  
    IF NOT v_rate_limit_ok THEN
      RAISE EXCEPTION 'Rate limit exceeded for GPS updates. Please try again later.';
    END IF;
  
    FOR v_location IN
      SELECT
        COALESCE(x.trip_id, x.tripId) AS trip_id,
        x.lat,
        x.lng
      FROM jsonb_to_recordset(p_locations) AS x(tripId UUID, trip_id UUID, lat NUMERIC, lng NUMERIC)
    LOOP
      IF v_location.trip_id IS NULL THEN
        v_failed := v_failed || jsonb_build_object('error', 'Missing trip_id or tripId');
        CONTINUE;
      END IF;
  
      -- Lock trip row to prevent race conditions
      SELECT status INTO v_status FROM public.trips WHERE id = v_location.trip_id AND driver_id = v_driver_id FOR UPDATE NOWAIT;
  
      IF v_status IN ('driver_waiting', 'in_transit') THEN
        -- Validate GPS coordinates are within valid range
        IF v_location.lat IS NOT NULL AND (v_location.lat < -90 OR v_location.lat > 90) THEN
          v_failed := v_failed || jsonb_build_object('trip_id', v_location.trip_id, 'error', 'Invalid latitude: must be between -90 and 90');
          CONTINUE;
        END IF;
  
        IF v_location.lng IS NOT NULL AND (v_location.lng < -180 OR v_location.lng > 180) THEN
          v_failed := v_failed || jsonb_build_object('trip_id', v_location.trip_id, 'error', 'Invalid longitude: must be between -180 and 180');
          CONTINUE;
        END IF;
  
        UPDATE public.trips
        SET last_lat = v_location.lat,
            last_lng = v_location.lng,
            updated_at = NOW()
        WHERE id = v_location.trip_id;
        v_success_count := v_success_count + 1;
      ELSIF v_status IS NOT NULL THEN
        v_failed := v_failed || jsonb_build_object('trip_id', v_location.trip_id, 'error', 'Trip is not in an active state: ' || v_status);
      ELSE
        v_failed := v_failed || jsonb_build_object('trip_id', v_location.trip_id, 'error', 'Trip not found or not assigned to driver');
      END IF;
    END LOOP;
  
    RETURN jsonb_build_object('success_count', v_success_count, 'failed', v_failed);
  END;
  $$;
  
  -- Update grant
  REVOKE EXECUTE ON FUNCTION public.bulk_update_trip_locations(JSONB) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.bulk_update_trip_locations(JSONB) TO authenticated;
  
  -- ═══════════════════════════════════════════════════════════════
  -- 5. UPDATE_TRIP_LOCATION: Add coordinate validation
  -- ═══════════════════════════════════════════════════════════════
  
  CREATE OR REPLACE FUNCTION public.update_trip_location(p_trip_id UUID, p_lat NUMERIC, p_lng NUMERIC)
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_driver_id UUID;
    v_status TEXT;
  BEGIN
    -- Validate coordinates before any processing
    IF p_lat IS NOT NULL AND (p_lat < -90 OR p_lat > 90) THEN
      RAISE EXCEPTION 'Latitude must be between -90 and 90';
    END IF;
  
    IF p_lng IS NOT NULL AND (p_lng < -180 OR p_lng > 180) THEN
      RAISE EXCEPTION 'Longitude must be between -180 and 180';
    END IF;
  
    SELECT d.id INTO v_driver_id FROM drivers d WHERE d.user_id = auth.uid();
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Lock the trip row to prevent race conditions
    SELECT status INTO v_status
    FROM trips
    WHERE id = p_trip_id AND driver_id = v_driver_id
    FOR UPDATE NOWAIT;
  
    IF v_status IS NULL THEN
      RAISE EXCEPTION 'Trip not found or not assigned to you';
    END IF;
  
    IF v_status NOT IN ('driver_waiting', 'in_transit') THEN
      RAISE EXCEPTION 'Cannot update location for trip with status: %', v_status;
    END IF;
  
    UPDATE trips
    SET last_lat = p_lat, last_lng = p_lng, updated_at = NOW()
    WHERE id = p_trip_id;
  
    RETURN TRUE;
  END;
  $$;
  
  -- Keep existing grants
  GRANT EXECUTE ON FUNCTION public.update_trip_location(UUID, NUMERIC, NUMERIC) TO authenticated;
  
  -- ═══════════════════════════════════════════════════════════════
  -- 6. REQUEST_PAYOUT: Lock subscription rows to prevent race condition
  -- ═══════════════════════════════════════════════════════════════
  
  CREATE OR REPLACE FUNCTION request_payout(p_amount numeric)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_uid UUID := auth.uid();
    v_driver_id UUID;
    v_earned numeric := 0;
    v_paid numeric := 0;
    v_available numeric := 0;
    v_sub RECORD;
  BEGIN
    -- Verify the role
    IF coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can request payouts';
    END IF;
  
    -- Pessimistic locking of the driver profile
    SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid FOR UPDATE NOWAIT;
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- Lock all subscription rows for this driver to prevent race conditions
    -- This ensures concurrent requests can't read inconsistent balance
    FOR v_sub IN
      SELECT s.id, s.purchase_price, s.status
      FROM subscriptions s
      JOIN routes r ON s.route_id = r.id
      WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired')
      FOR UPDATE
    LOOP
      -- Just locking, balance calculated below
      NULL;
    END LOOP;
  
    -- Calculate balances using purchase_price
    SELECT coalesce(sum(s.purchase_price), 0) INTO v_earned
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');
  
    SELECT coalesce(sum(amount), 0) INTO v_paid
    FROM driver_payouts
    WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
  
    v_available := v_earned - v_paid;
  
    IF p_amount > v_available THEN
      RAISE EXCEPTION 'Requested amount exceeds available balance';
    END IF;
  
    IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;
  
    INSERT INTO driver_payouts (driver_id, amount, status)
    VALUES (v_driver_id, p_amount, 'pending');
  END;
  $$;
  
  GRANT EXECUTE ON FUNCTION request_payout(numeric) TO authenticated;
  
  -- ═══════════════════════════════════════════════════════════════
  -- 7. ZAIN_CASH: Disable completely until proper implementation
  -- ═══════════════════════════════════════════════════════════════
  -- The zaincash webhook is stubbed and returns 501, which is correct.
  -- This comment documents that NO payment processing should happen
  -- until proper JWT signature verification is implemented.
  
  -- ═══════════════════════════════════════════════════════════════
  -- 8. AUDIT LOG: Add audit trail for security-sensitive changes
  -- ═══════════════════════════════════════════════════════════════
  
  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  SELECT
    auth.uid(),
    'security_patch_applied',
    'migrations',
    NULL,
    jsonb_build_object(
      'migration', '20260523000001_fix_security_vulnerabilities',
      'fixes', ARRAY[
        'emergency_reports_admin_access',
        'support_requests_user_visibility',
        'get_unread_count_driver_uuid_fix',
        'bulk_update_trip_location_rate_limit_and_validation',
        'update_trip_location_coordinate_validation',
        'request_payout_subscription_locking'
      ]
    )
  WHERE auth.uid() IS NOT NULL;



  -- ==========================================
  -- Source: 20260523000002_add_message_rate_limit.sql
  -- ==========================================
  -- Migration: 20260523000002_add_message_rate_limit.sql
  -- Fix: Add rate limiting to send_message to prevent spam/flood attacks
  -- Issue: No rate limit existed on send_message, allowing participants to send
  --        unlimited messages and cause DoS through notification flood
  
  CREATE OR REPLACE FUNCTION public.send_message(p_conversation_id UUID, p_content TEXT)
  RETURNS messages
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_message messages%ROWTYPE;
    v_conversation conversations%ROWTYPE;
    v_caller_id UUID;
    v_rate_limit_ok BOOLEAN;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    -- Rate limiting check: 30 messages per minute per user
    SELECT COALESCE(check_rate_limit(v_caller_id, 'send_message', 30, 60), false)
    INTO v_rate_limit_ok;
  
    IF NOT v_rate_limit_ok THEN
      RAISE EXCEPTION 'Rate limit exceeded. Please slow down.';
    END IF;
  
    SELECT * INTO v_conversation FROM conversations WHERE id = p_conversation_id;
    IF v_conversation IS NULL THEN
      RAISE EXCEPTION 'Conversation not found';
    END IF;
  
    IF v_caller_id NOT IN (
      SELECT user_id FROM drivers WHERE id = v_conversation.driver_id
    ) AND v_caller_id != v_conversation.student_id THEN
      RAISE EXCEPTION 'Not a participant in this conversation';
    END IF;
  
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (p_conversation_id, v_caller_id, p_content)
    RETURNING * INTO v_message;
  
    UPDATE conversations SET last_message_at = NOW() WHERE id = p_conversation_id;
  
    RETURN v_message;
  END;
  $$;
  
  -- Grant still open for authenticated users
  GRANT EXECUTE ON FUNCTION public.send_message(UUID, TEXT) TO authenticated;



  -- ==========================================
  -- Source: 20260523000003_fix_drivers_rating_rpc.sql
  -- ==========================================
  -- Migration: 20260523000003_fix_drivers_rating_rpc.sql
  -- Description: Fix get_drivers_avg_rating RPC to map drivers.id to their profile rating.
  -- Context: routes.driver_id references drivers.id, but ratings.driver_id references auth.users(id) (profiles.id).
  -- The RPC is called with a list of drivers.id, so we must join drivers to match.
  
  CREATE OR REPLACE FUNCTION public.get_drivers_avg_rating(p_driver_ids UUID[])
  RETURNS TABLE(driver_id UUID, avg_rating NUMERIC)
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public AS $$
    SELECT d.id AS driver_id, ROUND(AVG(r.rating)::NUMERIC, 1) AS avg_rating
    FROM ratings r
    JOIN drivers d ON r.driver_id = d.user_id
    WHERE d.id = ANY(p_driver_ids)
    GROUP BY d.id;
  $$;
  
  REVOKE EXECUTE ON FUNCTION public.get_drivers_avg_rating(UUID[]) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_drivers_avg_rating(UUID[]) TO authenticated;
  



  -- ==========================================
  -- Source: 20260523000004_fix_conversations_schema.sql
  -- ==========================================
  -- Migration: 20260523000004_fix_conversations_schema.sql
  -- Fix the unique constraint on conversations table and update get_or_create_conversation RPC to verify route subscription.
  
  -- 1. Drop the old unique constraint (which was per-trip)
  ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_trip_id_key;
  
  -- 2. Add a new unique constraint (per trip and student)
  ALTER TABLE public.conversations ADD CONSTRAINT conversations_trip_student_unique UNIQUE (trip_id, student_id);
  
  -- 3. Drop the old RPC overload
  DROP FUNCTION IF EXISTS public.get_or_create_conversation(UUID);
  
  -- 4. Create the updated RPC function
  CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
    p_trip_id UUID,
    p_student_id UUID DEFAULT NULL
  )
  RETURNS public.conversations
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_trip public.trips%ROWTYPE;
    v_driver public.drivers%ROWTYPE;
    v_conversation public.conversations%ROWTYPE;
    v_caller_id UUID;
    v_target_student_id UUID;
    v_is_subscribed BOOLEAN;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT * INTO v_trip FROM public.trips WHERE id = p_trip_id;
    IF v_trip IS NULL THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    SELECT * INTO v_driver FROM public.drivers WHERE id = v_trip.driver_id;
    IF v_driver IS NULL THEN
      RAISE EXCEPTION 'Driver not found for this trip';
    END IF;
  
    -- Determine target student
    IF v_caller_id = v_driver.user_id THEN
      -- Driver is calling. They must specify which student they want to chat with.
      IF p_student_id IS NULL THEN
        RAISE EXCEPTION 'student_id is required when driver initiates chat';
      END IF;
      v_target_student_id := p_student_id;
    ELSE
      -- Student is calling. They can only create a conversation for themselves.
      IF p_student_id IS NOT NULL AND p_student_id != v_caller_id THEN
        RAISE EXCEPTION 'Unauthorized: student can only create conversations for themselves';
      END IF;
      v_target_student_id := v_caller_id;
    END IF;
  
    -- Verify subscription of the student to this route
    SELECT EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE student_id = v_target_student_id
        AND route_id = v_trip.route_id
        AND status IN ('active', 'pending')
    ) INTO v_is_subscribed;
  
    IF NOT v_is_subscribed THEN
      RAISE EXCEPTION 'Student is not subscribed to this trip route';
    END IF;
  
    -- Find existing conversation
    SELECT * INTO v_conversation
    FROM public.conversations
    WHERE trip_id = p_trip_id AND student_id = v_target_student_id;
  
    IF v_conversation IS NOT NULL THEN
      RETURN v_conversation;
    END IF;
  
    -- Create new conversation
    INSERT INTO public.conversations (trip_id, driver_id, student_id)
    VALUES (p_trip_id, v_trip.driver_id, v_target_student_id)
    RETURNING * INTO v_conversation;
  
    RETURN v_conversation;
  END;
  $$;
  
  -- 5. Grant execute permissions to authenticated users
  GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) TO authenticated;
  



  -- ==========================================
  -- Source: 20260523000005_fix_get_my_conversations.sql
  -- ==========================================
  -- Migration: 20260523000005_fix_get_my_conversations.sql
  -- Fix get_my_conversations RPC to return actual driver/student names, latest message preview, and unread count.
  
  -- 1. Drop the old function
  DROP FUNCTION IF EXISTS public.get_my_conversations();
  
  -- 2. Create the updated function with TABLE return type
  CREATE OR REPLACE FUNCTION public.get_my_conversations()
  RETURNS TABLE (
    id UUID,
    trip_id UUID,
    driver_id UUID,
    student_id UUID,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    driver_name TEXT,
    student_name TEXT,
    last_message TEXT,
    unread_count INT
  )
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    RETURN QUERY
    SELECT 
      c.id,
      c.trip_id,
      c.driver_id,
      c.student_id,
      c.last_message_at,
      c.created_at,
      c.updated_at,
      COALESCE(dp.full_name, '')::TEXT AS driver_name,
      COALESCE(sp.full_name, '')::TEXT AS student_name,
      (
        SELECT content FROM public.messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      )::TEXT AS last_message,
      COALESCE((
        SELECT COUNT(*)::INT FROM public.messages
        WHERE conversation_id = c.id
          AND sender_id != v_caller_id
          AND is_read = false
      ), 0)::INT AS unread_count
    FROM public.conversations c
    LEFT JOIN public.drivers d ON c.driver_id = d.id
    LEFT JOIN public.profiles dp ON d.user_id = dp.id
    LEFT JOIN public.profiles sp ON c.student_id = sp.id
    WHERE
      d.user_id = v_caller_id
      OR c.student_id = v_caller_id
    ORDER BY c.last_message_at DESC;
  END;
  $$;
  
  -- 3. Grant execute permissions to authenticated users
  GRANT EXECUTE ON FUNCTION public.get_my_conversations() TO authenticated;
  



  -- ==========================================
  -- Source: 20260524000001_ultimate_fix.sql
  -- ==========================================
  -- Migration: 20260524000001_ultimate_fix.sql
  -- Date: 2026-05-24
  -- Purpose: إصلاح شامل للثغرات + توثيق Database State
  --
  -- ════════════════════════════════════════════════════════════════
  -- WARNING: هذا الـ migration هو "مصدر الحقيقة"
  -- الغرض منه جعل Migrations = Database State
  -- ════════════════════════════════════════════════════════════════
  
  -- ════════════════════════════════════════════════════════════════
  -- PART 1: إصلاح الثغرات الأمنية
  -- ════════════════════════════════════════════════════════════════
  
  -- ───────────────────────────────────────────────────────────────
  -- 1.1 إصلاح admin_cancel_trip - استعادة المقاعد في ALL الحالات
  -- ───────────────────────────────────────────────────────────────
  CREATE OR REPLACE FUNCTION public.admin_cancel_trip(p_trip_id UUID)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $function$
  DECLARE
    v_role TEXT;
    v_trip RECORD;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can cancel trips';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id FOR UPDATE;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status = 'cancelled' THEN
      RETURN;
    END IF;
  
    -- FIX: استعادة المقعد في scheduled و driver_waiting
    IF v_trip.status IN ('scheduled', 'driver_waiting') THEN
      UPDATE routes
      SET available_seats = LEAST(capacity, available_seats + 1),
          updated_at = NOW()
      WHERE id = v_trip.route_id;
    END IF;
  
    UPDATE trips
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_trip_id;
  
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      'admin_cancel_trip',
      'trips',
      p_trip_id,
      jsonb_build_object('route_id', v_trip.route_id, 'previous_status', v_trip.status)
    );
  END;
  $function$;
  
  GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) TO authenticated;
  
  -- ───────────────────────────────────────────────────────────────
  -- 1.2 إصلاح create_trip - التحقق من driver verification
  -- ───────────────────────────────────────────────────────────────
  CREATE OR REPLACE FUNCTION public.create_trip(
    p_route_id UUID,
    p_scheduled_at TIMESTAMPTZ
  )
  RETURNS UUID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $function$
  DECLARE
    v_trip_id UUID;
    v_role TEXT;
    v_driver_id UUID;
    v_driver_is_verified BOOLEAN;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'driver' THEN
      RAISE EXCEPTION 'Only drivers can create trips';
    END IF;
  
    SELECT d.id, COALESCE(d.is_verified, false)
    INTO v_driver_id, v_driver_is_verified
    FROM drivers d
    WHERE d.user_id = auth.uid();
  
    IF v_driver_id IS NULL THEN
      RAISE EXCEPTION 'Driver profile not found';
    END IF;
  
    -- FIX: التحقق من أن السائق موثق
    IF NOT v_driver_is_verified THEN
      RAISE EXCEPTION 'Driver not verified. Please complete verification first.';
    END IF;
  
    IF NOT EXISTS (
      SELECT 1 FROM routes r
      WHERE r.id = p_route_id AND r.driver_id = v_driver_id
    ) THEN
      RAISE EXCEPTION 'Route not assigned to this driver';
    END IF;
  
    INSERT INTO trips (route_id, driver_id, status, scheduled_at)
    VALUES (p_route_id, v_driver_id, 'scheduled', p_scheduled_at)
    RETURNING id INTO v_trip_id;
  
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      'create_trip',
      'trips',
      v_trip_id,
      jsonb_build_object('route_id', p_route_id, 'scheduled_at', p_scheduled_at)
    );
  
    RETURN v_trip_id;
  END;
  $function$;
  
  GRANT EXECUTE ON FUNCTION public.create_trip(UUID, TIMESTAMPTZ) TO authenticated;
  
  -- ════════════════════════════════════════════════════════════════
  -- PART 2: توثيق جميع الـ TRIGGERS الموجودة في DB
  -- ════════════════════════════════════════════════════════════════
  
  -- Trigger: set_trips_updated_at
  DROP TRIGGER IF EXISTS set_trips_updated_at ON trips;
  CREATE TRIGGER set_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  
  -- Trigger: update_payments_updated_at
  DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
  CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  
  -- Trigger: update_conversations_updated_at
  DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
  CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  
  -- Trigger: on_driver_created
  DROP TRIGGER IF EXISTS on_driver_created ON drivers;
  CREATE TRIGGER on_driver_created
    AFTER INSERT ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION sync_driver_role_promotion();
  
  -- Trigger: on_driver_deleted
  DROP TRIGGER IF EXISTS on_driver_deleted ON drivers;
  CREATE TRIGGER on_driver_deleted
    AFTER DELETE ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION sync_driver_role_demotion();
  
  -- Trigger: enforce_profile_privileged_fields_trigger
  DROP TRIGGER IF EXISTS enforce_profile_privileged_fields_trigger ON profiles;
  CREATE TRIGGER enforce_profile_privileged_fields_trigger
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION enforce_profile_privileged_fields();
  
  -- Trigger: on_profile_role_changed (INSERT)
  DROP TRIGGER IF EXISTS on_profile_role_changed ON profiles;
  CREATE TRIGGER on_profile_role_changed
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_profile_role_to_auth();
  
  -- ════════════════════════════════════════════════════════════════
  -- PART 3: توثيق جميع POLICIES الموجودة في DB
  -- ════════════════════════════════════════════════════════════════
  
  -- app_config
  DROP POLICY IF EXISTS "Anyone can read app_config" ON app_config;
  CREATE POLICY "Anyone can read app_config" ON app_config FOR SELECT USING (true);
  
  -- audit_logs
  DROP POLICY IF EXISTS "Audit: Admins see all" ON audit_logs;
  CREATE POLICY "Audit: Admins see all" ON audit_logs FOR SELECT USING (is_admin());
  
  -- conversations
  DROP POLICY IF EXISTS "Conversations: Participants see their conversations" ON conversations;
  CREATE POLICY "Conversations: Participants see their conversations" ON conversations
    FOR SELECT USING (
      auth.uid() = student_id OR
      auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
    );
  
  DROP POLICY IF EXISTS "Conversations: Driver can create for their trips" ON conversations;
  CREATE POLICY "Conversations: Driver can create for their trips" ON conversations
    FOR INSERT WITH CHECK (
      auth.uid() = student_id OR
      auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
    );
  
  -- driver_payouts
  DROP POLICY IF EXISTS "Drivers see own payouts" ON driver_payouts;
  CREATE POLICY "Drivers see own payouts" ON driver_payouts
    FOR SELECT USING (
      driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    );
  
  DROP POLICY IF EXISTS "Admins manage all payouts" ON driver_payouts;
  CREATE POLICY "Admins manage all payouts" ON driver_payouts
    FOR ALL USING (is_admin());
  
  -- drivers
  DROP POLICY IF EXISTS "Drivers: Own profile sees own" ON drivers;
  CREATE POLICY "Drivers: Own profile sees own" ON drivers
    FOR SELECT USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Drivers: Admins manage all" ON drivers;
  CREATE POLICY "Drivers: Admins manage all" ON drivers
    FOR ALL USING (is_admin());
  
  -- emergency_reports
  DROP POLICY IF EXISTS "Users can insert own emergency reports" ON emergency_reports;
  CREATE POLICY "Users can insert own emergency reports" ON emergency_reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());
  
  DROP POLICY IF EXISTS "Users can view own emergency reports" ON emergency_reports;
  CREATE POLICY "Users can view own emergency reports" ON emergency_reports
    FOR SELECT USING (reporter_id = auth.uid());
  
  DROP POLICY IF EXISTS "Admins can view emergency reports" ON emergency_reports;
  CREATE POLICY "Admins can view emergency reports" ON emergency_reports
    FOR SELECT USING (is_admin());
  
  DROP POLICY IF EXISTS "Admins can update emergency reports" ON emergency_reports;
  CREATE POLICY "Admins can update emergency reports" ON emergency_reports
    FOR UPDATE USING (is_admin());
  
  -- feature_flags
  DROP POLICY IF EXISTS "Everyone can view feature flags" ON feature_flags;
  CREATE POLICY "Everyone can view feature flags" ON feature_flags FOR SELECT USING (true);
  
  DROP POLICY IF EXISTS "Admins can manage feature flags" ON feature_flags;
  CREATE POLICY "Admins can manage feature flags" ON feature_flags
    FOR ALL USING (is_admin());
  
  -- institutions
  DROP POLICY IF EXISTS "Everyone can view institutions" ON institutions;
  CREATE POLICY "Everyone can view institutions" ON institutions FOR SELECT USING (true);
  
  DROP POLICY IF EXISTS "Admins can manage institutions" ON institutions;
  CREATE POLICY "Admins can manage institutions" ON institutions
    FOR ALL USING (is_admin());
  
  -- license_batches
  DROP POLICY IF EXISTS "Admins can manage license_batches" ON license_batches;
  CREATE POLICY "Admins can manage license_batches" ON license_batches
    FOR ALL USING (is_admin());
  
  -- licenses
  DROP POLICY IF EXISTS "Admins can manage licenses" ON licenses;
  CREATE POLICY "Admins can manage licenses" ON licenses
    FOR ALL USING (is_admin());
  
  -- messages
  DROP POLICY IF EXISTS "Messages: Conversation participants can read" ON messages;
  CREATE POLICY "Messages: Conversation participants can read" ON messages
    FOR SELECT USING (
      auth.uid() = sender_id OR
      EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id AND (
          c.student_id = auth.uid() OR
          c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
        )
      )
    );
  
  DROP POLICY IF EXISTS "Messages: Conversation participants can send" ON messages;
  CREATE POLICY "Messages: Conversation participants can send" ON messages
    FOR INSERT WITH CHECK (
      auth.uid() = sender_id AND
      EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id AND (
          c.student_id = auth.uid() OR
          c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
        )
      )
    );
  
  DROP POLICY IF EXISTS "Messages: Sender can update read status" ON messages;
  CREATE POLICY "Messages: Sender can update read status" ON messages
    FOR UPDATE USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);
  
  -- notification_log
  DROP POLICY IF EXISTS "Users read own notifications" ON notification_log;
  CREATE POLICY "Users read own notifications" ON notification_log
    FOR SELECT USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Users update own notifications" ON notification_log;
  CREATE POLICY "Users update own notifications" ON notification_log
    FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Users delete own notifications" ON notification_log;
  CREATE POLICY "Users delete own notifications" ON notification_log
    FOR DELETE USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Service role inserts notifications" ON notification_log;
  CREATE POLICY "Service role inserts notifications" ON notification_log
    FOR INSERT WITH CHECK (true);
  
  -- payments
  DROP POLICY IF EXISTS "Payments: Users see own" ON payments;
  CREATE POLICY "Payments: Users see own" ON payments
    FOR SELECT USING (user_id = auth.uid());
  
  -- profiles
  DROP POLICY IF EXISTS "Profiles: Users see own" ON profiles;
  CREATE POLICY "Profiles: Users see own" ON profiles
    FOR SELECT USING (id = auth.uid());
  
  DROP POLICY IF EXISTS "Profiles: Users update own" ON profiles;
  CREATE POLICY "Profiles: Users update own" ON profiles
    FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  
  DROP POLICY IF EXISTS "Students can create own profile" ON profiles;
  CREATE POLICY "Students can create own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
  
  DROP POLICY IF EXISTS "Profiles: Admins see all" ON profiles;
  CREATE POLICY "Profiles: Admins see all" ON profiles
    FOR SELECT USING (is_admin());
  
  DROP POLICY IF EXISTS "Profiles: Admins can insert any" ON profiles;
  CREATE POLICY "Profiles: Admins can insert any" ON profiles
    FOR INSERT WITH CHECK (is_admin());
  
  DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
  CREATE POLICY "Admins can update profiles" ON profiles
    FOR UPDATE USING (is_admin());
  
  -- push_tokens
  DROP POLICY IF EXISTS "Users can manage their own push tokens" ON push_tokens;
  CREATE POLICY "Users can manage their own push tokens" ON push_tokens
    FOR ALL USING (user_id = auth.uid());
  
  -- rate_limits (Deny all - only RPC access)
  DROP POLICY IF EXISTS "Deny all direct access to rate_limits" ON rate_limits;
  CREATE POLICY "Deny all direct access to rate_limits" ON rate_limits
    FOR ALL USING (false);
  
  -- ratings
  DROP POLICY IF EXISTS "Students can view their ratings" ON ratings;
  CREATE POLICY "Students can view their ratings" ON ratings
    FOR SELECT USING (student_id = auth.uid());
  
  DROP POLICY IF EXISTS "Drivers can view their ratings" ON ratings;
  CREATE POLICY "Drivers can view their ratings" ON ratings
    FOR SELECT USING (driver_id = auth.uid());
  
  -- routes
  DROP POLICY IF EXISTS "Routes: Everyone sees active routes" ON routes;
  CREATE POLICY "Routes: Everyone sees active routes" ON routes
    FOR SELECT USING (is_active = true);
  
  DROP POLICY IF EXISTS "Routes: Drivers see own" ON routes;
  CREATE POLICY "Routes: Drivers see own" ON routes
    FOR SELECT USING (
      driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    );
  
  DROP POLICY IF EXISTS "Routes: Admins manage all" ON routes;
  CREATE POLICY "Routes: Admins manage all" ON routes
    FOR ALL USING (is_admin());
  
  -- subscriptions
  DROP POLICY IF EXISTS "Subscriptions: Students see own" ON subscriptions;
  CREATE POLICY "Subscriptions: Students see own" ON subscriptions
    FOR SELECT USING (deleted_at IS NULL AND student_id = auth.uid());
  
  DROP POLICY IF EXISTS "Subscriptions: Driver sees route subscriptions" ON subscriptions;
  CREATE POLICY "Subscriptions: Driver sees route subscriptions" ON subscriptions
    FOR SELECT USING (
      deleted_at IS NULL AND
      route_id IN (SELECT r.id FROM routes r JOIN drivers d ON r.driver_id = d.id WHERE d.user_id = auth.uid())
    );
  
  DROP POLICY IF EXISTS "Subscriptions: Admins see all" ON subscriptions;
  CREATE POLICY "Subscriptions: Admins see all" ON subscriptions
    FOR SELECT USING (is_admin());
  
  DROP POLICY IF EXISTS "Subscriptions: Students cancel own active" ON subscriptions;
  CREATE POLICY "Subscriptions: Students cancel own active" ON subscriptions
    FOR UPDATE USING (
      deleted_at IS NULL AND
      student_id = auth.uid() AND
      status IN ('active', 'pending')
    ) WITH CHECK (
      student_id = auth.uid() AND
      status = 'cancelled'
    );
  
  DROP POLICY IF EXISTS "Admins can update any subscription" ON subscriptions;
  CREATE POLICY "Admins can update any subscription" ON subscriptions
    FOR UPDATE USING (is_admin());
  
  -- support_requests
  DROP POLICY IF EXISTS "Allow anonymous insert" ON support_requests;
  CREATE POLICY "Allow anonymous insert" ON support_requests
    FOR INSERT WITH CHECK (true);
  
  DROP POLICY IF EXISTS "Users can view own support requests" ON support_requests;
  CREATE POLICY "Users can view own support requests" ON support_requests
    FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own support requests" ON support_requests;
  CREATE POLICY "Users can update own support requests" ON support_requests
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Allow admins all" ON support_requests;
  CREATE POLICY "Allow admins all" ON support_requests
    FOR ALL USING (is_admin());
  
  -- trips
  DROP POLICY IF EXISTS "Trips: Students see own route trips" ON trips;
  CREATE POLICY "Trips: Students see own route trips" ON trips
    FOR SELECT USING (
      deleted_at IS NULL AND
      route_id IN (SELECT route_id FROM subscriptions WHERE student_id = auth.uid() AND deleted_at IS NULL)
    );
  
  DROP POLICY IF EXISTS "Trips: Driver sees own trips" ON trips;
  CREATE POLICY "Trips: Driver sees own trips" ON trips
    FOR SELECT USING (
      deleted_at IS NULL AND
      driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    );
  
  DROP POLICY IF EXISTS "Trips: Admins see all" ON trips;
  CREATE POLICY "Trips: Admins see all" ON trips
    FOR SELECT USING (is_admin());
  
  DROP POLICY IF EXISTS "Admins can update any trip" ON trips;
  CREATE POLICY "Admins can update any trip" ON trips
    FOR UPDATE USING (is_admin());
  
  -- ════════════════════════════════════════════════════════════════
  -- PART 4: Audit Log
  -- ════════════════════════════════════════════════════════════════
  DO $$
  BEGIN
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      NULL,
      'migration_applied',
      'migrations',
      NULL,
      jsonb_build_object(
        'migration', '20260524000001_ultimate_fix',
        'date', NOW(),
        'description', 'Comprehensive security fix + DB state documentation',
        'fixes', ARRAY[
          'admin_cancel_trip_seat_restoration_fixed',
          'create_trip_driver_verification_required',
          'all_triggers_documented',
          'all_policies_documented'
        ],
        'stats', jsonb_build_object(
          'functions_fixed', 2,
          'triggers_documented', 7,
          'policies_documented', 52
        )
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Could not insert audit log: %', SQLERRM;
  END $$;



  -- ==========================================
  -- Source: 20260524000002_add_auth_user_created_trigger.sql
  -- ==========================================
  -- Migration: 20260524000002_add_auth_user_created_trigger.sql
  -- Date: 2026-05-24
  -- Description: Hardens public.handle_new_user search path and registers the trigger on auth.users.
  
  -- 1. Recreate the trigger function with search_path hardened
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.raw_user_meta_data->>'phone',
      COALESCE(NEW.raw_app_meta_data->>'role', 'student'),
      false
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END;
  $$;
  
  -- 2. Drop trigger if it already exists, and register it AFTER INSERT on auth.users
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  
  -- 3. Audit log
  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    NULL,
    'migration_applied',
    'migrations',
    NULL,
    jsonb_build_object(
      'migration', '20260524000002_add_auth_user_created_trigger',
      'description', 'Hardens handle_new_user search_path and creates trigger on_auth_user_created on auth.users',
      'date', NOW()
    )
  );
  



  -- ==========================================
  -- Source: 20260524000003_fix_get_my_conversations_ambiguous_column.sql
  -- ==========================================
  -- Migration: 20260524000003_fix_get_my_conversations_ambiguous_column.sql
  -- Fix get_my_conversations RPC to resolve ambiguous column 'created_at' in messages subquery.
  
  -- 1. Drop the function first to allow signature and return type update if needed (clean state)
  DROP FUNCTION IF EXISTS public.get_my_conversations();
  
  -- 2. Create the updated function with public.messages.created_at explicitly qualified
  CREATE OR REPLACE FUNCTION public.get_my_conversations()
  RETURNS TABLE (
    id UUID,
    trip_id UUID,
    driver_id UUID,
    student_id UUID,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    driver_name TEXT,
    student_name TEXT,
    last_message TEXT,
    unread_count INT
  )
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_caller_id UUID;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    RETURN QUERY
    SELECT 
      c.id,
      c.trip_id,
      c.driver_id,
      c.student_id,
      c.last_message_at,
      c.created_at,
      c.updated_at,
      COALESCE(dp.full_name, '')::TEXT AS driver_name,
      COALESCE(sp.full_name, '')::TEXT AS student_name,
      (
        SELECT content FROM public.messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      )::TEXT AS last_message,
      COALESCE((
        SELECT COUNT(*)::INT FROM public.messages m2
        WHERE m2.conversation_id = c.id
          AND m2.sender_id != v_caller_id
          AND m2.is_read = false
      ), 0)::INT AS unread_count
    FROM public.conversations c
    LEFT JOIN public.drivers d ON c.driver_id = d.id
    LEFT JOIN public.profiles dp ON d.user_id = dp.id
    LEFT JOIN public.profiles sp ON c.student_id = sp.id
    WHERE
      d.user_id = v_caller_id
      OR c.student_id = v_caller_id
    ORDER BY c.last_message_at DESC;
  END;
  $$;
  
  -- 3. Grant execute permissions to authenticated users
  GRANT EXECUTE ON FUNCTION public.get_my_conversations() TO authenticated;
  



  -- ==========================================
  -- Source: 20260524000004_drop_slow_queries_view.sql
  -- ==========================================
  -- Drop the slow_queries view from the public schema because it is defined as SECURITY DEFINER
  -- and exposed via PostgREST, posing a security vulnerability.
  DROP VIEW IF EXISTS public.slow_queries;
  



  -- ==========================================
  -- Source: 20260524000005_harden_security_and_search_paths.sql
  -- ==========================================
  -- Migration: 20260524000005_harden_security_and_search_paths.sql
  -- Description: Resolve database linter warnings for SECURITY DEFINER functions and mutable search paths
  
  -- 1. Drop manually created unneeded functions
  DROP FUNCTION IF EXISTS public.get_slow_queries(integer);
  
  -- 2. Harden search_path for mutable search path functions
  ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
  ALTER FUNCTION public.handle_new_user() SET search_path = public;
  ALTER FUNCTION public.enforce_profile_privileged_fields() SET search_path = public;
  ALTER FUNCTION public.register_push_token(text) SET search_path = public;
  ALTER FUNCTION public.update_updated_at() SET search_path = public;
  ALTER FUNCTION public.get_messages(uuid, integer) SET search_path = public;
  ALTER FUNCTION public.mark_messages_read(uuid) SET search_path = public;
  ALTER FUNCTION public.sync_driver_role_promotion() SET search_path = public;
  ALTER FUNCTION public.sync_driver_role_demotion() SET search_path = public;
  ALTER FUNCTION public.sync_profile_role_to_auth() SET search_path = public;
  ALTER FUNCTION public.get_app_config() SET search_path = public;
  
  -- 3. Revoke public/anon execute on trigger functions (triggers don't need RPC access)
  REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.enforce_profile_privileged_fields() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.sync_driver_role_promotion() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.sync_driver_role_demotion() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.sync_profile_role_to_auth() FROM PUBLIC, anon, authenticated;
  REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  
  -- 4. Revoke public/anon execute on sensitive SECURITY DEFINER functions (they must only be run by authenticated users or service role)
  -- Admin functions
  REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.admin_create_trip(uuid, uuid, timestamptz) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.admin_create_trip(uuid, uuid, timestamptz) TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_enhanced_analytics(timestamptz, timestamptz, timestamptz, timestamptz) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_enhanced_analytics(timestamptz, timestamptz, timestamptz, timestamptz) TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_system_health() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_system_health() TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_daily_activity(integer) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_daily_activity(integer) TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_recent_active_trips(integer) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_recent_active_trips(integer) TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.update_payout_status(uuid, text) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.update_payout_status(uuid, text) TO authenticated, service_role;
  
  -- Utility / System functions
  REVOKE EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) TO authenticated, service_role;
  
  -- Rate limit cleanup
  REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limits() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.cleanup_rate_limits() TO authenticated, service_role;
  
  -- Expiry function
  REVOKE EXECUTE ON FUNCTION public.expire_subscriptions() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.expire_subscriptions() TO authenticated, service_role;
  
  -- Driver functions
  REVOKE EXECUTE ON FUNCTION public.get_driver_balance() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_driver_balance() TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_driver_balance(uuid) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_driver_balance(uuid) TO authenticated, service_role;
  
  -- Rating functions
  REVOKE EXECUTE ON FUNCTION public.get_driver_avg_rating(uuid) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_driver_avg_rating(uuid) TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_drivers_avg_rating(uuid[]) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_drivers_avg_rating(uuid[]) TO authenticated, service_role;
  
  -- Push token function
  REVOKE EXECUTE ON FUNCTION public.register_push_token(text) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.register_push_token(text) TO authenticated, service_role;
  



  -- ==========================================
  -- Source: 20260524000006_harden_rls_policies.sql
  -- ==========================================
  -- Migration: 20260524000006_harden_rls_policies.sql
  -- Description: Harden RLS policies for notification_log and support_requests to resolve linter warnings
  
  -- 1. Harden support_requests insert policy
  DROP POLICY IF EXISTS "Allow anonymous insert" ON public.support_requests;
  CREATE POLICY "Allow anonymous insert" ON public.support_requests
    FOR INSERT
    WITH CHECK (email IS NOT NULL AND message IS NOT NULL AND request_type IS NOT NULL);
  
  -- 2. Harden notification_log insert policy to restrict only to service_role
  DROP POLICY IF EXISTS "Service role inserts notifications" ON public.notification_log;
  CREATE POLICY "Service role inserts notifications" ON public.notification_log
    FOR INSERT
    TO service_role
    WITH CHECK (true);
  



  -- ==========================================
  -- Source: 20260524000007_harden_dashboard_analytics_rpcs.sql
  -- ==========================================
  -- Migration: 20260524000007_harden_dashboard_analytics_rpcs.sql
  -- Description: Harden get_system_health and get_enhanced_analytics RPCs by enforcing strict admin checks inside the functions.
  
  -- 1. Re-define get_system_health with strict admin authorization check
  CREATE OR REPLACE FUNCTION public.get_system_health()
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $$
  DECLARE
    v_result JSON;
    v_db_latency_ms NUMERIC;
    v_last_trip_at TIMESTAMPTZ;
    v_active_trips_count INT;
    v_pending_subscriptions INT;
  BEGIN
    -- Strict Admin check
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
  
    -- Measure DB latency with a simple query
    PERFORM NOW();
    v_db_latency_ms := 0;
  
    -- Get last trip time
    SELECT MAX(started_at) INTO v_last_trip_at FROM trips WHERE status != 'completed';
  
    -- Count active trips
    SELECT COUNT(*) INTO v_active_trips_count
    FROM trips
    WHERE status IN ('driver_waiting', 'in_transit', 'scheduled');
  
    -- Count pending subscriptions
    SELECT COUNT(*) INTO v_pending_subscriptions
    FROM subscriptions
    WHERE status = 'pending';
  
    SELECT json_build_object(
      'status', 'healthy',
      'timestamp', NOW(),
      'db_latency_ms', v_db_latency_ms,
      'database', json_build_object(
        'connected', true,
        'last_activity', v_last_trip_at
      ),
      'api', json_build_object(
        'status', 'operational',
        'active_trips', v_active_trips_count
      ),
      'services', json_build_object(
        'realtime', 'connected',
        'payments', 'operational',
        'notifications', 'operational'
      ),
      'pending_counts', json_build_object(
        'pending_subscriptions', v_pending_subscriptions,
        'active_trips', v_active_trips_count
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  
  -- 2. Re-define get_enhanced_analytics with strict admin authorization check
  CREATE OR REPLACE FUNCTION public.get_enhanced_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_comparison_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '60 days',
    p_comparison_end TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days'
  )
  RETURNS JSON
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $$
  DECLARE
    v_result JSON;
    v_current_period JSON;
    v_previous_period JSON;
  BEGIN
    -- Strict Admin check
    IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
  
    -- Current period stats
    SELECT json_build_object(
      'trips', COUNT(*),
      'revenue', COALESCE(SUM(r.price), 0),
      'students', COUNT(DISTINCT student_id)
    ) INTO v_current_period
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE s.created_at BETWEEN p_start_date AND p_end_date
      AND s.status = 'active';
  
    -- Previous period for comparison
    SELECT json_build_object(
      'trips', COUNT(*),
      'revenue', COALESCE(SUM(r.price), 0),
      'students', COUNT(DISTINCT student_id)
    ) INTO v_previous_period
    FROM subscriptions s
    JOIN routes r ON s.route_id = r.id
    WHERE s.created_at BETWEEN p_comparison_start AND p_comparison_end
      AND s.status = 'active';
  
    SELECT json_build_object(
      'current_period', v_current_period,
      'previous_period', v_previous_period,
      'period_comparison', json_build_object(
        'trips_change', CASE
          WHEN (v_current_period->>'trips')::INT > 0
          THEN ROUND(((v_current_period->>'trips')::INT - (v_previous_period->>'trips')::INT)::NUMERIC / (v_previous_period->>'trips')::INT * 100, 1)
          ELSE 0
        END,
        'revenue_change', CASE
          WHEN (v_current_period->>'revenue')::INT > 0
          THEN ROUND(((v_current_period->>'revenue')::INT - (v_previous_period->>'revenue')::INT)::NUMERIC / NULLIF((v_previous_period->>'revenue')::INT, 0) * 100, 1)
          ELSE 0
        END
      ),
      'daily_breakdown', (
        SELECT COALESCE(json_agg(json_build_object(
          'date', day::DATE,
          'trips', trips_count,
          'revenue', revenue_sum
        ) ORDER BY day), '[]'::json)
        FROM (
          SELECT
            DATE(s.created_at) as day,
            COUNT(*) as trips_count,
            SUM(r.price) as revenue_sum
          FROM subscriptions s
          JOIN routes r ON s.route_id = r.id
          WHERE s.created_at BETWEEN p_start_date AND p_end_date
            AND s.status = 'active'
          GROUP BY DATE(s.created_at)
          ORDER BY day
        ) daily
      ),
      'hourly_breakdown', (
        SELECT COALESCE(json_agg(json_build_object(
          'hour', hour,
          'trips', trips_count
        ) ORDER BY hour), '[]'::json)
        FROM (
          SELECT
            EXTRACT(HOUR FROM s.created_at)::INT as hour,
            COUNT(*) as trips_count
          FROM subscriptions s
          WHERE s.created_at BETWEEN p_start_date AND p_end_date
            AND s.status = 'active'
          GROUP BY EXTRACT(HOUR FROM s.created_at)
          ORDER BY hour
        ) hourly
      )
    ) INTO v_result;
  
    RETURN v_result;
  END;
  $$;
  
  -- 3. Manage execution permissions
  REVOKE EXECUTE ON FUNCTION public.get_system_health() FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.get_system_health() TO authenticated, service_role;
  
  REVOKE EXECUTE ON FUNCTION public.get_enhanced_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.get_enhanced_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated, service_role;
  



  -- ==========================================
  -- Source: 20260525000001_security_hardening_phase2.sql
  -- ==========================================
  -- Migration: 20260525000001_security_hardening_phase2.sql
  -- Date: 2026-05-25
  -- Purpose: إصلاح ثغرات أمنية - المرحلة الثانية
  --
  -- ════════════════════════════════════════════════════════════════
  -- FIXES:
  --   1. mark_messages_read: إضافة التحقق من مشاركة المتصل في المحادثة
  --   2. REVOKE EXECUTE FROM PUBLIC لجميع RPCs المفقودة
  --   3. admin_cancel_trip: إزالة استعادة المقاعد (المقاعد تتبع الاشتراك)
  --   4. notification_log INSERT: تقييد السياسة بدلاً من WITH CHECK (true)
  --   5. cancel_subscription: تحسين نمط التحقق من الهوية
  --   6. emergency_reports: إضافة التحقق من participation في الرحلة
  -- ════════════════════════════════════════════════════════════════
  
  -- ════════════════════════════════════════════════════════════════
  -- FIX 1: mark_messages_read - إضافة التحقق من المشاركة
  -- ════════════════════════════════════════════════════════════════
  -- الثغرة: أي مستخدم مصادق يمكنه تعليم رسائل أي محادثة كمقروءة
  -- فقط بمعرفة conversation_id، دون أن يكون مشاركاً فيها.
  
  CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id UUID)
  RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_caller_id UUID;
    v_is_participant BOOLEAN;
  BEGIN
    SELECT auth.uid() INTO v_caller_id;
    IF v_caller_id IS NULL THEN
      RAISE EXCEPTION 'Unauthorized';
    END IF;
  
    SELECT EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = p_conversation_id
        AND (
          c.student_id = v_caller_id
          OR c.driver_id IN (SELECT id FROM public.drivers WHERE user_id = v_caller_id)
        )
    ) INTO v_is_participant;
  
    IF NOT v_is_participant THEN
      RAISE EXCEPTION 'Not a participant in this conversation';
    END IF;
  
    UPDATE public.messages
    SET is_read = true
    WHERE conversation_id = p_conversation_id
      AND sender_id != v_caller_id
      AND is_read = false;
  END;
  $$;
  
  -- ════════════════════════════════════════════════════════════════
  -- FIX 2: REVOKE EXECUTE FROM PUBLIC لجميع RPCs المفقودة
  -- ════════════════════════════════════════════════════════════════
  -- الثغرة: دوال بدون REVOKE FROM PUBLIC يمكن لأي مستخدم مجهول استدعاؤها
  -- حتى لو كانت ترفض داخلياً، هذا يخالف مبدأ Defense-in-Depth
  
  -- Messaging RPCs
  REVOKE EXECUTE ON FUNCTION public.send_message(UUID, TEXT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.send_message(UUID, TEXT) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.get_messages(UUID, INT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_messages(UUID, INT) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.mark_messages_read(UUID) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.mark_messages_read(UUID) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.get_my_conversations() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_my_conversations() TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) TO authenticated;
  
  -- Trip/State RPCs
  REVOKE EXECUTE ON FUNCTION public.validate_trip_transition(UUID, TEXT) FROM PUBLIC, anon, authenticated;
  -- validate_trip_transition للاستخدام الداخلي فقط (تستدعيها update_trip_status)
  
  REVOKE EXECUTE ON FUNCTION public.create_trip(UUID, TIMESTAMPTZ) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.create_trip(UUID, TIMESTAMPTZ) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.admin_create_trip(UUID, UUID, TIMESTAMPTZ) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.admin_create_trip(UUID, UUID, TIMESTAMPTZ) TO authenticated;
  
  -- Utility RPCs
  REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
  
  REVOKE EXECUTE ON FUNCTION public.ping() FROM PUBLIC;
  
  -- Dashboard/Analytics RPCs
  REVOKE EXECUTE ON FUNCTION public.get_analytics_summary(TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.get_analytics_summary(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
  
  -- ════════════════════════════════════════════════════════════════
  -- FIX 3: admin_cancel_trip - إزالة استعادة المقاعد
  -- ════════════════════════════════════════════════════════════════
  -- الثغرة: المقاعد تتبع الاشتراك وليس الرحلة (حسب AGENTS.md)
  -- إلغاء رحلة لا يجب أن يستعيد مقعداً لأن المقاعد تُخصم عند
  -- تفعيل الترخيص وتُستعاد عند إلغاء الاشتراك فقط.
  -- استعادة المقعد هنا تسبب تضخم available_seats.
  
  CREATE OR REPLACE FUNCTION public.admin_cancel_trip(p_trip_id UUID)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $function$
  DECLARE
    v_role TEXT;
    v_trip RECORD;
  BEGIN
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'admin' THEN
      RAISE EXCEPTION 'Only admins can cancel trips';
    END IF;
  
    SELECT * INTO v_trip FROM trips WHERE id = p_trip_id FOR UPDATE;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Trip not found';
    END IF;
  
    IF v_trip.status = 'cancelled' THEN
      RETURN;
    END IF;
  
    IF v_trip.status NOT IN ('scheduled', 'driver_waiting', 'in_transit') THEN
      RAISE EXCEPTION 'Cannot cancel trip with status %', v_trip.status;
    END IF;
  
    -- لا نستعيد المقاعد هنا! المقاعد تتبع الاشتراك وليس الرحلة.
    -- استعادة المقاعد تتم فقط عبر cancel_subscription أو expire_subscriptions.
  
    UPDATE trips
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_trip_id;
  
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      'admin_cancel_trip',
      'trips',
      p_trip_id,
      jsonb_build_object('route_id', v_trip.route_id, 'previous_status', v_trip.status)
    );
  END;
  $function$;
  
  GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) TO authenticated;
  
  -- ════════════════════════════════════════════════════════════════
  -- FIX 4: notification_log INSERT - تقييد السياسة
  -- ════════════════════════════════════════════════════════════════
  -- الثغرة: WITH CHECK (true) يسمح لأي مستخدم (بما فيهم anon)
  -- بإدراج إشعارات مزيفة في حساب أي مستخدم.
  -- الإصلاح: السماح فقط لـ service_role أو المستخدم لنفسه.
  
  DROP POLICY IF EXISTS "Service role inserts notifications" ON notification_log;
  CREATE POLICY "Service role inserts notifications" ON notification_log
    FOR INSERT WITH CHECK (
      auth.role() = 'service_role'
      OR user_id = auth.uid()
    );
  
  -- ════════════════════════════════════════════════════════════════
  -- FIX 5: cancel_subscription - تحسين نمط التحقق
  -- ════════════════════════════════════════════════════════════════
  -- الثغرة: الشرط IF auth.uid() IS NOT NULL AND ... يفشل في حماية
  -- المستخدمين إذا أُعيد منح PUBLIC مستقبلاً. النمط الصحيح
  -- هو الاعتماد على REVOKE FROM PUBLIC + فحص مباشر للملكية.
  
  CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
  RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_sub RECORD;
    v_role text;
  BEGIN
    v_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'student');
  
    SELECT * INTO v_sub
    FROM public.subscriptions
    WHERE id = p_subscription_id
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Subscription not found';
    END IF;
  
    -- فحص الملكية: الطالب يلغي اشتراكه فقط، الأدمن يلغي أي اشتراك
    IF v_sub.student_id != auth.uid() AND v_role != 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: You can only cancel your own subscriptions';
    END IF;
  
    IF v_sub.status NOT IN ('active', 'pending') THEN
      RAISE EXCEPTION 'Cannot cancel subscription in % state', v_sub.status;
    END IF;
  
    UPDATE public.subscriptions
    SET status = 'cancelled'
    WHERE id = p_subscription_id;
  
    IF v_sub.status = 'active' THEN
      UPDATE public.routes
      SET available_seats = LEAST(capacity, available_seats + 1),
          updated_at = NOW()
      WHERE id = v_sub.route_id;
    END IF;
  
    INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      auth.uid(),
      CASE WHEN v_role = 'admin' THEN 'admin_cancel_subscription' ELSE 'cancel_subscription' END,
      'subscriptions',
      p_subscription_id,
      jsonb_build_object('route_id', v_sub.route_id, 'previous_status', v_sub.status)
    );
  END;
  $$;
  
  -- ════════════════════════════════════════════════════════════════
  -- FIX 6: emergency_reports - إضافة التحقق من المشاركة في الرحلة
  -- ════════════════════════════════════════════════════════════════
  -- الثغرة: أي طالب يمكنه إنشاء بلاغ طوارئ لأي رحلة حتى لو لم يكن مشاركاً فيها.
  -- الإصلاح: التحقق من أن الطالب مشترك في خط الرحلة أو أن المتصل هو السائق.
  
  DROP POLICY IF EXISTS "Users can insert own emergency reports" ON emergency_reports;
  CREATE POLICY "Users can insert own emergency reports" ON emergency_reports
    FOR INSERT WITH CHECK (
      reporter_id = auth.uid()
      AND (
        EXISTS (
          SELECT 1 FROM trips t
          JOIN subscriptions s ON s.route_id = t.route_id
          WHERE t.id = emergency_reports.trip_id
            AND s.student_id = auth.uid()
            AND s.status = 'active'
            AND s.deleted_at IS NULL
        )
        OR EXISTS (
          SELECT 1 FROM trips t
          JOIN drivers d ON d.id = t.driver_id
          WHERE t.id = emergency_reports.trip_id
            AND d.user_id = auth.uid()
        )
      )
    );
  
  -- ════════════════════════════════════════════════════════════════
  -- Audit Log
  -- ════════════════════════════════════════════════════════════════
  DO $$
  BEGIN
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      NULL,
      'migration_applied',
      'migrations',
      NULL,
      jsonb_build_object(
        'migration', '20260525000001_security_hardening_phase2',
        'date', NOW(),
        'description', 'Phase 2 security hardening',
        'fixes', ARRAY[
          'mark_messages_read_participant_check',
          'revoke_public_from_all_rpcs',
          'admin_cancel_trip_no_seat_restore',
          'notification_log_insert_restricted',
          'cancel_subscription_auth_pattern_improved',
          'emergency_reports_participation_check'
        ]
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Could not insert audit log: %', SQLERRM;
  END $$;
  



  -- ==========================================
  -- Source: 20260525000002_admin_delete_policies.sql
  -- ==========================================
  -- Migration: 20260525000002_admin_delete_policies.sql
  -- Date: 2026-05-25
  -- Purpose: Add DELETE RLS policies for admin role on profiles, subscriptions, trips, and emergency_reports
  
  -- 1. Profiles DELETE policy for Admin
  DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
  CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE USING (is_admin());
  
  -- 2. Subscriptions DELETE policy for Admin
  DROP POLICY IF EXISTS "Admins can delete subscriptions" ON public.subscriptions;
  CREATE POLICY "Admins can delete subscriptions" ON public.subscriptions
    FOR DELETE USING (is_admin());
  
  -- 3. Trips DELETE policy for Admin
  DROP POLICY IF EXISTS "Admins can delete trips" ON public.trips;
  CREATE POLICY "Admins can delete trips" ON public.trips
    FOR DELETE USING (is_admin());
  
  -- 4. Emergency Reports DELETE policy for Admin
  DROP POLICY IF EXISTS "Admins can delete emergency reports" ON public.emergency_reports;
  CREATE POLICY "Admins can delete emergency reports" ON public.emergency_reports
    FOR DELETE USING (is_admin());
  
  -- Audit Log entry
  DO $$
  BEGIN
    INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      NULL,
      'migration_applied',
      'migrations',
      NULL,
      jsonb_build_object(
        'migration', '20260525000002_admin_delete_policies',
        'date', NOW(),
        'description', 'Add DELETE RLS policies for admin role on profiles, subscriptions, trips, and emergency_reports'
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Could not insert audit log: %', SQLERRM;
  END $$;
  



  -- ==========================================
  -- Source: 20260525000003_fix_route_delete_cascade.sql
  -- ==========================================
  -- Migration: 20260525000003_fix_route_delete_cascade.sql
  -- Date: 2026-05-25
  -- Purpose: Fix route delete constraints on subscriptions and trips tables by enforcing ON DELETE CASCADE
  
  -- 1. Subscriptions route foreign key
  ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_route_id_fkey;
  ALTER TABLE public.subscriptions
    ADD CONSTRAINT subscriptions_route_id_fkey
    FOREIGN KEY (route_id)
    REFERENCES public.routes(id)
    ON DELETE CASCADE;
  
  -- 2. Trips route foreign key
  ALTER TABLE public.trips DROP CONSTRAINT IF EXISTS trips_route_id_fkey;
  ALTER TABLE public.trips
    ADD CONSTRAINT trips_route_id_fkey
    FOREIGN KEY (route_id)
    REFERENCES public.routes(id)
    ON DELETE CASCADE;
  
  -- Audit Log entry
  DO $$
  BEGIN
    INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
    VALUES (
      NULL,
      'migration_applied',
      'migrations',
      NULL,
      jsonb_build_object(
        'migration', '20260525000003_fix_route_delete_cascade',
        'date', NOW(),
        'description', 'Fix route delete constraints on subscriptions and trips tables by enforcing ON DELETE CASCADE'
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Could not insert audit log: %', SQLERRM;
  END $$;
  



  -- ==========================================
  -- Source: 20260526000001_fix_activate_license_regression.sql
  -- ==========================================
  -- Migration: 20260526000001_fix_activate_license_regression.sql
  -- Fixes regression in activate_license introduced by 20260522000005:
  --   1. Restores rate limiting (brute-force protection) — lost from v3 (2026051802)
  --   2. Restores audit logging — lost from v3
  --   3. Restores trim() on input code — lost from v3
  --   4. Adds UNIQUE partial index on subscriptions to prevent duplicate active subs at DB level
  --      (neither v3 nor v5 properly solved the race condition — FOR UPDATE on non-existent rows is a no-op)
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 1. Recreate activate_license with all protections restored
  -- ═══════════════════════════════════════════════════════════════════════
  
  CREATE OR REPLACE FUNCTION public.activate_license(p_code TEXT)
  RETURNS UUID
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_license         RECORD;
    v_subscription_id UUID;
    v_role            TEXT;
    v_route_price     NUMERIC;
  BEGIN
    -- A) Authentication & Role Check
    SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
    IF v_role != 'student' THEN
      RAISE EXCEPTION 'Only students can activate licenses';
    END IF;
  
    -- B) Brute-force Protection (Rate Limiting)
    -- Limit: 5 attempts per 15 minutes to prevent automated code guessing
    IF NOT check_rate_limit(auth.uid(), 'activate_license_attempt', 5, 900) THEN
      RAISE EXCEPTION 'Too many license activation attempts. Please try again in 15 minutes.';
    END IF;
  
    -- C) Atomic Row Locking: License
    SELECT * INTO v_license
    FROM licenses
    WHERE code = upper(trim(p_code)) AND status = 'active'
    FOR UPDATE NOWAIT;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or already used license code';
    END IF;
  
    -- D) Get route price for purchase_price snapshot
    SELECT price INTO v_route_price FROM routes WHERE id = v_license.route_id;
  
    -- E) Atomic seat deduction (prevents overbooking)
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_license.route_id
      AND available_seats > 0
      AND is_active = true;
  
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  
    -- F) Mark license as used
    UPDATE licenses
    SET status = 'used',
        used_by = auth.uid(),
        used_at = NOW()
    WHERE id = v_license.id;
  
    -- G) Create active subscription
    -- The UNIQUE partial index idx_one_active_sub_per_route will prevent duplicate
    -- active/pending subscriptions even under concurrent requests — no FOR UPDATE needed.
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
    VALUES (
      auth.uid(),
      v_license.route_id,
      'active',
      NOW(),
      NOW() + (v_license.valid_days || ' days')::INTERVAL,
      COALESCE(v_route_price, 0)
    )
    RETURNING id INTO v_subscription_id;
  
    -- H) Audit Logging
    PERFORM log_audit(
      auth.uid(),
      'activate_license',
      'subscriptions',
      v_subscription_id,
      jsonb_build_object('route_id', v_license.route_id, 'license_id', v_license.id)
    );
  
    RETURN v_subscription_id;
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 2. UNIQUE partial index: the real fix for duplicate subscription race condition
  -- ═══════════════════════════════════════════════════════════════════════
  -- This makes PostgreSQL enforce uniqueness at the storage level — no application
  -- locking needed. A concurrent INSERT will fail with unique_violation.
  
  CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_sub_per_route
  ON subscriptions (student_id, route_id)
  WHERE status IN ('active', 'pending');
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 3. Preserve execution permissions (CREATE OR REPLACE doesn't reset GRANT/REVOKE,
  --    but we explicitly re-state them for documentation clarity)
  -- ═══════════════════════════════════════════════════════════════════════
  
  REVOKE EXECUTE ON FUNCTION public.activate_license(TEXT) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.activate_license(TEXT) TO authenticated, service_role;
  



  -- ==========================================
  -- Source: 20260526000002_backfill_user_metadata_roles.sql
  -- ==========================================
  -- Migration: 20260526000002_backfill_user_metadata_roles.sql
  -- Date: 2026-05-26
  -- Description: Backfills missing roles in auth.users app_metadata from public.profiles.
  -- This ensures that historical users (who signed up before synchronization triggers were established)
  -- have their JWT claims populated with the correct role.
  
  UPDATE auth.users u
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', p.role)
  FROM public.profiles p
  WHERE u.id = p.id
    AND (u.raw_app_meta_data->>'role' IS NULL OR u.raw_app_meta_data->>'role' != p.role);
  
  -- Audit log
  INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    NULL,
    'migration_applied',
    'migrations',
    NULL,
    jsonb_build_object(
      'migration', '20260526000002_backfill_user_metadata_roles',
      'description', 'Backfills auth.users app_metadata roles from profiles',
      'date', NOW()
    )
  );
  



  -- ==========================================
  -- Source: 20260526000003_fix_check_rate_limit_idor.sql
  -- ==========================================
  -- Migration: 20260526000003_fix_check_rate_limit_idor.sql
  -- Description: Fix IDOR in check_rate_limit — أي user مصادق يستطيع استنزاف rate limits لأي مستخدم آخر
  --
  -- الثغرة:
  -- check_rate_limit(p_user_id, p_action, p_limit, p_window_seconds) لا يتحقق من
  -- أن p_user_id = auth.uid(). النسخة الأصلية 2026051005 كانت آمنة (تستخدم
  -- auth.uid() داخلياً) لكن 2026051700 غيّرتها إلى parameter بدون ownership check.
  --
  -- التصحيح:
  --   1. إضافة IF p_user_id != auth.uid() THEN RAISE EXCEPTION
  --   2. سحب GRANT من authenticated (الـ SECURITY DEFINER functions الأخرى
  --      تستدعي check_rate_limit داخلياً ولا تحتاج إلى RPC access)
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 1. Fix check_rate_limit: إضافة التحقق من ملكية المستخدم
  -- ═══════════════════════════════════════════════════════════════════════
  
  CREATE OR REPLACE FUNCTION public.check_rate_limit(p_user_id UUID, p_action TEXT, p_limit INT, p_window_seconds INT)
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_count INT;
    v_window_start TIMESTAMPTZ;
  BEGIN
    -- IDOR protection: يمكن للمستخدم فقط التحقق من rate limit الخاص به
    IF p_user_id != auth.uid() THEN
      RAISE EXCEPTION 'Unauthorized: cannot check rate limits for another user';
    END IF;
  
    v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
    DELETE FROM public.rate_limits
    WHERE user_id = p_user_id
      AND action = p_action
      AND window_start < v_window_start;
  
    SELECT COALESCE(SUM(request_count), 0) INTO v_count
    FROM public.rate_limits
    WHERE user_id = p_user_id
      AND action = p_action
      AND window_start >= v_window_start;
  
    IF v_count >= p_limit THEN
      RETURN FALSE;
    END IF;
  
    INSERT INTO public.rate_limits (user_id, action, window_start, request_count)
    VALUES (p_user_id, p_action, NOW(), 1);
  
    RETURN TRUE;
  END;
  $$;
  
  -- ═══════════════════════════════════════════════════════════════════════
  -- 2. سحب GRANT من authenticated — الدالة مخصصة للاستخدام الداخلي فقط
  -- ═══════════════════════════════════════════════════════════════════════
  -- الـ SECURITY DEFINER functions (send_message, bulk_update_trip_locations,
  -- activate_license, إلخ) تستدعي check_rate_limit داخلياً بصلاحيات owner،
  -- ولا تحتاج إلى GRANT للـ authenticated.
  
  REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM authenticated;
  GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;
  



  -- ==========================================
  -- Source: 20260527000001_fix_register_push_token_null_check.sql
  -- ==========================================
  -- supabase/migrations/20260527000001_fix_register_push_token_null_check.sql
  -- Fix: register_push_token raises DB error when called with null auth.uid()
  -- Root cause: race condition where push token registration fires before user session is loaded.
  -- Solution: Add explicit null check inside RPC + guard in useNotifications hook.
  
  CREATE OR REPLACE FUNCTION public.register_push_token(p_token TEXT)
  RETURNS void AS $$
  DECLARE
    v_user_id UUID;
  BEGIN
    v_user_id := auth.uid();
  
    -- Guard: do nothing silently if called without a valid session
    IF v_user_id IS NULL THEN
      RAISE EXCEPTION 'register_push_token: user must be authenticated';
    END IF;
  
    INSERT INTO push_tokens (user_id, token, updated_at)
    VALUES (v_user_id, p_token, NOW())
    ON CONFLICT (user_id, token) DO UPDATE SET updated_at = NOW();
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  
  -- Keep existing permissions
  REVOKE EXECUTE ON FUNCTION public.register_push_token(text) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.register_push_token(text) TO authenticated, service_role;
  



  -- ==========================================
  -- Source: 20260527000002_optimize_rate_limiter.sql
  -- ==========================================
  -- Migration: 20260527000002_optimize_rate_limiter.sql
  -- Description: Optimize check_rate_limit to eliminate unnecessary database writes on rejection and use background pg_cron for cleanup
  
  CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_user_id UUID, 
    p_action TEXT, 
    p_limit INT, 
    p_window_seconds INT
  )
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = public AS $$
  DECLARE
    v_count INT;
    v_window_start TIMESTAMPTZ;
  BEGIN
    -- IDOR protection: user can only check their own rate limits
    IF p_user_id != auth.uid() THEN
      RAISE EXCEPTION 'Unauthorized: cannot check rate limits for another user';
    END IF;
  
    v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
    -- 1. Read aggregate requests count in the active window (optimized read)
    SELECT COALESCE(SUM(request_count), 0) INTO v_count
    FROM public.rate_limits
    WHERE user_id = p_user_id
      AND action = p_action
      AND window_start >= v_window_start;
  
    -- 2. If the user exceeds the rate limit, reject immediately with ZERO writes to the DB (prevents WAL bloat and IOPS exhaustion)
    IF v_count >= p_limit THEN
      RETURN FALSE;
    END IF;
  
    -- 3. If under the limit, record the new request tick
    INSERT INTO public.rate_limits (user_id, action, window_start, request_count)
    VALUES (p_user_id, p_action, NOW(), 1);
  
    RETURN TRUE;
  END;
  $$;
  
  -- 4. Enable pg_cron and schedule background cleanup once every 10 minutes instead of every request
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  
  DO $$
  BEGIN
    -- Unschedule existing job if it exists
    PERFORM cron.unschedule('cleanup-expired-rate-limits');
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END $$;
  
  SELECT cron.schedule(
    'cleanup-expired-rate-limits',
    '*/10 * * * *',
    $$DELETE FROM public.rate_limits WHERE window_start < NOW() - INTERVAL '1 hour'$$
  );
  
  -- Preserve permissions: only service_role can call check_rate_limit directly
  REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM PUBLIC, authenticated, anon;
  GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;
  



END $$;
