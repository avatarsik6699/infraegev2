#!/usr/bin/env bash
# Host-run tests and operator journeys; containers hold PostgreSQL or the real application CLI.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
command -v restic >/dev/null
test_root=$(mktemp -d)
export DB_ENV=test DB_PROJECT="infraege-db-test-114-$$"
container="$DB_PROJECT-postgres"
export PRACTICE_TEST_IMAGE="infraege-practice-test-114-$$"
lifecycle_project="$DB_PROJECT-lifecycle"
compose_fixture() {
  docker compose --env-file "$test_root/compose.env" --project-name "$lifecycle_project" \
    -f "$repo_dir/infra/docker-compose.yml" -f "$test_root/compose.yml" "$@"
}
cleanup() {
  if [[ -f $test_root/compose.yml ]]; then compose_fixture down --volumes --remove-orphans >/dev/null 2>&1 || true; fi
  docker rm -fv "$container" >/dev/null 2>&1 || true
  docker image rm "$PRACTICE_TEST_IMAGE" >/dev/null 2>&1 || true
  rm -rf -- "$test_root"
}
trap cleanup EXIT
mkdir -m 755 "$test_root/files" "$test_root/backups"
export PRACTICE_TEST_FILES="$test_root/files"
export RESTIC_CACHE_DIR="$test_root/restic-cache"
docker build -q -f "$repo_dir/apps/api/Dockerfile" -t "$PRACTICE_TEST_IMAGE" "$repo_dir" >/dev/null
cat >"$test_root/compose.env" <<EOF
POSTGRES_PASSWORD=infraege-114-bootstrap
DB_RUNTIME_PASSWORD=infraege-114-runtime
DB_IMPORT_PASSWORD=infraege-114-import
DB_MIGRATION_PASSWORD=infraege-114-migration
DB_BACKUP_PASSWORD=infraege-114-backup
DB_ENV=test
DB_PROJECT=$lifecycle_project
TASK_FILES_DIR=$test_root/files
EOF
cat >"$test_root/compose.yml" <<EOF
services:
  api:
    build: !reset null
    image: $PRACTICE_TEST_IMAGE
    ports: ["127.0.0.1::8000"]
  db-migrate:
    build: !reset null
    image: $PRACTICE_TEST_IMAGE
EOF
compose_fixture up --detach --wait --wait-timeout 90 api
api_port=$(compose_fixture port api 8000 | cut -d: -f2)
curl -fsS "http://127.0.0.1:$api_port/health/ready" | jq -e '.status=="ok"' >/dev/null
curl -fsS "http://127.0.0.1:$api_port/health/live" | jq -e '.status=="ok"' >/dev/null
compose_fixture down --volumes --remove-orphans >/dev/null
docker run --detach --name "$container" \
  --label "com.docker.compose.project=$DB_PROJECT" --label com.docker.compose.service=postgres \
  --label com.infraege.db-purpose=test \
  -e POSTGRES_USER=infraege -e POSTGRES_DB=infraege -e POSTGRES_PASSWORD=infraege-114-bootstrap \
  -e DB_RUNTIME_PASSWORD=infraege-114-runtime -e DB_IMPORT_PASSWORD=infraege-114-import \
  -e DB_MIGRATION_PASSWORD=infraege-114-migration -e DB_BACKUP_PASSWORD=infraege-114-backup \
  -v "$repo_dir/scripts/db-provision-roles.sh:/docker-entrypoint-initdb.d/10-roles.sh:ro" \
  -v "$test_root/files:/task-files:ro" -p 127.0.0.1::5432 "$DB_IMAGE" >/dev/null
for attempt in $(seq 1 60); do
  docker exec "$container" pg_isready -h 127.0.0.1 -U infraege >/dev/null 2>&1 && break
  sleep 1
done
port=$(docker port "$container" 5432 | cut -d: -f2)
export MIGRATION_DATABASE_URL="postgresql://infraege_migration:infraege-114-migration@127.0.0.1:$port/infraege"
export IMPORT_DATABASE_URL="postgresql://infraege_import:infraege-114-import@127.0.0.1:$port/infraege"
export DATABASE_URL="postgresql://infraege_runtime:infraege-114-runtime@127.0.0.1:$port/infraege"
export PRACTICE_TEST_URL="$IMPORT_DATABASE_URL"
export PRACTICE_REGISTRY="$repo_dir/apps/api/practice-registry.json"
export TASK_FILES_DIR="$test_root/files" PRACTICE_RELEASE_ROOT="$repo_dir"
cd "$repo_dir/apps/api"
uv run alembic upgrade head
(cd "$repo_dir" && PRACTICE_BACKUP_CONTAINER="$container" python3 -m unittest discover -s scripts/tests -p application_db_test.py)
uv run alembic current | grep -q '120_01 (head)'
uv run alembic check
uv run python -m app.modules.practice.cli register --environment test --project "$DB_PROJECT"
uv run pytest tests/test_practice_model_tooling.py tests/test_practice_health.py tests/test_practice_legacy.py tests/test_practice_readers.py --basetemp "$test_root/pytest" -q
# Re-running on a populated database must preserve rows/history and show no model drift.
uv run alembic upgrade head
uv run alembic check
uv run python -m app.modules.practice.cli preflight --environment test --project "$DB_PROJECT"

