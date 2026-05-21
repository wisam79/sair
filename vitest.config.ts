import { defineConfig } from 'vitest/config';

const excludePatterns = ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/.next/**'];

if (!process.env.RUN_INTEGRATION_TESTS) {
  excludePatterns.push('**/tests/integration/**');
}

export default defineConfig({
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
    },
  },
});

