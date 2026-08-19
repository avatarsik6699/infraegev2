# CHANGE 24 — First Lesson Publication Readiness

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `24` |
| Slug | `first-lesson-publication-readiness` |
| Title | First Lesson Publication Readiness |
| Status | `active` |
| Branch | `feature/24-first-lesson-publication-readiness` |

---

## Goal

Publish the architect-approved recursion lesson as the first discoverable product material and
prove that its initial load is stable, fast, accessible and correct in production-like SSR/no-JS
conditions. Add only the minimum public entry, privacy and crawl surfaces needed for a coherent
launch; audit and repair verified Kontur/local-contract, Core Web Vitals, SEO and implementation
issues without expanding analytics, observability or the lesson's approved teaching content.

---

## Backlog

### Backend

None.

### Frontend

- [x] `F1` Make the recursion lesson `published` through the single publication registry and keep route metadata, runtime lookup, prerender and content validation derived from that source without changing task checker contracts — _Depends on:_ D1
- [x] `F2` Replace the technical root placeholder with a minimal SSR/no-JS public entry that describes only current product truth and links to published lessons; add a restrained shared public footer/link path to privacy without exposing lab or review routes — _Depends on:_ F1
- [x] `F3` Add `/privacy` with an accurate description of current pageviews, privacy-safe client-error telemetry, technical logs and browser-only lesson progress; explicitly disclose the architect-accepted omission of operator requisites/contact without inventing facts or expanding collection — _Depends on:_ T1
- [x] `F4` Add absolute canonical, unique title/description and appropriate social metadata for public HTML routes plus dynamic `/robots.txt` and `/sitemap.xml` sourced from the publication registry; exclude lab, review, error and unknown routes — _Depends on:_ F1, F2, F3
- [x] `F5` Diagnose cold-load layout shifts and font flashes with browser performance evidence, then make the smallest font/preload/fallback/hydration changes that remove visible instability while preserving the approved typography and SSR readability — _Depends on:_ —
- [x] `F6` Audit the public home, lesson and privacy surfaces against `docs/FRONTEND.md`, the adopted Kontur accessibility/adaptivity/typography/spacing guidance and the incumbent visual system; repair verified release-blocking accessibility, responsive, zoom, keyboard, semantics and visual-coherence findings only — _Depends on:_ F2, F3, F5
- [x] `F7` Extend focused route/head/unit and fixture-owned Page Object E2E coverage for published discovery, canonical/robots/sitemap, direct/reload navigation, desktop/mobile/150%-zoom, clean console, no-JS content and absence of horizontal overflow or hydration shifts — _Depends on:_ F4, F6
- [x] `F8` Restore a non-empty document-level fallback title so 404/error documents retain an accessible title without overriding unique public-route metadata; keep clean-console assertions scoped before intentional 404 navigation — _Depends on:_ F4, F7
- [x] `F9` Refine the public home into a responsive two-part composition with a large left-aligned product statement and a clearer published-topic list on the right; replace the mechanical subtitle with concise truthful copy about free theory and practice, and remove decorative separators in favor of spacing and hierarchy — _Depends on:_ F2
- [x] `F10` Replace the lesson's «ЕГЭ по информатике» context label with a shared accessible back-navigation action using the project icon system; return to the previous same-site page when safe and fall back to `/` for direct, external-origin and unavailable-history entry without weakening SSR/no-JS navigation — _Depends on:_ F1
- [x] `F11` Extend focused unit and fixture-owned Page Object coverage for the revised home composition and back-navigation boundary cases; verify desktop, mobile, keyboard, direct-entry fallback, browser history behavior, no-JS link semantics, clean console and horizontal overflow — _Depends on:_ F9, F10
- [x] `F12` Strengthen the public-home type hierarchy by enlarging the main statement and reducing its supporting line across responsive sizes; simplify the topic list to a flat, background-free treatment while preserving an obvious full-row link, focus visibility and readable metadata — _Depends on:_ F9
- [x] `F13` Extend the shared public header with a restrained `beta` label beside the `infraege` wordmark and the current application version at the top right; use the same header on home, privacy and the published lesson without changing the frozen lab header — _Depends on:_ F2, F10
- [x] `F14` Add focused config/header and fixture-owned Page Object assertions for the release label/version plus the revised home typography/list treatment; re-verify desktop/mobile/no-JS, clean console and horizontal overflow — _Depends on:_ F12, F13
- [x] `F15` Distill solved practice-task feedback to the existing success check in its tab and a restrained green answer-field state; remove the redundant solved badge, completed submit control, «Перейти к результату» and «Следующая задача» actions while preserving useful correctness feedback, tab navigation, accessibility and SSR/no-JS practice content — _Depends on:_ F7
- [x] `F16` Complete the solved-task state: keep the «Проверить» button visible but disabled, use a clearly green answer-field background as well as border, and persist each accepted submitted answer with browser progress so reload restores the value without exposing checker answers or breaking existing progress envelopes — _Depends on:_ F15

