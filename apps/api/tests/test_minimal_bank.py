"""Real PostgreSQL acceptance for the single-operator bank. Runners stay on host."""

import asyncio
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import database_engine
from app.main import create_app
from app.modules.practice import catalog, readers
from app.modules.practice.models import TaskRecord
from app.modules.practice.schemas import Bank, TheoryLink
from app.modules.practice.service import export_bank, import_bank

ROOT = Path(__file__).resolve().parents[3]
BANK = ROOT / "content/practice-bank"
IMAGE = (
    "postgres:18.6-alpine3.24@sha256:"
    "d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2"
)


@pytest.fixture(scope="module")
def database():
    name = f"infraege-db-test-122-{os.getpid()}"
    env = {
        "POSTGRES_USER": "infraege",
        "POSTGRES_DB": "infraege",
        "POSTGRES_PASSWORD": "infraege-122-bootstrap",
        "DB_RUNTIME_PASSWORD": "infraege-122-runtime",
        "DB_APP_PASSWORD": "infraege-122-app",
        "DB_IMPORT_PASSWORD": "infraege-122-import",
        "DB_MIGRATION_PASSWORD": "infraege-122-migration",
        "DB_BACKUP_PASSWORD": "infraege-122-backup",
    }
    command = [
        "docker",
        "run",
        "-d",
        "--name",
        name,
        "--label",
        "com.infraege.db-purpose=test",
        "-p",
        "127.0.0.1::5432",
        "-v",
        f"{ROOT}/scripts/db-provision-roles.sh:/docker-entrypoint-initdb.d/roles.sh:ro",
    ]
    for key, value in env.items():
        command.extend(["-e", f"{key}={value}"])
    subprocess.run([*command, IMAGE], check=True, capture_output=True)
    try:
        for _ in range(60):
            ready = subprocess.run(
                [
                    "docker",
                    "exec",
                    name,
                    "psql",
                    "-U",
                    "infraege_migration",
                    "-d",
                    "infraege",
                    "-tAc",
                    "SELECT 1",
                ],
                capture_output=True,
            )
            if ready.returncode == 0 and ready.stdout.strip() == b"1":
                break
            time.sleep(1)
        else:
            raise RuntimeError("test migration role did not become ready")
        port = (
            subprocess.check_output(["docker", "port", name, "5432"], text=True)
            .strip()
            .split(":")[-1]
        )

        def url(role):
            return f"postgresql://infraege_{role}:infraege-122-{role}@127.0.0.1:{port}/infraege"

        migration = subprocess.run(
            ["uv", "run", "alembic", "upgrade", "head"],
            cwd=ROOT / "apps/api",
            env={**os.environ, "MIGRATION_DATABASE_URL": url("migration")},
            check=False,
            capture_output=True,
            text=True,
        )
        assert migration.returncode == 0, migration.stderr[-2000:]

        async def seed():
            engine = database_engine(url("import"))
            try:
                async with AsyncSession(engine) as session, session.begin():
                    await import_bank(
                        session,
                        Bank.model_validate_json((BANK / "bank.json").read_bytes()),
                        BANK / "files",
                    )
            finally:
                await engine.dispose()

        asyncio.run(seed())
        subprocess.run(
            ["uv", "run", "alembic", "check"],
            cwd=ROOT / "apps/api",
            env={**os.environ, "MIGRATION_DATABASE_URL": url("migration")},
            check=True,
            capture_output=True,
        )
        yield url
    finally:
        subprocess.run(["docker", "rm", "-fv", name], check=True, capture_output=True)


def test_roundtrip_replay_and_atomic_failure(database):
    async def scenario():
        engine = database_engine(database("import"))
        source = Bank.model_validate_json((BANK / "bank.json").read_bytes())
        try:
            async with AsyncSession(engine) as session, session.begin():
                before = await export_bank(session)
                assert {e.task.id: e.model_dump() for e in before.tasks} == {
                    e.task.id: e.model_dump() for e in source.tasks
                }
                await import_bank(session, source, BANK / "files")
                after = await export_bank(session)
                assert before.tasks == after.tasks
            broken = source.model_copy(deep=True)
            broken.tasks[0].task.title = "Should roll back"
            broken.tasks[-1].task.lessons[0].material_id = "missing-material"
            with pytest.raises(ValueError, match="unknown lesson"):
                async with AsyncSession(engine) as session, session.begin():
                    changed = source.model_copy(deep=True)
                    changed.tasks = [changed.tasks[0]]
                    changed.tasks[0].task.title = "Earlier write in the same transaction"
                    await import_bank(session, changed, BANK / "files")
                    await import_bank(session, broken, BANK / "files")
            async with AsyncSession(engine) as session:
                after = await export_bank(session)
                assert before.tasks == after.tasks
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_http_catalog_privacy_checker_and_files(database, monkeypatch, tmp_path):
    monkeypatch.setattr(settings, "database_url", database("runtime"))
    monkeypatch.setenv("TASK_FILES_DIR", str(BANK / "files"))
    source = Bank.model_validate_json((BANK / "bank.json").read_bytes())
    with TestClient(create_app()) as client:
        first = client.get("/api/tasks").json()
        second = client.get("/api/tasks?page=2").json()
        assert first["total"] == 547 and len(first["tasks"]) == 30
        assert first["next_page"] == 2
        assert not ({x["id"] for x in first["tasks"]} & {x["id"] for x in second["tasks"]})
        assert client.get("/api/tasks?page=0").status_code == 422
        assert client.get("/api/tasks?exam_number=27").json()["tasks"] == []
        assert client.get("/api/tasks/missing").status_code == 404
        assert client.get("/health/ready").status_code == 200
        for entry in source.tasks:
            response = client.get(f"/api/tasks/{entry.task.id}")
            assert response.status_code == 200
            public = response.json()
            assert "checker" not in public["content"]
            expected = [
                s.model_dump(exclude={"is_public"}) for s in entry.task.sources if s.is_public
            ]
            assert public["content"]["sources"] == expected
        entry = source.tasks[0]
        url = f"/api/tasks/{entry.task.id}/check"
        assert client.post(
            url,
            json={
                "answer": entry.task.checker.answer_variants[0],
                "solution_revision": entry.solution_revision,
            },
        ).json()["correct"]
        assert not client.post(
            url, json={"answer": "not-an-answer", "solution_revision": entry.solution_revision}
        ).json()["correct"]
        assert (
            client.post(
                url, json={"answer": "0", "solution_revision": entry.solution_revision + 1}
            ).status_code
            == 409
        )
        attached = next(e for e in source.tasks if e.task.files)
        file = attached.task.files[0]
        response = client.get(f"/api/tasks/{attached.task.id}/files/{file.id}")
        assert response.status_code == 200 and response.headers["x-accel-redirect"].endswith(
            file.checksum
        )
        file_url = f"/api/tasks/{attached.task.id}/files/{file.id}"
        assert client.get(f"/api/tasks/{attached.task.id}/files/missing").status_code == 404
        monkeypatch.setenv("TASK_FILES_DIR", str(tmp_path))
        assert client.get(file_url).status_code == 503
        (tmp_path / file.checksum).write_bytes(b"wrong-size")
        invalid = client.get(file_url)
        assert invalid.status_code == 503
        assert "x-accel-redirect" not in invalid.headers
        assert str(tmp_path) not in invalid.text
        assert client.get("/api/client-errors").status_code == 404


