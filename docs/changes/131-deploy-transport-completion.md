# CHANGE 131 — Deploy transport completion

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `131` |
| Slug | `deploy-transport-completion` |
| Title | Deploy transport completion |
| Status | `active` |
| Branch | `feature/131-deploy-transport-completion` |

## Goal

Prevent a successful SSH exit from concealing an incomplete deployment. During the authorized
release, streamed `bash -s` input was consumed by a child command after migrations; GitHub
reported success while the public application still served the old SHA. Continue the approved
release with a file-based remote entrypoint and independent public health verification.
SPEC remains unchanged; source brief is the release audit finding.

## Backlog

### Infra

- [x] I1 Upload the exact checked-out deployment script and execute it by protected absolute path with closed stdin; add an independent workflow check of public readiness SHA and home HTTP. — _Depends on:_ —
- [x] I2 Cover stdin-consuming subprocesses and wrong-SHA false success with host-only regression tests; document the transport failure. — _Depends on:_ I1

## Files

### Create / modify

- `.github/workflows/deploy.yml`
- `scripts/tests/deploy_orchestration_test.py`
- `docs/KNOWN_GOTCHAS.md`
- `docs/runbooks/production.md`

### Do NOT touch

Application UI/API, bank, schema, immutable archives and existing data volumes.

## Contracts

See `docs/SPEC.md` §7–§8 and the Files list above.

## Gate Checks

Standard [STACK](../STACK.md) gates apply. Focused test:
`python3 -m unittest scripts.tests.deploy_orchestration_test`.
Final release must pass through GitHub deployment and match public readiness SHA.

Critical Gate: format, Ruff, maintenance Pyright, Python LSP, nine host regression tests and allowlist cleanup PASS. No application/API changes.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Change 130's GitHub deploy run `35542291830` returned success prematurely; it is not deployment
  evidence. The exact reviewed script was resumed from its installed file and production activation
  completed on `262156bfe5cc37521796595453c3960acf3d38e3`; systemd restore passed afterward.

## Commit Message

```
fix(change-131): verify complete remote deployment
```

## Release verification

The architect paused and resumed the release. The interrupted Full Gate was discarded;
a fresh isolated gate uses `/home/niquetamerewsl/backups/infraegev2/gates/change-131-52s4fzls`.
Production bank remains intact: 697 tasks, 547 visible, 150 memberships and one file;
no repeat production import or schema change. Preserve old volumes and sibling operations.

Playwriter production acceptance at 262156b: desktop 1440px and mobile 390px lesson/practice
screenshots reviewed; answer 32 accepted; 40px return-to-top button brought the lesson heading
back into view; no horizontal main-content overflow. Exception `p is not a function` is attributed
by CDP stack to `chrome-extension://gcjikeldobhnaglcoaejmdlmbienoocg/content.js`, not application code.

Full Gate on 2026-09-21 PASS: formatting, isolated infrastructure/seed, operations contracts
(including nine deployment tests), migrations/no drift, backend 184, API drift, build/prerender,
frontend units 224, E2E collection/execution 81, smoke, accessibility 8, content/assets,
Gitleaks/Semgrep/Trivy and pnpm/pip audits. Lighthouse medians (LCP ms / CLS / TBT ms):
`/` 3158/0/0; `/ege` 3022/0/0; `/courses` 3166/0/0; `/courses/python` 3172/0/17;
`/ege/16-rekursiya` 3622/.008/101. All fifteen runs completed within enforced budgets.
