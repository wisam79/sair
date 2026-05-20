-- Phase 4: Notification Log Table
-- Migration: 2026051901_notification_log.sql

CREATE TABLE IF NOT EXISTS public.notification_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text NOT NULL,
  data        jsonb DEFAULT '{}',
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_notification_log_user_id
  ON public.notification_log(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- Each user can only read their own notifications
CREATE POLICY "Users read own notifications"
  ON public.notification_log
  FOR SELECT
  USING (user_id = auth.uid());

-- Each user can only update (mark as read) their own notifications
CREATE POLICY "Users update own notifications"
  ON public.notification_log
  FOR UPDATE
  USING (user_id = auth.uid());

-- Each user can only delete their own notifications
CREATE POLICY "Users delete own notifications"
  ON public.notification_log
  FOR DELETE
  USING (user_id = auth.uid());

-- Only service_role can INSERT (Edge Functions use service_role)
CREATE POLICY "Service role inserts notifications"
  ON public.notification_log
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
