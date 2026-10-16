"""Write a topic's frequency.md from its tagged task table.

Usage: python3 -I scripts/lesson_design/frequency_report.py content/lesson-design/topic-25

The topic folder must contain ``tasks.py`` with: TOPIC_NUMBER, SOURCE (task
URL template), FETCHED (date), COLLECTIONS, SHORT, TASKS, YEAR_BOUNDS, CORE,
RECENT, NAMES, TREND, CORE_RULE, ADVANCED_RULE, optional NOTES and the
functions ``year`` and ``level``. See content/lesson-design/topic-25/tasks.py for the format.
Optional ANALYSIS_TASKS selects a nonempty subset for statistics when a collection
mixes current and historical formats. The complete TASKS table remains visible.
Never edit frequency.md by hand: change tasks.py and run this script.
"""

import importlib.util
import sys
from collections import Counter
from pathlib import Path


def load(topic_dir: Path):
    spec = importlib.util.spec_from_file_location("topic_tasks", topic_dir / "tasks.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def report(t) -> str:
    all_tasks = t.TASKS
    tasks = getattr(t, "ANALYSIS_TASKS", all_tasks)
    if not tasks or len({x[0] for x in tasks}) != len(tasks):
        raise ValueError("Analysis corpus must be nonempty with unique task ids")
    if any(task not in all_tasks for task in tasks):
        raise ValueError("Analysis corpus must be a subset of TASKS")
    total = len(tasks)
    recent = [x for x in tasks if t.year(x[0]) >= t.RECENT]
    dated = [x for x in tasks if x[2].startswith("ЕГЭ")]
    uses = Counter(tech for x in tasks for tech in x[4].split())
    uses_recent = Counter(tech for x in recent for tech in x[4].split())
    levels = Counter(t.level(x[4]) for x in tasks)
    core = levels["основной"]
    collections = " и ".join(f"«{name}» (тема {theme})" for name, theme in t.COLLECTIONS.values())
    counts = ", ".join(f"{t.SHORT[k]} — {sum(x[1] == k for x in tasks)}" for k in t.COLLECTIONS)
    dated_all_core = all(t.level(x[4]) == "основной" for x in dated)
    last_year = max(t.year(x[0]) for x in tasks)
    period = str(last_year) if t.RECENT == last_year else f"{t.RECENT}–{last_year}"
    several = "–" in str(t.TOPIC_NUMBER)  # tasks 19–21 share one topic (Change 182)
    of_task, by_task = ("заданий", "заданиям") if several else ("задания", "заданию")
    lines = [
        f"# Частота типов {of_task} {t.TOPIC_NUMBER}",
        "",
        f"Источник: подборки «Решу ЕГЭ» по {by_task} {t.TOPIC_NUMBER} — {collections}. "
        f"Подборки скачаны {t.FETCHED}. "
        "Условия не копируются: ниже только номера, источники и наши описания.",
        "",
        "Файл сгенерирован скриптом `frequency_report.py` из размеченной таблицы "
        "`tasks.py`. Год задач без пометки источника оценён по номеру задачи "
        "между датированными задачами, поэтому это приблизительная оценка.",
        "",
        "## Итог",
        "",
        *(
            [
                f"Размечено условий: **{len(all_tasks)}**. "
                f"Статистика ниже относится к основному корпусу: **{total}**; "
                f"вне его — **{len(all_tasks) - total}**. "
                "Причины разделения описаны в правиле уровней. "
                "Полная таблица сохраняет оба корпуса.",
                "",
            ]
            if tasks != all_tasks
            else []
        ),
        f"- Всего задач: **{total}**; {counts}.",
        f"- Решаются приёмами основного уровня: **{core} из {total} ({core / total:.0%})**.",
        (
            f"- Задачи с реальных экзаменов (ЕГЭ {min(t.year(x[0]) for x in dated)}–"
            f"{last_year}): {len(dated)}, все "
            f"{'основного' if dated_all_core else 'НЕ ТОЛЬКО основного'} уровня."
            if dated
            else "- Задач с реальных экзаменов в подборке пока нет."
        ),
        f"- Задачи {period} {'года' if t.RECENT == last_year else 'годов'} (по оценке): "
        f"{len(recent)}, из них "
        f"{sum(t.level(x[4]) == 'основной' for x in recent)} основного уровня.",
        "",
        "## Какие приёмы нужны",
        "",
        "Одна задача обычно требует нескольких приёмов, поэтому сумма больше числа задач.",
        "",
        f"| Приём | Задач | Доля | Из них {period} |",
        "|---|---:|---:|---:|",
    ]
    for key, name in t.NAMES.items():
        lines.append(
            f"| {name} | {uses[key]} | {uses[key] / total:.0%} | "
            f"{uses_recent[key]} из {len(recent)} |"
        )
    lines += [
        "",
        t.TREND,
        "",
        "## Правило уровней",
        "",
        t.CORE_RULE,
        t.ADVANCED_RULE.format(advanced=levels["дополнительный"], total=total),
        "",
    ]
    # Optional free text of the topic: how levels were chosen when the
    # collection alone is not enough (topic 23: a single task).
    if getattr(t, "NOTES", ""):
        lines += [t.NOTES, ""]
    lines += [
        "## Все задачи",
        "",
        "| № | Подборка | Источник | Год | Что требуется | Приёмы | Уровень |",
        "|---|---|---|---:|---|---|---|",
    ]
    for tid, kind, src, desc, techs in sorted(all_tasks, key=lambda x: x[0]):
        lines.append(
            f"| [{tid}]({t.SOURCE.format(tid)}) | {t.SHORT[kind]} | {src or '—'} | "
            f"{t.year(tid)}{'' if src else '*'} | {desc} | {techs.replace(' ', ', ')} | "
            f"{t.level(techs)} |"
        )
    lines += ["", "\\* год оценён по номеру задачи.", ""]
    return "\n".join(lines)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    folder = Path(sys.argv[1])
    data = load(folder)
    (folder / "frequency.md").write_text(report(data), encoding="utf-8")
    print(f"{folder / 'frequency.md'} written")
