-- Migration: 20260527000002_optimize_rate_limiter.sql
-- Description: Optimize check_rate_limit to eliminate unnecessary database writes on rejection and use background pg_cron for cleanup

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID, 
  p_action TEXT, 
  p_limit INT, 
  p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_count INT;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- IDOR protection: user can only check their own rate limits
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot check rate limits for another user';
  END IF;

  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- 1. Read aggregate requests count in the active window (optimized read)
  SELECT COALESCE(SUM(request_count), 0) INTO v_count
  FROM public.rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND window_start >= v_window_start;

  -- 2. If the user exceeds the rate limit, reject immediately with ZERO writes to the DB (prevents WAL bloat and IOPS exhaustion)
  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  -- 3. If under the limit, record the new request tick
  INSERT INTO public.rate_limits (user_id, action, window_start, request_count)
  VALUES (p_user_id, p_action, NOW(), 1);

  RETURN TRUE;
END;
$$;

-- 4. Enable pg_cron and schedule background cleanup once every 10 minutes instead of every request
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  -- Unschedule existing job if it exists
  PERFORM cron.unschedule('cleanup-expired-rate-limits');
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

SELECT cron.schedule(
  'cleanup-expired-rate-limits',
  '*/10 * * * *',
  $$DELETE FROM public.rate_limits WHERE window_start < NOW() - INTERVAL '1 hour'$$
);

-- Preserve permissions: only service_role can call check_rate_limit directly
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;
