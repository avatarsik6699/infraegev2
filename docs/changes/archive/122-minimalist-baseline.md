# CHANGE 122 — Minimalist baseline

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `122` |
| Slug | `minimalist-baseline` |
| Title | Minimalist baseline |
| Status | `archived` |
| Branch | `feature/122-minimalist-baseline` |

## Goal

Implement the architect-approved September 17 plan in ONE change. Restore the white,
minimal public presentation of production `a5b0bf5`, retaining infraege identity, all public
learning routes and the complete server-owned practice bank. Archive the complete prior
implementation, simplify persistence and operations, and preserve documentation cleanup.
No production mutation, push, merge or archive is part of this `/work` invocation.

## Design References

Production `a5b0bf5`: white canvas, ink, text lists and quiet reading. Keep the current stone
logo, Alegreya/Golos Text/JetBrains Mono and small functional orange accents. This explicitly
supersedes the decorative homepage/catalog and lab-first requirements in older contracts.
Use existing semantic controls, typography and domain renderers; remove decorative mechanisms.

## Backlog

### Data
- [x] `D1` Preserve source branch/tag and verified external Git bundle; back up and restore-check the actual local bank/files before edits to persistence. Record source inventory. — _Depends on:_ —
- [x] `D2` Transfer the complete bank to a new isolated database/volume, preserving IDs, content, answers, files, private sources and lesson ordering; retain the old data and archive historical packages. — _Depends on:_ D1, B1

### Backend
- [x] `B1` Replace normalized history/package machinery with current task/checker/membership/file records, JSON metadata, a solution counter and transactional operator import/export; preserve safe public projections and file delivery. — _Depends on:_ D1, T1
- [x] `B2` Simplify public reads to numbered pages of 30, existing filters/next-task/lesson summaries; regenerate contracts and retain checker/error behavior. — _Depends on:_ B1

### Frontend
- [x] `F1` Restore a white minimalist presentation on all public pages, preserve infraege brand/fonts/content/navigation, remove decorative assets/components/tokens and both labs. — _Depends on:_ D1, T1
- [x] `F2` Adapt practice pagination/contracts; retain filters, solving/help/files/next/progress, remove persisted answer drafts and special catalog-position restoration. — _Depends on:_ B2
- [x] `F3` Remove analytics consent and client telemetry; update privacy and preserve functional errors/loading/accessibility. — _Depends on:_ T1

### Infra
- [x] `I1` Remove Umami/Beszel/sre-kit integration, publishers/tunnels and monitoring commands; retain application deploy/TLS/health/logs/security and simple scheduled backup/restore. — _Depends on:_ D1, T1
- [x] `I2` Wire the simplified database lifecycle and backup to isolated local data; retain old volumes and prepare explicit future production handoff without deployment. — _Depends on:_ B1, D2, I1

### Other
- [x] `T1` Reconcile SPEC/FRONTEND with the approved pivot and record reuse sources/accepted simple-model limits. — _Depends on:_ —
- [x] `T2` Synchronize STACK/PRODUCT/runbooks/tooling/tests with the finished implementation, preserving compacted history and hygiene. — _Depends on:_ B2, F1, F2, F3, I2
- [x] `T3` Verify focused data/import/restore/API contracts, desktop/mobile and degraded browser journeys, LSP, one affected-area Critical Gate and repository cleanup. — _Depends on:_ T2

## Files

### Create / modify

- Backend: `apps/api/app/`, `apps/api/migrations/`, `apps/api/tests/`, API contracts.
- Frontend: `apps/web/src/`, owned public assets, tests/e2e, boundary tooling.
- Data: `content/practice-*`, canonical simplified bank; preserve all authored lessons.
- Infrastructure: `infra/`, `ops/`, `scripts/`, Makefile, workflow/config dependencies.
- Documentation: SPEC, FRONTEND, STACK, PRODUCT, README, owning runbooks/playbooks.

