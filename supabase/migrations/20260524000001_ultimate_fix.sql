-- Migration: 20260524000001_ultimate_fix.sql
-- Date: 2026-05-24
-- Purpose: إصلاح شامل للثغرات + توثيق Database State
--
-- ════════════════════════════════════════════════════════════════
-- WARNING: هذا الـ migration هو "مصدر الحقيقة"
-- الغرض منه جعل Migrations = Database State
-- ════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════════
-- PART 1: إصلاح الثغرات الأمنية
-- ════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────
-- 1.1 إصلاح admin_cancel_trip - استعادة المقاعد في ALL الحالات
-- ───────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_cancel_trip(p_trip_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_role TEXT;
  v_trip RECORD;
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

  -- FIX: استعادة المقعد في scheduled و driver_waiting
  IF v_trip.status IN ('scheduled', 'driver_waiting') THEN
    UPDATE routes
    SET available_seats = LEAST(capacity, available_seats + 1),
        updated_at = NOW()
    WHERE id = v_trip.route_id;
  END IF;

  UPDATE trips
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_trip_id;

  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    auth.uid(),
    'admin_cancel_trip',
    'trips',
    p_trip_id,
    jsonb_build_object('route_id', v_trip.route_id, 'previous_status', v_trip.status)
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) TO authenticated;

-- ───────────────────────────────────────────────────────────────
-- 1.2 إصلاح create_trip - التحقق من driver verification
-- ───────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_trip(
  p_route_id UUID,
  p_scheduled_at TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_trip_id UUID;
  v_role TEXT;
  v_driver_id UUID;
  v_driver_is_verified BOOLEAN;
BEGIN
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'driver' THEN
    RAISE EXCEPTION 'Only drivers can create trips';
  END IF;

  SELECT d.id, COALESCE(d.is_verified, false)
  INTO v_driver_id, v_driver_is_verified
  FROM drivers d
  WHERE d.user_id = auth.uid();

  IF v_driver_id IS NULL THEN
    RAISE EXCEPTION 'Driver profile not found';
  END IF;

  -- FIX: التحقق من أن السائق موثق
  IF NOT v_driver_is_verified THEN
    RAISE EXCEPTION 'Driver not verified. Please complete verification first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM routes r
    WHERE r.id = p_route_id AND r.driver_id = v_driver_id
  ) THEN
    RAISE EXCEPTION 'Route not assigned to this driver';
  END IF;

  INSERT INTO trips (route_id, driver_id, status, scheduled_at)
  VALUES (p_route_id, v_driver_id, 'scheduled', p_scheduled_at)
  RETURNING id INTO v_trip_id;

  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    auth.uid(),
    'create_trip',
    'trips',
    v_trip_id,
    jsonb_build_object('route_id', p_route_id, 'scheduled_at', p_scheduled_at)
  );

  RETURN v_trip_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.create_trip(UUID, TIMESTAMPTZ) TO authenticated;

-- ════════════════════════════════════════════════════════════════
-- PART 2: توثيق جميع الـ TRIGGERS الموجودة في DB
-- ════════════════════════════════════════════════════════════════

-- Trigger: set_trips_updated_at
DROP TRIGGER IF EXISTS set_trips_updated_at ON trips;
CREATE TRIGGER set_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: update_payments_updated_at
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: update_conversations_updated_at
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: on_driver_created
DROP TRIGGER IF EXISTS on_driver_created ON drivers;
CREATE TRIGGER on_driver_created
  AFTER INSERT ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION sync_driver_role_promotion();

-- Trigger: on_driver_deleted
DROP TRIGGER IF EXISTS on_driver_deleted ON drivers;
CREATE TRIGGER on_driver_deleted
  AFTER DELETE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION sync_driver_role_demotion();

-- Trigger: enforce_profile_privileged_fields_trigger
DROP TRIGGER IF EXISTS enforce_profile_privileged_fields_trigger ON profiles;
CREATE TRIGGER enforce_profile_privileged_fields_trigger
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_profile_privileged_fields();

-- Trigger: on_profile_role_changed (INSERT)
DROP TRIGGER IF EXISTS on_profile_role_changed ON profiles;
CREATE TRIGGER on_profile_role_changed
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_role_to_auth();

-- ════════════════════════════════════════════════════════════════
-- PART 3: توثيق جميع POLICIES الموجودة في DB
-- ════════════════════════════════════════════════════════════════

-- app_config
DROP POLICY IF EXISTS "Anyone can read app_config" ON app_config;
CREATE POLICY "Anyone can read app_config" ON app_config FOR SELECT USING (true);

