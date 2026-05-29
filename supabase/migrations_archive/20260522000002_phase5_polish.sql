-- Phase 5: Polish & Pre-launch
-- Migration: 20260522000002_phase5_polish.sql

-- 1. App Config Table (For Force Update Mechanism)
CREATE TABLE IF NOT EXISTS public.app_config (
  id              smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row
  min_version     text NOT NULL DEFAULT '1.0.0',
  latest_version  text NOT NULL DEFAULT '1.0.0',
  updated_at      timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read the config
CREATE POLICY "Anyone can read app_config"
  ON public.app_config
  FOR SELECT
  USING (true);

-- Insert default config
INSERT INTO public.app_config (id, min_version, latest_version)
VALUES (1, '1.0.0', '1.0.0')
ON CONFLICT (id) DO NOTHING;

-- RPC to easily get config
CREATE OR REPLACE FUNCTION get_app_config()
RETURNS jsonb AS $$
  SELECT jsonb_build_object(
    'min_version', min_version,
    'latest_version', latest_version
  )
  FROM public.app_config WHERE id = 1;
$$ LANGUAGE sql STABLE;

-- 2. Emergency Reports Table (For SOS Button)
CREATE TABLE IF NOT EXISTS public.emergency_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id     uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  lat         double precision,
  lng         double precision,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  created_at  timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.emergency_reports ENABLE ROW LEVEL SECURITY;

-- Users can insert their own reports
CREATE POLICY "Users can insert own emergency reports"
  ON public.emergency_reports
  FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Users can read their own reports
CREATE POLICY "Users can view own emergency reports"
  ON public.emergency_reports
  FOR SELECT
  USING (reporter_id = auth.uid());
