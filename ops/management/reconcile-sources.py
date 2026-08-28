#!/usr/bin/env python3
"""Reconcile the clean infraegev2 Project and seven sre-kit Sources over verified TLS."""

from __future__ import annotations

import http.client
import http.cookiejar
import json
import os
import stat
import sys
import tempfile
from pathlib import Path
from typing import Any
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import HTTPCookieProcessor, Request, build_opener

API_ORIGIN = os.environ.get("SRE_KIT_API_ORIGIN", "https://sre.infraege.ru")
SOURCE_ENV = Path(os.environ.get("SRE_KIT_SOURCE_ENV", "/etc/infraege/sre-kit-sources.env"))
TOKEN_FILE = Path(
    os.environ.get("SRE_KIT_TRAFFIC_TOKEN_FILE", "/etc/infraege/sre-kit-traffic-token")
)
PUBLISHER_ENV = Path(os.environ.get("SRE_KIT_PUBLISHER_ENV", "/etc/infraege/sre-kit-traffic.env"))
EXPECTED_NAMES = {
    "Public availability",
    "Host resources",
    "Security bans",
    "Application journal",
    "Container telemetry",
    "Product analytics",
    "Nginx traffic",
}
SECRET_FIELDS = {
    "Host resources": {"secret"},
    "Security bans": {"secret"},
    "Container telemetry": {"password"},
    "Product analytics": {"password"},
}
BESZEL_MANAGEMENT_HOST = "10.77.0.1"
BESZEL_MANAGEMENT_PORT = 8090


def require_private(path: Path) -> None:
    info = path.stat()
    if not stat.S_ISREG(info.st_mode) or stat.S_IMODE(info.st_mode) != 0o600:
        raise RuntimeError(f"protected input must be a mode-600 regular file: {path}")


def load_env(path: Path) -> dict[str, str]:
    require_private(path)
    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        if not raw or raw.startswith("#"):
            continue
        key, separator, value = raw.partition("=")
        if separator != "=" or not key or key in values or "\x00" in value:
            raise RuntimeError("source env has an invalid shape")
        values[key] = value
    required = {
        "INFRAEGE_TARGET_SSH_PASSWORD",
        "INFRAEGE_TARGET_HOST_KEY_FINGERPRINT",
        "INFRAEGE_BESZEL_EMAIL",
        "INFRAEGE_BESZEL_PASSWORD",
        "INFRAEGE_BESZEL_SYSTEM_NAME",
        "INFRAEGE_UMAMI_USERNAME",
        "INFRAEGE_UMAMI_PASSWORD",
        "INFRAEGE_UMAMI_WEBSITE_ID",
    }
    if values.keys() != required or any(not values[key] for key in required):
        raise RuntimeError("source env does not match the exact required contract")
    return values


class API:
    def __init__(self, password: str) -> None:
        jar = http.cookiejar.CookieJar()
        self.opener = build_opener(HTTPCookieProcessor(jar))
        self.request("POST", "/api/auth/login", {"password": password}, expected={204})

    def request(
        self, method: str, path: str, payload: object | None = None, *, expected: set[int]
    ) -> Any:
        body = None if payload is None else json.dumps(payload, separators=(",", ":")).encode()
        request = Request(f"{API_ORIGIN}{path}", data=body, method=method)
        request.add_header("Accept", "application/json")
        if body is not None:
            request.add_header("Content-Type", "application/json")
        try:
            with self.opener.open(request, timeout=15) as response:
                raw = response.read(4 * 1024 * 1024 + 1)
                if response.status not in expected or len(raw) > 4 * 1024 * 1024:
                    raise RuntimeError(f"unexpected sre-kit response for {method} {path}")
        except HTTPError as error:
            error.close()
            raise RuntimeError(f"sre-kit returned HTTP {error.code} for {method} {path}") from None
        return json.loads(raw) if raw else None


