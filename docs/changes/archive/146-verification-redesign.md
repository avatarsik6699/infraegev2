# CHANGE 146 — Simplify SDD and delivery

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `146` |
| Slug | `verification-redesign` |
| Title | Simplify SDD and delivery |
| Status | `archived` |
| Branch | `feature/146-verification-redesign` |
| Source | Architect's explicit simplification request, 2026-09-26 |

## Goal

Make this ordinary educational platform quick to develop and release. Keep sufficient checks for
learning, accounts, data and deploy safety; stop building a custom verification platform.
Prefer fewer executions and clear ownership over optimizing an unnecessarily large suite.

This revision supersedes the original 146 infrastructure plan: daily audits, mandatory Lighthouse
on styles, compatibility Full, evidence platform and snapshot scheduler are cancelled requirements.
Earlier work is a sunk cost, not a reason to finish it. The earlier
[research](../../artifacts/sdd-verification-redesign-2026-09-26.md) and
[pilot](../../artifacts/verification-pilot-146.md) are historical inputs, not current obligations.

Planning did not authorize push/deploy or activate workflows. The architect resumed the remaining
simplification implementation after T8 preparation. Keep the same change and branch; reconcile
transitional STACK/playbook instructions without running superseded 146 rollout steps.

## Architecture decisions

1. Keep GitHub Actions, package scripts, Compose, pytest, Vitest and Playwright. No new CI service,
   Nx/Turborepo/Bazel migration, custom scheduler, runtime snapshots or artifact store.
2. Local execution is sequential by default; independent CI jobs use native parallelism.
   Cache dependencies with package managers/CI, not the validity of test results.
3. Keep `scripts/gate.py` only as a thin convenience selector for explicit command groups.
   Remove 146 platform additions; do not restore an old automatic Full fallback.
   A small area table and explicit coverage decision are enough; no exhaustive ownership graph.
4. Full is explicitly requested functional regression, never an automatic response to uncertainty,
   shared files or release. Heavy audits are separate weekly/manual commands.
5. Preserve useful product fixes and tests, especially the real browser → API → DB account journey.
6. GitHub logs/artifacts and standard Actions notifications suffice. No audit importer, freshness
   ledger, custom sidecar protocol, notification service or forced failure-probe job.
7. Preserve the shipped exact-SHA release path. Do not add the new source-tree/host attestation
   chain or periodic deployed/rollback-image inventory. Existing image scan/SBOM/provenance remain.
8. Keep local ship separate from release, explicit mutation authority, rollback, backup and the
   exceptional first-account-schema cutover proof.

## Target check matrix

This defines the target, not current executable behavior. STACK will own concrete commands.

| Event | Required | Not required by default |
|-------|----------|-------------------------|
| Plan / status / pause / continue | Relevant context and scope | Gates, remote audit fetch, environment boot |
| Implementation iteration | Focused test/diagnostic answering a concrete question | Gate per file, checkbox, worker or chat turn |
| Completed coherent work set | One affected Critical: relevant format/lint/types, behavior tests and targeted UI observation | Full suites, Lighthouse, full SAST/config/history, image build |
| Local ship | Unresolved acceptance and changes since checked work; only missing/invalidated checks | Repeating unchanged Critical or automatic Full |
| Ordinary CI | Applicable static quality, affected content/API checks, publication secrets check | Broad scanners on unrelated changes, browser/DB suites, duplicate build |
| Release | Missing affected checks, new-commit secrets, changed-dependency audit, applicable auth/schema/config checks, exact-SHA quality/images + digest scan, deploy and fresh health/smoke | Universal local Full, Lighthouse, full E2E/security suite, second local image build/scan |
| Weekly/manual audit | SAST/config, runtime/dev dependency audit, full reachable secret history; broad browser/no-JS/a11y/layout and Lighthouse | Local report import, freshness token, daily inventory |
| Explicit Full | Full local functional regression and owning operations contracts; one needed build/browser suite | Implicit security/performance audits; request those commands explicitly |

### Affected-area selection

- Docs: changed links/structure and applicable formatter only (Markdown currently excluded).
  No app install/compiler/DB/browser merely for documentation.
- Content: content validation and affected rendering/SSR. No complete site crawl for a text fix.
  Existing factual/editorial publication acceptance remains.
- UI: web lint/types and owning tests; inspect the changed interaction on relevant viewports.
  Shared layout/control changes cover representative consumers and relevant no-JS/a11y/layout.
  CSS/fonts alone do not select Lighthouse; a suspected performance regression or explicit
  performance task does require a focused measurement.
