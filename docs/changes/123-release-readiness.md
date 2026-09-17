# CHANGE 123 — Release readiness after minimalist restoration

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `123` |
| Slug | `release-readiness` |
| Title | Release readiness after minimalist restoration |
| Status | `active` |
| Branch | `feature/123-release-readiness` |

## Goal

Run the architect-requested Full/Release Gates after Change 122, repair findings and reconcile
current documentation with executable contracts. Keep all remediation in this single change.
Preserve Diagram, TanStack Query, the minimalist identity, archived history and retained data.

## Design References

Unchanged: SPEC §5 and FRONTEND minimal visual profile.

## Backlog

### Backend
- [x] `B1` Investigate and fix backend/data/API failures found by complete regression and release checks, preserving current contracts. — _Depends on:_ —
- [x] `B2` Fix CLI import storage permissions: umask 077 creates attachment bytes as 0600, unreadable by the Nginx worker. Publish validated storage bytes with read access while preserving private exports; test fresh/replayed import. Files: practice/cli.py and tests/test_minimal_bank.py. — _Depends on:_ —
- [x] `B3` Return storage-unavailable 503 for invalid attachment storage metadata/size instead of content-not-found 404; preserve genuine missing-task/usage 404. Files: practice/api.py, tests/test_minimal_bank.py. — _Depends on:_ —

### Frontend
- [x] `F1` Investigate and fix frontend build, unit, browser, accessibility and performance findings without restoring decorative systems. — _Depends on:_ —
- [x] `F2` Fix mobile lesson CLS (0.248 in all three Lighthouse runs): outline initially renders expanded then collapses during hydration; stabilize disclosure and above-article progress geometry, retain no-JS navigation and desktop semantics. Files: shared responsive-disclosure, topic/course progress if needed, owning tests/POM. — _Depends on:_ —
- [x] `F3` Remove seven references to deleted CSS exports that currently evaluate to undefined, preserving rendered classes. Files: lesson-outline-content.tsx, lesson-progress.tsx, topic-catalog-page.tsx, course-catalog-page.tsx, fragment-link.tsx. Verify the complete CSS-reference scan and affected unit/type/lint checks. — _Depends on:_ —

### Infra
- [x] `I1` Verify isolated Full Gate bootstrap, migrations and operations contracts; repair executable gate drift. — _Depends on:_ —
- [x] `I2` Run security and production image checks; repair findings and verify production render and repository/environment prerequisites. — _Depends on:_ I1
- [x] `I3` Verify first-cutover data/restore/rollback prerequisites and report exact release readiness without bypassing operator acceptance. — _Depends on:_ B1, F1, I2
- [x] `I4` Resolve Gitleaks false positives for the exact public route slug and attachment checksum using narrowly scoped rule exceptions with default rules retained. Files: .gitleaks.toml, scripts/security-gate.sh if explicit config selection is needed. Verify a synthetic secret remains detectable. — _Depends on:_ —
- [x] `I5` Patch vulnerable transitive js-yaml 4.x to 4.3.2 (GHSA-2883-xcg3-v3hh), retain supply-chain policies and reverify audit/build/images. Files: pnpm-workspace.yaml, pnpm-lock.yaml. — _Depends on:_ —
- [x] `I6` Refresh the pinned Node 22.23.2 image digest and scan every production image; the refreshed image still needs exact libpcre2-8-0=10.42-1+deb12u1. Repair other confirmed image findings with narrow pinned patches. Files: application Dockerfiles, matching CI references, STACK image policy. — _Depends on:_ —

### Other
- [x] `T1` Reconcile current SPEC, STACK, FRONTEND, README, PRODUCT and runbooks with code; preserve immutable archives and historical evidence. — _Depends on:_ —
- [x] `T2` Reverify all fixes with required tooling and complete the requested gates; record results and allowlisted cleanup. — _Depends on:_ B1, F1, I1, I2, I3, T1

## Files

### Create / modify

- `docs/changes/123-release-readiness.md`; current `docs/*.md`, `docs/runbooks/*.md`, README and PRODUCT.
- Gate findings only: owning files in `apps/api/`, `apps/web/`, `scripts/`, `infra/`, `ops/`, workflows and dependency manifests/locks.
- Record concrete finding paths before editing their implementation.

### Do NOT touch

- Immutable archives, preserved source branch/tag/bundle, original data volumes and authored lesson artifacts.
- Secrets in output/Git; destructive database operations; unrelated sibling services.

## Contracts

See SPEC §2–§8, FRONTEND and the Files list. This is verification and corrective maintenance,
not a new product/schema design. Production transfer still requires the transition runbook's
explicit source selection and immutable-SHA acceptance.

## Gate Checks

Full and Release rows from [STACK](../STACK.md) explicitly requested by the architect.
Run tests only on host; isolate gate database and file storage from development/production.
Analyze failures, repair through work, then reverify affected checks. No waived security,
data-transfer, backup or rollback prerequisites. Record any unresolved external prerequisite.
The architect subsequently selected local ship only: production transfer, immutable-SHA
attestation, push and deploy remain a separate explicitly authorized release step.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- T1 confirmed drift: SPEC §6 still advertises removed client-error ingestion; STACK module map and host-port description are stale; README promises content bind mounts and a database-free full frontend. Reconcile these against current routes, Compose and CLI.
- I6 scan also found fixed gzip, PCRE2, SQLite and Perl vulnerabilities in the API image (including three CRITICAL), and libuuid in Nginx. Pin the scanner-reported patched versions, following the existing targeted OS-patch pattern; no ignored vulnerabilities or broad upgrades.

## Verification — 2026-09-17

