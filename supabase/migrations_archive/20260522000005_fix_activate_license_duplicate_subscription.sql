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