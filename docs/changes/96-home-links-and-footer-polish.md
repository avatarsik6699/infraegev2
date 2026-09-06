# CHANGE 96 — home links and footer polish

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `96` |
| Slug | `home-links-and-footer-polish` |
| Title | home links and footer polish |
| Status | `active` |
| Branch | `feature/96-home-links-and-footer-polish` |

---

## Goal

Polish the accepted infraege homepage identity and interaction rhythm without changing its content
or composition. Unify homepage link states through the smallest reusable shared boundary, reuse the
existing SVG/custom-icon systems, and simplify the public footer.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Increase the expanded home lockup's wordmark-to-subtitle spacing and optically center the
  orange benefit separators; reduce the lead, CTA and home-navigation weights while preserving the
  approved typography families and hierarchy — _Depends on:_ —
- [x] `F2` Rework the homepage CTA decoration through the existing shared SVG primitives so its
  fading tapered underline reads as a true underline and its right arrow sits close to the label;
  preserve semantic link behavior, focus visibility and reduced-motion behavior — _Depends on:_ F1
- [x] `F3` Add the visual-stage check mark to the existing shared custom-icon family and migrate the
  home learning-map completed stages without changing their page-owned composition — _Depends on:_ F2
- [x] `F4` Extend the existing shared `ActionLink` with a drawn hierarchy owning consistent default,
  hover, focus-visible and active states plus the bright-orange authored underline, then migrate the
  real internal homepage links without making disabled navigation interactive or duplicating the
  separate external-link semantics — _Depends on:_ F2
- [x] `F5` Simplify the public footer by removing its upper border and redundant infraege label while
  preserving its remaining navigation, semantics and responsive layout — _Depends on:_ F4
- [x] `F6` Update focused component/E2E contracts and verify desktop, intermediate and mobile layout,
  keyboard focus, hover/active behavior, no horizontal overflow and a clean browser console with
  required browser tooling, LSP diagnostics, one Impeccable detector pass and the affected Critical
  Gate — _Depends on:_ F3, F5
- [x] `F7` Make the page-owned hero heading scale independent of CSS module evaluation order after
  the new shared link import, so the shared title default cannot collapse it back to 40px —
  _Depends on:_ F4
- [x] `F8` Extend the executable typography policy with the architect-requested regular 400 UI
  weight for quiet leads, navigation and links while retaining 500/600 and rejecting every other
  literal component weight — _Depends on:_ F1
- [x] `F9` Give the footer Telegram external link the same authored fading underline as other
  homepage links while retaining its Lucide up-right icon and external/new-tab semantics; color
  that icon with the bright orange accent and further lighten the homepage lead's perceived weight
  without changing its approved Golos Text family — _Depends on:_ F4, F5
- [x] `F10` Connect the current homepage learning-map stages «Теория», «Практика», «Задания» and
  «72% курса» in their semantic order with solid constant-width lines ending in dots; preserve the
  existing composition at every breakpoint, update focused contracts and replace the obsolete
  no-connectors documentation without consulting the superseded visual references — _Depends on:_ F3
- [x] `F11` Route the new learning-map connections through the existing
  `shared/components/svg-drawing` boundary, extending its reusable API only as needed for
  constant-width lines with endpoint dots while leaving page-specific coordinates and composition
  in the foundation page — _Depends on:_ F10
- [x] `F12` Replace the rejected straight muted connectors with visibly dynamic, bending
  curvilinear trajectories in the homepage's orange visual language while retaining constant
  thickness, solid paint and endpoint dots — _Depends on:_ F11
- [x] `F13` Anchor every central learning-map curve directly to the boundaries of its source and
  destination blocks, with endpoint dots sitting on those contours; replace the detached tight
  curls with calmer continuous bends matching the connection behavior clarified by the supplied
  `visual_schema.png` reference without restoring any out-of-scope satellite connectors — _Depends on:_ F12
- [x] `F14` Reduce the contrast and visual weight of the central orange connections while keeping
  their established geometry and constant thickness; replace the filled endpoint dots with small
  unfilled circles that inherit the same quiet connection treatment — _Depends on:_ F13
- [x] `F15` Remove endpoint circles from the central learning-map connections and preserve each
  curve as one visually continuous stroke meeting both block contours without gaps or abrupt
  detached endings — _Depends on:_ F14
- [x] `F16` Give the marker-free central connections more visual weight through a restrained
  constant-width increase and a shared longitudinal opacity gradient that is strongest through the
  middle while keeping both contour-touching ends clearly visible and the active stage dominant — _Depends on:_ F15
- [x] `F17` Make the three central block-to-block curves visually seamless with the orange task and
  progress borders by using a higher-contrast gradient whose contour-touching ends match the border
  paint while its middle retains controlled depth — _Depends on:_ F16
