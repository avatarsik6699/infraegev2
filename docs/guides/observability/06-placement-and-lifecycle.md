# 6. Где физически живут части системы

Логическая схема становится понятнее, если разложить её по трём физическим зонам.

## Зона 1: Internet

Из Internet доступны публичный сайт, readiness endpoint, SSH и same-origin Umami collector.
GitHub Actions отдельно запускает внешний HTTPS/TLS probe каждые 15 минут.

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

Umami и Beszel не публикуются напрямую в Internet. Доступ оператора идёт через WireGuard.

## Зона 3: локальная рабочая станция

На workstation по требованию запускаются:

- WireGuard tunnel и loopback forwards;
- `sre-kit` core на `127.0.0.1:8080`;
- privacy-safe traffic publisher и его timer;
- web dashboard на `localhost:3000`.

Локальные forwards:

| Локальный адрес | Цель на VPS | Назначение |
|---|---|---|
| `127.0.0.1:19531` | journal gateway | `journal-http` |
| `127.0.0.1:18090` | Beszel `:8090` | `beszel-api` |
| `127.0.0.1:13001` | Umami `:3001` | `umami-http` |

## Каким путём идёт каждый Source

| Source | Путь | Что читает |
|---|---|---|
| `uptime-http` | public HTTPS | readiness и TLS |
| `host-metrics-ssh` | public SSH | CPU, RAM, disk |
| `fail2ban-ssh` | public SSH | ban/unban |
| `journal-http` | WireGuard forward | journald Events |
| `beszel-api` | WireGuard forward | host/container Metrics |
| `umami-http` | WireGuard forward | consented analytics aggregates |
| `push` | local producer → core | coarse Nginx traffic Metrics |

## Ручной lifecycle

Установка не включает autostart. Оператор явно запускает сессию:

```text
sre-kit-local start
  1. tunnel
  2. core
  3. один немедленный publisher run
  4. publisher timer
  5. dashboard
```

Остановка идёт в безопасном обратном порядке: сначала publisher и timer, затем dashboard, core и
tunnel. Канал `systemctl --user` может оставаться доступным через `dbus.socket`; это само по себе не
означает, что `sre-kit` работает в фоне.

Канонические команды:

```bash
sre-kit-local start
sre-kit-local status
sre-kit-local open
sre-kit-local logs
sre-kit-local stop
```

## Что происходит, когда workstation выключена

VPS и продукт продолжают работу. Umami, Beszel, journald, fail2ban, backups и их timers продолжают
собирать собственные данные. Но локальные polling, push delivery, alert evaluation, Dashboard и
Telegram delivery через этот core останавливаются. GitHub probe остаётся отдельной ограниченной
проверкой внешней доступности и TLS.

## Контрольный вопрос

Почему Umami может продолжать собирать consented события, когда Dashboard выключен? Потому что
Umami живёт на VPS, а Dashboard и `umami-http` polling — на локальной workstation.

[Назад](05-dashboard-and-alerts.md) · [Дальше: сквозные сценарии →](07-end-to-end-scenarios.md)