def test_pagination_next_and_lesson_membership(database):
    async def scenario():
        engine = database_engine(database("runtime"))
        try:
            async with AsyncSession(engine) as session:
                first = await catalog.page(session, catalog.CatalogQuery(exam_number=16))
                following = await catalog.next_task(
                    session, first.tasks[0].id, catalog.CatalogFilters(exam_number=16)
                )
                assert following.task_id == first.tasks[1].id
                source = Bank.model_validate_json((BANK / "bank.json").read_bytes())
                for material in source.materials:
                    expected = sorted(
                        [
                            (link.position, e.task.id)
                            for e in source.tasks
                            for link in e.task.lessons
                            if link.material_id == material.id
                        ]
                    )
                    if material.status == "published" and expected:
                        result = await readers.lesson(session, material.kind, material.id)
                        assert [t.id for t in result.tasks] == [i for _, i in expected]
                assert len(list(await session.scalars(select(TaskRecord.id)))) == 697
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_solution_counter_and_role_failure(database, monkeypatch):
    async def scenario():
        engine = database_engine(database("import"))
        source = Bank.model_validate_json((BANK / "bank.json").read_bytes())
        entry = source.tasks[0]
        # Restrict the write to one task, preserve its publication metadata.
        source.tasks = [entry]
        try:
            async with AsyncSession(engine) as session:
                transaction = await session.begin()
                try:
                    original = entry.solution_revision
                    entry.task.title += " metadata edit"
                    await import_bank(session, source, BANK / "files")
                    record = await session.get(TaskRecord, entry.task.id)
                    assert record is not None
                    assert record.solution_revision == original
                    entry.task.answer_instruction += " revised instruction"
                    await import_bank(session, source, BANK / "files")
                    await session.refresh(record)
                    assert record.solution_revision == original + 1
                    await import_bank(session, source, BANK / "files")
                    await session.refresh(record)
                    assert record.solution_revision == original + 1
                finally:
                    await transaction.rollback()
        finally:
            await engine.dispose()

    asyncio.run(scenario())
    monkeypatch.setattr(
        settings,
        "database_url",
        database("runtime").replace("infraege-122-runtime", "wrong-password"),
    )
    with TestClient(create_app()) as client:
        assert client.get("/health/ready").status_code == 503
        assert client.get("/health/live").status_code == 200


@pytest.mark.parametrize("field", ["material_id", "section"])
def test_invalid_theory_reference_rolls_back_import(database, field):
    async def scenario():
        source = Bank.model_validate_json((BANK / "bank.json").read_bytes())
        material = source.materials[0]
        link = {"material_id": material.id, "section": material.sections[0], "label": "Theory"}
        link[field] = "missing-review-reference"
        broken = source.model_copy(deep=True)
        broken.tasks = [broken.tasks[-1]]
        broken.tasks[0].task.theory_links = [TheoryLink.model_validate(link)]
        engine = database_engine(database("import"))
        try:
            async with AsyncSession(engine) as session:
                before = await export_bank(session)
            with pytest.raises(ValueError, match="unknown theory"):
                async with AsyncSession(engine) as session, session.begin():
                    changed = source.model_copy(deep=True)
                    changed.tasks = [changed.tasks[0]]
                    changed.tasks[0].task.title = "Must roll back"
                    await import_bank(session, changed, BANK / "files")
                    await import_bank(session, broken, BANK / "files")
            async with AsyncSession(engine) as session:
                assert (await export_bank(session)).tasks == before.tasks
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_validate_cli_checks_canonical_bank_without_database_or_legacy_json(tmp_path):
    directory = tmp_path / "bank"
    shutil.copytree(BANK, directory)
    data = json.loads((directory / "bank.json").read_text())
    task = next(
        e
        for e in data["tasks"]
        if any(link["material_id"] == "python-first-program" for link in e["task"]["lessons"])
    )
    task["task"]["id"] = "new-course-task-not-in-legacy-json"
    command = [sys.executable, "-m", "app.modules.practice.cli", "validate", str(directory)]
    env = {
        key: value
        for key, value in os.environ.items()
        if key not in {"IMPORT_DATABASE_URL", "DATABASE_URL", "TASK_FILES_DIR"}
    }
    env["CONTENT_DIR"] = str(tmp_path / "does-not-exist")

    def validate():
        (directory / "bank.json").write_text(json.dumps(data))
        return subprocess.run(
            command, cwd=ROOT / "apps/api", env=env, capture_output=True, text=True
        )

    result = validate()
    assert result.returncode == 0, result.stderr
    assert json.loads(result.stdout)["tasks"] == 697
    task["task"]["theory_links"][0]["section"] = "missing-section"
    result = validate()
    assert result.returncode != 0 and "unknown theory section" in result.stderr
    task["task"]["theory_links"][0]["section"] = None
    task["task"]["theory_links"][0]["material_id"] = "missing-material"
    result = validate()
    assert result.returncode != 0 and "unknown theory material" in result.stderr
    task["task"]["theory_links"] = []
    data["files"][0]["size_bytes"] += 1
    result = validate()
    assert result.returncode != 0 and "corrupt or unsupported import file" in result.stderr


