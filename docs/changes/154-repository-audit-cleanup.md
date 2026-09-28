# CHANGE 154 — Repository audit and cleanup

## Change Metadata

| Field | Value |
|---|---|
| Change | `154` |
| Slug | `repository-audit-cleanup` |
| Status | `active` |
| Branch | `feature/154-repository-audit-cleanup` |

## Goal

Audit the repository, resolve confirmed documentation/tooling/code drift and reduce completed
materials in the checkout with exact-byte Git recovery. The architect approved whole-repository
coverage, maximum reduction of completed artifacts and compaction of changes 111–153.
Production, database/volume changes, Git-history rewriting and push/deploy are excluded.

## Backlog

- [x] `T1` Audit documentation, code/test consumers, dependency/tooling/CI boundaries and tracked/untracked/ignored artifacts; record verified findings and disposition before remediation. — _Depends on:_ —
- [x] `T2` Reconcile current documentation with schema/progress/analytics/browser/gate behavior; retain historical decisions and release prerequisites without asserting live production state. — _Depends on:_ T1
- [x] `T3` Extend verified history tooling to sequential snapshots with legacy-format compatibility, explicit source selection, fail-closed validation and real-Git behavioral tests. — _Depends on:_ —
- [x] `T4` Compact changes 111–153 and retired artifacts by exact manifest; retain prior snapshot, unique decisions/approvals/risks and active sources; verify every removed byte can be recovered. — _Depends on:_ T1, T3
- [x] `T5` Resolve confirmed unused-code/config/test and cleanup-boundary findings without broad dependency upgrades, weakening tests or changing product behavior. — _Depends on:_ T1
- [x] `T6` Independently review the integrated diff, resolve findings, run one affected Critical Gate and finish allowlisted cleanup with before/after evidence. — _Depends on:_ T2, T3, T4, T5
- [x] `I1` Include history source/tests in routine format, host lint/Pyright and static CI; include cleanup scripts in shell lint and local Full contracts. — _Depends on:_ T1
- [x] `I2` Prevent cleanup through symlink ancestors; prove external data, local banks, secrets and authored evidence survive cleanup. — _Depends on:_ T1
- [x] `T7` Complete a coverage matrix for the originally approved whole-repository audit: each subsystem/config/doc/test area, inspected evidence, remaining uncertainty; individually disposition residual static findings and identify any further confirmed fixes before final closure. — _Depends on:_ —
- [x] `I3` Reconcile remaining guest-lock/master-source documentation and isolate test-only legacy browser-progress migration fixtures from production slices; prune confirmed unused private type exposure. — _Depends on:_ T7
- [x] `I4` Correct the backend module inventory and isolate the legacy Task test schema; remove the test-only checker compatibility re-export while retaining existing assertions. — _Depends on:_ T7
- [x] `I5` Align AGENTS required-browser wording with Playwriter-first and document the boundary between Full's enumerated contracts and specialized affected-area suites. — _Depends on:_ T7
- [x] `I6` Run the owning isolated PostgreSQL suite to reconcile stale bank/publication assertions, add explicit role-denial coverage and resolve reproduced test drift without changing schema or runtime behavior. — _Depends on:_ T7
- [x] `I7` Bring the account page's component file ownership, root props and named effects into the binding FRONTEND §2 shape while preserving its account forms and behavior. — _Depends on:_ T7

- [x] `T8` Run the explicitly requested Full Gate, append and resolve any reproduced failures, analyze evidence and finish local ship with commit, merge and archive. — _Depends on:_ T6, T7

- [x] `I8` Fix Full Gate catalog test drift: cover all seven published topics and verify progress assertions against the current server summary contract; retain stale/revision/context exclusion checks. — _Depends on:_ T7

- [x] `I9` Fix the reproduced E2E strict-selector collision between topic 5 and 25 in the owning Page Object; preserve the combined-filter journey and verify the affected browser spec. — _Depends on:_ T7

## Files

Create/modify: this change; `scripts/change_history.py` and owning tests;
`docs/changes/archive/COMPACTED.md`; current README/PRODUCT/AGENTS, SPEC/STACK/FRONTEND/GOTCHAS,
templates/playbooks/runbooks/wrappers as findings require; cleanup script/tests;
confirmed obsolete tooling/code only after a recorded finding.
Create: `docs/artifacts/154-repository-audit.md` as current audit evidence with coverage and individual signal dispositions.
Delete: only exact verified manifest entries from changes 111–153 and retired artifacts.

Do NOT touch: production, DB schema/data, Docker volumes, dependency versions/locks, environments,
secrets, user local banks/attachments, runtime assets or sources required by generation, and Git objects.

## Contracts

