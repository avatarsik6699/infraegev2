# Verification and release evidence

Use one deterministic runner for local checks. Models select the intended scope,
interpret failures and review behavior; they do not reconstruct a long shell sequence
for every change. STACK defines the coverage obligations; the runner executes them.

## Scope and risk

Critical runs once per complete `/work` target set, then at local `/ship`. Run focused
tests during implementation when they answer a concrete question. Do not replay a
gate for every checkbox or every small visual adjustment. Required browser/LSP evidence
and unchecked review notes still matter; a command exit code cannot replace them.

Release compares the whole candidate against the last independently verified production
SHA. Read current public health, confirm that SHA belongs to the repository, and supply
the full SHA as the baseline. Local `main` is not a production baseline. If production
cannot be identified, choose Full and resolve the target-health failure before deploy.

| Area | Release coverage |
|------|------------------|
| Ordinary documentation | Format and fresh security |
| Known host operations scripts | Format, host checks, relevant operations contracts, fresh security |
| Web implementation | Web build, unit/E2E including accessibility, performance, fresh security |
| API implementation | API checks, migrations where selected, contract drift, integration/E2E, fresh security |
| Content | Canonical content/assets validation and affected consumers |
| Shared dependencies, infrastructure, gate policy, unknown inputs or missing baseline | Full |

The printed runner plan is authoritative for the actual path classification and union
of affected areas. Conservative fallback is expected for unrecognized paths. Never
silently omit a path to obtain a cheaper plan. Critical can record a reviewed scope
decision with a reason and explicit focused tests; release fallback cannot be overridden
that way. Explicit `/ship --full` remains available.

## Local execution

```bash
python3 scripts/gate.py plan --profile critical --base main
python3 scripts/gate.py plan --profile full --base main
python3 scripts/gate.py plan --profile release --base <verified-production-40-char-sha>
```

Inspect the selected commands and prerequisites before changing `plan` to `run`.
Pass focused tests explicitly for changed behavior with `--test NAME=COMMAND`.
Commands are trusted operator input, not an API for untrusted users; do not put credentials
in them. Use the command's `--help` for prepared-environment and resume options.

For reviewed host-tool changes with paths the automatic selector cannot prove safe, use
`--reviewed-scope ops --reason 'concrete coverage rationale'` plus explicit `--test` arguments.
This applies only to Critical; it preserves the original path classifications in the report.
Do not use it to bypass release fallback. Run `resume` with the same profile, base, scope
and test arguments; mismatches fail instead of reusing another plan's evidence.

Full and database/browser-dependent profiles require the isolated environment in STACK.
Preparing the database and importing a local bank is a separate explicit step; the runner
does not discover production credentials, bootstrap production or import production data.
Never pass a production database URL to local checks.
After the documented bootstrap, health and seed validation, pass `--prepared-environment`.
The runner additionally rejects non-development environments and database URLs outside the
declared loopback port/role/database boundary. This flag is an operator attestation of the
bootstrap and seed checks, not automated proof that those manual prerequisites happened.

The runner writes protected JSON under `$XDG_STATE_HOME/infraegev2/gates`, defaulting to
`~/.local/state/infraegev2/gates`. It records status, elapsed time, selected checks and input
identity. These files survive repository cleanup and a pause until tomorrow. Keep required
human observations separately; JSON is evidence about command execution, not every aspect
of readiness. Do not commit local reports or credentials.

Resume reuses only successful steps whose complete recorded inputs still match. Changed
source, command selection, relevant environment or tools invalidate reuse. Failed and
interrupted steps rerun. Artifact-dependent stages also require their output; cleanup can
force a rebuild. Current security is required for every release attempt. Exact-input resume
does not claim that a PASS on one source revision proves another revision.
Database, live-service, browser and performance steps rerun on resume because source/tool
hashes do not establish their external state. Static checks and a verified build can be reused;
this implementation does not maintain a cross-revision result cache.

The build is executed once before performance; performance uses that same output. Complete
E2E already includes accessibility, so a separate `audit:a11y` is unnecessary in that run.
The focused accessibility command remains useful when complete E2E is not selected.

On failure, inspect the failing contract rather than restarting Full blindly. Stop dependent
work, fix the issue under `/work`, and re-plan. On cancellation, terminate the runner's owned
process group; do not kill unrelated browser/Docker/user processes. After analyzing results,
inspect `make clean-dry-run`, run `make clean`, then `make clean-check`. Durable JSON stays outside
that allowlist; repository artifacts do not stay merely to make a later run look faster.

## Publication and resume

There are three distinct evidence boundaries:

1. **Before push:** selected local coverage, fresh security, final source reconciliation,
   production Compose render, current target health, GitHub environment/access/secrets policy.
2. **After push, before deploy:** successful CI and images workflows for the exact published
   SHA. `images.yml` scans all three actual published digests and produces SBOM/provenance.
   This is the mandatory image scan. `pnpm audit:images` is an optional local diagnostic.
3. **After deploy:** successful workflow targeting the requested SHA plus independent public
   readiness returning that SHA and a successful homepage response.

A successful push or a green workflow alone is not deployment acceptance. A failed post-push
check blocks dispatch; it cannot retroactively mean that nothing was pushed. Report the phase
actually reached. Release checkpoints are read-only observations, never instructions to repeat
push, dispatch, import, restore or migration.

```bash
python3 scripts/release-checkpoint.py predeploy --sha <published-40-char-sha>
python3 scripts/release-checkpoint.py postdeploy --sha <deployed-40-char-sha>
```

The utility fetches fresh GitHub/public observations each time and stores them under
`$XDG_STATE_HOME/infraegev2/releases` (default `~/.local/state/infraegev2/releases`).
It requires completed successful scan steps for web, API and Nginx. The deploy workflow's
evaluated `Deploy <sha>` run name proves its dispatch target; `head_sha` alone identifies
the workflow ref and is insufficient. Older runs without this marker require manual
historical investigation rather than an automatic checkpoint PASS. The checkpoint records
workflow and scan-step evidence, not independently extracted OCI digests.
The default observation target is `https://infraege.ru`. Explicit endpoint overrides select
an operator-owned alternate environment and are recorded in the checkpoint; they do not prove
the default production target. Health/home must share an HTTPS origin and neither may redirect.

When resuming, inspect saved run IDs and fetch fresh workflow/production state. If a matching
deploy is already running, observe it. If it succeeded, verify public state. If it failed,
diagnose before another dispatch. Bank transfer and rollback remain separately authorized
operations, not retry steps. State files retain only non-secret release evidence outside Git.

## Measurement

Compare wall time and actual command executions before/after, counting retries and reused steps.
Separate environment recovery from application validation. Agent model/cost measurement follows
[agent workflow](agent-workflow.md); do not infer tokens or charges from gate duration.
