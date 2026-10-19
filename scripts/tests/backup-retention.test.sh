#!/usr/bin/env bash
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/bin" "$test_root/backups"
export BACKUP_ROOT="$test_root/backups" RESTIC_REPOSITORY="$test_root/backups/restic"
export RESTIC_PASSWORD_FILE="$test_root/password" RESTIC_LOCK_FILE="$test_root/restic.lock"
export BACKUP_STATUS_FILE="$test_root/backup-status.json" FAKE_RESTIC_STATE="$test_root/state"
export DB_ENV=test DB_PROJECT=infraege-full-gate
# Change 196: off-site files live in the test root; the credentials file starts absent.
export OFFSITE_ENV_FILE="$test_root/offsite.env" OFFSITE_STATUS_FILE="$test_root/offsite-status.json"
OFFSITE_ENV_OWNER=$(id -u)
export BACKUP_SUMMARY_FILE="$test_root/ops/backups.json" OFFSITE_ENV_OWNER
printf 'synthetic\n' > "$test_root/env"
printf 'synthetic\n' > "$RESTIC_PASSWORD_FILE"

# The backup script still executes its real identity checks; only external Docker/DB IO is faked.
cat > "$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
case "$1:$2" in
  ps:-q) printf 'synthetic-container\n' ;;
  exec:synthetic-container) printf 'infraege' ;;
  *) exit 99 ;;
esac
FAKE
cat > "$test_root/bin/python3" <<'FAKE'
#!/usr/bin/env bash
[[ $1 == */application_db.py && $2 == bundle ]] || exit 99
FAKE
cat > "$test_root/bin/restic" <<'FAKE'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$FAKE_RESTIC_STATE/argv"
# The off-site repository (Change 196): copies keep their source ID as `original`.
if [[ $RESTIC_REPOSITORY == s3:* ]]; then
  [[ ${AWS_SECRET_ACCESS_KEY:-} == synthetic-offsite-secret ]] || exit 95
  case "$1" in
    cat) [[ $2 != config || -f $FAKE_RESTIC_STATE/offsite-config ]] ;;
    init) [[ " $* " == *' --copy-chunker-params '* ]]; touch "$FAKE_RESTIC_STATE/offsite-config" ;;
    copy) [[ ${FAKE_OFFSITE_FAIL:-0} == 0 ]]; cp "$FAKE_RESTIC_STATE/last-id" "$FAKE_RESTIC_STATE/offsite-original" ;;
    forget) [[ " $* " == *' --keep-tag infraege-recovery-hold '* ]] ;;
    snapshots) jq -n --arg o "$(cat "$FAKE_RESTIC_STATE/offsite-original")" '[{id:("c" * 64), original:$o}]' ;;
    stats) echo '{"total_size":4096}' ;;
    *) exit 94 ;;
  esac
  exit 0
fi
case "$1" in
  snapshots)
    if [[ " $* " == *' --json '* ]]; then
      if [[ " $* " == *' infraege-recovery-hold '* ]]; then echo '[{"short_id":"94c5a3e7","time":"2026-09-25T20:55:00Z"}]'; else echo '[{},{}]'; fi
    fi
    ;;
  stats) echo '{"total_size":2048}' ;;
  backup)
    number=$(($(cat "$FAKE_RESTIC_STATE/count" 2>/dev/null || printf 0) + 1))
    printf '%s\n' "$number" > "$FAKE_RESTIC_STATE/count"
    if [[ $number == 1 ]]; then id=$(printf 'a%.0s' {1..64}); else id=$(printf 'b%.0s' {1..64}); fi
    printf '%s\n' "$id" > "$FAKE_RESTIC_STATE/last-id"
    if [[ " $* " == *' infraege-recovery-hold '* ]]; then
      printf '%s\n' "$id" > "$FAKE_RESTIC_STATE/held-id"
    fi
    [[ ${FAKE_MALFORMED_SUMMARY:-0} == 0 ]] || { printf '{"message_type":"summary"}\n'; exit 0; }
    printf '{"message_type":"summary","snapshot_id":"%s"}\n' "$id"
    ;;
  cat)
    id=$3
    [[ $id == "$(cat "$FAKE_RESTIC_STATE/last-id")" || $id == "$(cat "$FAKE_RESTIC_STATE/held-id" 2>/dev/null)" ]] || exit 1
    [[ ${FAKE_LOSE_NEW_SNAPSHOT:-0} == 0 || $id != "$(cat "$FAKE_RESTIC_STATE/last-id")" ]] || exit 1
    if [[ $id == "$(cat "$FAKE_RESTIC_STATE/held-id" 2>/dev/null)" ]]; then
      printf '{"tags":["infraege-application","infraege-recovery-hold"]}\n'
    else
      printf '{"tags":["infraege-application"]}\n'
    fi
    ;;
  forget)
    printf '%s\n' "$*" >> "$FAKE_RESTIC_STATE/forget-args"
    [[ " $* " == *' --keep-tag infraege-recovery-hold '* ]] || exit 1
    ;;
  *) exit 99 ;;
