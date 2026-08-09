# Known Gotchas

> Project memory file. Capture recurring pitfalls that repeatedly waste time during coding,
> testing, or deploys.

## How To Use

- Add only issues that are likely to happen again.
- Prefer concrete symptoms, root cause, and the shortest reliable fix.
- Remove entries that are no longer relevant.

## Gotcha Log

### TanStack Start: filesystem access in a route `loader` breaks the client build

- **Symptoms**: `vite build` fails with `"join" is not exported by "__vite-browser-external"` (or
  similar) pointing at a module that imports `node:fs`/`node:path`, even though that module is only
  used inside a route's `loader` field.
- **Root cause**: route `loader` functions run on both server and client (TanStack Start docs,
  "code execution patterns") — the client bundler tries to include whatever the loader touches,
  and `node:fs` can't be bundled for the browser.
- **Fix**: wrap the filesystem-touching function in `createServerFn()` from `@tanstack/react-start`,
  and keep the `createServerFn` call **in the same file** as the `node:fs`/`node:path` imports — the
  compiler's client-bundle stripping is per-file; splitting the fs code into a separately-imported
  module defeats it. See `apps/web/src/content/server-loaders.ts`.
- **Consequence**: once any route uses `createServerFn`, the deployed frontend needs a running Node
  process to answer the client's RPC calls on navigation — pure static Nginx serving isn't enough,
  even if every page is prerendered. See `infra/docker-compose.yml`'s `web` service.

### TanStack Start: `import.meta.dirname`-relative paths break once bundled

- **Symptoms**: a path computed as `join(import.meta.dirname, "..", ...)` inside a server function
  resolves correctly in `pnpm dev` but 500s (or silently reads the wrong files) after `vite build` —
  prerendering may fail outright with "Internal Server Error" and no useful stack trace.
- **Root cause**: after bundling, the module lives in `.output/server/assets/`, not its original
  source path — `import.meta.dirname` at runtime reflects the bundle's location, not the source
  tree's.
- **Fix**: compute the absolute path once in `vite.config.ts` (which always runs from source) and
  inject it as a build-time constant via `define`. See `apps/web/vite.config.ts`'s
  `__CONTENT_ROOT__` and `apps/web/src/content/server-loaders.ts`.

<!--
### [Title — short, punchy, searchable]

- **Symptoms**: [what fails, what error message]
- **Root cause**: [why it happens]
- **Fix**: [shortest reliable fix]
- **Prevention**: [optional — how to avoid hitting it again]
- **Links**: [optional — docs / issue / PR]
-->
