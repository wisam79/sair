-- Drop the slow_queries view from the public schema because it is defined as SECURITY DEFINER
-- and exposed via PostgREST, posing a security vulnerability.
DROP VIEW IF EXISTS public.slow_queries;
