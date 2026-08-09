from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_check_correct_answer_against_placeholder_fixture():
    response = client.post(
        "/api/tasks/placeholder-task/check", json={"answer": " ЧЕТЫРЕ "}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["correct"] is True
    assert body["explanation"]


def test_check_wrong_answer():
    response = client.post("/api/tasks/placeholder-task/check", json={"answer": "5"})
    assert response.status_code == 200
    assert response.json()["correct"] is False


def test_check_unknown_task_returns_404():
    response = client.post("/api/tasks/does-not-exist/check", json={"answer": "5"})
    assert response.status_code == 404


def test_error_alert_middleware_does_not_break_normal_requests():
    # Middleware logs a warning instead of raising when Telegram isn't configured.
    response = client.get("/health")
    assert response.status_code == 200
