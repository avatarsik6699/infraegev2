# Known Gotchas

> Project memory file. Capture recurring pitfalls that repeatedly waste time during coding,
> testing, or deploys.

## How To Use

- Add only issues that are likely to happen again.
- Prefer concrete symptoms, root cause, and the shortest reliable fix.
- Remove entries that are no longer relevant.

## Gotcha Log

### `opsctl plan` is intentionally not an apply alias

- **Symptoms:** an operator expects `ops/opsctl plan` to repair a stopped component, or looks for
  deployment actions in sre-kit after seeing drift in its monitoring UI.
- **Root cause:** the current ops automation foundation is read-only. infraegev2 owns target
  lifecycle while sre-kit owns observation; neither `plan` nor the sre-kit UI is authorized to
  mutate the VPS.
- **Fix:** use `inventory/status/plan` for evidence only. Follow the existing component runbook for
  manual recovery. Add `apply` only in a later change that implements the declared single lock,
  pre-mutation checkpoint, atomic revision and sanitized outbox contracts with rollback proof.

### `opsctl apply` means sandbox transaction, not production access

- **Symptoms:** a successful apply under `/tmp` is interpreted as proof that the VPS changed, or
  an operator points `--sandbox-root` at an important local directory.
- **Root cause:** Change 32 adds only the reconcile state machine and sandbox executor. The path is
  intentionally explicit, but it is still a writable test state root; no SSH/Compose/systemd
  mutating transport exists.
- **Fix:** use a fresh disposable directory; opsctl marks it with `.infraege-ops-sandbox` and
  rejects an existing non-empty unmarked path. Bind the saved plan to its exact inventory and
  inspect checkpoint/revision/outbox evidence there. Production execution requires a later
  approved change and must never be inferred from credentials found in the environment.

### A green operations preflight is not production approval

- **Symptoms:** `ready_for_migration_planning` is treated as permission to upload the bundle or
  start `infraege-ops`.
- **Root cause:** preflight validates prerequisites and current ownership only; it does not
  exercise migration, rollback or operator approval.
- **Fix:** require the separate migration/cutover change and explicit approval. The report's
  `authorized_to_apply` field must remain false.

### A successful migration rehearsal is not a database restore

- **Symptoms:** a `status: rehearsed` report is used as evidence that a production Umami dump or
  Beszel database is readable by the target versions.
- **Root cause:** the sandbox harness proves transaction ordering, hashes, cleanup and ownership
  rollback using synthetic files; it intentionally does not run Docker, Restic or PostgreSQL.
- **Fix:** retain the rehearsal report as rollback-mechanics evidence, then separately run the
  disposable Restic/PostgreSQL restore and Source cross-check before requesting cutover approval.

### A valid `infraege-ops` Compose render is not permission to start it

- **Symptoms:** `make ops-config` passes and the inactive stack is started beside the current
  application Compose, causing port conflicts or two owners for Umami/Beszel data.
- **Root cause:** Compose validation proves syntax, interpolation and isolation only. Until the
  migration change, production ownership and backup paths still point at the application project.
- **Fix:** use `ops-config` and `ops-bundle` as local evidence only. Require remote preflight, fresh
  backup, disposable restore, maintenance window, data migration, source cross-check and explicit
  cutover approval before any lifecycle command.

### Compose `up --build` can recreate dev containers even when every build layer is cached

- **Symptoms:** a stopped development stack still runs the full build progress on `make dev`, all
  Dockerfile steps report `CACHED`, but Compose recreates the API and web containers before start.
- **Root cause:** BuildKit exports fresh image metadata/attestations for an explicit build, and
  current Docker Compose can treat the resulting image reference as changed even though no layer
  ran. Preserving containers in `make stop` alone therefore does not make resume fast while normal
  startup still passes `--build`.
