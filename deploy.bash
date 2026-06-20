#!/usr/bin/env bash

# Выходить при ошибке выполнения любой команды
set -e

echo "🚀 Запуск развертывания и настройки Clarte..."

# 1. Установка pnpm глобально, если он отсутствует
if ! command -v pnpm &>/dev/null; then
  echo "📦 Установка pnpm глобально..."
  npm install -g pnpm
else
  echo "✔ pnpm уже установлен"
fi

# 2. Установка зависимостей проекта
echo "📦 Установка зависимостей проекта..."
pnpm install

# 3. Установка nx глобально, если он отсутствует
if ! command -v nx &>/dev/null; then
  echo "📦 Установка nx глобально..."
  pnpm add --global nx || echo "⚠️ Предупреждение: Не удалось установить nx глобально. Продолжаем с локальным запуском."
else
  echo "✔ nx уже установлен"
fi

# 4. Запуск контейнеров инфраструктуры (PostgreSQL, Redis, RabbitMQ)
echo "🐳 Запуск docker-compose инфраструктуры..."
pnpm nx run-many --targets=compose-infra-up --no-tui

# 5. Прогрев кэша (сборка всех общих библиотек)
echo "🔥 Прогрев кэша (сборка всех библиотек)..."
pnpm nx run-many --target=build --projects=tag:type:package --no-tui

# 6. Запуск всех микросервисов
echo "⚡ Запуск всех микросервисов..."
NX_DAEMON=false pnpm nx run-many --targets=serve --no-tui
