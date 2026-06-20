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

:: 3. Установка nx глобально, если он отсутствует
where nx >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Установка nx глобально...
    call pnpm add --global nx
    if %errorlevel% neq 0 (
        echo ⚠️ Предупреждение: Не удалось установить nx глобально. Продолжаем с локальным запуском.
    )
) else (
    echo ✔ nx уже установлен
)

:: 4. Запуск контейнеров инфраструктуры (PostgreSQL, Redis, RabbitMQ)
echo 🐳 Запуск docker-compose инфраструктуры...
call pnpm nx run-many --targets=compose-infra-up --no-tui

:: 5. Прогрев кэша (сборка всех общих библиотек)
echo 🔥 Прогрев кэша (сборка всех библиотек)...
call pnpm nx run-many --target=build --projects=tag:type:package --no-tui

:: 6. Запуск всех микросервисов
echo ⚡ Запуск всех микросервисов...
set NX_DAEMON=false
call pnpm nx run-many --targets=serve --no-tui

pause
