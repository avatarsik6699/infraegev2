# CHANGE 92 — Release Gate Drift and LCP Fix

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `92` |
| Slug | `release-gate-drift-and-lcp-fix` |
| Title | Release Gate Drift and LCP Fix |
| Status | `archived` |
| Branch | `feature/92-release-gate-drift-and-lcp-fix` |

---

## Goal

Fix both blockers found by the last `/ship --release` Full Gate run so a release can actually go
out: (1) unit/E2E tests across 4 files still assert the pre-Change-86 font system (`Cormorant SC`/
`Literata`/`IBM Plex Mono`, weight `600`, old `/fonts/alchimia/` paths, 8 preloads) instead of the
current Alegreya/Golos Text/JetBrains Mono system (weight `500` on display, `/fonts/{family}/`
paths, 6 preloads) — Full Gate apparently hasn't run since before Change 86, so this drifted
unnoticed for ~10 changes; (2) the performance budget fails (LCP ~4.0–4.4s vs the 2.8s ceiling,
reproduced twice in isolation) because `/ege/$slug`'s route `loader` was never given the same
code-split treatment `/courses/*` already got in `vite.config.ts`, so its full dependency graph
(lesson practice/checker/learning-content code) leaks into the shared router bundle every page —
including the homepage — has to load before hydrating.

---

## Design References

<!-- none provided -->

---

## Backlog

### Frontend

- [ ] `F1` Update `apps/web/tests/design-system-lab.test.ts`'s `"self-hosts the selected Athanor
  typography roles"` test: font-family checks (`Cormorant SC`→`Alegreya`, `Literata`→`Golos Text`,
  `IBM Plex Mono`→`JetBrains Mono`) and the `fontFiles` existence list, which currently checks 6
  old filenames under `public/fonts/alchimia/` — replace with the 6 actual files under
  `public/fonts/{alegreya,golos-text,jetbrains-mono}/*-{cyrillic,latin}-wght-normal.woff2`
  — _Depends on:_ —
- [ ] `F2` Update `apps/web/tests/brand-control-colors.test.ts`'s two failing tests: the
  `theme.css` family+fallback substring checks (`Alegreya`/`Golos Text`/`JetBrains Mono`, matched
  narrowly on the family+fallback pair only, not the full wrapped stack line since Golos Text's
  fallback chain differs structurally from the old serif Literata stack), the fallback `@font-face`
  names/`size-adjust` values in `fonts.css` (`Alegreya Fallback` 91.9693%, `Golos Text Fallback`
  108.5687%, `JetBrains Mono Fallback` 99.9837%), and the `font-display: swap` count (`8`→`6`)
  — _Depends on:_ —
- [ ] `F3` Update the 4 E2E page objects still asserting the old system:
  `apps/web/e2e/pages/design-system-lab.page.ts` (`Cormorant SC`/`Literata`/`IBM Plex Mono`→
  `Alegreya`/`Golos Text`/`JetBrains Mono`), `apps/web/e2e/pages/python-course.page.ts` (font-family
  + `font-weight: 600`→`500`, matching the `Typography.Title` base), `apps/web/e2e/pages/
  lesson-lab.page.ts` (`expectStableFontContract`: preload count `8`→`6`, font path prefixes
  `/fonts/alchimia/`+`/fonts/literata/`→`/fonts/alegreya/`+`/fonts/golos-text/`+
  `/fonts/jetbrains-mono/`, body/heading family, the `document.fonts.check(...)` probe string
  weight+family), `apps/web/e2e/pages/lesson-page.assertions.ts:77` (`IBM Plex Mono`→`Golos Text`,
  matching `lesson-section-heading.module.css`'s intentional `[data-variant="lesson"]` → `--font-ui`
  override from Change 80) — _Depends on:_ —
