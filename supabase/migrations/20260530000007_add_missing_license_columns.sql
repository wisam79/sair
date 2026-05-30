-- =================================================================
-- Migration: 20260530000007_add_missing_license_columns.sql
-- Add all columns that migration 20260529000004 was supposed to add
-- but never did (it was marked "applied" without running).
-- =================================================================

-- ── Add missing columns to licenses ───────────────────────────────
ALTER TABLE licenses
  ADD COLUMN IF NOT EXISTS reserved_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reserved_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reserved_by_phone TEXT,
  ADD COLUMN IF NOT EXISTS sold_by           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hold_expires_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_id        UUID,
  ADD COLUMN IF NOT EXISTS expires_at        TIMESTAMPTZ;

-- ── Indexes for the new columns ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_licenses_route_status_created
  ON licenses(route_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_licenses_payment_hold_expiry
  ON licenses(status, hold_expires_at)
  WHERE status = 'payment_hold';

-- ── Fix get_or_create_conversation: ambiguous student_id ──────────
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
  v_trip_route_id  UUID;
  v_driver_user_id UUID;
  v_caller_id      UUID := auth.uid();
  v_role           TEXT := get_my_role();
  v_conv_id        UUID;
BEGIN
  -- Fetch trip info
  SELECT t.route_id, d.user_id
    INTO v_trip_route_id, v_driver_user_id
  FROM trips t
  JOIN drivers d ON d.id = t.driver_id
  WHERE t.id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  -- Verify caller is subscribed to this trip route (for students)
  IF v_role = 'student' THEN
    IF NOT EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.student_id = v_caller_id
        AND s.route_id   = v_trip_route_id
        AND s.status IN ('active', 'pending')
    ) THEN
      RAISE EXCEPTION 'Student is not subscribed to this trip route';
    END IF;

    -- Find or create conversation
    SELECT c.id INTO v_conv_id
    FROM conversations c
    WHERE c.student_id = v_caller_id
      AND c.driver_id  = v_driver_user_id
      AND c.route_id   = v_trip_route_id
    LIMIT 1;

    IF v_conv_id IS NULL THEN
      INSERT INTO conversations (student_id, driver_id, route_id)
      VALUES (v_caller_id, v_driver_user_id, v_trip_route_id)
      RETURNING id INTO v_conv_id;
    END IF;

  ELSIF v_role = 'driver' THEN
    IF v_caller_id != v_driver_user_id THEN
      RAISE EXCEPTION 'Not authorized: not your trip';
    END IF;
    RAISE EXCEPTION 'Driver conversation access not implemented yet';
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
    SELECT c.id, c.student_id, c.driver_id, c.route_id, c.created_at
    FROM conversations c
    WHERE c.id = v_conv_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) TO authenticated, service_role;

-- ── Redefine activate_license to handle missing expires_at gracefully ──
CREATE OR REPLACE FUNCTION public.activate_license(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_lic_id       UUID;
  v_lic_route_id UUID;
  v_lic_status   TEXT;
  v_lic_expires  TIMESTAMPTZ;
  v_lic_vdays    INT;
  v_sub_id       UUID;
  v_role         TEXT;
  v_route_price  NUMERIC;
BEGIN
  v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can activate licenses';
  END IF;

  -- Rate limiting
  IF NOT public.check_rate_limit(auth.uid(), 'activate_license_attempt', 5, 900) THEN
    RAISE EXCEPTION 'Too many license activation attempts. Please try again in 15 minutes.';
  END IF;

  -- Fetch and lock license - use individual columns to avoid record field issues
  SELECT id, route_id, status, expires_at, valid_days
    INTO v_lic_id, v_lic_route_id, v_lic_status, v_lic_expires, v_lic_vdays
  FROM licenses
  WHERE code = upper(trim(p_code))
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  -- Accept both 'available' (direct batch) and 'reserved' (pre-sold)
  IF v_lic_status NOT IN ('available', 'reserved') THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  -- Check expiry (only if expires_at is set)
  IF v_lic_expires IS NOT NULL AND v_lic_expires < NOW() THEN
    UPDATE licenses SET status = 'expired' WHERE id = v_lic_id;
    UPDATE routes SET available_seats = LEAST(capacity, available_seats + 1)
    WHERE id = v_lic_route_id;
    RAISE EXCEPTION 'License has expired';
  END IF;

  -- No duplicate subscription
  IF EXISTS (
    SELECT 1 FROM subscriptions s
    WHERE s.student_id = auth.uid()
      AND s.route_id   = v_lic_route_id
      AND s.status IN ('active', 'pending')
  ) THEN
    RAISE EXCEPTION 'Already subscribed to this route';
  END IF;

  SELECT price INTO v_route_price FROM routes WHERE id = v_lic_route_id;

  -- If 'available' (not pre-sold), deduct seat now
  IF v_lic_status = 'available' THEN
    UPDATE routes
    SET available_seats = available_seats - 1
    WHERE id = v_lic_route_id
      AND available_seats > 0
      AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No seats available for this route or route is inactive';
    END IF;
  END IF;

  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    auth.uid(),
    v_lic_route_id,
    'active',
    NOW(),
    NOW() + (COALESCE(v_lic_vdays, 30) || ' days')::INTERVAL,
    COALESCE(v_route_price, 0)
  )
  RETURNING id INTO v_sub_id;

  UPDATE licenses
  SET status  = 'used',
      used_by = auth.uid(),
      used_at = NOW()
  WHERE id = v_lic_id;

  PERFORM public.log_audit(
    auth.uid(), 'activate_license', 'subscriptions', v_sub_id,
    jsonb_build_object('route_id', v_lic_route_id, 'license_id', v_lic_id)
  );

  RETURN v_sub_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.activate_license(TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.activate_license(TEXT) TO authenticated, service_role;
