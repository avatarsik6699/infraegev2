# CHANGE 57 — Python Course Publication and Navigation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `57` |
| Slug | `python-course-publication-navigation` |
| Title | Python Course Publication and Navigation |
| Status | `archived` |
| Branch | `feature/57-python-course-publication-navigation` |

---

## Goal

Publish the architect-approved «Python с нуля для ЕГЭ» course and its first CourseLesson, then make
the course discoverable through the registry-driven home page and sitemap. Shared public chrome
keeps only release identity and a home link; material discovery remains in the stable home-page
sections instead of being duplicated in the header.

---

## Backlog

### Backend

None

### Frontend

- [x] `F1` Transition the Python Course and its first CourseLesson from `review` to `published` as
  one publication unit, preserving `early_access`, free access and the existing independent-course
  contract — _Depends on:_ T1
- [x] `F2` Extend the shared PublicHeader with SSR/no-JS collection navigation for «Мини-курсы»
  and «Темы ЕГЭ»; keep identity/version visible and let navigation wrap to its own row on narrow
  screens without adding a menu or client state — _Depends on:_ T1
- [x] `F3` Give the registry-driven home sections stable navigation anchors, align the topic label
  with «Темы ЕГЭ», and verify that the newly published course appears through existing registry
  data rather than page-local course wiring — _Depends on:_ F1, F2
- [x] `F4` Update focused Vitest and fixture/Page-Object Playwright coverage for public home
  discovery, header navigation, indexable course metadata, sitemap/prerender inclusion, keyboard,
  150% zoom, 390px mobile, no-JavaScript and clean console behavior — _Depends on:_ F1, F2, F3
- [x] `F5` Fix the published CourseLesson production prerender by removing the nested server-function
  call from its loader path and deleting the now-unused wrapper — _Depends on:_ F1
- [x] `F6` Replace the oversized course-intro progress section with a compact progress row above
  the curriculum, preserving the current action, truthful available-lesson count, local state,
  SSR/no-JavaScript behavior and responsive accessibility — _Depends on:_ F1
- [x] `F7` Remove the outer top and bottom rules from the course curriculum while preserving the
  separators between modules — _Depends on:_ F6
- [x] `F8` Unify public page chrome so the shared header and footer rules remain visible on the
  home page and other public consumers instead of exposing a borderless `seamless` variant —
  _Depends on:_ F2
- [x] `F9` Remove the redundant «Начать курс» action from the compact course progress indicator
  and delete its now-unused presentation and layout code; the published lesson row remains the
  course entry point — _Depends on:_ F6
- [x] `F10` Remove the low-value «Мини-курсы» and «Темы ЕГЭ» links from PublicHeader and return
  shared chrome to identity/version only; keep registry-driven home sections as the discovery
  surface and preserve the brand's home link off the root route — _Depends on:_ F3
- [x] `F11` Synchronize the active change Goal and commit description with F10's final navigation
  decision before archival — _Depends on:_ F10

### Infra

None

### Data

None

### Other

- [x] `T1` Record the approved collection-oriented public-header navigation and responsive/no-JS
  behavior in the binding frontend contract — _Depends on:_ —

---

## Files

### Create / modify

~~~
docs/FRONTEND.md
docs/changes/57-python-course-publication-navigation.md
apps/web/src/entities/course/content/course-publication.mjs
apps/web/src/entities/practice-task/api/get-practice-tasks-route-data.ts
apps/web/src/entities/practice-task/index.ts
apps/web/src/widgets/public-header/public-header.tsx
apps/web/src/widgets/public-header/public-header.module.css
apps/web/src/widgets/public-footer/public-footer.tsx
apps/web/src/widgets/public-footer/public-footer.module.css
apps/web/src/pages/foundation/foundation-page.tsx
apps/web/src/pages/foundation/foundation-page.module.css
apps/web/src/pages/course-lesson/api/get-course-lesson-route-data.ts
apps/web/src/pages/course-overview/course-overview-page.tsx
apps/web/src/pages/course-overview/course-overview-page.module.css
apps/web/src/pages/course-overview/components/course-overview-intro.tsx
apps/web/src/pages/course-overview/components/course-overview-progress.tsx
apps/web/src/pages/course-overview/components/course-overview-progress.model.ts
apps/web/tests/course-foundation.test.ts
apps/web/tests/public-release.test.ts
apps/web/e2e/pages/foundation.page.ts
apps/web/e2e/pages/public-discovery.page.ts
apps/web/e2e/pages/public-header.assertions.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/smoke.spec.ts
~~~

### Do NOT touch

- Python CourseLesson theory wording, practice task wording/answers or curriculum module content
- Topic/CourseLesson relationship model, Topic lesson content or Topic publication statuses
- Progress persistence, checker behavior, analytics consent or product-event semantics
- Backend/API contracts, database, infrastructure or production deployment configuration
- A dedicated all-courses route, search, hamburger menu or client-side navigation state

---

## Contracts

See `docs/SPEC.md` §3–§5 and §8 (plus the Files list above). Do not hand-copy the schema, route,
SEO or publication contracts into this file; the codebase and `SPEC.md` are the source of truth.

---

## Gate Checks

In addition to the affected frontend Critical Gate, run the focused public discovery and Python
course Playwright journeys, `node scripts/validate-content-links.mjs`, and
`scripts/run-host-web-gate.sh pnpm --filter web build` so the registry-driven prerender crawl proves
both published routes. Browser evidence must cover desktop, 150% zoom, 390px mobile, keyboard,
no-JavaScript and a clean console. The change is local until a later explicit `/ship --release`.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- A nested `createServerFn` call worked in the development journey but failed production SSR with
  `Server function info not found`; the CourseLesson loader now reads the same public task
  projection directly, matching the proven Topic lesson loader path.

---

## Commit Message

```
feat(change-57): publish Python course and improve discovery
```
