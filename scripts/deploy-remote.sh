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

source "$release_dir/scripts/lib/application-db-release.sh"
db_switched=false
source_major=none
source_container=$(docker ps -q --filter label=com.docker.compose.project=infraege \
  --filter label=com.docker.compose.service=postgres)
if [[ -n $source_container ]]; then
  [[ $source_container != *$'\n'* ]] || { echo 'ambiguous application postgres identity' >&2; exit 1; }
  source_major=$(docker exec "$source_container" sh -ec \
    'psql -X -At -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SHOW server_version_num"')
  case "$source_major" in
    16*) ;;
    18*) db_switched=true ;;
    *) echo 'unsupported source database version' >&2; exit 1 ;;
  esac
elif [[ -n $previous_release ]]; then
  echo 'installed source postgres must be running for inventory; refusing blind replacement' >&2
  exit 1
fi
# Candidate declares its DB compatibility; reject an old release before changing any containers.
[[ $(cat "$release_dir/infra/database-major") == 18 ]] || {
  echo 'candidate lacks PG18 compatibility declaration' >&2; exit 1;
}
if [[ -n $previous_release && $(cat "$previous_release/infra/database-major" 2>/dev/null || true) != 18 ]]; then
  previous_sha=$(<"$previous_release/.deploy-sha")
  [[ -f /etc/infraege/pg18-rollback-compatible-sha &&
     $(stat -c '%u:%a' /etc/infraege/pg18-rollback-compatible-sha) == 0:600 &&
     $(cat /etc/infraege/pg18-rollback-compatible-sha) == "$previous_sha" ]] || {
    echo 'PG18 rollback compatibility proof for the exact previous SHA is required before cutover' >&2
    exit 1
  }
fi
# A schema declaration is separate from the PostgreSQL major. First adoption requires
# exact-SHA evidence for the previous file-based application, just like PG18 transfer.
application_schema_preflight "$release_dir" "$previous_release" /etc/infraege/schema-rollback-compatible-sha
# Resolve the candidate's frozen host CLI before stopping the working application.
application_practice_environment "$release_dir"
trap 'application_deploy_exit "$?" "$previous_release" "$release_dir" "$env_file" "$db_switched"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

printf '%s\n' "$DEPLOY_SHA" > "$release_dir/.deploy-sha"
docker network inspect "$observability_network" >/dev/null 2>&1 ||
  docker network create "$observability_network" >/dev/null
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
if [[ $source_major == 16* ]]; then
  [[ ${DB_TRANSFER_MODE:-} == 16-to-18 && -n $previous_release ]] || {
    echo 'PG16 requires an installed previous release and explicit DB_TRANSFER_MODE=16-to-18' >&2; exit 1;
  }
  previous_sha=$(<"$previous_release/.deploy-sha")
  run_compose "$previous_release" "$previous_sha" stop web api
  DB_ENV=prod DB_PROJECT=infraege DB_DEPLOY_LOCK_HELD=1 \
    bash "$release_dir/scripts/db-transfer.sh" --prepare-release "$env_file"
fi
# Existing PG18 consumers must also stay stopped until migration/import verification completes.
if [[ $source_major != 16* && -n $previous_release ]]; then
  run_compose "$previous_release" "$(<"$previous_release/.deploy-sha")" stop web api
fi
db_switched=true
run_compose "$release_dir" "$DEPLOY_SHA" up --detach --wait --wait-timeout 60 postgres
DB_ENV=prod DB_PROJECT=infraege bash "$release_dir/scripts/backup.sh" "$env_file"
# DB maintenance follows the installed DB format even if application smoke triggers rollback.
ln -sfn "$release_dir" "$root/database-current"
bash "$release_dir/ops/install-backup-timers.sh" application
application_practice_activate "$release_dir" "$DEPLOY_SHA" "$env_file"

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
