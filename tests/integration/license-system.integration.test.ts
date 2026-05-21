import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServiceClient, createAuthenticatedClient, cleanupTestData, isDBAvailable } from '../helpers/test-helpers';
import { getTableRow } from '../helpers/db-test-helpers';

const runIntegration = isDBAvailable();

describe('License System Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let adminClient: any;
  let driverId: string;
  let routeId: string;
  let studentClient: any;
  let studentUser: any;

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

    // Create an admin user to manage batches
    const adminResult = await createAuthenticatedClient('admin');
    adminClient = adminResult.client;

    // Create a student user in advance to reuse and avoid rate limiting
    const studentResult = await createAuthenticatedClient('student');
    studentClient = studentResult.client;
    studentUser = studentResult.user;

    // Create a test route
    const { data: routeData, error } = await serviceClient
      .from('routes')
      .insert({
        driver_id: driverId,
        title: 'Test License Route',
        start_location: 'Point A',
        end_location: 'Point B',
        price: 15000,
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

  describe('create_license_batch', () => {
    it('should reject batch creation by non-admin users', async () => {
      const { error } = await studentClient.rpc('create_license_batch', {
        p_route_id: routeId,
        p_batch_name: 'Hack Batch',
        p_quantity: 3,
        p_price: 15000,
        p_valid_days: 30,
      });

      expect(error).not.toBeNull();
      expect(error.message).toMatch(/Only admins can create license batches/i);
    });

    it('should allow admin to create a batch, generating 8-character codes', async () => {
      const { data: batchId, error } = await adminClient.rpc('create_license_batch', {
        p_route_id: routeId,
        p_batch_name: 'Summer Promo',
        p_quantity: 3,
        p_price: 15000,
        p_valid_days: 30,
      });

      expect(error).toBeNull();
      expect(batchId).toBeDefined();

      // Verify the batch table
      const batch = await getTableRow('license_batches', batchId);
      expect(batch.quantity).toBe(3);
      expect(batch.batch_name).toBe('Summer Promo');

      // Verify generated licenses
      const { data: licenses, error: licErr } = await serviceClient
        .from('licenses')
        .select('*')
        .eq('batch_id', batchId);

      expect(licErr).toBeNull();
      expect(licenses.length).toBe(3);
      for (const lic of licenses) {
        expect(lic.code.length).toBe(8);
        expect(lic.status).toBe('active');
        expect(lic.route_id).toBe(routeId);
      }
    });
  });

  describe('activate_license', () => {
    let activeLicenseCode: string;

    beforeAll(async () => {
      // Create a single license for activation
      const { data: batchId } = await adminClient.rpc('create_license_batch', {
        p_route_id: routeId,
        p_batch_name: 'Activation Test Batch',
        p_quantity: 1,
        p_price: 15000,
        p_valid_days: 30,
      });

      const { data: lic } = await serviceClient
        .from('licenses')
        .select('code')
        .eq('batch_id', batchId)
        .single();
      activeLicenseCode = lic.code;
    });

    it('should reject activation by non-students', async () => {
      const { error } = await adminClient.rpc('activate_license', {
        p_code: activeLicenseCode,
      });
      expect(error).not.toBeNull();
      expect(error.message).toMatch(/Only students can activate licenses/i);
    });

    it('should successfully activate a valid license code', async () => {
      // Get initial route available seats
      const routeBefore = await getTableRow('routes', routeId);
      const seatsBefore = routeBefore.available_seats;

      const { data: subId, error } = await studentClient.rpc('activate_license', {
        p_code: activeLicenseCode,
      });

      expect(error).toBeNull();
      expect(subId).toBeDefined();

      // Verify license is marked used
      const { data: lic } = await serviceClient
        .from('licenses')
        .select('*')
        .eq('code', activeLicenseCode)
        .single();
      expect(lic.status).toBe('used');
      expect(lic.used_by).toBe(studentUser.id);
      expect(lic.used_at).not.toBeNull();

      // Verify subscription is active and purchase_price snapshot is locked
      const sub = await getTableRow('subscriptions', subId);
      expect(sub.status).toBe('active');
      expect(sub.student_id).toBe(studentUser.id);
      expect(sub.route_id).toBe(routeId);
      expect(Number(sub.purchase_price)).toBe(15000);

      // Verify available seats decreased
      const routeAfter = await getTableRow('routes', routeId);
      expect(routeAfter.available_seats).toBe(seatsBefore - 1);
    });

    it('should reject already used license code', async () => {
      const { error } = await studentClient.rpc('activate_license', {
        p_code: activeLicenseCode, // Used in previous test
      });
      expect(error).not.toBeNull();
      expect(error.message).toMatch(/Invalid or already used license code/i);
    });

    it('should reject non-existent license code', async () => {
      const { error } = await studentClient.rpc('activate_license', {
        p_code: 'NOTEXIST',
      });
      expect(error).not.toBeNull();
      expect(error.message).toMatch(/Invalid or already used license code/i);
    });

    it('should reject activation if route has no seats available', async () => {
      // Set route seats to 0
      await serviceClient
        .from('routes')
        .update({ available_seats: 0 })
        .eq('id', routeId);

      const { data: batchId } = await adminClient.rpc('create_license_batch', {
        p_route_id: routeId,
        p_batch_name: 'No Seats Batch',
        p_quantity: 1,
        p_price: 15000,
        p_valid_days: 30,
      });

      const { data: lic } = await serviceClient
        .from('licenses')
        .select('code')
        .eq('batch_id', batchId)
        .single();

      const { error } = await studentClient.rpc('activate_license', {
        p_code: lic.code,
      });

      expect(error).not.toBeNull();
      expect(error.message).toMatch(/No seats available for this route or route is inactive/i);
    });
  });
});
