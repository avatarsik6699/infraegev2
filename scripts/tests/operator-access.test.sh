#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
fake_bin="$test_root/bin"
command_log="$test_root/commands.log"
operator_home="$test_root/home/operator"
mkdir -p "$fake_bin"

cat >"$fake_bin/getent" <<'EOF'
#!/usr/bin/env bash
[[ $* == 'group sudo' ]] && { printf 'sudo:x:27:\n'; exit 0; }
exit 2
EOF

cat >"$fake_bin/id" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
case "$*" in
  operator) exit "${OPERATOR_EXISTS:-1}" ;;
  '-nG operator') printf 'operator sudo\n' ;;
  '-nG deploy') printf 'deploy docker\n' ;;
  *) command /usr/bin/id "$@" ;;
esac
EOF

cat >"$fake_bin/useradd" <<'EOF'
#!/usr/bin/env bash
printf 'useradd %s\n' "$*" >>"$COMMAND_LOG"
EOF

cat >"$fake_bin/groupadd" <<'EOF'
#!/usr/bin/env bash
printf 'groupadd %s\n' "$*" >>"$COMMAND_LOG"
EOF

cat >"$fake_bin/usermod" <<'EOF'
#!/usr/bin/env bash
printf 'usermod %s\n' "$*" >>"$COMMAND_LOG"
EOF

cat >"$fake_bin/chpasswd" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
[[ $* == --encrypted ]]
IFS= read -r assignment
printf 'chpasswd %s\n' "$assignment" >>"$COMMAND_LOG"
EOF

cat >"$fake_bin/install" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
args=()
while (($#)); do
  case "$1" in
    -o | -g)
      shift 2
      ;;
    *)
      args+=("$1")
      shift
      ;;
  esac
done
command /usr/bin/install "${args[@]}"
EOF

cat >"$fake_bin/visudo" <<'EOF'
#!/usr/bin/env bash
[[ $* == '-cf /etc/sudoers' ]]
EOF

cat >"$fake_bin/sshd" <<'EOF'
#!/usr/bin/env bash
case "$*" in
  -t) exit 0 ;;
  -T)
    printf '%s\n' \
      'permitrootlogin no' \
      'pubkeyauthentication yes' \
      'passwordauthentication no' \
      'kbdinteractiveauthentication no'
    ;;
  *) exit 1 ;;
esac
EOF
chmod +x "$fake_bin"/*

run_setup() {
  PATH="$fake_bin:$PATH" \
    OPERATOR_SETUP_ALLOW_NON_ROOT=1 \
    OPERATOR_HOME="$operator_home" \
    OPERATOR_SSH_PUBLIC_KEY='ssh-ed25519 AAAAoperator test' \
    OPERATOR_PASSWORD_HASH='$6$synthetic$hash' \
    COMMAND_LOG="$command_log" \
    "$repo_dir/ops/setup-operator-access.sh"
}

run_setup
grep -Fq 'groupadd infraege-operator' "$command_log"
grep -Fq 'useradd --create-home' "$command_log"
grep -Fq -- '--gid infraege-operator' "$command_log"
grep -Fq 'usermod --gid infraege-operator operator' "$command_log"
grep -Fq 'usermod --append --groups sudo operator' "$command_log"
grep -Fq 'chpasswd operator:$6$synthetic$hash' "$command_log"
[[ $(stat -c %a "$operator_home/.ssh") == 700 ]]
[[ $(stat -c %a "$operator_home/.ssh/authorized_keys") == 600 ]]

if PATH="$fake_bin:$PATH" OPERATOR_SETUP_ALLOW_NON_ROOT=1 \
  OPERATOR_HOME="$operator_home" OPERATOR_USER=deploy \
  OPERATOR_SSH_PUBLIC_KEY='ssh-ed25519 AAAAoperator test' \
  OPERATOR_PASSWORD_HASH='$6$synthetic$hash' \
  "$repo_dir/ops/setup-operator-access.sh" >/dev/null 2>&1; then
  echo 'operator setup accepted the deploy identity' >&2
  exit 1
fi

cat >"$fake_bin/sshd" <<'EOF'
#!/usr/bin/env bash
[[ $* == -t ]] && exit 0
printf '%s\n' \
  'permitrootlogin prohibit-password' \
  'pubkeyauthentication yes' \
  'passwordauthentication no' \
  'kbdinteractiveauthentication no'
EOF
chmod +x "$fake_bin/sshd"
if run_setup >/dev/null 2>&1; then
  echo 'operator setup accepted direct root SSH' >&2
  exit 1
fi

echo 'human operator access test: PASS'
