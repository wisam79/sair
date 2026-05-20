-- UniRide M8: ZainCash Payments Table
-- Tracks payment state for ZainCash integration
-- Checkout creates pending payment → Webhook confirms and activates subscription

-- Payments table for ZainCash integration
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
  amount INT NOT NULL CHECK (amount > 0),
  zaincash_order_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_zaincash_order_id ON payments(zaincash_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- RLS: Users see own payments, admins see all
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments: Users see own" ON payments
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Payments: Service role can insert" ON payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Payments: Service role can update" ON payments
  FOR UPDATE USING (true);

-- RPC to create a pending payment (called by zaincash-checkout)
CREATE OR REPLACE FUNCTION create_payment(
  p_user_id UUID,
  p_route_id UUID,
  p_amount INT,
  p_zaincash_order_id TEXT
) RETURNS payments AS $$
DECLARE
  v_payment payments;
BEGIN
  INSERT INTO payments (user_id, route_id, amount, zaincash_order_id, status)
  VALUES (p_user_id, p_route_id, p_amount, p_zaincash_order_id, 'pending')
  RETURNING * INTO v_payment;
  RETURN v_payment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to complete payment and activate subscription (called by zaincash-webhook)
CREATE OR REPLACE FUNCTION complete_payment_and_activate_subscription(
  p_zaincash_order_id TEXT,
  p_valid_days INT DEFAULT 30
) RETURNS payments AS $$
DECLARE
  v_payment payments%ROWTYPE;
  v_subscription subscriptions;
  v_route routes%ROWTYPE;
BEGIN
  -- Find pending payment with row lock
  SELECT * INTO v_payment
  FROM payments
  WHERE zaincash_order_id = p_zaincash_order_id AND status = 'pending'
  FOR UPDATE;

  IF v_payment IS NULL THEN
    RAISE EXCEPTION 'Payment not found or already processed';
  END IF;

  -- Get route info
  SELECT * INTO v_route FROM routes WHERE id = v_payment.route_id;

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

  -- Increment available_seats counter (subscription consumes a seat)
  UPDATE routes
  SET available_seats = available_seats - 1
  WHERE id = v_payment.route_id AND available_seats > 0;

  -- Return updated payment
  SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
  RETURN v_payment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();