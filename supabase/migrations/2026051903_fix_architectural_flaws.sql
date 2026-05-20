-- 1. Fix Transaction Rollback Bug in complete_payment_and_activate_subscription
-- Returning the failed payment instead of raising an exception that rolls back the UPDATE.

CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
  p_zaincash_order_id TEXT,
  p_valid_days INT DEFAULT 30
) RETURNS payments
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_payment payments%ROWTYPE;
  v_subscription subscriptions;
  v_route routes%ROWTYPE;
BEGIN
  -- Find pending payment with NOWAIT
  SELECT * INTO v_payment
  FROM payments
  WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
  FOR UPDATE NOWAIT;

  IF v_payment IS NULL THEN
    RAISE EXCEPTION 'Payment not found or already processed';
  END IF;

  -- Check for existing active subscription (Duplicate check)
  IF EXISTS (
    SELECT 1 FROM subscriptions
    WHERE student_id = v_payment.user_id
      AND route_id = v_payment.route_id
      AND status IN ('active', 'pending')
    FOR UPDATE
  ) THEN
    -- Update payment to failed due to duplicate and return it instead of rolling back
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END IF;

  -- Verify and deduct seat atomically
  UPDATE routes
  SET available_seats = available_seats - 1
  WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;

  IF NOT FOUND THEN
    -- Update payment to failed due to no seats and return it instead of rolling back
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END IF;

  -- Create subscription
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
  VALUES (
    v_payment.user_id,
    v_payment.route_id,
    'active',
    NOW(),
    NOW() + (p_valid_days || ' days')::INTERVAL
  )
  RETURNING * INTO v_subscription;

  -- Update payment status
  UPDATE payments
  SET status = 'completed', completed_at = NOW(), updated_at = NOW()
  WHERE id = v_payment.id;

  -- Return updated payment
  SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
  RETURN v_payment;
END;
$$;

-- 2. Add bulk GPS location update RPC to solve N+1 problem

CREATE OR REPLACE FUNCTION bulk_update_trip_locations(p_locations JSONB) RETURNS JSONB AS $$
DECLARE
  v_driver_id UUID;
  v_location RECORD;
  v_failed JSONB := '[]'::JSONB;
  v_status TEXT;
  v_success_count INT := 0;
BEGIN
  -- Get current driver from auth
  SELECT d.id INTO v_driver_id FROM drivers d WHERE d.user_id = auth.uid();
  IF v_driver_id IS NULL THEN 
    RAISE EXCEPTION 'Driver profile not found'; 
  END IF;

  FOR v_location IN SELECT * FROM jsonb_to_recordset(p_locations) AS x(tripId UUID, lat NUMERIC, lng NUMERIC)
  LOOP
    SELECT status INTO v_status FROM trips WHERE id = v_location.tripId AND driver_id = v_driver_id;
    
    IF v_status IN ('driver_waiting', 'in_transit') THEN
      UPDATE trips SET last_lat = v_location.lat, last_lng = v_location.lng, updated_at = NOW() WHERE id = v_location.tripId;
      v_success_count := v_success_count + 1;
    ELSE
      v_failed := v_failed || jsonb_build_object('tripId', v_location.tripId, 'error', 'Invalid status or trip not found');
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success_count', v_success_count, 'failed', v_failed);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
