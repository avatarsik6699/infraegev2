"""Exercise the real Compose helper + installed failure boundary without host mutations."""

import os
import re
import subprocess
import tempfile
import textwrap
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def workflow_step(name: str) -> str:
    source = (ROOT / ".github/workflows/deploy.yml").read_text()
    step = source.split(f"      - name: {name}\n", 1)[1].split("      - name:", 1)[0]
    return textwrap.dedent(step.split("        run: |\n", 1)[1])


class DeployTransportTests(unittest.TestCase):
    def test_stdin_consuming_child_cannot_truncate_remote_program(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "scripts/lib").mkdir(parents=True)
            # Consume all inherited stdin before the final deployment action.
            (root / "scripts/deploy-remote.sh").write_text("cat >/dev/null\necho ACTIVATED\n")
            (root / "scripts/lib/production-ssh.sh").write_text(r"""
production_ssh_init() { :; }
production_scp() { cp "$1" "$TEST_REMOTE"; }
production_ssh() {
  local command=${1//\/root\/infraege-deploy-$DEPLOY_SHA.sh/$TEST_REMOTE}
  bash -c "$command"
}
""")
            result = subprocess.run(
                ["bash", "-e", "-o", "pipefail", "-s"],
                input=workflow_step("Deploy and verify with rollback"),
                cwd=root,
                env={
                    **os.environ,
                    "DEPLOY_SHA": "a" * 40,
                    "PROD_HOST": "synthetic",
                    "TEST_REMOTE": str(root / "uploaded.sh"),
                },
                text=True,
                capture_output=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), "ACTIVATED")

    def test_independent_public_check_rejects_false_remote_success(self):
        for sha in ("a" * 40, "b" * 40):
            with self.subTest(sha=sha):
                program = (
                    "DEPLOY_SHA="
                    + "a" * 40
                    + "\n"
                    + 'curl() { printf \'%s\\n\' \'{"status":"ok","version":"'
                    + sha
                    + "\"}'; }\n"
                    + workflow_step("Verify public release identity")
                )
                result = subprocess.run(
                    ["bash", "-e", "-o", "pipefail", "-c", program], capture_output=True
                )
                self.assertEqual(result.returncode == 0, sha == "a" * 40)


class DeployFailureTests(unittest.TestCase):
    def test_migration_failure_blocks_activation_and_recovers_once(self):
        source = (ROOT / "scripts/deploy-remote.sh").read_text()
        lines = [
            line
            for line in source.splitlines()
            if line.startswith('run_compose "$release_dir" "$DEPLOY_SHA"')
            and ("db-migrate" in line or "up --detach --remove-orphans" in line)
        ]
        self.assertEqual(len(lines), 2)
        for failure in (True, False):
            program = f'''set -euo pipefail
source "{ROOT}/scripts/lib/application-db-release.sh"
release_dir=/candidate
DEPLOY_SHA={"a" * 40}
run_compose() {{
  if [[ "$*" == *db-migrate ]]; then echo MIGRATION; return {42 if failure else 0}; fi
  echo ACTIVATE
}}
application_db_rollback() {{ echo ROLLBACK; }}
trap 'application_deploy_exit "$?" /previous /candidate /unused false' EXIT
{chr(10).join(lines)}
'''
            result = subprocess.run(["bash", "-c", program], capture_output=True, text=True)
            self.assertEqual(result.returncode, 42 if failure else 0)
            self.assertEqual(
                result.stdout.splitlines(),
                ["MIGRATION", "ROLLBACK"] if failure else ["MIGRATION", "ACTIVATE"],
            )

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

    def test_successful_recovery_restores_maintenance_pointer(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            previous = root / "previous"
            previous.mkdir()
            (previous / ".deploy-sha").write_text("a" * 40)
            program = f'''set -euo pipefail
source "{ROOT}/scripts/lib/application-db-release.sh"
root="{root}"
run_compose() {{ :; }}
curl() {{ echo '{{"status":"ok","version":"{"a" * 40}"}}'; }}
application_db_rollback "{previous}"
'''
            subprocess.run(["bash", "-c", program], check=True, capture_output=True)
            self.assertEqual((root / "current").resolve(), previous)
            self.assertEqual((root / "database-current").resolve(), previous)

    def test_recovery_rejects_wrong_release_health(self):
        with tempfile.TemporaryDirectory() as temp:
            previous = Path(temp)
            (previous / ".deploy-sha").write_text("a" * 40)
            program = f'''set -euo pipefail
source "{ROOT}/scripts/lib/application-db-release.sh"
run_compose() {{ echo COMPOSE; }}
curl() {{ echo '{{"status":"ok","version":"wrong-release"}}'; }}
if application_db_rollback "{previous}" /candidate /unused true; then exit 99; fi
'''
            result = subprocess.run(["bash", "-c", program], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0)
            self.assertEqual(result.stdout.count("COMPOSE"), 1)


if __name__ == "__main__":
    unittest.main()
