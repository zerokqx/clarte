# Диагностика и репортинг ошибки сборки Nx Webpack (api-gateway)

## Описание проблемы

При выполнении команды `nx build api-gateway` в проекте после переноса зависимостей из корневого `package.json` в `pnpm catalog` возникают две связанные проблемы:

1. **Падение Nx с ошибкой `TypeError: Cannot read properties of undefined (reading 'data')`** при включенной опции `generatePackageJson: true` в `apps/api-gateway/webpack.config.js`.
2. **Ошибки разрешения модулей Webpack (`Module not found`)** при получении внешних зависимостей (например, `class-transformer/storage`, `kafkajs`, `mqtt`, `nats`, `@nestjs/platform-socket.io`) при отключении или неполной работе генерации `package.json` / внешней упаковки.

---

## Полный анализ причин (Root Cause Analysis)

### 1. Ошибка `generatePackageJson: true` (`TypeError: ... reading 'data'`)

- **Где происходит**: В файле Nx `nx/dist/src/plugins/js/package-json/create-package-json.js` в функции `findProjectsNpmDependencies`:
  ```javascript
  options.helperDependencies?.forEach((dep) => {
    seen.add(dep);
    npmDeps.dependencies[graph.externalNodes[dep].data.packageName] =
      graph.externalNodes[dep].data.version;
    recursivelyCollectPeerDependencies(dep, graph, npmDeps, seen);
  });
  ```
- **Почему происходит**:
  - `@nx/webpack` автоматически добавляет вспомогательные пакеты сборки (такие как `'npm:tslib'` и `'npm:@swc/helpers'`) в массив `helperDependencies`.
  - Граф проекта Nx (`graph.externalNodes`) сканирует корневой `package.json` для построения узлов внешних npm-пакетов.
  - При переходе на `pnpm catalog` и очистке корневого `package.json` вспомогательные пакеты (в особенности `@swc/helpers` и `tslib`) исчезли из корневого `package.json`.
  - Из-за этого Nx не добавил их в `graph.externalNodes`. При попытке обратиться к `graph.externalNodes['npm:@swc/helpers']` возвращается `undefined`, а обращение к свойству `.data` приводит к необработанному `TypeError`.

- **Почему раньше работало**: Раньше все вспомогательные пакеты (`@swc/helpers`, `tslib` и др.) находились напрямую в корневом `package.json` (`dependencies` / `devDependencies`), и Nx успешно находил их в `graph.externalNodes`.

---

### 2. Ошибки сборки Webpack (`Module not found: Can't resolve 'kafkajs'`, etc.)

- **Где происходит**: В Webpack при сжатии/анализе импортов внутри `@nestjs/microservices`, `@nestjs/websockets` и `@nestjs/mapped-types`.
- **Почему происходит**:
  - Пакеты NestJS используют динамические опциональные импорты (определённые драйверы брокеров сообщений, websockets адаптеры и т.д.), которые не установлены в проекте, если они не используются.
  - В `pnpm-workspace.yaml` включена строгая изоляция `hoist: false`.
  - Плагин `@nx/webpack` генерирует список `externals` (внешних зависимостей, которые Webpack не должен бандилить) на основе `graph.externalNodes` из графа Nx.
  - Когда корневой `package.json` опустел, Nx перестал распознавать эти внешние пакеты как часть графа externals, и Webpack попытался построить полный бандл, парся все динамические `require()` внутри `node_modules`. В результате Webpack натыкается на отсутствующие опциональные модули.

---

## Решения (Способы исправления)

_Примечание: Согласно требованиям, `webpack.IgnorePlugin` **не используется**._

### Способ 1 (Рекомендуемый): Оставить системные/хелпер зависимости в корневом `package.json`

Nx рассчитывает на то, что базовые хелперы компилятора (`@swc/helpers`, `tslib`, `@nx/devkit`, `nx`) объявлены в корневом `package.json` (в `devDependencies`).

1. Добавьте в корневой `package.json` в `devDependencies`:
   ```json
   "devDependencies": {
     "@swc/helpers": "catalog:swc",
     "tslib": "catalog:general"
   }
   ```
2. Это позволит Nx построить корректный `graph.externalNodes` для `tslib` и `@swc/helpers`, что мгновенно устранит падение `generatePackageJson: true`.

---

### Способ 2: Настройка `externalDependencies` и node externals в `webpack.config.js`

Для Node.js микросервисов все зависимости из `node_modules` должны исключаться из бандлинга на уровне Webpack Node externals:

1. В `apps/api-gateway/webpack.config.js` убедитесь, что настроен параметр `externalDependencies: 'all'`:
   ```javascript
   const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
   const { join } = require('path');

   module.exports = {
     output: {
       path: join(__dirname, 'dist'),
       clean: true,
     },
     plugins: [
       new NxAppWebpackPlugin({
         target: 'node',
         compiler: 'tsc',
         main: './src/main.ts',
         tsConfig: './tsconfig.app.json',
         assets: ['./src/assets'],
         optimization: false,
         outputHashing: 'none',
         externalDependencies: 'all',
         generatePackageJson: true,
         sourceMap: true,
       }),
     ],
   };
   ```
2. Если `externalDependencies: 'all'` пропускает динамические импорты NestJS из-за pnpm catalogs, можно подключить `webpack-node-externals` напрямую в `webpack.config.js`:
   ```javascript
   const nodeExternals = require('webpack-node-externals');

   module.exports = {
     // ...
     externals: [nodeExternals()],
   };
   ```

---

### Способ 3: Добавление явных зависимостей в `apps/api-gateway/package.json`

Убедитесь, что все прямые зависимости `@clarte/api-gateway` (например, `class-transformer`, `class-validator`, `@nestjs/microservices`, `@grpc/grpc-js`) явно указаны в `apps/api-gateway/package.json`, чтобы pnpm и Nx корректно связывали их локальные графы.
