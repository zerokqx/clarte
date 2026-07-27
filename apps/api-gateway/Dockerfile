# --- Стейдж сборки ---
FROM node:22-alpine AS builder

RUN npm install -g pnpm@10.33.2

WORKDIR /app
ENV CI=true

COPY *.json /app
COPY pnpm-* /app
COPY ./nx-plugins ./nx-plugins
COPY ./tools ./tools
COPY ./packages ./packages
COPY ./apps ./apps

# Установка всех зависимостей
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --ignore-scripts

# Сборка через Nx
RUN --mount=type=cache,id=nx,target=/app/.nx/cache \
  pnpm nx build @clarte/api-gateway --configuration=production

# pnpm deploy: резолвит catalog:, ставит только prod-deps в изолированную папку
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm --filter=@clarte/api-gateway deploy --prod --legacy /app/deploy


# --- Финальный продакшн стейдж ---
FROM node:22-alpine AS production

WORKDIR /opt/app

# dist от Nx-сборки
COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
