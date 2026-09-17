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
    source "$target" || exit $?
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

exec 7>/run/lock/infraege-deploy.lock
flock -n 7 || { echo 'another application deploy/DB transfer is active' >&2; exit 1; }

root=/opt/infraege
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

source "$release_dir/scripts/lib/application-db-release.sh"
# Change 122 adopts a separate database. Transfer/import/restore is an explicit operator step.
# A normal deploy must never silently replace the installed production data volume.
application_schema_preflight "$release_dir" "$previous_release" /etc/infraege/minimal-bank-ready
trap 'application_deploy_exit "$?" "$previous_release"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

printf '%s\n' "$DEPLOY_SHA" > "$release_dir/.deploy-sha"
run_compose "$release_dir" "$DEPLOY_SHA" config --quiet
[[ $(run_compose "$release_dir" "$DEPLOY_SHA" config --format json |
  jq -r '.services.api.volumes[] | select(.target=="/task-files") | .source') == /var/lib/infraege/task-files ]] || {
  echo 'production TASK_FILES_DIR must be /var/lib/infraege/task-files' >&2; exit 1;
}
install -d -m 755 -o 1000 -g 1000 /var/lib/infraege/task-files
run_compose "$release_dir" "$DEPLOY_SHA" pull
if ! run_compose "$release_dir" "$DEPLOY_SHA" run --rm --no-deps --interactive=false --entrypoint /bin/sh nginx \
  -ec 'test -r /etc/letsencrypt/live/infraege.ru/fullchain.pem && test -r /etc/letsencrypt/live/infraege.ru/privkey.pem'; then
  echo "TLS certificate is missing or unreadable inside the Nginx container; run obtain-initial-certificate.sh first" >&2
  exit 1
fi
# Prepared DB must already contain the reviewed bank; deploy never reimports content.
run_compose "$release_dir" "$DEPLOY_SHA" up --detach --wait --wait-timeout 60 postgres
DB_ENV=prod DB_PROJECT=infraege bash "$release_dir/scripts/backup.sh" "$env_file"
run_compose "$release_dir" "$DEPLOY_SHA" run --rm --no-deps db-migrate
run_compose "$release_dir" "$DEPLOY_SHA" up --detach --remove-orphans --wait --wait-timeout 180
ln -sfn "$release_dir" "$root/database-current"
bash "$release_dir/ops/install-backup-timers.sh" application

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
trap - EXIT INT TERM
echo "Deployment $DEPLOY_SHA is healthy."
