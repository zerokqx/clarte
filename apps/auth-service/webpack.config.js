const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(!prod && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      useTsconfigPaths: true,
      target: 'node',
      compiler: 'tsc',
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
      optimization: prod,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],
};