### Do NOT touch

- Production hosts/services/data, sibling repositories, old DB volumes, secrets in output/Git.
- Immutable archive documents and user-authored lesson/reference artifacts.

## Contracts

See SPEC §3–§8 and FRONTEND. The September 17 chat-approved plan authorizes the product,
schema, API and operational changes; no repeated approval of those choices is required.

## Gate Checks

One affected-area Critical Gate from [STACK](../../STACK.md) for the complete target set.
Additional acceptance: source/target task parity, replay and rollback of imports, restored
nonempty DB/files, private projection checks, browser desktop/mobile/degraded states. Tests
run on host only. Full/Release Gate and production service retirement remain separate.

## Architect Review Notes

Audit requested by the architect on 2026-09-17; findings below were established by the agent.
Keep remediation within Change 122. The earlier implementation checks do not close these notes.

- [x] `R1` Repair current-bank validation: `import_bank` accepts `theory_links` to nonexistent
  material sections, while `scripts/validate-content-links.mjs` primarily validates the legacy
  150 JSON tasks. Validate the current 697-task bank and its publication/section references;
  add negative acceptance for invalid references and remove the requirement that new course
  practice IDs also exist in legacy JSON. Preserve transactional rollback on rejection.
- [x] `R2` Retire the unused filesystem-task runtime: web `shared/lib/content-files` and
  `shared/config/content.server.ts`, API `modules/content/service.py`/its obsolete exception and
  test cache setup, `CONTENT_DIR` startup dependency, Docker copies and dev mounts. Preserve
  shared block schemas and checker consumers. Keep historical JSON as evidence until its
  remaining validator/test consumers have been replaced; do not delete retained data volumes.
- [x] `R3` Finish documentation reconciliation: SPEC §2.1–2.3 still describes file-owned
  practice, old membership fields and a dry-run path; references to §3.2 no longer resolve.
  STACK still mentions stage-5 rollback. Remove the orphan analytics comment in `.env.example`.
  Align the authoring/gate instructions with the actual current-bank CLI and validation.
- [x] `R4` Remove confirmed unused UI/ops remnants: course-catalog `progress`/
  `progressTrack`, privacy `updated`, header `futureItem`, shared `paperSurface` and its
  exclusively owned tokens, `scripts/management-ssh-askpass.sh`, and empty `ops/__init__.py`.
  Trace token consumers before removal. Keep CSS composition helpers and Lighthouse tooling.
- [x] `R5` Resolved by architect decision: retain TanStack Query and its existing integration.
  Also retain `Diagram`, its exports and types; excluded from R4 by the same instruction.

### Review implementation scope

R1–R4 are authorized together; no new change. Update bank reference checks and the content gate,
remove only obsolete runtime/config/CSS/ops paths, then reconcile SPEC/STACK/runbooks. Done when
invalid theory links fail both import and the content gate, valid new IDs need no legacy JSON,
and application startup/images no longer require the old content directory. Preserve historical
fixtures still used by tests. Verify focused PostgreSQL/CLI tests, formatting/lint/types, LSP,
Docker lifecycle and public smoke after rebuild; CSS removals must leave live consumers intact.

## Implementation Notes

- Baseline `f69825322f7027cb30371906e56e71c0b8bb7dee`; archive branch and tag
  `archive/pre-minimalism-2026-09-17`, `snapshot/pre-minimalism-2026-09-17`.
- Git bundle: `/home/niquetamerewsl/backups/infraegev2/pre-minimalism-2026-09-17/source.bundle`.
- Reuse map: identity 95–96/101/107; decoration 95–105/107/112; hygiene/docs 94/98/108–111;
  functional loading 106/112; DB foundation 113–119; bank/editorial data 120–121. Mixed commits
  need selected adaptation, not blind cherry-pick. Source history remains reachable by tag.
