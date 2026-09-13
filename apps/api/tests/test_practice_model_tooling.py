"""Host-run contracts on an explicitly isolated PostgreSQL 18 instance."""

import asyncio
import json
import os
import uuid
from pathlib import Path

import pytest
from sqlalchemy import select, text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import SCHEMA_LOCK, database_engine
from app.modules.practice import service
from app.modules.practice.commands import export_task
from app.modules.practice.files import Package, checksum
from app.modules.practice.models import ImportOutcome, TaskHistory, TaskRecord
from app.modules.practice.schemas import Registry
from app.modules.practice.service import (
    Conflict,
    check_answer,
    current_snapshot,
    process_package,
    read_task,
    register_materials,
    require_schema,
    verify_registry,
)

REGISTRY = Registry.model_validate_json(
    (Path(__file__).parents[1] / "practice-registry.json").read_bytes()
)


@pytest.fixture
def engines():
    url = os.environ.get("PRACTICE_TEST_URL", "")
    if not url:
        pytest.skip("use scripts/tests/practice-model-tooling.test.sh for isolated PostgreSQL")
    if not url.startswith("postgresql://infraege_import:infraege-114-import@127.0.0.1:"):
        pytest.fail("test database identity rejected")
    return (
        database_engine(url, role="infraege_import"),
        database_engine(
            url.replace(
                "infraege_import:infraege-114-import", "infraege_runtime:infraege-114-runtime"
            )
        ),
        database_engine(
            url.replace(
                "infraege_import:infraege-114-import", "infraege_migration:infraege-114-migration"
            )
        ),
    )


def task_data(task_id: str) -> dict:
    return {
        "id": task_id,
        "title": "Задача",
        "difficulty": 2,
        "estimated_minutes": None,
        "answer_instruction": "Введите число",
        "statement": [{"type": "text", "data": {"markdown": "Чему равно 2 + 2?"}}],
        "hint": [],
        "explanation": [{"type": "text", "data": {"markdown": "Сложим два и два."}}],
        "checker": {"checker_type": "exact_match", "answer_variants": ["4"]},
        "sources": [
            {
                "kind": "original",
                "role": "original",
                "primary": True,
                "title": "Тест",
                "author": None,
                "original_id": None,
                "url": None,
                "year": None,
                "adaptation": None,
            }
        ],
    }


def package_at(
    root: Path,
    tasks: list[dict],
    *,
    expected: int = 0,
    mode: str = "normal",
    package_id: str | None = None,
) -> Package:
    root.mkdir()
    entries = []
    for i, task in enumerate(tasks):
        path = root / f"task-{i}.json"
        path.write_text(
            json.dumps(
                {"task": task, "expected_revision": expected, "mode": mode, "reason": "test"}
            )
        )
        entries.append({"path": path.name, "checksum": checksum(path)})
    (root / "manifest.json").write_text(
        json.dumps(
            {
                "format": 1,
                "package_id": package_id or uuid.uuid4().hex,
                "tasks": entries,
                "files": [],
            }
        )
    )
    return Package(root)


def run(coroutine):
    return asyncio.run(coroutine)


