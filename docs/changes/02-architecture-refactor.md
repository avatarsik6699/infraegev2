# CHANGE 02 — Architecture Refactor

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `02` |
| Slug | `architecture-refactor` |
| Title | Architecture Refactor |
| Status | `active` |
| Branch | `feature/02-architecture-refactor` |

---

## Goal

Restructure change 01's flat scaffold into a pragmatic FSD-like layering on the frontend
(`shared`/`entities`/`features`/`widgets`/`pages`, TanStack Start's `routes/` kept as thin route
definitions) and a DDD-like module structure on the backend (`core/` cross-cutting infra +
`modules/{health,content,tasks}`), plus infra decomposition (split nginx config, hardened Docker
Compose, `entrypoint.sh`, `docker-compose.prod.yml`). No product behavior or API contract changes.
Design informed by a detailed analysis of a reference project's architecture; full rationale,
file-by-file maps, and rejected-port reasoning are recorded in Implementation Notes below. Fixes two
real bugs found during analysis: `infra/nginx/nginx.conf`'s `limit_req_zone` is declared outside
`http{}` (invalid — `nginx -t` fails) and `docker-compose.override.yml`'s `RELOAD=true` is dead
config the app never reads.

---

## Design References

<!-- none provided -->

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Backend
- [x] `B1` `app/core/config.py` — convert to `pydantic-settings` `Settings`; re-verify the
  content-dir default path depth (moves one directory deeper) — _Depends on:_ —
- [x] `B2` `app/core/exceptions.py` — `AppException(HTTPException)` base class — _Depends on:_ —
- [x] `B3` `app/core/logging.py` — structlog `configure_logging()` (console renderer in dev, JSON in
  prod, level from settings); do not log `request.client.host` (PDn minimization) — _Depends on:_ `B1`
- [x] `B4` `app/core/middleware.py` (request-id binding + moved `ErrorAlertMiddleware`) +
  `app/core/alerting.py` (moved from `services/telegram.py`) — _Depends on:_ `B2`, `B3`
- [x] `B5` `app/modules/content/` — `service.py` (from `services/content.py`), `schemas.py`
  (content-shape types from `schemas/task.py`), `exceptions.py` (`TaskNotFound(AppException)`, 404)
  — _Depends on:_ `B2`
- [x] `B6` `app/modules/tasks/` — `api.py` (from `routers/tasks.py`, drops manual 404 handling),
  `service.py` (checker, from `services/checker.py`), `schemas.py` (`CheckRequest`/`CheckResponse`)
  — _Depends on:_ `B5`
- [x] `B7` `app/modules/health/api.py` (from `routers/health.py`, no DB probe) — _Depends on:_ —
- [x] `B8` `app/api/router.py` — aggregator, `prefix="/api"` (not `/api/v1` — see Contracts) —
  _Depends on:_ `B6`, `B7`
- [x] `B9` `app/main.py` → `create_app()` factory; add `app/shared/__init__.py` placeholder-only
  package — _Depends on:_ `B4`, `B8`
- [x] `B10` Delete `app/{config.py,schemas/,services/,routers/,middleware/}`; update
  `apps/api/tests/{test_checker.py,test_tasks_api.py}` imports — _Depends on:_ `B9`
- [x] `B11` Add `ruff` dev dependency + `[tool.ruff]` config — _Depends on:_ `B10`

### Frontend
- [x] `F1` `src/shared/config/runtime.ts` — SSR/client detection
  (`import.meta.env.SSR` + `'window' in globalThis`) — _Depends on:_ —
- [x] `F2` `src/shared/lib/safe-json.ts` + `src/shared/lib/safe-ls.ts` — versioned, type-guarded,
  SSR-safe localStorage — _Depends on:_ `F1`
- [x] `F3` `src/shared/config/env.ts` — typed `client`/`server` env (site URL, feedback link);
  replace `process.env.SITE_URL` in the sitemap route and the hardcoded Telegram URL in
  `SiteFooter` — _Depends on:_ `F1`
