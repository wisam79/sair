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
});

const jsonResponse = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    status,
  });

// ─── Retry helper ─────────────────────────────────────────────────────────────
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500) return res;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }
  throw lastError ?? new Error('Max retries exceeded');
}

// ─── Handler ──────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(req) });
  }

  try {
    // Health check endpoint (bypasses auth and validation)
    let isHealthCheck = false;
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.json();
      if (body && body.action === 'health') {
        isHealthCheck = true;
      }
    } catch {
      // Ignore
    }

    if (isHealthCheck) {
      return new Response(JSON.stringify({ status: 'healthy' }), {
        status: 200,
        headers: {
          ...corsHeaders(req),
          'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
          'Content-Type': 'application/json',
        },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonResponse(req, { error: 'Unauthorized' }, 401);

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) return jsonResponse(req, { error: 'Invalid token' }, 401);

    const role = user.app_metadata?.role as string | undefined;
    if (!role || !['admin', 'driver'].includes(role)) {
      return jsonResponse(req, { error: 'Only admins and drivers can send notifications' }, 403);
    }

    const { data: rateLimitOk, error: rateLimitError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        p_user_id: user.id,
        p_action: 'send_notification',
        p_limit: 10,
        p_window_seconds: 60,
      },
    );

    if (rateLimitError || !rateLimitOk) {
      return jsonResponse(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    const { NotificationRequest } = await import('../../../packages/core/index.ts');
    const payload = await req.json();
    const parsed = NotificationRequest.safeParse(payload);

    if (!parsed.success) {
      return jsonResponse(req, { error: parsed.error.message }, 400);
    }

    const { target_user_id, target_role, title, body, data } = parsed.data;

    if (role === 'driver') {
      if (target_role) {
        return jsonResponse(req, { error: 'Drivers cannot send broadcast notifications' }, 403);
      }

      const { data: driverRow } = await supabaseAdmin
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!driverRow) {
        return jsonResponse(req, { error: 'Driver profile not found' }, 403);
      }

      const { data: match } = await supabaseAdmin
        .from('subscriptions')
        .select('id, routes!inner(driver_id)')
        .eq('student_id', target_user_id)
        .eq('routes.driver_id', driverRow.id)
        .eq('status', 'active')
        .limit(1);

      if (!match || match.length === 0) {
        return jsonResponse(req, { error: 'Cannot send notification to this user' }, 403);
      }
    }

    // Fetch tokens based on target
    let tokensQuery = supabaseAdmin.from('push_tokens').select('token');

    if (target_user_id) {
      tokensQuery = tokensQuery.eq('user_id', target_user_id);
    } else if (target_role === 'student' || target_role === 'driver') {
      // Need to get user IDs for the specific role
      const { data: usersWithRole } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('role', target_role);
      const userIds = usersWithRole?.map((u) => u.id) || [];
      if (userIds.length > 0) {
        tokensQuery = tokensQuery.in('user_id', userIds);
      } else {
        return jsonResponse(
          req,
          { success: true, message: `No users found for role ${target_role}` },
          200,
        );
      }
    }

    const { data: pushTokens, error: tokenError } = await tokensQuery;

    if (tokenError) throw tokenError;

    if (!pushTokens || pushTokens.length === 0) {
      return jsonResponse(
        req,
        { success: false, message: 'No valid push tokens found for target' },
        200,
      );
    }

    // Expo Push API allows sending up to 100 messages at once
    const messages = pushTokens.map((pt) => ({
      to: pt.token,
      sound: 'default',
      title,
      body,
      data: data || {},
    }));

    const expoResponse = await fetchWithRetry('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const expoResult = await expoResponse.json();

    return jsonResponse(req, { success: true, expoResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return jsonResponse(req, { error: message }, 400);
  }
});
