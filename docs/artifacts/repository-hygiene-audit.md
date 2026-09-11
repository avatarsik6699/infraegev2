# Repository hygiene — итог реализации

Согласованная очередь завершена Changes 107–111, без push/deploy.
Полный исходный аудит (19 общих findings, 51 UI-контракт, DS01–DS21), матрицы, старые документы и
reference sources сохранены в immutable Git snapshot, указанном в
[COMPACTED](../changes/archive/COMPACTED.md). Текущий контракт — SPEC/FRONTEND/STACK, а не этот отчёт.

## Итоги по этапам

| Этап / findings | Реализация |
|---|---|
| 0: D01–D03/D07 | 107: loading/CTA/ownership/section refs синхронизированы с кодом. |
| 1: DS14–DS17 | 107: baseline assertions, no-JS practice, focus и modal isolation исправлены. |
| 2: DS01–DS21, C01/C05, часть C03 | 107: единые semantic variants и recipes; links/Badge/Typography/Image/learning blocks/shared lesson shell; все consumers перенесены, lab показывает тот же контракт; obsolete API и child overrides устранены. |
| 3: C02/C04, остаток C03, A01/A02 | 108: проверены и удалены 16 tokens, 15 dead rules, неработающие declarations и старые пустые targets. |
| 4: D04/D05/D08 | 109: scoped reading, PRODUCT/SPEC/FRONTEND без visual-history повторов, brand/learning rules у владельцев; production/analytics/backup-restore — три runbooks. |
| 5: SDD history | 110: metadata/source verification, next/active detection, exact-byte read, fail-closed при повреждении или shallow history. |
| 6: D06/A03/history/references | 111: 109 numbered archives → один checkpoint; 31 retired artifact и 18 дополнительных docs выведены из checkout. Этот аудит сокращён, original также в snapshot. |

## Что сохранено

- 9 действующих sources: master `references/infraege-mark.svg`, `base.jpg`, `main-page.png` и
  6 auxiliary references в `references/new_pages/`.
- 3 PNG неустановленного назначения: `code_block_ref.png`, `error_page.png`, `loading_page.png`.
  Их дальнейшая судьба требует решения о назначении; отсутствие import не причина удаления.
- 14 исходных пользовательских staged additions (lessons_list + 13 PNG) не менялись и не вошли
  в implementation commits. Их staged diff SHA-256 сохранён:
  `3dc8c028ecabae414a54491d251e8777c39b3e3eebdbc136c3da878dbcbc60f4`.
- Authored lesson content, task data, production assets, окружения, зависимости и persistent data.
  CourseLesson/Topic остаются независимыми; shared отвечает за presentation/interaction contracts.

## Доказательство и границы

107: 67 focused unit + 7 E2E, web lint/typecheck/format, Python Ruff/Pyright PASS; браузер проверил
затронутые состояния. 76 production/unit TS files LSP clean; изолированный Playwright LSP имеет
известное ограничение разрешения типов из KNOWN_GOTCHAS. 108: 18 before/after computed-style
сравнений совпали, auxiliary Nginx isolation PASS. 109: сохранность правил/ссылок/format проверена.
110: шесть real-Git fixture сценариев, включая shallow failure, Ruff/Pyright/LSP PASS.

111 сверяет 159 source files по bytes/hash до удаления; сохраняет 158 originals в Git и сокращает
этот файл. Проверяются чтение Markdown/binary без перезаписи, numbering, ссылки, content и brand
consumers. Экономия касается checkout и текста, не browser bundle или `.git`.

Не объявляются исправленными: старый telemetry 422 при injected 503 (106), исторические unchecked
13/I10, 21/I3, 92/F1–F4, отсутствие отдельного human closure proof плотности task-5 из PR-04 и
exact двухурочного regression request PC-04. Их контекст/диспозиция — в COMPACTED. PC-02/03
сняты архитектором в 69; PR-07 относится только к workstation fallback после 53.

Три неясных PNG, legal/RKN, off-site backup, Telegram и новые продуктовые фичи не становятся
скрытым продолжением cleanup. Полный старый аудит доступен командой:

```bash
python3 scripts/change_history.py read docs/artifacts/repository-hygiene-audit.md
```
