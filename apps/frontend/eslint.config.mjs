import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';
export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
