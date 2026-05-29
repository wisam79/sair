import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required environment variables:\n' +
      'NEXT_PUBLIC_SUPABASE_URL: ' +
      (supabaseUrl ? '✓' : '✗') +
      '\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY: ' +
      (supabaseAnonKey ? '✓' : '✗'),
  );
}

// Client-side/Browser client
export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side client (only to be called from Server Components/Actions/Route Handlers)
export async function createClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: Record<string, string | number | boolean | Date | undefined>;
        }>,
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as any);
          });
        } catch {
          // Can be ignored if middleware is handling cookie refreshes
        }
      },
    },
  });
}
