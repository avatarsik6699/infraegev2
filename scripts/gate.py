#!/usr/bin/env python3
"""Plan and run repository verification without retaining secrets in the checkout."""

from __future__ import annotations

import argparse
import json
import shlex
import sys
from pathlib import Path

from lib.gate.core import EXIT_NEEDS_REVIEW, GateError, Step, build_plan, execute, find_resume


def focused(raw: list[str]) -> tuple[Step, ...]:
    result: list[Step] = []
    for entry in raw:
        name, separator, command = entry.partition("=")
        if not separator or not name or not command:
            raise GateError("--test must use NAME=COMMAND")
        argv = tuple(shlex.split(command))
        if not argv:
            raise GateError("--test command is empty")
        result.append(Step(f"focused-{name}", argv))
    return tuple(result)


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    result.add_argument("action", choices=("plan", "run", "resume"))
    result.add_argument("--profile", required=True, choices=("critical", "full", "release"))
    result.add_argument("--base", default="")
    result.add_argument("--test", action="append", default=[], metavar="NAME=COMMAND")
    result.add_argument("--prepared-environment", action="store_true")
    result.add_argument("--reviewed-scope", choices=("ops",))
    result.add_argument("--reason")
    return result


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    repo = Path(__file__).resolve().parents[1]
    try:
        plan = build_plan(
            repo,
            args.profile,
            args.base,
            focused(args.test),
            args.prepared_environment,
            args.reviewed_scope,
            args.reason,
        )
        if args.action == "plan":
            print(json.dumps(plan.public(), ensure_ascii=False, indent=2, sort_keys=True))
            return 0 if plan.decision == "ready" else EXIT_NEEDS_REVIEW
        resume = find_resume(repo, plan) if args.action == "resume" else None
        status, report = execute(repo, plan, resume)
        print(json.dumps({"report": str(report), "status": status, "decision": plan.decision}))
        return status
    except GateError as exc:
        print(f"gate: {exc}", file=sys.stderr)
        return EXIT_NEEDS_REVIEW


if __name__ == "__main__":
    raise SystemExit(main())
