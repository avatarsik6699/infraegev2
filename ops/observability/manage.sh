#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
compose_file="$repo_dir/ops/observability/compose.yml"

usage() {
  cat <<'EOF'
Usage:
  ops/opsctl config --env-file PATH --release FULL_GIT_SHA
  ops/opsctl status
  ops/opsctl install --env-file PATH --release FULL_GIT_SHA
  ops/opsctl update --env-file PATH --release FULL_GIT_SHA
  ops/opsctl rollback

config is local and read-only. status uses read-only production SSH. install, update and rollback
mutate only the independent infraege-ops Compose project; they never change the application stack.
EOF
}

die() {
  echo "opsctl: $*" >&2
  exit 64
}

command_name=${1:-}
[[ -n $command_name ]] || {
  usage >&2
  exit 64
}
shift

case "$command_name" in
  config | install | update)
    env_file=
    release=
    while (($#)); do
      case "$1" in
        --env-file)
          (($# >= 2)) || die '--env-file requires a path'
          env_file=$2
          shift 2
          ;;
        --release)
          (($# >= 2)) || die '--release requires a full Git SHA'
          release=$2
          shift 2
          ;;
        *) die "unknown argument: $1" ;;
      esac
    done
    [[ -n $env_file ]] || die '--env-file is required'
    [[ $release =~ ^[0-9a-f]{40}$ ]] || die '--release must be a full lowercase Git SHA'
    [[ -r $env_file ]] || die "environment file is not readable: $env_file"
    ;;
  status | rollback)
    (($# == 0)) || die "$command_name accepts no arguments"
    ;;
  help | --help | -h)
    usage
    exit 0
    ;;
  *)
    usage >&2
    die "unknown command: $command_name"
    ;;
esac

if [[ $command_name == config ]]; then
  OPS_RELEASE=$release docker compose --env-file "$env_file" --project-name infraege-ops \
    -f "$compose_file" config --quiet
  echo 'infraege-ops Compose configuration is valid.'
  exit 0
fi

# shellcheck source=../../scripts/lib/production-ssh.sh
source "$repo_dir/scripts/lib/production-ssh.sh"
production_ssh_init

if [[ $command_name == status ]]; then
  production_ssh 'bash -s' <"$repo_dir/ops/observability/remote-status.sh"
  exit
fi

if [[ $command_name == rollback ]]; then
  production_ssh 'ACTION=rollback bash -s' <"$repo_dir/ops/observability/remote-deploy.sh"
  exit
fi

production_ssh_assert_private_file "$env_file" 'Operations environment file'

work_dir=$(mktemp -d)
trap 'rm -rf -- "$work_dir"' EXIT
archive="$work_dir/infraege-ops-$release.tar.gz"
remote_archive="/root/infraege-ops-$release.tar.gz"
remote_env="/root/infraege-ops-$release.env"

tar --create --gzip --file "$archive" --directory "$repo_dir/ops/observability" compose.yml
production_scp "$archive" "root@$INFRAEGE_PROD_HOST:$remote_archive"
production_scp "$env_file" "root@$INFRAEGE_PROD_HOST:$remote_env"
production_ssh "ACTION=$command_name OPS_RELEASE=$release bash -s" \
  <"$repo_dir/ops/observability/remote-deploy.sh"
