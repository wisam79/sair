-- UniRide Pre-Launch Data Cleanup
-- This migration removes all test/operational data while preserving
-- structural configurations (institutions, routes, driver_profiles, profiles)

TRUNCATE TABLE 
  audit_logs,
  push_tokens,
  conversations,
  messages,
  ratings,
  trips,
  subscriptions,
  licenses,
  license_batches,
  payments
RESTART IDENTITY CASCADE;

-- Reset all routes seats back to their maximum capacity
UPDATE routes SET available_seats = capacity;
