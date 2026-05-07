import { beforeAll, afterAll, afterEach } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.TEST_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = process.env.TEST_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let serviceClient: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient {
  if (!serviceClient) {
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }
  return serviceClient;
}

export function createTestClient(accessToken?: string): SupabaseClient {
  if (accessToken) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function createTestUser(role: 'student' | 'driver' | 'admin' = 'student') {
  const supabase = getServiceClient();
  const email = `test_${role}_${Date.now()}_${Math.random().toString(36).slice(2)}@uniride.test`;
  const password = 'TestPass123!';

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, full_name: `Test ${role}` },
  });

  if (error) throw new Error(`Failed to create test user: ${error.message}`);

  return {
    id: data.user.id,
    email,
    password,
    role,
    accessToken: () => supabase.auth.admin.generateLink({ type: 'magiclink', email }).then(r => r.data?.properties?.hashed_token ?? ''),
  };
}

export async function createTestRoute(driverId: string, overrides: Record<string, any> = {}) {
  const supabase = getServiceClient();
  const { data, error } = await supabase.from('routes').insert({
    driver_id: driverId,
    from_area: 'التست',
    to_university: 'جامعة التست',
    departure_morning: '07:00',
    departure_evening: '15:00',
    total_seats: overrides.total_seats ?? 4,
    available_seats: overrides.available_seats ?? 4,
    monthly_fare: overrides.monthly_fare ?? 90000,
    is_active: true,
    ...overrides,
  }).select().single();

  if (error) throw new Error(`Failed to create test route: ${error.message}`);
  return data;
}

export async function createTestSubscription(studentId: string, driverId: string, overrides: Record<string, any> = {}) {
  const supabase = getServiceClient();
  const { data, error } = await supabase.from('subscriptions').insert({
    student_id: studentId,
    driver_id: driverId,
    monthly_fee: overrides.monthly_fee ?? 90000,
    status: overrides.status ?? 'active',
    start_date: overrides.start_date ?? new Date().toISOString().split('T')[0],
    end_date: overrides.end_date ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ...overrides,
  }).select().single();

  if (error) throw new Error(`Failed to create test subscription: ${error.message}`);
  return data;
}

export async function cleanupTestUser(userId: string) {
  const supabase = getServiceClient();
  await supabase.auth.admin.deleteUser(userId);
}

export async function cleanupTestData(tables: { table: string; column: string; values: string[] }[]) {
  const supabase = getServiceClient();
  for (const { table, column, values } of tables) {
    if (values.length > 0) {
      await supabase.from(table).delete().in(column, values);
    }
  }
}

export { getServiceClient };
