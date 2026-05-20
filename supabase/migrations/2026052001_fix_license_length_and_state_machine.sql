-- Migration: 2026052001_fix_license_length_and_state_machine.sql
-- Description: Fix license code length (from 12 to 8 characters), allow absent -> cancelled state transition, and add locking to request_payout to prevent double spending.

-- 1. Drop functions to prevent parameter/return type mismatches
DROP FUNCTION IF EXISTS request_payout(numeric);
DROP FUNCTION IF EXISTS validate_trip_transition(UUID, TEXT);
DROP FUNCTION IF EXISTS create_license_batch(UUID, TEXT, INT, NUMERIC, INT);

-- 2. Redefine create_license_batch to generate 8-character codes instead of 12
CREATE OR REPLACE FUNCTION create_license_batch(
  p_route_id   UUID,
  p_batch_name TEXT,
  p_quantity   INT,
  p_price      NUMERIC,
  p_valid_days INT
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_batch_id UUID;
  v_code     TEXT;
  i          INT;
  v_role     TEXT;
BEGIN
  -- A) Verify Admin
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can create license batches';
  END IF;

  -- B) Create Batch Record
  INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
  VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
  RETURNING id INTO v_batch_id;

  -- C) Generate Stronger Codes (8 characters to match Zod & translations)
  FOR i IN 1..p_quantity LOOP
    LOOP
      v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
      BEGIN
        INSERT INTO licenses (batch_id, route_id, code, valid_days)
        VALUES (v_batch_id, p_route_id, v_code, p_valid_days);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        -- Retry on collision
      END;
    END LOOP;
  END LOOP;

  -- D) Audit Logging
  PERFORM log_audit(
    auth.uid(),
    'create_license_batch',
    'license_batches',
    v_batch_id,
    jsonb_build_object('quantity', p_quantity, 'route_id', p_route_id)
  );

  RETURN v_batch_id;
END;
$$;

-- 3. Redefine validate_trip_transition to support absent -> cancelled
CREATE OR REPLACE FUNCTION validate_trip_transition(p_trip_id UUID, p_new_status TEXT) RETURNS BOOLEAN AS $$
DECLARE
  v_current_status TEXT;
  v_valid BOOLEAN;
BEGIN
  SELECT status INTO v_current_status FROM trips WHERE id = p_trip_id;
  IF v_current_status IS NULL THEN RAISE EXCEPTION 'Trip not found'; END IF;

  v_valid := CASE v_current_status
    WHEN 'scheduled' THEN p_new_status IN ('driver_waiting', 'absent', 'cancelled')
    WHEN 'driver_waiting' THEN p_new_status IN ('in_transit', 'absent', 'cancelled')
    WHEN 'in_transit' THEN p_new_status IN ('completed', 'cancelled')
    WHEN 'completed' THEN FALSE
    WHEN 'absent' THEN p_new_status IN ('cancelled')
    WHEN 'cancelled' THEN FALSE
    ELSE FALSE
  END;

  IF NOT v_valid THEN RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status; END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Redefine request_payout with FOR UPDATE NOWAIT locking on driver record
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

-- 5. Revoke public/authenticated execution permissions on update_trip_status to prevent direct API calls bypassing Edge Function checks
REVOKE EXECUTE ON FUNCTION update_trip_status(UUID, TEXT, NUMERIC, NUMERIC, UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION update_trip_status(UUID, TEXT, NUMERIC, NUMERIC, UUID, TEXT) FROM PUBLIC;

-- 6. Revoke public/authenticated execution permissions on log_audit to prevent fake audit log generation
REVOKE EXECUTE ON FUNCTION log_audit(UUID, TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
