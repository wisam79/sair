-- Create the cancel_subscription RPC to safely handle business logic and seat return.
CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
RETURNS void AS $$
DECLARE
  v_student_id uuid;
  v_route_id uuid;
  v_status text;
  v_role text;
BEGIN
  -- Get user role safely using app_metadata (as per rules)
  v_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'student');

  -- Lock the subscription row to prevent race conditions
  SELECT student_id, route_id, status
  INTO v_student_id, v_route_id, v_status
  FROM public.subscriptions
  WHERE id = p_subscription_id
  FOR UPDATE;

  -- Ensure subscription exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;

  -- Verify ownership (student can only cancel their own, admin can cancel any)
  IF auth.uid() IS NOT NULL AND auth.uid() != v_student_id AND v_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: You can only cancel your own subscriptions';
  END IF;

  -- Verify status
  IF v_status NOT IN ('active', 'pending') THEN
    RAISE EXCEPTION 'Cannot cancel subscription in % state', v_status;
  END IF;

  -- Return seat: Implicit FOR UPDATE locking applied by the UPDATE statement
  UPDATE public.routes
  SET available_seats = available_seats + 1
  WHERE id = v_route_id;

  -- Cancel the subscription
  UPDATE public.subscriptions
  SET status = 'cancelled'
  WHERE id = p_subscription_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
