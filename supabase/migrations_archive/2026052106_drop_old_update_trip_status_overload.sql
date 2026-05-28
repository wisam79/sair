-- Drop the obsolete 5-parameter overload of update_trip_status to resolve overloading ambiguity
DROP FUNCTION IF EXISTS public.update_trip_status(uuid, text, numeric, numeric, uuid);
