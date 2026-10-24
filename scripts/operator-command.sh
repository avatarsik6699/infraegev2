#!/usr/bin/env bash
# Change 199 (SPEC §6.2; smotryashchiy SPEC §4j): the one executable the smotryashchiy agent may
# run for the operator console. `operator-command.sh KIND` reads one JSON object on stdin,
# checks the kind and every argument against an allow-list, and passes the normalized object to
# `billing.admin operator KIND` inside the running API container, which checks it again. No
# shell interpolation: the arguments travel only as JSON on stdin, the kind only as argv.
# Output: the API's one JSON object; a refusal here is `{"error": …}` and exit 2.
set -euo pipefail

refuse() {
  jq -cn --arg error "$1" '{error: $error}'
  exit 2
}

[[ ${EUID:-$(id -u)} -eq 0 || -n ${OPERATOR_COMMAND_TEST:-} ]] || refuse 'must run as root'
[[ $# -eq 1 ]] || refuse 'usage: operator-command.sh KIND'
kind=$1
case $kind in
  warn | terminate) allowed='["user","email","reason","note"]' ;;
  suspend) allowed='["user","email","reason","note","days"]' ;;
  lift) allowed='["user","email","compensate"]' ;;
  account_show) allowed='["user","email"]' ;;
  refund_execute) allowed='["refund"]' ;;
  *) refuse 'kind not allowed' ;;
esac

# At most 8 KiB; anything longer is not a console command.
input=$(head -c 8193)
((${#input} <= 8192)) || refuse 'arguments too large'

uuid='^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
normalized=$(
  jq -ce --arg kind "$kind" --argjson allowed "$allowed" --arg uuid "$uuid" '
    def text($max): type == "string" and length >= 1 and length <= $max
      and (test("[\u0000-\u001f\u007f]") | not);
    def account: ((has("user") | if . then 1 else 0 end) + (has("email") | if . then 1 else 0 end)) == 1
      and ((has("user") | not) or (.user | type == "string" and test($uuid)))
      and ((has("email") | not) or (.email | text(320) and test("^[^@\\s]+@[^@\\s]+$")));
    select(type == "object")
    | select(keys - $allowed == [])
    | select(
        if $kind == "refund_execute" then has("refund") and (.refund | type == "string" and test($uuid))
        elif $kind == "lift" then account and ((has("compensate") | not) or (.compensate | type == "boolean"))
        elif $kind == "account_show" then account
        else account and (.reason | text(300)) and ((has("note") | not) or (.note | text(1000)))
          and ($kind != "suspend" or (.days | type == "number" and . == floor and . >= 1 and . <= 30))
        end)
  ' <<<"$input" 2>/dev/null
) || refuse 'invalid arguments'

release_dir=${INFRAEGE_RELEASE_DIR:-/opt/infraege/current}
env_file=${INFRAEGE_ENV_FILE:-/etc/infraege/production.env}
[[ -r $env_file && -r $release_dir/infra/docker-compose.yml &&
  -r $release_dir/infra/docker-compose.prod.yml ]] || refuse 'production release unavailable'

exec docker compose --env-file "$env_file" --project-name infraege \
  -f "$release_dir/infra/docker-compose.yml" \
  -f "$release_dir/infra/docker-compose.prod.yml" \
  exec -T api /app/.venv/bin/python -m app.modules.billing.admin operator "$kind" <<<"$normalized"
