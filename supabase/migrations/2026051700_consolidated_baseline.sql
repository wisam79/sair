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
