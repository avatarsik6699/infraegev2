# CHANGE 103 — Shared infraege visual language

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `103` |
| Slug | `shared-visual-language` |
| Title | Shared infraege visual language |
| Status | `archived` |
| Branch | `feature/103-shared-visual-language` |

## Goal

Make the accepted `/courses` and `/courses/python` visual language reusable without repeating
design direction for each module. Preserve four public storefronts while consolidating their
mechanisms; demonstrate expressive learning surfaces in the lab before later lesson adoption.
The architect approved the SPEC/frontend pivot and this implementation plan in chat.

## Design References

- `/courses`: paper mosaic, bounded artwork bleed, perspective grid, once-only frame glint.
- `/courses/python`: open asymmetric program, illustrated field, quiet recurring light and drift.
- `/` and `/ege`: preserve current composition while adopting applicable shared mechanisms.

## Backlog

### Backend
None

### Frontend
- [x] `F1` Capture four storefront baselines; extract shared SVG grid, neutral surface decoration, material tokens and activity hook — _Depends on:_ —
- [x] `F2` Migrate four storefronts to applicable primitives, removing replaced duplication and preserving composition/publication/progress/SSR — _Depends on:_ F1
- [x] `F3` Extend the production-component lab with available/planned surfaces, field/route/light examples and expressive learning/form surfaces — _Depends on:_ F2
- [x] `F4` Verify focused motion/SVG contracts, responsive browser parity, no-JS/reduced motion, keyboard/input and LSP; run affected Critical Gate and hygiene — _Depends on:_ F3, T1

### Infra
None

### Data
None

### Other
- [x] `T1` Consolidate FRONTEND visual recipes and synchronize SPEC/PRODUCT; require specimen selection and visual comparison in plan/work — _Depends on:_ F3

## Files

### Create / modify
- Frontend: `apps/web/src/shared/components/svg-pattern/`, `shared/components/surface-decoration/`, `shared/lib/element-activity/`, `shared/styles/patterns.module.css`, `app/styles/tokens.css`.
- Consumers: `apps/web/src/pages/{foundation,topic-catalog,course-catalog,course-overview,design-system-lab}/`.
- Focused contracts: `apps/web/tests/`, `apps/web/e2e/` existing domain fixtures/Page Objects where needed.
- Documentation: `docs/FRONTEND.md`, `docs/SPEC.md`, `PRODUCT.md`, `docs/playbooks/{plan,work}.md`, this change.

### Do NOT touch
- Published lesson content/components, registries, API, persistence and production infrastructure.
- Existing untracked references and lesson drafts; original illustration assets.

## Contracts

See `docs/SPEC.md` §3–§5 and the Files list above; `docs/FRONTEND.md` owns frontend contracts.

## Gate Checks

Affected Critical Gate from [STACK](../../STACK.md). Approved additional focused browser coverage:
four storefronts and lab at desktop/tablet/mobile/200%, SSR/no-JS, reduced motion and activity.
No Full Gate, commit, merge or release in this work invocation.

Verified 2026-09-08:
- `pnpm format:check`, `pnpm --filter web lint`, `pnpm --filter web typecheck`: PASS.
- Focused Vitest: `svg-pattern`, `element-activity`, `course-foundation`, `public-release`:
  32 tests PASS.
- Focused Playwright: course catalog (3), topic catalog (2), Python overview (1), home reduced
  motion (1), existing lab (1), new visual-language lab (2): 10 distinct scenarios PASS after
  focused fixes/reruns. Specs consume domain fixtures and Page Objects only.
- Playwright MCP captured four storefronts at 1440/768/390px and desktop/mobile lab specimens;
  normal viewports and the 720px effective viewport for 200% desktop reflow remain bounded.
  New images retain their media bounds before/after hydration. Final lab console: no errors/warnings.
- Production/unit-test LSP: 33 changed files clean; E2E caveat below. Impeccable detector: `[]`.
- Repository hygiene: reviewed `make clean-dry-run`, then `make clean` and `make clean-check`: PASS.
- API regeneration/security/Full Gate: not applicable or not requested.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- The existing complete no-JS lab has a 432px scroll width at a 390px viewport (legacy Diagram
  and header specimens); removing the new section leaves that width unchanged. New visual
  specimens and their images remain bounded. Published learning components are intentionally
  outside this change; the focused new-section check does not claim to repair the entire old lab.
- TypeScript LSP reports the known isolated Playwright declaration-resolution issue on E2E
  files (KNOWN_GOTCHAS); changed production and unit-test files are clean. CLI lint and actual
  focused Playwright execution supply the complementary E2E evidence.

## Commit Message

```
feat(change-103): share visual materials, grids and motion
```
