#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
# shellcheck source=../lib/production-env.sh
source "$repo_dir/scripts/lib/production-env.sh"

test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
env_file="$test_root/production.env"
compose_file="$test_root/compose.yml"
synthetic_value='ssh-ed25519 AAAA+test/value= operator $HOME `noop` \ "quoted"'

quoted=$(production_env_quote "$synthetic_value")
printf 'SYNTHETIC_VALUE=%s\n' "$quoted" >"$env_file"
production_env_validate "$env_file"

unset SYNTHETIC_VALUE
# shellcheck disable=SC1090
source "$env_file"
[[ $SYNTHETIC_VALUE == "$synthetic_value" ]]

cat >"$compose_file" <<'EOF'
services:
  probe:
    image: scratch
    environment:
      SYNTHETIC_VALUE: ${SYNTHETIC_VALUE:?required}
EOF
compose_value='ssh-ed25519 AAAA+test/value= operator comment'
printf 'SYNTHETIC_VALUE=%s\n' "$(production_env_quote "$compose_value")" >"$env_file"
docker compose --env-file "$env_file" -f "$compose_file" config --format json |
  jq -e --arg expected "$compose_value" \
    '.services.probe.environment.SYNTHETIC_VALUE == $expected' >/dev/null

if production_env_quote $'forbidden\nline' >/dev/null 2>&1; then
  echo 'production_env_quote accepted a line break' >&2
  exit 1
fi
if production_env_quote "forbidden'quote" >/dev/null 2>&1; then
  echo 'production_env_quote accepted a single quote' >&2
  exit 1
fi

grep -Fq 'production_env_quote "$new_key"' "$repo_dir/scripts/configure-beszel-agent.sh"
grep -Fq 'production_env_validate "$new_env"' "$repo_dir/scripts/configure-beszel-agent.sh"

echo 'production environment quoting test: PASS'
