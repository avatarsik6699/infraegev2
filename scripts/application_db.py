#!/usr/bin/env python3
"""Internal maintenance commands behind the existing Make/Bash entry points."""

import argparse
import os
import subprocess
import sys
from pathlib import Path

from lib.application_db import bundle, recovery, sql
from lib.application_db.postgres import Database, docker


def main() -> None:
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("validate", "files", "references"):
        commands.add_parser(name).add_argument("path", type=Path)
    fingerprint = commands.add_parser("fingerprint")
    fingerprint.add_argument("container")
    create = commands.add_parser("bundle")
    create.add_argument("container")
    create.add_argument("path", type=Path)
    create.add_argument("env_file", type=Path)
    create.add_argument("environment")
    create.add_argument("project")
    for name in ("restore", "smoke"):
        command = commands.add_parser(name)
        command.add_argument("path", type=Path)
        command.add_argument("container")
    args = parser.parse_args()
    try:
        match args.command:
            case "validate":
                bundle.validate(args.path)
            case "files":
                bundle.verify_files(args.path)
            case "references":
                bundle.verify_references(args.path)
            case "fingerprint":
                print(Database(args.container).query(sql.FINGERPRINT), end="")
            case "restore":
                recovery.restore(args.path, args.container)
            case "smoke":
                recovery.smoke(args.path, args.container)
            case "bundle":
                allowed = (args.environment, args.project) in {
                    ("dev", "infraege-dev"),
                    ("prod", "infraege"),
                    ("test", "infraege-full-gate"),
                } or (args.environment == "test" and args.project.startswith("infraege-db-test-"))
                project = docker(
                    "inspect",
                    args.container,
                    "--format",
                    '{{index .Config.Labels "com.docker.compose.project"}}',
                )
                service = docker(
                    "inspect",
                    args.container,
                    "--format",
                    '{{index .Config.Labels "com.docker.compose.service"}}',
                )
                if not allowed or project != args.project or service != "postgres":
                    raise ValueError("environment/container identity mismatch")
                bundle.create(
                    Database(args.container),
                    args.path,
                    args.env_file,
                    args.environment,
                    args.project,
                )
    except (ValueError, subprocess.SubprocessError, TimeoutError) as exc:
        # Never stringify subprocess exceptions: argv can contain restore-only credentials.
        message = str(exc) if isinstance(exc, ValueError) else type(exc).__name__
        print(f"application DB: {message}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
