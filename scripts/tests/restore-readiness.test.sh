#!/usr/bin/env bash
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/bin" "$test_root/backups"
export BACKUP_ROOT="$test_root/backups" RESTIC_LOCK_FILE="$test_root/restic.lock"
export RESTORE_STATUS_FILE="$test_root/status.json" RESTORE_TEST_LOG="$test_root/calls"
export DB_ENV=restore DB_PROJECT=infraege-restore

# Run the real orchestration; only external backup/database IO and retry sleep are faked.
cat > "$test_root/bin/restic" <<'FAKE'
#!/usr/bin/env bash
set -euo pipefail
[[ $* == 'restore latest --tag infraege-application --target '* ]] || exit 99
mkdir -p "${@: -1}/bundle"
printf '{}\n' > "${@: -1}/bundle/metadata.json"
FAKE
cat > "$test_root/bin/python3" <<'FAKE'
#!/usr/bin/env bash
set -euo pipefail
[[ $1 == */application_db.py ]] || exit 99
case $2 in
  validate|restore|smoke) printf '%s\n' "$2" >> "$RESTORE_TEST_LOG" ;;
  *) exit 99 ;;
esac
FAKE
cat > "$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
set -euo pipefail
case "$1:$2" in
  volume:inspect) exit 1 ;;
  volume:create|volume:rm|rm:--force) printf '%s\n' "$1 $2" >> "$RESTORE_TEST_LOG" ;;
  run:--detach) printf 'run\n' >> "$RESTORE_TEST_LOG" ;;
  exec:infraege-restore-check-*)
    [[ $3 == pg_isready ]] || exit 99
    # pg_isready can accept connections yet log FATAL for a nonexistent default database.
    database=restore_admin
    shift 3
    while (($#)); do
      case $1 in
        -d) database=$2; shift 2 ;;
        -h|-U) shift 2 ;;
        *) exit 99 ;;
      esac
    done
    printf 'probe %s\n' "$database" >> "$RESTORE_TEST_LOG"
    [[ $database == postgres ]] || printf 'FATAL nonexistent database\n' >> "$RESTORE_TEST_LOG"
    exit "${RESTORE_TEST_PROBE_EXIT:-0}"
    ;;
  *) exit 99 ;;
esac
FAKE
printf '#!/usr/bin/env bash\nexit 0\n' > "$test_root/bin/sleep"
chmod +x "$test_root/bin/"*
export PATH="$test_root/bin:$PATH"

bash "$repo_dir/scripts/restore-check.sh" > "$test_root/output" 2>&1
[[ $(grep -c '^probe postgres$' "$RESTORE_TEST_LOG") == 2 ]]
if grep -q '^FATAL' "$RESTORE_TEST_LOG"; then
  echo 'readiness probe logged a false FATAL' >&2; exit 1
fi
grep -qx 'restore' "$RESTORE_TEST_LOG"
grep -qx 'smoke' "$RESTORE_TEST_LOG"
jq -e '.status == "success"' "$RESTORE_STATUS_FILE" >/dev/null

rm "$RESTORE_STATUS_FILE"
: > "$RESTORE_TEST_LOG"
if RESTORE_TEST_PROBE_EXIT=2 bash "$repo_dir/scripts/restore-check.sh" > "$test_root/output" 2>&1; then
  echo 'unready PostgreSQL accepted' >&2; exit 1
fi
[[ ! -e $RESTORE_STATUS_FILE ]]
if grep -Eq '^(restore|smoke)$' "$RESTORE_TEST_LOG"; then
  echo 'restore ran before readiness' >&2; exit 1
fi
grep -qx 'rm --force' "$RESTORE_TEST_LOG"
grep -qx 'volume rm' "$RESTORE_TEST_LOG"
echo 'Restore readiness: PASS (explicit database, failure blocks restore, cleanup runs)'
