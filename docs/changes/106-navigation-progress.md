# CHANGE 106 — Navigation progress without page skeletons

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `106` |
| Slug | `navigation-progress` |
| Title | Navigation progress without page skeletons |
| Status | `active` |
| Branch | `feature/106-navigation-progress` |

## Goal

Keep the current page visible until the next route is ready. Use the existing top-edge progress
bar for delayed navigation and remove the global skeleton scene, including its lab example.
Source: architect's chat brief. SPEC remains unchanged; this refines the existing frontend UX.

## Design References

Existing AppNavigationProgress and `/courses` → `/courses/python` navigation. The lab auxiliary
states specimen retains error documents; loading uses the existing app-owned progress indicator.

## Backlog

### Backend
None

### Frontend
- [x] F1 Retain the visible current route while the destination loads; show only the existing top progress after 150ms, without a minimum route display delay. Preserve SSR, errors and retry. — _Depends on:_ —
- [x] F2 Remove the global pending component, skeleton presentation/styles and lab example; synchronize FRONTEND and affected tests. — _Depends on:_ F1
- [x] F3 Increase the top loading indicator from 2px to 4px for visibility; verify its browser appearance. — _Depends on:_ F1

### Infra
None

### Other
- [x] T1 Verify delayed successful/failed transitions, progress completion, responsive/reduced-motion behavior, LSP and affected Critical Gate. — _Depends on:_ F1, F2

## Files

### Create / modify
~~~
apps/web/src/router.tsx
apps/web/src/app/index.ts
apps/web/src/app/route-state/
apps/web/src/app/providers/components/navigation-progress*
apps/web/src/shared/components/status-scene/
apps/web/src/pages/design-system-lab/visual-language-states.tsx
apps/web/e2e/auxiliary-pages.spec.ts
apps/web/e2e/pages/auxiliary-pages.page.ts
apps/web/tests/ (focused navigation coverage if needed)
docs/FRONTEND.md
~~~

### Do NOT touch
- Staged docs/artifacts files, authored lessons, backend/API, deployment.

## Contracts

See `docs/SPEC.md` §3–§5 and the Files list above.

## Gate Checks

Critical Gate: [STACK.md](../STACK.md). Focused browser verification includes blocked navigation
beyond the former pending threshold, then success or error/retry. No Full Gate.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Critical Gate: format, web lint/architecture, typecheck, 9 client-foundation tests and repository
  cleanup passed. Playwright collection found all 5 auxiliary journeys; the suite was not run.
  Playwright/chrome-devtools MCP verified retained course content during a blocked request,
  top progress, successful completion, 503 error and explicit retry, mobile geometry and reduced
  motion. Screenshots were inspected; normal navigation produced no console errors/warnings.
- LSP is clean for router, StatusScene and the lab consumer. Isolated E2E diagnostics reproduced
  the documented `expect`/`Page` resolution issue in KNOWN_GOTCHAS; the unit test's existing
  importOriginal mock callback also produced adapter diagnostics despite 9 passing Vitest tests.
  These supplementary diagnostics remain a tooling limitation, not a reported all-green LSP gate.
- The injected server-function 503 also exposed a 422 from the existing client-error telemetry
  endpoint in local Docker. Recovery succeeded; telemetry diagnosis is outside this navigation
  change and was not silently folded into implementation.


## Commit Message

```text
fix(change-106): retain pages during navigation
```
