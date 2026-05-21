import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error(
    'E2E tests require EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars.',
  );
}

test.describe('License Activation Flow', () => {
  test('activate_license RPC rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/activate-license`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { code: 'TEST12345678' },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('activate_license RPC rejects invalid code format', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/activate-license`, {
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      data: { code: 'TOOSHORT' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('create_license_batch RPC requires admin role', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/create-license-batch`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { routeId: '00000000-0000-0000-0000-000000000001', quantity: 10, validDays: 30 },
    });
    expect([401, 403]).toContain(response.status());
  });
});

test.describe('Subscription Management', () => {
  test('cancel_subscription RPC requires authentication', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/cancel-subscription`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { subscriptionId: '00000000-0000-0000-0000-000000000001' },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('Subscriptions are hidden from anon users (RLS)', async ({ request }) => {
    const response = await request.get(
      `${SUPABASE_URL}/rest/v1/subscriptions?select=id,status&limit=5`,
      {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      },
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    // RLS should return empty for anon
    expect(data.length).toBe(0);
  });
});
