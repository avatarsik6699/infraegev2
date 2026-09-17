# Minimal bank transition (Change 122)

This is a future, explicitly authorized production release procedure. Local implementation does
not change production data, installed monitoring services or deployment. Remote main `a5b0bf5`
was the visual reference; query live health/inventory again before release.

## Preserved local baseline

- Source: `f69825322f7027cb30371906e56e71c0b8bb7dee`.
- Branch `archive/pre-minimalism-2026-09-17`, tag `snapshot/pre-minimalism-2026-09-17`.
- Protected backup directory: `/home/niquetamerewsl/backups/infraegev2/pre-minimalism-2026-09-17`.
  Contains verified complete `source.bundle`, original DB/files/roles bundle, protected environment,
  normalized bank export and original verifier image. Keep this outside repository cleanup.
- Original actual bank: 697 tasks, 547 catalog-visible, 1 file, 150 lesson memberships.
  Original restore was verified before schema replacement. Old `infraege-dev_postgres18-data`
  remains retained; new dev data uses `infraege-dev_postgres122-data`.
- Mixed historical commits must be adapted by paths/hunks. Use the tag and immutable archive
  documents for design/ops/import fragments; do not cherry-pick obsolete schema wholesale.

## Production handoff

1. Refresh source identity, schema, counts, files, role permissions and available disk. Freeze
   operator writes and create a current backup with the SOURCE release's matching maintenance
   scripts. Retain source volume, file storage, environment and exact application/verifier images.
2. Export the authoritative bank with its matching source tools. For the pre-122 model recover
   those tools from the archive; `122_01` is a fresh schema, not an in-place migration of history.
   If production has no bank, explicitly approve the reviewed local bank as the initial content.
3. Prepare a separate PG18 volume named `infraege_postgres122-data`, restricted roles and schema
   `122_01` using the candidate migration image. Import the approved bank/files with the import
   role. Do not point PG18 at a PG16 directory or restore the old relational schema into 122_01.
4. Run source/target parity for every ID/content/checker/private source/file/membership and solution
   revision, API checker/file/lesson/browser acceptance, backup and isolated restore verification.
   Rehearse candidate activation and rollback on disposable data with the exact previous release.
5. Record explicit acceptance for the immutable candidate SHA in root-owned mode-600
   `/etc/infraege/minimal-bank-ready`, with exactly `122_01 <full-candidate-sha>`. This is an operator
   attestation, not an automatic data-transfer proof. Deploy preflight refuses first activation
   without it. Ordinary later 122_01 deployments do not need another marker or reimport.
6. Run Full/Release Gates and the explicit release workflow. Deploy backs up the selected bank,
   applies migrations, activates images and verifies health. Application rollback retains both
   volumes; after new bank edits the old bank is stale and data recovery requires a fresh plan.
7. Separately inventory and stop only the retired monitoring publishers, gateways, timers and
   Compose projects. Preserve their data/configuration for rollback. Do not remove shared host
   security/TLS/application backup units. Stop remote sibling services only with explicit scope.

## Release stop conditions

Missing/corrupt backup, parity mismatch, unknown data owner, insufficient disk, wrong role/schema,
unverified restore/rollback, or a failed required gate stops the release. No automatic deletion of
old databases, volumes, historical packages or off-site resources is part of this procedure.
