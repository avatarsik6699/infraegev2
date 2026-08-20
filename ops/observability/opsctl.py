#!/usr/bin/env python3
"""Operations inventory, planning and sandbox reconciliation for infraegev2."""

from __future__ import annotations

import argparse
import datetime as dt
import fcntl
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
from typing import Any

from ops.observability.migration_rehearsal import FAILURE_CODES as MIGRATION_FAILURE_CODES
from ops.observability.migration_rehearsal import RehearsalError, rehearse_migration

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_DESIRED = ROOT / "ops/observability/desired-state.json"
REMOTE_COLLECTOR = ROOT / "ops/observability/remote-inventory.sh"
REMOTE_PREFLIGHT = ROOT / "ops/observability/remote-preflight.sh"
REMOTE_SNAPSHOT_CANDIDATE = ROOT / "ops/observability/remote-snapshot-candidate.sh"
SSH_WRAPPER = ROOT / "scripts/production-root-ssh.sh"
SUPPORTED_SCHEMA_VERSION = 1
POSTGRES_FIDELITY_IMAGE = (
    "postgres:16-alpine@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777"
)
BESZEL_FIDELITY_IMAGE = (
    "henrygd/beszel:0.18.7@sha256:a849ad80814b6a1a3be665304dcace5d4854b3bed7bde4dd1227e8ce1b82d477"
)
FORBIDDEN_KEY = re.compile(r"(?:secret|password|token|credential|private_key|environment)", re.I)
CONTRACT_KINDS = {
    "apply-result",
    "checkpoint",
    "data-fidelity-result",
    "desired-state",
    "inventory",
    "migration-rehearsal",
    "migration-source",
    "outbox",
    "plan",
    "preflight",
    "revision",
    "snapshot-candidate",
    "status",
}


class ContractError(ValueError):
    pass


