#!/usr/bin/env python3
"""List, plan, suggest or run explicit repository verification command groups."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from lib.gate.core import (
    EXIT_NEEDS_REVIEW,
    GROUPS,
    GateError,
    changed_paths,
    describe,
    host_python_paths,
    public,
    run,
    select,
    suggest,
)

REPO = Path(__file__).resolve().parents[1]


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    result.add_argument("action", choices=("checks", "plan", "run", "affected", "host-python"))
    result.add_argument("--group", action="append", default=[], metavar="NAME")
    result.add_argument("--keep-going", action="store_true", help="run every group after a failure")
    result.add_argument("--base", default="main", help="affected: compare with this ref")
    result.add_argument("--json", action="store_true", help="affected: machine-readable output")
    return result


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    try:
        if args.action == "checks":
            print(json.dumps(public(GROUPS.values()), indent=2, sort_keys=True))
            return 0
        if args.action == "host-python":
            # Paths relative to apps/api, where Ruff runs with the API environment.
            print(" ".join(f"../../{path}" for path in host_python_paths(REPO)))
            return 0
        if args.action == "affected":
            suggestion = suggest(changed_paths(REPO, args.base))
            if args.json:
                print(json.dumps(suggestion.__dict__, indent=2))
            else:
                print(describe(suggestion))
            return 0
        groups = select(args.group)
        if args.action == "plan":
            print(json.dumps(public(groups), indent=2, sort_keys=True))
            return 0
        return run(REPO, groups, keep_going=args.keep_going)
    except GateError as exc:
        print(f"gate: {exc}", file=sys.stderr)
        return EXIT_NEEDS_REVIEW


if __name__ == "__main__":
    raise SystemExit(main())
