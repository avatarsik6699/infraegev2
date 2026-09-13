# Practice transition: release readiness and retirement

This checklist prepares SPEC §9.2 stage 5. Changes 113–116 are locally shipped; that is not
production activation or live recovery evidence. The source audit below was checked at local
`b3ead14` on 2026-09-13. Refresh it when selecting the release candidate. No production state
was inspected by Change 117; the older inventory in [backup and restore](backup-restore.md)
is historical and must be refreshed.

## Current release blocker

[The deploy coordinator](../../scripts/deploy-remote.sh) runs `db-migrate`, then starts the
application and checks readiness/homepage. It has no initial bank import or populated-bank
acceptance step between migration and consumer activation. `db-migrate` registers material
identities; it does not import tasks. A healthy empty schema can therefore pass those checks.
The [local bootstrap](../../apps/api/app/modules/practice/dev_bootstrap.py) deliberately targets
dev only. Do not point it at production or infer that the ordinary deploy performs its work.

Before releasing DB-backed lesson consumers, implement and rehearse the ordered first-import
boundary in a subsequent implementation change, or prepare an explicitly reviewed maintenance
procedure that completes it before consumer activation. Do not launch the existing all-in-one
first deploy and race a manual import against its application startup. Preserve the existing
backup, deployment lock, interruption/outcome and application rollback boundaries. Local
catalog tests prove reader behavior, not this missing production coordination.

## Ordered release evidence

Use the established [production](production.md#first-application-pg16--pg18-release-change-113),
[practice](practice.md#change-115-explicit-local-bootstrap-and-cutover) and
[backup/restore](backup-restore.md) procedures. Keep secrets out of this evidence.

1. Select full candidate and currently installed previous application SHAs. Record image digests,
   actual application DB major/schema, project/volume identity and available disk. Refresh the
   read-only production inventory; never substitute the local development DB or operations DB.
2. On an isolated nonempty clone, prove the exact previous application against PG18 and the
   candidate schema with runtime-role access. PG18 compatibility and schema compatibility are
   separate proofs. Only then install the exact-SHA markers required by the production runbook.
   Prove the rollback application can serve its original lessons/checker/files; do not assume
   that returning the application also reverses database writes.
3. Rehearse the complete candidate transfer/import/activation and interruption path locally,
   including the missing coordination above. Preserve the old PG16 volume. Freeze and validate
   the candidate's migration package and material registry; compare all 150 IDs, task content,
   first solution revisions, ordered membership and the immutable file. Existing exercises
   remain hidden from catalog search; publishing selected exercises is a separate content action.
4. Run the authorized `/ship --release` Full and Release Gates for the selected candidate.
   Only the release workflow may push/deploy. First PG16 transfer requires the explicitly selected
   `16-to-18` mode; a subsequent PG18 deployment uses `none`. Re-read live state before selection.
5. Under the reviewed maintenance boundary: transfer/provision PG18, migrate/register, convert /
   validate / diff the frozen package, make a verified pre-import backup, import and inspect the
   package outcome, compare bank parity, then make a post-import backup. Repeated/interrupted
   runs must consult outcomes and preserve operator edits. Activate consumers only after this
   prerequisite succeeds; verify public API/file smoke once the candidate is available.
6. Confirm exact deployed SHA and public lesson/course/task behavior, revision-aware checking,
   file bytes and headers, empty catalog behavior for the hidden original bank, and sitemap
   behavior. An old tab without revision is safely rejected; the accepted transition is manual
   page reload. Neither readiness nor a homepage 200 replaces these product checks.
7. Run installed backup/restore timers against the nonempty bank with file/checker smoke, record
   measured recovery duration and freshness markers, create the encrypted export and actually
   copy it off VPS. Record the verified copy identity/checksum without exposing its contents.
   A same-host backup alone is not off-host recovery evidence.
8. Record human acceptance and exact previous/candidate recovery evidence. After PG18 writes,
   PG16 is stale: rollback stays application-only; any database recovery needs separately
   reviewed current-data recovery. Preserve rollback volumes regardless of code retirement.

Until these steps have evidence, stage 5 is open. Do not check live items off using synthetic
fixtures, historical inventory, source inspection or green local tests.

## Legacy ownership map

Search results are candidates for dependency analysis, not deletion authorization.

| Owner | Current dependency / disposition |
|-------|----------------------------------|
| `apps/api/app/modules/content/service.py`, `exceptions.py` | Cached JSON loader has no current production caller found; checker tests still import `clear_cache`. Retire service/test scaffolding together after live acceptance. |
| `apps/api/app/core/config.py` | `tasks_dir` supports the old loader; `content_dir` also has startup validation and development readiness consumers. Remove only after updating all consumers and startup tests. |
| `apps/api/app/modules/content/schemas.py` | Still imported by practice schemas and legacy conversion. Preserve or deliberately relocate its shared types; do not delete the whole content module. |
| API/web Dockerfiles, `infra/docker-compose.dev.yml`, API `entrypoint.sh` | Still copy/mount/watch `content/tasks`. Retire after configuration/readiness and remaining asset consumers are handled; verify production images and dev startup afterward. |
| `scripts/validate-content-links.mjs`, `scripts/lib/task-content-assets.mjs` | Still validate the original task tree and migration references. Adapt validation ownership before removing source files. |
| Web lab download specimen and Python course browser fixture | Still mention the original `/content/tasks/.../numbers.txt` path. Inspect each real route/asset consumer during retirement; sample URLs in renderer tests need individual classification. |
| `content/practice-migration/`, practice `legacy.py` / `dev_bootstrap.py`, migration fixtures | Frozen import/parity evidence and explicit bootstrap tooling, not a production read fallback. Preserve for repeatable import/recovery; they are not blanket legacy deletion targets. |
| `content/tasks/`, authored theory and user artifacts | Preserve through production acceptance. Remove only the separately scoped obsolete task source dependencies; never delete authored theory or user references. |
| Old PostgreSQL volumes, task-file storage, backups/exports | Persistent recovery data outside code cleanup. No automatic deletion, including after stage 5. |

[Current API routing](../../apps/api/app/api/router.py) uses practice DB routes and the
revision-aware checker; it does not route requests through the old cached JSON service.
The standalone catalog, task pages and lesson consumers are already implemented. Retirement
removes residual packaging and dependencies; it must not reintroduce a JSON fallback.

## Next implementation acceptance

The next implementation backlog must first close and test the import/activation coordination
boundary, then obtain the release evidence above. Only after that may a separately scoped
retirement remove the verified obsolete owners and update their tests/docs. Require focused
startup/image, content validation, reader/checker/file and browser progress checks for the
actual changed consumers. Follow the Critical Gate for implementation and Full + Release for
publication; preserve source snapshots, unrelated staged artifacts and rollback data.
