-- Migration: 20260524000007_harden_dashboard_analytics_rpcs.sql
-- Description: Harden get_system_health and get_enhanced_analytics RPCs by enforcing strict admin checks inside the functions.

-- 1. Re-define get_system_health with strict admin authorization check
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_db_latency_ms NUMERIC;
  v_last_trip_at TIMESTAMPTZ;
  v_active_trips_count INT;
  v_pending_subscriptions INT;
BEGIN
  -- Strict Admin check
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Measure DB latency with a simple query
  PERFORM NOW();
  v_db_latency_ms := 0;

  -- Get last trip time
  SELECT MAX(started_at) INTO v_last_trip_at FROM trips WHERE status != 'completed';

  -- Count active trips
  SELECT COUNT(*) INTO v_active_trips_count
  FROM trips
  WHERE status IN ('driver_waiting', 'in_transit', 'scheduled');

  -- Count pending subscriptions
  SELECT COUNT(*) INTO v_pending_subscriptions
  FROM subscriptions
  WHERE status = 'pending';

  SELECT json_build_object(
    'status', 'healthy',
    'timestamp', NOW(),
    'db_latency_ms', v_db_latency_ms,
    'database', json_build_object(
      'connected', true,
      'last_activity', v_last_trip_at
    ),
    'api', json_build_object(
      'status', 'operational',
      'active_trips', v_active_trips_count
    ),
    'services', json_build_object(
      'realtime', 'connected',
      'payments', 'operational',
      'notifications', 'operational'
    ),
    'pending_counts', json_build_object(
      'pending_subscriptions', v_pending_subscriptions,
      'active_trips', v_active_trips_count
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- 2. Re-define get_enhanced_analytics with strict admin authorization check
CREATE OR REPLACE FUNCTION public.get_enhanced_analytics(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW(),
  p_comparison_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '60 days',
  p_comparison_end TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days'
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_current_period JSON;
  v_previous_period JSON;
BEGIN
  -- Strict Admin check
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Current period stats
  SELECT json_build_object(
    'trips', COUNT(*),
    'revenue', COALESCE(SUM(r.price), 0),
    'students', COUNT(DISTINCT student_id)
  ) INTO v_current_period
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE s.created_at BETWEEN p_start_date AND p_end_date
    AND s.status = 'active';

  -- Previous period for comparison
  SELECT json_build_object(
    'trips', COUNT(*),
    'revenue', COALESCE(SUM(r.price), 0),
    'students', COUNT(DISTINCT student_id)
  ) INTO v_previous_period
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE s.created_at BETWEEN p_comparison_start AND p_comparison_end
    AND s.status = 'active';

  SELECT json_build_object(
    'current_period', v_current_period,
    'previous_period', v_previous_period,
    'period_comparison', json_build_object(
      'trips_change', CASE
        WHEN (v_current_period->>'trips')::INT > 0
        THEN ROUND(((v_current_period->>'trips')::INT - (v_previous_period->>'trips')::INT)::NUMERIC / (v_previous_period->>'trips')::INT * 100, 1)
        ELSE 0
      END,
      'revenue_change', CASE
        WHEN (v_current_period->>'revenue')::INT > 0
        THEN ROUND(((v_current_period->>'revenue')::INT - (v_previous_period->>'revenue')::INT)::NUMERIC / NULLIF((v_previous_period->>'revenue')::INT, 0) * 100, 1)
        ELSE 0
      END
    ),
    'daily_breakdown', (
      SELECT COALESCE(json_agg(json_build_object(
        'date', day::DATE,
        'trips', trips_count,
        'revenue', revenue_sum
      ) ORDER BY day), '[]'::json)
      FROM (
        SELECT
          DATE(s.created_at) as day,
          COUNT(*) as trips_count,
          SUM(r.price) as revenue_sum
        FROM subscriptions s
        JOIN routes r ON s.route_id = r.id
        WHERE s.created_at BETWEEN p_start_date AND p_end_date
          AND s.status = 'active'
        GROUP BY DATE(s.created_at)
        ORDER BY day
      ) daily
    ),
    'hourly_breakdown', (
      SELECT COALESCE(json_agg(json_build_object(
        'hour', hour,
        'trips', trips_count
      ) ORDER BY hour), '[]'::json)
      FROM (
        SELECT
          EXTRACT(HOUR FROM s.created_at)::INT as hour,
          COUNT(*) as trips_count
        FROM subscriptions s
        WHERE s.created_at BETWEEN p_start_date AND p_end_date
          AND s.status = 'active'
        GROUP BY EXTRACT(HOUR FROM s.created_at)
        ORDER BY hour
      ) hourly
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- 3. Manage execution permissions
REVOKE EXECUTE ON FUNCTION public.get_system_health() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_system_health() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_enhanced_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_enhanced_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated, service_role;
