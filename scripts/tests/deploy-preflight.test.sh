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
[[ $preflight_line -lt $extract_line && $preflight_line -lt $pull_line ]]

echo 'deploy environment preflight test: PASS'
