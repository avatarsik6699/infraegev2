from __future__ import annotations

import hashlib
import json
import os
import signal
import subprocess
import time
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

SCHEMA = 1
EXIT_NEEDS_REVIEW = 3
OPERATIONS_CONTRACTS = (
    "bash scripts/tests/backup-restore.test.sh && "
    "bash scripts/tests/deploy-preflight.test.sh && "
    "bash scripts/tests/host-web-gate.test.sh && "
    "bash scripts/tests/host-access-policy.test.sh && "
    "bash scripts/tests/root-password-access.test.sh && "
    "bash scripts/tests/release-retention.test.sh && "
    "bash scripts/tests/web-image-build.test.sh"
)
OPERATIONS_PYTHON = (
    "python3 -m unittest scripts.tests.application_db_test "
    "scripts.tests.deploy_orchestration_test scripts.tests.gate_test "
    "scripts.tests.release_checkpoint_test"
)


class GateError(RuntimeError):
    pass


@dataclass(frozen=True)
class Step:
    name: str
    argv: tuple[str, ...]
    prerequisite: str | None = None


@dataclass(frozen=True)
class Plan:
    profile: str
    base: str
    head: str
    paths: tuple[str, ...]
    classifications: tuple[str, ...]
    reasons: tuple[str, ...]
    decision: str
    manual_prerequisites: tuple[str, ...]
    steps: tuple[Step, ...]
    source_hash: str
    input_hash: str

    def public(self) -> dict[str, object]:
        return {
            "schema": SCHEMA,
            "profile": self.profile,
            "base": self.base,
            "head": self.head,
            "paths": list(self.paths),
            "classifications": list(self.classifications),
            "reasons": list(self.reasons),
            "decision": self.decision,
            "manual_prerequisites": list(self.manual_prerequisites),
            "steps": [
                {"name": step.name, "argv": list(step.argv), "prerequisite": step.prerequisite}
                for step in self.steps
            ],
            "input_hash": self.input_hash,
            "source_hash": self.source_hash,
        }


def git(repo: Path, *args: str) -> str:
    completed = subprocess.run(["git", "-C", str(repo), *args], text=True, capture_output=True)
    if completed.returncode:
        raise GateError(completed.stderr.strip() or "git command failed")
    return completed.stdout


def resolve(repo: Path, revision: str) -> str:
    return git(repo, "rev-parse", "--verify", f"{revision}^{{commit}}").strip()


def changed_paths(repo: Path, base: str) -> tuple[str, ...]:
    raw = git(repo, "diff", "--name-only", "-z", f"{base}..HEAD", "--")
    raw += git(repo, "diff", "--name-only", "-z", "--")
    raw += git(repo, "diff", "--cached", "--name-only", "-z", "--")
    raw += git(repo, "ls-files", "--others", "--exclude-standard", "-z")
    return tuple(sorted({item for item in raw.split("\0") if item}))


def _digest_file(digest: Any, path: Path) -> None:
    digest.update(path.as_posix().encode())
    digest.update(b"\0")
    if path.is_symlink():
        digest.update(b"symlink\0")
        digest.update(os.readlink(path).encode())
        return
    if not path.exists():
        digest.update(b"deleted\0")
        return
    digest.update(b"file\0")
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)


def input_hash(repo: Path, base: str, profile: str, paths: Iterable[str]) -> str:
    digest = hashlib.sha256()
    digest.update(f"gate-schema={SCHEMA}\0profile={profile}\0base={base}\0".encode())
    digest.update(git(repo, "rev-parse", "HEAD").encode())
    digest.update(git(repo, "diff", "--binary", "HEAD", "--").encode())
    digest.update(git(repo, "diff", "--cached", "--binary", "--").encode())
    tracked = git(repo, "ls-files", "-z").split("\0")
    for path in sorted({path for path in (*tracked, *paths) if path}):
        _digest_file(digest, repo / path)
    for command in ("python3", "node", "pnpm", "uv", "docker", "git", "bash", "shellcheck"):
        try:
            version = subprocess.run(
                [command, "--version"],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                timeout=15,
            ).stdout.strip()
        except (FileNotFoundError, subprocess.TimeoutExpired):
            version = "unavailable"
        digest.update(f"tool:{command}={version}\0".encode())
    for key in sorted(os.environ):
        digest.update(f"env:{key}=".encode())
        digest.update(hashlib.sha256(os.environ.get(key, "").encode()).digest())
    for metadata in (
        repo / "node_modules/.modules.yaml",
        repo / "node_modules/.pnpm/lock.yaml",
        repo / "apps/api/.venv/pyvenv.cfg",
        repo / "apps/api/uv.lock",
    ):
        _digest_file(digest, metadata)
    return digest.hexdigest()


