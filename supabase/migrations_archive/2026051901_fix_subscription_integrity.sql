-- UniRide: Fix Subscription Integrity & Security (M11)
-- 1. Remove double-seat restore trigger
-- 2. Add search_path to RPCs
-- 3. Fix complete_payment_and_activate_subscription checks
-- 4. Secure payments RLS
-- 5. Fix expire_subscriptions to restore seats

-- ════════════════════════════════════════════════
-- 1. FIX BUG-1: Remove trigger causing double seat restore
-- ════════════════════════════════════════════════
DROP TRIGGER IF EXISTS on_subscription_cancel ON subscriptions;
DROP FUNCTION IF EXISTS handle_subscription_change();

-- ════════════════════════════════════════════════
-- 2. FIX BUG-3: Proper expire_subscriptions for pg_cron
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  -- 1. Restore seats for expired subscriptions first
  UPDATE routes r
  SET available_seats = LEAST(r.capacity, r.available_seats + sub_counts.cnt)
  FROM (
    SELECT route_id, COUNT(*) as cnt
    FROM subscriptions
    WHERE status = 'active' AND end_date < NOW() AND deleted_at IS NULL
    GROUP BY route_id
  ) sub_counts
  WHERE r.id = sub_counts.route_id;

  -- 2. Update status to expired
  UPDATE subscriptions
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'active' AND end_date < NOW() AND deleted_at IS NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION expire_subscriptions() FROM PUBLIC;

-- Re-schedule pg_cron to use the RPC directly
-- Unschedule if it exists from previous iterations
-- This assumes pg_cron extension is active. We wrap in DO to ignore errors if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('expire-subscriptions');
    PERFORM cron.schedule('expire-subscriptions', '0 * * * *', 'SELECT expire_subscriptions();');
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Ignore if cron isn't setup
END $$;

-- ════════════════════════════════════════════════
-- 3. FIX BUG-2 & BUG-7: complete_payment_and_activate_subscription
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
    -- Update payment to failed due to duplicate
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    RAISE EXCEPTION 'You already have an active subscription for this route';
  END IF;

  -- Verify and deduct seat atomically
  UPDATE routes
  SET available_seats = available_seats - 1
  WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;

  IF NOT FOUND THEN
    UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = v_payment.id;
    RAISE EXCEPTION 'No seats available for this route or route is inactive';
  END IF;

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

  -- Return updated payment
  SELECT * INTO v_payment FROM payments WHERE id = v_payment.id;
  RETURN v_payment;
END;
$$;

-- ════════════════════════════════════════════════
-- 4. FIX BUG-7: create_payment search_path
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION create_payment(
  p_user_id UUID,
  p_route_id UUID,
  p_amount INT,
  p_zaincash_order_id TEXT
) RETURNS payments 
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_payment payments;
BEGIN
  INSERT INTO payments (user_id, route_id, amount, zaincash_order_id, status)
  VALUES (p_user_id, p_route_id, p_amount, p_zaincash_order_id, 'pending')
  RETURNING * INTO v_payment;
  RETURN v_payment;
END;
$$;

-- ════════════════════════════════════════════════
-- 5. FIX BUG-9: payments RLS hardening
-- ════════════════════════════════════════════════
DROP POLICY IF EXISTS "Payments: Service role can insert" ON payments;
DROP POLICY IF EXISTS "Payments: Service role can update" ON payments;

-- Payments should only be created/updated via the RPCs above by authenticated users
-- Or by the webhook (which uses service role key, bypassing RLS)

-- ════════════════════════════════════════════════
-- 6. FIX BUG-8: search_path for dashboard RPCs
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_system_health()
RETURNS JSON
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_result JSON;
  v_db_latency_ms NUMERIC;
  v_last_trip_at TIMESTAMPTZ;
  v_active_trips_count INT;
  v_pending_subscriptions INT;
BEGIN
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Admin only';
  END IF;

  PERFORM NOW();
  v_db_latency_ms := 0;

  SELECT MAX(started_at) INTO v_last_trip_at FROM trips WHERE status != 'completed';

  SELECT COUNT(*) INTO v_active_trips_count
  FROM trips
  WHERE status IN ('driver_waiting', 'in_transit', 'scheduled');

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

CREATE OR REPLACE FUNCTION get_enhanced_analytics(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW(),
  p_comparison_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '60 days',
  p_comparison_end TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days'
)
RETURNS JSON
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_result JSON;
  v_current_period JSON;
  v_previous_period JSON;
BEGIN
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Admin only';
  END IF;

  SELECT json_build_object(
    'trips', COUNT(*),
    'revenue', COALESCE(SUM(r.price), 0),
    'students', COUNT(DISTINCT student_id)
  ) INTO v_current_period
  FROM subscriptions s
  JOIN routes r ON s.route_id = r.id
  WHERE s.created_at BETWEEN p_start_date AND p_end_date
    AND s.status = 'active';

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
