# Infrastructure blueprint for a small production web application

This document is a reusable starting point for another application built like infraege: one
public web entry point, application services and PostgreSQL in Docker Compose on a single VPS,
with private observability and deliberate operational gates. It is a design and acceptance
template, not an install script. The live infraege contracts remain in
[`SPEC.md`](SPEC.md), [`STACK.md`](STACK.md), and the project-specific
[`runbooks`](runbooks/production.md).

The blueprint extracts the stable decisions from changes
[`06`](changes/archive/06-production-platform.md),
[`07`](changes/archive/07-local-ops-lifecycle.md),
[`08`](changes/archive/08-production-env-safety.md), and
[`09`](changes/archive/09-umami-collector-path.md). Read
[`KNOWN_GOTCHAS.md`](KNOWN_GOTCHAS.md) when adapting the implementation; it contains symptoms and
fixes, while this document explains what must be designed and proved.

## 1. Fitness and limits

Use this baseline when all of the following are true:

- a small team can operate one Linux VPS and accept a maintenance window;
- Compose is sufficient orchestration and vertical scaling is still economical;
- the application can tolerate one failure domain for compute;
- administrative services can remain private through WireGuard;
- deploys are infrequent enough for approval-gated SSH delivery;
- the team is willing to perform restore and rollback drills, not merely create backups and
  rollback scripts.

Choose a different architecture when contractual availability requires multiple failure domains,
horizontal autoscaling, zero-downtime database maintenance, managed key custody, regional data
placement, or independent teams deploying many services. A single VPS is intentionally simple;
pretending it is highly available only hides risk.

## 2. Reference architecture and trust boundaries

```text
Internet
  |
  | 80/443 only
  v
Nginx on the application VPS
  |-- web runtime / static assets
  |-- API (private Compose network)
  |-- privacy-minimized analytics collector allowlist
  `-- public health endpoints

Application VPS private surfaces
  |-- PostgreSQL volumes
  |-- metrics agent and analytics administration
  |-- journald / fail2ban
  `-- local encrypted backup repository
         ^
         | narrow WireGuard subnet; no public admin ports
         |
Operator workstation
  |-- loopback-only operations BFF and dashboard
  |-- protected source credentials and pinned SSH trust
  `-- dedicated read-only operations SSH identity

GitHub Actions
  |-- CI builds/scans immutable images
  |-- GHCR stores images addressed by full commit SHA
  `-- approved production job deploys through a dedicated SSH identity

Independent external observer
  `-- scheduled HTTPS, readiness and certificate-expiry probe
