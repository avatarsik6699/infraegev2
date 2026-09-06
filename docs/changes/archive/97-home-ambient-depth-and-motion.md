# CHANGE 97 — Home Ambient Depth and Motion

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `97` |
| Slug | `home-ambient-depth-and-motion` |
| Title | Home Ambient Depth and Motion |
| Status | `archived` |
| Branch | `feature/97-home-ambient-depth-and-motion` |

---

## Goal

Unify the homepage statement and decorative learning map through one restrained ambient SVG field,
then deepen the map's paper surfaces, gradients and connection styling without changing its content
or geometry. Add a continuous but non-informational motion layer that remains static in SSR/no-JS,
stops outside the viewport or in a hidden tab, and respects reduced-motion and increased-contrast
preferences. See `docs/SPEC.md` §5.3 and `docs/FRONTEND.md` §4–§5.

---

## Design References

- `docs/artifacts/references/base.jpg` — warm paper, sparse contour pattern and orange/ink material language.
- `docs/artifacts/references/main-page.png` — homepage composition, hierarchy and restrained diagram depth.
- `docs/artifacts/references/visual_schema.png` — semantic relationship rhythm only; current page geometry remains authoritative.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Reconcile the shared `SvgDrawing` gradient contract with optional per-stop colors while preserving `currentColor`, SSR-stable ids and every existing consumer; add focused component coverage — _Depends on:_ —
- [x] `F2` Add a domain-agnostic browser activity observer and page-local hydration boundary so decorative motion runs only while the hero is in view and the document is visible, with deterministic cleanup and a static SSR/no-JS baseline — _Depends on:_ —
- [x] `F3` Add one page-local ambient SVG field behind the hero through existing `SvgPattern`/`SvgDrawing` primitives, fading around readable copy and adapting density across desktop, stacked and narrow layouts without entering header/footer or causing overflow — _Depends on:_ F1
- [x] `F4` Refine learning-map card, stage and progress surfaces with restrained multitone paper gradients, edge highlights and compact contact depth while preserving current copy, coordinates, hierarchy and the map-only decorative elevation exception — _Depends on:_ F1
- [x] `F5` Add static connection sheen layers and a coordinated continuous decorative flow across central, card, cycle and pattern trajectories; retain the current non-crossing geometry, arrow layering, mobile ratios and complete static meaning — _Depends on:_ F1, F2
- [x] `F6` Add quiet periodic border glints and pattern responses, with the active task strongest, completed stages quieter and future statistics lowest-weight; disable all decorative motion for reduced motion and strengthen the static fallback for increased contrast — _Depends on:_ F2, F4, F5
- [x] `F7` Extend focused Vitest and Playwright Page Object coverage for gradient fallback, activity cleanup, SSR/no-JS, active/paused/reduced-motion states, responsive fit, console cleanliness and unchanged connector geometry — _Depends on:_ F1, F2, F3, F4, F5, F6
- [x] `F8` Complete the bounded Impeccable finish pass: inspect wide desktop, compact/stacked, 150% zoom and narrow mobile together, batch material fixes once, confirm once, run the design detector and record remaining review findings — _Depends on:_ F7

### Infra

None

### Data

None

### Other

