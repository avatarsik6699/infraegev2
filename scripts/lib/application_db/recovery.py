"""Restore only into a labelled, empty disposable database; never production."""

import secrets
import subprocess
from pathlib import Path

from . import sql
from .bundle import TASK_SCHEMAS, schema_version, validate
from .postgres import TIMEOUT, Database, docker


def require_disposable(container: str) -> None:
    purpose = docker(
        "inspect", container, "--format", '{{index .Config.Labels "com.infraege.db-purpose"}}'
    )
    project = docker(
        "inspect", container, "--format", '{{index .Config.Labels "com.docker.compose.project"}}'
    )
    if purpose != "restore" or project == "infraege":
        raise ValueError("restore destination must be disposable and non-production")


def restore(bundle: Path, container: str) -> None:
    metadata = validate(bundle)
    require_disposable(container)
    exists = docker(
        "exec",
        container,
        "psql",
        "-X",
        "-At",
        "-U",
        "restore_admin",
        "-d",
        "postgres",
        "-c",
        "SELECT count(*) FROM pg_database WHERE datname='infraege'",
    )
    if exists != "0":
        raise ValueError("restore target already contains application database")
    for name, args in (
        (
            "roles.sql",
            ["psql", "-X", "-q", "-U", "restore_admin", "-d", "postgres", "-v", "ON_ERROR_STOP=1"],
        ),
        (
            "application.dump",
            ["pg_restore", "-U", "restore_admin", "--exit-on-error", "--create", "-d", "postgres"],
        ),
    ):
        with (bundle / name).open("rb") as stream:
            subprocess.run(
                ["docker", "exec", "-i", container, *args],
                stdin=stream,
                check=True,
                timeout=TIMEOUT,
            )
    db = Database(container)
    if schema_version(db) != metadata.schemaVersion:
        raise ValueError("restored schema differs from metadata")
    checks = [("data-checks.txt", sql.FINGERPRINT), ("schema.txt", sql.SCHEMAS)]
    if metadata.schemaVersion in TASK_SCHEMAS:
        checks.append(("file-references.txt", sql.REFERENCES))
    for name, query in checks:
        if db.query(query) != (bundle / name).read_text():
            raise ValueError(f"restored {name} mismatch")


def smoke(bundle: Path, container: str) -> None:
    metadata = validate(bundle)
    if metadata.schemaVersion not in TASK_SCHEMAS:
        return
    require_disposable(container)
    available = subprocess.run(
        ["docker", "image", "inspect", metadata.verifierImage],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        timeout=TIMEOUT,
    )
    if available.returncode:
        docker("pull", metadata.verifierImage)
    if (
        docker("image", "inspect", metadata.verifierImage, "--format", "{{.Id}}")
        != metadata.verifierId
    ):
        raise ValueError("restore verifier image identity mismatch")
    password = secrets.token_hex(24)
    subprocess.run(
        [
            "docker",
            "exec",
            "-i",
            "-e",
            f"RESTORE_RUNTIME_PASSWORD={password}",
            container,
            "psql",
            "-X",
            "-q",
            "-U",
            "restore_admin",
            "-d",
            "infraege",
            "-v",
            "ON_ERROR_STOP=1",
        ],
        input=sql.ACTIVATE_RUNTIME,
        text=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
        timeout=TIMEOUT,
    )
    # The production application command verifies restored behavior; no test runner in Docker.
    subprocess.run(
        [
            "docker",
            "run",
            "--rm",
            "--read-only",
            "--cap-drop",
            "ALL",
            "--security-opt",
            "no-new-privileges",
            "--network",
            f"container:{container}",
            "--mount",
            f"type=bind,source={bundle}/task-files,target=/task-files,readonly",
            "--env",
            f"DATABASE_URL=postgresql://infraege_runtime:{password}@127.0.0.1:5432/infraege",
            "--entrypoint",
            "/app/.venv/bin/python",
            metadata.verifierId,
            "-m",
            "app.modules.practice.verify",
        ],
        check=True,
        timeout=TIMEOUT,
    )
