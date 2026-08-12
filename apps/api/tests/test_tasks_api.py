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


@pytest.fixture
def content_task(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Iterator[Task]:
    task = Task.model_validate(
        {
            "id": "sample-task",
            "statement": "Введите контрольное значение",
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


def test_error_logging_middleware_does_not_break_normal_requests(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
