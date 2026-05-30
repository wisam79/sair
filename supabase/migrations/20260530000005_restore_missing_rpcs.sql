-- =================================================================
-- Migration: 20260530000005_restore_missing_rpcs.sql
-- Purpose: Restore all missing RPCs that were embedded inside the
--          consolidated DO $$ block and never actually applied to DB.
-- Also fixes RLS policies for profiles, routes, and payments.
-- =================================================================

-- ── Extensions ───────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Helper: update_updated_at_column (idempotent) ─────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── Helper: get_my_role ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$;

-- ── Helper: is_admin ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT get_my_role() = 'admin';
$$;

-- ── check_rate_limit ──────────────────────────────────────────────
-- Only callable by service_role. Internal SECURITY DEFINER functions
-- call this with elevated privileges. Authenticated users are blocked.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id       UUID,
  p_action        TEXT,
  p_limit         INT,
  p_window_seconds INT
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count    INT;
  v_window   TIMESTAMPTZ;
BEGIN
  v_window := NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Try to update existing window entry
  UPDATE rate_limits
  SET request_count = request_count + 1
  WHERE user_id = p_user_id
    AND action  = p_action
    AND window_start > v_window;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  IF v_count = 0 THEN
    -- Purge old entries and insert fresh
    DELETE FROM rate_limits
    WHERE user_id = p_user_id
      AND action  = p_action
      AND window_start <= v_window;

    INSERT INTO rate_limits (user_id, action, window_start, request_count)
    VALUES (p_user_id, p_action, NOW(), 1);

    RETURN TRUE;
  END IF;

  -- Check if over limit
  SELECT request_count INTO v_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND action  = p_action
    AND window_start > v_window
  ORDER BY window_start DESC
  LIMIT 1;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;

