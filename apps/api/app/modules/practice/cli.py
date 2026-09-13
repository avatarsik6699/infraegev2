"""Operator entry point; private exports must stay on an operator-owned filesystem."""

import argparse
import asyncio
import json
import os
import subprocess
import sys

from asyncpg import PostgresError
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.modules.practice.commands import execute
from app.modules.practice.service import Conflict


def main() -> None:
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "command",
        choices=[
            "validate",
            "diff",
            "apply",
            "import",
            "export",
            "outcome",
            "register",
            "preflight",
            "smoke",
        ],
    )
    parser.add_argument("--environment", required=True, choices=["dev", "test", "prod"])
    parser.add_argument("--project", required=True)
    parser.add_argument(
        "--registry", default=os.environ.get("PRACTICE_REGISTRY", "/app/practice-registry.json")
    )
    parser.add_argument(
        "--storage", default=os.environ.get("TASK_FILES_DIR", "/var/lib/infraege/task-files")
    )
    parser.add_argument("--package")
    parser.add_argument("--package-id")
    parser.add_argument("--task-id")
    parser.add_argument("--output")
    parser.add_argument("--update", action="store_true")
    parser.add_argument("--backup-env", default="/etc/infraege/production.env")
    args = parser.parse_args()
    if args.command in {"validate", "diff", "apply", "import"} and not args.package:
        parser.error("--package required")
    if args.command in {"outcome", "export"} and not args.package_id:
        parser.error("--package-id required")
    if args.command == "export" and (not args.task_id or not args.output):
        parser.error("export requires --task-id and --output")
    try:
        print(json.dumps(asyncio.run(execute(args)), ensure_ascii=False))
    except (
        ValueError,
        SQLAlchemyError,
        PostgresError,
        KeyError,
        subprocess.CalledProcessError,
    ) as exc:
        # Validation/DB exceptions can contain private task input, SQL parameters or credentials.
        if isinstance(exc, ValidationError):
            for issue in exc.errors(include_input=False, include_context=False, include_url=False):
                location = ".".join(str(part) for part in issue["loc"])
                print(f"{location}: {issue['type']}", file=sys.stderr)
        elif isinstance(exc, ValueError):
            print(str(exc), file=sys.stderr)
        print(
            f"practice operation failed ({type(exc).__name__}). "
            "After a write, query outcome before retrying.",
            file=sys.stderr,
        )
        sys.exit(3 if isinstance(exc, Conflict) else 2 if isinstance(exc, ValueError) else 1)


if __name__ == "__main__":
    main()
