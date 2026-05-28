-- UniRide M8: Missing RPCs (Consolidated)
-- Migration: 2026051702_consolidate_admin_rpcs.sql
--
-- Problem: get_daily_activity and get_recent_active_trips were defined twice
-- with different return types (JSON vs SETOF RECORD).
--
-- Solution: This migration consolidates them using JSON return type
-- for better Supabase client compatibility.

-- ═══════════════════════════════════════════════════════════════════════
-- 1. get_daily_activity → Returns JSON array of {day, count}
-- ═══════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_daily_activity(p_days INT DEFAULT 7)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_result JSON;
BEGIN
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_agg(json_build_object('day', day, 'count', count))
  INTO v_result
  FROM (
    SELECT
      DATE_TRUNC('day', updated_at)::DATE AS day,
      COUNT(*)::INT AS count
    FROM trips
    WHERE updated_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE_TRUNC('day', updated_at)
    ORDER BY day ASC
  ) t;

  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. get_recent_active_trips → Returns JSON array of trip objects
-- ═══════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_recent_active_trips(p_limit INT DEFAULT 5)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_result JSON;
BEGIN
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_agg(json_build_object(
    'id', t.id,
    'status', t.status,
    'scheduled_at', t.scheduled_at,
    'route_id', t.route_id,
    'driver_id', t.driver_id,
    'route_title', r.title,
    'start_location', r.start_location,
    'end_location', r.end_location,
    'driver_name', p.full_name,
    'driver_phone', p.phone
  ))
  INTO v_result
  FROM trips t
  JOIN routes r ON r.id = t.route_id
  JOIN drivers dr ON dr.id = t.driver_id
  JOIN profiles p ON p.id = dr.user_id
  WHERE t.status IN ('scheduled', 'driver_waiting', 'in_transit')
  ORDER BY t.scheduled_at DESC
  LIMIT p_limit;

  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- 3. admin_cancel_trip → Unchanged, works correctly
-- ═══════════════════════════════════════════════════════════════════════
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

  IF v_trip.status NOT IN ('scheduled', 'driver_waiting') THEN
    RAISE EXCEPTION 'Cannot cancel trip with status %', v_trip.status;
  END IF;

  UPDATE routes
  SET available_seats = available_seats + 1
  WHERE id = v_trip.route_id
    AND v_trip.status = 'scheduled';

  UPDATE trips
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_trip_id;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- Grants
-- ═══════════════════════════════════════════════════════════════════════
GRANT EXECUTE ON FUNCTION get_daily_activity(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_active_trips(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_cancel_trip(UUID) TO authenticated;