- API: API lint/types and owning tests; OpenAPI regeneration/drift only for changed public contracts.
- Auth/session/permissions/progress: owning negative/isolation tests and real account integration
  before releasing those changes, preserving guest availability.
- Schema/data: isolated migration/restore and permissions checks for the actual transition.
  Cutover rehearsal is not a prerequisite for every code release.
- Dependencies/containers: changed ecosystem audit, affected consumers and owning build/config
  checks; new published images are scanned once in the existing images workflow.
- Host/deploy/policy scripts: owning lint/types and fake contracts; real boundary acceptance only
  where that boundary changes. A Bash restore fix does not select Lighthouse.
- Unknown/shared inputs: inspect and record coverage; ask if genuinely risky and unclear.
  Never silently omit them or automatically launch Full.

### Work → ship without duplicate execution

Record a short note in the change: checked revision/diff, commands, results and skips. Before ship
compare relevant source/tests/config/locks with the checked work. Unchanged acceptance within the
same verified handoff is not repeated. Archive metadata alone does not invalidate product checks.
Changed inputs, missing evidence or uncertain environment require only the affected check again.
After a long interruption or uncertain dirty-tree identity, rerun the small affected set.

This is explicit review, not a new hashing/cache subsystem. No saved result proves live production
health or current vulnerabilities. Do not edit source during its acceptance run; do not build
snapshot infrastructure to permit concurrent mutation. One parent owns the final check set.

### CI and release ownership

- Prefer PR and main quality runs rather than duplicate feature-push + PR runs. Feature-branch
  validation remains manually available. Required status names/settings must be preserved or
  coordinated during separately authorized activation.
- Use a few explicit areas, not a perfect impact engine. Required workflows must not be stranded
  Pending by path filtering. If filtering requires substantial custom code, run the small static
  job instead. Unknown changes remain visible.
- Use native dependency caches and cancel obsolete quality runs, never an active deploy. Preserve
  serialized deploy and rollback.
- Images owns release build/scan. Remove duplicate quality web build where images supplies the
  release compilation check. Keep local build when a selected production-mode test needs it;
  one build feeds smoke/layout and any explicitly selected Lighthouse.
- Preserve baseline exact-SHA CI/image verification and published digest scan/SBOM/provenance.
  Retain the shipped read-only release checkpoint if useful, without new 146 audit/manifest coupling.
- Check new unpublished commits for secrets BEFORE push, including intermediate commits.
  Resolve an unknown publication range explicitly. CI checking is defense in depth, not a substitute.
- Dependency audit is required for changed dependencies; broad SAST/config is weekly, with targeted
  delivery checks for changed trust boundaries/config. Do not waive missing required checks.
- First account release still needs its specific candidate cutover/restore, mail/provider and
  environment acceptance. That exceptional obligation is not an ordinary full-regression requirement.

### Weekly audits and response

Keep at most the two proposed workflow files, simplified to direct commands:
`audit-security.yml` Tuesday 04:23 UTC and `audit-browser.yml` Tuesday 03:23 UTC, both manual too.
No daily jobs, monthly special workflow, deployment inventory or freshness TTL protocol.

Security covers main repository/locks. Deployed/retained rollback images are NOT continuously
inventoried/scanned. New candidate images remain scanned; an incident can prompt an explicit scan
of a deployed digest. This consciously accepts a detection interval between weekly audits.
Full reachable secret history is weekly; new unpublished commits are still checked before push.

Browser jobs use disposable synthetic data on a host runner. Production Lighthouse is separate,
read-only and clearly labelled, without account credentials/writes. Ordinary pytest/Vitest/DB suites
stay local/manual under existing policy; this plan does not silently move them into CI.
Retain native reports, target SHA or public URL/time, exit status, redaction and failure-only traces.
Synthetic-main results are not production proof. Complete E2E must not run a11y twice.

Architect/operator reviews results weekly through standard GitHub Actions notifications. Notice a
missed run during that review and rerun manually; absence is not green. Confirmed critical account/
data problems or applicable candidate-image vulnerabilities block affected release. Noncritical
quality/performance findings enter ordinary Backlog. Scanner/setup errors are distinct from findings;
they require attention but do not cause Full on unrelated work.

After separately authorized publication, run each normal audit once, inspect reports and confirm
notification settings/schedule actor. No custom deliberately failing probe is required.
Until activated, state 'not activated' and keep an explicit weekly/manual operator responsibility,
not 'repeat every heavy check on every release'. Record activation handoff without claiming delivery
proof. Local closure need not wait for remote authorization.