def test_api_startup_does_not_require_legacy_content_directory(tmp_path):
    env = {**os.environ, "CONTENT_DIR": str(tmp_path / "missing")}
    result = subprocess.run(
        [sys.executable, "-c", "from app.main import app; assert app"],
        cwd=ROOT / "apps/api",
        env=env,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr


def test_cli_publishes_readable_files_and_keeps_export_private(database, tmp_path):
    storage = tmp_path / "storage"
    env = {
        **os.environ,
        "IMPORT_DATABASE_URL": database("import"),
        "TASK_FILES_DIR": str(storage),
    }

    def run(command, directory):
        result = subprocess.run(
            [sys.executable, "-m", "app.modules.practice.cli", command, str(directory)],
            cwd=ROOT / "apps/api",
            env=env,
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stderr

    run("import", BANK)
    stored = next(storage.iterdir())
    assert stored.read_bytes() == (BANK / "files" / stored.name).read_bytes()
    assert stored.stat().st_mode & 0o777 == 0o644
    assert storage.stat().st_mode & 0o777 == 0o755
    stored.chmod(0o600)
    storage.chmod(0o700)
    run("import", BANK)
    assert stored.stat().st_mode & 0o777 == 0o644
    assert storage.stat().st_mode & 0o777 == 0o755
    destination = tmp_path / "private-export"
    run("export", destination)
    assert destination.stat().st_mode & 0o777 == 0o700
    assert (destination / "bank.json").stat().st_mode & 0o777 == 0o600
    assert (destination / "files" / stored.name).stat().st_mode & 0o777 == 0o600


def test_catalog_search_topics_sort_and_limits(database, monkeypatch):
    monkeypatch.setattr(settings, "database_url", database("runtime"))
    with TestClient(create_app()) as client:
        facets = client.get("/api/tasks/facets").json()
        counts = {t["id"]: t["count"] for t in facets["topics"]}
        assert counts["ege-16"] == 255 and counts["ege-5"] == 292
        assert counts["python-loops"] == 0
        assert client.get("/api/tasks?topics=python-loops").json()["total"] == 0
        combined = client.get("/api/tasks?topics=ege-16&topics=ege-5&topics=ege-16").json()
        assert combined["total"] == 547
        first_id = combined["tasks"][0]["id"]
        instruction = client.get(f"/api/tasks/{first_id}").json()["content"]["answer_instruction"]
        assert combined["tasks"][0]["answer_instruction"] == instruction
        # These words exist only in the retained Pascal/C++ variants, not rendered Python.
        assert client.get("/api/tasks?q=writeln").json()["total"] == 0
        assert client.get("/api/tasks?q=cout").json()["total"] == 0
        assert client.get("/api/tasks?q=print").json()["total"] > 0
        assert client.get(f"/api/tasks?q={first_id[:8]}").json()["tasks"][0]["id"] == first_id
        assert client.get("/api/tasks?q=16").json()["total"] >= 255
        assert client.get("/api/tasks?q=РЕКУРС").json()["total"] > 0
        assert client.get("/api/tasks?q=%25%25%25").json()["total"] == 0
        for limit in (10, 30, 50, 100):
            response = client.get(f"/api/tasks?limit={limit}")
            assert response.status_code == 200
            assert len(response.json()["tasks"]) == limit
            assert response.json()["limit"] == limit
        assert client.get("/api/tasks?limit=11").status_code == 422
        assert client.get("/api/tasks?topics=unknown").status_code == 422
        assert client.get("/api/tasks?q=" + "a" * 201).status_code == 422
        assert client.get("/api/tasks?sort=random").status_code == 422
        assert client.get("/api/tasks?page=10000").json()["tasks"] == []
        for direction in ("difficulty_asc", "difficulty_desc", "default"):
            query = f"topics=ege-16&q=рекурс&sort={direction}&limit=10"
            first = client.get(f"/api/tasks?{query}").json()["tasks"]
            second = client.get(f"/api/tasks?{query}&page=2").json()["tasks"]
            assert not {t["id"] for t in first} & {t["id"] for t in second}
            items = first + second

            def key(t, direction=direction):
                return ((-1 if direction == "difficulty_desc" else 1) * t["difficulty"], t["id"])

            assert items == sorted(
                items, key=(lambda t: t["id"]) if direction == "default" else key
            )
            following = client.get(
                f"/api/tasks/{first[0]['id']}/next?topics=ege-16&q=рекурс&sort={direction}"
            ).json()
            assert following["task_id"] == first[1]["id"]
        serialized = json.dumps(combined, ensure_ascii=False)
        assert "checker" not in serialized and "answer_variants" not in serialized
        assert "kompege.ru" not in serialized  # private copy provenance in this bank
        assert client.get("/api/tasks?q=kompege.ru").json()["total"] == 0


def test_catalog_searches_visible_structured_fields(database):
    async def scenario():
        engine = database_engine(database("import"))
        try:
            async with AsyncSession(engine) as session:
                transaction = await session.begin()
                try:
                    row = await session.scalar(select(TaskRecord).where(catalog.visible()).limit(1))
                    assert row is not None
                    row.content = dict(
                        row.content,
                        statement=[
                            {
                                "type": "list",
                                "data": {"style": "ordered", "items": ["visible-list-token"]},
                            },
                            {
                                "type": "table",
                                "data": {
                                    "headers": ["visible-header-token"],
                                    "rows": [["visible-cell-token"]],
                                },
                            },
                            {
                                "type": "worked_example",
                                "data": {
                                    "prompt": "visible-prompt-token",
                                    "steps": ["visible-step-token"],
                                },
                            },
                            {
                                "type": "code_example",
                                "data": {"language": "text", "code": "visible-standalone-token"},
                            },
                            {
                                "type": "code_variants",
                                "data": {
                                    "variants": [
                                        {
                                            "language": "python",
                                            "label": "Python",
                                            "code": "visible-python-token",
                                        },
                                        {
                                            "language": "text",
                                            "label": "Pascal",
                                            "code": "hidden-pascal-token",
                                        },
                                    ]
                                },
                            },
                        ],
                    )
                    await session.flush()
                    for token in (
                        "list",
                        "header",
                        "cell",
                        "prompt",
                        "step",
                        "standalone",
                        "python",
                    ):
                        page = await catalog.page(
                            session, catalog.CatalogQuery(q=f"visible-{token}-token")
                        )
                        assert [task.id for task in page.tasks] == [row.id]
                    assert (
                        await catalog.page(session, catalog.CatalogQuery(q="hidden-pascal-token"))
                    ).total == 0
                finally:
                    await transaction.rollback()
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_topic_summary_matches_published_lessons_and_excludes_hidden_tasks(database, monkeypatch):
    from app.modules.practice.models import LessonTask

    monkeypatch.setattr(settings, "database_url", database("runtime"))
    with TestClient(create_app()) as client:
        response = client.get("/api/topics/practice-summary")
        assert response.status_code == 200
        assert response.headers["cache-control"] == "no-store"
        topics = response.json()["topics"]
        assert {topic["id"] for topic in topics} == {"rekursiya", "preobrazovanie-zapisey-chisel"}
        for topic in topics:
            assert set(topic) == {"id", "tasks"}
            lesson = client.get(f"/api/learning-materials/topic/{topic['id']}/practice").json()
            assert topic["tasks"] == [
                {"id": task["id"], "solution_revision": task["solution_revision"]}
                for task in lesson["tasks"]
            ]
            assert topic["tasks"]
            assert all(set(task) == {"id", "solution_revision"} for task in topic["tasks"])

    async def scenario():
        engine = database_engine(database("import"))
        try:
            async with AsyncSession(engine) as session:
                memberships = list(
                    await session.scalars(
                        select(LessonTask)
                        .where(LessonTask.kind == "topic", LessonTask.material_id == "rekursiya")
                        .order_by(LessonTask.position)
                    )
                )
                hidden_id = memberships[0].task_id
                archived_id = memberships[1].task_id
                memberships[0].published = False
                archived = await session.get(TaskRecord, archived_id)
                assert archived is not None
                archived.archived = True
                await session.flush()
                summary = await readers.topics(session)
                ids = {task.id for topic in summary.topics for task in topic.tasks}
                assert hidden_id not in ids
                assert archived_id not in ids
                assert all(
                    topic.id in {"rekursiya", "preobrazovanie-zapisey-chisel"}
                    for topic in summary.topics
                )
                await session.rollback()
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_account_auth_guest_and_context_progress(database, monkeypatch):
    """Real role/schema HTTP proof: a guest never saves and accounts never share results."""
    import re

    from pydantic import SecretStr

    from app.modules.account import api as account_api

    sent: list[str] = []

    async def fake_mail(recipient: str, subject: str, body: str) -> None:
        assert recipient and subject
        sent.append(body)

    monkeypatch.setattr(account_api, "send_account_mail", fake_mail)
    monkeypatch.setattr(settings, "database_url", database("runtime"))
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "public_origin", "http://testserver")
    monkeypatch.setattr(settings, "auth_csrf_secret", SecretStr("a" * 48))
    monkeypatch.setattr(settings, "smtp_host", "fake-relay")
    monkeypatch.setattr(settings, "mail_from", "no-reply@example.com")
    source = Bank.model_validate_json((BANK / "bank.json").read_bytes())
    materials = {item.id: item for item in source.materials}
    entry = next(
        item
        for item in source.tasks
        if any(materials[link.material_id].status == "published" for link in item.task.lessons)
    )
    link = next(
        link for link in entry.task.lessons if materials[link.material_id].status == "published"
    )
    context_kind = (
        "topic_lesson" if materials[link.material_id].kind == "topic" else "course_lesson"
    )
    check_url = f"/api/tasks/{entry.task.id}/check-and-save"
    body = {
        "answer": entry.task.checker.answer_variants[0],
        "solution_revision": entry.solution_revision,
        "context_kind": context_kind,
        "context_id": link.material_id,
    }
    headers = {"Origin": "http://testserver"}

    with TestClient(create_app()) as client:
        assert client.post(
            f"/api/tasks/{entry.task.id}/check",
            json={"answer": body["answer"], "solution_revision": body["solution_revision"]},
        ).json()["correct"]
        assert client.post(check_url, json=body, headers=headers).status_code == 403
        assert client.get("/api/progress").status_code == 401

        def create_member(email: str) -> dict:
            registered = client.post(
                "/api/auth/register",
                json={
                    "email": email,
                    "password": "correct horse battery",
                    "privacy_consent": True,
                    "privacy_consent_version": "2026-09-25",
                },
                headers=headers,
            )
            assert registered.status_code == 202
            assert "/verify-email?token=" in sent[-1]
            token = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1])
            assert token is not None
            assert (
                client.post(
                    "/api/auth/register",
                    json={
                        "email": email,
                        "password": "another secure password",
                        "privacy_consent": True,
                        "privacy_consent_version": "2026-09-25",
                    },
                    headers=headers,
                ).status_code
                == 202
            )
            assert (
                client.post(
                    "/api/auth/verify-email", json={"token": token.group(1)}, headers=headers
                ).status_code
                == 204
            )
            assert (
                client.post(
                    "/api/auth/verify-email", json={"token": token.group(1)}, headers=headers
                ).status_code
                == 400
            )
            logged_in = client.post(
                "/api/auth/login",
                json={"email": email, "password": "correct horse battery"},
                headers=headers,
            )
            assert logged_in.status_code == 200
            return logged_in.json()

        first = create_member("first@example.com")
        csrf = first["csrf_token"]
        assert isinstance(csrf, str)
        assert client.get("/api/auth/session").json()["account"]["email"] == "first@example.com"
        assert client.post(check_url, json=body, headers=headers).status_code == 403
        authorized = {**headers, "X-CSRF-Token": csrf}
        wrong = client.post(
            check_url, json={**body, "answer": "impossible-answer"}, headers=authorized
        )
        assert wrong.status_code == 200 and wrong.json()["correct"] is False
        assert wrong.json()["saved"] is False
        assert client.get("/api/progress").json()["results"] == []
        saved = client.post(check_url, json=body, headers=authorized)
        assert saved.status_code == 200 and saved.json()["correct"] is True
        assert saved.json()["saved"] is True
        assert client.post(check_url, json=body, headers=authorized).status_code == 200
        results = client.get("/api/progress").json()["results"]
        assert len(results) == 1 and results[0]["context_id"] == link.material_id
        assert (
            client.post(
                check_url,
                json={**body, "solution_revision": entry.solution_revision + 1},
                headers=authorized,
            ).status_code
            == 409
        )
        assert (
            client.post(
                check_url, json={**body, "context_id": "another-lesson"}, headers=authorized
            ).status_code
            == 404
        )

        second = create_member("second@example.com")
        assert second["account"]["id"] != first["account"]["id"]
        assert client.get("/api/progress").json()["results"] == []
        assert (
            client.request(
                "DELETE",
                "/api/auth/account",
                json={"confirmation": "DELETE", "password": "correct horse battery"},
                headers={**headers, "X-CSRF-Token": second["csrf_token"]},
            ).status_code
            == 204
        )
        assert client.get("/api/auth/session").json()["account"] is None

        first_again = client.post(
            "/api/auth/login",
            json={"email": "first@example.com", "password": "correct horse battery"},
            headers=headers,
        ).json()
        assert len(client.get("/api/progress").json()["results"]) == 1
        assert (
            client.delete(
                f"/api/progress/{context_kind}/{link.material_id}",
                headers={**headers, "X-CSRF-Token": first_again["csrf_token"]},
            ).status_code
            == 204
        )
        assert client.get("/api/progress").json()["results"] == []
        assert (
            client.post(
                "/api/auth/logout", headers={**headers, "X-CSRF-Token": first_again["csrf_token"]}
            ).status_code
            == 204
        )
        assert client.get("/api/auth/session").json()["account"] is None
        assert (
            client.post(
                "/api/auth/password-reset/request",
                json={"email": "first@example.com"},
                headers=headers,
            ).status_code
            == 202
        )
        reset = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1])
        assert "/password-reset?token=" in sent[-1]
        assert reset is not None
        assert (
            client.post(
                "/api/auth/password-reset/confirm",
                json={"token": reset.group(1), "password": "a new secure password"},
                headers=headers,
            ).status_code
            == 204
        )
        assert (
            client.post(
                "/api/auth/login",
                json={"email": "first@example.com", "password": "correct horse battery"},
                headers=headers,
            ).status_code
            == 401
        )
        final_login = client.post(
            "/api/auth/login",
            json={"email": "first@example.com", "password": "a new secure password"},
            headers=headers,
        )
        assert final_login.status_code == 200
        final_csrf = {**headers, "X-CSRF-Token": final_login.json()["csrf_token"]}
        assert client.post(check_url, json=body, headers=final_csrf).json()["saved"]
        assert len(client.get("/api/progress").json()["results"]) == 1
        old_cookie = client.cookies.get("infraege_session")
        assert old_cookie
        for password_proof in ({}, {"password": "not the password"}):
            assert (
                client.request(
                    "DELETE",
                    "/api/auth/account",
                    json={"confirmation": "DELETE", **password_proof},
                    headers=final_csrf,
                ).status_code
                == 403
            )
            assert len(client.get("/api/progress").json()["results"]) == 1
            assert client.get("/api/auth/session").json()["account"]["email"] == "first@example.com"
        assert (
            client.request(
                "DELETE",
                "/api/auth/account",
                json={"confirmation": "CANCEL"},
                headers=final_csrf,
            ).status_code
            == 400
        )
        assert (
            client.request(
                "DELETE",
                "/api/auth/account",
                json={"confirmation": "DELETE", "password": "a new secure password"},
                headers=final_csrf,
            ).status_code
            == 204
        )
        client.cookies.set("infraege_session", old_cookie)
        assert client.get("/api/auth/session").json()["account"] is None
        assert client.get("/api/progress").status_code == 401
        assert (
            client.post(
                "/api/auth/login",
                json={"email": "first@example.com", "password": "a new secure password"},
                headers=headers,
            ).status_code
            == 401
        )


