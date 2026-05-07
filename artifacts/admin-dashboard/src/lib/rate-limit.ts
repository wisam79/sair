import { headers } from 'next/headers';

interface RateLimitConfig {
  max: number;
  window: number;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { max: 5, window: 15 * 60 * 1000 },
  api: { max: 100, window: 15 * 60 * 1000 },
  userCreation: { max: 10, window: 60 * 60 * 1000 },
};

const CLEANUP_INTERVAL = 15 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export async function rateLimit(
  key: string,
  config?: RateLimitConfig,
): Promise<{ success: boolean; remaining: number }> {
  const headersList = await headers();
  const ip = headersList.get('x-real-ip') || headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const limitKey = `${key}:${ip}`;
  const cfg = config || DEFAULT_CONFIGS[key] || DEFAULT_CONFIGS.api;

  const now = Date.now();
  const existing = rateLimitStore.get(limitKey);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(limitKey, { count: 1, resetAt: now + cfg.window });
    return { success: true, remaining: cfg.max - 1 };
  }

  if (existing.count >= cfg.max) {
    return { success: false, remaining: 0 };
  }

  existing.count++;
  return { success: true, remaining: cfg.max - existing.count };
}

export function getRateLimitHeaders(remaining: number, window: number = 15 * 60) {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': (Date.now() + window).toString(),
  };
}
