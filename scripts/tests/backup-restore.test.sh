#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
fake_bin="$test_root/bin"
backup_root="$test_root/backups"
docker_log="$test_root/docker.log"
mkdir -p "$fake_bin" "$backup_root"

cat >"$fake_bin/restic" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
[[ ${1:-} == restore && ${2:-} == latest && ${3:-} == --target ]]
mkdir -p "$4/snapshot"
: >"$4/snapshot/application.dump"
: >"$4/snapshot/umami.dump"
EOF

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >>"$DOCKER_LOG"

case "${1:-}" in
  run)
    printf 'synthetic-container-id\n'
    ;;
  exec)
    if [[ " $* " == *' pg_restore '* && " $* " == *' umami_restore '* \
      && ${FAIL_UMAMI_RESTORE:-0} == 1 ]]; then
      exit 1
    fi
    ;;
  cp | rm)
    ;;
  *)
    echo "unexpected docker command: $*" >&2
    exit 1
    ;;
esac
EOF
chmod +x "$fake_bin/restic" "$fake_bin/docker"

run_restore_check() {
  PATH="$fake_bin:$PATH" \
    BACKUP_ROOT="$backup_root" \
    RESTIC_PASSWORD_FILE="$test_root/restic-password" \
    DOCKER_LOG="$docker_log" \
    FAIL_UMAMI_RESTORE="${1:-0}" \
    "$repo_dir/scripts/restore-check.sh"
}

run_restore_check
role_line=$(grep -nF "psql -U postgres --set ON_ERROR_STOP=1 --command CREATE ROLE umami NOLOGIN;" \
  "$docker_log" | cut -d: -f1)
restore_line=$(grep -nF "pg_restore -U postgres --exit-on-error -d umami_restore" \
  "$docker_log" | cut -d: -f1)
[[ $role_line -lt $restore_line ]]
grep -Fq 'rm --force infraege-restore-check-' "$docker_log"
[[ -z $(find "$backup_root" -maxdepth 1 -type d -name 'restore.*' -print -quit) ]]

: >"$docker_log"
if run_restore_check 1 >/dev/null 2>&1; then
  echo 'restore check accepted a failed Umami restore' >&2
  exit 1
fi
grep -Fq 'rm --force infraege-restore-check-' "$docker_log"
[[ -z $(find "$backup_root" -maxdepth 1 -type d -name 'restore.*' -print -quit) ]]

echo 'backup and restore drill test: PASS'
