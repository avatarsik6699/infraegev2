#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
fixture_repo="$test_root/repo"
fake_bin="$test_root/bin"
calls="$test_root/docker.log"
athanor_calls="$test_root/athanor.log"
state_file="$test_root/state/fingerprint"
lock_file="$test_root/lifecycle.lock"
input_file="$test_root/input"
mkdir -p "$fake_bin" "$fixture_repo/scripts"
cp "$repo_dir/scripts/docker-dev-lifecycle.sh" "$fixture_repo/scripts/docker-dev-lifecycle.sh"
printf 'first\n' >"$input_file"

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$DOCKER_CALLS"
if [[ ${SMTP_USERNAME:-} == fixture-user && ${SMTP_PASSWORD:-} == fixture-password &&
      ${SMTP_HOST:-} == postbox.cloud.yandex.net && ${SMTP_PORT:-} == 587 &&
      ${MAIL_FROM:-} == accounts@infraege.ru ]]; then
  printf 'smtp-configured\n' >>"$DOCKER_CALLS"
fi
exit 0
EOF
chmod +x "$fake_bin/docker"

cat >"$fake_bin/athanor" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$ATHANOR_CALLS"
[[ $1 == run && $2 == -- ]] || exit 2
shift 2
case ${ATHANOR_TEST_MODE:-complete} in
  complete) export SMTP_USERNAME=fixture-user SMTP_PASSWORD=fixture-password ;;
  incomplete) export SMTP_USERNAME=fixture-user; unset SMTP_PASSWORD ;;
  unavailable) exit 1 ;;
esac
"$@"
EOF
chmod +x "$fake_bin/athanor"

run_lifecycle() {
  PATH="$fake_bin:$PATH" \
    DOCKER_CALLS="$calls" \
    ATHANOR_CALLS="$athanor_calls" \
    INFRAEGE_DOCKER_INPUTS="$input_file" \
    INFRAEGE_DOCKER_LOCK_FILE="$lock_file" \
    INFRAEGE_DOCKER_STATE_FILE="$state_file" \
    "$fixture_repo/scripts/docker-dev-lifecycle.sh" "$1" >/dev/null
}

run_lifecycle dev
grep -Fq 'up --build --wait' "$calls"
test ! -e "$athanor_calls"

: >"$calls"
run_lifecycle dev
grep -Fq 'up --wait' "$calls"
! grep -Fq 'up --build' "$calls"

printf 'changed\n' >"$input_file"
: >"$calls"
run_lifecycle dev
grep -Fq 'up --build --wait' "$calls"

: >"$calls"
run_lifecycle stop
grep -Fq 'stop --timeout 10' "$calls"

: >"$calls"
run_lifecycle down
grep -Fq 'down --timeout 10 --remove-orphans' "$calls"

touch "$fixture_repo/athanor.yaml"
: >"$calls"
run_lifecycle dev
grep -Fq 'run -- env INFRAEGE_ATHANOR_ACTIVE=1' "$athanor_calls"
grep -Fq 'smtp-configured' "$calls"

: >"$calls"
run_lifecycle rebuild
grep -Fq 'up --build --wait' "$calls"
grep -Fq 'smtp-configured' "$calls"

: >"$calls"
run_lifecycle restart
grep -Fq 'stop --timeout 10' "$calls"
grep -Fq 'smtp-configured' "$calls"

: >"$calls"
ATHANOR_TEST_MODE=incomplete run_lifecycle dev 2>"$test_root/incomplete.err" && exit 1
grep -Fq 'SMTP_USERNAME or SMTP_PASSWORD is missing' "$test_root/incomplete.err"
test ! -s "$calls"

ATHANOR_TEST_MODE=unavailable run_lifecycle dev 2>"$test_root/unavailable.err" && exit 1
test ! -s "$calls"

: >"$athanor_calls"
run_lifecycle stop
run_lifecycle down
test ! -s "$athanor_calls"

echo 'Docker development lifecycle contract: PASS'
