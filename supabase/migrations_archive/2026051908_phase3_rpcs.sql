-- Add RPCs for Phase 3 Mobile Features

-- 1. get_unread_count
CREATE OR REPLACE FUNCTION get_unread_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER;
  v_uid UUID := auth.uid();
BEGIN
  SELECT count(*) INTO v_count
  FROM messages m
  JOIN conversations c ON m.conversation_id = c.id
  WHERE (c.driver_id = v_uid OR c.student_id = v_uid)
    AND m.sender_id != v_uid
    AND m.is_read = false;
  
  RETURN coalesce(v_count, 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION get_unread_count FROM public;
GRANT EXECUTE ON FUNCTION get_unread_count TO authenticated;

-- 2. get_driver_balance
CREATE OR REPLACE FUNCTION get_driver_balance()
RETURNS TABLE(total_earned numeric, total_paid numeric, available_balance numeric)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_driver_id UUID;
  v_earned numeric := 0;
  v_paid numeric := 0;
BEGIN
  SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid;
  
  IF v_driver_id IS NULL THEN
    RETURN QUERY SELECT 0::numeric, 0::numeric, 0::numeric;
    RETURN;
  END IF;

  -- Calculate total earned from all subscriptions (active and expired, not cancelled/pending)
  SELECT coalesce(sum(r.price), 0) INTO v_earned
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');

  -- Calculate total paid (or pending withdrawal) from driver_payouts
  SELECT coalesce(sum(amount), 0) INTO v_paid
  FROM driver_payouts
  WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');

  RETURN QUERY SELECT 
    v_earned as total_earned,
    v_paid as total_paid,
    (v_earned - v_paid) as available_balance;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_driver_balance FROM public;
GRANT EXECUTE ON FUNCTION get_driver_balance TO authenticated;

-- 3. request_payout
CREATE OR REPLACE FUNCTION request_payout(p_amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_driver_id UUID;
  v_earned numeric := 0;
  v_paid numeric := 0;
  v_available numeric := 0;
BEGIN
  -- Verify the role
  IF coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') != 'driver' THEN
    RAISE EXCEPTION 'Only drivers can request payouts';
  END IF;

  SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid;

  IF v_driver_id IS NULL THEN
    RAISE EXCEPTION 'Driver profile not found';
  END IF;

  -- Calculate balances
  SELECT coalesce(sum(r.price), 0) INTO v_earned
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE r.driver_id = v_driver_id AND s.status IN ('active', 'expired');

  SELECT coalesce(sum(amount), 0) INTO v_paid
  FROM driver_payouts
  WHERE driver_id = v_driver_id AND status IN ('completed', 'pending');
  
  v_available := v_earned - v_paid;

  IF p_amount > v_available THEN
    RAISE EXCEPTION 'Requested amount exceeds available balance';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  INSERT INTO driver_payouts (driver_id, amount, status)
  VALUES (v_driver_id, p_amount, 'pending');
END;
$$;

REVOKE EXECUTE ON FUNCTION request_payout(numeric) FROM public;
GRANT EXECUTE ON FUNCTION request_payout(numeric) TO authenticated;
