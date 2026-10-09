"""B1 (Change 171): a lesson membership may keep its task outside the mastery total."""

import pytest

from app.modules.practice.readers import counts_toward_mastery, group_versions
from app.modules.practice.schemas import Membership

pytestmark = pytest.mark.pure


def test_flag_defaults_to_counted_and_is_stored_only_when_false() -> None:
    counted = Membership(material_id="topic", position=0)
    outside = Membership(material_id="topic", position=1, counts_toward_mastery=False)
    assert counted.counts_toward_mastery
    # Existing task content keeps its exact shape; only the exception is written.
    assert counted.model_dump(mode="json") == {"material_id": "topic", "position": 0}
    assert outside.model_dump(mode="json")["counts_toward_mastery"] is False


def test_summary_reads_the_flag_of_the_summarised_material() -> None:
    memberships: list[dict[str, object]] = [
        {"material_id": "topic", "position": 3, "counts_toward_mastery": False},
        {"material_id": "other", "position": 0},
    ]
    assert not counts_toward_mastery(memberships, "topic")
    assert counts_toward_mastery(memberships, "other")
    assert counts_toward_mastery([], "topic")


def test_totals_with_and_without_flagged_tasks() -> None:
    rows = [
        ("topic", "core-1", 1, [{"material_id": "topic", "position": 0}]),
        ("topic", "core-2", 2, [{"material_id": "topic", "position": 1}]),
        (
            "topic",
            "advanced-1",
            1,
            [{"material_id": "topic", "position": 2, "counts_toward_mastery": False}],
        ),
        ("plain", "task", 1, None),
    ]
    grouped = group_versions(rows)
    topic = grouped["topic"]
    assert [task.id for task in topic] == ["core-1", "core-2", "advanced-1"]
    assert sum(task.counts_toward_mastery for task in topic) == 2
    assert all(task.counts_toward_mastery for task in grouped["plain"])
