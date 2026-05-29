-- UniRide v2: Core Security & Optimized RLS
-- Using JWT Claims for high performance

-- 1. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- 2. Helper Functions (Optimized with JWT Claims)
CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
  SELECT auth.jwt() -> 'user_metadata' ->> 'role';
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT get_my_role() = 'admin';
$$ LANGUAGE sql STABLE;

-- 3. Profiles Policies
CREATE POLICY "Profiles: Users see own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles: Admins see all" ON profiles FOR SELECT USING (is_admin());

-- 4. Routes Policies
CREATE POLICY "Routes: Everyone sees active routes" ON routes 
FOR SELECT USING (is_active = true);

-- 5. Atomic Booking Logic (Transaction-safe)
-- This replaces the fragile v1 logic
CREATE OR REPLACE FUNCTION reserve_seat(p_route_id UUID, p_student_id UUID) 
RETURNS void AS $$
DECLARE
  v_available_seats INT;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT available_seats INTO v_available_seats 
  FROM routes 
  WHERE id = p_route_id 
  FOR UPDATE;

  IF v_available_seats <= 0 THEN
    RAISE EXCEPTION 'No seats available';
  END IF;

  -- Atomic update
  UPDATE routes 
  SET available_seats = available_seats - 1 
  WHERE id = p_route_id;

  -- Create subscription
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
  VALUES (p_student_id, p_route_id, 'active', NOW(), NOW() + INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
