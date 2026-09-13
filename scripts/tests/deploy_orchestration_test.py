"""Exercise the real Compose helper + installed failure boundary without host mutations."""

import re
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class DeployFailureTests(unittest.TestCase):
    def run_failure(self, rollback_fails: bool = False, explicit: bool = False):
        source = (ROOT / "scripts/deploy-remote.sh").read_text()
        helper = re.search(r"run_compose\(\) \{\n.*?\n\}", source, re.S)
        assert helper is not None
        # Extract actual installed traps so reverting EXIT to ERR makes this test fail.
        traps = "\n".join(
            line
            for line in source.splitlines()
            if line.startswith("trap ") and not line.startswith("trap -")
        )
        program = f'''set -euo pipefail
source "{ROOT}/scripts/lib/application-db-release.sh"
{helper.group()}
env_file=/unused
previous_release=/previous
release_dir=/candidate
db_switched=true
application_db_rollback() {{ echo ROLLBACK; return {17 if rollback_fails else 0}; }}
docker() {{ return 42; }}
{traps}
{"exit 42" if explicit else "run_compose /candidate " + "a" * 40 + " up"}
'''
        return subprocess.run(["bash", "-c", program], capture_output=True, text=True)

    def test_compose_failure_rolls_back_once(self):
        result = self.run_failure()
        self.assertEqual(result.returncode, 42)
        self.assertEqual(result.stdout.count("ROLLBACK"), 1)
        self.assertIn("restored and verified", result.stderr)

    def test_failed_rollback_preserves_original_status(self):
        result = self.run_failure(rollback_fails=True)
        self.assertEqual(result.returncode, 42)
        self.assertEqual(result.stdout.count("ROLLBACK"), 1)
        self.assertIn("manual recovery", result.stderr)

    def test_explicit_exit_rolls_back(self):
        self.assertEqual(self.run_failure(explicit=True).stdout.count("ROLLBACK"), 1)

    def test_environment_validation_fails_in_production_conditional_context(self):
        source = (ROOT / "scripts/deploy-remote.sh").read_text()
        helper = re.search(r"validate_production_env\(\) \{\n.*?\n\}", source, re.S)
        assert helper is not None
        with tempfile.TemporaryDirectory() as temp:
            env = Path(temp) / "invalid.env"
            env.write_text("VALUE=first nonexistent_synthetic_command\n")
            program = (
                "set -euo pipefail\n"
                + helper.group()
                + '\nif validate_production_env "$1"; then exit 99; else exit 0; fi'
            )
            result = subprocess.run(["bash", "-c", program, "test", str(env)], capture_output=True)
            self.assertEqual(result.returncode, 0)

    def test_recovery_rejects_wrong_release_health(self):
        with tempfile.TemporaryDirectory() as temp:
            previous = Path(temp)
            (previous / ".deploy-sha").write_text("a" * 40)
            program = f'''set -euo pipefail
source "{ROOT}/scripts/lib/application-db-release.sh"
docker() {{ echo COMPOSE; }}
curl() {{ echo '{{"status":"ok","version":"wrong-release"}}'; }}
if application_db_rollback "{previous}" /candidate /unused true; then exit 99; fi
'''
            result = subprocess.run(["bash", "-c", program], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0)
            self.assertEqual(result.stdout.count("COMPOSE"), 1)


if __name__ == "__main__":
    unittest.main()
