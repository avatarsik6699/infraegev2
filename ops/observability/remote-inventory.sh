#!/usr/bin/env bash
set -Eeuo pipefail

# Fixed read-only collector. Output is a narrow TSV protocol consumed locally by opsctl;
# environment values, container inspection JSON, logs and command stderr are never returned.
compose_component() {
  local component=$1 line state=missing revision=
  line=$(docker ps --all --filter "label=com.infraege.service=$component" \
    --format '{{.State}}\t{{.Image}}' 2>/dev/null | head -n 1 || true)
  if [[ -n $line ]]; then
    IFS=$'\t' read -r state revision <<<"$line"
  fi
  printf '%s\tcompose-service\t%s\t%s\n' "$component" "$state" "$revision"
}

systemd_component() {
  local component=$1 unit=$2 state
  state=$(systemctl is-active "$unit" 2>/dev/null || true)
  [[ -n $state ]] || state=missing
  printf '%s\tsystemd-unit\t%s\t\n' "$component" "$state"
}

timer_component() {
  local unit=$1 active enabled state
  active=$(systemctl is-active "$unit" 2>/dev/null || true)
  enabled=$(systemctl is-enabled "$unit" 2>/dev/null || true)
  if [[ $active == active && $enabled == enabled ]]; then
    state=enabled-active
  elif [[ $active == inactive && $enabled == disabled ]]; then
    state=missing
  else
    state="${enabled:-unknown}-${active:-unknown}"
  fi
  printf '%s\tsystemd-timer\t%s\t\n' "$unit" "$state"
}

for component in umami beszel beszel-agent docker-socket-proxy; do
  compose_component "$component"
done
systemd_component journal-gateway systemd-journal-gatewayd.socket
systemd_component fail2ban fail2ban.service
for timer in infraege-backup.timer infraege-restore-check.timer infraege-analytics-retention.timer; do
  timer_component "$timer"
done
if ip link show wg0 >/dev/null 2>&1; then
  printf 'wg0\tnetwork-interface\tactive\t\n'
else
  printf 'wg0\tnetwork-interface\tmissing\t\n'
fi
