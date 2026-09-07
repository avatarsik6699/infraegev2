#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT

fake_lhci=$test_root/lhci
capture_file=$test_root/profile-path

run_case() {
  local behavior=$1
  local expected_status=$2

  rm -f -- "$capture_file"
  set +e
  INFRAEGE_LHCI_BIN=$fake_lhci \
    INFRAEGE_LHCI_TEST_BEHAVIOR=$behavior \
    INFRAEGE_LHCI_TEST_CAPTURE=$capture_file \
    bash "$repo_dir/scripts/run-lighthouse-audit.sh" >/dev/null 2>&1
  status=$?
  set -e

  if [[ $status -ne $expected_status ]]; then
    echo "unexpected wrapper status for $behavior: $status" >&2
    exit 1
  fi

  profile_dir=$(<"$capture_file")
  [[ $profile_dir == /tmp/infraege-lighthouse.* ]]
  test ! -e "$profile_dir"
}

cat >"$fake_lhci" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

[[ ${1:-} == autorun ]]
printf '%s' "$INFRAEGE_LIGHTHOUSE_PROFILE_DIR" >"$INFRAEGE_LHCI_TEST_CAPTURE"

case $INFRAEGE_LHCI_TEST_BEHAVIOR in
  success) exit 0 ;;
  failure) exit 17 ;;
  term)
    kill -TERM "$PPID"
    exit 0
    ;;
esac
EOF
chmod +x "$fake_lhci"

run_case success 0
run_case failure 17
run_case term 143

if CHROME_PATH=/bin/true node -e "require('$repo_dir/lighthouserc.cjs')" \
  >/dev/null 2>&1; then
  echo 'Lighthouse config unexpectedly accepted a direct unwrapped run' >&2
  exit 1
fi

config_profile=/tmp/infraege-lighthouse.config-test
config_flags=$(
  CHROME_PATH=/bin/true \
    INFRAEGE_LIGHTHOUSE_PROFILE_DIR=$config_profile \
    node -e \
      "process.stdout.write(require('$repo_dir/lighthouserc.cjs').ci.collect.settings.chromeFlags)"
)
grep -Fq -- "--user-data-dir=$config_profile" <<<"$config_flags"

config_lcp_assertion=$(
  CHROME_PATH=/bin/true \
    INFRAEGE_LIGHTHOUSE_PROFILE_DIR=$config_profile \
    node -e \
      "const assertion = require('$repo_dir/lighthouserc.cjs').ci.assert.assertions['largest-contentful-paint'][1]; process.stdout.write(JSON.stringify(assertion))"
)
[[ $config_lcp_assertion == '{"maxNumericValue":4000,"aggregationMethod":"median"}' ]]

if find "$repo_dir" -mindepth 1 -maxdepth 1 -type d \
  -name 'C:\Users\user\AppData\Local\lighthouse.*' -print -quit | grep -q .; then
  echo 'literal Windows Lighthouse profile remains in repository' >&2
  exit 1
fi

echo 'Lighthouse audit wrapper contract: PASS'
