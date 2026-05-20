import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./apps/mobile/src/test-setup.ts'],
    include: ['apps/mobile/src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    resolve: {
      alias: {
        '@uniride/core': path.resolve(__dirname, 'packages/core'),
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/*.config.ts',
        '**/*.test.ts',
        '**/*.d.ts',
        'apps/mobile/src/test-setup.ts',
      ],
    },
  },
});
