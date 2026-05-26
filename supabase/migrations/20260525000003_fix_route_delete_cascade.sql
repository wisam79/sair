-- Migration: 20260525000003_fix_route_delete_cascade.sql
-- Date: 2026-05-25
-- Purpose: Fix route delete constraints on subscriptions and trips tables by enforcing ON DELETE CASCADE

-- 1. Subscriptions route foreign key
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_route_id_fkey;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_route_id_fkey
  FOREIGN KEY (route_id)
  REFERENCES public.routes(id)
  ON DELETE CASCADE;

-- 2. Trips route foreign key
ALTER TABLE public.trips DROP CONSTRAINT IF EXISTS trips_route_id_fkey;
ALTER TABLE public.trips
  ADD CONSTRAINT trips_route_id_fkey
  FOREIGN KEY (route_id)
  REFERENCES public.routes(id)
  ON DELETE CASCADE;

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
      'migration', '20260525000003_fix_route_delete_cascade',
      'date', NOW(),
      'description', 'Fix route delete constraints on subscriptions and trips tables by enforcing ON DELETE CASCADE'
    )
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not insert audit log: %', SQLERRM;
END $$;
