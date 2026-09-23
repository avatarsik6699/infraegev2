# Known Gotchas

### Change 17 was abandoned before commit and has no archive file

- **Symptoms**: the numbered archive jumps from Change 16 to Change 18, while a stale local branch
  or stash named `17-public-recursion-topic` suggests that a shipped archive file is missing.
- **Root cause**: the first Change 17 attempt was paused before commit. Its useful lesson work was
  superseded by the independently implemented Changes 22–24, so it was never a completed change
  and must not be reconstructed as shipped history.
- **Fix**: treat the number as intentionally unused, use Changes 22–24 as the recursion lesson
  history, and do not recreate `docs/changes/archive/17-*.md`. The obsolete local stash and merged
  branch may be deleted after verifying their names and merge state.

> Project memory file. Capture recurring pitfalls that repeatedly waste time during coding,
> testing, or deploys.

## How To Use

- Add only issues that are likely to happen again.
- Prefer concrete symptoms, root cause, and the shortest reliable fix.
- Remove entries that are no longer relevant.

Retired monitoring/package-engine pitfalls were removed in Change 123; recover historical
procedures from `snapshot/pre-minimalism-2026-09-17` when restoring those systems. They are not
current operating instructions.

Search headings for the affected tool/module before reading detailed entries. Always apply the
filesystem-permission handoff; historical symptoms do not supersede current STACK or runbooks.

## Gotcha Log

### Hydration-only control swaps cause catalog layout shifts

- **Symptoms:** a tall native select flashes before the compact combobox, rows move and controls
  repaint on every filter submission. Settled screenshots and unit tests can still look correct.
- **Cause:** useIsEnhanced chooses different SSR/client geometry; plain GET submissions reload the
  document. Base UI Combobox.Label also links its trigger after hydration unless explicitly named.
- **Fix:** server-render the final geometry; put native fallbacks in noscript and hide scripted
  controls with CSS scripting:none. Avoid duplicate successful form fields. Use router navigation
  for hydrated GET forms. Match fallback title-link/button geometry and name triggers in SSR.
  Validate blocked-script production first paint, hydration geometry, no-JS and same-document updates.


### TypeScript MCP without realpath misresolves pnpm server exports

- **Symptoms:** production TanStack server functions report missing `setResponseHeader` /
  `setResponseStatus` and cascading implicit-any errors in MCP, while workspace `tsc`, typed
  lint and production build pass.
- **Confirmed cause (Change 116):** the installed `@treedy/typescript-lsp-mcp` language-service
  host omits `realpath`. A host using the same project TypeScript/config reproduces all four
  diagnostics without `realpath`; adding `ts.sys.realpath` yields zero diagnostics.
- **Handling:** run and report MCP diagnostics, verify affected files with the workspace compiler
  and a realpath-aware language-service host. Do not change valid application imports or add
  casts to silence this adapter defect. Updating the external MCP installation is separate work.

### Restic retention must not group application snapshots by temporary dump paths

- **Symptoms:** each backup's unique `work.XXXXXX` path gets its own retention group, so repeated
  same-day backups all survive the nominal 7 daily / 4 weekly / 3 monthly policy.
- **Cause:** Restic's default `forget` grouping is `host,paths`; every temporary source path differs.
- **Fix:** application retention explicitly uses `--tag infraege-application --group-by host,tags`.
  Keep the shared Restic lock and operations tag boundary. Change 113's real isolated Restic
  rehearsal exposed this; the operations policy is outside that change's mutation scope.

### Linux Chromium under WSL can leave Windows-named Lighthouse profiles in the repository

- **Symptoms:** after `pnpm audit:performance`, the repository root contains literal directories
  such as `C:\Users\user\AppData\Local\lighthouse.12345678`; formatting and cleanup checks then
  traverse Chrome caches that `git status` hides.
