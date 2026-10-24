# CHANGE 206 — Старые адреса первого релиза: 301 вместо 404

<!-- TOKEN BUDGET: keep this file under 10,000 tokens. Be concise. -->

## Change Metadata

| Field | Value |
|-------|-------|
| Change | `206` |
| Slug | `legacy-addresses` |
| Title | Старые адреса первого релиза: 301 вместо 404 |
| Status | `archived` |
| Branch | `feature/206-legacy-addresses` |

---

## Goal

После релиза 2026-10-24 сверил адреса прошлой версии прода (Change 166) с новой.
- Шесть из семи тем открываются через 301 на первую подтему.
- Тема `25-obrabotka-celyh-chisel` отдаёт 404: Change 197 переименовал её в `25-deliteli-i-maski`
  по названию ФИПИ.
- Курс Python перестроен в Change 197. Десять прежних уроков исчезли, и их адреса тоже отдают 404.

Адреса уже в индексах поисковиков и придут через переезд `infraege.ru → kodumka.ru`. Каждый из них
теперь отвечает 301 на ближайшую по смыслу страницу.

---

## Backlog

### Frontend
- [x] `F1` `src/shared/config/legacy-routes.ts`: карта старых адресов тем и уроков курсов. Маршруты
  `/ege/$slug` и `/courses/$courseSlug/$lessonSlug` отвечают 301. Для темы `#section`
  сохраняется. — _Depends on:_ —
- [x] `F2` `tests/legacy-routes.test.ts`: старого адреса больше нет, цель опубликована. —
  _Depends on:_ F1

Соответствие уроков Python:
- `oshibki` → `obrabotka-isklyucheniy`;
- `sostavnye-usloviya` → `logicheskie-vyrazheniya`;
- `schetchiki-i-nakopiteli` → `while`;
- `tsifry-chisla` → `chisla-i-vyrazheniya`;
- `tablitsy`, `sohranenie-spiska-del` → `fayly`;
- `polnyy-perebor` → `standartnaya-biblioteka`;
- `otbor-rezultata` → `sortirovka-i-poisk`;
- `spisok-del`, `deystviya-so-spiskom` → `spiski`.

---

## Files

### Create / modify
~~~
apps/web/src/shared/config/legacy-routes.ts
apps/web/src/routes/{ege.$slug.tsx,courses_.$courseSlug.$lessonSlug.tsx}
apps/web/tests/legacy-routes.test.ts
~~~

---

## Gate Checks

format, web-lint, web-typecheck, vitest. HTTP на dev-стеке: старые адреса отвечают 301, цепочка
переходов заканчивается 200.

### Gate evidence

| HEAD | Groups / focused checks | Result | Seconds |
|------|-------------------------|--------|---------|
| 4ea76dc7+wt | format, web-lint, web-typecheck, docs-links; vitest 546/546; curl dev `:8080`: `/ege/25-obrabotka-celyh-chisel` 301 → … → 200, `/courses/python/oshibki` 301 | PASS | ~140 |

---

## Implementation Notes

- Старые адреса собраны из `lesson-publication.mjs` и `course-publication.mjs` версии `e0d433fc`.
  Задачи `/practice/<id>` не менялись: импорт сохранил ID.

---

## Commit Message

```
fix(change-206): permanent redirects for the first release's renamed addresses
```
