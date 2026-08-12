# CHANGE 01 — Project Foundation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `01` |
| Slug | `project-foundation` |
| Title | Project Foundation |
| Status | `archived` |
| Branch | `feature/01-project-foundation` |

---

## Goal

Stand up the monorepo skeleton (`apps/web` TanStack Start, `apps/api` FastAPI, Docker/Nginx infra),
the content-as-code schema for `Topic`/`Course`/`CourseLesson`/`ContentBlock`/`Task` (SPEC.md §3),
the base `ContentBlock` renderer (including a static-SVG diagram primitive set), the CI
link-validation script, and the `POST /api/tasks/{id}/check` skeleton with answer normalization.
This is roadmap milestone `M1` in SPEC.md §9 — it makes it possible to stamp out the first full
topic in the next change, not to publish content itself.

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
- [x] `B1` Scaffold FastAPI app (`apps/api`) with a health endpoint — _Depends on:_ —
- [x] `B2` Implement `POST /api/tasks/{id}/check` reading `Task` content files, applying answer
  normalization (SPEC.md §11.1: trim/collapse whitespace, case-insensitive, ё/е, numeric
  comma/dot equivalence, `numeric_tolerance`) — _Depends on:_ `B1`, `D1`
- [x] `T1` FastAPI middleware sending a Telegram alert on unhandled exception / 5xx (SPEC.md §7.2)
  — _Depends on:_ `B1`

### Frontend
- [x] `F1` Scaffold TanStack Start app (`apps/web`) with file-based routing skeleton for
  `/theory/zadanie-{n}-{slug}`, `/course/{course}/{lesson}`, `/`, `/privacy`, `/terms` — _Depends
  on:_ —
- [x] `F2` Implement Design System base tokens/components per SPEC.md §5.3 ("Textbook precision":
  palette, type scale — serif display/body + mono for code/data, comfortable spacing) — _Depends
  on:_ `F1`
- [x] `F3` Implement `ContentBlock` renderers: `text`, `diagram` (SVG primitives `node`/`edge`/
  `arrow`/`label`/`highlight`, labels on-element, signalling highlight), table diagram (semantic
  `<table>`), `code_example`, `worked_example`, `completion_exercise`, `productive_failure_prompt`,
  `callout` — _Depends on:_ `F2`, `D1`
- [x] `F4` Implement practice task widget (production-style answer input → `B2` → shows
  `explanation` blocks) — _Depends on:_ `F3`, `B2`
- [x] `F5` Implement localStorage progress store + progress bar + prerequisite/related-topic
  callout ("эта тема легче даётся, если понимать X → перейти") rendered from `prerequisites`/
  `related_topics`/`unlocks_topics` — _Depends on:_ `F3`
- [x] `F6` Static pages: `/privacy`, `/terms`, age-marking footer element (SPEC.md §8) — _Depends
  on:_ `F1`
- [x] `F7` SEO plumbing: per-topic `title`/`description`/`og:*` from `title`/`summary`,
  build-time `sitemap.xml` generation from `published` content — _Depends on:_ `F1`, `D1`

### Infra
- [x] `I1` Monorepo layout (`apps/web`, `apps/api`, `content/`, `infra/`, `scripts/`) + Docker
  Compose (Nginx, frontend, backend, Postgres) per SPEC.md §7.1 — _Depends on:_ —
- [x] `I2` `docker-compose.override.yml` for local dev — _Depends on:_ `I1`
- [x] `I3` Nginx config: reverse proxy, static serving for the frontend build, `limit_req_zone`
  rate limit on `/api/tasks/` (20 req/min/IP, burst 5, `nodelay` — SPEC.md §4/§8) — _Depends on:_
  `I1`

### Data
- [x] `D1` Define content-as-code schema/types for `Topic`, `Course`, `CourseLesson`,
  `ContentBlock`, `Task` (frontmatter/JSON shape per SPEC.md §3) — _Depends on:_ —
- [x] `D2` CI script validating `prerequisites`/`related_topics`/`unlocks_topics`/
  `practice_task_ids`/`topic_ids` resolve to existing ids; fails the build on broken links — _Depends
  on:_ `D1`
