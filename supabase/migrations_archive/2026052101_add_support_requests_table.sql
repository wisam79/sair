-- Migration: 2026052101_add_support_requests_table.sql
-- Description: Create support_requests table for storing public support and account deletion requests with secure RLS policies.

-- 1. Create support_requests table
CREATE TABLE IF NOT EXISTS public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,
  request_type text NOT NULL, -- 'account_deletion' or 'support'
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'resolved'
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policy to allow anyone (anonymous or authenticated) to insert requests
CREATE POLICY "Allow anonymous insert" ON public.support_requests
  FOR INSERT
  WITH CHECK (true);

-- 4. Create RLS Policy to allow admins only to view and manage requests
CREATE POLICY "Allow admins all" ON public.support_requests
  FOR ALL
  TO authenticated
  USING (is_admin());

-- 5. Grant access to public role for inserts and authenticated/service_role roles
GRANT INSERT ON public.support_requests TO anon, authenticated;
GRANT ALL ON public.support_requests TO service_role;
