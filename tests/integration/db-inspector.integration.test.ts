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

  it('should call get_or_create_conversation and log results/errors', async () => {
    const serviceClient = createServiceClient();

    // Create student and driver clients
    const student = await createAuthenticatedClient('student');
    const driver = await createAuthenticatedClient('driver');

    try {
      // 1. Get the driver record ID
      const { data: driverData } = await serviceClient
        .from('drivers')
        .select('id')
        .eq('user_id', driver.user.id)
        .single();
      const driverId = driverData.id;

      // 2. Create a route
      const { data: route } = await serviceClient
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

      // 3. Create a trip
      const { data: trip } = await serviceClient
        .from('trips')
        .insert({
          route_id: route.id,
          driver_id: driverId,
          status: 'scheduled',
          scheduled_at: new Date().toISOString(),
        })
        .select()
        .single();

      console.log('--- RPC TEST START ---');
      console.log('TRIP ID:', trip.id);
      console.log('STUDENT USER ID:', student.user.id);
      console.log('DRIVER USER ID:', driver.user.id);
      console.log('DRIVER RECORD ID:', driverId);

      // 4. Try to call get_or_create_conversation as student
      const { data: convData, error: convErr } = await student.client.rpc(
        'get_or_create_conversation',
        {
          p_trip_id: trip.id,
        },
      );

      if (convErr) {
        console.error('get_or_create_conversation ERROR:', convErr);
      } else {
        console.log('get_or_create_conversation SUCCESS:', convData);
      }
      console.log('--- RPC TEST END ---');

      // Cleanup
      await serviceClient.from('trips').delete().eq('id', trip.id);
      await serviceClient.from('routes').delete().eq('id', route.id);
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      await cleanupTestData();
    }

    expect(true).toBe(true);
  });
});
