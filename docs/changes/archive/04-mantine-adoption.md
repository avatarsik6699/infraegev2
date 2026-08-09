# CHANGE 04 — Mantine 9.5.1 Adoption

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `04` |
| Slug | `mantine-adoption` |
| Title | Mantine 9.5.1 Adoption |
| Status | `active` |
| Branch | `feature/04-mantine-adoption` |

---

## Goal

Adopt Mantine as the frontend's shared UI primitive layer while preserving the existing
"Textbook precision" design baseline in `docs/SPEC.md` §5.3 and all current product behavior.
Integrate Mantine safely with TanStack Start SSR, centralize the theme bridge, and migrate the
existing components for which Mantine provides an accessible equivalent. Every adopted
`@mantine/*` package must be pinned to exactly `9.5.1`.

---

## Backlog

<!-- This list is OPEN, not a fixed scope: /work appends new items here when the architect reports
     findings/fixes/follow-ups mid-session — it does not fix them off-list.
     Group items by area (Backend / Frontend / Infra / Data, etc.).
     ID scheme: B=Backend · F=Frontend · I=Infra · D=Data · T=other (ungrouped)
     Each item: `ID` description — _Depends on:_ ID, ID or —
     IDs are stable after assignment — never renumber. Mark removed items as ~~BN~~ (removed).
     New items always take the next unused ID in their group, appended at the end. -->

### Frontend

- [x] `F1` Consult Mantine documentation through Context7 with the request explicitly scoped to
  v9.5.1, then add only the Mantine packages needed by this change. Pin every `@mantine/*`
  dependency to exact version `9.5.1` (no range and no mixed Mantine versions), import the required
  Mantine styles, and mount `MantineProvider` at the TanStack Start document root without breaking
  SSR, prerendering, metadata, scripts, or the site footer — _Depends on:_ —
- [x] `F2` Add a typed shared Mantine theme module that maps the established colors, typography,
  spacing, radius, and content-width conventions to `docs/SPEC.md` §5.3 and the existing CSS
  tokens. Keep one deliberate source of truth for project-specific values, preserve the light-only
  M0 baseline, and remove only global CSS that Mantine demonstrably supersedes — _Depends on:_ `F1`
- [x] `F3` Migrate reusable presentation primitives to appropriate Mantine components: authored
  callouts, prerequisite navigation, code/worked-example framing, progress display, and footer
  layout/links. Preserve semantic roles, accessible names, TanStack Router links, content data,
  progressive disclosure, and the signature EGE task badge; keep the custom SVG and semantic
  table diagram renderers native — _Depends on:_ `F2`, `F7`, `F8`
- [x] `F4` Migrate the practice-answer interaction and page-level composition/layout primitives
  to Mantine where it improves accessibility and consistency. Preserve production-style free-text
  answering, submit/loading/disabled behavior, feedback timing and content, progress persistence,
  legal copy, route behavior, and the current visual direction; do not add new product behavior or
  redesign screens — _Depends on:_ `F2`, `F3`, `F7`, `F8`
- [x] `F5` Update focused Vitest coverage and the existing Playwright Page Object Model journey for
  changed observable behavior. Verify SSR/prerender output, hydration, keyboard-visible controls,
  accessible roles/names, responsive layout, and absence of browser console errors or unintended
  visual regressions using the frontend UI tooling required by `docs/STACK.md` — _Depends on:_
  `F3`, `F4`, `F6`, `F7`, `F8`
- [x] `F6` Establish the clarified frontend architecture contract before migration: remove `ui/`
  segments while retaining meaningful `api/`, `model/`, and `lib/` segments; require one root
  component at each UI slice root, private recursive composition under `components/`, strict
  slice-level `index.ts` public APIs, relative imports inside a slice, CSS Modules for local static
  styles, root `*.types.ts` namespaces, optional prefixed utility/constant objects, and DTO files
  only at transport boundaries. Enforce cross-slice public APIs and allow namespaces only in
  `*.types.ts`; document that an architecture skill was unavailable in this runtime — _Depends on:_ —
- [x] `F7` Apply `F6` across the complete existing frontend: eliminate all `ui/` directories,
  relocate root and private components, split `pages/legal` into `pages/privacy` and `pages/terms`,
  add public APIs, and update imports/tests without changing behavior. Keep capability-oriented
  slice names (`check-answer`, `track-progress`) even when their root component has a more specific
  name — _Depends on:_ `F6`
