import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServiceClient, createAuthenticatedClient, cleanupTestData, isDBAvailable } from '../helpers/test-helpers';
import { createClient } from '@supabase/supabase-js';

const runIntegration = isDBAvailable();

describe('Row Level Security (RLS) Policies Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let anonClient: any;
  
  let studentA: any;
  let studentB: any;
  let driverA: any;
  let driverB: any;
  let admin: any;

  let driverAId: string;
  let driverBId: string;

  beforeAll(async () => {
    serviceClient = createServiceClient();
    
    // Create anon client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpcvvyxtmxzplmojobbv.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    anonClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Create test accounts
    studentA = await createAuthenticatedClient('student');
    studentB = await createAuthenticatedClient('student');
    driverA = await createAuthenticatedClient('driver');
    driverB = await createAuthenticatedClient('driver');
    admin = await createAuthenticatedClient('admin');

    // Get the driver IDs
    const { data: driverAData } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', driverA.user.id)
      .single();
    driverAId = driverAData.id;

    const { data: driverBData } = await serviceClient
      .from('drivers')
      .select('id')
      .eq('user_id', driverB.user.id)
      .single();
    driverBId = driverBData.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('profiles RLS Policies', () => {
    it('should allow users to select their own profile and deny selecting others', async () => {
      // Student A views own profile -> allowed
      const { data: ownProfile, error: ownErr } = await studentA.client
        .from('profiles')
        .select('*')
        .eq('id', studentA.user.id)
        .single();
      expect(ownErr).toBeNull();
      expect(ownProfile).not.toBeNull();
      expect(ownProfile.id).toBe(studentA.user.id);

      // Student A views Student B's profile -> denied (returns no data or fails RLS filter)
      const { data: otherProfile, error: otherErr } = await studentA.client
        .from('profiles')
        .select('*')
        .eq('id', studentB.user.id)
        .maybeSingle();
      expect(otherErr).toBeNull();
      expect(otherProfile).toBeNull();
    });

    it('should allow admins to view all profiles', async () => {
      const { data: profile, error } = await admin.client
        .from('profiles')
        .select('*')
        .eq('id', studentA.user.id)
        .single();
      expect(error).toBeNull();
      expect(profile).not.toBeNull();
    });

    it('should prevent anonymous users from viewing profiles', async () => {
      const { data: profile, error } = await anonClient
        .from('profiles')
        .select('*')
        .eq('id', studentA.user.id)
        .maybeSingle();
      expect(error).toBeNull();
      expect(profile).toBeNull();
    });

    it('should prevent students from escalating their own role', async () => {
      const { error } = await studentA.client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', studentA.user.id);
      
      // The update should either fail or not change the role due to RLS/Trigger constraints
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', studentA.user.id)
        .single();
      expect(profile.role).toBe('student');
    });
  });

  describe('routes RLS Policies', () => {
    let routeActive: any;
    let routeInactive: any;

    beforeAll(async () => {
      // Insert one active and one inactive route via service client
      const { data: rActive } = await serviceClient
        .from('routes')
        .insert({
          driver_id: driverAId,
          title: 'Active Route RLS',
          start_location: 'Start A',
          end_location: 'End B',
          price: 15000,
          capacity: 4,
          available_seats: 4,
          is_active: true,
        })
        .select()
        .single();
      routeActive = rActive;

      const { data: rInactive } = await serviceClient
        .from('routes')
        .insert({
          driver_id: driverAId,
          title: 'Inactive Route RLS',
          start_location: 'Start A',
          end_location: 'End B',
          price: 15000,
          capacity: 4,
          available_seats: 4,
          is_active: false,
        })
        .select()
        .single();
      routeInactive = rInactive;
    });

    afterAll(async () => {
      if (routeActive) await serviceClient.from('routes').delete().eq('id', routeActive.id);
      if (routeInactive) await serviceClient.from('routes').delete().eq('id', routeInactive.id);
    });

    it('should allow anon/students to see active routes but not inactive routes', async () => {
      // Anon
      const { data: routesAnon } = await anonClient
        .from('routes')
        .select('*')
        .in('id', [routeActive.id, routeInactive.id]);
      
      expect(routesAnon.map((r: any) => r.id)).toContain(routeActive.id);
      expect(routesAnon.map((r: any) => r.id)).not.toContain(routeInactive.id);

      // Student A
      const { data: routesStudent } = await studentA.client
        .from('routes')
        .select('*')
        .in('id', [routeActive.id, routeInactive.id]);

      expect(routesStudent.map((r: any) => r.id)).toContain(routeActive.id);
      expect(routesStudent.map((r: any) => r.id)).not.toContain(routeInactive.id);
    });

    it('should allow drivers to view their own routes (even if inactive)', async () => {
      const { data: routesDriver } = await driverA.client
        .from('routes')
        .select('*')
        .in('id', [routeActive.id, routeInactive.id]);

      expect(routesDriver.map((r: any) => r.id)).toContain(routeActive.id);
      expect(routesDriver.map((r: any) => r.id)).toContain(routeInactive.id);
    });

    it('should prevent drivers from updating routes of other drivers', async () => {
      const { error } = await driverB.client
        .from('routes')
        .update({ title: 'Hacked Title' })
        .eq('id', routeActive.id);
      
      // Update should not modify the route
      const { data: route } = await serviceClient
        .from('routes')
        .select('title')
        .eq('id', routeActive.id)
        .single();
      expect(route.title).not.toBe('Hacked Title');
    });
  });

  describe('subscriptions RLS Policies', () => {
    let subStudentA: any;
    let routeDriverA: any;

    beforeAll(async () => {
      const { data: route } = await serviceClient
        .from('routes')
        .insert({
          driver_id: driverAId,
          title: 'Sub Route',
          start_location: 'Start A',
          end_location: 'End B',
          price: 15000,
          capacity: 4,
          available_seats: 4,
          is_active: true,
        })
        .select()
        .single();
      routeDriverA = route;

      const { data: sub } = await serviceClient
        .from('subscriptions')
        .insert({
          student_id: studentA.user.id,
          route_id: routeDriverA.id,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          purchase_price: 15000,
        })
        .select()
        .single();
      subStudentA = sub;
    });

    afterAll(async () => {
      if (subStudentA) await serviceClient.from('subscriptions').delete().eq('id', subStudentA.id);
      if (routeDriverA) await serviceClient.from('routes').delete().eq('id', routeDriverA.id);
    });

    it('should allow student to see own subscription and deny other students', async () => {
      const { data: subA, error: errA } = await studentA.client
        .from('subscriptions')
        .select('*')
        .eq('id', subStudentA.id)
        .maybeSingle();
      expect(errA).toBeNull();
      expect(subA).not.toBeNull();

      const { data: subB, error: errB } = await studentB.client
        .from('subscriptions')
        .select('*')
        .eq('id', subStudentA.id)
        .maybeSingle();
      expect(errB).toBeNull();
      expect(subB).toBeNull();
    });

    it('should allow driver A to see subscriptions for their own route, but deny driver B', async () => {
      const { data: subDriverA } = await driverA.client
        .from('subscriptions')
        .select('*')
        .eq('id', subStudentA.id)
        .maybeSingle();
      expect(subDriverA).not.toBeNull();

      const { data: subDriverB } = await driverB.client
        .from('subscriptions')
        .select('*')
        .eq('id', subStudentA.id)
        .maybeSingle();
      expect(subDriverB).toBeNull();
    });
  });

  describe('trips RLS Policies', () => {
    let tripDriverA: any;
    let routeA: any;
    let subStudentA: any;

    beforeAll(async () => {
      const { data: route } = await serviceClient
        .from('routes')
        .insert({
          driver_id: driverAId,
          title: 'Trip Route',
          start_location: 'Start A',
          end_location: 'End B',
          price: 15000,
          capacity: 4,
          available_seats: 4,
          is_active: true,
        })
        .select()
        .single();
      routeA = route;

      const { data: trip } = await serviceClient
        .from('trips')
        .insert({
          route_id: routeA.id,
          driver_id: driverAId,
          status: 'scheduled',
          scheduled_at: new Date().toISOString(),
        })
        .select()
        .single();
      tripDriverA = trip;

      // Subscribe studentA to routeA to let them see the trip
      const { data: sub } = await serviceClient
        .from('subscriptions')
        .insert({
          student_id: studentA.user.id,
          route_id: routeA.id,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          purchase_price: 15000,
        })
        .select()
        .single();
      subStudentA = sub;
    });

    afterAll(async () => {
      if (subStudentA) await serviceClient.from('subscriptions').delete().eq('id', subStudentA.id);
      if (tripDriverA) await serviceClient.from('trips').delete().eq('id', tripDriverA.id);
      if (routeA) await serviceClient.from('routes').delete().eq('id', routeA.id);
    });

    it('should allow subscribed students to view the trip and deny unsubscribed students', async () => {
      const { data: tripA } = await studentA.client
        .from('trips')
        .select('*')
        .eq('id', tripDriverA.id)
        .maybeSingle();
      expect(tripA).not.toBeNull();

      const { data: tripB } = await studentB.client
        .from('trips')
        .select('*')
        .eq('id', tripDriverA.id)
        .maybeSingle();
      expect(tripB).toBeNull();
    });

    it('should allow driver A to see own trip, but deny driver B', async () => {
      const { data: tripDrvA } = await driverA.client
        .from('trips')
        .select('*')
        .eq('id', tripDriverA.id)
        .maybeSingle();
      expect(tripDrvA).not.toBeNull();

      const { data: tripDrvB } = await driverB.client
        .from('trips')
        .select('*')
        .eq('id', tripDriverA.id)
        .maybeSingle();
      expect(tripDrvB).toBeNull();
    });
  });

  describe('audit_logs RLS Policies', () => {
    it('should deny non-admins from selecting audit logs', async () => {
      const { data: studentLogs } = await studentA.client
        .from('audit_logs')
        .select('*');
      expect(studentLogs).toEqual([]);

      const { data: driverLogs } = await driverA.client
        .from('audit_logs')
        .select('*');
      expect(driverLogs).toEqual([]);

      const { data: adminLogs, error } = await admin.client
        .from('audit_logs')
        .select('*')
        .limit(5);
      expect(error).toBeNull();
      expect(adminLogs).not.toBeNull();
    });
  });

  describe('licenses & license_batches RLS Policies', () => {
    it('should deny non-admins from selecting licenses and batches', async () => {
      const { data: studentL } = await studentA.client.from('licenses').select('*');
      expect(studentL).toEqual([]);

      const { data: driverBtc } = await driverA.client.from('license_batches').select('*');
      expect(driverBtc).toEqual([]);

      const { data: adminL, error: errL } = await admin.client.from('licenses').select('*').limit(5);
      expect(errL).toBeNull();
      expect(adminL).not.toBeNull();
    });
  });

  describe('payments RLS Policies', () => {
    let paymentA: any;
    let routeA: any;

    beforeAll(async () => {
      const { data: route } = await serviceClient
        .from('routes')
        .insert({
          driver_id: driverAId,
          title: 'Payment Route',
          start_location: 'Start A',
          end_location: 'End B',
          price: 15000,
          capacity: 4,
          available_seats: 4,
          is_active: true,
        })
        .select()
        .single();
      routeA = route;

      const { data: pay } = await serviceClient
        .from('payments')
        .insert({
          user_id: studentA.user.id,
          route_id: routeA.id,
          amount: 15000,
          status: 'pending',
          zaincash_order_id: `test_rls_${Math.random()}`,
        })
        .select()
        .single();
      paymentA = pay;
    });

    afterAll(async () => {
      if (paymentA) await serviceClient.from('payments').delete().eq('id', paymentA.id);
      if (routeA) await serviceClient.from('routes').delete().eq('id', routeA.id);
    });

    it('should allow student to see own payments but deny other students/drivers', async () => {
      const { data: payA } = await studentA.client
        .from('payments')
        .select('*')
        .eq('id', paymentA.id)
        .maybeSingle();
      expect(payA).not.toBeNull();

      const { data: payB } = await studentB.client
        .from('payments')
        .select('*')
        .eq('id', paymentA.id)
        .maybeSingle();
      expect(payB).toBeNull();

      const { data: payDrv } = await driverA.client
        .from('payments')
        .select('*')
        .eq('id', paymentA.id)
        .maybeSingle();
      expect(payDrv).toBeNull();
    });
  });

  describe('driver_payouts RLS Policies', () => {
    let payoutA: any;

    beforeAll(async () => {
      const { data: pay } = await serviceClient
        .from('driver_payouts')
        .insert({
          driver_id: driverAId,
          amount: 10000,
          status: 'pending',
        })
        .select()
        .single();
      payoutA = pay;
    });

    afterAll(async () => {
      if (payoutA) await serviceClient.from('driver_payouts').delete().eq('id', payoutA.id);
    });

    it('should allow drivers to view their own payouts and deny other drivers/students', async () => {
      const { data: payA } = await driverA.client
        .from('driver_payouts')
        .select('*')
        .eq('id', payoutA.id)
        .maybeSingle();
      expect(payA).not.toBeNull();

      const { data: payB } = await driverB.client
        .from('driver_payouts')
        .select('*')
        .eq('id', payoutA.id)
        .maybeSingle();
      expect(payB).toBeNull();

      const { data: payStudent } = await studentA.client
        .from('driver_payouts')
        .select('*')
        .eq('id', payoutA.id)
        .maybeSingle();
      expect(payStudent).toBeNull();
    });
  });
});
