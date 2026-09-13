#!/usr/bin/env bash
# Tests run on the host; the disposable PostgreSQL container holds only fixture data.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
command -v restic >/dev/null
: "${PRACTICE_TEST_BASE_IMAGE:?select the locally built application verifier image}"
test_root=$(mktemp -d)
export PRACTICE_RELEASE_TEST_PROJECT="infraege-db-test-118-$$"
container="$PRACTICE_RELEASE_TEST_PROJECT-postgres"
export PRACTICE_TEST_IMAGE="infraege-practice-test-118-$$"
cleanup() {
  docker rm -fv "$container" >/dev/null 2>&1 || true
  docker image rm "$PRACTICE_TEST_IMAGE" >/dev/null 2>&1 || true
  python3 - "$test_root" <<'PY'
import shutil, sys
shutil.rmtree(sys.argv[1])
PY
}
trap cleanup EXIT
docker image tag "$PRACTICE_TEST_BASE_IMAGE" "$PRACTICE_TEST_IMAGE"
mkdir "$test_root/files" "$test_root/backups"
export POSTGRES_DB=infraege DB_RUNTIME_PASSWORD=infraege-118-runtime
export DB_IMPORT_PASSWORD=infraege-118-import
docker run --detach --name "$container" \
  --label "com.docker.compose.project=$PRACTICE_RELEASE_TEST_PROJECT" \
  --label com.docker.compose.service=postgres --label com.infraege.db-purpose=test \
  -e POSTGRES_USER=infraege -e POSTGRES_DB -e POSTGRES_PASSWORD=infraege-118-bootstrap \
  -e DB_RUNTIME_PASSWORD -e DB_IMPORT_PASSWORD \
  -e DB_MIGRATION_PASSWORD=infraege-118-migration -e DB_BACKUP_PASSWORD=infraege-118-backup \
  -v "$repo_dir/scripts/db-provision-roles.sh:/docker-entrypoint-initdb.d/10-roles.sh:ro" \
  -v "$test_root/files:/task-files:ro" -p 127.0.0.1::5432 "$DB_IMAGE" >/dev/null
for _attempt in $(seq 1 60); do
  docker exec "$container" pg_isready -h 127.0.0.1 -U infraege >/dev/null 2>&1 && break
  sleep 1
done
port=$(docker port "$container" 5432 | cut -d: -f2)
export MIGRATION_DATABASE_URL="postgresql://infraege_migration:infraege-118-migration@127.0.0.1:$port/infraege"
export PRACTICE_REGISTRY="$repo_dir/apps/api/practice-registry.json"
export TASK_FILES_DIR="$test_root/files" PRACTICE_RELEASE_ROOT="$repo_dir"
export PRACTICE_RELEASE_TEST_ENV="$test_root/environment"
export BACKUP_ROOT="$test_root/backups" RESTIC_REPOSITORY="$test_root/restic"
export RESTIC_PASSWORD_FILE="$test_root/password" RESTIC_LOCK_FILE="$test_root/restic.lock"
export RESTIC_CACHE_DIR="$test_root/restic-cache" BACKUP_STATUS_FILE="$test_root/backup-status.json"
printf 'isolated-restic-118-password' >"$RESTIC_PASSWORD_FILE"
printf 'POSTGRES_DB=infraege\n' >"$PRACTICE_RELEASE_TEST_ENV"
cd "$repo_dir/apps/api"
uv run alembic upgrade head
uv run python -m app.modules.practice.cli register --environment test --project "$PRACTICE_RELEASE_TEST_PROJECT"
uv run pytest tests/test_practice_release.py --basetemp "$test_root/pytest" -q
uv run python -m app.modules.practice.release --environment test \
  --project "$PRACTICE_RELEASE_TEST_PROJECT" --backup-env "$PRACTICE_RELEASE_TEST_ENV"
uv run alembic check
restic check --read-data >/dev/null
jq -e '.status=="success"' "$BACKUP_STATUS_FILE" >/dev/null
printf 'practice release import and real backups: PASS\n'
