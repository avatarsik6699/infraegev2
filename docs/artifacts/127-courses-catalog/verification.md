# Change 127 verification

Local feature-branch acceptance, 2026-09-20. No commit, merge, push or deployment.

## Automated evidence

- `pnpm format:check`: PASS.
- `pnpm --filter web lint`: PASS, including E2E, design-system, platform and layer policies.
- `pnpm --filter web typecheck`: PASS.
- `pnpm --filter web exec vitest run tests/course-catalog.test.tsx tests/practice-revision-progress.test.ts`: 16 PASS. Covers SSR neutral state, zero/partial/full mastered lessons, stale revisions, missing/partial summaries, truthful planned cards, overview navigation and count grammar.
- `API_INTERNAL_URL=http://localhost:8080 pnpm --filter web build`: PASS, including prerender.
- `API_INTERNAL_URL=http://localhost:8080 pnpm --filter web exec playwright test --config playwright.layout.config.ts e2e/course-catalog.spec.ts`: 11 PASS on production output. Local development API supplies the existing lesson summaries; no data writes.
- Browser scenarios: overview navigation, no-JS, keyboard/reduced motion, 200% text, exact widths 1305/820/390/360, delayed hydration and delayed/failed images/fonts. Header/card bounding boxes remain exactly equal through delivery; no horizontal overflow or application page errors.
- TypeScript LSP: all nine catalog source files and the unit-test file clean. E2E LSP retains the documented isolated Playwright package-resolution issue (missing `expect`/`Page` exports); executable browser tests and typed ESLint pass. Workspace refresh did not repair that adapter issue.
- Impeccable mechanical detector: no findings. Independent finish review: PASS, no material findings.

## Interactive evidence

Playwriter session 5 used the ordinary Windows Chrome extension. The local production preview
ran on port 3210 against the existing local API. A separate preview on port 3211 pointed to an
unreachable loopback API to confirm the real server-summary failure path: published content,
all four cards, fixed lesson totals and the overview link remain; both personal counters report
unavailability instead of zero.

- [Desktop](desktop.png), [mobile top](mobile.png), [mobile bottom](mobile-bottom.png), [unavailable summary](unavailable.png).
- The user's Chrome zoom affects effective CSS viewport size; screenshots use viewport-only captures to avoid a fullPage capture crop. Automated tests above use exact CSS widths.
- Browser console error `p is not a function` was traced live with CDP exception stacks to `chrome-extension://gcjikeldobhnaglcoaejmdlmbienoocg/content.js`, not application code. Isolated browser tests reported no page errors. Production test server occasionally logged an aborted request as a test closed its browser after navigation; all navigation assertions passed.
- Four alpha PNG masters and their exact prompts are retained in [illustrations](illustrations.md); the four 640px lossless WebP assets total approximately 136 KiB. No runtime generation dependency.

Full/Release Gate, backend tests, API regeneration and deployment were not run: no backend/API/data changes or release request. `make clean-dry-run` was reviewed, then `make clean` and `make clean-check` passed; authored references, masters and screenshots remain.


## Architect refinements F5–F7

Current visual evidence: [desktop hover](revision-desktop-hover.png), [mobile](revision-mobile.png),
[mobile lower cards](revision-mobile-bottom.png). These supersede the initial screenshots above.

- Light shared progress track retained; card hover/focus uses a distinct darker neutral mix.
- Overview link now uses the shared primary filled-button style. The shared primary hover rule
  explicitly retains its white foreground so generic link-hover styles cannot obscure its label.
- Illustration boxes increased from 10rem desktop/9rem mobile to 13rem (bounded on narrow screens).
  All four raster variants have additional subject-specific detail; [edit prompts](illustrations-v2.md)
  and versioned alpha PNG masters are retained. Only the four referenced v2 WebP files are served,
  approximately 164 KiB total. Superseded initial web-delivery assets removed.
- Format, typed lint/architecture policies, TypeScript and source LSP: PASS.
- Focused catalog unit tests: 12 PASS. Production catalog browser suite: 11 PASS, including
  settled primary hover foreground/background, distinct track, larger image geometry, no-JS,
  delayed/failed assets and hydration at four widths, reduced motion and 200% text.
- Playwriter desktop/mobile visual pass and independent follow-up review: PASS, no material findings.
  The previously traced unrelated Chrome extension error persists; isolated tests remain clean.
- Allowlisted cleanup completed after evidence capture. No commit, merge or deployment.

## F8–F9 compact composition and motion-only feedback

