# Incident response

## Triage

1. Record UTC start time, affected URLs and deployed SHA; do not rotate/delete logs before capture.
2. Check `https://infraege.ru/health/live` and `/health/ready`, GitHub probe history, then sre-kit's
   source strip.
3. On the VPS use `docker compose ... ps`, `journalctl -u docker --since -30min`, disk/memory state,
   and `fail2ban-client status`. Never paste production env files or tokens into tickets/chat.
   From a trusted workstation, `ops/opsctl inventory --json` and `status --json` provide the
   sanitized read-only subset suitable for agent-assisted triage; unreachable SSH is returned as
   a stable error code without raw remote stderr.
4. Do not run `opsctl apply` during an incident. Its current executor is sandbox-only and cannot
   repair production. Preserve the generated plan as evidence and use the component-specific
   recovery procedure until a separately approved production executor exists.

## Containment and recovery

- Bad release: re-run the deploy workflow with the last known-good main SHA. Automatic rollback
  handles failed deploy smoke, but not delayed application defects.
- Database/storage: stop writers and follow `backup-restore.md`; never run broad `DELETE`,
  `TRUNCATE`, `DROP TABLE` or `DROP DATABASE` as an exploratory action.
- Compromise suspicion: isolate with the provider firewall, preserve journal/GitHub evidence,
  rotate the temporary root password in both GitHub and the local protected store plus database,
  Umami, Beszel, Restic and WireGuard secrets, then rebuild from bootstrap rather than trusting the
  host. A leaked root password means the whole VPS is untrusted.
- Root/password lockout: use the REG.RU console, restore a usable root password and rerun
  `ops/migrate-root-password-access.sh check`; never weaken host-key verification as a workaround.
- Resource exhaustion: identify the container first; scale the VPS only after containing runaway
  processes. Preserve at least 30% disk headroom.

## Closeout

Confirm public page and readiness, certificate validity, analytics collection, fresh backup and all
dashboard sources. Record root cause, timeline, affected data, corrective backlog item and whether
legal notification duties need specialist review. Telegram alerts are deliberately deferred.