- **Root cause:** locked `chrome-launcher@0.13.4` detects WSL and converts its temporary profile to
  Windows syntax even when LHCI launches Playwright's Linux Chromium. Linux Chromium interprets
  that value as a relative path and creates it under the current working directory.
- **Fix:** run Lighthouse only through `pnpm audit:performance`. The repository wrapper owns an
  absolute `/tmp/infraege-lighthouse.*` profile and removes it on success, failure or interruption.
  Analyze `.lighthouseci` reports before the terminal `make clean-dry-run && make clean &&
  make clean-check`; never use broad `git clean -fdX`.

### Compose `up --build` can recreate dev containers even when every build layer is cached

- **Symptoms:** a stopped development stack still runs the full build progress on `make dev`, all
  Dockerfile steps report `CACHED`, but Compose recreates the API and web containers before start.
- **Root cause:** BuildKit exports fresh image metadata/attestations for an explicit build, and
  current Docker Compose can treat the resulting image reference as changed even though no layer
  ran. Preserving containers in `make stop` alone therefore does not make resume fast while normal
  startup still passes `--build`.
- **Fix:** keep the normal unchanged-input path on `compose up --wait` so it reuses stopped
  containers. `make dev` fingerprints lockfiles, manifests, Dockerfiles, Vite configuration and
  other image-owned inputs and uses `up --build` only when that fingerprint changes; `make rebuild`
  remains the explicit force-rebuild path. Keep web/API source and content on development bind
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

### Dev CSS Modules composition can retain stale class names

- **Symptoms**: a shared control has correct source and production hover behavior, but localhost:8080 still applies old colors after a full page reload.
- **Evidence**: the ActionLink composed stylesheet and rendered anchor retain the previous Button class hash while the directly loaded Button stylesheet contains the new hash. Current hover selectors therefore do not match the anchor.
- **Fix**: restart only the local dev web container, then reload the page. Verify settled computed background/foreground before and after hover on port 8080, not only an immediate snapshot or a fresh production preview. Do not clear databases or rebuild the complete stack for this in-memory Vite module issue.

### Repeated full-page course navigation can exhaust Vite dev hydration

- **Symptoms**: a long Playwright loop successfully sees SSR lesson content, then a later route
  logs `Failed to fetch dynamically imported module ... default-entry/client.tsx`; interactive
  disclosure locators never appear and the test reaches its timeout.
- **Root cause**: repeatedly replacing the document for a large route-owned content chunk in one
  browser context can race Vite's development module delivery. Production prerender may remain
  healthy, so retrying the locator hides the real failure instead of proving hydration.
- **Fix**: keep route data and assertions in the Course Page Object, but give each crawled lesson
  its own Playwright test/context. For multi-viewport visual checks, navigate once and resize the
  same hydrated page instead of issuing another `page.goto` for every viewport.

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

### asyncpg + SQLAlchemy naive/aware `datetime` trap

- **Applies when**: adding or changing a mapped datetime in `modules/practice/` or its Alembic
  migration. Change 114 applies this convention and verifies timezone-aware round trips on PG18.
- **Symptoms**: `asyncpg.exceptions.DataError` / `TypeError` when inserting/comparing an
  timezone-aware Python `datetime` against an otherwise-correct `TIMESTAMPTZ` Postgres column.
- **Root cause**: if a SQLAlchemy `Mapped[datetime]` column omits `DateTime(timezone=True)`,
  SQLAlchemy tells asyncpg to bind that parameter as `TIMESTAMP` (no timezone) even when the real
  column is `TIMESTAMPTZ` — asyncpg's encoder then chokes on a timezone-aware value.
- **Fix**: every `Mapped[datetime]` column must declare
  `DateTime(timezone=True)` explicitly (matched in the corresponding Alembic migration with
  `sa.DateTime(timezone=True)`); always construct "now" via `datetime.now(UTC)`, never bare
  `datetime.now()`.

### SQLAlchemy/asyncpg: authentication errors can escape SQLAlchemy's exception wrapper

