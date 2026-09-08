# CHANGE 101 — Unified infraege Design System

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `101` |
| Slug | `unified-design-system` |
| Title | Unified infraege Design System |
| Status | `archived` |
| Branch | `feature/101-unified-design-system` |

---

## Goal

Make the accepted infraege public identity the default for every interface and make
`/lab/design-system` demonstrate the actual production system without a private theme.
Preserve learning content, navigation, publication, progress and checking behavior.
Approved source: the architect's whole-interface migration plan and its implementation request.
See `docs/SPEC.md` §5 and `docs/FRONTEND.md` §4.

## Design References

- `/`, `/ege`, `/courses`: accepted warm-paper identity, three-stone mark, typography and drawn actions.
- Learning screens use the quiet expression of the same system; no decorative catalog motion around prose.

## Backlog

### Backend

None

### Frontend

- [x] `F1` Unify the visual contract and inventory public UI consumers, lab examples and states — _Depends on:_ —
- [x] `F2` Migrate theme, semantic tokens and shared primitives; remove historical aliases and private lab theme — _Depends on:_ F1
- [x] `F3` Rebuild the existing lab as the live infraege catalog, with named coverage and isolated contextual examples — _Depends on:_ F2
- [x] `F4` Migrate shell, privacy, consent, route states, course overview, both lesson families and practice through shared defaults and owning compositions — _Depends on:_ F2
- [x] `F5` Enforce theme boundaries and named catalog coverage with positive/negative checks; update affected browser contracts — _Depends on:_ F3, F4
- [x] `F6` Verify responsive, keyboard, zoom, reduced-motion, SSR/no-JS and learning behavior; run LSP, focused Critical Gate, visual review and hygiene — _Depends on:_ F5

- [x] `F7` Review the complete change before local ship; fix verified architecture/policy gaps and synchronize docs, then verify affected contracts — _Depends on:_ F6

### Infra

None

### Data

None

---

## Files

### Create / modify

- Frontend: `apps/web/src/app/styles/`, `shared/components/`, `shared/styles/`, `pages/design-system-lab/`, existing page/feature/widget CSS and lab specimens.
- Verification: `apps/web/scripts/verify-app-architecture.mjs`, design-system policy support, `apps/web/e2e/pages/`, fixtures/specs and focused component tests where affected.
- Documentation: `docs/SPEC.md`, `docs/FRONTEND.md`, `PRODUCT.md`, `docs/KNOWN_GOTCHAS.md`, this change and `docs/artifacts/infraege-ui-migration.md`.

### Do NOT touch

- Authored lessons, task data, backend/API contracts, dependency versions and infrastructure.
- User-provided untracked `docs/artifacts/` files and archived change history.

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§7 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

The approved plan explicitly includes focused browser regression on lab, public references,
course overview, Topic/Course lesson practice, privacy and route states: desktop/intermediate/mobile,
keyboard, zoom 150%, reduced motion and SSR/no-JS. This is additional affected-area acceptance,
not a Full Gate. Use the existing domain fixtures/Page Objects. Human visual acceptance remains
separate from automated checks; implementation does not ship, commit or deploy.

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work 101 review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

<!-- Optional. The agent adds a short bullet here only when something isn't already visible from
     the code or commit history: an intentional deviation from the plan, a residual risk, a
     rejected alternative. Leave empty when nothing needs recording — this is not a mandatory
     per-task log. -->

- Typography defaults have zero selector specificity so explicitly owned reading roles remain stable
  across SSR and client navigation stylesheet order.
- Lab consent callbacks are local; real consent storage and analytics lifecycle remain in their
  production owner. Multiple real footers require unique SVG paint IDs.
- Required E2E LSP diagnostics hit the already documented isolated Playwright declaration issue
  in `KNOWN_GOTCHAS.md`; source diagnostics are clean, with CLI lint/type-check and actual journeys
  supplying complementary evidence. No API change: API regeneration/backend gates are not applicable.
- The architect authorized local closure after code audit on 2026-09-08; publication/deployment was not requested.

## Verification evidence

- Critical Gate: repository format, web lint/architecture policies and TypeScript check passed.
  Focused component suite: 62 tests passed; final typed footer mock also rechecked (5 tests).
- Browser: live lab named contracts, portal theme/focus return, isolated consent callbacks,
  desktop/intermediate/320/390 widths, 150% zoom, reduced motion and no-JS passed.
  Public reference pages, privacy/404, consent opt-in/withdrawal, course overview and both
  lesson progress/reset journeys passed. Runtime navigation through the current topic catalog, including return to its hash, passed.
- Hygiene: reviewed cleanup allowlist, removed generated reports/caches and temporary review captures; `make clean-check` passed. User-provided artifacts preserved.
- Accessibility: all 8 existing public/lab route checks passed with no serious violations.
- Chrome MCP desktop/mobile screenshots and console checked; refreshed Topic captures confirm
  quiet 12px progress heading and no overflow. Detector returned no findings. Independent
  visual/source review: PASS, no material blocker; documentation handoff complete. Human product acceptance remains separate.

---

## Pre-ship audit — 2026-09-08

- Reviewed the complete diff, public UI consumers, consent lifecycle, theme/typography cascade,
  catalog specimens, SSR/progress behavior and documentation against FRONTEND/STACK.
- Fixed coverage-policy blind spots: TypeScript parses named runtime re-exports and aliases;
  type-only exports/comments do not count. Wildcard/namespace/default/inline runtime exports
  fail explicitly instead of silently bypassing the catalog. Positive/negative fixtures pass.
- Removed the duplicate regex inventory from the component test; the architecture policy owns
  export discovery, while component tests own catalog notes and uniqueness. Catalog helpers now
  follow the root-prefixed object convention. Corrected obsolete underline documentation.
- Fallow reported no new unused exports, import cycles or boundary violations. Its raw heuristic
  audit verdict was FAIL: retained CSS composition/selector and repeated specimen patterns plus
  estimated test/inline-policy coverage metrics require review, not blind deletion or suppression.
  Verified `patterns.module.css` consumers through CSS Modules `composes`; paired lesson layouts
  and separate SSR/hydrated assertions remain intentional. No blocking defect remains.
- Fallow walkthrough: all four structural contract judgments accepted against the current graph,
  none stale or unanchored. Existing analytics APIs remain compatible; the notice is additive.
- Required LSP: changed catalog data and test are clean. The adapter does not load the standalone
  `.mjs` policy; web ESLint and execution of its regression fixtures passed instead.

## Local ship gate — 2026-09-08

- Critical Gate PASS: repository format, web lint and architecture policies, TypeScript,
  62 focused component tests and changed TypeScript LSP diagnostics.
- Change-specific browser gate PASS: 12 selected scenarios covering public references, lab,
  desktop/intermediate/mobile, zoom, reduced motion/no-JS, consent isolation, practice/progress/reset
  and return navigation. Synthetic error-telemetry messages in the log are intentional test input.
- Backend/API regeneration SKIPPED: no API, schema, Python or infrastructure changes.
  Full/Release Gates SKIPPED: local `/ship` only; no publication requested.
- Unresolved Backlog and Architect Review Notes: 0. Generated report/cache cleanup checked.

## Commit Message

```
feat(change-101): unify the infraege interface and live catalog
```