def artifact_hash(repo: Path) -> str | None:
    root = repo / "apps/web/.output"
    if not root.is_dir() or not (root / "server/index.mjs").is_file():
        return None
    digest = hashlib.sha256()
    for path in sorted(root.rglob("*")):
        if path.is_file() or path.is_symlink():
            _digest_file(digest, path)
    return digest.hexdigest()


def prepared_environment_error() -> str | None:
    if os.environ.get("APP_ENV") != "development":
        return "APP_ENV must be development for the isolated gate"
    task_files = os.environ.get("TASK_FILES_DIR", "")
    if not task_files or not Path(task_files).is_absolute():
        return "TASK_FILES_DIR must be a dedicated absolute path"
    for key, role in (
        ("MIGRATION_DATABASE_URL", "infraege_migration"),
        ("IMPORT_DATABASE_URL", "infraege_import"),
        ("DATABASE_URL", "infraege_runtime"),
        ("ACCOUNT_DATABASE_URL", "infraege_app"),
    ):
        try:
            parsed = urlparse(os.environ.get(key, ""))
            valid = (
                parsed.scheme in {"postgresql", "postgresql+asyncpg"}
                and parsed.hostname == "127.0.0.1"
                and parsed.port == 15432
                and parsed.username == role
                and parsed.path == "/infraege"
                and not parsed.query
                and not parsed.fragment
            )
        except ValueError:
            valid = False
        if not valid:
            return f"{key} must select {role} at 127.0.0.1:15432"
    return None


def classify(paths: Iterable[str]) -> tuple[tuple[str, ...], tuple[str, ...]]:
    found: set[str] = set()
    reasons: list[str] = []
    for path in paths:
        if path in {"package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", ".dockerignore"}:
            found.add("root-risk")
            reasons.append(f"{path} changes shared dependency or build inputs")
        elif path in {"scripts/gate.py", "scripts/pyrightconfig.json"} or path.startswith(
            "scripts/lib/gate/"
        ):
            found.add("gate-policy")
            reasons.append(f"{path} changes gate behavior")
        elif path in {"AGENTS.md", "docs/STACK.md"} or path.startswith("docs/playbooks/"):
            found.add("gate-policy")
            reasons.append(f"{path} changes verification policy")
        elif path.startswith(("infra/", ".github/", "ops/")) or path.endswith("Dockerfile"):
            found.add("infrastructure")
            reasons.append(f"{path} affects infrastructure or deployment")
        elif path.startswith("apps/web/public/content/"):
            found.update({"web", "content"})
        elif path.startswith("apps/web/"):
            if path in {
                "apps/web/package.json",
                "apps/web/vite.config.ts",
                "apps/web/playwright.config.ts",
            }:
                found.add("root-risk")
                reasons.append(f"{path} changes shared frontend build or test configuration")
            else:
                found.add("web")
        elif path.startswith("apps/api/"):
            if (
                path.endswith(("uv.lock", "pyproject.toml", "alembic.ini"))
                or "/migrations/" in path
                or "/core/config" in path
            ):
                found.add("root-risk")
                reasons.append(f"{path} changes API dependency, migration, or configuration risk")
            else:
                found.add("api")
        elif path.startswith("contracts/"):
            found.add("api")
        elif path.startswith(("content/", "apps/web/public/content/")):
            found.add("content")
        elif path in {
            "scripts/application_db.py",
            "scripts/backup.sh",
            "scripts/restore-check.sh",
            "scripts/deploy-remote.sh",
            "scripts/check-release-target.sh",
        } or path.startswith(
            (
                "scripts/lib/application_db/",
                "scripts/tests/application_db_test.py",
                "scripts/tests/deploy_orchestration_test.py",
            )
        ):
            found.add("ops")
        elif path.startswith("scripts/"):
            found.add("unknown")
            reasons.append(f"{path} is not in the approved host-operations allowlist")
        elif path.startswith(("docs/", "README")):
            found.add("docs")
        else:
            found.add("unknown")
            reasons.append(f"{path} has no approved risk classification")
    if not found:
        found.add("unknown")
        reasons.append("no changed paths; an explicit verified baseline is required")
    return tuple(sorted(found)), tuple(reasons)


