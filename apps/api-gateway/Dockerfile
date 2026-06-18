# ==============================================================================
# STAGE 1: Build stage
# ==============================================================================
FROM node:22.21.1-alpine AS builder

# Устанавливаем pnpm и утилиты
RUN npm install -g pnpm@10.33.2

WORKDIR /app

# Копируем конфигурационные файлы монорепозитория для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./

# Копируем конфигурации и исходники общих библиотек
COPY packages/ ./packages/

# Копируем конфигурации и исходники api-gateway
COPY apps/api-gateway/ ./apps/api-gateway/

# Устанавливаем все зависимости монорепозитория
RUN pnpm install --frozen-lockfile

# Собираем общие модули и собираем api-gateway через Nx
RUN pnpm nx run @clarte/api-gateway:build

# ==============================================================================
# STAGE 2: Run stage
# ==============================================================================
FROM node:22.21.1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Копируем собранный бандл из builder стадии
COPY --from=builder /app/apps/api-gateway/dist ./dist

# Так как бандл уже собран webpack со всеми зависимостями в один файл (или с минимальным количеством файлов),
# нам нужны только рантайм-зависимости (если они есть) или просто запустить main.js.
# В случае использования node/webpack-сборки Nx, запускаем main.js напрямую.
EXPOSE 5000

CMD ["node", "dist/main.js"]
