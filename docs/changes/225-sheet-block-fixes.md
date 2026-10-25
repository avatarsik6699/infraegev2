# CHANGE 225 — Исправления таблиц Excel в уроках

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `225` |
| Slug | `sheet-block-fixes` |
| Title | Исправления таблиц Excel в уроках |
| Status | `in-progress` |
| Branch | `feature/225-sheet-block-fixes` |

---

## Goal

Архитектор нашёл три дефекта `SheetBlock` в курсе Excel:
1. цветные рамки ячеек на краю сетки обрезаны;
2. выделенная строка в списке «Формулы в ячейках» не совпадает с выбранной ячейкой;
3. таблица иногда схлопывается.

Причина (3): при переходе внутри сайта (`pervye-formuly` → `kopirovanie-i-dollar`) React
переиспользует состояние блока на той же позиции. Выделение и активный лист предыдущего урока не
существуют в новом блоке, и все листы скрываются.

---

## Backlog

### Frontend
- [x] `T1` Состояние блока привязано к его листам: `SheetBlock` монтирует `LiveSheet` с `key` по
  идентичности `sheets`. Неизвестный активный лист откатывается на первый. — _Depends on:_ —
- [x] `T2` `inFormulaRange` проверяет прямоугольник диапазона копирования. Для выбранной копии строка
  списка показывает её адрес, «копия формулы X» и её собственную формулу. — _Depends on:_ —
- [x] `T3` Ячейки на краю сетки получают `data-at` (t/b/l/r); рамки ссылки и выделения на этих
  сторонах не выходят за ячейку. — _Depends on:_ —
- [x] `T4` Тесты «SheetBlock (Change 225)» в `excel-course-blocks.test.tsx`: смена листов на той же
  позиции, выделение копии в диапазоне, строка копии, `data-at`. На старом коде 4 теста
  падают. — _Depends on:_ T1, T2, T3

---

## Gate Checks

`format`, `web-lint`, `web-typecheck`; vitest `tests/excel-course-blocks.test.tsx`. Playwriter на
локальном стеке: desktop 1280 и mobile 390, переход внутри сайта на `kopirovanie-i-dollar`.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| bbd90313+wt | format, web-lint, web-typecheck; vitest excel-course-blocks (22) | PASS | 60 |
| bbd90313+wt | Playwriter: переход по ссылке — все 4 блока видимы со своим выделением; рамки F1/F6 целиком на mobile; строка «D4 — копия формулы B2» | PASS | — |

---

## Implementation Notes

None

---

## Commit Message

```
fix(change-225): Excel lesson sheets keep borders, selection and layout
```
