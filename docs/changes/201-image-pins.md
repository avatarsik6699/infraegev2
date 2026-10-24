# CHANGE 201 — Обновить закреплённые пакеты Debian в образах

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `201` |
| Slug | `image-pins` |
| Title | Обновить закреплённые пакеты Debian в образах |
| Status | `archived` |
| Branch | `feature/201-image-pins` |

---

## Goal

Full Gate перед релизом 2026-10-24 упал на сборке образа web. Закреплённая версия
`libpcre2-8-0=10.42-1+deb12u1` (Change 166) больше не лежит в репозитории Debian: её заменило
исправление `deb12u2`. Без правки не соберётся и `images.yml`, а значит, релиз невозможен.

Заодно закрепляются свежие обновления безопасности базовых образов, чтобы скан опубликованных
образов (Trivy, исправимые HIGH/CRITICAL) не остановил деплой:
- web (bookworm): `liblzma5`, `perl-base`;
- API (trixie): `liblzma5`, а также Python-пакет `certifi` (CRITICAL GHSA-6q48-6c7w-9gw2:
  скомпрометированные корневые сертификаты emSign);
- nginx: закреплённый `libexpat=2.8.5-r0` тоже исчез из Alpine; оставались HIGH в `nginx`,
  `brotli-libs`, `libx11`, `tiff`. Базовый образ поднят до `nginx:1.30.6-alpine`, закреплён только
  недостающий `brotli-libs`.

---

## Backlog

### Infra
- [x] `I1` `apps/web/Dockerfile`: `libpcre2-8-0=10.42-1+deb12u2`, `liblzma5=5.4.1-1+deb12u2`,
  `perl-base=5.36.0-7+deb12u4`. `apps/api/Dockerfile`: `liblzma5=5.8.1-1+deb13u2`. Остальные
  закрепления API сверены с кандидатами apt 2026-10-24 и актуальны. — _Depends on:_ —
- [x] `I3` `apps/api/uv.lock`: `certifi` 2026.7.22 → 2026.10.23. `infra/nginx/Dockerfile` и
  `infra/docker-compose.yml`: `nginx:1.30.6-alpine@sha256:47928bf6…`, закреплён только
  `brotli-libs=1.2.1-r0` (остальные пакеты в новой базе уже обновлены). — _Depends on:_ —
- [x] `I2` Локально собрать все три образа и прогнать `pnpm audit:images` (Trivy). — _Depends on:_ I1

---

## Files

### Create / modify
~~~
apps/web/Dockerfile, apps/api/Dockerfile, apps/api/uv.lock, infra/nginx/Dockerfile, infra/docker-compose.yml
~~~

### Do NOT touch
- Базовые образы web и API.

---

## Gate Checks

`infra-config`, `web-image-build` contract, `pnpm audit:images`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 319d38c3+wt | `pnpm audit:images`: три образа собраны, Trivy HIGH/CRITICAL исправимых 0 (web debian 12.15, API debian 13.6, nginx alpine 3.24.3) | PASS | ~30 |
| 319d38c3+wt | Full Gate (релиз 166→201): статика, контракты ops и владельцев, host-python, bootstrap `--build`, миграции, импорт банка, pytest, сборка + paid-leak, vitest, smoke, content | PASS | ~1700 |

---

## Implementation Notes

- Первый прогон Full Gate упал на bootstrap: `E: Version '10.42-1+deb12u1' for 'libpcre2-8-0' was not
  found`. Debian и Alpine держат в репозитории только последнюю сборку пакета, поэтому любое
  закрепление однажды устаревает; закрепляем только то, чего нет в базовом образе.
- e2e Full Gate разобраны отдельно, в журнале релиза (Change 202).

---

## Commit Message

```
fix(change-201): current Debian security pins in the images
```