def test_registration_requires_and_records_privacy_consent(database, monkeypatch):
    from pydantic import SecretStr

    from app.modules.account import api as account_api
    from app.modules.account.models import AccountPassword, AccountUser

    sent: list[str] = []

    async def fake_mail(recipient: str, subject: str, body: str) -> None:
        assert recipient and subject
        sent.append(body)

    monkeypatch.setattr(account_api, "send_account_mail", fake_mail)
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "public_origin", "http://testserver")
    monkeypatch.setattr(settings, "auth_csrf_secret", SecretStr("p" * 48))
    monkeypatch.setattr(settings, "smtp_host", "fake-relay")
    monkeypatch.setattr(settings, "mail_from", "no-reply@example.com")
    headers = {"Origin": "http://testserver"}
    required = {"email": "consent@example.com", "password": "correct horse battery"}

    with TestClient(create_app()) as client:
        assert client.post("/api/auth/register", json=required, headers=headers).status_code == 422
        assert (
            client.post(
                "/api/auth/register",
                json={
                    **required,
                    "privacy_consent": False,
                    "privacy_consent_version": "2026-09-25",
                },
                headers=headers,
            ).status_code
            == 422
        )
        assert (
            client.post(
                "/api/auth/register",
                json={
                    **required,
                    "privacy_consent": True,
                    "privacy_consent_version": "unknown-version",
                },
                headers=headers,
            ).status_code
            == 422
        )
        assert (
            client.post(
                "/api/auth/register",
                json={
                    **required,
                    "privacy_consent": True,
                    "privacy_consent_version": "2026-09-25",
                },
                headers=headers,
            ).status_code
            == 202
        )
    assert len(sent) == 1

    async def scenario() -> None:
        engine = database_engine(database("app"))
        try:
            async with AsyncSession(engine) as session:
                user = await session.scalar(
                    select(AccountUser)
                    .join(AccountPassword, AccountPassword.user_id == AccountUser.id)
                    .where(AccountPassword.email_normalized == "consent@example.com")
                )
                assert user is not None
                assert user.privacy_consent_version == "2026-09-25"
                assert user.privacy_consented_at is not None
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_account_artifact_purge_preserves_live_and_rate_limit_records(database):
    from app.modules.account.models import (
        AccountProviderChallenge,
        AccountSession,
        AccountToken,
        AccountUser,
    )
    from app.modules.account.purge import purge_expired_artifacts

    timestamp = datetime(2026, 9, 25, 12, tzinfo=UTC)

    async def scenario() -> None:
        engine = database_engine(database("app"))
        try:
            async with AsyncSession(engine) as session, session.begin():
                user = AccountUser()
                session.add(user)
                await session.flush()
                session.add_all(
                    [
                        AccountSession(
                            user_id=user.id,
                            token_hash="active-session",
                            authenticated_at=timestamp,
                            expires_at=timestamp + timedelta(days=1),
                        ),
                        AccountSession(
                            user_id=user.id,
                            token_hash="expired-session",
                            authenticated_at=timestamp - timedelta(days=31),
                            expires_at=timestamp - timedelta(seconds=1),
                        ),
                        AccountSession(
                            user_id=user.id,
                            token_hash="recently-revoked-session",
                            authenticated_at=timestamp - timedelta(days=1),
                            expires_at=timestamp + timedelta(days=29),
                            revoked_at=timestamp - timedelta(minutes=30),
                        ),
                        AccountSession(
                            user_id=user.id,
                            token_hash="old-revoked-session",
                            authenticated_at=timestamp - timedelta(days=2),
                            expires_at=timestamp + timedelta(days=28),
                            revoked_at=timestamp - timedelta(days=1, seconds=1),
                        ),
                        AccountToken(
                            user_id=user.id,
                            purpose="email_verify",
                            token_hash="rate-limit-token",
                            created_at=timestamp - timedelta(minutes=30),
                            expires_at=timestamp + timedelta(minutes=30),
                        ),
                        AccountToken(
                            user_id=user.id,
                            purpose="password_reset",
                            token_hash="recent-expired-token",
                            created_at=timestamp - timedelta(minutes=40),
                            expires_at=timestamp - timedelta(minutes=20),
                        ),
                        AccountToken(
                            user_id=user.id,
                            purpose="email_verify",
                            token_hash="purgeable-token",
                            created_at=timestamp - timedelta(hours=2),
                            expires_at=timestamp - timedelta(hours=1, minutes=1),
                        ),
                        AccountProviderChallenge(
                            state_hash="active-challenge",
                            browser_hash="active-browser",
                            provider="telegram",
                            code_verifier="active-verifier",
                            nonce="active-nonce",
                            flow="login",
                            return_path="/",
                            expires_at=timestamp + timedelta(minutes=10),
                        ),
                        AccountProviderChallenge(
                            state_hash="purgeable-challenge",
                            browser_hash="expired-browser",
                            provider="telegram",
                            code_verifier="expired-verifier",
                            nonce="expired-nonce",
                            flow="login",
                            return_path="/",
                            expires_at=timestamp - timedelta(hours=1, minutes=1),
                        ),
                    ]
                )
            async with AsyncSession(engine) as session, session.begin():
                result = await purge_expired_artifacts(session, timestamp=timestamp)
                assert result.sessions == 2
                assert result.tokens == 1
                assert result.provider_challenges == 1
            async with AsyncSession(engine) as session:
                session_hashes = [
                    "active-session",
                    "expired-session",
                    "recently-revoked-session",
                    "old-revoked-session",
                ]
                sessions = set(
                    await session.scalars(
                        select(AccountSession.token_hash).where(
                            AccountSession.token_hash.in_(session_hashes)
                        )
                    )
                )
                assert sessions == {"active-session", "recently-revoked-session"}
                token_hashes = [
                    "rate-limit-token",
                    "recent-expired-token",
                    "purgeable-token",
                ]
                tokens = set(
                    await session.scalars(
                        select(AccountToken.token_hash).where(
                            AccountToken.token_hash.in_(token_hashes)
                        )
                    )
                )
                assert tokens == {"rate-limit-token", "recent-expired-token"}
                challenges = set(
                    await session.scalars(
                        select(AccountProviderChallenge.state_hash).where(
                            AccountProviderChallenge.state_hash.in_(
                                ["active-challenge", "purgeable-challenge"]
                            )
                        )
                    )
                )
                assert challenges == {"active-challenge"}
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_account_artifact_purge_removes_only_abandoned_unverified_email_accounts(database):
    from app.modules.account.models import (
        AccountIdentity,
        AccountPassword,
        AccountToken,
        AccountUser,
    )
    from app.modules.account.purge import purge_expired_artifacts

    timestamp = datetime(2026, 9, 25, 12, tzinfo=UTC)
    old = timestamp - timedelta(days=30, seconds=1)

    async def create_email_account(
        session: AsyncSession, email: str, *, created_at: datetime, verified: bool = False
    ) -> AccountUser:
        user = AccountUser(created_at=created_at)
        session.add(user)
        await session.flush()
        session.add(
            AccountPassword(
                user_id=user.id,
                email_normalized=email,
                password_hash="not-used-by-this-cleanup-test",
                email_verified_at=timestamp if verified else None,
            )
        )
        return user

    async def scenario() -> None:
        engine = database_engine(database("app"))
        try:
            async with AsyncSession(engine) as session, session.begin():
                abandoned = await create_email_account(
                    session, "abandoned@example.com", created_at=old
                )
                fresh = await create_email_account(
                    session,
                    "fresh-unverified@example.com",
                    created_at=timestamp - timedelta(days=29),
                )
                verified = await create_email_account(
                    session, "verified@example.com", created_at=old, verified=True
                )
                provider_linked = await create_email_account(
                    session, "provider-linked@example.com", created_at=old
                )
                session.add(
                    AccountIdentity(
                        user_id=provider_linked.id,
                        provider="telegram",
                        subject="provider-linked-cleanup-test",
                    )
                )
                active_link = await create_email_account(
                    session, "active-link@example.com", created_at=old
                )
                session.add(
                    AccountToken(
                        user_id=active_link.id,
                        purpose="email_verify",
                        token_hash="active-verification-link-for-cleanup-test",
                        created_at=timestamp,
                        expires_at=timestamp + timedelta(minutes=30),
                    )
                )
                await session.flush()
                expected_ids = {
                    "abandoned@example.com": abandoned.id,
                    "fresh-unverified@example.com": fresh.id,
                    "verified@example.com": verified.id,
                    "provider-linked@example.com": provider_linked.id,
                    "active-link@example.com": active_link.id,
                }
            async with AsyncSession(engine) as session, session.begin():
                result = await purge_expired_artifacts(session, timestamp=timestamp)
                assert result.abandoned_unverified_users == 1
            async with AsyncSession(engine) as session:
                remaining = {
                    row.email_normalized: row.user_id
                    for row in await session.execute(
                        select(AccountPassword.email_normalized, AccountPassword.user_id).where(
                            AccountPassword.email_normalized.in_(expected_ids)
                        )
                    )
                }
                assert "abandoned@example.com" not in remaining
                assert remaining == {
                    key: value
                    for key, value in expected_ids.items()
                    if key != "abandoned@example.com"
                }
                assert (
                    await session.scalar(
                        select(AccountToken.id).where(
                            AccountToken.token_hash == "active-verification-link-for-cleanup-test"
                        )
                    )
                    is not None
                )
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_account_mail_resend_limits_preserve_valid_links_and_retract_failures(
    database, monkeypatch
):
    """Repeated requests stay private, rate limited, and recover from SMTP failure."""
    import re

    from pydantic import SecretStr

    from app.modules.account import api as account_api
    from app.modules.account import service as account_service

    sent: list[str] = []
    mail_available = True

    async def fake_mail(recipient: str, subject: str, body: str) -> None:
        assert recipient in {"resend@example.com", "new-during-outage@example.com"}
        assert subject
        if not mail_available:
            raise account_api.MailUnavailable("test relay unavailable")
        sent.append(body)

    timestamp = datetime(2026, 9, 25, tzinfo=UTC)
    monkeypatch.setattr(account_service, "now", lambda: timestamp)
    monkeypatch.setattr(account_api, "send_account_mail", fake_mail)
    monkeypatch.setattr(settings, "database_url", database("runtime"))
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "public_origin", "http://testserver")
    monkeypatch.setattr(settings, "auth_csrf_secret", SecretStr("c" * 48))
    monkeypatch.setattr(settings, "smtp_host", "fake-relay")
    monkeypatch.setattr(settings, "mail_from", "no-reply@example.com")
    headers = {"Origin": "http://testserver"}

    with TestClient(create_app()) as client:
        assert (
            client.post(
                "/api/auth/register",
                json={
                    "email": "resend@example.com",
                    "password": "correct horse battery",
                    "privacy_consent": True,
                    "privacy_consent_version": "2026-09-25",
                },
                headers=headers,
            ).status_code
            == 202
        )
        first = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1])
        assert first is not None

        mail_available = False
        for address in ("resend@example.com", "new-during-outage@example.com"):
            assert (
                client.post(
                    "/api/auth/register",
                    json={
                        "email": address,
                        "password": "correct horse battery",
                        "privacy_consent": True,
                        "privacy_consent_version": "2026-09-25",
                    },
                    headers=headers,
                ).status_code
                == 202
            )
        mail_available = True

        assert (
            client.post(
                "/api/auth/verification/request",
                json={"email": "resend@example.com"},
                headers=headers,
            ).status_code
            == 202
        )
        assert len(sent) == 1

        for expected_count in range(2, 6):
            timestamp += timedelta(seconds=61)
            assert (
                client.post(
                    "/api/auth/verification/request",
                    json={"email": "resend@example.com"},
                    headers=headers,
                ).status_code
                == 202
            )
            assert len(sent) == expected_count
        timestamp += timedelta(seconds=61)
        assert (
            client.post(
                "/api/auth/verification/request",
                json={"email": "resend@example.com"},
                headers=headers,
            ).status_code
            == 202
        )
        assert len(sent) == 5

        assert (
            client.post(
                "/api/auth/verify-email", json={"token": first.group(1)}, headers=headers
            ).status_code
            == 204
        )
        assert (
            client.post(
                "/api/auth/verification/request",
                json={"email": "resend@example.com"},
                headers=headers,
            ).status_code
            == 202
        )
        assert len(sent) == 5

        mail_available = False
        assert (
            client.post(
                "/api/auth/password-reset/request",
                json={"email": "resend@example.com", "return_to": "/account"},
                headers=headers,
            ).status_code
            == 202
        )
        assert (
            client.post(
                "/api/auth/password-reset/request",
                json={"email": "unknown@example.com"},
                headers=headers,
            ).status_code
            == 202
        )
        mail_available = True
        assert (
            client.post(
                "/api/auth/password-reset/request",
                json={"email": "resend@example.com", "return_to": "/account"},
                headers=headers,
            ).status_code
            == 202
        )
        assert "returnTo=%2Faccount" in sent[-1]
        monkeypatch.setattr(settings, "smtp_host", "")
        for address in ("resend@example.com", "unknown@example.com"):
            assert (
                client.post(
                    "/api/auth/password-reset/request",
                    json={"email": address},
                    headers=headers,
                ).status_code
                == 503
            )
        monkeypatch.setattr(settings, "smtp_host", "fake-relay")
        reset = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1])
        assert reset is not None
        timestamp += timedelta(minutes=21)
        assert (
            client.post(
                "/api/auth/password-reset/confirm",
                json={"token": reset.group(1), "password": "a new secure password"},
                headers=headers,
            ).status_code
            == 400
        )


