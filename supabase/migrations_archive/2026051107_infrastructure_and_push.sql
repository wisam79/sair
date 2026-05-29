-- supabase/migrations/2026051107_infrastructure_and_push.sql

-- 1. Add coordinates to routes table
ALTER TABLE routes ADD COLUMN IF NOT EXISTS start_lat NUMERIC(10, 6) DEFAULT 33.3128; -- Baghdad default
ALTER TABLE routes ADD COLUMN IF NOT EXISTS start_lng NUMERIC(10, 6) DEFAULT 44.3615;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS end_lat NUMERIC(10, 6) DEFAULT 33.2800;   -- University roughly
ALTER TABLE routes ADD COLUMN IF NOT EXISTS end_lng NUMERIC(10, 6) DEFAULT 44.3800;

-- 2. Create push_tokens table for notifications
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, token)
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);

-- RLS for push_tokens
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own push tokens"
  ON push_tokens
  FOR ALL
  USING (auth.uid() = user_id);

-- 3. RPC to register push token safely
CREATE OR REPLACE FUNCTION register_push_token(p_token TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO push_tokens (user_id, token, updated_at)
  VALUES (auth.uid(), p_token, NOW())
  ON CONFLICT (user_id, token) DO UPDATE SET updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC for Drivers to create a trip
CREATE OR REPLACE FUNCTION create_trip(p_route_id UUID, p_scheduled_at TIMESTAMPTZ)
RETURNS UUID AS $$
DECLARE
  v_trip_id UUID;
  v_role TEXT;
BEGIN
  -- Verify caller is a driver
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'driver' THEN
    RAISE EXCEPTION 'Only drivers can create trips';
  END IF;

  -- Create the trip
  INSERT INTO trips (route_id, driver_id, status, scheduled_at)
  VALUES (p_route_id, auth.uid(), 'scheduled', p_scheduled_at)
  RETURNING id INTO v_trip_id;

  RETURN v_trip_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
