-- UniRide: Cleanup Seed Data
-- Migration: 2026051803_cleanup_seed_data.sql
-- This migration removes all non-system data to prepare for a fresh start.

DO $$
BEGIN
    -- 1. Disable triggers to speed up and avoid side effects
    SET session_replication_role = 'replica';

    -- 2. Truncate tables with foreign key constraints (excluding profiles to protect admin)
    TRUNCATE TABLE 
        audit_logs,
        rate_limits,
        ratings,
        subscriptions,
        trips,
        licenses,
        license_batches,
        push_tokens,
        routes,
        drivers,
        institutions
    RESTART IDENTITY CASCADE;

    -- 3. Safely cleanup profiles: Delete everyone except admins
    DELETE FROM profiles WHERE role != 'admin';

    -- 4. Reset session_replication_role
    SET session_replication_role = 'origin';

    -- 5. Re-seed essential system data (Feature Flags)
    -- These are required for the application logic to function
    INSERT INTO feature_flags (name, enabled, description) VALUES
      ('realtime_tracking',  true,  'Enable real-time GPS tracking for drivers'),
      ('push_notifications', true,  'Enable Expo push notifications'),
      ('offline_mode',       true,  'Enable offline subscription cache'),
      ('ratings_system',     true,  'Enable post-trip ratings'),
      ('zaincash_payment',   false, 'Enable ZainCash payment gateway (requires merchant credentials)')
    ON CONFLICT (name) DO UPDATE SET
      enabled = EXCLUDED.enabled,
      description = EXCLUDED.description;

END $$;
