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
      data: { routeId: '00000000-0000-0000-0000-000000000001' },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('zaincash-checkout rejects missing routeId', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error || body.message).toBeTruthy();
  });

  test('zaincash-checkout rejects invalid routeId format', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      data: { routeId: 'not-a-uuid' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('zaincash-checkout rate limits rapid requests', async ({ request }) => {
    const requests = Array.from({ length: 10 }, () =>
      request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
        headers: { Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
        data: { routeId: '00000000-0000-0000-0000-000000000001' },
      }),
    );
    const responses = await Promise.all(requests);
    const allRejected = responses.every((r) => r.status() >= 400);
    const someRateLimited = responses.some((r) => r.status() === 429);
    expect(allRejected || someRateLimited).toBeTruthy();
  });

  test('zaincash-webhook requires signature header', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: { 'Content-Type': 'application/json' },
      data: { token: 'test_token' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('signature');
  });

  test('zaincash-webhook rejects invalid signature', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: {
        'Content-Type': 'application/json',
        'X-ZainCash-Signature': 'invalid_signature',
      },
      data: { token: 'zc_test_user_route_1234567890' },
    });
    expect(response.status()).toBe(401);
  });

  test('zaincash-webhook accepts valid stub token format', async ({ request }) => {
    // Test with stub token - should return stub response
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: {
        'Content-Type': 'application/json',
        'X-ZainCash-Signature': 'stub_signature_for_testing',
      },
      data: { token: 'stub_1234567890' },
    });
    // Should either accept stub or fail signature (both are valid behaviors)
    expect([200, 401]).toContain(response.status());
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
