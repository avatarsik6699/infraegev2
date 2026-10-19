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

# Change 196: the off-site copy through the real library, with a second local repository standing in
# for the remote backend (the repository URL is the only difference).
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
printf 'synthetic-test-only\n' > "$test_root/password"
restic() {
  docker run --rm --user "$(id -u):$(id -g)" --volume "$test_root:/test" \
    --env RESTIC_REPOSITORY --env RESTIC_PASSWORD_FILE=/test/password \
    --env RESTIC_CACHE_DIR=/test/cache restic/restic:0.16.4 "$@"
}
export RESTIC_PASSWORD_FILE=/test/password
# shellcheck source=scripts/lib/offsite-backup.sh
source "$repo_dir/scripts/lib/offsite-backup.sh"
export OFFSITE_RESTIC_REPOSITORY=/test/offsite
offsite_test() { RESTIC_REPOSITORY=/test/offsite restic "$@"; }

copied=$(offsite_copy /test/repo "$ordinary_id")
[[ $(offsite_test cat snapshot "$copied" | jq -r .original) == "$ordinary_id" ]]
[[ $(offsite_test cat config | jq -r .chunker_polynomial) == $(restic_test cat config | jq -r .chunker_polynomial) ]]
# The pre-migration hold survives the off-site retention as well.
[[ $(offsite_test snapshots --json --tag infraege-recovery-hold | jq length) == 1 ]]

# A missed day catches up: two local backups, one copy run, both arrive.
printf 'day two\n' > "$test_root/data/input"
missed=$(restic_test backup --json --tag infraege-application /test/data | jq -sr '.[] | select(.message_type == "summary") | .snapshot_id')
printf 'day three\n' > "$test_root/data/input"
latest=$(restic_test backup --json --tag infraege-application /test/data | jq -sr '.[] | select(.message_type == "summary") | .snapshot_id')
offsite_copy /test/repo "$latest" >/dev/null
offsite_test snapshots --json --tag infraege-application |
  jq -e --arg a "$missed" --arg b "$latest" '[.[].original] | index($a) != null and index($b) != null' >/dev/null
[[ $(offsite_repository_facts | jq -r '.snapshots > 0 and .sizeBytes > 0') == true ]]
echo 'Restic 0.16.4 isolated retention: PASS (both same-day full IDs survived; off-site copy, original ID, chunker, hold, catch-up)'
