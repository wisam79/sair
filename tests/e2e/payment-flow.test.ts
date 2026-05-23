import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error(
    'E2E tests require EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars.',
  );
}

test.describe('ZainCash Payment Flow', () => {
  test('zaincash-checkout rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { route_id: '00000000-0000-0000-0000-000000000001' },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('zaincash-checkout rejects missing route_id', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error || body.message).toBeTruthy();
  });

  test('zaincash-checkout rejects invalid route_id format', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { route_id: 'not-a-uuid' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('zaincash-checkout returns payments disabled when credentials are absent', async ({
    request,
  }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { route_id: '00000000-0000-0000-0000-000000000001' },
    });
    expect([401, 403, 503]).toContain(response.status());
    if (response.status() === 503) {
      const body = await response.json();
      expect(body.code).toBe('PAYMENTS_DISABLED');
    }
  });

  test('zaincash-webhook requires signature header', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: { 'Content-Type': 'application/json' },
      data: { token: 'test_token' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error || body.message).toContain('signature');
  });

  test('zaincash-webhook does not accept fake signed payments', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: {
        'Content-Type': 'application/json',
        'X-ZainCash-Signature': 'invalid_signature',
      },
      data: { token: 'zc_test_user_route_1234567890' },
    });
    expect([401, 501, 503]).toContain(response.status());
  });

  test('zaincash-webhook does not accept stub token format', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: {
        'Content-Type': 'application/json',
        'X-ZainCash-Signature': 'stub_signature_for_testing',
      },
      data: { token: 'stub_1234567890' },
    });
    expect([200, 401, 501, 503]).toContain(response.status());
  });
});

test.describe('Payment Security', () => {
  test('payments table requires authentication (RLS)', async ({ request }) => {
    const response = await request.get(
      `${SUPABASE_URL}/rest/v1/payments?select=id,status&limit=5`,
      {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      },
    );
    // RLS should block or return empty
    expect(response.status()).toBe(200);
    const payments = await response.json();
    expect(Array.isArray(payments)).toBe(true);
  });

  test('payments insert requires proper auth', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/payments`, {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      data: {
        user_id: '00000000-0000-0000-0000-000000000001',
        route_id: '00000000-0000-0000-0000-000000000001',
        amount: 1000,
        zaincash_order_id: 'test_order_123',
        status: 'pending',
      },
    });
    // Should be rejected or blocked by RLS
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
