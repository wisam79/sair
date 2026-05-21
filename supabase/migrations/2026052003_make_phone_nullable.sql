-- Migration: 2026052003_make_phone_nullable.sql
-- Description: Make the profiles.phone column nullable to allow user registration without phone metadata, avoiding unique constraint violations on empty strings.

-- 1. Alter profiles.phone to drop NOT NULL constraint
ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;

-- 2. Update the handle_new_user trigger function to insert NULL instead of an empty string when phone is not provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone', -- Nullable field (defaults to NULL, allowing multiple NULLs in unique index)
    COALESCE(NEW.raw_app_meta_data->>'role', 'student'),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
