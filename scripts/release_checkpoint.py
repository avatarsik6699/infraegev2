"""Read-only collection of fresh, exact-SHA release evidence.

The checkpoint is local operator state only.  It never dispatches workflows,
pushes images, or contacts a deployment host with credentials.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import stat
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

SHA_RE = re.compile(r"^[0-9a-f]{40}$")
REPOSITORY_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
MAX_RUN_PAGES = 10
IMAGE_NAMES = frozenset(("api", "nginx", "web"))
DEFAULT_REPOSITORY = "avatarsik6699/infraegev2"
DEFAULT_HEALTH_URL = "https://infraege.ru/health/ready"
DEFAULT_HOMEPAGE_URL = "https://infraege.ru/"


class CheckpointError(RuntimeError):
    """Evidence is incomplete, malformed, or unavailable."""


def exact_sha(value: str) -> str:
    if not SHA_RE.fullmatch(value):
        raise CheckpointError("sha must be exactly 40 lowercase hexadecimal characters")
    return value


def default_state_dir() -> Path:
    base = os.environ.get("XDG_STATE_HOME")
    state_home = Path(base) if base else Path.home() / ".local" / "state"
    return state_home / "infraegev2" / "releases"


def json_text(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def run_gh(gh: str, arguments: list[str]) -> Any:
    try:
        result = subprocess.run(
            [gh, *arguments], check=False, capture_output=True, text=True, timeout=30
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        raise CheckpointError("github evidence request could not be completed") from error
    if result.returncode:
        raise CheckpointError(f"github evidence request failed (exit {result.returncode})")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as error:
        raise CheckpointError("github evidence was not valid JSON") from error


def workflow_runs(gh: str, repository: str, workflow: str, sha: str | None) -> list[dict[str, Any]]:
    runs: list[dict[str, Any]] = []
    for page in range(1, MAX_RUN_PAGES + 1):
        query = f"per_page=100&page={page}"
        if sha:
            query += f"&head_sha={sha}"
        payload = run_gh(
            gh, ["api", f"repos/{repository}/actions/workflows/{workflow}/runs?{query}"]
        )
        if not isinstance(payload, dict) or not isinstance(payload.get("workflow_runs"), list):
            raise CheckpointError(f"{workflow} response has no workflow_runs list")
        page_runs = payload["workflow_runs"]
        if not all(isinstance(run, dict) for run in page_runs):
            raise CheckpointError(f"{workflow} response contains malformed workflow run")
        runs.extend(page_runs)
        if len(page_runs) < 100:
            return runs
    raise CheckpointError(f"too many {workflow} runs to inspect safely")


def run_order(run: dict[str, Any]) -> tuple[int, int]:
    identifier = run.get("id")
    attempt = run.get("run_attempt", 1)
    if not isinstance(identifier, int) or not isinstance(attempt, int):
        raise CheckpointError("workflow run has malformed id or attempt")
    return (identifier, attempt)


def successful_run(runs: list[dict[str, Any]], workflow: str, sha: str) -> dict[str, Any]:
    matching = [
        run
        for run in runs
        if run.get("head_sha") == sha
        and run.get("event") == "push"
        and run.get("head_branch") == "main"
    ]
    if not matching:
        raise CheckpointError(f"no main push {workflow} run matches {sha}")
    latest = max(matching, key=run_order)
    if latest.get("status") != "completed" or latest.get("conclusion") != "success":
        raise CheckpointError(
            f"latest {workflow} run for {sha} is {latest.get('status')}/{latest.get('conclusion')}"
        )
    return latest


def run_evidence(run: dict[str, Any], repository: str) -> dict[str, Any]:
    identifier = run.get("id")
    if not isinstance(identifier, int):
        raise CheckpointError("workflow run has no numeric id")
    url = run.get("html_url")
    if not isinstance(url, str):
        url = f"https://github.com/{repository}/actions/runs/{identifier}"
    validate_public_url(url)
    return {"id": identifier, "url": url}


def image_evidence(gh: str, repository: str, sha: str) -> dict[str, Any]:
    run = successful_run(workflow_runs(gh, repository, "images.yml", sha), "images.yml", sha)
    evidence = run_evidence(run, repository)
    payload = run_gh(
        gh,
        [
            "api",
            f"repos/{repository}/actions/runs/{evidence['id']}/jobs?filter=latest&per_page=100",
        ],
    )
    jobs = payload.get("jobs") if isinstance(payload, dict) else None
    if not isinstance(jobs, list):
        raise CheckpointError("images.yml job response has no jobs list")
    scanned: set[str] = set()
    for job in jobs:
        if not isinstance(job, dict):
            raise CheckpointError("images.yml job response contains malformed job")
        name = job.get("name")
        steps = job.get("steps")
        if not isinstance(name, str) or not isinstance(steps, list):
            raise CheckpointError("images.yml job has malformed name or steps")
        for image in IMAGE_NAMES:
            if name != f"images ({image})":
                continue
            scan_steps = [
                step
                for step in steps
                if isinstance(step, dict) and step.get("name") == "Scan published image"
            ]
            if (
                job.get("status") == "completed"
                and job.get("conclusion") == "success"
                and any(
                    step.get("status") == "completed" and step.get("conclusion") == "success"
                    for step in scan_steps
                )
            ):
                scanned.add(image)
    if scanned != IMAGE_NAMES:
        absent = ", ".join(sorted(IMAGE_NAMES - scanned))
        raise CheckpointError(f"images.yml lacks successful published-digest scans for: {absent}")
    evidence["published_digest_scans"] = sorted(scanned)
    evidence["authority"] = "images.yml successful published-digest scan steps"
    return evidence


def predeploy_evidence(gh: str, repository: str, sha: str) -> dict[str, Any]:
    quality = successful_run(workflow_runs(gh, repository, "quality.yml", sha), "quality.yml", sha)
    return {
        "quality": run_evidence(quality, repository),
        "images": image_evidence(gh, repository, sha),
    }


def deploy_evidence(gh: str, repository: str, sha: str) -> dict[str, Any]:
    runs = workflow_runs(gh, repository, "deploy.yml", None)
    matching = [
        run
        for run in runs
        if run.get("event") == "workflow_dispatch" and run.get("display_title") == f"Deploy {sha}"
    ]
    if not matching:
        raise CheckpointError(f"no deploy.yml workflow_dispatch run proves target {sha}")
    latest = max(matching, key=run_order)
    if latest.get("status") != "completed" or latest.get("conclusion") != "success":
        raise CheckpointError(
            f"latest deploy.yml run for target {sha} is "
            f"{latest.get('status')}/{latest.get('conclusion')}"
        )
    evidence = run_evidence(latest, repository)
    # workflow_dispatch runs check out inputs.sha, while head_sha identifies the
    # workflow file's ref. deploy.yml makes this evaluated run name authoritative.
    evidence["target_sha"] = sha
    return evidence


def validate_public_url(url: str) -> None:
    parsed = urlsplit(url)
    if (
        parsed.scheme != "https"
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.query
        or parsed.fragment
    ):
        raise CheckpointError(
            "public URL must be a credential-free HTTPS URL without query or fragment"
        )


def http_json(url: str) -> Any:
    validate_public_url(url)
    request = Request(url, headers={"User-Agent": "infraege-release-checkpoint/1"})
    try:
        # validate_public_url above admits only credential-free https://, so no file:// read.
        # nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
        with urlopen(request, timeout=15) as response:
            if getattr(response, "geturl", lambda: url)() != url:
                raise CheckpointError(
                    "public readiness redirected away from the configured endpoint"
                )
            if response.status != 200:
                raise CheckpointError(f"public readiness returned HTTP {response.status}")
            payload = response.read().decode("utf-8")
    except (OSError, URLError, UnicodeDecodeError) as error:
        raise CheckpointError("public readiness request could not be completed") from error
    try:
        return json.loads(payload)
    except json.JSONDecodeError as error:
        raise CheckpointError("public readiness was not valid JSON") from error


def verify_public_release(health_url: str, homepage_url: str, sha: str) -> dict[str, Any]:
    validate_public_url(health_url)
    validate_public_url(homepage_url)
    if urlsplit(health_url).netloc.lower() != urlsplit(homepage_url).netloc.lower():
        raise CheckpointError("health and homepage must use the same configured HTTPS origin")
    health = http_json(health_url)
    if not isinstance(health, dict) or health.get("status") != "ok" or health.get("version") != sha:
        raise CheckpointError("public readiness does not report the requested exact SHA")
    validate_public_url(homepage_url)
    request = Request(homepage_url, headers={"User-Agent": "infraege-release-checkpoint/1"})
    try:
        # validate_public_url above admits only credential-free https://, so no file:// read.
        # nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
        with urlopen(request, timeout=15) as response:
            if getattr(response, "geturl", lambda: homepage_url)() != homepage_url:
                raise CheckpointError("homepage redirected away from the configured endpoint")
            if response.status != 200:
                raise CheckpointError(f"homepage returned HTTP {response.status}")
            response.read(1)
    except (OSError, URLError) as error:
        raise CheckpointError("homepage request could not be completed") from error
    return {"health_url": health_url, "homepage_url": homepage_url}


def secure_state_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True, mode=0o700)
    details = path.lstat()
    if stat.S_ISLNK(details.st_mode) or not stat.S_ISDIR(details.st_mode):
        raise CheckpointError(f"state path is not a directory: {path}")
    if details.st_mode & 0o077:
        raise CheckpointError(f"state directory must not be accessible to group or others: {path}")


def checkpoint_path(state_dir: Path, repository: str, sha: str) -> Path:
    if not REPOSITORY_RE.fullmatch(repository):
        raise CheckpointError("repository must have owner/name form")
    return state_dir / repository.replace("/", "--") / f"{sha}.json"


def load_history(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    details = path.lstat()
    if (
        stat.S_ISLNK(details.st_mode)
        or not stat.S_ISREG(details.st_mode)
        or details.st_mode & 0o077
    ):
        raise CheckpointError(f"state file is not protected: {path}")
    try:
        value = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        raise CheckpointError(f"state file is invalid: {path}") from error
    history = value.get("history") if isinstance(value, dict) else None
    return (
        history
        if isinstance(history, list) and all(isinstance(item, dict) for item in history)
        else []
    )


def write_checkpoint(state_dir: Path, sha: str, current: dict[str, Any]) -> None:
    secure_state_dir(state_dir)
    path = checkpoint_path(state_dir, current["repository"], sha)
    secure_state_dir(path.parent)
    history = load_history(path)
    record = {
        "schema": 1,
        "sha": sha,
        "repository": current["repository"],
        "current": current,
        "history": (history + [current])[-20:],
    }
    fd, temporary_name = tempfile.mkstemp(prefix=f".{sha}.", suffix=".tmp", dir=state_dir)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            stream.write(json_text(record) + "\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary_name, path)
    finally:
        try:
            os.unlink(temporary_name)
        except FileNotFoundError:
            pass


def now() -> str:
    return dt.datetime.now(dt.UTC).isoformat().replace("+00:00", "Z")


def collect(arguments: argparse.Namespace) -> dict[str, Any]:
    sha = exact_sha(arguments.sha)
    if not REPOSITORY_RE.fullmatch(arguments.repo):
        raise CheckpointError("repository must have owner/name form")
    evidence = predeploy_evidence(arguments.gh, arguments.repo, sha)
    if arguments.phase == "postdeploy":
        evidence["deploy"] = deploy_evidence(arguments.gh, arguments.repo, sha)
        evidence["public"] = verify_public_release(
            arguments.health_url, arguments.homepage_url, sha
        )
    return evidence


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phase", choices=("predeploy", "postdeploy"))
    parser.add_argument("--sha", required=True)
    parser.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", DEFAULT_REPOSITORY))
    parser.add_argument("--state-dir", type=Path, default=default_state_dir())
    parser.add_argument("--gh", default="gh")
    parser.add_argument("--health-url", default=DEFAULT_HEALTH_URL)
    parser.add_argument("--homepage-url", default=DEFAULT_HOMEPAGE_URL)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    arguments = parse_args(sys.argv[1:] if argv is None else argv)
    sha = arguments.sha
    try:
        sha = exact_sha(sha)
        evidence = collect(arguments)
        current: dict[str, Any] = {
            "phase": arguments.phase,
            "status": "pass",
            "checked_at": now(),
            "repository": arguments.repo,
            "evidence": evidence,
        }
    except CheckpointError as error:
        current = {
            "phase": arguments.phase,
            "status": "fail",
            "checked_at": now(),
            "repository": arguments.repo,
            "error": str(error),
        }
        try:
            if SHA_RE.fullmatch(sha):
                write_checkpoint(arguments.state_dir, sha, current)
        except (CheckpointError, OSError) as state_error:
            print(
                f"release checkpoint: {error}; also could not record failure: {state_error}",
                file=sys.stderr,
            )
            return 1
        print(f"release checkpoint: {error}", file=sys.stderr)
        return 1
    try:
        write_checkpoint(arguments.state_dir, sha, current)
    except OSError:
        print("release checkpoint: could not atomically store local evidence", file=sys.stderr)
        return 1
    print(json.dumps(current, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
