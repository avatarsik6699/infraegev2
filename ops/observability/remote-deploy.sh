#!/usr/bin/env bash
set -Eeuo pipefail

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'infraege-ops lifecycle must run as root' >&2
  exit 1
}

action=${ACTION:-}
root=/opt/infraege-ops
releases="$root/releases"
env_root=/etc/infraege/ops
network=infraege-observability-ingress
install -d -m 755 /run/lock
exec 9>/run/lock/infraege-ops.lock
flock -n 9 || {
  echo 'another infraege-ops lifecycle command is running' >&2
  exit 1
}

compose() {
  local release_dir=$1 release=$2
  shift 2
  OPS_RELEASE=$release docker compose --env-file "$env_root/$release.env" \
    --project-name infraege-ops -f "$release_dir/compose.yml" "$@"
}

release_from_dir() {
  basename -- "$1"
}

case "$action" in
  install | update)
    release=${OPS_RELEASE:-}
    [[ $release =~ ^[0-9a-f]{40}$ ]] || {
      echo 'OPS_RELEASE must be a full lowercase Git SHA' >&2
      exit 64
    }
    archive="/root/infraege-ops-$release.tar.gz"
    uploaded_env="/root/infraege-ops-$release.env"
    release_dir="$releases/$release"
    [[ -r $archive && -r $uploaded_env ]] || {
      echo 'operations archive or environment upload is missing' >&2
      exit 1
    }
    if [[ $action == install && -L $root/current ]]; then
      echo 'infraege-ops is already installed; use update' >&2
      exit 1
    fi
    if [[ $action == update && ! -L $root/current ]]; then
      echo 'infraege-ops is not installed; use install' >&2
      exit 1
    fi
    if [[ $action == install ]]; then
      for legacy_service in umami beszel beszel-agent docker-socket-proxy; do
        if [[ -n $(docker ps --quiet --filter "label=com.infraege.service=$legacy_service") ]]; then
          rm -f -- "$archive" "$uploaded_env"
          echo "legacy $legacy_service is still running; complete the approved cutover step first" >&2
          exit 1
        fi
      done
    fi
    install -d -m 755 "$releases" "$release_dir"
    install -d -m 700 "$env_root"
    tar --extract --gzip --file "$archive" --directory "$release_dir"
    install -m 600 "$uploaded_env" "$env_root/$release.env"
    rm -f -- "$archive" "$uploaded_env"

    docker network inspect "$network" >/dev/null 2>&1 || docker network create "$network" >/dev/null
    compose "$release_dir" "$release" config --quiet

    previous_dir=
    if [[ -L $root/current ]]; then
      previous_dir=$(readlink -f "$root/current")
    fi
    rollback_failed_deploy() {
      if [[ -n $previous_dir && -r $previous_dir/compose.yml ]]; then
        previous_release=$(release_from_dir "$previous_dir")
        echo "infraege-ops deploy failed; restoring $previous_release" >&2
        compose "$previous_dir" "$previous_release" up --detach --remove-orphans --wait --wait-timeout 180
      else
        compose "$release_dir" "$release" down || true
      fi
    }
    trap rollback_failed_deploy ERR

    compose "$release_dir" "$release" pull
    compose "$release_dir" "$release" up --detach --remove-orphans --wait --wait-timeout 180
    if [[ -n $previous_dir && $previous_dir != "$release_dir" ]]; then
      ln -sfn "$previous_dir" "$root/previous"
    fi
    ln -sfn "$release_dir" "$root/current"
    trap - ERR
    echo "infraege-ops $release is healthy."
    ;;
  rollback)
    [[ -L $root/current && -L $root/previous ]] || {
      echo 'infraege-ops rollback requires current and previous releases' >&2
      exit 1
    }
    current_dir=$(readlink -f "$root/current")
    target_dir=$(readlink -f "$root/previous")
    target_release=$(release_from_dir "$target_dir")
    [[ -r $target_dir/compose.yml && -r $env_root/$target_release.env ]] || {
      echo 'previous infraege-ops release is incomplete' >&2
      exit 1
    }
    compose "$target_dir" "$target_release" up --detach --remove-orphans --wait --wait-timeout 180
    ln -sfn "$current_dir" "$root/previous"
    ln -sfn "$target_dir" "$root/current"
    echo "infraege-ops rolled back to $target_release."
    ;;
  *)
    echo 'ACTION must be install, update or rollback' >&2
    exit 64
    ;;
esac
