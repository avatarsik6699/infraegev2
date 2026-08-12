# CHANGE 15 — Impeccable Public Web Redesign

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `15` |
| Slug | `impeccable-public-web-redesign` |
| Title | Impeccable Public Web Redesign |
| Status | `archived` |
| Branch | `feature/15-impeccable-public-web-redesign` |

---

## Goal

Reset the rejected public-web implementation to a quiet, domain-neutral frontend foundation while
preserving reusable infrastructure, shared components, the backend API ecosystem, and the approved
TableOfContents. Remove concrete publication content and page hooks so the next design direction
can be developed from a clean SSR/no-JS baseline instead of inheriting the discarded composition.

---

## Backlog

### Backend

- [x] `B1` Replace legacy figure/diagram API models with a strict discriminated `LearningVisualBlock` supporting raster, structured and hybrid representations while preserving accessible and factual data — _Depends on:_ D1
- [x] `B2` Regenerate the OpenAPI/TypeScript contract and add API coverage proving valid new visuals pass and legacy figure/diagram payloads fail — _Depends on:_ B1
- [x] `B3` Decouple content/task API tests from the concrete published files by using temporary generic fixtures while preserving the existing backend endpoints, schemas and OpenAPI contract — _Depends on:_ D3
- [x] `B4` Remove the former topic-specific structured visual from the retained task API: replace it with a strict domain-neutral structured payload, regenerate OpenAPI/frontend types and prove the generic contract accepts JSON data while rejecting legacy visual shapes — _Depends on:_ B3

### Frontend

- [x] `F1` Complete the Impeccable product, direction and execution-contract rounds for the public web; record the approved direction contract and surface briefs before UI code — _Depends on:_ —
- [x] `F2` Build the approved Mantine 9.5.1 design-system foundation: theme, tokens, typography, page shell, navigation, footer and complete interactive states — _Depends on:_ F1
- [x] `F3` Implement the new accessible learning-visual renderer and migrate the former teaching material in the approved medium without restoring the legacy generation pipeline — _Depends on:_ B2, F2, D2
- [x] `F4` Redesign the home page as the brand-led entry point and topic/course learning pages as one continuous read-to-practice journey — _Depends on:_ F2, F3
- [x] `F5` Redesign privacy, terms, empty, pending, error and not-found surfaces in the same system without changing their factual behavior — _Depends on:_ F2
- [x] `F6` Update unit tests and fixture-owned Page Objects/E2E journeys for the new semantics, visual contract, responsive source order, no-JS reading, keyboard flow and unchanged mastery behavior — _Depends on:_ F4, F5
- [x] `F7` Replace the topic page's single-column section navigation with Mantine TableOfContents: a quiet sticky desktop rail with connected learning-path nodes, an in-flow mobile adaptation, SSR/no-JS anchor fallbacks and accessible active-section semantics — _Depends on:_ F4, F6
- [x] `F8` Clear the browser-gate regressions exposed while verifying F7: use the approved accessible dark ember for Mantine primary actions and align the topic Page Object with the migrated learning visual's current accessible description — _Depends on:_ F2, F3, F6
- [x] `F9` Replace the rejected node-and-connector TableOfContents treatment with a quieter editorial index that preserves Mantine scroll tracking, responsive placement and accessible active-section semantics — _Depends on:_ F7
- [x] `F10` Rebuild TableOfContents from the architect reference as a reusable shared learning-path component with offset SVG nodes, non-intersecting curved connectors, and ember highlighting for the active node plus every completed connection — _Depends on:_ F9
- [x] `F11` Tighten the shared learning path after architect review: use an even compact node rhythm, add a muted explanatory line beneath every title and remove dashed node outlines without changing active-route highlighting — _Depends on:_ F10
- [x] `F12` Remove node outlines entirely and anchor each title/description block to its own offset node instead of a fixed text column, eliminating the architect-marked horizontal gaps — _Depends on:_ F11
- [x] `F13` Recompose topic and lesson reading pages around the architect reference: add ruled site/subheader layers, a compact badge-and-meta introduction, a denser responsive three-column learning workspace with the shared learning path on the left and optional supporting material on the right, and remove the oversized pre-title hero without changing content or mastery semantics — _Depends on:_ F12
- [x] `F14` Correct the F13 architect-review mismatch: remove the standalone topic hero completely, attach its compact context to the first content heading, and make the site-header divider span the full viewport instead of ending at container padding — _Depends on:_ F13
- [x] `F15` Reset public `apps/web` to a neutral TableOfContents foundation: remove home/topic/lesson/legal/sitemap routes and domain entities, features and widgets; retain reusable infrastructure and shared components; expose only an SSR/no-JS responsive ToC stand at `/` plus the generic 404 state — _Depends on:_ F14
- [x] `F16` Replace domain-specific unit, E2E, accessibility and architecture-policy fixtures with foundation coverage for the ToC stand, shared infrastructure, responsive/no-JS behavior, error telemetry and removed-route 404s — _Depends on:_ F15
- [x] `F17` Neutralize residual legacy route/content examples in web and ops test fixtures without weakening removed-route, telemetry or parser coverage — _Depends on:_ F16
- [x] `F18` Align the neutral Table of Contents stand and its focused coverage with the four canonical learning sections without restoring topic-specific content or page composition — _Depends on:_ D5
- [x] `F19` Stop the neutral foundation from requesting a missing legacy favicon by declaring a non-branded data favicon in the document head, restoring a clean browser console without adding a new visual asset — _Depends on:_ F15