- [x] `F4` Move `src/styles/tokens.css` → `src/shared/styles/tokens.css`; update `__root.tsx`'s
  `?url` import — _Depends on:_ —
- [x] `F5` Create `src/entities/content/` — move `content/types.ts` → `model/types.ts`, split
  `content/loader.ts` → `lib/`, move `content/server-loaders.ts` → `api/server-loaders.ts` as **one
  intact file** (fs + `createServerFn` stay co-located — see `docs/KNOWN_GOTCHAS.md`) — _Depends
  on:_ —
- [x] `F6` Create `src/entities/content-block/ui/` from `components/content-blocks/*`; move
  `PrerequisiteCallout` → `entities/content/ui/` — _Depends on:_ `F5`
- [x] `F7` Create `src/features/check-answer/` — move `PracticeTaskWidget`, extract the inline
  `fetch` into `api/check-answer.ts` with a typed response guard — _Depends on:_ `F3`, `F6`
- [x] `F8` Create `src/features/track-progress/` — rewrite `progress-store` on `safeLs` (new key
  `infraege:progress`, envelope `version: 1` — deliberate reset, no real users yet); move
  `ProgressBar` — _Depends on:_ `F2`
- [x] `F9` Create `src/widgets/site-footer/` from `SiteFooter` — _Depends on:_ `F3`
- [x] `F10` Create `src/pages/{home,topic,lesson,legal}/` ecosystems; reduce every `src/routes/*`
  file to route definition + loader + head, passing loader data to the page component as props
  (not `Route.useLoaderData()` inside `pages/`, to avoid a routes↔pages import cycle) — do
  route-by-route (`index` → `theory` → `course` → `privacy`/`terms`) with `pnpm build` between each
  — _Depends on:_ `F6`, `F7`, `F8`, `F9`
- [x] `F11` Enforce layer boundaries via per-layer `no-restricted-imports` zones in
  `eslint.config.js` — _Depends on:_ `F10`
- [x] `F12` Update `apps/web/tests/*` imports; delete emptied `src/{components,content,lib,styles}/`
  — _Depends on:_ `F10`

### Infra
- [x] `I1` Fix `infra/nginx/nginx.conf`: move `limit_req_zone` inside `http{}`; split into
  `nginx.conf` (main context + `include conf.d/*.conf`) + `conf.d/infraege.conf` (existing server
  block, unchanged rules); verify with `nginx -t` — _Depends on:_ —
- [x] `I2` Harden `infra/docker-compose.yml`: healthchecks + `depends_on: condition: service_healthy`
  on all services, `${POSTGRES_PASSWORD:?...}` hard-fail replacing hardcoded credentials, bounded
  JSON-file logging, `conf.d` mount — _Depends on:_ `I1`
- [x] `I3` Add `infra/.env.example` documenting every variable; confirm `.env` is gitignored —
  _Depends on:_ `I2`
- [x] `I4` Revise `infra/docker-compose.override.yml`: replace dead `RELOAD=true` with
  `APP_ENV=development` — _Depends on:_ `I2`
- [x] `I5` Add `apps/api/entrypoint.sh` (`exec uvicorn`, `--reload` when dev, commented future
  migration placeholder); point Dockerfile `CMD` at it — _Depends on:_ `I4`, `B1`
- [x] `I6` Dockerfile hardening: `uv sync --frozen`, non-root user, `HEALTHCHECK` in both images —
  _Depends on:_ `I5`
- [x] `I7` Add `infra/docker-compose.prod.yml` — production env, `restart: always`, required-var
  hard-fails, TLS/certbot deferred but documented in comments, "delete override.yml on server"
  warning — _Depends on:_ `I2`
- [ ] `I8` First real end-to-end `docker compose up --build`; curl `/health`, load a theory page,
  `POST` the checker endpoint, confirm the rate limit fires past its burst — _Depends on:_
  `I1`–`I7`. **Partially done**: `postgres`+`api`+`nginx` verified fully live (health check,
  checker endpoint, structlog+request-id in logs, rate limit returns `503` past burst — nginx's
  default `limit_req_status`, not `429` as originally assumed). `web`'s image could not be built
  in this session's environment — see Implementation Notes. Needs a real Docker host to close out.

