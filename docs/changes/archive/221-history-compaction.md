# CHANGE 221 — Сжатие истории изменений 173–220

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `221` |
| Slug | `history-compaction` |
| Title | Сжатие истории изменений 173–220 |
| Status | `archived` |
| Branch | `feature/221-history-compaction` |

---

## Goal

Последний блок аудита в infraegev2. Сжатие одобрил архитектор 2026-10-25, ответив на вопрос «Да,
сжать 173–216». Диапазон расширен до 220, чтобы в снимок вошли и изменения самого аудита. 48
архивных файлов (около 790 КБ) заменяет проверенный снимок в `COMPACTED.md` с прозой об итогах,
решениях, одобрениях, рисках и открытых пунктах.

---

## Backlog

### History
- [x] `T1` `change_history.py snapshot 5cdd7e9e… 220` по списку из 48 архивов 173–220; метаданные
  version 2 с четырьмя снимками. — _Depends on:_ —
- [x] `T2` Проза «Snapshot 173–220» (итоги и решения, нерешённые риски, восстановление). Заголовок
  и вводный абзац охватывают 01–220. — _Depends on:_ T1
- [x] `T3` Архивы 173–220 удалены. `inspect`: `covered_through` 220, `next` 221. Каждый путь
  читается `read` байт в байт как в источнике. Ссылка в `lesson-review.md` ведёт через `read`.
  — _Depends on:_ T2

---

## Gate Checks

`change_history.py inspect`, проверка `read` всех 48 путей, docs-links, format.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 5cdd7e9e+wt | inspect, read ×48 (cmp с источником) | PASS | 20 |
| 5cdd7e9e+wt | docs-links, format | PASS | 30 |

---

## Implementation Notes

Документы, удалённые в Change 220, в снимок не вошли: правило «восстановить перед сжатием» здесь
не применялось. Они читаются обычным git с `a1fbfeb5`, это указано в прозе снимка.

---

## Commit Message

```
docs(change-221): compact change history 173–220
```
