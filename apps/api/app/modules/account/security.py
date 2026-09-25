"""Small cryptographic and navigation primitives for the account boundary."""

from __future__ import annotations

import hashlib
import hmac
import secrets
from urllib.parse import urlsplit

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

PASSWORD_HASHER = PasswordHasher()
DUMMY_PASSWORD_HASH = PASSWORD_HASHER.hash("this account does not exist")


def new_token() -> str:
    return secrets.token_urlsafe(32)


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("ascii")).hexdigest()


def token_matches(expected_hash: str, token: str) -> bool:
    try:
        actual = token_hash(token)
    except UnicodeEncodeError:
        return False
    return hmac.compare_digest(expected_hash, actual)


def csrf_token(session_token: str, secret: str) -> str:
    if len(secret) < 32:
        raise ValueError("CSRF secret must be at least 32 characters")
    return hmac.new(
        secret.encode("utf-8"), session_token.encode("ascii"), hashlib.sha256
    ).hexdigest()


def csrf_matches(session_token: str, secret: str, submitted: str) -> bool:
    if len(submitted) != 64 or not submitted.isascii():
        return False
    try:
        expected = csrf_token(session_token, secret)
    except UnicodeEncodeError:
        return False
    return hmac.compare_digest(expected, submitted)


def hash_password(password: str) -> str:
    return PASSWORD_HASHER.hash(password)


def verify_password(encoded: str | None, password: str) -> bool:
    try:
        return bool(PASSWORD_HASHER.verify(encoded or DUMMY_PASSWORD_HASH, password))
    except (InvalidHashError, VerificationError):
        return False


def safe_return_path(value: str | None) -> str:
    """Accept only a local absolute path, never a protocol-relative or encoded escape."""
    if not value or len(value) > 2048 or not value.startswith("/") or value.startswith("//"):
        return "/"
    if any(ord(char) < 32 or char == "\\" for char in value):
        return "/"
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or parsed.fragment or parsed.path.startswith("//"):
        return "/"
    return value
