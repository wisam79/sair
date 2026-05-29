import { corsResponse } from '../_shared/cors.ts';
import { verifyAuthLocal, supabaseAdmin } from '../_shared/auth.ts';
import { CheckoutRequest } from '../../../packages/core/index.ts';
import { getZainCashConfig } from '../_shared/zaincash.ts';

async function releasePendingHold(orderId: string | null, reason: string) {
  if (!orderId) return;
  const { error } = await supabaseAdmin.rpc('release_payment_hold', {
    p_zaincash_order_id: orderId,
    p_status: 'failed',
  });
  if (error) {
    console.warn(
      `[ZainCash Checkout] Failed to release payment hold after ${reason}:`,
      error.message,
    );
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok');
  }

  let pendingOrderId: string | null = null;

  try {
    // 1. Verify Authentication
    const { user, error: authError } = await verifyAuthLocal(req);
    if (authError || !user) {
      return corsResponse(req, { error: authError || 'Invalid token' }, 401);
    }

    const role = user.app_metadata?.role;
    if (role !== 'student') {
      return corsResponse(req, { error: 'Only students can initiate checkout' }, 403);
    }

    // 2. Rate limiting check (reduced to 5 attempts per 5 minutes to prevent abuse)
    const { data: rateLimitOk, error: rateLimitError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        p_user_id: user.id,
        p_action: 'zaincash_checkout',
        p_limit: parseInt(Deno.env.get('CHECKOUT_RATE_LIMIT') || '5'),
        p_window_seconds: parseInt(Deno.env.get('CHECKOUT_RATE_WINDOW') || '300'),
      },
    );

    if (rateLimitError || !rateLimitOk) {
      return corsResponse(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    await supabaseAdmin.rpc('cleanup_expired_license_holds');

    // 3. Parse and Validate Request Payload
    const payload = await req.json();
    const parsed = CheckoutRequest.safeParse(payload);
    if (!parsed.success) {
      return corsResponse(req, { error: parsed.error.message }, 400);
    }
    const { route_id, redirect_url } = parsed.data;

    // 4. Fetch Route Price
    const { data: route, error: routeError } = await supabaseAdmin
      .from('routes')
      .select('price, title')
      .eq('id', route_id)
      .single();

    if (routeError || !route) {
      return corsResponse(req, { error: 'Route not found' }, 404);
    }

    // 4b. Check for existing active subscription (prevent paying for a route you already have)
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('student_id', user.id)
      .eq('route_id', route_id)
      .in('status', ['active', 'pending'])
      .maybeSingle();

    if (existingSub) {
      return corsResponse(
        req,
        { error: 'You already have an active subscription for this route' },
        409,
      );
    }

    // 4c. Reuse existing pending payment if one exists (prevent orphan payments)
    const { data: existingPendingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, zaincash_order_id')
      .eq('user_id', user.id)
      .eq('route_id', route_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const amount = Math.round(Number(route.price));
    const orderId = existingPendingPayment?.zaincash_order_id || crypto.randomUUID();
    pendingOrderId = orderId;

    // 5. Create Pending Payment in Database (only if no existing pending payment)
    let paymentId = existingPendingPayment?.id;
    if (!existingPendingPayment) {
      const { data: payment, error: paymentError } = await supabaseAdmin.rpc('create_payment', {
        p_user_id: user.id,
        p_route_id: route_id,
        p_amount: amount,
        p_zaincash_order_id: orderId,
      });

      if (paymentError || !payment) {
        return corsResponse(
          req,
          { error: paymentError?.message || 'Failed to create payment' },
          500,
        );
      }
      paymentId = payment.id;
    }

    // Save dynamic redirect URL if provided, enabling dynamic redirecting back to mobile or web clients
    if (redirect_url && paymentId) {
      const { error: logError } = await supabaseAdmin.from('audit_logs').insert({
        user_id: user.id,
        action: 'checkout_initiated',
        resource: 'payments',
        resource_id: paymentId,
        details: { redirect_url },
      });
      if (logError) {
        console.warn(
          '[ZainCash Checkout] Failed to save checkout redirect url to audit logs:',
          logError.message,
        );
      }
    }

    // 6. Setup ZainCash Environment & Credentials via Shared Config Manager
    const { clientId, clientSecret, baseUrl: zaincashBaseUrl, serviceType } = getZainCashConfig();

    // 7. Dynamic Webhook redirect URL detection
    const origin = new URL(req.url).origin;
    const redirectUrl = `${origin}/functions/v1/zaincash-webhook`;

    // 8. Fetch OAuth2 Token from ZainCash
    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch(`${zaincashBaseUrl}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[ZainCash Checkout] OAuth2 token fetch failed:', errorText);
      await releasePendingHold(pendingOrderId, 'oauth_failure');
      return corsResponse(req, { error: `ZainCash auth failed: ${errorText}` }, 502);
    }

    const tokenResult = await tokenResponse.json();
    const accessToken = tokenResult.access_token;
    if (!accessToken) {
      await releasePendingHold(pendingOrderId, 'missing_access_token');
      return corsResponse(req, { error: 'Failed to retrieve access token from ZainCash' }, 502);
    }

    // 9. Initialize Transaction
    const initPayload = {
      language: 'ar',
      externalReferenceId: orderId, // Acts as idempotency key
      orderId: orderId,
      serviceType: serviceType,
      amount: {
        value: amount.toString(),
        currency: 'IQD',
      },
      redirectUrls: {
        successUrl: redirectUrl,
        failureUrl: redirectUrl,
      },
    };

    const initResponse = await fetch(`${zaincashBaseUrl}/api/v2/payment-gateway/transaction/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(initPayload),
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('[ZainCash Checkout] Transaction init failed:', errorText);
      await releasePendingHold(pendingOrderId, 'init_failure');
      return corsResponse(req, { error: `ZainCash initialization failed: ${errorText}` }, 502);
    }

    const initResult = await initResponse.json();
    if (!initResult || initResult.status !== 'SUCCESS' || !initResult.redirectUrl) {
      const errMsg = initResult?.err?.msg || 'Transaction initialization rejected';
      console.error('[ZainCash Checkout] Initialization rejected by ZainCash:', initResult);
      await releasePendingHold(pendingOrderId, 'init_rejected');
      return corsResponse(req, { error: `ZainCash rejected request: ${errMsg}` }, 502);
    }

    const transactionId = initResult.transactionDetails?.transactionId;
    const paymentUrl = initResult.redirectUrl;

    if (!transactionId) {
      await releasePendingHold(pendingOrderId, 'missing_transaction_id');
      return corsResponse(req, { error: 'ZainCash response missing transaction ID' }, 502);
    }

    // 10. Update Payment with the returned Transaction ID
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ zaincash_transaction_id: transactionId })
      .eq('zaincash_order_id', orderId);

    if (updateError) {
      console.warn('[ZainCash Checkout] Failed to save transaction ID:', updateError.message);
    }

    return corsResponse(req, {
      paymentUrl: paymentUrl,
      orderId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[ZainCash Checkout] Exception:', message);
    await releasePendingHold(pendingOrderId, 'exception');
    return corsResponse(req, { error: message }, 500);
  }
});
