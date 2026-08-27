# CHANGE 61 — Final Brand Mark

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `61` |
| Slug | `final-brand-mark` |
| Title | Final Brand Mark |
| Status | `archived` |
| Branch | `feature/61-final-brand-mark` |

---

## Goal

Make `docs/artifacts/final_logo.svg` the single production source for the infraege identity and
regenerate every browser, manifest and social derivative from it. Preserve the live Literata
wordmark, the neutral interface and the existing SEO/metadata contract while retiring all older
brand sources and the baseline-mark variant.

---

## Design References

- `docs/artifacts/final_logo.svg` — architect-approved final three-stone production mark and the
  only current visual authority for brand geometry and source colors.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Normalize the final source into the single large-use production SVG without changing
  its three silhouettes, `#FF6B00` / `#393939` colors or transparent background; remove the old
  baseline production variant — _Depends on:_ —
- [x] `F2` Create an optically simplified small-size derivative and regenerate the SVG/PNG/ICO
  favicon, Apple touch and manifest icon set with the existing public URLs, required dimensions,
  alpha/background and safe-zone contracts — _Depends on:_ F1
- [x] `F3` Update the shared public header to use the final vertical mark beside the live Literata
  wordmark, preserving accessible home-link behavior and using contrast-safe `#F56300` only for
  `ege` — _Depends on:_ F1
- [x] `F4` Regenerate the 1200×630 social preview with the final mark, existing live-wordmark
  treatment and truthful product subtitle while preserving OG/Twitter metadata URLs, dimensions
  and alt text — _Depends on:_ F1, F3
- [x] `F5` Update focused asset, header and metadata coverage for the single-mark contract,
  including SVG safety, source colors, raster/ICO dimensions, manifest declarations and removal
  of the baseline asset — _Depends on:_ F2, F3, F4
- [x] `F6` Simplify the social preview to a white 1200×630 canvas with only the final three-stone
  mark centered on both axes; remove the wordmark, subtitle and separator, and align its metadata
  alt text and focused coverage with the actual image — _Depends on:_ F4
- [x] `F7` Restore the Full Gate LCP budget on `/` and `/ege/16-rekursiya` after the final-brand
  integration, preserving the approved appearance and measuring the actual Lighthouse bottleneck
  before and after the fix — _Depends on:_ F3, F5

### Infra

None

### Data

None

### Other

- [x] `T1` Remove the superseded clear, bordered and visual-reference source artifacts and
  synchronize SPEC, FRONTEND, PRODUCT and brand handoff requirements with `final_logo.svg` as the
  only master; keep archived Change 60 unchanged — _Depends on:_ F1, F2, F3, F4
- [x] `T2` Capture bounded desktop, 390px mobile and 150%-zoom browser evidence, verify keyboard,
  SSR/no-JS, clean console and favicon readability, then run the single Impeccable detector pass
  and the affected frontend Critical Gate — _Depends on:_ F5, T1

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/changes/61-final-brand-mark.md
docs/artifacts/final_logo.svg
PRODUCT.md
apps/web/public/**
apps/web/src/app/styles/theme.css
apps/web/src/widgets/public-header/**
apps/web/tests/**
apps/web/e2e/**
package.json
scripts/generate-brand-assets.mjs
~~~

### Do NOT touch

- `docs/changes/archive/60-brand-identity-seo.md`
- Topic/Course/CourseLesson content, checker answers and progress semantics
- Backend/API, database, analytics, authentication and production infrastructure
- Buttons, borders, links, notation/code surfaces, route publication, canonical, robots, sitemap
  or JSON-LD behavior

---

## Contracts

See `docs/SPEC.md` §5 and §8, `docs/FRONTEND.md` §§4–6 and the Files list above. Do not hand-copy
frontend types or metadata shapes into this file; the codebase and binding docs are the source of
truth.

---

## Gate Checks

In addition to the affected frontend Critical Gate, run focused brand/metadata Vitest and the
public-header Playwright journey. Browser evidence must cover desktop, 390px mobile, 150% zoom,
keyboard, SSR/no-JS, favicon readability and a clean console. Run the Impeccable detector once
after the UI is finished; do not expand this work invocation to the Full Gate.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The header uses a 96×135 transparent raster rendered from the unchanged production SVG: this
  preserves the approved appearance at its 31×44 CSS size while avoiding a 109 KB compressed
  high-priority SVG transfer that pushed both Lighthouse routes over their LCP budget.

---

## Commit Message

```text
feat(change-61): adopt final brand mark and icon set
```