def test_transaction_versions_concurrency_and_public_projection(engines, tmp_path):
    writer, reader, migration = engines
    task_id = uuid.uuid4().hex
    data = task_data(task_id)
    data["lessons"] = [{"material_id": "rekursiya", "position": int(task_id[:7], 16)}]
    data["theory_links"] = [
        {"material_id": "rekursiya", "section": "concrete-computation", "label": "Теория"}
    ]
    initial = package_at(tmp_path / "initial", [data])
    storage = tmp_path / "storage"

    async def scenario():
        async with AsyncSession(migration) as session, session.begin():
            await register_materials(session, REGISTRY)
        result = await process_package(writer, initial, REGISTRY, storage, apply=True)
        assert result["changes"][0]["solution_revision"] == 1
        assert (await process_package(writer, initial, REGISTRY, storage, apply=True))[
            "status"
        ] == "already_committed"
        async with AsyncSession(reader) as session, session.begin():
            await require_schema(session)
            public = await read_task(session, task_id)
            assert (
                public
                and "checker" not in public.content.model_dump()
                and "answer_variants" not in public.model_dump_json()
            )
            assert await check_answer(session, task_id, 1, " 4 ")
            assert not await check_answer(session, task_id, 1, "5")
            record = await session.get(TaskRecord, task_id)
            assert record and record.created_at.tzinfo is not None
            assert record.statement[0]["data"]["markdown"].startswith("Чему")
        data["title"] = "Уточнённое название"
        a = package_at(tmp_path / "a", [data], expected=1)
        b = package_at(tmp_path / "b", [data], expected=1)
        results = await asyncio.gather(
            process_package(writer, a, REGISTRY, storage, update=True, apply=True),
            process_package(writer, b, REGISTRY, storage, update=True, apply=True),
            return_exceptions=True,
        )
        assert sum(isinstance(r, Conflict) for r in results) == 1
        successful = next(r for r in results if isinstance(r, dict))
        assert successful["changes"][0]["solution_revision"] == 1
        data["statement"][0]["data"]["markdown"] = "Чему равно 3 + 3?"
        data["checker"]["answer_variants"] = ["6"]
        invalid = package_at(tmp_path / "invalid", [data], expected=2, mode="editorial")
        with pytest.raises(ValueError, match="editorial"):
            await process_package(writer, invalid, REGISTRY, storage, update=True, apply=True)
        valid = package_at(tmp_path / "valid", [data], expected=2)
        assert (await process_package(writer, valid, REGISTRY, storage, update=True, apply=True))[
            "changes"
        ][0]["solution_revision"] == 2
        async with AsyncSession(reader) as session, session.begin():
            with pytest.raises(Conflict, match="solution revision"):
                await check_answer(session, task_id, 1, "6")
            assert await check_answer(session, task_id, 2, "6")
            history = (
                await session.scalars(select(TaskHistory).where(TaskHistory.task_id == task_id))
            ).all()
            assert len(history) == 3
            with pytest.raises(Conflict, match="registry"):
                await verify_registry(session, Registry(format=1, materials=[]))

    run(scenario())


def test_batch_rollback_and_package_identity(engines, tmp_path):
    writer, reader, _ = engines
    existing_id, new_id = uuid.uuid4().hex, uuid.uuid4().hex
    storage = tmp_path / "storage"
    initial = package_at(tmp_path / "initial", [task_data(existing_id)])
    batch = package_at(tmp_path / "batch", [task_data(new_id), task_data(existing_id)])
    reused = package_at(
        tmp_path / "reused", [task_data(new_id)], package_id=initial.manifest.package_id
    )

    async def scenario():
        await process_package(writer, initial, REGISTRY, storage, apply=True)
        with pytest.raises(Conflict):
            await process_package(writer, batch, REGISTRY, storage, apply=True)
        async with AsyncSession(reader) as session:
            assert await session.get(TaskRecord, new_id) is None
            assert await session.get(ImportOutcome, batch.manifest.package_id) is None
        with pytest.raises(Conflict, match="package ID"):
            await process_package(writer, reused, REGISTRY, storage, apply=True)

    run(scenario())


def test_files_export_edit_roundtrip(engines, tmp_path):
    writer, reader, _ = engines
    data = task_data(uuid.uuid4().hex)
    root = tmp_path / "package"
    package_at(root, [data])
    content = root / "17.txt"
    content.write_bytes(b"a;b\r\n1;2\r\n")
    digest = checksum(content)
    data["files"] = [
        {
            "id": "input",
            "checksum": digest,
            "purpose": "attachment",
            "filename": "17.txt",
            "description": "UTF-8, ;, строка заголовка",
        }
    ]
    data["statement"].append({"type": "attachment", "data": {"usage_id": "input"}})
    task_path = root / "task-0.json"
    task_path.write_text(
        json.dumps({"task": data, "expected_revision": 0, "reason": "file fixture"})
    )
    manifest = json.loads((root / "manifest.json").read_text())
    manifest["tasks"][0]["checksum"] = checksum(task_path)
    manifest["files"] = [
        {
            "path": "17.txt",
            "checksum": digest,
            "format": "txt",
            "size_bytes": content.stat().st_size,
        }
    ]
    (root / "manifest.json").write_text(json.dumps(manifest))
    package = Package(root)
    storage = Path(os.environ.get("PRACTICE_TEST_FILES", str(tmp_path / "storage")))

    async def scenario():
        await process_package(writer, package, REGISTRY, storage, apply=True)
        assert (storage / digest).read_bytes() == content.read_bytes()
        async with AsyncSession(reader) as session, session.begin():
            await export_task(session, data["id"], tmp_path / "export", storage, uuid.uuid4().hex)
        exported = Package(tmp_path / "export")
        exported.validate(REGISTRY)
        assert next(exported.edits()).task.files[0].filename == "17.txt"
        assert next(exported.edits()).task.checker.answer_variants == ["4"]
        result = await process_package(writer, exported, REGISTRY, storage, update=True, apply=True)
        assert result["changes"][0]["solution_revision"] == 1

    run(scenario())


