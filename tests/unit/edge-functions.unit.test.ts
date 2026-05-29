import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as jose from 'jose';

// Capture the Deno serve handlers
let logErrorHandler: any = null;
let sendNotificationHandler: any = null;
let tripEngineHandler: any = null;
let zaincashCheckoutHandler: any = null;
let zaincashWebhookHandler: any = null;
let streamChatTokenHandler: any = null;

// Mock Deno global object
let serveCallsCount = 0;
globalThis.Deno = {
  serve: (handler: any) => {
    serveCallsCount++;
    if (serveCallsCount === 1) logErrorHandler = handler;
    else if (serveCallsCount === 2) sendNotificationHandler = handler;
    else if (serveCallsCount === 3) tripEngineHandler = handler;
    else if (serveCallsCount === 4) zaincashCheckoutHandler = handler;
    else if (serveCallsCount === 5) zaincashWebhookHandler = handler;
    else if (serveCallsCount === 6) streamChatTokenHandler = handler;
    return { finished: Promise.resolve() };
  },
  env: {
    get: (key: string) => {
      const vars: Record<string, string> = {
        ADMIN_URL: 'http://localhost:3000',
        SUPABASE_URL: 'https://zpcvvyxtmxzplmojobbv.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
        ZAINCASH_SECRET: 'bibLCGTxVaig5To3OLLKPJQMLRR7Pefp',
        ZAINCASH_CLIENT_ID: '758055f4a8044779a35f6ceb69f858b3',
        ZAINCASH_CLIENT_SECRET: 'bibLCGTxVAig5To3OLLKPJQMlRR7Pefp',
      };
      return vars[key];
    },
  },
} as any;

// Mock supabase-js client
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  rpc: vi.fn(),
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock expo-server-sdk to intercept push notifications without real network calls
export const mockSendPushNotificationsAsync = vi.fn();
export const mockGetPushNotificationReceiptsAsync = vi.fn();

