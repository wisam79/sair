-- Migration: 20260523000003_fix_drivers_rating_rpc.sql
-- Description: Fix get_drivers_avg_rating RPC to map drivers.id to their profile rating.
-- Context: routes.driver_id references drivers.id, but ratings.driver_id references auth.users(id) (profiles.id).
-- The RPC is called with a list of drivers.id, so we must join drivers to match.

CREATE OR REPLACE FUNCTION public.get_drivers_avg_rating(p_driver_ids UUID[])
RETURNS TABLE(driver_id UUID, avg_rating NUMERIC)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public AS $$
  SELECT d.id AS driver_id, ROUND(AVG(r.rating)::NUMERIC, 1) AS avg_rating
  FROM ratings r
  JOIN drivers d ON r.driver_id = d.user_id
  WHERE d.id = ANY(p_driver_ids)
  GROUP BY d.id;
$$;

REVOKE EXECUTE ON FUNCTION public.get_drivers_avg_rating(UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_drivers_avg_rating(UUID[]) TO authenticated;
