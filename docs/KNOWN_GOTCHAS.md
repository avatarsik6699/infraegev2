# Known Gotchas

> Project memory file. Capture recurring pitfalls that repeatedly waste time during coding,
> testing, or deploys.

## How To Use

- Add only issues that are likely to happen again.
- Prefer concrete symptoms, root cause, and the shortest reliable fix.
- Remove entries that are no longer relevant.

## Gotcha Log

### A split Vite + `tsc` application can silently retain a renamed server entrypoint

- **Symptom:** the current TypeScript source builds successfully, but `pnpm start` runs an old BFF
  file from `dist/server/` or fails only on a clean machine because the configured entrypoint was
  renamed.
- **Root cause:** Vite cleans only its client `outDir`; plain `tsc` emits current files but does not
  delete JavaScript whose source was renamed or removed.
- **Fix:** make the application build remove its own narrow `dist` directory before running Vite
  and `tsc`, and keep the `start` entrypoint aligned with the emitted bootstrap (`server/main.ts`
  for `apps/ops`). Never rely on a dirty local `dist` as evidence that the production command works.

### Mantine adoption must use v9.5.1 exclusively (change 04+)

- **Applies when**: change 04 starts the planned Mantine UI-kit adoption; it is not part of
  change 03.
- **Risk**: stale examples or documentation can introduce an older Mantine API, while independently
  resolved `@mantine/*` dependencies can leave the frontend on incompatible mixed versions.
- **Required version**: pin `@mantine/core`, `@mantine/hooks`, and every other adopted
  `@mantine/*` package (`form`, `notifications`, `modals`, `dates`, etc.) to the exact version
  `9.5.1` in `apps/web/package.json`. Do not use ranges, older major/minor versions, or mix Mantine
  package versions.
- **Documentation**: before writing Mantine integration code, fetch current documentation through
  Context7 and scope the lookup to v9.5.1. If Context7 coverage is stale or too thin for v9, use
  Mantine's LLM documentation guide at <https://mantine.dev/guides/llms/> to find Mantine's own
  current documentation sources. Aggregated docs may still contain removed APIs (change 04 found
  `TypographyStylesProvider` in Context7 although 9.5.1 no longer exports it), so the installed
  package's `.d.ts` exports and a real typecheck are the final authority for the pinned version.
- **Origin**: explicit architect instruction during change 03 scoping; also recorded in
  `docs/changes/03-testing-conventions.md` § Implementation Notes.

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
- **Root cause**: Vite's preview server can bind a different loopback address family from the
  `127.0.0.1` URL advertised to TanStack Start's prerender crawler inside BuildKit. The failure is
  therefore a preview bind mismatch, not proof that Docker Desktop or the daemon is offline.
- **Fix**: set `preview.host: "127.0.0.1"` in `apps/web/vite.config.ts`. Keep the official
  `nitro/vite` plugin enabled as well: without it, current TanStack Start emits only a fetch-style
  `dist/server/server.js`, not the runnable `.output/server/index.mjs` expected by the Node image.
