"""The shell contract executes the shared disposable phase through fake local transport only."""

from __future__ import annotations

import subprocess
import unittest
from pathlib import Path


class AccountCutoverDrillTest(unittest.TestCase):
    def test_fixture_transport_runs_the_shared_two_stage_phase(self) -> None:
        repository = Path(__file__).resolve().parents[2]
        completed = subprocess.run(
            ["bash", "scripts/tests/account-cutover.test.sh"],
            cwd=repository,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertIn("account cutover", completed.stdout)


if __name__ == "__main__":
    unittest.main()
