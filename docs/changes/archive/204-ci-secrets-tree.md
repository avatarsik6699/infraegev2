# CHANGE 204 — Скан секретов дерева в CI: публичные файлы банка

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `204` |
| Slug | `ci-secrets-tree` |
| Title | Скан секретов дерева в CI: публичные файлы банка |
| Status | `archived` |
| Branch | `feature/204-ci-secrets-tree` |

---

## Goal

`quality.yml` для `5302ff76`, первого релизного SHA, упал на шаге «Current-tree secrets defense in
depth» (`gate.py --group security-secrets`, gitleaks `dir`): 154 срабатывания. Без зелёного
quality `release_checkpoint.py predeploy` блокирует деплой.

Источники срабатываний:
- 152 × `twilio-api-key` в четырёх вложениях банка `content/practice-bank/files/<sha256>`, по 7–10 МБ
  каждое. Это длинные случайные строки из условий задач. Имя файла — SHA-256 его содержимого,
  проверено.
- 2 × `generic-api-key` в `bank.json`. Скан `dir` читает большой файл кусками, и строка
  `storage_key` с правилом Change 203 приходит обрезанной.

---

## Backlog

### Infra
- [x] `I1` `.gitleaks.toml`:
  - `twilio-api-key` разрешён только для `content/practice-bank/files/<64 hex>`;
  - в `bank.json` исключение `generic-api-key` сопоставляется со значением (`^[0-9a-f]+$`), а не со
    строкой.

  — _Depends on:_ —

---

## Files

### Create / modify
~~~
.gitleaks.toml
~~~

---

## Gate Checks

gitleaks `dir` на чистом экспорте `git archive HEAD` (как в CI) и gitleaks `git` по диапазону
`e0d433fc..HEAD`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 5302ff76+1 | gitleaks dir на `git archive` дерева — no leaks; gitleaks git `e0d433fc..HEAD` — no leaks | PASS | ~130 |

---

## Implementation Notes

- Локальный скан `dir` по рабочей папке находит ещё и `infra/task-files.local/` (копии вложений,
  игнорируются git), поэтому CI проверяется на экспорте дерева.

---

## Commit Message

```
fix(change-204): CI tree secrets scan accepts public bank attachments
```
