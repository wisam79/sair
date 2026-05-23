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
