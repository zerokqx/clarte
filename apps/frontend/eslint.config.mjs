import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';
import effector from 'eslint-plugin-effector';

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
    ...effector.flatConfigs.react,
    files: ['src/**/*.ts', 'src/**/*.tsx'],
  },
  {
    ...effector.flatConfigs.recommended,
    files: ['src/**/*.ts', 'src/**/*.tsx'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
