FROM node:24-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./ 

RUN pnpm fetch
COPY . .

# ENV HTTP_PROXY="http://host.docker.internal:2080"
# ENV HTTPS_PROXY="http://host.docker.internal:2080"

RUN HUSKY=0 pnpm install --ignore-scripts
ARG SERVICE_NAME
RUN npx nx build @clarte/${SERVICE_NAME} --prod

RUN CI=true pnpm prune --prod --ignore-scripts


FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs


ARG SERVICE_NAME

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/${SERVICE_NAME}/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER nestjs

ENV PORT=5000
ARG PORT

EXPOSE ${PORT}

# Запускаем скомпилированный main.js
CMD ["node", "dist/main.js"]
