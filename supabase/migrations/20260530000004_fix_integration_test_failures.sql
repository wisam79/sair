-- ============================================================
-- Migration: 20260530000004_fix_integration_test_failures.sql
-- Fix all issues found by integration test suite:
-- 1. Rename/alias payouts -> driver_payouts
-- 2. Fix update_trip_status: transitions + ended_at + error message
-- 3. Add complete_payment_and_activate_subscription RPC
-- 4. Fix check_rate_limit: revoke from authenticated, grant to service_role
-- 5. Add purchase_price column to subscriptions
-- ============================================================

-- ── 1. Add purchase_price column to subscriptions if missing ──
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'subscriptions'
      AND column_name = 'purchase_price'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN purchase_price NUMERIC(12,2);
  END IF;
END $$;

-- ── 2. Create driver_payouts table (canonical name per AGENTS.md) ──
-- The old table may be called "payouts". We create driver_payouts if missing.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'driver_payouts'
  ) THEN
    CREATE TABLE public.driver_payouts (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      driver_id   UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
      amount      NUMERIC(12,2) NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'completed', 'rejected')),
      notes       TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE driver_payouts ENABLE ROW LEVEL SECURITY;

    -- Trigger for updated_at
    DROP TRIGGER IF EXISTS trg_driver_payouts_updated_at ON driver_payouts;
    CREATE TRIGGER trg_driver_payouts_updated_at
      BEFORE UPDATE ON driver_payouts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ── RLS Policies for driver_payouts ──
DO $$
BEGIN
  -- Drivers see own payouts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'driver_payouts'
      AND policyname = 'Driver Payouts: Driver sees own'
  ) THEN
    CREATE POLICY "Driver Payouts: Driver sees own"
      ON driver_payouts FOR SELECT
      USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
  END IF;

  -- Admins see all
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'driver_payouts'
      AND policyname = 'Driver Payouts: Admins see all'
  ) THEN
    CREATE POLICY "Driver Payouts: Admins see all"
      ON driver_payouts FOR ALL
      USING (get_my_role() = 'admin');
  END IF;

  -- Service role can insert (for tests)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'driver_payouts'
      AND policyname = 'Driver Payouts: service_role full access'
  ) THEN
    CREATE POLICY "Driver Payouts: service_role full access"
      ON driver_payouts FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ── 3. Fix update_trip_status ──
