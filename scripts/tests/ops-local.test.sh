#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
script="$repo_dir/scripts/ops-local.sh"
test_root=$(mktemp -d)
fake_bin="$test_root/bin"
fake_config="$test_root/config"
fake_state="$test_root/state"
fake_wg_up="$test_root/wireguard-up"

cleanup() {
  if [[ -f "$fake_state/dashboard.pid" ]]; then
    pid=$(<"$fake_state/dashboard.pid")
    [[ "$pid" =~ ^[0-9]+$ ]] && kill "$pid" 2>/dev/null || true
  fi
  rm -rf -- "$test_root"
}
trap cleanup EXIT

mkdir -p -- "$fake_bin" "$fake_config/infraege/production" "$fake_config/infraege/ops" "$fake_state"

write_stub() {
  local name=$1
  shift
  printf '#!/usr/bin/env bash\nset -Eeuo pipefail\n%s\n' "$*" >"$fake_bin/$name"
  chmod +x "$fake_bin/$name"
}

write_stub sudo 'exec "$@"'
write_stub ping 'exit 1'
write_stub curl 'exit 0'
write_stub pnpm 'exit 0'
write_stub node 'while :; do sleep 60; done'
write_stub wg 'printf "peer-key\\t%s\\n" "$(date +%s)"'
write_stub wg-quick '
case "$1" in
  up) touch "$FAKE_WG_UP" ;;
  down) rm -f -- "$FAKE_WG_UP" ;;
  *) exit 2 ;;
esac'
write_stub ip '
if [[ "$1 $2 $3" == "link show dev" ]]; then
  [[ -f "$FAKE_WG_UP" ]]
elif [[ "$1 $2 $3" == "route get 10.77.0.1" ]]; then
  [[ -f "$FAKE_WG_UP" ]] || exit 1
  echo "10.77.0.1 dev infraege-wsl src 10.77.0.2"
else
  exit 2
fi'

cat >"$fake_config/infraege/production/infraege-wsl.conf" <<'EOF'
[Interface]
Address = 10.77.0.2/24
PrivateKey = test-only
[Peer]
PublicKey = test-only
AllowedIPs = 10.77.0.0/24
EOF

cat >"$fake_config/infraege/ops/projects.json" <<'EOF'
{"version":1,"projects":[{"id":"infraege"}]}
EOF

cat >"$fake_config/infraege/ops/ops.env" <<'EOF'
INFRAEGE_BESZEL_EMAIL=test@example.invalid
INFRAEGE_BESZEL_PASSWORD=test-only
INFRAEGE_UMAMI_USERNAME=test-only
INFRAEGE_UMAMI_PASSWORD=test-only
INFRAEGE_OPS_SSH_KEY=/test/key
INFRAEGE_OPS_SSH_KNOWN_HOSTS=/test/known_hosts
EOF

chmod 600 \
  "$fake_config/infraege/production/infraege-wsl.conf" \
  "$fake_config/infraege/ops/projects.json" \
  "$fake_config/infraege/ops/ops.env"

export PATH="$fake_bin:$PATH"
export FAKE_WG_UP="$fake_wg_up"
export XDG_CONFIG_HOME="$fake_config"
export INFRAEGE_OPS_STATE_DIR="$fake_state"

output=$("$script" --help)
grep -q 'tunnel-up' <<<"$output"
output=$("$script" tunnel-up)
grep -q 'WireGuard is ready' <<<"$output"
[[ -f "$fake_wg_up" ]]
[[ -f "$fake_state/wireguard-owned" ]]

output=$("$script" up)
grep -q 'Ops dashboard is ready' <<<"$output"
[[ -f "$fake_state/dashboard.pid" ]]
kill -0 "$(<"$fake_state/dashboard.pid")"

status=$("$script" status)
grep -q 'dashboard: running' <<<"$status"
grep -q 'wireguard: up' <<<"$status"

output=$("$script" down)
grep -q 'Ops dashboard stopped' <<<"$output"
[[ ! -f "$fake_wg_up" ]]
[[ ! -f "$fake_state/dashboard.pid" ]]
[[ ! -f "$fake_state/wireguard-owned" ]]

echo 'ops-local lifecycle test: PASS'
