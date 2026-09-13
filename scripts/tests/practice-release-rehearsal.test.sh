#!/usr/bin/env bash
# Exact-source application rehearsal. Host checks; containers run applications/databases only.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
candidate_sha=${CANDIDATE_SHA:?explicit immutable candidate commit or tree required}
previous_sha=${PREVIOUS_SHA:-a5b0bf5793a85a4e9090f47c311ae01c022f194d}
[[ $candidate_sha =~ ^[a-f0-9]{40}$ && $previous_sha =~ ^[a-f0-9]{40}$ ]] || exit 64
printf 'candidate=%s previous=%s candidate_object=%s\n' "$candidate_sha" "$previous_sha" "$(git -C "$repo_dir" cat-file -t "$candidate_sha")"
workspace=${REHEARSAL_WORKSPACE:-$(mktemp -d /tmp/infraege-119.XXXXXX)}
test_root=$(mktemp -d "$workspace/run.XXXXXX")
candidate="$workspace/candidate"
previous="$workspace/previous"
export DB_ENV=test DB_PROJECT="infraege-db-test-119-$$" DEPLOY_SHA="$candidate_sha"
source_name="$DB_PROJECT-source"
source_volume="$DB_PROJECT-source-data"
target_volume="${DB_PROJECT}_postgres18-data"
for volume in "$source_volume" "$target_volume" "${DB_PROJECT}_postgres-data"; do
  if docker volume inspect "$volume" >/dev/null 2>&1; then
    echo 'rehearsal volume already exists; preserve it and choose a fresh run' >&2
    exit 1
  fi
done
export PRACTICE_TEST_IMAGE="infraege-practice-test-119-$$"
source "$repo_dir/scripts/lib/application-db.sh"
command -v restic >/dev/null
compose() {
  docker compose --project-name "$DB_PROJECT" --env-file "$test_root/environment" \
    -f "$candidate/infra/docker-compose.yml" -f "$test_root/local.yml" "$@"
}
previous_compose() {
  DEPLOY_SHA="$previous_sha" docker compose --project-name "$DB_PROJECT" \
    --env-file "$test_root/environment" -f "$previous/infra/docker-compose.yml" \
    -f "$test_root/previous.yml" \
    -f "$candidate/infra/docker-compose.db-rollback.yml" "$@"
}
cleanup() {
  if [[ -f $test_root/local.yml ]]; then compose down --remove-orphans >/dev/null 2>&1 || true; fi
  docker rm -fv "$source_name" >/dev/null 2>&1 || true
  docker volume rm "$source_volume" "$target_volume" "${DB_PROJECT}_postgres-data" >/dev/null 2>&1 || true
  docker image rm "$PRACTICE_TEST_IMAGE" >/dev/null 2>&1 || true
  python3 - "$test_root" <<'PY'
import shutil, sys
shutil.rmtree(sys.argv[1])
PY
}
trap 'echo "rehearsal failed at line $LINENO (status $?)" >&2' ERR
trap cleanup EXIT
for version in candidate previous; do
  sha=$candidate_sha
  [[ $version != previous ]] || sha=$previous_sha
  if [[ ! -d $workspace/$version ]]; then
    mkdir "$workspace/$version"
    git -C "$repo_dir" archive "$sha" | tar -x -C "$workspace/$version"
  fi
  git -C "$repo_dir" archive "$sha" | python3 -c '
import pathlib, sys, tarfile
root = pathlib.Path(sys.argv[1])
with tarfile.open(fileobj=sys.stdin.buffer, mode="r|") as archive:
    for entry in archive:
        path = root / entry.name
        if entry.isfile():
            stream = archive.extractfile(entry)
            assert stream is not None and not path.is_symlink()
            assert path.read_bytes() == stream.read(), entry.name
            assert bool(path.stat().st_mode & 0o100) == bool(entry.mode & 0o100), entry.name
        elif entry.issym():
            assert str(path.readlink()) == entry.linkname, entry.name
print("Archived source bytes/executability: PASS")
' "$workspace/$version"
done
for service in api web nginx; do
  docker pull "ghcr.io/avatarsik6699/infraegev2-$service:$previous_sha" >"$workspace/$service-pull.log" 2>&1
  dockerfile="apps/$service/Dockerfile"
  [[ $service != nginx ]] || dockerfile=infra/nginx/Dockerfile
  docker build --pull --label "org.opencontainers.image.revision=$candidate_sha" \
    -f "$candidate/$dockerfile" -t "infraege-rehearsal-119-$service:candidate" \
    "$candidate" >"$workspace/$service-build.log" 2>&1
  docker image inspect "infraege-rehearsal-119-$service:candidate" \
    "ghcr.io/avatarsik6699/infraegev2-$service:$previous_sha" \
    --format '{{.Id}} {{json .RepoDigests}}'
  [[ $(docker image inspect "infraege-rehearsal-119-$service:candidate" \
    --format '{{index .Config.Labels "org.opencontainers.image.revision"}}') == "$candidate_sha" ]]
