-- Migration: 20260525000001_security_hardening_phase2.sql
-- Date: 2026-05-25
-- Purpose: إصلاح ثغرات أمنية - المرحلة الثانية
--
-- ════════════════════════════════════════════════════════════════
-- FIXES:
--   1. mark_messages_read: إضافة التحقق من مشاركة المتصل في المحادثة
--   2. REVOKE EXECUTE FROM PUBLIC لجميع RPCs المفقودة
--   3. admin_cancel_trip: إزالة استعادة المقاعد (المقاعد تتبع الاشتراك)
--   4. notification_log INSERT: تقييد السياسة بدلاً من WITH CHECK (true)
--   5. cancel_subscription: تحسين نمط التحقق من الهوية
--   6. emergency_reports: إضافة التحقق من participation في الرحلة
-- ════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════════
-- FIX 1: mark_messages_read - إضافة التحقق من المشاركة
-- ════════════════════════════════════════════════════════════════
-- الثغرة: أي مستخدم مصادق يمكنه تعليم رسائل أي محادثة كمقروءة
-- فقط بمعرفة conversation_id، دون أن يكون مشاركاً فيها.

CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_caller_id UUID;
  v_is_participant BOOLEAN;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND (
        c.student_id = v_caller_id
        OR c.driver_id IN (SELECT id FROM public.drivers WHERE user_id = v_caller_id)
      )
  ) INTO v_is_participant;

  IF NOT v_is_participant THEN
    RAISE EXCEPTION 'Not a participant in this conversation';
  END IF;

  UPDATE public.messages
  SET is_read = true
  WHERE conversation_id = p_conversation_id
    AND sender_id != v_caller_id
    AND is_read = false;
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- FIX 2: REVOKE EXECUTE FROM PUBLIC لجميع RPCs المفقودة
-- ════════════════════════════════════════════════════════════════
-- الثغرة: دوال بدون REVOKE FROM PUBLIC يمكن لأي مستخدم مجهول استدعاؤها
-- حتى لو كانت ترفض داخلياً، هذا يخالف مبدأ Defense-in-Depth