- Removed the card outline in favor of a static semantic shadow; white card and primary CTA colors stay constant on hover/focus. Shared ActionLink has opt-in lift feedback, with all transforms disabled for reduced motion.
- Metadata follows the description; Python exposes its grounded beginner level and outcome (publication audience, writing programs and files lessons). Planned directions retain their honest status without invented levels.
- Kept the 13rem detailed illustrations; tightened card padding, row spacing and footer. Progress reserves the wrapped unavailable label invisibly, so compact layout remains safe with 200% text.
- Format, web lint/architecture policy, typecheck, 12 focused unit tests and a fresh production build: PASS. Production catalog E2E: 11 PASS, including stable delayed/failed delivery, no-JS, unchanged hover colors, reduced motion and 390px/200% progress text clearance.
- TypeScript LSP: changed catalog/card/progress/shared ActionLink source and unit tests clean. Previously documented E2E adapter limitation remains; typed lint and executable tests pass.
- Independent finish review: PASS after resolving the wrapped progress-row finding.
- Playwriter production preview: [desktop](compact-desktop.png), [hover](compact-desktop-hover.png), [mobile](compact-mobile.png).
- Final allowlisted cleanup: dry-run reviewed; `make clean` and `make clean-check` PASS. No commit, merge or deployment.

## F10 equal cards and quiet border

- Restored a 1px border blended from 40% rule and 60% surface (approximately #eee), retaining the static shadow. Grid auto-rows equalize all four cards across desktop and mobile without fixed heights or clipping.
- Shared primary CTA feedback is now `scale`: scale 1.02 with no button translation, constant primary background/foreground and the existing arrow movement. Reduced motion disables transforms.
- Format, lint, typecheck, production build and 11 production catalog E2E scenarios: PASS. Added equal-card geometry checks to normal/no-JS, delayed/failed assets and enlarged-text cases; CTA transform and constant-color assertions pass.
- Source LSP clean; E2E LSP still exhibits the previously documented Playwright declaration-resolution issue. Typed lint and executable browser checks pass. No API changes or Full Gate required.
- Playwriter production evidence: [desktop](equal-cards-desktop.png), [mobile](equal-cards-mobile.png). Known unrelated Chrome extension exception persists.

## F11–F12 upcoming course state

Replaced “В плане” and the empty metadata divider with the shared Badge “Скоро” in the lower right corner. Planned cards expose aria-disabled and no actions. Following visual feedback, retained the same white surface, border and shadow; only decorative illustrations (opacity .75) and headings (80% ink) are mildly muted. Copy remains readable and all cards retain equal dimensions.

Format, lint, typecheck, 12 unit tests, build and 11 production E2E cases PASS; card/unit LSP clean (previously documented E2E adapter limitation unchanged). E2E checks badges, disabled semantics, absence of links, white backgrounds and equal sizes. Playwriter desktop/mobile evidence: [desktop](soon-desktop.png), [mobile planned card](soon-mobile.png). No new app errors; known browser-extension exception remains. No API changes, Full Gate or release.

## F13 distinct badges and live dev hover diagnosis

The shared metadata Badge now uses its quiet surface (#f5f5f5) against white cards. Production E2E asserts that distinction.

Reproduced the reported hover defect directly on localhost:8080: background and foreground both became #606060. The composed ActionLink CSS/anchor retained old Button class `_root_nyhx1_1` while the current Button stylesheet used `_root_1xunx_1`. Restarted only `infraege-dev-web-1`, then navigated again: the anchor now uses the current class. Across requestAnimationFrame samples over 700ms after hover, background remained #171717 and foreground #fff with no alternate colors. This live-dev finding is recorded in KNOWN_GOTCHAS; production-only evidence had missed it.

Format, lint, typecheck, 12 unit tests, build and 11 production E2E cases PASS; card LSP clean. [Live dev hover screenshot](dev-hover-fixed.png), [mobile badge](soon-badge-mobile.png). Known unrelated extension exception persists. No data, API or deployment changes.

## Final local ship gate

2026-09-20: Critical Gate PASS — repository formatting, web lint/architecture checks, TypeScript check, 16 catalog/revision unit tests, source LSP, documentation evidence links and diff whitespace. Change override: fresh production build plus 11 focused catalog E2E tests PASS. Playwriter verified current production desktop/mobile and real unavailable-summary state; overview remains usable. Screenshots: [desktop](ship-desktop.png), [mobile](ship-mobile.png), [unavailable](ship-unavailable.png). Scoped static audit and final code-review verdict are in final-review.md.

Backend tests, API regeneration, Full/Release/security/performance gates skipped: unchanged backend/API and local Critical ship requested. Existing E2E LSP adapter limitation documented above; executable typed checks pass. Allowlisted cleanup reviewed and completed. Backlog and review notes have no unresolved items. Local commit/merge/archive authorized; no push/deployment.
