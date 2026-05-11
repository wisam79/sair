-- supabase/migrations/2026051109_ratings_and_ux.sql

-- 1. Create Institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key from profiles to institutions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_institution_id_fkey'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_institution_id_fkey
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. Modify routes and profiles to support UX features
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

ALTER TABLE routes ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS departure_time TIME;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS return_time TIME;

-- Optional index for faster filtering
CREATE INDEX IF NOT EXISTS idx_routes_institution_id ON routes(institution_id);

-- 3. Create Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id, student_id) -- Prevent double rating
);

-- Enable RLS for ratings
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their ratings" ON ratings
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Drivers can view their ratings" ON ratings
  FOR SELECT USING (auth.uid() = driver_id);

-- 4. RPC: Submit Rating
CREATE OR REPLACE FUNCTION submit_rating(
  p_trip_id UUID,
  p_rating INT,
  p_comment TEXT
) RETURNS UUID AS $$
DECLARE
  v_trip RECORD;
  v_rating_id UUID;
  v_role TEXT;
BEGIN
  -- Verify caller is student
  SELECT auth.jwt() -> 'app_metadata' ->> 'role' INTO v_role;
  IF v_role != 'student' THEN
    RAISE EXCEPTION 'Only students can submit ratings';
  END IF;

  -- Ensure rating is valid
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- Find the trip and ensure it is completed
  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip.status != 'completed' THEN
    RAISE EXCEPTION 'You can only rate completed trips';
  END IF;

  -- Insert rating (will fail if UNIQUE constraint is violated, preventing double rating)
  INSERT INTO ratings (trip_id, student_id, driver_id, rating, comment)
  VALUES (p_trip_id, auth.uid(), v_trip.driver_id, p_rating, p_comment)
  RETURNING id INTO v_rating_id;

  RETURN v_rating_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
