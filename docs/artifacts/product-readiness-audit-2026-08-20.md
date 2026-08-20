# Product Readiness Audit — 20 August 2026

## Decision

The two published lessons are individually readable and operational, but they do not yet form a
closed learner journey. Practice answers are checked safely and accepted answers persist, while
the public UI never explains the resulting progress, offers a lesson-level reset or gives a
meaningful next action at the result. Do not start a third topic or the Python course yet.

The next change should be one bounded package: **close the anonymous two-lesson progress loop**.
It should surface the existing per-lesson solved count and mastery state at the result, provide a
clear lesson-only reset, and offer registry-derived links back to all topics and to the other
published lesson without presenting it as a personalized recommendation. It must add Page Object
coverage for incorrect, accepted, reload, failure/retry, reset and cross-lesson continuation.

## Evidence method

All production checks were read-only. No production browser was opened, so the audit itself did
not intentionally emit an Umami pageview. Local browser work used the `infraege-dev` Compose
project from this checkout; the web source and task-content mounts resolved to this repository.
No lesson, application, analytics, infrastructure, credential or sre-kit runtime state was
changed.

| Evidence | Scope | Reproduction | Result |
|----------|-------|--------------|--------|
| `E1` | Local ownership and route-level response | `make dev`; inspect `infraege-dev-web-1` mounts; `curl http://localhost:8080/` and `/health` | Four containers healthy; source/task mounts point to this checkout; home SSR contains both lessons and release identity; health is `ok` with local version `development` |
| `E2` | Current public browser journeys | `pnpm --filter web exec playwright test e2e/smoke.spec.ts -g 'public root\|privacy and crawl\|published recursion\|published task-5'` | 4 passed; fixtures and Page Objects used; screenshots retained under `.output/playwright/` for desktop/mobile home, privacy and both lessons, plus a solved recursion task |
| `E3` | Checker and persistence | Chrome DevTools on local recursion; local POSTs for the first task of each lesson | Both task families return incorrect and correct explanations; incorrect value remains editable; one offline POST fails once, retry happens only after explicit resubmit; accepted value and solved id survive reload; persisted data contains no checker fields |
| `E4` | Responsive, keyboard, no-JS and console | Existing smoke Page Objects at desktop, 960px zoom-equivalent and 390px mobile; keyboard disclosure journey; no-JS fixtures for all four public HTML routes; Chrome DevTools screenshots/current console | No horizontal overflow; required SSR content/forms/help remain present; shared disclosures work from keyboard; clean route consoles, apart from the deliberately induced offline network error; mobile task-5 Lighthouse snapshot scored 100 for accessibility, best practices and SEO |
| `E5` | Content and public projections | Inspect registry, lesson definitions, task JSON and server projection; `node scripts/validate-content-links.mjs` | 2 published lessons, 5 ordered tasks each, valid task/topic ids and theory anchors; public projection omits answer variants/tolerances; validation passed for 2 TSX lessons and 10 tasks; no topic/course relationship records exist |
| `E6` | Production availability and release | HTTP GET `/`, `/privacy`, both lesson routes, `/health/ready`, `/robots.txt`, `/sitemap.xml` | Every route returned 200; readiness reports release `ad6df05fa7d44e7a4f9434c196091ed4890e2f49`; all HTML routes share `beta` / `v1.0.0`, canonical and `index,follow`; sitemap contains exactly the four public HTML routes |
| `E7` | Operations and monitoring | `make ops-status`; read-only sanitized Source status query; archived sre-kit Change 20 evidence | Five `infraege-ops` containers are up on the same release; exactly six unique enabled Sources were `ok` with fresh local timestamps; Change 20 proved three cycles per Source, quiet success, reversible uptime failure/recovery and clean authenticated UI. Polling/alerts still stop with the workstation-hosted core |

The 960px viewport is the repository's existing 150%-zoom proxy for a 1440px desktop. The browser
screenshots are evidence, not visual approval; final visual judgment remains architect-owned.

## Journey matrix

