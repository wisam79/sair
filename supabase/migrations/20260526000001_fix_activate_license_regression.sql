-- Migration: 20260526000001_fix_activate_license_regression.sql
-- Fixes regression in activate_license introduced by 20260522000005:
--   1. Restores rate limiting (brute-force protection) — lost from v3 (2026051802)
--   2. Restores audit logging — lost from v3
--   3. Restores trim() on input code — lost from v3
--   4. Adds UNIQUE partial index on subscriptions to prevent duplicate active subs at DB level
--      (neither v3 nor v5 properly solved the race condition — FOR UPDATE on non-existent rows is a no-op)

-- ═══════════════════════════════════════════════════════════════════════
-- 1. Recreate activate_license with all protections restored
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.activate_license(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_license         RECORD;
  v_subscription_id UUID;
  v_role            TEXT;
  v_route_price     NUMERIC;
BEGIN
  -- A) Authentication & Role Check
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can activate licenses';
  END IF;

  -- B) Brute-force Protection (Rate Limiting)
  -- Limit: 5 attempts per 15 minutes to prevent automated code guessing
  IF NOT check_rate_limit(auth.uid(), 'activate_license_attempt', 5, 900) THEN
    RAISE EXCEPTION 'Too many license activation attempts. Please try again in 15 minutes.';
  END IF;

  -- C) Atomic Row Locking: License
  SELECT * INTO v_license
  FROM licenses
  WHERE code = upper(trim(p_code)) AND status = 'active'
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  -- D) Get route price for purchase_price snapshot
  SELECT price INTO v_route_price FROM routes WHERE id = v_license.route_id;

  -- E) Atomic seat deduction (prevents overbooking)
  UPDATE routes
  SET available_seats = available_seats - 1
  WHERE id = v_license.route_id
    AND available_seats > 0
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No seats available for this route or route is inactive';
  END IF;

  -- F) Mark license as used
  UPDATE licenses
  SET status = 'used',
      used_by = auth.uid(),
      used_at = NOW()
  WHERE id = v_license.id;

  -- G) Create active subscription
  -- The UNIQUE partial index idx_one_active_sub_per_route will prevent duplicate
  -- active/pending subscriptions even under concurrent requests — no FOR UPDATE needed.
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    auth.uid(),
    v_license.route_id,
    'active',
    NOW(),
    NOW() + (v_license.valid_days || ' days')::INTERVAL,
    COALESCE(v_route_price, 0)
  )
  RETURNING id INTO v_subscription_id;

  -- H) Audit Logging
  PERFORM log_audit(
    auth.uid(),
    'activate_license',
    'subscriptions',
    v_subscription_id,
    jsonb_build_object('route_id', v_license.route_id, 'license_id', v_license.id)
  );

  RETURN v_subscription_id;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. UNIQUE partial index: the real fix for duplicate subscription race condition
-- ═══════════════════════════════════════════════════════════════════════
-- This makes PostgreSQL enforce uniqueness at the storage level — no application
-- locking needed. A concurrent INSERT will fail with unique_violation.

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_sub_per_route
ON subscriptions (student_id, route_id)
WHERE status IN ('active', 'pending');

-- ═══════════════════════════════════════════════════════════════════════
-- 3. Preserve execution permissions (CREATE OR REPLACE doesn't reset GRANT/REVOKE,
--    but we explicitly re-state them for documentation clarity)
-- ═══════════════════════════════════════════════════════════════════════

REVOKE EXECUTE ON FUNCTION public.activate_license(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_license(TEXT) TO authenticated, service_role;
