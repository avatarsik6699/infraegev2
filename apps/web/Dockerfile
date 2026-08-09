# apps/web needs a running Node process, not pure static Nginx serving: content pages are
# prerendered (docs/SPEC.md §5.1), but `createServerFn`-based content loading (see
# src/content/server-loaders.ts) still needs a server to answer client-side navigation RPC calls.
#
# vite.config.ts bakes an absolute CONTENT_ROOT path into the server bundle at build time
# (computed as two directories up from apps/web) — the runtime image keeps the same /repo/apps/web
# layout so that baked-in path still resolves to content/ here.
FROM node:22-slim AS builder
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
RUN pnpm --filter web build

FROM node:22-slim
WORKDIR /repo
COPY --from=builder /repo/apps/web/.output ./apps/web/.output
COPY content ./content
EXPOSE 3000
CMD ["node", "apps/web/.output/server/index.mjs"]
