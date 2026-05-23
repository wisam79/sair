import { Expo } from 'npm:expo-server-sdk';
import { corsResponse } from '../_shared/cors.ts';
import { verifyAuth, supabaseAdmin } from '../_shared/auth.ts';

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

    // 5. Send Expo push notifications using Expo SDK
    if (pushTokens && pushTokens.length > 0) {
      const expo = new Expo();
      const messages: any[] = [];
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
          data: dataPayload,
        });
      }

      // Cleanup invalid tokens immediately
      if (invalidTokens.length > 0) {
        await supabaseClient.from('push_tokens').delete().in('token', invalidTokens);
      }

      if (messages.length > 0) {
        const chunks = expo.chunkPushNotifications(messages);
        const ticketIds: string[] = [];
        const ticketToTokenMap = new Map<string, string>();

        for (const chunk of chunks) {
          try {
            const tickets = await expo.sendPushNotificationsAsync(chunk);
            for (let i = 0; i < tickets.length; i++) {
              const ticket = tickets[i];
              const token = chunk[i].to;

              if (ticket.status === 'error') {
                console.error(`[Notification] Ticket error for token ${token}:`, ticket.message);
                if (ticket.details?.error === 'DeviceNotRegistered') {
                  await supabaseClient.from('push_tokens').delete().eq('token', token);
                  console.log(`[Notification] Removed unregistered device token: ${token}`);
                }
              } else if (ticket.status === 'ok') {
                ticketIds.push(ticket.id);
                ticketToTokenMap.set(ticket.id, token);
              }
            }
          } catch (error) {
            console.error('[Notification] Error sending notification chunk:', error);
          }
        }

        // Fetch receipts to cleanup stale tokens
        if (ticketIds.length > 0) {
          try {
            const receiptIdChunks = expo.chunkPushNotificationReceiptIds(ticketIds);
            for (const receiptIdChunk of receiptIdChunks) {
              const receipts = await expo.getPushNotificationReceiptsAsync(receiptIdChunk);
              for (const [ticketId, receipt] of Object.entries(receipts)) {
                if (receipt.status === 'error') {
                  console.error(
                    `[Notification] Receipt error for ticket ${ticketId}:`,
                    receipt.details?.error,
                  );
                  if (receipt.details?.error === 'DeviceNotRegistered') {
                    const token = ticketToTokenMap.get(ticketId);
                    if (token) {
                      await supabaseClient.from('push_tokens').delete().eq('token', token);
                      console.log(
                        `[Notification] Removed unregistered device token from receipt: ${token}`,
                      );
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error('[Notification] Error fetching receipts:', e);
          }
        }
      }
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

    const { user, error: authError } = await verifyAuth(req);
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