def test_interrupted_transaction_has_no_committed_journal_and_can_retry(
    engines, tmp_path, monkeypatch
):
    writer, reader, _ = engines
    task_id = uuid.uuid4().hex
    package = package_at(tmp_path / "package", [task_data(task_id)])
    original = service.write_edit

    async def scenario():
        written = asyncio.Event()

        async def interrupted(*args, **kwargs):
            await original(*args, **kwargs)
            written.set()
            await asyncio.Event().wait()

        monkeypatch.setattr(service, "write_edit", interrupted)
        pending = asyncio.create_task(
            process_package(writer, package, REGISTRY, tmp_path / "storage", apply=True)
        )
        await asyncio.wait_for(written.wait(), 5)
        pending.cancel()
        with pytest.raises(asyncio.CancelledError):
            await pending
        async with AsyncSession(reader) as session:
            assert await session.get(ImportOutcome, package.manifest.package_id) is None
            assert await session.get(TaskRecord, task_id) is None
        monkeypatch.setattr(service, "write_edit", original)
        result = await process_package(writer, package, REGISTRY, tmp_path / "storage", apply=True)
        assert result["status"] == "committed"

    run(scenario())


def test_database_constraints_and_editorial_statement(engines, tmp_path):
    writer, reader, _ = engines
    data = task_data(uuid.uuid4().hex)
    package = package_at(tmp_path / "package", [data])

    async def scenario():
        await process_package(writer, package, REGISTRY, tmp_path / "storage", apply=True)
        async with AsyncSession(writer) as session, session.begin():
            with pytest.raises(DBAPIError):
                await session.execute(
                    text("UPDATE practice.task SET difficulty=4 WHERE id=:id"), {"id": data["id"]}
                )
        data["statement"][0]["data"]["markdown"] = "Чему равно два плюс два?"
        editorial = package_at(tmp_path / "editorial", [data], expected=1, mode="editorial")
        result = await process_package(
            writer, editorial, REGISTRY, tmp_path / "storage", update=True, apply=True
        )
        assert result["changes"][0]["solution_revision"] == 1
        async with AsyncSession(reader) as session:
            current = await current_snapshot(session, data["id"])
            assert current and current[0].difficulty == 2

    run(scenario())


def test_corrupt_image_and_expanded_zip_are_rejected(tmp_path, monkeypatch):
    import zipfile

    from PIL import Image

    from app.modules.practice import files
    from app.modules.practice.schemas import PackageFile

    image = tmp_path / "image.png"
    Image.new("RGB", (2, 3)).save(image)
    assert files.image_dimensions(image.read_bytes(), "png") == (2, 3)
    with pytest.raises(ValueError):
        files.image_dimensions(image.read_bytes()[:25], "png")
    archive = tmp_path / "archive.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as output:
        output.writestr("large.txt", "x" * 10000)
    entry = PackageFile(
        path="archive.zip",
        checksum=checksum(archive),
        format="zip",
        size_bytes=archive.stat().st_size,
    )
    monkeypatch.setattr(files, "MAX_PACKAGE", 1000)
    with pytest.raises(ValueError, match="expanded"):
        files.inspect_file(archive, entry)


def test_role_and_schema_lock_contract(engines):
    writer, reader, migration = engines

    async def scenario():
        async with AsyncSession(reader) as session, session.begin():
            with pytest.raises(DBAPIError):
                await session.execute(text("CREATE TABLE practice.forbidden_runtime (id integer)"))
        async with AsyncSession(writer) as session, session.begin():
            with pytest.raises(DBAPIError):
                await session.execute(text("CREATE TABLE practice.forbidden_import (id integer)"))
        async with AsyncSession(writer) as session, session.begin():
            with pytest.raises(DBAPIError):
                await session.execute(
                    text(
                        "UPDATE practice.import_outcome SET checksum='bad' "
                        "WHERE package_id='absent'"
                    )
                )
        async with AsyncSession(migration) as locked, locked.begin():
            await locked.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": SCHEMA_LOCK})
            async with AsyncSession(reader) as session, session.begin():
                with pytest.raises(Conflict, match="schema is busy"):
                    await require_schema(session)
        async with AsyncSession(reader) as session, session.begin():
            await require_schema(session)

    run(scenario())


