import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  // ==================== DDD ARCHITECTURE BOUNDARIES ====================

  // 1. Правила для DOMAIN (Абсолютное ядро. Не зависит НИ ОТ ЧЕГО, кроме себя)
  {
    files: ['**/src/domain/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/application',
                '**/application/**',
                '**/infrastructure',
                '**/infrastructure/**',
              ],
              message:
                'Доменный слой (Domain) — это ядро. Он не должен зависеть от Application или Infrastructure слоев.',
            },
            {
              group: ['../**/*application*', '../**/*infrastructure*'],
              message: 'Запрещено использовать относительные импорты наружу из Domain.',
            },
          ],
        },
      ],
    },
  },

  // 2. Правила для APPLICATION (Бизнес-логика. Зависит только от Domain)
  {
    files: ['**/src/application/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure', '**/infrastructure/**'],
              message:
                'Слой приложения (Application) управляет бизнес-логикой и не должен зависеть от деталей реализации в Infrastructure.',
            },
            {
              group: ['../**/*infrastructure*'],
              message:
                'Запрещено использовать относительные импорты наружу из Application в сторону Infrastructure.',
            },
          ],
        },
      ],
    },
  },

  // 3. Слой INFRASTRUCTURE (Внешний слой. Может импортировать Domain и Application)
  // Здесь no-restricted-imports не нужен, так как импорты идут внутрь.

  // ======================================================================

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {},
  },
];
