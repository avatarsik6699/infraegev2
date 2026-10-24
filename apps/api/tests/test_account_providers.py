import asyncio
import base64
from urllib.parse import parse_qs, urlsplit

import httpx
import pytest

from app.modules.account.providers import (
    ProviderError,
    ProviderSettings,
    authenticate_callback,
    authorization_url,
)

pytestmark = pytest.mark.pure

CALLBACK_URL = "https://infraege.example/api/auth/providers/yandex/callback"
SETTINGS = ProviderSettings(
    vk_client_id="vk-client",
    vk_client_secret="vk-secret",
    vk_app_id="vk-app",
    yandex_client_id="yandex-client",
    yandex_client_secret="yandex-secret",
)


def run(coroutine):
    return asyncio.run(coroutine)


def test_authorization_urls_use_pinned_endpoints_and_pkce():
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
    # Change 198: Telegram sign-in is gone (a foreign service, 149-ФЗ ст. 10 ч. 8)
    with pytest.raises(ProviderError, match="unsupported"):
        authorization_url(
            "telegram",  # type: ignore[arg-type]
            SETTINGS,
            callback_url=CALLBACK_URL,
            state="state",
            code_challenge="challenge",
            nonce="nonce",
        )


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


def test_authorization_rejects_non_https_callback_url():
    with pytest.raises(ProviderError, match="HTTPS"):
        authorization_url(
            "yandex",
            SETTINGS,
            callback_url="http://localhost/callback",
            state="state",
            code_challenge="challenge",
            nonce="nonce",
        )
