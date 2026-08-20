#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
compose_file="$repo_dir/ops/observability/compose.yml"
builder="$repo_dir/ops/observability/build-bundle.py"
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT

synthetic_env=(
  OPS_RELEASE=0123456789abcdef
  OPS_POSTGRES_PASSWORD=synthetic-postgres
  UMAMI_APP_SECRET=synthetic-app
  BESZEL_AGENT_TOKEN=synthetic-token
  BESZEL_AGENT_KEY=synthetic-key
  WIREGUARD_IP=10.77.0.1
)
compose=(docker compose --env-file /dev/null --project-name infraege-ops -f "$compose_file")
containers_before=$(docker ps --all --quiet --filter label=com.docker.compose.project=infraege-ops)

env "${synthetic_env[@]}" "${compose[@]}" config --quiet
env "${synthetic_env[@]}" "${compose[@]}" config --format json >"$test_root/rendered.json"
env "${synthetic_env[@]}" make -s -C "$repo_dir" ops-config

jq -e '
  .name == "infraege-ops" and
  (.services | keys) == ["beszel","beszel-agent","docker-socket-proxy","postgres","umami"] and
  (.services | has("api") | not) and
  (.services | has("nginx") | not) and
  (.services | has("web") | not) and
  .networks["ops-internal"].internal == true and
  (.volumes | keys) == ["beszel-data","beszel-socket","ops-postgres-data"] and
  ([.volumes[].name] | all(startswith("infraege-ops_")))
' "$test_root/rendered.json" >/dev/null

jq -e '
  (.services.postgres | has("ports") | not) and
  .services.umami.ports[0].host_ip == "10.77.0.1" and
  .services.beszel.ports[0].host_ip == "10.77.0.1" and
  .services["docker-socket-proxy"].ports[0].host_ip == "127.0.0.1" and
  .services["docker-socket-proxy"].environment.POST == "0" and
  .services["docker-socket-proxy"].volumes[0].read_only == true and
  .services["beszel-agent"].environment.DOCKER_HOST == "tcp://127.0.0.1:2375" and
  .services.postgres.healthcheck.test[1] == "pg_isready -U umami -d umami" and
  (.services.umami.healthcheck.test[1] | contains("/api/heartbeat")) and
  .services.beszel.labels["com.infraege.ops.health.target"] == "http://beszel:8090/api/health"
' "$test_root/rendered.json" >/dev/null

jq -e '
  [.services[].image] | all(test("@sha256:[a-f0-9]{64}$"))
' "$test_root/rendered.json" >/dev/null
jq -e '
  [.services[].labels["com.infraege.ops.managed"]] | all(. == "true")
' "$test_root/rendered.json" >/dev/null

if env -u UMAMI_APP_SECRET \
  OPS_RELEASE=0123456789abcdef \
  OPS_POSTGRES_PASSWORD=synthetic-postgres \
  BESZEL_AGENT_TOKEN=synthetic-token \
  BESZEL_AGENT_KEY=synthetic-key \
  WIREGUARD_IP=10.77.0.1 \
  "${compose[@]}" config --quiet >"$test_root/missing.out" 2>"$test_root/missing.err"; then
  echo 'operations Compose accepted a missing required variable' >&2
  exit 1
fi
grep -Fq 'UMAMI_APP_SECRET is required' "$test_root/missing.err"

grep -Ev '^(#|$)' "$repo_dir/ops/observability/env.contract" | sort \
  >"$test_root/contract-names"
printf '%s\n' BESZEL_AGENT_KEY BESZEL_AGENT_TOKEN OPS_POSTGRES_PASSWORD OPS_RELEASE \
  UMAMI_APP_SECRET WIREGUARD_IP | sort >"$test_root/expected-names"
cmp "$test_root/expected-names" "$test_root/contract-names"
! grep -Eq '^[A-Z0-9_]+=' "$repo_dir/ops/observability/env.contract"

python3 "$builder" >"$test_root/bundle-a.json"
python3 "$builder" >"$test_root/bundle-b.json"
make -s -C "$repo_dir" ops-bundle >"$test_root/bundle-make.json"
cmp "$test_root/bundle-a.json" "$test_root/bundle-b.json"
cmp "$test_root/bundle-a.json" "$test_root/bundle-make.json"
jq -e '
  .schema_version == 1 and
  .installation_id == "infraege-production" and
  .compose_project == "infraege-ops" and
  (.bundle_id | test("^[a-f0-9]{64}$")) and
  (.assets | length >= 10) and
  ([.assets[].path] | index("ops/observability/compose.yml") != null)
' "$test_root/bundle-a.json" >/dev/null
python3 "$builder" --check "$test_root/bundle-a.json"
python3 "$builder" --output "$test_root/bundle-output.json" >/dev/null
cmp "$test_root/bundle-a.json" "$test_root/bundle-output.json"
! grep -Eq 'synthetic-(postgres|app|token|key)' "$test_root/bundle-a.json"

jq -e '
  .activation_status == "inactive-definition-only" and
  .parallel_start_allowed == false and
  .target_project == "infraege-ops" and
  .future_data.database_name == "umami" and
  (.required_gates | index("fresh-backup") != null) and
  (.required_gates | index("cutover-approval") != null)
' "$repo_dir/ops/observability/backup-cutover.json" >/dev/null

if rg -n '\b(docker compose (up|create|start|pull)|docker (run|create|start)|production-root-ssh)\b' \
  "$repo_dir/ops/observability/build-bundle.py" "$repo_dir/ops/observability/compose.yml"; then
  echo 'stack definition test contains a forbidden lifecycle or production command' >&2
  exit 1
fi
containers_after=$(docker ps --all --quiet --filter label=com.docker.compose.project=infraege-ops)
[[ $containers_before == "$containers_after" ]]

echo 'independent operations stack definition tests: PASS'