done
docker tag infraege-rehearsal-119-api:candidate "$PRACTICE_TEST_IMAGE"
mkdir -m 755 "$test_root/files"
mkdir "$test_root/backups"
export POSTGRES_USER=infraege POSTGRES_DB=infraege
export POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD
for credential in POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD; do
  printf -v "$credential" '%s' "$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')"
done
export TASK_FILES_DIR="$test_root/files"
{
  printf 'POSTGRES_USER=infraege\nPOSTGRES_DB=infraege\nDB_ENV=test\nDB_PROJECT=%s\nTASK_FILES_DIR=%s\n' "$DB_PROJECT" "$TASK_FILES_DIR"
  for credential in POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD; do
    printf '%s=%s\n' "$credential" "${!credential}"
  done
} >"$test_root/environment"
export BACKUP_ROOT="$test_root/backups" RESTIC_REPOSITORY="$test_root/restic"
export RESTIC_PASSWORD_FILE="$test_root/password" RESTIC_LOCK_FILE="$test_root/restic.lock"
export RESTIC_CACHE_DIR="$test_root/cache" BACKUP_STATUS_FILE="$test_root/backup-status.json"
export RESTORE_STATUS_FILE="$test_root/restore-status.json" DB_REHEARSAL_STATE_DIR="$test_root"
printf '%s' "$POSTGRES_PASSWORD" >"$RESTIC_PASSWORD_FILE"
docker volume create "$source_volume" >/dev/null
docker run -d --name "$source_name" --network none \
  --label "com.docker.compose.project=$DB_PROJECT" --label com.docker.compose.service=postgres \
  -v "$source_volume:/var/lib/postgresql/data" \
  --env POSTGRES_USER --env POSTGRES_DB --env POSTGRES_PASSWORD \
  postgres:16-alpine@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777 >/dev/null
for _attempt in $(seq 1 60); do
  docker exec "$source_name" pg_isready -h 127.0.0.1 -U infraege >/dev/null 2>&1 && break
  sleep 1
done
# A clearly synthetic nonempty source; live production currently has no user tables.
docker exec -i "$source_name" psql -X -q -U infraege -d infraege -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE public.rehearsal_probe(id integer PRIMARY KEY, payload text NOT NULL);
INSERT INTO public.rehearsal_probe VALUES (1, 'preserve-before-transfer'), (2, 'second-row');
SQL
started=$SECONDS
bash "$candidate/scripts/db-transfer.sh" --rehearse "$test_root/environment"
printf 'transfer_seconds=%s\n' "$((SECONDS-started))"
jq -e --arg sha "$candidate_sha" '.status=="prepared" and .release==$sha' "$test_root/db-transfer.json" >/dev/null
docker stop "$source_name" >/dev/null
cat >"$test_root/local.yml" <<EOF
services:
  postgres:
    mem_limit: 640m
    ports: ["127.0.0.1::5432"]
  api:
    build: !reset null
    image: infraege-rehearsal-119-api:candidate
    mem_limit: 384m
    ports: ["127.0.0.1::8000"]
  db-migrate:
    build: !reset null
    image: infraege-rehearsal-119-api:candidate
  web:
    build: !reset null
    image: infraege-rehearsal-119-web:candidate
    mem_limit: 512m
    environment:
      DEPLOY_SHA: $candidate_sha
  nginx:
    image: infraege-rehearsal-119-nginx:candidate
    mem_limit: 128m
    ports: ["127.0.0.1::80"]
volumes:
  postgres18-data:
    external: true
    name: $target_volume
EOF
cat >"$test_root/previous.yml" <<EOF
services:
  api:
    build: !reset null
    image: ghcr.io/avatarsik6699/infraegev2-api:$previous_sha
    ports: ["127.0.0.1::8000"]
    mem_limit: 384m
  web:
    build: !reset null
    image: ghcr.io/avatarsik6699/infraegev2-web:$previous_sha
    mem_limit: 512m
    environment:
      DEPLOY_SHA: $previous_sha
  nginx:
    image: ghcr.io/avatarsik6699/infraegev2-nginx:$previous_sha
    ports: ["127.0.0.1::80"]
    mem_limit: 128m
    volumes: !override
      - $previous/infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - $previous/infra/nginx/conf.d/infraege.conf:/etc/nginx/conf.d/default.conf:ro