All checks use the candidate source on this feature branch. This is pre-release verification,
not a claim that the canonical merge/push/deploy workflow or production cutover has completed.

| Full Gate row | Result |
|---|---|
| Formatting | PASS, Prettier and Ruff |
| Isolated bootstrap | PASS, four healthy services and completed migration job; separate gate storage/volume |
| Operations contracts | PASS, backup/restore, deploy preflight and host-web wrapper; all 13 maintenance tests including concurrent snapshot |
| Migrations | PASS, head 122_01, no model/schema drift |
| Backend | PASS, 181 tests; existing upstream Starlette/httpx deprecation warning |
| API drift | PASS |
| Frontend build / unit | PASS, two prerenders; 145 tests across 19 files |
| Browser collection / E2E | PASS, 50 scenarios including all 28 course lessons without JS |
| Smoke | PASS, readiness and Nginx attachment response equal the canonical file bytes |
| Security | PASS, Gitleaks, Semgrep, Trivy filesystem, pnpm and pip-audit; synthetic secret still detected |
| Accessibility | PASS, eight axe routes, also included in E2E |
| Performance | PASS, five routes, median of three; table below |
| Content | PASS, asset contracts, registry and complete 697-task canonical bank |
| Hygiene | PASS, reviewed clean-dry-run, clean and clean-check |

| Route | Median LCP (ms) | CLS | TBT (ms) |
|---|---:|---:|---:|
| / | 3318.837 | 0 | 0 |
| /ege | 3016.644 | 0 | 0 |
| /courses | 3315.106 | 0.016 | 0 |
| /courses/python | 3467.758 | 0 | 0 |
| /ege/16-rekursiya | 3919.427 | 0.0083 | 96 |

- The initial lesson CLS was 0.248 in all three runs. Its corrected mobile disclosure passes
  a dedicated production test holding/releasing scripts, plus the existing delayed/failed-font
  test (two layout scenarios). A concurrent-workload rerun measured LCP 4069 ms; the controlled
  idle rerun above passed unchanged budgets. This runner remains close to the 4000 ms ceiling.
- Production-source desktop/mobile MCP screenshots inspected; console errors/warnings zero.
  The seven removed CSS references previously evaluated to undefined, so rendered classes did
  not change. Complete source CSS-reference and current Markdown-link checks pass.
- Python LSP and changed production TypeScript LSP are clean. MCP E2E diagnostics still have
  the documented pnpm realpath/Playwright reexport limitation; repository TypeScript, typed lint,
  executed E2E and production layout tests pass. No casts or suppressed type rules were added.
- A fresh nonempty backup of the isolated bank was restored into a labelled disposable PG18
  instance and verified with the current API image: 697 tasks/checkers and file bytes accepted.
  The restore container was removed. The concurrent-write test's own marker was removed by exact
  ID from the isolated gate database; development/production data was never selected for tests.

### Release checks and remaining handoff

- Production images: PASS, all three candidate images scanned with zero fixed HIGH/CRITICAL
  findings. Exact OS patches cover the Node PCRE2, API gzip/PCRE2/SQLite/Perl and Nginx libuuid
  findings; js-yaml is pinned to 4.3.2. No vulnerability ignore was added. PCRE2 fix reference:
  [Debian DLA-4772-1](https://security-tracker.debian.org/tracker/DLA-4772-1).
- Production Compose render: PASS with a complete protected temporary environment; no secret
  output. GitHub auth/repository/environment checks: PASS; required secret names present,
  no required reviewers and can_admins_bypass=true as documented.
- Existing target health: PASS at a5b0bf5793a85a4e9090f47c311ae01c022f194d. Read-only VPS inventory
  confirmed PostgreSQL 16.14, no application tables, no database-current release or cutover
  attestation. Retired monitoring services are still running; they were not changed.
- I3 prerequisite verification and readiness reporting are complete. The first production
  cutover remains deferred under the architect-selected local ship scope: the transition
  runbook requires explicit approval of the initial bank when production has none, then
  exact-candidate data/restore/rollback acceptance. Local gate success does not satisfy that
  operator attestation; the complete production Release Gate has not passed.
- Initial-bank candidate: content/practice-bank/bank.json, SHA-256
  3f166f5a3de229b31c05a2e3765ac0e37a54ad4064e862d2c4f240bfb762b2ad;
  697 tasks, 547 catalog-visible, 150 lesson memberships, one six-byte attachment. Original
  source branch and peeled snapshot tag still resolve to f69825322f7027cb30371906e56e71c0b8bb7dee.
- The architect authorized committing, merging and archiving this single remediation change
  locally. No push, production data write or deploy is included. Production cutover is the
  next proposed scope, not an unresolved implementation finding in this local ship.

## Local ship verification — 2026-09-17

Critical Gate: PASS. Repository formatting; web lint/architecture and typecheck; API Ruff
and Pyright; shell lint/syntax; API drift; nine focused backend and 40 focused frontend
tests passed. Refreshed Python/TypeScript LSP diagnostics are clean. The existing upstream
Starlette/httpx warning remains non-failing. Full E2E, accessibility, performance, image and
security suites were not repeated for local ship; their completed Full Gate evidence is above.
No content-asset implementation changed, so its focused suite was not repeated.

Gate services and host preview were stopped. Reports and temporary scanner tools were analyzed
and removed. The isolated gate database volume and its protected environment/file fixture are
retained for reproducibility; original development and backup data remain untouched.
Repository allowlisted cleanup and clean-check pass. Backlog and review notes have no
unresolved implementation items; production prerequisites remain explicitly deferred above.

## Commit Message

```
fix(change-123): reconcile and verify release readiness
```
