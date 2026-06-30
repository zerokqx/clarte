# Note Service

## Overview

Микросервис заметок (Notes Service) на базе NestJS и gRPC. Предназначен для создания, удаления, обновления и получения заметок пользователей, а также сохранения и получения их содержимого во внешнем S3 хранилище (например, MinIO).

## Architecture

- **Pattern**: Clean Architecture + CQRS
- **Communication**: gRPC
- **Database**: MongoDB (Mongoose) + S3 / MinIO

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm
- Docker (для локального окружения)

### Installation

```bash
pnpm install
```

### Environment Setup

Скопируйте `.env.example` в `.env` и настройте переменные:

| Переменная           | Обязательна | По умолчанию          | Описание                |
| -------------------- | ----------- | --------------------- | ----------------------- |
| PORT                 | Да          | 5003                  | gRPC порт микросервиса  |
| HOST                 | Да          | localhost             | Хост для запуска gRPC   |
| MONGO_HOST           | Да          | localhost             | Хост MongoDB            |
| MONGO_PORT           | Да          | 6001                  | Порт MongoDB            |
| MONGO_DB             | Да          | clarte_db             | Имя базы данных MongoDB |
| MONGO_USER           | Да          | admin                 | Пользователь MongoDB    |
| MONGO_PASSWORD       | Да          | -                     | Пароль MongoDB          |
| S3_SOURCE            | Да          | minio                 | Источник S3 хранилища   |
| S3_ENDPOINT          | Да          | http://localhost:6003 | Точка подключения к S3  |
| S3_BUCKET            | Да          | notes                 | Имя бакета S3           |
| S3_ACCESS_KEY        | Да          | rootuser              | S3 Access Key           |
| S3_SECRET_ACCESS_KEY | Да          | password              | S3 Secret Access Key    |

### Running

```bash
# Development
pnpm nx serve note-service

# Production build
pnpm nx build note-service
```

## Ports & Protocols

| Порт | Протокол | Назначение                     | Внешний доступ |
| ---- | -------- | ------------------------------ | -------------- |
| 5003 | gRPC     | Внутренняя коммуникация (gRPC) | Нет            |
| 6001 | TCP      | MongoDB                        | Только dev     |
| 6003 | HTTP     | MinIO S3 API                   | Нет            |
| 6004 | HTTP     | MinIO Console                  | Да             |
| 9229 | TCP      | Node.js inspector              | Только dev     |

## API Endpoints

### gRPC Services

Контракты описаны в `notes.proto`.

- `NotesService.CreateNote` - Создать новую заметку
- `NotesService.GetBytes` - Получить байты (содержимое) заметки
- `NotesService.GetNoteById` - Получить заметку по ID
- `NotesService.AccessCheck` - Проверить права доступа к заметке
- `NotesService.SaveNoteBytes` - Сохранить байты (содержимое) заметки

## Dependencies

### Internal

- `@clarte/shared-contracts` - protobuf контракты и сгенерированные gRPC клиенты/интерфейсы
- `@clarte/shared-domain` - общие доменные типы и логика
- `@clarte/shared-nest` - общие NestJS модули (включая S3, конфигурацию)

### External

- `@nestjs/mongoose` / `mongoose` - интеграция и работа с MongoDB
- `@nestjs/cqrs` - поддержка паттерна Command Query Responsibility Segregation
- `@nestjs/microservices` - микросервисный транспорт NestJS (gRPC)

## Project Structure

```
src/
├── presentation/      # Контроллеры gRPC (note.rpc.controller.ts)
├── application/       # CQRS обработчики команд/запросов, исключения
├── domain/            # Сущности, доменная логика
└── infrastructure/    # Репозитории, база данных (Mongoose модели)
```

## Testing

```bash
pnpm nx test note-service
```

## Deployment

Смотрите [Deployment Guide](../../README.md#deployment)