def _plan_hash(seed: str, steps: Iterable[Step], decision: str) -> str:
    payload = {
        "seed": seed,
        "decision": decision,
        "steps": [(step.name, step.argv, step.prerequisite) for step in steps],
    }
    return hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()


def build_plan(
    repo: Path,
    profile: str,
    base_arg: str,
    tests: tuple[Step, ...] = (),
    prepared_environment: bool = False,
    reviewed_scope: str | None = None,
    review_reason: str | None = None,
) -> Plan:
    if profile not in {"critical", "full", "release"}:
        raise GateError(f"Unknown profile: {profile}")
    invalid_release_base = profile == "release" and len(base_arg) != 40
    try:
        base = resolve(repo, base_arg) if not invalid_release_base else base_arg or "unverified"
    except GateError:
        if profile != "release":
            raise
        invalid_release_base = True
        base = base_arg or "unverified"
    if profile == "release" and base != base_arg:
        invalid_release_base = True
    head = resolve(repo, "HEAD")
    paths = () if invalid_release_base else changed_paths(repo, base)
    classes, reasons = classify(paths)
    if invalid_release_base:
        classes, reasons = (
            ("unknown",),
            ("Release needs an existing full 40-character production SHA as --base.",),
        )
    fingerprint = input_hash(repo, base, profile, paths)
    prerequisites: list[str] = []
    decision = "ready"
    steps: list[Step] = []
    unsafe = {"unknown", "root-risk", "gate-policy", "infrastructure"}

    if profile == "critical":
        steps.append(Step("format", ("pnpm", "format:check")))
        reviewed = reviewed_scope == "ops"
        if reviewed and (not review_reason or not tests):
            raise GateError("--reviewed-scope requires --reason and at least one explicit --test")
        if unsafe.intersection(classes) and not reviewed:
            decision = "full-required"
            reasons = tuple(reasons) + ("Critical never starts Full implicitly.",)
            steps = []
        else:
            if reviewed:
                reasons = tuple(reasons) + (f"Reviewed scope override (ops): {review_reason}",)
            if "web" in classes:
                steps.extend(
                    (
                        Step("web-lint", ("pnpm", "--filter", "web", "lint")),
                        Step("web-typecheck", ("pnpm", "--filter", "web", "typecheck")),
                    )
                )
            if "api" in classes:
                steps.extend(
                    (
                        Step(
                            "api-lint",
                            (
                                "bash",
                                "-lc",
                                "cd apps/api && uv run ruff check app tests migrations",
                            ),
                        ),
                        Step(
                            "api-typecheck",
                            (
                                "bash",
                                "-lc",
                                "cd apps/api && pnpm exec pyright app tests migrations",
                            ),
                        ),
                        Step("api-contract", ("pnpm", "api:check")),
                        Step("web-typecheck", ("pnpm", "--filter", "web", "typecheck")),
                    )
                )
            if "content" in classes:
                steps.append(
                    Step(
                        "content-validation",
                        ("bash", "-lc", "pnpm test:content-assets && pnpm validate:content"),
                    )
                )
            if "ops" in classes or reviewed:
                steps.extend(
                    [
                        Step("shell-lint", ("pnpm", "lint:shell")),
                        Step(
                            "host-python",
                            ("pnpm", "exec", "pyright", "--project", "scripts/pyrightconfig.json"),
                        ),
                    ]
                )
            behavior = {"web", "api", "ops", "content"}.intersection(classes)
            if behavior and not tests:
                decision = "needs-review"
                reasons = tuple(reasons) + (
                    "Focused tests are required; provide --test NAME=COMMAND.",
                )
            steps.extend(tests)
    elif profile == "full":
        prerequisites.extend(
            (
                "Prepared isolated infraege-full-gate environment and imported practice bank.",
                "Protected gate credentials are exported; values are not recorded.",
            )
        )
        prepared_error = prepared_environment_error() if prepared_environment else None
        if not prepared_environment or prepared_error:
            decision = "needs-review"
            reasons = tuple(reasons) + (
                prepared_error
                or "Full requires --prepared-environment after bootstrap/import validation.",
            )
        else:
            steps.append(
                Step(
                    "prepared-environment",
                    (
                        "bash",
                        "-lc",
                        "docker compose --project-name infraege-full-gate "
                        "-f infra/docker-compose.yml "
                        "-f infra/docker-compose.override.yml config --quiet",
                    ),
                )
            )
            steps.append(
                Step("prepared-health", ("curl", "-f", "http://localhost:18000/health/ready"))
            )
        steps.extend(
            [
                Step("format", ("pnpm", "format:check")),
                Step(
                    "operations-contracts",
                    (
                        "bash",
                        "-lc",
                        OPERATIONS_CONTRACTS,
                    ),
                ),
                Step(
                    "operations-python",
                    (
                        "bash",
                        "-lc",
                        OPERATIONS_PYTHON,
                    ),
                ),
                Step(
                    "api-migrations",
                    (
                        "bash",
                        "-lc",
                        "cd apps/api && uv run alembic upgrade head && "
                        "uv run alembic current && uv run alembic check",
                    ),
                ),
                Step("api-tests", ("bash", "-lc", "cd apps/api && uv run pytest")),
                Step("api-contract", ("pnpm", "api:check")),
                Step(
                    "web-build",
                    ("bash", "-lc", "scripts/run-host-web-gate.sh pnpm --filter web build"),
                ),
                Step("web-unit", ("pnpm", "--filter", "web", "test")),
                Step(
                    "e2e-list", ("pnpm", "--filter", "web", "exec", "playwright", "test", "--list")
                ),
                Step("e2e", ("pnpm", "--filter", "web", "test:e2e")),
                Step(
                    "performance",
                    ("bash", "-lc", "scripts/run-host-web-gate.sh pnpm audit:performance"),
                    "web-build",
                ),
                Step("smoke", ("curl", "-f", "http://localhost:18000/health/ready")),
                Step(
                    "content", ("bash", "-lc", "pnpm test:content-assets && pnpm validate:content")
                ),
                Step("fresh-security", ("pnpm", "audit:security")),
            ]
        )
    else:
        steps.append(Step("format", ("pnpm", "format:check")))
        if invalid_release_base or unsafe.intersection(classes):
            decision = "full-required"
            reasons = tuple(reasons) + (
                "Release policy or unknown risk requires the Full profile.",
            )
        if decision == "ready" and "web" in classes:
            prepared_error = prepared_environment_error() if prepared_environment else None
            if not prepared_environment or prepared_error:
                decision = "needs-review"
                reasons = tuple(reasons) + (
                    prepared_error
                    or "Web checks require --prepared-environment for the isolated gate.",
                )
            else:
                steps.append(
                    Step("prepared-health", ("curl", "-f", "http://localhost:18000/health/ready"))
                )
            steps.extend(
                [
                    Step(
                        "web-build",
                        ("bash", "-lc", "scripts/run-host-web-gate.sh pnpm --filter web build"),
                    ),
                    Step("web-unit", ("pnpm", "--filter", "web", "test")),
                    Step("e2e", ("pnpm", "--filter", "web", "test:e2e")),
                    Step(
                        "performance",
                        ("bash", "-lc", "scripts/run-host-web-gate.sh pnpm audit:performance"),
                        "web-build",
                    ),
                ]
            )
        if decision == "ready" and "api" in classes:
            prepared_error = prepared_environment_error() if prepared_environment else None
            if not prepared_environment or prepared_error:
                decision = "needs-review"
                reasons = tuple(reasons) + (
                    prepared_error
                    or "API checks require --prepared-environment for isolated migrations.",
                )
            elif not any(step.name == "prepared-health" for step in steps):
                steps.append(
                    Step("prepared-health", ("curl", "-f", "http://localhost:18000/health/ready"))
                )
            steps.extend(
                [
                    Step("api-migrations", ("bash", "-lc", "cd apps/api && uv run alembic check")),
                    Step("api-tests", ("bash", "-lc", "cd apps/api && uv run pytest")),
                    Step("api-contract", ("pnpm", "api:check")),
                    Step("e2e", ("pnpm", "--filter", "web", "test:e2e")),
                ]
            )
        if decision == "ready" and "content" in classes:
            prepared_error = prepared_environment_error() if prepared_environment else None
            if not prepared_environment or prepared_error:
                decision = "needs-review"
                reasons = tuple(reasons) + (
                    prepared_error
                    or "Content checks require --prepared-environment for web verification.",
                )
            elif not any(step.name == "prepared-health" for step in steps):
                steps.append(
                    Step("prepared-health", ("curl", "-f", "http://localhost:18000/health/ready"))
                )
            steps.extend(
                [
                    Step(
                        "content",
                        ("bash", "-lc", "pnpm test:content-assets && pnpm validate:content"),
                    ),
                    Step(
                        "web-build",
                        ("bash", "-lc", "scripts/run-host-web-gate.sh pnpm --filter web build"),
                    ),
                    Step("e2e", ("pnpm", "--filter", "web", "test:e2e")),
                    Step(
                        "performance",
                        ("bash", "-lc", "scripts/run-host-web-gate.sh pnpm audit:performance"),
                        "web-build",
                    ),
                ]
            )
        if decision == "ready" and "ops" in classes:
            steps.extend(
                [
                    Step(
                        "operations-contracts",
                        (
                            "bash",
                            "-lc",
                            OPERATIONS_CONTRACTS,
                        ),
                    ),
                    Step(
                        "operations-python",
                        (
                            "bash",
                            "-lc",
                            OPERATIONS_PYTHON,
                        ),
                    ),
                    Step(
                        "host-python",
                        ("pnpm", "exec", "pyright", "--project", "scripts/pyrightconfig.json"),
                    ),
                ]
            )
        if decision == "ready":
            steps.append(Step("fresh-security", ("pnpm", "audit:security")))
    # Mixed domains share the same build and browser suite, not additional executions.
    unique: list[Step] = []
    seen: dict[str, Step] = {}
    for step in steps:
        if step.name not in seen:
            unique.append(step)
            seen[step.name] = step
        elif seen[step.name] != step:
            raise GateError("Step names must be unique for distinct commands")
    steps = unique
    return Plan(
        profile,
        base,
        head,
        paths,
        classes,
        tuple(reasons),
        decision,
        tuple(prerequisites),
        tuple(steps),
        fingerprint,
        _plan_hash(fingerprint, steps, decision),
    )


