"""Host coordinator contracts against the isolated 118 PostgreSQL fixture."""

import argparse
import asyncio
import json
import os
import subprocess
from pathlib import Path

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import database_engine
from app.modules.practice import commands, release, service
from app.modules.practice.commands import export_task
from app.modules.practice.files import Package, checksum
from app.modules.practice.legacy import convert
from app.modules.practice.models import ImportOutcome
from app.modules.practice.schemas import Registry
from app.modules.practice.service import current_snapshot, process_package

ROOT = Path(__file__).resolve().parents[3]
REGISTRY = Registry.model_validate_json((ROOT / "apps/api/practice-registry.json").read_bytes())


def test_target_rejected_before_discovery(monkeypatch: pytest.MonkeyPatch):
    def unexpected(*args, **kwargs):
        pytest.fail("target mismatch must not contact Docker")

    monkeypatch.setattr(subprocess, "check_output", unexpected)
    with pytest.raises(ValueError, match="environment/project mismatch"):
        release.configure_target("prod", "infraege-dev")


def test_first_import_interruption_replay_and_edits(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
):
    project = os.environ.get("PRACTICE_RELEASE_TEST_PROJECT", "")
    if not project.startswith("infraege-db-test-118-"):
        pytest.skip("requires the isolated 118 fixture")
    args = argparse.Namespace(
        environment="test", project=project, backup_env=os.environ["PRACTICE_RELEASE_TEST_ENV"]
    )
    storage = Path(os.environ["TASK_FILES_DIR"])
    package = convert(ROOT / "content/practice-migration", tmp_path / "package", REGISTRY)
    original_backup = commands.backup
    calls = 0

    def interrupted_backup(arguments):
        nonlocal calls
        calls += 1
        if calls == 2:
            raise subprocess.CalledProcessError(42, "synthetic post-import backup failure")
        original_backup(arguments)

    async def scenario():
        release.configure_target("test", project)
        engine = database_engine(os.environ["IMPORT_DATABASE_URL"], role="infraege_import")
        try:
            password = os.environ["DB_RUNTIME_PASSWORD"]
            monkeypatch.setenv("DB_RUNTIME_PASSWORD", "invalid-test-password")
            with pytest.raises(release.PostgresError):
                await release.prepare_bank(args)
            monkeypatch.setenv("DB_RUNTIME_PASSWORD", password)

            # Pre-backup failure must leave the journal empty.
            def failed_backup(arguments):
                raise subprocess.CalledProcessError(41, "synthetic pre-import backup failure")

            monkeypatch.setattr(commands, "backup", failed_backup)
            with pytest.raises(subprocess.CalledProcessError) as failure:
                await release.prepare_bank(args)
            assert failure.value.returncode == 41
            async with AsyncSession(engine) as session:
                assert await session.scalar(select(ImportOutcome.package_id)) is None

            original_write = service.write_edit
            written = 0

            async def interrupted_write(*arguments):
                nonlocal written
                await original_write(*arguments)
                written += 1
                if written == 4:
                    raise RuntimeError("synthetic interrupted transaction")

            monkeypatch.setattr(commands, "backup", original_backup)
            monkeypatch.setattr(service, "write_edit", interrupted_write)
            with pytest.raises(RuntimeError, match="interrupted transaction"):
                await release.prepare_bank(args)
            monkeypatch.setattr(service, "write_edit", original_write)
            async with AsyncSession(engine) as session:
                assert await session.scalar(select(ImportOutcome.package_id)) is None
                assert await current_snapshot(session, next(package.edits()).task.id) is None

            # Commit succeeds, post-backup fails: a retry must use the committed outcome.
            monkeypatch.setattr(commands, "backup", interrupted_backup)
            with pytest.raises(subprocess.CalledProcessError) as failure:
                await release.prepare_bank(args)
            assert failure.value.returncode == 42 and calls == 2
            await release.verify_bank(package, REGISTRY, storage)
            monkeypatch.setattr(commands, "backup", original_backup)
            await release.prepare_bank(args)
            async with AsyncSession(engine) as session:
                for edit in package.edits():
                    current = await current_snapshot(session, edit.task.id)
                    assert current is not None and current[0].revision == 1
                    assert current[1] == edit.task

            task_id = next(package.edits()).task.id
            exported = tmp_path / "edited"
            async with AsyncSession(engine) as session:
                await export_task(session, task_id, exported, storage, "release-operator-edit")
            task = json.loads((exported / "task.json").read_bytes())
            task["task"]["title"] += " — operator correction"
            (exported / "task.json").write_text(json.dumps(task))
            manifest = json.loads((exported / "manifest.json").read_bytes())
            manifest["tasks"][0]["checksum"] = checksum(exported / "task.json")
            (exported / "manifest.json").write_text(json.dumps(manifest))
            await process_package(
                engine, Package(exported), REGISTRY, storage, update=True, apply=True
            )
            await release.prepare_bank(args)
            async with AsyncSession(engine) as session:
                current = await current_snapshot(session, task_id)
                assert current is not None and current[0].revision == 2
                assert current[1].title == task["task"]["title"]

            # Only replace an object in this disposable fixture, preserving the original bytes.
            obj = storage / package.manifest.files[0].checksum
            original = tmp_path / "original-object"
            obj.rename(original)
            obj.write_bytes(b"corrupt")
            try:
                with pytest.raises((ValueError, subprocess.CalledProcessError)):
                    await release.prepare_bank(args)
            finally:
                obj.unlink()
                original.rename(obj)
        finally:
            await engine.dispose()

    asyncio.run(scenario())
