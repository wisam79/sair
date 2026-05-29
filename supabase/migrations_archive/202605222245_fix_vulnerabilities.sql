-- Migration: 202605222245_fix_vulnerabilities
-- Date: 2026-05-22 (approximate)
-- Description: Security fixes and new functions (discovered by comparing DB to migrations)
-- Note: This migration was applied directly to DB but file was lost
--       Now documenting the functions that were found in DB but not in migration files

-- ═══════════════════════════════════════════════════════════════
-- 1. PROCESS_PAYOUT: Admin function to approve/reject driver payouts
-- ═══════════════════════════════════════════════════════════════

-- This function was found in DB but not in any migration file
-- It allows admins to process (complete/reject) pending payout requests

CREATE OR REPLACE FUNCTION public.process_payout(
  p_payout_id uuid,
  p_new_status text,
  p_reference_note text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $function$
DECLARE
  v_current_status TEXT;
BEGIN
  -- Verify admin
  IF auth.jwt() -> 'app_metadata' ->> 'role' != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can process payouts';
  END IF;

  IF p_new_status NOT IN ('completed', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  -- Get current status with lock
  SELECT status INTO v_current_status
  FROM driver_payouts
  WHERE id = p_payout_id
  FOR UPDATE NOWAIT;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Payout request not found';
  END IF;

  IF v_current_status != 'pending' THEN
    RAISE EXCEPTION 'Only pending payouts can be processed';
  END IF;

  -- Update status
  UPDATE driver_payouts
  SET status = p_new_status,
      reference_note = p_reference_note,
      updated_at = NOW()
  WHERE id = p_payout_id;

  -- Log audit
  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    auth.uid(),
    'payout_processed',
    'driver_payouts',
    p_payout_id,
    jsonb_build_object('new_status', p_new_status, 'reference_note', p_reference_note)
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.process_payout(uuid, text, text) TO authenticated;

-- ═══════════════════════════════════════════════════════════════
-- 2. RLS_AUTO_ENABLE: Event trigger to auto-enable RLS on new tables
-- ═══════════════════════════════════════════════════════════════

-- This event trigger automatically enables RLS on any new table created in public schema
-- Security best practice to ensure no table is created without RLS

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO pg_catalog
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL
       AND cmd.schema_name IN ('public')
       AND cmd.schema_name NOT IN ('pg_catalog','information_schema')
       AND cmd.schema_name NOT LIKE 'pg_toast%'
       AND cmd.schema_name NOT LIKE 'pg_temp%'
    THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
    ELSE
      RAISE LOG 'rls_auto_enable: skip % (system schema or not in enforced list: %.)',
                cmd.object_identity, cmd.schema_name;
    END IF;
  END LOOP;
END;
$function$;

-- Create event trigger
DROP EVENT TRIGGER IF EXISTS rls_auto_enable_trigger;
CREATE EVENT TRIGGER rls_auto_enable_trigger
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();

-- Grant needed permissions
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- 3. Audit log for this migration
-- ═══════════════════════════════════════════════════════════════

INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
SELECT
  NULL,  -- system migration, no user
  'migration_applied',
  'migrations',
  NULL,
  jsonb_build_object(
    'migration', '202605222245_fix_vulnerabilities',
    'description', 'process_payout function + rls_auto_enable trigger',
    'source', 'recovered from DB comparison',
    'date', NOW()
  )
WHERE NOT EXISTS (
  SELECT 1 FROM audit_logs WHERE details->>'migration' = '202605222245_fix_vulnerabilities'
);