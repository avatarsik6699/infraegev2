# CHANGE 207 — Яндекс ID и VK ID на проде

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `207` |
| Slug | `oauth-apps` |
| Title | Яндекс ID и VK ID на проде |
| Status | `archived` |
| Branch | `feature/207-oauth-apps` |

---

## Goal

Архитектор 2026-10-24 попросил подключить вход через Яндекс ID и VK ID. Приложения «Кодумка»
зарегистрированы в кабинетах провайдеров под его учётными записями:
- Яндекс: права только `login:info`, Redirect URI `https://kodumka.ru/api/auth/providers/yandex/callback`;
- VK ID: Web, ID 54851111, базовый домен `kodumka.ru`, доверенный redirect
  `https://kodumka.ru/api/auth/providers/vk/callback`.

Ключи лежат в athanor и в `/etc/infraege/production.env`, флаги `*_ENABLED=true`. Код не менялся.

---

## Backlog

### Docs
- [x] `T1` `production.md` (шаг 6) и `privacy-legal-checklist.md` § 7: провайдеры включены, где
  лежат ключи, что осталось. — _Depends on:_ —

---

## Gate Checks

docs-links. На проде:
- `GET /api/auth/providers` → `{"enabled":["vk","yandex"]}`;
- `start` обоих провайдеров отвечает 303 на `oauth.yandex.ru` и `id.vk.ru` с нашим callback и PKCE;
- в браузере архитектора оба провайдера возвращают на `/register/provider` с текстом «Вход через …
  подтверждён».

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| c9559e60+wt | docs-links; прод: providers API, start 303 ×2, полный круг до `/register/provider` ×2 (Playwriter) | PASS | — |

---

## Implementation Notes

- Копия env до правки: `/etc/infraege/production.env.pre-oauth-2026-10-24`.
- Иконку VK не принял («Невозможно установить значение»), поэтому приложение пока без иконки.
- Яндекс показывает «Сервис ещё не верифицирован»; верификация запрашивается в кабинете OAuth.

---

## Commit Message

```
docs(change-207): Yandex ID and VK ID sign-in enabled in production
```
