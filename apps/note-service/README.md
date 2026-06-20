# Notes Service

## Описание

Микросервис заметок (Notes Service) на базе NestJS и gRPC. Реализует:

- Создание, обновление, удаление и получение заметок пользователей
- Интеграцию с объектным хранилищем MinIO (S3 API) для загрузки медиафайлов и вложений к заметкам

## Запуск

```sh
# Разработка
pnpm nx serve notes-service

# Сборка
pnpm nx build notes-service
```

## Конфигурация

- Порт gRPC по умолчанию: `5003`
- База данных: PostgreSQL (`port: 6001`, БД: `clarte_notes_db`)
- Объектное хранилище: MinIO (`S3 API port: 6003`, `Console port: 6004`)
- Контракты описаны в `notes.proto`.
