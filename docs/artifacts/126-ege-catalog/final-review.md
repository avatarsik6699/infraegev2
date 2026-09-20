# Change 126 final review and audit

2026-09-20. Scope: complete local Change 126 diff against main, including API, UI, shared search, ingress, tests and contracts. No unresolved blocking findings.

## Findings resolved before ship

- P2 accessibility: exam numbers used aria-label on generic spans. Axe returned manual-review items; these were verified and replaced with real visually hidden text and aria-hidden visual numerals. Subsequent scans contain no violations or incomplete items.
- P3 copy: the summary could say “2 задач решено”. It now uses count-independent grammar: “Решено задач в темах: N”.
- Maintainability: extracted pure progress aggregation from the loading/state hook, preserving revision filtering, unique counts and unavailable states.

## Code review

- API returns only published topic task IDs/revisions; archived tasks are excluded, no task/checker content is exposed. Uses the existing read-only session, no-store policy and shared Nginx read budget.
- Catalog route remains prerenderable and does not read the bank at build time. API errors preserve usable navigation/search and never fabricate zero totals.
- Lesson progress stays separate from standalone practice and courses; filters use current revisions and partial/completed state semantics.
- SearchField additions are optional. The existing practice consumer retains defaultValue and explicit submit/clear behavior; no dependency added.
- Fallow graph review verified the two changed public surfaces (page export and SearchField): both judgments accepted, snapshot current, none rejected. This validates anchors, not the correctness of human reasoning.
- Fallow reports no introduced unused code, duplicate groups, dependency cycles or boundary violations. Its advisory audit verdict remains fail because the state hook has cognitive complexity 17 (down from 26; threshold 15) plus three state-selector warnings. Manual review accepts the bounded hook and published hover/focus/reduced-motion selectors; splitting state ownership or weakening selectors solely for a threshold would not improve this change. No suppressions or altered thresholds were added. Inherited generated schema exports and the Lighthouse CLI dependency are outside this change; CLI use is repository-prescribed.
- The Impeccable detector returned no findings. Design review preserves the supplied reference, shared controls, two educational SVGs and explicit planned-topic states.

## Scoped UI audit

| Dimension | Score | Evidence and limits |
| --- | --- | --- |
| Accessibility | 3/4 | Axe: zero violations and incomplete items on desktop, mobile, published search and empty results; keyboard/reduced-motion tests pass. No claim of a full assistive-technology certification. |
| Performance | 3/4 | Two bounded SVG assets, no new dependencies, prerender succeeds; all eight delayed/failed delivery cases have CLS = 0. No new Lighthouse benchmark or production latency claim. |
| Responsive design | 4/4 | 1305/820/390/360px, text at 200%, no horizontal overflow; stable hover geometry. |
| Theming | 4/4 | Existing light visual contract and semantic tokens retained; dark mode is outside product scope. |
| Implementation integrity | 4/4 | Publication/progress ownership and shared component boundaries verified; no invented theory-completion data. |
| Total | 18/20 | Strong scoped acceptance; limits above remain explicit. |

## Critical Gate and additional acceptance

- Format, web lint/architecture checks, TypeScript and Python Ruff/Pyright: PASS.
- Source LSP: PASS. E2E LSP retains the documented Playwright package-resolution limitation; executable browser tests and lint pass.
- Focused frontend: 20 tests PASS (catalog, search, revision progress, inline solving).
- API: published-summary parity/privacy/exclusion test PASS using isolated PostgreSQL.
- Ingress: production and development rate-limit tests PASS; repository shell checks PASS via shellcheck-py environment.
- Generated OpenAPI/type drift: PASS.
- Production build/prerender: PASS. Production browser tests: 13 PASS, including eight exact-geometry/CLS cases, error retry, no-JS, text enlargement, hover and reduced motion.
- Playwriter visual and axe review: PASS. The unrelated user Chrome extension page error is documented in verification.md; isolated tests have no application page errors.
- Full/Release Gate: skipped because local ship was requested. Unchanged root JS tooling, authored content, migrations and deployment checks are outside the affected Critical Gate.
- Cleanup: required allowlisted dry-run, cleanup and clean-check before merge.

See [acceptance record](verification.md), [axe results](accessibility.json) and [anchored review validation](review-validation.json).