| Journey | Local browser | Production read-only | Verdict |
|---------|---------------|----------------------|---------|
| Home discovery | Both and only published lessons; real links; direct privacy access; SSR/no-JS complete | 200, canonical, shared release identity, both lesson titles present | Pass |
| Recursion lesson | Full outline/theory/checkpoints/practice/result; 5 tasks; incorrect/correct/reload and recoverable failure exercised | 200 and indexable on current release | Content and checker pass; progress/continuation fail |
| Number-record lesson | Full outline/theory/checkpoints/practice/result; 5 tasks; keyboard help and no-JS verified; shared checker boundary exercised | 200 and indexable on current release | Content and checker pass; progress/continuation fail |
| Return and continuity | Back link returns to the home list | Home remains available | Fail: result has no next action and home/result do not explain lesson completion |
| Privacy and trust | Current processing/localStorage behavior described; responsive/no-JS readable | 200, canonical, shared release identity | Partial: factual processing is accurate, but operator-deferral wording is no longer current truth |
| Crawl surfaces | Registry drives home, sitemap and lesson status | Robots and sitemap match the four public HTML routes | Pass |
| Operations feedback | Local app stack owned and healthy; sre-kit proof reconciled | Readiness and operations stack healthy on one exact SHA | Pass with accepted workstation/offline-alert limitation |

## Ranked findings

| ID | Severity | Observed journey | Expected contract | Reproduction evidence | Owner | Dependency |
|----|----------|------------------|-------------------|-----------------------|-------|------------|
| `PR-01` | blocker | A learner solves a task, reloads and reaches the result, but sees no solved count, mastery state or performance-dependent result even though the answer persisted | SPEC §1.4 requires the result to include practice outcome and targeted review; §1.3 requires understandable browser-level progress | `E2`, `E3`; `LessonProgress` and `clear()` exist but public `TopicLessonPage` renders neither | frontend / lesson progress | Existing per-lesson progress store and public lesson consumer |
| `PR-02` | high | The result of either lesson contains no link to the other lesson or explicit return-to-topics action; returning home shows two undifferentiated cards | The learner must understand what was completed and choose a meaningful next action without accounts, catalog or invented recommendation | `E2`, `E4`, `E5`; both `#result` sections contain zero links and relationship records are absent | frontend + lesson registry | `PR-01`; use publication registry, do not invent semantic relations |
| `PR-03` | high | A learner cannot restart one lesson; privacy instructs clearing all site data in browser settings | Recovery/reset must not strand the anonymous learner and must preserve the per-lesson ownership boundary | `E3`; store exposes `clear()` but no public consumer invokes it | frontend / lesson progress | `PR-01`; confirmation copy and focused browser coverage |
| `PR-04` | medium | At 390px the long lesson outline occupies the first viewport and pushes the lesson title below it; task 5 presents a dense two-column list before the learning content | FRONTEND §5 requires responsive hierarchy to preserve the primary task, not merely avoid overflow | `E2`, `E4`; `task-5-published-lesson-mobile.png` and DevTools mobile screenshot | frontend / lesson outline | Independent of blocker package; needs architect visual review before redesign |
| `PR-05` | medium | Privacy says operator details “will be added later,” while the accepted current decision defers them indefinitely with no roadmap item | Public legal copy must describe current truth and must not imply a scheduled surface that does not exist | `E4`, `E6`; privacy copy versus SPEC §8/§10 | frontend content / trust | New explicit app-copy change; do not add requisites, contact, RKN or age marking |
| `PR-06` | medium | Existing automated journeys do not cover the full learner loop: task 5 has no accepted/reload check, and recoverable checker failure/reset/cross-lesson continuation are absent | Browser evidence should protect the same end-to-end package selected from this audit | `E2`, `E3`; coverage inventory in `apps/web/e2e` | E2E / Page Objects | Implement with the blocker package; preserve fixture/POM policy |
| `PR-07` | low | Monitoring proof is current only while the local sre-kit core is running | Documentation must preserve the accepted workstation/offline-alert limitation | `E7` | operations / sre-kit | Always-on management host remains trigger-based, not a product-audit blocker |

No separate data defect is assigned for absent cross-topic relations. The two current topics have
valid task ownership and anchors, while no approved semantic prerequisite/related-topic claim
exists between them and future course/topic content is intentionally absent. `PR-02` is therefore
a learner-transition gap: the UI may expose the other *available* lesson through the publication
registry, but must not fabricate a recommendation or domain relationship.

## Next change package

**Change 46 — Anonymous lesson progress closure**

Done when one browser journey can enter either published lesson, submit an incorrect answer,
recover from one failed check, persist an accepted answer across reload, understand solved count
and mastery at the result, reset only that lesson, and continue through registry-derived navigation
to the other published lesson or back to all topics. The same journey must remain truthful in SSR/
no-JS output: interactive progress is an enhancement, while links and all learning content remain
available without JavaScript. Checker secrets and mutation retries remain server-owned/explicit.

The package intentionally excludes a catalog, account, synchronized progress, analytics events,
new relationship semantics, lesson content changes and visual redesign. `PR-04` and `PR-05` remain
separately ranked follow-ups unless the architect explicitly adds them to that change.
