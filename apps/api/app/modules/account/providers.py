"""Small, server-side OAuth/OIDC adapters for the account boundary.

Tokens deliberately do not escape this module: callers receive only the stable
provider subject after the provider has validated the authorization code.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from typing import Literal
from urllib.parse import urlencode, urlsplit, urlunsplit

import httpx
import jwt

ProviderName = Literal["vk", "yandex", "telegram"]

VK_AUTHORIZE_URL = "https://id.vk.ru/authorize"
VK_TOKEN_URL = "https://id.vk.ru/oauth2/auth"
VK_USER_INFO_URL = "https://id.vk.ru/oauth2/user_info"
YANDEX_AUTHORIZE_URL = "https://oauth.yandex.ru/authorize"
YANDEX_TOKEN_URL = "https://oauth.yandex.ru/token"
YANDEX_USER_INFO_URL = "https://login.yandex.ru/info"
TELEGRAM_AUTHORIZE_URL = "https://oauth.telegram.org/auth"
TELEGRAM_TOKEN_URL = "https://oauth.telegram.org/token"
TELEGRAM_JWKS_URL = "https://oauth.telegram.org/.well-known/jwks.json"
TELEGRAM_ISSUER = "https://oauth.telegram.org"
REQUEST_TIMEOUT_SECONDS = 5.0


@dataclass(frozen=True)
class ProviderSettings:
    vk_client_id: str
    vk_client_secret: str
    vk_app_id: str
    yandex_client_id: str
    yandex_client_secret: str
    telegram_client_id: str
    telegram_client_secret: str


@dataclass(frozen=True)
class ProviderIdentity:
    provider: ProviderName
    subject: str


class ProviderError(Exception):
    """A safe failure intended to become one bounded callback response."""


def authorization_url(
    provider: ProviderName,
    settings: ProviderSettings,
    *,
    callback_url: str,
    state: str,
    code_challenge: str,
    nonce: str,
) -> str:
    """Build a provider-owned authorization URL without accepting endpoint input."""
    _require_callback_url(callback_url)
    _require_values(state=state, code_challenge=code_challenge)

    if provider == "vk":
        _require_values(client_id=settings.vk_client_id, app_id=settings.vk_app_id)
        return _with_query(
            VK_AUTHORIZE_URL,
            {
                "client_id": settings.vk_client_id,
                "app_id": settings.vk_app_id,
                "redirect_uri": callback_url,
                "response_type": "code",
                "state": state,
                "code_challenge": code_challenge,
                "code_challenge_method": "s256",
                "sdk_type": "vkid",
            },
        )
    if provider == "yandex":
        _require_values(client_id=settings.yandex_client_id)
        return _with_query(
            YANDEX_AUTHORIZE_URL,
            {
                "response_type": "code",
                "client_id": settings.yandex_client_id,
                "redirect_uri": callback_url,
                "scope": "login:info",
                "state": state,
                "code_challenge": code_challenge,
                "code_challenge_method": "S256",
            },
        )
    if provider == "telegram":
        _require_values(client_id=settings.telegram_client_id, nonce=nonce)
        return _with_query(
            TELEGRAM_AUTHORIZE_URL,
            {
                "client_id": settings.telegram_client_id,
                "redirect_uri": callback_url,
                "response_type": "code",
                "scope": "openid profile",
                "state": state,
                "nonce": nonce,
                "code_challenge": code_challenge,
                "code_challenge_method": "S256",
            },
        )
    raise ProviderError("unsupported provider")


async def authenticate_callback(
    provider: ProviderName,
    settings: ProviderSettings,
    *,
    code: str,
    callback_url: str,
    code_verifier: str,
    nonce: str,
    state: str = "",
    device_id: str = "",
    client: httpx.AsyncClient | None = None,
) -> ProviderIdentity:
    """Exchange one authorization code and return its verified stable identity."""
    _require_callback_url(callback_url)
    _require_values(code=code, code_verifier=code_verifier)
    if client is not None:
        return await _authenticate(
            provider, settings, code, callback_url, code_verifier, nonce, state, device_id, client
        )
    timeout = httpx.Timeout(REQUEST_TIMEOUT_SECONDS)
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=False) as owned_client:
        return await _authenticate(
            provider,
            settings,
            code,
            callback_url,
            code_verifier,
            nonce,
            state,
            device_id,
            owned_client,
        )


async def _authenticate(
    provider: ProviderName,
    settings: ProviderSettings,
    code: str,
    callback_url: str,
    code_verifier: str,
    nonce: str,
    state: str,
    device_id: str,
    client: httpx.AsyncClient,
) -> ProviderIdentity:
    if provider == "vk":
        _require_values(
            client_id=settings.vk_client_id,
            app_id=settings.vk_app_id,
            state=state,
            device_id=device_id,
        )
        token = await _form_post(
            client,
            _with_query(
                VK_TOKEN_URL,
                {
                    "grant_type": "authorization_code",
                    "redirect_uri": callback_url,
                    "client_id": settings.vk_client_id,
                    "app_id": settings.vk_app_id,
                    "code_verifier": code_verifier,
                    "state": state,
                    "device_id": device_id,
                },
            ),
            {"code": code},
        )
        access_token = _required_string(token, "access_token")
        user_info = await _form_post(
            client,
            _with_query(VK_USER_INFO_URL, {"client_id": settings.vk_client_id}),
            {"access_token": access_token},
        )
        user = user_info.get("user")
        if not isinstance(user, Mapping):
            raise ProviderError("invalid VK identity response")
        return ProviderIdentity("vk", _required_subject(user, "user_id"))

    if provider == "yandex":
        _require_values(
            client_id=settings.yandex_client_id, client_secret=settings.yandex_client_secret
        )
        token = await _form_post(
            client,
            YANDEX_TOKEN_URL,
            {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": callback_url,
                "code_verifier": code_verifier,
            },
            auth=(settings.yandex_client_id, settings.yandex_client_secret),
        )
        access_token = _required_string(token, "access_token")
        user_info = await _get_json(
            client, YANDEX_USER_INFO_URL, {"Authorization": f"OAuth {access_token}"}
        )
        if user_info.get("client_id") != settings.yandex_client_id:
            raise ProviderError("Yandex token was issued to another client")
        return ProviderIdentity("yandex", _required_subject(user_info, "id"))

    if provider == "telegram":
        _require_values(
            client_id=settings.telegram_client_id,
            client_secret=settings.telegram_client_secret,
            nonce=nonce,
        )
        token = await _form_post(
            client,
            TELEGRAM_TOKEN_URL,
            {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": callback_url,
                "client_id": settings.telegram_client_id,
                "code_verifier": code_verifier,
            },
            auth=(settings.telegram_client_id, settings.telegram_client_secret),
        )
        claims = await _verify_telegram_id_token(
            _required_string(token, "id_token"), settings.telegram_client_id, nonce, client
        )
        return ProviderIdentity("telegram", _required_subject(claims, "sub"))

    raise ProviderError("unsupported provider")


async def _verify_telegram_id_token(
    token: str, client_id: str, nonce: str, client: httpx.AsyncClient
) -> Mapping[str, object]:
    try:
        header = jwt.get_unverified_header(token)
    except jwt.PyJWTError as error:
        raise ProviderError("invalid Telegram ID token") from error
    algorithm = header.get("alg")
    key_id = header.get("kid")
    if algorithm not in {"RS256", "ES256"} or not isinstance(key_id, str) or not key_id:
        raise ProviderError("invalid Telegram ID token header")

    jwks = await _get_json(client, TELEGRAM_JWKS_URL, {})
    keys = jwks.get("keys")
    if not isinstance(keys, list):
        raise ProviderError("invalid Telegram JWKS")
    jwk = next((key for key in keys if isinstance(key, dict) and key.get("kid") == key_id), None)
    if jwk is None:
        raise ProviderError("Telegram signing key not found")
    try:
        signing_key = jwt.PyJWK.from_dict(jwk)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=[algorithm],
            audience=client_id,
            issuer=TELEGRAM_ISSUER,
            options={"require": ["aud", "exp", "iat", "iss", "nonce", "sub"]},
        )
    except jwt.PyJWTError as error:
        raise ProviderError("invalid Telegram ID token") from error
    if claims.get("nonce") != nonce:
        raise ProviderError("Telegram ID token nonce mismatch")
    return claims


async def _form_post(
    client: httpx.AsyncClient,
    url: str,
    data: Mapping[str, str],
    *,
    auth: tuple[str, str] | None = None,
) -> Mapping[str, object]:
    try:
        if auth is None:
            response = await client.post(url, data=data)
        else:
            response = await client.post(url, data=data, auth=auth)
        response.raise_for_status()
        value = response.json()
    except (httpx.HTTPError, ValueError) as error:
        raise ProviderError("provider request failed") from error
    if not isinstance(value, dict):
        raise ProviderError("invalid provider response")
    return value


async def _get_json(
    client: httpx.AsyncClient, url: str, headers: Mapping[str, str]
) -> Mapping[str, object]:
    try:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        value = response.json()
    except (httpx.HTTPError, ValueError) as error:
        raise ProviderError("provider request failed") from error
    if not isinstance(value, dict):
        raise ProviderError("invalid provider response")
    return value


def _required_string(value: Mapping[str, object], field: str) -> str:
    result = value.get(field)
    if not isinstance(result, str) or not result:
        raise ProviderError(f"provider response lacks {field}")
    return result


def _required_subject(value: Mapping[str, object], field: str) -> str:
    result = value.get(field)
    if isinstance(result, int):
        result = str(result)
    if not isinstance(result, str) or not result or len(result) > 255:
        raise ProviderError("invalid provider subject")
    return result


def _require_values(**values: str) -> None:
    if any(not value for value in values.values()):
        raise ProviderError("provider configuration or authorization data is missing")


def _require_callback_url(value: str) -> None:
    parsed = urlsplit(value)
    if (
        parsed.scheme != "https"
        or not parsed.netloc
        or parsed.username
        or parsed.password
        or parsed.fragment
    ):
        raise ProviderError("callback URL must be an absolute HTTPS URL")


def _with_query(url: str, values: Mapping[str, str]) -> str:
    parsed = urlsplit(url)
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, urlencode(values), ""))
