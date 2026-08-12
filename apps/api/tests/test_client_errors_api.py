from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from structlog.testing import capture_logs

from app.main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


def valid_report() -> dict[str, object]:
    return {
        "kind": "render",
        "route_id": "/section/$sectionId",
        "fingerprint": "a" * 64,
        "asset_path": "/_build/assets/section-AbC123.js",
        "line": 42,
        "column": 7,
    }


def test_client_error_report_is_logged_as_bounded_structured_data(client: TestClient):
    with capture_logs() as logs:
        response = client.post("/api/client-errors", json=valid_report())

    assert response.status_code == 204
    assert response.content == b""
    client_error_logs = [log for log in logs if log.get("event") == "client.error_reported"]
    assert client_error_logs == [
        {
            "log_level": "error",
            "event": "client.error_reported",
            "error_source": "browser",
            "error_kind": "render",
            "route_id": "/section/$sectionId",
            "fingerprint": "a" * 64,
            "asset_path": "/_build/assets/section-AbC123.js",
            "line": 42,
            "column": 7,
            "deploy_sha": "development",
        }
    ]


@pytest.mark.parametrize(
    "field,value",
    [
        ("message", "raw exception"),
        ("stack", "raw stack"),
        ("url", "https://infraege.ru/example/x?answer=secret"),
        ("fingerprint", "not-a-sha256"),
        ("route_id", "/example/x?answer=secret"),
        ("asset_path", "https://third-party.example/script.js"),
        ("line", 0),
    ],
)
def test_client_error_report_rejects_unbounded_or_sensitive_fields(
    client: TestClient, field: str, value: object
):
    report = valid_report()
    report[field] = value

    assert client.post("/api/client-errors", json=report).status_code == 422
