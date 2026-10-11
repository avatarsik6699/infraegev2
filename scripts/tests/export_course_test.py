"""Course export of the Excel course (scripts/lesson_design/export_course.py, Change 177).

Run: python3 -m unittest scripts.tests.export_course_test

The Excel blocks of a stand lesson become site components: a live sheet → SheetBlock with
its data in the media manifest, a formula fence → FormulaBlock, fill_try →
FillSandbox; the publication lists every course of the stand.
"""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lesson_design"))

from export_course import CourseConverter, publication_source, stand_courses  # noqa: E402
from export_media import media_key  # noqa: E402

LESSON = """Формула стоимости:

```sheet База select=D3
|   | A        | B    | C | D
| 1 | Товар    | Цена | Шт | Стоимость
| 2 | Тетрадь  | 40   | 5 | =B2*C2 ⇒ 200
| 3 | Ручка    | 20   | 3 | ⇒ 60
fill D2:D3
```

Скидку закрепляют:

```excel
=D2*(1-$H$2)
```

```excel шаблон
=ЕСЛИ(условие;1;0)
```

%%fill_try("=$A2*B$1", "B2", "D4")%%
"""


class ExcelLessonTest(unittest.TestCase):
    def setUp(self) -> None:
        self.converter = CourseConverter(set())
        self.jsx = self.converter.fragment(self.converter.prepare(LESSON))

    def test_sheet_block_and_its_data(self) -> None:
        self.assertIn('<SheetBlock {...lessonMedia.sheet1} label={"Лист «База»"} />', self.jsx)
        (entry,) = self.converter.runs
        data = json.loads(entry.split(": ", 1)[1].rstrip(","))
        self.assertEqual(data["kind"], "sheet")
        (sheet,) = data["sheets"]
        self.assertEqual(sheet["inputs"]["D3"], "=B3*C3")
        self.assertEqual(sheet["formulas"], [{"cell": "D2", "formula": "=B2*C2", "until": "D3"}])
        self.assertEqual(data["select"], ["База", "D3"])

    def test_formula_fences(self) -> None:
        self.assertIn(
            '<FormulaBlock lines={[{"formula": "=D2*(1-$H$2)"}]} label="Формула" />', self.jsx
        )
        self.assertIn('label="Шаблон формулы"', self.jsx)

    def test_fill_sandbox(self) -> None:
        self.assertIn(
            '<FillSandbox defaultFormula={"=$A2*B$1"} origin="B2" defaultTarget="D4" />',
            self.jsx,
        )
        self.assertTrue({"SheetBlock", "FillSandbox", "FormulaBlock"} <= self.converter.imports)


class PublicationTest(unittest.TestCase):
    def test_every_course_of_the_stand_python_first(self) -> None:
        courses = stand_courses()
        self.assertEqual([c["id"] for c in courses][:2], ["python", "excel"])
        source, declarations = publication_source(courses)
        self.assertIn(
            "export const coursePublications = Object.freeze("
            "[pythonCoursePublication, excelCoursePublication]);",
            source,
        )
        self.assertIn('shortTitle: "Excel"', source)
        self.assertIn("export const excelCoursePublication", declarations)

    def test_formula_steps_keys_differ_for_one_cell(self) -> None:
        one = media_key("formula_steps", ["A2=12", ["=A2+B2/2", "14,5"], ["a", "b"]])
        two = media_key("formula_steps", ["A2=12", ["=(A2+B2)/2", "8,5"], ["a", "b"]])
        self.assertNotEqual(one, two)


if __name__ == "__main__":
    unittest.main()
