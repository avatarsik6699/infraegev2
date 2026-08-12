import json
from collections.abc import Iterator

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.modules.content.schemas import Task
from app.modules.health.api import require_database


@pytest.fixture
def client() -> Iterator[TestClient]:
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


def load_graphs_and_tables_tasks() -> list[Task]:
    tasks = []
    for path in sorted(settings.tasks_dir.glob("graphs-and-tables-*.json")):
        tasks.append(Task.model_validate_json(path.read_text(encoding="utf-8")))
    assert len(tasks) == 5
    return tasks


def assert_substantive_explanation(body: dict[str, object]) -> None:
    explanation = body["explanation"]
    serialized = json.dumps(explanation, ensure_ascii=False)
    assert len(serialized) >= 300
    assert "Типичная ошибка" in serialized


def test_every_declared_answer_variant_is_accepted_through_real_endpoint(
    client: TestClient,
):
    for task in load_graphs_and_tables_tasks():
        for answer in task.answer_variants:
            response = client.post(
                f"/api/tasks/{task.id}/check",
                json={"answer": answer},
            )
            assert response.status_code == 200, (task.id, answer)
            body = response.json()
            assert body["correct"] is True, (task.id, answer)
            assert_substantive_explanation(body)


def test_every_task_rejects_a_known_wrong_answer_with_substantive_feedback(
    client: TestClient,
):
    for task in load_graphs_and_tables_tasks():
        response = client.post(
            f"/api/tasks/{task.id}/check",
            json={"answer": "заведомо неверный ответ"},
        )
        assert response.status_code == 200, task.id
        body = response.json()
        assert body["correct"] is False, task.id
        assert_substantive_explanation(body)


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
    response = client.post("/api/tasks/graphs-and-tables-01/check", json=body)
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
        "diagram",
        "figure",
        "productive_failure_prompt",
        "text",
        "video_embed",
        "worked_example",
    }


def test_error_logging_middleware_does_not_break_normal_requests(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
