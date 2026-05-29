import { corsResponse } from '../_shared/cors.ts';
import { verifyAuthLocal } from '../_shared/auth.ts';
import { StreamChat } from 'npm:stream-chat';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok');
  }

  try {
    const { user, error: authError } = await verifyAuthLocal(req);
    if (authError || !user) {
      return corsResponse(req, { error: authError || 'Invalid token' }, 401);
    }

    const STREAM_APP_KEY = Deno.env.get('STREAM_APP_KEY');
    const STREAM_APP_SECRET = Deno.env.get('STREAM_APP_SECRET');

    if (!STREAM_APP_KEY || !STREAM_APP_SECRET) {
      console.warn('[StreamChatToken] Stream app credentials missing. Returning simulated token.');
      return corsResponse(req, {
        token: `simulated-stream-token-for-${user.id}`,
        apiKey: 'simulated-key',
      });
    }

    const serverClient = StreamChat.getInstance(STREAM_APP_KEY, STREAM_APP_SECRET);
    const token = serverClient.createToken(user.id);

    return corsResponse(req, {
      token,
      apiKey: STREAM_APP_KEY,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return corsResponse(req, { error: message }, 500);
  }
});
