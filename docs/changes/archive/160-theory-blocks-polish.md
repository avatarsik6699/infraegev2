# CHANGE 160 — Доводка блоков теории и тестов уроков

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field  | Value                                       |
| ------ | ------------------------------------------- |
| Change | `160`                                       |
| Slug   | `theory-blocks-polish`                      |
| Title  | Доводка блоков теории и тестов уроков       |
| Status | `archived`                                    |
| Branch | `feature/160-theory-blocks-polish`          |

---

## Goal

После Change 159 блок «Разберём на примере» и код в тексте оформлены заново; остальные блоки теории (`Procedure`, `Callout`, `Checkpoint`, `Mistake`) живут в прежнем стиле и на его фоне выглядят шумно. Change приводит их к одному спокойному языку (одна типографика, приглушённые метки, единый бейдж номера), проверяет вертикальный ритм и длинные формулы на 390 px, убирает слабые секции `mistake` в уроке 15 (оставляем только настоящие ловушки) и чинит пять файлов Vitest уроков, сломанных с Change 157. Правила — [SPEC](../../SPEC.md) §2.3, [FRONTEND](../../FRONTEND.md).

**Решения архитектора (из чата, действуют).** Меньше шума в типографике (один размер, цвет и вес внутри блока), второстепенное приглушено; код в тексте — плашка, формула — обычный текст; два блока кода рядом не ставим; строки кода не длиннее 64 символов; блок `mistake` только для настоящей ловушки.

---

## Design References

Эталон — `WorkedExample` после Change 159 (тональная подложка, круглые номера шагов с едва заметной нитью, единая типографика). Новых стилей сайта нет.

---

## Backlog

### Frontend

- [x] `F1` Аудит блоков `Procedure`, `Callout`, `Checkpoint`, `Mistake` по снимкам 390/1440 (уроки 16, 17, 24): список расхождений с эталоном (размеры, веса, цвета, метки, номера, отступы) и решение по каждому в Implementation Notes — _Depends on:_ —
- [x] `F2` `Procedure`: единый стиль номеров с шагами примера (общий токен бейджа), без подложки, типографика в один вес и цвет — _Depends on:_ F1
- [x] `F3` `Callout`, `Checkpoint`, `Mistake`: приглушённые метки, одинаковая плотность и вертикальные отступы, лишние акценты убраны; чипы кода в них читаются — _Depends on:_ F1
- [x] `F4` Вертикальный ритм абзац → рисунок/ролик → пример → код в уроке 16: единый интервал, ни один блок не «прилипает» к соседу; правки в токенах, не в отдельных блоках — _Depends on:_ F1
- [x] `F5` Длинные формулы и `data-formula-term` на 390 px: без горизонтальной прокрутки страницы, разумные переносы; проверка всех уроков — _Depends on:_ F1
- [x] `F6` Обновить ожидания E2E, привязанные к стилям блоков (`topic-lesson.page.ts`), после F2–F5 — _Depends on:_ F2, F3, F4, F5

### Data / контент

- [x] `D1` Урок 15 (преобразование записей чисел): пройти 5 секций `mistake`, оставить только настоящие ловушки, остальные удалить; обновить ожидание E2E про число сравнений — _Depends on:_ —
- [x] `D2` Проверить остальные уроки (17, 24–27) на секции `mistake`: если есть слабые, вынести в список для решения архитектора, не удалять без согласования — _Depends on:_ —

### Tests / долг

- [x] `T1` Пять файлов Vitest уроков (`array-processing`, `data-analysis`, `integer-processing`, `number-sequences`, `string-processing`): исправить мок роутера (нужен `createLink`, `~/entities/lesson` тянет `ActionLink`) — _Depends on:_ —
- [x] `T2` В тех же файлах исправить 9 устаревших ожиданий (значения проверять по коду урока, не подгонять под результат); фиксировать в Implementation Notes каждое изменённое ожидание и причину — _Depends on:_ T1
- [x] `T3` Проверка как ученик: Playwriter 390/1440 для уроков 15, 16, 17; затронутые спеки E2E один раз (`E2E_ARGS`) — _Depends on:_ F6, D1, T2

