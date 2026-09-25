from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.lib.gate import core

SCRIPTS = Path(__file__).resolve().parents[1]


class GateTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp.name) / "repo"
        self.repo.mkdir()
        self.git("init", "-q")
        self.git("config", "user.email", "gate@example.test")
        self.git("config", "user.name", "Gate")
        self.write("docs/readme.md", "initial\n")
        self.write(".gitignore", ".output/\n")
        self.git("add", ".")
        self.git("commit", "-qm", "initial")
        self.base = core.resolve(self.repo, "HEAD")
        self.state = Path(self.temp.name) / "state"
        self.environment = patch.dict(os.environ, {"XDG_STATE_HOME": str(self.state)}, clear=False)
        self.environment.start()

    def tearDown(self) -> None:
        self.environment.stop()
        self.temp.cleanup()

    def git(self, *args: str) -> None:
        subprocess.run(["git", "-C", str(self.repo), *args], check=True, stdout=subprocess.DEVNULL)

    def write(self, name: str, content: str) -> None:
        path = self.repo / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)

    def executable_plan(self, step: core.Step) -> core.Plan:
        paths = core.changed_paths(self.repo, self.base)
        source_hash = core.input_hash(self.repo, self.base, "critical", paths)
        return core.Plan(
            "critical",
            self.base,
            core.resolve(self.repo, "HEAD"),
            paths,
            ("ops",),
            (),
            "ready",
            (),
            (step,),
            source_hash,
            source_hash,
        )

    def manual_plan(self, profile: str, steps: tuple[core.Step, ...]) -> core.Plan:
        paths = core.changed_paths(self.repo, self.base)
        source_hash = core.input_hash(self.repo, self.base, profile, paths)
        return core.Plan(
            profile,
            self.base,
            core.resolve(self.repo, "HEAD"),
            paths,
            ("docs",),
            (),
            "ready",
            (),
            steps,
            source_hash,
            f"manual-{profile}-{len(steps)}",
        )

    def test_unapproved_script_requires_full(self) -> None:
        self.write("scripts/api-contracts.mjs", "changed\n")
        plan = core.build_plan(self.repo, "critical", self.base)
        self.assertEqual(plan.decision, "full-required")
        self.assertIn("unknown", plan.classifications)

    def test_reviewed_scope_requires_reason_and_test(self) -> None:
        self.write("scripts/gate.py", "changed\n")
        with self.assertRaises(core.GateError):
            core.build_plan(self.repo, "critical", self.base, reviewed_scope="ops")
        plan = core.build_plan(
            self.repo,
            "critical",
            self.base,
            (core.Step("focused-gate", (sys.executable, "-c", "pass")),),
            reviewed_scope="ops",
            review_reason="fake gate contract covers this reviewed orchestration scope",
        )
        self.assertEqual(plan.decision, "ready")
        self.assertTrue(any("Reviewed scope" in reason for reason in plan.reasons))

    def test_public_content_assets_select_content_validation(self) -> None:
        self.write("apps/web/public/content/task.txt", "changed asset")
        plan = core.build_plan(self.repo, "critical", self.base, (core.Step("focused", ("true",)),))
        self.assertEqual(plan.decision, "ready")
        self.assertIn("content-validation", [step.name for step in plan.steps])

    def test_api_critical_checks_generated_contract_and_consumer(self) -> None:
        self.write("apps/api/app/modules/practice/api.py", "changed endpoint")
        plan = core.build_plan(self.repo, "critical", self.base, (core.Step("focused", ("true",)),))
        self.assertEqual(plan.decision, "ready")
        names = {step.name for step in plan.steps}
        self.assertTrue({"api-contract", "web-typecheck"}.issubset(names))

    def test_release_requires_full_verified_baseline(self) -> None:
        plan = core.build_plan(self.repo, "release", "")
        self.assertEqual(plan.decision, "full-required")
        self.assertIn("40-character", " ".join(plan.reasons))

    def test_full_plan_has_migration_e2e_smoke_and_fresh_security(self) -> None:
        plan = core.build_plan(self.repo, "full", self.base)
        names = {step.name for step in plan.steps}
        self.assertTrue({"api-migrations", "e2e-list", "smoke", "fresh-security"}.issubset(names))
        self.assertEqual(plan.decision, "needs-review")

    def test_plan_hash_includes_explicit_commands(self) -> None:
        self.write("docs/readme.md", "changed\n")
        first = core.build_plan(
            self.repo, "critical", self.base, (core.Step("focused-a", ("true",)),)
        )
        second = core.build_plan(
            self.repo, "critical", self.base, (core.Step("focused-b", ("true",)),)
        )
        self.assertNotEqual(first.input_hash, second.input_hash)

    def test_failed_step_is_not_reused_and_source_change_invalidates(self) -> None:
        self.write("scripts/application_db.py", "changed\n")
        plan = self.executable_plan(
            core.Step("focused-fail", (sys.executable, "-c", "raise SystemExit(7)"))
        )
        status, report = core.execute(self.repo, plan)
        self.assertEqual(status, 7)
        saved = json.loads(report.read_text())
        self.assertEqual(saved["status"], "failed")
        with self.assertRaises(core.GateError):
            core.find_resume(
                self.repo,
                core.build_plan(
                    self.repo, "critical", self.base, (core.Step("focused-other", ("true",)),)
                ),
            )

        self.write("scripts/application_db.py", "changed again\n")
        changed_plan = self.executable_plan(
            core.Step(
                "focused-touch",
                (sys.executable, "-c", "from pathlib import Path; Path('marker').write_text('x')"),
            )
        )
        status, report = core.execute(self.repo, changed_plan)
        self.assertEqual(status, core.EXIT_NEEDS_REVIEW)
        self.assertEqual(json.loads(report.read_text())["status"], "invalidated")

    def test_state_permissions_are_private(self) -> None:
        root = core.state_root(self.repo)
        self.assertEqual(root.stat().st_mode & 0o777, 0o700)
        plan = core.build_plan(self.repo, "critical", self.base)
        report, _ = core.report_paths(self.repo, plan)
        core._atomic_json(report, {"ok": True})
        self.assertEqual(report.stat().st_mode & 0o777, 0o600)

    def test_resume_reruns_fresh_release_security(self) -> None:
        log = Path(self.temp.name) / "security.log"
        command = (
            sys.executable,
            "-c",
            f"from pathlib import Path; Path({str(log)!r}).open('a').write('x')",
        )
        plan = self.manual_plan("release", (core.Step("fresh-security", command),))
        status, _ = core.execute(self.repo, plan)
        self.assertEqual(status, 0)
        status, _ = core.execute(self.repo, plan, core.find_resume(self.repo, plan))
        self.assertEqual(status, 0)
        self.assertEqual(log.read_text(), "xx")

    def test_missing_build_artifact_forces_build_and_performance_on_resume(self) -> None:
        log = Path(self.temp.name) / "build.log"
        build = (
            sys.executable,
            "-c",
            "from pathlib import Path; "
            "Path('apps/web/.output/server').mkdir(parents=True); "
            "Path('apps/web/.output/server/index.mjs').write_text('ok'); "
            f"Path({str(log)!r}).open('a').write('b')",
        )
        performance = (
            sys.executable,
            "-c",
            f"from pathlib import Path; Path({str(log)!r}).open('a').write('p')",
        )
        plan = self.manual_plan(
            "critical",
            (core.Step("web-build", build), core.Step("performance", performance, "web-build")),
        )
        status, _ = core.execute(self.repo, plan)
        self.assertEqual(status, 0)
        shutil.rmtree(self.repo / "apps/web/.output")
        status, _ = core.execute(self.repo, plan, core.find_resume(self.repo, plan))
        self.assertEqual(status, 0)
        self.assertEqual(log.read_text(), "bpbp")

    def test_input_hash_tracks_untracked_and_environment(self) -> None:
        before = core.input_hash(
            self.repo, self.base, "critical", core.changed_paths(self.repo, self.base)
        )
        self.write("untracked-source.txt", "first")
        changed = core.input_hash(
            self.repo, self.base, "critical", core.changed_paths(self.repo, self.base)
        )
        self.assertNotEqual(before, changed)
        with patch.dict(os.environ, {"NODE_OPTIONS": "--trace-warnings"}):
            environment_changed = core.input_hash(
                self.repo, self.base, "critical", core.changed_paths(self.repo, self.base)
            )
        self.assertNotEqual(changed, environment_changed)

    def test_release_mixed_web_api_content_deduplicates_browser_steps(self) -> None:
        self.write("apps/web/src/example.ts", "export const example = 1\n")
        self.write("apps/api/app/modules/example.py", "EXAMPLE = 1\n")
        self.write("content/example.md", "example\n")
        environment = {
            "APP_ENV": "development",
            "TASK_FILES_DIR": str(Path(self.temp.name) / "task-files"),
            "MIGRATION_DATABASE_URL": "postgresql://infraege_migration:secret@127.0.0.1:15432/infraege",
            "IMPORT_DATABASE_URL": "postgresql://infraege_import:secret@127.0.0.1:15432/infraege",
            "DATABASE_URL": "postgresql://infraege_runtime:secret@127.0.0.1:15432/infraege",
            "ACCOUNT_DATABASE_URL": "postgresql://infraege_app:secret@127.0.0.1:15432/infraege",
        }
        with patch.dict(os.environ, environment):
            plan = core.build_plan(self.repo, "release", self.base, prepared_environment=True)
            full = core.build_plan(self.repo, "full", self.base, prepared_environment=True)
        # Precondition health and final smoke share a command, but protect different stages.
        self.assertTrue({"prepared-health", "smoke"}.issubset(step.name for step in full.steps))
        names = [step.name for step in plan.steps]
        self.assertEqual(plan.decision, "ready")
        self.assertEqual(names.count("web-build"), 1)
        self.assertEqual(names.count("e2e"), 1)
        self.assertTrue(any("pnpm validate:content" in " ".join(step.argv) for step in plan.steps))
        self.assertIn("fresh-security", names)

    def test_prepared_environment_rejects_production_or_non_loopback_urls(self) -> None:
        environment = {
            "APP_ENV": "production",
            "TASK_FILES_DIR": str(Path(self.temp.name) / "task-files"),
            "MIGRATION_DATABASE_URL": "postgresql://infraege_migration:secret@db:5432/infraege",
            "IMPORT_DATABASE_URL": "postgresql://infraege_import:secret@db:5432/infraege",
            "DATABASE_URL": "postgresql://infraege_runtime:secret@db:5432/infraege",
            "ACCOUNT_DATABASE_URL": "postgresql://infraege_app:secret@db:5432/infraege",
        }
        with patch.dict(os.environ, environment):
            plan = core.build_plan(self.repo, "full", self.base, prepared_environment=True)
        self.assertEqual(plan.decision, "needs-review")
        self.assertIn("APP_ENV", " ".join(plan.reasons))

    def test_sigterm_interrupts_ignoring_child_with_bounded_wait(self) -> None:
        result = Path(self.temp.name) / "interrupted.json"
        ready = Path(self.temp.name) / "ready"
        helper = Path(self.temp.name) / "run_gate.py"
        child = (
            sys.executable,
            "-c",
            "import signal,time; from pathlib import Path; "
            "signal.signal(signal.SIGTERM, signal.SIG_IGN); "
            f"Path({str(ready)!r}).touch(); time.sleep(30)",
        )
        helper.write_text(
            "import json, sys\n"
            f"sys.path.insert(0, {str(SCRIPTS)!r})\n"
            "from lib.gate import core\n"
            f"repo = __import__('pathlib').Path({str(self.repo)!r})\n"
            f"base = {self.base!r}\n"
            "paths = core.changed_paths(repo, base)\n"
            "source = core.input_hash(repo, base, 'critical', paths)\n"
            "plan = core.Plan('critical', base, core.resolve(repo, 'HEAD'), "
            "paths, ('ops',), (), 'ready', (), "
            f"(core.Step('sleep', {child!r}),), source, 'interrupt-test')\n"
            "status, report = core.execute(repo, plan)\n"
            f"__import__('pathlib').Path({str(result)!r}).write_text("
            "json.dumps({'status': status, 'report': str(report)}))\n"
        )
        process = subprocess.Popen(
            [sys.executable, str(helper)], env={**os.environ, "XDG_STATE_HOME": str(self.state)}
        )
        try:
            deadline = time.monotonic() + 10
            while not ready.exists() and time.monotonic() < deadline and process.poll() is None:
                time.sleep(0.02)
            self.assertTrue(ready.exists(), "child did not become ready")
            started = time.monotonic()
            process.terminate()
            process.wait(timeout=5)
            self.assertLess(time.monotonic() - started, 4)
        finally:
            if process.poll() is None:
                process.terminate()
                process.wait(timeout=5)
        payload = json.loads(result.read_text())
        self.assertEqual(payload["status"], 130)
        self.assertEqual(json.loads(Path(payload["report"]).read_text())["status"], "interrupted")


if __name__ == "__main__":
    unittest.main()
