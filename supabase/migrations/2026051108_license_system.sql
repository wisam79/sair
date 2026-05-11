-- supabase/migrations/2026051108_license_system.sql

-- 1. Create License Batches
CREATE TABLE IF NOT EXISTS license_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  batch_name TEXT NOT NULL,
  quantity INT NOT NULL,
  price NUMERIC NOT NULL,
  valid_days INT NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Licenses
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES license_batches(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'used', 'revoked')) DEFAULT 'active',
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  valid_days INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_licenses_code ON licenses(code);
CREATE INDEX IF NOT EXISTS idx_licenses_route_id ON licenses(route_id);

-- Enable RLS
ALTER TABLE license_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Admins can read/write everything
CREATE POLICY "Admins can manage license_batches" ON license_batches
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can manage licenses" ON licenses
  FOR ALL USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- 3. RPC: Create a batch and generate codes securely
CREATE OR REPLACE FUNCTION create_license_batch(
  p_route_id UUID,
  p_batch_name TEXT,
  p_quantity INT,
  p_price NUMERIC,
  p_valid_days INT
) RETURNS UUID AS $$
DECLARE
  v_batch_id UUID;
  v_code TEXT;
  i INT;
  v_role TEXT;
BEGIN
  -- Verify caller is admin
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can create license batches';
  END IF;

  -- Create batch
  INSERT INTO license_batches (created_by, route_id, batch_name, quantity, price, valid_days)
  VALUES (auth.uid(), p_route_id, p_batch_name, p_quantity, p_price, p_valid_days)
  RETURNING id INTO v_batch_id;

  -- Generate codes
  FOR i IN 1..p_quantity LOOP
    -- Simple unique 8-character alphanumeric code logic
    LOOP
      v_code := upper(substring(md5(random()::text) from 1 for 8));
      BEGIN
        INSERT INTO licenses (batch_id, route_id, code, valid_days)
        VALUES (v_batch_id, p_route_id, v_code, p_valid_days);
        EXIT; -- Exit loop if insertion succeeds (unique code)
      EXCEPTION WHEN unique_violation THEN
        -- Keep looping to generate a new code if there's a collision
      END;
    END LOOP;
  END LOOP;

  RETURN v_batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: Activate License
CREATE OR REPLACE FUNCTION activate_license(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_license RECORD;
  v_subscription_id UUID;
  v_role TEXT;
BEGIN
  -- Verify caller is student
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can activate licenses';
  END IF;

  -- Find and lock the license to prevent race conditions
  SELECT * INTO v_license
  FROM licenses
  WHERE code = upper(p_code) AND status = 'active'
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used license code';
  END IF;

  -- Mark license as used
  UPDATE licenses 
  SET status = 'used', used_by = auth.uid(), used_at = NOW()
  WHERE id = v_license.id;

  -- Create active subscription
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
  VALUES (
    auth.uid(), 
    v_license.route_id, 
    'active', 
    NOW(), 
    NOW() + (v_license.valid_days || ' days')::INTERVAL
  )
  RETURNING id INTO v_subscription_id;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Deprecate atomic-booking (drop if exists)
DROP FUNCTION IF EXISTS reserve_seat(UUID, UUID);
