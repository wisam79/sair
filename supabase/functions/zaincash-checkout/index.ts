import { corsResponse } from '../_shared/cors.ts';
import { verifyAuth, supabaseAdmin } from '../_shared/auth.ts';
import { CheckoutRequest } from '../../../packages/core/index.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok');
  }

  try {
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return corsResponse(req, { error: authError || 'Invalid token' }, 401);
    }

    const role = user.app_metadata?.role;
    if (role !== 'student') {
      return corsResponse(req, { error: 'Only students can initiate checkout' }, 403);
    }

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
      return corsResponse(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    const payload = await req.json();
    const parsed = CheckoutRequest.safeParse(payload);
    if (!parsed.success) {
      return corsResponse(req, { error: parsed.error.message }, 400);
    }
    const { route_id } = parsed.data;

    const zaincashSecret = Deno.env.get('ZAINCASH_SECRET');
    const zaincashMsisdn = Deno.env.get('ZAINCASH_MSISDN');
    const zaincashMerchantId = Deno.env.get('ZAINCASH_MERCHANT_ID');

    if (!zaincashSecret || !zaincashMsisdn || !zaincashMerchantId) {
      return corsResponse(
        req,
        {
          error: 'ZainCash payments are not enabled for this environment.',
          code: 'PAYMENTS_DISABLED',
        },
        503,
      );
    }

    // Keep route_id parsed and validated for the real integration path.
    void route_id;
    return corsResponse(
      req,
      { error: 'ZainCash real implementation pending merchant credentials' },
      501,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return corsResponse(req, { error: message }, 500);
  }
});
