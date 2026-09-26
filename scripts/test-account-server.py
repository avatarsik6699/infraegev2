#!/usr/bin/env python3
"""Run the account API for browser acceptance with a private synthetic mailbox.

This is test-process glue, never a production server or a public test endpoint.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import stat
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
API_ROOT = ROOT / "apps" / "api"
sys.path.insert(0, str(API_ROOT))
LISTEN_HOST = "127.0.0.2"
LISTEN_PORT = 8100


def require_isolated_url(name: str, role: str) -> None:
    value = os.environ.get(name, "")
    parsed = urlparse(value)
    if not (
        parsed.scheme in {"postgresql", "postgresql+asyncpg"}
        and parsed.hostname == "127.0.0.1"
        and parsed.port == 15432
        and parsed.username == role
        and parsed.path == "/infraege"
        and not parsed.query
        and not parsed.fragment
    ):
        raise SystemExit(f"{name} must select isolated {role} at 127.0.0.1:15432/infraege")


def mailbox_path() -> Path:
    raw = os.environ.get("INFRAEGE_ACCOUNT_MAILBOX", "")
    path = Path(raw)
    if not path.is_absolute() or path.name != "mailbox.json":
        raise SystemExit("INFRAEGE_ACCOUNT_MAILBOX must be an absolute mailbox.json path")
    parent = path.parent
    try:
        details = parent.lstat()
    except FileNotFoundError as exc:
        raise SystemExit("synthetic mailbox directory must be created by the test fixture") from exc
    if not stat.S_ISDIR(details.st_mode) or stat.S_ISLNK(details.st_mode):
        raise SystemExit("synthetic mailbox directory must be a real directory")
    if details.st_uid != os.getuid() or stat.S_IMODE(details.st_mode) & 0o077:
        raise SystemExit("synthetic mailbox directory must not be group or world accessible")
    if path.exists() or path.is_symlink():
        raise SystemExit("synthetic mailbox must be empty before the account server starts")
    return path


def validate_environment() -> Path:
    if os.environ.get("APP_ENV") != "development":
        raise SystemExit("account browser server requires APP_ENV=development")
    if os.environ.get("PUBLIC_ORIGIN") != "http://127.0.0.2:3100":
        raise SystemExit("account browser server requires the loopback frontend origin")
    if os.environ.get("SMTP_HOST") != "synthetic-mailbox" or not os.environ.get("MAIL_FROM"):
        raise SystemExit("account browser server requires the synthetic mailbox mail configuration")
    if os.environ.get("SMTP_USERNAME") or os.environ.get("SMTP_PASSWORD"):
        raise SystemExit("account browser server refuses SMTP credentials")
    if len(os.environ.get("AUTH_CSRF_SECRET", "")) < 32:
        raise SystemExit("account browser server requires an isolated AUTH_CSRF_SECRET")
    require_isolated_url("DATABASE_URL", "infraege_runtime")
    require_isolated_url("ACCOUNT_DATABASE_URL", "infraege_app")
    return mailbox_path()


def validate_listener(host: str, port: int) -> None:
    if host != LISTEN_HOST or port != LISTEN_PORT:
        raise SystemExit(f"account browser server must listen on {LISTEN_HOST}:{LISTEN_PORT}")


async def verify_connected_identity(name: str, role: str) -> None:
    import asyncpg

    url = os.environ[name].replace("postgresql+asyncpg://", "postgresql://", 1)
    connection = await asyncpg.connect(url, timeout=5)
    try:
        identity = await connection.fetchrow("SELECT current_user, current_database()")
    finally:
        await connection.close()
    if (
        identity is None
        or identity["current_user"] != role
        or identity["current_database"] != "infraege"
    ):
        raise SystemExit(f"{name} did not connect as isolated {role} to infraege")


def verify_database_identities() -> None:
    asyncio.run(verify_connected_identity("DATABASE_URL", "infraege_runtime"))
    asyncio.run(verify_connected_identity("ACCOUNT_DATABASE_URL", "infraege_app"))


def write_mailbox(mailbox: Path, value: dict[str, str]) -> None:
    temporary = mailbox.with_name(f".{mailbox.name}.tmp")
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    descriptor = os.open(temporary, flags, 0o600)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as target:
            target.write(json.dumps(value))
            target.flush()
            os.fsync(target.fileno())
        temporary.replace(mailbox)
        mailbox.chmod(0o600)
    finally:
        if temporary.exists() or temporary.is_symlink():
            temporary.unlink()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", required=True)
    parser.add_argument("--port", required=True, type=int)
    args = parser.parse_args()
    validate_listener(args.host, args.port)
    mailbox = validate_environment()
    verify_database_identities()

    from app.modules.account import api as account_api

    async def capture_mail(recipient: str, subject: str, body: str) -> None:
        write_mailbox(mailbox, {"recipient": recipient, "subject": subject, "body": body})

    account_api.send_account_mail = capture_mail

    import uvicorn

    uvicorn.run("app.main:app", host=args.host, port=args.port, log_level="warning")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
