import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createServiceClient,
  createAuthenticatedClient,
  cleanupTestData,
  isDBAvailable,
} from '../helpers/test-helpers';

const runIntegration = isDBAvailable();

describe('DB Rate Limiting Integration Tests', () => {
  if (!runIntegration) {
    it.skip('Skipping integration tests: Supabase service role key not set', () => {});
    return;
  }

  let serviceClient: any;
  let student1: any;
  let student2: any;

  beforeAll(async () => {
    serviceClient = createServiceClient();
    student1 = await createAuthenticatedClient('student');
    student2 = await createAuthenticatedClient('student');
  });

  afterAll(async () => {
    // Clean up rate limits table for our test users
    if (student1?.user?.id) {
      await serviceClient.from('rate_limits').delete().eq('user_id', student1.user.id);
    }
    if (student2?.user?.id) {
      await serviceClient.from('rate_limits').delete().eq('user_id', student2.user.id);
    }
    await cleanupTestData();
  });

  it('should enforce the request limit and then reset when the window expires', async () => {
    const userId = student1.user.id;
    const action = 'test_action_1';
    const limit = 3;
    const windowSeconds = 5;

    // 1. First 3 requests should be allowed (return true)
    for (let i = 0; i < limit; i++) {
      const { data: allowed, error } = await serviceClient.rpc('check_rate_limit', {
        p_user_id: userId,
        p_action: action,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      });
      expect(error).toBeNull();
      expect(allowed).toBe(true);
    }

    // 2. 4th request should be rejected (return false)
    const { data: allowed4, error: err4 } = await serviceClient.rpc('check_rate_limit', {
      p_user_id: userId,
      p_action: action,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    expect(err4).toBeNull();
    expect(allowed4).toBe(false);

    // 3. Simulate window expiration by updating the timestamp of the rate limit rows to be older (1 hour ago, robust against clock drift)
    const olderTime = new Date(Date.now() - 3600 * 1000).toISOString();
    const { error: updateErr } = await serviceClient
      .from('rate_limits')
      .update({ window_start: olderTime })
      .eq('user_id', userId)
      .eq('action', action);

    expect(updateErr).toBeNull();

    // 4. Request should now be allowed again
    const { data: allowedAfterReset, error: errAfter } = await serviceClient.rpc(
      'check_rate_limit',
      {
        p_user_id: userId,
        p_action: action,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      },
    );
    expect(errAfter).toBeNull();
    expect(allowedAfterReset).toBe(true);
  });

  it('should keep different actions and different users isolated', async () => {
    const userId1 = student1.user.id;
    const userId2 = student2.user.id;
    const actionA = 'test_action_A';
    const actionB = 'test_action_B';
    const limit = 1;
    const windowSeconds = 60;

    // User 1 performs action A -> allowed
    const { data: allowed1 } = await serviceClient.rpc('check_rate_limit', {
      p_user_id: userId1,
      p_action: actionA,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    expect(allowed1).toBe(true);

    // User 1 performs action A again -> rejected
    const { data: allowed2 } = await serviceClient.rpc('check_rate_limit', {
      p_user_id: userId1,
      p_action: actionA,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    expect(allowed2).toBe(false);

    // User 1 performs action B -> allowed (isolated action)
    const { data: allowed3 } = await serviceClient.rpc('check_rate_limit', {
      p_user_id: userId1,
      p_action: actionB,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    expect(allowed3).toBe(true);

    // User 2 performs action A -> allowed (isolated user)
    const { data: allowed4 } = await serviceClient.rpc('check_rate_limit', {
      p_user_id: userId2,
      p_action: actionA,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    expect(allowed4).toBe(true);
  });
});
