# 4. Ядро sre-kit

Core — место, где разные способы сбора превращаются в одну согласованную модель наблюдаемости.

## Полный конвейер

```text
pull scheduler или push HTTP
          ↓
adapter / ingress
          ↓
проверка schema и Source
          ↓
Metric / Check / Event
          ↓
SQLite + hourly rollups
          ↓
alert evaluation
          ↓
REST snapshot + WebSocket updates
          ↓
Dashboard
```

### 1. Получить

Scheduler запускает pull-adapter как отдельный процесс и читает NDJSON. Push endpoint принимает
версионированный пакет Metric, Check и Event по Source token.

### 2. Проверить

Каждая запись проверяется по общей schema. Core назначает реальный Source и не доверяет producer в
вопросе идентичности. Невалидные строки не должны незаметно попадать в хранилище.

### 3. Нормализовать

После этого HTTP check, SSH metric, Umami aggregate и journal event имеют разные данные, но одну
общую форму. Остальным слоям не нужно знать внешний API каждого инструмента.

### 4. Сохранить

SQLite хранит Projects, Sources, telemetry, alerts, alert rules, notification channels и сведения
о maintenance. Raw Metric, Check и Event сохраняются 30 дней. Metric дополнительно сворачиваются в
почасовые rollup и хранятся 13 месяцев. Maintenance выполняется при старте и далее ежедневно.

Это bounded storage, а не бесконечное озеро логов.

### 5. Оценить Alerts

Новая telemetry проходит через alert engine. Он может:

- автоматически следить за `unreachable` и `error` Source;
- проверить пользовательские правила над Metric или Check;
- открыть Alert, а после восстановления пометить его resolved;
- попытаться отправить Notification через настроенный канал.

Ошибка Notification не отменяет уже сохранённый Alert.

### 6. Отдать интерфейсу

REST API даёт ограниченный snapshot текущих данных. WebSocket сообщает о новых сигналах и Alerts в
реальном времени. После переподключения UI заново получает snapshot, а затем продолжает live stream.

## Почему успешный цикл почти ничего не пишет

Нормальная работа должна быть тихой. Если каждый минутный опрос создаёт заметное сообщение об
успехе, оператор перестаёт видеть отклонения. Поэтому важны изменение Source status, проблемные
Events и Alerts, а не поток «всё хорошо».

## Idempotency для push

Publisher может не получить ответ и повторить тот же пакет. `Idempotency-Key` позволяет core
распознать повтор и не удвоить Metric. Ключ должен оставаться тем же для повтора одного пакета и
меняться для нового пакета.

## Чего core намеренно не делает

Core не выполняет deploy, Compose update, SSH mutation, rollback, backup или restore на VPS. Он
может показать, что CPU высок или сайт недоступен, но исправляющее действие остаётся в
`infraegev2` и его operator workflow.

## Контрольный вопрос

Зачем пропускать все adapters через общий core, а не рисовать отдельный экран для каждого? Чтобы
одинаково валидировать, хранить, сопоставлять, оповещать и показывать сигналы независимо от их
внешнего происхождения.

[Назад](03-sources-and-adapters.md) · [Дальше: Dashboard и Alerts →](05-dashboard-and-alerts.md)

