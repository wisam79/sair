-- Critical Security and Logical Fixes Migration
-- Migration: 20260529000003_critical_security_fixes.sql
-- Description: Hardening payments table RLS, securing create_payment, scheduling stale payment cleanup, and fixing monthly revenue calculation.

-- 1. Hardening payments table RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payments: Service role can insert" ON public.payments;
DROP POLICY IF EXISTS "Payments: Service role can update" ON public.payments;
DROP POLICY IF EXISTS "Payments: Users see own" ON public.payments;

CREATE POLICY "Payments: Users see own" ON public.payments
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- 2. Securing and hardening create_payment RPC
CREATE OR REPLACE FUNCTION public.create_payment(
  p_user_id UUID,
  p_route_id UUID,
  p_amount INT,
  p_zaincash_order_id TEXT
) RETURNS public.payments 
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_payment public.payments;
  v_route_price NUMERIC;
BEGIN
  -- Validate route price to prevent payment tampering
  SELECT price INTO v_route_price FROM public.routes WHERE id = p_route_id;
  IF v_route_price IS NULL THEN
    RAISE EXCEPTION 'Route not found';
  END IF;
  
  IF ROUND(v_route_price)::INT != p_amount THEN
    RAISE EXCEPTION 'Price mismatch: expected %, got %', ROUND(v_route_price)::INT, p_amount;
  END IF;

  -- Insert the payment
  INSERT INTO public.payments (user_id, route_id, amount, zaincash_order_id, status)
  VALUES (p_user_id, p_route_id, p_amount, p_zaincash_order_id, 'pending')
  RETURNING * INTO v_payment;
  
  RETURN v_payment;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_payment(UUID, UUID, INT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_payment(UUID, UUID, INT, TEXT) TO service_role;

-- 3. Hardening complete_payment_and_activate_subscription execution permissions
REVOKE EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(TEXT, INT) TO service_role;

-- 4. Setup stale pending payments cleanup cron job
CREATE OR REPLACE FUNCTION public.cleanup_stale_payments()
RETURNS void 
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE public.payments
  SET status = 'failed', updated_at = NOW()
  WHERE status = 'pending' AND created_at < NOW() - INTERVAL '30 minutes';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cleanup_stale_payments() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_stale_payments() TO service_role;

DO $$
BEGIN
  BEGIN
    PERFORM cron.unschedule('cleanup-stale-payments');
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

SELECT cron.schedule(
  'cleanup-stale-payments',
  '*/10 * * * *',
  'SELECT public.cleanup_stale_payments();'
);

-- 5. Fixing get_dashboard_stats monthly revenue logic
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  result JSON;
BEGIN
  -- STRICT ADMIN CHECK
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  SELECT json_build_object(
    'total_users',          (SELECT count(*) FROM public.profiles),
    'total_drivers',        (SELECT count(*) FROM public.drivers),
    'total_routes',         (SELECT count(*) FROM public.routes),
    'active_routes',        (SELECT count(*) FROM public.routes WHERE is_active = true),
    'total_trips',          (SELECT count(*) FROM public.trips),
    'active_trips',         (SELECT count(*) FROM public.trips WHERE status IN ('driver_waiting', 'in_transit')),
    'total_subscriptions',  (SELECT count(*) FROM public.subscriptions),
    'active_subscriptions', (SELECT count(*) FROM public.subscriptions WHERE status = 'active'),
    'monthly_revenue', (
      -- Sum the actual purchase price of subscriptions created in the current calendar month,
      -- regardless of their current status (active, expired, cancelled).
      SELECT COALESCE(SUM(s.purchase_price), 0)
      FROM public.subscriptions s
      WHERE s.created_at >= date_trunc('month', NOW())
        AND s.status IN ('active', 'expired', 'cancelled')
    )
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
