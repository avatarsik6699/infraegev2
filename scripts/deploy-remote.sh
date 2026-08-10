#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_SHA:?DEPLOY_SHA is required}"
[[ $DEPLOY_SHA =~ ^[0-9a-f]{40}$ ]] || { echo "DEPLOY_SHA must be a full SHA" >&2; exit 64; }

root=/opt/infraege
release_dir="$root/releases/$DEPLOY_SHA"
archive="/tmp/infraege-$DEPLOY_SHA.tar.gz"
env_file=/etc/infraege/production.env
[[ -r $archive && -r $env_file ]] || { echo "release archive or production env missing" >&2; exit 1; }
[[ -r /etc/letsencrypt/live/infraege.ru/fullchain.pem ]] || {
  echo "TLS certificate missing; run obtain-initial-certificate.sh first" >&2
  exit 1
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
run_compose "$release_dir" "$DEPLOY_SHA" pull
run_compose "$release_dir" "$DEPLOY_SHA" up --detach postgres
"$release_dir/scripts/init-umami-db.sh" "$env_file"
run_compose "$release_dir" "$DEPLOY_SHA" up --detach --remove-orphans --wait --wait-timeout 180

curl --fail --silent --show-error --max-time 15 https://infraege.ru/health/ready |
  jq -e --arg sha "$DEPLOY_SHA" '.status == "ok" and .version == $sha' >/dev/null
curl --fail --silent --show-error --max-time 15 https://infraege.ru/ >/dev/null
curl --fail --silent --show-error --max-time 15 \
  https://infraege.ru/theory/zadanie-1-graphs-and-tables >/dev/null
curl --fail --silent --show-error --max-time 15 https://infraege.ru/sitemap.xml >/dev/null

ln -sfn "$release_dir" "$root/current"
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
