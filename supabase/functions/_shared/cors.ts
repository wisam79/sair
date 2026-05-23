const ALLOWED_ORIGINS = [
  Deno.env.get('ADMIN_URL') || 'http://localhost:3000',
  'exp://localhost:8081',
  'http://localhost:8081',
];

export const CORS_HEADERS = {
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, idempotency-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function resolveOrigin(origin: string | null): string {
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

export function corsHeaders(req: Request, permissive = false) {
  const origin = req.headers.get('Origin');
  return {
    ...CORS_HEADERS,
    'Access-Control-Allow-Origin': permissive ? origin || '*' : resolveOrigin(origin),
  };
}

export function corsResponse(req: Request, body: unknown, status = 200, permissive = false) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(req, permissive) });
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req, permissive),
      'Content-Type': 'application/json',
    },
  });
}