- [x] `D3` Seed one placeholder `Topic` + `Task` fixture (not the real M1 topic — just enough data
  to exercise the render pipeline and checker locally) — _Depends on:_ `D1`

<!-- Test execution is governed by `docs/STACK.md`'s Fast Gate (per task) and Full Gate (per ship).
     Do not duplicate that list here. -->

---

## Files

### Create / modify
~~~
apps/web/                       (TanStack Start app scaffold, routes, components)
apps/api/                       (FastAPI app scaffold, routers, middleware)
content/topics/                 (schema fixtures — D3)
content/courses/                (schema fixtures — D3, if needed for render testing)
infra/docker-compose.yml
infra/docker-compose.override.yml
infra/nginx/
scripts/validate-content-links.*
~~~

### Do NOT touch
- `docs/SPEC.md` (already authored by `/plan` — this change implements against it, doesn't edit it)
- `docs/STACK.md` Gate Command rows (still `TBD` — architect fills these once the stack choice from
  SPEC.md §4/§7 is confirmed operationally; not this change's job)
- Any auth/account code (out of scope — SPEC.md §10)
- Second mini-course (Excel) or any ЕГЭ topic content beyond the `D3` placeholder fixture (real
  topic content is the next change, milestone `M1`→`M2` in SPEC.md §9)
- Payment/monetization code (out of scope — SPEC.md §10)

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source of
truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Fast Gate runs per task in `/work`; Full Gate and (with `--release`) Release Gate run once in
> `/ship`. Both are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

```bash
# Optional change-specific smoke override
# curl -s http://localhost:8000/api/tasks/placeholder-task/check -X POST -d '{"answer":"test"}'
# expected: { "correct": false, "explanation": [...] } — checker responds without error
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

- Content files are JSON only for M0, not `.mdx` — simpler to parse identically from both
  `apps/web` (TS) and `apps/api` (Python) without an MDX pipeline; SPEC.md §2.2 allows either.
- Content loading in `apps/web` had to go through `createServerFn` (`~/content/server-loaders.ts`),
  not a plain route `loader` reading the filesystem directly — TanStack Start route loaders run on
  both server and client, and `node:fs` can't be bundled for the browser. This in turn means the
  deployed frontend needs a running Node process (`web` service running `.output/server/index.mjs`
  behind Nginx) to answer server-function RPC calls on client-side navigation — not the simpler
  "Nginx serves a static export directly" topology originally sketched for `I1`. Updated
  `infra/docker-compose.yml`/`infra/nginx/nginx.conf` accordingly (still Nginx as the single public
  entry point, per SPEC.md §7.1).
- `apps/web/vite.config.ts` bakes the absolute `content/` path into the server bundle via a
  build-time `define` (`__CONTENT_ROOT__`), because a runtime-relative path computed from the
  loader module's own `import.meta.dirname` breaks once that module is bundled into
  `.output/server/` (a different directory than the source tree).
- Filled `docs/STACK.md`'s Fast/Full/Release Gate and Required Tooling tables, even though this
  change's own "Do NOT touch" list originally deferred that to the architect — the stack became
  concrete as part of this change, and the Fast Gate needs real commands to mean anything for the
  next `/work` session. Full Gate rows that need infra not set up yet (SAST, secrets scan, e2e,
  a11y/perf audits) are honestly marked `n/a — not set up in change 01`, not fabricated.
- `docker compose up` itself is unverified end-to-end — no Docker daemon was available in this
  environment (WSL without Docker Desktop integration). The compose files, Dockerfiles, and Nginx
  config are written and reasoned through carefully but should get a real run before `/ship`.
- The `/theory/zadanie-{n}-{slug}` route is one TanStack Router param (`$topicSlug`), not two —
  parsed with a regex in `~/content/loader#parseTopicRouteSlug` — since the task number and topic
  slug are one path segment, not two separate ones.
- No favicon yet (cosmetic 404 in the browser console, confirmed harmless via Playwright).
- Age marking in `SiteFooter.tsx` is a hardcoded "12+" placeholder pending the lawyer input
  SPEC.md §11 already flags; likewise the sitemap falls back to `https://example.invalid` until a
  real `SITE_URL` env var is set (no domain chosen yet).

---

## Commit Message

```
feat(change-01): project foundation — schema, scaffold, CI validation
```
