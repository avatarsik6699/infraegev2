#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_SHA:?DEPLOY_SHA is required}"
[[ $DEPLOY_SHA =~ ^[0-9a-f]{40}$ ]] || { echo "DEPLOY_SHA must be a full SHA" >&2; exit 64; }

validate_production_env() {
  local target=$1
  [[ -r $target ]] || return 1
  (
    set -a
    # shellcheck disable=SC1090
    source "$target"
    set +a
  ) >/dev/null 2>&1
}

if [[ ${1:-} == --validate-env ]]; then
  [[ $# == 2 ]] || { echo "usage: $0 --validate-env PATH" >&2; exit 64; }
  validate_production_env "$2"
  exit
fi

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'production deploy must run as root' >&2
  exit 1
}

root=/opt/infraege
observability_network=infraege-observability-ingress
release_dir="$root/releases/$DEPLOY_SHA"
archive="/root/infraege-$DEPLOY_SHA.tar.gz"
env_file=/etc/infraege/production.env
[[ -r $archive && -r $env_file ]] || { echo "release archive or production env missing" >&2; exit 1; }
validate_production_env "$env_file" || {
  echo "production environment is not shell-sourceable; no release changes were made" >&2
  exit 65
}

mkdir -p "$release_dir"
tar --extract --gzip --file "$archive" --directory "$release_dir"
previous_release=""
if [[ -L $root/current ]]; then
  previous_release=$(readlink -f "$root/current")
fi

run_compose() {
  local target_dir=$1
  local target_sha=$2
  shift 2
  DEPLOY_SHA="$target_sha" docker compose --env-file "$env_file" --project-name infraege \
    -f "$target_dir/infra/docker-compose.yml" \
    -f "$target_dir/infra/docker-compose.prod.yml" "$@"
}

rollback() {
  if [[ -n $previous_release && -r $previous_release/.deploy-sha ]]; then
    previous_sha=$(<"$previous_release/.deploy-sha")
    echo "Deploy failed; rolling back to $previous_sha" >&2
    run_compose "$previous_release" "$previous_sha" up --detach --remove-orphans
  fi
}
trap rollback ERR

printf '%s\n' "$DEPLOY_SHA" > "$release_dir/.deploy-sha"
docker network inspect "$observability_network" >/dev/null 2>&1 ||
  docker network create "$observability_network" >/dev/null
run_compose "$release_dir" "$DEPLOY_SHA" config --quiet
run_compose "$release_dir" "$DEPLOY_SHA" pull
if ! run_compose "$release_dir" "$DEPLOY_SHA" run --rm --no-deps --interactive=false --entrypoint /bin/sh nginx \
  -ec 'test -r /etc/letsencrypt/live/infraege.ru/fullchain.pem && test -r /etc/letsencrypt/live/infraege.ru/privkey.pem'; then
  echo "TLS certificate is missing or unreadable inside the Nginx container; run obtain-initial-certificate.sh first" >&2
  exit 1
fi
run_compose "$release_dir" "$DEPLOY_SHA" up --detach --wait --wait-timeout 60 postgres
run_compose "$release_dir" "$DEPLOY_SHA" up --detach --remove-orphans --wait --wait-timeout 180

curl --fail --silent --show-error --max-time 15 https://infraege.ru/health/ready |
  jq -e --arg sha "$DEPLOY_SHA" '.status == "ok" and .version == $sha' >/dev/null
curl --fail --silent --show-error --max-time 15 https://infraege.ru/ >/dev/null

run_compose "$release_dir" "$DEPLOY_SHA" run --rm --no-deps --interactive=false \
  --volume "$root:$root" --entrypoint /bin/ln nginx -sfn "$release_dir" "$root/current"
jq -n --arg status healthy --arg sha "$DEPLOY_SHA" --arg deployedAt "$(date --utc +%FT%TZ)" \
  '{status:$status,sha:$sha,deployedAt:$deployedAt}' > /var/lib/infraege/deploy-status.json
chmod 644 /var/lib/infraege/deploy-status.json

env_tmp=$(mktemp "${env_file}.XXXXXX")
awk -v deploy_sha="$DEPLOY_SHA" '
  BEGIN { updated = 0 }
  /^DEPLOY_SHA=/ { print "DEPLOY_SHA=" deploy_sha; updated = 1; next }
  { print }
  END { if (!updated) print "DEPLOY_SHA=" deploy_sha }
' "$env_file" > "$env_tmp"
chmod 600 "$env_tmp"
mv "$env_tmp" "$env_file"

trap - ERR
echo "Deployment $DEPLOY_SHA is healthy."
