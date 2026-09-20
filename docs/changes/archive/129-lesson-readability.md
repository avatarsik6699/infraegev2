# CHANGE 129 — Lesson readability

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `129` |
| Slug | `lesson-readability` |
| Title | Lesson readability |
| Status | `archived` |
| Branch | `feature/129-lesson-readability` |

## Goal

Implement the approved lesson refinement plan for EGE and Python lessons, preserving authored
content and progress. Inline notation becomes unadorned across lessons and standalone practice.

## Backlog

### Frontend
- [x] F1 Compact outline spacing; 32px minimum for mouse and 40px for touch, stable SSR outline. — _Depends on:_ —
- [x] F2 Quiet compact reset trigger, content width, secondary text; preserve confirmation and focus return. — _Depends on:_ —
- [x] F3 Plain inline code/formulas by default, explicit highlight option, preserve authored accents and block surfaces. — _Depends on:_ —
- [x] F4 Transparent code disclosure in both states, including hover/active; retain selected help styling. — _Depends on:_ —
- [x] F5 Share catalog difficulty glyph, use actual numeric task difficulty instead of tab position. — _Depends on:_ —
- [x] F6 Stronger task headings (18px/600 UI font), vertical theory-link list below with 8px gap and 16px before statement. — _Depends on:_ —
- [x] F7 Standard 14px previous/next links with wrapping and 40px targets. — _Depends on:_ —
- [x] F8 Shared scroll-to-top after one viewport: desktop outside reading column, mobile 56px bottom strip plus safe area and scroll reserve; hide for input/modal, reduced-motion support, focus lesson title. — _Depends on:_ —
- [x] F9 Restore lesson task theory links to the right of the heading with a safe gap and vertical list; stack below only on narrow layouts; use Lucide Link instead of ArrowRight (architect correction). Supersedes F6's placement below on all widths. — _Depends on:_ F6

- [x] F10 Place the Lucide Link icon before the theory-link text, keeping its gap and text-only underline (architect correction). — _Depends on:_ F9

- [x] F11 Reduce the mobile return-to-top strip to its 40px control height plus safe area, remove the separator, and reduce the page/scroll reserves accordingly (architect correction). Supersedes F8's 56px strip. — _Depends on:_ F8

### Other
- [x] T1 Update frontend contract and focused regression tests; verify desktop/mobile, degraded states, TypeScript LSP and Critical Gate. — _Depends on:_ F1, F2, F3, F4, F5, F6, F7, F8, F9

### Backend / Infra / Data
None.

## Files

### Create / modify
- Frontend: widgets/lesson-outline; features/lesson-practice; entities/practice-task model, adapter and difficulty components.
- Frontend: shared/components/{button,confirmation-dialog,fragment-link,notation,scroll-to-top}; shared/lib/scroll-to-top; shared/styles/lesson-layout.module.css; shared learning-content styles.
- Frontend: pages/{topic-lesson,course-lesson}, focused tests and their task fixtures under apps/web.
- Review remediation: catalog ARIA/padding, E2E hydration actions, route splitting/publication metadata,
  apps/web/src/server.ts and shared/lib/http-compression with focused HTTP tests.
- Tooling: apps/web/eslint.config.js and scripts/verify-app-architecture.mjs (narrow browser boundary and self-test).
- Documentation: docs/FRONTEND.md, this change.

### Do NOT touch
- Authored lesson content, bank data, backend contracts, database, progress storage keys, deployment.

## Contracts

See docs/SPEC.md §3–§5, docs/FRONTEND.md and the Files list above.

## Gate Checks

Affected-area Critical Gate from [STACK](../../STACK.md). Browser verification through Playwriter.
The implementation invocation used the Critical Gate only. On 2026-09-20 the architect
requested final audit followed by `ship --release`; its mandatory Full Gate is recorded below.

Verification: format, web lint, typecheck PASS; 40 focused Vitest tests PASS; new code-disclosure/
return-to-top E2E PASS through repository fixtures against local development. MCP plus realpath-aware
TypeScript language service: 32 changed TS/TSX files, zero diagnostics in the latter. Impeccable
static detector: no findings. Playwriter checked EGE/Python desktop/mobile, numeric difficulty,
right-hand stacked theory links and Link icons, dialog cancel/focus, 32/40px outline targets,
14px/40px lesson links, no-JS reading, delayed enhancement and 200% text without horizontal overflow.
Standalone task and inline catalog notation retain transparent backgrounds. Cleanup uses the
repository allowlist.

## Architect Review Notes

