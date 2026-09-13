# CHANGE 119 — Practice release rehearsal

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `119` |
| Slug | `practice-release-rehearsal` |
| Title | Practice release rehearsal |
| Status | `archived` |
| Branch | `feature/119-practice-release-rehearsal` |

## Goal

Prepare the first production practice transition with evidence tied to the installed previous
release and a specific candidate. Rehearse nonempty PG16 → PG18 transfer, candidate import /
activation and application-only rollback on isolated local resources; produce a reviewable
release handoff. Mode: `continue`; source: approved chat continuation and SPEC §9.2 stage 5.
SPEC behavior is unchanged. Live deployment, production writes and legacy retirement are separate.

## Design References

None; reuse existing public product behavior without UI changes.

## Backlog

### Infra

- [x] `I1` Refresh sanitized read-only production identity, application DB/schema/roles, image
  identities, backup/restore status, free space and required host tools. Fix the exact previous
  SHA and candidate SHA for the rehearsal; distinguish measured evidence from pending proof
  — _Depends on:_ —
- [x] `I2` Build or obtain application images for those exact source SHAs on isolated local
  resources. Rehearse nonempty PG16 → PG18 with the corrected transfer implementation, schema /
  registry migration and candidate first-import coordinator. Verify all 150 tasks, membership,
  revisions and files; test interruption without activation of an incomplete candidate
  — _Depends on:_ I1, I4
- [x] `I3` Run the exact previous application against the migrated nonempty PG18/schema with
  runtime-role access. Verify previous lesson/checker/file behavior and candidate recovery;
  prove application-only rollback leaves new DB writes intact. Produce exact-SHA compatibility
  evidence without installing production proof markers — _Depends on:_ I2

- [x] `I4` Fix backup read access for pre-existing application tables/sequences outside `practice`.
  Keep grants local to the application database, preserve runtime/import restrictions, prove actual
  dump/restore and negative privilege checks, and repeat the full rehearsal with the corrected
  immutable source snapshot. Approved by architect in chat on 2026-09-13 — _Depends on:_ I1

### Other

- [x] `T1` Verify a nonempty candidate backup/restore with file/checker smoke and encrypted export
  in the isolated rehearsal. Record measured timings, checksums/image IDs and resource ownership;
  do not represent synthetic data or same-host export as live production/off-host recovery proof
  — _Depends on:_ I3
- [x] `T2` Record the release handoff, remaining host prerequisites (including uv), commands and
  stop conditions in the owning runbooks. Run one affected Critical Gate and required tooling;
  clean only owned rehearsal resources and analyzed outputs — _Depends on:_ T1

## Files

### Create / modify

```text
docs/changes/119-practice-release-rehearsal.md
scripts/tests/practice-release-rehearsal.test.sh (isolated host-run acceptance)
scripts/db-provision-roles.sh
scripts/tests/practice-db-foundation.test.sh
scripts/tests/deploy_orchestration_test.py (only additional rehearsal failure coverage)
docs/runbooks/practice-transition.md
docs/runbooks/production.md
docs/runbooks/backup-restore.md
docs/STACK.md (rehearsal commands and prerequisites)
```

### Do NOT touch

- Production containers, data, credentials, host packages, proof markers, release pointers and timers.
- Public API/schema/UI, original/frozen task content, publication visibility and legacy runtime.
- Existing DB volumes, backups, sibling operations resources, immutable archives.
- User-owned staged `docs/artifacts/` files; no automatic push/deploy or broad Docker cleanup.

## Contracts

See `docs/SPEC.md` §3–§4, §7–§8 and §9.2; owning production/backup/transition runbooks and Files above.

## Gate Checks

Affected Critical Gate in [STACK](../../STACK.md), plus the bounded rehearsal required by this
Backlog. Tests run on the host; containers run databases and application images only. Use Python
LSP if Python tests change and browser MCP for real browser behavior checks. This is not a Full
or Release Gate; those remain mandatory at explicit publication. If the candidate runtime or
previous production SHA changes, invalidate the affected compatibility evidence and rerun it.
Do not install compatibility marker files based solely on source inspection or prior unit tests.

## Architect Review Notes

- [x] No architect review issues recorded

## Implementation Notes

- Read-only production inventory on 2026-09-13: installed previous SHA
  `a5b0bf5793a85a4e9090f47c311ae01c022f194d`, rechecked after the correction. PG16.14,
  application DB 7,699,479 bytes, no user tables, only bootstrap role among the application
  allowlist. Source volume `infraege_postgres-data`; available disk 27,048,416 KiB (31% used).
  Backup success `2026-09-13T02:28:01Z`; backup/restore timers active, last restore September 1.
  Python 3.12.3, Restic 0.16.4, `uv` missing. Both compatibility markers absent; no production
  state, packages, pointers or timers changed. These are inventory facts, not live PG18 proof.
