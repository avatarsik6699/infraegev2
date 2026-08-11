# CHANGE 12 — Learning Visual System

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `12` |
| Slug | `learning-visual-system` |
| Title | Learning Visual System |
| Status | `active` |
| Branch | `feature/12-learning-visual-system` |

---

## Goal

Replace the one-column topic article and SVG-first authoring baseline with the M3 learning shell:
section route on the left, readable lesson in the center, quick reference on the right, and a
hybrid offline AI-assisted figure pipeline. Migrate the theory portion of the published graph/table
topic as the reference implementation while preserving semantic tables, no-JS reading, existing
practice behavior, and human-owned content publication.

---

## Design References

- Topic page — `docs/artifacts/design/task_page_example.png`: three-column learning composition,
  numbered section route, editorial hierarchy, compact metadata and a direct practice action.
- Diagram corpus — `docs/artifacts/design/schemas/`: graphite technical line art, registration
  corners, offset shadows, pastel semantic states and six reusable composition families.

The downloaded references are local analysis inputs only. Do not add them to the product bundle or
commit them without confirmed redistribution rights; commit only the derived visual language.

---

## Backlog

### Frontend
- [x] `F1` Add the shared `LearningPageShell` and responsive visual tokens: desktop section route,
  central reading column and quick-reference rail; tablet/mobile collapse to semantic source order,
  with no-JS anchors and real topic metadata only — _Depends on:_ D1
- [x] `F2` Add the `figure` renderer through the shared `Image` policy, retain semantic tables and
  legacy SVG compatibility, and expose accessible figure/caption markup — _Depends on:_ D1
- [x] `F3` Migrate Topic and CourseLesson rendering to section data and quick-reference blocks;
  preserve current practice/progress and related-topic behavior below the new theory shell —
  _Depends on:_ F1, F2, D2
- [x] `F4` Add focused unit and browser coverage for section navigation, responsive source order,
  figure accessibility and the unchanged practice journey — _Depends on:_ F3
- [x] `F5` Refine the shared figure presentation after architect review: use a restrained
  technical-paper surface behind transparent assets, remove excess renderer whitespace and keep
  the caption visually attached to the figure at desktop and narrow widths — _Depends on:_ F2
- [x] `F6` Align the published-topic E2E Page Object with the Change 12 pitfalls section's current
  user-visible heading and copy instead of the removed legacy `Типичная ошибка:` label — _Depends
  on:_ F4
- [x] `F7` Keep the topic progress indicator visible and accessible in the Change 12 narrow layout;
  the mobile rail must not remove current progress from the accessibility tree — _Depends on:_ F1

### Data
- [x] `D1` Implement the new content contracts: `LearningSection`, `figure`,
  `quick_reference_blocks`, and `learning_outcomes`; remove `presentation_mode` from topic authoring
  while keeping task explanation blocks compatible with the API — _Depends on:_ —
- [x] `D2` Rewrite `graphs-and-tables` theory into idea/theory/algorithm/pitfalls sections and
  author the exact full generation brief for its graph figure; keep the exact road table semantic
  HTML and keep content in `review` until the architect approves the generated asset —
  _Depends on:_ D1
- [x] `D3` Extend content validation for figure paths, alt text, explicit dimensions and a 500 KiB
  per-asset limit; validate the final architect-provided PNG/WebP under the topic asset directory —
  _Depends on:_ D2
- [x] ~~`D4` Replace the reviewed graph figure with a compact transparent export that preserves the
  exact nodes, edges, row labels and correspondence while removing rough contours, raster
  artifacts and obstructive empty canvas — _Depends on:_ D2, D3~~ (removed — the architect chose
  to keep the current asset and improve the generation pipeline in a separate future change)

### Infrastructure
- [x] `I1` Diagnose the local `make dev` build stalling at the web image's recursive
  `chown -R node:node /repo`, then restore a bounded, documented developer startup path without
  weakening non-root container ownership — _Depends on:_ —
- [x] `I2` Restore Vite HMR WebSocket forwarding through the local Nginx entrypoint so `make dev`
  provides a clean browser console and live source updates at `http://localhost:8080` — _Depends
  on:_ I1
- [x] `I3` Restrict the shared Nginx proxy's HTTP Upgrade forwarding to exact WebSocket requests so
  Vite HMR remains available without triggering the Full Gate's h2c-smuggling protection —
  _Depends on:_ I2

### Other
- [x] `T1` Write the derived visual-language guide and reusable generation-brief template covering
  the six composition families, palette, invariants, negative constraints, accessibility and
  human factual/originality review — _Depends on:_ —
- [x] `T2` Capture desktop/tablet/narrow screenshots and console evidence; have the architect
  verify the final generated graph's edges, labels, originality and visual fit before restoring
  `published` status — _Depends on:_ F4, F5, D3, T1
- [x] `T3` Connect Python and TypeScript LSP MCP tools plus frontend/backend architecture skills,
  validate their startup and document their availability in `docs/STACK.md` — _Depends on:_ —

---

## Files

### Create / modify
~~~
docs/SPEC.md
docs/artifacts/design/VISUAL_LANGUAGE.md
docs/artifacts/design/GENERATION_BRIEF_TEMPLATE.md
content/topics/graphs-and-tables.json
content/topics/graphs-and-tables.visuals.md
apps/web/public/content/topics/graphs-and-tables/
apps/web/src/entities/content/
apps/web/src/entities/content-block/
apps/web/src/widgets/learning-page-shell/
apps/web/src/pages/topic/
apps/web/src/pages/lesson/
apps/web/src/shared/components/fragment-link/
apps/web/src/shared/config/mantine-theme.ts
apps/web/src/shared/styles/tokens.css
apps/web/tests/
apps/web/e2e/
scripts/validate-content-links.mjs
apps/web/Dockerfile
infra/nginx/conf.d/infraege.conf
~~~

### Do NOT touch
- `content/tasks/` and the answer-checking API behavior
- Progress scoring/localStorage semantics (Change 13 owns practice changes)
- Home/privacy/terms redesign beyond shared token inheritance
- Runtime AI integrations, auth, discussions or moderation
- Third-party reference images without confirmed redistribution rights

---

## Contracts

See `docs/SPEC.md` §3–§5 and the Files list above.

---

## Gate Checks

No change-specific command override. In addition to the normal gates, `T2` requires architect-owned
visual/factual approval of the externally generated graph asset before the topic can be published.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The generated `graph-degree-correspondence.png` is connected as the theory figure; the architect
  approved its factual accuracy, originality and visual fit on 2026-08-11, and the topic returned
  to `published` for final T2 verification.
- After manual review, the architect chose to retain the current figure despite its excess canvas
  and minor raster roughness; improving the figure-generation pipeline and methodology is deferred
  to a separate future change rather than expanding Change 12.
- The final narrow-layout E2E exposed that the section rail hid topic progress below 768 px; the
  existing progress component now remains visible and accessible without changing scoring or
  localStorage semantics.
- Nginx HMR forwarding uses an exact WebSocket-only `Connection` allowlist. The associated Semgrep
  suppression is intentionally narrow because the generic rule flags every WebSocket proxy triple
  without inspecting whether arbitrary upgrade protocols can reach the upstream.

---

## Commit Message

```
feat(change-12): add learning shell and visual pipeline
```
