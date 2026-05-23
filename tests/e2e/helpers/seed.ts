/**
 * Test Data Seeding Helper
 *
 * Creates test data with E2E_TEST_ prefix for easy identification and cleanup
 */

import { TestConfig } from './config';
import { getAuthHeaders, type TestUser } from './auth';

export interface TestRoute {
  id: string;
  title: string;
  driver_id: string;
}

export interface TestTrip {
  id: string;
  route_id: string;
  driver_id: string;
  status: string;
}

export interface TestLicense {
  code: string;
  route_id: string;
}

/**
 * Create a test route
 */
export async function createTestRoute(
  supabaseUrl: string,
  adminJwt: string,
  driverId: string,
): Promise<TestRoute> {
  const routeName = `${TestConfig.TEST_PREFIX}Route_${Date.now()}`;

  const response = await fetch(`${supabaseUrl}/rest/v1/routes`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(adminJwt, ''),
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      title: routeName,
      driver_id: driverId,
      start_location: 'Baghdad',
      end_location: 'Erbil',
      price: 10000,
      capacity: 10,
      available_seats: 10,
      is_active: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create test route: ${await response.text()}`);
  }

  const [route] = await response.json();
  return route;
}

/**
 * Create a test trip for a route
 */
export async function createTestTrip(
  supabaseUrl: string,
  adminJwt: string,
  routeId: string,
  driverId: string,
  scheduledAt: string = new Date(Date.now() + 3600000).toISOString(),
): Promise<TestTrip> {
  const response = await fetch(`${supabaseUrl}/rest/v1/trips`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(adminJwt, ''),
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      route_id: routeId,
      driver_id: driverId,
      status: 'scheduled',
      scheduled_at: scheduledAt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create test trip: ${await response.text()}`);
  }

  const [trip] = await response.json();
  return trip;
}

/**
 * Create a license batch and return codes
 */
export async function createTestLicenseBatch(
  supabaseUrl: string,
  adminJwt: string,
  routeId: string,
  quantity: number = 5,
): Promise<string[]> {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_license_batch`, {
    method: 'POST',
    headers: getAuthHeaders(adminJwt, ''),
    body: JSON.stringify({
      p_route_id: routeId,
      p_batch_name: `${TestConfig.TEST_PREFIX}Batch_${Date.now()}`,
      p_quantity: quantity,
      p_price: 10000,
      p_valid_days: 30,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create license batch: ${await response.text()}`);
  }

  const batchId = await response.text();

  // Get the license codes
  const codesResponse = await fetch(
    `${supabaseUrl}/rest/v1/licenses?code=ilike.${TestConfig.TEST_PREFIX}%&limit=${quantity}`,
    { headers: getAuthHeaders(adminJwt, '') },
  );

  if (!codesResponse.ok) {
    throw new Error('Failed to fetch license codes');
  }

  const licenses = await codesResponse.json();
  return licenses.map((l: { code: string }) => l.code);
}

/**
 * Activate a license for a student
 */
export async function activateLicense(
  supabaseUrl: string,
  studentJwt: string,
  licenseCode: string,
): Promise<{ subscription_id: string }> {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/activate_license`, {
    method: 'POST',
    headers: getAuthHeaders(studentJwt, ''),
    body: JSON.stringify({ p_code: licenseCode }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to activate license: ${JSON.stringify(error)}`);
  }

  return { subscription_id: await response.text() };
}

/**
 * Update trip status (for driver)
 */
export async function updateTripStatus(
  supabaseUrl: string,
  driverJwt: string,
  tripId: string,
  newStatus: string,
  idempotencyKey?: string,
): Promise<{ success: boolean; idempotent?: boolean }> {
  const headers: Record<string, string> = {
    ...getAuthHeaders(driverJwt, ''),
    'idempotency-key': idempotencyKey || `e2e_${Date.now()}`,
  };

  const response = await fetch(`${supabaseUrl}/functions/v1/trip-engine`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      trip_id: tripId,
      new_status: newStatus,
    }),
  });

  const data = await response.json();

  return {
    success: response.ok && data.success,
    idempotent: data.idempotent,
  };
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  supabaseUrl: string,
  studentJwt: string,
  subscriptionId: string,
): Promise<{ success: boolean }> {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/cancel_subscription`, {
    method: 'POST',
    headers: getAuthHeaders(studentJwt, ''),
    body: JSON.stringify({ p_subscription_id: subscriptionId }),
  });

  return { success: response.ok };
}

/**
 * Get subscriptions for a student
 */
export async function getStudentSubscriptions(
  supabaseUrl: string,
  studentJwt: string,
): Promise<any[]> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/subscriptions?student_id=eq.{studentId}&select=*`,
    { headers: getAuthHeaders(studentJwt, '') },
  );

  if (!response.ok) return [];
  return response.json();
}
