# Change 170: local readiness findings

Checked on 2026-10-03–04. This document records local evidence and remaining prerequisites;
it does not authorize publication or claim current production acceptance.

## Accounts, privacy and recovery (T1/T3)

- The architect confirms mail delivery is implemented. VK ID, Яндекс ID and Telegram remain
  deferred. The local provider endpoint returns an empty enabled list; the focused backend
  release-flag test passes, including closed start, link, reauthentication and callback paths.
- The public privacy page describes account credentials, consent, successful-result storage,
  temporary authentication records, deletion, backup retention and the first-party analytics
  boundary. The owner checklist and SPEC preserve the distinction between these engineering
  guarantees and a formal legal review. No completed external review was found; operator
  details, minors, notification and analytics interpretation remain documented owner risks.
  This review does not turn those risks into a legal acceptance.
- Fresh-database registration acceptance passes and verifies persisted consent version/time.
  Both fields are present in the originally committed `140_01` migration. The original
  pre-repair dev database/image state is unavailable, so the historical drift cause is unproven.
- The backup/restore implementation includes account identities, session records, per-context
  progress, row fingerprints and the application writer's grants. The local recovery contract
  suite passes: eight checks pass and one opt-in snapshot integration check is skipped. These contracts are not a fresh
  encrypted production backup/restore proof. No production host was accessed during `/work`.
- Restoring an older backup can resurrect a subsequently deleted account. The runbook requires
  deletion reconciliation before promotion and records the absence of an automatic deletion
  ledger. Same-host backup loss remains the explicitly accepted off-site-storage gap.

The current policy review and account restore proof must be confirmed before release in the
authorized release workflow. Mail confirmation alone does not close T1.

## Dev schema safeguard (D2)

The dev migration job upgrades and checks the schema, and every successful `make dev` checks
the retained schema even when no rebuild is needed. Focused lifecycle tests cover resumed drift,
nonzero exit propagation and migration-log diagnostics. An isolated PostgreSQL fixture stamped
at head but built from a copy omitting the two consent fields fails the real schema check on
both attempts; the current dev database passes. No source migration or live table was repaired
by that fixture.

## Performance investigation (F4/F5)

Initial six-route Lighthouse medians: `/` 3786 ms, `/ege` 3930 ms, `/courses` 3575 ms,
`/courses/python` 3813 ms, recursion `osnovy` 4519 ms, first Python lesson 4011 ms.
CLS was at most 0.04 and TBT at most 16 ms. SEO was 1 on every route; accessibility was 1
except `/ege` (0.96), where planned-row opacity produced 3.37:1 exam-number contrast.

Inlining CSS did not improve lesson LCP (4542/4081 ms) and was reverted. An initial manual
course-body chunk also captured its dependencies and retained the unwanted co-loading; it
was not accepted as a fix. Additional manual splitting retained eager side-effect dependencies or produced an SSR initialization-order failure, so the chunking and route-loading experiments were reverted. CSS splitting worsened course LCP and was reverted. Native video lazy loading with `preload="none"` produced lesson medians of 4191/4019 ms and remained functional when scrolled into view.

The architect explicitly accepts good overall, nonideal performance (2026-10-03). Modest LCP deviations from 4000 ms are therefore recorded rather than pursued with broader architectural changes. CI reference budgets remain unchanged; an LCP assertion failure must not be reported as a fully green Lighthouse run.


## Functional regressions found by F3

- Catalog progress now reserves its loading and loaded footprint outside the guest lock. Topic metadata reserves two lines on desktop and mobile; the summary error/retry state reserves its footprint while remaining absent from the accessibility tree when inactive.
- Planned EGE row labels use semantic muted colours instead of reducing text opacity.
- Shared course/EGE navigation titles wrap long words at enlarged text sizes. The no-JavaScript 390 px / 200% case exposed a 404 px document; the fix preserves the font and text instead of clipping or shrinking them. Real Chrome verifies 390 px document width at 200%, with ordinary mobile/desktop typography retained.
- Practice hint/solution buttons reserve their longest existing label intrinsically, so opening a disclosure does not widen the control or move its neighbour. Both accessible names and disclosure state remain intact.
- Production layout tests have no reverse API proxy; deterministic anonymous-session setup belongs in their domain fixtures. Normal frontend E2E retains the configured backend path.


Final six-route Lighthouse medians (three runs each, unchanged reference budgets):

| Route | LCP, ms | CLS | TBT, ms | Accessibility | SEO |
|---|---:|---:|---:|---:|---:|
| `/` | 3786 | 0 | 0 | 1 | 1 |
| `/ege` | 3935 | 0 | 0 | 1 | 1 |
| `/courses` | 3582 | 0 | 0 | 1 | 1 |
| `/courses/python` | 3800 | 0 | 8 | 1 | 1 |
| `/ege/16-rekursiya/osnovy` | 3920 | 0 | 0 | 1 | 1 |
| `/courses/python/pervaya-programma` | 4015 | 0 | 13 | 1 | 1 |

