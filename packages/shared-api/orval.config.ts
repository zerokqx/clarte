import { defineConfig } from 'orval';
import { env } from 'process';

export default defineConfig({
  clarte: {
    input: env.OPENAPI_URL,
    output: {
      namingConvention: 'kebab-case',
      indexFiles: true,
      httpClient: 'axios',
      target: './src/generated/endpoints/',
      tagsSplitDeduplication: true,
      schemas: './src/generated/model',
      client: 'react-query',
      mode: 'tags-split',
      mock: true,
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
