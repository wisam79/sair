-- Fix the default value of the status column in the licenses table
-- to align with the new licenses_status_check constraint ('available' instead of 'active').
ALTER TABLE public.licenses ALTER COLUMN status SET DEFAULT 'available';
