import { createClient, User } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function verifyAuth(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Missing authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return { user: null, error: 'Invalid token' };
  }

  return { user, error: null };
}

const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

/**
 * Creates a Supabase client scoped to the authenticated user's JWT.
 * This ensures that any queries run through this client will respect Row Level Security (RLS) policies.
 */
export function getSupabaseUserClient(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing authorization header');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}