def test_provider_account_can_add_verified_email_without_merging(database, monkeypatch):
    import re
    from urllib.parse import parse_qs, urlsplit

    from pydantic import SecretStr

    from app.modules.account import api as account_api
    from app.modules.account import service as account_service
    from app.modules.account.providers import ProviderIdentity

    timestamp = datetime(2026, 9, 25, tzinfo=UTC)
    monkeypatch.setattr(account_service, "now", lambda: timestamp)
    sent: list[str] = []

    async def fake_mail(recipient: str, subject: str, body: str) -> None:
        assert recipient in {
            "pending@example.com",
            "corrected@example.com",
            "taken@example.com",
        }
        assert subject
        sent.append(body)

    async def fake_callback(provider, config, **kwargs):
        assert kwargs["code"] == "valid-code"
        return ProviderIdentity(provider, "email-link-owner")

    monkeypatch.setattr(account_api, "send_account_mail", fake_mail)
    monkeypatch.setattr(account_api, "authenticate_callback", fake_callback)
    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "public_origin", "https://infraege.example")
    monkeypatch.setattr(settings, "auth_csrf_secret", SecretStr("e" * 48))
    monkeypatch.setattr(settings, "smtp_host", "fake-relay")
    monkeypatch.setattr(settings, "mail_from", "no-reply@example.com")
    monkeypatch.setattr(settings, "telegram_client_id", "test-bot")
    monkeypatch.setattr(settings, "telegram_client_secret", SecretStr("test-secret"))
    monkeypatch.setattr(settings, "telegram_enabled", True)
    origin = {"Origin": "https://infraege.example"}
    payload = {"email": "pending@example.com", "password": "correct horse battery"}

    with TestClient(create_app()) as client:
        assert (
            client.post(
                "/api/auth/register",
                json={
                    "email": "taken@example.com",
                    "password": "a secure different password",
                    "privacy_consent": True,
                    "privacy_consent_version": "2026-09-25",
                },
                headers=origin,
            ).status_code
            == 202
        )
        started = client.get("/api/auth/providers/telegram/start", follow_redirects=False)
        state = parse_qs(urlsplit(started.headers["location"]).query)["state"][0]
        assert (
            client.get(
                "/api/auth/providers/telegram/callback",
                params={"code": "valid-code", "state": state},
                follow_redirects=False,
            ).status_code
            == 303
        )
        session = client.get("/api/auth/session").json()
        user_id = session["account"]["id"]
        headers = {**origin, "X-CSRF-Token": session["csrf_token"]}
        assert (
            client.post("/api/auth/account/email-method", json=payload, headers=origin).status_code
            == 403
        )
        assert (
            client.post(
                "/api/auth/account/email-method",
                json={"email": "taken@example.com", "password": "correct horse battery"},
                headers=headers,
            ).status_code
            == 202
        )
        assert (
            client.post("/api/auth/account/email-method", json=payload, headers=headers).status_code
            == 202
        )
        original = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1])
        assert original is not None
        pending = client.get("/api/auth/session").json()["account"]
        assert pending["email"] == "pending@example.com"
        assert [method["provider"] for method in pending["methods"]] == ["telegram"]
        assert client.post("/api/auth/login", json=payload, headers=origin).status_code == 401

        timestamp += timedelta(seconds=61)
        corrected = {"email": "corrected@example.com", "password": "another secure password"}
        assert (
            client.post(
                "/api/auth/account/email-method", json=corrected, headers=headers
            ).status_code
            == 202
        )
        replacement = re.search(r"token=([A-Za-z0-9_-]+)", sent[-1])
        assert replacement is not None
        assert (
            client.post(
                "/api/auth/verify-email",
                json={"token": original.group(1)},
                headers=origin,
            ).status_code
            == 400
        )
        assert (
            client.post(
                "/api/auth/verify-email",
                json={"token": replacement.group(1)},
                headers=origin,
            ).status_code
            == 204
        )
        enabled = client.get("/api/auth/session").json()["account"]
        assert enabled["id"] == user_id
        assert enabled["email"] == "corrected@example.com"
        assert {method["provider"] for method in enabled["methods"]} == {"email", "telegram"}
        email_login = client.post("/api/auth/login", json=corrected, headers=origin)
        assert email_login.json()["account"]["id"] == user_id
        current_headers = {**origin, "X-CSRF-Token": email_login.json()["csrf_token"]}
        assert (
            client.post(
                "/api/auth/account/email-method", json=payload, headers=current_headers
            ).status_code
            == 202
        )


