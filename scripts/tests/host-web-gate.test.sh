#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
temporary=$(mktemp -d)
trap 'rm -rf -- "$temporary"' EXIT
fake_bin=$temporary/bin
mkdir "$fake_bin"

cat >"$fake_bin/docker" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$*" >>'$temporary/docker.log'
if [[ \$* == *'--env-file /dev/null'* ]]; then exit 41; fi
if [[ \$* == *'ps --status running -q web' ]]; then printf '%s\n' synthetic-web; fi
EOF
chmod +x "$fake_bin/docker"

set +e
PATH="$fake_bin:$PATH" bash "$repo_dir/scripts/run-host-web-gate.sh" bash -c 'exit 19'
status=$?
set -e
[[ $status == 19 ]]
grep -Fq 'stop web' "$temporary/docker.log"
grep -Fq 'up -d --no-deps web' "$temporary/docker.log"
[[ $(grep -Fc 'stop web' "$temporary/docker.log") == 1 ]]
[[ $(grep -Fc 'up -d --no-deps web' "$temporary/docker.log") == 1 ]]
! grep -Fq -- '--env-file /dev/null' "$temporary/docker.log"
grep -Fq -- '--project-name infraege-full-gate' "$temporary/docker.log"
! grep -Eq -- '--project-name infra([[:space:]]|$)' "$temporary/docker.log"

: >"$temporary/docker.log"
PATH="$fake_bin:$PATH" bash "$repo_dir/scripts/run-host-web-gate.sh" true
grep -Fq 'stop web' "$temporary/docker.log"
grep -Fq 'up -d --no-deps web' "$temporary/docker.log"

: >"$temporary/docker.log"
cat >"$fake_bin/docker" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$*" >>'$temporary/docker.log'
EOF
chmod +x "$fake_bin/docker"
PATH="$fake_bin:$PATH" bash "$repo_dir/scripts/run-host-web-gate.sh" true
! grep -Fq 'stop web' "$temporary/docker.log"
! grep -Fq 'up -d --no-deps web' "$temporary/docker.log"

rendered=$(POSTGRES_PASSWORD=contract-only docker compose --project-name infraege-full-gate \
  -f "$repo_dir/infra/docker-compose.yml" \
  -f "$repo_dir/infra/docker-compose.override.yml" config --format json)
jq -e '
  .name == "infraege-full-gate" and
  .services.nginx.ports[0].published == "18080" and
  .services.web.ports[0].published == "13000" and
  .services.api.ports[0].published == "18000" and
  .services.postgres.ports[0].published == "15432"
' <<<"$rendered" >/dev/null

echo 'host web gate contract: PASS'
