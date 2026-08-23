#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
sre_kit_repo=${SRE_KIT_REPO:-"$(dirname "$repo_dir")/sre-kit"}
production_dir=${INFRAEGE_PRODUCTION_DIR:-${XDG_CONFIG_HOME:-${HOME:?}/.config}/infraege/production}
ops_dir=${INFRAEGE_OPS_DIR:-${XDG_CONFIG_HOME:-${HOME:?}/.config}/infraege/ops}

# shellcheck source=lib/management-ssh.sh
source "$repo_dir/scripts/lib/management-ssh.sh"
# shellcheck source=lib/production-ssh.sh
source "$repo_dir/scripts/lib/production-ssh.sh"

die() { echo "management-sre-kit: $*" >&2; exit 1; }
require_release() { [[ ${1:-} =~ ^[0-9a-f]{40}$ ]] || die 'release must be an exact lowercase 40-character SHA'; }
require_private() {
  [[ -f $1 && $(stat -c '%a' "$1") == 600 && $(stat -c '%u' "$1") == "$(id -u)" ]] ||
    die "$2 must be a current-user mode-600 file: $1"
}
require_one_line() { [[ -n $1 && $1 != *$'\n'* && $1 != *$'\r'* ]] || die "$2 must be one non-empty line"; }

bootstrap_host() {
  management_ssh_init
  management_scp "$repo_dir/ops/management/bootstrap-host.sh" \
    "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST:/root/infraege-management-bootstrap.sh"
  management_ssh "MANAGEMENT_SSH_PORT=$MANAGEMENT_SSH_PORT bash /root/infraege-management-bootstrap.sh"
}

provision_wireguard() {
  local server_public client_public
  management_ssh_init
  production_ssh_init
  management_scp "$repo_dir/ops/management/wireguard-client.sh" \
    "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST:/root/infraege-wireguard-client.sh"
  production_scp "$repo_dir/ops/management/wireguard-server-peer.sh" \
    "root@$INFRAEGE_PROD_HOST:/root/infraege-wireguard-server-peer.sh"
  server_public=$(production_ssh 'wg show wg0 public-key')
  require_one_line "$server_public" 'WireGuard server public key'
  client_public=$(printf '%s\n%s\n' "$server_public" '2.26.8.245:51820' |
    management_ssh 'bash /root/infraege-wireguard-client.sh prepare' | tail -n 1)
  require_one_line "$client_public" 'WireGuard management public key'
  printf '%s\n' "$client_public" |
    production_ssh 'bash /root/infraege-wireguard-server-peer.sh'
  management_ssh 'bash /root/infraege-wireguard-client.sh activate'
}

install_release() {
  local release=$1 temporary archive bootstrap deploy_script
  require_release "$release"
  management_ssh_init
  [[ -d $sre_kit_repo/.git ]] || die "sre-kit repository is missing: $sre_kit_repo"
  git -C "$sre_kit_repo" cat-file -e "$release^{commit}"
  git -C "$sre_kit_repo" merge-base --is-ancestor "$release" main ||
    die 'requested sre-kit release is not on local main'
  temporary=$(mktemp -d)
  trap 'rm -rf -- "$temporary"' RETURN
  archive=$temporary/sre-kit-$release.tar.gz
  bootstrap=$temporary/bootstrap-remote.sh
  deploy_script=$temporary/deploy-remote.sh
  git -C "$sre_kit_repo" archive --format=tar.gz --output="$archive" "$release" deploy scripts
  git -C "$sre_kit_repo" show "$release:scripts/bootstrap-remote.sh" > "$bootstrap"
  git -C "$sre_kit_repo" show "$release:scripts/deploy-remote.sh" > "$deploy_script"
  management_scp "$archive" "$bootstrap" "$deploy_script" \
    "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST:/root/"
  printf '%s\n%s\n' 'sre.infraege.ru' "$MANAGEMENT_ADMIN_PASSWORD" |
    management_ssh 'bash /root/bootstrap-remote.sh'
  management_ssh "DEPLOY_SHA=$release bash /root/deploy-remote.sh"
  management_ssh "test \"\$(readlink -f /opt/sre-kit/current)\" = /opt/sre-kit/releases/$release && test \"\$(curl -fsS http://127.0.0.1:18080/health/ready | jq -r .release)\" = $release"
  rm -rf -- "$temporary"
  trap - RETURN
}

