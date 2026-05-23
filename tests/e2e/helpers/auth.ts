/**
 * Authentication helper for E2E tests
 *
 * Uses Supabase Admin API to create test users and get JWTs
 */

import { TestConfig } from './config';

export interface TestUser {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'driver' | 'admin';
  jwt: string;
}

/**
 * Create a test user with specified role
 * Requires SUPABASE_SERVICE_ROLE_KEY (admin access)
 */
export async function createTestUser(
  supabaseUrl: string,
  adminKey: string,
  role: 'student' | 'driver' | 'admin' = 'student',
): Promise<TestUser> {
  const testEmail = `${TestConfig.TEST_PREFIX}${role}_${Date.now()}@test.sair.com`;
  const testPassword = 'TestPassword123!';

  // Create user via admin API
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: adminKey,
      Authorization: `Bearer ${adminKey}`,
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { role },
      app_metadata: { role }, // app_metadata is what auth uses!
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create test user: ${error}`);
  }

  const userData = await response.json();

  // Get JWT for the user
  const jwtResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: adminKey,
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  if (!jwtResponse.ok) {
    throw new Error('Failed to get JWT for test user');
  }

  const jwtData = await jwtResponse.json();

  return {
    id: userData.id,
    email: testEmail,
    password: testPassword,
    role,
    jwt: jwtData.access_token,
  };
}

/**
 * Clean up test user
 */
export async function deleteTestUser(
  supabaseUrl: string,
  adminKey: string,
  userId: string,
): Promise<void> {
  try {
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        apikey: adminKey,
        Authorization: `Bearer ${adminKey}`,
      },
    });
  } catch (error) {
    console.warn(`Failed to delete test user ${userId}:`, error);
  }
}

/**
 * Get auth headers for a user
 */
export function getAuthHeaders(jwt: string, anonKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: anonKey,
    Authorization: `Bearer ${jwt}`,
  };
}

/**
 * Get anon headers (for testing auth rejection)
 */
export function getAnonHeaders(anonKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };
}
