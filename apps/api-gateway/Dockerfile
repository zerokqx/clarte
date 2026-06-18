# ==============================================================================
# STAGE 1: Build stage
# ==============================================================================
FROM node:22.21.1-alpine AS builder

# Устанавливаем pnpm, компилятор protobuf (protoc) и необходимые системные зависимости
RUN apk add --no-cache protobuf-dev \
    && npm install -g pnpm@10.33.2

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

RUN npm install -g pnpm@10.33.2

WORKDIR /app

ENV NODE_ENV=production

# Копируем собранный бандл и автоматически сгенерированный package.json
COPY --from=builder /app/apps/api-gateway/dist ./

# Устанавливаем только продакшн-зависимости (включая внешние модули вроде nestjs/swagger)
RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 5000

CMD ["node", "main.js"]
