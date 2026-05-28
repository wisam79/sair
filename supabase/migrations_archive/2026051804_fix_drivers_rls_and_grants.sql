-- UniRide: Fix Drivers RLS and missing grants
-- Migration: 2026051804_fix_drivers_rls_and_grants.sql

-- 1. Ensure Admins have full access to drivers table
-- Some early migrations might have had restrictive policies
DROP POLICY IF EXISTS "Drivers: Admins see all" ON drivers;
CREATE POLICY "Drivers: Admins manage all" ON drivers 
  FOR ALL USING (is_admin());

-- 2. Ensure profiles are visible to Admins (for joining driver info)
DROP POLICY IF EXISTS "Profiles: Admins see all" ON profiles;
CREATE POLICY "Profiles: Admins see all" ON profiles 
  FOR SELECT USING (is_admin());

-- 3. Grant permissions to authenticated users for RPCs used in drivers page
GRANT EXECUTE ON FUNCTION get_drivers_avg_rating(UUID[]) TO authenticated;

-- 4. Fix possible missing search_path on is_admin if it was recreated
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT get_my_role() = 'admin';
$$;
