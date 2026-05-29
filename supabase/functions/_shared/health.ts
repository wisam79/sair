import { corsResponse } from './cors.ts';

/**
 * Checks if the request is a health check request.
 * If yes, it returns a 200 OK Response. Otherwise, it returns null.
 */
export async function handleHealthCheck(req: Request): Promise<Response | null> {
  try {
    if (req.method === 'POST') {
      const clonedReq = req.clone();
      const body = await clonedReq.json();
      if (body && body.action === 'health') {
        return corsResponse(req, { status: 'healthy', timestamp: new Date().toISOString() });
      }
    }
  } catch {
    // Ignore and return null (not a valid JSON health check)
  }
  return null;
}
