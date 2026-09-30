# CHANGE 162 — Восстановить зелёный релизный CI

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `162` |
| Slug | `release-quality-gate` |
| Title | Восстановить зелёный релизный CI |
| Status | `active` |
| Branch | `feature/162-release-quality-gate` |

---

## Goal

Устранить блокер `Static quality` для опубликованного, но не развёрнутого SHA `67d44820ed501273923ac58c90e109d66cf81083`: Ruff E501 в docstring теста движка учебных иллюстраций. Проверить точные команды CI перед новым push, не меняя поведение приложения и генератора.

---

## Backlog

### Other

- [x] `T1` Перенести длинную инструкцию запуска в docstring `scripts/tests/lesson_media_engine_test.py` на строки до 100 символов; подтвердить Ruff для скриптовых тестов и остальные backend static checks из CI — _Depends on:_ —
- [x] `T2` Исправить шесть HIGH-находок в опубликованном API-образе старого SHA: подтвердить доступность Debian-пинов `libssl3t64`, `openssl`, `openssl-provider-legacy` версии `3.5.7-1~deb13u3`, обновить Dockerfile и проверить локально сборку и скан фактического образа — _Depends on:_ —

---

## Files

### Create / modify

~~~
scripts/tests/lesson_media_engine_test.py
apps/api/Dockerfile
docs/changes/162-release-quality-gate.md
~~~

### Do NOT touch

- Production данные, настройки и уже опубликованные образы старого SHA.

---

## Contracts

См. `docs/SPEC.md` §7.2 и `docs/STACK.md` § Critical Gate / Release Gate. Исправление не меняет API, схему, содержимое уроков или поведение теста.

---

## Gate Checks

Перед публикацией повторить все команды шага `Backend static checks` в `.github/workflows/quality.yml`; новая версия должна пройти точный `Static quality` и `images` для своего SHA до деплоя.

---

## Implementation Notes

- Старый SHA `67d44820ed501273923ac58c90e109d66cf81083` опубликован, но не развёрнут: `quality.yml` остановился на E501, `images.yml` на шести HIGH в API-образе. `apt-cache policy` внутри закреплённого базового образа показал доступный пакет `3.5.7-1~deb13u3`; локальный образ с ним прошёл Trivy HIGH/CRITICAL без исправимых находок.

---

## Commit Message

```
fix(change-162): restore release quality gate
```
