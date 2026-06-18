# API Gateway Service

## Описание
Входная точка (API Gateway) для всей системы Clarte. Принимает HTTP-запросы от клиентов, выполняет маршрутизацию, а также преобразует их в gRPC-запросы для внутренних микросервисов (`user-service`, `auth-service`, `notes-service`, `todo-service`, `notification-service`).

Предоставляет интерактивную документацию Swagger API.

## Запуск
```sh
# Разработка
pnpm nx serve api-gateway

# Сборка
pnpm nx build api-gateway
```

## Конфигурация
Порт по умолчанию: `5000`  
Документация Swagger доступна по адресу: `http://localhost:5000/docs`
Использует переменные окружения из `.env`.
