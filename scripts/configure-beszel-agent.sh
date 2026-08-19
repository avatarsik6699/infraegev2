#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=lib/production-ssh.sh
source "$repo_dir/scripts/lib/production-ssh.sh"

die() {
  echo "configure-beszel-agent: $*" >&2
  exit 1
}

show_help() {
  cat <<'EOF'
Usage: scripts/configure-beszel-agent.sh

Prompts for the Beszel universal token and system public key without echoing them, atomically
updates only BESZEL_AGENT_TOKEN and BESZEL_AGENT_KEY on the production VPS, and recreates only
beszel-agent. The previous protected environment is restored if the agent fails to start.
EOF
}

if [[ ${1:-} == --help || ${1:-} == -h ]]; then
  show_help
  exit 0
fi
[[ $# == 0 ]] || die "unexpected argument; use --help"
[[ -t 0 && -t 1 ]] || die "run this command from an interactive terminal"
command -v ssh >/dev/null 2>&1 || die "ssh is required"
production_ssh_init

beszel_token=''
beszel_key=''
cleanup() {
  unset beszel_token beszel_key
}
trap cleanup EXIT

read -r -s -p 'Beszel universal token: ' beszel_token </dev/tty
printf '\n' >/dev/tty
read -r -s -p 'Beszel system public key: ' beszel_key </dev/tty
printf '\n' >/dev/tty
[[ ${#beszel_token} -ge 16 ]] || die "token is unexpectedly short"
[[ ${#beszel_key} -ge 16 ]] || die "public key is unexpectedly short"
read -r -p "Update beszel-agent on root@$INFRAEGE_PROD_HOST? [y/N] " confirmation </dev/tty
[[ $confirmation == y || $confirmation == Y ]] || die "cancelled"

remote_script=$(cat <<'REMOTE_SCRIPT'
set -Eeuo pipefail

env_file=/etc/infraege/production.env
release_dir=$(readlink -f /opt/infraege/current)
[[ -n $release_dir && -r $release_dir/.deploy-sha ]] || {
  echo 'Current production release is unavailable.' >&2
  exit 1
}
[[ -w $env_file ]] || {
  echo 'Production environment is not writable by root.' >&2
  exit 1
}
env_lib="$release_dir/scripts/lib/production-env.sh"
[[ -r $env_lib ]] || {
  echo 'Production environment helper is unavailable in the current release.' >&2
  exit 1
}
# shellcheck disable=SC1090
source "$env_lib"

IFS= read -r -d '' new_token
IFS= read -r -d '' new_key
[[ ${#new_token} -ge 16 && ${#new_key} -ge 16 ]] || {
  echo 'Received Beszel values are unexpectedly short.' >&2
  exit 1
}

new_env=$(mktemp "${env_file}.new.XXXXXX")
backup_env=$(mktemp "${env_file}.backup.XXXXXX")
cleanup_remote() {
  rm -f -- "$new_env" "$backup_env"
  unset new_token new_key
}
trap cleanup_remote EXIT
cp --preserve=mode,ownership,timestamps -- "$env_file" "$backup_env"

token_seen=0
key_seen=0
while IFS= read -r line || [[ -n $line ]]; do
  case $line in
    BESZEL_AGENT_TOKEN=*)
      printf 'BESZEL_AGENT_TOKEN=%s\n' "$(production_env_quote "$new_token")"
      token_seen=1
      ;;
    BESZEL_AGENT_KEY=*)
      printf 'BESZEL_AGENT_KEY=%s\n' "$(production_env_quote "$new_key")"
      key_seen=1
      ;;
    *) printf '%s\n' "$line" ;;
  esac
done <"$env_file" >"$new_env"
[[ $token_seen == 1 && $key_seen == 1 ]] || {
  echo 'Beszel variables are missing from production.env.' >&2
  exit 1
}
chmod --reference="$env_file" "$new_env"
chown --reference="$env_file" "$new_env"
production_env_validate "$new_env" || {
  echo 'Updated production environment is not shell-sourceable.' >&2
  exit 1
}
mv -- "$new_env" "$env_file"

deploy_sha=$(<"$release_dir/.deploy-sha")
compose() {
  DEPLOY_SHA="$deploy_sha" docker compose --env-file "$env_file" --project-name infraege \
    -f "$release_dir/infra/docker-compose.yml" \
    -f "$release_dir/infra/docker-compose.prod.yml" "$@"
}

if ! compose up --detach --force-recreate --wait --wait-timeout 60 beszel-agent; then
  echo 'New Beszel agent failed; restoring the previous production environment.' >&2
  cp --preserve=mode,ownership,timestamps -- "$backup_env" "$env_file"
  compose up --detach --force-recreate --wait --wait-timeout 60 beszel-agent || true
  exit 1
fi

compose ps beszel-agent
echo 'Beszel agent configuration updated successfully.'
REMOTE_SCRIPT
)
printf -v remote_command 'bash -c %q' "$remote_script"

printf '%s\0%s\0' "$beszel_token" "$beszel_key" |
  production_ssh "$remote_command"
