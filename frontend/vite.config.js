import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    plugins: [react()],
    define: {
      global: 'window',
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress circular dependency warnings from @stomp/stompjs (pre-existing, harmless)
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          // Suppress "can't move module into another chunk" from dynamic imports
          if (warning.message && warning.message.includes('not move module into another chunk')) return;
          warn(warning);
        },
        output: {
          manualChunks: {
            // Vendor chunks — split heavy libs into separate cacheable files
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
            'ws-vendor': ['@stomp/stompjs', 'sockjs-client'],
          }
        }
      },
      // Raised from 1500 — heavy WS libs exceed the previous limit
      chunkSizeWarningLimit: 4000,
      sourcemap: false
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: env.VITE_API_URL || 'http://localhost:8081',
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      css: true,
    },
  });
};