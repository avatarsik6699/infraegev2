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
case "$1" in
  snapshots) exit 0 ;;
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
echo 'Backup retention contract: PASS (two same-day modes, exact ID, malformed/lost proof)'
