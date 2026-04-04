import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Check if we're building the library or running the demo
const isDemo = process.env.NODE_ENV === 'demo';

export default defineConfig({
  plugins: [
    react(),
    !isDemo && dts({
      insertTypesEntry: true,
    }),
  ].filter(Boolean),
  
  // Different config for library vs demo
  ...(isDemo ? {
    // Demo config
    root: 'demo',
    build: {
      outDir: 'dist-demo',
      emptyOutDir: true,
    },
    server: {
      port: 5175,
      open: true,
    },
  } : {
    // Library config
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'SpriteManager',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'cjs']
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      }
    },
  }),
  
  // Common config
  resolve: {
    alias: {
      '@sprite-manager': resolve(__dirname, 'src'),
    },
  },
});