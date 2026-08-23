#!/usr/bin/env bash

management_ssh_init() {
  local repo_dir config_dir candidate fingerprint
  repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
  MANAGEMENT_CONNECTION_ENV=${MANAGEMENT_CONNECTION_ENV:-${XDG_CONFIG_HOME:-${HOME:?}/.config}/sre-kit/dedicated-vps/connection.env}
  [[ -f $MANAGEMENT_CONNECTION_ENV &&
    $(stat -c '%a' "$MANAGEMENT_CONNECTION_ENV") == 600 &&
    $(stat -c '%u' "$MANAGEMENT_CONNECTION_ENV") == "$(id -u)" ]] || {
    echo "management SSH connection env must be a current-user-owned mode-600 file: $MANAGEMENT_CONNECTION_ENV" >&2
    return 1
  }
  set -a
  # shellcheck disable=SC1090
  source "$MANAGEMENT_CONNECTION_ENV"
  set +a
  : "${SSH_HOST:?missing SSH_HOST}"
  : "${SSH_PORT:?missing SSH_PORT}"
  : "${SSH_USER:?missing SSH_USER}"
  : "${SSH_PASS:?missing SSH_PASS}"
  : "${SRE_KIT_ADMIN_PASS:?missing SRE_KIT_ADMIN_PASS}"
  [[ $SSH_PORT =~ ^[0-9]+$ ]]
  MANAGEMENT_SSH_HOST=$SSH_HOST
  MANAGEMENT_SSH_PORT=$SSH_PORT
  MANAGEMENT_SSH_USER=$SSH_USER
  MANAGEMENT_SSH_PASSWORD=$SSH_PASS
  MANAGEMENT_ADMIN_PASSWORD=$SRE_KIT_ADMIN_PASS
  unset SSH_PASS SRE_KIT_ADMIN_PASS
  export MANAGEMENT_SSH_HOST MANAGEMENT_SSH_PORT MANAGEMENT_SSH_USER
  export MANAGEMENT_SSH_PASSWORD MANAGEMENT_ADMIN_PASSWORD

  config_dir=${XDG_STATE_HOME:-${HOME:?}/.local/state}/infraege/management
  MANAGEMENT_KNOWN_HOSTS=${MANAGEMENT_KNOWN_HOSTS:-$config_dir/known_hosts}
  install -d -m 700 "$config_dir"
  candidate=$(mktemp "$config_dir/.known-hosts.XXXXXX")
  trap 'rm -f -- "$candidate"' RETURN
  ssh-keyscan -p "$MANAGEMENT_SSH_PORT" -t ed25519 "$MANAGEMENT_SSH_HOST" 2>/dev/null > "$candidate"
  fingerprint=$(ssh-keygen -lf "$candidate" -E sha256 | awk 'NR == 1 { print $2 }')
  [[ $fingerprint == 'SHA256:Ld0mlVRwXUXqPntm3BIkZ8qiA2fC9AIWl+g5gCgKp1o' ]] || {
    echo "management SSH fingerprint mismatch: $fingerprint" >&2
    return 1
  }
  install -m 600 "$candidate" "$MANAGEMENT_KNOWN_HOSTS"
  rm -f -- "$candidate"
  trap - RETURN
  export MANAGEMENT_KNOWN_HOSTS
  MANAGEMENT_SSH_ASKPASS=$repo_dir/scripts/management-ssh-askpass.sh
  [[ -x $MANAGEMENT_SSH_ASKPASS ]]
  export MANAGEMENT_SSH_ASKPASS
}

management_ssh() {
  SSH_ASKPASS="$MANAGEMENT_SSH_ASKPASS" SSH_ASKPASS_REQUIRE=force ssh -p "$MANAGEMENT_SSH_PORT" \
    -o PreferredAuthentications=password -o PubkeyAuthentication=no \
    -o NumberOfPasswordPrompts=1 -o StrictHostKeyChecking=yes \
    -o UserKnownHostsFile="$MANAGEMENT_KNOWN_HOSTS" \
    "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST" "$@"
}

management_scp() {
  SSH_ASKPASS="$MANAGEMENT_SSH_ASKPASS" SSH_ASKPASS_REQUIRE=force scp -P "$MANAGEMENT_SSH_PORT" \
    -o PreferredAuthentications=password -o PubkeyAuthentication=no \
    -o NumberOfPasswordPrompts=1 -o StrictHostKeyChecking=yes \
    -o UserKnownHostsFile="$MANAGEMENT_KNOWN_HOSTS" "$@"
}
