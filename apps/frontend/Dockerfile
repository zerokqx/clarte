# === Стейдж 1: Сборка статики ===
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.33.2
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install --frozen-lockfile --offline

RUN pnpm nx build @clarte/frontend --configuration=production

FROM nginx:1.25-alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/apps/frontend/dist /usr/share/nginx/html

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