def state_root(repo: Path) -> Path:
    root = Path(os.environ.get("XDG_STATE_HOME", Path.home() / ".local" / "state"))
    location = (
        root
        / "infraegev2"
        / "gates"
        / hashlib.sha256(str(repo.resolve()).encode()).hexdigest()[:16]
    )
    location.mkdir(parents=True, exist_ok=True)
    location.chmod(0o700)
    return location


def _atomic_json(path: Path, value: dict[str, object]) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as target:
        target.write(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
        target.flush()
        os.fsync(target.fileno())
    temporary.replace(path)
    path.chmod(0o600)


def report_paths(repo: Path, plan: Plan) -> tuple[Path, Path]:
    root = state_root(repo)
    stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%S.%fZ")
    return (
        root / f"{plan.profile}-{stamp}-{os.getpid()}-{plan.input_hash[:12]}.json",
        root / ".gate.lock",
    )


def find_resume(repo: Path, plan: Plan) -> Path:
    candidates = sorted(state_root(repo).glob(f"{plan.profile}-*.json"), reverse=True)
    for candidate in candidates:
        try:
            report = json.loads(candidate.read_text())
        except json.JSONDecodeError:
            continue
        if report.get("input_hash") == plan.input_hash:
            return candidate
    raise GateError("No exact-source resumable report exists; original reports were left unchanged")


def acquire_lock(repo: Path) -> int:
    import fcntl

    lock = state_root(repo) / ".gate.lock"
    fd = os.open(lock, os.O_CREAT | os.O_RDWR, 0o600)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError as exc:
        os.close(fd)
        raise GateError("Another gate run is active for this repository") from exc
    return fd


def execute(repo: Path, plan: Plan, resume: Path | None = None) -> tuple[int, Path]:
    if plan.decision != "ready":
        raise GateError(f"Plan is {plan.decision}; inspect plan reasons before running")
    lock = acquire_lock(repo)
    attempt_started = time.monotonic()
    try:
        if resume:
            report = json.loads(resume.read_text())
            if report.get("input_hash") != plan.input_hash:
                raise GateError("Resume inputs changed; original evidence is unchanged")
            path = resume
        else:
            path, _ = report_paths(repo, plan)
            report = {
                **plan.public(),
                "planned_steps": plan.public()["steps"],
                "started_at": datetime.now(UTC).isoformat(),
                "steps": [],
            }
        latest = {item["name"]: item for item in report.get("steps", [])}
        completed = {name for name, item in latest.items() if item.get("status") == "passed"}
        # Source hashes do not prove current database, browser or service state.
        completed.difference_update(
            {
                "fresh-security",
                "prepared-environment",
                "prepared-health",
                "api-migrations",
                "api-tests",
                "e2e",
                "representative-e2e",
                "smoke",
                "performance",
            }
        )
        built = latest.get("web-build")
        artifact = artifact_hash(repo)
        if not built or artifact is None or built.get("artifact_hash") != artifact:
            completed.difference_update({"web-build", "performance"})
        report["status"] = "running"
        report.pop("finished_at", None)
        report["resumed"] = bool(resume)
        report["attempt_started_at"] = datetime.now(UTC).isoformat()
        report["retry_count"] = int(report.get("retry_count", 0)) + int(bool(resume))
        report["reused_steps"] = sorted(completed.intersection(step.name for step in plan.steps))
        _atomic_json(path, report)
        active: subprocess.Popen[str] | None = None
        interrupted_at: float | None = None

        def terminate_group(sig: int) -> None:
            if active is not None:
                try:
                    os.killpg(active.pid, sig)
                except ProcessLookupError:
                    pass

        def cancel(_signal: int, _frame: object) -> None:
            nonlocal interrupted_at
            if interrupted_at is None:
                interrupted_at = time.monotonic()
            terminate_group(signal.SIGTERM)

        def finish(status: str, code: int) -> tuple[int, Path]:
            report["status"] = status
            report["finished_at"] = datetime.now(UTC).isoformat()
            report["attempt_duration_ms"] = round((time.monotonic() - attempt_started) * 1000)
            report["duration_ms"] = sum(int(item.get("duration_ms", 0)) for item in report["steps"])
            _atomic_json(path, report)
            return code, path

        previous_int = signal.signal(signal.SIGINT, cancel)
        previous_term = signal.signal(signal.SIGTERM, cancel)
        try:
            for step in plan.steps:
                if interrupted_at is not None:
                    return finish("interrupted", 130)
                if step.name in completed:
                    continue
                started = time.monotonic()
                item: dict[str, Any] = {
                    "name": step.name,
                    "argv": list(step.argv),
                    "status": "running",
                }
                report["steps"].append(item)
                _atomic_json(path, report)
                try:
                    active = subprocess.Popen(
                        list(step.argv), cwd=repo, start_new_session=True, text=True
                    )
                    while True:
                        try:
                            status = active.wait(timeout=0.2)
                            break
                        except subprocess.TimeoutExpired:
                            if (
                                interrupted_at is not None
                                and time.monotonic() - interrupted_at >= 2
                            ):
                                terminate_group(signal.SIGKILL)
                except OSError as error:
                    item["error"] = type(error).__name__
                    status = 127
                item["duration_ms"] = round((time.monotonic() - started) * 1000)
                item["exit_code"] = status
                if interrupted_at is not None:
                    terminate_group(signal.SIGKILL)
                    item["status"] = "interrupted"
                    return finish("interrupted", 130)
                active = None
                item["status"] = "passed" if status == 0 else "failed"
                if status:
                    return finish("failed", status)
                if (
                    input_hash(repo, plan.base, plan.profile, changed_paths(repo, plan.base))
                    != plan.source_hash
                ):
                    item["status"] = "invalidated"
                    return finish("invalidated", EXIT_NEEDS_REVIEW)
                if step.name == "web-build":
                    item["artifact_hash"] = artifact_hash(repo)
                    if item["artifact_hash"] is None:
                        item["status"] = "failed"
                        item["error"] = "Build did not produce apps/web/.output/server/index.mjs"
                        return finish("failed", 1)
                _atomic_json(path, report)
            if (
                input_hash(repo, plan.base, plan.profile, changed_paths(repo, plan.base))
                != plan.source_hash
            ):
                return finish("invalidated", EXIT_NEEDS_REVIEW)
            return finish("passed", 0)
        finally:
            signal.signal(signal.SIGINT, previous_int)
            signal.signal(signal.SIGTERM, previous_term)
    finally:
        import fcntl

        fcntl.flock(lock, fcntl.LOCK_UN)
        os.close(lock)