- [ ] `F4` In `apps/web/vite.config.ts`, extend `codeSplittingOptions.splitBehavior` so
  `routeId.startsWith("/ege")` gets the same `[["loader", "component"], ["errorComponent"],
  ["notFoundComponent"]]` grouping already applied to `/courses` — `src/routes/ege.$slug.tsx`'s
  `loader` (`getTopicLessonRouteData`) has never been split, unlike `/courses/$courseSlug/
  $lessonSlug`'s equivalent, so `TopicLessonPage`'s full dependency graph stays in the shared route
  chunk loaded by every route — _Depends on:_ —
- [x] `F5` Verify with `pnpm --filter web build` + `pnpm audit:performance` (isolated, no
  concurrent Full Gate load) that both `/` and `/ege/16-rekursiya` pass the 2.8s LCP budget, and
  confirm via the build's network-request list (or a Playwright MCP check) that the homepage no
  longer pulls in lesson-practice/learning-content/confirmation-dialog/course chunks it doesn't use
  — _Depends on:_ `F4`
  **Partially verified, budget still failing** — confirmed via build network-request list that
  F4's split fix works structurally (`ege._slug-*.js` is now its own chunk;
  `createServerFn`/`load-client` shared-chunk weight dropped sharply). Measured LCP twice
  (isolated, no concurrent load): `/` improved from ~4092ms → ~3558ms (~13%, real and reproducible)
  but is still ~758ms over the 2800ms budget; `/ege/16-rekursiya` is unchanged at ~4370ms. Root
  cause for both (confirmed via the Lighthouse trace's LCP-element breakdown): the LCP element on
  every run is the post-hydration analytics-consent banner text
  (`AnalyticsConsentPrompt`/`analytics-consent-prompt.tsx`), whose "Render Delay" phase is ~90% of
  total LCP (~3.9s) — i.e. the bottleneck is CPU-bound hydration time under Lighthouse's simulated
  mobile throttling, not bundle leakage (already fixed) or network bytes (total payload ~488KB,
  bootup-time only ~300ms in the trace). Closing the remaining gap would need a larger, dedicated
  performance investigation (e.g. deferring non-critical hydration, reducing hydration-critical
  component weight) — out of safe scope for this change.
  **Architect decision**: ship with the residual gap explicitly accepted rather than block release
  on it; closing it to the strict 2.8s budget is deferred to a dedicated future change.
- [x] `F6` (architect finding, surfaced by actually running the full E2E suite for the first time
  since before Change 86 — investigation found `/lab/lesson`'s h1 font-family mismatch traced to
  `Typography.Title`, but architect redirected: `/lab/lesson` is legacy and should be removed
  outright instead of chasing/patching its stale contract) Delete `/lab/lesson` entirely: route
  (`apps/web/src/routes/lab.lesson.tsx`), page (`apps/web/src/pages/lesson-design-lab/**`), its E2E
  page object (`apps/web/e2e/pages/lesson-lab.page.ts`), the `lessonLabPage`/
  `noJavaScriptLessonLabPage` fixtures and the one smoke test that used them, its accessibility
  audit entry, and its `docs/FRONTEND.md`/`docs/SPEC.md` mentions (kept `/lab/design-system`,
  which is unaffected and stays) — _Depends on:_ —
- [x] `F7` (architect finding, same discovery) `expectDesktopLessonRail`'s `progressBottomGap`
  assertion (`apps/web/e2e/pages/lesson-page.assertions.ts:154`, `toBeCloseTo(32, 0)`) is stale
  from before Change 89: it assumed `.resultProgress`'s old unconditional `margin-top: auto`
  always pinned the block to the sticky rail's exact bottom inset. Change 89's capped
  `.railSpacer` (`max-height: var(--space-6)`, 64px) deliberately breaks that exact bottom-anchor
  for lessons whose content doesn't fill the viewport — confirmed via Playwright MCP at the 1440×
  1024 desktop viewport: `.railSpacer` measures ~64px (capped, as designed) on every lesson in this
  checkout, but `progressBottomGap` varies with content length (256px on `/ege/16-rekursiya`,
  420px on `/courses/python/pervaya-programma`, 373px on the longest available course lesson
  `/courses/python/oshibki`) because none of them are tall enough to fill the viewport and force
  true bottom-anchoring — _Depends on:_ —
  **Implemented**: rewrote the assertion to check the actual mechanism (the spacer stays
  `<= 64.5px`) instead of the emergent, content-length-dependent `progressBottomGap` value; kept a
  floor check (`>= 16`) so the block can never touch the viewport edge.

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify
~~~
apps/web/tests/design-system-lab.test.ts
apps/web/tests/brand-control-colors.test.ts
apps/web/e2e/pages/design-system-lab.page.ts
apps/web/e2e/pages/python-course.page.ts
apps/web/e2e/pages/lesson-page.assertions.ts
apps/web/e2e/fixtures.ts
apps/web/e2e/accessibility.spec.ts
apps/web/e2e/smoke.spec.ts
apps/web/vite.config.ts
apps/web/src/routeTree.gen.ts
docs/FRONTEND.md
docs/SPEC.md
~~~

### Delete
~~~
apps/web/src/routes/lab.lesson.tsx
apps/web/e2e/pages/lesson-lab.page.ts
~~~

### Do NOT touch
- Any actual component/theme/token CSS — the font system itself is already correct; only the
  stale tests and the route code-splitting config change
- `docs/BRAND_ASSET_REQUIREMENTS.md` — its Cormorant SC mention is historical ("Change 86
  replaced...") and already correct
- `apps/web/src/pages/lesson-design-lab/**` — the `/lab/lesson` route was removed, but this
  component is still needed as a render fixture by `apps/web/tests/lesson-design-system.test.tsx`
- Changes 90/91's own diffs (rail spacer, Accordion hit area, Mistake padding, LessonOutline
  density) — unrelated to this change

---

## Contracts

See `docs/FRONTEND.md` §6/§6.1 (typography roles), `docs/STACK.md` (Full/Release Gate tables), and
the Files list above.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](./STACK.md) — this section only records
> change-specific overrides.

