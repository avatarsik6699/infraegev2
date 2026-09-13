#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
deploy_script="$repo_dir/scripts/deploy-remote.sh"
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
valid_env="$test_root/valid.env"
invalid_env="$test_root/invalid.env"
test_sha=0000000000000000000000000000000000000000

printf 'BESZEL_AGENT_KEY="ssh-ed25519 synthetic"\n' >"$valid_env"
printf 'BESZEL_AGENT_KEY=ssh-ed25519 synthetic\n' >"$invalid_env"

DEPLOY_SHA=$test_sha "$deploy_script" --validate-env "$valid_env"
if DEPLOY_SHA=$test_sha "$deploy_script" --validate-env "$invalid_env"; then
  echo 'deploy preflight accepted a non-sourceable environment' >&2
  exit 1
fi

preflight_line=$(grep -n 'validate_production_env "$env_file"' "$deploy_script" | cut -d: -f1)
extract_line=$(grep -n 'tar --extract' "$deploy_script" | cut -d: -f1)
pull_line=$(grep -n '"$DEPLOY_SHA" pull' "$deploy_script" | cut -d: -f1)
network_line=$(grep -n 'docker network inspect "$observability_network"' "$deploy_script" | cut -d: -f1)
config_line=$(grep -n '"$DEPLOY_SHA" config --quiet' "$deploy_script" | cut -d: -f1)
[[ $preflight_line -lt $extract_line && $preflight_line -lt $pull_line ]]
[[ $network_line -lt $config_line && $config_line -lt $pull_line ]]
source_major_line=$(grep -n 'source_major=$(docker exec' "$deploy_script" | cut -d: -f1)
rollback_trap_line=$(grep -n 'trap .*application_deploy_exit' "$deploy_script" | cut -d: -f1)
[[ $source_major_line -lt $rollback_trap_line ]]
! grep -Fq 'init-umami-db.sh' "$deploy_script"

echo 'deploy environment preflight test: PASS'

# Execute the shared rollback path with a fake transport. A switched database must never be
# replaced by the old Compose postgres service, even if the previous release used PG16.
source "$repo_dir/scripts/lib/application-db-release.sh"
previous_release="$test_root/previous"
release_dir="$test_root/candidate"
env_file="$valid_env"
mkdir "$previous_release"
printf '%s\n' "$test_sha" >"$previous_release/.deploy-sha"
docker() { printf '%s\n' "$*" >>"$test_root/rollback.log"; }
run_compose() { printf 'previous-compose %s\n' "$*" >>"$test_root/rollback.log"; }
curl() { printf '{"status":"ok","version":"%s"}\n' "$test_sha"; }
db_switched=true
application_db_rollback "$previous_release" "$release_dir" "$env_file" "$db_switched"
grep -Fq 'up --detach --no-deps --wait --wait-timeout 180 nginx web api' "$test_root/rollback.log"
! grep -Eq 'previous-compose|pg_restore|downgrade|up .*postgres' "$test_root/rollback.log"
: >"$test_root/rollback.log"
db_switched=false
application_db_rollback "$previous_release" "$release_dir" "$env_file" "$db_switched"
grep -Fq 'previous-compose' "$test_root/rollback.log"
echo 'database failure recovery contracts: PASS'

mkdir -p "$release_dir/infra" "$previous_release/infra"
printf '114_01\n' >"$release_dir/infra/database-schema"
printf '114_01\n' >"$previous_release/infra/database-schema"
application_schema_preflight "$release_dir" "$previous_release" "$test_root/missing-proof"
printf 'incompatible\n' >"$previous_release/infra/database-schema"
if application_schema_preflight "$release_dir" "$previous_release" "$test_root/missing-proof" >/dev/null 2>&1; then
  echo 'incompatible schema rollback accepted without proof' >&2; exit 1
fi
application_schema_preflight "$release_dir" '' "$test_root/missing-proof"
echo 'schema rollback preflight contracts: PASS'