- **Symptom:** a real incorrect-password readiness probe raises `asyncpg.InvalidPasswordError`
  rather than the `SQLAlchemyError` caught by the transport, producing an unexpected error path.
- **Cause:** an error while establishing the asyncpg connection can propagate before SQLAlchemy
  wraps execution errors. Catching only SQLAlchemy exceptions does not cover authentication.
- **Fix:** the health and operator boundaries handle both `asyncpg.PostgresError` and
  `SQLAlchemyError`, without printing connection details or private SQL parameters. Keep the
  readiness total timeout and independent liveness. Change 114's isolated PostgreSQL test
  verifies the actual invalid-password path returns the sanitized 503.

### Production: same-host Restic is not disaster recovery

- **Symptoms**: local restore checks pass, but loss of the VPS would remove both live data and the
  Restic repository.
- **Root cause**: change 06 intentionally starts with `/var/backups/infraege` on the same VPS.
- **Fix**: add an encrypted off-site Restic backend and prove a restore from that backend before
  storing irreplaceable user data. This accepted residual risk is documented in the backup runbook.

### Primary root/password SSH is project-specific, not the reusable baseline

- **Symptoms**: a fresh agent schedules key-only migration because archived changes or the reusable
  blueprint describe separate operator/deploy identities.
- **Root cause**: Change 30 moved this VPS to password-only `root`; on 2026-08-20 the architect made
  that model the primary current contract and explicitly removed key-only migration from the
  roadmap. The reusable blueprint intentionally retains the safer generic baseline.
- **Fix**: keep pinned `known_hosts`, UFW, fail2ban and provider-console recovery. The production
  Environment intentionally has no required reviewers since 2026-09-04; do not treat
  `can_admins_bypass` as a second-person approval. Do not create a key-only migration change without a new explicit architect decision,
  and never reuse a chat-exposed recovery password. The production adapter currently accepts the
  architect-approved 12-character minimum; longer generated passwords remain recommended and
  lowering this boundary further requires another explicit security decision.

### Root-password rotation has two protected client-side authorities

- **Symptoms**: the local root/password wrapper connects successfully after a password rotation,
  but the dispatched production deploy fails on its first SCP/SSH authentication.
- **Root cause**: the mode-600 local `root-admin-password` was updated while the GitHub Environment
  secret `production/PROD_ROOT_PASSWORD` retained the previous value.
- **Fix**: treat both protected copies as one rotation transaction. Update the VPS password, local
  file and GitHub Environment secret before closing the provider-console session; then prove a
  fresh local wrapper connection and a deploy without printing the value.

### Full Gate Compose bootstrap needs a unique project and port namespace

- **Symptoms**: the Full Gate adopts/recreates containers from another checkout named `infra`, or
  fails on common host ports such as PostgreSQL `5432` before its own stack becomes healthy.
- **Root cause**: Compose derives a project name from the first Compose-file directory unless one
  is explicit; the old gate also published the usual development ports on every host interface.
- **Fix**: run build/performance rows through `scripts/run-host-web-gate.sh`. It stops only a
  running web service in the repository-owned `infraege-full-gate` project and restores it through
  an EXIT trap on both success and failure; it never kills an unrelated port owner. Bootstrap uses
  that same explicit project name plus dedicated overlay ports `18080/13000/18000/15432`; relying
  on the `infra/` basename or common ports can adopt or collide with an unrelated repository.

### PostgreSQL restore drills must recreate archived owner roles

- **Symptoms**: `pg_restore` fails when an archived object owner is missing in the disposable cluster.
- **Root cause**: logical dumps retain ownership; a fresh PostgreSQL instance only has its bootstrap role.
- **Fix**: restore the bundle's allowlisted roles before its dump through the matching maintenance
  tools. Keep fail-on-error ownership checks and prove disposal of the owned restore resources.

### Root-owned restore files require a matching verifier identity

