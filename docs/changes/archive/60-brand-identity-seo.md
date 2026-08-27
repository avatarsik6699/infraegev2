# CHANGE 60 — Brand Identity and SEO Assets

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `60` |
| Slug | `brand-identity-seo` |
| Title | Brand Identity and SEO Assets |
| Status | `archived` |
| Branch | `feature/60-brand-identity-seo` |

---

## Goal

Keep the implemented SEO foundation — canonical/social metadata, truthful site-name structured
data and browser manifest — while adopting the architect-supplied three-stone production mark.
Orange remains isolated to the mark and `ege` wordmark signal; public controls, borders, links,
formula/code surfaces and reading surfaces remain neutral.

---

## Design References

- `docs/artifacts/brand/infraege-visual-identity-reference.png` — preserved rejected exploration,
  not a production visual contract.
- `docs/BRAND_ASSET_REQUIREMENTS.md` — binding handoff and acceptance requirements for production
  identity assets.
- `docs/artifacts/clear_logo.svg` — supplied clear production-mark source.
- `docs/artifacts/logo_with_border.svg` — supplied baseline production-mark source.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Create a vector-first three-stone brand mark plus separately optimized favicon, Apple
  touch, manifest and 1200×630 social-card assets; add a browser-only manifest without PWA/offline
  behavior — _Depends on:_ T1
- [x] `F2` Introduce the approved restrained orange system accent through theme/semantic tokens,
  preserving neutral reading surfaces, distinct status colors and WCAG contrast in every control
  state — _Depends on:_ F1
- [x] `F3` Add the decorative mark beside the existing live accessible `infraege` header text and
  adopt «Просто · понятно · бесплатно» on the home intro without changing its factual H1 or
  route behavior — _Depends on:_ F1, F2
- [x] `F4` Replace the empty data favicon with root icon/manifest/theme metadata, extend the shared
  route head with one default Open Graph/Twitter image, and add truthful home-only `WebSite`
  JSON-LD without inventing an Organization — _Depends on:_ F1, T1
- [x] `F5` Add focused asset, metadata and public-header tests plus required desktop, 150%-zoom,
  390px mobile, keyboard, no-JavaScript, contrast and clean-console evidence across representative
  public surfaces — _Depends on:_ F2, F3, F4
- [x] `F6` Separate the bright brand orange from a contrast-safe orange control ramp and use white
  text on saturated orange buttons, accent badges and equivalent controls, while leaving formula,
  notation and code highlighting unchanged — _Depends on:_ F2
- [x] `F7` Replace the neutral gray pressed state in secondary and quiet controls with a coherent
  orange-tinted hover/pressed sequence, add an explicit primary pressed state and verify every
  shared control state in the browser — _Depends on:_ F6
- [x] `F8` Lighten the primary control ramp while preserving white labels, coherent orange
  default/hover/pressed progression and the architect-approved contrast trade-off — _Depends on:_ F7
- [x] `F9` Use the reference orange `#FF6A00` as the visible primary-control fill with white labels,
  retaining orange-only hover/pressed states and recording the explicit small-text contrast
  exception instead of presenting it as WCAG AA — _Depends on:_ F8
- [x] `F10` Replace the public-header lockup with an authored hand-drawn three-stone mark, baseline
  and lowercase `infraege` vector wordmark that closely follows the supplied composition while
  preserving a live accessible site name — _Depends on:_ F9
- [x] `F11` Bring the public heading type and selected shared brand accents closer to the reference's
  Manrope and hand-drawn geometry without changing lesson/code/formula semantics or interface-icon
  ownership — _Depends on:_ F9, F10
- [x] `F12` Revert the provisional visual identity to the original monochrome palette, original
  typography, plain accessible text wordmark and original page headings; remove the provisional
  hand-drawn geometry and orange control states without changing product behavior — _Depends on:_ F11
- [x] `F13` Remove the rejected generated logo/favicon/touch/manifest icon assets, restore a safe
  empty favicon fallback, and retain the SEO/OG/head infrastructure with a temporary monochrome
  social image until architect-supplied production assets arrive — _Depends on:_ F12
- [x] `F14` Normalize the architect-supplied clear and baseline SVG marks into production assets;
  generate favicon, Apple touch, manifest and social-card variants, then place the baseline mark
  beside the live `infraege` wordmark with `ege` accented in the source orange — _Depends on:_ F13
- [x] `F15` Introduce the source orange as a restrained semantic accent for borders, link
  underlines and notation/code recognition surfaces while keeping controls, badges, reading
  surfaces and typography neutral — _Depends on:_ F14
- [x] `F16` Restrict orange to the supplied mark and the `ege` wordmark signal; restore neutral
  structural borders, link underlines, notation backgrounds and code separators so the brand
  color does not compete with learning content — _Depends on:_ F15

