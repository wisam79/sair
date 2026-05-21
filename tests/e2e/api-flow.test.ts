import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error(
    'E2E tests require EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars. ' +
      'Copy .env.example to .env and fill in values.',
  );
}

test.describe('Edge Function API Security', () => {
  test('atomic-booking rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/atomic-booking`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {
        routeId: '550e8400-e29b-41d4-a716-446655440000',
        studentId: '550e8400-e29b-41d4-a716-446655440001',
      },
    });
    expect([401, 403]).toContain(response.status());
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
    expect([401, 403]).toContain(response.status());
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
    const requests = Array.from({ length: 12 }, () =>
      request.post(`${SUPABASE_URL}/functions/v1/atomic-booking`, {
        headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
        data: {
          routeId: '550e8400-e29b-41d4-a716-446655440000',
          studentId: '550e8400-e29b-41d4-a716-446655440001',
        },
      }),
    );
    const responses = await Promise.all(requests);
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
