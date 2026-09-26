#!/usr/bin/env bash
# First 122_01 -> 140_01 cutover: two disposable restores, never the live DB.
set -euo pipefail
umask 077

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"

usage() {
  echo "usage: $0 --validate|--run FULL_RESTIC_SNAPSHOT_ID FULL_CANDIDATE_SHA API_IMAGE_DIGEST" >&2
  exit 64
}
[[ $# == 4 ]] || usage
mode=$1
snapshot_id=$2
candidate_sha=$3
candidate_digest=$4
[[ $mode == --validate || $mode == --run ]] || usage
[[ $snapshot_id =~ ^[a-f0-9]{64}$ ]] || { db_fail 'full immutable Restic snapshot ID required'; exit 64; }
[[ $candidate_sha =~ ^[a-f0-9]{40}$ ]] || { db_fail 'full candidate SHA required'; exit 64; }
[[ $candidate_digest =~ ^sha256:[a-f0-9]{64}$ ]] || {
  db_fail 'published API image digest required'; exit 64;
}
[[ $(<"$repo_dir/infra/database-schema") == 140_01 ]] || {
  db_fail 'candidate source must declare 140_01'; exit 1;
}
backup_root=/var/backups/infraege
env_file=/etc/infraege/production.env
proof=/etc/infraege/accounts-schema-ready
current_release=/opt/infraege/database-current/.deploy-sha
export RESTIC_REPOSITORY=${RESTIC_REPOSITORY:-$backup_root/restic}
export RESTIC_PASSWORD_FILE=${RESTIC_PASSWORD_FILE:-/etc/infraege/restic-password}

# A full ID makes Restic load this exact authenticated snapshot; never substitute `latest` or an
# extracted directory whose metadata/checksums could have been self-produced by an attacker.
snapshot_metadata=$(restic cat snapshot "$snapshot_id") || {
  db_fail 'Restic could not authenticate and read the requested snapshot'; exit 1;
}
jq -e --arg tag infraege-application '
  (.tags | type == "array") and (.tags | index($tag) != null) and (.time | type == "string")
' <<<"$snapshot_metadata" >/dev/null || {
  db_fail 'requested snapshot is not an application Restic snapshot'; exit 1;
}
snapshot_epoch=$(date -u -d "$(jq -r '.time' <<<"$snapshot_metadata")" +%s) || {
  db_fail 'requested Restic snapshot has an invalid timestamp'; exit 1;
}
snapshot_age=$(( $(date -u +%s) - snapshot_epoch ))
(( snapshot_age >= 0 && snapshot_age <= 14400 )) || {
  db_fail 'requested production snapshot is not fresh'; exit 1;
}
snapshot_stats=$(restic stats --mode restore-size --json "$snapshot_id") || {
  db_fail 'Restic could not measure the requested snapshot'; exit 1;
}
snapshot_bytes=$(jq -er '
  select(.snapshots_count == 1) | .total_size | select(type == "number" and . >= 0)
' <<<"$snapshot_stats") || {
  db_fail 'requested Restic snapshot has no usable single-snapshot size'; exit 1;
}

# The rehearsal source is itself evidence: an uncommitted or different checkout could migrate
# differently from the image that deployment will dispatch.
[[ $(git -C "$repo_dir" rev-parse --verify HEAD) == "$candidate_sha" ]] || {
  db_fail 'candidate SHA does not match this source checkout'; exit 1;
}
if ! git -C "$repo_dir" diff --quiet || ! git -C "$repo_dir" diff --cached --quiet; then
  db_fail 'candidate source checkout must be clean and exact'; exit 1;
fi
checkout_status=$(git -C "$repo_dir" status --porcelain --untracked-files=all) || {
  db_fail 'candidate source checkout status could not be verified'; exit 1;
}
if [[ -n $checkout_status ]]; then
  db_fail 'candidate source checkout must be clean and exact'; exit 1;
fi
image="ghcr.io/avatarsik6699/infraegev2-api:$candidate_sha"
image_digest="ghcr.io/avatarsik6699/infraegev2-api@$candidate_digest"
docker image inspect "$image" --format '{{json .RepoDigests}}' |
  jq -e --arg expected "$image_digest" 'index($expected) != null' >/dev/null || {
    db_fail 'candidate API image does not match the published digest'; exit 1;
  }
[[ $mode == --validate ]] && {
  echo "authenticated snapshot and exact candidate source/image inputs: PASS ($snapshot_id)"
  exit 0
}

[[ $EUID == 0 ]] || { db_fail 'cutover rehearsal must run as root'; exit 1; }
[[ -d $backup_root && $(stat -c '%u:%a' "$backup_root") == 0:700 ]] || {
  db_fail 'protected application backup root must be root-owned and mode 700'; exit 1;
}
[[ -f $RESTIC_PASSWORD_FILE && ! -L $RESTIC_PASSWORD_FILE &&
  $(stat -c '%u:%a' "$RESTIC_PASSWORD_FILE") == 0:600 ]] || {
  db_fail 'Restic password file must be root-owned mode 600'; exit 1;
}
[[ $(stat -c '%u:%a' "$env_file") == 0:600 && -r $current_release ]] || {
  db_fail 'protected production environment or current release is unavailable'; exit 1;
}
[[ ! -e $proof && ! -L $proof ]] || { db_fail 'schema attestation already exists'; exit 1; }
image_id=$(docker image inspect "$image" --format '{{.Id}}')
docker_root=$(docker info --format '{{.DockerRootDir}}')
[[ $docker_root == /* && -d $docker_root ]] || {
  db_fail 'local Docker storage root unavailable'; exit 1;
}
required_bytes=$((snapshot_bytes * 4 + 2147483648))
for storage in "$backup_root" "$docker_root"; do
  available_bytes=$(df -B1 --output=avail "$storage" | awk 'NR == 2 { print $1 }')
  (( available_bytes >= required_bytes )) || {
    db_fail 'not enough free space for two isolated restore stages'; exit 1;
  }
done

exec 8>/run/lock/infraege-deploy.lock
flock -n 8 || { db_fail 'deploy or cutover operation already active'; exit 1; }
exec 9>/run/lock/infraege-restic.lock
flock -n 9 || { db_fail 'another Restic job is running'; exit 1; }
[[ ! -e $proof && ! -L $proof ]] || { db_fail 'schema attestation appeared under lock'; exit 1; }

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a
: "${POSTGRES_PASSWORD:?}" "${DB_RUNTIME_PASSWORD:?}" "${DB_IMPORT_PASSWORD:?}"
: "${DB_MIGRATION_PASSWORD:?}" "${DB_BACKUP_PASSWORD:?}" "${DB_APP_PASSWORD:?}"

work_dir=$(mktemp -d "$backup_root/cutover.XXXXXXXX")
suffix=${work_dir##*.}
project="infraege-db-test-cutover-$suffix"
first="infraege-cutover-first-$suffix"
second="infraege-cutover-second-$suffix"
first_volume="$first-data"
second_volume="$second-data"
admin_password=$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')
created_first=false
created_second=false
created_first_volume=false
created_second_volume=false
cleanup() {
  local status=$?
  trap - EXIT
  if $created_second; then docker rm --force "$second" >/dev/null || status=1; fi
  if $created_first; then docker rm --force "$first" >/dev/null || status=1; fi
  if $created_second_volume; then docker volume rm "$second_volume" >/dev/null || status=1; fi
  if $created_first_volume; then docker volume rm "$first_volume" >/dev/null || status=1; fi
  rm -rf -- "$work_dir" || status=1
  exit "$status"
}
trap cleanup EXIT

# The only source bundle used below comes from the immutable authenticated snapshot selected
# above. Restic preserves the original backup path under this new root.
restic restore "$snapshot_id" --target "$work_dir/source-snapshot" >/dev/null
mapfile -t manifests < <(find "$work_dir/source-snapshot" -type f -name metadata.json -print)
[[ ${#manifests[@]} == 1 ]] || { db_fail 'requested snapshot must restore exactly one bundle'; exit 1; }
source_bundle=$(dirname -- "${manifests[0]}")
[[ $source_bundle == "$work_dir/source-snapshot/"* && ! -L $source_bundle ]] || {
  db_fail 'restored bundle escaped the owned snapshot target'; exit 1;
}
db_validate_bundle "$source_bundle"
metadata="$source_bundle/metadata.json"
jq -e --arg schema 122_01 '
  .environment == "prod" and .project == "infraege" and .schemaVersion == $schema and
  (.release | test("^[a-f0-9]{40}$"))
' "$metadata" >/dev/null || { db_fail 'authenticated snapshot is not a production 122_01 bundle'; exit 1; }
[[ $(<"$current_release") == "$(jq -r '.release' "$metadata")" ]] || {
  db_fail 'production release changed since source snapshot'; exit 1;
}
wait_postgres() {
  local container=$1
  for _attempt in $(seq 1 60); do
    if docker exec "$container" pg_isready -h 127.0.0.1 -U restore_admin >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  db_fail 'isolated PostgreSQL failed to become ready'
  return 1
}
create_isolated() {
  local container=$1 volume=$2 database=$3 assets=$4
  ! docker volume inspect "$volume" >/dev/null 2>&1 || {
    db_fail 'isolated volume name already exists'; return 1;
  }
  docker volume create --label com.infraege.db-purpose=restore "$volume" >/dev/null
  if [[ $container == "$first" ]]; then created_first_volume=true; else created_second_volume=true; fi
  local mount_args=()
  if [[ -n $assets ]]; then
    mount_args=(--mount "type=bind,source=$assets,target=/task-files,readonly")
  fi
  docker run --detach --name "$container" --network none \
    --label com.infraege.db-purpose=restore \
    --label "com.docker.compose.project=$project" \
    --label com.docker.compose.service=postgres \
    --label "com.infraege.version=$candidate_sha" \
    --mount "type=volume,source=$volume,target=/var/lib/postgresql" \
    "${mount_args[@]}" \
    --env POSTGRES_USER=restore_admin --env "POSTGRES_DB=$database" \
    --env "POSTGRES_PASSWORD=$admin_password" \
    --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
  if [[ $container == "$first" ]]; then created_first=true; else created_second=true; fi
  wait_postgres "$container"
}

# Stage one: restore the pre-migration production bundle into a networkless copy.
create_isolated "$first" "$first_volume" postgres "$source_bundle/task-files"
db_restore_bundle "$source_bundle" "$first"
db_restore_practice_smoke "$source_bundle" "$first"

# Restart only the disposable copy so bundle tooling sees POSTGRES_DB=infraege.
docker rm --force "$first" >/dev/null
created_first=false
docker run --detach --name "$first" --network none \
  --label com.infraege.db-purpose=restore \
  --label "com.docker.compose.project=$project" \
  --label com.docker.compose.service=postgres \
  --label "com.infraege.version=$candidate_sha" \
  --mount "type=volume,source=$first_volume,target=/var/lib/postgresql" \
  --mount "type=bind,source=$source_bundle/task-files,target=/task-files,readonly" \
  --env POSTGRES_USER=restore_admin --env POSTGRES_DB=infraege \
  --env "POSTGRES_PASSWORD=$admin_password" \
  --env PGDATA=/var/lib/postgresql/18/docker "$DB_IMAGE" >/dev/null
created_first=true
wait_postgres "$first"

# Provision and migrate only through the first copy's loopback-only network namespace.
docker run --rm --network "container:$first" \
  --mount "type=bind,source=$repo_dir/scripts/db-provision-roles.sh,target=/db-provision-roles.sh,readonly" \
  --env POSTGRES_USER=restore_admin --env POSTGRES_DB=infraege \
  --env POSTGRES_PASSWORD --env DB_RUNTIME_PASSWORD --env DB_IMPORT_PASSWORD \
  --env DB_MIGRATION_PASSWORD --env DB_BACKUP_PASSWORD --env DB_APP_PASSWORD \
  --env PGHOST=127.0.0.1 --env "PGPASSWORD=$admin_password" \
  --entrypoint /bin/bash "$DB_IMAGE" /db-provision-roles.sh >/dev/null
docker run --rm --network "container:$first" \
  --env "MIGRATION_DATABASE_URL=postgresql://infraege_migration:$DB_MIGRATION_PASSWORD@127.0.0.1:5432/infraege" \
  --entrypoint /bin/sh "$image_id" -ec '.venv/bin/alembic upgrade head'
[[ $(docker image inspect "$image" --format '{{.Id}}') == "$image_id" ]] || {
  db_fail 'candidate image changed during rehearsal'; exit 1;
}

# Synthetic account facts exist only on the copy and must survive the second restore.
docker exec -i "$first" psql -X -q -U restore_admin -d infraege -v ON_ERROR_STOP=1 \
  <"$repo_dir/scripts/sql/account-cutover-fixture.sql"
PRACTICE_TEST_IMAGE="$image" python3 "$repo_dir/scripts/application_db.py" bundle \
  "$first" "$work_dir/candidate-bundle" "$env_file" test "$project"
[[ $(jq -r '.schemaVersion' "$work_dir/candidate-bundle/metadata.json") == 140_01 ]] || {
  db_fail 'candidate backup does not contain 140_01'; exit 1;
}
docker rm --force "$first" >/dev/null
created_first=false
docker volume rm "$first_volume" >/dev/null
created_first_volume=false

# Stage two: restore and verify the migrated bundle into another fresh volume.
create_isolated "$second" "$second_volume" postgres ''
db_restore_bundle "$work_dir/candidate-bundle" "$second"
db_restore_practice_smoke "$work_dir/candidate-bundle" "$second"
[[ $(docker exec -i "$second" psql -X -qAt -U restore_admin -d infraege \
  -v ON_ERROR_STOP=1 <"$repo_dir/scripts/sql/account-cutover-assert.sql") == fixture-ok ]] || {
  db_fail 'synthetic account data did not survive candidate restore'; exit 1;
}

[[ $(<"$current_release") == "$(jq -r '.release' "$metadata")" ]] || {
  db_fail 'production release changed during rehearsal'; exit 1;
}

# Remove disposable resources before creating an attestation; cleanup failure is not a pass.
docker rm --force "$second" >/dev/null
created_second=false
docker volume rm "$second_volume" >/dev/null
created_second_volume=false
rm -rf -- "$work_dir"
trap - EXIT

proof_tmp=$(mktemp /etc/infraege/accounts-schema-ready.XXXXXXXX)
trap 'rm -f -- "$proof_tmp"' EXIT
printf '140_01 %s\n' "$candidate_sha" >"$proof_tmp"
chmod 600 "$proof_tmp"
chown root:root "$proof_tmp"
ln "$proof_tmp" "$proof" || { db_fail 'attestation already exists'; exit 1; }
rm -- "$proof_tmp"
trap - EXIT
echo "Isolated 140_01 migration, second restore and SHA attestation passed: $candidate_sha"
