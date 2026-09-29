# Change 156 — final audit

2026-09-29. Candidate: `feature/156-recursion-style-pilot`, based on saved
Change 155 commit `562f2bb`. Local ship requested; no release requested.

## Review and corrections

Two independent read-only reviews inspected production code, consumer contracts,
SPEC/FRONTEND, active Backlog, browser acceptance, fixture architecture and authored
visual evidence. No remaining P1/P2 findings after correction.

- F33: reconciled the change title and commit message with the completed site-wide
  rollout; clarified current ship authorization while retaining historical evidence.
- F34: compact practice `callout` body now uses the common16px reading size instead
  of14px. Inline notation now inherits14.4px. Compact title/padding are retained.
  The current published bank has no callout records; the supported renderer shape
  is covered by its existing unit fixture and the live component fixture below.
- Source LSP: all11 changed production TS/TSX files clean. Context7 checked Base UI
  and TanStack APIs during review; React root mounting checked for browser fixture.
- Fallow review walkthrough:4 accepted judgments,0 rejected,0 unanchored,
  `stale:false`, graph `graph:7a169ad7aeddcc74`. Parent inspected validation output.
  No new dependencies, platform-boundary bypasses or auth/schema behavior changes.

## Final affected verification

| Row | Result / freshness |
| --- | --- |
| Format | `pnpm format:check` PASS after formatting newly authored observation JSON |
| Web lint | Fresh PASS, including E2E/design-system/app/layer policies |
| Typecheck / strict E2E compiler | Previous rollout PASS accepted; subsequent production change is CSS only |
| Source LSP | Fresh independent review PASS for11 changed TS/TSX files |
| Focused unit | Fresh46 PASS: practice-content-renderer, shared-components, action-semantics |
| Production build | Fresh `API_INTERNAL_URL=http://localhost:8080 pnpm --filter web build` PASS |
| Browser fixture | Actual PracticeTaskContent → dense Callout → Notation, desktop/mobile and200% text PASS |
| Existing rollout acceptance | [Report](../site-rollout/verification.md):70 published lesson cases,61 site-family cases and focused reflow/degraded/native reruns accepted unchanged |
| API / backend / tooling / shell | SKIPPED: those inputs unchanged |
| Full / release / dependency / image security | SKIPPED: no Full or release request; no dependency/image-source change |

The first final format run detected only formatting of the new observation JSON;
repository Prettier corrected it and the full command then passed. Build retains
the previously documented non-blocking PostCSS `from` warning.

## Browser evidence

Playwriter first: ordinary Windows Chrome Default was initially absent. Started
that profile without replacing/closing user tabs; session1 then connected. Owned
fixture tab only. `make dev` resumed the stopped local stack through its normal
input fingerprint/rebuild/health procedure; no content import or destructive DB
operation. The production bundle was independently built on the host.

This is a temporary browser fixture mounted with the actual development renderer
and CSS, outside the application's managed root. It is not a published task or a
new application route. Existing published production-page evidence is linked above.

[Measurements](dense-observations.json): body16/400/1.68, notation14.4 at1440 and390;
200% body32 and notation28.8 at390. The fixture surface does not overflow. At200%
a long word extends2px past the inner body box into its available padding without
clipping or expanding the surface. No unexpected application/console errors.

- [Desktop](dense-desktop.png)
- [Mobile](dense-mobile.png)
- [Mobile with200% text](dense-mobile-enlarged.png)

## History boundary

Change 155 is still an active, separately checkpointed change. Its F11 explicitly
requested no ship/merge/archive at that checkpoint; Change 156's implementation
notes preserve that boundary. The current branch descends from155, so merging156
also includes155. `change_history.py inspect` rejects two active changes, and the
canonical ship playbook requires the target to be the single active file.
Final audit therefore identifies a history-scope decision before merge/archive;
this is not a code or acceptance failure. No push/deploy is authorized.

Final hygiene: dry-run allowlist inspected after analyzing Fallow/build/unit/browser
results; `make clean` and `make clean-check` PASS. Authored captures retained;
owned fixture unmounted/tab closed/session deleted. `git diff --check` and report
link resolution PASS. Both155 and156 have zero unchecked Backlog items.