EOF
compose up -d --wait postgres
db_select
[[ $(db_sql <<<'SELECT count(*) FROM public.rehearsal_probe;') == 2 ]]
export PRACTICE_RELEASE_ROOT="$candidate"
# Host-only CLI dependencies come from the frozen candidate source.
(cd "$candidate/apps/api" && uv sync --frozen --no-dev)
source "$candidate/scripts/lib/application-db-release.sh"
run_compose() { shift 2; compose "$@"; }
application_practice_import() {
  (cd "$candidate/apps/api" && uv run --frozen --no-sync python -m app.modules.practice.release \
    --environment test --project "$DB_PROJECT" --backup-env "$test_root/environment")
}
# A failed import boundary must leave the candidate API unstarted after a real migration.
if (application_practice_import() { return 42; }; application_practice_activate "$candidate" "$candidate_sha" "$test_root/environment"); then
  echo 'failed import activated the candidate' >&2; exit 1
fi
[[ -z $(compose ps -q --status running api) ]]
application_practice_activate "$candidate" "$candidate_sha" "$test_root/environment"
http_port=$(compose port nginx 80 | cut -d: -f2)
api_port=$(compose port api 8000 | cut -d: -f2)
base="http://127.0.0.1:$http_port"
curl -fsS "$base/health" | jq -e --arg sha "$candidate_sha" '.status=="ok" and .version==$sha' >/dev/null
curl -fsS "$base/api/tasks/python-files-aggregate" >"$test_root/task.json"
revision=$(jq -er '.solution_revision' "$test_root/task.json")
curl -fsS -H 'Content-Type: application/json' -d "{\"answer\":\"10\",\"solution_revision\":$revision}" \
  "$base/api/tasks/python-files-aggregate/check" | jq -e '.correct==true' >/dev/null
curl -fsS "$base/practice" >/dev/null
curl -fsS "$base/courses/python/fayly" >/dev/null
file_path=$(jq -er '.deliveries[0].url' "$test_root/task.json")
curl -fsS -D "$test_root/file-headers" "$base$file_path" -o "$test_root/file"
cmp "$test_root/file" "$candidate/content/practice-migration/assets/python-files-aggregate/numbers.txt"
printf 'candidate_http=%s candidate_api=http://127.0.0.1:%s\n' "$base" "$api_port"
if [[ ${1:-} == --inspect ]]; then read -r -p 'Candidate browser review; Enter continues: ' _inspection; fi
db_sql <<'SQL'
INSERT INTO public.rehearsal_probe VALUES (3, 'new-pg18-write');
SQL
database_id=$(compose ps -q postgres)
previous_compose up --detach --no-deps --wait --wait-timeout 180 nginx web api
http_port=$(previous_compose port nginx 80 | cut -d: -f2)
base="http://127.0.0.1:$http_port"
curl -fsS "$base/health" | jq -e --arg sha "$previous_sha" '.status=="ok" and .version==$sha' >/dev/null
curl -fsS -H 'Content-Type: application/json' -d '{"answer":"10"}' \
  "$base/api/tasks/python-files-aggregate/check" | jq -e '.correct==true' >/dev/null
curl -fsS "$base/courses/python/fayly" >/dev/null
curl -fsS "$base/content/tasks/python-files-aggregate/numbers.txt" -o "$test_root/old-file"
cmp "$test_root/old-file" "$test_root/file"
[[ $(compose ps -q postgres) == "$database_id" ]]
[[ $(db_sql <<<'SELECT count(*) FROM public.rehearsal_probe;') == 3 ]]
printf 'previous_http=%s rollback_preserved_pg18=true\n' "$base"
if [[ ${1:-} == --inspect ]]; then read -r -p 'Previous browser review; Enter continues: ' _inspection; fi
compose up --detach --no-deps --wait --wait-timeout 180 nginx web api
[[ $(compose ps -q postgres) == "$database_id" ]]
[[ $(db_sql <<<'SELECT count(*) FROM practice.task;') == 150 ]]
[[ $(db_sql <<<'SELECT count(*) FROM public.rehearsal_probe;') == 3 ]]
bash "$candidate/scripts/backup.sh" "$test_root/environment"
DB_ENV=restore DB_PROJECT=infraege-restore bash "$candidate/scripts/restore-check.sh"
jq -e '.status=="success"' "$RESTORE_STATUS_FILE" >/dev/null
jq '{durationSeconds,completedAt}' "$RESTORE_STATUS_FILE"
DB_ENV=prod DB_PROJECT=infraege bash "$candidate/scripts/db-export.sh" "$test_root/export"
RESTIC_REPOSITORY="$test_root/export" restic check --read-data >/dev/null
printf 'exact-source transfer, import, application rollback, nonempty restore and export: PASS\n'
printf 'Analyzed build evidence workspace: %s\n' "$workspace"
