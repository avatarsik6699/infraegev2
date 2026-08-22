#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'EOF'
Usage: install-sre-kit-local.sh --source-id UUID --token-file PATH

Installs disabled user units and the manual sre-kit-local CLI. It does not start or enable them.
EOF
}

source_id=""
token_file=""
while (($#)); do
  case "$1" in
    --source-id)
      source_id=${2:-}
      shift 2
      ;;
    --token-file)
      token_file=${2:-}
      shift 2
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
config_root=${XDG_CONFIG_HOME:-"$HOME/.config"}
state_root=${XDG_STATE_HOME:-"$HOME/.local/state"}
bin_root=${XDG_BIN_HOME:-"$HOME/.local/bin"}
unit_root=${SRE_KIT_USER_UNIT_DIR:-"$config_root/systemd/user"}
systemctl_bin=${SRE_KIT_SYSTEMCTL:-systemctl}
python_bin=${SRE_KIT_PYTHON:-$(readlink -f "$(command -v python3)")}
config_dir="$config_root/sre-kit/infraegev2-dogfood"
state_dir="$state_root/sre-kit/infraegev2-dogfood"
config_file="$config_dir/traffic-publisher.env"
state_file="$state_dir/traffic-cursor.json"
service_name="infraege-sre-kit-traffic.service"
timer_name="infraege-sre-kit-traffic.timer"

[[ $source_id =~ ^[0-9a-fA-F-]{36}$ ]] || {
  echo "--source-id must be a UUID" >&2
  exit 2
}
[[ -f $token_file ]] || {
  echo "Token file is missing: $token_file" >&2
  exit 2
}
[[ $(stat -c '%u' "$token_file") == "$(id -u)" && $((8#$(stat -c '%a' "$token_file") & 8#077)) == 0 ]] || {
  echo "Token file must be owned by the current user with no group/other access" >&2
  exit 2
}
[[ -x $python_bin ]] || {
  echo "Python executable is missing: $python_bin" >&2
  exit 2
}
"$python_bin" -c 'import sys; raise SystemExit(sys.version_info < (3, 12))' || {
  echo "Python 3.12 or newer is required: $python_bin" >&2
  exit 2
}
for value in "$repo_dir" "$token_file" "$state_file" "$python_bin"; do
  [[ $value =~ ^[A-Za-z0-9_./-]+$ ]] || {
    echo "Install paths may contain only letters, digits, underscore, dot, slash and dash" >&2
    exit 2
  }
done
for dependency in infraege-observability-tunnel.service sre-kit-core.service sre-kit-web.service; do
  [[ -f $unit_root/$dependency ]] || {
    echo "Required user unit is missing: $unit_root/$dependency" >&2
    exit 2
  }
done

install -d -m 700 "$config_dir" "$state_dir"
install -d -m 755 "$bin_root" "$unit_root"
temporary_config=$(mktemp "$config_dir/.traffic-publisher.XXXXXX")
temporary_service=$(mktemp "$unit_root/.infraege-sre-kit-traffic.XXXXXX")
trap 'rm -f -- "$temporary_config" "$temporary_service"' EXIT
printf '%s\n' \
  "INFRAEGE_SRE_KIT_SOURCE_ID=$source_id" \
  "INFRAEGE_SRE_KIT_TOKEN_FILE=$token_file" \
  "INFRAEGE_TRAFFIC_STATE_FILE=$state_file" \
  >"$temporary_config"
chmod 600 "$temporary_config"
sed \
  -e "s|@REPO_DIR@|$repo_dir|g" \
  -e "s|@CONFIG_FILE@|$config_file|g" \
  -e "s|@STATE_DIR@|$state_dir|g" \
  -e "s|@PYTHON_BIN@|$python_bin|g" \
  "$repo_dir/ops/systemd/$service_name.in" >"$temporary_service"
install -m 600 "$temporary_config" "$config_file"
install -m 644 "$temporary_service" "$unit_root/$service_name"
install -m 644 "$repo_dir/ops/systemd/$timer_name" "$unit_root/$timer_name"
install -m 755 "$repo_dir/ops/observability/sre-kit-local.sh" "$bin_root/sre-kit-local"
"$systemctl_bin" --user daemon-reload
"$systemctl_bin" --user disable "$timer_name" >/dev/null 2>&1 || true
echo "Installed manual sre-kit lifecycle with traffic publishing. Run: sre-kit-local start"
