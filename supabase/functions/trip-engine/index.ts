import { corsResponse } from '../_shared/cors.ts';
import { verifyAuthLocal, supabaseAdmin } from '../_shared/auth.ts';

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

    const title = `${msg.titleAr} | ${msg.titleEn}`;
    const body = `${msg.bodyAr} (${routeTitle})`;
    const dataPayload = { type: 'trip_update', trip_id: tripId, status: newStatus };

    // 3. Log notifications in database (notification_log)
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

    // 4. Send OneSignal push notifications using REST API
    const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID');
    const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY');

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      console.warn('[Notification] OneSignal env vars missing. Simulating success.');
      return;
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_external_user_ids: studentIds,
        headings: { ar: msg.titleAr, en: msg.titleEn },
        contents: { ar: `${msg.bodyAr} (${routeTitle})`, en: `${msg.bodyEn} (${routeTitle})` },
        data: dataPayload,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Notification] OneSignal API failed: ${response.status} - ${errText}`);
    } else {
      console.log(`[Notification] Successfully dispatched OneSignal notification to ${studentIds.length} users`);
    }
  } catch (err) {
    console.error('[Notification] Error in notifyStudentsForTripStatus:', err);
  }
}

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

    const { user, error: authError } = await verifyAuthLocal(req);
    if (authError || !user) {
      return corsResponse(req, { error: authError || 'Invalid token' }, 401);
    }

    const idempotencyKey = req.headers.get('idempotency-key');

    const { data: rateLimitOk, error: rateLimitError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        p_user_id: user.id,
        p_action: 'trip_engine',
        p_limit: 30,
        p_window_seconds: 60,
      },
    );

    if (rateLimitError || !rateLimitOk) {
      return corsResponse(req, { error: 'Too many requests. Please try again later.' }, 429);
    }

    const { TripUpdateRequest } = await import('../../../packages/core/index.ts');
    const payload = await req.json();
    const parsed = TripUpdateRequest.safeParse(payload);

    if (!parsed.success) {
      return corsResponse(req, { error: parsed.error.message }, 400);
    }

    const { trip_id: tripId, new_status: newStatus, lat, lng } = parsed.data;

    // lat/lng are optional
    const validLat = typeof lat === 'number' ? lat : null;
    const validLng = typeof lng === 'number' ? lng : null;

    const { data: driverData, error: driverError } = await supabaseAdmin
      .from('drivers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (driverError || !driverData) {
      return corsResponse(req, { error: 'Driver profile not found' }, 403);
    }

    if (idempotencyKey) {
      const { data: existingAudit } = await supabaseAdmin
        .from('audit_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('action', 'trip_status_change')
        .eq('resource_id', tripId)
        .eq('details->>idempotencyKey', idempotencyKey)
        .single();

      if (existingAudit) {
        return corsResponse(req, {
          success: true,
          message: 'Status already updated (idempotent response)',
          idempotent: true,
        });
      }
    }

    // Fetch current trip status and driver assignment to validate transition using State Machine in core package
    const { data: tripData, error: tripFetchError } = await supabaseAdmin
      .from('trips')
      .select('status, driver_id')
      .eq('id', tripId)
      .single();

    if (tripFetchError || !tripData) {
      return corsResponse(req, { error: 'Trip not found or query failed' }, 404);
    }

    if (tripData.driver_id !== driverData.id) {
      return corsResponse(req, { error: 'Unauthorized: not your trip' }, 403);
    }

    const { canTransition } = await import('../../../packages/core/index.ts');
    if (!canTransition(tripData.status, newStatus)) {
      return corsResponse(
        req,
        {
          success: false,
          error: `Invalid transition from ${tripData.status} to ${newStatus}`,
        },
        400,
      );
    }

    const { error } = await supabaseAdmin.rpc('update_trip_status', {
      p_trip_id: tripId,
      p_new_status: newStatus,
      p_lat: validLat,
      p_lng: validLng,
      p_driver_id: driverData.id,
    });

    if (error) {
      return corsResponse(req, { success: false, error: error.message }, 400);
    }

    // Trigger push notification dispatch for subscribed students
    await notifyStudentsForTripStatus(supabaseAdmin, tripId, newStatus);

    await supabaseAdmin.rpc('log_audit', {
      p_user_id: user.id,
      p_action: 'trip_status_change',
      p_resource: 'trips',
      p_resource_id: tripId,
      p_details: { newStatus, lat, lng, idempotencyKey },
    });

    return corsResponse(req, { success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return corsResponse(req, { error: msg }, 500);
  }
});