## Backlog

### Backend

- [x] B1 Retain simple pure/DB test separation and fixture fixes; verify collection does not omit owning tests or weaken password settings. No execution framework. — _Depends on:_ I14

### Frontend

- [x] F1 Retain direct browser commands/tags for smoke, account and broad audits; remove duplicate collection/a11y runs and unnecessary config layers without losing assertions. — _Depends on:_ I14
- [x] F2 Retain browser → API → isolated DB account acceptance with synthetic mail, guest checking, verified login, context isolation and logout; decouple from removed platform modules. — _Depends on:_ F1, B1
- [x] F3 Retain production smoke/layout and one-build consumption. Use native retry reporting; an auth/data failure cannot be accepted because a retry passed. No custom FLAKY_PASS protocol. — _Depends on:_ F1
- [x] F4 Preserve the verified toolbar loading-geometry fix with unchanged <1 px tolerance and interaction motion. Do not revert it with infrastructure. — _Depends on:_ —

### Infra — replacement tasks

- [x] I14 Remove 146 scheduler/snapshots, artifact retention, generic preflight, registry/evidence engine and audit importer. Reduce selector to plain groups; keep cheap readiness inside owning launchers. Reconcile all imports/CLI/registries/tests. — _Depends on:_ T5
- [x] I15 Simplify quality to direct static commands, basic affected areas, nonduplicated triggers/build ownership and native caches/concurrency. Keep ordinary test suites local. — _Depends on:_ I14
- [x] I16 Simplify security/browser workflows to weekly/manual direct commands and native reports/notifications; separate delivery checks from broad audits. Remove sidecar protocol/audit runner/probe job. — _Depends on:_ I14, F2, F3
- [x] I17 Remove 146-only release inventory/manifests/source-tree/host-attestation code and workflow hooks. Preserve baseline exact-SHA checks, digest scan, serialized deploy, health, rollback and first-cutover protection. Resolve consumers before removing producers. — _Depends on:_ I14
- [x] I18 Keep only useful narrow cutover fixes/drill: exact Restic candidate, installed offline Alembic, stdin assertion, second restore, owned cleanup. No production run or generic rehearsal framework. — _Depends on:_ I17

### Other

- [x] T5 Reconcile SPEC/STACK, AGENTS/CLAUDE, playbooks, verification/agent runbooks and conflicting wrappers with this revision: no mandatory audit fetch, automatic Full, duplicate ship gate or per-checkbox ceremony. Compiler is binding; LSP supplementary. Keep relevant reads and one short change, not a new governance framework. — _Depends on:_ —
- [x] T6 One integration review and one affected Critical on the reduced implementation; prove cases below primarily with fake command contracts. Record retained acceptance and activation handoff. No Full or parallel shadow execution. — _Depends on:_ B1, F1, F2, F3, I14, I15, I16, I17, I18
- [x] T7 Lightweight timing baseline and command handoff; observe up to five subsequent real changes opportunistically. No benchmark infrastructure or waiting for future changes to close 146. — _Depends on:_ T6
- [x] T8 Configure native Codex multi-agent routing before resuming 146: project roles/models, bounded delegation, launcher and handoff; verify config loading and a read-only delegation smoke. Authorized by the architect on 2026-09-26 from `docs/artifacts/multiagents.md`. Preserve the existing dirty tree; no implementation of the remaining simplification tasks in this preparation step. — _Depends on:_ —

### Superseded original tasks — removed, not completed

Stable IDs remain for history; these are not executable Backlog items.

- ~~I1~~ (removed): fixed Check platform → plain commands, I14.
- ~~I2~~ (removed): mandatory registry IDs in every profile → explicit acceptance, T5/I14.
- ~~I3~~ (removed): exhaustive impact map → small area table/review, I15.
- ~~I4~~ (removed): per-check fingerprint/evidence engine → short work/ship handoff.
- ~~I5~~ (removed): hermetic runtime evidence reuse → ordinary selected runtime tests.
- ~~I6~~ (removed): artifact cache/LRU/TTL/pins → native dependency caches only.
- ~~I7~~ (removed): generic environment preflight → launcher-owned prerequisites, I14.
- ~~I8~~ (removed as original scope): expanded cutover framework → narrow I18.
- ~~I9~~ (removed as original scope): scanner identity/TTL protocol → direct cadence, I16.
- ~~I10~~ (removed): audit import/checkpoint/activation platform → thin workflows, I16.
- ~~I11~~ (removed): new immutable release-attempt ledger → baseline release checks, I17.
- ~~I12~~ (removed): new manifest/source-tree/host proof chain → baseline release checks, I17.
- ~~I13~~ (removed): parallel immutable snapshots/runtime copying → sequential local commands.
- ~~T1~~ (removed as original scope): old compatibility rollout → T5.
- ~~T2~~ (removed): automatic evidence reuse across SDD → explicit handoff, T5.
- ~~T3~~ (removed): platform shadow-plan/acceptance programme → bounded T6.
- ~~T4~~ (removed): installed five-change pilot → lightweight T7.

