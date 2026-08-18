#!/bin/sh
set -eu

ACTION=${1:-}
STOP_TIMEOUT=${STOP_TIMEOUT:-10}
WAIT_TIMEOUT=${WAIT_TIMEOUT:-180}
LOCK_FILE=${INFRAEGE_DOCKER_LOCK_FILE:-/tmp/infraege-dev-docker-lifecycle.lock}

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
    start_stack
    echo
    echo "infraege is ready: http://localhost:8080/"
    ;;
  rebuild)
    start_stack --build
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
    start_stack
    echo
    echo "infraege restarted and is ready: http://localhost:8080/"
    ;;
esac
