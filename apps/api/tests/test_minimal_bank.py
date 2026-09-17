"""Real PostgreSQL acceptance for the single-operator bank. Runners stay on host."""

import asyncio
import json
import os
import shutil
import subprocess
import sys
import time
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
                ["docker", "exec", name, "pg_isready", "-U", "infraege"], capture_output=True
            )
            if ready.returncode == 0:
                break
            time.sleep(1)
        port = (
            subprocess.check_output(["docker", "port", name, "5432"], text=True)
            .strip()
            .split(":")[-1]
        )

        def url(role):
            return f"postgresql://infraege_{role}:infraege-122-{role}@127.0.0.1:{port}/infraege"

        subprocess.run(
            ["uv", "run", "alembic", "upgrade", "head"],
            cwd=ROOT / "apps/api",
            env={**os.environ, "MIGRATION_DATABASE_URL": url("migration")},
            check=True,
            capture_output=True,
        )

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
