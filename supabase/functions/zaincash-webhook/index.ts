/**
 * ZainCash Webhook
 *
 * Disabled until merchant credentials and signature verification are configured.
 * Never acknowledge fake/stub payment callbacks as successful in production.
 */

Deno.serve((req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const signature = req.headers.get('X-ZainCash-Signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing ZainCash signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const zaincashSecret = Deno.env.get('ZAINCASH_SECRET');

    if (!zaincashSecret) {
      return new Response(
        JSON.stringify({
          error: 'ZainCash webhook is not enabled for this environment.',
          code: 'PAYMENTS_DISABLED',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // ── Real implementation (when credentials are set) ────────────────────────
    // TODO: Implement when merchant credentials are provided
    //
    // 1. Verify JWT signature using zaincashSecret
    //    const payload = await verifyJwt(token, zaincashSecret);
    //
    // 2. Check payment status
    //    if (payload.status !== "success") return acknowledge without action
    //
    // 3. Extract orderId → look up pending subscription in DB
    //    const { data: order } = await supabaseAdmin.from("payment_orders").select("*").eq("id", payload.orderId).single();
    //
    // 4. Activate the license / subscription
    //    await supabaseAdmin.rpc("activate_license", { p_code: order.license_code });
    //
    // 5. Log the transaction for audit
    //    await supabaseAdmin.rpc("log_audit", { ... });

    console.warn('[ZainCash Webhook] Real implementation pending merchant credentials');
    return new Response(JSON.stringify({ error: 'ZainCash webhook implementation pending' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.warn('[ZainCash Webhook] Error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
