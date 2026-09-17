"""Trusted operator import/export, one transaction and one current bank."""

import argparse
import asyncio
import json
import os
import shutil
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import database_engine
from app.modules.practice.files import MIME, checksum, safe_path
from app.modules.practice.schemas import Bank, Registry
from app.modules.practice.service import export_bank, import_bank, require_schema


async def execute(args: argparse.Namespace) -> None:
    registry = Registry.model_validate_json(
        (Path(__file__).resolve().parents[3] / "practice-registry.json").read_bytes()
    )
    bank = None
    if args.command in {"validate", "import"}:
        bank = Bank.model_validate_json((args.directory / "bank.json").read_bytes())
        if bank.materials != registry.materials or bank.courses != registry.courses:
            raise ValueError("bank publication metadata differs from the release registry")
        bank.validate_references()
        files = {item.checksum: item for item in bank.files}
        for entry in bank.tasks:
            for usage in entry.task.files:
                if usage.checksum not in files:
                    raise ValueError("unknown task file")
        for item in bank.files:
            source = safe_path(args.directory / "files", item.checksum)
            if (
                item.storage_key != item.checksum
                or MIME.get(item.format) != item.mime_type
                or checksum(source) != item.checksum
                or source.stat().st_size != item.size_bytes
            ):
                raise ValueError("corrupt or unsupported import file")
        if args.command == "validate":
            print(json.dumps({"status": "valid", "tasks": len(bank.tasks)}))
            return
    storage = Path(os.environ["TASK_FILES_DIR"])
    engine = database_engine(os.environ["IMPORT_DATABASE_URL"], role="infraege_import")
    try:
        async with AsyncSession(engine) as session, session.begin():
            await require_schema(session)
            if args.command == "import":
                assert bank is not None
                storage.mkdir(parents=True, exist_ok=True)
                for item in bank.files:
                    source = safe_path(args.directory / "files", item.checksum)
                    target = storage / item.checksum
                    if target.exists() or target.is_symlink():
                        safe_path(storage, item.checksum)
                    else:
                        shutil.copyfile(source, target)
                count = await import_bank(session, bank, storage)
                # Only validated public attachment bytes live here. Nginx uses another UID;
                # exports and the operator environment retain the private process umask.
                for item in bank.files:
                    safe_path(storage, item.checksum).chmod(0o644)
                storage.chmod(0o755)
                print(json.dumps({"tasks": count}))
            else:
                args.directory.mkdir(mode=0o700)
                bank = await export_bank(session)
                bank = Bank.model_validate(
                    dict(
                        bank.model_dump(),
                        materials=registry.materials,
                        courses=registry.courses,
                    )
                )
                (args.directory / "bank.json").write_text(bank.model_dump_json(indent=2) + "\n")
                (args.directory / "files").mkdir()
                for item in bank.files:
                    source = safe_path(storage, item.checksum)
                    if checksum(source) != item.checksum:
                        raise ValueError("corrupt stored file")
                    shutil.copyfile(source, args.directory / "files" / item.checksum)
                print(json.dumps({"tasks": len(bank.tasks)}))
    finally:
        await engine.dispose()


def main() -> None:
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["validate", "import", "export"])
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    asyncio.run(execute(args))


if __name__ == "__main__":
    main()
