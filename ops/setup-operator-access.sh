#!/usr/bin/env bash
set -Eeuo pipefail

[[ ${EUID:-$(id -u)} -eq 0 || ${OPERATOR_SETUP_ALLOW_NON_ROOT:-0} == 1 ]] || {
  echo 'setup-operator-access must run as root' >&2
  exit 1
}

operator_user=${OPERATOR_USER:-operator}
operator_group=${OPERATOR_GROUP:-infraege-operator}
deploy_user=${DEPLOY_USER:-deploy}
operator_home=${OPERATOR_HOME:-/home/$operator_user}
: "${OPERATOR_SSH_PUBLIC_KEY:?Set OPERATOR_SSH_PUBLIC_KEY}"
: "${OPERATOR_PASSWORD_HASH:?Set OPERATOR_PASSWORD_HASH}"

[[ $operator_user =~ ^[a-z_][a-z0-9_-]{0,31}$ ]] || {
  echo 'OPERATOR_USER is invalid' >&2
  exit 1
}
[[ $operator_group =~ ^[a-z_][a-z0-9_-]{0,31}$ ]] || {
  echo 'OPERATOR_GROUP is invalid' >&2
  exit 1
}
[[ $operator_user != root && $operator_user != "$deploy_user" ]] || {
  echo 'operator must be distinct from root and deploy' >&2
  exit 1
}
[[ $OPERATOR_SSH_PUBLIC_KEY == ssh-ed25519\ * ]] || {
  echo 'operator key must be ED25519 public-key material' >&2
  exit 1
}
[[ $OPERATOR_PASSWORD_HASH == \$* ]] || {
  echo 'operator password must be supplied as a crypt hash' >&2
  exit 1
}

getent group sudo >/dev/null
if ! getent group "$operator_group" >/dev/null 2>&1; then
  groupadd "$operator_group"
fi
if ! id "$operator_user" >/dev/null 2>&1; then
  useradd --create-home --home-dir "$operator_home" --gid "$operator_group" \
    --shell /bin/bash "$operator_user"
fi
usermod --gid "$operator_group" "$operator_user"
usermod --append --groups sudo "$operator_user"
printf '%s:%s\n' "$operator_user" "$OPERATOR_PASSWORD_HASH" | chpasswd --encrypted

install -d -m 700 -o "$operator_user" -g "$operator_group" "$operator_home/.ssh"
printf '%s\n' "$OPERATOR_SSH_PUBLIC_KEY" | install -m 600 \
  -o "$operator_user" -g "$operator_group" /dev/stdin "$operator_home/.ssh/authorized_keys"

visudo -cf /etc/sudoers >/dev/null
sshd -t
effective_sshd=$(sshd -T)
grep -qx 'permitrootlogin no' <<<"$effective_sshd"
grep -qx 'pubkeyauthentication yes' <<<"$effective_sshd"
grep -qx 'passwordauthentication no' <<<"$effective_sshd"
grep -qx 'kbdinteractiveauthentication no' <<<"$effective_sshd"

operator_groups=" $(id -nG "$operator_user") "
deploy_groups=" $(id -nG "$deploy_user") "
[[ $operator_groups == *' sudo '* ]]
[[ $deploy_groups != *' sudo '* ]]

echo "Human operator access is ready for $operator_user; SSH hardening is unchanged."
