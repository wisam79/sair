-- Migration: 2026052105_revoke_update_trip_location.sql
-- Description: Revoke public and anonymous execution on update_trip_location and create_license_batch to ensure they require authentication.

REVOKE EXECUTE ON FUNCTION public.update_trip_location(UUID, NUMERIC, NUMERIC) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) FROM anon, PUBLIC;

GRANT EXECUTE ON FUNCTION public.update_trip_location(UUID, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_license_batch(UUID, TEXT, INT, NUMERIC, INT) TO authenticated;
