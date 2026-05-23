/**
 * Test Environment Configuration
 *
 * IMPORTANT: These tests MUST NOT run against production!
 * This file ensures all safety checks are in place.
 */

export const TestConfig = {
  /**
   * Safety: Block production URLs
   */
  isProduction(): boolean {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    return (
      url.includes('zpcvvyxtmxzplmojobbv') || // Production
      url.includes('supabase.co')
    ); // Any production domain
  },

  /**
   * Safety: Block if service role key is present (should only be in CI/CD)
   */
  hasServiceRoleKey(): boolean {
    return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  },

  /**
   * Validate environment before running tests
   */
  validate(): void {
    if (this.isProduction()) {
      throw new Error(
        `🚫 BLOCKED: E2E tests cannot run against production URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL}\n` +
          'Use: supabase link --project-ref pfjsqgqrxnrlrfnchnqf (local dev)\n' +
          'OR: Create a test branch with supabase create-branch',
      );
    }

    if (this.hasServiceRoleKey() && process.env.CI !== 'true') {
      console.warn('⚠️  WARNING: Service role key detected in non-CI environment');
    }
  },

  /**
   * Test data prefix - all test data should use this
   */
  TEST_PREFIX: 'E2E_TEST_',

  /**
   * Timeout for operations
   */
  TIMEOUT_MS: 30000,
};
