# F23: disclosure and formula scale follow-up

Scope: lesson 16 recursion pilot only. Disclosure answers retain their existing
indentation and 16px inner padding; the side rule is removed. Formula and inline
code size is 0.8em. Multiline code uses 0.8rem to avoid applying the relative scale
twice through nested pre/code elements. Both render at 12.8px with 16px body text,
and at 25.6px with 200% text enlargement. Other lesson defaults are unchanged.

## Verification

- Repository format check, web lint and explicit focused E2E TypeScript compiler: PASS.
- Focused topic-reading browser scenarios: 4 PASS. Coverage includes desktop/mobile,
  JavaScript and no-JavaScript, 200% text, disclosure padding/rule, consistent code
  sizes, page reflow and local code scrolling.
- Playwriter inspected the running lesson first: computed inline formula size
  12.8px, no application errors observed. Screenshot capture timed out; repository
  Chromium supplied the visual evidence below. Captures inspected at 1440px and
  390px; browser console/page error collection was empty.
- Existing content, unit, production type and broader acceptance evidence remains
  applicable: this follow-up changes scoped CSS tokens and browser expectations.
- No commit, merge, push, release or global rollout.

## Visual evidence

- [Desktop example](desktop-example.png)
- [Mobile example](mobile-example.png)
- [Desktop disclosures](desktop-help.png)
- [Mobile disclosures](mobile-help.png)
- [Mobile code](mobile-code.png)

Final repository allowlisted cleanup and clean-check: PASS.
