# CHANGE 99 — EGE Topic Catalog

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `99` |
| Slug | `ege-topic-catalog` |
| Title | EGE Topic Catalog |
| Status | `active` |
| Branch | `feature/99-ege-topic-catalog` |

---

## Goal

Publish `/ege` as the truthful SSR/no-JavaScript catalog for all 27 EGE informatics task numbers.
The page presents 25 learning topics, treats tasks 19–21 as one strategy topic, links only the two
published TopicLessons, and makes the home navigation destination real. See `docs/SPEC.md` §2.2,
§5.1–§5.2 and §9.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Introduce lightweight catalog metadata and migrate TopicLesson exam-number metadata to a non-empty ordered number list, with invariant and formatter tests — _Depends on:_ —
- [x] `F2` Build the accessible responsive `/ege` catalog page and route with publication-aware cards and FIPI 2027 source context — _Depends on:_ F1
- [x] `F3` Activate the home «Темы» navigation link and add `/ege` to public discovery metadata — _Depends on:_ F2
- [x] `F4` Add focused component and Playwright Page Object coverage for SSR/no-JS, navigation, availability, responsive layout and overflow — _Depends on:_ F2, F3
- [x] `F5` Replace the legacy catalog composition with a branded infraege public shell, a first-viewport «Доступно сейчас» path and a quieter complete 1–27 exam map while preserving semantic order and truthful availability — _Depends on:_ F1, F2
- [x] `F6` Decouple expanded public navigation from the home-only header mode so `/ege` retains the current infraege identity, navigation and active-section state without changing compact lesson/legal headers — _Depends on:_ F5
- [x] `F7` Isolate catalog metadata behind a lightweight `topic-catalog` entity so the `/ege` client route no longer imports authored TopicLesson TSX, and verify the production bundle boundary — _Depends on:_ F1
- [x] `F8` Harden catalog copy, 44 px primary touch targets, `/ege` accessibility coverage and normalized route assertions, retaining SSR/no-JS, zoom, contrast and overflow behavior — _Depends on:_ F5, F6, F7
- [x] `F9` Complete one bounded Impeccable finish pass across desktop, intermediate, zoomed and mobile views; resolve detector and independent finish-review findings without diluting the approved homepage visual language — _Depends on:_ F5, F6, F7, F8
- [x] `F10` Remove the separate hero and «Доступно сейчас» section so the complete topic catalog becomes the first content surface, with a compact human introduction and layout space reserved for future catalog controls without rendering fake controls — _Depends on:_ F5
- [x] `F11` Extend the engineering grid and exam notation into one seamless page-wide background that shares the header/main canvas, fades before both chrome edges and adds restrained activity-aware motion without carrying information — _Depends on:_ F10
- [x] `F12` Recompose topic cards as substantial paper surfaces with gradient edge light, depth and bounded motion; integrate the two supplied transparent illustrations only into their matching published cards and retain truthful planned states — _Depends on:_ F10, F11
- [x] `F13` Reconcile responsive, SSR/no-JavaScript, image-loading, contrast and interaction coverage with the revised composition, then complete one bounded Impeccable finish pass — _Depends on:_ F10, F11, F12
- [x] `F14` Recompose published cards around a reference-led illustration stage whose artwork dominates the upper surface and visibly crosses the inner frame while remaining clipped safely by the outer card — _Depends on:_ F12
- [x] `F15` Replace planned-state copy with a shared «Скоро» badge and reduce unavailable-card prominence without suggesting an interactive disabled control; remove redundant published-state copy — _Depends on:_ F12
- [x] `F16` Distill the catalog heading to its title plus the useful topic count and apply the current drawn external-link treatment to the FIPI source — _Depends on:_ F10
- [x] `F17` Reconcile desktop/mobile/zoom, contrast, SSR/no-JavaScript and screenshot coverage for the revised card anatomy and heading — _Depends on:_ F14, F15, F16
- [x] `F18` Restore the lower-right decorative exam number on both published cards so numbering remains consistent across the complete map — _Depends on:_ F14
- [x] `F19` Recompose each published card into a bounded illustrated section carrying its exam-number context plus a separate action footer, following the supplied card reference without losing readable topic copy — _Depends on:_ F14, F18
- [x] `F20` Place the topic count and drawn FIPI source on one compact line beneath the catalog title with an orange middle-dot separator, leaving the heading's right column empty for future real controls — _Depends on:_ F16
- [x] `F21` Reconcile desktop/mobile/zoom, SSR/no-JavaScript, contrast and screenshot coverage for the sectioned published cards and revised heading geometry — _Depends on:_ F18, F19, F20
- [x] `F22` Let published artwork escape the card's upper and outer edge by one controlled gutter while retaining the bounded media-section anatomy, readable copy and non-overlap with adjacent card content — _Depends on:_ F19, F21
- [x] `F23` Separate the published-card frame from its decorative artwork so only the illustration crosses the top/right edge by a restrained amount, while every radius, footer surface and lower-right exam number remains clipped inside one coherent card boundary — _Depends on:_ F22
- [x] `F24` Audit the complete `/ege` implementation against product, frontend architecture, accessibility, SSR/no-JavaScript, responsive and repository contracts; fix confirmed in-scope findings and record verification evidence — _Depends on:_ F23
- [x] `F25` Restore fully opaque planned-card surfaces and communicate unavailability through the «Скоро» badge, absent action, neutral frame, quieter type and reduced depth rather than transparency that exposes the page pattern — _Depends on:_ F15, F24

