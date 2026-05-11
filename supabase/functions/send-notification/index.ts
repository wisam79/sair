import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify user is auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    const { targetUserId, title, body, data } = await req.json();
    if (!targetUserId || !title || !body) {
      throw new Error('Missing required fields');
    }

    // Initialize admin client to read push_tokens table
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the target user's push token
    const { data: pushTokens, error: tokenError } = await supabaseAdmin
      .from('push_tokens')
      .select('token')
      .eq('user_id', targetUserId);

    if (tokenError) throw tokenError;

    if (!pushTokens || pushTokens.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'User has no push token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Not an error of our system, just no token
      });
    }

    const expoPushToken = pushTokens[0].token;

    // Send push notification via Expo Push API
    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
      }),
    });

    const expoResult = await expoResponse.json();

    return new Response(JSON.stringify({ success: true, expoResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
