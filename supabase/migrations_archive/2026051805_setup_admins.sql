-- UniRide: Setup Primary Admins
-- Migration: 2026051805_setup_admins.sql

-- 1. Setup Admin: wisamsamir78@gmail.com
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb), 
    '{role}', 
    '"admin"'
)
WHERE email = 'wisamsamir78@gmail.com';

INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
SELECT id, 'Wisam Samir', '07000000001', 'admin', true
FROM auth.users
WHERE email = 'wisamsamir78@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    phone = '07000000001',
    is_verified = true;

-- 2. Setup Admin: admin@uniride.com
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb), 
    '{role}', 
    '"admin"'
)
WHERE email = 'admin@uniride.com';

INSERT INTO public.profiles (id, full_name, phone, role, is_verified)
SELECT id, 'System Admin', '07000000002', 'admin', true
FROM auth.users
WHERE email = 'admin@uniride.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    phone = '07000000002',
    is_verified = true;
