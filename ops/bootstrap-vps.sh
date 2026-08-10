#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root on Ubuntu 24.04." >&2
  exit 1
fi

: "${ADMIN_SSH_PUBLIC_KEY:?Set ADMIN_SSH_PUBLIC_KEY to the deploy public key}"
deploy_user=${DEPLOY_USER:-deploy}
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y \
  ca-certificates certbot curl dnsutils docker.io docker-compose-v2 fail2ban jq restic \
  systemd-journal-remote ufw wireguard

if ! id "$deploy_user" >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$deploy_user"
fi
usermod -aG docker "$deploy_user"

install -d -m 700 -o "$deploy_user" -g "$deploy_user" "/home/$deploy_user/.ssh"
printf '%s\n' "$ADMIN_SSH_PUBLIC_KEY" | install -m 600 -o "$deploy_user" -g "$deploy_user" \
  /dev/stdin "/home/$deploy_user/.ssh/authorized_keys"

install -d -m 755 /etc/ssh/sshd_config.d
install -m 644 "$repo_dir/ops/sshd/20-infraege-hardening.conf" \
  /etc/ssh/sshd_config.d/20-infraege-hardening.conf
sshd -t
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

install -d -m 750 -o "$deploy_user" -g "$deploy_user" /etc/infraege /opt/infraege/releases
install -d -m 755 /var/www/certbot
install -d -m 700 -o "$deploy_user" -g "$deploy_user" /var/backups/infraege
install -d -m 755 -o "$deploy_user" -g "$deploy_user" /var/lib/infraege

echo "Bootstrap complete. Open a second SSH session before closing the current one."
echo "Next: install WireGuard config, obtain the TLS certificate, then run setup-ops-access.sh."
