#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
config_root=${XDG_CONFIG_HOME:-"$HOME/.config"}
state_root=${XDG_STATE_HOME:-"$HOME/.local/state"}
production_dir=${INFRAEGE_PRODUCTION_DIR:-"$config_root/infraege/production"}
ops_dir=${INFRAEGE_OPS_DIR:-"$config_root/infraege/ops"}
state_dir=${INFRAEGE_OPS_STATE_DIR:-"$state_root/infraege/ops"}
wg_config=${INFRAEGE_OPS_WG_CONFIG:-"$production_dir/infraege-wsl.conf"}
ops_config=${OPS_CONFIG_PATH:-"$ops_dir/projects.json"}
ops_env=${INFRAEGE_OPS_ENV_FILE:-"$ops_dir/ops.env"}
private_probe_url=${INFRAEGE_OPS_PRIVATE_PROBE_URL:-"http://10.77.0.1:8090/"}
ops_port=${OPS_PORT:-8787}
pid_file="$state_dir/dashboard.pid"
log_file="$state_dir/dashboard.log"
wireguard_marker="$state_dir/wireguard-owned"

die() {
  echo "ops-local: $*" >&2
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

ensure_wireguard() {
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
    printf '%s\n' "$wg_config" >"$wireguard_marker"
    started=1
  fi

  if ! route_uses_interface; then
    (( started == 0 )) || stop_owned_wireguard
    die "10.77.0.1 is not routed through $(interface_name)"
  fi
  if (( started == 1 )) && ! wait_for_wireguard; then
    (( started == 0 )) || stop_owned_wireguard
    die "WireGuard has no recent handshake; check the VPS endpoint and Amnezia routing"
  fi
  if ! curl --silent --show-error --output /dev/null --connect-timeout 3 --max-time 5 \
    "$private_probe_url"; then
    (( started == 0 )) || stop_owned_wireguard
    die "private ops endpoint is unreachable: $private_probe_url"
  fi
  echo "WireGuard is ready: $(interface_name) -> 10.77.0.0/24"
}

stop_owned_wireguard() {
  [[ -f "$wireguard_marker" ]] || return 0
  if interface_is_up; then
    echo "Stopping WireGuard interface $(interface_name) (sudo may prompt)..."
    run_as_root wg-quick down "$wg_config"
  fi
  rm -f -- "$wireguard_marker"
}

dashboard_pid() {
  [[ -f "$pid_file" ]] || return 1
  local pid
  pid=$(<"$pid_file")
  [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null || return 1
  printf '%s\n' "$pid"
}

load_ops_environment() {
  assert_private_file "$ops_config" "Ops project config"
  assert_private_file "$ops_env" "Ops credentials file"
  if grep -Eq 'replace-with-|CHANGE_ME|TODO' "$ops_config"; then
    die "Ops project config still contains placeholder values: $ops_config"
  fi
  if grep -Eq 'REPLACE_WITH_|CHANGE_ME|TODO' "$ops_env"; then
    die "Ops credentials file still contains placeholder values: $ops_env"
  fi
  set -a
  # shellcheck disable=SC1090 -- operator-owned, mode-600 environment file outside the repository.
  source "$ops_env"
  set +a
  export OPS_CONFIG_PATH="$ops_config" OPS_PORT="$ops_port"
}

init_local_inputs() {
  local website_id_file="$production_dir/umami_website_id"
  local website_id=''
  need_command install
  install -d -m 700 "$ops_dir"

  if [[ ! -f "$ops_config" ]]; then
    install -m 600 "$repo_dir/apps/ops/config/projects.example.json" "$ops_config"
    if [[ -f "$website_id_file" ]]; then
      website_id=$(tr -d '[:space:]' <"$website_id_file")
      if [[ "$website_id" =~ ^[0-9a-fA-F-]{36}$ ]]; then
        sed -i "s/replace-with-website-id/$website_id/" "$ops_config"
      fi
    fi
    echo "Created $ops_config"
  else
    assert_private_file "$ops_config" "Ops project config"
    echo "Preserved existing $ops_config"
  fi

  if [[ ! -f "$ops_env" ]]; then
    umask 077
    {
      echo 'INFRAEGE_BESZEL_EMAIL=REPLACE_WITH_READ_ONLY_EMAIL'
      echo 'INFRAEGE_BESZEL_PASSWORD=REPLACE_WITH_READ_ONLY_PASSWORD'
      echo 'INFRAEGE_UMAMI_USERNAME=REPLACE_WITH_READ_ONLY_USERNAME'
      echo 'INFRAEGE_UMAMI_PASSWORD=REPLACE_WITH_READ_ONLY_PASSWORD'
      printf 'INFRAEGE_OPS_SSH_KEY=%q\n' "$production_dir/ops_reader_ed25519"
      printf 'INFRAEGE_OPS_SSH_KNOWN_HOSTS=%q\n' "$production_dir/known_hosts"
    } >"$ops_env"
    echo "Created $ops_env"
  else
    assert_private_file "$ops_env" "Ops credentials file"
    echo "Preserved existing $ops_env"
  fi

  echo "Next: replace the Beszel system ID and credential placeholders, then run make ops-up."
}

wait_for_dashboard() {
  local attempt
  for attempt in {1..20}; do
    if curl --fail --silent --show-error --max-time 2 \
      "http://127.0.0.1:$ops_port/api/projects" >/dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}

start_dashboard() {
  local pid
  if pid=$(dashboard_pid); then
    echo "Ops dashboard is already running (PID $pid): http://127.0.0.1:$ops_port"
    return 0
  fi
  rm -f -- "$pid_file"
  load_ops_environment
  need_command node
  need_command pnpm
  need_command curl
  mkdir -p -- "$state_dir"

  echo "Building ops dashboard..."
  (cd "$repo_dir" && pnpm --filter ops build)
  echo "Starting loopback-only ops dashboard..."
  (
    cd "$repo_dir/apps/ops"
    nohup node dist/server/main.js >>"$log_file" 2>&1 &
    printf '%s\n' "$!" >"$pid_file"
  )

  if ! wait_for_dashboard; then
    stop_dashboard || true
    die "dashboard did not become ready; inspect $log_file"
  fi
  echo "Ops dashboard is ready: http://127.0.0.1:$ops_port"
  echo "Logs: $log_file"
}

stop_dashboard() {
  local pid attempt
  if ! pid=$(dashboard_pid); then
    rm -f -- "$pid_file"
    echo "Ops dashboard is not running."
    return 0
  fi
  kill "$pid"
  for attempt in {1..20}; do
    kill -0 "$pid" 2>/dev/null || break
    sleep 0.25
  done
  if kill -0 "$pid" 2>/dev/null; then
    kill -KILL "$pid"
  fi
  rm -f -- "$pid_file"
  echo "Ops dashboard stopped."
}

show_status() {
  local pid handshake=unknown
  if pid=$(dashboard_pid); then
    echo "dashboard: running (PID $pid, http://127.0.0.1:$ops_port)"
  else
    echo "dashboard: stopped"
  fi
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
  echo "state: $state_dir"
}

show_logs() {
  [[ -f "$log_file" ]] || die "dashboard log does not exist yet: $log_file"
  tail -n 100 -f "$log_file"
}

show_help() {
  cat <<'EOF'
Usage: scripts/ops-local.sh ACTION

Actions:
  init         Create protected local config templates without overwriting existing files
  up           Start/reuse WireGuard, build ops, and start the dashboard
  down         Stop the dashboard and a WireGuard interface started by this script
  status       Show dashboard, route, and handshake state without prompting for sudo
  logs         Follow the dashboard log
  tunnel-up    Start and verify only the WireGuard tunnel (first-time onboarding)
  tunnel-down  Stop a WireGuard tunnel started by this script
EOF
}

main() {
  case ${1:-help} in
    init) init_local_inputs ;;
    up) ensure_wireguard; start_dashboard ;;
    down) stop_dashboard; stop_owned_wireguard ;;
    status) show_status ;;
    logs) show_logs ;;
    tunnel-up) ensure_wireguard ;;
    tunnel-down) stop_owned_wireguard ;;
    help|-h|--help) show_help ;;
    *) show_help >&2; die "unknown action: $1" ;;
  esac
}

main "$@"
