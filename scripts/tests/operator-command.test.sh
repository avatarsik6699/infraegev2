#!/usr/bin/env bash
# Change 199: the console executor runs only allow-listed kinds with checked arguments, passes
# them as JSON on stdin, and never lets an argument reach a shell or the docker command line.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
script=$repo_dir/scripts/operator-command.sh
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT

mkdir -p "$test_root/bin" "$test_root/release/infra"
touch "$test_root/release/infra/docker-compose.yml" "$test_root/release/infra/docker-compose.prod.yml"
touch "$test_root/production.env"
cat >"$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$@" >"$DOCKER_ARGS"
cat >"$DOCKER_STDIN"
echo '{"ok": true}'
FAKE
chmod +x "$test_root/bin/docker"
export PATH="$test_root/bin:$PATH" OPERATOR_COMMAND_TEST=1 \
  INFRAEGE_RELEASE_DIR="$test_root/release" INFRAEGE_ENV_FILE="$test_root/production.env" \
  DOCKER_ARGS="$test_root/args" DOCKER_STDIN="$test_root/stdin"

user=0b6f2c1e-5d4a-4c3b-9a8f-7e6d5c4b3a21
accept() {
  rm -f "$DOCKER_ARGS" "$DOCKER_STDIN"
  [[ $(bash "$script" "$1" <<<"$2") == '{"ok": true}' ]] || { echo "refused: $1 $2" >&2; exit 1; }
  [[ $(tail -n 1 "$DOCKER_ARGS") == "$1" ]]
  grep -Fxq 'operator' "$DOCKER_ARGS"
}
reject() {
  rm -f "$DOCKER_ARGS"
  local out status=0
  out=$(bash "$script" "$@" <<<"${REJECT_INPUT:-{\}}") || status=$?
  [[ $status -eq 2 && $out == '{"error":'* && ! -e $DOCKER_ARGS ]] || {
    echo "accepted: $* ${REJECT_INPUT:-}" >&2
    exit 1
  }
}

accept warn "{\"user\":\"$user\",\"reason\":\"доступ передан другим людям\"}"
[[ $(jq -r .reason "$DOCKER_STDIN") == 'доступ передан другим людям' ]]
accept suspend '{"email":"a@example.com","reason":"x","days":30,"note":"3 города"}'
accept terminate "{\"user\":\"$user\",\"reason\":\"повтор\"}"
accept lift "{\"user\":\"$user\",\"compensate\":true}"
accept account_show '{"email":"a@example.com"}'
accept refund_execute "{\"refund\":\"$user\"}"

# kinds, shape and every argument pattern
REJECT_INPUT='{}' reject drop_tables
REJECT_INPUT='{}' reject 'warn; rm -rf /'
REJECT_INPUT='{}' reject
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"x\"}" reject warn extra
REJECT_INPUT='[]' reject account_show
REJECT_INPUT='not json' reject account_show
REJECT_INPUT="{\"user\":\"$user\",\"email\":\"a@example.com\"}" reject account_show
# shellcheck disable=SC2016 # a literal command substitution must stay literal
REJECT_INPUT='{"user":"$(id)"}' reject account_show
REJECT_INPUT='{"email":"a@example.com","shell":"rm"}' reject account_show
REJECT_INPUT='{"email":"no-at-sign"}' reject account_show
REJECT_INPUT="{\"user\":\"$user\"}" reject warn
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"\"}" reject warn
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"a\\nb\"}" reject warn
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"x\",\"days\":31}" reject suspend
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"x\",\"days\":1.5}" reject suspend
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"x\"}" reject suspend
REJECT_INPUT="{\"user\":\"$user\",\"compensate\":\"yes\"}" reject lift
REJECT_INPUT='{"refund":"1; DROP TABLE"}' reject refund_execute
long=$(head -c 400 /dev/zero | tr '\0' 'a')
REJECT_INPUT="{\"user\":\"$user\",\"reason\":\"$long\"}" reject warn
huge=$(head -c 9000 /dev/zero | tr '\0' 'a')
REJECT_INPUT="{\"email\":\"$huge@x\"}" reject account_show

# without the test switch only root may run it
out=$(env -u OPERATOR_COMMAND_TEST bash -c "[[ \$(id -u) -eq 0 ]] && exit 0; bash '$script' warn <<<'{}'" || true)
[[ $(id -u) -eq 0 || $out == '{"error":"must run as root"}' ]]
echo 'operator-command: allow-listed kinds, checked JSON arguments, no shell: PASS'
