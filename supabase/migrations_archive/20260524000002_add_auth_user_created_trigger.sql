-- Migration: 20260524000002_add_auth_user_created_trigger.sql
-- Date: 2026-05-24
-- Description: Hardens public.handle_new_user search path and registers the trigger on auth.users.

-- 1. Recreate the trigger function with search_path hardened
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_app_meta_data->>'role', 'student'),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Drop trigger if it already exists, and register it AFTER INSERT on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Audit log
INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
VALUES (
  NULL,
  'migration_applied',
  'migrations',
  NULL,
  jsonb_build_object(
    'migration', '20260524000002_add_auth_user_created_trigger',
    'description', 'Hardens handle_new_user search_path and creates trigger on_auth_user_created on auth.users',
    'date', NOW()
  )
);
