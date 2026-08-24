# 6. Где физически живут части системы

Логическая схема становится понятнее, если разложить её по четырём физическим зонам.

## Зона 1: Internet

Из Internet доступны публичный сайт, readiness endpoint, application SSH и management UI
`sre.infraege.ru`. GitHub Actions отдельно запускает внешний HTTPS/TLS probe каждые 15 минут.

## Зона 2: production VPS

```text
application Compose
  Nginx → Web / API → PostgreSQL приложения

operations Compose: infraege-ops
  Umami → PostgreSQL Umami
  Beszel Hub
  Beszel Agent
  Docker socket proxy

host services
  journald, fail2ban, WireGuard, Restic, systemd timers
```

Umami и Beszel не публикуются напрямую в Internet. Read-only наблюдение идёт через WireGuard.

## Зона 3: dedicated management VPS

Отдельный always-on Compose project содержит:

- `sre-kit` core с SQLite и adapters;
- web dashboard;
- Caddy edge с TLS;
- privacy-safe Nginx traffic publisher и systemd timer;
- ежедневный локальный Restic backup и ежемесячный изолированный restore proof.

Management peer имеет собственный WireGuard-адрес `10.77.0.3/32` и маршрутизирует только
production peer `10.77.0.1/32`. Он не управляет application или operations Compose и не получает
их deployment authority.

## Зона 4: локальная рабочая станция

Локальный `sre-kit-local` сохранён как выключенный по умолчанию ручной fallback. Его отдельная
SQLite, Sources и telemetry не переносятся в management runtime и не являются production truth.
При явном запуске он поднимает tunnel, core, publisher timer и dashboard только для локальной
диагностики или восстановления доступа.

## Каким путём идёт каждый Source

| Source | Основной production-путь | Что читает |
|---|---|---|
| `uptime-http` | management VPS → public HTTPS | readiness и TLS |
| `host-metrics-ssh` | management VPS → public SSH | CPU, RAM, disk |
| `fail2ban-ssh` | management VPS → public SSH | ban/unban |
| `journal-http` | management VPS → WireGuard | journald Events |
| `beszel-api` | management VPS → WireGuard | host/container Metrics |
| `umami-http` | management VPS → WireGuard | consented analytics aggregates |
| `push` | management system publisher → loopback core | coarse Nginx traffic Metrics |

## Always-on lifecycle

GitHub Actions публикует exact-SHA образы, а approval-gated deploy обновляет только management
Compose project. `infraegev2` владеет target-specific bootstrap, WireGuard peer, Source
reconciliation и publisher installation:

```bash
make sre-management ACTION=status
make sre-management ACTION=backup
make sre-management ACTION=restore-proof
make sre-management ACTION=update RELEASE=<40-character-sre-kit-main-sha>
```

`status` проверяет exact release и readiness без изменения target. `update` делает pre-update
backup и откатывает предыдущий release, если pull/startup/readiness не проходят.

## Ручной fallback lifecycle

Fallback не включается автоматически:

```bash
sre-kit-local start
sre-kit-local status
sre-kit-local open
sre-kit-local logs
sre-kit-local stop
```

Остановка workstation больше не создаёт штатную слепую зону: production polling, push delivery,
Dashboard и alert evaluation продолжаются на management VPS. Они останавливаются только при
отказе management runtime или его пути к target. GitHub probe остаётся независимой ограниченной
проверкой внешней доступности и TLS.

## Контрольный вопрос

Почему Umami и `umami-http` продолжают работать, когда workstation выключена? Потому что Umami
живёт на production VPS, а scheduled polling выполняет always-on management VPS; workstation —
только отдельный fallback.

[Назад](05-dashboard-and-alerts.md) · [Дальше: сквозные сценарии →](07-end-to-end-scenarios.md)
