import json

from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.modules.content.schemas import Task

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


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


def test_every_declared_answer_variant_is_accepted_through_real_endpoint():
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


def test_every_task_rejects_a_known_wrong_answer_with_substantive_feedback():
    for task in load_graphs_and_tables_tasks():
        response = client.post(
            f"/api/tasks/{task.id}/check",
            json={"answer": "заведомо неверный ответ"},
        )
        assert response.status_code == 200, task.id
        body = response.json()
        assert body["correct"] is False, task.id
        assert_substantive_explanation(body)


def test_check_unknown_task_returns_404():
    response = client.post("/api/tasks/does-not-exist/check", json={"answer": "5"})
    assert response.status_code == 404


def test_error_alert_middleware_does_not_break_normal_requests():
    # Middleware logs a warning instead of raising when Telegram isn't configured.
    response = client.get("/health")
    assert response.status_code == 200
