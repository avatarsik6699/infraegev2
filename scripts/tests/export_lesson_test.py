"""Topic lesson export with runs, sheets and formulas (export_lesson.py, Change 184).

Run: python3 -m unittest scripts.tests.export_lesson_test

A topic keeps its code-and-output blocks; a runnable block becomes CodeRunner, a
```sheet block SheetBlock (walls included) and an ```excel fence FormulaBlock —
the same blocks as the courses, named alike by the lesson and media exports.
"""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lesson_design"))

from export_lesson import Converter, checkpoint_block, summary_block, without_label  # noqa: E402
from export_media import code_entries  # noqa: E402

TOPIC = """Сумма строки:

```python
print(sum([2, 3]))
```

```output
5
```

Пройди по шагам:

```python run count.py
answer = 0
for x in [4, 5]:
    answer += x
print(answer)
```

```output
9
```

```sheet Поле select=A1
|   | A | B
| 1 | 1 | 2
| 2 | 3 | 4
wall right A1
frame A1:B2
```

```excel
B2: =МАКС(A2;B1)+B2 ⇒ 7
```
"""


class TopicBlocksTest(unittest.TestCase):
    def setUp(self) -> None:
        self.converter = Converter(set(), {}, [])
        self.jsx = self.converter.fragment(self.converter.prepare(TOPIC))

    def test_code_with_output_keeps_the_topic_look(self) -> None:
        self.assertIn('output={"5"}', self.jsx)
        self.assertNotIn('outputLayout="lines"', self.jsx)

    def test_run_sheet_and_formula(self) -> None:
        self.assertIn("<CodeRunner {...lessonMedia.runCount}", self.jsx)
        self.assertIn('<SheetBlock {...lessonMedia.sheet1} label={"Лист «Поле»"} />', self.jsx)
        self.assertIn(
            '<FormulaBlock lines={[{"cell": "B2", "formula": "=МАКС(A2;B1)+B2", "result": "7"}]}',
            self.jsx,
        )
        sheet = json.loads(self.converter.runs[0].split(": ", 1)[1].rstrip(","))
        self.assertEqual(
            sheet["sheets"][0]["walls"], {"A1": "trl", "A2": "bl", "B1": "tr", "B2": "rb"}
        )

    def test_media_export_names_blocks_alike(self) -> None:
        keys = [e.split(":", 1)[0].strip() for e in code_entries([TOPIC])]
        self.assertEqual(keys, ["sheet1", "runCount"])

    def test_a_repeated_file_name_gets_a_number(self) -> None:
        keys = [e.split(":", 1)[0].strip() for e in code_entries([TOPIC, TOPIC])]
        self.assertEqual(keys, ["sheet1", "runCount", "sheet2", "runCount2"])


class StepHeadingTest(unittest.TestCase):
    """The step heading is its navLabel: «**Итого.**» under «Итого» is not repeated."""

    def test_a_bold_opening_equal_to_the_label_is_dropped(self) -> None:
        self.assertEqual(without_label("**Итого.**\n\n- пункт", "Итого"), "- пункт")
        self.assertEqual(without_label("**Итого.** Решение…", "Итого"), "Решение…")

    def test_a_claim_is_kept(self) -> None:
        step = "**Строка таблицы описывает один объект.** Посмотрим…"
        self.assertEqual(without_label(step, "Строка — объект"), step)


class FenceTest(unittest.TestCase):
    """A code block holds code, output or file lines, never prose (T24)."""

    def test_a_text_fence_is_refused(self) -> None:
        converter = Converter(set(), {}, [])
        with self.assertRaises(SystemExit):
            converter.blocks("```text\n(M1 ИЛИ M3) И продажа\n```\n")

    def test_file_lines_stay_a_code_block(self) -> None:
        converter = Converter(set(), {}, [])
        (block,) = converter.blocks("```27.txt\n1.5 3.2\n```\n")
        self.assertIn('fileName="27.txt"', block)

    def test_an_executor_program_is_a_plain_code_block(self) -> None:
        converter = Converter(set(), {}, [])
        (block,) = converter.blocks("```algo\nПовтори 4 [Вперёд 3 Направо 90]\n```\n")
        self.assertIn('label={"Алгоритм для исполнителя"} language="text"', block)


class SummaryTest(unittest.TestCase):
    """«Итого» is LessonSummary: keys and notes, never a mix of the two forms."""

    def test_keyed_items_give_keys_and_notes(self) -> None:
        jsx = summary_block(["**Первичный ключ** — различает записи.", "`#Н/Д` — ключ не найден."])
        self.assertIn("{ key: <><strong>Первичный ключ</strong></>, note: <>различает", jsx)
        self.assertIn('key: <><Notation>{"#Н/Д"}</Notation></>', jsx)

    def test_a_list_with_a_plain_item_has_no_keys(self) -> None:
        jsx = summary_block(["**Ключ** — пояснение.", "Строка — запись, столбец — поле."])
        self.assertNotIn("key:", jsx)
        self.assertIn("{ note: <>Строка — запись", jsx)

    def test_only_the_summary_step_is_converted(self) -> None:
        converter = Converter(set(), {}, [])
        self.assertIn("<LessonSummary", converter.fragment("- **А** — б.", summary=True))
        self.assertIn("<ul>", converter.fragment("- **А** — б."))


class CheckpointTest(unittest.TestCase):
    """A self-check question has no workbook view: its file is in the bank task; a table,
    a scheme or code of the question is converted like a step (Change 190)."""

    def test_a_figure_call_is_refused(self) -> None:
        check = {
            "id": "z",
            "prompt": 'Найди район.\n\n    %%db_book("3-1")%%',
            "reveal": "Северный",
        }
        with self.assertRaises(SystemExit):
            checkpoint_block([check], "")

    def test_a_plain_question_is_exported(self) -> None:
        check = {"id": "z", "prompt": "Что означает строка?", "reveal": "Одну выдачу."}
        self.assertIn("Одну выдачу.", checkpoint_block([check], ""))

    def test_a_question_with_a_table_is_converted_like_a_step(self) -> None:
        prompt = "Таблица дорог:\n\n   | Пункт | 1 | 2 |\n   |---|---:|---:|\n   | **1** | — | * |"
        check = {"id": "z", "prompt": prompt, "reveal": "Одна дорога."}
        jsx = checkpoint_block([check], "", Converter(set(), {}, []))
        self.assertIn("<LessonTable", jsx)
        self.assertIn("Одна дорога.", jsx)


if __name__ == "__main__":
    unittest.main()
