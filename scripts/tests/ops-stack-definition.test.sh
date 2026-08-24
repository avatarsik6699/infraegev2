#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
env_file="$test_root/ops.env"
release=0123456789abcdef0123456789abcdef01234567

cat >"$env_file" <<'EOF'
OPS_POSTGRES_PASSWORD=synthetic-postgres-password
UMAMI_APP_SECRET=synthetic-umami-secret
BESZEL_AGENT_TOKEN=synthetic-agent-token
BESZEL_AGENT_KEY=synthetic-agent-key
WIREGUARD_IP=10.77.0.1
EOF
chmod 600 "$env_file"
containers_before=$(docker ps --all --quiet --filter label=com.docker.compose.project=infraege-ops)

OPS_RELEASE=$release docker compose --env-file "$env_file" --project-name infraege-ops \
  -f "$repo_dir/ops/observability/compose.yml" config --format json >"$test_root/compose.json"
"$repo_dir/ops/opsctl" config --env-file "$env_file" --release "$release" >/dev/null

jq -e --arg release "$release" '
  (.services | keys) == ["beszel","beszel-agent","docker-socket-proxy","postgres","umami"] and
  .services.postgres.labels["com.infraege.ops.component"] == "ops-postgres" and
  .services.umami.labels["com.infraege.ops.revision"] == $release and
  (.services.postgres | has("ports") | not) and
  .networks["ops-internal"].internal == true and
  .services.umami.ports[0].host_ip == "10.77.0.1" and
  .services.beszel.ports[0].host_ip == "10.77.0.1" and
  .services["docker-socket-proxy"].ports[0].host_ip == "127.0.0.1" and
  .services["docker-socket-proxy"].environment.POST == "0" and
  .services["docker-socket-proxy"].volumes[0].read_only == true and
  .services["beszel-agent"].environment.DOCKER_HOST == "tcp://127.0.0.1:2375" and
  .services.postgres.healthcheck.test[1] == "pg_isready -U umami -d umami" and
  (.services.umami.healthcheck.test[1] | contains("/api/heartbeat")) and
  ([.services[].image] | all(test("@sha256:[a-f0-9]{64}$"))) and
  ([.services[].labels["com.infraege.ops.managed"]] | all(. == "true")) and
  .networks["observability-ingress"].external == true and
  .networks["observability-ingress"].name == "infraege-observability-ingress" and
  .services.umami.networks["observability-ingress"].aliases == ["umami"] and
  (.services.beszel.networks | has("ops-internal")) and
  (.services.beszel.networks | has("observability-ingress")) and
  (.services.postgres.networks | has("observability-ingress") | not) and
  (.volumes | keys) == ["beszel-data","beszel-socket","ops-postgres-data"]
' "$test_root/compose.json" >/dev/null

if env -u UMAMI_APP_SECRET OPS_RELEASE=$release \
  OPS_POSTGRES_PASSWORD=synthetic-postgres BESZEL_AGENT_TOKEN=synthetic-token \
  BESZEL_AGENT_KEY=synthetic-key WIREGUARD_IP=10.77.0.1 \
  docker compose --env-file /dev/null --project-name infraege-ops \
  -f "$repo_dir/ops/observability/compose.yml" config --quiet \
  >"$test_root/missing.out" 2>"$test_root/missing.err"; then
  echo 'operations Compose accepted a missing required variable' >&2
  exit 1
fi
grep -Fq 'UMAMI_APP_SECRET is required' "$test_root/missing.err"

grep -Ev '^(#|$)' "$repo_dir/ops/observability/env.contract" | sort >"$test_root/actual-env"
printf '%s\n' \
  BESZEL_AGENT_KEY BESZEL_AGENT_TOKEN OPS_POSTGRES_PASSWORD UMAMI_APP_SECRET WIREGUARD_IP |
  sort >"$test_root/expected-env"
cmp "$test_root/expected-env" "$test_root/actual-env"
! grep -Eq '^[A-Z0-9_]+=' "$repo_dir/ops/observability/env.contract"

jq -e '
  .schema_version == 3 and
  .target_id == "infraegev2-production" and
  .project.slug == "infraegev2" and
  .project.name == "infraegev2" and
  ([.sources[].adapter_id] | sort) ==
    ["beszel-api","fail2ban-ssh","host-metrics-ssh","journal-http","push","umami-http","uptime-http"] and
  ([.sources[] | select(.adapter_id == "journal-http")][0].config.host == "10.77.0.1") and
  ([.sources[] | select(.adapter_id == "umami-http")][0].config.password == "<create-in-sre-kit>") and
  ([.sources[] | select(.adapter_id == "push")][0].config == {}) and
  ([.sources[] | select(.adapter_id == "push")][0].producer.token == "<generate-and-store-outside-git>") and
  ([.sources[] | select(.adapter_id == "push")][0].emits == ["traffic.request_count"])
' "$repo_dir/ops/observability/sre-kit-sources.example.json" >/dev/null

for file in \
  "$repo_dir/ops/opsctl" \
  "$repo_dir/ops/observability/manage.sh" \
  "$repo_dir/ops/observability/remote-deploy.sh" \
  "$repo_dir/ops/observability/remote-status.sh"; do
  bash -n "$file"
done

containers_after=$(docker ps --all --quiet --filter label=com.docker.compose.project=infraege-ops)
[[ $containers_before == "$containers_after" ]]

echo 'operations stack definition test: PASS'