### Infra

None

### Data

None

### Other

- [x] `T1` Preserve the supplied PNG as `docs/artifacts/brand/infraege-visual-identity-reference.png`
  with the same SHA-256 and synchronize SPEC, FRONTEND and PRODUCT brand/SEO contracts with the
  approved identity scope — _Depends on:_ —
- [x] `T2` Run the Impeccable detector and bounded finish review, document the built visual system
  in `DESIGN.md`, verify prerendered metadata/assets and complete the affected frontend Critical
  Gate — _Depends on:_ F5
- [x] `T3` Synchronize SPEC, FRONTEND, PRODUCT and DESIGN with the architect-approved light-on-orange
  control contract; verify contrast, focused tests, Impeccable detector/review and the affected
  frontend Critical Gate — _Depends on:_ F6, F7
- [x] `T4` Record the revised lighter control palette and its measured contrast, update focused
  color-contract coverage, then complete browser evidence, Impeccable detector and the affected
  frontend Critical Gate — _Depends on:_ F8
- [x] `T5` Synchronize SPEC, FRONTEND, PRODUCT, DESIGN and focused tests with the exact-reference
  direction; capture desktop/mobile browser evidence, run the Impeccable finish workflow and the
  affected frontend Critical Gate, reporting any accepted accessibility exception — _Depends on:_ F9, F10, F11
- [x] `T6` Synchronize the product/design contracts and tests with the monochrome holding state,
  document the handoff requirements for architect-supplied logo/favicon/social assets, capture
  browser evidence and complete the affected frontend Critical Gate — _Depends on:_ F12, F13
- [x] `T7` Synchronize SPEC, FRONTEND, PRODUCT and asset requirements with the accepted supplied
  logo and restrained accent contract; update focused tests, capture bounded browser evidence and
  complete the affected frontend Critical Gate — _Depends on:_ F14, F15
- [x] `T8` Synchronize product/design contracts and tests with the final logo-only orange scope,
  then repeat bounded browser evidence and the affected frontend Critical Gate — _Depends on:_ F16

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/changes/60-brand-identity-seo.md
docs/artifacts/brand/infraege-visual-identity-reference.png
PRODUCT.md
DESIGN.md
apps/web/public/**
apps/web/src/app/styles/theme.css
apps/web/src/app/styles/tokens.css
apps/web/src/routes/__root.tsx
apps/web/src/routes/index.tsx
apps/web/src/shared/config/site.ts
apps/web/src/shared/lib/seo/**
apps/web/src/widgets/public-header/**
apps/web/src/pages/foundation/**
apps/web/src/shared/components/action-link/**
apps/web/src/shared/components/badge/**
apps/web/src/shared/components/button/**
apps/web/tests/**
apps/web/e2e/**
~~~

### Do NOT touch

- Topic/Course/CourseLesson content, practice answers, checker or progress semantics
- Backend/API contracts, database, analytics, authentication or production infrastructure
- Existing Lucide interface-icon ownership, dark mode, service worker or offline/PWA scope
- Route publication statuses, canonical URLs, robots policy or sitemap membership

---

## Contracts

See `docs/SPEC.md` §5 and §8, `docs/FRONTEND.md` §§4–6 and the Files list above. Do not hand-copy
frontend types or metadata shapes into this file; the codebase and binding docs are the source of
truth.

---

## Gate Checks

In addition to the affected frontend Critical Gate, run focused public metadata/asset Vitest,
public-home Playwright coverage, `pnpm audit:a11y`, and
`scripts/run-host-web-gate.sh pnpm --filter web build`. Browser evidence must include desktop,
150% zoom, 390px mobile, keyboard, no-JavaScript and a clean console. Verify built asset MIME
types and prerendered head output without expanding this change into a Full Gate.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The architect rejected the provisional generated identity after browser review. Its orange
  controls, hand-drawn replacement wordmark and Manrope files were removed; the original
  Literata/Onest system became the neutral base for the later architect-supplied mark.
- The interim safe-empty favicon and monochrome social preview preserved the completed SEO,
  OG/Twitter and `WebSite` JSON-LD infrastructure until the supplied production SVGs arrived.
- The accepted supplied SVGs keep their exact geometry and `#FA7011`; production copies only remove
  the opaque canvas, normalize square viewBoxes and add export safe zones. The clear mark owns
  favicon/icon exports, while the baseline mark owns header and social composition.
- After browser review, orange was restricted to the supplied mark and `ege` wordmark signal;
  structural rules, link underlines and code/formula recognition surfaces remain neutral.
- The live `ege` text uses `#EA6004` rather than the source `#FA7011`, raising white-background
  contrast from 2.84:1 to 3.4:1 while the supplied SVG geometry and color remain unchanged.

---

## Commit Message

```text
feat(change-60): add brand identity and SEO assets
```
