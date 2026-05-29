-- License reservations and electronic payment holds
-- Makes licenses the single source of truth for reserving route seats.

-- 1. Normalize license states and add reservation metadata.
ALTER TABLE public.licenses DROP CONSTRAINT IF EXISTS licenses_status_check;
ALTER TABLE public.licenses
  ADD CONSTRAINT licenses_status_check
  CHECK (status IN ('active', 'available', 'reserved', 'payment_hold', 'used', 'expired', 'revoked'));

UPDATE public.licenses
SET status = 'available'
WHERE status = 'active';

ALTER TABLE public.licenses DROP CONSTRAINT IF EXISTS licenses_status_check;
ALTER TABLE public.licenses
  ADD CONSTRAINT licenses_status_check
  CHECK (status IN ('available', 'reserved', 'payment_hold', 'used', 'expired', 'revoked'));

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS reserved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reserved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reserved_by_phone TEXT,
  ADD COLUMN IF NOT EXISTS sold_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hold_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_id UUID,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_licenses_route_status_created
  ON public.licenses(route_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_licenses_payment_hold_expiry
  ON public.licenses(status, hold_expires_at)
  WHERE status = 'payment_hold';

-- 2. Payment rows are tied to the license hold they created.
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS license_id UUID REFERENCES public.licenses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_zaincash_order_id_unique
  ON public.payments(zaincash_order_id)
  WHERE zaincash_order_id IS NOT NULL;

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_status_check
  CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'refund_pending', 'expired'));

-- 3. Admin/manual sale: reserve a generated license and deduct its seat immediately.
CREATE OR REPLACE FUNCTION public.reserve_license_for_sale(
  p_license_id UUID,
  p_reserved_by UUID DEFAULT NULL,
  p_reserved_by_phone TEXT DEFAULT NULL
) RETURNS public.licenses
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_role TEXT;
  v_license public.licenses%ROWTYPE;
