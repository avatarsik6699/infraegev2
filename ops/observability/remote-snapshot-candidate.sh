#!/usr/bin/env bash
set -Eeuo pipefail

# Fixed read-only protocol. This collector may inspect metadata only; it never dumps file content.
export RESTIC_REPOSITORY=/var/backups/infraege/restic
export RESTIC_PASSWORD_FILE=/etc/infraege/restic-password

snapshot_json=$(restic snapshots --json 2>/dev/null)
snapshot_id=$(jq -er 'if length > 0 then max_by(.time).id else error("snapshot-count") end' \
  <<<"$snapshot_json")
snapshot_time=$(jq -er 'if length > 0 then max_by(.time).time else error("snapshot-count") end' \
  <<<"$snapshot_json")
[[ $snapshot_id =~ ^[a-f0-9]{64}$ ]]
[[ $snapshot_time != *$'\t'* && $snapshot_time != *$'\n'* ]]

listing=$(restic ls --json "$snapshot_id" 2>/dev/null)
umami_paths=$(jq -rs '
  [.[] | select(
    .struct_type == "node" and .type == "file" and
    (.path | test("^/var/backups/infraege/work\\.[A-Za-z0-9]+/umami\\.dump$"))
  ) | .path] | unique | .[]
' <<<"$listing")
beszel_paths=$(jq -rs '
  [.[] | select(
    .struct_type == "node" and .type == "dir" and
    (.path | test("^/var/backups/infraege/work\\.[A-Za-z0-9]+/beszel-data$"))
  ) | .path] | unique | .[]
' <<<"$listing")

[[ $(wc -l <<<"$umami_paths") -eq 1 && -n $umami_paths ]]
[[ $(wc -l <<<"$beszel_paths") -eq 1 && -n $beszel_paths ]]
[[ ${umami_paths%/umami.dump} == "${beszel_paths%/beszel-data}" ]]

printf 'snapshot\t%s\t%s\n' "$snapshot_id" "$snapshot_time"
printf 'artifact\tumami-dump\tfile\t%s\n' "$umami_paths"
printf 'artifact\tbeszel-data\tdirectory\t%s\n' "$beszel_paths"