- Accepted limits: one operator, sequential imports, no revision audit, concurrent editorial
  conflict resolution, background import or file garbage collection. Keep necessary validation
  at trust boundaries and a solution counter for stale submissions/progress.

## Verification and handoff

- Preservation: complete Git bundle verified; actual 121_01 source backup restored before edits.
  Source volume `infraege-dev_postgres18-data` remains intact. Actual source export and target
  export match all 697 task contents/checkers/private sources/solution counters and file metadata;
  547 catalog-visible tasks, 150 ordered lesson memberships, one six-byte attachment.
- Target: `infraege-dev_postgres122-data`, schema `122_01`. Fresh migration + `alembic check`
  pass. Four PostgreSQL acceptance tests cover full roundtrip/replay/transaction rollback,
  complete public projections, paging/filter/next, lesson order, answer checking, file headers,
  solution-counter behavior and readiness authentication failure. Existing checker/content/API
  tests also pass (172). No test runner executes in an application container.
- Backups: `minimal-final-database` under the protected backup directory was restored into an
  isolated PG18; the matching application verifier accepted all 697 tasks/checkers and file bytes.
  `minimal-api-image.tar` preserves that exact verifier. `legacy-api-image.tar` and `database`
  preserve the original model's restore capability. Intermediate bundles are evidence, not the
  recommended current restore source; use each bundle only with its matching image/tools.
- Frontend: production build and OpenAPI drift pass; 38 focused browser scenarios pass, including
  all 28 Python lessons in mobile no-JS mode, public navigation, paged practice, accepted progress,
  transient drafts, stale/network failure and explicit retry. Production font delay/failure
  test passes. MCP desktop/mobile screenshots inspected; public pages have no console errors.
  Isolated Nginx contract passes real 502/503/504 delivery, no app dependencies, resource/API
  exclusions and security headers.
- Critical Gate: format, web ESLint and architecture policies, TypeScript, Ruff, API + maintenance
  Pyright, TS/Python LSP, generated API, content/registry validation, ShellCheck 0.10.0, Compose
  config and dev lifecycle pass. Frontend unit tests pass. Deploy fail-closed preflight and seven
  failure/rollback tests pass; backup metadata tests pass. One optional concurrent snapshot test
  needs a separate selected fixture and was skipped; actual nonempty restore was verified above.
- Full/Release Gate, live production transfer, installed monitoring retirement, push, commit and
  merge were not performed. One change only. Follow-up review items R1–R4 are resolved; R5
  was closed by the architect’s decision to retain Query and Diagram. Local human review and
  the separate ship/release gates remain outside this implementation pass.
- No new dependency was introduced. Removed unused Pillow, decorative generators and icon/demo
  APIs. The large deletion count is mostly frozen old import packages, labs/assets and retired
  operations code; their originals are reachable through the preserved tag/bundle.
- Hygiene: gate reports analyzed; repository allowlisted cleanup passed. Backups, persistent
  task files, dependencies and original/new DB volumes are outside its removal scope.

### Follow-up audit — 2026-09-17

- Reverified source refs at `f698253`, full Git bundle validity, active change numbering and
  preservation of identity/font files, immutable archives and authored artifacts in the diff.
  All 697 canonical task payloads/checkers/solution counters and file metadata equal the
  protected pre-change export. The running dev DB's 697 task payloads/checkers/counters also
  equal the canonical bank. No source material/course metadata was claimed from the older
  normalized export, which does not contain those fields.
- Fresh checks: four isolated PostgreSQL acceptance tests passed; web TypeScript and current
  content validator passed. A separate isolated DB probe imported a nonexistent theory section
  and returned it in the public projection; the transaction was rolled back and the fixture
  removed. An in-memory invalid-bank probe also passed the content validator. The real bank
  currently has zero invalid material/section theory links: R1 is a missing guard, not observed
  corruption of existing tasks. No dev or production data was edited by the probes.
