#!/usr/bin/env bash
set -Eeuo pipefail

[[ ${1:-} == --apply && $# == 1 ]] || {
  echo "usage: $0 --apply" >&2
  exit 64
}

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
env_lib="$repo_dir/scripts/lib/production-env.sh"
# shellcheck source=lib/production-ssh.sh
source "$repo_dir/scripts/lib/production-ssh.sh"

[[ -r $env_lib ]] || {
  echo 'Production environment helper is unavailable.' >&2
  exit 1
}
production_ssh_init

remote_script=$(
  cat "$env_lib"
  cat <<'REMOTE_SCRIPT'
set -Eeuo pipefail

env_file=/etc/infraege/production.env
[[ -w $env_file ]] || {
  echo 'Production environment is not writable by root.' >&2
  exit 1
}

new_env=$(mktemp "${env_file}.new.XXXXXX")
cleanup() {
  rm -f -- "$new_env"
}
trap cleanup EXIT

key_seen=0
while IFS= read -r line || [[ -n $line ]]; do
  case $line in
    BESZEL_AGENT_KEY=*)
      raw_value=${line#BESZEL_AGENT_KEY=}
      case $raw_value in
        \"*\"|\'*\') printf '%s\n' "$line" ;;
        *) printf 'BESZEL_AGENT_KEY=%s\n' "$(production_env_quote "$raw_value")" ;;
      esac
      key_seen=$((key_seen + 1))
      ;;
    *) printf '%s\n' "$line" ;;
  esac
done <"$env_file" >"$new_env"
[[ $key_seen == 1 ]] || {
  echo 'Expected exactly one Beszel key assignment.' >&2
  exit 1
}
production_env_validate "$new_env" || {
  echo 'Repaired production environment is not shell-sourceable.' >&2
  exit 1
}
chmod --reference="$env_file" "$new_env"
chown --reference="$env_file" "$new_env"
mv -- "$new_env" "$env_file"
echo 'Beszel production environment assignment normalized successfully.'
REMOTE_SCRIPT
)
printf -v remote_command 'bash -c %q' "$remote_script"

production_ssh "$remote_command"
