#!/usr/bin/env bash
set -Eeuo pipefail

root=/opt/infraege-ops
env_root=/etc/infraege/ops

if [[ ! -L $root/current ]]; then
  echo 'infraege-ops: not installed'
  exit 2
fi

release_dir=$(readlink -f "$root/current")
release=$(basename -- "$release_dir")
[[ $release =~ ^[0-9a-f]{40}$ && -r $release_dir/compose.yml && -r $env_root/$release.env ]] || {
  echo 'infraege-ops: current release is incomplete' >&2
  exit 1
}

echo "infraege-ops release: $release"
OPS_RELEASE=$release docker compose --env-file "$env_root/$release.env" \
  --project-name infraege-ops -f "$release_dir/compose.yml" ps --all
