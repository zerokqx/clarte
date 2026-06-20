import { defineConfig } from 'orval';

export default defineConfig({
  clarteApi: {
    input: {
      target: 'http://localhost:5000/docs-json',
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated',
      schemas: './src/shared/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      indexFiles: true,
      clean: true,
      override: {
        mutator: {
          path: './src/shared/api/axios-instance.ts',
          name: 'customInstance', // должно совпадать с именем экспорта в axios-instance.ts
        },
      },
    },
  },
});
