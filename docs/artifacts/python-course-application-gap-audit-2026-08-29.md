# Python Course Application-Gap Audit — 29 August 2026

## Decision

The two published Python CourseLessons work as one anonymous course: both checker families are
strict, progress survives reload, four of five accepted answers count as mastery, five of five is
shown as full task completion, course progress moves from zero to one to two mastered lessons and
reset remains isolated to one lesson. The overview is truthful about early access, separates two
published links from 17 planned rows and remains readable across the required viewports and without
JavaScript.

One learner-facing continuity statement is no longer true. The first lesson result says that the
conditions lesson is still being prepared, although that lesson is already published and linked
from the course overview. Before authoring a third lesson, the next change should be one bounded
package: **restore published-course continuation truth**. It should remove the stale availability
claim from the first lesson result and add focused coverage that protects the result copy when a
referenced course lesson moves to `published`. It must not introduce a recommendation engine, a
direct Topic relationship or new lesson content.

## Evidence method

Production and management checks were read-only. Local interaction used the repository-owned
`infraege-dev` stack, which was stopped after the audit. Browser analytics was denied locally;
production pages were queried with `curl`, so this audit did not intentionally create production
pageviews or product events. No application, lesson content, Source configuration, credentials,
infrastructure or production runtime was changed.

| Evidence | Scope | Reproduction | Result |
|----------|-------|--------------|--------|
| `E1` | Repository and local baseline | `main == origin/main == 695cdb1…`; `make dev`; focused Playwright journey | Current checkout owned the local stack; the published-Python-course journey passed 1/1 and retained six viewport screenshots |
| `E2` | Course registry and public projection | `pnpm validate:content`; focused course/public-release Vitest files | 1 course, 9 modules, 19 plan rows, 2 published CourseLessons and 10 owned tasks; 16/16 tests passed; public tasks omit accepted answers, tolerance and checker explanations |
| `E3` | Checker contract | Two Python checker pytest nodeids; manual first-task offline retry | 10/10 task cases passed including normalized conditions answers; an offline submit produced one recoverable error, preserved the draft and succeeded only after explicit resubmit; no silent mutation retry exists |
| `E4` | Cross-lesson progress | Fresh isolated browser context; solve 4/5 in each lesson; return to overview; finish conditions 5/5; reset only the first lesson | Overview progressed 0/2 → 1/2 → 2/2 at the 80% mastery threshold; conditions showed 5/5; resetting the first lesson returned overview to 1/2 while conditions remained mastered |
| `E5` | UX, responsive and progressive enhancement | Focused Page Object journey, DevTools screenshots/console, desktop, 960px zoom proxy and 390px Playwright viewport | Published titles remain links, plan numbers stay outside links, planned rows are muted, no horizontal overflow or console errors appeared; keyboard disclosures, reset focus and no-JS overview/both lessons passed |
| `E6` | Continuation truth | Browser result of `/courses/python/pervaya-programma`; source inspection | Result still says «Пока урок готовится» about conditions, while `/courses/python/usloviya` is published and linked; reproducible in `python-first-program.lesson.tsx` |
| `E7` | Production release and discovery | Read-only GETs for `/`, course, both lessons, privacy, robots, sitemap and readiness | Every route returned 200; readiness reports `695cdb1fa2a83495b8fe5359574710da0f6fa81b`; sitemap contains exactly the overview and both published course lessons |
| `E8` | Operations and analytics | `make ops-status`; `make sre-management ACTION=status`; read-only SQLite projection of Product analytics | Five ops containers and three sre-kit services are healthy; sre-kit runs exact main SHA `1ad8a4d…`; Product analytics is `ok`, but its six-event allowlist omits emitted `course_opened`; latest one-hour counts were all zero and are not a sufficient behavior sample |

The 960px browser width is the repository's existing 150%-zoom proxy for a 1440px desktop. The
browser screenshots are evidence, not final visual approval.

## Journey matrix

