import { Expo, type ExpoPushMessage } from 'npm:expo-server-sdk';
import { corsResponse } from '../_shared/cors.ts';
import { verifyAuth, supabaseAdmin } from '../_shared/auth.ts';
import { retryWithBackoff } from '../../../packages/core/index.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok');
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
      return corsResponse(req, { status: 'healthy' });
    }

    const { user, error: authError } = await verifyAuth(req);
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
        return corsResponse(
          req,
          {
            error: `No users found for role ${target_role}`,
          },
          404,
        );
      }
    }

    const { data: pushTokens, error: tokenError } = await tokensQuery;

    if (tokenError) throw tokenError;

    if (!pushTokens || pushTokens.length === 0) {
      return corsResponse(
        req,
        {
          error: 'No valid push tokens found for target',
        },
        404,
      );
    }

    // Expo Push API allows sending up to 100 messages at once
    const messages: ExpoPushMessage[] = [];
    const invalidTokens: string[] = [];

    for (const pt of pushTokens) {
      if (!Expo.isExpoPushToken(pt.token)) {
        console.warn(`[Notification] Invalid Expo push token: ${pt.token}`);
        invalidTokens.push(pt.token);
        continue;
      }

      messages.push({
        to: pt.token,
        sound: 'default',
        title,
        body,
        data: data || {},
      });
    }

    // Cleanup invalid tokens immediately
    if (invalidTokens.length > 0) {
      await supabaseAdmin.from('push_tokens').delete().in('token', invalidTokens);
    }

    if (messages.length === 0) {
      return corsResponse(
        req,
        {
          error: 'No valid push tokens found after filtering',
        },
        404,
      );
    }

    const expoResponse = await retryWithBackoff(
      async () => {
        const res = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });
        if (!res.ok) {
          throw new Error(`Expo API returned status ${res.status}`);
        }
        return res;
      },
      { maxRetries: 3, baseDelayMs: 1000 },
    );

    const expoResult = await expoResponse.json();

    return corsResponse(req, { success: true, sent_count: messages.length, expoResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return corsResponse(req, { error: message }, 400);
  }
});
