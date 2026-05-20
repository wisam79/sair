import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  Deno.env.get('ADMIN_URL') || 'http://localhost:3000',
  'exp://localhost:8081',
  'http://localhost:8081',
].join(',');

function resolveOrigin(origin: string | null): string {
  const allowed = ALLOWED_ORIGINS.split(',');
  if (origin && allowed.includes(origin)) return origin;
  return allowed[0];
}

const corsHeaders = (req: Request) => ({
  'Access-Control-Allow-Origin': resolveOrigin(req.headers.get('Origin')),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json(req, { error: 'Unauthorized' }, 401);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return json(req, { error: 'Invalid token' }, 401);

    const role = user.app_metadata?.role;
    if (role !== 'student') return json(req, { error: 'Only students can initiate checkout' }, 403);

    // Rate limiting: 10 checkouts per 60 seconds per user
    const { data: rateLimitOk, error: rateLimitError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        p_user_id: user.id,
        p_action: 'zaincash_checkout',
        p_limit: 10,
        p_window_seconds: 60,
      },
    );

    if (rateLimitError || !rateLimitOk) {
      return json(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    const { routeId, amount } = await req.json();
    if (!routeId || !amount) return json(req, { error: 'Missing routeId or amount' }, 400);
    if (typeof amount !== 'number' || amount <= 0)
      return json(req, { error: 'Invalid amount' }, 400);

    const zaincashSecret = Deno.env.get('ZAINCASH_SECRET');
    const zaincashMsisdn = Deno.env.get('ZAINCASH_MSISDN');
    const zaincashMerchantId = Deno.env.get('ZAINCASH_MERCHANT_ID');

    if (!zaincashSecret || !zaincashMsisdn || !zaincashMerchantId) {
      return json(req, {
        success: true,
        stub: true,
        paymentUrl: `https://test.zaincash.iq/transaction/pay?id=stub_${Date.now()}`,
        message:
          'ZainCash is in stub mode. Configure ZAINCASH_SECRET, ZAINCASH_MSISDN, ZAINCASH_MERCHANT_ID to enable real payments.',
      });
    }

    return json(req, { error: 'ZainCash real implementation pending merchant credentials' }, 501);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return json(req, { error: message }, 500);
  }
});
