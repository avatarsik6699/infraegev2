# CHANGE 94 — Repository Reconciliation and Cleanup

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `94` |
| Slug | `repository-reconciliation-and-cleanup` |
| Title | Repository Reconciliation and Cleanup |
| Status | `active` |
| Branch | `feature/94-repository-reconciliation-and-cleanup` |

---

## Goal

Audit the current repository as one system: reconcile documentation, application code, content
contracts, CI/deploy metadata and generated/dependency state; classify every finding before acting;
and remove only proven obsolete code, files, ignored tool residue and merged local Git refs. Keep
product behavior, authored content, production runtime, protected data and historical evidence
unchanged while leaving a clean, internally consistent checkout.

---

## Backlog

### Backend

- [x] `B1` Compare FastAPI settings/routes/models, task loading/checking, OpenAPI output and tests
  with `docs/SPEC.md`, `docs/STACK.md`, root scripts and the generated frontend contract; record
  and fix only confirmed existing-contract drift, without adding schema, API or product behavior
  — _Depends on:_ `T1`
  **Baseline findings:** generated OpenAPI, Ruff, Pyright and content checks pass, but the real
  `POST /api/client-errors` contract is absent from `SPEC.md` §4; `httpx` is test-only while listed
  as a runtime dependency, and unused `pytest-asyncio` remains in the dev group.

### Frontend

- [x] `F1` Run whole-project Fallow dead-code, dependency, cycle, complexity, duplication, CSS and
  graph-grounded review; trace every removal candidate through executable imports, framework
  conventions, generated/public contracts and CSS Modules composition, then remove or narrow only
  proven obsolete frontend code/dependencies/styles — _Depends on:_ `T1`
  **Baseline findings:** Fallow reports two convention/composition-loaded false-positive files,
  26 generated or deliberate public namespace types, two local type-export candidates, zero
  unused dependencies/cycles/unresolved imports, zero threshold complexity findings, and 19 clone
  groups (1.59%) dominated by intentional font, Topic/Course, lab and E2E repetition.
- [x] `F2` Compare public routes, registries, lesson/course contracts, SSR/no-JavaScript behavior,
  platform boundaries, design tokens and focused tests with `docs/SPEC.md` and
  `docs/FRONTEND.md`; fix only demonstrated architecture or contract drift and preserve authored
  lesson/task content — _Depends on:_ `F1`
  **Baseline findings:** `/lab/design-system` renders the current font tokens but labels and
  explanatory copy still name the superseded Cormorant SC/Literata/IBM Plex Mono roles instead of
  Alegreya/Golos Text/JetBrains Mono.

### Infra

- [x] `I1` Inventory tracked, untracked and ignored paths and run `make clean-dry-run`; approve the
  repository allowlist from evidence, execute `make clean`, and prove caches/build outputs/tool
  reports are gone while dependencies, environments, secrets, databases and tracked evidence
  remain — _Depends on:_ `T1`
  **Baseline findings:** the allowlist covers `.lighthouseci`, root/web outputs, 24 malformed WSL
  Lighthouse directories and Python/ESLint caches, but misses the 1.1 MiB `apps/web/.fallow`
  cache. Dependencies, local settings, protected env and data are outside the allowlist.
- [x] `I2` Compare Make targets, Docker/Compose definitions, GitHub workflows, lockfiles and
  deploy/gate documentation; reconcile confirmed command, version, ownership or release-contract
  drift without changing production or weakening a gate — _Depends on:_ `T1`
  **Baseline findings:** live `production` has no protection rules and `can_admins_bypass=true`,
  while several current docs still require reviewer approval; the API dev/image inputs still
  carry an obsolete full `content/` tree and unused Telegram variables although only tasks are a
  backend runtime contract.
- [x] `I3` After read-only reachability and stash inspection, delete only merged obsolete local
  feature refs and unneeded stashes; preserve `main`, the active Change 94 branch, remote refs and
  every commit — _Depends on:_ `I1`, `I2`
  **Baseline findings:** local `feature/88-*` through `feature/93-*` are merged into `main`; no
  unmerged branches or stashes exist.

### Data

None

### Other

- [x] `T1` Freeze the audit baseline across Git status/history, active/archive change lifecycle,
  repository tree and sizes, docs links/claims, source/content counts, dependencies, generated
  contracts, CI/deploy metadata and current cleanup candidates before any deletion — _Depends on:_ —
  **Baseline findings:** local `main`, `origin/main` and live production all resolve to `a5b0bf5`;
  the source contains 2 published Topic lessons, 28 published Course lessons and 150 tasks.
  Confirmed residue includes redundant `.gitkeep` files, two obsolete empty content directories,
  npm-init-only root manifest fields and the superseded unreferenced
  `docs/artifacts/final_logo.svg`.
