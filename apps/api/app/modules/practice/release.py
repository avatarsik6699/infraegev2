"""Host-only, repeatable first-bank import before candidate consumer activation."""

import argparse
import asyncio
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from asyncpg import PostgresError
from sqlalchemy.engine import URL
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import database_engine
from app.modules.practice.commands import execute, identity, verify_host_target, verify_tasks
from app.modules.practice.files import Package, checksum, safe_path
from app.modules.practice.legacy import convert
from app.modules.practice.models import ImportOutcome, TaskHistory
from app.modules.practice.schemas import Registry, TaskData
from app.modules.practice.service import current_snapshot, require_schema


def configure_target(environment: str, project: str) -> None:
    identity(environment, project)
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
        raise ValueError("expected exactly one selected database")
    network = json.loads(
        subprocess.check_output(
            ["docker", "inspect", "--format", "{{json .NetworkSettings}}", ids[0]], text=True
        )
    )
    # Host runners on Desktop use the allocated loopback port; Linux production uses bridge IP.
    endpoints = {
        (entry["HostIp"], int(entry["HostPort"]))
        for entry in (network["Ports"].get("5432/tcp") or [])
        if entry["HostIp"] == "127.0.0.1"
    }
    if not endpoints:
        endpoints = {
            (entry["IPAddress"], 5432)
            for entry in network["Networks"].values()
            if entry["IPAddress"]
        }
    if len(endpoints) != 1:
        raise ValueError("ambiguous host database endpoint")
    host, port = endpoints.pop()
    if os.environ.get("POSTGRES_DB") != "infraege":
        raise ValueError("unexpected application database")
    for role, variable in (("runtime", "DATABASE_URL"), ("import", "IMPORT_DATABASE_URL")):
        password = os.environ[f"DB_{role.upper()}_PASSWORD"]
        if not password:
            raise ValueError("missing restricted-role credential")
        value = URL.create(
            "postgresql",
            username=f"infraege_{role}",
            password=password,
            host=host,
            port=port,
            database="infraege",
        ).render_as_string(hide_password=False)
        verify_host_target(value, project)
        os.environ[variable] = value


async def verify_bank(package: Package, registry: Registry, storage: Path) -> None:
    engine = database_engine(os.environ["DATABASE_URL"], role="infraege_runtime")
    try:
        async with AsyncSession(engine) as session, session.begin():
            await require_schema(session)
            outcome = await session.get(ImportOutcome, package.manifest.package_id)
            if (
                outcome is None
                or outcome.checksum != package.checksum
                or outcome.task_count != len(package.manifest.tasks)
            ):
                raise ValueError("first-bank outcome mismatch")
            ids = []
            for edit in package.edits():
                ids.append(edit.task.id)
                history = await session.get(TaskHistory, (edit.task.id, 1))
                current = await current_snapshot(session, edit.task.id)
                if (
                    history is None
                    or history.package_id != outcome.package_id
                    or history.solution_revision != 1
                    or TaskData.model_validate(history.snapshot) != edit.task
                    or current is None
                ):
                    raise ValueError("first-bank task parity mismatch")
                # Later operator edits are legitimate. Revision one must still match exactly.
                if current[0].revision == 1 and (
                    current[0].solution_revision != 1 or current[1] != edit.task
                ):
                    raise ValueError("first-bank current revision mismatch")
            for entry in package.manifest.files:
                if checksum(safe_path(storage, entry.checksum)) != entry.checksum:
                    raise ValueError("first-bank file mismatch")
            await verify_tasks(session, registry, storage, ids)
    finally:
        await engine.dispose()


async def prepare_bank(args: argparse.Namespace) -> None:
    root = Path(os.environ["PRACTICE_RELEASE_ROOT"]).resolve()
    registry_path = root / "apps/api/practice-registry.json"
    registry = Registry.model_validate_json(registry_path.read_bytes())
    storage = Path(os.environ["TASK_FILES_DIR"])
    if args.environment == "prod" and storage != Path("/var/lib/infraege/task-files"):
        raise ValueError("unexpected production task storage")
    configure_target(args.environment, args.project)
    with tempfile.TemporaryDirectory(prefix="infraege-release-practice-") as temporary:
        package = convert(
            root / "content/practice-migration", Path(temporary) / "package", registry
        )
        command = argparse.Namespace(
            environment=args.environment,
            project=args.project,
            registry=str(registry_path),
            storage=str(storage),
            package=str(package.root),
            package_id=package.manifest.package_id,
            update=False,
            backup_env=args.backup_env,
        )
        # Import owns pre-backup, transactional journal-aware apply, current smoke and post-backup.
        # On retry it returns already_committed, preserving all subsequent operator edits.
        for name in ("validate", "diff", "import", "outcome"):
            command.command = name
            result = await execute(command)
            print(f"practice release {name}: {result['status']}", flush=True)
        await verify_bank(package, registry, storage)
        print(f"practice release bank verified: {len(package.manifest.tasks)} tasks", flush=True)


def main() -> None:
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--environment", choices=("prod", "test"), required=True)
    parser.add_argument("--project", required=True)
    parser.add_argument("--backup-env", required=True)
    args = parser.parse_args()
    try:
        asyncio.run(prepare_bank(args))
    except (
        ValueError,
        KeyError,
        SQLAlchemyError,
        PostgresError,
        subprocess.CalledProcessError,
    ) as exc:
        # Never expose validation input, checker answers, SQL parameters or credentials.
        print(
            f"practice release failed ({type(exc).__name__}); inspect outcome before retrying",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
