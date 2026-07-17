FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.33.2
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install --frozen-lockfile --offline

RUN pnpm nx build @clarte/notification-service --configuration=production

FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/notification-service/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
