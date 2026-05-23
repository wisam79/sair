import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createServiceClient,
  createAuthenticatedClient,
  cleanupTestData,
  isDBAvailable,
} from '../helpers/test-helpers';
import { getTableRow } from '../helpers/db-test-helpers';

const runIntegration = isDBAvailable();

describe('Payout System Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let adminClient: any;
  let driverClient: any;
  let driverUser: any;
  let driverId: string;
  let routeId: string;
  let student1: any;
  let student2: any;

  beforeAll(async () => {
    serviceClient = createServiceClient();

    // Create a test driver user
    const driverResult = await createAuthenticatedClient('driver');
    driverClient = driverResult.client;
    driverUser = driverResult.user;

    const { data: driverData } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', driverUser.id)
      .single();
    driverId = driverData.id;

    // Create an admin user
    const adminResult = await createAuthenticatedClient('admin');
    adminClient = adminResult.client;

    // Create two student users in advance to reuse and avoid rate limiting
    student1 = await createAuthenticatedClient('student');
    student2 = await createAuthenticatedClient('student');

    // Create a test route
    const { data: routeData, error } = await serviceClient
      .from('routes')
      .insert({
        driver_id: driverId,
        title: 'Payout System Route',
        start_location: 'Point A',
        end_location: 'Point B',
        price: 25000,
        capacity: 4,
        available_seats: 4,
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

  it('should calculate driver balance correctly using purchase_price of active/expired subscriptions', async () => {
    // 1. Create one active subscription (snapshot price 25,000)
    const { data: sub1 } = await serviceClient
      .from('subscriptions')
      .insert({
        student_id: student1.user.id,
        route_id: routeId,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        purchase_price: 25000,
      })
      .select()
      .single();

    // 2. Create one expired subscription (snapshot price 20,000)
    const { data: sub2 } = await serviceClient
      .from('subscriptions')
      .insert({
        student_id: student2.user.id,
        route_id: routeId,
        status: 'expired',
        start_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        purchase_price: 20000,
      })
      .select()
      .single();

    // 3. Create one cancelled subscription (should be ignored)
    await serviceClient.from('subscriptions').insert({
      student_id: student1.user.id,
      route_id: routeId,
      status: 'cancelled',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      purchase_price: 25000,
    });

    // 4. Query balance via driverClient
    const { data: balanceData, error } = await driverClient.rpc('get_driver_balance');
    expect(error).toBeNull();
    expect(balanceData.length).toBe(1);

    // total_earned = 25,000 (sub1) + 20,000 (sub2) = 45,000
    expect(Number(balanceData[0].total_earned)).toBe(45000);
    expect(Number(balanceData[0].total_paid)).toBe(0);
    expect(Number(balanceData[0].available_balance)).toBe(45000);

    // Cleanup subscriptions
    await serviceClient.from('subscriptions').delete().eq('route_id', routeId);
  });

  it('should request and manage payout requests correctly', async () => {
    // 1. Give the driver 30,000 balance
    const student = student1;
    await serviceClient.from('subscriptions').insert({
      student_id: student.user.id,
      route_id: routeId,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      purchase_price: 30000,
    });

    // Verify balance
    const { data: initialBalance } = await driverClient.rpc('get_driver_balance');
    expect(Number(initialBalance[0].available_balance)).toBe(30000);

    // 2. Reject payout requested by non-driver
    const { error: nonDriverErr } = await student.client.rpc('request_payout', {
      p_amount: 10000,
    });
    expect(nonDriverErr).not.toBeNull();
    expect(nonDriverErr.message).toMatch(/Only drivers can request payouts/i);

    // 3. Reject negative payout amount
    const { error: negErr } = await driverClient.rpc('request_payout', {
      p_amount: -5000,
    });
    expect(negErr).not.toBeNull();
    expect(negErr.message).toMatch(/Amount must be greater than zero/i);

    // 4. Reject payout exceeding balance
    const { error: excErr } = await driverClient.rpc('request_payout', {
      p_amount: 35000,
    });
    expect(excErr).not.toBeNull();
    expect(excErr.message).toMatch(/Requested amount exceeds available balance/i);

    // 5. Allow valid payout request
    const { error: reqErr } = await driverClient.rpc('request_payout', {
      p_amount: 10000,
    });
    expect(reqErr).toBeNull();

    // Verify payout record exists with 'pending' status
    const { data: payouts } = await serviceClient
      .from('driver_payouts')
      .select('*')
      .eq('driver_id', driverId);

    expect(payouts.length).toBe(1);
    expect(payouts[0].status).toBe('pending');
    expect(Number(payouts[0].amount)).toBe(10000);

    const payoutId = payouts[0].id;

    // Verify updated balance (available_balance decreases because pending is counted as paid in request balance check)
    // Wait, in request_payout, v_paid is sum of status completed/pending.
    // In get_driver_balance(), wait, let's see: get_driver_balance() returns:
    // available_balance = total_earned - total_paid (completed payouts)
    // Wait, in request_payout, v_paid is completed and pending! So let's check what get_driver_balance() returns now:
    const { data: midBalance } = await driverClient.rpc('get_driver_balance');

    // In 2026052104_fix_critical_bugs_audit.sql, get_driver_balance() has:
    // v_paid is status completed or pending
    // So available_balance = v_earned - v_paid (completed + pending) = 30000 - 10000 = 20000
    expect(Number(midBalance[0].available_balance)).toBe(20000);

    // 6. Non-admin cannot update payout status
    const { error: updateNonAdminErr } = await driverClient.rpc('update_payout_status', {
      p_payout_id: payoutId,
      p_new_status: 'completed',
    });
    expect(updateNonAdminErr).not.toBeNull();
    expect(updateNonAdminErr.message).toMatch(/Unauthorized: admin only/i);

    // 7. Admin updates payout status to completed
    const { data: updateRes, error: updateErr } = await adminClient.rpc('update_payout_status', {
      p_payout_id: payoutId,
      p_new_status: 'completed',
    });
    expect(updateErr).toBeNull();
    expect(updateRes.status).toBe('completed');

    // Verify payout in DB is completed
    const payoutAfter = await getTableRow('driver_payouts', payoutId);
    expect(payoutAfter.status).toBe('completed');

    // 8. Cannot update completed payout
    const { error: reUpdateErr } = await adminClient.rpc('update_payout_status', {
      p_payout_id: payoutId,
      p_new_status: 'rejected',
    });
    expect(reUpdateErr).not.toBeNull();
    expect(reUpdateErr.message).toMatch(/Cannot update payout with status/i);

    // Cleanup subscriptions and payouts
    await serviceClient.from('subscriptions').delete().eq('route_id', routeId);
    await serviceClient.from('driver_payouts').delete().eq('driver_id', driverId);
  });
});
