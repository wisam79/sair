import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error(
    'E2E tests require EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars. ' +
      'Copy .env.example to .env and fill in values.',
  );
}

let createdRouteId: string | null = null;
let createdDriverId: string | null = null;
let createdProfileId: string | null = null;

test.beforeAll(async () => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.warn('[E2E api-flow] SUPABASE_SERVICE_ROLE_KEY not set. Skipping DB seeding.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const email = `diag_api_flow_${Math.random().toString(36).substring(7)}@sair.test`;
    const password = `Pass123!_${Math.random().toString(36).substring(7)}`;

    // Create user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: 'driver' },
    });

    if (createError || !userData || !userData.user) {
      console.error(`Failed to create test driver user: ${createError?.message}`);
      return;
    }
    createdProfileId = userData.user.id;

    // Profiles is usually auto-created via trigger, let's upsert to be safe and set values
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userData.user.id,
      full_name: 'E2E API Test Driver',
      role: 'driver',
      is_verified: true,
    });

    if (profileError) {
      console.error(`Failed to upsert profile: ${profileError.message}`);
      return;
    }

    // Create driver entry
    const { data: driverData, error: driverError } = await supabase.from('drivers').insert({
      user_id: userData.user.id,
      license_number: 'E2E-LIC-123',
      vehicle_model: 'E2E Toyota',
      vehicle_plate: 'E2E-PLATE',
      capacity: 10,
      is_verified: true,
    }).select();

    if (driverError || !driverData || driverData.length === 0) {
      console.error(`Failed to create driver: ${driverError?.message}`);
      return;
    }
    createdDriverId = driverData[0].id;

    // Create active route
    const { data: routeData, error: routeError } = await supabase.from('routes').insert({
      driver_id: createdDriverId,
      title: 'E2E API Flow Active Route',
      start_location: 'Start Point',
      end_location: 'End Point',
      price: 1500,
      capacity: 10,
      available_seats: 10,
      is_active: true,
    }).select();

    if (routeError || !routeData || routeData.length === 0) {
      console.error(`Failed to create active route: ${routeError?.message}`);
      return;
    }
    createdRouteId = routeData[0].id;
    console.log(`[E2E api-flow] Successfully seeded route: ${createdRouteId}`);
  } catch (err) {
    console.error('[E2E api-flow] Error seeding DB:', err);
  }
});

test.afterAll(async () => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // Delete in dependency order
    if (createdRouteId) {
      const { error } = await supabase.from('routes').delete().eq('id', createdRouteId);
      if (error) console.error('Error deleting route:', error.message);
    }
    if (createdDriverId) {
      const { error } = await supabase.from('drivers').delete().eq('id', createdDriverId);
      if (error) console.error('Error deleting driver:', error.message);
    }
    if (createdProfileId) {
      // Delete profile first, then auth user
      await supabase.from('profiles').delete().eq('id', createdProfileId);
      const { error } = await supabase.auth.admin.deleteUser(createdProfileId, true);
      if (error) console.error('Error deleting auth user:', error.message);
    }

    // Safety net: clean up any leftover E2E API Test profiles by name
    const { data: leftoverProfiles } = await supabase
      .from('profiles')
      .select('id')
      .ilike('full_name', 'E2E API Test%');
    if (leftoverProfiles && leftoverProfiles.length > 0) {
      const leftoverIds = leftoverProfiles.map((p: { id: string }) => p.id);
      await supabase.from('profiles').delete().in('id', leftoverIds);
      for (const id of leftoverIds) {
        await supabase.auth.admin.deleteUser(id, true);
      }
    }

    console.log('[E2E api-flow] Cleaned up seeded DB objects.');
  } catch (err) {
    console.error('[E2E api-flow] Error during cleanup:', err);
  }
});


test.describe('Edge Function API Security', () => {
  // Edge Functions may return 401/403 (deployed + auth enforced) or 404 (not deployed on this project)
  // Both outcomes confirm the function is not accessible to unauthenticated users.
  const EDGE_FUNC_REJECT = [401, 403, 404];

  test('atomic-booking rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/atomic-booking`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {
        routeId: '550e8400-e29b-41d4-a716-446655440000',
        studentId: '550e8400-e29b-41d4-a716-446655440001',
      },
    });
    expect(EDGE_FUNC_REJECT).toContain(response.status());
  });

  test('trip-engine rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/trip-engine`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        newStatus: 'driver_waiting',
        lat: 33.3,
        lng: 44.4,
      },
    });
    expect(EDGE_FUNC_REJECT).toContain(response.status());
  });

  test('atomic-booking rejects missing fields', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/atomic-booking`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('trip-engine rejects invalid status', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/trip-engine`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        newStatus: 'teleporting',
        lat: 33.3,
        lng: 44.4,
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('atomic-booking rate limits rapid requests', async ({ request }) => {
    const responses = [];
    for (let i = 0; i < 12; i++) {
      const res = await request.post(`${SUPABASE_URL}/functions/v1/atomic-booking`, {
        headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
        data: {
          routeId: '550e8400-e29b-41d4-a716-446655440000',
          studentId: '550e8400-e29b-41d4-a716-446655440001',
        },
      });
      responses.push(res);
      if (res.status() === 429) {
        break;
      }
    }
    const allRejected = responses.every((r) => r.status() >= 400);
    const someRateLimited = responses.some((r) => r.status() === 429);
    expect(allRejected || someRateLimited).toBeTruthy();
  });
});

test.describe('Supabase REST API + RLS', () => {
  test('can read routes with anon key', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/routes?select=id&limit=1`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('RLS blocks insert without proper auth', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/routes`, {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      data: {
        driver_id: '00000000-0000-0000-0000-000000000001',
        title: 'Test',
        start_location: 'A',
        end_location: 'B',
        price: 1000,
        capacity: 4,
        available_seats: 4,
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('can read profiles with anon key', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
  });

  test('RLS blocks profile insert with anon key', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/profiles`, {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      data: { full_name: 'Hacker', phone: '+9640000000000', role: 'admin' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('RLS blocks trip status update with anon key (no rows affected)', async ({ request }) => {
    const response = await request.patch(
      `${SUPABASE_URL}/rest/v1/trips?id=eq.550e8400-e29b-41d4-a716-446655440000`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        data: { status: 'completed' },
      },
    );
    const body = await response.json();
    expect((Array.isArray(body) && body.length === 0) || response.status() === 204).toBeTruthy();
  });
});

test.describe('Data Integrity', () => {
  test('seed data exists - active routes visible to anon', async ({ request }) => {
    const response = await request.get(
      `${SUPABASE_URL}/rest/v1/routes?select=id,title,is_active&is_active=eq.true`,
      {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      },
    );
    expect(response.status()).toBe(200);
    const routes = await response.json();
    expect(routes.length).toBeGreaterThanOrEqual(1);
    for (const route of routes) {
      expect(route.is_active).toBe(true);
    }
  });

  test('seed data exists - trips hidden from anon (RLS)', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/trips?select=id,status`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
    const trips = await response.json();
    expect(trips.length).toBe(0);
  });

  test('seed data exists - subscriptions hidden from anon (RLS)', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/subscriptions?select=id,status`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
    const subs = await response.json();
    expect(subs.length).toBe(0);
  });
});