def test_provider_state_is_single_use_and_last_method_is_guarded(database, monkeypatch):
    from urllib.parse import parse_qs, urlsplit

    from pydantic import SecretStr

    from app.modules.account import api as account_api
    from app.modules.account.providers import ProviderIdentity

    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "public_origin", "https://infraege.example")
    monkeypatch.setattr(settings, "auth_csrf_secret", SecretStr("b" * 48))
    monkeypatch.setattr(settings, "telegram_client_id", "test-telegram-bot")
    monkeypatch.setattr(settings, "telegram_client_secret", SecretStr("test-secret"))
    monkeypatch.setattr(settings, "telegram_enabled", True)
    monkeypatch.setattr(settings, "yandex_client_id", "test-yandex-app")
    monkeypatch.setattr(settings, "yandex_client_secret", SecretStr("test-secret"))
    monkeypatch.setattr(settings, "yandex_enabled", True)

    async def fake_callback(provider, config, **kwargs):
        assert config and kwargs["code"] == "valid-code"
        return ProviderIdentity(provider, f"{provider}-subject")

    monkeypatch.setattr(account_api, "authenticate_callback", fake_callback)
    origin = {"Origin": "https://infraege.example"}
    with TestClient(create_app()) as client:
        started = client.get(
            "/api/auth/providers/telegram/start?return_to=%2F%2Fevil.example",
            follow_redirects=False,
        )
        assert started.status_code == 303
        state = parse_qs(urlsplit(started.headers["location"]).query)["state"][0]
        with TestClient(create_app()) as other_browser:
            assert (
                other_browser.get(
                    "/api/auth/providers/telegram/callback",
                    params={"code": "valid-code", "state": state},
                    follow_redirects=False,
                ).status_code
                == 400
            )
        assert (
            client.get(
                "/api/auth/providers/telegram/callback",
                params={"code": "valid-code", "state": "x" * 43},
                follow_redirects=False,
            ).status_code
            == 400
        )
        callback = client.get(
            "/api/auth/providers/telegram/callback",
            params={"code": "valid-code", "state": state},
            follow_redirects=False,
        )
        assert callback.status_code == 303 and callback.headers["location"] == "/"
        assert (
            client.get(
                "/api/auth/providers/telegram/callback",
                params={"code": "valid-code", "state": state},
                follow_redirects=False,
            ).status_code
            == 400
        )
        session = client.get("/api/auth/session").json()
        assert session["account"]["methods"] == [{"provider": "telegram", "subject_hint": None}]
        headers = {**origin, "X-CSRF-Token": session["csrf_token"]}
        assert client.delete("/api/auth/providers/telegram", headers=headers).status_code == 409
        linked = client.post("/api/auth/providers/yandex/link", headers=headers)
        assert linked.status_code == 200
        link_state = parse_qs(urlsplit(linked.json()["url"]).query)["state"][0]
        assert (
            client.get(
                "/api/auth/providers/yandex/callback",
                params={"code": "valid-code", "state": link_state},
                follow_redirects=False,
            ).status_code
            == 303
        )
        refreshed = client.get("/api/auth/session").json()
        assert {method["provider"] for method in refreshed["account"]["methods"]} == {
            "telegram",
            "yandex",
        }
        assert (
            client.delete(
                "/api/auth/providers/telegram",
                headers={**origin, "X-CSRF-Token": refreshed["csrf_token"]},
            ).status_code
            == 204
        )
        assert (
            client.delete(
                "/api/auth/providers/yandex",
                headers={**origin, "X-CSRF-Token": refreshed["csrf_token"]},
            ).status_code
            == 409
        )
        assert (
            client.request(
                "DELETE",
                "/api/auth/account",
                json={"confirmation": "DELETE"},
                headers={**origin, "X-CSRF-Token": refreshed["csrf_token"]},
            ).status_code
            == 204
        )


