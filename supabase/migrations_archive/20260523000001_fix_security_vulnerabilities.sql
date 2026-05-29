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