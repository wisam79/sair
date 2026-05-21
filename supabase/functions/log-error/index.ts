const corsHeaders = (req: Request) => ({
  'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(req) });
  }

  try {
    const entry = await req.json();
    if (!entry || !entry.level || !entry.message) {
      return new Response(JSON.stringify({ error: 'Invalid log entry' }), {
        status: 400,
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Print to Deno console, which Supabase aggregates into its logs dashboard automatically
    const levelStr = String(entry.level).toUpperCase();
    const contextStr = entry.context ? JSON.stringify(entry.context) : '';
    console.warn(`[Client Log - ${levelStr}] ${entry.message}`, contextStr);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