-- Correct transition table per AGENTS.md + set ended_at + fix error message
CREATE OR REPLACE FUNCTION public.update_trip_status(
  p_trip_id   UUID,
  p_new_status TEXT,
  p_lat        NUMERIC,
  p_lng        NUMERIC,
  p_driver_id  UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trip_driver_id UUID;
  v_current_status TEXT;
  v_valid          BOOLEAN;
BEGIN
  -- Lock the row and fetch current state
  SELECT driver_id, status
    INTO v_trip_driver_id, v_current_status
  FROM trips
  WHERE id = p_trip_id
  FOR UPDATE;

  IF v_trip_driver_id IS NULL THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip_driver_id != p_driver_id THEN
    RAISE EXCEPTION 'Not authorized to update this trip';
  END IF;

  -- Validate transition per AGENTS.md state machine
  v_valid := CASE v_current_status
    WHEN 'scheduled'      THEN p_new_status IN ('driver_waiting', 'absent', 'cancelled')
    WHEN 'driver_waiting' THEN p_new_status IN ('in_transit', 'absent', 'cancelled')
    WHEN 'in_transit'     THEN p_new_status IN ('completed', 'cancelled')
    WHEN 'absent'         THEN p_new_status IN ('cancelled')
    WHEN 'completed'      THEN FALSE
    WHEN 'cancelled'      THEN FALSE
    ELSE FALSE
  END;

  IF NOT v_valid THEN
    RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status;
  END IF;

  UPDATE trips SET
    status     = p_new_status,
    last_lat   = COALESCE(p_lat, last_lat),
    last_lng   = COALESCE(p_lng, last_lng),
    started_at = CASE
                   WHEN p_new_status = 'in_transit' AND started_at IS NULL THEN NOW()
                   ELSE started_at
                 END,
    ended_at   = CASE
                   WHEN p_new_status IN ('completed', 'cancelled', 'absent') THEN NOW()
                   ELSE ended_at
                 END,
    updated_at = NOW()
  WHERE id = p_trip_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_trip_status(UUID, TEXT, NUMERIC, NUMERIC, UUID) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.update_trip_status(UUID, TEXT, NUMERIC, NUMERIC, UUID) TO authenticated, service_role;

-- ── 4. Fix check_rate_limit permissions ──
-- The function must only be callable by service_role (and internally by SECURITY DEFINER functions).
-- Authenticated users calling it directly should get PGRST202 is acceptable but tests expect 42501.
-- We need the function to EXIST but be revoked from authenticated.
DO $$
BEGIN
  -- Only revoke if the function exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'check_rate_limit'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;
  END IF;
END $$;

-- ── 5. complete_payment_and_activate_subscription ──
-- Called by ZainCash webhook after confirming payment.
-- Atomically: marks payment as completed, books subscription, decrements seats.
-- If student already has active sub on same route -> marks payment as 'failed' (no error raised).
CREATE OR REPLACE FUNCTION public.complete_payment_and_activate_subscription(
  p_zaincash_order_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment       RECORD;
  v_seats         INT;
  v_existing      INT;
  v_sub_id        UUID;
  v_result        JSONB;
BEGIN
  -- Lock and fetch the pending payment
  SELECT * INTO v_payment
  FROM payments
  WHERE zaincash_order_id = p_zaincash_order_id
    AND status = 'pending'
  FOR UPDATE;

  IF v_payment IS NULL THEN
    RAISE EXCEPTION 'Payment not found or already processed: %', p_zaincash_order_id;
  END IF;

  -- Check for existing active subscription (duplicate booking)
  SELECT COUNT(*) INTO v_existing
  FROM subscriptions
  WHERE student_id = v_payment.user_id
    AND route_id   = v_payment.route_id
    AND status IN ('active', 'pending');

  IF v_existing > 0 THEN
    -- Mark as failed (duplicate), return the payment row
    UPDATE payments
    SET status = 'failed', updated_at = NOW()
    WHERE id = v_payment.id;

    SELECT row_to_json(p)::JSONB INTO v_result
    FROM (SELECT *, 'failed' AS status FROM payments WHERE id = v_payment.id) p;

    RETURN v_result;
  END IF;

  -- Lock route and check available seats
  SELECT available_seats INTO v_seats
  FROM routes
  WHERE id = v_payment.route_id AND is_active = TRUE
  FOR UPDATE;

  IF v_seats IS NULL THEN
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    RAISE EXCEPTION 'Route not found or inactive';
  END IF;

  IF v_seats <= 0 THEN
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    RAISE EXCEPTION 'No seats available for this route or route is inactive';
  END IF;

  -- Decrement seat
  UPDATE routes
  SET available_seats = available_seats - 1
  WHERE id = v_payment.route_id;

  -- Create subscription
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    v_payment.user_id,
    v_payment.route_id,
    'active',
    NOW(),
    NOW() + INTERVAL '30 days',
    v_payment.amount
  )
  RETURNING id INTO v_sub_id;

  -- Mark payment as completed
  UPDATE payments
  SET status = 'completed', subscription_id = v_sub_id, updated_at = NOW()
  WHERE id = v_payment.id;

  SELECT row_to_json(p)::JSONB INTO v_result
  FROM payments p WHERE p.id = v_payment.id;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(TEXT) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(TEXT) TO service_role;

-- ── 6. Fix cancel_subscription to return proper error message ──
CREATE OR REPLACE FUNCTION public.cancel_subscription(
  p_subscription_id UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sub      RECORD;
  v_caller   UUID := auth.uid();
BEGIN
  SELECT * INTO v_sub
  FROM subscriptions
  WHERE id = p_subscription_id
  FOR UPDATE;

  IF v_sub IS NULL THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;

  -- Only the student themselves or an admin can cancel
  IF v_sub.student_id != v_caller AND get_my_role() != 'admin' THEN
    RAISE EXCEPTION 'Not authorized to cancel this subscription';
  END IF;

  -- Prevent double-cancellation
  IF v_sub.status NOT IN ('active', 'pending') THEN
    RAISE EXCEPTION 'Cannot cancel subscription in % state', v_sub.status;
  END IF;

  UPDATE subscriptions
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_subscription_id;

  -- Restore seat (trigger handle_subscription_change also does this,
  -- but we do it explicitly here for idempotency with LEAST guard)
  -- The trigger fires on UPDATE so we do NOT double-restore here.
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cancel_subscription(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.cancel_subscription(UUID) TO authenticated, service_role;