The course lesson misses the 4000 ms reference by approximately 15 ms. Lighthouse exits nonzero for that LCP assertion; all other configured metrics pass. This modest deviation is accepted under the architect clarification; no reference threshold was changed and no further performance experiments are planned.


## Verification scope

Change 170 explicitly selects the deferred full frontend E2E, production layout, no-JavaScript and accessibility checks, plus the six-route Lighthouse run. Focused reruns replace only evidence invalidated by subsequent fixes; this is not an implicit Full Gate or a release.

The real account browser journey passes against a freshly migrated and seeded disposable database: guest checks remain transient, registration and email verification succeed, authenticated EGE results persist, course-context practice remains zero, and logout closes account access. The synthetic mailbox and database do not prove production mail delivery or production restore readiness.


## Native orchestration

A fresh trusted repository session exercised the native orchestration configuration before implementation: GPT-6.1 Sol/medium for the parent; Luna/high for the bounded explorer/worker roles; GPT-6.1 Sol/high for reviewer; Astra/high for escalation. Real execution and child-agent smoke markers passed, and the repository launcher preserved the working directory and forwarded arguments. Config files were unchanged. Implementation used bounded ownership, independent review and a parent-owned gate.


## Browser traversal correction

The full frontend run initially completed 190 of 195 cases and failed five client-initialization cases. Subsequent focused runs exposed Vite client-module loading failures and one Chromium `ERR_INSUFFICIENT_RESOURCES` during repeated full-document subtopic traversal. The same six-case set passed with one worker but failed with the normal three, establishing a load-dependent reproduction; the exact resource accumulation mechanism remains unproven.

JavaScript subtopic traversal now uses the actual topic-navigation links, opens the mobile disclosure normally, and waits for the destination URL, current navigation item and canonical. It preserves content, CSS, keyboard, focus, practice and accessibility assertions. Initial entry, explicit reload/SSR and no-JavaScript checks retain full navigation. The six-case reproduction passes with the normal three workers; global deadlines and retries remain unchanged. Independent review found no blocking issue in these active paths.


The repository web compiler covers production source/configuration. An additional temporary configuration derived from it compiles all E2E files with their actual Playwright types and Vite CSS declarations; it passes after fixing typed temporary-style cleanup. Auxiliary LSP still reports missing Playwright exports in its inferred E2E project, while production changed-file diagnostics and both compiler checks pass. This LSP observation is recorded as a tooling limitation, not hidden as a clean E2E diagnostic result.


## Final affected checks

- Fresh production layout: **29 passed**, one worker, retries zero; covers delayed/failed fonts and scripts, catalog geometry and practice toolbar behaviour.
- Full frontend E2E: **195 passed**, normal three workers, retries zero; includes 78 `@no-js` cases and all accessibility-spec cases. There are no client-module or resource errors in this final run.
- Focused production units: **46 passed** across catalog progress, lesson media and practice help/behaviour.
- Real isolated account integration: **one passed**; registration, verification, persistent EGE results, separate course context and logout.
- Fresh registration and disabled-provider acceptance: **one passed each**. Local restore contracts: **eight passed, one opt-in integration skipped**.
- Repository format, web/tooling/shell lint, lifecycle tests, production TypeScript, supplemental all-E2E TypeScript and fresh production build: **passed**.
- Public API generation and content-validation gates: **skipped**, because API contracts/generated types and authored content/assets were unchanged. There are no Python application changes requiring a general backend gate.

The dev bank was exported before explicit bootstrap, then restored to 744 tasks, including 14 recursion tasks. Data-bound topic/practice cases pass in the final browser run. The private pre-bootstrap export remains outside repository cleanup.

Lighthouse observations above preceded the final enlarged-text navigation-title wrapping correction. That correction changes overflow handling rather than ordinary font sizes or spacing; the regular mobile/desktop presentation was checked in real Chrome. A future release still requires its own candidate-specific evidence.


## Remaining work

F6 awaits the architect-supplied illustrations. D2's fresh/resumed schema safeguard is complete and verified; its historical root cause cannot be proven without the pre-repair state, and the architect accepted closing D2 on that basis (2026-10-04). T1 still needs formal policy acceptance and fresh production account restore proof. T2 remains unperformed and requires completion of those prerequisites plus explicit release authorization. No commit, merge, push or deployment was performed.


Repository cleanup passed: the dry-run allowlist was reviewed, generated reports/build outputs/caches were removed with `make clean`, and `make clean-check` passed. `.impeccable/`, dependency environments, authored evidence, dev database/task files and the pre-bootstrap bank export are preserved. The local dev stack remains running at `http://localhost:8080`.