def beszel_request(
    method: str, path: str, payload: object | None = None, *, token: str = ""
) -> Any:
    connection = http.client.HTTPConnection(
        BESZEL_MANAGEMENT_HOST, BESZEL_MANAGEMENT_PORT, timeout=15
    )
    headers = {"Accept": "application/json"}
    body = None
    if payload is not None:
        body = json.dumps(payload, separators=(",", ":"))
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = token
    try:
        connection.request(method, path, body=body, headers=headers)
        response = connection.getresponse()
        raw = response.read(4 * 1024 * 1024 + 1)
        if response.status < 200 or response.status >= 300 or len(raw) > 4 * 1024 * 1024:
            raise RuntimeError(f"unexpected Beszel response for {method} {path}")
        return json.loads(raw) if raw else None
    finally:
        connection.close()


def discover_beszel_system_id(env: dict[str, str]) -> str:
    auth = beszel_request(
        "POST",
        "/api/collections/users/auth-with-password",
        {"identity": env["INFRAEGE_BESZEL_EMAIL"], "password": env["INFRAEGE_BESZEL_PASSWORD"]},
    )
    token = auth.get("token") if isinstance(auth, dict) else None
    if not token:
        raise RuntimeError("Beszel authentication response had no token")
    query = urlencode({"filter": f'name="{env["INFRAEGE_BESZEL_SYSTEM_NAME"]}"', "perPage": "2"})
    systems = beszel_request("GET", f"/api/collections/systems/records?{query}", token=str(token))
    items = systems.get("items", []) if isinstance(systems, dict) else []
    if len(items) != 1 or not items[0].get("id"):
        raise RuntimeError("Beszel system discovery requires exactly one named system")
    return str(items[0]["id"])


def desired_sources(env: dict[str, str], beszel_system_id: str) -> list[dict[str, Any]]:
    target_host = "2.26.8.245"
    ssh_common = {
        "host": target_host,
        "port": 22,
        "username": "root",
        "auth_method": "password",
        "secret": env["INFRAEGE_TARGET_SSH_PASSWORD"],
        "host_key_fingerprint": env["INFRAEGE_TARGET_HOST_KEY_FINGERPRINT"],
    }
    return [
        {
            "name": "Public availability",
            "adapter_id": "uptime-http",
            "config": {
                "url": "https://infraege.ru/health/ready",
                "method": "GET",
                "expect_status": 200,
                "tls_expiry_warn_days": 14,
            },
        },
        {"name": "Host resources", "adapter_id": "host-metrics-ssh", "config": ssh_common},
        {
            "name": "Security bans",
            "adapter_id": "fail2ban-ssh",
            "config": {**ssh_common, "lookback_seconds": 120},
        },
        {
            "name": "Application journal",
            "adapter_id": "journal-http",
            "config": {
                "host": "10.77.0.1",
                "port": 19531,
                "https": False,
                "min_priority": 6,
                "lookback_seconds": 120,
                "parse_json_message": True,
            },
        },
        {
            "name": "Container telemetry",
            "adapter_id": "beszel-api",
            "config": {
                "base_url": "http://10.77.0.1:8090",
                "system_id": beszel_system_id,
                "email": env["INFRAEGE_BESZEL_EMAIL"],
                "password": env["INFRAEGE_BESZEL_PASSWORD"],
                "auth_collection": "users",
                "lookback_seconds": 120,
                "require_container_stats": True,
            },
        },
        {
            "name": "Product analytics",
            "adapter_id": "umami-http",
            "config": {
                "base_url": "http://10.77.0.1:3001",
                "website_id": env["INFRAEGE_UMAMI_WEBSITE_ID"],
                "username": env["INFRAEGE_UMAMI_USERNAME"],
                "password": env["INFRAEGE_UMAMI_PASSWORD"],
                "lookback_seconds": 3600,
                "tracked_events": [
                    "lesson_opened",
                    "theory_section_viewed",
                    "practice_started",
                    "practice_answer_checked",
                    "lesson_completed",
                    "continuation_opened",
                ],
                "dimensions": [
                    "url",
                    "referrer",
                    "country",
                    "region",
                    "city",
                    "browser",
                    "os",
                    "device",
                    "language",
                ],
            },
        },
        {"name": "Nginx traffic", "adapter_id": "push", "config": {}},
    ]


def atomic_private_write(path: Path, value: str) -> None:
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            stream.write(value)
        os.replace(temporary, path)
    except BaseException:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass
        raise