-- audit_logs
DROP POLICY IF EXISTS "Audit: Admins see all" ON audit_logs;
CREATE POLICY "Audit: Admins see all" ON audit_logs FOR SELECT USING (is_admin());

-- conversations
DROP POLICY IF EXISTS "Conversations: Participants see their conversations" ON conversations;
CREATE POLICY "Conversations: Participants see their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = student_id OR
    auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
  );

DROP POLICY IF EXISTS "Conversations: Driver can create for their trips" ON conversations;
CREATE POLICY "Conversations: Driver can create for their trips" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = student_id OR
    auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
  );

-- driver_payouts
DROP POLICY IF EXISTS "Drivers see own payouts" ON driver_payouts;
CREATE POLICY "Drivers see own payouts" ON driver_payouts
  FOR SELECT USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins manage all payouts" ON driver_payouts;
CREATE POLICY "Admins manage all payouts" ON driver_payouts
  FOR ALL USING (is_admin());

-- drivers
DROP POLICY IF EXISTS "Drivers: Own profile sees own" ON drivers;
CREATE POLICY "Drivers: Own profile sees own" ON drivers
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Drivers: Admins manage all" ON drivers;
CREATE POLICY "Drivers: Admins manage all" ON drivers
  FOR ALL USING (is_admin());

