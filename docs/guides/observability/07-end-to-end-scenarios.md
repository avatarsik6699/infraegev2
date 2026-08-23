# 7. Сквозные сценарии

Теперь соберём ранее независимые части в несколько полных маршрутов.

## Пользователь открыл урок

```text
пользователь дал consent
  ↓
Web отправил lesson_opened
  ↓
same-origin collector → Umami на VPS
  ↓
umami-http во время локального poll
  ↓
analytics.event_count{event="lesson_opened"}
  ↓
validation → SQLite → Dashboard
```

Разрешены только типизированные события:

- `lesson_opened`;
- `theory_section_viewed`;
- `practice_started`;
- `practice_answer_checked`;
- `lesson_completed`;
- `continuation_opened`.

Ответы, произвольный текст, URL query/hash и fingerprint material передавать нельзя. Без consent
скрипт Umami не загружается, но учебный сценарий работает как раньше.

## Nginx обслужил запрос

```text
Nginx access record в journald
  ↓
локальный publisher читает ограниченное окно
  ↓
удаляет IP, request id, referrer и полный user agent
  ↓
группирует по traffic_class, очищенному path и status_family
  ↓
push Source + token + Idempotency-Key
  ↓
traffic.request_count Metric
```

Первичный журнал остаётся в journald. В `sre-kit` попадает только агрегат. Подозрительные цели
сворачиваются в `__probe__`, повреждённые в `__invalid_path__`, слишком длинные в `__long_path__`.

## CPU стал высоким

Есть два независимых маршрута:

```text
Linux через SSH → host-metrics-ssh → Metric
Beszel Agent → Beszel Hub → beszel-api → Metric
```

Если оба показывают рост, вероятнее реальная нагрузка VPS. Если расходятся, нужно проверить время
точек, смысл измерений и здоровье одного из каналов.

## Сайт вернул ошибку

`uptime-http` подключается к публичному readiness endpoint. Возможны два отдельных результата:

- HTTP-обмен состоялся: Source `ok`;
- ответ не соответствует ожиданию: `uptime.http` Check `critical`.

Так система различает «канал сбора работает и увидел плохое состояние» от «сам канал не может
получить ответ».

## Пропал private tunnel

`journal-http`, `beszel-api` и `umami-http` перестают достигать своих целей и переходят в
`unreachable`. При этом public uptime и SSH Sources могут оставаться `ok`.

По сочетанию сигналов оператор делает вывод: вероятнее сломан общий private transport, а не весь
VPS и не все три приложения одновременно.

## Adapter получил неожиданный формат

Цель доступна, но adapter не может корректно разобрать данные. Это `error`, а не `unreachable`.
Такой сбой требует проверки config, версии внешнего API или schema и создаёт системный Alert без
сетевого debounce.

## Как происходит исправление

```text
sre-kit показывает симптом и контекст
             ↓
оператор формирует гипотезу
             ↓
infraegev2 runbook/CLI выполняет исправление
             ↓
следующий сигнал подтверждает восстановление
```

Dashboard не является кнопкой управления production. Такая граница предотвращает ситуацию, когда
поломка monitoring автоматически запускает опасную mutation на VPS.

## Контрольный вопрос

Как отличить падение WireGuard от падения всего VPS? Сопоставить private Sources с независимыми
public HTTPS и SSH Sources.

[Назад](06-placement-and-lifecycle.md) · [Дальше: перекрытие источников →](08-overlap-and-redundancy.md)

