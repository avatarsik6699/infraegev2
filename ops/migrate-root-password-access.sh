#!/usr/bin/env bash
set -Eeuo pipefail

[[ ${EUID:-$(id -u)} -eq 0 ]] || {
  echo 'migrate-root-password-access must run as root' >&2
  exit 1
}
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
access_config=/etc/ssh/sshd_config.d/20-infraege-root-password.conf
proof_file=/var/lib/infraege/root-password-access-verified
retired_users=(operator deploy ops-reader)

assert_effective_access() {
  sshd -t
  local effective
  effective=$(sshd -T)
  grep -qx 'permitrootlogin yes' <<<"$effective"
  grep -qx 'passwordauthentication yes' <<<"$effective"
  grep -qx 'kbdinteractiveauthentication no' <<<"$effective"
  grep -qx 'pubkeyauthentication no' <<<"$effective"
  grep -qx 'permitemptypasswords no' <<<"$effective"
  grep -qx 'allowusers root' <<<"$effective"
}

case ${1:-} in
  check)
    passwd --status root
    sshd -t
    sshd -T | grep -E \
      '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication|permitemptypasswords|allowusers|maxauthtries|logingracetime) '
    for user in "${retired_users[@]}"; do
      if id "$user" >/dev/null 2>&1; then id "$user"; else echo "$user: absent"; fi
    done
    ;;
  prepare)
    [[ $(passwd --status root | awk '{print $2}') == P ]] || {
      echo 'root must have a usable password before enabling password SSH' >&2
      exit 1
    }
    install -d -m 755 /etc/ssh/sshd_config.d
    install -m 644 "$repo_dir/ops/sshd/20-infraege-root-password.conf" "$access_config"
    rm -f /etc/ssh/sshd_config.d/20-infraege-hardening.conf
    assert_effective_access
    systemctl reload ssh

    install -d -m 750 -o root -g root /etc/infraege /opt/infraege/releases
    install -d -m 700 -o root -g root /var/backups/infraege
    install -d -m 755 -o root -g root /var/lib/infraege
    chown -R root:root /etc/infraege /opt/infraege /var/backups/infraege /var/lib/infraege
    "$repo_dir/ops/install-backup-timers.sh"
    echo 'Root/password SSH is prepared. Verify it from a second session before retire.'
    ;;
  verify)
    [[ -n ${SSH_CONNECTION:-} ]] || {
      echo 'verify must run inside the new root SSH session' >&2
      exit 1
    }
    assert_effective_access
    install -d -m 755 -o root -g root /var/lib/infraege
    printf 'verifiedAt=%s\n' "$(date --utc +%FT%TZ)" >"$proof_file"
    chmod 600 "$proof_file"
    echo 'Root/password SSH proof recorded.'
    ;;
  retire)
    [[ ${CONFIRM_RETIRE_IDENTITIES:-} == operator,deploy,ops-reader ]] || {
      echo 'Set CONFIRM_RETIRE_IDENTITIES=operator,deploy,ops-reader' >&2
      exit 64
    }
    [[ -s $proof_file ]] || {
      echo 'A verified second root/password SSH session is required before retirement' >&2
      exit 1
    }
    assert_effective_access
    for unit in infraege-backup.service infraege-restore-check.service infraege-analytics-retention.service; do
      [[ $(systemctl show "$unit" -p User --value) == root ]]
    done
    for user in "${retired_users[@]}"; do
      if id "$user" >/dev/null 2>&1; then
        loginctl terminate-user "$user" >/dev/null 2>&1 || true
        userdel --remove "$user"
      fi
    done
    rm -f /etc/sudoers.d/infraege-ops-reader /usr/local/bin/infraege-ops-query
    for group in infraege-operator deploy ops-reader; do
      getent group "$group" >/dev/null 2>&1 && groupdel "$group" 2>/dev/null || true
    done
    for user in "${retired_users[@]}"; do
      ! id "$user" >/dev/null 2>&1
    done
    echo 'operator, deploy and ops-reader identities retired.'
    ;;
  *)
    echo "usage: $0 check|prepare|verify|retire" >&2
    exit 64
    ;;
esac
