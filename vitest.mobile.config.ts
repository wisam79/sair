import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@sair/core': path.resolve(__dirname, 'packages/core'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./apps/mobile/src/test-setup.ts'],
    include: ['apps/mobile/src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: false,
      include: ['apps/mobile/src/**'],
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
