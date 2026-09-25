from __future__ import annotations

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    database_url: str = ""
    account_database_url: str = ""
    auth_csrf_secret: SecretStr = SecretStr("")
    public_origin: str = "http://localhost:8080"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: SecretStr = SecretStr("")
    mail_from: str = ""
    vk_client_id: str = ""
    vk_client_secret: SecretStr = SecretStr("")
    vk_app_id: str = ""
    vk_enabled: bool = False
    yandex_client_id: str = ""
    yandex_client_secret: SecretStr = SecretStr("")
    yandex_enabled: bool = False
    telegram_client_id: str = ""
    telegram_client_secret: SecretStr = SecretStr("")
    telegram_enabled: bool = False
    deploy_sha: str = "development"
    app_env: str = "development"
    log_level: str = "INFO"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


settings = Settings()