- **Attempted fix that makes it WORSE, do not use**: passing `network: host` to the build (compose
  `build.network: host` or `docker build --network=host`) does make the prerender step itself
  succeed, but in this same environment it triggers a *different*, more severe BuildKit bug: files
  written during a `--network=host` RUN step are not committed to that stage's snapshot, so the
  very next instruction (even a trivial `RUN ls`, or a later stage's `COPY --from=builder`) reports
  the files as missing. Verified reproducible with both the BuildKit and legacy (`DOCKER_BUILDKIT=0`)
  builders.
- **Verified**: change 03 on Docker Desktop/BuildKit — Compose built both images, TanStack
  prerendered `/`, `/privacy`, and `/terms`, and all four services became healthy.

### Nitro Vite dev server bypasses Vite's `server.proxy`

- **Symptoms**: a browser `fetch("/api/...")` works before adding `nitro/vite`, then returns the
  TanStack application's HTML 404 in local dev even though FastAPI is healthy and
  `server.proxy["/api"]` is configured.
- **Root cause**: Nitro owns the full-stack Vite request pipeline, so the request reaches the Start
  renderer instead of Vite's proxy middleware.
- **Fix**: configure a development-only Nitro `routeRules` entry for `/api/**`, with a proxy target
  ending in `/api/**` so Nitro preserves the wildcard suffix. Keep the rule out of production
  builds, where Nginx owns `/api` routing. See `apps/web/vite.config.ts`.

### Playwright must not reuse an arbitrary server on its gate ports

- **Symptoms**: the browser journey renders an older UI or misses a newly-added status even though
  unit tests and a fresh manual Vite server are correct.
- **Root cause**: `reuseExistingServer: true` accepts any process answering the configured URL;
  WSL/Windows port forwarding can keep a stale dev server reachable outside the current process
  tree, so Playwright silently tests a different checkout.
- **Fix**: keep the e2e-only ports `127.0.0.2:3100` / `127.0.0.2:8100`, pass Vite `--strictPort`,
  and set both Playwright web servers to `reuseExistingServer: false`.

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

### Production: same-host Restic is not disaster recovery

- **Symptoms**: local restore checks pass, but loss of the VPS would remove both live data and the
  Restic repository.
- **Root cause**: change 06 intentionally starts with `/var/backups/infraege` on the same VPS.
- **Fix**: add an encrypted off-site Restic backend and prove a restore from that backend before
  storing irreplaceable user data. This accepted residual risk is documented in the backup runbook.

### Production: deferred operator details and RKN work remain a legal risk

- **Symptoms**: legal pages can describe current processing, but cannot identify the operator or
  prove completion of the Russian regulator workflow.
- **Root cause**: the architect explicitly deferred operator requisites and RKN notification into
  one later task and accepted the risk; no age marking is shown.
- **Fix**: before collecting accounts or other non-minimal personal data, obtain specialist legal
  review and close the combined operator/RKN task. Do not invent requisites in source code.

### WSL: Lighthouse must use Playwright's Linux Chromium

- **Symptoms**: Lighthouse selects Windows Chrome through WSL interop, waits for DevTools and fails
  with `bind() ... 0x2740` or `ECONNREFUSED` after concurrent runs.
- **Root cause**: the Windows browser and Linux CLI disagree about lifecycle/port ownership.
- **Fix**: `lighthouserc.cjs` resolves `chromium.executablePath()` from the web workspace and passes
  it as `collect.chromePath`; keep the dedicated `127.0.0.2:3200` server address as well.

### WSL: an active Windows VPN does not create the infraege WireGuard route

- **Symptoms**: `ping 10.77.0.1` times out; `ip route get 10.77.0.1` selects the mirrored Windows
  VPN adapter (for example source `10.8.1.1`), and there is no `infraege-wsl` link or recent
  handshake.
- **Root cause**: WSL mirrored networking exposes the active Windows/Amnezia default tunnel, but
  the separate infraege WireGuard config has not been raised inside WSL. Installing
  `wireguard-tools` alone does not create the interface or its `AllowedIPs` route.
- **Fix**: use `make ops-tunnel-up` (or `make ops-up`) with the protected
  `~/.config/infraege/production/infraege-wsl.conf`. Its `10.77.0.0/24` route is more specific than
  the Amnezia default route. If the interface exists but has no handshake, temporarily disconnect
  Amnezia to distinguish endpoint routing from VPS/WireGuard configuration, then retry and inspect
  `make ops-status`; do not add a public route for private admin ports.

### Ops: journald ranges and private SSH need explicit protocol identities

- **Symptoms**: journald returns HTTP 400 or times out, while fail2ban SSH reports that no ED25519
  host key is known for `10.77.0.1`, even though the VPS public SSH key is already pinned.
- **Root cause**: systemd journal gateway treats `follow` as a presence-only option and requires
  the structured `entries=[cursor][[:skip]:[count]]` Range syntax. OpenSSH indexes known host keys
  by the connection host unless a separate host-key identity is configured.
- **Fix**: request `/entries` with `Range: entries=:-200:200`, without `follow=false`. Connect
  fail2ban to `ops-reader@10.77.0.1` but set `HostKeyAlias` to the already pinned public VPS host,
  use its explicit `UserKnownHostsFile`, and keep strict host-key checking enabled. Never replace
  this with `StrictHostKeyChecking=no` or TOFU.

### Ops: history range is not refresh cadence

- **Symptoms**: the smallest dashboard range is `1h`, so the operator assumes metrics can update
  only once per hour or lowers one global polling interval until Umami, Beszel and SSH are queried
  continuously.
- **Root cause**: `1h` controls the amount and resolution of historical chart data. Freshness is a
  separate browser cadence, while every upstream source has a different useful collection rate.
- **Fix**: keep `HISTORY` and `REFRESH` as separate controls. Browser near-live polling defaults to
  15 seconds, pauses in hidden tabs and never overlaps. The BFF coalesces tabs and enforces
  source-specific TTLs; raw Umami realtime events and session identifiers must never cross the
  BFF boundary.

### Ops: Beszel container memory values are MiB, not GB

- **Symptoms**: a small container appears to consume hundreds of GB even though `docker stats`
  reports only hundreds of MiB.
- **Root cause**: Beszel agent field `m` is used memory converted from bytes to binary megabytes.
  Relabelling that raw number as GB inflates the displayed unit by a factor of 1024.
- **Fix**: keep the BFF/browser contract explicit as `memoryMiB`; display MiB below 1024 and
  normalize larger values to GiB. Compare suspicious values with `docker stats --no-stream`.

### Production: Umami public prefix is not the tracker script upstream path

- **Symptoms**: `/stats/script.js` returns 404, `window.umami` is absent and genuine visits or
  practice actions never appear in Umami, while the private hub and collector remain healthy.
- **Root cause**: the prebuilt Umami image serves the script at upstream `/script.js`; Nginx owns
  the public `/stats` prefix. Proxying the public URI unchanged therefore requests a nonexistent
  upstream `/stats/script.js`.
- **Fix**: keep an exact public `/stats/script.js` location mapped to upstream `/script.js`, retain
  the exact `/stats/api/send` collector allowlist, and return 404 for every other `/stats/` route.
  Verify the public script and a real browser event after the corrected Nginx image is deployed.

### Production: certificate preflight must bypass the VPS hostname override

- **Symptoms**: public DNS correctly points `infraege.ru` at the VPS, but the certificate script
  reports the apex as `127.0.1.1` when it runs on that same VPS.
- **Root cause**: the provider sets the machine hostname to `infraege`; the local resolver can
  answer the machine's own name from `/etc/hosts` instead of returning public DNS.
- **Fix**: query two explicit public resolvers (`1.1.1.1` and `8.8.8.8`) in the certificate
  preflight. Do not weaken or remove the DNS check.

### Docker Compose: do not mount production-only Nginx vhosts into the local stack

- **Symptoms**: the local Nginx still serves existing traffic, but `nginx -t` hangs until the
  container healthcheck times out and Compose reports it as unhealthy.
- **Root cause**: mounting the whole `infra/nginx/conf.d/` directory makes local configuration
  validation resolve production-only upstreams such as Umami, which do not exist in the base
  Compose topology. A pre-existing Nginx master can hide the invalid new vhost until validation.
- **Fix**: base Compose mounts only `infraege.conf` as `default.conf`; the production Nginx image
  copies `infraege.prod.conf` itself. Keep those configuration inputs separate.

<!--
### [Title — short, punchy, searchable]

- **Symptoms**: [what fails, what error message]
- **Root cause**: [why it happens]
- **Fix**: [shortest reliable fix]
- **Prevention**: [optional — how to avoid hitting it again]
- **Links**: [optional — docs / issue / PR]
-->
