#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root on Ubuntu 24.04." >&2
  exit 1
fi

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y \
  ca-certificates certbot curl dnsutils docker.io docker-compose-v2 fail2ban jq restic \
  systemd-journal-remote ufw wireguard

[[ $(passwd --status root | awk '{print $2}') == P ]] || {
  echo 'Set a new root password through the provider console before bootstrap.' >&2
  exit 1
}

install -d -m 755 /etc/ssh/sshd_config.d
install -m 644 "$repo_dir/ops/sshd/20-infraege-root-password.conf" \
  /etc/ssh/sshd_config.d/20-infraege-root-password.conf
rm -f /etc/ssh/sshd_config.d/20-infraege-hardening.conf
sshd -t
effective_sshd=$(sshd -T)
grep -qx 'permitrootlogin yes' <<<"$effective_sshd"
grep -qx 'passwordauthentication yes' <<<"$effective_sshd"
grep -qx 'kbdinteractiveauthentication no' <<<"$effective_sshd"
grep -qx 'pubkeyauthentication no' <<<"$effective_sshd"
grep -qx 'allowusers root' <<<"$effective_sshd"
systemctl reload ssh

ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 51820/udp
ufw --force enable

swap_target_bytes=$((2 * 1024 * 1024 * 1024))
swap_current_bytes=$(stat --format=%s /swapfile 2>/dev/null || printf '0')
if (( swap_current_bytes < swap_target_bytes )); then
  if swapon --show=NAME --noheadings | grep -Fxq /swapfile; then
    swapoff /swapfile
  fi
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
fi
swapon --show=NAME --noheadings | grep -Fxq /swapfile || swapon /swapfile
grep -Eq '^/swapfile[[:space:]]' /etc/fstab || \
  printf '/swapfile none swap sw 0 0\n' >> /etc/fstab

install -d -m 755 /etc/systemd/journald.conf.d
install -m 644 "$repo_dir/ops/journald/infraege.conf" \
  /etc/systemd/journald.conf.d/infraege.conf
systemctl restart systemd-journald

daemon_config=$(mktemp)
trap 'rm -f "$daemon_config"' EXIT
if [[ -s /etc/docker/daemon.json ]]; then
  jq '. + {"log-driver":"journald"}' /etc/docker/daemon.json > "$daemon_config"
else
  printf '%s\n' '{"log-driver":"journald"}' > "$daemon_config"
fi
install -m 644 "$daemon_config" /etc/docker/daemon.json
systemctl enable --now docker
systemctl restart docker

install -m 644 "$repo_dir/ops/fail2ban/filter.d/infraege-nginx-limit.conf" \
  /etc/fail2ban/filter.d/infraege-nginx-limit.conf
install -m 644 "$repo_dir/ops/fail2ban/jail.d/infraege.conf" \
  /etc/fail2ban/jail.d/infraege.conf
systemctl enable --now fail2ban
fail2ban-client reload

install -d -m 750 -o root -g root /etc/infraege /opt/infraege/releases
install -d -m 755 /var/www/certbot
install -d -m 700 -o root -g root /var/backups/infraege
install -d -m 755 -o root -g root /var/lib/infraege

echo "Bootstrap complete. Verify a second root/password SSH session before closing the console."
echo "Next: install WireGuard, obtain TLS, then run setup-journal-gateway.sh."
