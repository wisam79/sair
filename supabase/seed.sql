-- ============================================================
-- Sair v2 — Local Development Seed Data
-- ============================================================

-- 1. Create a Test Institution
INSERT INTO public.institutions (id, name, city)
VALUES ('e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a', 'جامعة بغداد - الجادرية', 'بغداد')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, city = EXCLUDED.city;

-- 2. Setup Test Admin: wisamsamir78@gmail.com
-- Deterministic UUID: a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user
)
VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'wisamsamir78@gmail.com',
  -- bcrypt hash for 'password123'
  '$2a$10$Y148gX8bN.DlmUa0MiwBhuL2N6wDmsw6lM03H1j80u1lR.2lM2N.G',
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
  '{"full_name": "Wisam Samir"}'::jsonb,
  NOW(), NOW(), false
)
ON CONFLICT (id) DO UPDATE SET
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW());

-- Ensure Profile matches role & verification status
INSERT INTO public.profiles (id, full_name, phone, role, is_verified, institution_id)
VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Wisam Samir',
  '07000000001',
  'admin',
  true,
  'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  phone = '07000000001',
  is_verified = true,
  institution_id = 'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a';

-- 3. Setup Test Admin: admin@uniride.com
-- Deterministic UUID: b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user
)
VALUES (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@uniride.com',
  -- bcrypt hash for 'password123'
  '$2a$10$Y148gX8bN.DlmUa0MiwBhuL2N6wDmsw6lM03H1j80u1lR.2lM2N.G',
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
  '{"full_name": "System Admin"}'::jsonb,
  NOW(), NOW(), false
)
ON CONFLICT (id) DO UPDATE SET
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW());

-- Ensure Profile matches role & verification status
INSERT INTO public.profiles (id, full_name, phone, role, is_verified, institution_id)
VALUES (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'System Admin',
  '07000000002',
  'admin',
  true,
  'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  phone = '07000000002',
  is_verified = true,
  institution_id = 'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a';

-- 4. Setup Test Driver: driver@uniride.com
-- Deterministic UUID: c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user
)
VALUES (
  'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'driver@uniride.com',
  -- bcrypt hash for 'password123'
  '$2a$10$Y148gX8bN.DlmUa0MiwBhuL2N6wDmsw6lM03H1j80u1lR.2lM2N.G',
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "driver"}'::jsonb,
  '{"full_name": "Test Driver"}'::jsonb,
  NOW(), NOW(), false
)
ON CONFLICT (id) DO UPDATE SET
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW());

-- Ensure Profile matches role & verification status
INSERT INTO public.profiles (id, full_name, phone, role, is_verified, institution_id)
VALUES (
  'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
  'Test Driver',
  '07000000003',
  'driver',
  true,
  'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'driver',
  phone = '07000000003',
  is_verified = true,
  institution_id = 'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a';

-- Setup Driver Profile Entry
INSERT INTO public.drivers (user_id, license_number, vehicle_model, vehicle_plate, capacity, is_verified)
VALUES (
  'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
  'DRV-TEST-999',
  'Toyota Coaster',
  'BAG-9900',
  25,
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  license_number = EXCLUDED.license_number,
  vehicle_model = EXCLUDED.vehicle_model,
  vehicle_plate = EXCLUDED.vehicle_plate,
  capacity = EXCLUDED.capacity,
  is_verified = EXCLUDED.is_verified;

-- Also let's tie a Ghost Driver entry to Wisam Admin for backward compatibility with older tests
INSERT INTO public.drivers (user_id, license_number, vehicle_model, vehicle_plate, capacity, is_verified)
VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'TEST-12345',
  'Toyota Coaster',
  'BAG-9900',
  25,
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  license_number = EXCLUDED.license_number,
  vehicle_model = EXCLUDED.vehicle_model,
  vehicle_plate = EXCLUDED.vehicle_plate,
  capacity = EXCLUDED.capacity,
  is_verified = EXCLUDED.is_verified;

-- 5. Setup Test Student: student@uniride.com
-- Deterministic UUID: d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user
)
VALUES (
  'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'student@uniride.com',
  -- bcrypt hash for 'password123'
  '$2a$10$Y148gX8bN.DlmUa0MiwBhuL2N6wDmsw6lM03H1j80u1lR.2lM2N.G',
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "student"}'::jsonb,
  '{"full_name": "Test Student"}'::jsonb,
  NOW(), NOW(), false
)
ON CONFLICT (id) DO UPDATE SET
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW());

-- Ensure Profile matches role & verification status
INSERT INTO public.profiles (id, full_name, phone, role, is_verified, institution_id)
VALUES (
  'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
  'Test Student',
  '07000000004',
  'student',
  true,
  'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'student',
  phone = '07000000004',
  is_verified = true,
  institution_id = 'e3fe8338-7690-4a81-9b1d-c0fb9b09ef0a';
