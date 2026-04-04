import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@sprite-manager': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5175,
    open: true,
  },
});