### Infra

None.

### Data

- [x] `D1` Record the architect's manual approval in the recursion quality record, including the explicit publication decision and accepted temporary legal-requisites risk, without changing lesson wording or answers — _Depends on:_ —

### Other

- [x] `T1` Synchronize SPEC/FRONTEND publication, SEO, font-stability and accepted legal-risk rules; preserve the deferral of Umami events, observability and `apps/ops` until M4 — _Depends on:_ —
- [x] `T2` Extend performance evidence to both `/` and `/ege/16-rekursiya`; capture before/after cold-load findings and require LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms, Lighthouse accessibility/SEO without errors and production build/prerender success — _Depends on:_ F4, F5
- [x] `T3` Run required Context7 lookups for touched TanStack Start/Vite/Base UI APIs, TypeScript LSP, Impeccable detector, browser screenshots/console/performance inspection, content validation, affected Critical Gate and the change-specific production build/public-route smoke checks — _Depends on:_ F7, T2

---

## Files

### Create / modify

~~~
docs/SPEC.md
docs/FRONTEND.md
docs/artifacts/lessons/16-rekursiya.quality.md
docs/changes/24-first-lesson-publication-readiness.md
apps/web/src/app/**
apps/web/src/entities/lesson/content/lesson-publication.{mjs,d.mts}
apps/web/src/pages/foundation/**
apps/web/src/pages/privacy/**
apps/web/src/pages/topic-lesson/**
apps/web/src/features/lesson-practice/**
apps/web/src/features/lesson-progress/**
apps/web/src/shared/components/back-link/**
apps/web/src/shared/config/site.ts
apps/web/src/shared/lib/back-navigation/**
apps/web/src/routes/__root.tsx
apps/web/src/routes/index.tsx
apps/web/src/routes/ege.$slug.tsx
apps/web/src/routes/privacy.tsx
apps/web/src/routes/robots[.]txt.tsx
apps/web/src/routes/sitemap[.]xml.tsx
apps/web/tests/**
apps/web/e2e/**
apps/web/vite.config.ts
lighthouserc.cjs
scripts/validate-content-links.mjs
~~~

### Do NOT touch

- Lesson theory wording/order, task statements/answers and checker/OpenAPI contracts
- New Umami events, analytics schemas, observability, `apps/ops` or external operations tooling
- Production credentials, operator requisites/contact values, RKN workflow or infrastructure topology
- New EGE topics, Python mini-course, accounts, payments or unrelated redesign work

---

## Contracts

See `docs/SPEC.md` §2.3–§8 and the Files list above. Do not hand-copy schema, endpoint or type
details into this file.

---

## Gate Checks

In addition to the affected Critical Gate, run the production build/prerender, content-link
validation, route-level HTTP checks for `/`, `/ege/16-rekursiya`, `/privacy`, `/robots.txt` and
`/sitemap.xml`, and the focused public-release browser journey with cold cache. Lighthouse must
measure both public HTML routes against `T2`; automated green does not replace final architect
review before `/ship --release`.

---

## Architect Review Notes

- [x] Remove the public-home E2E assertion that requires the heading font size to exceed the subtitle by more than `3x`; the architect approved the current `40px` / `16px` hierarchy and considers that ratio check overly restrictive.

---

## Implementation Notes

- Architect explicitly accepted temporary publication without operator name/requisites, address or public contact; the privacy page must expose this omission honestly and a later change must close it.
- Cold-load experiments with optional-display webfonts, preloads, CSS splitting and CSS inlining did not meet the lesson LCP budget consistently. The release therefore uses metric-normalized local system faces and makes no font requests: the measured direct production server improved from roughly 2.56/3.16 s LCP on home/lesson to 1.81/2.41 s medians, with CLS 0 on both routes.
- Public discovery, prerender and sitemap inclusion intentionally share the publication registry so a lesson cannot become crawlable through only one of those surfaces.
- Progress keeps its version-1 envelope backward-compatible by treating `acceptedAnswers` as an additive optional stored field and normalizing it to an empty map at runtime. Existing solved marks survive the update, but answers submitted before this field existed cannot be reconstructed; those fields use an explicit legacy placeholder instead.

---

## Commit Message

```text
feat(change-24): publish first lesson with stable public discovery
```
