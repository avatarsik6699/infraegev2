from __future__ import annotations

from typing import Literal, Self

from pydantic import SecretStr, model_validator
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
    # Change 198: DB-IP Lite city database (mmdb); empty or missing means no city
    geoip_city_database: str = ""
    # Change 192 (SPEC §6.1): both flags stay off until launch; while the paywall is
    # off every material is free, while billing is off checkout is unavailable.
    paywall_enabled: bool = False
    billing_enabled: bool = False
    billing_provider: Literal["fake", "robokassa"] = "fake"
    billing_month_price_kopecks: int = 49_000
    billing_month_days: int = 30
    billing_year_price_kopecks: int = 299_000
    billing_year_days: int = 365
    # НПД yearly income limit; new checkouts pause at 95 % of it (SPEC §7.3)
    billing_npd_limit_kopecks: int = 240_000_000
    billing_operator_email: str = ""
    # Change 198: the address students write to, also to appeal a restriction
    contact_email: str = "kodumka@mail.ru"
    robokassa_merchant_login: str = ""
    robokassa_password1: SecretStr = SecretStr("")
    robokassa_password2: SecretStr = SecretStr("")
    # Password #3 signs Refund API requests (JWT, HS256)
    robokassa_password3: SecretStr = SecretStr("")
    # the hash algorithm chosen in the shop's technical settings
    robokassa_hash: Literal["md5", "sha256", "sha512"] = "sha256"
    robokassa_test: bool = False
    deploy_sha: str = "development"
    app_env: str = "development"
    log_level: str = "INFO"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @model_validator(mode="after")
    def billing_consistent(self) -> Self:
        if self.paywall_enabled and not self.billing_enabled:
            raise ValueError("PAYWALL_ENABLED requires BILLING_ENABLED: nobody could pay")
        if self.billing_enabled and self.is_production:
            if self.billing_provider != "robokassa":
                raise ValueError("production billing needs BILLING_PROVIDER=robokassa")
            if not (
                self.robokassa_merchant_login
                and self.robokassa_password1.get_secret_value()
                and self.robokassa_password2.get_secret_value()
            ):
                raise ValueError("production billing needs the Robokassa credentials")
        return self


settings = Settings()
