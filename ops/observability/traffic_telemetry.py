"""Privacy-safe traffic classification and sre-kit batch construction."""

from __future__ import annotations

import json
import re
from collections import Counter
from collections.abc import Iterable, Mapping
from datetime import UTC, datetime
from typing import Any
from urllib.parse import urlsplit

KNOWN_BOT = re.compile(r"(googlebot|bingbot|yandexbot|duckduckbot|baiduspider|slurp)", re.I)
AUTOMATION = re.compile(
    r"(headless|selenium|playwright|puppeteer|curl/|wget/|python-requests|httpx)", re.I
)
SAFE_PATH = re.compile(r"^/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*$")
PROBE_PATH = re.compile(
    r"(?:^|/)(?:\.env(?:[._/-]|$)|\.git(?:[/-]|$)|\.aws(?:/|$)|wp-(?:admin|content|includes|json|login)|xmlrpc\.php|phpinfo|vendor/phpunit|terraform(?:\.tfstate|/)|HNAP1)",
    re.I,
)


def classify(user_agent: str) -> str:
    if KNOWN_BOT.search(user_agent):
        return "known_bot"
    if AUTOMATION.search(user_agent) or not user_agent.strip():
        return "suspected_automation"
    return "unclassified"


def clean_path(raw: str) -> str:
    try:
        path = urlsplit(raw).path or "/"
    except ValueError:
        return "__invalid_path__"
    if len(path) > 160:
        return "__long_path__"
    if not SAFE_PATH.fullmatch(path):
        return "__invalid_path__"
    if PROBE_PATH.search(path):
        return "__probe__"
    return path


def build_rows(
    rows: Iterable[Mapping[str, Any]], timestamp: str | None = None
) -> dict[str, object]:
    counts: Counter[tuple[str, str, str]] = Counter()
    for row in rows:
        status = int(row.get("status", 0))
        path = clean_path(str(row.get("path", "/")))
        traffic_class = (
            "suspected_automation"
            if path in {"__invalid_path__", "__long_path__", "__probe__"}
            else classify(str(row.get("user_agent", "")))
        )
        counts[
            (
                traffic_class,
                path,
                f"{status // 100}xx" if status else "unknown",
            )
        ] += 1
    ts = timestamp or datetime.now(UTC).isoformat().replace("+00:00", "Z")
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


def build(lines: Iterable[str], timestamp: str | None = None) -> dict[str, object]:
    return build_rows((json.loads(line) for line in lines if line.strip()), timestamp)
