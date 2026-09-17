"""Version-one portable backup contract, including legacy pre-Alembic bundles."""

import hashlib
import json
import os
import re
import shutil
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path

from . import sql
from .postgres import Database, docker

DB_IMAGE = (
    "postgres:18.6-alpine3.24@sha256:"
    "d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2"
)
SCHEMA = "122_01"
TASK_SCHEMAS = {SCHEMA}
BASE_FILES = (
    "application.dump",
    "roles.sql",
    "data-checks.txt",
    "schema.txt",
    "metadata.json",
    "production.env",
)
DIGEST = re.compile(r"[a-f0-9]{64}")
VERIFIER = re.compile(
    r"ghcr.io/avatarsik6699/infraegev2-api:[a-f0-9]{40}|infraege-dev-api|infraege-practice-test-[a-z0-9-]+"
)


def checksum(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def regular(path: Path) -> None:
    if path.is_symlink() or not path.is_file():
        raise ValueError(f"missing or non-regular bundle file: {path.name}")


@dataclass(frozen=True)
class Metadata:
    environment: str
    project: str
    serverVersion: str
    release: str
    sourceImage: str
    createdAt: str
    schemaVersion: str
    assets: str
    verifierImage: str
    verifierId: str
    format: int = 1
    database: str = "infraege"
    restoreImage: str = DB_IMAGE

    @classmethod
    def read(cls, bundle: Path) -> "Metadata":
        value = json.loads((bundle / "metadata.json").read_text())
        if not isinstance(value, dict):
            raise ValueError("invalid backup metadata")
        # Older foundation bundles predate the explicit verifier fields.
        value.setdefault("verifierImage", "none")
        value.setdefault("verifierId", "none")
        try:
            result = cls(**value)
        except TypeError as exc:
            raise ValueError("invalid backup metadata fields") from exc
        if any(not isinstance(v, str) for k, v in asdict(result).items() if k != "format"):
            raise ValueError("invalid metadata types")
        if result.format != 1 or result.database != "infraege" or result.restoreImage != DB_IMAGE:
            raise ValueError("unsupported bundle format/database/image")
        if result.schemaVersion not in {"pre-alembic", *TASK_SCHEMAS}:
            raise ValueError("unsupported bundle schema")
        if result.schemaVersion in TASK_SCHEMAS and (
            result.assets != "task-files"
            or not VERIFIER.fullmatch(result.verifierImage)
            or not re.fullmatch(r"sha256:[a-f0-9]{64}", result.verifierId)
        ):
            raise ValueError("unsupported assets/verifier identity")
        return result


def references(bundle: Path) -> dict[str, int]:
    path = bundle / "file-references.txt"
    regular(path)
    result = {}
    for line in path.read_text().splitlines():
        parts = line.split()
        if len(parts) != 2 or not DIGEST.fullmatch(parts[0]) or not parts[1].isdigit():
            raise ValueError("invalid task file reference")
        digest, size = parts
        if digest in result or int(size) <= 0:
            raise ValueError("duplicate or invalid task file reference")
        result[digest] = int(size)
    return result


def verify_files(directory: Path) -> None:
    if directory.is_symlink() or not directory.is_dir():
        raise ValueError("invalid immutable storage directory")
    for path in directory.iterdir():
        regular(path)
        if not DIGEST.fullmatch(path.name) or checksum(path) != path.name:
            raise ValueError("corrupt or invalid immutable task object")


def verify_references(bundle: Path) -> None:
    for digest, size in references(bundle).items():
        path = bundle / "task-files" / digest
        regular(path)
        if path.stat().st_size != size:
            raise ValueError("referenced task file size mismatch")


def sums(bundle: Path, schema: str) -> str:
    names = BASE_FILES + (("file-references.txt",) if schema in TASK_SCHEMAS else ())
    for name in names:
        regular(bundle / name)
    return "".join(f"{checksum(bundle / name)}  {name}\n" for name in names)


def validate(bundle: Path) -> Metadata:
    if bundle.is_symlink() or not bundle.is_dir():
        raise ValueError("invalid bundle directory")
    for name in (*BASE_FILES, "SHA256SUMS"):
        regular(bundle / name)
    metadata = Metadata.read(bundle)
    if sums(bundle, metadata.schemaVersion) != (bundle / "SHA256SUMS").read_text():
        raise ValueError("bundle checksum mismatch")
    if metadata.schemaVersion in TASK_SCHEMAS:
        verify_files(bundle / "task-files")
        verify_references(bundle)
    return metadata


def schema_version(db: Database, snapshot: str | None = None) -> str:
    if (
        db.query("SELECT to_regclass('practice.alembic_version') IS NOT NULL;", snapshot).strip()
        == "t"
    ):
        version = db.query("SELECT version_num FROM practice.alembic_version;", snapshot).strip()
        if version not in TASK_SCHEMAS:
            raise ValueError("unsupported application schema")
        return version
    return "pre-alembic"


def create(db: Database, bundle: Path, env_file: Path, environment: str, project: str) -> None:
    regular(env_file)
    if env_file.stat().st_mode & 0o777 != 0o600:
        raise ValueError("bundle environment requires mode 600")
    bundle.mkdir(mode=0o700)
    with db.snapshot() as snapshot:
        owner = db.query(
            "SELECT pg_get_userbyid(datdba) FROM pg_database WHERE datname=current_database();",
            snapshot,
        )
        if owner.strip() != "infraege" or db.query(sql.UNKNOWN_ROLES, snapshot).strip():
            raise ValueError("unapproved database owner or role dependency")
        version = schema_version(db, snapshot)
        for name, query in (
            ("roles.sql", sql.ROLES),
            ("data-checks.txt", sql.FINGERPRINT),
            ("schema.txt", sql.SCHEMAS),
        ):
            (bundle / name).write_text(db.query(query, snapshot))
        db.dump(bundle / "application.dump", snapshot)
        if version in TASK_SCHEMAS:
            (bundle / "file-references.txt").write_text(db.query(sql.REFERENCES, snapshot))
            files = bundle / "task-files"
            files.mkdir(mode=0o700)
            # Copy only snapshot-referenced immutable objects. Concurrent additions and interrupted
            # staging cannot invalidate this backup; committed objects are never garbage-collected.
            for digest in references(bundle):
                docker("cp", f"{db.container}:/task-files/{digest}", str(files / digest))
            verify_files(files)
            verify_references(bundle)
        server_version = db.query("SHOW server_version_num;", snapshot).strip()
    release = docker(
        "inspect", db.container, "--format", '{{index .Config.Labels "com.infraege.version"}}'
    )
    if not release:
        release = docker("exec", db.container, "sh", "-ec", 'printf "%s" "${DEPLOY_SHA:-unknown}"')
    if environment == "prod" and not re.fullmatch(r"[a-f0-9]{40}", release):
        raise ValueError("unknown production release metadata")
    verifier, verifier_id = "none", "none"
    if version in TASK_SCHEMAS:
        verifier = {
            "prod": f"ghcr.io/avatarsik6699/infraegev2-api:{release}",
            "dev": "infraege-dev-api",
            "test": os.environ.get("PRACTICE_TEST_IMAGE", ""),
        }[environment]
        if not VERIFIER.fullmatch(verifier):
            raise ValueError("explicit supported verifier image required")
        verifier_id = docker("image", "inspect", verifier, "--format", "{{.Id}}")
    metadata = Metadata(
        environment,
        project,
        server_version,
        release,
        docker("inspect", db.container, "--format", "{{.Image}}"),
        datetime.now(UTC).isoformat(),
        version,
        "task-files" if version in TASK_SCHEMAS else "not-yet-introduced",
        verifier,
        verifier_id,
    )
    (bundle / "metadata.json").write_text(json.dumps(asdict(metadata)) + "\n")
    shutil.copyfile(env_file, bundle / "production.env")
    (bundle / "production.env").chmod(0o600)
    (bundle / "SHA256SUMS").write_text(sums(bundle, version))
    validate(bundle)
