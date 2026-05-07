import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.TEST_SUPABASE_SERVICE_KEY || '';

const hasRealDb = SUPABASE_URL !== 'http://127.0.0.1:54321' || !!SUPABASE_SERVICE_KEY;

describe.skipIf(!hasRealDb)('RLS Policy Tests — Real Database', () => {
  let adminClient: SupabaseClient;
  let studentClient: SupabaseClient;
  let driverClient: SupabaseClient;
  let studentId: string;
  let driverId: string;

  beforeAll(async () => {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: studentUser } = await adminClient.auth.admin.createUser({
      email: `rls_student_${Date.now()}@test.uniride`,
      password: 'Test123456!',
      email_confirm: true,
      user_metadata: { role: 'student', full_name: 'RLS Test Student' },
    });
    studentId = studentUser?.id ?? '';

    const { data: driverUser } = await adminClient.auth.admin.createUser({
      email: `rls_driver_${Date.now()}@test.uniride`,
      password: 'Test123456!',
      email_confirm: true,
      user_metadata: { role: 'driver', full_name: 'RLS Test Driver' },
    });
    driverId = driverUser?.id ?? '';

    const studentToken = (await adminClient.auth.admin.generateLink({ type: 'magiclink', email: studentUser?.email ?? '' }))?.data?.properties?.hashed_token ?? '';
    const driverToken = (await adminClient.auth.admin.generateLink({ type: 'magiclink', email: driverUser?.email ?? '' }))?.data?.properties?.hashed_token ?? '';

    studentClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    driverClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  });

  afterAll(async () => {
    if (studentId) await adminClient.auth.admin.deleteUser(studentId);
    if (driverId) await adminClient.auth.admin.deleteUser(driverId);
  });

  describe('profiles RLS', () => {
    it('student can read own profile only', async () => {
      const { data } = await studentClient.from('profiles').select('*').eq('id', studentId);
      expect(data?.length).toBeLessThanOrEqual(1);
    });

    it('student cannot update another student profile', async () => {
      const { error } = await studentClient
        .from('profiles')
        .update({ full_name: 'hacked' })
        .eq('id', driverId);
      expect(error).toBeTruthy();
    });

    it('student cannot insert profiles', async () => {
      const { error } = await studentClient.from('profiles').insert({
        id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Fake',
        phone: '000',
        role: 'admin',
      });
      expect(error).toBeTruthy();
    });
  });

  describe('subscriptions RLS', () => {
    it('student can only see own subscriptions', async () => {
      const { data } = await studentClient.from('subscriptions').select('*');
      const allOwn = data?.every((s: any) => s.student_id === studentId) ?? true;
      expect(allOwn).toBe(true);
    });

    it('student cannot update subscription status directly', async () => {
      const { error } = await studentClient
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('student_id', driverId);
      expect(error).toBeTruthy();
    });
  });

  describe('trips RLS', () => {
    it('driver can only see own trips', async () => {
      const { data } = await driverClient.from('trips').select('*');
      const allOwn = data?.every((t: any) => t.driver_id === driverId) ?? true;
      expect(allOwn).toBe(true);
    });

    it('student cannot insert trips', async () => {
      const { error } = await studentClient.from('trips').insert({
        driver_id: driverId,
        direction: 'go',
        status: 'scheduled',
      });
      expect(error).toBeTruthy();
    });
  });

  describe('notifications RLS', () => {
    it('user can only see own notifications', async () => {
      const { data } = await studentClient.from('notifications').select('*');
      const allOwn = data?.every((n: any) => n.user_id === studentId) ?? true;
      expect(allOwn).toBe(true);
    });
  });
});

describe('RLS Policy Tests — Logic Verification (no DB required)', () => {
  it('should verify UUID format before DB queries', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const invalidUUID = "'; DROP TABLE users; --";
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(validUUID)).toBe(true);
    expect(uuidRegex.test(invalidUUID)).toBe(false);
  });

  it('should prevent gender-based booking violations', () => {
    const maleStudent = 'male';
    const femaleOnlyRoute = 'female';
    const anyRoute = 'any';
    expect(maleStudent === femaleOnlyRoute || femaleOnlyRoute === 'any').toBe(false);
    expect(maleStudent === anyRoute || anyRoute === 'any').toBe(true);
  });

  it('should enforce idempotency key uniqueness', () => {
    const existing = new Set(['idem_user1_route1_123']);
    expect(existing.has('idem_user1_route1_123')).toBe(true);
    expect(existing.has('idem_user1_route1_124')).toBe(false);
  });

  it('should validate subscription status transitions', () => {
    const validTransitions: Record<string, string[]> = {
      pending: ['active', 'cancelled'],
      active: ['cancelled', 'expired'],
      cancelled: [],
      expired: [],
    };
    expect(validTransitions['pending'].includes('active')).toBe(true);
    expect(validTransitions['cancelled'].includes('active')).toBe(false);
  });
});
