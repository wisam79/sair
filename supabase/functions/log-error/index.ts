import { corsResponse } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return corsResponse(req, 'ok', 200, true);
  }

  try {
    const entry = await req.json();
    if (!entry || !entry.level || !entry.message) {
      return corsResponse(req, { error: 'Invalid log entry' }, 400, true);
    }

    // Print to Deno console, which Supabase aggregates into its logs dashboard automatically
    const levelStr = String(entry.level).toUpperCase();
    const contextStr = entry.context ? JSON.stringify(entry.context) : '';
    console.warn(`[Client Log - ${levelStr}] ${entry.message}`, contextStr);

    return corsResponse(req, { success: true }, 200, true);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return corsResponse(req, { error: message }, 500, true);
  }
});
