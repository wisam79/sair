-- Migration: 20260525000002_admin_delete_policies.sql
-- Date: 2026-05-25
-- Purpose: Add DELETE RLS policies for admin role on profiles, subscriptions, trips, and emergency_reports

-- 1. Profiles DELETE policy for Admin
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (is_admin());

-- 2. Subscriptions DELETE policy for Admin
DROP POLICY IF EXISTS "Admins can delete subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can delete subscriptions" ON public.subscriptions
  FOR DELETE USING (is_admin());

-- 3. Trips DELETE policy for Admin
DROP POLICY IF EXISTS "Admins can delete trips" ON public.trips;
CREATE POLICY "Admins can delete trips" ON public.trips
  FOR DELETE USING (is_admin());

-- 4. Emergency Reports DELETE policy for Admin
DROP POLICY IF EXISTS "Admins can delete emergency reports" ON public.emergency_reports;
CREATE POLICY "Admins can delete emergency reports" ON public.emergency_reports
  FOR DELETE USING (is_admin());

-- Audit Log entry
DO $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    NULL,
    'migration_applied',
    'migrations',
    NULL,
    jsonb_build_object(
      'migration', '20260525000002_admin_delete_policies',
      'date', NOW(),
      'description', 'Add DELETE RLS policies for admin role on profiles, subscriptions, trips, and emergency_reports'
    )
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not insert audit log: %', SQLERRM;
END $$;
