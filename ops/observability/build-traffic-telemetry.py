#!/usr/bin/env python3
"""Build a privacy-safe sre-kit push batch from JSON request summaries on stdin.

Input may contain IP/request identifiers for classification upstream, but this program deliberately
does not read or emit them. It aggregates only route, status family and coarse traffic class.
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from urllib.parse import urlsplit

KNOWN_BOT = re.compile(r"(googlebot|bingbot|yandexbot|duckduckbot|baiduspider|slurp)", re.I)
AUTOMATION = re.compile(
    r"(headless|selenium|playwright|puppeteer|curl/|wget/|python-requests|httpx)", re.I
)


def classify(user_agent: str) -> str:
    if KNOWN_BOT.search(user_agent):
        return "known_bot"
    if AUTOMATION.search(user_agent) or not user_agent.strip():
        return "suspected_automation"
    return "unclassified"


def clean_path(raw: str) -> str:
    path = urlsplit(raw).path or "/"
    if len(path) > 160:
        return "__long_path__"
    return path


def build(lines: list[str], timestamp: str | None = None) -> dict[str, object]:
    counts: Counter[tuple[str, str, str]] = Counter()
    for line in lines:
        if not line.strip():
            continue
        row = json.loads(line)
        status = int(row.get("status", 0))
        counts[
            (
                classify(str(row.get("user_agent", ""))),
                clean_path(str(row.get("path", "/"))),
                f"{status // 100}xx" if status else "unknown",
            )
        ] += 1
    ts = timestamp or datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    records = [
        {
            "type": "metric",
            "name": "traffic.request_count",
            "timestamp": ts,
            "value": count,
            "labels": {
                "traffic_class": traffic_class,
                "path": path,
                "status_family": status_family,
            },
        }
        for (traffic_class, path, status_family), count in sorted(counts.items())
    ]
    return {"schema_version": "1.0", "records": records}


if __name__ == "__main__":
    json.dump(build(sys.stdin.readlines()), sys.stdout, ensure_ascii=False, separators=(",", ":"))
    sys.stdout.write("\n")
