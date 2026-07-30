FROM node:22-alpine AS builder

WORKDIR /usr/src/app

ENV CI=true

# OpenSSL нужен на этапе билда (например, для генерации Prisma Client или работы с криптографией)
RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.33.2

COPY . .

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

RUN --mount=type=cache,id=nx,target=/usr/src/app/.nx/cache \
    pnpm nx build @clarte/auth-service --configuration=production

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm --filter=@clarte/auth-service deploy --prod --legacy /usr/src/app/deploy


FROM node:22-alpine AS production

WORKDIR /opt/app

COPY --from=builder /usr/src/app/deploy/dist ./dist
COPY --from=builder /usr/src/app/deploy/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
