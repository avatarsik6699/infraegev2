"""Small explicit verification command groups.

This module does not cache outcomes or retain verification evidence. `affected` only suggests
groups for changed paths; callers still choose what to run and record their own acceptance in
the active change.
"""

from __future__ import annotations

import fnmatch
import json
import os
import shlex
import subprocess
import sys
import time
from collections.abc import Callable, Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import TextIO

EXIT_NEEDS_REVIEW = 3
REPO = Path(__file__).resolve().parents[3]
LOG_DIR = Path(".output/gate")
FAILURE_TAIL_LINES = 40

# Python outside apps/api: Pyright covers scripts/pyrightconfig.json "include"; Ruff covers
# that list plus code that needs Pillow at run time (outside the API environment).
RUFF_ONLY_PYTHON = ("scripts/tests", "scripts/mascot")


class GateError(RuntimeError):
    pass


@dataclass(frozen=True)
class Group:
    name: str
    argv: tuple[str, ...]


def host_python_paths(repo: Path = REPO) -> tuple[str, ...]:
    """Repository-relative host Python paths, from the one Pyright list plus Ruff-only code."""
    config = json.loads((repo / "scripts/pyrightconfig.json").read_text(encoding="utf-8"))
    typed = (os.path.normpath(os.path.join("scripts", entry)) for entry in config["include"])
    candidates = tuple(dict.fromkeys((*typed, *RUFF_ONLY_PYTHON)))
    return tuple(
        path
        for path in candidates
        if not any(path.startswith(f"{parent}/") for parent in candidates)
    )


def _api_shell(command: str, paths: Iterable[str] = ()) -> tuple[str, ...]:
    relative = " ".join(shlex.quote(f"../../{path}") for path in paths)
    return ("bash", "-c", f"cd apps/api && {command} {relative}".rstrip())


def _groups() -> tuple[Group, ...]:
    host = host_python_paths()
    lesson_media = (
        "for topic in content/lesson-design/topic-*; do "
        'python3 -I scripts/lesson_design/export_media.py "$topic" --check || exit 1; done'
    )
    return (
        Group("format", ("pnpm", "format:check")),
        Group(
            "python-format",
            _api_shell("uv run ruff format --check app tests migrations", host),
        ),
        Group("tooling-lint", ("pnpm", "lint:tooling")),
        Group("web-lint", ("pnpm", "--filter", "web", "lint")),
        Group("web-typecheck", ("pnpm", "--filter", "web", "typecheck")),
        Group("shell-lint", ("pnpm", "lint:shell")),
        Group("api-lint", _api_shell("uv run ruff check app tests migrations")),
        Group("api-typecheck", _api_shell("pnpm exec pyright app tests migrations")),
        Group("host-ruff", _api_shell("uv run ruff check", host)),
        Group(
            "host-python",
            ("pnpm", "exec", "pyright", "--project", "scripts/pyrightconfig.json"),
        ),
        Group("docs-links", ("python3", "scripts/check-doc-links.py")),
        Group("content-static", ("node", "scripts/validate-content-links.mjs")),
        Group("lesson-media", ("bash", "-c", lesson_media)),
        Group("infra-config", ("make", "config")),
        Group("api-contract", ("pnpm", "api:check")),
        Group("web-build", ("pnpm", "--filter", "web", "build")),
        # Change 192: paid lesson text only in the gated assets/paid/ chunks
        Group(
            "paid-leak",
            (
                "bash",
                "-c",
                "pnpm --filter web build && node scripts/check-paid-leak.mjs",
            ),
        ),
        Group("api-tests", _api_shell("uv run pytest")),
        Group("web-unit", ("pnpm", "--filter", "web", "test")),
        Group("e2e", ("pnpm", "--filter", "web", "test:e2e")),
        Group("browser-layout", ("pnpm", "--filter", "web", "test:layout")),
        Group("browser-no-js", ("pnpm", "--filter", "web", "test:browser:no-js")),
        Group("security-secrets", ("bash", "scripts/security-gate.sh", "secrets")),
        Group("security-history", ("bash", "scripts/security-gate.sh", "history")),
        Group("security-sast", ("bash", "scripts/security-gate.sh", "sast")),
        Group("security-config", ("bash", "scripts/security-gate.sh", "config")),
        Group(
            "security-dependencies",
            ("bash", "scripts/security-gate.sh", "dependencies"),
        ),
    )


