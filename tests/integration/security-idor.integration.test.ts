import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createServiceClient,
  createAuthenticatedClient,
  cleanupTestData,
  isDBAvailable,
} from '../helpers/test-helpers';

const runIntegration = isDBAvailable();

describe('Security: IDOR Protection Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let studentA: any;
  let studentB: any;

  beforeAll(async () => {
    serviceClient = createServiceClient();
    studentA = await createAuthenticatedClient('student');
    studentB = await createAuthenticatedClient('student');
  });

  afterAll(async () => {
    if (studentA?.user?.id) {
      await serviceClient.from('rate_limits').delete().eq('user_id', studentA.user.id);
    }
    if (studentB?.user?.id) {
      await serviceClient.from('rate_limits').delete().eq('user_id', studentB.user.id);
    }
    await cleanupTestData();
  });

  describe('check_rate_limit IDOR & Role-Level Access Protection', () => {
    it('should prevent authenticated users from calling check_rate_limit directly (role-level restriction)', async () => {
      const { data, error } = await studentA.client.rpc('check_rate_limit', {
        p_user_id: studentA.user.id,
        p_action: 'test_own_action',
        p_limit: 10,
        p_window_seconds: 60,
      });
      expect(error).not.toBeNull();
      // PostgREST returns PGRST202 (function not found for role) when EXECUTE is revoked from authenticated.
      // This is equivalent to 42501 (permission denied) — the function is hidden, not exposed.
      expect(['42501', 'PGRST202']).toContain(error.code);
      expect(data).toBeNull();
    });

    it('should prevent authenticated users from checking another user rate limit (role-level restriction)', async () => {
      const { data, error } = await studentA.client.rpc('check_rate_limit', {
        p_user_id: studentB.user.id,
        p_action: 'test_victim_action',
        p_limit: 5,
        p_window_seconds: 300,
      });
      expect(error).not.toBeNull();
      expect(['42501', 'PGRST202']).toContain(error.code);
      expect(data).toBeNull();
    });

    it('should prevent user A from affecting user B rate limit (full isolation)', async () => {
      const action = `test_exhaust_${Date.now()}`;

      // 1. Try to call check_rate_limit as user A to target user B — should fail (permission denied or not found)
      const { error: attackError } = await studentA.client.rpc('check_rate_limit', {
        p_user_id: studentB.user.id,
        p_action: action,
        p_limit: 2,
        p_window_seconds: 300,
      });
      expect(attackError).not.toBeNull();
      expect(['42501', 'PGRST202']).toContain(attackError.code);

      // 2. Verify that user B's actual rate limit check (performed via serviceClient) works and is not affected by user A's blocked attempts
      const { data: allowed, error } = await serviceClient.rpc('check_rate_limit', {
        p_user_id: studentB.user.id,
        p_action: action,
        p_limit: 2,
        p_window_seconds: 300,
      });
      expect(error).toBeNull();
      expect(allowed).toBe(true);

      // Clean up rate limits
      await serviceClient
        .from('rate_limits')
        .delete()
        .eq('user_id', studentB.user.id)
        .eq('action', action);
    });
  });
});
