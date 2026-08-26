#!/bin/sh
set -eu

ACTION=${1:-}
STOP_TIMEOUT=${STOP_TIMEOUT:-10}
WAIT_TIMEOUT=${WAIT_TIMEOUT:-180}
LOCK_FILE=${INFRAEGE_DOCKER_LOCK_FILE:-/tmp/infraege-dev-docker-lifecycle.lock}
STATE_FILE=${INFRAEGE_DOCKER_STATE_FILE:-.output/docker-dev-inputs.sha256}
DEV_INPUTS=${INFRAEGE_DOCKER_INPUTS:-"
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
apps/web/package.json
apps/web/Dockerfile
apps/web/tsconfig.json
apps/web/vite.config.ts
apps/api/pyproject.toml
apps/api/uv.lock
apps/api/Dockerfile
apps/api/entrypoint.sh
infra/docker-compose.yml
infra/docker-compose.dev.yml
"}

case "$ACTION" in
  dev | rebuild | stop | down | restart) ;;
  *)
    echo "Usage: $0 {dev|rebuild|stop|down|restart}" >&2
    exit 2
    ;;
esac

case "$STOP_TIMEOUT:$WAIT_TIMEOUT" in
  *[!0-9:]* | :* | *:)
    echo "STOP_TIMEOUT and WAIT_TIMEOUT must be whole seconds." >&2
    exit 2
    ;;
esac

if ! command -v flock >/dev/null 2>&1; then
  echo "flock is required to serialize Docker lifecycle commands." >&2
  exit 1
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another infraege Docker lifecycle command is still running." >&2
  echo "Wait for it to finish instead of starting '$ACTION' concurrently." >&2
  exit 75
fi

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$REPO_ROOT"

compose() {
  POSTGRES_USER=infraege \
    POSTGRES_PASSWORD=infraege-local-only \
    POSTGRES_DB=infraege \
    APP_ENV=development \
    DEPLOY_SHA=development \
    docker compose --env-file /dev/null --project-name infraege-dev \
      -f infra/docker-compose.yml \
      -f infra/docker-compose.dev.yml \
      "$@"
}

require_docker() {
  if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running or Docker Desktop's WSL integration is unavailable." >&2
    exit 1
  fi
}

development_inputs_fingerprint() {
  if ! command -v sha256sum >/dev/null 2>&1; then
    echo "sha256sum is required to detect changed Docker development inputs." >&2
    return 1
  fi

  for input in $DEV_INPUTS; do
    if [ ! -f "$input" ]; then
      echo "Docker development input is missing: $input" >&2
      return 1
    fi
  done
  for input in $DEV_INPUTS; do
    sha256sum "$input"
  done | sha256sum | cut -d ' ' -f 1
}

remember_development_inputs() {
  fingerprint=$1
  state_dir=$(dirname -- "$STATE_FILE")
  mkdir -p -- "$state_dir"
  printf '%s\n' "$fingerprint" >"$STATE_FILE"
}

start_development() {
  force_build=${1:-false}
  fingerprint=$(development_inputs_fingerprint)
  previous_fingerprint=
  if [ -f "$STATE_FILE" ]; then
    previous_fingerprint=$(cat -- "$STATE_FILE")
  fi

  if [ "$force_build" = "true" ] || [ "$fingerprint" != "$previous_fingerprint" ]; then
    if [ "$force_build" != "true" ]; then
      echo "Docker development inputs changed; rebuilding affected images..."
    fi
    start_stack --build
    remember_development_inputs "$fingerprint"
    return
  fi

  start_stack
}

start_stack() {
  build_flag=${1:-}

  if [ "$build_flag" = "--build" ]; then
    set -- up --build --wait --wait-timeout "$WAIT_TIMEOUT"
  else
    set -- up --wait --wait-timeout "$WAIT_TIMEOUT"
  fi

  if compose "$@"; then
    return 0
  else
    status=$?
  fi

  echo >&2
  echo "infraege failed to become healthy; current service status:" >&2
  compose ps --all >&2 || true
  echo >&2
  echo "Recent nginx/web/api logs:" >&2
  compose logs --tail=80 nginx web api >&2 || true
  exit "$status"
}

require_docker

case "$ACTION" in
  dev)
    start_development
    echo
    echo "infraege is ready: http://localhost:8080/"
    ;;
  rebuild)
    start_development true
    echo
    echo "infraege was rebuilt and is ready: http://localhost:8080/"
    ;;
  stop)
    echo "Stopping infraege gracefully (timeout: ${STOP_TIMEOUT}s per service)..."
    compose stop --timeout "$STOP_TIMEOUT"
    echo "infraege stopped. Containers and PostgreSQL data were preserved for fast resume."
    ;;
  down)
    echo "Removing infraege containers and network (timeout: ${STOP_TIMEOUT}s per service)..."
    compose down --timeout "$STOP_TIMEOUT" --remove-orphans
    echo "infraege containers and network removed. PostgreSQL data was preserved."
    ;;
  restart)
    echo "Restarting the complete infraege developer stack..."
    compose stop --timeout "$STOP_TIMEOUT"
    start_development
    echo
    echo "infraege restarted and is ready: http://localhost:8080/"
    ;;
esac