def reconcile(api: API, env: dict[str, str]) -> None:
    beszel_system_id = discover_beszel_system_id(env)
    projects = api.request("GET", "/api/projects", expected={200})
    matches = [project for project in projects if project["slug"] == "infraegev2"]
    if len(matches) > 1:
        raise RuntimeError("multiple infraegev2 Projects exist")
    if matches:
        project = matches[0]
    else:
        project = api.request(
            "POST",
            "/api/projects",
            {
                "slug": "infraegev2",
                "name": "infraegev2",
                "description": "Public learning product and its production infrastructure",
            },
            expected={201},
        )

    current = api.request("GET", "/api/sources", expected={200})
    project_sources = [source for source in current if source["project_id"] == project["id"]]
    names = {source["name"] for source in project_sources}
    unexpected = names - EXPECTED_NAMES
    if unexpected or len(project_sources) != len(names):
        raise RuntimeError("project contains unexpected or duplicate Sources")
    by_name = {source["name"]: source for source in project_sources}

    for desired in desired_sources(env, beszel_system_id):
        existing = by_name.get(desired["name"])
        if existing is None:
            created = api.request(
                "POST",
                "/api/sources",
                {**desired, "project_id": project["id"]},
                expected={201},
            )
            by_name[desired["name"]] = created
            continue
        if existing["adapter_id"] != desired["adapter_id"]:
            raise RuntimeError(f"Source {desired['name']} uses an unexpected adapter")
        current_config = json.loads(existing["config"])
        reconciled = dict(desired["config"])
        secret_fields = SECRET_FIELDS.get(desired["name"], set())
        for field in secret_fields:
            if field not in current_config:
                raise RuntimeError(f"Source {desired['name']} lost its protected secret reference")
        patch: dict[str, object] = {}
        # The API response intentionally exposes only opaque refs, so it cannot prove that the
        # protected operator input still matches the encrypted value. Refresh secret-bearing
        # configs on each explicit reconciliation; sre-kit atomically replaces each ref and
        # deletes the superseded secret while keeping plaintext out of persisted config.
        if secret_fields or current_config != reconciled:
            patch["config"] = reconciled
        if not existing["enabled"]:
            patch["enabled"] = True
        if patch:
            api.request("PATCH", f"/api/sources/{existing['id']}", patch, expected={200})

    final = api.request("GET", "/api/sources", expected={200})
    project_sources = [source for source in final if source["project_id"] == project["id"]]
    if (
        len(project_sources) != 7
        or {source["name"] for source in project_sources} != EXPECTED_NAMES
    ):
        raise RuntimeError("clean Source reconciliation did not produce exactly seven Sources")
    if not all(source["enabled"] for source in project_sources):
        raise RuntimeError("one or more reconciled Sources are disabled")

    traffic = next(source for source in project_sources if source["name"] == "Nginx traffic")
    if not TOKEN_FILE.exists():
        token = api.request("POST", f"/api/sources/{traffic['id']}/ingest-token", expected={201})[
            "token"
        ]
        atomic_private_write(TOKEN_FILE, f"{token}\n")
    else:
        require_private(TOKEN_FILE)
    publisher = "\n".join(
        [
            "INFRAEGE_JOURNAL_URL=http://10.77.0.1:19531",
            "INFRAEGE_SRE_KIT_URL=http://127.0.0.1:18080",
            f"INFRAEGE_SRE_KIT_SOURCE_ID={traffic['id']}",
            f"INFRAEGE_SRE_KIT_TOKEN_FILE={TOKEN_FILE}",
            "INFRAEGE_TRAFFIC_STATE_FILE=/var/lib/infraege-sre-kit/traffic-cursor.json",
            "INFRAEGE_NGINX_CONTAINER=infraege-nginx-1",
            "",
        ]
    )
    atomic_private_write(PUBLISHER_ENV, publisher)
    print("reconciled project=infraegev2 sources=7 enabled=7")


def main() -> int:
    try:
        env = load_env(SOURCE_ENV)
        password = sys.stdin.readline().rstrip("\n")
        if not 24 <= len(password.encode()) <= 1024:
            raise RuntimeError("admin password input has an invalid length")
        reconcile(API(password), env)
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"source reconciliation failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
