# F24: balanced code and formula scale

The recursion pilot uses 0.9em for inline code/formulas and 0.9rem for code blocks:
14.4px with 16px reading text, 28.8px at 200% text enlargement. JetBrains Mono
distinguishes code and formulas without adding color, weight or a new type role.
The disclosure indentation and absence of its side rule are preserved.

## Checks

- `pnpm format:check`: PASS.
- `pnpm --filter web lint`: PASS.
- Explicit focused E2E TypeScript compiler with strict/Bundler options: PASS.
- Focused topic-reading scenarios using `/tmp/156-balanced.config.mts`: 4 PASS
  (desktop/mobile, no-JS, 200% text, local code scroll and page reflow).
- Type detector on scoped tokens: no findings.
- E2E LSP checked: existing inferred-project Playwright export resolution errors
  persist; explicit TypeScript compiler resolves these imports and passes. Only
  CSS tokens and existing literal size expectations changed.
- Playwriter inspected the running page: 14.4px, no application console errors.
  Screenshot execution timed out; repository Chromium captured both viewports,
  with empty console/page error collection.
- [Desktop](desktop.png) and [mobile](mobile.png) screenshots inspected.
- Broader content/unit/production checks were not invalidated by this scoped size
  adjustment. No ship, commit, merge, release or global lesson rollout.
- Final allowlisted cleanup and clean-check: PASS.