## Files and safe removal

Do not bulk-reset the dirty tree. Compare exact hunks with local main: distinguish shipped behavior,
new infrastructure and independent product fixes. Before implementation removes work, retain a
recoverable patch/copy of those exact 146 files outside tracked source, excluding unrelated user
artifacts. This is one-time recovery, not a new backup subsystem. No commit/merge outside ship.

| Disposition | Files |
|-------------|-------|
| Keep/reconcile acceptance | `apps/api/tests/**`, API pyproject; `apps/web/e2e/**`, Playwright configs, web scripts |
| Preserve F4 | `apps/web/src/features/lesson-practice/components/practice-task-answer.tsx` |
| Remove new gate/audit modules and owning tests | `scripts/lib/gate/{artifacts,retention,scheduler,preflight}.py`, `scripts/audit_runner.py`, `scripts/audit_checkpoint.py` |
| Remove new release platform and owning tests | `scripts/image_manifest.py`, `scripts/release_inventory.py`, `scripts/release_host_preflight.py`, `scripts/lib/release/**`, added images/deploy hooks |
| Simplify, not blindly restore | gate CLI/core/tests, security wrapper/tests, release checkpoint/tests, quality/images/deploy/audit workflows |
| Keep only needed launchers/support | `scripts/run-browser-portfolio.sh`, `scripts/run-isolated-browser-audit.sh`, `scripts/test-account-server.py`, cutover wrapper/lib and tests |
| Reconcile references | root/web package scripts, `scripts/pyrightconfig.json`, `scripts/check-shell.sh`, `lighthouserc.cjs`, command tests; Makefile only where needed |
| Policy | SPEC/STACK, AGENTS/CLAUDE, playbooks, verification/agent/production/backup runbooks where affected, conflicting wrapper descriptions |

Do NOT touch production, credentials, persistent DB/bank/files, provider settings, remote settings;
auth behavior/password strength/schema/API/visual budgets; immutable ordinary archives; unrelated
`docs/artifacts/smtp.txt` and the four reference images (do not read/copy/stage).
Do not remove shipped backup/data/deploy safeguards with the new infrastructure.
145's explicit waiver does not waive acceptance of the reduced 146 implementation.

## Implementation sequence and model handoff

T5 policy → I14 platform reduction → B1/F1–F3 retained acceptance → I15/I16 simple CI/audits →
I17/I18 release reduction/safeguards → T6 one final acceptance → T7 handoff.
Do not gate every stage or repair the cancelled snapshot/import mechanisms.

The architect subsequently authorized T8 first: native Sol/Luna/Astra routing from
`docs/runbooks/agent-workflow.md` supersedes the earlier Terra-only handoff. T8 is preparation;
remaining simplification implementation has resumed under the same change.
Use bounded workers with explicit file ownership, at most two concurrent children, no nested delegation.
The existing primary session cannot change its model through available tools; it owns coordination,
integration, final checks, cleanup and Git/release boundaries. Escalate consequential decisions or
repeated failed focused attempts rather than expanding the infrastructure.
This model choice is not itself permission to publish.

## Contracts

See SPEC §7–§8; product/account/data invariants in §3–§6 stay unchanged.

