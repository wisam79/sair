import { defineConfig } from 'vitest/config';

const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/e2e/**',
  '**/.next/**',
  '**/apps/mobile/**',
];

if (!process.env.RUN_INTEGRATION_TESTS) {
  excludePatterns.push('**/tests/integration/**');
}

export default defineConfig({
  resolve: {
    alias: {
      'https://esm.sh/@supabase/supabase-js@2': '@supabase/supabase-js',
      'jsr:@supabase/supabase-js@2': '@supabase/supabase-js',
      'https://esm.sh/jose@5': 'jose',
      'npm:jose': 'jose',
      'https://esm.sh/expo-server-sdk': 'expo-server-sdk',
      'npm:expo-server-sdk': 'expo-server-sdk',
      'npm:stream-chat': 'stream-chat',
    },
  },
  test: {
    globals: true,
    environment: 'node',
    exclude: excludePatterns,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: false,
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.d.ts',
        '**/e2e/**',
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 70,
        statements: 80,
      },
    },
  },
});
