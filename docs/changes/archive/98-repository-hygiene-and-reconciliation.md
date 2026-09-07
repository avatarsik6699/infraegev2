# CHANGE 98 — Repository Hygiene and Reconciliation

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `98` |
| Slug | `repository-hygiene-and-reconciliation` |
| Title | Repository Hygiene and Reconciliation |
| Status | `archived` |
| Branch | `feature/98-repository-hygiene-and-reconciliation` |

---

## Goal

Make repository hygiene an enforceable end-of-workflow contract instead of a manual convention.
Prevent Lighthouse from leaving WSL-hostile Chrome profiles in the repository, safely remove only
proven regenerable residue, and reconcile the documentation and design-system catalog drift found
during the evidence-first audit.

---

## Backlog

### Frontend

- [x] `F1` Reconcile the historical ALCHIMIA lab with the current infraege public identity and add
  every current public visual export to the component catalog without restoring a retired public
  asset — _Depends on:_ —
- [x] `F2` Update focused design-system tests to prove the historical source contract and complete
  catalog coverage — _Depends on:_ F1
- [x] `F3` Reconcile the Change 79 public-migration matrix and stale widget-label assertion with
  the current low-level visual contracts and live infraege header — _Depends on:_ F1

### Infra

- [x] `I1` Harden the allowlisted cleanup script with a non-mutating check mode, remove the unsafe
  whole-`apps/ops` target, and preserve dependencies, environments, secrets and data — _Depends on:_ —
- [x] `I2` Add a repository-owned LHCI wrapper that creates an external temporary Chrome profile,
  cleans it on every exit path and leaves reports available until terminal cleanup — _Depends on:_ I1
- [x] `I3` Extend cleanup and Lighthouse contract tests, expose `make clean-check`, and route the
  existing performance audit command through the wrapper — _Depends on:_ I1, I2

### Other

- [x] `T1` Remove the currently confirmed allowlisted artifacts and empty untracked review
  directory, then verify no protected paths were touched — _Depends on:_ I1, I3
- [x] `T2` Add the terminal repository-hygiene rule to agent, stack, work, ship and contributor
  documentation, including the prohibition on broad ignored-file deletion — _Depends on:_ I1, I3
- [x] `T3` Reconcile SPEC roadmap status with archived Changes 95–97 and record the audit
  classifications that prevent false-positive source deletion — _Depends on:_ F1, T2
- [x] `T4` Delete only merged local feature branches 94–97 after a fresh reachability check; do
  not alter remotes, push or deploy — _Depends on:_ T1
- [x] `T5` Raise the enforced median LCP ceiling to 4000 ms, retain 2800 ms as the future
  tightening target, and synchronize the executable contract, tests and documentation —
  _Depends on:_ I3

---

## Files

### Create / modify

~~~
AGENTS.md
README.md
Makefile
package.json
lighthouserc.cjs
scripts/clean-local-artifacts.sh
scripts/run-lighthouse-audit.sh
scripts/tests/clean-local-artifacts.test.sh
scripts/tests/run-lighthouse-audit.test.sh
apps/web/src/pages/design-system-lab/components-catalog.tsx
apps/web/src/pages/design-system-lab/system-catalog.tsx
apps/web/src/pages/design-system-lab/widgets-catalog.tsx
apps/web/tests/design-system-lab.test.ts
docs/artifacts/alchimia-public-migration-matrix.md
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/playbooks/work.md
docs/playbooks/ship.md
~~~

### Do NOT touch

- Application API, data schemas, lesson/course authored content and production infrastructure
- Dependencies, `node_modules`, `apps/api/.venv`, env/secret files, databases and Docker volumes
- Historical change archives and referenced brand/design evidence
- Remote branches, remote repositories and deployed services

---

## Contracts

See `docs/SPEC.md` §3–§4 (and §5–§8 where relevant) and the Files list above. Do not hand-copy the
schema, endpoints, types, or env vars into this file — the codebase and `SPEC.md` are the source
of truth; this file only tracks what to build and what's left.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with `--full` or `--release`. All gates are defined in [docs/STACK.md](../../STACK.md) — this section
> only records change-specific overrides.

The real Lighthouse audit enforces median LCP ≤4000 ms while preserving ≤2800 ms as the future
tightening target. Its hygiene acceptance also requires that the wrapper removes the external
profile and creates no literal `C:\Users\...\lighthouse.*` repository root.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The cleanup removed about 46–48 MiB of ignored reports, outputs and caches plus the empty
  untracked `docs/artifacts/reviews`; dependencies, environments, env files and data survived the
  protected-path checks. Local branches 94–97 were deleted only after each was proven reachable
  from `main`; their commits and remote refs were not altered.
- Fallow's remaining cleanup signals are retained false positives: `lighthouserc.cjs` is loaded by
  LHCI convention, `@lhci/cli` is invoked through the shell wrapper, and the reported exported
  types/CSS Modules have public or composition consumers. Existing lab assembly duplication and
  complexity hotspots are outside this hygiene change.
- The initial real six-run Lighthouse diagnostic created no literal Windows profile and left no
  external `/tmp` profile. It measured median LCP of 3615 ms on `/` and 3914 ms on
  `/ege/16-rekursiya`; that evidence prompted the architect-approved 4000 ms enforced ceiling while
  2800 ms remains the explicit future tightening target rather than a claim that LCP was optimized.
- The repeated build plus six-run audit passed the 4000 ms assertion with median LCP of 3616 ms on
  `/` and 3915 ms on `/ege/16-rekursiya`. The wrapper contract test pins both the numeric ceiling and
  `median` aggregation so later config drift cannot silently change the accepted contract.

---

## Commit Message

```
feat(change-98): enforce repository hygiene and reconcile audit drift
```
