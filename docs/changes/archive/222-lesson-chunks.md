# CHANGE 222 — Один чанк на тему и урок курса

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `222` |
| Slug | `lesson-chunks` |
| Title | Один чанк на тему и урок курса |
| Status | `archived` |
| Branch | `feature/222-lesson-chunks` |

---

## Goal

Аудит 2026-10-25 (Lighthouse на production) показал две проблемы.
- Страница любой темы грузила чанк `lesson-*.js` на 5,2 МБ с бесплатным контентом всех 25 тем:
  TBT ≈700 мс на мобильном профиле при пороге 200.
- Чанк курсов `course-*.js` на 1,6 МБ подтягивали даже профиль, каталог курсов, `/pricing` и
  задачи практики.

Архитектор одобрил исправление 2026-10-25. Теперь страница грузит только свою тему или свой урок.

---

## Backlog

### Content
- [x] `T1` `scripts/practice-registry.mjs` генерирует оглавления по тексту модулей (через
  `lesson-sources.mjs`, как реестр практики):
  - `entities/lesson/content/topic-outlines.gen.ts` — тема: поля публикации, доступ, «Практика и
    итог», подтемы с названием, лидом, уровнем, `paid` и якорями;
  - `entities/course/content/course-lesson-outlines.gen.ts` — урок курса: поля публикации, доступ,
    `paid.selfCheck`, уровень, порог;
  - у каждой записи есть `load()`, динамический импорт модуля;
  - `--check` (`content-static`) ловит устаревшее оглавление;
  - реестр практики и темы каталога пишутся сразу в формате Prettier.

  — _Depends on:_ —

### Web
- [x] `T2` `shared/lib/lazy-value.ts` обобщает механизм `paid-content.ts`: один promise на
  загрузчик, состояние отслеживается, `use()`. На нём работают и платные модули. — _Depends on:_ —
- [x] `T3` Темы:
  - убраны реестр `lesson-registry.ts`, `topicLessons`, `findLessonByRouteSlug` и статические
    реэкспорты 25 модулей из `entities/lesson/index.ts`;
  - дерево, `/pricing`, sitemap, редирект `/ege/{topic}` и `head()` читают оглавление;
  - загрузчики маршрутов подтемы и «Практики и итога» ждут модуль, компоненты читают его через
    `use()`;
  - серверные функции грузят модуль только там, где нужен текст (подписи ссылок на теорию у
    задачи). — _Depends on:_ T1, T2
- [x] `T4` Курсы:
  - убраны `python-course-lessons.ts` и `excel-course-lessons.ts`;
  - `getCourseLessons` и `findCourseLessonOutline` отдают оглавления;
  - модуль урока грузят его маршрут и задача практики;
  - обзор курса, дерево урока, профиль и `/pricing` работают на оглавлениях. — _Depends on:_ T1, T2
- [x] `T5` Тесты:
  - тесты уроков импортируют модуль по прямому пути;
  - общие проверки получают модули через `loadTopicLessons` и асинхронный
    `findLessonByRouteSlug` из `lesson-content-test-utils`;
  - `tests/lesson-outlines.test.ts` сверяет каждое оглавление с его модулем. — _Depends on:_ T3, T4

### Docs
- [x] `T6` FRONTEND § 5 «Lesson modules», KNOWN_GOTCHAS «A lesson module imported statically»,
  `lesson-pipeline.md` (генератор пишет оглавления), SPEC § 9. — _Depends on:_ T3, T4

---

## Gate Checks

Статика: `format`, `web-lint`, `web-typecheck`, `tooling-lint`, `content-static`, `paid-leak`,
`docs-links`. Тесты: весь vitest web (81 файл) и изолированный браузерный аудит
`account full production`. После деплоя — ручной `audit-browser` (Lighthouse) на production.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 4fe2cc47+wt | 7 static groups | PASS | 95 |
| 4fe2cc47+wt | vitest web: 81 files / 548 tests | PASS | 180 |
| 4fe2cc47+wt | isolated browser audit `account full production` (1 + 268 + 6) | PASS | 600 |

Сборка: самый большой JS-чанк страницы темы — модуль самой темы, 230–550 КБ без сжатия (был
общий чанк на 5,2 МБ). Общий чанк сущности `lesson` (оглавления и помощники) — 78 КБ. Чанка
курсов больше 100 КБ нет.

---

## Implementation Notes

Оглавления генерируются разбором текста, как реестр практики, а не выполнением модулей: модули
содержат JSX и CSS Modules. Расхождение текста и модуля ловит `tests/lesson-outlines.test.ts`.

---

## Commit Message

```
perf(change-222): one chunk per topic and course lesson
```
