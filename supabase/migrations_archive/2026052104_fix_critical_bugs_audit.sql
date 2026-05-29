-- UniRide M12: DB Audit Fixes
-- 1. Add purchase_price snapshot to subscriptions to prevent retroactive earnings calculation changes.
-- 2. Prevent overbooking / capacity bypass in activate_license by adding seat deduction and capacity verification.
-- 3. Synchronize profiles role changes to auth.users raw_app_meta_data (e.g. for bulk imports).
-- 4. Clean up any leftover duplicate seat triggers.

-- ════════════════════════════════════════════════
-- 1. Subscriptions Table Alteration
-- ════════════════════════════════════════════════
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS purchase_price NUMERIC NOT NULL DEFAULT 0;

-- Backfill existing subscriptions using route price
UPDATE public.subscriptions s
SET purchase_price = COALESCE((SELECT price FROM public.routes r WHERE r.id = s.route_id), 0)
WHERE s.purchase_price = 0;

-- ════════════════════════════════════════════════
-- 2. Modify complete_payment_and_activate_subscription to record purchase_price
-- ════════════════════════════════════════════════
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

  -- Update payment status
  UPDATE payments
  SET status = 'completed', completed_at = NOW(), updated_at = NOW()
  WHERE id = v_payment.id;

  -- Return updated payment
  SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
  RETURN v_payment;
END;
$$;

-- ════════════════════════════════════════════════
-- 3. Modify activate_license to support atomic seat verification and deduct + record purchase_price
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION activate_license(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_license RECORD;
  v_subscription_id UUID;
  v_role TEXT;
  v_route_price NUMERIC;
BEGIN
  -- Verify caller is student
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can activate licenses';
  END IF;

  -- Find and lock the license to prevent race conditions
  SELECT * INTO v_license
  FROM licenses
  WHERE code = upper(p_code) AND status = 'active'
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  -- Get route price for snapshotting
  SELECT price INTO v_route_price FROM routes WHERE id = v_license.route_id;

  -- Verify and deduct seat atomically (prevent overbooking)
  UPDATE routes
  SET available_seats = available_seats - 1
  WHERE id = v_license.route_id AND available_seats > 0 AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No seats available for this route or route is inactive';
  END IF;

  -- Mark license as used
  UPDATE licenses 
  SET status = 'used', used_by = auth.uid(), used_at = NOW()
  WHERE id = v_license.id;

  -- Create active subscription
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    auth.uid(), 
    v_license.route_id, 
    'active', 
    NOW(), 
    NOW() + (v_license.valid_days || ' days')::INTERVAL,
    COALESCE(v_route_price, 0)
  )
  RETURNING id INTO v_subscription_id;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ════════════════════════════════════════════════
-- 4. Redefine get_driver_balance and request_payout to use purchase_price
-- ════════════════════════════════════════════════
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
  -- Use purchase_price instead of routes.price to avoid retroactive recalculations
  SELECT coalesce(sum(s.purchase_price), 0) INTO v_earned
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

  -- Pessimistic locking of the driver profile to prevent double-spending race conditions
  SELECT id INTO v_driver_id FROM drivers WHERE user_id = v_uid FOR UPDATE NOWAIT;

  IF v_driver_id IS NULL THEN
    RAISE EXCEPTION 'Driver profile not found';
  END IF;

  -- Calculate balances using purchase_price
  SELECT coalesce(sum(s.purchase_price), 0) INTO v_earned
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

-- ════════════════════════════════════════════════
-- 5. Role Synchronization Trigger on public.profiles
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION sync_profile_role_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if role has changed or it's a new row
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role) THEN
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_role_changed ON profiles;
CREATE TRIGGER on_profile_role_changed
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_role_to_auth();

-- ════════════════════════════════════════════════
-- 6. Seat Restoration Cleanup (Ensure double seat return is prevented)
-- ════════════════════════════════════════════════
DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
