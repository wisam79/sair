import { corsResponse } from '../_shared/cors.ts';
import { verifyAuthLocal, supabaseAdmin } from '../_shared/auth.ts';

const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID');
const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok');
  }

  try {
    // Health check endpoint
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
      return corsResponse(req, { status: 'healthy' });
    }

    const { user, error: authError } = await verifyAuthLocal(req);
    if (authError || !user) {
      return corsResponse(req, { error: authError || 'Invalid token' }, 401);
    }

    const role = user.app_metadata?.role as string | undefined;
    if (!role || !['admin', 'driver'].includes(role)) {
      return corsResponse(req, { error: 'Only admins and drivers can send notifications' }, 403);
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
      return corsResponse(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    const { NotificationRequest } = await import('../../../packages/core/index.ts');
    const payload = await req.json();
    const parsed = NotificationRequest.safeParse(payload);

    if (!parsed.success) {
      return corsResponse(req, { error: parsed.error.message }, 400);
    }

    const { target_user_id, target_role, title, body, data } = parsed.data;

    if (role === 'driver') {
      if (target_role) {
        return corsResponse(req, { error: 'Drivers cannot send broadcast notifications' }, 403);
      }

      const { data: driverRow } = await supabaseAdmin
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!driverRow) {
        return corsResponse(req, { error: 'Driver profile not found' }, 403);
      }

      const { data: match } = await supabaseAdmin
        .from('subscriptions')
        .select('id, routes!inner(driver_id)')
        .eq('student_id', target_user_id)
        .eq('routes.driver_id', driverRow.id)
        .eq('status', 'active')
        .limit(1);

      if (!match || match.length === 0) {
        return corsResponse(req, { error: 'Cannot send notification to this user' }, 403);
      }
    }

    // Prepare OneSignal target IDs
    let targetUserIds: string[] = [];

    if (target_user_id) {
      targetUserIds = [target_user_id];
    } else if (target_role) {
      const { data: usersWithRole } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('role', target_role);
      targetUserIds = usersWithRole?.map((u) => u.id) || [];
      if (targetUserIds.length === 0) {
        return corsResponse(req, { error: `No users found for role ${target_role}` }, 404);
      }
    }

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      console.warn('[Notification] OneSignal env vars missing. Simulating success.');
      return corsResponse(req, { 
        success: true, 
        simulated: true, 
        sent_to: targetUserIds 
      });
    }

    const bodyPayload = {
      app_id: ONESIGNAL_APP_ID,
      include_external_user_ids: targetUserIds,
      headings: { en: title, ar: title },
      contents: { en: body, ar: body },
      data: data || {},
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OneSignal API returned status ${response.status}: ${errText}`);
    }

    const result = await response.json();
    return corsResponse(req, { success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return corsResponse(req, { error: message }, 400);
  }
});
