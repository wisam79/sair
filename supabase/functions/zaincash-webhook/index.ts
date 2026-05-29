import { supabaseAdmin } from '../_shared/auth.ts';
import * as jose from 'npm:jose';
import { getZainCashConfig } from '../_shared/zaincash.ts';

/**
 * Validates a redirect URL against an allowed whitelist to prevent open redirect attacks.
 * Only 'sair://' deep links and the configured admin URL origin are permitted.
 */
function isAllowedRedirectUrl(url: string): boolean {
  const ALLOWED_SCHEMES = ['sair://'];
  const adminUrl = Deno.env.get('ADMIN_URL');

  // Allow deep links with the app scheme
  if (ALLOWED_SCHEMES.some((scheme) => url.startsWith(scheme))) {
    return true;
  }

  // Allow the configured admin URL origin
  if (adminUrl) {
    try {
      const adminOrigin = new URL(adminUrl).origin;
      const targetOrigin = new URL(url).origin;
      return adminOrigin === targetOrigin;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Escape HTML special characters to prevent XSS injection.
 * Applied to any user-controlled or JWT-derived values rendered into HTML.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSuccessHtml(rawOrderId: string, returnUrl: string) {
  const orderId = escapeHtml(rawOrderId);
  const separator = returnUrl.includes('?') ? '&' : '?';
  const finalLink = escapeHtml(`${returnUrl}${separator}status=success&order_id=${rawOrderId}`);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>تم الدفع بنجاح</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f7fafc; color: #2d3748; }
          .card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); text-align: center; max-width: 400px; width: 90%; }
          .icon { width: 64px; height: 64px; background: #c6f6d5; color: #38a169; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 1.5rem; font-weight: bold; }
          h2 { margin: 0 0 0.5rem; font-size: 24px; color: #1a202c; }
          p { margin: 0 0 1.5rem; color: #718096; line-height: 1.5; }
          .btn { background: #16a34a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; font-size: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✓</div>
          <h2>تم الدفع بنجاح</h2>
          <p>تم تفعيل اشتراكك وحجز مقعدك بنجاح! سيتم إرجاعك للتطبيق الآن.</p>
          <a class="btn" href="${finalLink}">العودة للتطبيق</a>
        </div>
        <script>
          setTimeout(function() {
            window.location.href = "${finalLink}";
          }, 2500);
        </script>
      </body>
    </html>
  `;
}

function renderErrorHtml(rawReason: string, returnUrl: string, rawOrderId?: string) {
  const reason = escapeHtml(rawReason);
  const orderId = rawOrderId ? escapeHtml(rawOrderId) : undefined;
  const separator = returnUrl.includes('?') ? '&' : '?';
  const rawDeepLink = `${returnUrl}${separator}status=failed&reason=${rawReason}${rawOrderId ? `&order_id=${rawOrderId}` : ''}`;
  const deepLink = escapeHtml(rawDeepLink);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>فشل عملية الدفع</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f7fafc; color: #2d3748; }
          .card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); text-align: center; max-width: 400px; width: 90%; }
          .icon { width: 64px; height: 64px; background: #fed7d7; color: #e53e3e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 1.5rem; font-weight: bold; }
          h2 { margin: 0 0 0.5rem; font-size: 24px; color: #1a202c; }
          p { margin: 0 0 1.5rem; color: #718096; line-height: 1.5; }
          .btn { background: #e53e3e; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; font-size: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✗</div>
          <h2>فشل عملية الدفع</h2>
          <p>عذراً، لم تكتمل عملية الدفع أو حدث خطأ أثناء تفعيل الاشتراك. رمز الخطأ: ${reason}</p>
          <a class="btn" href="${deepLink}">العودة للتطبيق</a>
        </div>
        <script>
          setTimeout(function() {
            window.location.href = "${deepLink}";
          }, 3000);
        </script>
      </body>
    </html>
  `;
}

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(renderErrorHtml('missing_token', 'sair://payment'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Setup ZainCash secret via Shared Config Manager
    const { clientSecret: zaincashSecret } = getZainCashConfig();

    const secretKey = new TextEncoder().encode(zaincashSecret);

    let payload: any;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, secretKey);
      payload = decoded;
    } catch (jwtErr) {
      console.error('[ZainCash Webhook] JWT verification failed:', jwtErr);
      return new Response(renderErrorHtml('signature_invalid', 'sair://payment'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // V2 payload wraps transaction details in the "data" object
    const txData = payload.data;
    if (!txData) {
      console.error('[ZainCash Webhook] JWT payload missing data object:', payload);
      return new Response(renderErrorHtml('invalid_payload_format', 'sair://payment'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const currentStatus = txData.currentStatus;
    const orderId = txData.orderId;

    if (!orderId) {
      return new Response(renderErrorHtml('missing_order_id', 'sair://payment'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Dynamic returnUrl detection via audit logs
    let returnUrl = 'sair://payment';
    try {
      const fromObj = supabaseAdmin.from('payments');
      if (fromObj && typeof fromObj.select === 'function') {
        const { data: paymentRow } = await fromObj
          .select('id')
          .eq('zaincash_order_id', orderId)
          .maybeSingle();

        // Guard against the mock client returned in unit tests
        if (paymentRow && typeof paymentRow.id === 'string') {
          const { data: auditLog } = await supabaseAdmin
            .from('audit_logs')
            .select('details')
            .eq('resource', 'payments')
            .eq('resource_id', paymentRow.id)
            .eq('action', 'checkout_initiated')
            .maybeSingle();

          const customUrl = auditLog?.details?.redirect_url;
          if (customUrl && isAllowedRedirectUrl(customUrl)) {
            returnUrl = customUrl;
          } else if (customUrl) {
            console.warn('[ZainCash Webhook] Rejected unsafe redirect URL:', customUrl);
          }
        }
      }
    } catch (err) {
      console.warn('[ZainCash Webhook] Failed to fetch custom redirect url:', err);
    }

    const isSuccess = currentStatus?.toUpperCase() === 'SUCCESS';

    if (isSuccess) {
      try {
        // Check for idempotency: if payment is already completed, return success html immediately
        const { data: existingPayment } = await supabaseAdmin
          .from('payments')
          .select('status')
          .eq('zaincash_order_id', orderId)
          .maybeSingle();

        // Safely check status (guarding against mock client)
        if (existingPayment && existingPayment.status === 'completed') {
          console.warn(
            '[ZainCash Webhook] Idempotency triggered: Payment already completed for orderId:',
            orderId,
          );
          return new Response(renderSuccessHtml(orderId, returnUrl), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        // Complete the payment and activate subscription atomically
        const { data: paymentRes, error: rpcError } = await supabaseAdmin.rpc(
          'complete_payment_and_activate_subscription',
          {
            p_zaincash_order_id: orderId,
            p_valid_days: 30,
          },
        );

        if (rpcError) {
          console.error('[ZainCash Webhook] Database RPC failed:', rpcError.message);
          return new Response(renderErrorHtml('activation_failed', returnUrl, orderId), {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        if (paymentRes?.status === 'refund_pending') {
          console.error(
            '[ZainCash Webhook] Payment requires refund after activation failure:',
            orderId,
          );
          return new Response(renderErrorHtml('refund_pending', returnUrl, orderId), {
            status: 409,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      } catch (dbErr: any) {
        console.error('[ZainCash Webhook] DB exception:', dbErr);
        return new Response(renderErrorHtml('db_exception', returnUrl, orderId), {
          status: 500,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      return new Response(renderSuccessHtml(orderId, returnUrl), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    } else {
      // Mark payment as failed and release the reserved license/seat.
      try {
        await supabaseAdmin.rpc('release_payment_hold', {
          p_zaincash_order_id: orderId,
          p_status: 'failed',
        });
      } catch (updateErr) {
        console.warn('[ZainCash Webhook] Failed to release failed payment hold:', updateErr);
      }

      const errMsg = txData.errorMessage || 'payment_failed_at_zaincash';
      return new Response(renderErrorHtml(errMsg, returnUrl, orderId), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[ZainCash Webhook] Internal Error:', message);
    return new Response(renderErrorHtml('internal_server_error', 'sair://payment'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
});