- [x] `F18` Add a selective set of page-authored block-to-card trajectories using shared dashed
  lines with a fading start and dense arrowhead at the destination; connect only meaningful current
  cards rather than copying every trajectory from `visual_schema.png` — _Depends on:_ F17
- [x] `F19` Add a smaller selective set of trajectories from blocks to existing page patterns using
  the same shared primitives at the scene's lowest weight and contrast, then update focused
  geometry/E2E contracts, binding frontend documentation and responsive browser evidence — _Depends on:_ F18
- [x] `F20` Expand the theory stage's low-weight trajectories to additional theory notation
  patterns, add a distinct practice-card-to-theory-stage return loop expressing the
  practice-to-theory-to-practice learning cycle, and increase the curvature of the central and
  peripheral trajectories without disturbing the accepted contrast hierarchy, responsive fit or
  existing semantic card links — _Depends on:_ F19
- [x] `F21` Remove connector-to-connector crossings and route the theory-to-truth-table trajectory
  around the practice card; calm the central stage bends, slightly raise satellite and pattern
  contrast, add longitudinal gradients plus selective low-opacity echo underlays through the shared
  SVG drawing boundary, and complete a bounded UI/UX polish pass that improves depth without
  changing copy, layout, semantics or the accepted visual hierarchy — _Depends on:_ F20
- [x] `F22` Make every filled peripheral arrowhead render cleanly above its shaft by ending the
  shaft at the arrowhead base instead of beneath the translucent triangle, then visually correct
  each endpoint tangent and soften the practice-card-to-theory return approach into a downward,
  semicircular finish without reintroducing route crossings or card collisions — _Depends on:_ F21
- [x] `F23` Preserve connector-to-arrowhead proportions as the complete learning-map SVG scales to
  small viewports by adding an explicit opt-in scalable-stroke mode to the shared line primitive,
  migrating only map connections and their echoes to it, recalibrating authored widths for the
  accepted desktop weight, and verifying narrow mobile, intermediate and desktop rendering without
  changing scene composition or other `SvgDrawing` consumers — _Depends on:_ F22
- [x] `F24` Resolve the pre-ship review findings by reducing conditional complexity in the homepage
  chrome assertion and reusable link/connection rendering, simplifying the new shared-link CSS
  selectors, and rerunning the changed-code audit without weakening behavior or tests — _Depends on:_ F23

### Infra

None

### Data

None

### Other

- [x] `T1` Document the shared decorated-link ownership boundary in `docs/FRONTEND.md` only if the
  implementation introduces a new reusable frontend contract not already covered there — _Depends on:_ F6
- [x] `T2` Reconcile `docs/FRONTEND.md` with the narrowly expanded 400/500/600 component-weight
  baseline — _Depends on:_ F8

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/FRONTEND.md
apps/web/src/pages/foundation/**
apps/web/src/shared/components/custom-icon/**
apps/web/src/shared/components/action-link/**
apps/web/src/shared/components/external-link/**
apps/web/src/shared/components/link-decoration/**
apps/web/src/shared/components/svg-drawing/**
apps/web/src/widgets/public-header/**
apps/web/src/widgets/public-footer/**
apps/web/tests/**
apps/web/e2e/**
apps/web/scripts/verify-app-architecture.mjs
~~~

### Do NOT touch

- Backend, API, database, auth, analytics, operations, infrastructure or deployment behavior
- Public brand assets, font files, route copy, lesson/course content or learning-map coordinates
- Disabled homepage navigation semantics or internal learning-page composition
- New dependencies or a general-purpose SVG scene engine

---

## Contracts

See `docs/SPEC.md` §5 and §9, `docs/FRONTEND.md` §2–§6 and the Files list above.

---

## Gate Checks

Use the affected frontend Critical Gate. Before completion, inspect the home route at representative
desktop, intermediate and mobile widths with browser tooling, including keyboard focus and console.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- `ActionLink` retains its existing assembled-string `to` compatibility for result-page consumers;
  TanStack `createLink` remains an internal anchor adapter rather than forcing an unrelated caller
  migration. Route-specific params are optional and the homepage owns their values.
- TypeScript LSP directory, changed-file and status requests all remained pending until terminated;
  the required LSP pass is therefore explicitly skipped as unavailable in this session, with the
  repository `tsc --noEmit` check retained as complementary compiler evidence.
- Golos Text is bundled with a 400–900 weight range, so the homepage lead remains at its minimum
  real weight of 400; a lighter muted mix and neutral tracking reduce its perceived density without
  asking the browser to synthesize an unavailable weight.
- The focused public-root smoke passed every homepage layout, link, responsive and overflow
  assertion, then twice exhausted Vite resources only in the unrelated final error-telemetry reload
  (`ERR_INSUFFICIENT_RESOURCES`). Direct Playwright MCP inspection independently confirmed the
  changed desktop/mobile footer, clean console and zero horizontal overflow.

---

## Commit Message

```text
feat(change-96): polish home links, identity and footer
```
