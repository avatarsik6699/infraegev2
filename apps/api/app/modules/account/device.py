"""The browser behind a sign-in (Change 198, SPEC §6.2): a random device cookie, a coarse
label from the User-Agent, the address Nginx saw and a city from a local offline database.
No fingerprinting, no external lookups."""

from __future__ import annotations

import ipaddress
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Any

import maxminddb
import structlog
from fastapi import Request, Response

from app.core.config import settings
from app.modules.account.security import new_token, token_hash

logger = structlog.get_logger(__name__)
DEVICE_SECONDS = 400 * 24 * 3600

BROWSERS = (
    ("Яндекс Браузер", re.compile(r"YaBrowser/")),
    ("Edge", re.compile(r"Edg(?:e|A|iOS)?/")),
    ("Opera", re.compile(r"OPR/|Opera")),
    ("Firefox", re.compile(r"Firefox/|FxiOS/")),
    ("Chrome", re.compile(r"Chrome/|CriOS/")),
    ("Safari", re.compile(r"Safari/")),
)
SYSTEMS = (
    ("Android", re.compile(r"Android")),
    ("iPhone", re.compile(r"iPhone")),
    ("iPad", re.compile(r"iPad")),
    ("Windows", re.compile(r"Windows")),
    ("macOS", re.compile(r"Mac OS X|Macintosh")),
    ("Linux", re.compile(r"Linux|X11")),
)


@dataclass(frozen=True)
class Device:
    """What the session remembers about its browser; `hash` keys the device cookie."""

    hash: str
    label: str
    ip: str | None
    city: str | None


def cookie_name() -> str:
    return "__Host-kodumka_device" if settings.is_production else "kodumka_device"


def label_of(user_agent: str | None) -> str:
    agent = user_agent or ""
    browser = next((name for name, pattern in BROWSERS if pattern.search(agent)), "Браузер")
    system = next((name for name, pattern in SYSTEMS if pattern.search(agent)), None)
    return f"{browser} · {system}" if system else browser


def client_ip(request: Request) -> str | None:
    """The address Nginx put in X-Real-IP. Server-side calls of the site reach the API
    directly, without it, and so never overwrite the viewer's address."""
    value = request.headers.get("x-real-ip", "").strip()
    try:
        return str(ipaddress.ip_address(value)) if value else None
    except ValueError:
        return None


@lru_cache(maxsize=1)
def _reader(path: str) -> Any:
    return maxminddb.open_database(path)


def city_of(ip: str | None) -> str | None:
    """The city in Russian (English as a fallback) or None: no database, no record."""
    if not ip or not settings.geoip_city_database:
        return None
    try:
        record = _reader(settings.geoip_city_database).get(ip)
    except (OSError, ValueError, maxminddb.InvalidDatabaseError) as exc:
        logger.warning("account.geoip_unavailable", error_type=type(exc).__name__)
        return None
    names = (record or {}).get("city", {}).get("names", {}) if isinstance(record, dict) else {}
    name = names.get("ru") or names.get("en")
    return str(name)[:80] if name else None


def device_of(request: Request) -> tuple[Device, str | None]:
    """The device of this request and a new cookie value when the browser has none."""
    raw = request.cookies.get(cookie_name())
    fresh = None
    if not raw or len(raw) > 256 or not raw.isascii():
        raw = fresh = new_token()
    ip = client_ip(request)
    return (
        Device(
            hash=token_hash(raw),
            label=label_of(request.headers.get("user-agent"))[:80],
            ip=ip,
            city=city_of(ip),
        ),
        fresh,
    )


def set_device_cookie(response: Response, value: str) -> None:
    response.set_cookie(
        cookie_name(),
        value,
        max_age=DEVICE_SECONDS,
        secure=settings.is_production,
        httponly=True,
        samesite="lax",
        path="/",
    )
