#!/usr/bin/env python3
"""List, plan, or run explicit repository verification command groups."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from lib.gate.core import EXIT_NEEDS_REVIEW, GROUPS, GateError, public, run, select


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    result.add_argument("action", choices=("checks", "plan", "run"))
    result.add_argument("--group", action="append", default=[], metavar="NAME")
    return result


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    try:
        if args.action == "checks":
            print(json.dumps(public(GROUPS.values()), indent=2, sort_keys=True))
            return 0
        groups = select(args.group)
        if args.action == "plan":
            print(json.dumps(public(groups), indent=2, sort_keys=True))
            return 0
        return run(Path(__file__).resolve().parents[1], groups)
    except GateError as exc:
        print(f"gate: {exc}", file=sys.stderr)
        return EXIT_NEEDS_REVIEW


if __name__ == "__main__":
    raise SystemExit(main())
