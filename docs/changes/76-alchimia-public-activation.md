# CHANGE 76 — ALCHIMIA Public Activation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `76` |
| Slug | `alchimia-public-activation` |
| Title | ALCHIMIA Public Activation |
| Status | `active` |
| Branch | `feature/76-alchimia-public-activation` |

---

## Goal

Activate the architect-approved ALCHIMIA profile from `/lab/design-system` across public application
chrome and delivery metadata while preserving the current white monochrome baseline, product
behavior and domain contracts. Promote only proven system values and reusable boundaries; do not
copy the lab catalog composition into production or begin the lesson-copy migration owned by
Changes 77–82.

---

## Design References

- `docs/artifacts/references/logo_with_transperant_bg.svg` — sole artistic authority for the
  ALCHIMIA mark; derivatives may adapt delivery sizing but must preserve visible geometry.
- `/lab/design-system` — approved executable source for typography, monochrome system roles,
  identity composition and component/widget contracts; it is not a production page template.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Inventory the accepted lab profile against current public theme, tokens, fonts and
  shared presentation, then promote only the necessary app-wide ALCHIMIA values without copying
  route-local catalog CSS or changing lesson content — _Depends on:_ T1
- [x] `F2` Activate the compact ALCHIMIA identity through the shared public header/layout boundary
  on every public page, preserving navigation semantics, responsive behavior, SSR/no-JavaScript
  output and existing application functionality — _Depends on:_ F1
- [x] `F3` Replace public site naming and delivery assets with ALCHIMIA in `siteConfig`, route
  metadata, manifest, favicon, Apple touch icon and social preview outputs; keep canonical URLs,
  domain ids, storage keys, analytics contracts and infrastructure names unchanged — _Depends on:_
  F2
- [x] `F4` Reconcile focused unit/E2E contracts and verify representative public pages at mobile,
  breakpoint and desktop widths, including keyboard, zoom, no-JavaScript, overflow, accessibility,
  metadata and generated-asset evidence — _Depends on:_ F3
- [x] `F5` Reconcile the frozen lesson-lab font assertion with the app-wide typography activated in
  F1, without changing `/lab/lesson` composition or content — _Depends on:_ F1
- [x] `F6` Reconcile the design-system E2E widget inventory after the candidate header is
  consolidated into the production `PublicHeader` contract — _Depends on:_ F2

### Infra

None

### Data

None

### Other

- [x] `T1` Synchronize `docs/SPEC.md`, `PRODUCT.md` and `docs/FRONTEND.md` with archived Change 75:
  mark the lab foundation complete, describe `/lab/design-system` as the approved source for public
  activation and keep the current public `infraege` identity explicit until F2–F3 land — _Depends
  on:_ —

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/SPEC.md
PRODUCT.md
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/changes/76-alchimia-public-activation.md
apps/web/src/app/styles/**
apps/web/src/app/**site-config**
apps/web/src/widgets/public-header/**
apps/web/src/widgets/public-footer/**
apps/web/src/widgets/alchimia-header/**
apps/web/src/pages/design-system-lab/**
apps/web/src/routes/**
apps/web/public/**
scripts/**brand**
apps/web/tests/**
apps/web/e2e/**
~~~

### Do NOT touch

- TopicLesson or CourseLesson authored copy, examples, tasks, ids, publication state or progress
- `/lab/lesson` composition or content
- Backend, API/OpenAPI, database, consent, analytics, operations or deployment contracts
- Canonical production domain and infrastructure/runtime identifiers that intentionally remain
  `infraege`
- Archived change files

---

## Contracts

See `docs/SPEC.md` §5.3 and §9, `docs/FRONTEND.md` §4 and §6.1, and the Files list above. Do not
hand-copy schema, endpoint, type or environment details into this file.

---

## Gate Checks

Use the affected frontend Critical Gate for implementation work. F4 additionally requires focused
browser evidence for representative public routes and generated public metadata/assets; no release
or production mutation belongs to this change unless the architect later requests `/ship --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- F1 promotes the accepted palette and typography through the existing canonical theme and
  semantic-token chain. The old orange brand roles remain only as unconsumed compatibility
  definitions until the delivery cleanup in F3; no catalog-local component styling moved into the
  global layer.
- F2 consolidates the approved identity into the existing purpose-based `PublicHeader` API and
  removes the parallel candidate widget. The approved SVG moves byte-for-byte with its history;
  release label, version, SSR markup and home/internal navigation semantics remain intact. Public
  naming and generated delivery assets intentionally remain for F3.
- F5–F6 update stale browser assertions exposed by the F1–F2 activation: the frozen lesson lab now
  validates the new local font contract without changing its composition, and the design-system
  inventory reflects the single live public-header widget.
- F3 keeps `infraege.ru`, storage keys, analytics ids and infrastructure names as stable technical
  identifiers. Public delivery names and assets use ALCHIMIA; the square favicon viewport adds
  transparent whitespace around the complete approved SVG geometry rather than redrawing it.

---

## Commit Message

```text
feat(change-76): activate ALCHIMIA public identity
```
