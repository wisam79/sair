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