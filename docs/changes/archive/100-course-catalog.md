# CHANGE 100 — Course Catalog

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `100` |
| Slug | `course-catalog` |
| Title | Course Catalog |
| Status | `archived` |
| Branch | `feature/100-course-catalog` |

---

## Goal

Publish `/courses` as the truthful SSR/no-JavaScript catalog for independent mini-courses. The
page links the complete Python course, presents Excel, algorithms/data structures and advanced
problem solving as noninteractive planned directions, restores the header navigation boundary and
uses the approved responsive editorial mosaic. See `docs/SPEC.md` §2.2, §5 and §9.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Introduce lightweight course-catalog metadata, publication-aware entry types and a reusable course-progress calculation contract without loading authored lesson TSX — _Depends on:_ —
- [x] `F2` Build the accessible responsive `/courses` editorial mosaic with one published Python card, three truthful planned cards and page-local SVG studies on the infraege engineering canvas — _Depends on:_ F1
- [x] `F3` Expose hydration-only Python progress, update shared navigation, canonical metadata, sitemap and prerender discovery while keeping the home CTA direct — _Depends on:_ F1, F2
- [x] `F4` Add focused unit and Playwright Page Object coverage for metadata, progress, SSR/no-JavaScript, navigation, responsive geometry, motion preferences and overflow — _Depends on:_ F1, F2, F3
- [x] `F5` Complete one bounded Impeccable finish pass across desktop and mobile, resolve detector and independent finish-review findings, then run the affected-area Critical Gate — _Depends on:_ F2, F3, F4

- [x] `F6` Recompose the catalog heading and replace repeated topic-like ambient effects with the supplied perspective staircase and a finite animated orange route — _Depends on:_ F2
- [x] `F7` Integrate the four supplied course illustrations as optimized assets in substantial media regions; strengthen gradient frames, depth and bounded sheen while preserving truthful availability — _Depends on:_ F6
- [x] `F8` Verify revised responsive composition, motion, image failure and existing SSR/progress behavior with browser tooling, LSP, focused tests and the Critical Gate — _Depends on:_ F6, F7

- [x] `F9` Remove visible rectangular paper backdrops from course artwork and introduce bounded artwork overflow above dimensional card surfaces — _Depends on:_ F7
- [x] `F10` Connect staircase, background routes and card motifs into one visible composition; add sustained activity-aware motion with a pause control and reduced-motion support — _Depends on:_ F9
- [x] `F11` Verify the revised visual composition, image integration, responsive overflow and motion controls; synchronize docs and run the affected Critical Gate — _Depends on:_ F9, F10

- [x] `F12` Enlarge and soften the upper staircase, add a quiet lower-left continuation, balance card engraving and reduce orange wash; verify frame geometry and soften false-offset depth — _Depends on:_ F11
- [x] `F13` Replace planned-card labels with «Скоро», visually distinguish unavailable courses without disabled links, and verify responsive/motion/SSR behavior and documentation — _Depends on:_ F12

- [x] `F14` Feather artwork edges, brighten warm card material and protect the Python action from decorative patterns — _Depends on:_ F13
- [x] `F15` Remove the animation toggle and its state, bound automatic motion to short single passes, retain reduced-motion support and verify responsive/SSR behavior — _Depends on:_ F14

- [x] `F16` Replace warm card fills and interior accents with silver/graphite material, neutral edge light and retained depth; preserve orange artwork and action accents — _Depends on:_ F14, F15

- [x] `F17` Align catalog surfaces with the public warm-paper system, reduce metallic contrast and heavy shadows, and replace the action backing with a decoration-free footer — _Depends on:_ F16

- [x] `F18` Final audit: reconcile obsolete SPEC visuals/motion, align progress test inputs with the domain contract, cover pre-hydration image completion, and reuse the shared page frame — _Depends on:_ F17

### Infra

None

### Data

None

### Other

- [x] `T2` Synchronize catalog visual contracts with the approved illustrated mosaic, retaining no filters and existing publication boundaries — _Depends on:_ F6, F7

- [x] `T1` Reconcile `docs/SPEC.md`, `docs/FRONTEND.md` and Change 100 with the approved catalog contract and retain future course authoring outside this change — _Depends on:_ —

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/FRONTEND.md
docs/changes/100-course-catalog.md
apps/web/src/entities/course/
apps/web/src/features/lesson-progress/
apps/web/src/pages/course-catalog/
apps/web/public/images/course-catalog/
apps/web/src/shared/components/image/components/image-media.tsx
apps/web/src/shared/styles/patterns.module.css
apps/web/src/routes/courses.index.tsx
apps/web/src/routes/sitemap[.]xml.ts
apps/web/src/widgets/public-header/
apps/web/src/routeTree.gen.ts
apps/web/tests/
apps/web/e2e/
~~~

### Do NOT touch

- `docs/artifacts/references/mini-courses.png` (read-only architect reference)
- Other untracked files under `docs/artifacts/`
- `apps/api/`, `content/tasks/`, authored TopicLesson/CourseLesson theory
- Existing `/courses/python` composition and the home primary CTA destination

---

## Contracts

See `docs/SPEC.md` §3–§4 and the Files list above. Do not hand-copy schema, endpoint, type or env
details into this file; code and `SPEC.md` remain the source of truth.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](../../STACK.md) — this section
> only records change-specific overrides.

```bash
pnpm --filter web exec playwright test e2e/course-catalog.spec.ts
# expected: catalog discovery, truthful availability, progress, SSR/no-JS and target viewports pass
```

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Final static audit found no cycles or layer violations. Fallow's dependency-role warnings are
  framework/tool entrypoint classification (unchanged manifests); `LessonProgressTypes` remains
  the public namespace of hook return types. Catalog publication projections stay domain-local.
  Staircase CRAP uses estimated zero coverage despite browser coverage; CSS geometry/specificity
  is intentional, and flagged keyframes are referenced through animation shorthand with tokens.
  CLI walkthrough post-validation was unavailable; MCP audit and decision surface were reviewed
  against actual imports, not treated as an automatic gate verdict.
- Final refinement passed desktop/medium/mobile visual review, frame-boundary assertions,
  three focused E2E journeys, web lint/typecheck and production build. Production LSP is clean;
  E2E LSP shows the documented isolated-Playwright resolution limitation in KNOWN_GOTCHAS.
- The lightweight catalog projection lives in the existing `course` entity. A peer
  `course-catalog` entity would either duplicate publication metadata or require a forbidden
  same-layer entity import.
- The pale staircase uses an SVG luminance-to-alpha filter instead of contrast amplification:
  amplification clips its already-light lines to white. Original supplied files remain intact.
- Failed images that complete before hydration now settle to the shared Image error state,
  preventing an indefinite loading skeleton on a direct catalog visit.
- Course artwork retains the supplied pixels; paper is removed at render time rather than
  regenerating the illustrations. The alpha filter composites with SourceGraphic so transparent
  filter bounds cannot become an opaque rectangle.
- Removing the pause control in F15 also replaces recurring decoration with single passes under
  five seconds, following
  [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html);
  reduced motion retains the static composition.

---

## Commit Message

```
feat(change-100): add the mini-course catalog
```
