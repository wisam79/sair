export interface ZainCashConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  serviceType: string;
  isProd: boolean;
}

/**
 * Lazily loads and validates ZainCash environment variables.
 * Strictly enforces configuration via environment variables in ALL environments.
 * No hardcoded credentials — tests must set environment variables or mock this function.
 */
export function getZainCashConfig(): ZainCashConfig {
  const isProd = Deno.env.get('ZAINCASH_ENV') === 'production';

  const clientId = Deno.env.get('ZAINCASH_CLIENT_ID') || Deno.env.get('ZAINCASH_MERCHANT_ID');
  const clientSecret = Deno.env.get('ZAINCASH_CLIENT_SECRET') || Deno.env.get('ZAINCASH_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error(
      'ZainCash configuration error: ZAINCASH_CLIENT_ID and ZAINCASH_CLIENT_SECRET environment variables are required. ' +
        'Set them via `supabase secrets set` for production or in .env for local development.',
    );
  }

  const baseUrl =
    Deno.env.get('ZAINCASH_API_BASE_URL') ||
    (isProd ? 'https://api.zaincash.iq' : 'https://pg-api-uat.zaincash.iq');

  const serviceType = Deno.env.get('ZAINCASH_SERVICE_TYPE') || 'Delivery';

  return {
    clientId,
    clientSecret,
    baseUrl,
    serviceType,
    isProd,
  };
}