- **Fix:** keep normal `make dev` on `compose up --wait` so it builds only missing images and reuses
  stopped containers. Use `make rebuild` after changing lockfiles, manifests, Dockerfiles, Vite
  configuration or other image-owned inputs. Keep web/API source and content on development bind
  mounts; reserve `make down` for explicit container/network removal. Neither stop nor down removes
  the named PostgreSQL volume.

### Concurrent Compose lifecycle commands can stop a newly-started dev stack

- **Symptoms:** `make stop` appears stuck, a second `make dev` starts some dependencies, then those
  containers stop again and nginx looks as though it never started. Nginx may finish with exit 137
  after serving Vite HMR traffic normally.
- **Root cause:** the official nginx image uses graceful `SIGQUIT`; open HMR WebSockets can keep the
  drain alive until the stop timeout. Compose stop and up are separate operations, so a concurrent
  up can race the still-running stop and have its newly-started containers stopped by that older
  command.
- **Fix:** use the Make targets, which serialize mutations of the `infraege-dev` project. The dev
  overlay overrides nginx to `SIGTERM`; production retains graceful image shutdown. Do not start a
  second lifecycle command while the first is running. Docker Desktop's separate `infra` group is
  left behind by direct Compose commands and is not owned by `make stop`.

### VS Code ESLint must not infer a shared TSConfig root across sibling apps

- **Symptoms:** TypeScript files intermittently show `Parsing error: No tsconfigRootDir was set,
  and multiple candidate TSConfigRootDirs are present`, naming multiple sibling app workspaces
  (this repo hit it with `apps/web` and the now-removed `apps/ops`), even though each workspace's
  standalone `pnpm lint` passes. Currently dormant with only `apps/web` in the workspace — resurface
  this if a second pnpm-workspace app is added again.
- **Root cause:** the VS Code ESLint extension keeps both flat configs in one Node process.
  `typescript-eslint` records the directory of every accessed preset as a candidate root; after
  both sibling configs load, its process-global inference is ambiguous.
- **Fix:** keep `parserOptions.tsconfigRootDir: import.meta.dirname` in a config block covering
  every TypeScript extension in each app, not only application source directories: contracts,
  tests, and root-level Vite configs also use the typescript-eslint parser. Do not replace it with
  `process.cwd()`: editor and root-level invocations do not guarantee that the current directory is
  the app that owns the config.

### Docker: running pnpm as node still requires a writable workspace root

- **Symptoms:** a Docker build switches to `USER node` before `pnpm install`, copied manifests
  already use `COPY --chown=node:node`, but pnpm fails with `EACCES` while opening a temporary
  `/repo/_tmp_*` file.
- **Root cause:** `WORKDIR /repo` creates the directory itself as root. Owning only the copied
  files is insufficient because pnpm also writes atomic temporary files at the workspace root.
- **Fix:** before switching users, run the narrow non-recursive `chown node:node /repo`; continue
  using `COPY --chown` for manifests, source and runtime artifacts. Do not restore a recursive
  `chown -R /repo`, which walks the entire dependency tree and makes `make dev` appear stalled.

### Vite HMR behind local Nginx requires WebSocket upgrade headers

- **Symptoms:** `make dev` reports every service healthy and HTTP works through port 8080, but the
  browser console shows `WebSocket handshake: Unexpected response code: 200`, followed by an
  unreachable direct fallback to `localhost:3000`.
- **Root cause:** Vite first opens its HMR WebSocket through the page origin. Without forwarding
  `Upgrade`/`Connection` on Nginx's application location, the request is handled as ordinary HTTP.
- **Fix:** keep `proxy_http_version 1.1`, set the upstream `Upgrade` value to the literal
  `websocket`, and derive `Connection` through an `http`-scope `map`: only a case-insensitive exact
  client `Upgrade: websocket` becomes `upgrade`; every other value becomes `close`. Directly
  forwarding arbitrary `$http_upgrade` values restores HMR but triggers the security gate's
  h2c-smuggling rule, while mapping the `Upgrade` value itself is too opaque for that static rule.
  The generic rule flags any complete WebSocket proxy directive triple without analyzing values,
  so keep its narrow inline suppression beside the allowlist explanation. Verify a WebSocket 101,
  an h2c non-101 response, and a clean browser console through `http://localhost:8080`.

