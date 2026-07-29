FROM node:22-alpine AS builder

WORKDIR /usr/src/app

ENV CI=true

# OpenSSL нужен на этапе билда (например, для генерации Prisma Client или работы с криптографией)
RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.33.2

COPY . .

# 1. Устанавливаем все зависимости монорепы
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# 2. Сохраняем кэш Nx и собираем auth-service
RUN --mount=type=cache,id=nx,target=/usr/src/app/.nx/cache \
    pnpm nx build @clarte/auth-service --configuration=production

# 3. Деплоим изолированный бандл с prod-зависимостями в /usr/src/app/deploy
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm --filter=@clarte/auth-service deploy --prod --legacy /usr/src/app/deploy


FROM node:22-alpine AS production

WORKDIR /opt/app

# Если Prisma / OpenSSL используются во runtime (например, Prisma Client обращается к libssl),
# раскомментируйте строчку ниже:
# RUN apk add --no-cache openssl

# Копируем чистый dist и pruned node_modules из папки deploy
COPY --from=builder /usr/src/app/deploy/dist ./dist
COPY --from=builder /usr/src/app/deploy/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
