import { composePlugins } from '@nx/rspack';
import { IgnorePlugin } from '@rspack/core';
import { join } from 'path';

export default {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxRspackPlugin({
      target: 'node',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        './src/assets',
        {
          input: join(__dirname, '../../packages/shared-contracts/src/ports/proto'),
          glob: '**/*.proto',
          output: 'proto',
        },
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),

    // Игнорируем опциональные ленивые импорты NestJS
    new IgnorePlugin({
      checkResource(resource: string) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ];

        if (!lazyImports.includes(resource)) {
          return false;
        }

        try {
          require.resolve(resource, { paths: [process.cwd()] });
          return false;
        } catch {
          return true;
        }
      },
    }),
  ],
};
