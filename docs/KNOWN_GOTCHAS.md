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
  module defeats it. See `apps/web/src/entities/content/api/server-loaders.ts`.
- **Consequence**: once any route uses `createServerFn`, the deployed frontend needs a running Node
  process to answer the client's RPC calls on navigation — pure static Nginx serving isn't enough,
  even if every page is prerendered. See `infra/docker-compose.yml`'s `web` service.
- **Corollary (change 02, FSD-like restructure)**: this file is safe to **move** as a whole (e.g.
  into a different FSD layer) — only an import path changes. It is not safe to **split**
  ("helpers in `lib/`, `createServerFn` calls in `api/`"), even during a refactor that otherwise
  splits every other content module that way. The whole file moved intact in change 02.

### TanStack Start: `import.meta.dirname`-relative paths break once bundled

- **Symptoms**: a path computed as `join(import.meta.dirname, "..", ...)` inside a server function
  resolves correctly in `pnpm dev` but 500s (or silently reads the wrong files) after `vite build` —
  prerendering may fail outright with "Internal Server Error" and no useful stack trace.
- **Root cause**: after bundling, the module lives in `.output/server/assets/`, not its original
  source path — `import.meta.dirname` at runtime reflects the bundle's location, not the source
  tree's.
- **Fix**: compute the absolute path once in `vite.config.ts` (which always runs from source) and
  inject it as a build-time constant via `define`. See `apps/web/vite.config.ts`'s
  `__CONTENT_ROOT__` and `apps/web/src/entities/content/api/server-loaders.ts`.
- **Corollary**: do not route this constant through a runtime env-config module (e.g.
  `shared/config/env.ts`) even for consistency — env reads happen at *runtime*, which is exactly
  the wrong resolution timing after bundling. `__CONTENT_ROOT__` must stay a build-time `define`.

### Docker: TanStack Start's build-time prerender can ECONNREFUSED inside `docker build`

- **Symptoms**: `pnpm build` (with `prerender.enabled: true`) works fine on the host and inside a
  plain `docker run`, but fails inside `docker build`'s `RUN` step with
  `TypeError: fetch failed` / `ECONNREFUSED 127.0.0.1:<port>` — the prerender crawler can't reach
  the server it just started, on the same loopback interface, in the same process.
- **Root cause**: observed in this project's dev environment (a nested/sandboxed Docker daemon) —
  BuildKit's default (isolated) network namespace for `RUN` steps does not support whatever the
  TanStack Start/Vinxi prerender step needs for its self-connect loopback fetch, even though a
  plain Node `http` server's own self-connect works fine in the same sandbox. This is very likely
  specific to constrained/nested container environments (CI runners with heavy network sandboxing,
  this coding assistant's own Docker daemon) — a normal Docker host is expected to build fine with
  the default network.
- **Attempted fix that makes it WORSE, do not use**: passing `network: host` to the build (compose
  `build.network: host` or `docker build --network=host`) does make the prerender step itself
  succeed, but in this same environment it triggers a *different*, more severe BuildKit bug: files
  written during a `--network=host` RUN step are not committed to that stage's snapshot, so the
  very next instruction (even a trivial `RUN ls`, or a later stage's `COPY --from=builder`) reports
  the files as missing. Verified reproducible with both the BuildKit and legacy (`DOCKER_BUILDKIT=0`)
  builders.
- **Status**: unresolved in this environment as of change 02. If this recurs, verify on a real
  Docker host/CI runner before assuming it's a code regression — check `docker version`'s server
  component and whether the daemon itself runs nested/sandboxed before spending time on the
  Dockerfile.

### Docker: non-root user with `--no-create-home` breaks `uv run`

- **Symptoms**: `error: failed to create directory `/home/<user>/.cache/uv`: Permission denied`
  on every `uv run` invocation inside a container, even though the app's own files/directories are
  correctly `chown`ed to that user.
- **Root cause**: `useradd --no-create-home` leaves `$HOME` pointing at a directory that doesn't
  exist (or isn't writable by the new user); `uv` unconditionally tries to create its cache there.
- **Fix**: set `ENV UV_CACHE_DIR=/app/.cache/uv` (or wherever the app directory — already owned by
  the non-root user — lives) instead of giving the user a real home directory. See
  `apps/api/Dockerfile`.

### Python: eager `Path(__file__).resolve().parents[N]` breaks at a different tree depth

- **Symptoms**: `IndexError` at *import time* (before any of the module's own logic runs, and
  before an env-var override like `CONTENT_DIR` even gets a chance to apply) — happens only in an
  environment whose source tree is shallower than the one the index was tuned for (e.g. inside a
  Docker image that copies just `app/` in, rather than the whole monorepo).
- **Root cause**: a module-level constant computed via a fixed `.parents[N]` index bakes in an
  assumption about how many directories deep the file lives, which differs between local dev (full
  repo checkout) and a container image (a flattened subset of it).
- **Fix**: wrap the index access in `try/except IndexError` with a sane fallback (ideally the same
  value the container's env-var override would set anyway), so a too-shallow tree degrades instead
  of crashing before the override is even consulted. See `apps/api/app/core/config.py`.

### Pre-emptive: asyncpg + SQLAlchemy naive/aware `datetime` trap (no DB code exists yet)

- **Applies when**: a future change adds the first SQLAlchemy model (e.g. `task_attempt_stats`,
  SPEC.md §3's optional analytics aggregation) — recorded now, before any model exists, because
  the fix is a one-line convention that's cheap to state up front and expensive to debug later.
- **Symptoms**: `asyncpg.exceptions.DataError` / `TypeError` when inserting/comparing an
  timezone-aware Python `datetime` against an otherwise-correct `TIMESTAMPTZ` Postgres column.
- **Root cause**: if a SQLAlchemy `Mapped[datetime]` column omits `DateTime(timezone=True)`,
  SQLAlchemy tells asyncpg to bind that parameter as `TIMESTAMP` (no timezone) even when the real
  column is `TIMESTAMPTZ` — asyncpg's encoder then chokes on a timezone-aware value.
- **Fix (apply when the first model is added)**: every `Mapped[datetime]` column must declare
  `DateTime(timezone=True)` explicitly (matched in the corresponding Alembic migration with
  `sa.DateTime(timezone=True)`); always construct "now" via `datetime.now(UTC)`, never bare
  `datetime.now()`.

<!--
### [Title — short, punchy, searchable]

- **Symptoms**: [what fails, what error message]
- **Root cause**: [why it happens]
- **Fix**: [shortest reliable fix]
- **Prevention**: [optional — how to avoid hitting it again]
- **Links**: [optional — docs / issue / PR]
-->
