-- Migration: 20260524000006_harden_rls_policies.sql
-- Description: Harden RLS policies for notification_log and support_requests to resolve linter warnings

-- 1. Harden support_requests insert policy
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.support_requests;
CREATE POLICY "Allow anonymous insert" ON public.support_requests
  FOR INSERT
  WITH CHECK (email IS NOT NULL AND message IS NOT NULL AND request_type IS NOT NULL);

-- 2. Harden notification_log insert policy to restrict only to service_role
DROP POLICY IF EXISTS "Service role inserts notifications" ON public.notification_log;
CREATE POLICY "Service role inserts notifications" ON public.notification_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);
