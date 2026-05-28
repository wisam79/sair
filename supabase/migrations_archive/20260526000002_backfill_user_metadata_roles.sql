-- Migration: 20260526000002_backfill_user_metadata_roles.sql
-- Date: 2026-05-26
-- Description: Backfills missing roles in auth.users app_metadata from public.profiles.
-- This ensures that historical users (who signed up before synchronization triggers were established)
-- have their JWT claims populated with the correct role.

UPDATE auth.users u
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', p.role)
FROM public.profiles p
WHERE u.id = p.id
  AND (u.raw_app_meta_data->>'role' IS NULL OR u.raw_app_meta_data->>'role' != p.role);

-- Audit log
INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details)
VALUES (
  NULL,
  'migration_applied',
  'migrations',
  NULL,
  jsonb_build_object(
    'migration', '20260526000002_backfill_user_metadata_roles',
    'description', 'Backfills auth.users app_metadata roles from profiles',
    'date', NOW()
  )
);
