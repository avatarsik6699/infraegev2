# Change 127 — Final design review

The delivered `/courses` direction follows the approved monochrome catalog exception in
[FRONTEND §10](../../FRONTEND.md#10-mini-course-catalog) and the product commitments in
[PRODUCT](../../../PRODUCT.md). These remain the canonical contracts.

Four subject-specific, hand-drawn raster assets accompany the existing course copy and registry
order. The catalog uses two columns on desktop and one on mobile, with shared Image, Progress
and ActionLink components. Planned courses retain truthful unavailable states; the published
Python course links to its overview. Header and card progress use a shared revision-aware
calculation that handles missing summaries without presenting a false zero or partial total.

The independent review returned **PASS** for implementation: semantic headings, decorative
images and reduced-motion behavior are sound, with no material findings. This document records
that supplied reviewer verdict and the retained visual evidence; it does not claim an additional
test run.

| Finding | Disposition |
|---------|-------------|
| Implementation fidelity | PASS — approved assets, copy/order, responsive layout and shared controls. |
| Usability/behavior | PASS — semantic structure, reduced motion and missing-summary handling. |
| Screenshot cropping | RESOLVED — Chrome zoom caused cropping in initial full-page captures. Replacement viewport-only captures were reinspected by the reviewer, who returned PASS with no material findings. |

Visual evidence: [desktop](desktop.png), [mobile](mobile.png),
[mobile lower cards](mobile-bottom.png), [unavailable progress](unavailable.png).


## F5–F7 follow-up verdict

Independent review: **PASS — no remaining material problems**. The revised hover screenshot
shows a distinct progress track and readable white CTA label. The primary CTA is clearly stronger.
Enlarged illustrations add relevant detail while preserving the monochrome style; mobile captures
retain readable text and intact card boundaries. Shared styling changes remain narrowly scoped.

Current evidence: [hover](revision-desktop-hover.png), [mobile](revision-mobile.png),
[lower mobile cards](revision-mobile-bottom.png).

## F8–F9 follow-up verdict

Independent review: **PASS**. One narrow-text issue was identified and fixed: the progress copy now uses an auto-sized row with an inaccessible hidden reserve for the unavailable status. This preserves responsive status geometry without duplicate announcements or track overlap. The shared lift hover stays opt-in and preserves primary colors; no remaining material findings.

## Final code audit before local ship

Manual review found no blocking defects in registry publication/order, route-loader compatibility, revision-aware progress, missing-summary handling, shared control compatibility, keyboard/reduced motion or planned-card semantics. No API/storage/schema changes or dependencies were introduced.

Fallow 3.14.0 audit against local main: WARN, no new dead-code or complexity findings. Three small duplicate fragments belong to domain-specific catalog Page Objects (resource gating, paint settlement, geometry extraction); keeping their scenario ownership explicit avoids coupling two independent suites. Selector-complexity warnings were reviewed: published-only hover and reduced-motion/primary opt-in selectors intentionally preserve the cascade; several warnings marked introduced point to unchanged shared rules in the diff. No blanket suppression or unrelated refactoring applied.

Four graph-anchored contract judgments (ActionLink, catalog page, catalog registry, shared Button CSS) were post-validated: 4 accepted, 0 rejected, snapshot current. Existing consumers remain compatible. Graph validation verifies anchors, not the correctness of reviewer conclusions. No unresolved product/architecture trade-off needs reopening; visual decisions were explicitly settled with the architect.

Residual tooling limitations: E2E language-service adapter has the documented Playwright export-resolution issue; typed ESLint and executable browser tests are authoritative here. Chrome extension error is unrelated to the app. Dev CSS composition stale-hash issue was reproduced and resolved by restarting only the web container; settled hover on localhost:8080 was verified.
