#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
fake_bin="$test_root/bin"
backup_root="$test_root/backups"
release=0123456789abcdef0123456789abcdef01234567
release_dir="$test_root/releases/$release"
env_file="$test_root/$release.env"
docker_log="$test_root/docker.log"
restic_log="$test_root/restic.log"
mkdir -p "$fake_bin" "$backup_root" "$release_dir"
cp "$repo_dir/ops/observability/"{compose.yml,backup.sh,restore-check.sh,prune-umami-data.sh} \
  "$release_dir/"
cp "$repo_dir/ops/postgres/umami-retention.sql" "$release_dir/"
cat >"$env_file" <<'EOF'
OPS_POSTGRES_PASSWORD=synthetic-postgres
UMAMI_APP_SECRET=synthetic-umami
BESZEL_AGENT_TOKEN=synthetic-token
BESZEL_AGENT_KEY=synthetic-key
WIREGUARD_IP=10.77.0.1
EOF

cat >"$fake_bin/restic" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >>"$RESTIC_LOG"
case "${1:-}" in
  snapshots)
    [[ " $* " == *' --json '* ]] && printf '[{"id":"ops-snapshot","time":"2026-08-20T00:00:00Z"}]\n'
    ;;
  restore)
    target=
    while (($#)); do
      [[ $1 == --target ]] && { target=$2; break; }
      shift
    done
    mkdir -p "$target/snapshot/beszel-data"
    : >"$target/snapshot/umami.dump"
    ;;
esac
EOF

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >>"$DOCKER_LOG"
case "${1:-}" in
  compose)
    if [[ " $* " == *' exec -T postgres pg_dump '* ]]; then
      printf 'synthetic-umami-dump'
    elif [[ " $* " == *' cp beszel:/beszel_data/. '* ]]; then
      mkdir -p "${@: -1}"
      : >"${@: -1}/data.db"
    fi
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
chmod +x "$fake_bin/restic" "$fake_bin/docker" "$release_dir/"*.sh

PATH="$fake_bin:$PATH" OPS_BACKUP_ROOT="$backup_root" RESTIC_LOG="$restic_log" \
  DOCKER_LOG="$docker_log" RESTIC_PASSWORD_FILE="$test_root/restic-password" \
  RESTIC_LOCK_FILE="$test_root/restic.lock" OPS_BACKUP_STATUS_FILE="$test_root/status.json" \
  "$release_dir/backup.sh" "$env_file"

grep -Fq 'backup --tag infraege-ops' "$restic_log"
grep -Fq 'forget --tag infraege-ops' "$restic_log"
grep -Fq 'pg_dump -U umami -Fc umami' "$docker_log"
grep -Fq 'cp beszel:/beszel_data/.' "$docker_log"
jq -e '.status == "success" and .snapshotId == "ops-snapshot"' "$test_root/status.json" >/dev/null

: >"$docker_log"
: >"$restic_log"
PATH="$fake_bin:$PATH" OPS_BACKUP_ROOT="$backup_root" RESTIC_LOG="$restic_log" \
  DOCKER_LOG="$docker_log" RESTIC_PASSWORD_FILE="$test_root/restic-password" \
  RESTIC_LOCK_FILE="$test_root/restic.lock" "$release_dir/restore-check.sh"

grep -Fq 'restore latest --tag infraege-ops --target' "$restic_log"
grep -Fq 'CREATE ROLE umami NOLOGIN;' "$docker_log"
grep -Fq 'pg_restore -U postgres --exit-on-error -d umami_restore' "$docker_log"
grep -Fq 'rm --force infraege-ops-restore-check-' "$docker_log"
[[ -z $(find "$backup_root" -maxdepth 1 -type d -name 'restore.*' -print -quit) ]]

grep -Fq 'ExecStart=/opt/infraege/current/scripts/backup.sh' \
  "$repo_dir/ops/systemd/infraege-backup.service"
grep -Fq 'ExecStart=/opt/infraege-ops/current/backup.sh' \
  "$repo_dir/ops/systemd/infraege-ops-backup.service"
grep -Fq 'ExecStart=/opt/infraege-ops/current/restore-check.sh' \
  "$repo_dir/ops/systemd/infraege-ops-restore-check.service"
grep -Fq 'ExecStart=/opt/infraege-ops/current/prune-umami-data.sh' \
  "$repo_dir/ops/systemd/infraege-ops-analytics-retention.service"
grep -Fq 'activate-operations' "$repo_dir/ops/install-backup-timers.sh"
grep -Fq 'disable --now infraege-analytics-retention.timer' \
  "$repo_dir/ops/install-backup-timers.sh"

echo 'operations backup and restore drill test: PASS'
