import { corsResponse } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/auth.ts';

// Simple IP-based rate limiter for unauthenticated endpoint
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // max requests
const RATE_WINDOW_MS = 60_000; // per 60 seconds

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup stale entries every 5 minutes to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 300_000);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok', 200, false);
  }

  try {
    // IP-based rate limiting (no auth required for error logging,
    // but we must prevent log flooding / DoS)
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (!checkIpRateLimit(clientIp)) {
      return corsResponse(req, { error: 'Too many requests' }, 429, false);
    }

    const entry = await req.json();
    if (!entry || !entry.level || !entry.message) {
      return corsResponse(req, { error: 'Invalid log entry' }, 400, false);
    }

    // Sanitize: truncate message and context to prevent log injection with huge payloads
    const level = String(entry.level).toUpperCase().slice(0, 10);
    const message = String(entry.message).slice(0, 1000);
    const context = entry.context || {};
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Print to Deno console, which Supabase aggregates into its logs dashboard automatically
    console.warn(`[Client Log - ${level}] ${message}`, JSON.stringify(context));

    // Save to database using service_role privileges
    try {
      const { error: dbErr } = await supabaseAdmin
        .from('client_error_logs')
        .insert({
          level,
          message,
          context,
          user_agent: userAgent,
        });
      if (dbErr) {
        console.error('[log-error] Failed to insert error to database:', dbErr.message);
      }
    } catch (dbEx) {
      console.error('[log-error] DB exception:', dbEx);
    }

    return corsResponse(req, { success: true }, 200, false);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return corsResponse(req, { error: message }, 500, false);
  }
});