BEGIN
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can reserve sold licenses';
  END IF;

  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = p_license_id
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'License not found';
  END IF;

  IF v_license.status != 'available' THEN
    RAISE EXCEPTION 'License is not available';
  END IF;

  UPDATE public.routes
  SET available_seats = available_seats - 1
  WHERE id = v_license.route_id
    AND available_seats > 0
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No seats available for this route or route is inactive';
  END IF;

  UPDATE public.licenses
  SET status = 'reserved',
      reserved_at = NOW(),
      reserved_by = p_reserved_by,
      reserved_by_phone = NULLIF(trim(p_reserved_by_phone), ''),
      sold_by = auth.uid(),
      expires_at = NOW() + (valid_days || ' days')::INTERVAL
  WHERE id = v_license.id
  RETURNING * INTO v_license;

  PERFORM public.log_audit(
    auth.uid(),
    'reserve_license_for_sale',
    'licenses',
    v_license.id,
    jsonb_build_object('route_id', v_license.route_id, 'reserved_by', p_reserved_by)
  );

  RETURN v_license;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reserve_license_for_sale(UUID, UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_license_for_sale(UUID, UUID, TEXT) TO authenticated, service_role;

-- 4. Electronic checkout: create a payment and reserve the next available license/seat.
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
  v_license public.licenses%ROWTYPE;
  v_route_price NUMERIC;
BEGIN
  SELECT price INTO v_route_price
  FROM public.routes
  WHERE id = p_route_id
    AND is_active = true
  FOR UPDATE;

  IF v_route_price IS NULL THEN
    RAISE EXCEPTION 'Route not found or inactive';
  END IF;

  IF ROUND(v_route_price)::INT != p_amount THEN
    RAISE EXCEPTION 'Price mismatch: expected %, got %', ROUND(v_route_price)::INT, p_amount;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE student_id = p_user_id
      AND route_id = p_route_id
      AND status IN ('active', 'pending')
  ) THEN
    RAISE EXCEPTION 'Already subscribed to this route';
  END IF;

  SELECT * INTO v_license
  FROM public.licenses
  WHERE route_id = p_route_id
    AND status = 'available'
  ORDER BY created_at ASC, id ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No available licenses for this route';
  END IF;

  UPDATE public.routes
  SET available_seats = available_seats - 1
  WHERE id = p_route_id
    AND available_seats > 0
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No seats available for this route or route is inactive';
  END IF;

  INSERT INTO public.payments (user_id, route_id, amount, zaincash_order_id, status, license_id)
  VALUES (p_user_id, p_route_id, p_amount, p_zaincash_order_id, 'pending', v_license.id)
  RETURNING * INTO v_payment;

  UPDATE public.licenses
  SET status = 'payment_hold',
      reserved_at = NOW(),
      reserved_by = p_user_id,
      hold_expires_at = NOW() + INTERVAL '15 minutes',
      payment_id = v_payment.id,
      expires_at = NOW() + (valid_days || ' days')::INTERVAL
  WHERE id = v_license.id;

  RETURN v_payment;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'Payment order already exists';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_payment(UUID, UUID, INT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_payment(UUID, UUID, INT, TEXT) TO service_role;

-- 5. Release an unpaid hold when checkout fails, is cancelled, or expires.
CREATE OR REPLACE FUNCTION public.release_payment_hold(
  p_zaincash_order_id TEXT,
  p_status TEXT DEFAULT 'failed'
) RETURNS public.payments
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_payment public.payments%ROWTYPE;
  v_license public.licenses%ROWTYPE;
BEGIN
  SELECT * INTO v_payment
  FROM public.payments
  WHERE zaincash_order_id = p_zaincash_order_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    SELECT * INTO v_payment
    FROM public.payments
    WHERE zaincash_order_id = p_zaincash_order_id;
    RETURN v_payment;
  END IF;

  IF v_payment.license_id IS NOT NULL THEN
    SELECT * INTO v_license
    FROM public.licenses
    WHERE id = v_payment.license_id
      AND status = 'payment_hold'
    FOR UPDATE;

    IF FOUND THEN
      UPDATE public.licenses
      SET status = 'available',
          reserved_at = NULL,
          reserved_by = NULL,
          hold_expires_at = NULL,
          payment_id = NULL,
          expires_at = NULL
      WHERE id = v_license.id;

      UPDATE public.routes
      SET available_seats = LEAST(capacity, available_seats + 1)
      WHERE id = v_license.route_id;
    END IF;
  END IF;

  UPDATE public.payments
  SET status = CASE WHEN p_status IN ('failed', 'expired') THEN p_status ELSE 'failed' END,
      updated_at = NOW()
  WHERE id = v_payment.id
  RETURNING * INTO v_payment;

  RETURN v_payment;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.release_payment_hold(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_payment_hold(TEXT, TEXT) TO service_role;

-- 6. Complete payment by consuming the already-held license. No second seat deduction.
CREATE OR REPLACE FUNCTION public.complete_payment_and_activate_subscription(
  p_zaincash_order_id TEXT,
  p_valid_days INT DEFAULT 30
) RETURNS public.payments
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_payment public.payments%ROWTYPE;
  v_license public.licenses%ROWTYPE;
  v_subscription_id UUID;
BEGIN
  SELECT * INTO v_payment
  FROM public.payments
  WHERE zaincash_order_id = p_zaincash_order_id
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;

  IF v_payment.status = 'completed' THEN
    RETURN v_payment;
  END IF;

  IF v_payment.status != 'pending' THEN
    UPDATE public.payments
    SET status = 'refund_pending', updated_at = NOW()
    WHERE id = v_payment.id
    RETURNING * INTO v_payment;
    RETURN v_payment;
  END IF;

  IF v_payment.license_id IS NULL THEN
    UPDATE public.payments
    SET status = 'refund_pending', updated_at = NOW()
    WHERE id = v_payment.id
    RETURNING * INTO v_payment;
    RETURN v_payment;
  END IF;

  SELECT * INTO v_license
  FROM public.licenses
  WHERE id = v_payment.license_id
  FOR UPDATE NOWAIT;

  IF NOT FOUND OR v_license.status != 'payment_hold' OR v_license.reserved_by IS DISTINCT FROM v_payment.user_id THEN
    UPDATE public.payments
    SET status = 'refund_pending', updated_at = NOW()
    WHERE id = v_payment.id
    RETURNING * INTO v_payment;
    RETURN v_payment;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE student_id = v_payment.user_id
      AND route_id = v_payment.route_id
      AND status IN ('active', 'pending')
  ) THEN
    UPDATE public.payments
    SET status = 'refund_pending', updated_at = NOW()
    WHERE id = v_payment.id
    RETURNING * INTO v_payment;
    RETURN v_payment;
  END IF;

  INSERT INTO public.subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    v_payment.user_id,
    v_payment.route_id,
    'active',
    NOW(),
    NOW() + (COALESCE(v_license.valid_days, p_valid_days) || ' days')::INTERVAL,
    v_payment.amount
  )
  RETURNING id INTO v_subscription_id;

  UPDATE public.licenses
  SET status = 'used',
      used_by = v_payment.user_id,
      used_at = NOW(),
      hold_expires_at = NULL,
      payment_id = v_payment.id
  WHERE id = v_license.id;

  UPDATE public.payments
  SET status = 'completed',
      subscription_id = v_subscription_id,
      completed_at = NOW(),
      updated_at = NOW()
  WHERE id = v_payment.id
  RETURNING * INTO v_payment;

  PERFORM public.log_audit(
    v_payment.user_id,
    'zaincash_payment_completed',
    'subscriptions',
    v_subscription_id,
    jsonb_build_object('payment_id', v_payment.id, 'license_id', v_license.id, 'route_id', v_payment.route_id)
  );

  RETURN v_payment;
