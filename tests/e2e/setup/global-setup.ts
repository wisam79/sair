/**
 * Global Setup for E2E Tests
 *
 * Runs once before all tests
 */

import { TestConfig } from '../helpers/config';

export default async function globalSetup() {
  console.log('[E2E Global Setup] Starting...');

  // Validate environment
  TestConfig.validate();

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn('[E2E] Missing admin credentials - some tests will be skipped');
    return;
  }

  // Verify we can connect
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    if (response.ok) {
      console.log('[E2E Global Setup] Connected to Supabase');
    } else {
      console.warn('[E2E] Failed to connect to Supabase:', response.status);
    }
  } catch (error) {
    console.warn('[E2E] Could not verify Supabase connection:', error);
  }

  console.log('[E2E Global Setup] Complete');
}
