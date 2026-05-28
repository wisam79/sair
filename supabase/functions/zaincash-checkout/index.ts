import { corsResponse } from '../_shared/cors.ts';
import { verifyAuthLocal, supabaseAdmin } from '../_shared/auth.ts';
import { CheckoutRequest } from '../../../packages/core/index.ts';
import * as jose from 'npm:jose';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok');
  }

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

    // 2. Rate limiting check
    const { data: rateLimitOk, error: rateLimitError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        p_user_id: user.id,
        p_action: 'zaincash_checkout',
        p_limit: parseInt(Deno.env.get('CHECKOUT_RATE_LIMIT') || '10'),
        p_window_seconds: parseInt(Deno.env.get('CHECKOUT_RATE_WINDOW') || '60'),
      },
    );

    if (rateLimitError || !rateLimitOk) {
      return corsResponse(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    // 3. Parse and Validate Request Payload
    const payload = await req.json();
    const parsed = CheckoutRequest.safeParse(payload);
    if (!parsed.success) {
      return corsResponse(req, { error: parsed.error.message }, 400);
    }
    const { route_id } = parsed.data;

    // 4. Fetch Route Price
    const { data: route, error: routeError } = await supabaseAdmin
      .from('routes')
      .select('price, title')
      .eq('id', route_id)
      .single();

    if (routeError || !route) {
      return corsResponse(req, { error: 'Route not found' }, 404);
    }

    const amount = Math.round(Number(route.price));
    const orderId = crypto.randomUUID();

    // 5. Create Pending Payment in Database
    const { data: payment, error: paymentError } = await supabaseAdmin.rpc('create_payment', {
      p_user_id: user.id,
      p_route_id: route_id,
      p_amount: amount,
      p_zaincash_order_id: orderId,
    });

    if (paymentError || !payment) {
      return corsResponse(req, { error: paymentError?.message || 'Failed to create payment' }, 500);
    }

    // 6. Setup ZainCash Credentials (fallback to standard public sandbox keys if unset)
    const zaincashSecret =
      Deno.env.get('ZAINCASH_SECRET') ||
      '$2y$10$hHbSq4yKU6C54vE9Gg.xKeKiSS/vn9YcRY0917Q.d3SMGUThG1qC';
    const zaincashMsisdn = Deno.env.get('ZAINCASH_MSISDN') || '9647835074893';
    const zaincashMerchantId = Deno.env.get('ZAINCASH_MERCHANT_ID') || '5c643aa4334a17ec1e1d102e';

    // 7. Dynamic Webhook redirect URL detection
    const origin = new URL(req.url).origin;
    const redirectUrl = `${origin}/zaincash-webhook`;

    // 8. Sign ZainCash Transaction JWT
    const secretKey = new TextEncoder().encode(zaincashSecret);
    const jwt = await new jose.SignJWT({
      amount,
      serviceType: `Sair Subscription: ${route.title}`,
      msisdn: zaincashMsisdn,
      merchantId: zaincashMerchantId,
      orderId,
      redirectUrl,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secretKey);

    // 9. POST to ZainCash init endpoint
    const initResponse = await fetch('https://test.zaincash.iq/transaction/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: jwt,
        merchantId: zaincashMerchantId,
        lang: 'ar',
      }),
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      return corsResponse(req, { error: `ZainCash init failed: ${errorText}` }, 502);
    }

    const initResult = await initResponse.json();
    if (!initResult || !initResult.id) {
      return corsResponse(req, { error: 'ZainCash response missing transaction ID' }, 502);
    }

    const transactionId = initResult.id;

    // 10. Update Payment with the returned Transaction ID
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ zaincash_transaction_id: transactionId })
      .eq('zaincash_order_id', orderId);

    if (updateError) {
      console.warn('[ZainCash Checkout] Failed to save transaction ID:', updateError.message);
    }

    return corsResponse(req, {
      paymentUrl: `https://test.zaincash.iq/transaction/pay?id=${transactionId}`,
      orderId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return corsResponse(req, { error: message }, 500);
  }
});
