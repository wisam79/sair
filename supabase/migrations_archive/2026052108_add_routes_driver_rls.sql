-- Add SELECT policy on routes to allow drivers to view their own routes (even if inactive)
CREATE POLICY "Routes: Drivers see own" ON routes FOR SELECT USING (
  driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);
