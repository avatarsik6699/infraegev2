#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
config="$repo_dir/ops/sshd/20-infraege-root-password.conf"
migration="$repo_dir/ops/migrate-root-password-access.sh"
workflow="$repo_dir/.github/workflows/deploy.yml"
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
production_dir="$test_root/production"
fake_bin="$test_root/bin"
ssh_log="$test_root/ssh.log"
password_error="$test_root/password-error.log"
mkdir -p "$production_dir" "$fake_bin"

for expected in \
  'PermitRootLogin yes' \
  'PasswordAuthentication yes' \
  'KbdInteractiveAuthentication no' \
  'PubkeyAuthentication no' \
  'PermitEmptyPasswords no' \
  'AllowUsers root'; do
  grep -Fxq "$expected" "$config"
done

grep -Fq 'retired_users=(operator deploy ops-reader)' "$migration"
grep -Fq 'CONFIRM_RETIRE_IDENTITIES:-} == operator,deploy,ops-reader' "$migration"
grep -Fq 'for group in infraege-operator deploy ops-reader' "$migration"
! grep -Fq 'for group in infraege-operator operator' "$migration"
grep -Fq 'root-password-access-verified' "$migration"
grep -Fq 'PROD_ROOT_PASSWORD' "$workflow"
! grep -Eq 'PROD_SSH_KEY|PROD_USER' "$workflow"
grep -Fq 'root@$PROD_HOST:/root/' "$workflow"
grep -Fq 'archive="/root/infraege-$DEPLOY_SHA.tar.gz"' "$repo_dir/scripts/deploy-remote.sh"
grep -Fq 'StrictHostKeyChecking=yes' "$repo_dir/scripts/lib/production-ssh.sh"
grep -Fq 'SSH_ASKPASS_REQUIRE=force' "$repo_dir/scripts/lib/production-ssh.sh"
! grep -Eq 'ADMIN_SSH_PUBLIC_KEY|DEPLOY_USER' "$repo_dir/ops/bootstrap-vps.sh"
for service in \
  infraege-backup.service \
  infraege-restore-check.service; do
  grep -Fxq 'User=root' "$repo_dir/ops/systemd/$service"
  grep -Fxq 'Group=root' "$repo_dir/ops/systemd/$service"
done
grep -Fq 'WIREGUARD_IP' "$repo_dir/ops/setup-journal-gateway.sh"
! grep -Fq 'ops-reader' "$repo_dir/ops/setup-journal-gateway.sh"
grep -Fq -- '--webroot --webroot-path /var/www/certbot' \
  "$repo_dir/ops/configure-certificate-renewal.sh"
grep -Fq -- '--dry-run --no-random-sleep-on-renew' \
  "$repo_dir/ops/configure-certificate-renewal.sh"

printf '123456789012\n' >"$production_dir/root-admin-password"
printf 'synthetic-host-key\n' >"$production_dir/known_hosts"
chmod 600 "$production_dir/root-admin-password" "$production_dir/known_hosts"
cat >"$fake_bin/ssh" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >"$SSH_LOG"
EOF
chmod +x "$fake_bin/ssh"

PATH="$fake_bin:$PATH" \
  INFRAEGE_PRODUCTION_DIR="$production_dir" \
  SSH_LOG="$ssh_log" \
  "$repo_dir/scripts/production-root-ssh.sh" 'printf root-access-ok'
grep -Fq 'PreferredAuthentications=password' "$ssh_log"
grep -Fq 'PubkeyAuthentication=no' "$ssh_log"
grep -Fq 'StrictHostKeyChecking=yes' "$ssh_log"
grep -Fq 'root@2.26.8.245 printf root-access-ok' "$ssh_log"

printf '12345678901\n' >"$production_dir/root-admin-password"
if PATH="$fake_bin:$PATH" \
  INFRAEGE_PRODUCTION_DIR="$production_dir" \
  SSH_LOG="$ssh_log" \
  "$repo_dir/scripts/production-root-ssh.sh" 'printf root-access-must-fail' \
  2>"$password_error"; then
  echo '11-character root password unexpectedly passed validation' >&2
  exit 1
fi
grep -Fq 'Root password must be one line of at least 12 characters' "$password_error"

for file in \
  "$repo_dir/ops/migrate-root-password-access.sh" \
  "$repo_dir/ops/setup-journal-gateway.sh" \
  "$repo_dir/scripts/production-root-ssh.sh" \
  "$repo_dir/scripts/ssh-askpass.sh"; do
  bash -n "$file"
done

echo 'temporary root password access test: PASS'
