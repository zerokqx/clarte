# ==============================================================================
# STAGE 1: Build stage
# ==============================================================================
FROM node:22.21.1-alpine AS builder

# Устанавливаем protoc (для генерации gRPC типов) и pnpm
RUN apk add --no-cache protobuf-dev \
    && npm install -g pnpm@10.33.2

WORKDIR /app

# Копируем манифесты монорепозитория (кэш слоя при неизменных deps)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json eslint.config.mjs jest.config.ts jest.preset.js ./

# Копируем общие пакеты и сам сервис
COPY packages/ ./packages/
COPY apps/api-gateway/ ./apps/api-gateway/

# Устанавливаем все зависимости монорепозитория
RUN pnpm install --frozen-lockfile

# Собираем api-gateway + prune: копирует workspace_modules и генерирует pruned lockfile
RUN pnpm nx run @clarte/api-gateway:prune

# ==============================================================================
# STAGE 2: Run stage
# ==============================================================================
FROM node:22.21.1-alpine AS runner

RUN npm install -g pnpm@10.33.2

WORKDIR /app

ENV NODE_ENV=production

# Копируем бандл, pruned package.json, lockfile и workspace_modules из builder
COPY --from=builder /app/apps/api-gateway/dist/main.js ./main.js
COPY --from=builder /app/apps/api-gateway/dist/package.json ./package.json
COPY --from=builder /app/apps/api-gateway/dist/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/apps/api-gateway/dist/workspace_modules ./workspace_modules

# Устанавливаем только продакшн-зависимости (workspace ссылки заменены реальными путями)
RUN pnpm install --prod --frozen-lockfile

EXPOSE 5000

CMD ["node", "main.js"]