- The first nonempty rehearsal exposed missing backup reads on a transferred public table.
  Architect approved I4 on 2026-09-13. Provisioning now grants local reads on existing non-system
  schemas/tables/sequences, without widening runtime/import rights or granting cluster-wide
  membership/RLS bypass. Legacy DDL after provisioning needs renewed grants; the runbook records
  this boundary. Foundation acceptance passed actual dump/restore/export, quoted identifiers,
  identity sequences, repeated provisioning and negative privilege checks.
- Corrected immutable source tree: `e609c2c550c963b50c06b1a0c8430ed861a7b856`, base commit
  `3335eaf477ef96e8354cfd3818beea25674a26ef` plus only `scripts/db-provision-roles.sh`.
  A temporary Git index created the source tree without committing or changing the user's staged
  files. This is source evidence before ship, not a final release commit. Bind the final release
  commit/images to it and rerun affected compatibility evidence before installing markers.
- Full isolated rehearsal used Restic 0.16.4 and the pinned PG16.14/PG18.6 images. Nonempty transfer
  took 13 seconds, preserving two public-table rows. Migration/registration and first import
  verified all 150 tasks, original history/revisions, membership and files. Injected import failure
  prevented API startup. The source fixture matches old Compose's POSTGRES-only environment;
  task storage is created 755 as production does, while credentials/backups remain protected.
- Published previous API/web/nginx images ran using the previous Compose base plus the candidate
  runtime-role rollback overlay and local HTTP bindings. New PG18 row three and the exact PG18
  container ID survived rollback and candidate recovery. Both versions passed the real lesson,
  answer `10`, and file download; browser MCP screenshots were inspected and consoles had zero
  warnings/errors. Candidate catalog correctly remained empty; revision-less checking returned
  422. Candidate recovery repeated public health/checker/file smoke successfully.
- Coverage boundary: previous readiness checks only TCP; separate TCP-authenticated SQL proved
  `infraege_runtime` with read-only default on PG18. The local rehearsal substitutes project,
  loopback HTTP/TLS ingress and host-import environment, exercising real migration/import code
  and the actual rollback overlay; it does not execute the production SSH/EXIT wrapper or certify
  production ingress, maintenance downtime or an off-host recovery. API/web/nginx memory caps
  match production, as does candidate PG18; Full/Release checks remain required.
- Nonempty disposable restore completed in 8 seconds at `2026-09-13T13:16:20Z`, including SQL /
  role/fingerprint verification and candidate smoke of all 150 tasks, files and checker. Encrypted
  export and `restic check --read-data` passed. This is a small synthetic same-host rehearsal,
  not a production RTO or an off-host export. `numbers.txt` SHA-256:
  `a3ffa225a17d35ef0f8185b42bf373fcc9fd45c2494e7e9c6ee01dbc2c6aecaf`; candidate response was 200,
  six bytes, `text/plain`, attachment, `no-store`, `nosniff`.
- Candidate image IDs (also local RepoDigests in this Docker image store): API
  `sha256:481923d3b1ef55ff66b3fca7d28e7fb97cf83a9b7990f8a09202939e308c2119`, web
  `sha256:27d360a74eca4b1495ebf10b5accb8254b26eb201b7bc5ce8017db60a51a9f4b`, nginx
  `sha256:f40653ee215f136c2dde49f05b0f4ade5a783471d6d519ea6b3105530bff3a8c`.
  Previous published image IDs/RepoDigests: API
  `sha256:ac0588a2922b1147dbc19c57d8ef9b6252f134102a84454f88fe94939555738f`, web
  `sha256:e6e40794028f9f1b9cc83f2983c3f336e8a4be542314ce3e63eb77465b0bdfe4`, nginx
  `sha256:0341874095e334f5e02be535807ae75b016c9fde7d76e55699ba652bfbe10d9a`.

- Critical Gate: formatting, maintenance ShellCheck, changed-shell syntax and diff checks passed.
  Foundation and full rehearsal acceptance passed; the existing-volume refusal guard also passed
  with fake transport, and the unused old-Compose volume cleanup was verified on its owned volume.
  Python/TypeScript LSP/type-check and API regen are not applicable (no such files/API changed).
  Browser MCP was used for both application versions. No Full/Release Gate or human publication
  acceptance is claimed.

- Hygiene passed: reviewed `make clean-dry-run`, then `make clean` and `make clean-check`.
  Owned rehearsal containers/volumes, candidate image tags and analyzed scratch workspace were
  removed. Published previous images and unrelated resources remain untouched. The 14 user-owned
  staged artifacts retain the original index diff checksum; no commit, merge, push or deploy ran.

## Commit Message

```text
feat(change-119): rehearse practice release and rollback
```