<!-- Test execution is governed by `docs/STACK.md`'s Critical Gate and opt-in Full Gate.
     Do not duplicate that list here. -->

---

## Files

### Create / modify

~~~
apps/web/src/shared/components/learning-content/{procedure,checkpoint,mistake}/*
apps/web/src/shared/components/callout/*
apps/web/src/app/styles/tokens.css
apps/web/src/entities/lesson/content/preobrazovanie-zapisey-chisel.lesson.tsx
apps/web/tests/{array-processing,data-analysis,integer-processing,number-sequences,string-processing}*.test.tsx
apps/web/e2e/pages/topic-lesson.page.ts
docs/FRONTEND.md, docs/artifacts/lessons/*.quality.md
~~~

### Do NOT touch

- Учебный текст уроков, кроме удаления слабых `mistake` (D1); ролики и рисунки (`docs/artifacts/lesson-media/`, `apps/web/public/lesson-media/`)
- API, база, банк задач

---

## Contracts

See `docs/SPEC.md` §2.3 and §5, `docs/FRONTEND.md` and the Files list above. Do not hand-copy details into this file.

---

## Gate Checks

> Critical Gate runs once per `/work` target set and by default in `/ship`; Full Gate runs only
> with explicit `--full`; release selects affected checks and Release Gate. All gates are defined in [docs/STACK.md](../../STACK.md) — this section only records
> change-specific overrides.

Дополнительно: сфокусированные Vitest для затронутых уроков и компонентов; E2E затронутых спеков один раз перед ship.

---

## Implementation Notes

- F1 (аудит, снимки 1440 и проверка 390/1440 по всем урокам): расхождения с эталоном — плотно окрашенные красная и зелёная панели `Mistake` (14 %), тёмные жирные метки `Callout`/`Checkpoint`, моноширинные серые «1.» в `Procedure` вместо круглых номеров примера. Ритм и формулы в порядке: интервалы между блоками теории везде 12–24 px, ни один блок не «прилипает» (нет интервалов < 12), горизонтальной прокрутки страницы на 390 и 1440 нет в уроках 16, 17, 24–27 (F4, F5 без правок).
- F2/F3: `Procedure` — круглые номера (`::before` со счётчиком, `role="list"`), фон `--color-surface-quiet`, единый цвет текста; `Mistake` — панели 8 % вместо 14 %, метки весом 400; `Callout`/`Checkpoint` — метки приглушены (цвет `--color-text-soft`, вес 400). E2E: вес метки `Callout` 500 → 400.
- D1: в уроке 15 оставлено 3 из 5 `mistake` (основание системы, пересчёт бита после каждого добавления, минимальность первого N); удалены тривиальное `s + '1'` и дубль про монотонность.
- D2 (для решения архитектора, ничего не удалено): кандидаты на удаление — урок 24 «Если два способа совпали на одном примере, все границы проверены» и урок 17 «Программа вывела число — значит, ответ верен» (общие, есть в теории и чекпоинтах); остальные — конкретные ловушки.
- T1/T2: пять тестов уроков чинятся не заглушкой `ActionLink`, а моком `createLink` в моке роутера (ссылки снова проверяются как ссылки); 9 падений = 5 из-за ссылок и 4 из-за устаревших картинок каталога (`.svg` 144×88 → `.webp` 192×104, как в `topic-catalog`).
- После просмотра архитектора: у `Procedure` убран левый отступ (глобальный стиль `ol` давал 22 px и перебивал `padding: 0`; селектор усилен до `.root .steps`), номера стоят вплотную к левому краю.
- Решение по D2 архитектор не принял: секции не удалялись, остаются в очереди.
- T3: изолированный E2E затронутых спеков (`topic-reading` и уроки 17, 24–27): 25 зелёных, один раз.

---

## Commit Message

```
feat(change-160): theory blocks polish — calm Procedure/Callout, lesson tests
```
