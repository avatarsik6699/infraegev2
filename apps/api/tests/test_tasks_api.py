import json
from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.modules.content.schemas import Task
from app.modules.content.service import clear_cache
from app.modules.health.api import require_database
from app.modules.tasks.service import is_correct


@pytest.fixture
def content_task(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Iterator[Task]:
    task = Task.model_validate(
        {
            "id": "sample-task",
            "topic_ids": ["sample-topic"],
            "title": "Контрольное значение",
            "statement": "Введите контрольное значение",
            "hint": "Вспомните ответ на главный вопрос.",
            "theory_links": [{"hash": "sample-theory", "label": "К теории"}],
            "checker_type": "exact_match",
            "answer_variants": ["42", "сорок два"],
            "interaction_type": "production",
            "difficulty": 1,
            "explanation": [
                {
                    "type": "callout",
                    "data": {
                        "tone": "info",
                        "markdown": "Проверьте вычисления и повторите попытку.",
                    },
                }
            ],
        }
    )
    tasks_dir = tmp_path / "tasks"
    tasks_dir.mkdir()
    (tasks_dir / f"{task.id}.json").write_text(
        json.dumps(task.model_dump(mode="json"), ensure_ascii=False),
        encoding="utf-8",
    )
    monkeypatch.setattr(settings, "content_dir", tmp_path)
    clear_cache()
    try:
        yield task
    finally:
        clear_cache()


@pytest.fixture
def client(content_task: Task) -> Iterator[TestClient]:
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()


def test_health(client: TestClient):
    expected = {"status": "ok", "version": settings.deploy_sha}
    assert client.get("/health/live").json() == expected
    assert client.get("/health/ready").json() == expected
    assert client.get("/health").json() == expected


def test_readiness_returns_503_when_database_is_unavailable(client: TestClient):
    async def unavailable_database() -> None:
        raise HTTPException(status_code=503, detail="database unavailable")

    app.dependency_overrides[require_database] = unavailable_database
    assert client.get("/health/live").status_code == 200
    response = client.get("/health/ready")
    assert response.status_code == 503
    assert response.json() == {"detail": "database unavailable"}


def test_every_declared_answer_variant_is_accepted_through_endpoint(
    client: TestClient, content_task: Task
):
    for answer in content_task.answer_variants:
        response = client.post(
            f"/api/tasks/{content_task.id}/check",
            json={"answer": answer},
        )
        assert response.status_code == 200, answer
        assert response.json() == {
            "correct": True,
            "explanation": [
                {
                    "type": "callout",
                    "data": {
                        "tone": "info",
                        "markdown": "Проверьте вычисления и повторите попытку.",
                    },
                }
            ],
        }


def test_task_rejects_a_known_wrong_answer_with_feedback(client: TestClient, content_task: Task):
    response = client.post(
        f"/api/tasks/{content_task.id}/check",
        json={"answer": "заведомо неверный ответ"},
    )
    assert response.status_code == 200
    assert response.json()["correct"] is False
    assert response.json()["explanation"]


def test_check_unknown_task_returns_404(client: TestClient):
    response = client.post("/api/tasks/does-not-exist/check", json={"answer": "5"})
    assert response.status_code == 404


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"answer": ""},
        {"answer": "x" * 501},
        {"answer": "5", "unexpected": True},
    ],
)
def test_check_answer_rejects_invalid_request_contract(client: TestClient, body: dict[str, object]):
    response = client.post("/api/tasks/sample-task/check", json=body)
    assert response.status_code == 422


def test_openapi_exposes_discriminated_content_blocks(client: TestClient):
    schema = client.get("/openapi.json").json()
    check_response = schema["components"]["schemas"]["CheckResponse"]
    explanation_items = check_response["properties"]["explanation"]["items"]

    assert "oneOf" in explanation_items
    assert explanation_items["discriminator"]["propertyName"] == "type"
    assert set(explanation_items["discriminator"]["mapping"]) == {
        "callout",
        "code_example",
        "completion_exercise",
        "learning_visual",
        "productive_failure_prompt",
        "text",
        "video_embed",
        "worked_example",
    }


def test_learning_visual_contract_accepts_generic_json_and_rejects_legacy_shapes(
    content_task: Task,
):
    common = {
        "purpose": "Показать последовательность",
        "accessible_description": "Три связанных этапа процесса",
        "caption": "Этапы выполняются по порядку",
    }
    visual = {
        "kind": "relationship_map",
        "data": {
            "items": [
                {"id": "first", "label": "Первый этап"},
                {"id": "second", "label": "Второй этап"},
            ],
            "links": [{"source": "first", "target": "second"}],
        },
    }

    task = content_task.model_dump()
    task["explanation"] = [
        {
            "type": "learning_visual",
            "data": {**common, "representation": "structured", "visual": visual},
        }
    ]
    assert Task.model_validate(task).explanation[0].type == "learning_visual"

    with pytest.raises(ValueError):
        Task.model_validate({**task, "explanation": [{"type": "figure", "data": {}}]})
    with pytest.raises(ValueError):
        Task.model_validate(
            {
                **task,
                "explanation": [
                    {
                        "type": "learning_visual",
                        "data": {
                            **common,
                            "representation": "structured",
                            "visual": {
                                "kind": "legacy_shape",
                                "nodes": ["first", "second"],
                            },
                        },
                    }
                ],
            }
        )
    with pytest.raises(ValueError):
        Task.model_validate(
            {
                **task,
                "explanation": [
                    {
                        "type": "learning_visual",
                        "data": {**common, "representation": "raster"},
                    }
                ],
            }
        )


