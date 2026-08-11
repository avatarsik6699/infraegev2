# apps/web needs a running Node process, not pure static Nginx serving: content pages are
# prerendered (docs/SPEC.md §5.1), but `createServerFn`-based content loading (see
# src/entities/content/api/server-loaders.ts) still needs a server to answer client-side
# navigation RPC calls.
#
# vite.config.ts bakes an absolute CONTENT_ROOT path into the server bundle at build time
# (computed as two directories up from apps/web) — the runtime image keeps the same /repo/apps/web
# layout so that baked-in path still resolves to content/ here.
FROM node:22-slim AS development
RUN corepack enable
WORKDIR /repo
RUN chown node:node /repo
COPY --chown=node:node package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --chown=node:node apps/web/package.json apps/web/package.json
USER node
RUN pnpm install --frozen-lockfile
COPY --chown=node:node apps/web apps/web
COPY --chown=node:node content ./content
CMD ["pnpm", "--filter", "web", "dev", "--host", "0.0.0.0", "--port", "3000", "--strictPort"]

FROM node:22-slim AS builder
RUN corepack enable
WORKDIR /repo
ARG SITE_URL=https://infraege.ru
ARG VITE_FEEDBACK_URL
ARG VITE_UMAMI_WEBSITE_ID
ENV SITE_URL=${SITE_URL}
ENV VITE_FEEDBACK_URL=${VITE_FEEDBACK_URL}
ENV VITE_UMAMI_WEBSITE_ID=${VITE_UMAMI_WEBSITE_ID}
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
# Needed at build time too, not just runtime: the build-time prerender crawl (vite.config.ts's
# `prerender.enabled`) actually calls listPublishedTopics(), which reads content/topics/ — without
# this, the builder stage 500s on every crawled route with ENOENT (docs/KNOWN_GOTCHAS.md).
COPY content ./content
RUN pnpm --filter web build

FROM node:22-slim
WORKDIR /repo
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /root/.npm
COPY --from=builder --chown=node:node /repo/apps/web/.output ./apps/web/.output
COPY --chown=node:node content ./content
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "apps/web/.output/server/index.mjs"]
