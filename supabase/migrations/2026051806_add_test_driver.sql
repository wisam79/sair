-- UniRide: Add Test Driver and Institution for Verification
-- Migration: 2026051806_add_test_driver.sql

DO $$
DECLARE
    v_institution_id UUID;
    v_admin_id UUID;
BEGIN
    -- 1. Create a Test Institution
    INSERT INTO institutions (name, city)
    VALUES ('جامعة بغداد - الجادرية', 'بغداد')
    ON CONFLICT (name) DO UPDATE SET city = EXCLUDED.city
    RETURNING id INTO v_institution_id;

    -- 2. Find our Admin (Wisam)
    SELECT id INTO v_admin_id FROM auth.users WHERE email = 'wisamsamir78@gmail.com';

    -- 3. If Admin exists, make sure he has a driver profile for testing if needed
    -- But better create a separate driver record associated with the admin for a quick test
    -- Or just ensure we can at least see the table is working.
    
    -- Let's create a "Ghost Driver" entry tied to the admin user just for UI verification
    IF v_admin_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM drivers WHERE user_id = v_admin_id) THEN
            INSERT INTO drivers (user_id, license_number, vehicle_model, vehicle_plate, capacity)
            VALUES (v_admin_id, 'TEST-12345', 'Toyota Coaster', 'BAG-9900', 25);
        END IF;
    END IF;

END $$;
