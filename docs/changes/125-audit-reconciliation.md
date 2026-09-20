# CHANGE 125 — Audit reconciliation

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `125` |
| Slug | `audit-reconciliation` |
| Title | Audit reconciliation |
| Status | `active` |
| Branch | `feature/125-audit-reconciliation` |

## Goal

Resolve the five findings from the architect-requested current-code audit: protect actual
practice read entrypoints, align search with displayed statements, expose truthful answer
format guidance, restore root tooling lint coverage and reconcile lifecycle documentation.
The architect authorized these fixes in chat; additive API and rate-limit changes are in scope.

## Design References

Existing catalog/detail layout and `docs/FRONTEND.md`; no visual redesign.

## Backlog

### Backend
- [x] B1 Search only rendered statement content, including Python-only variants; regression coverage for hidden variants and visible structured text — _Depends on:_ —
- [x] B2 Add authored answer instruction to the public catalog projection and regenerate OpenAPI/client contracts without exposing checker data — _Depends on:_ —

### Frontend
- [x] F1 Replace generic answer metadata with consistent authored format guidance in catalog/detail; preserve compact responsive layout and SSR — _Depends on:_ B2

### Infra
- [x] I1 Apply a shared per-IP read budget to direct API, SSR and server-function entrypoints; permit one 100-task expansion, retain independent checker limit, verify with isolated Nginx — _Depends on:_ —
- [x] I2 Restore root JavaScript tooling lint in local commands and CI, using locked workspace dependencies — _Depends on:_ —

### Data
None. Do not mutate the bank or database schema.

### Other
- [x] T1 Reconcile README lifecycle and STACK lint/rate-limit commands with implementation; remove contradictory current-scope documentation encountered in this fix — _Depends on:_ I1, I2
- [x] T2 Complete affected Critical Gate, LSP, desktop/mobile/no-JS browser verification and allowlisted cleanup — _Depends on:_ B1, B2, F1, I1, I2, T1

## Files

### Create / modify
- Backend: `apps/api/app/modules/practice/catalog.py`, `apps/api/tests/test_minimal_bank.py`, generated API contracts.
- Frontend: `apps/web/src/entities/practice-task/**`, catalog row and task detail, relevant practice tests.
- Infra/tooling: `infra/nginx/nginx.conf`, `infra/nginx/conf.d/infraege*.conf`, `infra/nginx/snippets/practice-*.conf`, `scripts/tests/practice-read-limit.test.sh`, `scripts/check-shell.sh`, root/workspace lint configuration and scripts, `.github/workflows/quality.yml`.
- Docs: `README.md`, `PRODUCT.md`, `docs/STACK.md`, this change.

### Do NOT touch
- Authored bank/lesson content, historical archives, production, credentials and persistent volumes.

## Contracts

See `docs/SPEC.md` §3–§8, `docs/FRONTEND.md` and the Files list above.

## Implementation plan

- Preserve database schema: project existing public answer instructions; search JSONB using explicit visible-block paths instead of recursive all-code matching.
- Keep format display in the owning task entity, reusing catalog/detail metadata and existing spacing.
- Enforce the read budget at Nginx ingress; include SSR/function routes and keep assets/health/checker independent. Burst must cover 100 inline loads.
- Run root lint from repository root with a focused flat configuration and existing web ESLint dependencies; wire CI to the same command.
- Checks: affected API integration and frontend tests, isolated Nginx request contract, lint/format/types, generated API drift, LSP and Playwriter desktop/mobile/no-JS. No Full/Release Gate.

## Gate Checks

Affected Critical Gate from [STACK](../STACK.md). Additional focused contract:
`bash scripts/tests/practice-read-limit.test.sh` (host assertions, disposable Nginx only).

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Format labels come only from public authored instructions: the standard decimal-integer
  instruction becomes “Целое число”, the generic ordered-answer instruction becomes “По условию”.
  Unknown instructions remain verbatim rather than inferring a type from private checker values.
- Read burst 110 intentionally accommodates one fresh 100-row expansion. Repeated immediate
  expansions/navigation may exhaust the shared budget; checker and static assets remain independent.

## Verification — 2026-09-20

- Format, root/web lint and architecture policies, web compiler, API Ruff/Pyright, OpenAPI drift
  and full canonical content validation PASS. Frozen pnpm install refreshed local dependency
  metadata without lock/dependency changes. ShellCheck ran through temporary `uvx --from
  shellcheck-py` because no standalone binary was installed; the declared shell lint passed.
- 39 focused Vitest tests PASS (catalog, detail, inline solving). Three isolated PG18 acceptance
  tests PASS (catalog search/structured text, HTTP catalog/privacy/checker/files); eight unrelated
  tests deselected. One upstream TestClient deprecation warning remains.
- Actual dev and production Nginx configurations pass `nginx -t` and the isolated host-request
  test: 100-function burst accepted, API/SSR/functions/sitemaps share 429 exhaustion, health/assets
  unaffected, checker separately limited. Root lint negative stdin probe rejected undefined code.
- TypeScript/Python MCP diagnostics performed for changed domain, UI and test files. MCP reports
  the known Vitest inferred-parameter resolution issue in catalog tests; a realpath-aware workspace
  compiler including all nine changed/new TS/TSX files reports zero errors, including those tests.
- Playwriter screenshots reviewed for catalog/detail at desktop and 390px mobile. No overflow or
  new application console errors. Ordinary Windows Chrome emitted the pre-existing
  `chrome-extension://gcjikeldobhnaglcoaejmdlmbienoocg/content.js` error. Extension screenshot/no-JS
  snapshot calls were unreliable; completed mobile catalog/no-JS acceptance through Playwriter
  direct CDP in an isolated local Chromium profile. No-JS catalog retains ten format labels/native
  multiple select; detail retains format, statement and help (screenshot reviewed).
- Actual browser “Раскрыть все” with limit 100 loaded 100 forms: 100 server-function responses,
  zero HTTP failures and no new console errors. Impeccable detector reported no findings.
- Allowlisted cleanup completed after dry-run review; `make clean-check` PASS.
- `make dev` rebuilt changed images and reached healthy state, using the retained local bank;
  no bank import or production access. Full/Release/security/performance gates skipped: affected
  Critical Gate only. No commit, merge, archive or deploy.

## Commit Message

```text
fix(change-125): reconcile practice and tooling audit findings
```
