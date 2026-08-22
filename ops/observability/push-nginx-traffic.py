#!/usr/bin/env python3
"""Publish bounded, privacy-safe Nginx aggregates from journal-gatewayd to sre-kit."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import sys
import tempfile
import uuid
from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, urlopen

from traffic_telemetry import build_rows

MAX_RESPONSE_BYTES = 4 * 1024 * 1024
DEFAULT_LIMIT = 500
COMBINED_LOG = re.compile(
    r'^\S+ \S+ \S+ \[[^]]+\] "(?P<request>(?:[^"\\]|\\.)*)" '
    r'(?P<status>\d{3}) \S+ "(?:[^"\\]|\\.)*" "(?P<user_agent>(?:[^"\\]|\\.)*)"'
)
OpenURL = Callable[..., Any]


@dataclass(frozen=True)
class Config:
    journal_url: str
    sre_kit_url: str
    source_id: str
    token_file: Path
    state_file: Path
    container_name: str
    limit: int


def require_loopback_url(value: str, label: str) -> str:
    parsed = urlsplit(value)
    if parsed.scheme != "http" or parsed.hostname not in {"127.0.0.1", "::1", "localhost"}:
        raise ValueError(f"{label} must be an http loopback URL")
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise ValueError(f"{label} must not contain credentials, query or fragment")
    return value.rstrip("/")


def require_private_file(path: Path, label: str) -> None:
    info = path.stat()
    if not stat.S_ISREG(info.st_mode):
        raise ValueError(f"{label} must be a regular file")
    if info.st_uid != os.getuid() or stat.S_IMODE(info.st_mode) & 0o077:
        raise ValueError(f"{label} must be owned by the current user with no group/other access")


def load_cursor(path: Path) -> str | None:
    if not path.exists():
        return None
    require_private_file(path, "state file")
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("schema_version") != 1 or not isinstance(payload.get("cursor"), str):
        raise ValueError("state file has an unsupported shape")
    return payload["cursor"]


def save_cursor(path: Path, cursor: str) -> None:
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(path.parent, stat.S_IRWXU)
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            json.dump({"schema_version": 1, "cursor": cursor}, stream, separators=(",", ":"))
            stream.write("\n")
        os.replace(temporary, path)
    except BaseException:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass
        raise


def read_bounded(response: Any) -> bytes:
    raw = response.read(MAX_RESPONSE_BYTES + 1)
    if len(raw) > MAX_RESPONSE_BYTES:
        raise ValueError("HTTP response exceeded the configured safety bound")
    return raw


def fetch_entries(
    config: Config, cursor: str | None, opener: OpenURL = urlopen
) -> list[dict[str, Any]]:
    query = urlencode({"CONTAINER_NAME": config.container_name})
    request = Request(f"{config.journal_url}/entries?{query}")
    request.add_header("Accept", "application/json")
    if cursor is None:
        request.add_header("Range", f"entries=:-{config.limit}:{config.limit}")
    else:
        if "\r" in cursor or "\n" in cursor:
            raise ValueError("state cursor contains a forbidden line break")
        request.add_header("Range", f"entries={cursor}:1:{config.limit}")
    with opener(request, timeout=15) as response:
        raw = read_bounded(response)
    rows = []
    for line in raw.splitlines():
        if line.strip():
            value = json.loads(line)
            if isinstance(value, dict):
                rows.append(value)
    return rows


def parse_access_record(message: object) -> dict[str, object] | None:
    if not isinstance(message, str):
        return None
    match = COMBINED_LOG.match(message)
    if not match:
        return None
    request_parts = match.group("request").split()
    if len(request_parts) < 2:
        return None
    return {
        "path": request_parts[1],
        "status": int(match.group("status")),
        "user_agent": match.group("user_agent"),
    }


def batch_timestamp(entries: list[dict[str, Any]]) -> str:
    values = [
        int(row["__REALTIME_TIMESTAMP"])
        for row in entries
        if str(row.get("__REALTIME_TIMESTAMP", "")).isdigit()
    ]
    if not values:
        return datetime.now(UTC).isoformat().replace("+00:00", "Z")
    return datetime.fromtimestamp(max(values) / 1_000_000, UTC).isoformat().replace("+00:00", "Z")


def idempotency_key(source_id: str, entries: list[dict[str, Any]]) -> str:
    cursors = [row.get("__CURSOR") for row in entries]
    material = f"{source_id}\n{cursors[0]}\n{cursors[-1]}".encode()
    return f"nginx-{hashlib.sha256(material).hexdigest()}"


def push_batch(
    config: Config,
    batch: dict[str, object],
    key: str,
    token: str,
    opener: OpenURL = urlopen,
) -> None:
    endpoint = f"{config.sre_kit_url}/api/sources/{quote(config.source_id, safe='')}/records"
    request = Request(
        endpoint, data=json.dumps(batch, separators=(",", ":")).encode(), method="POST"
    )
    request.add_header("Authorization", f"Bearer {token}")
    request.add_header("Content-Type", "application/json")
    request.add_header("Idempotency-Key", key)
    try:
        with opener(request, timeout=15) as response:
            read_bounded(response)
            if response.status not in {200, 202}:
                raise RuntimeError(f"sre-kit returned unexpected HTTP status {response.status}")
    except HTTPError as error:
        error.close()
        raise


def publish_once(config: Config, opener: OpenURL = urlopen) -> tuple[int, int]:
    require_private_file(config.token_file, "token file")
    token = config.token_file.read_text(encoding="utf-8").strip()
    if not token or "\n" in token:
        raise ValueError("token file must contain one non-empty line")
    cursor = load_cursor(config.state_file)
    entries = fetch_entries(config, cursor, opener)
    if not entries:
        return 0, 0
    last_cursor = entries[-1].get("__CURSOR")
    if not isinstance(last_cursor, str) or not last_cursor:
        raise ValueError("journal response omitted its final cursor")
    summaries = [record for row in entries if (record := parse_access_record(row.get("MESSAGE")))]
    if summaries:
        batch = build_rows(summaries, batch_timestamp(entries))
        push_batch(config, batch, idempotency_key(config.source_id, entries), token, opener)
    save_cursor(config.state_file, last_cursor)
    return len(entries), len(summaries)


def parse_args() -> Config:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--journal-url", default=os.environ.get("INFRAEGE_JOURNAL_URL", "http://127.0.0.1:19531")
    )
    parser.add_argument(
        "--sre-kit-url", default=os.environ.get("INFRAEGE_SRE_KIT_URL", "http://127.0.0.1:8080")
    )
    parser.add_argument(
        "--source-id",
        default=os.environ.get("INFRAEGE_SRE_KIT_SOURCE_ID"),
        required="INFRAEGE_SRE_KIT_SOURCE_ID" not in os.environ,
    )
    parser.add_argument(
        "--token-file",
        type=Path,
        default=os.environ.get("INFRAEGE_SRE_KIT_TOKEN_FILE"),
        required="INFRAEGE_SRE_KIT_TOKEN_FILE" not in os.environ,
    )
    parser.add_argument(
        "--state-file",
        type=Path,
        default=os.environ.get("INFRAEGE_TRAFFIC_STATE_FILE"),
        required="INFRAEGE_TRAFFIC_STATE_FILE" not in os.environ,
    )
    parser.add_argument(
        "--container-name", default=os.environ.get("INFRAEGE_NGINX_CONTAINER", "infraege-nginx-1")
    )
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    uuid.UUID(args.source_id)
    if not 1 <= args.limit <= DEFAULT_LIMIT:
        parser.error(f"--limit must be between 1 and {DEFAULT_LIMIT}")
    return Config(
        journal_url=require_loopback_url(args.journal_url, "journal URL"),
        sre_kit_url=require_loopback_url(args.sre_kit_url, "sre-kit URL"),
        source_id=args.source_id,
        token_file=args.token_file.expanduser().resolve(),
        state_file=args.state_file.expanduser().resolve(),
        container_name=args.container_name,
        limit=args.limit,
    )


def main() -> int:
    try:
        entries, records = publish_once(parse_args())
    except (HTTPError, URLError) as error:
        status = f" HTTP {error.code}" if isinstance(error, HTTPError) else ""
        print(f"traffic publisher: transport failure{status}; cursor unchanged", file=sys.stderr)
        return 1
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"traffic publisher: {error}; cursor unchanged", file=sys.stderr)
        return 1
    print(f"traffic publisher: journal_entries={entries} access_records={records}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