- [x] R1 Fix the confirmed serious axe `aria-prohibited-attr` finding on `/practice`: the status
  `span` in `apps/web/src/pages/practice-catalog/components/practice-catalog-row.tsx:50` has an
  accessible label without a permitted role. The same issue also affected disabled pagination
  arrows. Reproduced in full E2E and the separate a11y audit.
- [x] R2 Diagnose and resolve catalog layout-stability failures. All eight `/ege` delayed/failed
  asset scenarios observed layout shifts (0.0276–0.0419; the regression contract requires zero);
  the 360px course-catalog delayed-asset scenario changed geometry. Preserve the tested delivery
  contract; determine whether the course result was affected by the module-load failures.
- [x] R3 Reproduce and resolve remaining E2E failures with a healthy test environment: two course
  progress hydration scenarios, combined practice filters, topic search/cancellation, legacy Python
  progress and public-route smoke. Initial Vite optimized chunks were missing; smoke also reported
  `ERR_INSUFFICIENT_RESOURCES` and `ENOSPC` (host filesystem later measured 97% used). These results
  are not all proven product defects. Do not weaken assertions to hide the failures.
- [x] R4 Restore the performance gate: measured median LCP exceeded 4.0s on `/ege` (4.061s),
  `/courses` (4.286s), `/courses/python` (4.213s), and `/ege/16-rekursiya` (4.816s). Recheck on a
  healthy measurement environment and address confirmed regressions without relaxing the budget.

- [x] R5 Make the course-catalog delayed-asset baseline wait for SSR styles before measuring
  geometry. The Full Gate captured unstyled browser defaults at 1305px (body margin 8px,
  one-column list) and compared them with the styled grid. Keep scripts/fonts held and preserve
  every before/after layout assertion.

## Review remediation — 2026-09-21

R1: name the status glyph as an image and disabled pagination arrows as disabled links.
R2: make catalog padding overrides independent of stylesheet insertion order using the existing
PageContainer measure attribute. The prior 24px jump reproduced exactly before this fix.
R3: reuse a Page Object action that proves the topic popup has opened before further interaction;
retain no-JS coverage. Course catalog/progress failures did not reproduce in the restored environment.
Focused regression: 31 browser scenarios passed, including all eight topic delivery cases,
practice filters and the complete eight-page accessibility audit.
R4: keep practice loader/UI in route chunks and use publication metadata for EGE route heads.
Fresh measurements reduced four routes to 3.31–3.63s, but recursion remained 4.08s. Lighthouse
identified its uncompressed 119KB SSR document. Add server-only streamed gzip for anonymous GET
HTML with encoding negotiation, Vary and validator handling; leave personalized, already encoded,
non-HTML and no-transform responses untouched. Eleven focused compression checks, web lint and
typecheck passed. Final 15-run performance audit passed: median LCP / 3.163s, /ege 3.093s, /courses 3.480s,
/courses/python 3.195s, /ege/16-rekursiya 3.632s; CLS <=0.008 and TBT <=146ms.
The recursion HTML transfers 20,010 bytes instead of 119,307. No budget relaxation.
Compression wraps the final server entry response, after SSR serialization; applying it in request
middleware was rejected because Start still transforms that stream.

Review Critical Gate: format, web lint, typecheck and 11 compression tests passed. TypeScript
language-service checks passed for the changed source and E2E/config/test files (realpath-aware
service resolves pnpm exports where MCP reports false positives). Browser screenshots checked
current production build on desktop/mobile, practice popup interaction, theory links, quiet reset,
and 40px return-to-top strip. Captured console errors point exclusively to a Chrome extension;
no application-origin error was observed. Full release regression follows separately.

## Final release audit — 2026-09-20

Full Gate **FAIL**. No commit, merge, archive, push, image publication or production mutation.
Release Gate was not entered because Full Gate did not pass.

| Check | Result |
|-------|--------|
| Format; additional root/web lint and web typecheck | PASS |
| Infrastructure/bootstrap | PASS on a fresh isolated PG18 volume; the retained previous gate volume rejected new temporary credentials and was preserved |
| Operations contracts | PASS |
| Migrations and isolated bank import | PASS, schema `122_01`, 697 tasks |
| Backend tests | PASS, 184 tests |
| OpenAPI drift | PASS |
| Production frontend build/prerender | PASS |
| Frontend unit tests | PASS, 213 tests in 27 files |
| E2E collection | PASS, 81 scenarios |
| E2E | FAIL, 65 passed / 16 failed; new code-disclosure/return-to-top scenario passed |
| API readiness smoke | PASS |
| Accessibility | FAIL, 7 passed / 1 failed (`/practice`) |
| Performance | FAIL, LCP above 4s on four routes; all CLS <=0.008 and TBT <=124ms; home LCP 3.918s |
| Content assets and authored content/bank validation | PASS, 2 topic lessons, 28 course lessons, 697 tasks |
| Security: Gitleaks, Semgrep, Trivy FS, pnpm audit, pip-audit | PASS; additional Semgrep scan of 7 new untracked source/test files: zero findings |
| Repository hygiene | PASS; owned gate containers/network removed, retained volumes preserved, allowlisted reports/caches cleaned |