EXCEPTION WHEN unique_violation THEN
  UPDATE public.payments
  SET status = 'refund_pending', updated_at = NOW()
  WHERE zaincash_order_id = p_zaincash_order_id
  RETURNING * INTO v_payment;
  RETURN v_payment;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(TEXT, INT) TO service_role;

-- 7. Student activation consumes manually sold/reserved licenses.
CREATE OR REPLACE FUNCTION public.activate_license(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_license public.licenses%ROWTYPE;
  v_subscription_id UUID;
  v_role TEXT;
  v_route_price NUMERIC;
BEGIN
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can activate licenses';
  END IF;

  IF NOT public.check_rate_limit(auth.uid(), 'activate_license_attempt', 5, 900) THEN
    RAISE EXCEPTION 'Too many license activation attempts. Please try again in 15 minutes.';
  END IF;

  SELECT * INTO v_license
  FROM public.licenses
  WHERE code = upper(trim(p_code))
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid license code';
  END IF;

  IF v_license.status != 'reserved' THEN
    RAISE EXCEPTION 'License is not reserved for activation';
  END IF;

  IF v_license.expires_at IS NOT NULL AND v_license.expires_at < NOW() THEN
    UPDATE public.licenses
    SET status = 'expired'
    WHERE id = v_license.id;

    UPDATE public.routes
    SET available_seats = LEAST(capacity, available_seats + 1)
    WHERE id = v_license.route_id;

    RAISE EXCEPTION 'License has expired';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE student_id = auth.uid()
      AND route_id = v_license.route_id
      AND status IN ('active', 'pending')
  ) THEN
    RAISE EXCEPTION 'Already subscribed to this route';
  END IF;

  SELECT price INTO v_route_price
  FROM public.routes
  WHERE id = v_license.route_id;

  INSERT INTO public.subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
  VALUES (
    auth.uid(),
    v_license.route_id,
    'active',
    NOW(),
    NOW() + (v_license.valid_days || ' days')::INTERVAL,
    COALESCE(v_route_price, 0)
  )
  RETURNING id INTO v_subscription_id;

  UPDATE public.licenses
  SET status = 'used',
      used_by = auth.uid(),
      used_at = NOW()
  WHERE id = v_license.id;

  PERFORM public.log_audit(
    auth.uid(),
    'activate_license',
    'subscriptions',
    v_subscription_id,
    jsonb_build_object('route_id', v_license.route_id, 'license_id', v_license.id)
  );

  RETURN v_subscription_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.activate_license(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_license(TEXT) TO authenticated, service_role;

-- 8. Periodic cleanup for abandoned checkout holds.
CREATE OR REPLACE FUNCTION public.cleanup_expired_license_holds()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_row RECORD;
BEGIN
  FOR v_row IN
    SELECT p.zaincash_order_id
    FROM public.payments p
    JOIN public.licenses l ON l.id = p.license_id
    WHERE p.status = 'pending'
      AND l.status = 'payment_hold'
      AND l.hold_expires_at < NOW()
  LOOP
    PERFORM public.release_payment_hold(v_row.zaincash_order_id, 'expired');
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cleanup_expired_license_holds() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_license_holds() TO service_role;

DO $$
BEGIN
  BEGIN
    PERFORM cron.unschedule('cleanup-expired-license-holds');
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

SELECT cron.schedule(
  'cleanup-expired-license-holds',
  '*/5 * * * *',
  'SELECT public.cleanup_expired_license_holds();'
);
