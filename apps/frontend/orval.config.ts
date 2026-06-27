import { defineConfig } from 'orval';
import { env } from 'process';

const backendPort = env.VITE_BACKEND_PORT ?? 5000;
const backendHost = env.VITE_BACKEND_HOST ?? 'localhost';
const backendUrl = `http://${backendHost}:${backendPort}/docs-json`;

export default defineConfig({
  clarte: {
    input: backendUrl,
    output: {
      namingConvention: 'kebab-case',
      indexFiles: true,
      httpClient: 'axios',
      target: './src/shared/api/orval/generated/endpoints/',
      tagsSplitDeduplication: true,
      schemas: './src/shared/api/orval/generated/model',
      client: 'react-query',
      mode: 'tags-split',
      mock: true,
      override: {
        mutator: {
          path: './src/shared/api/orval/axios-custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
