-- Create Client Error Logs Table for storing frontend errors in the database
CREATE TABLE IF NOT EXISTS public.client_error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.client_error_logs ENABLE ROW LEVEL SECURITY;

-- Only service_role can insert/read
CREATE POLICY "Service role manages client error logs" ON public.client_error_logs
  FOR ALL USING (auth.role() = 'service_role');
