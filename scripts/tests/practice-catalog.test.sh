#!/usr/bin/env bash
# Host tests and browser journeys, with an isolated synthetic PostgreSQL bank.
set -euo pipefail
umask 077
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
source "$repo_dir/scripts/lib/application-db.sh"
container="infraege-db-test-116-$$"
test_root=$(mktemp -d)
cleanup() {
  docker rm -fv "$container" >/dev/null 2>&1 || true
  rm -rf -- "$test_root"
}
trap cleanup EXIT
docker run --detach --name "$container" --label com.infraege.db-purpose=test \
  -e POSTGRES_USER=infraege -e POSTGRES_DB=infraege -e POSTGRES_PASSWORD=infraege-116-bootstrap \
  -e DB_RUNTIME_PASSWORD=infraege-116-runtime -e DB_IMPORT_PASSWORD=infraege-116-import \
  -e DB_MIGRATION_PASSWORD=infraege-116-migration -e DB_BACKUP_PASSWORD=infraege-116-backup \
  -v "$repo_dir/scripts/db-provision-roles.sh:/docker-entrypoint-initdb.d/10-roles.sh:ro" \
  -p 127.0.0.1::5432 "$DB_IMAGE" >/dev/null
for attempt in $(seq 1 60); do
  docker exec "$container" pg_isready -h 127.0.0.1 -U infraege >/dev/null 2>&1 && break
  sleep 1
done
port=$(docker port "$container" 5432 | cut -d: -f2)
export MIGRATION_DATABASE_URL="postgresql://infraege_migration:infraege-116-migration@127.0.0.1:$port/infraege"
export PRACTICE_CATALOG_TEST_URL="postgresql://infraege_import:infraege-116-import@127.0.0.1:$port/infraege"
export DATABASE_URL="postgresql://infraege_runtime:infraege-116-runtime@127.0.0.1:$port/infraege"
export TASK_FILES_DIR="$test_root/files"
mkdir "$TASK_FILES_DIR"
cd "$repo_dir/apps/api"
uv run alembic upgrade head
uv run pytest tests/test_practice_catalog.py -s -q
uv run alembic check
cd "$repo_dir"
if [[ ${1:-} == --browser ]]; then
  pnpm --filter web exec playwright test e2e/practice-catalog.spec.ts
elif [[ ${1:-} == --inspect ]]; then
  printf 'Inspection database: %s\n' "$DATABASE_URL"
  read -r -p 'Press Enter to close the isolated inspection database: ' inspection_done
fi
printf 'practice catalog isolated acceptance: PASS\n'
