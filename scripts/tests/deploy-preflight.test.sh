#!/usr/bin/env bash
set -euo pipefail
repo_dir=$(cd "$(dirname "$0")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf "$test_root"' EXIT
export DEPLOY_SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
printf 'POSTGRES_PASSWORD=synthetic\n' > "$test_root/valid"
printf 'INVALID=unquoted value\n' > "$test_root/invalid"
bash "$repo_dir/scripts/deploy-remote.sh" --validate-env "$test_root/valid"
if bash "$repo_dir/scripts/deploy-remote.sh" --validate-env "$test_root/invalid"; then exit 1; fi
source "$repo_dir/scripts/lib/application-db-release.sh"
mkdir -p "$test_root/candidate/infra" "$test_root/previous/infra"
printf '140_01\n' > "$test_root/candidate/infra/database-schema"
printf '122_01\n' > "$test_root/previous/infra/database-schema"
if application_schema_preflight "$test_root/candidate" "$test_root/previous" "$test_root/missing"; then exit 1; fi
printf '140_01\n' > "$test_root/previous/infra/database-schema"
application_schema_preflight "$test_root/candidate" "$test_root/previous" "$test_root/missing"
printf '121_01\n' > "$test_root/previous/infra/database-schema"
if application_schema_preflight "$test_root/candidate" "$test_root/previous" "$test_root/missing"; then exit 1; fi
printf '122_01\n' > "$test_root/previous/infra/database-schema"
[[ $(application_backup_mode "$test_root/candidate" "$test_root/previous") == recovery-hold ]]
# Fake stat reports the production ownership contract; no root filesystem mutation.
stat() { printf '0:600\n'; }
printf '140_01 %s\n' "$DEPLOY_SHA" > "$test_root/proof"
application_schema_preflight "$test_root/candidate" "$test_root/previous" "$test_root/proof"
printf '140_01\n' > "$test_root/previous/infra/database-schema"
[[ $(application_backup_mode "$test_root/candidate" "$test_root/previous") == ordinary ]]
printf 'invalid\n' > "$test_root/candidate/infra/database-schema"
if application_backup_mode "$test_root/candidate" "$test_root/previous" >/dev/null; then exit 1; fi
printf '140_01\n' > "$test_root/candidate/infra/database-schema"
printf '122_01\n' > "$test_root/previous/infra/database-schema"
printf '140_01 wrong-sha\n' > "$test_root/proof"
if application_schema_preflight "$test_root/candidate" "$test_root/previous" "$test_root/proof"; then exit 1; fi
echo 'Deploy preflight: PASS (sourceable env, compatible schema, exact candidate acceptance)'
