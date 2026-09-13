"""Explicit local initialization through the existing operator CLI and writer."""

import argparse
import asyncio
import os
import subprocess
import tempfile
from pathlib import Path

from app.modules.practice.commands import execute
from app.modules.practice.legacy import convert
from app.modules.practice.schemas import Registry


async def bootstrap(backup_env: str) -> None:
    root = Path(__file__).resolve().parents[5]
    containers = subprocess.check_output(
        [
            "docker",
            "ps",
            "-q",
            "--filter",
            "label=com.docker.compose.project=infraege-dev",
            "--filter",
            "label=com.docker.compose.service=postgres",
        ],
        text=True,
    ).split()
    if len(containers) != 1:
        raise ValueError("run make dev first; expected one dev database")
    endpoint = subprocess.check_output(["docker", "port", containers[0], "5432"], text=True).strip()
    host, port = endpoint.split(":")
    if host != "127.0.0.1" or not port.isdigit():
        raise ValueError("expected a loopback-only dev database port")
    for variable, role, password in [
        ("DATABASE_URL", "runtime", "infraege-dev-runtime-only"),
        ("IMPORT_DATABASE_URL", "import", "infraege-dev-import-only"),
        ("MIGRATION_DATABASE_URL", "migration", "infraege-dev-migration-only"),
    ]:
        os.environ[variable] = f"postgresql://infraege_{role}:{password}@{endpoint}/infraege"
    os.environ["PRACTICE_RELEASE_ROOT"] = str(root)
    registry_path = root / "apps/api/practice-registry.json"
    registry = Registry.model_validate_json(registry_path.read_bytes())
    with tempfile.TemporaryDirectory(prefix="infraege-dev-practice-") as temporary:
        package = convert(
            root / "content/practice-migration", Path(temporary) / "package", registry
        )
        args = argparse.Namespace(
            environment="dev",
            project="infraege-dev",
            registry=str(registry_path),
            storage=str(root / "infra/task-files.local"),
            package=str(package.root),
            package_id=package.manifest.package_id,
            update=False,
            backup_env=backup_env,
        )
        for command in ("register", "validate", "diff", "import", "outcome", "smoke"):
            args.command = command
            result = await execute(args)
            print(f"{command}: {result['status']}")


def main() -> None:
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--backup-env", required=True)
    args = parser.parse_args()
    asyncio.run(bootstrap(args.backup_env))


if __name__ == "__main__":
    main()
