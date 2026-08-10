from __future__ import annotations

from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# apps/api/app/core/config.py -> core -> app -> apps/api -> apps -> <repo root>/content.
# In the container image (apps/api/Dockerfile), only apps/api/app is copied in (to /app/app/...,
# a shallower tree than the real repo) and CONTENT_DIR=/content is set explicitly — parents[4]
# doesn't exist there, so this must not raise before the env var override is even considered.
try:
    _DEFAULT_CONTENT_DIR = Path(__file__).resolve().parents[4] / "content"
except IndexError:
    _DEFAULT_CONTENT_DIR = Path("/content")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    content_dir: Path = _DEFAULT_CONTENT_DIR
    database_url: str = ""
    deploy_sha: str = "development"
    app_env: str = "development"
    log_level: str = "INFO"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def tasks_dir(self) -> Path:
        return self.content_dir / "tasks"

    @model_validator(mode="after")
    def _validate_content_dir(self) -> Settings:
        if not self.content_dir.exists():
            raise RuntimeError(f"CONTENT_DIR does not exist: {self.content_dir}")
        return self


settings = Settings()
