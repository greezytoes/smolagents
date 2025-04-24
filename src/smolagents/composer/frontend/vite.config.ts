import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@store': '/src/store',
      '@types': '/src/types',
      '@utils': '/src/utils',
      '@styles': '/src/styles',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
});