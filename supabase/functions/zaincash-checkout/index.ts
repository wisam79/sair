import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This is a STUB for the ZainCash Checkout process.
// It will be fully implemented when actual ZainCash Merchant credentials are provided.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { routeId, amount } = await req.json();

    if (!routeId || !amount) {
      throw new Error('Missing routeId or amount');
    }

    // STUB LOGIC:
    // 1. Generate a JWT token signed with ZainCash Secret.
    // 2. Call ZainCash API (/transaction/init) to get a Transaction ID.
    // 3. Return the payment URL to the client.

    console.warn(`[ZainCash Stub] Initializing payment for route: ${routeId}, amount: ${amount}`);

    // Dummy successful response
    const dummyPaymentUrl = `https://test.zaincash.iq/transaction/pay?id=dummy_txn_${Date.now()}`;

    return new Response(JSON.stringify({ 
      success: true, 
      paymentUrl: dummyPaymentUrl,
      message: 'ZainCash integration is currently in stub mode.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
