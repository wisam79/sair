import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createServiceClient,
  createAuthenticatedClient,
  cleanupTestData,
  isDBAvailable,
} from '../helpers/test-helpers';
import { getTableRow } from '../helpers/db-test-helpers';

const runIntegration = isDBAvailable();

describe('Database Concurrency & Locking Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let adminClient: any;
  let driverClient: any;
  let driverId: string;
  let driverUser: any;
  let routeId: string;
  let students: any[] = [];

  beforeAll(async () => {
    serviceClient = createServiceClient();

    // Create a test driver user
    const driverResult = await createAuthenticatedClient('driver');
    driverClient = driverResult.client;
    driverUser = driverResult.user;
    const { data: driverData } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', driverResult.user.id)
      .single();
    driverId = driverData.id;

    // Create an admin user for batch generation
    const adminResult = await createAuthenticatedClient('admin');
    adminClient = adminResult.client;

    // Create 5 student clients in advance to reuse and avoid auth rate limiting
    students = await Promise.all([
      createAuthenticatedClient('student'),
      createAuthenticatedClient('student'),
      createAuthenticatedClient('student'),
      createAuthenticatedClient('student'),
      createAuthenticatedClient('student'),
    ]);

    // Create a test route with capacity 5
    const { data: routeData, error } = await serviceClient
      .from('routes')
      .insert({
        driver_id: driverId,
        title: 'Concurrency Test Route',
        start_location: 'Point A',
        end_location: 'Point B',
        price: 5000,
        capacity: 5,
        available_seats: 5,
        is_active: true,
      })
      .select()
      .single();

    if (error || !routeData) {
      throw new Error(`Failed to set up test route: ${error?.message}`);
    }
    routeId = routeData.id;
  });

  afterAll(async () => {
    if (routeId) {
      await serviceClient.from('routes').delete().eq('id', routeId);
    }
    await cleanupTestData();
  });

  it('should enforce concurrency: only one client succeeds when activating the same license code concurrently', async () => {
    // Generate 1 license code
    const { data: batchId } = await adminClient.rpc('create_license_batch', {
      p_route_id: routeId,
      p_batch_name: 'Concurrent License Test',
      p_quantity: 1,
      p_price: 5000,
      p_valid_days: 30,
    });

    const { data: lic } = await serviceClient
      .from('licenses')
      .select('code')
      .eq('batch_id', batchId)
      .single();

    const licenseCode = lic.code;

    // Send 5 activation requests concurrently
    const promises = students.map((student) =>
      student.client.rpc('activate_license', {
        p_code: licenseCode,
      }),
    );

    const results = await Promise.all(promises);

    // Filter results
    const successes = results.filter((res) => res.error === null);
    const failures = results.filter((res) => res.error !== null);

    // Verify exactly 1 succeeded and 4 failed
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(4);

    // Verify error messages for failures
    for (const fail of failures) {
      expect(fail.error?.message).toMatch(
        /Invalid or already used license code|could not obtain lock on row/i,
      );
    }
  });

  it('should enforce concurrency: only one client succeeds when reserving the last seat concurrently', async () => {
    // Clean up subscriptions from first test
    await serviceClient.from('subscriptions').delete().eq('route_id', routeId);

    // Modify route available seats to 1
    await serviceClient.from('routes').update({ available_seats: 1 }).eq('id', routeId);

    // Create 5 licenses for this route
    const { data: batchId } = await adminClient.rpc('create_license_batch', {
      p_route_id: routeId,
      p_batch_name: 'Concurrent Seat Test',
      p_quantity: 5,
      p_price: 5000,
      p_valid_days: 30,
    });

    const { data: licenses } = await serviceClient
      .from('licenses')
      .select('code')
      .eq('batch_id', batchId);

    // Send 5 activation requests (each student with their own unique valid code) concurrently
    const promises = students.map((student, idx) =>
      student.client.rpc('activate_license', {
        p_code: licenses[idx].code,
      }),
    );

    const results = await Promise.all(promises);

    const successes = results.filter((res) => res.error === null);
    const failures = results.filter((res) => res.error !== null);

    // Exactly 1 student should get the seat, 4 should fail due to no seats
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(4);

    for (const fail of failures) {
      expect(fail.error?.message).toMatch(
        /No seats available for this route or route is inactive/i,
      );
    }

    // Verify final seats is 0
    const route = await getTableRow('routes', routeId);
    expect(route.available_seats).toBe(0);
  });

  it('should enforce concurrency: prevent double-spending payout requests', async () => {
    // Create another route for this driver to earn balance
    const { data: route } = await serviceClient
      .from('routes')
      .insert({
        driver_id: driverId,
        title: 'Driver Payout Route',
        start_location: 'A',
        end_location: 'B',
        price: 20000,
        capacity: 4,
        available_seats: 4,
        is_active: true,
      })
      .select()
      .single();

    // Insert active subscription to route to give the driver 20,000 balance
    const student = students[0];
    await serviceClient.from('subscriptions').insert({
      student_id: student.user.id,
      route_id: route.id,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      purchase_price: 20000,
    });

    // Request two payouts of 15,000 concurrently (Total requested: 30,000, Driver balance: 20,000)
    // Only one request should succeed; the other should fail due to balance check.
    const promises = [
      driverClient.rpc('request_payout', { p_amount: 15000 }),
      driverClient.rpc('request_payout', { p_amount: 15000 }),
    ];

    const results = await Promise.all(promises);

    const successes = results.filter((res) => res.error === null);
    const failures = results.filter((res) => res.error !== null);

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1);
    expect(failures[0].error?.message).toMatch(
      /Requested amount exceeds available balance|could not obtain lock on row/i,
    );

    // Cleanup route
    await serviceClient.from('routes').delete().eq('id', route.id);
  });
});
