#!/usr/bin/env bash

set -e

echo "🚀 Запуск развертывания и настройки Clarte..."
# 1. Установка pnpm глобально, если он отсутствует
if ! command -v pnpm &>/dev/null; then
  echo "📦 Установка pnpm глобально..."
  npm install -g pnpm
else
  echo "✔ pnpm уже установлен"
fi

echo "📦 Установка зависимостей проекта..."
pnpm install

# 3. Установка nx глобально, если он отсутствует
if ! command -v nx &>/dev/null; then
  echo "📦 Установка nx глобально..."
  pnpm add --global nx || echo "⚠️ Предупреждение: Не удалось установить nx глобально. Продолжаем с локальным запуском."
else
  echo "✔ nx уже установлен"
fi

echo "🐳 Запуск docker-compose инфраструктуры..."
pnpm nx run-many -t compose-infra-up --no-tui

# echo "🔥 Прогрев кэша (сборка всех библиотек)..."
# pnpm nx run-many --target=build --projects=tag:type:package --no-tui

echo "🐳 Запуск docker-compose сервисов..."
pnpm nx run-many -t compose-service-up --no-tui
