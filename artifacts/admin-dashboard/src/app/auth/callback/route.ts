import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const ALLOWED_REDIRECT_PATHS = [
  '/dashboard',
  '/dashboard/users',
  '/dashboard/routes',
  '/dashboard/subscriptions',
  '/dashboard/trips',
  '/dashboard/analytics',
];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/dashboard';

  if (!ALLOWED_REDIRECT_PATHS.includes(next)) {
    next = '/dashboard';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
