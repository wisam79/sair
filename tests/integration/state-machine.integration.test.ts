import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createServiceClient,
  createAuthenticatedClient,
  cleanupTestData,
  isDBAvailable,
} from '../helpers/test-helpers';
import { getTableRow } from '../helpers/db-test-helpers';
import { TripStatus } from '../../packages/core/index';

const runIntegration = isDBAvailable();

describe('Trip State Machine Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let driverUser: any;
  let driverId: string;
  let routeId: string;

  beforeAll(async () => {
    serviceClient = createServiceClient();

    // Create a test driver user and get their driver ID
    const authResult = await createAuthenticatedClient('driver');
    driverUser = authResult.user;

    const { data: driverData, error: driverErr } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', driverUser.id)
      .single();

    if (driverErr || !driverData) {
      throw new Error(`Failed to fetch test driver ID: ${driverErr?.message}`);
    }
    driverId = driverData.id;

    // Create a test route
    const { data: routeData, error: routeErr } = await serviceClient
      .from('routes')
      .insert({
        driver_id: driverId,
        title: 'Test State Machine Route',
        start_location: 'Start Point',
        end_location: 'End Point',
        price: 3000,
        capacity: 4,
        available_seats: 4,
        is_active: true,
      })
      .select()
      .single();

    if (routeErr || !routeData) {
      throw new Error(`Failed to create test route: ${routeErr?.message}`);
    }
    routeId = routeData.id;
  });

  afterAll(async () => {
    if (routeId) {
      await serviceClient.from('routes').delete().eq('id', routeId);
    }
    await cleanupTestData();
  });

  async function createTestTrip(initialStatus: TripStatus): Promise<string> {
    const { data, error } = await serviceClient
      .from('trips')
      .insert({
        route_id: routeId,
        driver_id: driverId,
        status: initialStatus,
        scheduled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  const allStatuses: TripStatus[] = [
    'scheduled',
    'driver_waiting',
    'in_transit',
    'completed',
    'absent',
    'cancelled',
  ];

  const validTransitions: Record<TripStatus, TripStatus[]> = {
    scheduled: ['driver_waiting', 'absent', 'cancelled'],
    driver_waiting: ['in_transit', 'absent', 'cancelled'],
    in_transit: ['completed', 'cancelled'],
    completed: [],
    absent: ['cancelled'],
    cancelled: [],
  };

  for (const fromStatus of allStatuses) {
    for (const toStatus of allStatuses) {
      const isValid = validTransitions[fromStatus].includes(toStatus);

      it(`Transition from "${fromStatus}" to "${toStatus}" should be ${isValid ? 'ALLOWED' : 'REJECTED'}`, async () => {
        const tripId = await createTestTrip(fromStatus);

        const { error } = await serviceClient.rpc('update_trip_status', {
          p_trip_id: tripId,
          p_new_status: toStatus,
          p_lat: 33.3,
          p_lng: 44.4,
          p_driver_id: driverId,
        });

        if (isValid) {
          expect(error).toBeNull();
          const trip = await getTableRow('trips', tripId);
          expect(trip.status).toBe(toStatus);

          if (toStatus === 'in_transit' && fromStatus === 'driver_waiting') {
            expect(trip.started_at).not.toBeNull();
          }
          if (['completed', 'cancelled', 'absent'].includes(toStatus)) {
            expect(trip.ended_at).not.toBeNull();
          }
        } else {
          expect(error).not.toBeNull();
          expect(error.message).toMatch(/Invalid transition/i);
          const trip = await getTableRow('trips', tripId);
          expect(trip.status).toBe(fromStatus);
        }

        await serviceClient.from('trips').delete().eq('id', tripId);
      });
    }
  }

  it('should reject transition if the driver is not the assigned driver', async () => {
    const otherAuthResult = await createAuthenticatedClient('driver');
    const { data: otherDriver } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', otherAuthResult.user.id)
      .single();

    const tripId = await createTestTrip('scheduled');

    const { error } = await serviceClient.rpc('update_trip_status', {
      p_trip_id: tripId,
      p_new_status: 'driver_waiting',
      p_lat: 33.3,
      p_lng: 44.4,
      p_driver_id: otherDriver.id,
    });

    expect(error).not.toBeNull();
    expect(error.message).toMatch(/Not authorized to update this trip/i);

    await serviceClient.from('trips').delete().eq('id', tripId);
  });
});
