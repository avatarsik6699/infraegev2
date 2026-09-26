from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

from scripts.lib.gate import core

REPO = Path(__file__).resolve().parents[2]


class GateGroupsTest(unittest.TestCase):
    def test_select_preserves_explicit_order(self) -> None:
        groups = core.select(("web-lint", "api-lint"))

        self.assertEqual([group.name for group in groups], ["web-lint", "api-lint"])

    def test_select_rejects_missing_or_unknown_group(self) -> None:
        with self.assertRaisesRegex(core.GateError, "at least one"):
            core.select(())
        with self.assertRaisesRegex(core.GateError, "unknown group"):
            core.select(("not-a-group",))

    def test_run_stops_at_first_failure(self) -> None:
        calls: list[tuple[str, ...]] = []

        def runner(argv: tuple[str, ...], **_kwargs: object) -> subprocess.CompletedProcess[str]:
            calls.append(argv)
            return subprocess.CompletedProcess(argv, 17)

        status = core.run(REPO, core.select(("format", "web-lint")), runner=runner)

        self.assertEqual(status, 17)
        self.assertEqual(calls, [("pnpm", "format:check")])

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

    def test_unsupported_resume_interface_is_rejected(self) -> None:
        completed = subprocess.run(
            [sys.executable, "scripts/gate.py", "resume", "--group", "format"],
            cwd=REPO,
            text=True,
            capture_output=True,
        )

        self.assertNotEqual(completed.returncode, 0)
        self.assertIn("invalid choice", completed.stderr)


if __name__ == "__main__":
    unittest.main()
