/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig(({ mode }) => {
  const APP = './src/app';
  const env = loadEnv(mode, import.meta.dirname, '');
  const port = parseInt(env.VITE_PORT || '4200', 10);
  const host = env.VITE_HOST || 'localhost';
  const backendPort = env.VITE_BACKEND_PORT || '5000';
  const backendHost = env.VITE_BACKEND_HOST || 'localhost';
  const proxyTarget = `http://${backendHost}:${backendPort}`;

  return {
    root: import.meta.dirname,
    cacheDir: '../node_modules/.vite/frontend',
    resolve: { tsconfigPaths: true },
    server: {
      port: port,
      host: host,
      allowedHosts: ['.lhr.life'],
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: port,
      host: host,
    },

    plugins: [
      tanstackRouter({
        target: 'react',
        generatedRouteTree: APP + '/route-tree.gen.ts',
        autoCodeSplitting: true,
        routesDirectory: APP + '/routes',
      }),
      react(),
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      name: '@clarte/frontend',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  };
});
