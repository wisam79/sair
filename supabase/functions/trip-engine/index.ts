import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const STATUS_MESSAGES: Record<
  string,
  { titleAr: string; bodyAr: string; titleEn: string; bodyEn: string }
> = {
  driver_waiting: {
    titleAr: 'السائق بانتظارك',
    bodyAr: 'وصل السائق إلى نقطة الانطلاق وبانتظارك الآن.',
    titleEn: 'Driver Waiting',
    bodyEn: 'The driver has arrived at the start location and is waiting for you.',
  },
  in_transit: {
    titleAr: 'انطلقت الرحلة',
    bodyAr: 'الرحلة في الطريق الآن. يمكنك تتبع حركة السائق على الخريطة.',
    titleEn: 'Trip In Transit',
    bodyEn: 'The trip has started. You can track the driver live on the map.',
  },
  completed: {
    titleAr: 'وصلت الرحلة بسلام',
    bodyAr: 'وصلت الرحلة إلى وجهتها. شكراً لركوبك مع سير!',
    titleEn: 'Trip Completed',
    bodyEn: 'The trip has arrived safely. Thank you for riding with Sair!',
  },
  cancelled: {
    titleAr: 'تم إلغاء الرحلة',
    bodyAr: 'نعتذر، تم إلغاء الرحلة من قبل السائق.',
    titleEn: 'Trip Cancelled',
    bodyEn: 'We apologize, the trip has been cancelled by the driver.',
  },
  absent: {
    titleAr: 'تم تسجيل غيابك',
    bodyAr: 'تم تسجيلك كغائب عن هذه الرحلة.',
    titleEn: 'Marked Absent',
    bodyEn: 'You have been marked as absent for this trip.',
  },
};

async function notifyStudentsForTripStatus(supabaseClient: any, tripId: string, newStatus: string) {
  try {
    const msg = STATUS_MESSAGES[newStatus];
    if (!msg) return;

    // 1. Get route details
    const { data: tripData, error: tripError } = await supabaseClient
      .from('trips')
      .select('route_id, routes(title)')
      .eq('id', tripId)
      .single();

    if (tripError || !tripData) {
      console.error('[Notification] Failed to fetch trip/route details:', tripError);
      return;
    }

    const routeTitle = tripData.routes?.title || 'Route';

    // 2. Get active subscriptions for this route
    const { data: subs, error: subsError } = await supabaseClient
      .from('subscriptions')
      .select('student_id')
      .eq('route_id', tripData.route_id)
      .eq('status', 'active');

    if (subsError || !subs) {
      console.error('[Notification] Failed to fetch subscriptions:', subsError);
      return;
    }

    const studentIds = subs.map((s: any) => s.student_id);
    if (studentIds.length === 0) return;

    // 3. Get push tokens for these students
    const { data: pushTokens, error: tokensError } = await supabaseClient
      .from('push_tokens')
      .select('token, user_id')
      .in('user_id', studentIds);

    if (tokensError) {
      console.error('[Notification] Failed to fetch push tokens:', tokensError);
      return;
    }

    const title = `${msg.titleAr} | ${msg.titleEn}`;
    const body = `${msg.bodyAr} (${routeTitle})`;
    const dataPayload = { type: 'trip_update', trip_id: tripId, status: newStatus };

    // 4. Log notifications in database (notification_log)
    const logs = studentIds.map((studentId: string) => ({
      user_id: studentId,
      title,
      body,
      data: dataPayload,
      is_read: false,
    }));

    const { error: logError } = await supabaseClient.from('notification_log').insert(logs);

    if (logError) {
      console.error('[Notification] Failed to insert notification logs:', logError);
    }

    // 5. Send Expo push notifications
    if (pushTokens && pushTokens.length > 0) {
      const messages = pushTokens.map((pt: any) => ({
        to: pt.token,
        sound: 'default',
        title,
        body,
        data: dataPayload,
      }));

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
        console.error('[Notification] Expo push notification API error:', await res.text());
      }
    }
  } catch (err) {
    console.error('[Notification] Error in notifyStudentsForTripStatus:', err);
  }
}

const ALLOWED_ORIGINS = [
  Deno.env.get('ADMIN_URL') || 'http://localhost:3000',
  'exp://localhost:8081',
  'http://localhost:8081',
].join(',');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, idempotency-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function resolveOrigin(origin: string): string {
  const allowedOrigins = ALLOWED_ORIGINS.split(',');
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin') || '';
  const resolvedOrigin = resolveOrigin(origin);
  const responseHeaders = {
    ...CORS_HEADERS,
    'Access-Control-Allow-Origin': resolvedOrigin,
    'Content-Type': 'application/json',
  };

  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: responseHeaders });
    }

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
          ...responseHeaders,
          'Access-Control-Allow-Origin': origin || '*',
        },
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: responseHeaders,
      });
    }

    const idempotencyKey = req.headers.get('idempotency-key');

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: responseHeaders,
      });
    }

    const { data: rateLimitOk, error: rateLimitError } = await supabaseClient.rpc(
      'check_rate_limit',
      {
        p_user_id: user.id, // FIX: pass explicitly — auth.uid() is NULL with service role key
        p_action: 'trip_engine',
        p_limit: 30,
        p_window_seconds: 60,
      },
    );

    if (rateLimitError || !rateLimitOk) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: responseHeaders,
      });
    }

    const { TripUpdateRequest } = await import('../../../packages/core/index.ts');
    const payload = await req.json();
    const parsed = TripUpdateRequest.safeParse(payload);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.message }), {
        status: 400,
        headers: responseHeaders,
      });
    }

    const { trip_id: tripId, new_status: newStatus, lat, lng } = parsed.data;

    // lat/lng are optional — only relevant for certain transitions (e.g. driver_waiting)
    const validLat = typeof lat === 'number' ? lat : null;
    const validLng = typeof lng === 'number' ? lng : null;

    const { data: driverData, error: driverError } = await supabaseClient
      .from('drivers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (driverError || !driverData) {
      return new Response(JSON.stringify({ error: 'Driver profile not found' }), {
        status: 403,
        headers: responseHeaders,
      });
    }

    if (idempotencyKey) {
      const { data: existingAudit } = await supabaseClient
        .from('audit_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('action', 'trip_status_change')
        .eq('resource_id', tripId)
        .eq('details->>idempotencyKey', idempotencyKey)
        .single();

      if (existingAudit) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Status already updated (idempotent response)',
            idempotent: true,
          }),
          {
            headers: responseHeaders,
          },
        );
      }
    }

    const { error } = await supabaseClient.rpc('update_trip_status', {
      p_trip_id: tripId,
      p_new_status: newStatus,
      p_lat: validLat,
      p_lng: validLng,
      p_driver_id: driverData.id,
    });

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 400,
        headers: responseHeaders,
      });
    }

    // Trigger push notification dispatch for subscribed students
    await notifyStudentsForTripStatus(supabaseClient, tripId, newStatus);

    await supabaseClient.rpc('log_audit', {
      p_user_id: user.id,
      p_action: 'trip_status_change',
      p_resource: 'trips',
      p_resource_id: tripId,
      p_details: { newStatus, lat, lng, idempotencyKey },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: responseHeaders,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        'Access-Control-Allow-Origin': resolvedOrigin,
        'Content-Type': 'application/json',
      },
    });
  }
});
