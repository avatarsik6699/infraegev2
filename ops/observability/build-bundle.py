#!/usr/bin/env python3
"""Build a deterministic, secret-free manifest for the inactive operations stack."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import sys
import tempfile
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFINITION = ROOT / "ops/observability/bundle-assets.json"
SUPPORTED_SCHEMA_VERSION = 1


class BundleError(ValueError):
    pass


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def load_object(path: pathlib.Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise BundleError(f"cannot read bundle definition: {path}") from exc
    if not isinstance(value, dict):
        raise BundleError("bundle definition must be an object")
    return value


def resolve_asset(relative: str) -> pathlib.Path:
    candidate = pathlib.PurePosixPath(relative)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise BundleError("bundle asset path must stay inside the repository")
    path = ROOT.joinpath(*candidate.parts)
    if path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(ROOT):
        raise BundleError(f"bundle asset is missing or unsafe: {relative}")
    return path


def build_manifest() -> dict[str, Any]:
    definition = load_object(DEFINITION)
    if definition.get("schema_version") != SUPPORTED_SCHEMA_VERSION:
        raise BundleError("unsupported bundle definition schema_version")
    raw_assets = definition.get("assets")
    if not isinstance(raw_assets, list) or not raw_assets:
        raise BundleError("bundle assets must be a non-empty array")
    if any(not isinstance(item, str) or not item for item in raw_assets):
        raise BundleError("bundle asset paths must be non-empty strings")
    if len(raw_assets) != len(set(raw_assets)):
        raise BundleError("bundle asset paths must be unique")
    assets: list[dict[str, Any]] = []
    for relative in sorted(raw_assets):
        content = resolve_asset(relative).read_bytes()
        if b"-----BEGIN PRIVATE KEY-----" in content:
            raise BundleError(f"private key material is forbidden in bundle asset: {relative}")
        assets.append(
            {
                "path": relative,
                "sha256": hashlib.sha256(content).hexdigest(),
                "size": len(content),
            }
        )
    identity = {
        "schema_version": 1,
        "installation_id": definition.get("installation_id"),
        "compose_project": definition.get("compose_project"),
        "assets": assets,
    }
    return {**identity, "bundle_id": hashlib.sha256(canonical_json(identity).encode()).hexdigest()}


def atomic_write(path: pathlib.Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=pathlib.Path)
    parser.add_argument("--check", type=pathlib.Path)
    args = parser.parse_args()
    try:
        manifest = build_manifest()
        if args.check:
            if load_object(args.check) != manifest:
                raise BundleError("bundle manifest drift detected")
            print("operations bundle: no drift")
        elif args.output:
            atomic_write(args.output, manifest)
            print(f"operations bundle: {manifest['bundle_id']}")
        else:
            print(canonical_json(manifest))
        return 0
    except BundleError as exc:
        print(f"operations bundle: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
