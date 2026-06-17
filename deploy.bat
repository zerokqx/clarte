@echo off
echo 🚀 Starting deployment and setup for Clarte on Windows...

:: 1. Check if pnpm is installed, install globally if not present
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm globally...
    call npm install -g pnpm
) else (
    echo [OK] pnpm is already installed
)

:: 2. Install project dependencies
echo 📦 Installing project dependencies...
call pnpm install

:: 3. Check if nx is installed globally, install if not present
where nx >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing nx globally...
    call pnpm add --global nx
) else (
    echo [OK] nx is already installed
)

:: 4. Start infrastructure containers (PostgreSQL, Redis, RabbitMQ)
echo 🐳 Starting docker-compose infrastructure...
call pnpm nx run-many --targets=compose-infra-up --no-tui

:: 5. Start all microservices
echo ⚡ Starting all microservices...
set NX_DAEMON=false
call pnpm nx run-many --targets=serve --no-tui

pause
