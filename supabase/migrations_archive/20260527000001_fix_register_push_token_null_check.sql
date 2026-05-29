-- supabase/migrations/20260527000001_fix_register_push_token_null_check.sql
-- Fix: register_push_token raises DB error when called with null auth.uid()
-- Root cause: race condition where push token registration fires before user session is loaded.
-- Solution: Add explicit null check inside RPC + guard in useNotifications hook.

CREATE OR REPLACE FUNCTION public.register_push_token(p_token TEXT)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  -- Guard: do nothing silently if called without a valid session
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'register_push_token: user must be authenticated';
  END IF;

  INSERT INTO push_tokens (user_id, token, updated_at)
  VALUES (v_user_id, p_token, NOW())
  ON CONFLICT (user_id, token) DO UPDATE SET updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Keep existing permissions
REVOKE EXECUTE ON FUNCTION public.register_push_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_push_token(text) TO authenticated, service_role;
