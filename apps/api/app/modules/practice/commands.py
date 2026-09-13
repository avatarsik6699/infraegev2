"""Operator command handlers; owns host targeting, backup and command orchestration."""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

from sqlalchemy import select, text
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.core.database import database_engine
from app.modules.practice.files import Package, checksum, safe_path
from app.modules.practice.models import FileObject, ImportOutcome, TaskRecord
from app.modules.practice.schemas import Manifest, PackageFile, Registry, TaskEdit, TaskEntry
from app.modules.practice.service import (
    check_answer,
    current_snapshot,
    process_package,
    read_task,
    register_materials,
    require_schema,
    verify_registry,
)


def identity(environment: str, project: str) -> None:
    if (environment, project) not in {
        ("dev", "infraege-dev"),
        ("prod", "infraege"),
        ("test", "infraege-full-gate"),
    }:
        if environment != "test" or not project.startswith("infraege-db-test-"):
            raise ValueError("environment/project mismatch")
    print(f"environment={environment} project={project} database=infraege", file=sys.stderr)


def backup(args: argparse.Namespace) -> None:
    # Fixed script, argv only. No shell evaluation of operator input or environment files.
    root = Path(os.environ["PRACTICE_RELEASE_ROOT"])
    subprocess.run(
        ["bash", str(root / "scripts/backup.sh"), args.backup_env],
        check=True,
        env={**os.environ, "DB_ENV": args.environment, "DB_PROJECT": args.project},
        stdout=sys.stderr,
    )


def verify_host_target(value: str, project: str) -> None:
    """Match the host CLI endpoint to the explicitly selected live Compose database."""
    ids = subprocess.check_output(
        [
            "docker",
            "ps",
            "-q",
            "--filter",
            f"label=com.docker.compose.project={project}",
            "--filter",
            "label=com.docker.compose.service=postgres",
        ],
        text=True,
    ).split()
    if len(ids) != 1:
        raise ValueError("expected exactly one database in the selected project")
    network = json.loads(
        subprocess.check_output(
            [
                "docker",
                "inspect",
                "--format",
                "{{json .NetworkSettings}}",
                ids[0],
            ],
            text=True,
        )
    )
    url = make_url(value)
    endpoints = {(item["IPAddress"], 5432) for item in network["Networks"].values()}
    endpoints.update(
        (item["HostIp"], int(item["HostPort"])) for item in (network["Ports"].get("5432/tcp") or [])
    )
    if (url.host, url.port or 5432) not in endpoints:
        raise ValueError("database URL does not match the selected Compose instance")


async def export_task(
    session: AsyncSession, task_id: str, output: Path, storage: Path, package_id: str
) -> dict[str, Any]:
    current = await current_snapshot(session, task_id)
    if current is None:
        raise ValueError("task unavailable")
    record, task = current
    output.mkdir(mode=0o700)  # Never overwrite an existing export.
    edit = TaskEdit(task=task, expected_revision=record.revision, reason="operator edit")
    task_path = output / "task.json"
    task_path.write_text(edit.model_dump_json(indent=2) + "\n")
    files = []
    for digest in sorted({usage.checksum for usage in task.files}):
        obj = await session.get(FileObject, digest)
        if obj is None:
            raise ValueError("file metadata missing")
        source = safe_path(storage, obj.storage_key)
        if checksum(source) != digest:
            raise ValueError("stored file corruption")
        shutil.copyfile(source, output / digest)
        files.append(
            PackageFile.model_validate(
                dict(path=digest, checksum=digest, size_bytes=obj.size_bytes, format=obj.format)
            )
        )
    manifest = Manifest(
        format=1,
        package_id=package_id,
        tasks=[TaskEntry(path="task.json", checksum=checksum(task_path))],
        files=files,
    )
    (output / "manifest.json").write_text(manifest.model_dump_json(indent=2) + "\n")
    return {"status": "exported", "revision": record.revision, "output": str(output)}