- [x] `T1` Reconcile `PRODUCT.md` and `docs/FRONTEND.md` with the shipped connection baseline, ambient hero field, decorative motion lifecycle and unchanged flat-product-surface rule — _Depends on:_ F6

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
PRODUCT.md
docs/SPEC.md
docs/FRONTEND.md
apps/web/src/pages/foundation/**
apps/web/src/shared/components/svg-drawing/**
apps/web/src/shared/lib/element-activity/**
apps/web/tests/**
apps/web/e2e/pages/foundation.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- Backend, API, database, auth, analytics, infrastructure or deployment behavior
- Public copy, navigation semantics, brand assets, fonts, lesson/course pages or learning content
- Learning-map node/card coordinates or arrow endpoint geometry; connection routes stay fixed
  except for removing the architect-rejected Theory → traversal route
- Header/footer styling, raster assets, Canvas/WebGL or new runtime dependencies

---

## Contracts

See `docs/SPEC.md` §5, `docs/FRONTEND.md` §2–§6 and the Files list above.

---

## Gate Checks

Use the affected frontend Critical Gate. Before completion, use browser tooling for desktop,
stacked, zoomed and narrow layouts; verify ordinary motion, reduced motion, increased contrast,
SSR/no-JS, console output and horizontal overflow. Run the repository accessibility and performance
audits as focused design-risk evidence without treating them as a Full Gate.

---

## Architect Review Notes

- [x] `R1` Remove the explicitly orange surface tint from cards, stages and progress while retaining
  the neutral paper depth established by Theory and Practice.
- [x] `R2` Reduce connection sheen/glow intensity without weakening the readable static orange
  connection hierarchy.
- [x] `R3` Remove only the Theory → traversal pattern connection and reconcile geometry coverage.
- [x] `R4` Make the connection and border motion perceptibly clearer while keeping it decorative,
  bounded, paused offscreen/hidden and absent under reduced motion.
- [x] `R5` Replace the ambient contour-wave field with a barely visible fading engineering grid,
  preserving the hero-only boundary, responsive fit and readable title area.
- [x] `R6` Extend the engineering grid across the full main-page canvas and fade it progressively
  toward the header and footer without drawing over either chrome surface.
- [x] `R7` Make border gradients travel in an irregular deterministic sequence across different
  cards and stages, preserving SSR stability, reduced motion and the static surface hierarchy.
- [x] `R8` Add a second restrained moving impulse to central and card/cycle connections so the map
  feels continuously active while pattern-target connections remain the quietest layer.
- [x] `R9` Raise the fading engineering grid's visibility slightly across the main-page canvas
  without competing with copy or leaking into the header and footer.
- [x] `R10` Remove the animated orange calibration line from the ambient background; keep the
  background field static and neutral so all directional motion belongs to the learning map.
- [x] `R11` Make visual-map connection and border motion clearly visible and polished through
  stronger travelling gradients and timing, while preserving reduced-motion, activity pausing and
  the low-weight pattern-target hierarchy.
- [x] `R12` Reduce the engineering grid where it overlaps the map's authored patterns so the two
  structural layers do not accumulate contrast, while preserving the page-wide fade.
- [x] `R13` Match each animated card and block border sweep to that surface's static border color;
  reserve orange sweeps for the orange-bordered active task and progress surfaces.
- [x] `R14` Rebalance animated border contrast: quiet the neutral card/stage sweeps while making the
  active orange task/progress sweep legible through a lighter warm highlight rather than more glow.

---

## Implementation Notes

- The initial independent Impeccable finish review passed without blocker or material findings.
  Later architect notes superseded its pattern and motion bounds; the final browser pass verifies
  the revised full-canvas grid, neutral surfaces, dual connection impulses and irregular border
  phases at wide and narrow sizes without overflow or console findings.
- The production build passed, but the repository Lighthouse budget remained red on LCP: `/` was
  3.62–3.63 s and the unchanged `/ege/16-rekursiya` control was 3.92 s against 2.8 s. All six
  reports identify the out-of-scope analytics-consent paragraph, which appears after hydration, as
  the LCP element; ordinary server response was 10–34 ms after warm-up.
- The review follow-up keeps the ambient grid, calibration and notation fully static and neutral;
  all orange motion now belongs to the learning map. Desktop and 390 px browser checks confirmed a
  clearer fading grid, visible dual connection impulses and irregular border sweeps with no
  horizontal overflow or console findings; the Impeccable detector reported no findings.
- Pattern-local canvas relief now reduces grid competition without changing pattern opacity or map
  geometry. Neutral paper cards and completed stages use an ink/muted border sweep; orange sweeps
  are reserved for the active task and progress surfaces, including increased-contrast mode.
- Border motion now uses semantic intensity variables: neutral sweeps are thinner and quieter,
  while active orange surfaces reveal movement through a warm lightness shift rather than added
  glow or a mismatched hue.

---

## Commit Message

```text
feat(change-97): add ambient depth and motion to home
```
