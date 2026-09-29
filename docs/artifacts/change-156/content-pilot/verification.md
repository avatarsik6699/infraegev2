# Recursion content readability pilot — F11–F13

Only lesson16 recursion-pilot changes typography. Conditions/prompts/steps:16px400ink.
Formulas:1em, inline code unchanged. Outcome h3 matches theory24–28px and light rule.
Mobile code13px. All three conditions retain exact words/symbols with a separate
definition line and grouped short terms; no whole-formula nowrap.

Screenshots of current localhost8080 after fonts and practice enhancement:
[desktop example](desktop-example.png), [desktop outcome](desktop-outcome.png),
[mobile example](mobile-example.png), [mobile code](mobile-code.png),
[mobile outcome](mobile-outcome.png). Captured with repository Chromium following
Playwriter screenshot timeouts; live DOM/console readings used Playwriter.

Acceptance: topic-reading8PASS; final amended pilot2PASS(JS/no-JS); Vitest40PASS;
web lint/typecheck, explicit E2E compiler, content validation and formatPASS.
Source LSPclean; E2E inferred-project LSP inaccurate dependency resolution is
covered by explicit compiler. Independent reviewer: no remaining findings after
relative-token scaling fix. Detector[]. No app errors/resources>=400 in fresh
Chrome verification. Existing text override/HMR tab warning did not reproduce
on a fresh tab or acceptance journeys.

Checks prove normal320/390/1440 no page overflow, grouped terms fit, outcome
matches, baselineotherlesson remains18px outcome/12px mobilecode, first code
horizontal keyboard scroll works, steps/formulas32px and code26px at200% rootfont.
Global header becomes wider than320px under200% rootfont; existing behavior,
not fixed in content scope. Full native-browserzoom/real-device/screenreader
accessibility audit is not claimed. Auth/API/DB/dependencies unchanged.