def test_independent_shared_hidden_and_archived_task(engines, tmp_path):
    writer, reader, _ = engines
    data = task_data(uuid.uuid4().hex)
    position = int(data["id"][:7], 16)
    data["catalog_visible"] = False
    data["lessons"] = [
        {"material_id": "rekursiya", "position": position},
        {"material_id": "python-first-program", "position": position},
    ]
    package = package_at(tmp_path / "shared", [data])

    async def scenario():
        await process_package(writer, package, REGISTRY, tmp_path / "storage", apply=True)
        async with AsyncSession(reader) as session:
            public = await read_task(session, data["id"])
            assert public
            lessons = public.content.lessons
            assert isinstance(lessons, list) and len(lessons) == 2
        data["archived"] = True
        invalid = package_at(tmp_path / "invalid", [data], expected=1)
        with pytest.raises(ValueError):
            await process_package(
                writer, invalid, REGISTRY, tmp_path / "storage", update=True, apply=True
            )
        data["lessons"] = []
        archived = package_at(tmp_path / "archive", [data], expected=1)
        await process_package(
            writer, archived, REGISTRY, tmp_path / "storage", update=True, apply=True
        )
        async with AsyncSession(reader) as session:
            assert await read_task(session, data["id"]) is None
            assert await current_snapshot(session, data["id"]) is not None

    run(scenario())


@pytest.mark.parametrize(
    "mutation",
    [
        "unknown-block",
        "unknown-link",
        "unknown-format",
        "missing-file",
        "traversal",
        "symlink",
        "checksum",
    ],
)
def test_invalid_packages_fail_before_write(tmp_path, mutation):
    data = task_data("invalid-task")
    if mutation == "unknown-block":
        data["statement"][0]["type"] = "html"
    if mutation == "unknown-link":
        data["lessons"] = [{"material_id": "missing", "position": 0}]
    package = package_at(tmp_path / "package", [data])
    manifest_path = package.root / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    if mutation == "unknown-format":
        manifest["format"] = 999
    if mutation == "traversal":
        manifest["tasks"][0]["path"] = "../outside.json"
    if mutation == "missing-file":
        manifest["tasks"][0]["path"] = "missing.json"
    if mutation == "symlink":
        (package.root / "link").symlink_to(package.root / "task-0.json")
    if mutation == "checksum":
        manifest["tasks"][0]["checksum"] = "0" * 64
    manifest_path.write_text(json.dumps(manifest))
    with pytest.raises(ValueError):
        Package(package.root).validate(REGISTRY)


def test_current_projection_is_typed_and_independent_of_audit_snapshot(engines, tmp_path):
    writer, reader, migration = engines
    data = task_data(uuid.uuid4().hex)
    package = package_at(tmp_path / "current", [data])

    async def scenario():
        await process_package(writer, package, REGISTRY, tmp_path / "storage", apply=True)
        # Simulate an audit-only format/content change inside a rolled-back privileged fixture.
        async with AsyncSession(migration) as session:
            await session.execute(
                text("UPDATE practice.task_history SET snapshot = '{}'::jsonb WHERE task_id=:id"),
                {"id": data["id"]},
            )
            public = await read_task(session, data["id"])
            assert public and public.content.title == data["title"]
            assert "checker" not in public.model_dump()["content"]
            private = await current_snapshot(session, data["id"])
            assert private and private[1].checker.answer_variants == ["4"]
            await session.rollback()

    run(scenario())


def test_abrupt_staging_exit_leaves_only_isolated_temporary_files(tmp_path):
    import subprocess
    import sys

    storage = Path(os.environ.get("PRACTICE_TEST_FILES", str(tmp_path / "storage")))
    source = tmp_path / "source"
    source.mkdir()
    (source / "data.txt").write_text("crash fixture\n")
    program = """
import os, sys
from pathlib import Path
from types import SimpleNamespace
from app.modules.practice.files import Package, checksum
from app.modules.practice.schemas import PackageFile
root, storage = map(Path, sys.argv[1:])
file = root / "data.txt"
package = Package.__new__(Package)
package.root = root
package.manifest = SimpleNamespace(files=[PackageFile(path="data.txt", checksum=checksum(file),
    size_bytes=file.stat().st_size, format="txt")])
os.link = lambda *args: os._exit(99)
package.stage(storage)
"""
    result = subprocess.run([sys.executable, "-c", program, str(source), str(storage)])
    assert result.returncode == 99
    assert list((storage / ".staging").iterdir())
    assert not any(path.name.startswith("tmp") for path in storage.iterdir())
    # The runner's subsequent real backup/restore uses this very storage with the leftovers.
