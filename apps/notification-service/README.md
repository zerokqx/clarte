# Notification Service

## Описание
Микросервис уведомлений (Notification Service) на базе NestJS, gRPC и RabbitMQ. Разработан по правилам чистой архитектуры и предметно-ориентированного проектирования (DDD):
- Подписывается на асинхронные события от других сервисов через RabbitMQ (`user.created`, `user.entered`, `todo.reminder`)
- Автоматически создает уведомления для пользователей при наступлении этих событий
- Сохраняет уведомления в PostgreSQL с использованием TypeORM
- Предоставляет gRPC-интерфейс `GetNotificationsById` для получения списка уведомлений пользователя (запросы от `api-gateway`)

## Запуск
```sh
# Разработка
pnpm nx serve @clarte/notification-service

# Сборка
pnpm nx build @clarte/notification-service
```

## Конфигурация
- Порт gRPC по умолчанию: `5005`  
- База данных: PostgreSQL (`port: 6005`, БД: `clarte_db`)
- Брокер: RabbitMQ (`port: 7001`, очередь `notification_queue`, обменник `clarte_events_exchange`)
- Контракты описаны в `notification.proto`.
