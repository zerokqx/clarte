# Генераторы CQRS (Commands & Queries)

В проекте настроены удобные генераторы для быстрого создания CQRS-команд (Commands) и запросов (Queries) с использованием Nx. Они автоматически генерируют всю необходимую файловую структуру и бойлерплейт-код в слое `src/application/`.

---

## 🛠️ Генерация Команд (Commands)

Команды используются для изменения состояния домена (например, создание, редактирование или удаление сущностей).

Для генерации новой команды выполните следующую команду в корне проекта:

```bash
pnpm nx run @clarte/source:cqrs:command --name=<имя-команды> --service=<имя-сервиса>
```

### Пример использования:
```bash
pnpm nx run @clarte/source:cqrs:command --name=create-todo --service=todo-service
```

### Сгенерированная структура файлов:
В директории `apps/todo-service/src/application/commands/create-todo/` будут созданы:
1. `create-todo.command.ts` — класс команды (наследуется от `Command`).
2. `create-todo.handler.ts` — класс обработчика команды (декорирован `@CommandHandler(...)`).
3. `index.ts` — barrel-экспорт для удобного импорта.

---

## 🔍 Генерация Запросов (Queries)

Запросы используются исключительно для чтения и отображения состояния (Query Model).

Для генерации нового запроса выполните команду:

```bash
pnpm nx run @clarte/source:cqrs:query --name=<имя-запроса> --service=<имя-сервиса>
```

### Пример использования:
```bash
pnpm nx run @clarte/source:cqrs:query --name=get-user-todos --service=todo-service
```

### Сгенерированная структура файлов:
В директории `apps/todo-service/src/application/queries/get-user-todos/` будут созданы:
1. `get-user-todos.query.ts` — класс запроса (реализует `Query`).
2. `get-user-todos.handler.ts` — класс обработчика запроса (декорирован `@QueryHandler(...)`).
3. `index.ts` — barrel-экспорт.

---

## 💡 Важные шаги после генерации

Для того чтобы NestJS узнал о существовании новых обработчиков, их необходимо зарегистрировать в модуле вашего микросервиса (например, в `app.module.ts` или соответствующем функциональном модуле):

1. Добавьте созданный обработчик в массив провайдеров (`providers`):
   ```typescript
   import { CreateTodoHandler } from './application/commands/create-todo';

   @Module({
     providers: [CreateTodoHandler],
   })
   export class AppModule {}
   ```
2. Теперь вы можете вызывать команду через шину CQRS (`CommandBus` или `QueryBus`):
   ```typescript
   constructor(private readonly commandBus: CommandBus) {}

   async create() {
     return this.commandBus.execute(new CreateTodoCommand(...));
   }
   ```
