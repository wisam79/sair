import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';

// Safety: Block production URL (zpcvvyxtmxzplmojobbv) under all conditions
const isProductionProject = SUPABASE_URL.includes('zpcvvyxtmxzplmojobbv');
const isHostedSupabase = SUPABASE_URL.includes('supabase.co');

if (isProductionProject) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  🚫 E2E TESTS BLOCKED (PRODUCTION PROTECTED)                    ║
╠══════════════════════════════════════════════════════════════════╣
║  Production URL detected: ${SUPABASE_URL}
║                                                                  ║
║  E2E tests are STRICTLY PROHIBITED from running against the       ║
║  PRODUCTION project (zpcvvyxtmxzplmojobbv) under any condition!  ║
║                                                                  ║
║  To fix:                                                        ║
║  Set EXPO_PUBLIC_SUPABASE_URL to a local or dev/test project ref.║
╚══════════════════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

if (isHostedSupabase && process.env.CI !== 'true') {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  🚫 E2E TESTS BLOCKED                                           ║
╠══════════════════════════════════════════════════════════════════╣
║  Hosted URL detected: ${SUPABASE_URL}
║                                                                  ║
║  E2E tests must run against a local Supabase emulator.          ║
║  To run tests locally, start your local Supabase emulator.      ║
║                                                                  ║
║  Or run with CI=true to bypass this check (in CI pipeline).     ║
╚══════════════════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Tests modify same data - run serially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for data consistency
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    trace: 'on-first-retry',
    baseURL: SUPABASE_URL,
    extraHTTPHeaders: {
      'x-test-source': 'e2e',
    },
  },
  projects: [
    {
      name: 'e2e-tests',
      testMatch: /.*\.test\.ts/,
      timeout: 60000, // 60s per test
    },
  ],
  globalSetup: process.env.CI ? undefined : './tests/e2e/setup/global-setup.ts',
  globalTeardown: process.env.CI ? undefined : './tests/e2e/setup/global-teardown.ts',
  webServer: {
    command: 'pnpm --filter admin-dashboard dev',
    url: 'http://localhost:3000/login',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  },
});
