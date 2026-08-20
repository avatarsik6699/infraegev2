#!/usr/bin/env python3
"""Read-only operations inventory and reconciliation planning for infraegev2."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import pathlib
import re
import subprocess
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_DESIRED = ROOT / "ops/observability/desired-state.json"
REMOTE_COLLECTOR = ROOT / "ops/observability/remote-inventory.sh"
SSH_WRAPPER = ROOT / "scripts/production-root-ssh.sh"
SUPPORTED_SCHEMA_VERSION = 1
FORBIDDEN_KEY = re.compile(r"(?:secret|password|token|credential|private_key|environment)", re.I)
CONTRACT_KINDS = {"desired-state", "inventory", "plan", "status", "checkpoint", "outbox"}


class ContractError(ValueError):
    pass


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
    else:
        print("mutating: no")
        for item in value["changes"]:
            print(f"  {item['effect']}: {item['component_id']} ({item['reason']})")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(prog="opsctl", description=__doc__)
    result.add_argument("--desired", type=pathlib.Path, default=DEFAULT_DESIRED)
    subcommands = result.add_subparsers(dest="command", required=True)
    for name in ("inventory", "status", "plan"):
        command = subcommands.add_parser(name)
        command.add_argument("--json", action="store_true")
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
        inventory = collect_inventory(desired)
        if args.command == "inventory":
            value = inventory
        elif args.command == "status":
            value = build_status(desired, inventory)
        else:
            value = build_plan(desired, inventory)
        emit(value, args.json, args.command)
        return 0 if inventory["reachable"] else 2
    except ContractError as exc:
        print(f"opsctl: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
