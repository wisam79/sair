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
