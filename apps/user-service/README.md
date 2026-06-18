# User Service

## Описание
Микросервис пользователей (User Service) на базе NestJS и gRPC. Разработан с использованием подходов чистой архитектуры и DDD. Отвечает за:
- Создание и хранение профилей пользователей
- Управление сущностью пользователя (логин, имя, пароль)
- Публикацию доменных событий (`user.user.event.created`, `user.user.event.entered`) в RabbitMQ при создании пользователя или входе

## Запуск
```sh
# Разработка
pnpm nx serve user-service

# Сборка
pnpm nx build user-service
```

## Конфигурация
- Порт gRPC по умолчанию: `5001`  
- База данных: PostgreSQL (`port: 6000`, БД: `clarte_user_db`)
- Брокер: RabbitMQ (`port: 7001`)
- Контракты описаны в `user.proto`.
