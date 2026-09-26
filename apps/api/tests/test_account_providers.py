import asyncio
import base64
import json
from urllib.parse import parse_qs, urlsplit

import httpx
import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from jwt.algorithms import RSAAlgorithm

from app.modules.account.providers import (
    TELEGRAM_JWKS_URL,
    ProviderError,
    ProviderSettings,
    authenticate_callback,
    authorization_url,
)

pytestmark = pytest.mark.pure

CALLBACK_URL = "https://infraege.example/api/auth/providers/telegram/callback"
SETTINGS = ProviderSettings(
    vk_client_id="vk-client",
    vk_client_secret="vk-secret",
    vk_app_id="vk-app",
    yandex_client_id="yandex-client",
    yandex_client_secret="yandex-secret",
    telegram_client_id="123456",
    telegram_client_secret="telegram-secret",
)


def run(coroutine):
    return asyncio.run(coroutine)


def test_authorization_urls_use_pinned_endpoints_pkce_and_only_telegram_gets_nonce():
    vk = urlsplit(
        authorization_url(
            "vk",
            SETTINGS,
            callback_url=CALLBACK_URL,
            state="state",
            code_challenge="challenge",
            nonce="nonce",
        )
    )
    yandex = urlsplit(
        authorization_url(
            "yandex",
            SETTINGS,
            callback_url=CALLBACK_URL,
            state="state",
            code_challenge="challenge",
            nonce="nonce",
        )
    )
    telegram = urlsplit(
        authorization_url(
            "telegram",
            SETTINGS,
            callback_url=CALLBACK_URL,
            state="state",
            code_challenge="challenge",
            nonce="nonce",
        )
    )

    assert (vk.scheme, vk.netloc, vk.path) == ("https", "id.vk.ru", "/authorize")
    assert parse_qs(vk.query) == {
        "client_id": ["vk-client"],
        "app_id": ["vk-app"],
        "redirect_uri": [CALLBACK_URL],
        "response_type": ["code"],
        "state": ["state"],
        "code_challenge": ["challenge"],
        "code_challenge_method": ["s256"],
        "sdk_type": ["vkid"],
    }
    assert parse_qs(yandex.query)["scope"] == ["login:info"]
    assert parse_qs(yandex.query)["code_challenge_method"] == ["S256"]
    assert parse_qs(telegram.query)["scope"] == ["openid profile"]
    assert parse_qs(telegram.query)["nonce"] == ["nonce"]


def test_vkid_exchange_and_user_info_return_only_stable_subject():
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/oauth2/auth":
            assert request.url.host == "id.vk.ru"
            assert dict(request.url.params)["code_verifier"] == "verifier"
            assert dict(request.url.params)["state"] == "state"
            assert dict(request.url.params)["device_id"] == "device-id"
            assert request.content == b"code=code"
            return httpx.Response(200, json={"access_token": "vk-access"})
        assert request.url == httpx.URL("https://id.vk.ru/oauth2/user_info?client_id=vk-client")
        assert request.content == b"access_token=vk-access"
        return httpx.Response(200, json={"user": {"user_id": 41, "email": "ignore@example"}})

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            return await authenticate_callback(
                "vk",
                SETTINGS,
                code="code",
                callback_url=CALLBACK_URL,
                code_verifier="verifier",
                nonce="unused",
                state="state",
                device_id="device-id",
                client=client,
            )

    assert run(scenario()).subject == "41"


def test_yandex_requires_userinfo_client_binding_before_returning_subject():
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        if request.url.host == "oauth.yandex.ru":
            assert (
                request.headers["authorization"]
                == "Basic " + base64.b64encode(b"yandex-client:yandex-secret").decode()
            )
            return httpx.Response(200, json={"access_token": "ya-access"})
        assert request.headers["authorization"] == "OAuth ya-access"
        return httpx.Response(200, json={"id": "yandex-subject", "client_id": "yandex-client"})

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            return await authenticate_callback(
                "yandex",
                SETTINGS,
                code="code",
                callback_url=CALLBACK_URL,
                code_verifier="verifier",
                nonce="unused",
                client=client,
            )

    assert run(scenario()).subject == "yandex-subject"
    assert [request.url.host for request in requests] == ["oauth.yandex.ru", "login.yandex.ru"]


def test_yandex_rejects_token_for_another_client():
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.host == "oauth.yandex.ru":
            return httpx.Response(200, json={"access_token": "ya-access"})
        return httpx.Response(200, json={"id": "subject", "client_id": "another-client"})

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            await authenticate_callback(
                "yandex",
                SETTINGS,
                code="code",
                callback_url=CALLBACK_URL,
                code_verifier="verifier",
                nonce="unused",
                client=client,
            )

    with pytest.raises(ProviderError, match="another client"):
        run(scenario())


def test_telegram_validates_jwks_signature_issuer_audience_expiry_and_nonce():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_jwk = json.loads(RSAAlgorithm.to_jwk(private_key.public_key()))
    public_jwk["kid"] = "telegram-key"
    token = jwt.encode(
        {
            "iss": "https://oauth.telegram.org",
            "aud": "123456",
            "sub": "telegram-subject",
            "nonce": "nonce",
            "iat": 1_700_000_000,
            "exp": 4_000_000_000,
        },
        private_key,
        algorithm="RS256",
        headers={"kid": "telegram-key"},
    )

    def handler(request: httpx.Request) -> httpx.Response:
        if str(request.url) == "https://oauth.telegram.org/token":
            assert (
                request.headers["authorization"]
                == "Basic " + base64.b64encode(b"123456:telegram-secret").decode()
            )
            return httpx.Response(200, json={"id_token": token})
        assert str(request.url) == TELEGRAM_JWKS_URL
        return httpx.Response(200, json={"keys": [public_jwk]})

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            return await authenticate_callback(
                "telegram",
                SETTINGS,
                code="code",
                callback_url=CALLBACK_URL,
                code_verifier="verifier",
                nonce="nonce",
                client=client,
            )

    assert run(scenario()).subject == "telegram-subject"


def test_authorization_rejects_non_https_callback_url():
    with pytest.raises(ProviderError, match="HTTPS"):
        authorization_url(
            "telegram",
            SETTINGS,
            callback_url="http://localhost/callback",
            state="state",
            code_challenge="challenge",
            nonce="nonce",
        )