esac
FAKE
chmod +x "$test_root/bin/"*
mkdir -p "$FAKE_RESTIC_STATE"
export PATH="$test_root/bin:$PATH"

DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env" --recovery-hold
held_id=$(cat "$FAKE_RESTIC_STATE/held-id")
[[ $(jq -r '.snapshotId' "$BACKUP_STATUS_FILE") == "$held_id" ]]
[[ $(jq -r '.recoveryHold' "$BACKUP_STATUS_FILE") == true ]]
DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env"
[[ $(jq -r '.recoveryHold' "$BACKUP_STATUS_FILE") == false ]]
restic cat snapshot "$held_id" |
  jq -e '(.tags | index("infraege-application")) != null and
    (.tags | index("infraege-recovery-hold")) != null' >/dev/null
[[ $(wc -l < "$FAKE_RESTIC_STATE/forget-args") == 2 ]]

if FAKE_MALFORMED_SUMMARY=1 bash "$repo_dir/scripts/backup.sh" "$test_root/env" >/dev/null 2>&1; then
  echo 'malformed backup summary accepted' >&2; exit 1
fi
if FAKE_LOSE_NEW_SNAPSHOT=1 bash "$repo_dir/scripts/backup.sh" "$test_root/env" --recovery-hold >/dev/null 2>&1; then
  echo 'lost protected snapshot accepted' >&2; exit 1
fi

# Without the off-site credentials file the copy is reported as not configured, never as success.
DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env"
[[ $(jq -r .status "$OFFSITE_STATUS_FILE") == not-configured ]]
[[ $(jq -r .snapshots "$BACKUP_STATUS_FILE") == 2 && $(jq -r '.holds[0].name' "$BACKUP_STATUS_FILE") == 94c5a3e7 ]]
[[ $(jq -r '.jobs[1].status' "$BACKUP_SUMMARY_FILE") == not-configured ]]

# Configured: the new snapshot is copied, found by its original ID and retention keeps the hold.
cat > "$OFFSITE_ENV_FILE" <<ENV
# off-site repository (synthetic)
OFFSITE_RESTIC_REPOSITORY=s3:https://storage.example/bucket
AWS_ACCESS_KEY_ID=synthetic-offsite-id
AWS_SECRET_ACCESS_KEY=synthetic-offsite-secret
AWS_DEFAULT_REGION=ru-central1
ENV
chmod 600 "$OFFSITE_ENV_FILE"
DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env"
[[ $(jq -r .status "$OFFSITE_STATUS_FILE") == success ]]
[[ $(jq -r .snapshotId "$OFFSITE_STATUS_FILE") == "$(cat "$FAKE_RESTIC_STATE/last-id")" ]]
[[ $(jq -r .offsiteSnapshotId "$OFFSITE_STATUS_FILE") == "$(printf 'c%.0s' {1..64})" ]]
[[ $(jq -r .sizeBytes "$OFFSITE_STATUS_FILE") == 4096 ]]
summary=$BACKUP_SUMMARY_FILE
[[ $(jq -r .schema "$summary") == smotryashchiy.backup/1 && $(jq -r '.jobs[0].name' "$summary") == local ]]
[[ $(jq -r '.repositories | map(.name) | join(",")' "$summary") == local,offsite ]]
[[ $(jq -r '.holds[0].review_after_days' "$summary") == 30 ]]
[[ $(stat -c %a "$summary") == 640 ]]
if grep -q synthetic-offsite-secret "$FAKE_RESTIC_STATE/argv" "$summary" "$OFFSITE_STATUS_FILE"; then
  echo 'an off-site secret reached argv or a status file' >&2; exit 1
fi

# A failed copy keeps the local backup valid, records the failure and fails the run.
rm -- "$BACKUP_STATUS_FILE"
if FAKE_OFFSITE_FAIL=1 DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env" 2>/dev/null; then
  echo 'failed off-site copy reported success' >&2; exit 1
fi
[[ $(jq -r .status "$OFFSITE_STATUS_FILE") == failed ]]
[[ $(jq -r .status "$BACKUP_STATUS_FILE") == success ]]

# A loose or executable-looking credentials file is refused, and nothing in it runs.
chmod 644 "$OFFSITE_ENV_FILE"
if DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env" 2>/dev/null; then
  echo 'loose off-site credentials accepted' >&2; exit 1
fi
printf 'touch %s/pwned\n' "$test_root" > "$OFFSITE_ENV_FILE"; chmod 600 "$OFFSITE_ENV_FILE"
if DB_ENV=test DB_PROJECT=infraege-full-gate bash "$repo_dir/scripts/backup.sh" "$test_root/env" 2>/dev/null; then
  echo 'unexpected credentials line accepted' >&2; exit 1
fi
[[ ! -e $test_root/pwned ]]
echo 'Backup retention contract: PASS (two same-day modes, exact ID, malformed/lost proof, off-site copy)'
