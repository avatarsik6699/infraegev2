from __future__ import annotations

import os
from pathlib import Path

# Local dev: apps/api/app/config.py -> apps/api/app -> apps/api -> apps -> <repo root>/content.
# In the container image (apps/api/Dockerfile), content is copied to /content instead, since only
# apps/api/app is copied in — CONTENT_DIR overrides the relative-path guess in that case.
_DEFAULT_CONTENT_DIR = Path(__file__).resolve().parents[3] / "content"
CONTENT_DIR = Path(os.environ.get("CONTENT_DIR", str(_DEFAULT_CONTENT_DIR)))
TASKS_DIR = CONTENT_DIR / "tasks"

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")
