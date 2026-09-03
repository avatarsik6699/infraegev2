# CHANGE 80 — Rich Practice Content

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `80` |
| Slug | `rich-practice-content` |
| Title | Rich Practice Content |
| Status | `active` |
| Branch | `feature/80-rich-practice-content` |

---

## Goal

Let an authored practice task explain itself with the same safe structured content in its
statement, immediately available hint and server-owned solution. Support the media needed for real
informatics exercises without adding a generic document engine, client code execution, new answer
modes, external embeds or dependencies; preserve complete SSR/no-JavaScript reading and checker
secrecy.

---

## Backlog

### Backend

- [x] `B1` Replace the generic/dead task content shapes with a strict discriminated `ContentBlock`
  union shared by `statement`, `hint` and `explanation`: text, ordered/unordered list, Python/text
  code, table, local image, annotated local diagram, authored attachment, callout and the existing
  worked/completion/productive-failure blocks. Reject arbitrary HTML/MDX, video/iframe/external
  embeds, SVG attachments and unknown fields — _Depends on:_ —
- [x] `B2` Preserve checker request, normalization and progress behavior while returning the new
  explanation union from `POST /api/tasks/{id}/check`; update focused schema/API tests and tracked
  OpenAPI consumers — _Depends on:_ B1

### Frontend

- [x] `F1` Replace statement-only and solution-only renderers with one exhaustive practice-content
  renderer used by statement, hint and solution. Reuse the current typography, Notation, CodeBlock
  and Callout boundaries; add semantic lists/tables/figures, diagram descriptions/pointers and
  accessible downloadable attachments while keeping all content in SSR/no-JavaScript HTML — _Depends on:_ B1
- [x] `F2` Add minimal responsive presentation for rich practice blocks, including safe table/code
  overflow, intrinsic image sizing, visible attachment metadata and stable disclosure enhancement;
  keep the existing answer form, tabs, feedback and progress geometry unchanged — _Depends on:_ F1
- [x] `F3` Extend `/lab/design-system` with a representative rich-practice specimen that documents
  every supported block and the authoring/asset constraints without turning the lab into a second
  content engine — _Depends on:_ F2
- [x] `F4` Extend focused unit and Page Object-based browser coverage for rich statements, hints,
  solutions, downloads, narrow layouts and no-JavaScript completeness — _Depends on:_ F3, D3
- [x] `F5` Keep every `Mistake` comparison in one vertical flow at all viewport widths and add the
  established semantic left-rule cue without restoring card chrome or coloring authored body
  copy — _Depends on:_ —
- [x] `F6` Make accepted disabled answer fields flat and readable with a trailing success icon,
  while preserving their submitted value, native disabled semantics, feedback and form geometry — _Depends on:_ F2
- [x] `F7` Keep every lesson-outline group and child list in one column at desktop, intermediate
  and mobile widths, and establish one compact stage-heading-to-content rhythm without component
  outer-margin duplication — _Depends on:_ —
- [x] `F8` Keep public header/footer contents anchored to shared viewport gutters as the viewport
  narrows, and remove the `beta` and `v1.0.0` header noise plus its dead configuration — _Depends on:_ —
- [x] `F9` Replace the ALCHIMIA master with the architect-supplied high-contrast `logo.svg`,
  regenerate every production derivative, and make the monochrome mark/favicons render white in
  explicit dark contexts without introducing application dark mode — _Depends on:_ F8
- [x] `F10` Unify `Checkpoint` and vertical `Mistake` as equally quiet inline learning blocks:
  match their outer padding, accent-rule weight, service-label typography and icon geometry so
  neither competes with the other in the reading flow — _Depends on:_ F5
- [x] `F11` Align `Checkpoint` disclosure content with the text column established by its leading
  icon, and make the `Mistake` outer rule neutral like its internal separator while retaining
  semantic red/green icons and labels — _Depends on:_ F10
- [x] `F12` Separate semantic heading order from visual typography role: reserve Cormorant SC for
  explicit display headings, use Literata 500 for compact content headings such as course modules,
  practice tasks and dialogs, and document/prove the role split in the design-system lab without
  adding fonts or dependencies — _Depends on:_ —
- [x] `F13` Remove the `Typography.Title` role collision that overwrites component-local
  `data-variant` values and restores lesson stage headings to their compact, low-emphasis contract;
  use a no-late-swap font-display strategy and prove first-load layout stability with cold-cache
  browser evidence without adding dependencies — _Depends on:_ F12
- [x] `F14` Reconcile stale Badge/Progress token assertions found by the final focused audit with
  their current semantic token contracts without changing component presentation — _Depends on:_ —
- [x] `F15` Reconcile the stale lesson-outline E2E assertion with the established stable-weight
  active-state contract so browser coverage verifies the current no-layout-shift treatment — _Depends on:_ F13
- [x] `F16` Correct the first-load font strategy so the real ALCHIMIA display, reading and UI faces
  remain present and visually light on cold visits without a late font swap, preserving the
  decorative wordmark and home display identity as well as stable text geometry — _Depends on:_ F13, I1
- [x] `F17` Revert the rejected compact-heading typography split: restore Cormorant SC 600 and the
  pre-F12 sizes for standard headings across public pages, practice, prose and dialogs; remove the
  now-dead `Typography.Title` content/display role while preserving compact IBM Plex Mono lesson
  stage landmarks and the existing self-hosted preload/cache boundaries —
  _Depends on:_ F16
- [x] `F18` Remove font-dependent `ch` widths from public lesson article and reading measures after
  a cold trace proved that fallback-to-Literata loading changes both and causes CLS; preserve the
  loaded visual measures with stable `rem` caps and focused browser evidence — _Depends on:_ F17
