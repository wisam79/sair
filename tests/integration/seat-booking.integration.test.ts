import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServiceClient, createAuthenticatedClient, cleanupTestData, isDBAvailable } from '../helpers/test-helpers';
import { getTableRow } from '../helpers/db-test-helpers';

const runIntegration = isDBAvailable();

describe('Seat Booking & Subscription Integrity Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let adminClient: any;
  let driverId: string;
  let routeId: string;
  let student1: any;
  let student2: any;

  beforeAll(async () => {
    serviceClient = createServiceClient();

    // Create a test driver user
    const driverResult = await createAuthenticatedClient('driver');
    const { data: driverData } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', driverResult.user.id)
      .single();
    driverId = driverData.id;

    // Create an admin user for batch generation
    const adminResult = await createAuthenticatedClient('admin');
    adminClient = adminResult.client;

    // Create two student users in advance to reuse and avoid rate limiting
    student1 = await createAuthenticatedClient('student');
    student2 = await createAuthenticatedClient('student');

    // Create a test route with capacity 1
    const { data: routeData, error } = await serviceClient
      .from('routes')
      .insert({
        driver_id: driverId,
        title: 'Test Seat Booking Route',
        start_location: 'Point A',
        end_location: 'Point B',
        price: 10000,
        capacity: 1,
        available_seats: 1,
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

  it('should not allow available_seats to drop below 0', async () => {
    // Generate 2 licenses for this route (capacity is 1)
    const { data: batchId } = await adminClient.rpc('create_license_batch', {
      p_route_id: routeId,
      p_batch_name: 'Overbook Test',
      p_quantity: 2,
      p_price: 10000,
      p_valid_days: 30,
    });

    const { data: licenses } = await serviceClient
      .from('licenses')
      .select('code')
      .eq('batch_id', batchId);

    expect(licenses.length).toBe(2);

    // Student 1 activates first license -> should succeed
    const { data: sub1Id, error: err1 } = await student1.client.rpc('activate_license', {
      p_code: licenses[0].code,
    });
    expect(err1).toBeNull();
    expect(sub1Id).toBeDefined();

    // Verify seats is now 0
    const routeMid = await getTableRow('routes', routeId);
    expect(routeMid.available_seats).toBe(0);

    // Student 2 activates second license -> should fail (no seats)
    const { data: sub2Id, error: err2 } = await student2.client.rpc('activate_license', {
      p_code: licenses[1].code,
    });
    expect(err2).not.toBeNull();
    expect(err2.message).toMatch(/No seats available for this route or route is inactive/i);
    expect(sub2Id).toBeNull();

    // Verify seats is still 0 (not negative)
    const routeFinal = await getTableRow('routes', routeId);
    expect(routeFinal.available_seats).toBe(0);

    // Clean up student 1's subscription so we restore the seat
    if (sub1Id) {
      await student1.client.rpc('cancel_subscription', {
        p_subscription_id: sub1Id,
      });
    }
  });

  it('should restore a seat when a subscription is cancelled, and prevent double cancellation seat increment', async () => {
    // Make sure seats are back to 1
    await serviceClient
      .from('routes')
      .update({ available_seats: 1 })
      .eq('id', routeId);

    const student = student1;

    // Create a subscription
    const { data: sub } = await serviceClient
      .from('subscriptions')
      .insert({
        student_id: student.user.id,
        route_id: routeId,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        purchase_price: 10000,
      })
      .select()
      .single();

    // Manually decrement seat to simulate active subscription state
    await serviceClient
      .from('routes')
      .update({ available_seats: 0 })
      .eq('id', routeId);

    // Cancel subscription
    const { error: cancelErr } = await student.client.rpc('cancel_subscription', {
      p_subscription_id: sub.id,
    });

    expect(cancelErr).toBeNull();

    // Verify subscription status is cancelled
    const subAfter = await getTableRow('subscriptions', sub.id);
    expect(subAfter.status).toBe('cancelled');

    // Verify seat is restored to 1
    const routeAfter = await getTableRow('routes', routeId);
    expect(routeAfter.available_seats).toBe(1);

    // Attempt second cancellation (should throw error and NOT increment seat again)
    const { error: cancelErr2 } = await student.client.rpc('cancel_subscription', {
      p_subscription_id: sub.id,
    });

    expect(cancelErr2).not.toBeNull();
    expect(cancelErr2.message).toMatch(/Cannot cancel subscription in cancelled state/i);

    // Seat should still be 1 (not 2, which would exceed capacity)
    const routeAfterDouble = await getTableRow('routes', routeId);
    expect(routeAfterDouble.available_seats).toBe(1);
  });

  it('should handle complete_payment_and_activate_subscription atomically and prevent duplicate subscriptions', async () => {
    // Reset seat to 1
    await serviceClient
      .from('routes')
      .update({ available_seats: 1 })
      .eq('id', routeId);

    const student = student1;
    const orderId1 = `order_test_${Math.random().toString(36).substring(2, 8)}`;

    // Create pending payment
    const { data: payment1, error: payErr1 } = await serviceClient
      .from('payments')
      .insert({
        user_id: student.user.id,
        route_id: routeId,
        amount: 10000,
        zaincash_order_id: orderId1,
        status: 'pending',
      })
      .select()
      .single();

    expect(payErr1).toBeNull();

    // Activate subscription via complete_payment_and_activate_subscription
    const { data: activatedPayment, error: actErr } = await serviceClient.rpc(
      'complete_payment_and_activate_subscription',
      {
        p_zaincash_order_id: orderId1,
      }
    );

    expect(actErr).toBeNull();
    expect(activatedPayment.status).toBe('completed');

    // Verify seat is decremented to 0
    const routeAfterPay = await getTableRow('routes', routeId);
    expect(routeAfterPay.available_seats).toBe(0);

    // Create another pending payment for same route (duplicate booking attempt)
    const orderId2 = `order_test_${Math.random().toString(36).substring(2, 8)}`;
    const { data: payment2 } = await serviceClient
      .from('payments')
      .insert({
        user_id: student.user.id,
        route_id: routeId,
        amount: 10000,
        zaincash_order_id: orderId2,
        status: 'pending',
      })
      .select()
      .single();

    // Call complete_payment_and_activate_subscription for duplicate
    const { data: duplicatePaymentResult, error: dupErr } = await serviceClient.rpc(
      'complete_payment_and_activate_subscription',
      {
        p_zaincash_order_id: orderId2,
      }
    );

    // It should NOT throw an error but mark the payment as failed and return it
    expect(dupErr).toBeNull();
    expect(duplicatePaymentResult.status).toBe('failed');

    // Available seats remains 0
    const routeFinal = await getTableRow('routes', routeId);
    expect(routeFinal.available_seats).toBe(0);
  });
});