### A split Vite + `tsc` application can silently retain a renamed server entrypoint

- **Symptom:** the current TypeScript source builds successfully, but `pnpm start` runs an old BFF
  file from `dist/server/` or fails only on a clean machine because the configured entrypoint was
  renamed.
- **Root cause:** Vite cleans only its client `outDir`; plain `tsc` emits current files but does not
  delete JavaScript whose source was renamed or removed.
- **Fix:** make the application build remove its own narrow `dist` directory before running Vite
  and `tsc`, and keep the `start` entrypoint aligned with the emitted bootstrap (this repo hit it
  in the now-removed `apps/ops`'s `server/main.ts`; no workspace currently uses this split
  build shape). Never rely on a dirty local `dist` as evidence that the production command works.

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
- **Verified**: change 03 on Docker Desktop/BuildKit; after the Change 15 reset the retained proof
  target is the prerendered `/` foundation route.

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

### Streamed SSR markup is visible before controlled React inputs hydrate

- **Symptoms**: a Playwright locator sees the topic form, but an immediate fill leaves its submit
  button disabled; replacing this with `waitForLoadState("networkidle")` works but couples the
  journey to unrelated background requests and slows every navigation.
- **Root cause**: TanStack Start can stream usable server-rendered markup before the client module
  has attached the controlled input handler.
- **Fix**: keep the synchronization inside the owning POM and use `expect.poll` to retry the user
  action until its observable result (the submit button becoming enabled) appears. Do not expose
  hydration waits in specs, add fixed sleeps, or make global network-idle the readiness contract.

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

### Temporary root/password SSH is a live exception, not the reusable baseline

- **Symptoms**: a fresh agent follows archived key-only operator/deploy instructions, or removes
  host identities before root/password deploy, timers and observability have been proven.
- **Root cause**: Change 30 temporarily simplifies this beta VPS to public password-only `root`;
  archived changes and the reusable infrastructure blueprint intentionally retain the safer model.
- **Fix**: use `ops/migrate-root-password-access.sh` in `prepare` → second-session `verify` →
  explicitly confirmed `retire` order. Keep the provider console open, pinned `known_hosts`, UFW,
  fail2ban and GitHub Environment approval. Never use an old chat-exposed recovery password.

### Observability work spans two first-party repositories

- **Symptoms**: a live sre-kit source is repaired manually while one repository still documents
  the old topology, or an agent treats sre-kit as an external consumer and starts rebuilding
  observability inside the removed `apps/ops`.
- **Root cause**: infraegev2 and sre-kit have separate Git/SDD lifecycles but jointly implement one
  operations system.
- **Fix**: create linked active Backlog items in both repositories for cross-boundary work.
  infraegev2 owns application telemetry and VPS/network prerequisites; sre-kit owns the core,
  adapters, source configuration, presets and observability deployment. Migrate a running service
  only through an explicit state/rollback/continuity plan.

### PostgreSQL restore drills must recreate archived owner roles

- **Symptoms**: the Restic snapshot restores and the application dump imports, but the Umami
  `pg_restore` stops on `ALTER ... OWNER TO umami` with `role "umami" does not exist`.
- **Root cause**: a custom-format dump retains object ownership metadata, while a fresh disposable
  PostgreSQL container initially contains only its bootstrap superuser.
- **Fix**: create the fixed source owner as a loginless role in the disposable cluster before
  `pg_restore` (`CREATE ROLE umami NOLOGIN`). Keep `--exit-on-error`; do not hide ownership drift
  with `--no-owner` when the purpose of the drill is fidelity. Always prove cleanup on failure.

