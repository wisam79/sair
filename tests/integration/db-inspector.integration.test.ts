import { describe, it, expect, beforeAll } from 'vitest';
import {
  createServiceClient,
  createAuthenticatedClient,
  cleanupTestData,
  isDBAvailable,
} from '../helpers/test-helpers';

const runIntegration = isDBAvailable();

describe('Database Schema Inspector & RPC Tester', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  it('should call get_or_create_conversation and verify logic (success, failure, and idempotency)', async () => {
    const serviceClient = createServiceClient();

    // Create student and driver clients
    const student = await createAuthenticatedClient('student');
    const driver = await createAuthenticatedClient('driver');

    let route: any = null;
    let trip: any = null;
    let sub: any = null;

    try {
      // 1. Get the driver record ID
      const { data: driverData } = await serviceClient
        .from('drivers')
        .select('id')
        .eq('user_id', driver.user.id)
        .single();
      const driverId = driverData.id;

      // 2. Create a route
      const { data: routeData, error: routeErr } = await serviceClient
        .from('routes')
        .insert({
          driver_id: driverId,
          title: 'RPC Test Route',
          start_location: 'Start location',
          end_location: 'End location',
          price: 10000,
          capacity: 4,
          available_seats: 4,
          is_active: true,
        })
        .select()
        .single();

      if (routeErr) throw routeErr;
      route = routeData;

      // 3. Create a trip
      const { data: tripData, error: tripErr } = await serviceClient
        .from('trips')
        .insert({
          route_id: route.id,
          driver_id: driverId,
          status: 'scheduled',
          scheduled_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (tripErr) throw tripErr;
      trip = tripData;

      // 4. Try to call get_or_create_conversation as student before subscribing -> should fail
      const { data: failData, error: failErr } = await student.client.rpc(
        'get_or_create_conversation',
        {
          p_trip_id: trip.id,
        },
      );

      expect(failErr).not.toBeNull();
      expect(failErr.message).toMatch(/Student is not subscribed to this trip route/i);
      expect(failData).toBeNull();

      // 5. Create a subscription for the student on this route
      const { data: subData, error: subErr } = await serviceClient
        .from('subscriptions')
        .insert({
          student_id: student.user.id,
          route_id: route.id,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          purchase_price: 10000,
        })
        .select()
        .single();

      if (subErr) throw subErr;
      sub = subData;

      // 6. Call get_or_create_conversation as student after subscribing -> should succeed
      const { data: conv, error: convErr } = await student.client
        .rpc('get_or_create_conversation', {
          p_trip_id: trip.id,
        })
        .single();

      expect(convErr).toBeNull();
      expect(conv).toBeDefined();
      expect(conv.id).toBeDefined();
      expect(typeof conv.id).toBe('string');

      // 7. Call get_or_create_conversation again -> should return same conversation (Idempotency)
      const { data: convSecond, error: convErrSecond } = await student.client
        .rpc('get_or_create_conversation', {
          p_trip_id: trip.id,
        })
        .single();

      expect(convErrSecond).toBeNull();
      expect(convSecond.id).toBe(conv.id);
    } finally {
      // Cleanup
      if (trip) await serviceClient.from('trips').delete().eq('id', trip.id);
      if (sub) await serviceClient.from('subscriptions').delete().eq('id', sub.id);
      if (route) await serviceClient.from('routes').delete().eq('id', route.id);
      await cleanupTestData();
    }
  }, 30000);
});
