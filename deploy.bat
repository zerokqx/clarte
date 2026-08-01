@echo off

echo 🚀 Запуск развертывания и настройки Clarte на Windows...

:: 1. Установка pnpm глобально, если он отсутствует
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Установка pnpm глобально...
    call npm install -g pnpm
) else (
    echo ✔ pnpm уже установлен
)
:: 2. Установка зависимостей проекта
echo 📦 Установка зависимостей проекта...
call pnpm install

:: 4. Запуск контейнеров инфраструктуры (PostgreSQL, Redis, RabbitMQ)
echo 🐳 Запуск docker-compose инфраструктуры...
call pnpm nx run-many --targets=compose-infra-up --no-tui

call pnpm nx run-many compose-service-up --no-tui

pause
