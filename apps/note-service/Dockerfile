ARG APP_NAME=@clarte/note-service

FROM node:22-alpine AS builder

ARG APP_NAME

RUN npm install -g pnpm@10.33.2

WORKDIR /app
ENV CI=true

COPY . .

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --ignore-scripts

RUN --mount=type=cache,id=nx,target=/app/.nx/cache \
  pnpm nx build ${APP_NAME} --configuration=production

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm --filter=${APP_NAME} deploy --prod --legacy /app/deploy


FROM node:22-alpine AS production

WORKDIR /opt/app

COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
