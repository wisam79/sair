-- activate_card: Atomically activate a subscription card
-- Locks the card row, validates it, marks as used, creates subscription
CREATE OR REPLACE FUNCTION activate_card(p_card_code TEXT, p_student_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_card RECORD;
  v_subscription_id UUID;
BEGIN
  -- Lock the card row for update to prevent concurrent activation
  SELECT * INTO v_card FROM cards WHERE code = p_card_code FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found';
  END IF;

  IF v_card.is_used THEN
    RAISE EXCEPTION 'Card already used';
  END IF;

  -- Mark card as used
  UPDATE cards
  SET is_used = TRUE, used_by = p_student_id, used_at = NOW()
  WHERE id = v_card.id;

  -- Create subscription atomically
  INSERT INTO subscriptions (student_id, driver_id, monthly_fee, status, start_date, end_date)
  VALUES (
    p_student_id,
    v_card.driver_id,
    v_card.monthly_fee,
    'active',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days'
  )
  RETURNING id INTO v_subscription_id;

  RETURN v_subscription_id;
END;
$$;
