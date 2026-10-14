from __future__ import annotations

import io
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.lib.gate import core

REPO = Path(__file__).resolve().parents[2]


def fake_runner(statuses: dict[str, int], calls: list[str]):
    def runner(argv: tuple[str, ...], **kwargs: object) -> subprocess.CompletedProcess[str]:
        name = next(group.name for group in core.GROUPS.values() if group.argv == argv)
        calls.append(name)
        handle = kwargs["stdout"]
        assert hasattr(handle, "write")
        for line in range(60):
            handle.write(f"{name} line {line}\n")  # type: ignore[union-attr]
        return subprocess.CompletedProcess(argv, statuses.get(name, 0))

    return runner


class GateGroupsTest(unittest.TestCase):
    def test_select_preserves_explicit_order_without_duplicates(self) -> None:
        groups = core.select(("web-lint", "api-lint", "web-lint"))

        self.assertEqual([group.name for group in groups], ["web-lint", "api-lint"])

    def test_select_rejects_missing_or_unknown_group(self) -> None:
        with self.assertRaisesRegex(core.GateError, "at least one"):
            core.select(())
        with self.assertRaisesRegex(core.GateError, "unknown group"):
            core.select(("not-a-group",))

    def test_run_summarizes_and_stops_at_first_failure(self) -> None:
        calls: list[str] = []
        out = io.StringIO()
        with tempfile.TemporaryDirectory() as repo:
            status = core.run(
                Path(repo),
                core.select(("format", "web-lint", "api-lint")),
                runner=fake_runner({"web-lint": 17}, calls),
                out=out,
            )
            log = (Path(repo) / core.LOG_DIR / "web-lint.log").read_text()

        self.assertEqual(status, 17)
        self.assertEqual(calls, ["format", "web-lint"])
        text = out.getvalue()
        self.assertRegex(text, r"format\s+PASS")
        self.assertRegex(text, r"web-lint\s+FAIL")
        self.assertIn("web-lint line 59", text)
        self.assertNotIn("web-lint line 0\n", text)
        self.assertNotIn("format line", text)
        self.assertIn("web-lint line 0\n", log)

    def test_keep_going_runs_every_group_and_keeps_first_failure(self) -> None:
        calls: list[str] = []
        with tempfile.TemporaryDirectory() as repo:
            status = core.run(
                Path(repo),
                core.select(("format", "web-lint", "api-lint")),
                runner=fake_runner({"format": 2, "api-lint": 5}, calls),
                keep_going=True,
                out=io.StringIO(),
            )

        self.assertEqual(status, 2)
        self.assertEqual(calls, ["format", "web-lint", "api-lint"])

    def test_missing_executable_is_a_failed_group_not_a_traceback(self) -> None:
        def runner(argv: tuple[str, ...], **_kwargs: object) -> subprocess.CompletedProcess[str]:
            raise FileNotFoundError(argv[0])

        out = io.StringIO()
        with tempfile.TemporaryDirectory() as repo:
            status = core.run(
                Path(repo),
                core.select(("format", "web-lint")),
                runner=runner,
                keep_going=True,
                out=out,
            )

        self.assertEqual(status, 127)
        self.assertRegex(out.getvalue(), r"web-lint\s+FAIL")

    def test_api_groups_avoid_login_shell(self) -> None:
        for name in ("api-lint", "host-ruff", "python-format"):
            self.assertEqual(core.GROUPS[name].argv[:2], ("bash", "-c"), name)

    def test_checks_lists_plain_command_groups(self) -> None:
        completed = subprocess.run(
            [sys.executable, "scripts/gate.py", "checks"],
            cwd=REPO,
            text=True,
            capture_output=True,
            check=True,
        )

        payload = json.loads(completed.stdout)
        self.assertIn({"name": "format", "argv": ["pnpm", "format:check"]}, payload["groups"])
        self.assertNotIn("evidence", completed.stdout)
        self.assertNotIn("snapshot", completed.stdout)

    def test_host_python_has_one_source_and_no_nested_duplicates(self) -> None:
        paths = core.host_python_paths()
        config = json.loads((REPO / "scripts/pyrightconfig.json").read_text())

        self.assertIn("scripts/lesson_design", paths)
        self.assertIn("scripts/tests", paths)
        self.assertNotIn("scripts/tests/gate_test.py", paths)
        for entry in config["include"]:
            path = str(Path("scripts", entry).resolve().relative_to(REPO))
            self.assertTrue(
                any(path == item or path.startswith(f"{item}/") for item in paths), path
            )
        for path in paths:
            self.assertTrue((REPO / path).exists(), path)
        host_ruff = " ".join(core.GROUPS["host-ruff"].argv)
        self.assertIn("../../scripts/mascot", host_ruff)

    def test_unsupported_resume_interface_is_rejected(self) -> None:
        completed = subprocess.run(
            [sys.executable, "scripts/gate.py", "resume", "--group", "format"],
            cwd=REPO,
            text=True,
            capture_output=True,
        )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("invalid choice", completed.stderr)


class AffectedTest(unittest.TestCase):
    def test_docs_only_change_needs_only_link_check(self) -> None:
        suggestion = core.suggest(("docs/STACK.md", "docs/changes/archive/COMPACTED.md"))

        self.assertEqual(suggestion.groups, ("docs-links",))
        self.assertEqual(suggestion.unmatched, ())

    def test_web_source_change_suggests_static_groups_and_reminders(self) -> None:
        suggestion = core.suggest(("apps/web/src/pages/home/home.tsx",))

        self.assertEqual(suggestion.groups, ("format", "web-lint", "web-typecheck"))
        self.assertTrue(any("Playwriter" in item for item in suggestion.reminders))
        self.assertTrue(any("Vitest" in item for item in suggestion.reminders))

    def test_lesson_stand_text_checks_generated_media(self) -> None:
        suggestion = core.suggest(("content/lesson-design/topic-25/05-maski.md",))

        self.assertIn("lesson-media", suggestion.groups)
        self.assertNotIn("content-static", suggestion.groups)

    def test_paths_map_to_owning_groups(self) -> None:
        cases = {
            "apps/api/app/main.py": (
                "python-format",
                "api-lint",
                "api-typecheck",
                "api-contract",
            ),
            "content/practice-bank/bank.json": ("format", "content-static"),
            "scripts/backup.sh": ("shell-lint",),
            "infra/nginx/nginx.conf": ("infra-config",),
            "scripts/release_checkpoint.py": (
                "python-format",
                "host-ruff",
                "host-python",
            ),
        }
        for path, expected in cases.items():
            with self.subTest(path=path):
                self.assertEqual(core.suggest((path,)).groups, expected)

    def test_unknown_path_requires_a_coverage_decision(self) -> None:
        suggestion = core.suggest(("VERSION",))

        self.assertEqual(suggestion.groups, ())
        self.assertEqual(suggestion.unmatched, ("VERSION",))
        self.assertIn("decide: VERSION", core.describe(suggestion))

    def test_changed_paths_merge_branch_worktree_and_untracked(self) -> None:
        outputs = iter(("a.md\nb.md\n", "b.md\nc.py\n", "d.sh\n"))

        def runner(argv: tuple[str, ...], **_kwargs: object) -> subprocess.CompletedProcess[str]:
            return subprocess.CompletedProcess(argv, 0, next(outputs), "")

        self.assertEqual(
            core.changed_paths(REPO, "main", runner=runner),
            ("a.md", "b.md", "c.py", "d.sh"),
        )


if __name__ == "__main__":
    unittest.main()