- [x] `T2` Reconcile README, PRODUCT, SPEC, STACK, FRONTEND, KNOWN_GOTCHAS and current change
  lifecycle wording with the verified implementation and workflow truth; preserve immutable
  archived history and distinguish historical evidence from current state — _Depends on:_ `B1`,
  `F2`, `I2`
  **Baseline findings:** SPEC/STACK still name removed JSON-topic validation fields and an old lab
  typography profile; eight archived change files have broken relative `STACK.md` links because
  the template and ship archive step do not account for the extra directory level. Historical
  unchecked items in Changes 13, 21 and 92 remain historical record, not active Backlog.
- [x] `T3` Re-run the repository-owned consistency checks, Fallow analyses and affected-area
  Critical Gate; leave every retained signal explicitly classified and report residual risks or
  external/manual evidence that cannot be proven in this checkout — _Depends on:_ `B1`, `F2`,
  `I1`, `I2`, `I3`, `T2`

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate. -->

---

## Files

### Create / modify

~~~
README.md
PRODUCT.md
docs/SPEC.md
docs/STACK.md
docs/FRONTEND.md
docs/BRAND_ASSET_REQUIREMENTS.md
docs/CHANGE_TEMPLATE.md
docs/KNOWN_GOTCHAS.md (only for a newly confirmed recurring pitfall)
docs/playbooks/plan.md
docs/playbooks/ship.md
docs/runbooks/production-onboarding.md
docs/runbooks/production.md
docs/changes/94-repository-reconciliation-and-cleanup.md
Makefile, package.json, pnpm-workspace.yaml and lockfiles (only for confirmed contract drift)
.github/workflows/** (only for confirmed CI/release drift)
infra/**, ops/** and scripts/** (only for confirmed existing-contract drift)
apps/api/** and apps/web/** (only for confirmed existing-contract or dead-code findings)
allowlisted ignored build/cache/tool artifacts (delete through make clean)
merged obsolete local feature refs and unneeded stashes (delete after reachability proof)
~~~

### Do NOT touch

- Authored CourseLesson/TopicLesson narratives, task statements/answers, ids, associations,
  publication state, mastery thresholds or progress/storage semantics
- Approved logo/reference sources, generated public brand assets and retained audit/release evidence
- Production runtime, production/operations volumes, protected environments, secrets or databases
- Remote branches, published Git history or archived change content/status; clerical relative-link
  repairs in Changes 86–93 are allowed without rewriting their historical claims
- Dependency/tool versions, public API, security policy or gate strength without a separately
  proven existing-contract mismatch

---

## Contracts

See `docs/SPEC.md` §3–§7, `docs/FRONTEND.md`, `docs/STACK.md` and the Files list above. This change
reconciles current implementation and documentation and removes proven residue; it does not
authorize new product behavior, content editing, schema/API expansion, production mutation or
release publication.

---

## Gate Checks

Use one affected-area Critical Gate for the complete `/work 94` target set, plus the existing
repository-owned reconciliation checks that directly cover confirmed edits:

```bash
bash scripts/tests/clean-local-artifacts.test.sh
pnpm validate:content
pnpm api:check
```

Run Fallow with JSON/quiet output before and after cleanup. Every deletion candidate requires a
trace or equivalent direct consumer proof; do not auto-fix an unclassified finding. Browser/LSP
evidence is mandatory only if the audit changes frontend behavior/source or Python/TypeScript code.
The Full and Release Gates remain outside this change's `/work` run. All gate definitions are in
[docs/STACK.md](../STACK.md).

---

## Architect Review Notes

- [x] No architect review issues recorded

---

## Implementation Notes

- Whole-project Fallow retains 29 classified signals: convention-loaded `lighthouserc.cjs`, a CSS
  Modules `composes` source and deliberate generated/namespaced public types. The changed-code
  audit passes with zero introduced dead code, complexity or duplication findings; all three
  graph-review judgments were accepted against the live graph.
- Archived unchecked items in Changes 13, 21 and 92 remain immutable historical status, not active
  work. Only broken relative links in Changes 86–93 were repaired.
- External GitHub settings were inspected read-only. A repository-level duplicate
  `PROD_ROOT_PASSWORD` and an unused production Environment variable `VITE_FEEDBACK_URL` remain
  candidates for a separately authorized remote-settings cleanup; no secret value was read or
  changed.
- FastAPI's current TestClient emits one upstream deprecation warning asking for `httpx2`; the
  existing pinned environment remains green, so dependency migration was not guessed without a
  separate verified library-compatibility change.

---

## Commit Message

```
chore(change-94): reconcile repository contracts and remove proven residue
```