```

Trust boundaries are part of the design:

1. Nginx is the only public ingress. Databases, metrics hubs, analytics administration, log
   readers and Docker APIs are never published directly.
2. The browser receives public IDs and reduced aggregates only. Source passwords, raw analytics
   events, session identifiers, SSH material and infrastructure logs terminate in the BFF.
3. Deployment and observation use different identities. The deploy account may replace releases;
   the operations account is WireGuard-only and constrained to read-only commands.
4. GitHub production secrets are released only to a job bound to the protected environment.
5. A same-host backup crosses a logical-corruption boundary, but not the VPS failure boundary.
   Off-site encrypted storage is required for disaster recovery.

## 3. What to reuse and what to decide again

| Area | Reuse as an invariant | Decide for every project |
|------|-----------------------|--------------------------|
| Public ingress | One explicit edge; deny private admin routes; security and cache headers | Domain, redirects, IPv4/IPv6, CDN need, API limits, upload limits |
| Runtime | Common Compose base; production overlay; healthchecks; graceful stop; named data volumes | Service graph, CPU/RAM limits, stop timeout, maintenance window |
| Images | Immutable release identity; scan before deploy; run only the selected release | Registry, platforms, retention, provenance/attestation policy |
| Configuration | Typed/example contract in git; real values protected outside git; fail closed on placeholders | Secret store, rotation interval, which public values are build-time |
| Delivery | Manual production intent; dedicated account; pinned host key; smoke; automatic rollback | Approval owners, deploy frequency, rollout strategy, rollback data compatibility |
| Network | Public ports minimized; private administration through a narrow route | WireGuard CIDR, peer ownership, remote dashboard location, firewall provider |
| Observability | Independent source health; bounded polling; sanitized browser contract | Tools, retention, cardinality, alert routes, legal basis for analytics |
| Backup | Encrypted, scheduled, retained, freshness checked, restore drilled | RPO/RTO, datasets, off-site provider, encryption-key custody, retention |
| Incidents | Preserve evidence; contain before repair; verify every dependency after recovery | Escalation contacts, notification duties, business severity levels |
| Capacity | Measure CPU, memory, disk, swap and latency; retain headroom | VPS size, thresholds, geographic placement, scale-up/scale-out trigger |

Do not copy provider addresses, domains, usernames, key paths, repository names, image names,
WireGuard ranges, time zones, retention periods, resource limits, legal text, alert destinations or
accepted risks from infraege. They are examples of decisions, not defaults.

## 4. Staged delivery

Each stage has an exit condition. Do not advance merely because configuration files exist.

### Stage 0 — write the operating contract

Record before provisioning:

- data classes and residency/legal constraints;
- acceptable downtime, RPO and RTO;
- owners for DNS, hosting, repository, production approval, incident handling and secret recovery;
- expected traffic and the first capacity ceiling;
- public endpoints and private administration surfaces;
- what will be deliberately deferred, who accepted the risk, and the deadline or trigger to close
  it.

Exit evidence: the owner has approved the decisions and unresolved high-impact questions are
visible rather than represented by guessed defaults.

### Stage 1 — make local lifecycle production-shaped

Use one Compose base for service topology and a development overlay for source builds, bind mounts
and developer ports. Give every long-running dependency a healthcheck. A startup dependency is
ready only when its health condition passes; container creation order is not readiness.

Expose discoverable commands such as `make dev`, `make rebuild`, `make stop`, `make down`,
`make logs`, and `make ps`. Normal dev startup should reuse existing images and containers; make
image rebuilds explicit while keeping missing-image first boot automatic. Stop must be graceful,
retain owned containers and networks for fast resume, preserve named data volumes, and use a
bounded timeout. Reserve `down` for explicitly removing owned containers and networks; it must
still preserve named data volumes unless destruction is separately and explicitly requested.
Render the effective model with `docker compose config` so interpolation errors and unintended
mounts are caught before runtime.

Exit evidence: a clean machine can start the stack, wait for health, exercise public readiness,
stop it, start it again with persisted data, and explain exactly what remains on disk.

### Stage 2 — provision and harden the VPS

Keep the provider console open while bootstrapping. Create a dedicated deploy user, verify a
second key-based SSH session, then disable password and root SSH. Configure firewall policy,
fail2ban, security updates, time synchronization, bounded journal retention, swap and the narrow
WireGuard interface. Never close the recovery session before the replacement access path works.

Keep private service listeners on the Compose network, loopback or WireGuard address. If Docker
metrics are needed, put a read-only socket proxy in front of the daemon; do not hand a dashboard
the raw Docker socket.

Exit evidence: only intended public ports answer, SSH trust is pinned from an independently
verified host fingerprint, a fresh deploy-user session works, and private ports cannot be reached
from the Internet.

### Stage 3 — establish DNS and TLS

Lower DNS TTL temporarily, remove conflicting records, and query at least two independent public
resolvers. On a host whose name resembles the domain, bypass local `/etc/hosts` answers during
preflight. Obtain the first certificate only after public DNS is correct; configure renewal and a
deploy hook that reloads only the edge service. Enable HSTS only after a renewal drill succeeds.

Exit evidence: canonical HTTPS, redirects, certificate chain/dates, readiness through the public
edge and `certbot renew --dry-run` all pass.

### Stage 4 — build and publish immutable releases

Build production images without source bind mounts. Address every image with the full source
commit SHA, scan the image that will actually run, and retain enough releases for rollback. Pin
third-party workflow actions by immutable commit. Give `GITHUB_TOKEN` only the permissions each
job needs; prefer OIDC to long-lived cloud credentials when the provider supports it. Consider
artifact attestations when consumers need verifiable build provenance.

Do not run a tag such as `latest` in production and later infer what it contained. The application
health response and deployed environment must expose the same immutable release identity.

Exit evidence: the selected SHA exists in the registry, scans pass under an explicit policy, the
production Compose render references that SHA only, and build provenance is traceable.

### Stage 5 — deploy with approval and rollback

Use a protected GitHub `production` environment with designated reviewers and environment-scoped
secrets. Trigger deploy explicitly with a validated 40-character SHA. Verify the SSH host key
strictly, upload or extract into a versioned release directory, render configuration before any
container mutation, pull first, then replace services. Serialize concurrent deploys.

Smoke public page and readiness after replacement. If either fails, restore the previous complete
release and prove its public health. A rollback procedure must also state what happens when a
database migration is not backward compatible; image rollback alone cannot undo data changes.

Exit evidence: a successful deploy reports the exact requested SHA, and an intentionally broken
candidate proves automatic rollback to the prior SHA without manual repair.

### Stage 6 — add private observability

Separate analytics, infrastructure metrics and logs: they answer different questions and should
degrade independently. Keep their administration surfaces private. A local dashboard should bind
to loopback and use a server-side adapter layer so credentials never enter browser JavaScript.
Expose source freshness and partial failure instead of replacing missing data with zero.

Historical range and refresh cadence are separate controls. Bound source-specific polling,
coalesce concurrent browser requests, stop polling hidden tabs and never overlap refreshes. For
analytics, define an event allowlist and exclude answers, free text, identifiers and unnecessary
URL data.

Exit evidence: one deliberately disabled source is shown as unavailable while others remain
usable; a real browser journey appears through the intended collector; host/container values are
cross-checked against their source; logs contain no credentials.

### Stage 7 — make backup a recovery capability

Inventory every stateful dataset, back it up consistently, encrypt it, apply retention, emit a
freshness signal and monitor the timer itself. Store the encryption credential separately from
the repository and the backup data. Add an encrypted off-site copy before data becomes
irreplaceable.

Run restores into disposable infrastructure on a schedule. Validate database dumps before using
destructive restore flags. For a real recovery, stop writers, take one more current backup,
restore, run integrity and application smokes, and preserve the pre-restore snapshot until human
acceptance.

Exit evidence: a person who did not write the backup script restores each dataset from the
off-site backend within the stated RTO and measures an RPO consistent with the contract.

### Stage 8 — rehearse incidents and hand over operations

Write short paths for bad release, dependency outage, disk pressure, expired certificate,
credential compromise, lost VPS and corrupt data. Preserve timestamps, release SHA, logs and
workflow evidence before cleanup. Define rotation scope and external/legal escalation.

Exit evidence: the operator can locate the current SHA, health, source freshness, backup age,
certificate expiry and last deploy; at least rollback, restore and certificate-renewal drills have
recorded outcomes and owners.

## 5. Lifecycle ownership

| Lifecycle | Start | Observe | Stop / recover | Must preserve |
|-----------|-------|---------|----------------|---------------|
| Local app | one documented command | health + service status + logs | graceful stop, bounded timeout | named development data unless explicitly reset |
| Local ops | tunnel then loopback BFF | route, handshake, PID, source freshness | stop BFF; lower only a tunnel it started | protected config and any pre-existing tunnel |
| Production release | approved immutable SHA | workflow, exact health SHA, public smoke | automatic previous-release rollback | evidence and previous complete release |
| TLS | first issuance after DNS proof | expiry probe and renewal journal | renew then narrow edge reload | private key permissions and recovery access |
| Backup | scheduled service/timer | freshness marker, logs, repository check | disposable restore drill | encryption key and pre-restore snapshot |
| Incident | declared timestamp and owner | timeline and evidence bundle | containment, recovery, acceptance | logs, affected-data record, corrective backlog |

## 6. Authoritative current guidance

When implementing this blueprint, re-check the versions actually selected. At the time this guide
was written, the primary references were:

- Docker: [production Compose guidance](https://docs.docker.com/compose/how-tos/production/),
  [startup order and health conditions](https://docs.docker.com/compose/how-tos/startup-order/),
  [variable interpolation](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/),
  and [Compose secrets](https://docs.docker.com/compose/how-tos/use-secrets/);
- GitHub Actions: [deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments),
  [secure use](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions),
  and [artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations);
- the chosen analytics, metrics, VPN, backup, proxy and certificate tools' official versioned
  documentation.

Repository examples demonstrate an implementation, but installed versions and official current
documentation remain the authority for APIs and configuration syntax.

## 7. New-project worksheet

Copy this section into the first infrastructure change of a new project and replace every
placeholder. An unanswered item is a decision or risk, not permission to inherit infraege's value.

### Inputs and owners

| Input | Project value | Owner | Evidence / location (never a secret value) |
|-------|---------------|-------|--------------------------------------------|
| Canonical domain and redirects | `TBD` | `TBD` | registrar/DNS zone |
| Hosting provider, region and VPS plan | `TBD` | `TBD` | provider account |
| Data classes and residency constraints | `TBD` | `TBD` | approved system contract |
| Availability, RPO and RTO | `TBD` | `TBD` | approved system contract |
| Repository and production environment | `TBD` | `TBD` | repository settings URL |
| Registry and immutable image names | `TBD` | `TBD` | registry paths |
| Deploy reviewer and recovery operator | `TBD` | `TBD` | environment protection rules |
| Deploy and read-only ops identities | `TBD` | `TBD` | public fingerprints only |
| Public endpoint allowlist | `TBD` | `TBD` | edge configuration |
| WireGuard subnet and peer inventory | `TBD` | `TBD` | protected peer registry |
| Analytics purpose and event allowlist | `TBD` | `TBD` | privacy/system contract |
| Metrics/log retention | `TBD` | `TBD` | service configuration |
| Backup datasets, retention and backend | `TBD` | `TBD` | backup runbook |
| Incident and legal escalation contacts | `TBD` | `TBD` | protected contact register |
| Capacity thresholds and review cadence | `TBD` | `TBD` | monitoring runbook |
| Accepted debt, owner and closure trigger | `TBD` | `TBD` | active backlog |

### Secret inventory

Record names and custody, never values. Avoid one universal credential.

| Secret class | Generated by | Stored for automation | Recovery copy | Rotation trigger |
|--------------|--------------|-----------------------|---------------|------------------|
| deploy private key | `TBD` | protected production environment | `TBD` | role/person/host change or exposure |
| operations private key | `TBD` | dashboard host only | `TBD` | dashboard/reader change or exposure |
| SSH host trust | verified provider fingerprint | protected environment + operator known_hosts | `TBD` | VPS rebuild or host-key rotation |
| WireGuard peer keys | each peer | peer-local protected configuration | `TBD` | peer loss/removal or exposure |
| application/database credentials | CSPRNG or secret manager | production secret store | `TBD` | exposure or scheduled rotation |
| analytics/metrics credentials | service bootstrap | BFF/server environment only | `TBD` | account/access change or exposure |
| backup encryption credential | CSPRNG/password manager | backup host protected file | independent custody | exposure or backend migration |

Required rules:

- no secret, private key, complete production env, raw backup credential or session token enters
  git, chat, issue text, browser bundles, command history or test fixtures;
- public IDs and variables are classified explicitly instead of being called secrets by habit;
- protected files have a named owner and restrictive permissions;
- operator-written dotenv values are validated against every parser that consumes them. If both
  Bash and Compose read one file, its serializer must produce syntax safe for both;
- failed validation happens before extraction, image pulls, database actions or container changes;
- rotation is rehearsed and includes dependent services, not just changing a stored value.

### Delivery acceptance checklist

- [ ] The system contract defines public/private boundaries, data classes, RPO/RTO and accepted
  debt.
- [ ] A clean developer machine starts, waits for health, exercises readiness, stops gracefully
  and restarts with expected persisted data using documented commands.
- [ ] `docker compose config` (or the project's fail-closed wrapper) renders every target overlay
  with no placeholder, floating production image or unintended bind mount.
- [ ] Production services run with explicit healthchecks, resource expectations and bounded stop
  behavior; readiness tests real dependencies while liveness tests only the process.
- [ ] A second key-based deploy-user SSH session was proved before disabling bootstrap access.
- [ ] Firewall inspection shows only intended public ports; admin services are unreachable from a
  public network and reachable only through the approved private path.
- [ ] SSH host fingerprint was verified through an independent trusted channel; strict host-key
  checking remains enabled for deploy and operations identities.
- [ ] DNS answers match on two public resolvers, HTTPS/redirects are correct, and certificate
  renewal plus edge reload succeeds in a drill.
- [ ] CI checks source and dependencies; release images are immutable full-SHA artifacts and are
  scanned after build under an explicit severity/fix policy.
- [ ] The production environment requires approval, scopes secrets to the deploy job, grants
  minimal token permissions, rejects invalid SHAs and serializes concurrent deploys.
- [ ] Production health exposes the exact deployed SHA and the public page plus readiness pass
  after deploy.
- [ ] A deliberately failing release proves automatic rollback to the previous exact SHA.
- [ ] A real browser journey loads the production tracker and the network panel shows successful
  events only at the allowlisted collector endpoint; analytics then shows the expected aggregate.
- [ ] Metrics values and units are compared with an independent source such as `docker stats`;
  stale and unavailable sources are distinguishable from genuine zero values.
- [ ] Disabling one observability source leaves the remaining dashboard useful and leaks no raw
  events, identifiers, credentials or unsanitized logs to the browser.
- [ ] Backup timers, freshness and retention pass; every stateful dataset is restored into a
  disposable target from the off-site encrypted backend within RPO/RTO.
- [ ] Bad-release, lost-VPS, expired-certificate, disk-pressure, credential-compromise and corrupt-
  data paths name an owner, evidence to preserve, containment, recovery and acceptance checks.
- [ ] The handover states how to start/status/log/stop local app and ops resources, what each stop
  removes, what it preserves, and where protected configuration lives.

### Release evidence record

For each production release retain a compact record, preferably generated by automation:

```text
intent: workflow URL, approver, requested full SHA, UTC start/end
supply chain: image digests, scan policy/result, optional attestation
configuration: render PASS, secret values omitted
deployment: previous SHA -> requested SHA, service health
edge: canonical page, readiness SHA, redirects, TLS expiry
journey: named real-browser action, collector status, visible aggregate
recovery: rollback result when exercised, last restore-drill date/result
residual risk: accepted exceptions with owner and closure trigger
```

Green automation is necessary evidence, not the whole acceptance decision. Browser collection,
restore capability, rollback behavior, private-network reachability and operator understanding
must be proved at their actual boundaries.

## 8. Traps to design out

These are failures encountered while building the reference platform. Use the prevention column
in a new design; use [`KNOWN_GOTCHAS.md`](KNOWN_GOTCHAS.md) for the infraege-specific diagnosis.

| Trap | Misleading evidence | Prevention and boundary test |
|------|---------------------|------------------------------|
| Same-host Restic is called disaster recovery | Local snapshots and restore checks are green | Treat it as logical-error recovery only; restore from an encrypted off-site backend after simulating complete VPS loss |
| Legal/operator work is deferred invisibly | Privacy page exists and analytics is minimal | Record the debt, owner and trigger; obtain appropriate specialist review before broader personal-data collection |
| A Windows VPN is assumed to provide the WSL private route | General VPN works, but private IP times out | Inspect route, interface and recent handshake inside the environment that runs ops; create only the narrow project route |
| Log and SSH adapters guess protocol syntax or identity | Public SSH works while private alias fails; logs return 400 | Test the exact journald Range form and pin a deliberate SSH host-key alias/known-hosts file; never use TOFU or disable checking |
| History range is treated as collection cadence | Smallest chart window is one hour | Separate `HISTORY` from `REFRESH`; measure each upstream resolution/TTL and bound/coalesce polling |
| Raw metric numbers receive a guessed unit | A small container appears to use hundreds of GB | Name units in contracts (for example MiB), normalize only at display, and compare with an independent source |
| Public analytics prefix is sent unchanged upstream | Private analytics UI works but tracker script is 404 | Map exact public script and collector locations to the paths actually served by the pinned image; deny every other admin route |
| Collector path is configured as though it were absolute | Tracker loads, but generated requests duplicate the base path | Inspect the generated browser request; test configuration composition, not only a hand-written curl to the proxy route |
| One dotenv file is valid for Compose but invalid when sourced by Bash | Render succeeds; deploy later interprets a value word as a command | Use one tested serializer for the intersection of both grammars, reject unsupported characters/newlines, and validate before mutation |
| Same-host DNS preflight trusts local hostname resolution | Public DNS is correct but the VPS resolves its own name locally | Query explicit independent public resolvers during certificate preflight |
| Local Compose mounts every production Nginx vhost | Existing traffic works while config health hangs on absent upstreams | Mount only the local vhost in the base stack; package production-only configuration into the production image/overlay |
| `depends_on` is treated as service readiness | Containers are running while initialization races PostgreSQL | Add dependency healthchecks and wait on healthy state before initialization |
| An SSH-fed script allows nested commands to read stdin | An innocent one-off Compose command consumes the rest of deploy | Disable interactive stdin for nested container commands and test the complete streamed script |
| Production overlay replaces rather than extends critical mounts | TLS check passes outside the container but edge cannot read certificates | Render and inspect the merged Compose model; verify certificates from the same container/runtime identity that serves them |
| A rollback script exists but cannot identify the prior release | Smoke failure occurs after a mutable tag moved | Persist current and previous full SHAs; deploy versioned directories and prove a failing candidate restores the exact prior SHA |
| Analytics is tested only with curl | Proxy endpoint answers, but real tracker generation or browser policy is wrong | Use a real browser, assert script presence, generated request URL/status, console state and resulting aggregate |
| Dashboard refresh is made “live” by aggressive global polling | UI looks fresh while VPS, database and SSH load rise | Use near-live sanitized aggregates, source-specific TTLs, no overlap, hidden-tab pause and an explicit minimum cadence |
| Operations stop claims to remove everything | It tears down a VPN interface the operator already used, or deletes config/data | Track ownership: stop only processes/tunnels started by the lifecycle and state exactly which protected files/volumes remain |

### Do not copy blindly

- Do not inherit infraege's single-VPS risk if the new service has stricter availability or data
  durability requirements.
- Do not reuse its temporary administrator-account exceptions. Create separate least-privilege
  analytics and metrics readers before sharing or remotely hosting the dashboard.
- Do not reuse a default analytics password even behind WireGuard. Private reachability reduces
  exposure; it does not make shared/default credentials safe.
- Do not reuse its same-host backup decision once data cannot be recreated.
- Do not copy its analytics events or privacy text without a new data-flow and legal review.
- Do not assume identical image versions have identical base-path, authentication, retention or
  cleanup behavior. Pin versions and test the installed artifacts.
- Do not broaden a private route or publish an admin port to make onboarding easier.
- Do not weaken host-key checks, secret validation, health smokes, image scanning or rollback
  because the first deploy is inconvenient. Create an explicit, narrow first-release state and
  make later releases fail closed.
- Do not run destructive database recovery commands during diagnosis. Stop writers, preserve
  evidence, back up current state, restore into a disposable target, then approve the real change.
- Do not interpret nominal green checks as proof of a user journey, restore or rollback that was
  never exercised.

## 9. Fast path for the next project

Use this order to gain reuse without inheriting hidden assumptions:

1. Copy section 7 into the new project's first infrastructure change and fill the inputs before
   editing runtime files. Escalate every unresolved trust, data or recovery decision.
2. Draw the new trust boundaries and compare them with section 2. Remove services the new product
   does not need; add missing data flows before choosing tools.
3. Review the reference assets below by responsibility. Copy the smallest cohesive part, replace
   project-specific names and write focused tests for its invariants.
4. Re-fetch official documentation for the exact selected versions. Render configuration and run
   local gates before provisioning anything.
5. Execute stages 2–8 in order and attach their exit evidence to the change. Do not parallelize
   access hardening, DNS/TLS and the first deploy in a way that removes the known recovery path.
6. After handover, move every newly discovered recurring failure into the new project's gotcha
   log and every accepted risk into an owned backlog item.

Reference asset map (inspect current files; paths may evolve):

| Responsibility | Reference location | Adaptation focus |
|----------------|--------------------|------------------|
| Compose topology and overlays | `infra/docker-compose*.yml`, `infra/.env.example` | service graph, health, mounts, limits, variable contracts |
| Immutable images and public edge | application Dockerfiles, `infra/nginx/` | runtime users, build inputs, domains, routes, TLS paths |
| VPS, access and TLS automation | `ops/` | distribution/provider, accounts, firewall, CIDR, certificate flow |
| Render, deploy and rollback | `scripts/render-production-config.sh`, `scripts/deploy-remote.sh` | env grammar, release layout, migration compatibility, smokes |
| Backup and drills | `scripts/backup.sh`, restore/freshness scripts, systemd units | complete dataset inventory, off-site backend, RPO/RTO |
| Delivery and probes | `.github/workflows/` | repository/environment, permissions, approvals, registry, concurrency |
| Operations procedures | `docs/runbooks/` | provider values, contacts, evidence, recovery and handover |
| Regression knowledge | `docs/KNOWN_GOTCHAS.md` | retain only applicable traps; add new symptoms/root causes/fixes |

Copy tests with the behavior they protect. A copied script without its fail-closed validation and
focused regression tests is not the same reusable component.