-- ── create_license_batch ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_license_batch(
  p_route_id   UUID,
  p_batch_name TEXT,
  p_quantity   INT,
  p_price      NUMERIC,
  p_valid_days INT DEFAULT 30
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_batch_id UUID;
  v_code     TEXT;
  i          INT;
  v_role     TEXT;
BEGIN
  v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can create license batches';
  END IF;

  INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
  VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
  RETURNING id INTO v_batch_id;

  FOR i IN 1..p_quantity LOOP
    LOOP
      v_code := upper(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
      BEGIN
        INSERT INTO licenses (batch_id, route_id, code, status, valid_days)
        VALUES (v_batch_id, p_route_id, v_code, 'available', p_valid_days);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        -- Retry with new code
      END;
    END LOOP;
  END LOOP;

  RETURN v_batch_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) TO authenticated, service_role;

-- ── activate_license ──────────────────────────────────────────────
-- Accepts 'available' OR 'reserved' license codes (supports both flows)
CREATE OR REPLACE FUNCTION public.activate_license(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_license      RECORD;
  v_subscription_id UUID;
  v_role         TEXT;
  v_route_price  NUMERIC;
BEGIN
  v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can activate licenses';
  END IF;

  -- Rate limiting via service-level call
  IF NOT public.check_rate_limit(auth.uid(), 'activate_license_attempt', 5, 900) THEN
    RAISE EXCEPTION 'Too many license activation attempts. Please try again in 15 minutes.';
  END IF;

  SELECT * INTO v_license
  FROM licenses
  WHERE code = upper(trim(p_code))
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  -- Accept both 'available' (direct admin batch) and 'reserved' (pre-sold)
  IF v_license.status NOT IN ('available', 'reserved') THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  IF v_license.expires_at IS NOT NULL AND v_license.expires_at < NOW() THEN
    UPDATE licenses SET status = 'expired' WHERE id = v_license.id;
    UPDATE routes SET available_seats = LEAST(capacity, available_seats + 1) WHERE id = v_license.route_id;
    RAISE EXCEPTION 'License has expired';
  END IF;

  IF EXISTS (
    SELECT 1 FROM subscriptions
    WHERE student_id = auth.uid()
      AND route_id   = v_license.route_id
      AND status IN ('active', 'pending')
  ) THEN
    RAISE EXCEPTION 'Already subscribed to this route';
  END IF;

  SELECT price INTO v_route_price FROM routes WHERE id = v_license.route_id;

  -- If 'available' (not pre-sold), we still need to deduct a seat
  IF v_license.status = 'available' THEN
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_license.route_id
      AND available_seats > 0
      AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  END IF;

  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    auth.uid(),
    v_license.route_id,
    'active',
    NOW(),
    NOW() + (COALESCE(v_license.valid_days, 30) || ' days')::INTERVAL,
    COALESCE(v_route_price, 0)
  )
  RETURNING id INTO v_subscription_id;

  UPDATE licenses
  SET status   = 'used',
      used_by  = auth.uid(),
      used_at  = NOW()
  WHERE id = v_license.id;

  PERFORM public.log_audit(
    auth.uid(), 'activate_license', 'subscriptions', v_subscription_id,
    jsonb_build_object('route_id', v_license.route_id, 'license_id', v_license.id)
  );

  RETURN v_subscription_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.activate_license(TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.activate_license(TEXT) TO authenticated, service_role;

-- ── cancel_subscription ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_sub    RECORD;
  v_caller UUID := auth.uid();
BEGIN
  SELECT * INTO v_sub
  FROM subscriptions
  WHERE id = p_subscription_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;

  IF v_sub.student_id != v_caller AND get_my_role() != 'admin' THEN
    RAISE EXCEPTION 'Not authorized to cancel this subscription';
  END IF;

  IF v_sub.status NOT IN ('active', 'pending') THEN
    RAISE EXCEPTION 'Cannot cancel subscription in % state', v_sub.status;
  END IF;

  UPDATE subscriptions
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_subscription_id;
  -- Seat is restored by the on_subscription_cancel trigger
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cancel_subscription(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.cancel_subscription(UUID) TO authenticated, service_role;

-- ── get_driver_balance ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_driver_balance()
RETURNS TABLE(total_earned NUMERIC, total_paid NUMERIC, available_balance NUMERIC)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_driver_id UUID;
  v_earned    NUMERIC := 0;
  v_paid      NUMERIC := 0;
BEGIN
  SELECT id INTO v_driver_id FROM drivers WHERE user_id = auth.uid();

  IF v_driver_id IS NULL THEN
    RETURN QUERY SELECT 0::NUMERIC, 0::NUMERIC, 0::NUMERIC;
    RETURN;
  END IF;

  SELECT COALESCE(SUM(s.purchase_price), 0) INTO v_earned
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE r.driver_id = v_driver_id
    AND s.status IN ('active', 'expired');

  SELECT COALESCE(SUM(amount), 0) INTO v_paid
  FROM driver_payouts
  WHERE driver_id = v_driver_id
    AND status IN ('completed', 'pending');

  RETURN QUERY SELECT v_earned, v_paid, (v_earned - v_paid);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_driver_balance() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_driver_balance() TO authenticated, service_role;

-- ── request_payout ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.request_payout(p_amount NUMERIC)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_driver_id UUID;
  v_earned    NUMERIC := 0;
  v_paid      NUMERIC := 0;
  v_available NUMERIC := 0;
BEGIN
  IF get_my_role() != 'driver' THEN
    RAISE EXCEPTION 'Only drivers can request payouts';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  SELECT id INTO v_driver_id FROM drivers WHERE user_id = auth.uid() FOR UPDATE NOWAIT;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Driver profile not found';
  END IF;

  SELECT COALESCE(SUM(s.purchase_price), 0) INTO v_earned
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE r.driver_id = v_driver_id
    AND s.status IN ('active', 'expired');

  SELECT COALESCE(SUM(amount), 0) INTO v_paid
  FROM driver_payouts
  WHERE driver_id = v_driver_id
    AND status IN ('completed', 'pending');

  v_available := v_earned - v_paid;

  IF p_amount > v_available THEN
    RAISE EXCEPTION 'Requested amount exceeds available balance';
  END IF;

  INSERT INTO driver_payouts (driver_id, amount, status)
  VALUES (v_driver_id, p_amount, 'pending');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.request_payout(NUMERIC) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.request_payout(NUMERIC) TO authenticated, service_role;

-- ── update_payout_status ──────────────────────────────────────────
-- Drop first to allow changing return type (void -> JSONB)
DROP FUNCTION IF EXISTS public.update_payout_status(UUID, TEXT);
CREATE OR REPLACE FUNCTION public.update_payout_status(
  p_payout_id  UUID,
  p_new_status TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_payout RECORD;
BEGIN
  IF get_my_role() != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;

  SELECT * INTO v_payout
  FROM driver_payouts
  WHERE id = p_payout_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payout not found';
  END IF;

  IF v_payout.status NOT IN ('pending') THEN
    RAISE EXCEPTION 'Cannot update payout with status %', v_payout.status;
  END IF;

  IF p_new_status NOT IN ('completed', 'rejected') THEN
    RAISE EXCEPTION 'Invalid payout status: %', p_new_status;
  END IF;

  UPDATE driver_payouts
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_payout_id;

  RETURN (SELECT row_to_json(d)::JSONB FROM driver_payouts d WHERE id = p_payout_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_payout_status(UUID, TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.update_payout_status(UUID, TEXT) TO authenticated, service_role;

-- ── log_audit (idempotent) ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_audit(
  p_user_id    UUID,
  p_action     TEXT,
  p_resource   TEXT,
  p_resource_id UUID,
  p_details    JSONB
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (p_user_id, p_action, p_resource, p_resource_id, p_details);
EXCEPTION WHEN OTHERS THEN
  NULL; -- Never let audit failures break business logic
END;
$$;

-- ── RLS: profiles — prevent role escalation ───────────────────────
-- Drop existing overly permissive update policy
DROP POLICY IF EXISTS "Profiles: Users update own" ON profiles;

-- Users can update their own profile but NOT the role column
CREATE POLICY "Profiles: Users update own (no role change)"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Trigger to enforce role protection at the data level
CREATE OR REPLACE FUNCTION public.enforce_profile_privileged_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Only service_role or admin can change role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF get_my_role() NOT IN ('admin') THEN
      NEW.role := OLD.role; -- Silently revert
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_fields ON profiles;
CREATE TRIGGER trg_enforce_profile_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_privileged_fields();

-- ── RLS: routes — drivers see their own (even inactive) ───────────
DROP POLICY IF EXISTS "Routes: Driver sees own routes" ON routes;
CREATE POLICY "Routes: Driver sees own routes"
  ON routes FOR SELECT
  USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

-- Drivers can update their own routes
DROP POLICY IF EXISTS "Routes: Driver manages own" ON routes;
CREATE POLICY "Routes: Driver manages own"
  ON routes FOR ALL
  USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  )
  WITH CHECK (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

-- ── RLS: payments — students see own payments ─────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments'
      AND policyname = 'Payments: Student sees own'
  ) THEN
    CREATE POLICY "Payments: Student sees own"
      ON payments FOR SELECT
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments'
      AND policyname = 'Payments: Admins see all'
  ) THEN
    CREATE POLICY "Payments: Admins see all"
      ON payments FOR ALL
      USING (get_my_role() = 'admin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments'
      AND policyname = 'Payments: service_role full access'
  ) THEN
    CREATE POLICY "Payments: service_role full access"
      ON payments FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ── Make sure RLS is enabled on payments ──────────────────────────
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ── Ensure subscriptions trigger is attached ──────────────────────
-- First ensure handle_subscription_change exists (defined fully in migration 006,
-- but we need a stub here so the trigger can be created without error)
CREATE OR REPLACE FUNCTION public.handle_subscription_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.status IN ('active', 'pending')
     AND NEW.status IN ('cancelled', 'expired') THEN
    UPDATE routes
    SET available_seats = LEAST(capacity, available_seats + 1)
    WHERE id = OLD.route_id;
  END IF;

  IF TG_OP = 'DELETE' AND OLD.status IN ('active', 'pending') THEN
    UPDATE routes
    SET available_seats = LEAST(capacity, available_seats + 1)
    WHERE id = OLD.route_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
CREATE TRIGGER on_subscription_cancel
  AFTER UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_change();

-- ── Ensure updated_at trigger is on driver_payouts ───────────────
DROP TRIGGER IF EXISTS trg_driver_payouts_updated_at ON driver_payouts;
CREATE TRIGGER trg_driver_payouts_updated_at
  BEFORE UPDATE ON driver_payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