### Ubuntu already has a system group named `operator`

- **Symptoms**: `useradd operator` fails with `group operator exists`, or a hand-written workaround
  silently places the human login in an unrelated pre-existing system group.
- **Root cause**: Ubuntu reserves an `operator` group even when no `operator` user exists; default
  user-private-group creation collides with it.
- **Fix**: keep the login name `operator`, but create and use the dedicated primary group
  `infraege-operator`. Add only the user to the standard `sudo` supplementary group, validate the
  effective SSH hardening before success, and keep `deploy` outside sudo.

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

### Production: Umami public prefix is not the tracker script upstream path

- **Symptoms**: `/stats/script.js` returns 404, `window.umami` is absent and genuine visits or
  practice actions never appear in Umami, while the private hub and collector remain healthy.
- **Root cause**: the prebuilt Umami image serves the script at upstream `/script.js`; Nginx owns
  the public `/stats` prefix. Proxying the public URI unchanged therefore requests a nonexistent
  upstream `/stats/script.js`.
- **Fix**: keep an exact public `/stats/script.js` location mapped to upstream `/script.js`, retain
  the exact `/stats/api/send` collector allowlist, and return 404 for every other `/stats/` route.
  Verify the public script and a real browser event after the corrected Nginx image is deployed.

### Production: Umami collector endpoint is relative to BASE_PATH

- **Symptoms**: `/stats/script.js` loads and `window.umami.track` exists, but pageviews and events
  POST twice to `/stats/stats/api/send`, receive 404 and never reach the dashboard.
- **Root cause**: Umami prefixes `COLLECT_API_ENDPOINT` with `BASE_PATH`. Configuring both as
  `/stats`-prefixed paths duplicates the public prefix in the generated tracker endpoint.
- **Fix**: with `BASE_PATH=/stats`, set `COLLECT_API_ENDPOINT=/api/send`; keep Nginx's exact public
  `/stats/api/send` allowlist mapped to the same prefixed upstream path. Verify the generated URL
  and response in a real browser because a curl check of the allowlisted route cannot catch this.

### Production: operator-written env values must remain Compose and Bash compatible

- **Symptoms**: image publication succeeds, but remote deploy exits `127` while sourcing
  `production.env`; the log shows the second word of an SSH public key as `command not found`.
- **Root cause**: Docker Compose accepts an unquoted env value containing spaces, while Bash
  `source` treats the text after the first word as a command. The Beszel helper previously wrote
  its system public key without quoting.
- **Fix**: serialize operator-provided values with the shared single-quoted literal dotenv formatter and
  reject line breaks. Run `make ops-repair-beszel-env` once for an affected protected file. Remote
  deploy validates sourceability before extraction, pulls or container changes, so a malformed
  file now fails without requiring rollback.

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

### TypeScript LSP can misresolve Playwright's isolated E2E files

- **Symptoms**: diagnostics for one `apps/web/e2e/**/*.ts` file claim that `@playwright/test` has
  no exported `expect` or `Page`, then cascade into implicit-`any` errors, while the same checkout
  passes the web TypeScript, ESLint architecture and Playwright commands.
- **Root cause**: the long-lived LSP adapter can resolve an isolated E2E file outside the effective
  web project context and load the wrong declaration view; switching its workspace to `apps/web`
  does not necessarily refresh that library view.
- **Fix**: still run and report the required LSP pass, but treat these E2E-only diagnostics as
  supplementary when `pnpm --filter web typecheck`, `pnpm --filter web lint` and the focused
  Playwright journey all pass. Production source and ordinary test files must remain LSP-clean.

<!--
### [Title — short, punchy, searchable]

- **Symptoms**: [what fails, what error message]
- **Root cause**: [why it happens]
- **Fix**: [shortest reliable fix]
- **Prevention**: [optional — how to avoid hitting it again]
- **Links**: [optional — docs / issue / PR]
-->
