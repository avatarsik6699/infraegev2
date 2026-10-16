"""A historical format must not dilute the current exam's frequency denominator."""

import importlib.util
import unittest
from pathlib import Path
from types import SimpleNamespace

MODULE = Path(__file__).resolve().parents[1] / "lesson_design" / "frequency_report.py"
spec = importlib.util.spec_from_file_location("frequency_report", MODULE)
assert spec and spec.loader
frequency_report = importlib.util.module_from_spec(spec)
spec.loader.exec_module(frequency_report)


def topic():
    return SimpleNamespace(
        TOPIC_NUMBER=12,
        SOURCE="https://example.test/task/{}",
        FETCHED="2026-10-16",
        COLLECTIONS={"mt": ("МТ", 426), "old": ("Прежний формат", 356)},
        SHORT={"mt": "МТ", "old": "история"},
        TASKS=[(1, "mt", "", "свой тип", "trace"), (2, "old", "", "исторический тип", "replace")],
        RECENT=2026,
        NAMES={"trace": "Трасса", "replace": "Замена"},
        TREND="",
        CORE_RULE="",
        ADVANCED_RULE="",
        year=lambda _: 2026,
        level=lambda techniques: "основной" if techniques == "trace" else "дополнительный",
    )


class FrequencyCorpusTest(unittest.TestCase):
    def test_default_keeps_every_task_in_denominator(self):
        result = frequency_report.report(topic())
        self.assertIn("**1 из 2 (50%)**", result)
        self.assertNotIn("Размечено условий:", result)

    def test_primary_counts_only_current_but_keeps_historical_rows(self):
        data = topic()
        data.ANALYSIS_TASKS = data.TASKS[:1]
        result = frequency_report.report(data)
        self.assertIn("**1 из 1 (100%)**", result)
        self.assertIn("Размечено условий: **2**", result)
        self.assertIn("исторический тип", result)
        self.assertIn("| Замена | 0 | 0%", result)

    def test_rejects_empty_duplicate_or_unrelated_corpus(self):
        for selected in [[], [topic().TASKS[0]] * 2, [(3, "mt", "", "не из таблицы", "trace")]]:
            with self.subTest(selected=selected):
                data = topic()
                data.ANALYSIS_TASKS = selected
                with self.assertRaises(ValueError):
                    frequency_report.report(data)


if __name__ == "__main__":
    unittest.main()
