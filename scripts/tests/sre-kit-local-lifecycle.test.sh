#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
config_root="$test_root/config"
state_root="$test_root/state"
bin_root="$test_root/bin"
unit_root="$config_root/systemd/user"
fake_bin="$test_root/fake-bin"
systemctl_log="$test_root/systemctl.log"
source_id="391530b3-8484-48af-a0eb-461846bfbc92"
token_file="$config_root/token"

mkdir -p "$unit_root" "$fake_bin" "$bin_root"
touch \
  "$unit_root/infraege-observability-tunnel.service" \
  "$unit_root/sre-kit-core.service" \
  "$unit_root/sre-kit-web.service"
printf '%s\n' synthetic-token >"$token_file"
chmod 600 "$token_file"

cat >"$fake_bin/systemctl" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$SYSTEMCTL_LOG"
if [[ $* == *' is-active '* ]]; then
  echo active
elif [[ $* == *' show '* ]]; then
  echo success
fi
EOF
chmod +x "$fake_bin/systemctl"

XDG_CONFIG_HOME="$config_root" \
XDG_STATE_HOME="$state_root" \
XDG_BIN_HOME="$bin_root" \
SRE_KIT_USER_UNIT_DIR="$unit_root" \
SRE_KIT_SYSTEMCTL="$fake_bin/systemctl" \
SYSTEMCTL_LOG="$systemctl_log" \
  "$repo_dir/ops/observability/install-sre-kit-local.sh" \
  --source-id "$source_id" \
  --token-file "$token_file" >/dev/null

test -x "$bin_root/sre-kit-local"
test -f "$unit_root/infraege-sre-kit-traffic.service"
test -f "$unit_root/infraege-sre-kit-traffic.timer"
[[ $(stat -c '%a' "$config_root/sre-kit/infraegev2-dogfood/traffic-publisher.env") == 600 ]]
grep -Fq "INFRAEGE_SRE_KIT_SOURCE_ID=$source_id" \
  "$config_root/sre-kit/infraegev2-dogfood/traffic-publisher.env"
grep -Fq "ReadWritePaths=$state_root/sre-kit/infraegev2-dogfood" \
  "$unit_root/infraege-sre-kit-traffic.service"
grep -Fq "ExecStart=$(readlink -f "$(command -v python3)") $repo_dir/ops/observability/push-nginx-traffic.py" \
  "$unit_root/infraege-sre-kit-traffic.service"
grep -Fq -- '--user disable infraege-sre-kit-traffic.timer' "$systemctl_log"
! grep -Fq -- '--user enable' "$systemctl_log"

: >"$systemctl_log"
HOME="$test_root" XDG_CONFIG_HOME="$config_root" PATH="$fake_bin:$PATH" \
SYSTEMCTL_LOG="$systemctl_log" "$bin_root/sre-kit-local" start >/dev/null
mapfile -t start_calls <"$systemctl_log"
[[ ${start_calls[0]} == "--user start infraege-observability-tunnel.service" ]]
[[ ${start_calls[1]} == "--user start sre-kit-core.service" ]]
[[ ${start_calls[2]} == "--user start infraege-sre-kit-traffic.service" ]]
[[ ${start_calls[3]} == "--user start infraege-sre-kit-traffic.timer" ]]
[[ ${start_calls[4]} == "--user start sre-kit-web.service" ]]

: >"$systemctl_log"
HOME="$test_root" XDG_CONFIG_HOME="$config_root" PATH="$fake_bin:$PATH" \
SYSTEMCTL_LOG="$systemctl_log" "$bin_root/sre-kit-local" stop >/dev/null
mapfile -t stop_calls <"$systemctl_log"
[[ ${stop_calls[0]} == "--user stop infraege-sre-kit-traffic.timer" ]]
[[ ${stop_calls[1]} == "--user stop infraege-sre-kit-traffic.service" ]]
[[ ${stop_calls[2]} == "--user stop sre-kit-web.service" ]]
[[ ${stop_calls[3]} == "--user stop sre-kit-core.service" ]]
[[ ${stop_calls[4]} == "--user stop infraege-observability-tunnel.service" ]]

echo 'sre-kit local lifecycle test: PASS'
