#!/usr/bin/env bash

production_ssh_die() {
  echo "production SSH: $*" >&2
  return 1
}

production_ssh_assert_private_file() {
  local path=$1
  local label=$2
  [[ -f $path ]] || production_ssh_die "$label is missing: $path" || return
  [[ $(stat -c '%u' "$path") == "$(id -u)" ]] ||
    production_ssh_die "$label must be owned by the current user" || return
  [[ $(stat -c '%a' "$path") == 600 ]] ||
    production_ssh_die "$label must have mode 600: $path"
}

production_ssh_init() {
  local library_dir config_root password_file
  library_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
  config_root=${XDG_CONFIG_HOME:-"$HOME/.config"}
  INFRAEGE_PRODUCTION_DIR=${INFRAEGE_PRODUCTION_DIR:-"$config_root/infraege/production"}
  INFRAEGE_PROD_HOST=${INFRAEGE_PROD_HOST:-2.26.8.245}
  INFRAEGE_PROD_KNOWN_HOSTS=${INFRAEGE_PROD_KNOWN_HOSTS:-"$INFRAEGE_PRODUCTION_DIR/known_hosts"}
  password_file=${INFRAEGE_PROD_PASSWORD_FILE:-"$INFRAEGE_PRODUCTION_DIR/root-admin-password"}

  command -v ssh >/dev/null 2>&1 || production_ssh_die 'ssh is required' || return
  production_ssh_assert_private_file "$INFRAEGE_PROD_KNOWN_HOSTS" 'Pinned known_hosts file' || return
  [[ -s $INFRAEGE_PROD_KNOWN_HOSTS ]] || production_ssh_die 'Pinned known_hosts file is empty' || return
  if [[ -z ${INFRAEGE_SSH_PASSWORD:-} ]]; then
    production_ssh_assert_private_file "$password_file" 'Root password file' || return
    INFRAEGE_SSH_PASSWORD=$(<"$password_file")
  fi
  [[ ${#INFRAEGE_SSH_PASSWORD} -ge 48 && $INFRAEGE_SSH_PASSWORD != *$'\n'* ]] ||
    production_ssh_die 'Root password must be one line of at least 48 characters' || return

  SSH_ASKPASS=${SSH_ASKPASS:-"$library_dir/../ssh-askpass.sh"}
  [[ -x $SSH_ASKPASS ]] || production_ssh_die "SSH askpass helper is not executable: $SSH_ASKPASS" || return
  SSH_ASKPASS_REQUIRE=force
  export INFRAEGE_PRODUCTION_DIR INFRAEGE_PROD_HOST INFRAEGE_PROD_KNOWN_HOSTS
  export INFRAEGE_SSH_PASSWORD SSH_ASKPASS SSH_ASKPASS_REQUIRE
}

production_ssh() {
  ssh \
    -o PreferredAuthentications=password \
    -o PubkeyAuthentication=no \
    -o NumberOfPasswordPrompts=1 \
    -o StrictHostKeyChecking=yes \
    -o UserKnownHostsFile="$INFRAEGE_PROD_KNOWN_HOSTS" \
    "root@$INFRAEGE_PROD_HOST" "$@"
}

production_scp() {
  scp \
    -o PreferredAuthentications=password \
    -o PubkeyAuthentication=no \
    -o NumberOfPasswordPrompts=1 \
    -o StrictHostKeyChecking=yes \
    -o UserKnownHostsFile="$INFRAEGE_PROD_KNOWN_HOSTS" \
    "$@"
}
