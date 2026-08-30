# CHANGE 74 — Project Reconciliation and Maintainability Cleanup

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `74` |
| Slug | `project-reconciliation-maintainability` |
| Title | Project Reconciliation and Maintainability Cleanup |
| Status | `active` |
| Branch | `feature/74-project-reconciliation-maintainability` |

---

## Goal

Reconcile the durable project contracts with the already deployed complete Python course, close
M3, and remove confirmed repository/runtime artifacts. Refactor the measured frontend,
test/tooling, CSS and cleanup-maintenance findings without changing public behavior, domain
relationships, visual output or security policy.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Decompose the measured oversized production, lab and test components/functions and
  eliminate all current Fallow complexity/CRAP findings while preserving route, SSR/no-JS,
  accessibility and Page Object contracts — _Depends on:_ —
- [x] `F2` Remove all current CSS token-drift, duplicate-block and selector-complexity findings;
  extract only neutral shared Topic/CourseLesson presentation structure and complete the frozen
  lesson-lab token migration without coupling their domain models — _Depends on:_ F1
- [x] `F3` Consolidate verified production, test, Page Object and tooling clone groups while
  preserving intentionally independent Topic/Course types and build-time publication/runtime
  registry contracts — _Depends on:_ F1, F2
- [x] `F4` Prove visual and interaction equivalence on representative public and lab routes at
  desktop, 390px, 150% zoom and no-JavaScript; run the Impeccable detector once after the final UI
  edits — _Depends on:_ F1, F2, F3

### Infra

- [x] `I1` Replace the partial cleanup target with a tested allowlisted cleanup script and
  dry-run/apply Make interfaces covering current build outputs, caches, Lighthouse profiles,
  empty tool directories and retired `apps/ops` residue without touching environments,
  dependencies, secrets or data — _Depends on:_ —
- [x] `I2` Execute the cleanup against the audited workspace and prove the intended ignored
  artifacts are gone while the worktree and protected local inputs remain intact — _Depends on:_ I1
- [x] `I3` After read-only verification, delete every merged pre-74 local feature branch and drop
  the obsolete paused Change 17 stash; preserve all committed history and the active Change 74
  branch — _Depends on:_ T3

### Data

None

### Other

- [x] `T1` Synchronize SPEC, PRODUCT and README with the exact deployed 28-CourseLesson/2-TopicLesson
  release, close M3, keep M4 current and remove duplicated or stale roadmap wording — _Depends on:_ —
- [x] `T2` Remove the eight confirmed unreferenced historical design/diagram artifacts and update
  the remaining source comment without touching the current logo, lesson sources or audit evidence —
  _Depends on:_ T1
- [x] `T3` Document that Change 17 was abandoned before commit and superseded by Changes 22–24,
  and retain Change 21's already documented supersession by Change 30 without rewriting archive
  history — _Depends on:_ T1
- [x] `T4` Re-run the complete Fallow inventory, classify the convention-loaded Lighthouse config,
  generated OpenAPI/public type exports and current FastAPI TestClient warning with evidence, and
  leave no unreviewed cleanup, complexity, CSS or clone findings — _Depends on:_ F3, I2, T2, T3

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
README.md
PRODUCT.md
Makefile
docs/SPEC.md
docs/FRONTEND.md
docs/KNOWN_GOTCHAS.md
docs/changes/74-project-reconciliation-maintainability.md
scripts/clean-local-artifacts.sh
scripts/tests/clean-local-artifacts.test.sh
scripts/validate-content-links.mjs
apps/web/src/pages/**
apps/web/src/shared/components/learning-content/**
apps/web/src/features/lesson-practice/**
apps/web/src/routes/courses_.$courseSlug.$lessonSlug.tsx
apps/web/scripts/verify-*.mjs
apps/web/e2e/pages/**
apps/web/tests/**
apps/web/vite.config.ts
confirmed obsolete docs/artifacts files (delete)
local merged feature refs and obsolete Change 17 stash (delete after verification)
~~~

### Do NOT touch

- `.github/`, GitHub branch protection or repository settings
- Existing security, auth, SSH, secrets, privacy, rate-limit or dependency-audit behavior
- Public API/OpenAPI schema, content ids or authored lesson/task wording
- Topic/CourseLesson relationships, analytics semantics or progress persistence
- `docs/artifacts/final_logo.svg`, lesson sources, quality reports or audit evidence
- Archived change files

---

## Contracts

See `docs/SPEC.md` §1, §5 and §9 plus the Files list above. Public runtime contracts remain
unchanged; this change reconciles release state and internal maintainability only.

---

## Gate Checks

In addition to the affected frontend/shell/documentation Critical Gate:

```bash
bash scripts/tests/clean-local-artifacts.test.sh
pnpm --filter web test
pnpm --filter web test:e2e
pnpm audit:a11y
pnpm --filter web build
node scripts/validate-content-links.mjs
npx --yes fallow dead-code --format json --quiet --explain 2>/dev/null || true
npx --yes fallow health --complexity --css --format json --quiet --explain 2>/dev/null || true
npx --yes fallow dupes --format json --quiet --explain 2>/dev/null || true
```

The refactor must leave zero current complexity and CSS findings. Every remaining clone/dead-code
signal must be one of the explicitly retained independent-contract or convention/generated cases.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Fallow finishes with zero complexity/CRAP, CSS, dependency, cycle, boundary and unresolved-import
  findings. The remaining `patterns.module.css` dead-file signal is a CSS Modules `composes`
  reachability limitation; `lighthouserc.cjs` is loaded by Lighthouse convention. The remaining
  type signals are generated OpenAPI or public slice contracts and are not deletion evidence.
- Six clone groups remain reviewed and intentional: two independent Topic/Course content schemas,
  the build-time publication/runtime registry pair, and small journey-specific Page Object
  assertions whose extraction would obscure the domain scenario. Overall duplication fell from
  3.74% to 0.66%.
- The API suite passes 178 tests. Its sole warning is emitted inside FastAPI's TestClient shim for
  Starlette's pending `httpx2` transition; no backend dependency migration belongs to this change.
- Project TypeScript 5.9.3 and `tsc --noEmit` pass. The editor LSP still reports four implicit-any
  diagnostics in TanStack file-route loader parameters (including an untouched route); these are
  route-augmentation false positives rather than compiler diagnostics.
- Chrome verification covered the first public Course lesson at 1440px, 390px and an effective
  150% viewport; full Playwright coverage additionally proved public/lab routes with and without
  JavaScript. The final Impeccable detector reported no UI anti-patterns.
- Git cleanup removed 74 already-merged pre-74 feature refs and the uncommitted, obsolete Change 17
  stash after read-only reachability/content verification. Committed history, `main` and the active
  Change 74 branch remain intact.

---

## Commit Message

```text
refactor(change-74): reconcile state and repository hygiene
```
