"""Bounded public requests and private account projections."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


# The current edition of the consent page (SPEC §8.2); earlier consents stay valid.
ConsentVersion = Literal["2026-10-25"]


class RegisterRequest(StrictModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    privacy_consent: Literal[True]
    privacy_consent_version: ConsentVersion


class ProviderRegisterRequest(StrictModel):
    privacy_consent: Literal[True]
    privacy_consent_version: ConsentVersion


class AddEmailMethodRequest(StrictModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class LoginRequest(StrictModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenRequest(StrictModel):
    token: str = Field(min_length=20, max_length=256)


class RecoveryRequest(StrictModel):
    email: EmailStr
    return_to: Literal["/account"] | None = None


class ResetPasswordRequest(TokenRequest):
    password: str = Field(min_length=12, max_length=128)


class ReauthRequest(StrictModel):
    """Change 227: confirm the current password without signing out."""

    password: str = Field(min_length=1, max_length=128)


# Change 227: what the profile resumes after a provider re-confirmation returns.
ResumeIntent = Literal["link:vk", "link:yandex", "unlink:vk", "unlink:yandex", "delete", "email"]


class ProviderReauthRequest(StrictModel):
    resume: ResumeIntent | None = None


class DeleteAccountRequest(StrictModel):
    confirmation: str = Field(max_length=16)
    password: str | None = Field(default=None, max_length=128)


class LoginMethod(StrictModel):
    provider: str
    subject_hint: str | None = None


class AccountView(StrictModel):
    id: str
    email: str | None
    methods: list[LoginMethod]
    # Change 227: until then login methods and deletion need no new confirmation
    recent_auth_until: datetime


class SessionView(StrictModel):
    account: AccountView | None
    csrf_token: str | None = None


class ProviderRegisteredView(SessionView):
    return_to: str


class PendingProviderView(StrictModel):
    provider: Literal["vk", "yandex"]


class SignedInDevice(StrictModel):
    id: str
    label: str
    city: str | None
    last_seen_at: datetime
    current: bool