- Fallow graph traces confirmed the unused filesystem adapter and Diagram wrapper. Query
  packages are mechanically imported by infrastructure/test wiring, so their removal requires
  coordinated simplification rather than treating the dependency report as deletion proof.
  CSS `composes`, Nginx-mounted styles and shell-invoked Lighthouse are verified false positives.
  Four changed-contract review judgments were graph-anchored and accepted without stale or
  rejected anchors; that verifies their anchors, not the completeness of this audit.
- This pass reviewed code, data, docs and preservation. It did not rerun the earlier 38 browser
  journeys, production build, restored-backup rehearsal or Full/Release Gate. It records fixes
  without changing application code or removing candidate files.

### Review fixes and verification — 2026-09-17

- R1: the import service and read-only CLI validation share bank reference checks. The content
  gate checks the generated registry and all 697 canonical tasks, including schema, file bytes,
  material/section links and unique lesson positions. New course-task IDs need no legacy JSON.
- R2–R4: removed obsolete task loaders, startup configuration, image copies, dev mounts and reload
  paths; removed the listed unused CSS/tokens and ops stubs. Shared schemas, historical test
  fixtures, live CSS consumers, Diagram and Query remain. Updated SPEC/STACK/operator guidance.
- Affected Critical Gate: 173 focused PostgreSQL/CLI/API/content tests passed, including invalid
  references rolling back earlier writes, new IDs and startup without CONTENT_DIR. Ruff, Pyright,
  web TypeScript, ESLint plus architecture self-tests, format and API drift passed. Registry and
  canonical-bank validation passed. Shell syntax and Docker lifecycle contract passed; unrelated
  shell maintenance scripts were not changed or re-gated in this review pass.
- Python LSP reported no issues in changed modules/tests. JavaScript tooling files are outside
  the TypeScript LSP project (root script cannot resolve Node typings; web script is not included),
  so those diagnostics are not claimed clean; Node syntax, executed validator and ESLint
  architecture self-tests provide the applicable checks. No production TypeScript was added.
- Rebuilt dev API/web are healthy, with no /content/tasks directory or mount. Public /, /courses,
  /privacy, /practice and /health return 200. MCP mobile catalog and desktop privacy screenshots
  inspected; console errors: zero. Dev Nginx exposes /health; /health/ready is checked inside API.
- Full/Release Gate and the prior full browser/restore acceptance were not replayed for these
  focused fixes. Production, Git commits/merge/push and retained data volumes were not changed.
- Review logs analyzed; final repository allowlisted cleanup completed. Browser screenshots use
  the MCP host's default output directory after the architect-authorized permission retry.

### Recovering an old fragment

Start by inspecting the original commit and its paths; apply selected hunks to a new future change,
then adapt contracts and test the actual consumer. Whole feature commits often mix several concerns.

| Fragment | Starting commits |
|----------|------------------|
| Identity and fonts | `ba78426`, `1b10a14`, `c7c4783`, `53b4c6b` |
| Decorative compositions and motion | `c90788c`, `9bceab9`, `0165b62`, `682ab80`, `6899ef7` |
| Documentation/hygiene/compacted history | `a54680c`, `edcae3b`, `39a6fd4`, `9e16562`, `4dc2b93`, `0096385` |
| Functional loading and paint stability | `1a0b650`, `0f65653` |
| Previous practice model/import/release tooling | `35651cb`, `4be5553`, `a588ce1`, `0d036e4`, `7284559` |
| Catalog and editorial UX | `e9b52c6`, `e29e546`, `20f4fbe` |

Example read-only inspection: `git show 0165b62 -- apps/web/src/shared/components/svg-pattern`.
To inspect the complete preserved tree without touching this checkout, create a separate detached
worktree from `snapshot/pre-minimalism-2026-09-17`. Do not restore a whole old schema over current data.

## Commit Message

```
refactor(change-122): restore a minimal learning application
```