Code review found no blocking defect in the lesson-refinement diff. Fallow 3.14.0 audit passed;
four public-contract review judgments were anchored and post-validated against the same graph
snapshot (4 accepted, 0 rejected). Review confirmed optional Notation emphasis is intentional,
the difficulty projection supplies the new required field, existing exports remain compatible,
and removed glyph CSS has no consumers. CSS warnings were inspected against the diff: most
flagged regions were unchanged; the changed expanded-button selector implements the scoped fix.

Read-only production inventory: healthy release
`a5b0bf5793a85a4e9090f47c311ae01c022f194d`, PostgreSQL 16.14, zero application tables, no
`database-current` or minimal-bank attestation, 26GB free. Production still requires the
[initial bank transition](../../runbooks/practice-transition.md), restore/rollback acceptance and
an attestation for the exact release SHA. The architect explicitly approved the current
`content/practice-bank` as initial production content in chat: 697 tasks, 547 catalog-visible,
150 lesson memberships, one file. This approval persists; no import has been made on the server.

## Implementation Notes

- MCP TypeScript diagnostics misresolve pnpm test-framework exports; the realpath-aware
  workspace TypeScript language service checks the changed source and test files as a complement.
- Interactive Chrome reports an unrelated `chrome-extension://gcjikeldobhnaglcoaejmdlmbienoocg/content.js`
  error. The focused automated browser scenario has a clean application console.
- F9 supersedes F6 placement: theory stays to the right on wide screens and below on narrow ones.

## Commit Message

```text
feat(change-129): refine lesson readability and navigation
```

## Full Gate repeat — 2026-09-21

FAIL: E2E 80/81, one course-catalog 1305px initial-style readiness race (R5).
All other rows passed: format, isolated infrastructure, operations contracts, migrations,
backend 184/184, API drift, build/prerender, units 224/224, E2E collection 81, smoke,
a11y 8/8, content validation and complete security audit (no known vulnerabilities).
Performance passed: / LCP 3.162s, CLS 0.000, TBT 0ms; /courses LCP 3.489s, CLS 0.000, TBT 0ms; /courses/python LCP 3.333s, CLS 0.000, TBT 55ms; /ege LCP 3.021s, CLS 0.000, TBT 0ms; /ege/16-rekursiya LCP 3.636s, CLS 0.008, TBT 184ms.
No commit, merge, push or deployment. Fallow post-validation accepted six anchored review
judgments with zero rejected/stale anchors; judgments remain model reasoning, not proofs.

R5 remediation: wait for linked SSR stylesheets and assert the course grid is styled while
scripts/fonts remain blocked, before taking the initial geometry. All original comparisons
remain. Three repetitions across 1305/820/390/360px and delayed/failed assets: 24/24 passed.
Format, web lint, typecheck and realpath-aware TypeScript language-service diagnostics passed.
The failed Full Gate and this focused review both completed allowlisted cleanup.

## Final Full Gate — 2026-09-21

PASS after R5. No unchecked Backlog or Architect Review Notes.

| Check | Result |
|-------|--------|
| Format | PASS |
| Isolated infrastructure/bootstrap | PASS; four healthy services, seeded gate bank retained |
| Operations contracts | PASS |
| Migrations | PASS; 122_01, no drift |
| Backend suite | PASS; 184 tests |
| API contract drift | PASS |
| Production build/prerender | PASS; / and /ege |
| Frontend unit suite | PASS; 224 tests |
| E2E collection | PASS; 81 scenarios |
| E2E | PASS; 81 scenarios |
| Readiness smoke | PASS |
| Accessibility | PASS; 8 pages |
| Performance | PASS; medians below |
| Content assets and full bank validation | PASS |
| Secrets, SAST, FS and dependency audits | PASS; no known vulnerabilities |
| Repository hygiene | PASS; owned gate containers removed, volumes retained; clean-dry-run, clean and clean-check |

| Route | LCP | CLS | TBT |
|-------|-----|-----|-----|
| `/` | 3.158s | 0.000 | 0ms |
| `/courses` | 3.176s | 0.000 | 0ms |
| `/courses/python` | 3.180s | 0.000 | 20ms |
| `/ege` | 3.022s | 0.000 | 0ms |
| `/ege/16-rekursiya` | 3.618s | 0.008 | 96ms |
