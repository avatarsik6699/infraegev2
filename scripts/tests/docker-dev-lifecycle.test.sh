#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
fake_bin="$test_root/bin"
calls="$test_root/docker.log"
state_file="$test_root/state/fingerprint"
lock_file="$test_root/lifecycle.lock"
input_file="$test_root/input"
mkdir -p "$fake_bin"
printf 'first\n' >"$input_file"

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$DOCKER_CALLS"
exit 0
EOF
chmod +x "$fake_bin/docker"

run_lifecycle() {
  PATH="$fake_bin:$PATH" \
    DOCKER_CALLS="$calls" \
    INFRAEGE_DOCKER_INPUTS="$input_file" \
    INFRAEGE_DOCKER_LOCK_FILE="$lock_file" \
    INFRAEGE_DOCKER_STATE_FILE="$state_file" \
    "$repo_dir/scripts/docker-dev-lifecycle.sh" "$1" >/dev/null
}

run_lifecycle dev
grep -Fq 'up --build --wait' "$calls"

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

echo 'Docker development lifecycle contract: PASS'