-- emergency_reports
DROP POLICY IF EXISTS "Users can insert own emergency reports" ON emergency_reports;
CREATE POLICY "Users can insert own emergency reports" ON emergency_reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own emergency reports" ON emergency_reports;
CREATE POLICY "Users can view own emergency reports" ON emergency_reports
  FOR SELECT USING (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view emergency reports" ON emergency_reports;
CREATE POLICY "Admins can view emergency reports" ON emergency_reports
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update emergency reports" ON emergency_reports;
CREATE POLICY "Admins can update emergency reports" ON emergency_reports
  FOR UPDATE USING (is_admin());

-- feature_flags
DROP POLICY IF EXISTS "Everyone can view feature flags" ON feature_flags;
CREATE POLICY "Everyone can view feature flags" ON feature_flags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage feature flags" ON feature_flags;
CREATE POLICY "Admins can manage feature flags" ON feature_flags
  FOR ALL USING (is_admin());

-- institutions
DROP POLICY IF EXISTS "Everyone can view institutions" ON institutions;
CREATE POLICY "Everyone can view institutions" ON institutions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage institutions" ON institutions;
CREATE POLICY "Admins can manage institutions" ON institutions
  FOR ALL USING (is_admin());

-- license_batches
DROP POLICY IF EXISTS "Admins can manage license_batches" ON license_batches;
CREATE POLICY "Admins can manage license_batches" ON license_batches
  FOR ALL USING (is_admin());

-- licenses
DROP POLICY IF EXISTS "Admins can manage licenses" ON licenses;
CREATE POLICY "Admins can manage licenses" ON licenses
  FOR ALL USING (is_admin());

-- messages
DROP POLICY IF EXISTS "Messages: Conversation participants can read" ON messages;
CREATE POLICY "Messages: Conversation participants can read" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id AND (
        c.student_id = auth.uid() OR
        c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Messages: Conversation participants can send" ON messages;
CREATE POLICY "Messages: Conversation participants can send" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id AND (
        c.student_id = auth.uid() OR
        c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Messages: Sender can update read status" ON messages;
CREATE POLICY "Messages: Sender can update read status" ON messages
  FOR UPDATE USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);

-- notification_log
DROP POLICY IF EXISTS "Users read own notifications" ON notification_log;
CREATE POLICY "Users read own notifications" ON notification_log
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own notifications" ON notification_log;
CREATE POLICY "Users update own notifications" ON notification_log
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own notifications" ON notification_log;
CREATE POLICY "Users delete own notifications" ON notification_log
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Service role inserts notifications" ON notification_log;
CREATE POLICY "Service role inserts notifications" ON notification_log
  FOR INSERT WITH CHECK (true);

-- payments
DROP POLICY IF EXISTS "Payments: Users see own" ON payments;
CREATE POLICY "Payments: Users see own" ON payments
  FOR SELECT USING (user_id = auth.uid());

-- profiles
DROP POLICY IF EXISTS "Profiles: Users see own" ON profiles;
CREATE POLICY "Profiles: Users see own" ON profiles
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Profiles: Users update own" ON profiles;
CREATE POLICY "Profiles: Users update own" ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Students can create own profile" ON profiles;
CREATE POLICY "Students can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Admins see all" ON profiles;
CREATE POLICY "Profiles: Admins see all" ON profiles
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Profiles: Admins can insert any" ON profiles;
CREATE POLICY "Profiles: Admins can insert any" ON profiles
  FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (is_admin());

-- push_tokens
DROP POLICY IF EXISTS "Users can manage their own push tokens" ON push_tokens;
CREATE POLICY "Users can manage their own push tokens" ON push_tokens
  FOR ALL USING (user_id = auth.uid());

-- rate_limits (Deny all - only RPC access)
DROP POLICY IF EXISTS "Deny all direct access to rate_limits" ON rate_limits;
CREATE POLICY "Deny all direct access to rate_limits" ON rate_limits
  FOR ALL USING (false);

-- ratings
DROP POLICY IF EXISTS "Students can view their ratings" ON ratings;
CREATE POLICY "Students can view their ratings" ON ratings
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Drivers can view their ratings" ON ratings;
CREATE POLICY "Drivers can view their ratings" ON ratings
  FOR SELECT USING (driver_id = auth.uid());

-- routes
DROP POLICY IF EXISTS "Routes: Everyone sees active routes" ON routes;
CREATE POLICY "Routes: Everyone sees active routes" ON routes
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Routes: Drivers see own" ON routes;
CREATE POLICY "Routes: Drivers see own" ON routes
  FOR SELECT USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Routes: Admins manage all" ON routes;
CREATE POLICY "Routes: Admins manage all" ON routes
  FOR ALL USING (is_admin());

-- subscriptions
DROP POLICY IF EXISTS "Subscriptions: Students see own" ON subscriptions;
CREATE POLICY "Subscriptions: Students see own" ON subscriptions
  FOR SELECT USING (deleted_at IS NULL AND student_id = auth.uid());

DROP POLICY IF EXISTS "Subscriptions: Driver sees route subscriptions" ON subscriptions;
CREATE POLICY "Subscriptions: Driver sees route subscriptions" ON subscriptions
  FOR SELECT USING (
    deleted_at IS NULL AND
    route_id IN (SELECT r.id FROM routes r JOIN drivers d ON r.driver_id = d.id WHERE d.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Subscriptions: Admins see all" ON subscriptions;
CREATE POLICY "Subscriptions: Admins see all" ON subscriptions
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Subscriptions: Students cancel own active" ON subscriptions;
CREATE POLICY "Subscriptions: Students cancel own active" ON subscriptions
  FOR UPDATE USING (
    deleted_at IS NULL AND
    student_id = auth.uid() AND
    status IN ('active', 'pending')
  ) WITH CHECK (
    student_id = auth.uid() AND
    status = 'cancelled'
  );

DROP POLICY IF EXISTS "Admins can update any subscription" ON subscriptions;
CREATE POLICY "Admins can update any subscription" ON subscriptions
  FOR UPDATE USING (is_admin());

-- support_requests
DROP POLICY IF EXISTS "Allow anonymous insert" ON support_requests;
CREATE POLICY "Allow anonymous insert" ON support_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own support requests" ON support_requests;
CREATE POLICY "Users can view own support requests" ON support_requests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own support requests" ON support_requests;
CREATE POLICY "Users can update own support requests" ON support_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins all" ON support_requests;
CREATE POLICY "Allow admins all" ON support_requests
  FOR ALL USING (is_admin());

-- trips
DROP POLICY IF EXISTS "Trips: Students see own route trips" ON trips;
CREATE POLICY "Trips: Students see own route trips" ON trips
  FOR SELECT USING (
    deleted_at IS NULL AND
    route_id IN (SELECT route_id FROM subscriptions WHERE student_id = auth.uid() AND deleted_at IS NULL)
  );

DROP POLICY IF EXISTS "Trips: Driver sees own trips" ON trips;
CREATE POLICY "Trips: Driver sees own trips" ON trips
  FOR SELECT USING (
    deleted_at IS NULL AND
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Trips: Admins see all" ON trips;
CREATE POLICY "Trips: Admins see all" ON trips
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update any trip" ON trips;
CREATE POLICY "Admins can update any trip" ON trips
  FOR UPDATE USING (is_admin());

-- ════════════════════════════════════════════════════════════════
-- PART 4: Audit Log
-- ════════════════════════════════════════════════════════════════
DO $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    NULL,
    'migration_applied',
    'migrations',
    NULL,
    jsonb_build_object(
      'migration', '20260524000001_ultimate_fix',
      'date', NOW(),
      'description', 'Comprehensive security fix + DB state documentation',
      'fixes', ARRAY[
        'admin_cancel_trip_seat_restoration_fixed',
        'create_trip_driver_verification_required',
        'all_triggers_documented',
        'all_policies_documented'
      ],
      'stats', jsonb_build_object(
        'functions_fixed', 2,
        'triggers_documented', 7,
        'policies_documented', 52
      )
    )
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not insert audit log: %', SQLERRM;
END $$;