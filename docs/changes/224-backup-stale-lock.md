# CHANGE 224 — Бэкап после прерванного запуска Restic

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `224` |
| Slug | `backup-stale-lock` |
| Title | Бэкап после прерванного запуска Restic |
| Status | `done` |
| Branch | `feature/224-backup-stale-lock` |

---

## Goal

Два деплоя 2026-10-25 откатились:
- `fb7071f6`: SSH раннера оборвался во время `forget --prune` перед деплоем. Restic остался с
  эксклюзивной блокировкой процесса 380397;
- `3ea8bcea`: `backup.sh` принял ошибку `restic snapshots` из-за этой блокировки за отсутствие
  репозитория и вызвал `restic init` — «config file already exists».

Ночной бэкап упал бы так же. Production не пострадал, откаты прошли штатно.

Устранено на хосте вручную: `restic unlock` снял одну устаревшую блокировку, `restic check` ошибок не
нашёл, 15 снимков на месте. Это изменение не даёт ситуации повториться.

---

## Backlog

### Ops
- [x] `T1` `backup.sh`:
  - инициализирует только репозиторий без `config` (`restic --no-lock cat config`);
  - под host flock снимает устаревшие блокировки (`restic unlock` живые не трогает). — _Depends on:_ —
- [x] `T2` `offsite-backup.sh`: то же для внешней копии — `--no-lock cat config` и `unlock` перед
  `copy`. — _Depends on:_ —
- [x] `T3` `backup-retention.test.sh`:
  - заглушка понимает `--no-lock` и `unlock`, вызовы внешнего репозитория в журнале с префиксом;
  - тест требует, чтобы существующий репозиторий не инициализировался и перед бэкапом шёл `unlock`.
    Старый `backup.sh` этот тест не проходит. — _Depends on:_ T1, T2

### Docs
- [x] `T4` `backup-restore.md`, KNOWN_GOTCHAS «config file already exists». — _Depends on:_ T1

---

## Gate Checks

`shell-lint`, `docs-links`, `format`. Тесты: `backup-retention`, `backup-restore`,
`backup-restic-integration` (настоящий restic), `restore-readiness`, `account-cutover`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 3ea8bcea+wt | backup-retention (new code PASS, old backup.sh FAIL), backup-restore, backup-restic-integration, restore-readiness, account-cutover | PASS | 420 |

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-224): backups survive a Restic job killed mid-run
```
