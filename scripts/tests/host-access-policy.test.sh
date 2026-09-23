#!/usr/bin/env bash
# Host access policy (SPEC 7.1): root/password SSH stays by architect decision, so guessing is
# limited instead — few attempts per connection and fail2ban bans that grow for repeat offenders.
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
sshd="$repo_dir/ops/sshd/20-infraege-root-password.conf"
jail="$repo_dir/ops/fail2ban/jail.d/infraege.conf"

for expected in 'MaxAuthTries 3' 'LoginGraceTime 30' 'PasswordAuthentication yes'; do
  grep -Fxq "$expected" "$sshd"
done

# Settings of one INI section, as "key = value" lines.
section() {
  awk -v want="[$1]" '/^\[/{inside = ($0 == want); next} inside && NF' "$jail"
}

defaults=$(section DEFAULT)
for expected in 'banaction = ufw' 'bantime.increment = true' 'bantime.maxtime = 1w'; do
  grep -Fxq "$expected" <<<"$defaults"
done

sshd_jail=$(section sshd)
for expected in 'enabled = true' 'backend = systemd' 'maxretry = 5'; do
  grep -Fxq "$expected" <<<"$sshd_jail"
done

echo "host-access-policy: ok"
