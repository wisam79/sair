import { supabaseAdmin } from '../_shared/auth.ts';
import * as jose from 'npm:jose';

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

function renderSuccessHtml(rawOrderId: string) {
  const orderId = escapeHtml(rawOrderId);
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
          <a class="btn" href="sair://payment?status=success&order_id=${orderId}">العودة للتطبيق</a>
        </div>
        <script>
          setTimeout(function() {
            window.location.href = "sair://payment?status=success&order_id=${orderId}";
          }, 2500);
        </script>
      </body>
    </html>
  `;
}

function renderErrorHtml(rawReason: string, rawOrderId?: string) {
  const reason = escapeHtml(rawReason);
  const orderId = rawOrderId ? escapeHtml(rawOrderId) : undefined;
  const deepLink = `sair://payment?status=failed&reason=${encodeURIComponent(rawReason)}${rawOrderId ? `&order_id=${encodeURIComponent(rawOrderId)}` : ''}`;
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
      return new Response(renderErrorHtml('missing_token'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Setup ZainCash secret — MUST be set via environment variable
    const zaincashSecret = Deno.env.get('ZAINCASH_SECRET');
    if (!zaincashSecret) {
      console.error('[ZainCash Webhook] ZAINCASH_SECRET environment variable is not set');
      return new Response(renderErrorHtml('config_error'), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
    const secretKey = new TextEncoder().encode(zaincashSecret);

    let payload: any;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, secretKey);
      payload = decoded;
    } catch (jwtErr) {
      console.error('[ZainCash Webhook] JWT verification failed:', jwtErr);
      return new Response(renderErrorHtml('signature_invalid'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const { status, orderId } = payload;

    if (!orderId) {
      return new Response(renderErrorHtml('missing_order_id'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (status === 'success') {
      try {
        // Check for idempotency: if payment is already completed, return success html immediately
        const { data: existingPayment } = await supabaseAdmin
          .from('payments')
          .select('status')
          .eq('zaincash_order_id', orderId)
          .maybeSingle();

        if (existingPayment?.status === 'completed') {
          console.warn('[ZainCash Webhook] Idempotency triggered: Payment already completed for orderId:', orderId);
          return new Response(renderSuccessHtml(orderId), {
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
          return new Response(renderErrorHtml('activation_failed', orderId), {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      } catch (dbErr: any) {
        console.error('[ZainCash Webhook] DB exception:', dbErr);
        return new Response(renderErrorHtml('db_exception', orderId), {
          status: 500,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      return new Response(renderSuccessHtml(orderId), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    } else {
      // Mark payment as failed in DB
      try {
        await supabaseAdmin
          .from('payments')
          .update({ status: 'failed', updated_at: new Date() })
          .eq('zaincash_order_id', orderId);
      } catch (updateErr) {
        console.warn('[ZainCash Webhook] Failed to update payment status to failed:', updateErr);
      }

      return new Response(renderErrorHtml('payment_failed_at_zaincash', orderId), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[ZainCash Webhook] Internal Error:', message);
    return new Response(renderErrorHtml('internal_server_error'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
});
