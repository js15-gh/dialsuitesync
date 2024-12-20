/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/src/setupTests.ts'],
    include: ['client/src/**/*.{test,spec}.{ts,tsx}', 'server/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['client/src/**/*.{ts,tsx}', 'server/**/*.ts'],
      exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.test.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': '/client/src',
      '@db': '/db'
    },
  },
});
