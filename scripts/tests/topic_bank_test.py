"""Bank statements of a topic task (topic_bank.py, Change 190).

Run: python3 -m unittest scripts.tests.topic_bank_test

The whole question becomes the statement: paragraphs are text, a Markdown table a
``table`` block, a code fence ``code_example``, a stand figure an ``image`` of the
same builder; the workbook view of a task is left out (the book is attached).
"""

import os
import sys
import unittest
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lesson_design"))

from topic_bank import statement, task_inventory  # noqa: E402

TOPIC = Path(__file__).resolve().parents[2] / "content/lesson-design/topic-1"


class StatementTest(unittest.TestCase):
    def test_paragraph_table_and_code(self) -> None:
        question = (
            "Сколько строк напечатает программа?\n\n"
            "   | C1 | F |\n   |---|---|\n   | \\* | 1 |\n\n"
            "   ```python\n   print(1)\n   ```"
        )
        blocks, images = statement(question)
        self.assertEqual([b["type"] for b in blocks], ["text", "table", "code_example"])
        self.assertEqual(blocks[1]["data"]["rows"], [["*", "1"]])
        self.assertEqual(
            blocks[2]["data"], {"language": "python", "code": "print(1)", "caption": None}
        )
        self.assertEqual(images, [])

    def test_a_workbook_view_is_left_out(self) -> None:
        blocks, _ = statement(
            "По файлу [22-1.xlsx](topic-22/files/22-1.xlsx) найдите время.\n\n"
            '    %%pr_book("22-1")%%'
        )
        self.assertEqual(
            blocks, [{"type": "text", "data": {"markdown": "По файлу 22-1.xlsx найдите время."}}]
        )

    def test_a_figure_becomes_an_image_of_its_builder(self) -> None:
        question = (
            'На рисунке схема дорог.\n\n   <figure class="plate-figure">\n'
            "   %%gm_graph('AB BC', {'A': (0, 0), 'B': (1, 0), 'C': (2, 0)})%%\n"
            "   <figcaption>Схема к задаче.</figcaption>\n   </figure>"
        )
        blocks, images = statement(question, TOPIC)
        self.assertEqual(blocks[1]["type"], "image")
        self.assertEqual(blocks[1]["data"]["usage_id"], "figure-1")
        (svg, png, alt, width, height) = images[0]
        self.assertTrue(svg.startswith("<svg") and png.name.startswith("fig-") and alt)
        self.assertEqual((blocks[1]["data"]["width"], blocks[1]["data"]["height"]), (width, height))


class InventoryTest(unittest.TestCase):
    def test_closing_words_do_not_replace_the_answers(self) -> None:
        block = (
            "**Задачи.**\n\n1. Первая?\n2. Вторая?\n\n**Ответы для проверки:**\n"
            "1. 10.\n2. 20.\n\n**Что дальше.** Порядок:\n\n1. Один.\n2. Два."
        )
        self.assertEqual(task_inventory(block)[2], ("Вторая?", "20."))


if __name__ == "__main__":
    unittest.main()