| Journey | Evidence | Verdict |
|---------|----------|---------|
| Home → course overview | Course is discoverable, early access is explicit, two available lessons are links and 17 future rows are plain muted text | Pass |
| Overview → first lesson → result | Theory, practice, incorrect/correct, offline recovery, reload and mastery work | Functional pass; result copy is stale (`PC-01`) |
| Overview → conditions → result | Normalized answers, 4/5 mastery and 5/5 completion work | Pass |
| Aggregate course progress | 0/2 → 1/2 → 2/2 and lesson-only reset isolation reproduced | Pass; focused browser regression coverage is incomplete (`PC-04`) |
| Responsive / keyboard / no-JS | Desktop, zoom proxy, 390px, disclosures, reset focus, SSR forms/content and overflow checks | Pass |
| Production / discovery | Current exact SHA, all public routes and crawl surfaces healthy | Pass |
| Consented measurement | Existing emitted lesson events remain privacy-bounded | Partial: course entry and declared-event contracts drift (`PC-02`, `PC-03`) |

## Ranked findings

| ID | Severity | Observed journey | Expected contract | Reproduction evidence | Owner | Dependency |
|----|----------|------------------|-------------------|-----------------------|-------|------------|
| `PC-01` | high | After the first lesson, the result says the conditions lesson is still being prepared; returning to the overview shows that exact lesson as published | SPEC §1.3 requires truthful incremental publication and §1.4 requires a meaningful, factual result/continuation | `E4`, `E6`; lines 327–329 of `python-first-program.lesson.tsx` versus the published registry | course lesson content + focused frontend coverage | Current published conditions lesson; no new relationship model |
| `PC-02` | medium | Opening the course emits `course_opened`, but Product analytics never requests that event from Umami, so course-entry counts cannot reach sre-kit | The consented emitter and Source allowlist must describe the same bounded measurement contract | `E8`; `CourseOverviewPage` and analytics union versus both Source manifests and the live Source config | frontend analytics contract + observability Source config | Separate reconciled Source change after `PC-01`; requires normal operational approval to mutate runtime |
| `PC-03` | medium | `theory_section_viewed` and `continuation_opened` are typed and polled but have no production emitter; learner-visible mastery is 4/5 while `lesson_completed` emits only at 5/5 | Dashboard labels and event semantics must not imply observations the product does not produce, and completion must have one documented meaning | `E4`, `E8`; source search finds the two names only in the type union; course progress and analytics use different thresholds | product analytics contract | Decide semantics before code or Source reconciliation; current zero samples prove neither use nor disuse |
| `PC-04` | low | The full focused Playwright journey checks each lesson and a one-task reset, but not aggregate 0/2 → 1/2 → 2/2 progress or cross-lesson reset isolation | Regression evidence should protect the multi-lesson behavior now proven manually | `E1`, `E4`; Page Object inventory | frontend E2E | Can follow the learner-facing truth fix; preserve fixture/Page Object policy |

No separate UX finding is assigned to the 19-row plan. Its module grouping, title/outcome hierarchy,
muted future state and independent numbering remain understandable in the inspected layouts, and
published links are available before the learner has to scan the complete roadmap. No data defect
is assigned for absent Topic relationships: both CourseLessons and all tasks have valid independent
ownership, and the product contract explicitly forbids inventing those links.

## Next change package

**Change 68 — Python Course Published-Continuation Truth**

Done when the first lesson result no longer describes the already-published conditions lesson as
being prepared, its wording remains factual if later curriculum rows are still planned, and focused
content/browser coverage fails when this published-state contradiction returns. The package may
reuse the existing course-overview continuation link but must not add a personalized recommendation,
hard course lock, Topic/CourseLesson relation, third CourseLesson or analytics/infrastructure fix.

`PC-02`–`PC-04` remain ranked follow-ups. After the continuity package is shipped, the next
self-scoped plan should compare the analytics reconciliation against the first unfinished content
step «Ошибки: читаем сообщение и находим причину» using this evidence rather than assuming that
new authoring automatically wins.