- [x] `F19` Replace the rejected `font-display: optional` delivery after cold browser evidence
  proved that it can leave rendered public text on the heavy system fallback even after ALCHIMIA
  faces load; guarantee the real self-hosted faces with preload plus `swap`, correct the display,
  reading and service fallback metrics, and re-prove cold-load geometry without new dependencies —
  _Depends on:_ F18

### Infra

- [x] `I1` Give self-hosted `/fonts/` responses an explicit production cache policy that supports
  reuse without treating the current non-hashed ALCHIMIA filenames as immutable — _Depends on:_ F13

### Data

- [x] `D1` Extend content validation for task-owned assets under
  `apps/web/public/content/tasks/{task-id}/`: reject traversal/query/hash and wrong owner prefixes;
  allow images only as PNG/WebP/AVIF up to 2 MiB with intrinsic dimensions, and attachments only as
  TXT/CSV/JSON/PY/ZIP up to 5 MiB with declared MIME, byte size, label and description — _Depends on:_ B1
- [x] `D2` Mechanically migrate all task `statement` and `hint` strings to one text block each,
  preserving exact wording and existing explanation semantics — _Depends on:_ B1
- [x] `D3` Add two narrow public proofs: a small TXT download to `python-files-aggregate`, and
  code plus a table or annotated diagram to one Topic task without revealing its answer. Do not
  editorially rewrite other tasks — _Depends on:_ D1, D2, F1
- [x] `D4` Consolidate the `rekursiya-call-stack-trace` support table into equivalent comments in
  its existing Python block so the condition reads as one compact code artifact without exposing
  the answer or changing checker behavior — _Depends on:_ D3

### Other

- [x] `T1` Align SPEC, frontend authoring guidance and content-quality language with the final
  rich-practice contract, explicitly recording exclusions and the shifted editorial Changes 81–84
  — _Depends on:_ B1, F1, D1
- [x] `T2` Reconcile FRONTEND/PRODUCT and the brand-asset contract with the approved vertical
  mistake, one-column outline, stage-entry rhythm, quieter public chrome and new sole logo source — _Depends on:_ F5, F7, F8, F9
- [x] `T3` Keep the frontend authored-content parser fail-closed with the backend contract by
  rejecting empty step/table/pointer collections, unsupported attachment MIME types and oversized
  attachment metadata; cover each mismatch found by the final audit — _Depends on:_ B1, F1, D1

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/FRONTEND.md
PRODUCT.md
docs/artifacts/alchimia-public-migration-matrix.md
docs/changes/80-rich-practice-content.md
apps/api/app/modules/content/**
apps/api/app/modules/tasks/**
apps/api/tests/**
apps/web/src/entities/practice-task/**
apps/web/src/features/lesson-practice/**
apps/web/src/pages/design-system-lab/**
apps/web/src/pages/lesson-design-lab/lesson-design-lab.constants.ts
apps/web/src/shared/api/schema.ts
apps/web/src/shared/components/download-link/**
apps/web/src/shared/components/image/**
apps/web/src/shared/components/learning-content/mistake/**
apps/web/src/shared/components/learning-content/checkpoint/**
apps/web/src/shared/components/confirmation-dialog/**
apps/web/src/shared/components/typography/**
apps/web/src/shared/config/site.ts
apps/web/src/shared/styles/patterns.module.css
apps/web/src/pages/course-overview/**
apps/web/src/widgets/lesson-outline/**
apps/web/src/widgets/public-header/**
apps/web/src/widgets/public-footer/**
apps/web/tests/**
apps/web/e2e/**
apps/web/public/content/tasks/**
apps/web/public/brand/**
apps/web/public/favicon*
apps/web/public/apple-touch-icon.png
content/tasks/**
docs/BRAND_ASSET_REQUIREMENTS.md
docs/artifacts/references/logo.svg
infra/nginx/conf.d/infraege.prod.conf
scripts/validate-content-links.mjs
scripts/generate-brand-assets.mjs
scripts/lib/task-content-assets.mjs
scripts/tests/task-content-assets.test.mjs
~~~

### Do NOT touch

- Topic/CourseLesson theory, publication state, ids, task ownership, task ordering or answer values
- Checker normalization, answer modes, progress persistence, analytics, auth, database or infra
  outside I1's narrow production font-cache location
- Dependencies, application dark mode or unrelated public page composition
- Arbitrary HTML/MDX, external embeds, video/iframe, SVG attachments or user uploads
- Archived change files

---

## Contracts

See `docs/SPEC.md` §2.3–§5 and the Files list above. Do not hand-copy schema, endpoint, type or
environment details into this file.

---

## Gate Checks

Use the affected backend/frontend/content Critical Gate. Required evidence additionally includes
`pnpm api:check`, content-link validation, focused SSR/no-JavaScript and download browser checks,
and visual/console review of the rich-practice lab plus both public proof tasks.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The final parser audit aligned non-empty collections, attachment MIME values and the 5 MiB
  metadata ceiling across backend and frontend fail-closed projections.
- Fallow's remaining dead-code signals are retained false positives: `patterns.module.css` is
  consumed through CSS Modules `composes`, the asset test is a direct `node --test` gate entry, and
  `DownloadLinkTypes` follows the existing shared-component public-barrel convention.
- F17 supersedes F12's rejected content/display heading split without reverting the compact
  lesson-stage selector; F18–F19 supersede the font-relative lesson measure and the optional
  delivery policy after cold browser traces exposed their remaining fallback/CLS defects.

---

## Commit Message

```text
feat(change-80): add structured rich practice content
```