- **Symptoms**: SQL restore and fingerprints pass, but `practice.verify` raises `PermissionError`
  on `/task-files/<digest>` only for root-run production backups.
- **Cause**: backup storage is deliberately mode 700; the API image's default UID cannot traverse
  a restored root-owned directory. Local operator-owned backups can conceal this mismatch.
- **Resolution approved 2026-09-21**: run the isolated verifier using the directory owner's numeric
  UID/GID while retaining read-only mounts, dropped capabilities, no-new-privileges and runtime
  SELECT-only credentials. Do not chmod/chown the backup or relax application permissions.

### SSH stdin can truncate a streamed deployment script

- **Symptoms**: GitHub deployment exits successfully after migrations, but `current` and public
  readiness still report the previous SHA; the final deployment-success line is absent.
- **Cause**: `bash -s` shares script input with child commands. An interactive Compose command
  can consume the unread body, so Bash reaches EOF without running activation or health checks.
- **Fix**: upload the exact reviewed script to a SHA-specific protected path, execute that file
  with stdin closed, and verify the public SHA in an independent GitHub step. Resume an interrupted
  release only after inspecting the live DB, volumes and previous application identity.

### Public privacy text does not complete formal legal review

- **Symptoms**: published contacts or an older archive are mistaken for completed specialist review.
- **Current contract**: SPEC §8 records deferred legal review and the architect's decision not to
  publish the operator's name/address. The current privacy page has no analytics/consent flow.
  Historical publication choices do not supersede that contract or prove external compliance.

### WSL: Lighthouse must use Playwright's Linux Chromium

- **Symptoms**: Lighthouse selects Windows Chrome through WSL interop, waits for DevTools and fails
  with `bind() ... 0x2740` or `ECONNREFUSED` after concurrent runs.
- **Root cause**: the Windows browser and Linux CLI disagree about lifecycle/port ownership.
- **Fix**: `lighthouserc.cjs` resolves `chromium.executablePath()` from the web workspace and passes
  it as `collect.chromePath`; keep the dedicated `127.0.0.2:3200` server address as well.

### The WSL Lighthouse runner needs a separate enforced LCP ceiling and product target

- **Symptoms**: an enforced `largest-contentful-paint` ceiling of `≤2800ms` made
  `pnpm audit:performance` (Full Gate) repeatedly fail both `/` and `/ege/16-rekursiya` on this
  devbox, commonly reporting about 4000–4400ms across repeat runs.
- **Root cause**: not a code regression. Confirmed by running the identical Full Gate performance
  step against `main` as of the pre-Change-85 baseline (commit `7150078`, archived Change 84): the
  same two routes failed with near-identical numbers (within ~10ms) despite zero relevant code
  differences. `server-response-time` and `network-server-latency` audits are ~0ms in every run, so
  the gap is not server-side; it tracks Lighthouse's simulated mobile throttling
  (`cpuSlowdownMultiplier: 4`, slow-4G network) interacting with this specific WSL/Docker-Desktop
  devbox's real CPU contention, not page weight (`total-byte-weight` ~522 KiB, reasonable) or
  render-blocking resources.
- **Fix**: enforce median LCP `≤4000ms` for the current local/release audit so the known runner
  variance does not repeatedly block unrelated work. Keep `≤2800ms` as the explicit product target,
  measure it on the deployed production environment or a stable dedicated runner, and tighten the
  gate back when optimization and repeatable evidence support it. Do not hide a regression beyond
  4000ms or raise the ceiling again without a new architect decision.

### Production: operator-written env values must remain Compose and Bash compatible

- **Symptoms**: image publication succeeds, but remote deploy exits `127` while sourcing
  `production.env`; the log shows the second word of an SSH public key as `command not found`.
- **Root cause**: Docker Compose accepts an unquoted env value containing spaces, while Bash
  `source` treats the text after the first word as a command.
