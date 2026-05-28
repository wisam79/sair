-- UniRide M8b: Force recreate RPCs with correct column names
-- Migration: 2026051801_force_recreate_rpcs.sql
--
-- Problem: get_daily_activity and get_recent_active_trips on production
-- still use 'created_at' which doesn't exist in trips table.
-- Solution: DROP and recreate with correct 'updated_at' column

DROP FUNCTION IF EXISTS get_daily_activity(INT);
DROP FUNCTION IF EXISTS get_recent_active_trips(INT);

CREATE FUNCTION get_daily_activity(p_days INT DEFAULT 7)
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

CREATE FUNCTION get_recent_active_trips(p_limit INT DEFAULT 5)
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

GRANT EXECUTE ON FUNCTION get_daily_activity(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_active_trips(INT) TO authenticated;
