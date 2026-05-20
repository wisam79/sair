-- Migration: 2026051906_phase2_db_fixes.sql
-- Description: Fix race condition in expire_subscriptions, fix admin_cancel_trip, fix state machine

-- 1. Fix race condition in expire_subscriptions
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  WITH expired_subs AS (
    SELECT id, route_id
    FROM subscriptions
    WHERE status = 'active' AND end_date < NOW() AND deleted_at IS NULL
    FOR UPDATE SKIP LOCKED
  ), updated_subs AS (
    UPDATE subscriptions
    SET status = 'expired', updated_at = NOW()
    WHERE id IN (SELECT id FROM expired_subs)
    RETURNING route_id
  ), sub_counts AS (
    SELECT route_id, COUNT(*) as cnt
    FROM updated_subs
    GROUP BY route_id
  )
  UPDATE routes r
  SET available_seats = LEAST(r.capacity, r.available_seats + sub_counts.cnt)
  FROM sub_counts
  WHERE r.id = sub_counts.route_id;
END;
$$;

-- 2. Fix admin_cancel_trip to not increment available_seats and allow in_transit cancellations
CREATE OR REPLACE FUNCTION admin_cancel_trip(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_role     TEXT;
  v_trip     RECORD;
BEGIN
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can cancel trips';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip.status = 'cancelled' THEN
    RETURN;
  END IF;

  IF v_trip.status NOT IN ('scheduled', 'driver_waiting', 'in_transit') THEN
    RAISE EXCEPTION 'Cannot cancel trip with status %', v_trip.status;
  END IF;

  UPDATE trips
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_trip_id;
END;
$$;

-- 3. Update trip transition validation logic
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
    WHEN 'absent' THEN FALSE
    WHEN 'cancelled' THEN FALSE
    ELSE FALSE
  END;

  IF NOT v_valid THEN RAISE EXCEPTION 'Invalid transition: % -> %', v_current_status, p_new_status; END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;