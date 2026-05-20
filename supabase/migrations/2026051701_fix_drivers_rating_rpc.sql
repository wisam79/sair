-- UniRide: Fix drivers avg rating RPC
-- Migration: 2026051701_fix_drivers_rating_rpc.sql
--
-- Problem: admin/drivers/page.tsx calls get_drivers_avg_rating(p_driver_ids UUID[])
-- but the existing function get_driver_avg_rating(p_driver_id UUID) only accepts a single UUID.
--
-- Solution: Replace with a new function that accepts UUID[] and returns TABLE of driver_id + avg_rating

CREATE OR REPLACE FUNCTION get_drivers_avg_rating(p_driver_ids UUID[])
RETURNS TABLE(driver_id UUID, avg_rating NUMERIC)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
  SELECT driver_id, ROUND(AVG(rating)::NUMERIC, 1) AS avg_rating
  FROM ratings
  WHERE driver_id = ANY(p_driver_ids)
  GROUP BY driver_id;
$$;

REVOKE EXECUTE ON FUNCTION get_drivers_avg_rating(UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_drivers_avg_rating(UUID[]) TO authenticated;
