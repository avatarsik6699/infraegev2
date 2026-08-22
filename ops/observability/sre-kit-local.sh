#!/usr/bin/env bash
set -Eeuo pipefail

tunnel_unit="infraege-observability-tunnel.service"
core_unit="sre-kit-core.service"
traffic_service="infraege-sre-kit-traffic.service"
traffic_timer="infraege-sre-kit-traffic.timer"
web_unit="sre-kit-web.service"
config_root=${XDG_CONFIG_HOME:-"$HOME/.config"}
password_file="$config_root/sre-kit/infraegev2-dogfood/admin-password"
dashboard_url="http://localhost:3000"

start_services() {
  echo "Starting SSH tunnel..."
  systemctl --user start "$tunnel_unit"
  echo "Starting sre-kit core..."
  systemctl --user start "$core_unit"
  echo "Starting traffic publisher..."
  systemctl --user start "$traffic_service"
  systemctl --user start "$traffic_timer"
  echo "Starting dashboard..."
  systemctl --user start "$web_unit"
  echo "Ready: $dashboard_url"
}

stop_services() {
  echo "Stopping traffic publisher..."
  systemctl --user stop "$traffic_timer"
  systemctl --user stop "$traffic_service"
  echo "Stopping dashboard..."
  systemctl --user stop "$web_unit"
  echo "Stopping sre-kit core..."
  systemctl --user stop "$core_unit"
  echo "Stopping SSH tunnel..."
  systemctl --user stop "$tunnel_unit"
  echo "Stopped. VPS services were not changed."
}

show_status() {
  local unit state
  for unit in "$tunnel_unit" "$core_unit" "$traffic_timer" "$web_unit"; do
    state=$(systemctl --user is-active "$unit" 2>/dev/null || true)
    printf '%-46s %s\n' "$unit" "$state"
  done
  printf '%-46s %s\n' "$traffic_service last result" \
    "$(systemctl --user show "$traffic_service" --property=Result --value 2>/dev/null || true)"
}

show_help() {
  cat <<'EOF'
Usage: sre-kit-local <command>

Commands:
  start      Start the tunnel, core, traffic publisher, and dashboard
  stop       Stop the traffic publisher, dashboard, core, and tunnel
  restart    Stop and start everything in the correct order
  status     Show service state and the latest publisher result
  open       Open http://localhost:3000 in the browser
  password   Print the dashboard password
  logs       Show the latest local service and publisher logs
  help       Show this help
EOF
}

case "${1:-help}" in
  start)
    start_services
    ;;
  stop)
    stop_services
    ;;
  restart)
    stop_services
    start_services
    ;;
  status)
    show_status
    ;;
  open)
    xdg-open "$dashboard_url"
    ;;
  password)
    cat "$password_file"
    ;;
  logs)
    journalctl --user \
      -u "$tunnel_unit" \
      -u "$core_unit" \
      -u "$traffic_service" \
      -u "$traffic_timer" \
      -u "$web_unit" \
      -n 100 --no-pager
    ;;
  help | -h | --help)
    show_help
    ;;
  *)
    echo "Unknown command: $1" >&2
    show_help >&2
    exit 2
    ;;
esac

