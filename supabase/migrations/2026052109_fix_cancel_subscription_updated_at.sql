-- UniRide: Fix cancel_subscription updated_at column on subscriptions table

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

  -- Cancel the subscription (Remove updated_at as it does not exist on subscriptions)
  UPDATE public.subscriptions
  SET status = 'cancelled'
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
