"""Change 191 bank repair: deterministic, no database."""

import pytest

from app.modules.practice.bank_repair import preview, repair, split_setup
from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

RULES = "Два игрока играют в игру. Игра завершается, победитель получает 40 камней."


def text(value: str) -> dict:
    return {"type": "rich_text", "data": {"spans": [{"kind": "text", "text": value}]}}


def task(number: int, statement: list[dict], answer: str, *, root: str = "31516") -> dict:
    original = root if number == 19 else f"{root}/{number}"
    return {
        "id": f"part-{root}-{number}",
        "title": f"Выигрышная стратегия — КЕГЭ {root}, задание {number}",
        "difficulty": 1 if number == 19 else 2,
        "answer_instruction": f"Ответ {number}",
        "content_schema_version": 2,
        "statement": statement,
        "hint": [],
        "explanation": [],
        "exam_numbers": [number],
        "sources": [
            {
                "kind": "bank",
                "role": "copy",
                "primary": True,
                "title": "КЕГЭ",
                "author": None,
                "original_id": original,
                "url": f"https://kompege.ru/task?id={root}",
                "year": None,
                "adaptation": None,
            }
        ],
        "checker": {"checker_type": "exact_match", "answer_variants": [answer]},
    }


TOPICS = [{"id": "winning-strategy", "title": "Выигрышная стратегия", "taskNumbers": [19, 20, 21]}]


def bank(*tasks: dict) -> dict:
    return {
        "format": 1,
        "tasks": [{"task": t, "solution_revision": 1} for t in tasks],
        "files": [],
        "materials": [{"id": "winning-strategy", "sections": ["intro"], "status": "published"}],
        "courses": [],
    }


def test_preview_keeps_the_question_without_answer_format():
    statement = [text("Дано число N.\nНайдите сумму цифр числа N. В ответе запишите число.")]
    assert preview(statement) == "Найдите сумму цифр числа N."


def test_root_question_shares_the_last_setup_paragraph():
    parts = {
        19: {"statement": [text(RULES + " Известно, что Ваня выиграл. Укажите S.")]},
        20: {"statement": [text(RULES), text("найдите два значения S.")]},
        21: {"statement": [text(RULES), text("найдите значение S.")]},
    }
    split = split_setup(parts)
    assert split is not None
    setup, questions = split
    assert setup == [text(RULES)]
    assert questions[19] == [text("Известно, что Ваня выиграл. Укажите S.")]
    assert questions[20] == [text("Найдите два значения S.")]


def test_part_specific_initial_position_stays_with_its_questions():
    start = text("В начальный момент было S камней.")
    parts = {
        19: {"statement": [text(RULES), text("Укажите сумму.")]},
        20: {"statement": [text(RULES), start, text("Найдите S.")]},
        21: {"statement": [text(RULES), start, text("Найдите другое S.")]},
    }
    split = split_setup(parts)
    assert split is not None
    setup, questions = split
    assert setup == [text(RULES)]
    assert questions[20] == [start, text("Найдите S.")]


def test_repair_merges_game_parts_and_archives_them():
    raw = bank(
        task(19, [text(RULES + " Укажите минимальное S.")], "29"),
        task(20, [text(RULES), text("найдите два наименьших S.")], "28 48"),
        task(21, [text(RULES), text("найдите наименьшее S.")], "44"),
    )
    stats = repair(raw, TOPICS)
    assert stats == dict(titles=3, summaries=3, theory=3, merged=1, archived=3, unmerged=0)
    Bank.model_validate(raw).validate_references()
    merged = next(e["task"] for e in raw["tasks"] if e["task"].get("answer_parts"))
    data = TaskData.model_validate(merged)
    assert data.title == "Выигрышная стратегия"
    assert data.exam_numbers == [19, 20, 21]
    assert data.difficulty == 2
    assert data.sources[0].original_id == "31516"
    assert [p.key for p in data.answer_parts or []] == ["19", "20", "21"]
    assert [p.answer_instruction for p in data.answer_parts or []] == [
        "Ответ 19",
        "Ответ 20",
        "Ответ 21",
    ]
    parts = {p.key: p for p in data.checker.parts or []}
    assert is_correct(parts["20"], "28  48") and not is_correct(parts["21"], "29")
    assert [b.type for b in data.statement] == [
        "rich_text",
        "text",
        "rich_text",
        "text",
        "rich_text",
        "text",
        "rich_text",
    ]
    assert data.statement[4].data.spans[0].text == "Найдите два наименьших S."  # type: ignore[union-attr]
    archived = [e["task"] for e in raw["tasks"] if e["task"].get("archived")]
    assert len(archived) == 3 and not any(t["catalog_visible"] for t in archived)
    # A second run is a no-op for already merged games.
    assert repair(raw, TOPICS)["merged"] == 0


def test_mismatched_answer_parts_are_rejected():
    raw = bank(task(19, [text(RULES + " Укажите S.")], "1"))
    raw["tasks"][0]["task"]["answer_parts"] = [
        {"key": "19", "label": "Задание 19", "answer_instruction": "x"},
        {"key": "20", "label": "Задание 20", "answer_instruction": "y"},
    ]
    with pytest.raises(ValueError, match="answer parts must match"):
        Bank.model_validate(raw)