Native CI behavior checked through Context7 against GitHub documentation:
[events/schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
and [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).
Scheduled runs can be delayed/dropped and require the default branch; skipped path-filtered
workflows can leave required checks Pending. These limitations motivate the manual weekly owner
and stable required status, not a new monitoring platform.

## Acceptance

Prove selection cases with fake commands, not by running every heavy suite:

1. Docs completes without app setup/compiler/browser/security/Full.
2. A web copy/style change does not select Lighthouse or full E2E by default.
3. Auth/progress selects real account/isolation acceptance; schema selects owning migration/restore.
   First production cutover cannot bypass its special safeguard.
4. Host changes select owning contracts, not web/performance; unknown inputs require explicit review.
5. Unchanged work → ship does not repeat gate; relevant changed inputs require their checks again.
6. Release never invokes Full implicitly; intermediate-commit secrets and failed required image scans
   still block at the correct publication/deploy phase.
7. Missing weekly reports do not block unrelated work; known relevant critical findings remain blockers.
   Scan error and vulnerability finding are distinguishable.
8. Weekly workflows have no audit importer/inventory/production-write credentials; removed modules
   have no live imports/package/CI references.
9. One production build serves selected browser tests; full E2E does not repeat a11y.
10. Existing release SHA/health mismatch and no-implicit-redispatch contracts remain effective.

Run affected retained tests once where wiring/support changes; earlier PASS is historical.
Compiler/lint and narrow launcher contracts must pass, without rerunning unrelated product suites.
Finish implementation/testing with the existing reviewed cleanup allowlist, not a retention platform.

Timing goals are targets, not assertions or hard timeouts: routine warm local feedback about 1–3
minutes; auth/DB acceptance separately visible; no extra local full-suite wait before CI publication.
Record cold setup, checks and remote build/deploy separately. If slow, identify the dominant step
or duplicate work rather than write another orchestration layer.

Local done: replacement Backlog accepted, removed platform references absent, one affected Critical
passed, product acceptance preserved and command/activation handoff clear. Remote activation,
future changes and production release are not invented prerequisites for local closure.
Remote delivery still requires explicit authority and actual run/health evidence.

## Architect Review Notes

- [x] R1 Toolbar geometry resolved under F4. Four production layout scenarios passed without retry.
  Playwriter geometry/console observations were obtained; screenshot capture timed out and is not
  claimed as successful evidence. Preserve the fix and original tolerance.

## Historical checkpoints — not current acceptance

- 09:55 UTC, 2026-09-26: old registry audit passed 83 contract tests; real account, production smoke,
  39 no-JS and 11 accessibility scenarios passed. Layout still failed then. External report:
  `audit-20260926T095500.405523Z-47854-859db8ab6e9b.json`.
- 10:26 UTC: old reviewed Critical passed 11 checks/113 verification tests; F4/R1 had four passing
  layout scenarios. Report `critical-20260926T102511.632418Z-73976-d6c68db0d5be.json`.
  This is not Full/Release PASS or acceptance of subsequent edits.
- Snapshot attempts failed on workspace links, pnpm layout and Python runtime. Subsequent focused
  fixes do not prove useful end-to-end speedup; the mechanism is now cancelled.
- Later candidate-tree/host handoff, scanner sidecars, generic preflight and notification probe work
  is not a reason to keep those mechanisms. Integrated acceptance was not complete before this pivot.
- No push, workflow activation, production migration/deploy or source-tree production attestation
  occurred. Existing release/cutover obligations remain separate.

## Implementation Notes

- T8 acceptance (2026-09-26), scoped to `.codex/`, launcher and routing docs: TOML parse,
  `pnpm format:check`, `pnpm lint:shell`, scoped `git diff --check`, launcher cwd/argument
  forwarding and reviewed cleanup/check passed. Frozen install restored stale local pnpm metadata
  without lock changes. Codex 0.157.1 `exec --strict-config --ephemeral --sandbox read-only`
  loaded all six roles and reported one explorer completion `NATIVE_EXPLORER_OK` (thread
  `01a0dd77-7f2c-7181-a832-c0820e44efc4`). Catalog advertises Sol/Luna/Astra; this smoke is not a
  benchmark or a test of every model/role. Independent routing consistency check found no conflict.
  Start a new session to load roles, then `$work 146 T5` or `$work 146`; no remaining product,
  Full or release acceptance is claimed. Existing unrelated `scripts/security-gate.sh` trailing
  blank line remains outside T8's scoped diff check.
- F4 corrected the hidden loading label that changed button width. Visible label stays
  `Проверить`, busy accessible name `Проверяем`; observed mobile width 101.063 px before/during loading.
- This pivot accepts delayed discovery between weekly audits and removes automated audit freshness
  enforcement. Relevant product/candidate checks remain. No speedup percentage is claimed.
- The reduced local implementation passed the affected checks and independent review; no Full,
  real security scan, remote workflow activation, production cutover or release is claimed.
  Account traces are intentionally not uploaded in CI because they can contain verification
  links/session material; account failures remain visible in Actions logs and are reproducible
  locally with synthetic data. Standard GitHub Actions notifications are the weekly owner.

## Commit Message

`refactor(change-146): simplify SDD and delivery checks`