This change exists specifically to make Full Gate pass, so `/work` should verify with the actual
frontend unit + E2E suites (not just the compact Critical Gate) before considering F1–F3 done, and
F5 requires the isolated performance-budget run.

**Explicit override**: the Full Gate performance-budget row (`pnpm audit:performance`) still fails
on `/` and `/ege/16-rekursiya` after F4's real, measured improvement (see F5's note) — closing the
remaining gap needs a dedicated follow-up (`T1`). The architect explicitly accepted this residual
gap and directed `/ship --release` to proceed despite it; every other Full Gate row is green
(format, infra bring-up, ops-contracts, backend pytest, api:check, frontend build/prerender,
frontend unit tests, E2E lint, E2E journeys, smoke, security audit, accessibility audit, content
validation).

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- F5's LCP budget on `/` and `/ege/16-rekursiya` still fails after F4's fix (real, measured
  improvement on `/`: ~4092ms → ~3558ms; `/ege/16-rekursiya` unchanged at ~4370ms). Root cause is
  CPU-bound hydration render-delay (the post-hydration analytics-consent banner is the measured LCP
  element, ~90% of LCP is its render delay), not bundle leakage or network bytes. The architect
  explicitly accepted this residual gap and directed release to proceed; closing it needs a
  dedicated future change (deferring non-critical hydration work, reducing hydration-critical
  component weight) — not opened as a Backlog item here since it's out of this change's scope.
- Deleting `/lab/lesson` (architect direction, legacy page) initially also deleted
  `apps/web/src/pages/lesson-design-lab/**`, which broke `tests/lesson-design-system.test.tsx` (a
  672-line unit suite using `LessonDesignLab` as a render fixture for shared learning-content
  contracts, unrelated to the route). Restored the component directory; only the route and its
  E2E/route-level surface were removed.

---

## Commit Message

```
fix(change-92): update stale font-system tests and split /ege loader to fix Full Gate
```
