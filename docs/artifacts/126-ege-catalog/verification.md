# Change 126 verification

Local feature branch acceptance, 2026-09-20. No deployment performed.

- Production build and prerender: PASS (`/`, `/ege`).
- Focused frontend tests: 20 PASS across catalog, shared search, revision progress and inline solving.
- Focused API summary test: PASS; published lesson parity, payload privacy, unpublished/archived exclusion.
- Production browser suite: 13 PASS. Desktop/mobile widths 1305, 820, 390 and 360px; delayed and failed fonts/images, delayed scripts/hydration and API; exact geometry preserved and observed CLS = 0 in all eight delivery scenarios.
- Error/retry geometry, no-JavaScript content, 200% text size, search/status filters, revision invalidation: PASS.
- Muted planned rows, title/metadata alignment, bottom progress, 8px original light track, contrasting row hover, 4px arrow transform and reduced motion: PASS.
- Format, web lint/architecture policies, TypeScript, API Ruff/Pyright, generated API drift: PASS.
- Shared ingress read-rate test: PASS for production/development configurations. Shell syntax/ShellCheck: PASS using the repository script with `uvx --from shellcheck-py` because shellcheck is absent from the default PATH.
- Source LSP diagnostics: clean. E2E LSP retains the known `@playwright/test` resolution limitation documented in KNOWN_GOTCHAS; executable tests and lint pass.
- Interactive Playwriter review: desktop/mobile and both miniatures inspected against the supplied reference. Screenshots use the production preview and a response captured from the local real API (preview itself has no Nginx API proxy).
- The user's Chrome extension emitted `p is not a function`, traced to its `chrome-extension://` content script. Isolated browser tests report no application page errors.
- Full/Release Gate: skipped; not requested. Tooling lint/content-bank validation: skipped; corresponding implementation/content unchanged.

## Screenshots

- [Desktop catalog](desktop.png)
- [Mobile catalog](mobile.png)
- [Recursion miniature on mobile](mobile-recursion.png)
- [Number conversion miniature](desktop-number.png)
- [Restored light track against the hover background](desktop-hover.png)

## Header refinement (F10)

Generic subtitle removed. Full-catalog total and published-topic counts now accompany lesson progress below the heading. Counts come from the catalog, independently of search/filter state; static metadata remains visible without JavaScript.

Format, lint, TypeScript and source LSP: PASS. Seven catalog unit tests and all 13 production browser scenarios: PASS, including CLS = 0 in delayed/failed delivery cases. Playwriter desktop/mobile inspection: PASS.

- [Updated desktop header](header-desktop.png)
- [Updated mobile header](header-mobile.png)

F11: title-to-metadata grid gap removed; summary content aligns to the top and mobile rows use content height. Desktop/mobile screenshots refreshed. Production build, format, lint and all 13 browser tests pass after this spacing refinement; delayed/failed delivery still records CLS = 0.
