"""First-import parity and fail-closed conversion contracts."""

import asyncio
import json
import os
from pathlib import Path

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import database_engine
from app.modules.practice.files import checksum
from app.modules.practice.legacy import convert
from app.modules.practice.schemas import Registry
from app.modules.practice.service import current_snapshot, process_package, register_materials

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "content/practice-migration"
REGISTRY = Registry.model_validate_json((ROOT / "apps/api/practice-registry.json").read_bytes())


def test_complete_deterministic_parity(tmp_path: Path):
    first = convert(SOURCE, tmp_path / "first", REGISTRY)
    second = convert(SOURCE, tmp_path / "second", REGISTRY)
    assert first.checksum == second.checksum
    assert len(first.manifest.tasks) == 150
    assert len(first.manifest.files) == 1
    snapshot = json.loads((SOURCE / "snapshot.json").read_bytes())
    edits = {edit.task.id: edit for edit in first.edits()}
    assert set(edits) == set(snapshot["first_solution_revisions"])
    for task_id, edit in edits.items():
        old = json.loads((SOURCE / f"tasks/{task_id}.json").read_bytes())
        task = edit.task.model_dump(mode="json")
        assert edit.expected_revision == 0
        assert not task["catalog_visible"]
        assert task["checker"] == {key: old[key] for key in task["checker"]}
        for key in ("title", "difficulty", "interaction_type"):
            assert task[key] == old[key]
        for area in ("statement", "hint", "explanation"):
            for before, after in zip(old[area], task[area], strict=True):
                if before["type"] == "attachment":
                    usage = next(f for f in task["files"] if f["id"] == after["data"]["usage_id"])
                    asset = ROOT / "apps/web/public" / before["data"]["src"].lstrip("/")
                    assert checksum(asset) == usage["checksum"]
                    assert usage["filename"] == before["data"]["label"]
                    assert usage["description"] == before["data"]["description"]
                else:
                    # Pydantic may add an explicit null optional caption, but never alter text.
                    assert all(after["data"][k] == v for k, v in before["data"].items())
                    assert after["type"] == before["type"]
        assert task["sources"][0]["kind"] == "unknown"
    for material in snapshot["materials"]:
        ordered = sorted(
            (link.position, edit.task.id)
            for edit in edits.values()
            for link in edit.task.lessons
            if link.material_id == material["id"]
        )
        assert [task_id for _, task_id in ordered] == material["task_ids"]


def test_unknown_theory_reference_rejected(tmp_path: Path):
    with pytest.raises(ValueError, match="unknown application section"):
        convert(
            SOURCE,
            tmp_path / "package",
            Registry(
                format=1,
                materials=[
                    material.model_copy(update={"sections": []}) for material in REGISTRY.materials
                ],
            ),
        )


def test_conversion_never_overwrites_package(tmp_path: Path):
    target = tmp_path / "package"
    target.mkdir()
    marker = target / "operator-edit.txt"
    marker.write_text("preserve")
    with pytest.raises(FileExistsError):
        convert(SOURCE, target, REGISTRY)
    assert marker.read_text() == "preserve"


def test_postgres_import_and_replay(tmp_path: Path):
    url = os.environ.get("PRACTICE_TEST_URL", "")
    if not url:
        pytest.skip("requires isolated PostgreSQL fixture")
    if not url.startswith("postgresql://infraege_import:infraege-114-import@127.0.0.1:"):
        pytest.fail("test database identity rejected")
    package = convert(SOURCE, tmp_path / "package", REGISTRY)

    storage = Path(os.environ.get("PRACTICE_TEST_FILES", str(tmp_path / "storage")))

    async def verify():
        engine = database_engine(url, role="infraege_import")
        migration = database_engine(
            url.replace(
                "infraege_import:infraege-114-import", "infraege_migration:infraege-114-migration"
            ),
            role="infraege_migration",
        )
        try:
            async with AsyncSession(migration) as session, session.begin():
                await register_materials(session, REGISTRY)
            result = await process_package(engine, package, REGISTRY, storage, apply=True)
            assert result["status"] == "committed"
            replay = await process_package(engine, package, REGISTRY, storage, apply=True)
            assert replay["status"] == "already_committed"
            async with AsyncSession(engine) as session:
                for edit in package.edits():
                    current = await current_snapshot(session, edit.task.id)
                    assert current is not None
                    assert current[0].solution_revision == 1
                    assert current[0].revision == 1
                    assert current[1] == edit.task
        finally:
            await engine.dispose()
            await migration.dispose()

    asyncio.run(verify())
