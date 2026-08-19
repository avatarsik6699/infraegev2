from app.modules.content.schemas import Task
from app.modules.tasks.service import is_correct


def make_task(**overrides: object) -> Task:
    defaults: dict[str, object] = dict(
        id="t1",
        title="Test task",
        statement="...",
        hint="Test hint",
        checker_type="exact_match",
        answer_variants=["4", "четыре"],
        interaction_type="production",
        difficulty=1,
    )
    defaults.update(overrides)
    return Task.model_validate(defaults)


def test_exact_match_trims_and_lowercases():
    task = make_task()
    assert is_correct(task, "  Четыре  ")


def test_exact_match_yo_ye_folding():
    task = make_task(answer_variants=["ещё"])
    assert is_correct(task, "еще")


def test_exact_match_rejects_wrong_answer():
    task = make_task()
    assert not is_correct(task, "5")


def test_numeric_tolerance_accepts_comma_decimal_within_tolerance():
    task = make_task(
        checker_type="numeric_tolerance",
        answer_variants=["3.14"],
        numeric_tolerance=0.01,
    )
    assert is_correct(task, "3,145")


def test_numeric_tolerance_rejects_outside_tolerance():
    task = make_task(
        checker_type="numeric_tolerance",
        answer_variants=["3.14"],
        numeric_tolerance=0.01,
    )
    assert not is_correct(task, "3.2")


def test_numeric_tolerance_rejects_non_numeric_input():
    task = make_task(
        checker_type="numeric_tolerance",
        answer_variants=["3.14"],
        numeric_tolerance=0.01,
    )
    assert not is_correct(task, "not a number")