- **Fix**: serialize operator-provided values as quoted dotenv literals and reject line breaks.
  Application and operations deploys validate sourceability before container changes, so a
  malformed protected file fails without requiring rollback.

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

### GitHub BuildKit can restore an internally stale pnpm install layer

- **Symptoms**: a production web image fails at `pnpm --filter web build` with
  `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN` even though frozen host installs, the local image gate and a
  Docker `--no-cache` builder run all pass against the same commit. CI shows the manifest,
  workspace config and `pnpm install` layers as cached.
- **Root cause**: the GHA BuildKit scope can retain an internally inconsistent dependency layer;
  deleting the visible Actions cache index and retrying may still import the same stale backend
  manifest. pnpm correctly rejects that layer when it compares the current workspace overrides
  with the cached virtual store.
- **Fix**: move only the affected image to a new explicit `cache_scope` generation in
  `.github/workflows/images.yml`, preserving cache use for every image. Prove the source tree with
  a cold `docker build --no-cache --target builder` before changing the scope; do not weaken
  `verifyDepsBeforeRun` or regenerate a lockfile that is already current.

<!--
### [Title — short, punchy, searchable]

- **Symptoms**: [what fails, what error message]
- **Root cause**: [why it happens]
- **Fix**: [shortest reliable fix]
- **Prevention**: [optional — how to avoid hitting it again]
- **Links**: [optional — docs / issue / PR]
-->
### Restic `--latest 1` is per snapshot group, not globally one result

- **Symptoms:** `restic snapshots --latest 1 --json` returns several objects and selecting `.[0]`
  records an arbitrary older snapshot.
- **Root cause:** each backup uses a unique `/var/backups/infraege/work.XXXXXX` source path, which
  forms a distinct Restic snapshot group; `--latest 1` keeps one result for every group.
- **Fix:** when selecting a global newest backup, read `restic snapshots --json` and select
  `max_by(.time)` while retaining its full immutable ID. Do not infer it from array position or
  deprecated `short_id`.

### Windows-hosted browser MCP can interpret WSL screenshot paths as a C: path

- **Symptoms:** screenshot saving rejects `/home/...` with `Access denied` and reports a canonical
  path beginning `C:\home\...` outside its workspace roots, although the WSL directory is writable.
- **Root cause:** the browser server resolves paths on Windows; the shell workspace is on WSL.
- **Fix:** after the architect authorizes the target directory, request an inline screenshot without
  `filePath`, then save its returned image bytes through the local workspace tool. Do not change
  filesystem permissions, weaken the MCP root allowlist, or retry the same mismatched path.
  A real shell `EACCES`/`EPERM` still requires the normal permission handoff.

### Nested read-only Nginx asset mounts need existing mountpoints

- **Symptom:** auxiliary-page test startup fails with `Read-only file system` while creating
  `/usr/share/nginx/auxiliary/assets/scenes` inside the read-only auxiliary directory mount.
- **Cause:** Docker cannot create a nested mountpoint after its parent has been mounted read-only.
- **Resolution:** prepare only the nested mountpoints used by the current Compose/test definition.
  Keep `fonts/.gitkeep` and the real brand SVG at the file mountpoint. The historical raster
  `scenes/` mount is no longer configured; its empty placeholder was removed in Change 108.
  Production copies resources into the image; local Compose mounts the real fonts/brand tree
  over the prepared locations. Do not weaken mount permissions.


### Application deploy: ERR traps do not automatically cover helper failures

- **Symptoms**: a failing Docker Compose command inside `run_compose` exits without rollback,
  despite a direct test of the rollback function passing.
- **Cause**: `set -e` does not make `ERR` traps inherit into shell functions. This was an inherited
  pre-113 defect, reproduced during the 113/114 audit.
- **Fix**: use the installed single `EXIT` recovery boundary, preserve the original exit code,
  disable recovery traps before rollback and explicitly verify rollback readiness. Every command
  inside conditionally invoked recovery must propagate failure explicitly. Host tests exercise
  the actual Compose helper and installed traps, including failure of rollback itself.
