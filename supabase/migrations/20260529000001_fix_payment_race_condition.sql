-- Fix Race Condition in complete_payment_and_activate_subscription
-- By creating subscription first, then deducting seat, wrapped in a subtransaction to handle failures atomically.

CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
  p_zaincash_order_id TEXT,
  p_valid_days INT DEFAULT 30
) RETURNS payments
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_payment payments%ROWTYPE;
  v_subscription subscriptions;
BEGIN
  -- 1. Find and lock the pending payment with NOWAIT
  SELECT * INTO v_payment
  FROM payments
  WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
  FOR UPDATE NOWAIT;

  IF v_payment IS NULL THEN
    RAISE EXCEPTION 'Payment not found or already processed';
  END IF;

  -- 2. Check for existing active subscription (Duplicate check)
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

  -- 3. Execute subscription insertion and seat deduction atomically using a subtransaction block
  BEGIN
    -- Create subscription first
    INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
    VALUES (
      v_payment.user_id,
      v_payment.route_id,
      'active',
      NOW(),
      NOW() + (p_valid_days || ' days')::INTERVAL,
      v_payment.amount
    )
    RETURNING * INTO v_subscription;

    -- Then deduct seat atomically
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Any failure inside the block (e.g. duplicate subscription, constraint violation, no seats)
    -- will rollback the subscription creation and seat deduction.
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
    RETURN v_payment;
  END;

  -- 4. Update payment status to completed
  UPDATE payments
  SET status = 'completed', completed_at = NOW(), updated_at = NOW()
  WHERE id = v_payment.id;

  -- Return updated payment
  SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
  RETURN v_payment;
END;
$$;
