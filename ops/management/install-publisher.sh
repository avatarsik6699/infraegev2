#!/usr/bin/env bash
set -Eeuo pipefail

bundle=${1:-/root/infraege-sre-kit-publisher}
[[ -f $bundle/push-nginx-traffic.py && -f $bundle/traffic_telemetry.py ]]
[[ -f /etc/infraege/sre-kit-traffic.env && $(stat -c '%a' /etc/infraege/sre-kit-traffic.env) == 600 ]]
[[ -f /etc/infraege/sre-kit-traffic-token && $(stat -c '%a' /etc/infraege/sre-kit-traffic-token) == 600 ]]
python3 -c 'import sys; raise SystemExit(sys.version_info < (3, 12))'

install -d -m 755 /opt/infraege-sre-kit
install -d -m 700 /var/lib/infraege-sre-kit
install -m 755 "$bundle/push-nginx-traffic.py" /opt/infraege-sre-kit/push-nginx-traffic.py
install -m 644 "$bundle/traffic_telemetry.py" /opt/infraege-sre-kit/traffic_telemetry.py
install -m 644 "$bundle/infraege-sre-kit-management-traffic.service" \
  /etc/systemd/system/infraege-sre-kit-management-traffic.service
install -m 644 "$bundle/infraege-sre-kit-management-traffic.timer" \
  /etc/systemd/system/infraege-sre-kit-management-traffic.timer
systemctl daemon-reload
systemctl enable --now infraege-sre-kit-management-traffic.timer
systemctl start infraege-sre-kit-management-traffic.service
systemctl is-active --quiet infraege-sre-kit-management-traffic.timer
echo 'management traffic publisher installed'
