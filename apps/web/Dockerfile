# syntax=docker/dockerfile:1

# apps/web keeps a Node runtime for TanStack Start/Nitro routing and future server boundaries.
FROM node:26.8.1-slim@sha256:c0753125a3789977aefe869cbebccf70e3cfd7ea84ca48547458f02e4f1d7146 AS development
ENV CONTENT_DIR=/content
RUN corepack enable
WORKDIR /repo
RUN chown node:node /repo
COPY --chown=node:node package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --chown=node:node apps/web/package.json apps/web/package.json
USER node
RUN pnpm install --frozen-lockfile
COPY --chown=node:node apps/web apps/web
COPY --chown=node:node content/tasks /content/tasks
# `pnpm exec` (not `pnpm --filter web dev`) so vite runs as a direct child of pnpm instead of
# behind an `sh -c` layer — the shell doesn't forward SIGTERM, so `docker compose stop` had to
# wait out the full per-service timeout before force-killing the orphaned vite process.
CMD ["pnpm", "--filter", "web", "exec", "vite", "dev", "--host", "0.0.0.0", "--port", "3000", "--strictPort"]

FROM node:26.8.1-slim@sha256:c0753125a3789977aefe869cbebccf70e3cfd7ea84ca48547458f02e4f1d7146 AS builder
ENV CONTENT_DIR=/content
RUN corepack enable
WORKDIR /repo
ARG VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_WEBSITE_ID=${VITE_UMAMI_WEBSITE_ID}
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
COPY content/tasks /content/tasks
RUN pnpm --filter web build

FROM node:26.8.1-slim@sha256:c0753125a3789977aefe869cbebccf70e3cfd7ea84ca48547458f02e4f1d7146
ENV CONTENT_DIR=/content
WORKDIR /repo
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /root/.npm
COPY --from=builder --chown=node:node /repo/apps/web/.output ./apps/web/.output
COPY --from=builder --chown=node:node /content/tasks /content/tasks
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode >= 200 && r.statusCode < 400 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "apps/web/.output/server/index.mjs"]
