"""Small explicit verification command groups.

This module deliberately does not decide coverage, cache outcomes, or retain
verification evidence. Callers choose the groups they need and record their
own acceptance in the active change.
"""

from __future__ import annotations

import subprocess
from collections.abc import Callable, Iterable
from dataclasses import dataclass
from pathlib import Path

EXIT_NEEDS_REVIEW = 3


class GateError(RuntimeError):
    pass


@dataclass(frozen=True)
class Group:
    name: str
    argv: tuple[str, ...]


# These are plain named command bundles, not an impact or evidence registry.
GROUPS: dict[str, Group] = {
    group.name: group
    for group in (
        Group("format", ("pnpm", "format:check")),
        Group("tooling-lint", ("pnpm", "lint:tooling")),
        Group("web-lint", ("pnpm", "--filter", "web", "lint")),
        Group("web-typecheck", ("pnpm", "--filter", "web", "typecheck")),
        Group("shell-lint", ("pnpm", "lint:shell")),
        Group("api-lint", ("bash", "-lc", "cd apps/api && uv run ruff check app tests migrations")),
        Group(
            "api-typecheck",
            ("bash", "-lc", "cd apps/api && pnpm exec pyright app tests migrations"),
        ),
        Group(
            "host-ruff",
            (
                "bash",
                "-lc",
                "cd apps/api && uv run ruff check ../../scripts/application_db.py "
                "../../scripts/practice-local.py ../../scripts/gate.py "
                "../../scripts/release_checkpoint.py ../../scripts/test-account-server.py "
                "../../scripts/lib/application_db ../../scripts/lib/gate ../../scripts/tests",
            ),
        ),
        Group(
            "host-python", ("pnpm", "exec", "pyright", "--project", "scripts/pyrightconfig.json")
        ),
        Group("web-build-ci", ("pnpm", "--filter", "web", "build")),
        Group(
            "content-static",
            (
                "bash",
                "-lc",
                "node scripts/validate-content-links.mjs && "
                "node scripts/practice-registry.mjs --check",
            ),
        ),
        Group("api-contract", ("pnpm", "api:check")),
        Group("api-tests", ("bash", "-lc", "cd apps/api && uv run pytest")),
        Group("web-unit", ("pnpm", "--filter", "web", "test")),
        Group("e2e", ("pnpm", "--filter", "web", "test:e2e")),
        Group("browser-layout", ("pnpm", "--filter", "web", "test:layout")),
        Group("browser-no-js", ("pnpm", "--filter", "web", "test:browser:no-js")),
        Group("security-secrets", ("bash", "scripts/security-gate.sh", "secrets")),
        Group("security-history", ("bash", "scripts/security-gate.sh", "history")),
        Group("security-sast", ("bash", "scripts/security-gate.sh", "sast")),
        Group("security-config", ("bash", "scripts/security-gate.sh", "config")),
        Group("security-dependencies", ("bash", "scripts/security-gate.sh", "dependencies")),
    )
}


def select(names: Iterable[str]) -> tuple[Group, ...]:
    selected = tuple(names)
    if not selected:
        raise GateError("select at least one --group")
    unknown = sorted(set(selected).difference(GROUPS))
    if unknown:
        raise GateError(f"unknown group(s): {', '.join(unknown)}")
    return tuple(GROUPS[name] for name in selected)


def public(groups: Iterable[Group]) -> dict[str, object]:
    return {"groups": [{"name": group.name, "argv": list(group.argv)} for group in groups]}


Runner = Callable[..., subprocess.CompletedProcess[str]]


def run(repo: Path, groups: Iterable[Group], *, runner: Runner = subprocess.run) -> int:
    """Run chosen groups sequentially, stopping at the first failed command."""
    for group in groups:
        completed = runner(group.argv, cwd=repo, text=True, check=False)
        if completed.returncode:
            return completed.returncode
    return 0
