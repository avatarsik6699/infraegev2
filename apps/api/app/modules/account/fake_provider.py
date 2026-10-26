"""Change 227: a local stand-in for VK ID and Яндекс ID.

With `AUTH_FAKE_PROVIDERS` (refused in production, see `Settings`) the sign-in start sends the
browser to a small page here instead of the provider; it chooses a subject and returns to the real
callback, which then runs the same account code as with a real provider. Only the code exchange is
replaced: the code *is* the subject.
"""

from __future__ import annotations

import re
from html import escape
from typing import Annotated
from urllib.parse import urlencode

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import HTMLResponse

from app.core.config import settings
from app.modules.account.providers import ProviderError, ProviderIdentity, ProviderName

router = APIRouter(prefix="/auth/fake-provider", include_in_schema=False)
SUBJECT = re.compile(r"[A-Za-z0-9_-]{1,64}")
LABELS: dict[str, str] = {"vk": "VK ID", "yandex": "Яндекс ID"}


def enabled() -> bool:
    return settings.auth_fake_providers and not settings.is_production


def authorization_url(provider: ProviderName, state: str) -> str:
    return f"/api/auth/fake-provider/{provider}?{urlencode({'state': state})}"


def identity(provider: ProviderName, code: str) -> ProviderIdentity:
    if not SUBJECT.fullmatch(code):
        raise ProviderError("invalid fake subject")
    return ProviderIdentity(provider, code)


@router.get("/{provider}", response_class=HTMLResponse)
async def authorize(
    provider: str, state: Annotated[str, Query(min_length=20, max_length=256)]
) -> HTMLResponse:
    if not enabled() or provider not in LABELS:
        raise HTTPException(404, "not found")
    action = f"/api/auth/providers/{provider}/callback"
    label = LABELS[provider]
    hidden = f'<input type="hidden" name="state" value="{escape(state)}">'
    return HTMLResponse(
        f"""<!doctype html><html lang="ru"><meta charset="utf-8">
<title>Подставной {label}</title>
<h1>Подставной {label}</h1>
<p>Только для локальной разработки. Один и тот же идентификатор — один и тот же аккаунт {label}.</p>
<form method="get" action="{action}">{hidden}
<label>Идентификатор
<input name="code" value="{provider}-user-1" pattern="[A-Za-z0-9_\\-]{{1,64}}" required></label>
<button type="submit">Войти</button></form>
<form method="get" action="{action}">{hidden}
<input type="hidden" name="error" value="access_denied">
<button type="submit">Отказаться</button></form>
</html>""",
        headers={"Cache-Control": "no-store"},
    )
