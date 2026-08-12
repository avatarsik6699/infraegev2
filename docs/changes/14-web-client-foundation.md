# CHANGE 14 — Web Client Foundation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `14` |
| Slug | `web-client-foundation` |
| Title | Web Client Foundation |
| Status | `active` |
| Branch | `feature/14-web-client-foundation` |

---

## Goal

Establish the production-ready client infrastructure in `apps/web` before more domain features are
added: generated API contracts, one typed HTTP boundary, explicit server-state/form ownership,
recoverable route states, deliberate loading and empty states, lazy code delivery, and a
privacy-safe browser-error path into the existing operations dashboard. Migrate the current
answer-checking journey as the real vertical slice; do not add a component showcase or speculative
global state.

---

## Backlog

### Backend

- [x] `B1` Make the FastAPI content/checker models an OpenAPI-accurate strict contract, including bounded answer input and the discriminated content-block response used by the web renderer — _Depends on:_ —
- [x] `B2` Add a bounded same-origin browser-error ingestion endpoint that accepts only sanitized taxonomy/fingerprint/frame fields, emits structured journald-visible events, and has focused API tests — _Depends on:_ B1

### Frontend

- [x] `F1` Add deterministic OpenAPI export, generated `openapi-typescript` contracts, `openapi-fetch`, drift-check commands, and architecture enforcement for the single runtime HTTP boundary — _Depends on:_ B1
- [x] `F2` Add an SSR-safe TanStack Query client and migrate answer checking to a typed no-automatic-retry mutation with explicit transport/timeout/abort/HTTP/protocol failures — _Depends on:_ F1
- [x] `F3` Migrate the answer form to Mantine Form 9.5.1 with Zod input validation, accessible inline errors, focus recovery, and retained analytics/progress behavior — _Depends on:_ F2
- [x] `F4` Add route pending/error/not-found boundaries, delayed skeletons, navigation progress, retry/reset behavior, and a real home-page empty state without breaking the document shell or no-JS content — _Depends on:_ F2
- [x] `F5` Add lazy code highlighting and automatic route code splitting while preserving prerendered/no-JS code, then add the accessible application scrollbar treatment — _Depends on:_ F4
- [x] `F6` Add the privacy-safe browser reporter with in-tab deduplication and fail-closed delivery through the generated API client; cover route/render/global failure sources without reporting expected form failures — _Depends on:_ B2, F1, F4
- [x] `F7` Extend unit and Page Object based browser journeys for the migrated form, loading/recovery/empty/not-found states, code rendering, reporter behavior, responsive layout, accessibility, and clean console output — _Depends on:_ F3, F5, F6
- [x] `F8` Resolve the Lighthouse accessibility regressions on the home and published lesson routes while preserving the existing axe-clean keyboard and screen-reader journeys — _Depends on:_ F7
- [x] `F9` Bring the published lesson's median Lighthouse LCP back within the 2.5 s Full Gate budget without weakening the accessibility or no-JS content contract — _Depends on:_ F8

### Infra

- [x] `I1` Add a dedicated Nginx rate/body limit for browser-error ingestion and update local/production configuration checks without weakening the existing checker limit — _Depends on:_ B2
- [x] `I2` Integrate structured browser-error journal entries into the existing `apps/ops` error source and presentation without adding a service or datastore — _Depends on:_ B2
- [x] `I3` Make OpenAPI drift verification part of the documented Fast/Full Gate and static CI path; update stack/package policy documentation to match the implemented client foundation — _Depends on:_ F1, I1, I2

### Other

- [x] `T1` Run the complete affected Fast Gate and required frontend design/architecture, backend architecture, LSP, browser screenshot/console, dependency, build, and contract-generation evidence; record only non-obvious residual risks — _Depends on:_ F7, I3

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md (only if a recurring pitfall is confirmed)
docs/changes/14-web-client-foundation.md
package.json
pnpm-lock.yaml
.github/workflows/quality.yml
apps/api/app/modules/content/schemas.py
apps/api/app/modules/tasks/schemas.py
apps/api/app/modules/client_errors/**
apps/api/tests/**
apps/api/scripts/**
apps/web/package.json
apps/web/vite.config.ts
apps/web/eslint.config.js
apps/web/scripts/**
apps/web/src/router.tsx
apps/web/src/routes/**
apps/web/src/shared/api/**
apps/web/src/shared/components/**
apps/web/src/shared/lib/**
apps/web/src/features/check-answer/**
apps/web/src/entities/content-block/**
apps/web/src/pages/home/**
apps/web/src/shared/styles/tokens.css
apps/web/tests/**
apps/web/e2e/**
apps/ops/contracts/**
apps/ops/server/integrations/**
apps/ops/src/pages/dashboard/**
apps/ops/tests/**
infra/nginx/**
~~~

### Do NOT touch

- Database schemas or migrations
- Account/authentication behavior
- Content topic/task meaning or publication status
- Production credentials, host state, or external SaaS configuration
- PWA/service workers, offline mutation queues, optimistic updates, or global client stores

---

## Contracts

See `docs/SPEC.md` §3–§5 and §8 and the Files list above. Do not hand-copy the schema, endpoints,
types, or env vars into this file — the codebase and `SPEC.md` are the source of truth.

---

## Gate Checks

In addition to the standard Fast Gate, regenerate OpenAPI artifacts and fail if the tracked schema
or TypeScript output differs. Run `scripts/tests/client-error-proxy.test.sh` for the dedicated
Nginx boundary. Browser verification must cover the answer mutation, route recovery,
not-found/no-JS content, and privacy-safe error delivery through typed fixtures/Page Objects.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- TanStack Start owns automatic route splitting and rejects Router's standalone
  `autoCodeSplitting` option; production build output is the acceptance evidence for the emitted
  per-route chunks.
- TypeScript LSP 5.9.3 still reports the repository's known false package-typing/implicit-any
  diagnostics while the same project passes `tsc --noEmit`; CLI type-check remains the gate.

---

## Commit Message

```text
feat(change-14): establish typed resilient web client foundation
```