See SPEC §3–§8, FRONTEND, STACK and the approved chat plan. Public HTTP/schema contracts remain unchanged.

## Gate Checks

Affected Critical only: history/cleanup real-Git and preservation tests; affected API and account tests,
isolated PG18 role/publication acceptance and focused browser review for I7; tooling Ruff/Pyright/LSP,
shell lint, formatting, current documentation link/anchor integrity, exact-byte recovery,
content/brand consumer checks where relevant. The architect explicitly requested Full Gate and
final local ship on 2026-09-28; execute every STACK Full row using an isolated fresh database.
Append reproduced failures before remediation, then resume ship. Parent owns shared gate, deletion
and cleanup. Push/deploy remain excluded.

## Audit findings

| ID | Evidence / finding | Disposition |
|---|---|---|
| A01 | README introduction and SPEC §1.3 still count two TopicLessons; publication registry contains seven published topics. | Correct current-source inventory; no deployment claim. |
| A02 | README, PRODUCT, package description and practice runbook describe browser-local progress; PRODUCT excludes implemented accounts. | Reconcile with optional accounts/server progress and guest behavior. |
| A03 | README/practice runbook call `122_01` current; migration head and STACK are `140_01`. Host instructions omit app-role configuration. | Describe current schema and link account-specific prerequisites. |
| A04 | README/PRODUCT claim browser analytics removed; root route and SPEC retain public cookieless tracker. | Distinguish removed application-hosted stack from external tracker. |
| A05 | FRONTEND requires MCP screenshots; Playwriter-first governs current tools. README calls weekly/manual audits production gates and says a11y never runs in CI. | Align with STACK and weekly browser exception. |
| A06 | Verification runbook repeats the four-Gitleaks-findings sentence; change template still says release risk can trigger Full implicitly. | Remove duplication and stale gate policy. |
| A07 | 91 tracked artifacts, 39,803,722 bytes, include finished audit/screenshots/research; no exact duplicates. | Compact completed materials; retain logo generation source, lesson quality and future curriculum input. |
| A08 | Fallow trace + repository search find no consumers of SelectField (four files) or use-persisted-store-hydration. | Delete only those five unreachable files; update obsolete FRONTEND reference. |
| A09 | Fallow unused public re-exports `calculateReadingPosition` and `PublicHeaderIdentity` have only owning-slice consumers. | Remove unnecessary barrel exposure; retain implementations. |
| A10 | Existing compaction accepts only one snapshot; repeated artifact path already has two historical versions. | T3 versioned sequential snapshots and explicit source selection. |
| A11 | History source/tests absent from routine formatter, host static groups/Pyright and CI; cleanup source/test absent from shell lint and local Full contracts. | I1 restore consistent static coverage and local preservation acceptance. |
| A12 | Isolated dry-run with apps/web symlinked outside the repository selects external `.output` via lexical path. | I2 refuse symlink ancestors in every mode and add preservation regression. |
| A13 | Snapshot byte-check rejects a leaf symlink but previously accepted matching bytes through a symlinked ancestor. | Extend T3 checkout validation and real-Git regression before final acceptance. |
| A14 | Header `.futureItem` has no markup/class consumer or dynamic styles lookup; only two obsolete CSS rules remain. | Remove both dead selectors under T5; rendered header unchanged. |
| A15 | Independent review found Change 120's deferred mathematical review missing from the new checkpoint summary. | Retain imported-answer validation limits and architect-owned review under T4. |
| A16 | FRONTEND §13 calls the guest invitation a tooltip, contradicting §5 and GuestProgressLock; §10 does not explain preserved masters now live in the verified snapshot. | Reconcile descriptions with current implementation and exact-byte source recovery. |
| A17 | Legacy browser-progress storage, first-import mapping and Zustand persistence adapter have only historical test consumers; they remain in production slices despite server-owned progress. | Move unchanged legacy helpers/mapping to test fixtures and retain migration assertions. |
| A18 | PracticeHistory/PracticeProgressStatus and ApiErrorKind barrel exposure have no consumers outside their owning implementation; theory comment incorrectly describes historical task JSON references. | Keep private types local, remove unused exposure and correct the authored theory comment. |
| A19 | Backend module map omits account/auth/progress; legacy Task schema and tasks/service.py checker alias are consumed exclusively by tests. | Correct module map and move legacy schema into tests; tests import the real shared checker. |
| A20 | AGENTS Required Tooling still names MCP-only frontend tools despite its own Playwriter-first rule; Full enumerates only part of the specialized operations suite. | Align browser wording; explicitly inventory specialized suites without changing gate cadence. |
| A21 | test_minimal_bank still expects 697 bank tasks while the canonical bank contains 735; public visibility independently remains 547 and exam-27 is hidden. Negative database role boundaries lack explicit assertions. | Run owning isolated DB suite, reconcile observed publication expectations and add least-privilege assertions. |
| A22 | account-page.tsx declares five React components, anonymous effects and destructured root props contrary to FRONTEND §2; current lint does not enforce these rules. | Extract private components into owning files, namespace root props and name effects without changing rendering/behavior; explicitly record lint coverage limits. |