### Infra

None.

### Data

- [x] `D1` Replace the SPEC content-block and publication-quality contracts with the new first-class learning-visual model and remove active legacy figure/diagram generation requirements — _Depends on:_ —
- [x] `D2` Migrate the former published topic and its quality evidence to the new visual contract; remove its old visuals brief and obsolete asset — _Depends on:_ D1
- [x] `D3` Remove the concrete topic/task publication from `content/`, retain empty tracked content directories and keep link validation valid for zero published content — _Depends on:_ D2
- [x] `D4` Restore the architect-approved domain-neutral learning elements as a durable product contract: substantive theory, algorithm and examples, immediate hints, partial practice, progressively harder tasks, assisted work counting toward progress, no timer/final-exam ceremony and review recommendations only after weak outcomes — _Depends on:_ D3
- [x] `D5` Distill the durable learning trajectory into four canonical learner-facing sections — Theory, Practice, What matters for the EGE and Result — while preserving immediate help, progressive difficulty, mastery and no-penalty semantics as internal rules rather than top-level steps — _Depends on:_ D4

### Other

- [x] `T1` Remove the obsolete design-generation instruction files and update STACK required tooling so Impeccable owns frontend design decisions — _Depends on:_ D1
- [x] `T2` Run the Impeccable detector, bounded desktop/mobile inspection, asset-producer check when applicable, independent finish review and document the built system in `DESIGN.md` — _Depends on:_ F6
- [x] `T3` Run the complete affected Fast Gate, LSP/API drift/browser evidence and record only non-obvious residual risks — _Depends on:_ B2, F6, T1, T2
- [x] `T4` Complete the attended Impeccable re-roll by replacing the current decision-board hand when the architect requests fresh directions — _Depends on:_ F1
- [x] `T5` Reframe the Impeccable direction round around the complete EGE informatics learning system and representative content archetypes instead of deriving the brand from a single published topic — _Depends on:_ F1
- [x] `T6` Re-roll the generalized system toward the architect-provided warm, low-noise editorial reference while preserving meaningful context, strong content focus and one clear action accent — _Depends on:_ T5
- [x] `T7` Recompose the selected Warm Editorial Workspace after architect feedback so each viewport has one dominant idea, one representative learning visual and one action instead of a simultaneous component catalog — _Depends on:_ T6
- [x] `T8` Supersede the rejected public-web direction in current documentation and operational hooks: remove its Impeccable/reference artifacts and branded assets, generalize PRODUCT/SPEC/STACK/conventions, and point build, local, deploy and performance checks at the neutral root stand without rewriting archived change history — _Depends on:_ B3, F16, D3
- [x] `T9` Make routine completion evidence compact: define a minimal affected-area Critical Gate for `/work` and default local `/ship`, make the Full Gate opt-in via an explicit `--full` flag, and retain mandatory Full + Release Gates for `--release` publication — _Depends on:_ T8
- [x] `T10` Audit current non-archived code and documentation for references to the removed publication, replace active-change historical slug mentions with neutral wording and document the boundary between preserved product-domain contracts and deleted content instances — _Depends on:_ B4, F17, D4

---

## Files

### Create / modify

~~~
apps/web/PRODUCT.md
docs/SPEC.md
docs/STACK.md
docs/changes/15-impeccable-public-web-redesign.md
docs/artifacts/design/** (delete)
content/topics/**
content/tasks/**
apps/api/app/modules/content/schemas.py
apps/api/tests/**
apps/ops/server/integrations/parsers.test.ts
apps/web/public/**
apps/web/src/shared/config/mantine-theme.ts
apps/web/src/shared/styles/tokens.css
apps/web/src/shared/components/**
apps/web/src/entities/** (delete domain slices)
apps/web/src/features/** (delete domain slices)
apps/web/src/widgets/** (delete page compositions)
apps/web/src/pages/** (delete concrete pages)
apps/web/src/routes/__root.tsx
apps/web/src/routes/index.tsx
apps/web/tests/**
apps/web/e2e/**
scripts/validate-content-links.mjs
~~~

### Do NOT touch

- `apps/ops/` except the explicitly listed neutral parser fixture, database schemas/migrations,
  auth/accounts or infrastructure/runtime services
- Archived change files

---

## Contracts

See `docs/SPEC.md` §2–§5 and §8 and the Files list above. Do not hand-copy schema, endpoint, type
or environment details into this file.

---

## Gate Checks

For the reset, browser evidence covers the neutral root at desktop/mobile widths, source order,
no-JS anchors, clean console, removed-route 404 behavior, and serious/critical axe results. API
type regeneration applies because the tracked backend schema changed earlier in this change.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- TypeScript LSP still reports false Playwright import diagnostics in the Foundation Page Object
  despite `tsc --noEmit` and all four Playwright tests passing; changed production TypeScript and
  Python files report no LSP issues.
- The generated frontend API schema deliberately retains learning-domain types because the backend
  endpoints and OpenAPI ecosystem remain in scope even though the concrete public pages are gone.
- Structured learning visuals retain a strict typed envelope but carry JSON-only `data` until a
  real content consumer justifies a narrower visual-kind schema; this prevents the removed topic
  from defining the generic API contract.

---

## Commit Message

```text
refactor(change-15): reset public web foundation
```