build_source_env() {
  local output=$1 root_password beszel_email beszel_password ops_env projects_json target_fingerprint
  root_password=$production_dir/root-admin-password
  beszel_email=$production_dir/beszel-user-email
  beszel_password=$production_dir/beszel-user-password
  ops_env=$ops_dir/ops.env
  projects_json=$ops_dir/projects.json
  require_private "$root_password" 'application root password'
  require_private "$beszel_email" 'Beszel user email'
  require_private "$beszel_password" 'Beszel user password'
  require_private "$ops_env" 'operations credentials'
  require_private "$projects_json" 'operations project config'
  set -a
  # shellcheck disable=SC1090
  source "$ops_env"
  set +a
  target_fingerprint=$(ssh-keygen -lf "$production_dir/known_hosts" -E sha256 | awk 'NR == 1 { print $2 }')
  require_one_line "$target_fingerprint" 'application SSH host fingerprint'
  umask 077
  printf '%s\n' \
    "INFRAEGE_TARGET_SSH_PASSWORD=$(<"$root_password")" \
    "INFRAEGE_TARGET_HOST_KEY_FINGERPRINT=$target_fingerprint" \
    "INFRAEGE_BESZEL_EMAIL=$(<"$beszel_email")" \
    "INFRAEGE_BESZEL_PASSWORD=$(<"$beszel_password")" \
    "INFRAEGE_BESZEL_SYSTEM_ID=$(jq -r '.projects[] | select(.id == "infraege") | .beszel.systemId' "$projects_json")" \
    "INFRAEGE_UMAMI_USERNAME=$INFRAEGE_UMAMI_USERNAME" \
    "INFRAEGE_UMAMI_PASSWORD=$INFRAEGE_UMAMI_PASSWORD" \
    "INFRAEGE_UMAMI_WEBSITE_ID=$(jq -r '.projects[] | select(.id == "infraege") | .umami.websiteId' "$projects_json")" \
    > "$output"
  chmod 600 "$output"
}

reconcile_sources() {
  local temporary source_env publisher_bundle remote_source_env=/etc/infraege/sre-kit-sources.env
  management_ssh_init
  temporary=$(mktemp -d)
  trap 'rm -rf -- "$temporary"' RETURN
  source_env=$temporary/sources.env
  build_source_env "$source_env"
  management_ssh 'install -d -m 700 /etc/infraege'
  management_scp "$source_env" "$repo_dir/ops/management/reconcile-sources.py" \
    "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST:/root/"
  management_ssh "install -m 600 /root/sources.env $remote_source_env && chmod 755 /root/reconcile-sources.py"
  if ! printf '%s\n' "$MANAGEMENT_ADMIN_PASSWORD" |
    management_ssh "SRE_KIT_SOURCE_ENV=$remote_source_env python3 /root/reconcile-sources.py"; then
    management_ssh "rm -f -- $remote_source_env"
    return 1
  fi
  management_ssh "rm -f -- $remote_source_env"

  publisher_bundle=$temporary/publisher
  mkdir "$publisher_bundle"
  cp "$repo_dir/ops/observability/push-nginx-traffic.py" \
    "$repo_dir/ops/observability/traffic_telemetry.py" \
    "$repo_dir/ops/systemd/infraege-sre-kit-management-traffic.service" \
    "$repo_dir/ops/systemd/infraege-sre-kit-management-traffic.timer" \
    "$publisher_bundle/"
  management_ssh 'rm -rf -- /root/infraege-sre-kit-publisher'
  management_scp -r "$publisher_bundle" "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST:/root/infraege-sre-kit-publisher"
  management_scp "$repo_dir/ops/management/install-publisher.sh" \
    "$MANAGEMENT_SSH_USER@$MANAGEMENT_SSH_HOST:/root/install-infraege-sre-kit-publisher.sh"
  management_ssh 'bash /root/install-infraege-sre-kit-publisher.sh'
  rm -rf -- "$temporary"
  trap - RETURN
}

remote_operation() {
  management_ssh_init
  case $1 in
    status) management_ssh '/opt/sre-kit/current/scripts/status.sh' ;;
    backup) management_ssh '/opt/sre-kit/current/scripts/backup.sh' ;;
    restore-proof) management_ssh '/opt/sre-kit/current/scripts/restore-proof.sh' ;;
    *) die "unsupported remote operation: $1" ;;
  esac
}

case ${1:-help} in
  bootstrap) bootstrap_host ;;
  wireguard) provision_wireguard ;;
  install|update|rollback) install_release "${2:-}" ;;
  sources) reconcile_sources ;;
  status|backup|restore-proof) remote_operation "$1" ;;
  all)
    bootstrap_host
    provision_wireguard
    install_release "${2:-}"
    reconcile_sources
    remote_operation status
    ;;
  *)
    echo 'usage: scripts/management-sre-kit.sh bootstrap|wireguard|install SHA|update SHA|rollback SHA|sources|status|backup|restore-proof|all SHA' >&2
    exit 2
    ;;
esac
