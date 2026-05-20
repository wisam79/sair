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