- [x] `F8` Create the shared policy core on Mantine: `ExternalLink`, `Image`, compound
  `Typography.Text/Title/Prose`, and `PageContainer`, each with its own public API, root type
  namespace, and CSS Module when needed. Enforce raw `<a>`/`<img>` and direct Mantine
  Anchor/Image/Text/Title/Container restrictions outside shared; preserve Router Link and native
  specialized semantic markup. `ExternalLink` is same-tab by default and its explicit `newTab`
  mode supplies safe rel plus a screen-reader hint; `Image` requires `alt` or `decorative`, defaults
  to lazy/async, and accepts caller-provided fallback — _Depends on:_ `F1`, `F2`, `F6`

### Other

- [x] `T1` Update `docs/STACK.md` and `docs/FRONTEND_CONVENTIONS.md` to record Mantine `9.5.1` as
  the approved UI primitive layer, the exact-version rule for all `@mantine/*` packages, provider
  and theme ownership, guidance for native semantic/custom renderers, and the boundary between
  Mantine props/theme values and project CSS tokens. Also record the root/components hierarchy,
  retained non-UI segments, namespace/object/CSS-Module conventions, strict slice public APIs,
  wrapper enforcement, and promotion-on-real-reuse rule — _Depends on:_ `F2`, `F5`, `F6`, `F7`, `F8`

<!-- Test execution is governed by `docs/STACK.md`'s Fast Gate (per task) and Full Gate (per ship).
     Do not duplicate that list here. -->

---

## Files

### Create / modify

~~~
apps/web/package.json
pnpm-lock.yaml
apps/web/src/routes/__root.tsx
apps/web/src/shared/config/mantine-theme.ts           (new)
apps/web/src/shared/styles/tokens.css
apps/web/eslint.config.js
apps/web/src/shared/components/**                     (new policy core)
apps/web/src/entities/**                              (remove ui/, add public APIs/components)
apps/web/src/features/**                              (remove ui/, add public APIs/components)
apps/web/src/widgets/**                               (remove ui/, add public APIs/components)
apps/web/src/pages/**                                 (remove ui/, split legal, add public APIs)
apps/web/src/routes/**/*.tsx                          (public-API import updates only)
apps/web/tests/**/*.test.tsx                           (focused updates/additions)
apps/web/e2e/pages/*.page.ts
apps/web/e2e/*.spec.ts
docs/STACK.md
docs/FRONTEND_CONVENTIONS.md
~~~

### Do NOT touch

- `docs/SPEC.md` — no product, API, data, or visual-design contract changes
- `apps/api/`, `content/`, database schema, migrations, and deployment infrastructure
- `apps/web/src/routeTree.gen.ts` or route behavior beyond public-API import updates and the root
  provider integration in `apps/web/src/routes/__root.tsx`
- Content models, answer-checking contracts, or progress persistence behavior
- `diagram-block.tsx` and `table-diagram-block.tsx` — their custom SVG and semantic table markup is
  intentional
- Additional UI kits or Mantine packages that are not used by the implemented components

---

## Contracts

See `docs/SPEC.md` §5.2–§5.3 and §8, `docs/STACK.md`, and the Files list above. This change preserves
the current product, API, data, accessibility, and visual-design contracts; it replaces suitable
frontend implementation primitives only.

---

## Gate Checks

> Fast Gate runs per task in `/work`; Full Gate and (with `--release`) Release Gate run once in
> `/ship`. Both are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

For each visibly migrated component or page, use the frontend UI tooling required by
`docs/STACK.md` to inspect the rendered result at desktop and narrow viewport widths, capture
screenshot evidence, and confirm that the browser console is clean. The standard frontend build
must continue to complete TanStack Start prerendering successfully.

---

## Architect Review Notes

Use this section after manual product, UX, API, or workflow verification. This is the human-facing
channel for post-implementation fixes.

Add one unchecked checkbox per issue the agent must fix before the change can ship. Keep each item
independently fixable and describe observed behavior plus expected behavior. If the fix may change
SPEC/API/schema/security behavior, say so explicitly in the note.

The agent resolves these items through `/work [XX] review`. Leave an item unchecked while it is
still open. Check it off only after the fix is implemented and re-verified. If manual verification
found nothing, keep the default checked line below.

- [x] No architect review issues recorded

---

## Implementation Notes

<!-- Optional. The agent adds a short bullet here only when something isn't already visible from
     the code or commit history: an intentional deviation from the plan, a residual risk, a
     rejected alternative. Leave empty when nothing needs recording — this is not a mandatory
     per-task log. -->

None

---

## Commit Message

```
feat(change-04): adopt Mantine 9.5.1 UI primitives
```
