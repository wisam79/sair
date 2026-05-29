-- supabase/migrations/2026051110_m5_performance.sql
-- M5: Performance indexes + RLS for institutions + rate_limits cleanup

-- ════════════════════════════════════════════════
-- 1. Missing indexes for M4 tables
-- ════════════════════════════════════════════════

-- ratings: fast lookup by driver or student
CREATE INDEX IF NOT EXISTS idx_ratings_driver_id  ON ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_ratings_student_id ON ratings(student_id);
CREATE INDEX IF NOT EXISTS idx_ratings_trip_id    ON ratings(trip_id);

-- institutions: name lookup (search)
CREATE INDEX IF NOT EXISTS idx_institutions_name ON institutions(name);

-- licenses: status filter (list active/used)
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);

-- license_batches: listing by date
CREATE INDEX IF NOT EXISTS idx_license_batches_created_at ON license_batches(created_at DESC);

-- push_tokens: cleanup old tokens efficiently
CREATE INDEX IF NOT EXISTS idx_push_tokens_updated_at ON push_tokens(updated_at);

-- ════════════════════════════════════════════════
-- 2. RLS for institutions table (was missing)
-- ════════════════════════════════════════════════
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Everyone can read institutions (needed for onboarding selection)
CREATE POLICY "Everyone can view institutions" ON institutions
  FOR SELECT USING (true);

-- Only admins can manage institutions
CREATE POLICY "Admins can manage institutions" ON institutions
  FOR ALL USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- ════════════════════════════════════════════════
-- 3. Allow admins to update driver is_verified field
-- ════════════════════════════════════════════════
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- ════════════════════════════════════════════════
-- 4. Automatic cleanup of expired rate_limits rows
-- Runs via pg_cron every hour to keep the table small
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup (requires pg_cron extension — already enabled on Supabase)
SELECT cron.schedule(
  'cleanup-rate-limits',
  '0 * * * *',  -- Every hour
  'SELECT cleanup_rate_limits()'
) ON CONFLICT (jobname) DO NOTHING;

-- ════════════════════════════════════════════════
-- 5. Average driver rating helper RPC
-- Used in admin panel to show driver quality
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_driver_avg_rating(p_driver_id UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(rating)::NUMERIC, 1)
  FROM ratings
  WHERE driver_id = p_driver_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
