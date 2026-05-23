-- UniRide: Harden exposed RPCs and disable unsafe payment stubs.
--
-- These RPCs are intended to be reached through trusted Edge Functions only.
-- Direct PostgREST execution by anon/authenticated users bypasses gateway
-- validation, idempotency, and payment-provider verification.

REVOKE EXECUTE ON FUNCTION public.update_trip_status(uuid, text, numeric, numeric, uuid, text)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_trip_status(uuid, text, numeric, numeric, uuid, text)
TO service_role;

REVOKE EXECUTE ON FUNCTION public.create_payment(uuid, uuid, integer, text)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_payment(uuid, uuid, integer, text)
TO service_role;

REVOKE EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(text, integer)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_payment_and_activate_subscription(text, integer)
TO service_role;

REVOKE EXECUTE ON FUNCTION public.bulk_update_trip_locations(jsonb)
FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bulk_update_trip_locations(jsonb)
TO authenticated;

REVOKE EXECUTE ON FUNCTION public.log_audit(uuid, text, text, uuid, jsonb)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_audit(uuid, text, text, uuid, jsonb)
TO service_role;
