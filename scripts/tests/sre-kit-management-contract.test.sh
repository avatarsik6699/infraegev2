#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
for script in "$repo_dir"/ops/management/*.sh "$repo_dir"/scripts/management-*.sh "$repo_dir"/scripts/lib/management-ssh.sh; do
  bash -n "$script"
done
python3 "$repo_dir/scripts/tests/sre_kit_management_test.py"

names=$(jq -r '.sources[].name' "$repo_dir/ops/observability/sre-kit-sources.example.json" | sort)
expected=$(printf '%s\n' 'Application journal' 'Container telemetry' 'Host resources' 'Nginx traffic' 'Product analytics' 'Public availability' 'Security bans')
[[ $names == "$expected" ]]

temporary=$(mktemp -d)
trap 'rm -rf -- "$temporary"' EXIT
fake_bin=$temporary/bin
mkdir "$fake_bin"

production_test_dir=$temporary/production
mkdir "$production_test_dir"
printf '123456789012\n' >"$production_test_dir/root-admin-password"
printf 'synthetic-host-key\n' >"$production_test_dir/known_hosts"
chmod 600 "$production_test_dir/root-admin-password" "$production_test_dir/known_hosts"
# shellcheck source=../lib/production-ssh.sh
source "$repo_dir/scripts/lib/production-ssh.sh"
# shellcheck source=../lib/management-ssh.sh
source "$repo_dir/scripts/lib/management-ssh.sh"
INFRAEGE_PRODUCTION_DIR="$production_test_dir"
INFRAEGE_SSH_PASSWORD=123456789012
production_ssh_init
[[ $(realpath "$INFRAEGE_SSH_ASKPASS") == "$repo_dir/scripts/ssh-askpass.sh" ]]
unset INFRAEGE_SSH_PASSWORD

cat > "$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
if [[ $1 == ps ]]; then printf '%s\n' 'firecrawl-api synthetic-image' 'searxng synthetic-image'; fi
EOF
cat > "$fake_bin/ufw" <<EOF
#!/usr/bin/env bash
printf '%s\\n' "\$*" >> '$temporary/ufw.log'
EOF
cat > "$fake_bin/ss" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' 'LISTEN 0 128 0.0.0.0:2222 0.0.0.0:* users:(("sshd",pid=1,fd=3))'
EOF
chmod +x "$fake_bin/docker" "$fake_bin/ufw" "$fake_bin/ss"

cat >"$fake_bin/ssh" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$SSH_ASKPASS" >>'$temporary/askpass.log'
EOF
cat >"$fake_bin/scp" <<EOF
#!/usr/bin/env bash
printf '%s\n' "\$SSH_ASKPASS" >>'$temporary/askpass.log'
EOF
chmod +x "$fake_bin/ssh" "$fake_bin/scp"
MANAGEMENT_SSH_PORT=2222
MANAGEMENT_SSH_USER=root
MANAGEMENT_SSH_HOST=management.invalid
MANAGEMENT_KNOWN_HOSTS=$production_test_dir/known_hosts
MANAGEMENT_SSH_ASKPASS=$repo_dir/scripts/management-ssh-askpass.sh
MANAGEMENT_SSH_PASSWORD=management-synthetic
PATH="$fake_bin:$PATH" management_ssh true
PATH="$fake_bin:$PATH" production_scp synthetic "root@$INFRAEGE_PROD_HOST:/tmp/synthetic"
PATH="$fake_bin:$PATH" management_scp synthetic "root@$MANAGEMENT_SSH_HOST:/tmp/synthetic"
mapfile -t askpass_helpers <"$temporary/askpass.log"
[[ $(realpath "${askpass_helpers[0]}") == "$repo_dir/scripts/management-ssh-askpass.sh" ]]
[[ $(realpath "${askpass_helpers[1]}") == "$repo_dir/scripts/ssh-askpass.sh" ]]
[[ $(realpath "${askpass_helpers[2]}") == "$repo_dir/scripts/management-ssh-askpass.sh" ]]

PATH="$fake_bin:$PATH" MANAGEMENT_SSH_PORT=2222 \
  bash "$repo_dir/ops/management/bootstrap-host.sh" >/dev/null
grep -Fq -- '--force enable' "$temporary/ufw.log"
if rg -n 'compose.*[[:space:]](down|stop)|docker[[:space:]]+(rm|stop|kill)' "$repo_dir/ops/management/bootstrap-host.sh"; then
  echo 'management bootstrap can mutate unrelated containers' >&2
  exit 1
fi

config=$temporary/wg0.conf
cat > "$config" <<'EOF'
[Interface]
Address = 10.77.0.1/24

[Peer]
PublicKey = AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
AllowedIPs = 10.77.0.2/32
EOF
peer=BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=
fake_wg=$temporary/wg
cat > "$fake_wg" <<EOF
#!/usr/bin/env bash
if [[ \$1 == show ]]; then printf '%s\\t10.77.0.3/32\\n' '$peer'; fi
EOF
chmod +x "$fake_wg"
for _ in 1 2; do
  printf '%s\n' "$peer" | WG_CONFIG=$config WG_COMMAND=$fake_wg \
    bash "$repo_dir/ops/management/wireguard-server-peer.sh" >/dev/null
done
[[ $(grep -Fc '# BEGIN infraegev2 management peer' "$config") == 1 ]]
grep -Fq 'AllowedIPs = 10.77.0.2/32' "$config"
grep -Fq 'AllowedIPs = 10.77.0.3/32' "$config"
grep -Fq 'MTU = 1280' "$repo_dir/ops/management/wireguard-client.sh"
grep -Fq 'systemctl restart wg-quick@wg0' "$repo_dir/ops/management/wireguard-client.sh"
grep -Fq 'http://10.77.0.1:8090/api/health' "$repo_dir/ops/management/wireguard-client.sh"
! grep -Eq 'http://10\.77\.0\.1:8090/[[:space:]]' "$repo_dir/ops/management/wireguard-client.sh"
grep -Fq 'management_scp "$archive" "$bootstrap" "$deploy_script"' \
  "$repo_dir/scripts/management-sre-kit.sh"
grep -Fq 'bash /root/deploy-remote.sh' "$repo_dir/scripts/management-sre-kit.sh"
grep -Fq 'readlink -f /opt/sre-kit/current' "$repo_dir/scripts/management-sre-kit.sh"
! grep -Fq 'bash -s" < "$deploy_script"' "$repo_dir/scripts/management-sre-kit.sh"
grep -Fq 'beszel-user-email' "$repo_dir/scripts/management-sre-kit.sh"
grep -Fq 'beszel-user-password' "$repo_dir/scripts/management-sre-kit.sh"
! grep -Fq 'INFRAEGE_BESZEL_EMAIL=$INFRAEGE_BESZEL_EMAIL' \
  "$repo_dir/scripts/management-sre-kit.sh"
! grep -Fq 'INFRAEGE_BESZEL_PASSWORD=$INFRAEGE_BESZEL_PASSWORD' \
  "$repo_dir/scripts/management-sre-kit.sh"

if rg -n 'set -x|StrictHostKeyChecking=no|InsecureIgnoreHostKey|image:.*:latest' \
  "$repo_dir/ops/management" "$repo_dir/scripts/management-sre-kit.sh"; then
  echo 'management contract contains an unsafe transport or logging mode' >&2
  exit 1
fi
echo 'sre-kit management contract: PASS'
