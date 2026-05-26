-- Migration: 20260526000003_fix_check_rate_limit_idor.sql
-- Description: Fix IDOR in check_rate_limit — أي user مصادق يستطيع استنزاف rate limits لأي مستخدم آخر
--
-- الثغرة:
-- check_rate_limit(p_user_id, p_action, p_limit, p_window_seconds) لا يتحقق من
-- أن p_user_id = auth.uid(). النسخة الأصلية 2026051005 كانت آمنة (تستخدم
-- auth.uid() داخلياً) لكن 2026051700 غيّرتها إلى parameter بدون ownership check.
--
-- التصحيح:
--   1. إضافة IF p_user_id != auth.uid() THEN RAISE EXCEPTION
--   2. سحب GRANT من authenticated (الـ SECURITY DEFINER functions الأخرى
--      تستدعي check_rate_limit داخلياً ولا تحتاج إلى RPC access)

-- ═══════════════════════════════════════════════════════════════════════
-- 1. Fix check_rate_limit: إضافة التحقق من ملكية المستخدم
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_user_id UUID, p_action TEXT, p_limit INT, p_window_seconds INT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_count INT;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- IDOR protection: يمكن للمستخدم فقط التحقق من rate limit الخاص به
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot check rate limits for another user';
  END IF;

  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  DELETE FROM public.rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND window_start < v_window_start;

  SELECT COALESCE(SUM(request_count), 0) INTO v_count
  FROM public.rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND window_start >= v_window_start;

  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.rate_limits (user_id, action, window_start, request_count)
  VALUES (p_user_id, p_action, NOW(), 1);

  RETURN TRUE;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. سحب GRANT من authenticated — الدالة مخصصة للاستخدام الداخلي فقط
-- ═══════════════════════════════════════════════════════════════════════
-- الـ SECURITY DEFINER functions (send_message, bulk_update_trip_locations,
-- activate_license, إلخ) تستدعي check_rate_limit داخلياً بصلاحيات owner،
-- ولا تحتاج إلى GRANT للـ authenticated.

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INT, INT) TO service_role;
