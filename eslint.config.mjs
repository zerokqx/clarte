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
            // 1. Ограничения по техническим типам (app / lib)
            {
              // Библиотеки (type:lib) не могут импортировать приложения (type:app)
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            {
              // Приложения (type:app) могут зависеть от библиотек (type:lib)
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:lib'],
            },

            // 2. Изоляция бизнес-доменов (scopes)
            // Приложения (микросервисы и шлюзы) не могут зависеть друг от друга напрямую,
            // они могут зависеть только от общих библиотек (shared-*)
            {
              sourceTag: 'scope:gateway',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-nest',
                'scope:shared-contracts',
                'scope:shared-domain',
                'scope:shared-event-types',
              ],
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-nest',
                'scope:shared-contracts',
                'scope:shared-domain',
                'scope:shared-event-types',
              ],
            },
            {
              sourceTag: 'scope:user',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-nest',
                'scope:shared-contracts',
                'scope:shared-domain',
                'scope:shared-event-types',
              ],
            },
            {
              sourceTag: 'scope:note',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-nest',
                'scope:shared-contracts',
                'scope:shared-domain',
                'scope:shared-event-types',
              ],
            },
            {
              sourceTag: 'scope:todo',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-nest',
                'scope:shared-contracts',
                'scope:shared-domain',
                'scope:shared-event-types',
              ],
            },
            {
              sourceTag: 'scope:notification',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-nest',
                'scope:shared-contracts',
                'scope:shared-domain',
                'scope:shared-event-types',
              ],
            },
            {
              // Фронтенд импортирует только разрешенные общие пакеты (без NestJS инфраструктуры)
              sourceTag: 'scope:frontend',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-domain',
                'scope:shared-contracts',
              ],
            },

            // 3. Чистота слоев внутри shared пакетов
            {
              // Доменный слой не зависит от NestJS инфраструктуры
              sourceTag: 'scope:shared-domain',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              // Контракты не зависят от NestJS инфраструктуры
              sourceTag: 'scope:shared-contracts',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:shared-domain'],
            },
            {
              // События не зависят от NestJS инфраструктуры
              sourceTag: 'scope:shared-event-types',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              // NestJS инфраструктура может зависеть от других shared-библиотек
              sourceTag: 'scope:shared-nest',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:shared-domain',
                'scope:shared-contracts',
                'scope:shared-event-types',
              ],
            },
            {
              // Fallback правило для всех остальных тегов, чтобы не блокировать их зависимости
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
