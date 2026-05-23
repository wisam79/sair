/**
 * Test Data Cleanup Helper
 *
 * Cleans up all test data created with E2E_TEST_ prefix
 */

import { TestConfig } from '../helpers/config';

interface CleanupStats {
  routesDeleted: number;
  tripsDeleted: number;
  subscriptionsDeleted: number;
  licensesDeleted: number;
}

/**
 * Cleanup all test data (call after tests)
 */
export async function cleanupAllTestData(
  supabaseUrl: string,
  adminJwt: string,
): Promise<CleanupStats> {
  const stats: CleanupStats = {
    routesDeleted: 0,
    tripsDeleted: 0,
    subscriptionsDeleted: 0,
    licensesDeleted: 0,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminJwt}`,
    // Use service role or admin JWT
  };

  // Delete test trips first (foreign key)
  const tripsResponse = await fetch(
    `${supabaseUrl}/rest/v1/trips?title=ilike.${TestConfig.TEST_PREFIX}%&select=id`,
    { headers },
  );
  if (tripsResponse.ok) {
    const trips = await tripsResponse.json();
    for (const trip of trips) {
      await fetch(`${supabaseUrl}/rest/v1/trips/${trip.id}`, {
        method: 'DELETE',
        headers,
      });
      stats.tripsDeleted++;
    }
  }

  // Delete test routes
  const routesResponse = await fetch(
    `${supabaseUrl}/rest/v1/routes?title=ilike.${TestConfig.TEST_PREFIX}%&select=id`,
    { headers },
  );
  if (routesResponse.ok) {
    const routes = await routesResponse.json();
    for (const route of routes) {
      await fetch(`${supabaseUrl}/rest/v1/routes/${route.id}`, {
        method: 'DELETE',
        headers,
      });
      stats.routesDeleted++;
    }
  }

  // Subscriptions are automatically deleted via database CASCADE when routes or users are deleted.
  // We do not run an unfiltered query on the subscriptions table to avoid deleting real production subscriptions.


  // Delete test licenses
  const licensesResponse = await fetch(
    `${supabaseUrl}/rest/v1/licenses?code=ilike.${TestConfig.TEST_PREFIX}%&select=id`,
    { headers },
  );
  if (licensesResponse.ok) {
    const licenses = await licensesResponse.json();
    for (const license of licenses) {
      await fetch(`${supabaseUrl}/rest/v1/licenses/${license.id}`, {
        method: 'DELETE',
        headers,
      });
      stats.licensesDeleted++;
    }
  }

  console.log('[E2E Cleanup] Deleted:', stats);
  return stats;
}

/**
 * Global cleanup - call in afterAll
 */
export async function globalCleanup(supabaseUrl: string, adminJwt: string): Promise<void> {
  try {
    await cleanupAllTestData(supabaseUrl, adminJwt);
    console.log('[E2E] Global cleanup completed');
  } catch (error) {
    console.error('[E2E] Global cleanup failed:', error);
  }
}
