# Verification and release evidence

This project favors a short development loop over a custom verification platform. Use existing
package commands, GitHub Actions and release workflows; do not add a result cache, snapshot runner,
audit importer, evidence TTL ledger or command DSL.

## Local work

For one coherent `/work` set, choose the affected rows from STACK's Critical Gate and run them once:

- format where applicable;
- lint/type checks for modified workspace or maintenance script;
- focused test(s) that directly exercise changed behavior;
- browser observation for changed UI behavior;
- API generation only when the public API changed.

Record the reviewed revision/diff, command and outcome in the active change. At local `/ship`,
compare relevant source, tests, configuration and locks with that record. Do not repeat an unchanged
check. Re-run only the check whose inputs changed, evidence is missing, or environment is uncertain.
Runtime/browser/database checks are fresh when selected. A command result is not production proof.

Unknown impact requires a written coverage decision or a focused architect question. It does not
automatically invoke Full. Full is only `/ship --full`.

The thin selector is optional: `python3 scripts/gate.py checks` lists commands, and
`python3 scripts/gate.py run --group web-lint --group web-typecheck` runs only those groups. It
does not infer scope or cache a PASS. Use the owning package/test command directly when clearer.

## Scope reminders

- Docs: links/structure and relevant formatter only.
- Content: content validation and affected SSR/rendering.
- UI: web lint/types plus owning behavior; use focused no-JS/a11y/layout only when relevant.
  Lighthouse is weekly/manual or a specific performance investigation, not every CSS change.
- API: API lint/types and owning tests; OpenAPI only for public contract changes.
- Auth/progress: negative/owner-isolation coverage and real account integration before release.
- Schema/data: owning isolated migration/restore and permission checks.
- Dependencies: changed ecosystem audit; candidate images are scanned once by `images.yml`.
- Host scripts: owning fake contracts and relevant real boundary checks, not web performance.

## CI and periodic audits

Ordinary quality CI remains static and must not run normal pytest, Vitest, DB or browser suites.
Use native dependency caching and workflow concurrency; do not cache test validity. Avoid required
workflow path filters that can leave a check Pending.

`audit-security.yml` and `audit-browser.yml` run weekly and manually. They report directly through
GitHub Actions logs/artifacts and standard notifications. Security covers main repository/locks;
browser uses a disposable synthetic environment, while public Lighthouse is separately read-only.
A missed periodic run is noticed and rerun manually. It is not green and does not trigger Full for
unrelated work. A confirmed critical account/data finding or applicable candidate-image vulnerability
blocks the affected release; noncritical findings become ordinary Backlog work.

The first manual activation on 2026-09-26 used the published account-release SHA
`bb0c0aea936b2949faee415510a17c8930f676fd`: the browser audit passed, including isolated
synthetic journeys and public Lighthouse; the security audit failed at Git-history Gitleaks with
four findings, before SAST, config and dependency steps ran. This is not a security PASS and the
four findings, before SAST, config and dependency steps ran. A subsequent local triage confirmed
each was the exact SHA-256 of its public source task file in the historical migration snapshot;
the architect approved four value-and-path-specific Gitleaks exceptions. The local full-history
scan then passed, but that is not a retroactive PASS for the earlier remote run or for the steps
it never reached. Both workflows report through standard
GitHub Actions status/notifications; the repository can verify the run status and actor, not
whether an individual email was delivered. Future schedules remain Tuesday 03:23 UTC (browser)
and 04:23 UTC (security); inspect missed runs rather than assuming a PASS.
The local equivalents are `bash scripts/security-gate.sh weekly` and
`bash scripts/run-isolated-browser-audit.sh` (plus `INFRAEGE_LIGHTHOUSE_TARGET=production pnpm
audit:performance` for the separate public observation). These broad commands are not the routine
work/ship handoff.

## Release

`/ship --release` keeps the existing separation:

1. Run missing affected local checks and merge locally after the change is accepted.
2. Before pushing the final merged SHA, check its complete unpublished commit range for secrets
   and audit changed dependencies: `bash scripts/security-gate.sh pre-push FULL_BASE_SHA
   FULL_HEAD_SHA` and `bash scripts/security-gate.sh changed-dependencies FULL_BASE_SHA
   FULL_HEAD_SHA`. Resolve the actual full SHAs from the verified remote tip and checked-out
   candidate; missing or ambiguous range blocks publication. Push only under release authority
   after these checks pass.
3. Verify exact-SHA quality/images workflow results. Images owns digest scan, SBOM and provenance;
   do not duplicate it with a mandatory local image scan.
4. Dispatch deploy once for that exact SHA and verify fresh public health/readiness plus homepage.
   Never use saved local evidence as current production health or repeat a mutation automatically.
5. The first account-schema cutover retains its separate candidate restore/rehearsal, provider/mail
   and environment acceptance. It is exceptional, not a template for ordinary releases.

Finish after analysis with `make clean-dry-run`, inspect its allowlist, then `make clean` and
`make clean-check`. Do not use `git clean -fdX`.

## Lightweight timing check

The historical 2026-09-25 sample contained nine Full attempts and 3690.864 seconds of summed
command time; one successful attempt spent 482.768 seconds, including 187.300 on Lighthouse and
110.165 on E2E. These are neither delivery wall time nor a comparable post-change benchmark.
For up to five subsequent real changes, note the affected area, local work/ship wall time,
environment setup, browser runs, builds, repeats and any escaped defect in the change's ordinary
handoff. Record actual observations only; no new reports, timers, result cache, fixed benchmark
ceremony or wait for all five changes is required. Investigate a dominant repeated step before
adding orchestration.
