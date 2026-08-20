#!/usr/bin/env bash
set -Eeuo pipefail

# Fixed read-only protocol: check-id<TAB>status<TAB>code. Never emit command output.
tool_check() {
  local id=$1 command=$2
  if command -v "$command" >/dev/null 2>&1; then
    printf '%s\tpass\tavailable\n' "$id"
  else
    printf '%s\tblocker\tmissing\n' "$id"
  fi
}

tool_check docker docker
if docker compose version >/dev/null 2>&1; then
  printf 'compose\tpass\tavailable\n'
else
  printf 'compose\tblocker\tmissing\n'
fi
tool_check systemd systemctl
tool_check jq jq
tool_check restic restic

if ip link show wg0 >/dev/null 2>&1; then
  printf 'wireguard\tpass\tactive\n'
else
  printf 'wireguard\tblocker\tmissing\n'
fi

if [[ -n $(docker ps --all --quiet --filter label=com.docker.compose.project=infraege 2>/dev/null) ]]; then
  printf 'application-project\tpass\towned\n'
else
  printf 'application-project\twarning\tmissing\n'
fi
if [[ -z $(docker ps --all --quiet --filter label=com.docker.compose.project=infraege-ops 2>/dev/null) ]]; then
  printf 'operations-project\tpass\tabsent\n'
else
  printf 'operations-project\tblocker\talready-running\n'
fi

if [[ ! -e /opt/infraege-ops || ( -d /opt/infraege-ops && ! -L /opt/infraege-ops ) ]]; then
  printf 'target-directory\tpass\tavailable\n'
else
  printf 'target-directory\tblocker\tunsafe\n'
fi

if /opt/infraege/current/scripts/check-backup-freshness.sh >/dev/null 2>&1; then
  printf 'backup-freshness\tpass\tfresh\n'
else
  printf 'backup-freshness\tblocker\tstale-or-missing\n'
fi

restore_result=$(systemctl show infraege-restore-check.service --property=Result --value 2>/dev/null || true)
restore_status=$(systemctl show infraege-restore-check.service --property=ExecMainStatus --value 2>/dev/null || true)
if [[ $restore_result == success && $restore_status == 0 ]]; then
  printf 'restore-proof\tpass\tsuccessful\n'
else
  printf 'restore-proof\tblocker\tmissing-or-failed\n'
fi
