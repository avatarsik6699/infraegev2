#!/usr/bin/env bash
set -euo pipefail

production_domain=${PRODUCTION_DOMAIN:-infraege.ru}
production_ipv4=${PRODUCTION_IPV4:-2.26.8.245}
github_repository=${GITHUB_REPOSITORY:-avatarsik6699/infraegev2}
health_url="https://${production_domain}/health/ready"

if health_payload=$(curl --fail --silent --show-error --max-time 15 "$health_url" 2>/dev/null); then
  jq -e '.status == "ok" and (.version | type == "string" and length == 40)' \
    <<< "$health_payload" >/dev/null
  echo "Existing production target is healthy."
  exit 0
fi

successful_deploy_count=$(gh run list --repo "$github_repository" --workflow deploy.yml \
  --status success --limit 1 --json databaseId --jq 'length')
if [[ $successful_deploy_count != 0 ]]; then
  echo "Existing production target is unavailable; refusing a release over an unhealthy deployment." >&2
  exit 1
fi

for dns_resolver in 1.1.1.1 8.8.8.8; do
  for dns_name in "$production_domain" "www.$production_domain"; do
    resolved_ip=$(dig +short "@$dns_resolver" A "$dns_name" | tail -n 1)
    if [[ $resolved_ip != "$production_ipv4" ]]; then
      echo "$dns_name resolves to $resolved_ip via $dns_resolver, expected $production_ipv4." >&2
      exit 1
    fi
  done
done

echo "Initial release target is ready: no successful deploy exists and public DNS is correct."
