# CHANGE 44 — Cross-Repository Documentation Audit

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `44` |
| Slug | `cross-repository-documentation-audit` |
| Title | Cross-Repository Documentation Audit |
| Status | `active` |
| Branch | `feature/44-cross-repository-documentation-audit` |

---

## Goal

Audit the complete current documentation set against the shipped repositories and synchronize
infraegev2 with its first-party sre-kit boundary. Record the architect's accepted operating model:
root/password SSH is the primary VPS administration path for the current horizon, while operator
requisites, RKN notification and key-only SSH migration are explicitly deferred without a planned
delivery milestone. Finish with one dependency-ordered roadmap grounded in verified remaining gaps.

---

## Backlog

### Backend

None

### Frontend

None

### Infra

- [x] `I1` Inventory current documentation, shipped change history, repository structure and production-operation contracts; classify stale history, current truth and unresolved cross-repository gaps without changing runtime state — _Depends on:_ —
- [x] `I2` Synchronize current infraegev2 operational documentation with the completed split-stack cutover and remove obsolete prepared/temporary/legacy-active wording — _Depends on:_ I1
- [x] `I3` Make root/password SSH the documented primary administration contract for the current horizon, preserve its mitigations and accepted risk, and remove key-only migration from planned follow-up work — _Depends on:_ I1
- [x] `I4` Synchronize the six-Source sre-kit handoff, ownership boundary and current registration state with linked sre-kit Change 19 — _Depends on:_ I1

### Data

None

### Other

- [x] `T1` Normalize current documentation lifecycle metadata and repair internal contradictions or broken references found by the audit without rewriting immutable historical evidence — _Depends on:_ I1
- [x] `T2` Record operator requisites and RKN notification as explicitly accepted indefinite legal debt, outside the actionable roadmap until the architect reopens it — _Depends on:_ I1
- [x] `T3` Replace ambiguous milestone wording with one dependency-ordered post-audit roadmap covering cross-repository observability closure, learner-journey audit and later product expansion — _Depends on:_ I2, I3, I4, T1, T2
- [x] `T4` Run documentation format/link/consistency checks in both repositories and record any residual risks that cannot be resolved from repository evidence — _Depends on:_ T3
- [x] `T5` Restore the repository format gate by synchronizing stale pnpm lockfile override metadata without upgrading resolved dependencies — _Depends on:_ T1
- [x] `T6` Remove the last STACK wording that assigns six-Source runtime proof to documentation-only sre-kit Change 19 — _Depends on:_ I4, T3

---

## Files

### Create / modify

~~~
README.md
package.json
docs/SPEC.md
docs/STACK.md
docs/KNOWN_GOTCHAS.md
docs/FRONTEND.md
docs/INFRASTRUCTURE_BLUEPRINT.md
docs/playbooks/*.md
docs/runbooks/*.md
docs/changes/44-cross-repository-documentation-audit.md
ops/observability/sre-kit-sources.example.json
/home/niquetamerewsl/projects/sre-kit/README.md
/home/niquetamerewsl/projects/sre-kit/docs/*.md
/home/niquetamerewsl/projects/sre-kit/docs/changes/19-infraege-documentation-alignment.md
~~~

### Do NOT touch

- Application/runtime code, deployment configuration, protected credentials or live VPS state
- Archived change contents except narrow lifecycle-metadata corrections that remove false active state
- Destructive cleanup of legacy volumes, identities or data
- New product features, analytics events, third lesson content or key-only SSH implementation

---

## Contracts

See `docs/SPEC.md` §1, §7–§10, `docs/STACK.md`, the operations runbooks and linked sre-kit Change
19. Runtime behavior and public API/data contracts do not change in this documentation-only audit.

---

## Gate Checks

Documentation-only Critical Gate: repository formatting plus explicit Markdown link and
cross-document terminology checks. Do not run the Full Gate or mutate production.

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- The local sre-kit DB is stale, not clean registration evidence: it has five enabled records,
  misses uptime, never saw either SSH Source and last saw the three `ok` Sources on 2026-08-15.
  Reconciliation and fresh polling remain a separate follow-up runtime change after the linked
  documentation-only sre-kit Change 19.
- `pnpm install --frozen-lockfile` refreshed only local installed-dependency metadata after the
  format gate detected stale workspace override state; the tracked lockfile and resolutions did
  not change.

---

## Commit Message

```
docs(change-44): align operations docs and roadmap
```
