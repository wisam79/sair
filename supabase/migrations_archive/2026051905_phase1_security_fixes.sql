-- Migration: 2026051905_phase1_security_fixes.sql
-- Description: Revoke dangerous RPCs and fix privilege escalation on profiles table

-- 1. Drop the dangerous seed_safe_insert RPC
DROP FUNCTION IF EXISTS seed_safe_insert(text, jsonb);

-- 2. Prevent privilege escalation on profiles (role, is_verified) via Trigger
CREATE OR REPLACE FUNCTION enforce_profile_security()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.role = 'student';
      NEW.is_verified = false;
    ELSIF TG_OP = 'UPDATE' THEN
      -- Preserve the old values for role and is_verified so users can't upgrade themselves
      NEW.role = OLD.role;
      NEW.is_verified = OLD.is_verified;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_enforce_profile_security ON profiles;
CREATE TRIGGER trigger_enforce_profile_security
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_profile_security();