class ApplyError(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def load_json(path: pathlib.Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ContractError(f"cannot read JSON contract: {path}") from exc
    if not isinstance(value, dict):
        raise ContractError("contract root must be an object")
    return value


def assert_secret_free(value: Any, location: str = "$") -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if FORBIDDEN_KEY.search(str(key)):
                raise ContractError(f"secret-bearing field is forbidden at {location}.{key}")
            assert_secret_free(child, f"{location}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            assert_secret_free(child, f"{location}[{index}]")


def require_fields(value: dict[str, Any], fields: set[str], kind: str) -> None:
    missing = sorted(fields - value.keys())
    if missing:
        raise ContractError(f"{kind} missing fields: {', '.join(missing)}")


def validate_contract(kind: str, value: dict[str, Any]) -> None:
    if kind not in CONTRACT_KINDS:
        raise ContractError(f"unknown contract kind: {kind}")
    if value.get("schema_version") != SUPPORTED_SCHEMA_VERSION:
        raise ContractError(f"unsupported {kind} schema_version")
    assert_secret_free(value)
    common: dict[str, set[str]] = {
        "desired-state": {
            "schema_version",
            "installation_id",
            "ownership",
            "components",
            "private_endpoints",
        },
        "data-fidelity-result": {
            "schema_version",
            "status",
            "production_data_used",
            "authorized_to_cutover",
            "images",
            "postgres",
            "beszel",
            "cleanup",
        },
        "inventory": {
            "schema_version",
            "installation_id",
            "observed_at",
            "reachable",
            "components",
        },
        "migration-source": {
            "schema_version",
            "installation_id",
            "bundle_id",
            "source_owner",
            "artifacts",
        },
        "migration-rehearsal": {
            "schema_version",
            "installation_id",
            "bundle_id",
            "completed_at",
            "status",
            "production_mutated",
            "authorized_to_cutover",
            "rolled_back",
            "source_owner",
            "final_owner",
            "phases",
        },
        "plan": {
            "schema_version",
            "installation_id",
            "plan_id",
            "generated_at",
            "mutating",
            "summary",
            "changes",
        },
        "preflight": {
            "schema_version",
            "installation_id",
            "bundle_id",
            "observed_at",
            "reachable",
            "ready_for_migration_planning",
            "authorized_to_apply",
            "summary",
            "checks",
        },
        "snapshot-candidate": {
            "schema_version",
            "installation_id",
            "observed_at",
            "reachable",
            "eligible",
            "production_mutated",
            "data_transferred",
            "authorized_to_restore",
            "authorized_to_cutover",
            "snapshot",
            "artifacts",
        },
        "status": {
            "schema_version",
            "installation_id",
            "observed_at",
            "healthy",
            "summary",
            "components",
        },
        "checkpoint": {"schema_version", "installation_id", "revision", "created_at", "components"},
        "outbox": {
            "schema_version",
            "installation_id",
            "event_id",
            "created_at",
            "event_type",
            "payload",
        },
        "revision": {
            "schema_version",
            "installation_id",
            "plan_id",
            "applied_at",
            "status",
        },
        "apply-result": {
            "schema_version",
            "installation_id",
            "plan_id",
            "completed_at",
            "status",
            "effects_applied",
            "rolled_back",
        },
    }
    require_fields(value, common[kind], kind)
    if kind in {"desired-state", "inventory", "status", "checkpoint"} and not isinstance(
        value["components"], list
    ):
        raise ContractError(f"{kind}.components must be an array")
    if kind == "plan":
        if value["mutating"] is not False or not isinstance(value["changes"], list):
            raise ContractError("plan must be non-mutating and changes must be an array")
        allowed = {"create", "change", "no-op", "destructive", "blocked"}
        if any(change.get("effect") not in allowed for change in value["changes"]):
            raise ContractError("plan contains an unknown effect")
        if not re.fullmatch(r"[a-f0-9]{64}", str(value["plan_id"])):
            raise ContractError("plan_id must be a lowercase SHA-256 digest")
    if kind == "preflight":
        if value["authorized_to_apply"] is not False or not isinstance(value["checks"], list):
            raise ContractError("preflight cannot authorize apply and checks must be an array")
        if not re.fullmatch(r"[a-f0-9]{64}", str(value["bundle_id"])):
            raise ContractError("preflight bundle_id must be a lowercase SHA-256 digest")
        allowed_special = {
            "remote-access": {"ssh-unreachable"},
            "remote-protocol": {"invalid-response"},
        }
        seen_checks: set[str] = set()
        for item in value["checks"]:
            if not isinstance(item, dict) or set(item) != {"id", "status", "code"}:
                raise ContractError("preflight check has an invalid shape")
            check_id = item["id"]
            allowed_codes = PREFLIGHT_CODES.get(check_id, allowed_special.get(check_id))
            if (
                check_id in seen_checks
                or item["status"] not in {"pass", "warning", "blocker"}
                or allowed_codes is None
                or item["code"] not in allowed_codes
            ):
                raise ContractError("preflight contains an unknown check, status or code")
            seen_checks.add(check_id)
        counts = {
            status: sum(item["status"] == status for item in value["checks"])
            for status in ("pass", "warning", "blocker")
        }
        if value["summary"] != counts:
            raise ContractError("preflight summary does not match checks")
        ready = value["reachable"] is True and counts["blocker"] == 0
        if value["ready_for_migration_planning"] is not ready:
            raise ContractError("preflight readiness does not match checks")
    if kind == "snapshot-candidate":
        if any(
            value[field] is not False
            for field in (
                "production_mutated",
                "data_transferred",
                "authorized_to_restore",
                "authorized_to_cutover",
            )
        ):
            raise ContractError("snapshot-candidate safety invariants are invalid")
        if not isinstance(value["artifacts"], list):
            raise ContractError("snapshot-candidate artifacts must be an array")
        if value["eligible"] is True:
            snapshot = value["snapshot"]
            if value["reachable"] is not True or not isinstance(snapshot, dict):
                raise ContractError("eligible snapshot-candidate must be reachable")
            if set(snapshot) != {"id", "time"} or not re.fullmatch(
                r"[a-f0-9]{64}", str(snapshot["id"])
            ):
                raise ContractError("snapshot-candidate identity is invalid")
            expected = {"umami-dump": "file", "beszel-data": "directory"}
            if len(value["artifacts"]) != 2 or "error" in value:
                raise ContractError("eligible snapshot-candidate evidence is incomplete")
            parents: set[str] = set()
            seen: set[str] = set()
            for artifact in value["artifacts"]:
                if not isinstance(artifact, dict) or set(artifact) != {"id", "kind", "path"}:
                    raise ContractError("snapshot-candidate artifact shape is invalid")
                artifact_id = str(artifact["id"])
                if artifact_id in seen or artifact.get("kind") != expected.get(artifact_id):
                    raise ContractError("snapshot-candidate artifact identity is invalid")
                suffix = "umami.dump" if artifact_id == "umami-dump" else "beszel-data"
                match = re.fullmatch(
                    rf"(/var/backups/infraege/work\.[A-Za-z0-9]+)/{re.escape(suffix)}",
                    str(artifact["path"]),
                )
                if match is None:
                    raise ContractError("snapshot-candidate artifact path is unsafe")
                parents.add(match.group(1))
                seen.add(artifact_id)
            if seen != set(expected) or len(parents) != 1:
                raise ContractError("snapshot-candidate artifacts do not share one backup root")
        elif (
            value["eligible"] is not False
            or value["snapshot"] is not None
            or value["artifacts"] != []
            or value.get("error", {}).get("code") not in {"ssh_unreachable", "invalid_response"}
        ):
            raise ContractError("blocked snapshot-candidate shape is invalid")
    if kind == "migration-source":
        if not re.fullmatch(r"[a-f0-9]{64}", str(value["bundle_id"])):
            raise ContractError("migration-source bundle_id must be a lowercase SHA-256 digest")
        artifacts = value["artifacts"]
        if not isinstance(artifacts, list) or not artifacts:
            raise ContractError("migration-source artifacts must be a non-empty array")
        ids: list[str] = []
        for artifact in artifacts:
            if not isinstance(artifact, dict):
                raise ContractError("migration-source artifact must be an object")
            require_fields(artifact, {"id", "path", "sha256"}, "migration-source artifact")
            if set(artifact) != {"id", "path", "sha256"} or not isinstance(artifact["path"], str):
                raise ContractError("migration-source artifact shape is invalid")
            if not re.fullmatch(r"[a-z0-9-]+", str(artifact["id"])):
                raise ContractError("migration-source artifact id is invalid")
            if not re.fullmatch(r"[a-f0-9]{64}", str(artifact["sha256"])):
                raise ContractError("migration-source artifact hash is invalid")
            ids.append(str(artifact["id"]))
        if len(ids) != len(set(ids)):
            raise ContractError("migration-source artifact ids must be unique")
        if value["source_owner"] != "infraege application Compose":
            raise ContractError("migration-source owner is invalid")
    if kind == "migration-rehearsal":
        if not re.fullmatch(r"[a-f0-9]{64}", str(value["bundle_id"])):
            raise ContractError("migration-rehearsal bundle_id is invalid")
        if value["status"] not in {"rehearsed", "failed"}:
            raise ContractError("migration-rehearsal status is invalid")
        if (
            value["production_mutated"] is not False
            or value["authorized_to_cutover"] is not False
            or value["rolled_back"] is not True
        ):
            raise ContractError("migration-rehearsal safety invariants are invalid")
        if value["final_owner"] != value["source_owner"]:
            raise ContractError("migration-rehearsal must finish at the source owner")
        if value["status"] == "failed":
            if value.get("failure_code") not in MIGRATION_FAILURE_CODES:
                raise ContractError("migration-rehearsal failure code is invalid")
        elif "failure_code" in value:
            raise ContractError("successful migration-rehearsal cannot have a failure code")
        phases = value["phases"]
        if not isinstance(phases, list) or not phases:
            raise ContractError("migration-rehearsal phases must be a non-empty array")
        if any(
            not isinstance(phase, dict)
            or set(phase) != {"id", "status"}
            or phase["status"] != "pass"
            for phase in phases
        ):
            raise ContractError("migration-rehearsal phase is invalid")
        phase_ids = [phase["id"] for phase in phases]
        ordered = ["checkpoint", "stage", "verify", "modeled-cutover", "rollback"]
        if (
            phase_ids[0] != "checkpoint"
            or phase_ids[-1] != "rollback"
            or len(phase_ids) != len(set(phase_ids))
            or any(phase_id not in ordered for phase_id in phase_ids)
            or phase_ids != sorted(phase_ids, key=ordered.index)
        ):
            raise ContractError("migration-rehearsal phase order is invalid")
        if value["status"] == "rehearsed" and phase_ids != ordered:
            raise ContractError("successful migration-rehearsal omitted a phase")
    if kind == "revision" and value["status"] != "applied":
        raise ContractError("revision status must be applied")
    if kind == "apply-result" and value["status"] not in {"applied", "failed", "no-op"}:
        raise ContractError("apply-result contains an unknown status")
    if kind == "desired-state":
        ids = [component.get("id") for component in value["components"]]
        if any(not item for item in ids) or len(ids) != len(set(ids)):
            raise ContractError("desired-state component ids must be non-empty and unique")
        if any(endpoint.get("public") is not False for endpoint in value["private_endpoints"]):
            raise ContractError("desired-state endpoints must be private")
    if kind == "data-fidelity-result":
        if (
            value["status"] != "passed"
            or value["production_data_used"] is not False
            or value["authorized_to_cutover"] is not False
        ):
            raise ContractError("data-fidelity-result safety invariants are invalid")
        expected_images = {
            "postgres": POSTGRES_FIDELITY_IMAGE,
            "beszel": BESZEL_FIDELITY_IMAGE,
        }
        expected_postgres = {
            "status": "passed",
            "row_count": 3,
            "event_total": 10,
            "sequence_preserved": True,
            "ownership_preserved": True,
        }
        expected_beszel = {
            "status": "passed",
            "source_healthy": True,
            "target_healthy": True,
            "identity_preserved": True,
            "state_files_present": True,
        }
        expected_cleanup = {
            "containers_removed": True,
            "volumes_removed": True,
            "workspace_removed": True,
        }
        if (
            value["images"] != expected_images
            or value["postgres"] != expected_postgres
            or value["beszel"] != expected_beszel
            or value["cleanup"] != expected_cleanup
        ):
            raise ContractError("data-fidelity-result evidence is incomplete")


def utc_now() -> str:
    override = os.environ.get("INFRAEGE_OPS_NOW")
    if override:
        return override
    return dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def atomic_write_json(path: pathlib.Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    assert_secret_free(value)
    temporary: pathlib.Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=path.parent, prefix=f".{path.name}.", delete=False
        ) as handle:
            temporary = pathlib.Path(handle.name)
            handle.write(canonical_json(value) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def atomic_write_bytes(path: pathlib.Path, value: bytes) -> None:
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


def plan_id_for(
    desired: dict[str, Any], inventory: dict[str, Any], changes: list[dict[str, Any]]
) -> str:
    bound_inventory = {
        "schema_version": inventory["schema_version"],
        "installation_id": inventory["installation_id"],
        "reachable": inventory["reachable"],
        "components": inventory["components"],
    }
    payload = {"desired": desired, "inventory": bound_inventory, "changes": changes}
    return hashlib.sha256(canonical_json(payload).encode()).hexdigest()


def desired_state(path: pathlib.Path) -> dict[str, Any]:
    value = load_json(path)
    validate_contract("desired-state", value)
    return value


def unreachable_inventory(desired: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "observed_at": utc_now(),
        "reachable": False,
        "components": [],
        "error": {"code": "ssh_unreachable", "message": "production inventory is unavailable"},
    }


def inventory_from_tsv(desired: dict[str, Any], raw: str) -> dict[str, Any]:
    components: list[dict[str, Any]] = []
    allowed_ids = {component["id"] for component in desired["components"]}
    for line in raw.splitlines():
        parts = line.split("\t")
        if len(parts) != 4 or parts[0] not in allowed_ids:
            raise ContractError("remote inventory returned an invalid sanitized record")
        component_id, kind, state, revision = parts
        item: dict[str, Any] = {"id": component_id, "kind": kind, "state": state}
        if revision:
            item["revision"] = revision
        components.append(item)
    result = {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "observed_at": utc_now(),
        "reachable": True,
        "components": sorted(components, key=lambda item: item["id"]),
    }
    validate_contract("inventory", result)
    return result


def collect_inventory(desired: dict[str, Any]) -> dict[str, Any]:
    fixture = os.environ.get("INFRAEGE_OPS_INVENTORY_FILE")
    if fixture:
        value = load_json(pathlib.Path(fixture))
        validate_contract("inventory", value)
        if value["installation_id"] != desired["installation_id"]:
            raise ContractError("inventory installation_id does not match desired state")
        return value
    try:
        completed = subprocess.run(
            [str(SSH_WRAPPER), "bash", "-se"],
            input=REMOTE_COLLECTOR.read_text(encoding="utf-8"),
            text=True,
            capture_output=True,
            check=False,
            timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired):
        return unreachable_inventory(desired)
    if completed.returncode != 0:
        return unreachable_inventory(desired)
    try:
        return inventory_from_tsv(desired, completed.stdout)
    except ContractError:
        return unreachable_inventory(desired)


PREFLIGHT_CODES: dict[str, set[str]] = {
    "docker": {"available", "missing"},
    "compose": {"available", "missing"},
    "systemd": {"available", "missing"},
    "jq": {"available", "missing"},
    "restic": {"available", "missing"},
    "wireguard": {"active", "missing"},
    "application-project": {"owned", "missing"},
    "operations-project": {"absent", "already-running"},
    "target-directory": {"available", "unsafe"},
    "backup-freshness": {"fresh", "stale-or-missing"},
    "restore-proof": {"successful", "missing-or-failed"},
}


def preflight_from_tsv(desired: dict[str, Any], bundle: dict[str, Any], raw: str) -> dict[str, Any]:
    checks: list[dict[str, str]] = []
    seen: set[str] = set()
    for line in raw.splitlines():
        parts = line.split("\t")
        if len(parts) != 3:
            raise ContractError("remote preflight returned an invalid sanitized record")
        check_id, status, code = parts
        if check_id not in PREFLIGHT_CODES or check_id in seen:
            raise ContractError("remote preflight returned an unknown or duplicate check")
        if status not in {"pass", "warning", "blocker"} or code not in PREFLIGHT_CODES[check_id]:
            raise ContractError("remote preflight returned an invalid status or code")
        seen.add(check_id)
        checks.append({"id": check_id, "status": status, "code": code})
    if seen != set(PREFLIGHT_CODES):
        raise ContractError("remote preflight omitted required checks")
    checks.sort(key=lambda item: item["id"])
    counts = {
        status: sum(item["status"] == status for item in checks)
        for status in ("pass", "warning", "blocker")
    }
    result = {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "bundle_id": bundle["bundle_id"],
        "observed_at": utc_now(),
        "reachable": True,
        "ready_for_migration_planning": counts["blocker"] == 0,
        "authorized_to_apply": False,
        "summary": counts,
        "checks": checks,
    }
    validate_contract("preflight", result)
    return result


def collect_preflight(desired: dict[str, Any], bundle: dict[str, Any]) -> dict[str, Any]:
    fixture = os.environ.get("INFRAEGE_OPS_PREFLIGHT_FILE")
    if fixture:
        return preflight_from_tsv(
            desired, bundle, pathlib.Path(fixture).read_text(encoding="utf-8")
        )
    try:
        completed = subprocess.run(
            [str(SSH_WRAPPER), "bash", "-se"],
            input=REMOTE_PREFLIGHT.read_text(encoding="utf-8"),
            text=True,
            capture_output=True,
            check=False,
            timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired):
        completed = None
    if completed is None or completed.returncode != 0:
        result = {
            "schema_version": 1,
            "installation_id": desired["installation_id"],
            "bundle_id": bundle["bundle_id"],
            "observed_at": utc_now(),
            "reachable": False,
            "ready_for_migration_planning": False,
            "authorized_to_apply": False,
            "summary": {"pass": 0, "warning": 0, "blocker": 1},
            "checks": [{"id": "remote-access", "status": "blocker", "code": "ssh-unreachable"}],
        }
        validate_contract("preflight", result)
        return result
    try:
        return preflight_from_tsv(desired, bundle, completed.stdout)
    except ContractError:
        result = {
            "schema_version": 1,
            "installation_id": desired["installation_id"],
            "bundle_id": bundle["bundle_id"],
            "observed_at": utc_now(),
            "reachable": True,
            "ready_for_migration_planning": False,
            "authorized_to_apply": False,
            "summary": {"pass": 0, "warning": 0, "blocker": 1},
            "checks": [{"id": "remote-protocol", "status": "blocker", "code": "invalid-response"}],
        }
        validate_contract("preflight", result)
        return result


def snapshot_candidate_failure(
    desired: dict[str, Any], *, reachable: bool, code: str
) -> dict[str, Any]:
    result = {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "observed_at": utc_now(),
        "reachable": reachable,
        "eligible": False,
        "production_mutated": False,
        "data_transferred": False,
        "authorized_to_restore": False,
        "authorized_to_cutover": False,
        "snapshot": None,
        "artifacts": [],
        "error": {
            "code": code,
            "message": (
                "production snapshot metadata is unavailable"
                if code == "ssh_unreachable"
                else "production snapshot metadata is invalid"
            ),
        },
    }
    validate_contract("snapshot-candidate", result)
    return result


def snapshot_candidate_from_tsv(desired: dict[str, Any], raw: str) -> dict[str, Any]:
    snapshot: dict[str, str] | None = None
    artifacts: list[dict[str, str]] = []
    for line in raw.splitlines():
        parts = line.split("\t")
        if len(parts) == 3 and parts[0] == "snapshot" and snapshot is None:
            snapshot = {"id": parts[1], "time": parts[2]}
        elif len(parts) == 4 and parts[0] == "artifact":
            artifacts.append({"id": parts[1], "kind": parts[2], "path": parts[3]})
        else:
            raise ContractError("remote snapshot candidate returned an invalid sanitized record")
    result = {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "observed_at": utc_now(),
        "reachable": True,
        "eligible": True,
        "production_mutated": False,
        "data_transferred": False,
        "authorized_to_restore": False,
        "authorized_to_cutover": False,
        "snapshot": snapshot,
        "artifacts": sorted(artifacts, key=lambda item: item["id"]),
    }
    validate_contract("snapshot-candidate", result)
    return result


def collect_snapshot_candidate(desired: dict[str, Any]) -> dict[str, Any]:
    fixture = os.environ.get("INFRAEGE_OPS_SNAPSHOT_CANDIDATE_FILE")
    if fixture:
        try:
            raw = pathlib.Path(fixture).read_text(encoding="utf-8")
            return snapshot_candidate_from_tsv(desired, raw)
        except (OSError, ContractError):
            return snapshot_candidate_failure(desired, reachable=True, code="invalid_response")
    try:
        completed = subprocess.run(
            [str(SSH_WRAPPER), "bash", "-se"],
            input=REMOTE_SNAPSHOT_CANDIDATE.read_text(encoding="utf-8"),
            text=True,
            capture_output=True,
            check=False,
            timeout=60,
        )
    except (OSError, subprocess.TimeoutExpired):
        completed = None
    if completed is None:
        return snapshot_candidate_failure(desired, reachable=False, code="ssh_unreachable")
    if completed.returncode != 0:
        try:
            probe = subprocess.run(
                [str(SSH_WRAPPER), "true"],
                text=True,
                capture_output=True,
                check=False,
                timeout=15,
            )
        except (OSError, subprocess.TimeoutExpired):
            probe = None
        if probe is not None and probe.returncode == 0:
            return snapshot_candidate_failure(desired, reachable=True, code="invalid_response")
        return snapshot_candidate_failure(desired, reachable=False, code="ssh_unreachable")
    try:
        return snapshot_candidate_from_tsv(desired, completed.stdout)
    except ContractError:
        return snapshot_candidate_failure(desired, reachable=True, code="invalid_response")


def validate_bundle_manifest(bundle: dict[str, Any], installation_id: str) -> None:
    require_fields(
        bundle,
        {"schema_version", "installation_id", "compose_project", "bundle_id", "assets"},
        "bundle",
    )
    assert_secret_free(bundle)
    if bundle["schema_version"] != 1 or bundle["installation_id"] != installation_id:
        raise ContractError("bundle manifest does not match desired installation")
    if not re.fullmatch(r"[a-f0-9]{64}", str(bundle["bundle_id"])):
        raise ContractError("bundle manifest has invalid bundle_id")
    definition = load_json(ROOT / "ops/observability/bundle-assets.json")
    expected_paths = sorted(definition.get("assets", []))
    assets = bundle["assets"]
    if (
        not isinstance(assets, list)
        or any(not isinstance(item, dict) for item in assets)
        or [item.get("path") for item in assets] != expected_paths
    ):
        raise ContractError("bundle manifest asset inventory does not match this checkout")
    for item in assets:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "size"}:
            raise ContractError("bundle manifest asset has an invalid shape")
        relative = pathlib.PurePosixPath(item["path"])
        if relative.is_absolute() or ".." in relative.parts:
            raise ContractError("bundle manifest asset path is unsafe")
        path = ROOT.joinpath(*relative.parts)
        if path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(ROOT):
            raise ContractError("bundle manifest asset is missing or unsafe")
        content = path.read_bytes()
        digest = hashlib.sha256(content).hexdigest()
        if item["size"] != len(content) or item["sha256"] != digest:
            raise ContractError("bundle manifest asset hash does not match this checkout")
    identity = {
        "schema_version": bundle["schema_version"],
        "installation_id": bundle["installation_id"],
        "compose_project": bundle["compose_project"],
        "assets": bundle["assets"],
    }
    expected = hashlib.sha256(canonical_json(identity).encode()).hexdigest()
    if bundle["bundle_id"] != expected:
        raise ContractError("bundle manifest identity does not match bundle_id")


def build_plan(desired: dict[str, Any], inventory: dict[str, Any]) -> dict[str, Any]:
    changes: list[dict[str, Any]] = []
    wanted = {item["id"]: item for item in desired["components"]}
    actual = {item["id"]: item for item in inventory["components"]}
    if not inventory["reachable"]:
        changes.append({"component_id": "*", "effect": "blocked", "reason": "ssh_unreachable"})
    else:
        for component_id in sorted(wanted):
            expected = wanted[component_id]
            observed = actual.get(component_id)
            if observed is None or observed.get("state") == "missing":
                effect, reason = "create", "component_missing"
            elif observed.get("state") != expected["desired_state"]:
                effect, reason = "change", "state_drift"
            elif expected.get("revision") and observed.get("revision") != expected["revision"]:
                effect, reason = "change", "revision_drift"
            else:
                effect, reason = "no-op", "matches_desired_state"
            changes.append({"component_id": component_id, "effect": effect, "reason": reason})
        for component_id in sorted(actual.keys() - wanted.keys()):
            changes.append(
                {
                    "component_id": component_id,
                    "effect": "destructive",
                    "reason": "unmanaged_component",
                }
            )
    effects = [item["effect"] for item in changes]
    result = {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "plan_id": plan_id_for(desired, inventory, changes),
        "generated_at": utc_now(),
        "mutating": False,
        "summary": {
            effect: effects.count(effect)
            for effect in ("create", "change", "no-op", "destructive", "blocked")
        },
        "changes": changes,
    }
    validate_contract("plan", result)
    return result


def build_status(desired: dict[str, Any], inventory: dict[str, Any]) -> dict[str, Any]:
    plan = build_plan(desired, inventory)
    components = [
        {
            "component_id": change["component_id"],
            "status": "healthy" if change["effect"] == "no-op" else change["effect"],
            "reason": change["reason"],
        }
        for change in plan["changes"]
    ]
    healthy = inventory["reachable"] and all(item["status"] == "healthy" for item in components)
    result = {
        "schema_version": 1,
        "installation_id": desired["installation_id"],
        "observed_at": inventory["observed_at"],
        "healthy": healthy,
        "summary": plan["summary"],
        "components": components,
    }
    validate_contract("status", result)
    return result


class SandboxExecutor:
    def __init__(self, root: pathlib.Path, components: list[dict[str, Any]]) -> None:
        self.root = root.resolve()
        self.components_path = self.root / "components.json"
        self._initial_exists = self.components_path.exists()
        self._initial_bytes = self.components_path.read_bytes() if self._initial_exists else None
        if self._initial_exists:
            current = load_json(self.components_path)
            raw_components = current.get("components")
            if not isinstance(raw_components, list):
                raise ApplyError("invalid_sandbox_state", "sandbox components state is invalid")
            self.components = {item["id"]: item for item in raw_components}
        else:
            self.components = {item["id"]: dict(item) for item in components}

    def apply(self, change: dict[str, Any], desired: dict[str, Any]) -> None:
        component_id = change["component_id"]
        effect = change["effect"]
        if effect == "no-op":
            return
        if effect == "destructive":
            self.components.pop(component_id, None)
            self.publish()
            return
        expected = next(item for item in desired["components"] if item["id"] == component_id)
        component = {
            "id": component_id,
            "kind": expected["kind"],
            "state": expected["desired_state"],
        }
        if expected.get("revision"):
            component["revision"] = expected["revision"]
        self.components[component_id] = component
        self.publish()

    def publish(self) -> None:
        atomic_write_json(
            self.components_path,
            {
                "schema_version": 1,
                "components": sorted(self.components.values(), key=lambda item: item["id"]),
            },
        )

    def rollback(self) -> None:
        if self._initial_exists and self._initial_bytes is not None:
            atomic_write_bytes(self.components_path, self._initial_bytes)
        elif self.components_path.exists():
            self.components_path.unlink()


def validate_saved_plan(
    desired: dict[str, Any], inventory: dict[str, Any], saved_plan: dict[str, Any]
) -> dict[str, Any]:
    validate_contract("plan", saved_plan)
    current = build_plan(desired, inventory)
    stable_fields = (
        "schema_version",
        "installation_id",
        "plan_id",
        "mutating",
        "summary",
        "changes",
    )
    if any(saved_plan.get(field) != current.get(field) for field in stable_fields):
        raise ApplyError("stale_plan", "saved plan does not match desired state and inventory")
    if current["summary"]["blocked"]:
        raise ApplyError("blocked_plan", "blocked plan cannot be applied")
    return current


def apply_result(
    installation_id: str,
    plan_id: str,
    status: str,
    effects_applied: int,
    rolled_back: bool,
) -> dict[str, Any]:
    result = {
        "schema_version": 1,
        "installation_id": installation_id,
        "plan_id": plan_id,
        "completed_at": utc_now(),
        "status": status,
        "effects_applied": effects_applied,
        "rolled_back": rolled_back,
    }
    validate_contract("apply-result", result)
    return result


def write_outbox(root: pathlib.Path, result: dict[str, Any]) -> None:
    record = {
        "schema_version": 1,
        "installation_id": result["installation_id"],
        "event_id": f"{result['plan_id']}-{result['status']}",
        "created_at": result["completed_at"],
        "event_type": f"ops.apply.{result['status']}",
        "payload": {
            "plan_id": result["plan_id"],
            "status": result["status"],
            "effects_applied": result["effects_applied"],
            "rolled_back": result["rolled_back"],
        },
    }
    validate_contract("outbox", record)
    atomic_write_json(root / "outbox" / f"{record['event_id']}.json", record)


def prepare_sandbox_root(requested_root: pathlib.Path) -> pathlib.Path:
    root = requested_root.resolve()
    marker = root / ".infraege-ops-sandbox"
    if root.exists():
        if not root.is_dir():
            raise ApplyError("invalid_sandbox_root", "sandbox root must be a directory")
        entries = list(root.iterdir())
        if entries and not marker.is_file():
            raise ApplyError(
                "invalid_sandbox_root", "existing non-empty sandbox root requires its marker"
            )
    else:
        root.mkdir(parents=True)
    if marker.exists() and marker.read_text(encoding="utf-8") != "infraege-ops-sandbox-v1\n":
        raise ApplyError("invalid_sandbox_root", "sandbox marker is invalid")
    if not marker.exists():
        atomic_write_bytes(marker, b"infraege-ops-sandbox-v1\n")
    return root


def reconcile_sandbox(
    desired: dict[str, Any],
    inventory: dict[str, Any],
    plan: dict[str, Any],
    root: pathlib.Path,
    allow_destructive: bool,
) -> dict[str, Any]:
    if plan["summary"]["destructive"] and not allow_destructive:
        raise ApplyError("destructive_plan", "destructive plan requires explicit approval")
    root = prepare_sandbox_root(root)
    lock_path = root / "ops.lock"
    with lock_path.open("a+", encoding="utf-8") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise ApplyError("lock_held", "another sandbox apply is in progress") from exc
        revision_path = root / "revision.json"
        revision_existed = revision_path.exists()
        previous_revision_bytes = revision_path.read_bytes() if revision_existed else None
        if revision_path.exists():
            revision = load_json(revision_path)
            validate_contract("revision", revision)
            if revision["plan_id"] == plan["plan_id"] and revision["status"] == "applied":
                return apply_result(desired["installation_id"], plan["plan_id"], "no-op", 0, False)
        executor = SandboxExecutor(root, inventory["components"])
        previous_revision = load_json(revision_path) if revision_path.exists() else None
        checkpoint = {
            "schema_version": 1,
            "installation_id": desired["installation_id"],
            "revision": previous_revision["plan_id"] if previous_revision else "none",
            "created_at": utc_now(),
            "components": sorted(executor.components.values(), key=lambda item: item["id"]),
            "plan_id": plan["plan_id"],
        }
        validate_contract("checkpoint", checkpoint)
        atomic_write_json(root / "checkpoints" / f"{plan['plan_id']}.json", checkpoint)
        effects_applied = 0
        fail_after_raw = os.environ.get("INFRAEGE_OPS_TEST_FAIL_AFTER")
        fail_after = int(fail_after_raw) if fail_after_raw else None
        try:
            for change in plan["changes"]:
                if change["effect"] == "no-op":
                    continue
                executor.apply(change, desired)
                effects_applied += 1
                if fail_after is not None and effects_applied >= fail_after:
                    raise ApplyError("effect_failed", "sandbox effect failed")
            executor.publish()
            revision = {
                "schema_version": 1,
                "installation_id": desired["installation_id"],
                "plan_id": plan["plan_id"],
                "applied_at": utc_now(),
                "status": "applied",
            }
            validate_contract("revision", revision)
            atomic_write_json(revision_path, revision)
            result = apply_result(
                desired["installation_id"], plan["plan_id"], "applied", effects_applied, False
            )
            write_outbox(root, result)
            return result
        except (ApplyError, OSError, ValueError):
            executor.rollback()
            if revision_existed and previous_revision_bytes is not None:
                atomic_write_bytes(revision_path, previous_revision_bytes)
            elif revision_path.exists():
                revision_path.unlink()
            result = apply_result(
                desired["installation_id"], plan["plan_id"], "failed", effects_applied, True
            )
            write_outbox(root, result)
            raise ApplyError("effect_failed", "sandbox apply failed and was rolled back") from None


def emit(value: dict[str, Any], as_json: bool, command: str) -> None:
    if as_json:
        print(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
        return
    print(f"{command}: {value['installation_id']}")
    if command == "inventory":
        print(f"reachable: {'yes' if value['reachable'] else 'no'}")
        for item in value["components"]:
            print(f"  {item['id']}: {item['state']}")
    elif command == "status":
        print(f"healthy: {'yes' if value['healthy'] else 'no'}")
        for item in value["components"]:
            print(f"  {item['component_id']}: {item['status']} ({item['reason']})")
    elif command == "plan":
        print("mutating: no")
        for item in value["changes"]:
            print(f"  {item['effect']}: {item['component_id']} ({item['reason']})")
    elif command == "preflight":
        ready = "yes" if value["ready_for_migration_planning"] else "no"
        print(f"ready for migration planning: {ready}")
        print("authorized to apply: no")
        for item in value["checks"]:
            print(f"  {item['status']}: {item['id']} ({item['code']})")
    elif command == "rehearse-migration":
        print(f"status: {value['status']}")
        print("production mutated: no")
        print("authorized to cutover: no")
        print("rolled back: yes")
        for item in value["phases"]:
            print(f"  {item['status']}: {item['id']}")
    elif command == "snapshot-candidate":
        print(f"reachable: {'yes' if value['reachable'] else 'no'}")
        print(f"eligible: {'yes' if value['eligible'] else 'no'}")
        print("production mutated: no")
        print("data transferred: no")
        print("authorized to restore: no")
        print("authorized to cutover: no")
        if value["eligible"]:
            print(f"snapshot: {value['snapshot']['id']}")
            for item in value["artifacts"]:
                print(f"  present: {item['id']} ({item['kind']})")
    else:
        print(f"status: {value['status']}")
        print(f"effects applied: {value['effects_applied']}")
        print(f"rolled back: {'yes' if value['rolled_back'] else 'no'}")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(prog="opsctl", description=__doc__)
    result.add_argument("--desired", type=pathlib.Path, default=DEFAULT_DESIRED)
    subcommands = result.add_subparsers(dest="command", required=True)
    for name in ("inventory", "status", "plan"):
        command = subcommands.add_parser(name)
        command.add_argument("--json", action="store_true")
    preflight = subcommands.add_parser("preflight")
    preflight.add_argument("--bundle-manifest", required=True, type=pathlib.Path)
    preflight.add_argument("--json", action="store_true")
    snapshot_candidate = subcommands.add_parser("snapshot-candidate")
    snapshot_candidate.add_argument("--json", action="store_true")
    rehearsal = subcommands.add_parser("rehearse-migration")
    rehearsal.add_argument("--bundle-manifest", required=True, type=pathlib.Path)
    rehearsal.add_argument("--preflight-report", required=True, type=pathlib.Path)
    rehearsal.add_argument("--source-manifest", required=True, type=pathlib.Path)
    rehearsal.add_argument("--sandbox-root", required=True, type=pathlib.Path)
    rehearsal.add_argument("--json", action="store_true")
    apply = subcommands.add_parser("apply")
    apply.add_argument("--plan-file", required=True, type=pathlib.Path)
    apply.add_argument("--inventory-file", required=True, type=pathlib.Path)
    apply.add_argument("--sandbox-root", required=True, type=pathlib.Path)
    apply.add_argument("--allow-destructive", action="store_true")
    apply.add_argument("--json", action="store_true")
    validate = subcommands.add_parser("validate")
    validate.add_argument("kind", choices=sorted(CONTRACT_KINDS))
    validate.add_argument("path", type=pathlib.Path)
    return result


def main() -> int:
    args = parser().parse_args()
    try:
        if args.command == "validate":
            validate_contract(args.kind, load_json(args.path))
            print(f"{args.kind}: valid")
            return 0
        desired = desired_state(args.desired)
        if args.command == "snapshot-candidate":
            value = collect_snapshot_candidate(desired)
            emit(value, args.json, args.command)
            return 0 if value["eligible"] else 2
        if args.command == "preflight":
            bundle = load_json(args.bundle_manifest)
            validate_bundle_manifest(bundle, desired["installation_id"])
            value = collect_preflight(desired, bundle)
            emit(value, args.json, args.command)
            return 0 if value["ready_for_migration_planning"] else 2
        if args.command == "rehearse-migration":
            bundle = load_json(args.bundle_manifest)
            validate_bundle_manifest(bundle, desired["installation_id"])
            preflight = load_json(args.preflight_report)
            validate_contract("preflight", preflight)
            if (
                preflight["installation_id"] != desired["installation_id"]
                or preflight["bundle_id"] != bundle["bundle_id"]
                or preflight["reachable"] is not True
                or preflight["ready_for_migration_planning"] is not True
            ):
                raise RehearsalError("preflight_not_ready", "ready matching preflight is required")
            source = load_json(args.source_manifest)
            validate_contract("migration-source", source)
            if (
                source["installation_id"] != desired["installation_id"]
                or source["bundle_id"] != bundle["bundle_id"]
            ):
                raise RehearsalError("source_not_bound", "migration source does not match bundle")
            value = rehearse_migration(args.source_manifest, source, args.sandbox_root, utc_now())
            validate_contract("migration-rehearsal", value)
            emit(value, args.json, args.command)
            return 0
        if args.command == "apply":
            inventory = load_json(args.inventory_file)
            validate_contract("inventory", inventory)
            if inventory["installation_id"] != desired["installation_id"]:
                raise ContractError("inventory installation_id does not match desired state")
            plan = validate_saved_plan(desired, inventory, load_json(args.plan_file))
            value = reconcile_sandbox(
                desired, inventory, plan, args.sandbox_root, args.allow_destructive
            )
            emit(value, args.json, args.command)
            return 0
        inventory = collect_inventory(desired)
        if args.command == "inventory":
            value = inventory
        elif args.command == "status":
            value = build_status(desired, inventory)
        else:
            value = build_plan(desired, inventory)
        emit(value, args.json, args.command)
        return 0 if inventory["reachable"] else 2
    except ApplyError as exc:
        print(f"opsctl apply: {exc.code}: {exc}", file=sys.stderr)
        return 2
    except RehearsalError as exc:
        print(f"opsctl rehearse-migration: {exc.code}: {exc}", file=sys.stderr)
        return 2
    except OSError:
        print("opsctl: local_io_error: sandbox state is unavailable", file=sys.stderr)
        return 2
    except (ContractError, ValueError) as exc:
        print(f"opsctl: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