### Infra

None

### Data

- [x] `D1` Author the 25-entry EGE 2027 topic catalog from the approved artifact and official FIPI project specification, with 19–21 as the only merged topic — _Depends on:_ F1

### Other

- [x] `T1` Reconcile `PRODUCT.md`, `docs/FRONTEND.md` and Change 99 with `/ege` as the second migrated consumer of the public infraege visual world and record any intentional catalog-specific limits — _Depends on:_ F5, F6

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/FRONTEND.md
PRODUCT.md
apps/web/src/entities/lesson/
apps/web/src/entities/topic-catalog/
apps/web/src/app/styles/tokens.css
apps/web/src/pages/topic-catalog/
apps/web/public/topics/
apps/web/src/routes/ege.index.tsx
apps/web/src/routes/sitemap[.]xml.ts
apps/web/src/widgets/public-header/
apps/web/src/shared/config/lesson-publication.{mjs,d.mts}
apps/web/src/routeTree.gen.ts
apps/web/tests/
apps/web/e2e/
~~~

### Do NOT touch

- `docs/artifacts/lessons_list.md` (read-only architect artifact)
- `docs/artifacts/references/illustration-*.png` (read-only architect assets; derive public copies)
- `docs/artifacts/references/cards_refs.png` (read-only architect composition reference)
- `apps/api/`, `content/tasks/`, `apps/web/src/entities/course/`
- Existing TopicLesson theory, practice, progress and checker behavior

---

## Contracts

See `docs/SPEC.md` §2.2 and §5–§9 and the Files list above. Do not hand-copy the schema, endpoints,
types, or env vars into this file — the codebase and `SPEC.md` are the source of truth; this file
only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](../STACK.md) — this section only records
> change-specific overrides.

```bash
pnpm --filter web exec playwright test e2e/topic-catalog.spec.ts
# expected: home discovery, published/planned cards, SSR/no-JS and target viewports pass
```

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The focused catalog E2E owns the new sitemap assertion because the broader privacy/crawl smoke
  scenario still contains a pre-existing ALCHIMIA title expectation outside this change's scope.
- Publication metadata moved to shared configuration so authored lessons and the lightweight
  `topic-catalog` entity consume one registry without a same-layer dependency. The production
  `/ege` client chunk imports `topic-catalog`, not the 74 kB authored `lesson` chunk.
- The supplied transparent PNG illustrations remain read-only source artifacts. Public cards use
  derived WebP copies (about 144 kB combined instead of about 1.1 MB), fixed intrinsic dimensions
  and lazy loading; their motion and the ambient route animation pause while the page is inactive.
- The catalog heading includes only current, useful exam metadata. Its layout can accept future
  filters or view controls, but no inert placeholder controls are rendered before those features
  exist.
- Published artwork is aligned to an upper media section with exam context and topic copy. It is
  the only layer allowed to cross the outer top/right edge, and only by a restrained few pixels;
  one clipped surface keeps all four radii, the separate footer and the lower-right 05/16 index
  inside the card. Planned entries keep a fully opaque paper surface; their neutral frame, quieter
  type, reduced depth and absent action support the shared «Скоро» badge without exposing the
  ambient page pattern through the card.
- The final architecture audit found no dead code, cycles, boundary violations or complexity
  findings. Fallow's changed-code warning about duplicated Course/Topic learning types remains an
  intentional domain separation required by the product contract; its low-confidence
  `card-sheen` warning is a CSS-parser false positive because the animation is referenced in the
  same module. Browser geometry now asserts matching frame radii, clipped surfaces, contained
  indices, a 10px maximum artwork overlap and fully opaque planned cards.

---

## Commit Message

```
feat(change-99): add the EGE topic catalog
```