Initial observations: Fallow 3.28.0 reported 73 dead-code signals, 57 health advisories and
45 clone groups (3.49% duplication). These are triage signals, not confirmed defects.
CSS `composes` explains link/pattern stylesheet flags; Nginx maps `/_infraege/styles.css`;
the account Playwright config is script-invoked; `@lhci/cli` is invoked through the Lighthouse
shell runner; Diagram and TanStack Query are explicitly
retained contracts; generated schema/type namespaces and server-loader wrappers remain intentional.
Fallow boundary/policy detectors are unconfigured; zero counts do not prove those boundaries.
Repository ESLint policies remain binding. Complexity/duplication alone does not justify a
behavior-changing redesign. Ignored local bank (~33 MB), task files, environments, dependencies
and secrets remain protected; no blanket ignored-file removal.

## Verification

Completeness correction (architect question, 2026-09-28): the completed remediation and scoped
diff review below do not establish comprehensive whole-repository review. T1/T6 were reopened
until T7 closed the evidence gaps; the follow-up coverage matrix records actual scope and limits. The initial missing evidence concerned audit breadth and individual residual-finding triage.
The follow-up additionally reproduced and fixed stale DB test expectations; recovery evidence
remained intact throughout.

- PASS: frozen pnpm install without lockfile churn; `pnpm format:check`; web lint and its
  executable architecture policies; web TypeScript; host Pyright; affected Ruff and shell lint.
- PASS: 14 history real-Git tests (worker final follow-up) and five gate tests; expanded cleanup
  contract proves external symlink data, local banks/files, authored evidence and secrets survive.
- PASS: Python LSP for history/source tests/gate core and TypeScript LSP for both changed barrels.
- PASS: 13 focused Vitest brand/header tests; two content-asset tests; canonical validation
  (735 tasks, seven TopicLessons, 28 CourseLessons); current document paths/anchors.
- PASS: all 128 retired files verified before deletion and recovered after deletion; legacy
  metadata values unchanged; coverage through 153, active 154, next 155. Independent review found
  no remaining defects after A13/A15 remediation.
- Raw docs: 40,559,791 bytes before → approximately 526,347 bytes after (including active audit evidence).
  Artifacts: 91 files / 39,803,722 bytes → seven files / 61,343 bytes. Fallow dead-code signals
  73 → 57; retained entries have individual consumer/contract dispositions. Individual disposition of the complete pre-follow-up 61/57/45 set is recorded in
  `docs/artifacts/154-repository-audit.md`; final dead-code signals are 57, health 57, clones 45.
  These counts are not a green formal security or architecture audit.
- Initial affected acceptance SKIPPED Full/build/image/broad security/production suites; the later explicit Full section supersedes the Full/build skips. Dependency versions/locks,
  persistent data, runtime assets, API public contracts and migrations remain unchanged.
  API drift, isolated DB and account browser checks were added for I4/I6/I7.
- PASS: final `make clean-dry-run`, reviewed cache-only allowlist, `make clean`, `make clean-check`
  and `git diff --check`. No commit/merge/push/deploy ran.

## Implementation Notes

- Compaction preserves local Git sources; it does not reduce `.git`, create an off-site copy or
  close historical legal/release/deferred human-review risks. Source originals are recoverable
  from COMPACTED; Change 154 itself was excluded from the snapshot while active.

## Commit Message

```text
chore(change-154): reconcile docs and compact retired artifacts
```

## Completion follow-up evidence

- Whole-repository source/config/docs/test inventory and all 61 dead-code, 57 function-health
  and 45 clone observations are individually dispositioned in the active audit artifact.
- A16–A22 fixed: remaining docs conflicts, test-only production compatibility code, stale
  bank/topic expectations and account component contract shape. Publication visibility was
  independently checked before changing assertions: 735 bank tasks, 547 publicly visible.
- PASS: web lint/types, 15 initial focused tests and 19 account-focused tests; API Ruff/Pyright,
  171 pure checker/task API tests, 21 isolated PG18 bank/account tests (including table/column
  role denial), API contract drift, formatter and changed-boundary LSP.
- PASS: real synthetic account browser integration; Playwriter guest registration transition
  with mocked session/mail response; desktop/mobile inline DevTools screenshot review after
  Playwriter capture timeout. No observed console/hydration errors or failed browser requests.