vi.mock('expo-server-sdk', () => {
  return {
    Expo: class MockExpo {
      static isExpoPushToken(token: string) {
        return (
          typeof token === 'string' &&
          (((token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[')) &&
            token.endsWith(']')) ||
            /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token))
        );
      }
      chunkPushNotifications(messages: any[]) {
        const chunks = [];
        for (let i = 0; i < messages.length; i += 100) {
          chunks.push(messages.slice(i, i + 100));
        }
        return chunks;
      }
      chunkPushNotificationReceiptIds(receiptIds: string[]) {
        const chunks = [];
        for (let i = 0; i < receiptIds.length; i += 1000) {
          chunks.push(receiptIds.slice(i, i + 1000));
        }
        return chunks;
      }
      sendPushNotificationsAsync(chunk: any[]) {
        return mockSendPushNotificationsAsync(chunk);
      }
      getPushNotificationReceiptsAsync(receiptIds: string[]) {
        return mockGetPushNotificationReceiptsAsync(receiptIds);
      }
    },
  };
});

// Import all edge functions so their top-level Deno.serve calls are executed
await import('../../supabase/functions/log-error');
await import('../../supabase/functions/send-notification');
await import('../../supabase/functions/trip-engine');
await import('../../supabase/functions/zaincash-checkout');
await import('../../supabase/functions/zaincash-webhook');
await import('../../supabase/functions/stream-chat-token');

describe('Edge Functions Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.in.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.maybeSingle.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.delete.mockReturnValue(mockSupabaseClient);
  });

  describe('log-error', () => {
    it('should return CORS headers for OPTIONS request', async () => {
      const req = new Request('http://localhost/log-error', {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:3000' },
      });
      const res = await logErrorHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    });

    it('should return 500 for invalid JSON', async () => {
      const req = new Request('http://localhost/log-error', {
        method: 'POST',
        body: 'invalid-json',
      });
      const res = await logErrorHandler(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should return 400 for missing level or message', async () => {
      const req = new Request('http://localhost/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'info' }), // missing message
      });
      const res = await logErrorHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Invalid log entry');
    });

    it('should log warning and return 200 for valid log entry', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const req = new Request('http://localhost/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'info', message: 'test log', context: { x: 1 } }),
      });
      const res = await logErrorHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalledWith('[Client Log - INFO] test log', '{"x":1}');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('send-notification', () => {
    it('should handle OPTIONS and return CORS headers', async () => {
      const req = new Request('http://localhost/send-notification', {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:3000' },
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should handle health check action', async () => {
      const req = new Request('http://localhost/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health' }),
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('healthy');
    });

    it('should return 401 if unauthorized (missing header)', async () => {
      const req = new Request('http://localhost/send-notification', { method: 'POST' });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Missing authorization header');
    });

    it('should return 401 if token is invalid', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: new Error('Invalid token'),
      });
      const req = new Request('http://localhost/send-notification', {
        method: 'POST',
        headers: { Authorization: 'Bearer invalid' },
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Invalid token');
    });

    it('should return 403 if user is not admin or driver', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'student' } } },
        error: null,
      });
      const req = new Request('http://localhost/send-notification', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid' },
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Only admins and drivers can send notifications');
    });

    it('should return 429 if rate limit is exceeded', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'admin' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: false, error: null }); // check_rate_limit false
      const req = new Request('http://localhost/send-notification', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid' },
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.error).toBe('Too many requests. Please try again later.');
    });

    it('should return 400 for invalid payload (Zod validation)', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'admin' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok
      const req = new Request('http://localhost/send-notification', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }), // invalid payload (title too short)
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(400);
    });

    it('should prevent driver from sending broadcast notifications', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null });
      const req = new Request('http://localhost/send-notification', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Broadcast',
          body: 'Hello',
          target_role: 'student', // broadcast
        }),
      });
      const res = await sendNotificationHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Drivers cannot send broadcast notifications');
    });
  });

  describe('trip-engine', () => {
    it('should return CORS headers for OPTIONS request', async () => {
      const req = new Request('http://localhost/trip-engine', {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:3000' },
      });
      const res = await tripEngineHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should return 401 if auth header is missing', async () => {
      const req = new Request('http://localhost/trip-engine', { method: 'POST' });
      const res = await tripEngineHandler(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Missing authorization header');
    });

    it('should return 403 if driver profile is not found', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Not found'),
      }); // driver profile

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'in_transit',
        }),
      });
      const res = await tripEngineHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Driver profile not found');
    });

    it('should return idempotent response if request already processed', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      // driver profile found
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'd1' }, error: null });
      // idempotency audit log found
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'audit1' }, error: null });

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer valid',
          'Content-Type': 'application/json',
          'idempotency-key': 'key123',
        },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'in_transit',
        }),
      });
      const res = await tripEngineHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.identpotent || data.idempotent).toBe(true);
    });

    it('should allow valid transition and notify students (simulated when env vars missing)', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok

      // Mock single() calls in order:
      // 1. Driver profile check
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'd1' }, error: null });
      // 2. Trip status check (valid transition from scheduled to driver_waiting)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { status: 'scheduled', driver_id: 'd1' },
        error: null,
      });
      // 3. Trip route details inside notifyStudentsForTripStatus
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { route_id: 'r1', routes: { title: 'Route 1' } },
        error: null,
      });

      // Mock update_trip_status rpc call and log_audit rpc call
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: null, error: null }); // update_trip_status
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: null, error: null }); // log_audit

      // Mock subscriptions/notification_log query chain
      const originalFrom = mockSupabaseClient.from;
      mockSupabaseClient.from = vi.fn().mockImplementation((table) => {
        if (table === 'subscriptions') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockImplementation(() => {
              return {
                eq: vi.fn().mockResolvedValue({ data: [{ student_id: 's1' }], error: null }),
              };
            }),
          };
        }
        if (table === 'notification_log') {
          return {
            insert: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        return mockSupabaseClient;
      });

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'driver_waiting',
        }),
      });

      const res = await tripEngineHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      mockSupabaseClient.from = originalFrom;
    });

    it('should call OneSignal API when env vars are present', async () => {
      const originalDenoGet = globalThis.Deno.env.get;
      globalThis.Deno.env.get = vi.fn().mockImplementation((key: string) => {
        const vars: Record<string, string> = {
          ONESIGNAL_APP_ID: 'test-app-id',
          ONESIGNAL_REST_API_KEY: 'test-api-key',
          SUPABASE_URL: 'https://zpcvvyxtmxzplmojobbv.supabase.co',
          SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
        };
        return vars[key];
      });

      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok

      // Mock single() calls in order:
      // 1. Driver profile check
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'd1' }, error: null });
      // 2. Trip status check (valid transition from scheduled to driver_waiting)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { status: 'scheduled', driver_id: 'd1' },
        error: null,
      });
      // 3. Trip route details
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { route_id: 'r1', routes: { title: 'Route 1' } },
        error: null,
      });

      // Mock update_trip_status rpc call and log_audit rpc call
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: null, error: null }); // update_trip_status
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: null, error: null }); // log_audit

      // Mock subscriptions/notification_log query chain
      const originalFrom = mockSupabaseClient.from;
      mockSupabaseClient.from = vi.fn().mockImplementation((table) => {
        if (table === 'subscriptions') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockImplementation(() => {
              return {
                eq: vi.fn().mockResolvedValue({ data: [{ student_id: 's1' }], error: null }),
              };
            }),
          };
        }
        if (table === 'notification_log') {
          return {
            insert: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        return mockSupabaseClient;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'onesignal-notification-id' }),
      });

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'driver_waiting',
        }),
      });

      const res = await tripEngineHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      // Verify that fetch was called for OneSignal notification
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.onesignal.com/notifications',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Key test-api-key',
          }),
        }),
      );

      mockSupabaseClient.from = originalFrom;
      globalThis.Deno.env.get = originalDenoGet;
    });

    it('should reject invalid transition', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok

      // 1. Driver profile check
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'd1' }, error: null });
      // 2. Trip status check (scheduled -> completed is invalid)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { status: 'scheduled', driver_id: 'd1' },
        error: null,
      });

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'completed', // Invalid transition from scheduled
        }),
      });

      const res = await tripEngineHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid transition');
    });

    it('should reject transition if trip belongs to another driver', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok

      // 1. Driver profile check
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'd1' }, error: null });
      // 2. Trip status check (belongs to driver 'd2')
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { status: 'scheduled', driver_id: 'd2' },
        error: null,
      });

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'driver_waiting',
        }),
      });

      const res = await tripEngineHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain('Unauthorized: not your trip');
    });

    it('should return 404 if trip is not found', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok

      // 1. Driver profile check
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: 'd1' }, error: null });
      // 2. Trip status check (not found)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Trip not found'),
      });

      const req = new Request('http://localhost/trip-engine', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: '123e4567-e89b-12d3-a456-426614174000',
          new_status: 'driver_waiting',
        }),
      });

      const res = await tripEngineHandler(req);
      expect(res.status).toBe(404);
    });
  });

  describe('zaincash-checkout', () => {
    it('should return 401 if unauthorized', async () => {
      const req = new Request('http://localhost/zaincash-checkout', { method: 'POST' });
      const res = await zaincashCheckoutHandler(req);
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not student', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'driver' } } },
        error: null,
      });
      const req = new Request('http://localhost/zaincash-checkout', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid' },
      });
      const res = await zaincashCheckoutHandler(req);
      expect(res.status).toBe(403);
    });

    it('should initialize payment and return paymentUrl', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'student' } } },
        error: null,
      });

      // Mock rate limit check and payment creation RPCs
      mockSupabaseClient.rpc.mockImplementation((fn, args) => {
        if (fn === 'check_rate_limit') {
          return Promise.resolve({ data: true, error: null });
        }
        if (fn === 'create_payment') {
          return Promise.resolve({ data: { id: 'payment-123' }, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      // Mock database queries
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'routes') {
          return {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({ data: { price: 25000, title: 'Route 1' }, error: null }),
              }),
            }),
          };
        }
        if (table === 'subscriptions') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  in: () => ({
                    maybeSingle: () => Promise.resolve({ data: null, error: null }),
                  }),
                }),
              }),
            }),
          };
        }
        if (table === 'payments') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    order: () => ({
                      limit: () => ({
                        maybeSingle: () => Promise.resolve({ data: null, error: null }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
            update: () => ({
              eq: () => Promise.resolve({ error: null }),
            }),
          };
        }
        return mockSupabaseClient;
      });

      // Mock fetch response for ZainCash v2 API (OAuth2 token + Transaction Init)
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'mock-access-token' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              status: 'SUCCESS',
              redirectUrl: 'https://test.zaincash.iq/transaction/pay?id=zain-trans-999',
              transactionDetails: { transactionId: 'zain-trans-999' },
            }),
        });

      const req = new Request('http://localhost/zaincash-checkout', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({ route_id: '00000000-0000-0000-0000-000000000001' }),
      });

      const res = await zaincashCheckoutHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.paymentUrl).toBe('https://test.zaincash.iq/transaction/pay?id=zain-trans-999');
      expect(data.orderId).toBeDefined();
    });
  });

  describe('zaincash-webhook', () => {
    it('should return 400 if token parameter is missing', async () => {
      const req = new Request('http://localhost/zaincash-webhook?other=123', { method: 'GET' });
      const res = await zaincashWebhookHandler(req);
      expect(res.status).toBe(400);
      const text = await res.text();
      expect(text).toContain('missing_token');
    });

    it('should verify token, execute DB RPC and return success HTML', async () => {
      // 1. Generate signed token using the corrected secret
      const zaincashSecret = 'bibLCGTxVAig5To3OLLKPJQMlRR7Pefp';
      const secretKey = new TextEncoder().encode(zaincashSecret);
      const testToken = await new jose.SignJWT({
        eventType: 'STATUS_CHANGED',
        data: {
          currentStatus: 'SUCCESS',
          orderId: 'payment-123',
          transactionId: 'zain-trans-999',
        },
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);

      // 2. Mock complete_payment_and_activate_subscription RPC
      mockSupabaseClient.rpc.mockImplementation((fn, args) => {
        if (fn === 'complete_payment_and_activate_subscription') {
          expect(args.p_zaincash_order_id).toBe('payment-123');
          return Promise.resolve({ data: { status: 'completed' }, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const req = new Request(`http://localhost/zaincash-webhook?token=${testToken}`, {
        method: 'GET',
      });
      const res = await zaincashWebhookHandler(req);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('تم الدفع بنجاح');
    });

    it('should verify token, execute DB RPC and redirect to custom web URL if stored in audit logs', async () => {
      // 1. Generate signed token
      const zaincashSecret = 'bibLCGTxVAig5To3OLLKPJQMlRR7Pefp';
      const secretKey = new TextEncoder().encode(zaincashSecret);
      const testToken = await new jose.SignJWT({
        eventType: 'STATUS_CHANGED',
        data: {
          currentStatus: 'SUCCESS',
          orderId: 'payment-123',
          transactionId: 'zain-trans-999',
        },
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);

      // 2. Mock complete_payment_and_activate_subscription RPC
      mockSupabaseClient.rpc.mockImplementation((fn, args) => {
        if (fn === 'complete_payment_and_activate_subscription') {
          return Promise.resolve({ data: { status: 'completed' }, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      // 3. Mock database query: payments and audit_logs to return a custom redirect url
      const originalFrom = mockSupabaseClient.from;
      mockSupabaseClient.from = vi.fn().mockImplementation((table) => {
        if (table === 'payments') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: () =>
                  Promise.resolve({ data: { id: 'payment-uuid-123' }, error: null }),
              }),
            }),
          };
        }
        if (table === 'audit_logs') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    maybeSingle: () =>
                      Promise.resolve({
                        data: { details: { redirect_url: 'http://localhost:3000/payment-web' } },
                        error: null,
                      }),
                  }),
                }),
              }),
            }),
          };
        }
        return mockSupabaseClient;
      });

      const req = new Request(`http://localhost/zaincash-webhook?token=${testToken}`, {
        method: 'GET',
      });
      const res = await zaincashWebhookHandler(req);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('تم الدفع بنجاح');
      expect(text).toContain(
        'http://localhost:3000/payment-web?status=success&amp;order_id=payment-123',
      );

      mockSupabaseClient.from = originalFrom;
    });

    it('should handle failed payment and return failure HTML', async () => {
      // 1. Generate failed transaction token
      const zaincashSecret = 'bibLCGTxVAig5To3OLLKPJQMlRR7Pefp';
      const secretKey = new TextEncoder().encode(zaincashSecret);
      const testToken = await new jose.SignJWT({
        eventType: 'STATUS_CHANGED',
        data: {
          currentStatus: 'FAILED',
          orderId: 'payment-123',
          transactionId: 'zain-trans-999',
        },
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);

      // 2. Mock payment database update call
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'payments') {
          return {
            update: (fields: any) => {
              expect(fields.status).toBe('failed');
              return {
                eq: (col: string, val: string) => {
                  expect(col).toBe('zaincash_order_id');
                  expect(val).toBe('payment-123');
                  return Promise.resolve({ error: null });
                },
              };
            },
          };
        }
        return mockSupabaseClient;
      });

      const req = new Request(`http://localhost/zaincash-webhook?token=${testToken}`, {
        method: 'GET',
      });
      const res = await zaincashWebhookHandler(req);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('فشل عملية الدفع');
      expect(text).toContain('sair://payment?status=failed');
    });
  });

  describe('stream-chat-token', () => {
    it('should return CORS headers for OPTIONS request', async () => {
      const req = new Request('http://localhost/stream-chat-token', {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:3000' },
      });
      const res = await streamChatTokenHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should return 401 if unauthorized', async () => {
      const req = new Request('http://localhost/stream-chat-token', { method: 'POST' });
      const res = await streamChatTokenHandler(req);
      expect(res.status).toBe(401);
    });

    it('should return simulated token when credentials are missing', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'student' } } },
        error: null,
      });

      const req = new Request('http://localhost/stream-chat-token', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid' },
      });
      const res = await streamChatTokenHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBe('simulated-stream-token-for-u1');
      expect(data.apiKey).toBe('simulated-key');
    });

    it('should generate real token when credentials are present', async () => {
      const originalDenoGet = globalThis.Deno.env.get;
      globalThis.Deno.env.get = vi.fn().mockImplementation((key: string) => {
        const vars: Record<string, string> = {
          STREAM_APP_KEY: 'test-stream-key',
          STREAM_APP_SECRET: 'test-stream-secret',
          SUPABASE_URL: 'https://zpcvvyxtmxzplmojobbv.supabase.co',
          SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
        };
        return vars[key];
      });

      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'student' } } },
        error: null,
      });

      const req = new Request('http://localhost/stream-chat-token', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid' },
      });
      const res = await streamChatTokenHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.apiKey).toBe('test-stream-key');

      globalThis.Deno.env.get = originalDenoGet;
    });
  });
});
