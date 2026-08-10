# Incident response

## Triage

1. Record UTC start time, affected URLs and deployed SHA; do not rotate/delete logs before capture.
2. Check `https://infraege.ru/health/live` and `/health/ready`, GitHub probe history, then the local
   ops dashboard source strip.
3. On the VPS use `docker compose ... ps`, `journalctl -u docker --since -30min`, disk/memory state,
   and `fail2ban-client status`. Never paste production env files or tokens into tickets/chat.

## Containment and recovery

- Bad release: re-run the deploy workflow with the last known-good main SHA. Automatic rollback
  handles failed deploy smoke, but not delayed application defects.
- Database/storage: stop writers and follow `backup-restore.md`; never run broad `DELETE`,
  `TRUNCATE`, `DROP TABLE` or `DROP DATABASE` as an exploratory action.
- Compromise suspicion: isolate with provider firewall, preserve journal/GitHub evidence, rotate
  deploy, database, Umami, Beszel, Restic and WireGuard secrets, then rebuild from bootstrap rather
  than trusting the host.
- Resource exhaustion: identify the container first; scale the VPS only after containing runaway
  processes. Preserve at least 30% disk headroom.

## Closeout

Confirm public page and readiness, certificate validity, analytics collection, fresh backup and all
dashboard sources. Record root cause, timeline, affected data, corrective backlog item and whether
legal notification duties need specialist review. Telegram alerts are deliberately deferred.

