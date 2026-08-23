#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
compose=(docker compose --project-name infra
  -f "$repo_dir/infra/docker-compose.yml"
  -f "$repo_dir/infra/docker-compose.override.yml")
web_was_running=false

restore_web() {
  if [[ $web_was_running == true ]]; then
    "${compose[@]}" up -d --no-deps web
  fi
}

[[ $# -gt 0 ]] || {
  echo 'usage: scripts/run-host-web-gate.sh COMMAND [ARG ...]' >&2
  exit 2
}

if [[ -n $("${compose[@]}" ps --status running -q web) ]]; then
  web_was_running=true
  trap restore_web EXIT
  "${compose[@]}" stop web
fi

(cd "$repo_dir" && "$@")
