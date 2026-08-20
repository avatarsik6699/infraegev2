#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
fake_bin="$test_root/bin"
backup_root="$test_root/backups"
docker_log="$test_root/docker.log"
restic_log="$test_root/restic.log"
env_file="$test_root/production.env"
mkdir -p "$fake_bin" "$backup_root"
printf 'POSTGRES_USER=infraege\nPOSTGRES_DB=infraege\nPOSTGRES_PASSWORD=synthetic\n' >"$env_file"

cat >"$fake_bin/restic" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >>"$RESTIC_LOG"
case "${1:-}" in
  snapshots)
    [[ " $* " == *' --json '* ]] && printf '[{"id":"application-snapshot","time":"2026-08-20T00:00:00Z"}]\n'
    ;;
  restore)
    target=
    while (($#)); do
      [[ $1 == --target ]] && { target=$2; break; }
      shift
    done
    mkdir -p "$target/snapshot"
    : >"$target/snapshot/application.dump"
    ;;
esac
EOF

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >>"$DOCKER_LOG"
case "${1:-}" in
  compose)
    [[ " $* " == *' exec -T postgres pg_dump '* ]] && printf 'synthetic-dump'
    ;;
  run)
    printf 'synthetic-container-id\n'
    ;;
  exec | cp | rm)
    ;;
  *)
    echo "unexpected docker command: $*" >&2
    exit 1
    ;;
esac
EOF
chmod +x "$fake_bin/restic" "$fake_bin/docker"

PATH="$fake_bin:$PATH" BACKUP_ROOT="$backup_root" RESTIC_LOG="$restic_log" \
  DOCKER_LOG="$docker_log" RESTIC_PASSWORD_FILE="$test_root/restic-password" \
  RESTIC_LOCK_FILE="$test_root/restic.lock" BACKUP_STATUS_FILE="$test_root/status.json" \
  "$repo_dir/scripts/backup.sh" "$env_file"

grep -Fq 'backup --tag infraege-application' "$restic_log"
grep -Fq 'forget --tag infraege-application' "$restic_log"
grep -Fq 'snapshots --tag infraege-application --json' "$restic_log"
! grep -Eq 'umami|beszel' "$docker_log"
jq -e '.status == "success" and .snapshotId == "application-snapshot"' \
  "$test_root/status.json" >/dev/null

: >"$docker_log"
: >"$restic_log"
PATH="$fake_bin:$PATH" BACKUP_ROOT="$backup_root" RESTIC_LOG="$restic_log" \
  DOCKER_LOG="$docker_log" RESTIC_PASSWORD_FILE="$test_root/restic-password" \
  RESTIC_LOCK_FILE="$test_root/restic.lock" "$repo_dir/scripts/restore-check.sh"

grep -Fq 'restore latest --tag infraege-application --target' "$restic_log"
grep -Fq 'pg_restore -U postgres --exit-on-error -d application_restore' "$docker_log"
! grep -Eq 'umami|beszel' "$docker_log"
grep -Fq 'rm --force infraege-restore-check-' "$docker_log"
[[ -z $(find "$backup_root" -maxdepth 1 -type d -name 'restore.*' -print -quit) ]]

echo 'application backup and restore drill test: PASS'
