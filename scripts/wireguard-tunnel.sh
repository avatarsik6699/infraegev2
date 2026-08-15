#!/usr/bin/env bash
# Standalone WireGuard tunnel lifecycle for reaching the private 10.77.0.0/24 VPS network
# (Beszel, Umami, journald gatewayd, private SSH) from a local dev machine — e.g. for sre-kit's
# adapters, run locally, to reach those endpoints the same way apps/ops used to (docs/changes/
# archive/19-retire-ops-dashboard.md retired apps/ops itself; this script only owns the tunnel).
set -Eeuo pipefail

config_root=${XDG_CONFIG_HOME:-"$HOME/.config"}
state_root=${XDG_STATE_HOME:-"$HOME/.local/state"}
production_dir=${INFRAEGE_PRODUCTION_DIR:-"$config_root/infraege/production"}
state_dir=${INFRAEGE_WG_STATE_DIR:-"$state_root/infraege/wireguard"}
wg_config=${INFRAEGE_WG_CONFIG:-"$production_dir/infraege-wsl.conf"}
private_probe_url=${INFRAEGE_WG_PRIVATE_PROBE_URL:-"http://10.77.0.1:8090/"}
owned_marker="$state_dir/wireguard-owned"

die() {
  echo "wireguard-tunnel: $*" >&2
  exit 1
}

need_command() {
  command -v "$1" >/dev/null 2>&1 || die "required command is missing: $1"
}

assert_private_file() {
  local path=$1
  local label=$2
  [[ -f "$path" ]] || die "$label is missing: $path"
  [[ $(stat -c '%u' "$path") == "$(id -u)" ]] || die "$label must be owned by the current user: $path"
  [[ $(stat -c '%a' "$path") == "600" ]] || die "$label must have mode 600: chmod 600 '$path'"
}

interface_name() {
  basename -- "$wg_config" .conf
}

run_as_root() {
  if [[ ${EUID:-$(id -u)} == 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

interface_is_up() {
  ip link show dev "$(interface_name)" >/dev/null 2>&1
}

route_uses_interface() {
  ip route get 10.77.0.1 2>/dev/null | grep -Eq "(^|[[:space:]])dev[[:space:]]+$(interface_name)([[:space:]]|$)"
}

latest_handshake() {
  run_as_root wg show "$(interface_name)" latest-handshakes 2>/dev/null \
    | awk 'BEGIN { newest = 0 } { if ($2 > newest) newest = $2 } END { print newest }'
}

wait_for_wireguard() {
  local attempt handshake now
  ping -c 1 -W 2 10.77.0.1 >/dev/null 2>&1 || true
  for attempt in {1..10}; do
    handshake=$(latest_handshake)
    now=$(date +%s)
    if [[ "$handshake" =~ ^[0-9]+$ ]] && (( handshake > 0 && now - handshake <= 180 )); then
      return 0
    fi
    sleep 1
  done
  return 1
}

tunnel_up() {
  local started=0
  need_command ip
  need_command ping
  need_command sudo
  need_command wg
  need_command wg-quick
  need_command curl
  assert_private_file "$wg_config" "WireGuard config"
  mkdir -p -- "$state_dir"

  if ! interface_is_up; then
    echo "Starting WireGuard interface $(interface_name) (sudo may prompt)..."
    run_as_root wg-quick up "$wg_config"
    printf '%s\n' "$wg_config" >"$owned_marker"
    started=1
  fi

  if ! route_uses_interface; then
    (( started == 0 )) || tunnel_down
    die "10.77.0.1 is not routed through $(interface_name)"
  fi
  if (( started == 1 )) && ! wait_for_wireguard; then
    (( started == 0 )) || tunnel_down
    die "WireGuard has no recent handshake; check the VPS endpoint and local routing"
  fi
  if ! curl --silent --show-error --output /dev/null --connect-timeout 3 --max-time 5 \
    "$private_probe_url"; then
    (( started == 0 )) || tunnel_down
    die "private VPS endpoint is unreachable: $private_probe_url"
  fi
  echo "WireGuard is ready: $(interface_name) -> 10.77.0.0/24"
}

tunnel_down() {
  [[ -f "$owned_marker" ]] || { echo "Tunnel was not started by this script; leaving it as-is."; return 0; }
  if interface_is_up; then
    echo "Stopping WireGuard interface $(interface_name) (sudo may prompt)..."
    run_as_root wg-quick down "$wg_config"
  fi
  rm -f -- "$owned_marker"
}

tunnel_status() {
  local handshake=unknown
  if interface_is_up; then
    if route_uses_interface; then
      echo "wireguard: up ($(interface_name), route ok)"
    else
      echo "wireguard: up ($(interface_name), route missing)"
    fi
    handshake=$(sudo -n wg show "$(interface_name)" latest-handshakes 2>/dev/null \
      | awk 'BEGIN { newest = 0 } { if ($2 > newest) newest = $2 } END { print newest }' || true)
    if [[ "$handshake" =~ ^[0-9]+$ ]] && (( handshake > 0 )); then
      echo "wireguard handshake: $(date --date="@$handshake" --iso-8601=seconds)"
    else
      echo "wireguard handshake: unavailable without a cached sudo credential"
    fi
  else
    echo "wireguard: down ($(interface_name))"
  fi
}

show_help() {
  cat <<'EOF'
Usage: scripts/wireguard-tunnel.sh ACTION

Actions:
  up       Start and verify the WireGuard tunnel to the private 10.77.0.0/24 VPS network
  down     Stop a tunnel started by this script
  status   Show interface, route, and handshake state without prompting for sudo
EOF
}

main() {
  case ${1:-help} in
    up) tunnel_up ;;
    down) tunnel_down ;;
    status) tunnel_status ;;
    help|-h|--help) show_help ;;
    *) show_help >&2; die "unknown action: $1" ;;
  esac
}

main "$@"