GROUPS: dict[str, Group] = {group.name: group for group in _groups()}


def select(names: Iterable[str]) -> tuple[Group, ...]:
    selected = tuple(dict.fromkeys(names))
    if not selected:
        raise GateError("select at least one --group")
    unknown = sorted(set(selected).difference(GROUPS))
    if unknown:
        raise GateError(f"unknown group(s): {', '.join(unknown)}")
    return tuple(GROUPS[name] for name in selected)


def public(groups: Iterable[Group]) -> dict[str, object]:
    return {"groups": [{"name": group.name, "argv": list(group.argv)} for group in groups]}


Runner = Callable[..., subprocess.CompletedProcess[str]]


def _tail(path: Path, lines: int) -> str:
    text = path.read_text(encoding="utf-8", errors="replace").splitlines()
    return "\n".join(text[-lines:])


def run(
    repo: Path,
    groups: Iterable[Group],
    *,
    runner: Runner = subprocess.run,
    keep_going: bool = False,
    out: TextIO = sys.stdout,
) -> int:
    """Run groups in order with one summary line each; full output goes to a per-group log."""
    log_dir = repo / LOG_DIR
    log_dir.mkdir(parents=True, exist_ok=True)
    env = {**os.environ, "GATE_SUMMARY": "1"}
    status = 0
    for group in groups:
        log = log_dir / f"{group.name}.log"
        started = time.monotonic()
        with log.open("w", encoding="utf-8") as handle:
            try:
                returncode = runner(
                    group.argv,
                    cwd=repo,
                    text=True,
                    check=False,
                    stdout=handle,
                    stderr=subprocess.STDOUT,
                    env=env,
                ).returncode
            except OSError as exc:
                handle.write(f"gate: cannot start {group.argv[0]}: {exc}\n")
                returncode = 127
        seconds = time.monotonic() - started
        result = "FAIL" if returncode else "PASS"
        print(
            f"{group.name:<22} {result}  {seconds:6.1f}s  {LOG_DIR / log.name}",
            file=out,
        )
        if returncode:
            print(_tail(log, FAILURE_TAIL_LINES), file=out)
            status = status or returncode
            if not keep_going:
                break
    return status


@dataclass(frozen=True)
class Rule:
    patterns: tuple[str, ...]
    groups: tuple[str, ...] = ()
    reminders: tuple[str, ...] = ()
    exclude: tuple[str, ...] = ()

    def matches(self, path: str) -> bool:
        def hit(patterns: tuple[str, ...]) -> bool:
            return any(fnmatch.fnmatchcase(path, pattern) for pattern in patterns)

        return hit(self.patterns) and not hit(self.exclude)


MARKDOWN = ("*.md",)
FORMATTED = (
    "*.ts",
    "*.tsx",
    "*.js",
    "*.mjs",
    "*.cjs",
    "*.json",
    "*.css",
    "*.yml",
    "*.yaml",
    "*.html",
)

