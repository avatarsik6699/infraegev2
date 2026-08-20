#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
release=0123456789abcdef0123456789abcdef01234567
app_env="$test_root/application.env"
ops_env="$test_root/operations.env"

printf 'POSTGRES_PASSWORD=synthetic\n' >"$app_env"
cat >"$ops_env" <<'EOF'
OPS_POSTGRES_PASSWORD=synthetic-postgres
UMAMI_APP_SECRET=synthetic-umami
BESZEL_AGENT_TOKEN=synthetic-token
BESZEL_AGENT_KEY=synthetic-key
WIREGUARD_IP=10.77.0.1
EOF

DEPLOY_SHA=$release docker compose --env-file "$app_env" --project-name infraege \
  -f "$repo_dir/infra/docker-compose.yml" -f "$repo_dir/infra/docker-compose.prod.yml" \
  config --format json >"$test_root/application.json"
OPS_RELEASE=$release docker compose --env-file "$ops_env" --project-name infraege-ops \
  -f "$repo_dir/ops/observability/compose.yml" config --format json \
  >"$test_root/operations.json"

jq -e '
  (.services | keys) == ["api","nginx","postgres","web"] and
  .networks["observability-ingress"].external == true and
  .networks["observability-ingress"].name == "infraege-observability-ingress" and
  (.services.nginx.networks | has("default")) and
  (.services.nginx.networks | has("observability-ingress")) and
  (.volumes | keys) == ["postgres-data"]
' "$test_root/application.json" >/dev/null

jq -e '
  .networks["observability-ingress"].external == true and
  .services.umami.networks["observability-ingress"].aliases == ["umami"] and
  (.services.beszel.networks | has("ops-internal")) and
  (.services.beszel.networks | has("observability-ingress"))
' "$test_root/operations.json" >/dev/null

! rg -n '^  (umami|beszel|beszel-agent|docker-socket-proxy):|^  beszel-(data|socket):' \
  "$repo_dir/infra/docker-compose.prod.yml"
! rg -n 'volume (rm|prune)|down .*--volumes' "$repo_dir/scripts/deploy-remote.sh"

echo 'production application/operations topology test: PASS'
