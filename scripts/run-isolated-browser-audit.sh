#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"
portfolios=("$@")
if (( ${#portfolios[@]} == 0 )); then
  portfolios=(account full production)
fi
for portfolio in "${portfolios[@]}"; do
  case "$portfolio" in
    account|full|production|no-js|accessibility) ;;
    *) printf 'Unknown browser portfolio: %s\n' "$portfolio" >&2; exit 2 ;;
  esac
done
# Refuse busy ports before creating any disposable state; never adopt an unrelated server.
python3 -c '
import socket
for host, port in [("127.0.0.1", 15432), ("127.0.0.1", 18000),
                   ("127.0.0.1", 3100), ("127.0.0.2", 3100),
                   ("127.0.0.2", 8100), ("127.0.0.2", 3200)]:
    with socket.socket() as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        probe.bind((host, port))
'
audit_workspace=$(mktemp -d /tmp/infraege-browser-audit.XXXXXX)
audit_container=''
audit_api=''
cleanup() {
  local result=$?
  trap - EXIT
  if [[ -n $audit_api ]]; then
    kill "$audit_api" 2>/dev/null || true
    wait "$audit_api" 2>/dev/null || true
  fi
  if [[ $audit_container =~ ^[0-9a-f]{64}$ ]]; then
    docker stop --time 10 "$audit_container" >/dev/null || result=1
  fi
  [[ $audit_workspace == /tmp/infraege-browser-audit.* ]] && rm -rf -- "$audit_workspace"
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# These are fresh synthetic credentials, never inherited development/production values.
export APP_ENV=development DEPLOY_SHA=development POSTGRES_USER=infraege POSTGRES_DB=infraege
export SMTP_HOST='' SMTP_USERNAME='' SMTP_PASSWORD='' MAIL_FROM=''
export VK_ENABLED=false YANDEX_ENABLED=false TELEGRAM_ENABLED=false
unset VK_CLIENT_SECRET YANDEX_CLIENT_SECRET TELEGRAM_CLIENT_SECRET
for credential in POSTGRES_PASSWORD DB_RUNTIME_PASSWORD DB_APP_PASSWORD DB_IMPORT_PASSWORD DB_MIGRATION_PASSWORD DB_BACKUP_PASSWORD AUTH_CSRF_SECRET; do
  printf -v "$credential" '%s' "$(openssl rand -hex 24)"
  export "${credential?}"
done
export TASK_FILES_DIR="$audit_workspace/task-files"
mkdir -p "$TASK_FILES_DIR"
export DATABASE_URL="postgresql://infraege_runtime:$DB_RUNTIME_PASSWORD@127.0.0.1:15432/infraege"
export ACCOUNT_DATABASE_URL="postgresql://infraege_app:$DB_APP_PASSWORD@127.0.0.1:15432/infraege"
export MIGRATION_DATABASE_URL="postgresql://infraege_migration:$DB_MIGRATION_PASSWORD@127.0.0.1:15432/infraege"
export IMPORT_DATABASE_URL="postgresql://infraege_import:$DB_IMPORT_PASSWORD@127.0.0.1:15432/infraege"
export API_INTERNAL_URL=http://127.0.0.1:18000 PUBLIC_ORIGIN=http://127.0.0.2:3100

audit_container=$(docker run --detach --rm --name "infraege-browser-audit-$$" \
  --publish 127.0.0.1:15432:5432 --tmpfs /var/lib/postgresql \
  --env POSTGRES_USER --env POSTGRES_DB --env POSTGRES_PASSWORD \
  --env DB_RUNTIME_PASSWORD --env DB_APP_PASSWORD --env DB_IMPORT_PASSWORD \
  --env DB_MIGRATION_PASSWORD --env DB_BACKUP_PASSWORD \
  --volume "$repo_dir/scripts/db-provision-roles.sh:/docker-entrypoint-initdb.d/10-application-roles.sh:ro" \
  postgres:18.6-alpine3.24@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2)
for attempt in {1..60}; do
  if docker exec "$audit_container" pg_isready -U infraege >/dev/null 2>&1; then break; fi
  if [[ $attempt == 60 ]]; then echo 'isolated database startup failed' >&2; exit 1; fi
  sleep 1
done
(cd apps/api && uv run alembic upgrade head)
(cd apps/api && uv run python -m app.modules.practice.cli import "$repo_dir/content/practice-bank")
(
  cd apps/api
  uv run python -m app.modules.practice.verify
)
(
  cd apps/api
  exec uv run uvicorn app.main:app --host 127.0.0.1 --port 18000 --log-level warning
) >"$audit_workspace/api.log" 2>&1 &
audit_api=$!
for attempt in {1..60}; do
  if curl --fail --silent http://127.0.0.1:18000/health/ready >/dev/null; then break; fi
  if [[ $attempt == 60 ]]; then echo 'isolated API startup failed' >&2; exit 1; fi
  sleep 1
done

production_build_ready=false
for portfolio in "${portfolios[@]}"; do
  if [[ $production_build_ready == false && ( $portfolio == no-js || $portfolio == production ) ]]; then
    pnpm --filter web build
    production_build_ready=true
  fi
  case "$portfolio" in
    account) pnpm --filter web exec playwright test --config playwright.account.config.ts ;;
    full) pnpm --filter web test:e2e ;;
    production) pnpm --filter web test:browser:production:once ;;
    no-js) pnpm --filter web test:browser:no-js ;;
    accessibility) pnpm --filter web test:browser:accessibility ;;
  esac
done
