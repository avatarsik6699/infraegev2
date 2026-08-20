#!/usr/bin/env bash
set -Eeuo pipefail

postgres_image='postgres:16-alpine@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777'
beszel_image='henrygd/beszel:0.18.7@sha256:a849ad80814b6a1a3be665304dcace5d4854b3bed7bde4dd1227e8ce1b82d477'
drill_id="infraege-data-fidelity-$$-${RANDOM}"
postgres_container="$drill_id-postgres"
beszel_source_container="$drill_id-beszel-source"
beszel_target_container="$drill_id-beszel-target"
beszel_source_volume="$drill_id-beszel-source"
beszel_target_volume="$drill_id-beszel-target"
as_json=false

if [[ ${1:-} == --json && $# == 1 ]]; then
  as_json=true
elif (( $# != 0 )); then
  echo 'usage: ops-data-fidelity-drill.sh [--json]' >&2
  exit 2
fi

work_dir=$(mktemp -d "${TMPDIR:-/tmp}/infraege-data-fidelity.XXXXXX")
dump_path="$work_dir/umami.dump"

cleanup() {
  docker rm --force "$postgres_container" "$beszel_source_container" \
    "$beszel_target_container" >/dev/null 2>&1 || true
  docker volume rm "$beszel_source_volume" "$beszel_target_volume" >/dev/null 2>&1 || true
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

exec 9>"${TMPDIR:-/tmp}/infraege-data-fidelity.lock"
if ! flock --nonblock 9; then
  echo 'data fidelity drill: another drill is in progress' >&2
  exit 2
fi

for image in "$postgres_image" "$beszel_image"; do
  docker image inspect "$image" >/dev/null 2>&1 || {
    echo "data fidelity drill: required pinned image is not available locally" >&2
    exit 2
  }
done

wait_for_postgres() {
  local attempt
  for attempt in $(seq 1 40); do
    if docker exec "$postgres_container" sh -ceu \
      'test "$(cat /proc/1/comm)" = postgres; pg_isready -U postgres >/dev/null; psql -U postgres -Atqc "SELECT 1" >/dev/null' \
      >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

beszel_port() {
  docker port "$1" 8090/tcp 2>/dev/null | sed -n 's/.*://p' | head -n 1
}

wait_for_beszel() {
  local container=$1 attempt port
  for attempt in $(seq 1 40); do
    port=$(beszel_port "$container")
    if [[ -n $port ]] && curl --fail --silent --show-error --max-time 2 \
      "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; then
      printf '%s\n' "$port"
      return 0
    fi
    sleep 1
  done
  return 1
}

docker run --detach --pull=never --name "$postgres_container" \
  --label com.infraege.ops.drill=true \
  --env POSTGRES_PASSWORD=synthetic-drill-only "$postgres_image" >/dev/null
wait_for_postgres

docker exec --interactive "$postgres_container" psql -U postgres \
  --set ON_ERROR_STOP=1 >/dev/null <<'SQL'
CREATE ROLE umami NOLOGIN;
CREATE DATABASE umami_source OWNER umami;
SQL
docker exec --interactive "$postgres_container" psql -U postgres -d umami_source \
  --set ON_ERROR_STOP=1 >/dev/null <<'SQL'
SET ROLE umami;
CREATE TABLE synthetic_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_name text NOT NULL,
  event_count integer NOT NULL CHECK (event_count > 0)
);
CREATE SEQUENCE event_rollup_seq START WITH 41;
CREATE VIEW synthetic_event_total AS
  SELECT sum(event_count)::integer AS total FROM synthetic_events;
INSERT INTO synthetic_events (event_name, event_count)
VALUES ('pageview', 2), ('lesson_open', 3), ('practice_complete', 5);
SELECT nextval('event_rollup_seq');
SQL

docker exec "$postgres_container" pg_dump -U postgres -Fc umami_source >"$dump_path"
[[ -s $dump_path ]]
docker exec "$postgres_container" createdb -U postgres umami_target
docker cp "$dump_path" "$postgres_container:/tmp/umami.dump" >/dev/null
docker exec "$postgres_container" pg_restore -U postgres --exit-on-error \
  -d umami_target /tmp/umami.dump >/dev/null

row_count=$(docker exec "$postgres_container" psql -U postgres -d umami_target -At \
  --set ON_ERROR_STOP=1 --command 'SELECT count(*) FROM synthetic_events;')
event_total=$(docker exec "$postgres_container" psql -U postgres -d umami_target -At \
  --set ON_ERROR_STOP=1 --command 'SELECT total FROM synthetic_event_total;')
next_sequence=$(docker exec "$postgres_container" psql -U postgres -d umami_target -At \
  --set ON_ERROR_STOP=1 --command "SELECT nextval('event_rollup_seq');")
owned_objects=$(docker exec "$postgres_container" psql -U postgres -d umami_target -At \
  --set ON_ERROR_STOP=1 --command \
  "SELECT count(*) FROM pg_class WHERE relname IN ('synthetic_events','synthetic_events_id_seq','event_rollup_seq','synthetic_event_total') AND pg_get_userbyid(relowner) = 'umami';")
[[ $row_count == 3 && $event_total == 10 && $next_sequence == 42 && $owned_objects == 4 ]]

if [[ ${INFRAEGE_OPS_TEST_FIDELITY_FAIL_AFTER:-} == postgres ]]; then
  echo 'data fidelity drill: injected failure after PostgreSQL' >&2
  exit 2
fi

docker volume create --label com.infraege.ops.drill=true "$beszel_source_volume" >/dev/null
docker run --detach --pull=never --name "$beszel_source_container" \
  --label com.infraege.ops.drill=true --publish 127.0.0.1::8090 \
  --volume "$beszel_source_volume:/beszel_data" "$beszel_image" >/dev/null
wait_for_beszel "$beszel_source_container" >/dev/null
docker stop --time 10 "$beszel_source_container" >/dev/null

source_identity=$(docker run --rm --pull=never \
  --label com.infraege.ops.drill=true --volume "$beszel_source_volume:/data:ro" \
  "$postgres_image" sh -ceu \
  'test -s /data/data.db; test -s /data/auxiliary.db; test -s /data/id_ed25519; sha256sum /data/id_ed25519 | cut -d" " -f1')

docker volume create --label com.infraege.ops.drill=true "$beszel_target_volume" >/dev/null
docker run --rm --pull=never --label com.infraege.ops.drill=true \
  --volume "$beszel_source_volume:/source:ro" --volume "$beszel_target_volume:/target" \
  "$postgres_image" sh -ceu 'cp -a /source/. /target/'
docker run --detach --pull=never --name "$beszel_target_container" \
  --label com.infraege.ops.drill=true --publish 127.0.0.1::8090 \
  --volume "$beszel_target_volume:/beszel_data" "$beszel_image" >/dev/null
target_port=$(wait_for_beszel "$beszel_target_container")
target_identity=$(docker run --rm --pull=never \
  --label com.infraege.ops.drill=true --volume "$beszel_target_volume:/data:ro" \
  "$postgres_image" sh -ceu \
  'test -s /data/data.db; test -s /data/auxiliary.db; test -s /data/id_ed25519; sha256sum /data/id_ed25519 | cut -d" " -f1')
[[ $source_identity == "$target_identity" && -n $target_port ]]

if [[ ${INFRAEGE_OPS_TEST_FIDELITY_FAIL_AFTER:-} == beszel-target ]]; then
  echo 'data fidelity drill: injected failure after Beszel target' >&2
  exit 2
fi

cleanup
trap - EXIT
for container in "$postgres_container" "$beszel_source_container" "$beszel_target_container"; do
  ! docker container inspect "$container" >/dev/null 2>&1
done
for volume in "$beszel_source_volume" "$beszel_target_volume"; do
  ! docker volume inspect "$volume" >/dev/null 2>&1
done
[[ ! -e $work_dir ]]

if [[ $as_json == true ]]; then
  jq -cn \
    --arg postgres_image "$postgres_image" --arg beszel_image "$beszel_image" \
    --argjson row_count "$row_count" --argjson event_total "$event_total" \
    '{schema_version:1,status:"passed",production_data_used:false,authorized_to_cutover:false,images:{postgres:$postgres_image,beszel:$beszel_image},postgres:{status:"passed",row_count:$row_count,event_total:$event_total,sequence_preserved:true,ownership_preserved:true},beszel:{status:"passed",source_healthy:true,target_healthy:true,identity_preserved:true,state_files_present:true},cleanup:{containers_removed:true,volumes_removed:true,workspace_removed:true}}'
else
  echo 'data fidelity drill: PASS'
  echo 'production data used: no'
  echo 'authorized to cutover: no'
  echo 'PostgreSQL restore: rows=3 total=10 sequence=yes ownership=yes'
  echo 'Beszel restore: source=healthy target=healthy identity=preserved'
  echo 'cleanup: containers=yes volumes=yes workspace=yes'
fi