def test_task_requires_one_independent_content_owner(content_task: Task):
    task = content_task.model_dump()

    with pytest.raises(ValueError, match="must belong"):
        Task.model_validate({**task, "topic_ids": [], "course_lesson_ids": []})

    with pytest.raises(ValueError, match="cannot bridge"):
        Task.model_validate(
            {
                **task,
                "topic_ids": ["sample-topic"],
                "course_lesson_ids": ["sample-course-lesson"],
            }
        )


def test_error_logging_middleware_does_not_break_normal_requests(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200


@pytest.mark.parametrize(
    ("task_id", "correct_answer"),
    [
        ("rekursiya-base-sequence", "32"),
        ("rekursiya-call-stack-trace", "16"),
        ("rekursiya-two-values", "29"),
        ("rekursiya-repeated-calls", "25"),
        ("rekursiya-large-ratio", "9900"),
    ],
)
def test_recursion_content_tasks_are_strict_and_checkable(
    task_id: str,
    correct_answer: str,
):
    content_root = Path(__file__).resolve().parents[3] / "content" / "tasks"
    task = Task.model_validate_json((content_root / f"{task_id}.json").read_text(encoding="utf-8"))

    assert task.topic_ids == ["rekursiya"]
    assert task.title
    assert task.hint
    assert task.theory_links
    assert task.explanation

    for accepted_answer in task.answer_variants:
        assert is_correct(task, accepted_answer)
    assert is_correct(task, correct_answer)
    assert not is_correct(task, "неверно")


@pytest.mark.parametrize(
    ("task_id", "correct_answer"),
    [
        ("preobrazovanie-zapisey-appending", "77"),
        ("preobrazovanie-zapisey-parity", "90"),
        ("preobrazovanie-zapisey-base-three", "134"),
        ("preobrazovanie-zapisey-digit-replacement", "6"),
        ("preobrazovanie-zapisey-non-monotonic-maximum", "55"),
    ],
)
def test_number_record_transformation_tasks_are_strict_and_checkable(
    task_id: str,
    correct_answer: str,
):
    content_root = Path(__file__).resolve().parents[3] / "content" / "tasks"
    task = Task.model_validate_json((content_root / f"{task_id}.json").read_text(encoding="utf-8"))

    assert task.topic_ids == ["preobrazovanie-zapisey-chisel"]
    assert task.title
    assert task.hint
    assert task.theory_links
    assert task.explanation

    for accepted_answer in task.answer_variants:
        assert is_correct(task, accepted_answer)
    assert is_correct(task, correct_answer)
    assert not is_correct(task, "неверно")


@pytest.mark.parametrize(
    ("task_id", "correct_answer"),
    [
        ("python-first-program-output-order", "8"),
        ("python-first-program-variable-trace", "11"),
        ("python-first-program-input-conversion", "17"),
        ("python-first-program-expression", "24"),
        ("python-first-program-local-run", "420"),
    ],
)
def test_first_python_course_lesson_tasks_are_strict_and_checkable(
    task_id: str,
    correct_answer: str,
):
    content_root = Path(__file__).resolve().parents[3] / "content" / "tasks"
    task = Task.model_validate_json((content_root / f"{task_id}.json").read_text(encoding="utf-8"))

    assert task.topic_ids == []
    assert task.course_lesson_ids == ["python-first-program"]
    assert task.title
    assert task.hint
    assert task.theory_links
    assert task.explanation

    for accepted_answer in task.answer_variants:
        assert is_correct(task, accepted_answer)
    assert is_correct(task, correct_answer)
    assert not is_correct(task, "неверно")


@pytest.mark.parametrize(
    ("task_id", "correct_answer", "normalized_answer"),
    [
        ("python-conditions-comparison-result", "True", " true "),
        ("python-conditions-branch-trace", "не больше", " НЕ БОЛЬШЕ "),
        ("python-conditions-boundary", "зачёт", " ЗАЧЕТ "),
        ("python-conditions-operator", ">=", " >= "),
        ("python-conditions-local-run", "не мороз", " НЕ МОРОЗ "),
    ],
)
def test_python_conditions_tasks_are_strict_and_checkable(
    task_id: str,
    correct_answer: str,
    normalized_answer: str,
):
    content_root = Path(__file__).resolve().parents[3] / "content" / "tasks"
    task = Task.model_validate_json((content_root / f"{task_id}.json").read_text(encoding="utf-8"))

    assert task.topic_ids == []
    assert task.course_lesson_ids == ["python-conditions"]
    assert task.title
    assert task.hint
    assert task.theory_links
    assert task.explanation

    for accepted_answer in task.answer_variants:
        assert is_correct(task, accepted_answer)
    assert is_correct(task, correct_answer)
    assert is_correct(task, normalized_answer)
    assert not is_correct(task, "неверно")
