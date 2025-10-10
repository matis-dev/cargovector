/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'firebase/auth': path.resolve(__dirname, './src/mocks/firebase-auth.ts'),
      '@/lib/firebase/client': path.resolve(__dirname, './src/mocks/firebase-client.ts'),
      'server-only': '/home/matis/Desktop/projects/cargovector/apps/web/src/mocks/server-only.ts',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  optimizeDeps: {
    include: ['firebase/auth'],
  },
});