### Other
- [x] `T1` `docs/KNOWN_GOTCHAS.md`: add (a) "moving `server-loaders.ts` is safe, splitting it is
  not" as a corollary to the existing fs-in-loader entry, (b) pre-emptive asyncpg naive/aware
  datetime rule (`DateTime(timezone=True)`) for the future analytics table — _Depends on:_ —
- [x] `T2` `docs/STACK.md`: fill backend Lint Fast Gate cell (ruff), update Full Gate
  Infrastructure note once `I8` verifies a running stack, document the frontend layer map + backend
  module layout + import-direction rules in § Project structure — _Depends on:_ `F11`, `B11`, `I8`

<!-- Test execution is governed by `docs/STACK.md`'s Fast Gate (per task) and Full Gate (per ship).
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/src/{shared,entities,features,widgets,pages}/   (new layers)
apps/web/src/routes/*                                     (reduced to thin definitions)
apps/web/eslint.config.js
apps/web/tests/*
apps/api/app/{core,modules,api,shared}/                   (new layout)
apps/api/pyproject.toml                                    (ruff, structlog, pydantic-settings)
apps/api/tests/*
apps/api/entrypoint.sh
apps/api/Dockerfile
apps/web/Dockerfile
infra/nginx/nginx.conf
infra/nginx/conf.d/infraege.conf
infra/docker-compose.yml
infra/docker-compose.override.yml
infra/docker-compose.prod.yml
infra/.env.example
docs/KNOWN_GOTCHAS.md
docs/STACK.md
~~~

### Do NOT touch
- `docs/SPEC.md` (no product/contract change in this refactor)
- Any auth/account code (out of scope — SPEC.md §10; nothing to touch since none exists)
- SQLAlchemy/Alembic/DB models — reserved for a future analytics change, not this one
- `docker-compose.ci.yml` — deferred until a CI pipeline exists to serve it
- `/home/niquetamerewsl/projects/patient_tracker/` — reference project; read-only inspiration, never
  edited
- `tmp/` at repo root — unrelated pre-existing directory, out of scope for this change

---

## Contracts

See `docs/SPEC.md` §3–§4 and the Files list above. No contract changes: the API prefix stays `/api`
(not `/api/v1` — versioning it would silently break the nginx `location /api/tasks/` rate-limit
match, removing SPEC §8's anti-scraping protection). Rate limiting stays nginx-only; do not add
`slowapi` (API is never published to the host; an in-memory limiter is wrong with >1 worker without
Redis, which this stack doesn't have).

---

## Gate Checks

> Fast Gate runs per task in `/work`; Full Gate and (with `--release`) Release Gate run once in
> `/ship`. Both are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

```bash
# Frontend: run pnpm build (prerender crawl, failOnError: true) after every F* item touching
# routes/pages, not just typecheck+test — it's the real integration test for layering mistakes
# that leak server-only code into a client-reachable module.
# Infra: nginx -t against the new config split before any other I* item.
```

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

<!-- Optional. The agent adds a short bullet here only when something isn't already visible from
     the code or commit history: an intentional deviation from the plan, a residual risk, a
     rejected alternative. Leave empty when nothing needs recording — this is not a mandatory
     per-task log. -->

- Design informed by a detailed analysis of a reference project (FastAPI+Postgres backend on the
  same stack shape, React Router v7 frontend) at `/home/niquetamerewsl/projects/patient_tracker/`.
  Ported near-verbatim: `safe-ls.ts`/`safe-json.ts` (versioned, type-guarded, SSR-safe localStorage),
  `runtime.ts` (SSR/client detection). Ported adapted/reduced: `env.ts` (no API-base-URL/auth
  machinery — this app has no auth), backend `core/{config,exceptions,logging,middleware}` +
  per-module `api.py`/`service.py`/`schemas.py` split, structlog logging.
- Explicitly rejected ports (all deliberate, not oversights): auth/JWT/RBAC (product is anonymous,
  no accounts — SPEC §6/§10), React Query (one mutating endpoint, no client-side cache need),
  `use-router.ts`/`use-typed-search-params.ts` (TanStack Router is already fully typed — wrapping it
  would reduce type safety), i18n (SPEC §1.3/§10: Russian-only), cookie wrapper (the reference has
  none — its auth uses localStorage, nothing to copy), `app-error.ts`/`global-error-notifier.ts` (no
  toast system, one endpoint), `date.ts`/`sanitize.ts` (verified zero date formatting / zero
  `dangerouslySetInnerHTML` in the current codebase), shadcn UI kit (SPEC §5.3 already specifies a
  bespoke design system), SQLAlchemy/Alembic/repository pattern/seeders (no DB tables exist yet —
  Postgres is reserved for one optional future aggregation table), `slowapi` rate limiting (nginx
  already covers it; see Contracts), `/api/v1` prefix (would break the nginx rate-limit match).
- `__CONTENT_ROOT__` stays a vite `define` build-time constant — must NOT be routed through the new
  `shared/config/env.ts`, which reads env at runtime (wrong resolution timing after bundling; see
  `docs/KNOWN_GOTCHAS.md`).
- Scoped as one combined change file per architect's explicit choice, rather than splitting
  frontend/backend vs. infra into two changes.
- Change 01 was committed for the first time as part of starting this change (the repository had no
  prior commit history); `main` was created from that commit so this change could branch from it
  per the standard git-flow step. Change 01 was not formally run through `/ship`.
- `I8`'s live verification surfaced three real, previously-unverified bugs (Docker was never run in
  change 01), all fixed in this change: (1) `infra/nginx/nginx.conf`'s `limit_req_zone` was outside
  `http{}` — invalid config, fixed by `I1`'s split. (2) `apps/web/Dockerfile`'s builder stage never
  copied `content/`, so the build-time prerender crawl 500s reading `content/topics/` — fixed by
  copying `content/` into the builder stage too, not just the runtime stage. (3)
  `apps/api/app/core/config.py`'s content-dir default crashed with `IndexError` inside the
  container (shallower tree than local dev) *before* the `CONTENT_DIR` env override was even
  consulted — fixed with a `try/except IndexError` fallback. Also fixed along the way: the
  non-root `appuser` (`--no-create-home`) broke every `uv run` invocation with an EACCES on
  `$HOME/.cache/uv` — fixed via `UV_CACHE_DIR=/app/.cache/uv`.
- `I8` verified `postgres`+`api`+`nginx` fully live (health check, the checker endpoint through
  nginx with structlog+request-id in the logs, and the `/api/tasks/` rate limit firing — `503` past
  the burst, nginx's default `limit_req_status`, not the `429` the Backlog item originally assumed).
  `web`'s image could not be built in this session's sandboxed Docker environment: its build-time
  prerender crawl needs a working self-connect loopback fetch inside the `docker build` sandbox,
  which fails there (`ECONNREFUSED`) even though the identical `pnpm build` succeeds on the host and
  under a plain `docker run`. The `network: host` workaround does fix that specific failure but
  triggers a worse, independently-reproducible BuildKit bug in this same environment: files written
  during a `--network=host` `RUN` step vanish before the very next instruction (confirmed with both
  BuildKit and the legacy builder) — so it was reverted rather than kept. Full details and the
  "verify on a real Docker host before assuming a code regression" guidance are in
  `docs/KNOWN_GOTCHAS.md`. This is believed to be specific to this coding assistant's own
  nested/sandboxed Docker daemon, not a defect in the Dockerfile/compose config — but it means `I8`
  is not fully closed, and a real Docker host should re-run
  `docker compose -f infra/docker-compose.yml -f infra/docker-compose.override.yml up --build` end
  to end (including `web`) before this change ships.

---

## Commit Message

```
feat(change-02): FSD-like frontend layers, DDD-like backend modules, infra decomposition
```