export BACKUP_ROOT="$test_root/backups" RESTIC_REPOSITORY="$test_root/restic"
export RESTIC_PASSWORD_FILE="$test_root/password" RESTIC_LOCK_FILE="$test_root/restic.lock"
export BACKUP_STATUS_FILE="$test_root/backup-status.json" RESTORE_STATUS_FILE="$test_root/restore-status.json"
printf 'isolated-restic-114-password' >"$RESTIC_PASSWORD_FILE"
printf 'POSTGRES_DB=infraege\n' >"$test_root/environment"
# Actual CLI export/edit/validate/diff/apply, including its pre/post backups and journal lookup.
task_id=$(docker exec "$container" psql -X -At -U infraege -d infraege -c 'SELECT id FROM practice.task ORDER BY id LIMIT 1')
uv run python -m app.modules.practice.cli export --environment test --project "$DB_PROJECT" \
  --task-id "$task_id" --package-id cli-roundtrip --output "$test_root/exported"
uv run python - "$test_root/exported" <<'PY'
import json, sys
from pathlib import Path
from app.modules.practice.files import checksum
root = Path(sys.argv[1])
task = json.loads((root / 'task.json').read_text())
task['task']['title'] += ' — CLI edit'
task['reason'] = 'operator metadata correction'
(root / 'task.json').write_text(json.dumps(task, ensure_ascii=False))
manifest = json.loads((root / 'manifest.json').read_text())
manifest['tasks'][0]['checksum'] = checksum(root / 'task.json')
(root / 'manifest.json').write_text(json.dumps(manifest))
PY
uv run python -m app.modules.practice.cli validate --environment test --project "$DB_PROJECT" --package "$test_root/exported"
uv run python -m app.modules.practice.cli diff --environment test --project "$DB_PROJECT" --package "$test_root/exported" --update
uv run python -m app.modules.practice.cli apply --environment test --project "$DB_PROJECT" \
  --package "$test_root/exported" --update --backup-env "$test_root/environment"
uv run python -m app.modules.practice.cli outcome --environment test --project "$DB_PROJECT" --package-id cli-roundtrip |
  jq -e '.status == "committed"' >/dev/null
DB_ENV=restore DB_PROJECT=infraege-restore bash "$repo_dir/scripts/restore-check.sh"
jq -e '.status=="success"' "$RESTORE_STATUS_FILE" >/dev/null
DB_ENV=prod DB_PROJECT=infraege bash "$repo_dir/scripts/db-export.sh" "$test_root/portable"
RESTIC_REPOSITORY="$test_root/portable" restic check --read-data >/dev/null
restic restore latest --tag infraege-application --target "$test_root/inspect" >/dev/null
bundle=$(dirname -- "$(find "$test_root/inspect" -name metadata.json -type f)")
db_validate_bundle "$bundle"
digest=$(head -1 "$bundle/file-references.txt" | cut -d' ' -f1)
[[ $digest =~ ^[a-f0-9]{64}$ ]]
# Replace only this disposable restored copy; the live immutable source remains intact.
mv "$bundle/task-files/$digest" "$test_root/original-object"
printf 'damaged object' >"$bundle/task-files/$digest"
if db_validate_bundle "$bundle" >/dev/null 2>&1; then
  echo 'corrupt task object accepted in conditional validation' >&2; exit 1
fi
# Drift is detected on a disposable instance; no destructive SQL cleanup is needed.
docker exec "$container" psql -X -q -U infraege -d infraege -v ON_ERROR_STOP=1 -c \
  'SET ROLE infraege_migration; CREATE TABLE practice.unexpected_drift (id integer);'
if uv run alembic check >"$test_root/drift.log" 2>&1; then
  echo 'schema drift was not detected' >&2; exit 1
fi
grep -q 'New upgrade operations detected' "$test_root/drift.log"
echo 'practice model, transactional CLI, schema drift and nonempty restore: PASS'
