# syntax=docker/dockerfile:1

# apps/web keeps a Node runtime for TanStack Start/Nitro routing and future server boundaries.
FROM node:26.11.1-slim@sha256:193fe51b64e77981119c98c2002c9e32a70e2f006fb4d25068ce0558998917f0 AS development
RUN corepack enable
WORKDIR /repo
RUN chown node:node /repo
COPY --chown=node:node package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --chown=node:node apps/web/package.json apps/web/package.json
USER node
RUN pnpm install --frozen-lockfile
COPY --chown=node:node apps/web apps/web
# Change 192: the offer and refund pages render the same files the API hashes.
COPY --chown=node:node content/legal content/legal
# A cached install precedes the fresh manifests copied above; refresh frozen metadata offline.
RUN pnpm install --frozen-lockfile --offline
# `pnpm exec` (not `pnpm --filter web dev`) so vite runs as a direct child of pnpm instead of
# behind an `sh -c` layer — the shell doesn't forward SIGTERM, so `docker compose stop` had to
# wait out the full per-service timeout before force-killing the orphaned vite process.
CMD ["pnpm", "--filter", "web", "exec", "vite", "dev", "--host", "0.0.0.0", "--port", "3000", "--strictPort"]

FROM node:26.11.1-slim@sha256:193fe51b64e77981119c98c2002c9e32a70e2f006fb4d25068ce0558998917f0 AS builder
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
COPY content/legal content/legal
# When the install layer comes from the build cache, the fresh copy makes the manifests newer than
# the install and pnpm's deep check rejects the tree. Re-running the frozen install from the store
# already in this layer takes about a second and needs no network (Change 137).
RUN pnpm install --frozen-lockfile --offline
RUN pnpm --filter web build

FROM node:26.11.1-slim@sha256:193fe51b64e77981119c98c2002c9e32a70e2f006fb4d25068ce0558998917f0
WORKDIR /repo
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends --only-upgrade \
        liblzma5=5.4.1-1+deb12u2 \
        libpcre2-8-0=10.42-1+deb12u2 \
        perl-base=5.36.0-7+deb12u4 \
    && rm -rf /var/lib/apt/lists/*
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /root/.npm
COPY --from=builder --chown=node:node /repo/apps/web/.output ./apps/web/.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode >= 200 && r.statusCode < 400 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "apps/web/.output/server/index.mjs"]
