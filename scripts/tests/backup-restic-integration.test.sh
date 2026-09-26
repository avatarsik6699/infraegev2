#!/usr/bin/env bash
set -euo pipefail
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir -p "$test_root/data" "$test_root/repo" "$test_root/cache"
printf 'synthetic, non-production test data\n' > "$test_root/data/input"

restic_test() {
  docker run --rm --user "$(id -u):$(id -g)" --volume "$test_root:/test" \
    --env RESTIC_REPOSITORY=/test/repo --env RESTIC_PASSWORD=synthetic-test-only \
    --env RESTIC_CACHE_DIR=/test/cache \
    restic/restic:0.16.4 "$@"
}

restic_test init >/dev/null
held_id=$(restic_test backup --json --tag infraege-application \
  --tag infraege-recovery-hold /test/data |
  jq -ser '[.[] | select(.message_type == "summary") | .snapshot_id] |
    if length == 1 and (.[0] | type == "string" and test("^[0-9a-f]{64}$"))
    then .[0] else error("invalid snapshot ID") end')
printf 'second same-day backup\n' > "$test_root/data/input"
ordinary_id=$(restic_test backup --json --tag infraege-application /test/data |
  jq -ser '[.[] | select(.message_type == "summary") | .snapshot_id] |
    if length == 1 and (.[0] | type == "string" and test("^[0-9a-f]{64}$"))
    then .[0] else error("invalid snapshot ID") end')
[[ $held_id != "$ordinary_id" ]]
restic_test forget --tag infraege-application --group-by host,tags \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 3 \
  --keep-tag infraege-recovery-hold --prune >/dev/null
restic_test cat snapshot "$held_id" |
  jq -e '.tags | index("infraege-recovery-hold") != null' >/dev/null
restic_test cat snapshot "$ordinary_id" >/dev/null
echo 'Restic 0.16.4 isolated retention: PASS (both same-day full IDs survived)'