- **Related conditional failure**: a `source` inside a function called from `if`/`||` can fail and
  then be masked by a successful `set +a`. Environment validation explicitly exits its subshell
  on `source` failure; the regression test uses the production conditional call context.

### Windows-hosted Playwright MCP output paths

- **Symptoms:** saving a screenshot to a WSL `/tmp/...` path fails with `File access denied`;
  the tool interprets it as a Windows path outside its allowed output roots.
- **Cause:** the browser MCP runs on Windows while shell commands run in WSL; their filesystem
  roots differ.
- **Resolution (architect authorized 2026-09-17):** omit the screenshot filename to use the MCP
  default output directory. The resumed screenshot succeeded. Do not change filesystem permissions
  or substitute a WSL absolute path. Any new permission failure still requires the normal handoff.

### Playwriter extension not connected when only Playwright Chrome is running

- **Symptom:** `playwriter browser list` reports no browsers and session creation
  reports `extension_not_connected`, although Chrome windows are visible.
- **Verified cause (2026-09-19):** only three Playwright/MCP Chrome instances were
  running, all with temporary profiles and `--disable-extensions`. Playwriter was
  installed in ordinary Chrome's `Default` profile, which was not running.
  The WSL relay listened on `127.0.0.1:19988`; Windows HTTP access returned 200.
- **Fix:** inspect Chrome parent-process command lines, start ordinary Windows
  Chrome with `--profile-directory=Default`, then retry session creation. This
  connected the extension and allowed navigation/snapshot/interaction on `/practice`
  without reinstalling anything or manually enabling the extension.
- **Prevention:** never infer the extension profile is running merely from visible
  Chrome windows. Follow [STACK's procedure](STACK.md#interactive-browser-connection-wsl)
  before falling back. If the normal profile does not connect, check relay/network
  and ask for an extension-icon click; do not assume every disconnect has this cause.

### PageContainer overrides must not depend on stylesheet insertion order

- **Symptoms:** delayed-hydration catalog tests see a 24px jump and return even though final
  geometry matches the server render.
- **Root cause:** a page's `.catalogSection { padding-block: ... }` and PageContainer's `.root
  { padding: ... }` have equal specificity. Vite's client style insertion temporarily changes
  their cascade order.
- **Fix:** qualify the owning page override with the existing `[data-measure]` attribute. Keep
  the shared container defaults and the page's intended spacing; do not weaken CLS assertions.
- **Verification:** all eight delayed/failed asset EGE scenarios pass with zero reported shifts.

### Third-party scripts: use a React `<script async>` resource, not a `head()` script asset

- **Symptoms:** the analytics snippet (`https://sre.infraege.ru/track.js`, Change 133) ran twice
  in one document when it was declared in `__root.tsx`'s `head().scripts`. A MutationObserver
  trace showed the SSR tag removed after hydration and a fresh `<script>` appended on client
  navigation (`/` → `/courses` on a freshly started dev server). The re-executed snippet sent a
  second pageview for the same URL. A DOM query for the tag also reported it missing, although
  the first execution had already happened.
- **Root cause:** TanStack Router's head `Script` asset renders the tag only until hydration, then
  returns `null` and manages the script from an effect. That effect appends a new element when no
  matching `src` is in the DOM, which is always true once React has removed the SSR node.
- **Fix:** render `<script async src=… data-site=…>` directly in `RootDocument`'s `<head>`. React
  19 treats an async `src` script as a resource: hoisted, de-duplicated by `src`, inserted once and
  never re-appended. Verified with the same trace: one insertion, one beacon per URL change.
- **Related:** a same-URL `history.replaceState` during hydration also used to double-count every
  load. That was fixed in the snippet itself (smotryashchiy Change 16: a pageview is a change of
  `pathname + search`, not a history call).
