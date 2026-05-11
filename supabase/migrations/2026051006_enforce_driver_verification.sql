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
