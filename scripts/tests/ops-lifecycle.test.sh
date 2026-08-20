#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
opsctl="$repo_dir/ops/opsctl"
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
production_dir="$test_root/production"
fake_bin="$test_root/bin"
calls="$test_root/calls.log"
env_file="$test_root/ops.env"
release=0123456789abcdef0123456789abcdef01234567
mkdir -p "$production_dir" "$fake_bin"

cat >"$env_file" <<'EOF'
OPS_POSTGRES_PASSWORD=do-not-print-postgres
UMAMI_APP_SECRET=do-not-print-umami
BESZEL_AGENT_TOKEN=do-not-print-token
BESZEL_AGENT_KEY=do-not-print-key
WIREGUARD_IP=10.77.0.1
EOF
printf 'synthetic-password-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ\n' \
  >"$production_dir/root-admin-password"
printf 'synthetic-host-key\n' >"$production_dir/known_hosts"
chmod 600 "$env_file" "$production_dir/root-admin-password" "$production_dir/known_hosts"

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
printf 'docker %s\n' "$*" >>"$OPS_CALLS"
EOF
cat >"$fake_bin/scp" <<'EOF'
#!/usr/bin/env bash
printf 'scp %s\n' "$*" >>"$OPS_CALLS"
EOF
cat >"$fake_bin/ssh" <<'EOF'
#!/usr/bin/env bash
printf 'ssh %s\n' "$*" >>"$OPS_CALLS"
cat >/dev/null
EOF
chmod +x "$fake_bin/docker" "$fake_bin/scp" "$fake_bin/ssh"

if "$opsctl" config --env-file "$env_file" --release short >/dev/null 2>&1; then
  echo 'short release unexpectedly accepted' >&2
  exit 1
fi
if "$opsctl" install --release "$release" >/dev/null 2>&1; then
  echo 'missing environment unexpectedly accepted' >&2
  exit 1
fi
[[ ! -e $calls ]]

PATH="$fake_bin:$PATH" OPS_CALLS="$calls" \
  "$opsctl" config --env-file "$env_file" --release "$release" >/dev/null
grep -Fq 'docker compose' "$calls"
grep -Fq -- '--project-name infraege-ops' "$calls"
grep -Fq -- 'config --quiet' "$calls"

: >"$calls"
PATH="$fake_bin:$PATH" OPS_CALLS="$calls" INFRAEGE_PRODUCTION_DIR="$production_dir" \
  "$opsctl" status
grep -Fq 'ssh ' "$calls"
grep -Fq 'StrictHostKeyChecking=yes' "$calls"
! grep -Fq 'scp ' "$calls"

: >"$calls"
PATH="$fake_bin:$PATH" OPS_CALLS="$calls" INFRAEGE_PRODUCTION_DIR="$production_dir" \
  "$opsctl" install --env-file "$env_file" --release "$release"
[[ $(grep -c '^scp ' "$calls") -eq 2 ]]
grep -Fq "root@2.26.8.245:/root/infraege-ops-$release.tar.gz" "$calls"
grep -Fq "root@2.26.8.245:/root/infraege-ops-$release.env" "$calls"
grep -Fq "ACTION=install OPS_RELEASE=$release bash -s" "$calls"
! grep -Eq 'do-not-print-(postgres|umami|token|key)' "$calls"

: >"$calls"
PATH="$fake_bin:$PATH" OPS_CALLS="$calls" INFRAEGE_PRODUCTION_DIR="$production_dir" \
  "$opsctl" update --env-file "$env_file" --release "$release"
grep -Fq "ACTION=update OPS_RELEASE=$release bash -s" "$calls"

: >"$calls"
PATH="$fake_bin:$PATH" OPS_CALLS="$calls" INFRAEGE_PRODUCTION_DIR="$production_dir" \
  "$opsctl" rollback
grep -Fq 'ACTION=rollback bash -s' "$calls"
! grep -Fq 'scp ' "$calls"

grep -Fq 'docker network inspect "$network"' "$repo_dir/ops/observability/remote-deploy.sh"
grep -Fq 'docker network create "$network"' "$repo_dir/ops/observability/remote-deploy.sh"
grep -Fq 'flock -n 9' "$repo_dir/ops/observability/remote-deploy.sh"
grep -Fq "infraege-ops is already installed; use update" \
  "$repo_dir/ops/observability/remote-deploy.sh"
grep -Fq 'label=com.infraege.service=$legacy_service' \
  "$repo_dir/ops/observability/remote-deploy.sh"
grep -Fq 'complete the approved cutover step first' \
  "$repo_dir/ops/observability/remote-deploy.sh"
grep -Fq 'up --detach --remove-orphans --wait --wait-timeout 180' \
  "$repo_dir/ops/observability/remote-deploy.sh"
! rg -n 'infra/docker-compose|project-name infraege([[:space:]]|$)' \
  "$repo_dir/ops/observability/manage.sh" \
  "$repo_dir/ops/observability/remote-deploy.sh" \
  "$repo_dir/ops/observability/remote-status.sh"

echo 'operations lifecycle test: PASS'