-- Messaging RPCs
REVOKE EXECUTE ON FUNCTION public.send_message(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.send_message(UUID, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_messages(UUID, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_messages(UUID, INT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.mark_messages_read(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_messages_read(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_my_conversations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_conversations() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) TO authenticated;

-- Trip/State RPCs
REVOKE EXECUTE ON FUNCTION public.validate_trip_transition(UUID, TEXT) FROM PUBLIC, anon, authenticated;
-- validate_trip_transition للاستخدام الداخلي فقط (تستدعيها update_trip_status)

REVOKE EXECUTE ON FUNCTION public.create_trip(UUID, TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_trip(UUID, TIMESTAMPTZ) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_create_trip(UUID, UUID, TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_trip(UUID, UUID, TIMESTAMPTZ) TO authenticated;

-- Utility RPCs
REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.ping() FROM PUBLIC;

-- Dashboard/Analytics RPCs
REVOKE EXECUTE ON FUNCTION public.get_analytics_summary(TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_analytics_summary(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- ════════════════════════════════════════════════════════════════
-- FIX 3: admin_cancel_trip - إزالة استعادة المقاعد
-- ════════════════════════════════════════════════════════════════
-- الثغرة: المقاعد تتبع الاشتراك وليس الرحلة (حسب AGENTS.md)
-- إلغاء رحلة لا يجب أن يستعيد مقعداً لأن المقاعد تُخصم عند
-- تفعيل الترخيص وتُستعاد عند إلغاء الاشتراك فقط.
-- استعادة المقعد هنا تسبب تضخم available_seats.

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

  IF v_trip.status NOT IN ('scheduled', 'driver_waiting', 'in_transit') THEN
    RAISE EXCEPTION 'Cannot cancel trip with status %', v_trip.status;
  END IF;

  -- لا نستعيد المقاعد هنا! المقاعد تتبع الاشتراك وليس الرحلة.
  -- استعادة المقاعد تتم فقط عبر cancel_subscription أو expire_subscriptions.

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

-- ════════════════════════════════════════════════════════════════
-- FIX 4: notification_log INSERT - تقييد السياسة
-- ════════════════════════════════════════════════════════════════
-- الثغرة: WITH CHECK (true) يسمح لأي مستخدم (بما فيهم anon)
-- بإدراج إشعارات مزيفة في حساب أي مستخدم.
-- الإصلاح: السماح فقط لـ service_role أو المستخدم لنفسه.

DROP POLICY IF EXISTS "Service role inserts notifications" ON notification_log;
CREATE POLICY "Service role inserts notifications" ON notification_log
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
    OR user_id = auth.uid()
  );

-- ════════════════════════════════════════════════════════════════
-- FIX 5: cancel_subscription - تحسين نمط التحقق
-- ════════════════════════════════════════════════════════════════
-- الثغرة: الشرط IF auth.uid() IS NOT NULL AND ... يفشل في حماية
-- المستخدمين إذا أُعيد منح PUBLIC مستقبلاً. النمط الصحيح
-- هو الاعتماد على REVOKE FROM PUBLIC + فحص مباشر للملكية.

CREATE OR REPLACE FUNCTION public.cancel_subscription(p_subscription_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_sub RECORD;
  v_role text;
BEGIN
  v_role := COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'student');

  SELECT * INTO v_sub
  FROM public.subscriptions
  WHERE id = p_subscription_id
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;

  -- فحص الملكية: الطالب يلغي اشتراكه فقط، الأدمن يلغي أي اشتراك
  IF v_sub.student_id != auth.uid() AND v_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: You can only cancel your own subscriptions';
  END IF;

  IF v_sub.status NOT IN ('active', 'pending') THEN
    RAISE EXCEPTION 'Cannot cancel subscription in % state', v_sub.status;
  END IF;

  UPDATE public.subscriptions
  SET status = 'cancelled'
  WHERE id = p_subscription_id;

  IF v_sub.status = 'active' THEN
    UPDATE public.routes
    SET available_seats = LEAST(capacity, available_seats + 1),
        updated_at = NOW()
    WHERE id = v_sub.route_id;
  END IF;

  INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    auth.uid(),
    CASE WHEN v_role = 'admin' THEN 'admin_cancel_subscription' ELSE 'cancel_subscription' END,
    'subscriptions',
    p_subscription_id,
    jsonb_build_object('route_id', v_sub.route_id, 'previous_status', v_sub.status)
  );
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- FIX 6: emergency_reports - إضافة التحقق من المشاركة في الرحلة
-- ════════════════════════════════════════════════════════════════
-- الثغرة: أي طالب يمكنه إنشاء بلاغ طوارئ لأي رحلة حتى لو لم يكن مشاركاً فيها.
-- الإصلاح: التحقق من أن الطالب مشترك في خط الرحلة أو أن المتصل هو السائق.

DROP POLICY IF EXISTS "Users can insert own emergency reports" ON emergency_reports;
CREATE POLICY "Users can insert own emergency reports" ON emergency_reports
  FOR INSERT WITH CHECK (
    reporter_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM trips t
        JOIN subscriptions s ON s.route_id = t.route_id
        WHERE t.id = emergency_reports.trip_id
          AND s.student_id = auth.uid()
          AND s.status = 'active'
          AND s.deleted_at IS NULL
      )
      OR EXISTS (
        SELECT 1 FROM trips t
        JOIN drivers d ON d.id = t.driver_id
        WHERE t.id = emergency_reports.trip_id
          AND d.user_id = auth.uid()
      )
    )
  );

-- ════════════════════════════════════════════════════════════════
-- Audit Log
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
      'migration', '20260525000001_security_hardening_phase2',
      'date', NOW(),
      'description', 'Phase 2 security hardening',
      'fixes', ARRAY[
        'mark_messages_read_participant_check',
        'revoke_public_from_all_rpcs',
        'admin_cancel_trip_no_seat_restore',
        'notification_log_insert_restricted',
        'cancel_subscription_auth_pattern_improved',
        'emergency_reports_participation_check'
      ]
    )
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not insert audit log: %', SQLERRM;
END $$;