def test_provider_release_flags_default_off_and_close_every_entry_boundary(database, monkeypatch):
    from app.modules.account import api as account_api

    monkeypatch.setattr(settings, "account_database_url", database("app"))
    monkeypatch.setattr(settings, "vk_enabled", False)
    monkeypatch.setattr(settings, "yandex_enabled", False)
    monkeypatch.setattr(settings, "telegram_enabled", False)

    async def callback_must_not_run(*args, **kwargs):
        raise AssertionError("disabled provider callback must not authenticate")

    monkeypatch.setattr(account_api, "authenticate_callback", callback_must_not_run)

    with TestClient(create_app()) as client:
        assert client.get("/api/auth/providers").json() == {"enabled": []}
        for provider in ("vk", "yandex", "telegram"):
            assert (
                client.get(
                    f"/api/auth/providers/{provider}/start", follow_redirects=False
                ).status_code
                == 404
            )
            assert client.post(f"/api/auth/providers/{provider}/link").status_code == 404
            assert client.post(f"/api/auth/providers/{provider}/reauth").status_code == 404
            assert (
                client.get(
                    f"/api/auth/providers/{provider}/callback",
                    params={"state": "x" * 43, "code": "code"},
                    follow_redirects=False,
                ).status_code
                == 404
            )

        monkeypatch.setattr(settings, "vk_enabled", True)
        monkeypatch.setattr(settings, "telegram_enabled", True)
        assert client.get("/api/auth/providers").json() == {"enabled": ["vk", "telegram"]}
