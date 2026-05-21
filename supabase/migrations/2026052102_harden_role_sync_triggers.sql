-- UniRide v2: Harden enforce_profile_privileged_fields trigger to allow system-level role updates
-- This allows SECURITY DEFINER triggers (like sync_driver_role_promotion/demotion) to update
-- profiles.role without being blocked, since those functions run as the postgres/db-owner user.

CREATE OR REPLACE FUNCTION enforce_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow if the function is being called by a system user (postgres, supabase_admin, service_role)
  -- These are trusted backend callers, not authenticated client requests.
  -- Also allow if the JWT identifies the caller as an admin.
  IF CURRENT_USER IN ('postgres', 'supabase_admin', 'service_role', 'authenticator')
     OR (auth.jwt() IS NOT NULL AND auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') THEN
    RETURN NEW;
  END IF;

  -- Block non-admin authenticated users from changing privileged fields
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Only admins can change role';
  END IF;

  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Only admins can change verification';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger (no-op if already exists with same definition)
DROP TRIGGER IF EXISTS enforce_profile_privileged_fields_trigger ON profiles;
CREATE TRIGGER enforce_profile_privileged_fields_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_profile_privileged_fields();
