import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/yjs': {
        target: 'ws://localhost:5006',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