async def execute(args: argparse.Namespace) -> dict[str, Any]:
    identity(args.environment, args.project)
    registry = Registry.model_validate_json(Path(args.registry).read_bytes())
    storage = Path(args.storage)
    if args.command == "validate":
        package = Package(Path(args.package))
        package.validate(registry)
        return {"status": "valid", "checksum": package.checksum}
    writer = args.command in {"apply", "import", "register"}
    variable = "IMPORT_DATABASE_URL" if writer else "DATABASE_URL"
    role = "infraege_import" if writer else "infraege_runtime"
    if args.command == "register":
        variable, role = "MIGRATION_DATABASE_URL", "infraege_migration"
    if args.command in {"apply", "import", "diff", "export", "outcome"}:
        verify_host_target(os.environ[variable], args.project)
    engine = database_engine(os.environ[variable], role=role)
    try:
        if args.command in {"diff", "apply", "import"}:
            return await package_command(args, engine, registry, storage)
        async with AsyncSession(engine) as session, session.begin():
            await require_schema(session)
            if args.command == "register":
                await session.execute(text("SELECT pg_advisory_xact_lock(114002)"))
                await verify_registry(session, registry)
                await register_materials(session, registry)
                return {"status": "registered"}
            if args.command == "preflight":
                await verify_registry(session, registry)
                return {"status": "compatible"}
            if args.command == "outcome":
                outcome = await session.get(ImportOutcome, args.package_id)
                return (
                    {"status": "not_committed"}
                    if outcome is None
                    else {
                        "status": "committed",
                        "checksum": outcome.checksum,
                        "committed_at": outcome.committed_at.isoformat(),
                        "task_count": outcome.task_count,
                    }
                )
            if args.command == "export":
                return await export_task(
                    session, args.task_id, Path(args.output), storage, args.package_id
                )
            if args.command == "smoke":
                return await verify_tasks(session, registry, storage)
        raise ValueError("unknown command")
    finally:
        await engine.dispose()


async def package_command(
    args: argparse.Namespace, engine: AsyncEngine, registry: Registry, storage: Path
) -> dict[str, Any]:
    package = Package(Path(args.package))
    result = await process_package(engine, package, registry, storage, update=args.update)
    if args.command == "diff":
        return result
    backup(args)
    result = await process_package(
        engine, package, registry, storage, update=args.update, apply=True
    )
    async with AsyncSession(engine) as session, session.begin():
        await verify_tasks(session, registry, storage, [edit.task.id for edit in package.edits()])
    backup(args)
    return result


async def verify_tasks(
    session: AsyncSession, registry: Registry, storage: Path, task_ids: list[str] | None = None
) -> dict[str, Any]:
    from app.modules.practice import readers

    await verify_registry(session, registry)
    count = 0
    statement = select(TaskRecord.id).where(TaskRecord.archived.is_(False)).order_by(TaskRecord.id)
    if task_ids is not None:
        statement = statement.where(TaskRecord.id.in_(task_ids))
    ids = await session.stream_scalars(statement)
    async for task_id in ids:
        current = await current_snapshot(session, task_id)
        if current is None:
            raise ValueError("task state missing")
        record, task = current
        if await read_task(session, task_id) is None:
            raise ValueError("public projection missing")
        try:
            await readers.task(session, registry, task_id)
        except readers.Unavailable:
            public = False
        else:
            public = True
        for usage in task.files:
            if checksum(safe_path(storage, usage.checksum)) != usage.checksum:
                raise ValueError("task file corrupt")
        for answer in task.checker.answer_variants:
            if not await check_answer(session, task_id, record.solution_revision, answer):
                raise ValueError("checker smoke failed")
            if public:
                result = await readers.check(
                    session, registry, task_id, record.solution_revision, answer
                )
                if not result.correct:
                    raise ValueError("public checker smoke failed")
        count += 1
    return {"status": "verified", "tasks": count}
