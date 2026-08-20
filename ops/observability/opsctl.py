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

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_DESIRED = ROOT / "ops/observability/desired-state.json"
REMOTE_COLLECTOR = ROOT / "ops/observability/remote-inventory.sh"
SSH_WRAPPER = ROOT / "scripts/production-root-ssh.sh"
SUPPORTED_SCHEMA_VERSION = 1
FORBIDDEN_KEY = re.compile(r"(?:secret|password|token|credential|private_key|environment)", re.I)
CONTRACT_KINDS = {
    "apply-result",
    "checkpoint",
    "desired-state",
    "inventory",
    "outbox",
    "plan",
    "revision",
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
        "inventory": {
            "schema_version",
            "installation_id",
            "observed_at",
            "reachable",
            "components",
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
    except OSError:
        print("opsctl: local_io_error: sandbox state is unavailable", file=sys.stderr)
        return 2
    except (ContractError, ValueError) as exc:
        print(f"opsctl: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
