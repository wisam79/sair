/**
 * Global Teardown for E2E Tests
 *
 * Runs once after all tests complete
 */

import { TestConfig } from '../helpers/config';
import { globalCleanup } from './cleanup';

export default async function globalTeardown() {
  console.log('[E2E Global Teardown] Starting...');

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    try {
      await globalCleanup(supabaseUrl, serviceKey);
    } catch (error) {
      console.warn('[E2E] Cleanup warning:', error);
    }
  }

  console.log('[E2E Global Teardown] Complete');
}
