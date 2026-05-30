-- =================================================================
-- Migration: 20260530000006_fix_remaining_test_failures.sql
-- Fixes:
--   1. Add valid_days column to licenses table
--   2. Fix handle_subscription_change trigger to use LEAST() to avoid
--      violating available_seats <= capacity check constraint on cleanup
--   3. Restore get_or_create_conversation RPC
-- =================================================================

-- ── 1. Add valid_days to licenses (required by create_license_batch & activate_license) ──
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'licenses'
      AND column_name  = 'valid_days'
  ) THEN
    ALTER TABLE licenses ADD COLUMN valid_days INT NOT NULL DEFAULT 30;
  END IF;
END $$;

-- ── 2. Fix handle_subscription_change trigger ─────────────────────
-- Use LEAST(capacity, available_seats + 1) to avoid violating the
-- CHECK constraint (available_seats >= 0 AND available_seats <= capacity)
-- when test cleanup deletes subscriptions that were inserted without
-- decrementing seats (direct INSERT in tests).
CREATE OR REPLACE FUNCTION public.handle_subscription_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.status IN ('active', 'pending')
     AND NEW.status IN ('cancelled', 'expired') THEN
    UPDATE routes
    SET available_seats = LEAST(capacity, available_seats + 1)
    WHERE id = OLD.route_id;
  END IF;

  IF TG_OP = 'DELETE' AND OLD.status IN ('active', 'pending') THEN
    UPDATE routes
    SET available_seats = LEAST(capacity, available_seats + 1)
    WHERE id = OLD.route_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
CREATE TRIGGER on_subscription_cancel
  AFTER UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_change();

-- ── 3. get_or_create_conversation ────────────────────────────────
-- Creates or fetches a conversation between a student and driver for
-- a specific trip. Verifies student is subscribed to the trip's route.
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_trip_id UUID)
RETURNS TABLE(
  conversation_id UUID,
  student_id      UUID,
  driver_id       UUID,
  route_id        UUID,
  created_at      TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_trip       RECORD;
  v_caller_id  UUID := auth.uid();
  v_role       TEXT := get_my_role();
  v_conv_id    UUID;
  v_driver_uid UUID;
BEGIN
  -- Fetch trip info
  SELECT t.route_id, t.driver_id, d.user_id AS driver_user_id
    INTO v_trip
  FROM trips t
  JOIN drivers d ON d.id = t.driver_id
  WHERE t.id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  -- Verify caller is subscribed to this trip's route (for students)
  IF v_role = 'student' THEN
    IF NOT EXISTS (
      SELECT 1 FROM subscriptions
      WHERE student_id = v_caller_id
        AND route_id   = v_trip.route_id
        AND status IN ('active', 'pending')
    ) THEN
      RAISE EXCEPTION 'Student is not subscribed to this trip route';
    END IF;
    v_driver_uid := v_trip.driver_user_id;
  ELSIF v_role = 'driver' THEN
    -- Driver must own the trip
    IF v_caller_id != v_trip.driver_user_id THEN
      RAISE EXCEPTION 'Not authorized: not your trip';
    END IF;
    v_driver_uid := v_caller_id;
  ELSIF v_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Look for existing conversation for this trip's route between this student and the driver
  IF v_role = 'student' THEN
    SELECT c.id INTO v_conv_id
    FROM conversations c
    WHERE c.student_id = v_caller_id
      AND c.driver_id  = v_trip.driver_user_id
      AND c.route_id   = v_trip.route_id
    LIMIT 1;

    IF v_conv_id IS NULL THEN
      INSERT INTO conversations (student_id, driver_id, route_id)
      VALUES (v_caller_id, v_trip.driver_user_id, v_trip.route_id)
      RETURNING id INTO v_conv_id;
    END IF;
  END IF;

  RETURN QUERY
    SELECT c.id, c.student_id, c.driver_id, c.route_id, c.created_at
    FROM conversations c
    WHERE c.id = v_conv_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) TO authenticated, service_role;

-- ── 4. Also fix create_license_batch to insert valid_days ─────────
-- (Already fixed in migration 005, but restate with SECURITY DEFINER and SET search_path)
CREATE OR REPLACE FUNCTION public.create_license_batch(
  p_route_id   UUID,
  p_batch_name TEXT,
  p_quantity   INT,
  p_price      NUMERIC,
  p_valid_days INT DEFAULT 30
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_batch_id UUID;
  v_code     TEXT;
  i          INT;
  v_role     TEXT;
BEGIN
  v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can create license batches';
  END IF;

  INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
  VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
  RETURNING id INTO v_batch_id;

  FOR i IN 1..p_quantity LOOP
    LOOP
      v_code := upper(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
      BEGIN
        INSERT INTO licenses (batch_id, route_id, code, status, valid_days)
        VALUES (v_batch_id, p_route_id, v_code, 'available', p_valid_days);
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        -- Retry
      END;
    END LOOP;
  END LOOP;

  RETURN v_batch_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) TO authenticated, service_role;

-- ── 5. Ensure licenses status constraint includes 'available' ─────
-- Migration 20260530000001 should have done this, but re-assert idempotently.
ALTER TABLE licenses DROP CONSTRAINT IF EXISTS licenses_status_check;
ALTER TABLE licenses ADD CONSTRAINT licenses_status_check
  CHECK (status IN ('available', 'reserved', 'payment_hold', 'used', 'expired', 'revoked'));