- Independent reviewer confirmed exact history/fixture preservation, corrected inaccurate
  test-to-function mappings, verified account component/helper AST equivalence, and required
  column/TRUNCATE privilege assertions before accepting the final DB test. No remaining
  implementation findings. Test inventory is not measured branch coverage of every function.
- Initial DB attempt failed one stale count and could not start Docker; after local Docker
  startup the next run exposed a stale two-topic assertion (20 passed / one failed). Both were
  fixed and the final owning suite passed 21/21. No partial attempt is reported as PASS.
- Tool limits and installed Starlette/httpx/PostCSS/color-mode warnings are recorded in the
  artifact. Real mail/providers, broad security, production and deferred human reviews remain
  outside this hygiene change. No commit/merge/push/deploy has run.

- Final hygiene PASS: reviewed cache/report-only `make clean-dry-run`, `make clean`,
  `make clean-check`, diff whitespace and no remaining owned DB/browser-audit containers.
  The temporary Vite process and Playwriter session were stopped; no user tab was closed.

## Explicit Full Gate and final local ship

Architect authorization: Full Gate, immediate remediation of reproduced failures and final local
ship (2026-09-28). Production, push and deploy remain excluded.

| STACK Full row | Result / evidence |
|---|---|
| Formatting | PASS: root `pnpm format:check`; final changed-test Prettier check. |
| Infrastructure / bootstrap | PASS: rebuilt API/web images; isolated Compose PostgreSQL/API/web/Nginx healthy; provisioning/migration jobs exit 0. Fresh unique named volume replaces only the PostgreSQL mount target through an external temporary override; prior gate volume retained. |
| Operations contracts | PASS: all nine enumerated shell contract scripts. Fake transport does not establish live production backup/deploy operation. |
| Host Python contracts | PASS: 48 collected, 48 passed: initial standard suite passed 47 with one opt-in skip; the snapshot consistency test subsequently passed against the explicitly supplied isolated gate PostgreSQL container. |
| Migrations | PASS: host upgrade/current/check, head `140_01`, no drift; isolated importer seeded 735 tasks. |
| Backend tests | PASS: 226 tests including isolated database tests. Installed Starlette/httpx deprecation warning remains non-failing. |
| API contract drift | PASS: generated schema/type comparison unchanged. |
| Frontend build | PASS: host build and prerender crawl; wrapper restored Compose web. |
| Frontend unit tests | PASS: final full suite 39 files / 289 tests. Initial run 285 passed / four failures; I8 fixes stale four-topic fixture/counts with seven explicit published IDs and retains revision/removed-task/course-context exclusions. Fixture task totals remain deliberately synthetic. |
| E2E collection | PASS: 112 tests / 13 specs. |
| E2E | PASS after I9: full run 111 passed / one strict-locator failure; topic-5 regex also matched topic 25. Anchored topic option selectors in the owning Page Object; entire affected practice-catalog spec then passed 10/10. Unchanged 111 checks remain accepted; no partial run is described as a single 112/112 run. |
| Smoke | PASS: API `/health/ready` on 18000; Nginx homepage and supported `/health` on 18080 return 200. Nginx intentionally exposes only exact `/health`, not `/health/ready`; the extra latter probe returned 404 and was corrected to the documented route. |
| Accessibility | PASS within the complete E2E run; no duplicate focused audit. |
| Content | PASS: two asset validator tests; 735 tasks, seven TopicLessons and 28 CourseLessons. |
| Hygiene | PASS: reports/trace analyzed; owned gate containers/network removed without volumes; dry-run allowlist reviewed, clean and clean-check passed. Current Markdown: 29 files / 78 relative links, zero unresolved paths/anchors. |

Additional remediation acceptance: web lint/policy self-tests and TypeScript PASS; changed unit
test LSP has zero diagnostics. Isolated E2E LSP reproduces the documented wrong Playwright
declaration view (16 cascading diagnostics); the real workspace compiler checks the Page Object
with zero diagnostics, and lint plus its ten browser scenarios pass. No casts or API import
changes were used to hide adapter errors. Broad security/performance/image-scan/release proof
remain separate specifically requested or release checks under current STACK, outside this local Full.

Independent follow-up review found no blocking findings in I8/I9. The opt-in host snapshot
consistency test passed against the isolated seeded gate PostgreSQL container: concurrent write
was excluded from both snapshot queries and dump. Final host acceptance is 48/48 across the
standard suite and the explicit fixture rerun. The owned containers/network were removed again
without deleting the retained unique test volume. Local ship is authorized and ready after
final hygiene; it does not establish production release approval.
