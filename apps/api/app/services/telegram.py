"""5xx/unhandled-exception alerting via Telegram — docs/SPEC.md §7.2.

Deliberately not Sentry/GlitchTip (SPEC.md §7.2): a few lines of code, zero extra services.
"""

from __future__ import annotations

import logging

import httpx

from app.config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

logger = logging.getLogger(__name__)


async def send_alert(message: str) -> None:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Telegram alert skipped (not configured): %s", message)
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": message})
    except httpx.HTTPError:
        logger.exception("Failed to deliver Telegram alert")
