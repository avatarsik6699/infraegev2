"""Bounded public requests and private account projections."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RegisterRequest(StrictModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    privacy_consent: Literal[True]
    privacy_consent_version: Literal["2026-09-25"]


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


class SessionView(StrictModel):
    account: AccountView | None
    csrf_token: str | None = None
