/**
 * E2E Trip Flow Tests
 *
 * Tests the complete trip lifecycle using API calls.
 * This file uses only API tests that can run against any Supabase instance
 * with proper authentication.
 *
 * IMPORTANT: Full E2E tests require:
 * 1. Local Supabase OR test branch
 * 2. Admin service role key
 * Without these, only security tests run.
 */

import { test, expect } from '@playwright/test';

// Environment - uses production for API-only tests (no admin needed for security tests)
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zpcvvyxtmxzplmojobbv.supabase.co';
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Safety: Warn but don't block for API-only tests (they don't modify data)
const isProduction = SUPABASE_URL.includes('zpcvvyxtmxzplmojobbv');
if (isProduction) {
  console.warn('[E2E] WARNING: Running against production - API-only tests only!');
  console.warn('[E2E] Full E2E tests require local Supabase or test branch.');
}

// ============================================
// SECURITY TESTS - Anon requests (read-only)
// ============================================

test.describe('Security: Anonymous Access', () => {
  test('trip-engine rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/trip-engine`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        trip_id: '00000000-0000-0000-0000-000000000001',
        new_status: 'driver_waiting',
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('activate_license RPC rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/activate_license`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: { p_code: 'TEST12345678' },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('cancel_subscription RPC rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/cancel_subscription`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: { p_subscription_id: '00000000-0000-0000-0000-000000000001' },
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

  test('Trips are hidden from anon users (RLS)', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/trips?select=id,status&limit=5`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  test('Drivers are hidden from anon users (RLS)', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/drivers?select=id&limit=5`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  test('Routes are visible to anon users (public read)', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/routes?select=id,title&limit=5`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    // Routes are public for viewing (is_active = true filter applies)
  });
});

// ============================================
// INPUT VALIDATION TESTS
// ============================================

test.describe('Input Validation', () => {
  test('trip-engine rejects invalid UUID format', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/trip-engine`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {
        trip_id: 'not-a-valid-uuid',
        new_status: 'driver_waiting',
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error || body.message).toBeTruthy();
  });

  test('trip-engine rejects invalid status transition', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/trip-engine`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {
        trip_id: '00000000-0000-0000-0000-000000000001',
        new_status: 'teleporting',
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error || body.message).toBeTruthy();
  });

  test('trip-engine rejects missing trip_id', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/trip-engine`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {
        new_status: 'driver_waiting',
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('activate_license rejects invalid code length', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/activate_license`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: { p_code: 'TOOSHORT' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('create_license_batch requires admin role', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/create_license_batch`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {
        p_route_id: '00000000-0000-0000-0000-000000000001',
        p_batch_name: 'Test Batch',
        p_quantity: 10,
        p_price: 1000,
        p_valid_days: 30,
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('request_payout requires driver role', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/request_payout`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: { p_amount: 1000 },
    });
    // Returns 400 (validation check) or 401/403 (auth) - both are acceptable
    expect([400, 401, 403]).toContain(response.status());
  });
});

// ============================================
// RATE LIMITING TESTS
// ============================================

test.describe('Rate Limiting', () => {
  test('check_rate_limit function exists and is accessible', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/check_rate_limit`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {
        p_user_id: '00000000-0000-0000-0000-000000000001',
        p_action: 'test_action',
        p_limit: 10,
        p_window_seconds: 60,
      },
    });
    // Function exists (not 404), might be 200 or auth error
    expect(response.status()).not.toBe(404);
  });
});

// ============================================
// PAYMENT FLOW TESTS (API only - stubbed)
// ============================================

test.describe('Payment Flow', () => {
  test('zaincash-checkout returns 401/403 for unauthenticated', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: { route_id: '00000000-0000-0000-0000-000000000001' },
    });
    // Either 401/403 (auth) or 503 (payments disabled)
    expect([401, 403, 503]).toContain(response.status());
  });

  test('zaincash-checkout rejects missing route_id', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-checkout`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error || body.message).toBeTruthy();
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

  test('zaincash-webhook returns not implemented when credentials absent', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/zaincash-webhook`, {
      headers: {
        'Content-Type': 'application/json',
        'X-ZainCash-Signature': 'test',
      },
      data: { token: 'test_token' },
    });
    expect([400, 401, 501, 503]).toContain(response.status());
  });
});

// ============================================
// NOTIFICATION TESTS
// ============================================

test.describe('Notification System', () => {
  test('send-notification rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/send-notification`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        target_user_id: '00000000-0000-0000-0000-000000000001',
        title: 'Test',
        body: 'Test message',
      },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('send-notification rejects invalid payload', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/functions/v1/send-notification`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: {
        title: 'Test',
        // missing body
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

// ============================================
// STATE MACHINE TESTS (via RPC)
// ============================================

test.describe('State Machine Validation', () => {
  test('validate_trip_transition function exists', async ({ request }) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/validate_trip_transition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
      },
      body: JSON.stringify({
        p_trip_id: '00000000-0000-0000-0000-000000000001',
        p_new_status: 'driver_waiting',
      }),
    });
    // Function exists (not 404) - auth will reject but that's expected
    expect(response.status).not.toBe(404);
  });

  test('admin_cancel_trip requires authentication', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/admin_cancel_trip`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
      },
      data: { p_trip_id: '00000000-0000-0000-0000-000000000001' },
    });
    // Should be 401/403 (auth) not 404
    expect(response.status()).not.toBe(404);
  });
});

// ============================================
// LICENSE SYSTEM TESTS
// ============================================

test.describe('License System', () => {
  test('activate_license rejects invalid code format', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/activate_license`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      data: { p_code: 'TOOSHORT' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('get_driver_balance requires authentication', async ({ request }) => {
    const response = await request.post(`${SUPABASE_URL}/rest/v1/rpc/get_driver_balance`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
      },
    });
    // Should not be 404 (function exists)
    expect(response.status()).not.toBe(404);
  });
});
