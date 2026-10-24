#!/usr/bin/env bash
# Change 198 (SPEC §6.2): refresh the DB-IP Lite city database (CC BY 4.0) that the API reads
# for «Где выполнен вход». A failed download keeps the previous file; a missing file only
# means «no city». The API picks the new file up at its next restart (deploy).
set -euo pipefail
umask 022

target_dir=${GEOIP_DIR:-/var/lib/infraege/geoip}
target="$target_dir/dbip-city-lite.mmdb"
month=$(date -u +%Y-%m)
url="https://download.db-ip.com/free/dbip-city-lite-$month.mmdb.gz"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
install -d -m 755 "$target_dir"
curl --fail --silent --show-error --location --max-time 300 --proto '=https' \
  --output "$work/city.mmdb.gz" "$url"
gunzip -c "$work/city.mmdb.gz" >"$work/city.mmdb"
# A real database is tens of megabytes; anything small is an error page.
size=$(stat -c %s "$work/city.mmdb")
(( size > 10 * 1024 * 1024 )) || { echo "geoip: unexpected size $size" >&2; exit 1; }
install -m 644 "$work/city.mmdb" "$target.new"
mv -f "$target.new" "$target"
echo "geoip: $month installed ($size bytes)"
