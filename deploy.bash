#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting deployment and setup for Clarte..."

# 1. Install pnpm globally if not present
if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm globally..."
  npm install -g pnpm
else
  echo "✔ pnpm is already installed"
fi

# 2. Install project dependencies
echo "📦 Installing project dependencies..."
pnpm install

# 3. Install nx globally if not present
if ! command -v nx &> /dev/null; then
  echo "📦 Installing nx globally..."
  pnpm add --global nx || echo "⚠️ Warning: Failed to install nx globally. Proceeding with local execution."
else
  echo "✔ nx is already installed"
fi

# 4. Start infrastructure containers
echo "🐳 Starting docker-compose infrastructure..."
pnpm nx run-many --targets=compose-infra-up --no-tui

# 5. Start microservices
echo "⚡ Starting all microservices..."
NX_DAEMON=false pnpm nx run-many --targets=serve --no-tui