# Ordered path → group suggestions. A path may match several rules; unmatched paths need an
# explicit coverage decision. Focused tests and browser checks stay reminders, never groups.
RULES: tuple[Rule, ...] = (
    Rule(
        MARKDOWN,
        ("docs-links",),
        exclude=("docs/changes/archive/*", "content/lesson-design/*"),
    ),
    Rule(FORMATTED, ("format",)),
    Rule(("*.py",), ("python-format",)),
    Rule(
        ("apps/web/*",),
        ("web-lint", "web-typecheck"),
        ("focused Vitest for changed behaviour: pnpm --filter web exec vitest run <files>",),
        exclude=MARKDOWN,
    ),
    Rule(
        ("apps/web/src/*.tsx", "apps/web/src/*.css"),
        reminders=("UI: Playwriter desktop/mobile check (STACK Required Tooling)",),
    ),
    Rule(
        ("apps/web/e2e/*", "apps/web/playwright*.config.ts"),
        reminders=("affected Playwright specs only, once before ship",),
    ),
    Rule(
        ("apps/api/*",),
        ("api-lint", "api-typecheck"),
        ("focused pytest: cd apps/api && uv run pytest <files-or-node-ids>",),
        exclude=MARKDOWN,
    ),
    Rule(("apps/api/app/*",), ("api-contract",)),
    Rule(
        ("apps/api/migrations/*",),
        reminders=("schema change: isolated migration/restore checks (verification runbook)",),
    ),
    Rule(
        ("content/*",),
        ("content-static",),
        exclude=(*MARKDOWN, "content/lesson-design/*"),
    ),
    Rule(
        (
            "apps/web/src/entities/lesson/content/*",
            "apps/web/src/entities/course/content/*",
            "apps/web/vite.config.ts",
            "scripts/check-paid-leak.mjs",
        ),
        ("paid-leak",),
    ),
    Rule(
        ("content/lesson-design/*", "scripts/lesson_design/*"),
        ("lesson-media", "host-ruff", "host-python"),
        ("topic checks: python3 -I content/lesson-design/topic-NN/{checks,bank}.py",),
    ),
    Rule(
        ("scripts/*.py", "scripts/pyrightconfig.json", "scripts/ruff.toml"),
        ("host-ruff", "host-python"),
        ("matching scripts/tests/*_test.py: python3 -m unittest scripts.tests.<module>",),
    ),
    Rule(("*.sh",), ("shell-lint",), ("matching scripts/tests/*.test.sh contract",)),
    Rule(
        (
            "scripts/*.mjs",
            "scripts/lib/*.mjs",
            "lighthouserc.cjs",
            "apps/web/eslint.tooling.config.js",
        ),
        ("tooling-lint",),
    ),
    Rule(
        ("infra/*", "Makefile"),
        ("infra-config",),
        ("nginx contracts when infra/nginx changed (verification runbook)",),
    ),
    Rule(
        (".github/workflows/*",),
        reminders=("CI runs gate.py groups; confirm every referenced group exists",),
    ),
    Rule(
        (
            "package.json",
            "*/package.json",
            "pnpm-lock.yaml",
            "*/pyproject.toml",
            "*/uv.lock",
        ),
        reminders=("dependency change: bash scripts/security-gate.sh changed-dependencies",),
    ),
)

COVERED_WITHOUT_CHECKS = (
    "docs/changes/archive/*",
    "*.png",
    "*.webp",
    "*.jpg",
    "*.svg",
    "*.txt",
    ".gitignore",
    ".prettierignore",
)


@dataclass(frozen=True)
class Suggestion:
    groups: tuple[str, ...]
    reminders: tuple[str, ...]
    unmatched: tuple[str, ...]


def suggest(paths: Iterable[str]) -> Suggestion:
    groups: set[str] = set()
    reminders: list[str] = []
    unmatched: list[str] = []
    for path in paths:
        matched = [rule for rule in RULES if rule.matches(path)]
        for rule in matched:
            groups.update(rule.groups)
            reminders.extend(item for item in rule.reminders if item not in reminders)
        if not matched and not any(fnmatch.fnmatchcase(path, p) for p in COVERED_WITHOUT_CHECKS):
            unmatched.append(path)
    ordered = tuple(name for name in GROUPS if name in groups)
    return Suggestion(ordered, tuple(reminders), tuple(unmatched))


def changed_paths(repo: Path, base: str, *, runner: Runner = subprocess.run) -> tuple[str, ...]:
    """Committed changes since the merge base, plus staged, unstaged and untracked files."""
    commands = (
        ("git", "diff", "--name-only", "--diff-filter=d", f"{base}...HEAD"),
        ("git", "diff", "--name-only", "--diff-filter=d", "HEAD"),
        ("git", "ls-files", "--others", "--exclude-standard"),
    )
    paths: dict[str, None] = {}
    for argv in commands:
        completed = runner(argv, cwd=repo, text=True, capture_output=True, check=False)
        if completed.returncode:
            raise GateError(f"{' '.join(argv)} failed: {completed.stderr.strip()}")
        paths.update(dict.fromkeys(line for line in completed.stdout.splitlines() if line))
    return tuple(paths)


def describe(suggestion: Suggestion) -> str:
    lines = []
    if suggestion.groups:
        lines.append("groups: " + " ".join(suggestion.groups))
        flags = " ".join(f"--group {name}" for name in suggestion.groups)
        lines.append(f"run:    python3 scripts/gate.py run {flags}")
    else:
        lines.append("groups: none")
    lines.extend(f"remind: {item}" for item in suggestion.reminders)
    lines.extend(
        f"decide: {path} (no rule; record a coverage decision)" for path in suggestion.unmatched
    )
    return "\n".join(lines)
