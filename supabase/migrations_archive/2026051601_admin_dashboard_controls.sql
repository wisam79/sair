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
