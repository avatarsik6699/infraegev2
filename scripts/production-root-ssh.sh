#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=lib/production-ssh.sh
source "$repo_dir/scripts/lib/production-ssh.sh"
production_ssh_init
production_ssh "$@"
