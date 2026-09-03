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

NEW_PYTHON_COURSE_LESSON_IDS = {
    "python-numbers",
    "python-compound-conditions",
    "python-for-range",
    "python-while",
    "python-loop-state",
    "python-number-digits",
    "python-strings",
    "python-lists",
    "python-sets",
    "python-dictionaries",
    "python-sorting-search",
    "python-comprehensions",
    "python-functions",
    "python-program-parts",
    "python-iterators-generators",
    "python-recursion",
    "python-exceptions",
    "python-files",
    "python-tables",
    "python-bruteforce",
    "python-select-result",
    "python-todo-start",
    "python-todo-actions",
    "python-todo-storage",
    "python-independent-program",
}


def text_blocks(text: str) -> list[dict[str, object]]:
    return [{"type": "text", "data": {"markdown": text}}]


def new_python_course_task_paths() -> list[Path]:
    content_root = Path(__file__).resolve().parents[3] / "content" / "tasks"
    paths = []
    for task_path in sorted(content_root.glob("python-*.json")):
        task = Task.model_validate_json(task_path.read_text(encoding="utf-8"))
        if (
            len(task.course_lesson_ids) == 1
            and task.course_lesson_ids[0] in NEW_PYTHON_COURSE_LESSON_IDS
        ):
            paths.append(task_path)
    return paths


@pytest.fixture
def content_task(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Iterator[Task]:
    task = Task.model_validate(
        {
            "id": "sample-task",
            "topic_ids": ["sample-topic"],
            "title": "Контрольное значение",
            "statement": text_blocks("Введите контрольное значение"),
            "hint": text_blocks("Вспомните ответ на главный вопрос."),
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
        "diagram",
        "image",
        "attachment",
        "list",
        "productive_failure_prompt",
        "table",
        "text",
        "worked_example",
    }


def test_rich_content_contract_accepts_explicit_blocks_and_rejects_legacy_shapes(
    content_task: Task,
):
    task = content_task.model_dump()
    task["statement"] = [
        {"type": "list", "data": {"style": "ordered", "items": ["Шаг 1"]}},
        {
            "type": "table",
            "data": {"headers": ["n", "F(n)"], "rows": [["1", "1"]]},
        },
        {
            "type": "image",
            "data": {
                "src": "/content/tasks/sample-task/image.png",
                "alt": "Пример изображения",
                "caption": "Подпись",
                "width": 640,
                "height": 360,
            },
        },
        {
            "type": "diagram",
            "data": {
                "src": "/content/tasks/sample-task/diagram.webp",
                "alt": "Схема",
                "caption": "Связи",
                "width": 640,
                "height": 360,
                "purpose": "Показать порядок",
                "accessible_description": "Первый шаг ведёт ко второму",
                "pointers": [{"label": "Шаг 1", "description": "Начало"}],
            },
        },
        {
            "type": "attachment",
            "data": {
                "src": "/content/tasks/sample-task/data.txt",
                "label": "data.txt",
                "description": "Данные задания",
                "mime_type": "text/plain",
                "size_bytes": 12,
            },
        },
    ]
    assert [block.type for block in Task.model_validate(task).statement] == [
        "list",
        "table",
        "image",
        "diagram",
        "attachment",
    ]

    for legacy_type in ("learning_visual", "video_embed", "figure"):
        with pytest.raises(ValueError):
            Task.model_validate({**task, "statement": [{"type": legacy_type, "data": {}}]})

    with pytest.raises(ValueError, match="header width"):
        Task.model_validate(
            {
                **task,
                "statement": [
                    {
                        "type": "table",
                        "data": {"headers": ["a", "b"], "rows": [["1"]]},
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


@pytest.mark.parametrize(
    ("task_id", "correct_answer", "normalized_answer"),
    [
        ("python-errors-final-line", "NameError", " nameerror "),
        ("python-errors-source-line", "2 TypeError", " typeerror 2 "),
        ("python-errors-syntax-fix", ":", " : "),
        ("python-errors-value-error", "ValueError", " valueerror "),
        ("python-errors-local-fix", "12", " 12 "),
    ],
)
def test_python_errors_tasks_are_strict_and_checkable(
    task_id: str,
    correct_answer: str,
    normalized_answer: str,
):
    content_root = Path(__file__).resolve().parents[3] / "content" / "tasks"
    task = Task.model_validate_json((content_root / f"{task_id}.json").read_text(encoding="utf-8"))

    assert task.topic_ids == []
    assert task.course_lesson_ids == ["python-errors"]
    assert task.title
    assert task.hint
    assert task.theory_links
    assert task.explanation

    for accepted_answer in task.answer_variants:
        assert is_correct(task, accepted_answer)
    assert is_correct(task, correct_answer)
    assert is_correct(task, normalized_answer)
    assert not is_correct(task, "неверно")


@pytest.mark.parametrize(
    "task_path",
    new_python_course_task_paths(),
    ids=lambda task_path: task_path.stem,
)
def test_remaining_python_course_tasks_are_strict_and_checkable(task_path: Path):
    task = Task.model_validate_json(task_path.read_text(encoding="utf-8"))

    assert task.topic_ids == []
    assert len(task.course_lesson_ids) == 1
    assert task.course_lesson_ids[0] in NEW_PYTHON_COURSE_LESSON_IDS
    assert task.title
    assert task.hint
    assert task.theory_links
    assert task.explanation
    assert task.interaction_type == "production"

    for accepted_answer in task.answer_variants:
        assert is_correct(task, accepted_answer)
        assert is_correct(task, f"  {accepted_answer.swapcase()}  ")
    assert not is_correct(task, "заведомо неверный ответ")


def test_remaining_python_course_has_exactly_five_tasks_per_lesson():
    task_counts = dict.fromkeys(NEW_PYTHON_COURSE_LESSON_IDS, 0)
    for task_path in new_python_course_task_paths():
        task = Task.model_validate_json(task_path.read_text(encoding="utf-8"))
        task_counts[task.course_lesson_ids[0]] += 1

    assert len(new_python_course_task_paths()) == 125
    assert set(task_counts.values()) == {5}
