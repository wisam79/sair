-- Migration: 20260524000005_harden_security_and_search_paths.sql
-- Description: Resolve database linter warnings for SECURITY DEFINER functions and mutable search paths

-- 1. Drop manually created unneeded functions
DROP FUNCTION IF EXISTS public.get_slow_queries(integer);

-- 2. Harden search_path for mutable search path functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.enforce_profile_privileged_fields() SET search_path = public;
ALTER FUNCTION public.register_push_token(text) SET search_path = public;
ALTER FUNCTION public.update_updated_at() SET search_path = public;
ALTER FUNCTION public.get_messages(uuid, integer) SET search_path = public;
ALTER FUNCTION public.mark_messages_read(uuid) SET search_path = public;
ALTER FUNCTION public.sync_driver_role_promotion() SET search_path = public;
ALTER FUNCTION public.sync_driver_role_demotion() SET search_path = public;
ALTER FUNCTION public.sync_profile_role_to_auth() SET search_path = public;
ALTER FUNCTION public.get_app_config() SET search_path = public;

-- 3. Revoke public/anon execute on trigger functions (triggers don't need RPC access)
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_privileged_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_driver_role_promotion() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_driver_role_demotion() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_profile_role_to_auth() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- 4. Revoke public/anon execute on sensitive SECURITY DEFINER functions (they must only be run by authenticated users or service role)
-- Admin functions
REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.admin_create_trip(uuid, uuid, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_trip(uuid, uuid, timestamptz) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_enhanced_analytics(timestamptz, timestamptz, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_enhanced_analytics(timestamptz, timestamptz, timestamptz, timestamptz) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_system_health() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_system_health() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_daily_activity(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_daily_activity(integer) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_recent_active_trips(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_recent_active_trips(integer) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.update_payout_status(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_payout_status(uuid, text) TO authenticated, service_role;

-- Utility / System functions
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) TO authenticated, service_role;

-- Rate limit cleanup
REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_rate_limits() TO authenticated, service_role;

-- Expiry function
REVOKE EXECUTE ON FUNCTION public.expire_subscriptions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.expire_subscriptions() TO authenticated, service_role;

-- Driver functions
REVOKE EXECUTE ON FUNCTION public.get_driver_balance() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_driver_balance() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_driver_balance(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_driver_balance(uuid) TO authenticated, service_role;

-- Rating functions
REVOKE EXECUTE ON FUNCTION public.get_driver_avg_rating(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_driver_avg_rating(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_drivers_avg_rating(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_drivers_avg_rating(uuid[]) TO authenticated, service_role;

-- Push token function
REVOKE EXECUTE ON FUNCTION public.register_push_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_push_token(text) TO authenticated, service_role;
