import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Capture the Deno serve handlers
let logErrorHandler: any = null;
let sendNotificationHandler: any = null;
let tripEngineHandler: any = null;
let zaincashCheckoutHandler: any = null;
let zaincashWebhookHandler: any = null;

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
    return { finished: Promise.resolve() };
  },
  env: {
    get: (key: string) => {
      const vars: Record<string, string> = {
        ADMIN_URL: 'http://localhost:3000',
        SUPABASE_URL: 'https://zpcvvyxtmxzplmojobbv.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
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
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Import all edge functions so their top-level Deno.serve calls are executed
await import('../../supabase/functions/log-error');
await import('../../supabase/functions/send-notification');
await import('../../supabase/functions/trip-engine');
await import('../../supabase/functions/zaincash-checkout');
await import('../../supabase/functions/zaincash-webhook');

describe('Edge Functions Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('log-error', () => {
    it('should return CORS headers for OPTIONS request', async () => {
      const req = new Request('http://localhost/log-error', { method: 'OPTIONS' });
      const res = await logErrorHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
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
      expect(data.error).toBe('Unauthorized');
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
      mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: new Error('Not found') }); // driver profile

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

    it('should return stub payment url in stub mode', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'u1', app_metadata: { role: 'student' } } },
        error: null,
      });
      mockSupabaseClient.rpc.mockResolvedValueOnce({ data: true, error: null }); // rate limit ok
      const req = new Request('http://localhost/zaincash-checkout', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeId: 'r1', amount: 5000 }),
      });
      const res = await zaincashCheckoutHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.stub).toBe(true);
      expect(data.paymentUrl).toContain('test.zaincash.iq');
    });
  });

  describe('zaincash-webhook', () => {
    it('should return 400 if token query parameter is missing', async () => {
      const req = new Request('http://localhost/zaincash-webhook');
      const res = await zaincashWebhookHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing token');
    });

    it('should return 200 received: true, stub: true in stub mode', async () => {
      const req = new Request('http://localhost/zaincash-webhook?token=sometoken');
      const res = await zaincashWebhookHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.received).toBe(true);
      expect(data.stub).toBe(true);
    });
  });
});
