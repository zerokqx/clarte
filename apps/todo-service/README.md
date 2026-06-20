# Todo Service

## Описание
Микросервис задач (Todo Service) на базе NestJS и gRPC. Управляет списками задач (TODO):
- CRUD операции над задачами (создание, обновление, удаление, получение)
- Настройка дедлайнов и напоминаний
- Публикация событий-напоминаний (`todo.todo.event.reminder`) в RabbitMQ

## Запуск
```sh
# Разработка
pnpm nx serve todo-service

# Сборка
pnpm nx build todo-service
```

## Конфигурация
- Порт gRPC по умолчанию: `5004`  
- База данных: PostgreSQL (`port: 6002`, БД: `clarte_todo_db`)
- Брокер событий: RabbitMQ (`port: 7001`)
- Контракты описаны в `todo.proto`.
