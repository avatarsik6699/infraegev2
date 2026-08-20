"""Disposable filesystem transaction used to rehearse operations-data cutover and rollback."""

from __future__ import annotations

import fcntl
import hashlib
import json
import os
import pathlib
import shutil
import tempfile
from typing import Any

FAILURE_CODES = {
    "injected_failure",
    "local_io_error",
    "source_changed",
    "staged_hash_mismatch",
}


class RehearsalError(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def _canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _atomic_write_json(path: pathlib.Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary: pathlib.Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=path.parent, prefix=f".{path.name}.", delete=False
        ) as handle:
            temporary = pathlib.Path(handle.name)
            handle.write(_canonical_json(value) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def _atomic_write_bytes(path: pathlib.Path, value: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary: pathlib.Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=path.parent, prefix=f".{path.name}.", delete=False
        ) as handle:
            temporary = pathlib.Path(handle.name)
            handle.write(value)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def _sha256_file(path: pathlib.Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _resolve_artifacts(
    manifest_path: pathlib.Path, source: dict[str, Any]
) -> list[tuple[dict[str, Any], pathlib.Path]]:
    base = manifest_path.resolve().parent
    resolved: list[tuple[dict[str, Any], pathlib.Path]] = []
    for artifact in source["artifacts"]:
        relative = pathlib.PurePosixPath(artifact["path"])
        if relative.is_absolute() or ".." in relative.parts:
            raise RehearsalError("unsafe_source", "migration source path is unsafe")
        path = base.joinpath(*relative.parts)
        if path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(base):
            raise RehearsalError("unsafe_source", "migration source artifact is missing or unsafe")
        if _sha256_file(path) != artifact["sha256"]:
            raise RehearsalError("source_hash_mismatch", "migration source artifact hash mismatch")
        resolved.append((artifact, path))
    return resolved


def _prepare_sandbox(requested_root: pathlib.Path) -> pathlib.Path:
    root = requested_root.resolve()
    marker = root / ".infraege-ops-migration-sandbox"
    if root.exists():
        if not root.is_dir():
            raise RehearsalError("invalid_sandbox", "migration sandbox must be a directory")
        if any(root.iterdir()) and not marker.is_file():
            raise RehearsalError(
                "invalid_sandbox", "non-empty migration sandbox requires its exact marker"
            )
    else:
        root.mkdir(parents=True)
    marker_value = b"infraege-ops-migration-sandbox-v1\n"
    if marker.exists() and marker.read_bytes() != marker_value:
        raise RehearsalError("invalid_sandbox", "migration sandbox marker is invalid")
    if not marker.exists():
        _atomic_write_bytes(marker, marker_value)
    return root


def _result(
    source: dict[str, Any],
    completed_at: str,
    phases: list[dict[str, str]],
    failure: RehearsalError | None,
) -> dict[str, Any]:
    result = {
        "schema_version": 1,
        "installation_id": source["installation_id"],
        "bundle_id": source["bundle_id"],
        "completed_at": completed_at,
        "status": "failed" if failure else "rehearsed",
        "production_mutated": False,
        "authorized_to_cutover": False,
        "rolled_back": True,
        "source_owner": source["source_owner"],
        "final_owner": source["source_owner"],
        "phases": phases,
    }
    if failure:
        result["failure_code"] = failure.code
    return result


def rehearse_migration(
    source_path: pathlib.Path,
    source: dict[str, Any],
    root: pathlib.Path,
    completed_at: str,
) -> dict[str, Any]:
    artifacts = _resolve_artifacts(source_path, source)
    source_hashes = {artifact["id"]: _sha256_file(path) for artifact, path in artifacts}
    root = _prepare_sandbox(root)
    with (root / "migration.lock").open("a+", encoding="utf-8") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise RehearsalError("lock_held", "another migration rehearsal is in progress") from exc

        phases: list[dict[str, str]] = []
        staged = root / "staged-next-owner"
        state_path = root / "migration-state.json"
        _atomic_write_json(
            root / "migration-checkpoint.json",
            {
                "schema_version": 1,
                "installation_id": source["installation_id"],
                "bundle_id": source["bundle_id"],
                "owner": source["source_owner"],
                "artifact_hashes": source_hashes,
            },
        )
        phases.append({"id": "checkpoint", "status": "pass"})
        failure: RehearsalError | None = None
        try:
            if staged.exists():
                shutil.rmtree(staged)
            staged.mkdir()
            for artifact, path in artifacts:
                shutil.copyfile(path, staged / artifact["id"])
            phases.append({"id": "stage", "status": "pass"})
            if os.environ.get("INFRAEGE_OPS_TEST_REHEARSAL_FAIL_AFTER") == "stage":
                raise RehearsalError("injected_failure", "rehearsal failed after stage")
            for artifact, _path in artifacts:
                if _sha256_file(staged / artifact["id"]) != artifact["sha256"]:
                    raise RehearsalError("staged_hash_mismatch", "staged artifact hash mismatch")
            phases.append({"id": "verify", "status": "pass"})
            _atomic_write_json(
                state_path,
                {
                    "schema_version": 1,
                    "owner": "infraege-ops",
                    "bundle_id": source["bundle_id"],
                },
            )
            phases.append({"id": "modeled-cutover", "status": "pass"})
            if os.environ.get("INFRAEGE_OPS_TEST_REHEARSAL_FAIL_AFTER") == "cutover":
                raise RehearsalError("injected_failure", "rehearsal failed after cutover")
        except (RehearsalError, OSError) as exc:
            failure = (
                exc
                if isinstance(exc, RehearsalError)
                else RehearsalError("local_io_error", "rehearsal local state failed")
            )
        finally:
            if staged.exists():
                shutil.rmtree(staged)
            _atomic_write_json(
                state_path,
                {
                    "schema_version": 1,
                    "owner": source["source_owner"],
                    "bundle_id": source["bundle_id"],
                },
            )
            phases.append({"id": "rollback", "status": "pass"})

        if any(_sha256_file(path) != source_hashes[artifact["id"]] for artifact, path in artifacts):
            failure = RehearsalError("source_changed", "rehearsal changed source artifacts")
        result = _result(source, completed_at, phases, failure)
        _atomic_write_json(root / "migration-rehearsal.json", result)
        if failure:
            raise failure
        return result
