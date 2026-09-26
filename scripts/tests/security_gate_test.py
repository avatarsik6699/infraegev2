"""Fake-command contracts for security range and dependency audits."""

from __future__ import annotations

import os
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts/security-gate.sh"
BASE = "a" * 40
HEAD = "b" * 40


class SecurityGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.temp_path = Path(self.temp.name)
        self.bin = self.temp_path / "bin"
        self.bin.mkdir()
        self.calls = self.temp_path / "calls.log"
        self._write_executable(
            "git",
            """#!/usr/bin/env bash
set -eu
printf 'git %s\\n' "$*" >> "$SECURITY_CALLS"
case " $* " in
  *' show '*)
    last=${!#}
    revision=${last%%:*}
    if [[ "$revision" == "$SECURITY_BASE" ]]; then
      if [[ -v SECURITY_BASE_MANIFEST_CONTENT ]]; then
        printf '%s' "$SECURITY_BASE_MANIFEST_CONTENT"
      else
        printf '{}'
      fi
    elif [[ "$revision" == "$SECURITY_HEAD" ]]; then
      if [[ -v SECURITY_HEAD_MANIFEST_CONTENT ]]; then
        printf '%s' "$SECURITY_HEAD_MANIFEST_CONTENT"
      else
        printf '{}'
      fi
    else
      exit 1
    fi
    ;;
  *' rev-parse --verify HEAD '*) printf '%s\\n' "$SECURITY_HEAD" ;;
  *' rev-parse --verify '*)
    last=${!#}
    commit=${last:0:40}
    if [[ "${SECURITY_UNKNOWN_BASE:-}" == "$commit" ]]; then exit 1; fi
    printf '%s\\n' "$commit"
    ;;
  *' merge-base --is-ancestor '*) exit 0 ;;
  *' rev-list --count '*) printf '1\\n' ;;
  *' diff --quiet '*)
    case "${SECURITY_DIRTY_PATH:-}" in
      */package.json)
        if [[ "$*" == *':(glob)**/package.json'* ]]; then exit 1; fi
        ;;
      *)
        if [[ -n "${SECURITY_DIRTY_PATH:-}" && " $* " == *" $SECURITY_DIRTY_PATH "* ]]; then
          exit 1
        fi
        ;;
    esac
    exit 0
    ;;
  *' diff --name-only '*) printf '%s\\n' "${SECURITY_CHANGED_PATHS:-}" ;;
  *) exit 0 ;;
esac
""",
        )
        self._write_executable(
            "docker",
            """#!/usr/bin/env bash
printf 'docker %s\\n' "$*" >> "$SECURITY_CALLS"
""",
        )
        for command in ("pnpm", "uvx"):
            self._write_executable(
                command,
                f"""#!/usr/bin/env bash
printf '{command} %s\\n' \"$*\" >> \"$SECURITY_CALLS\"
""",
            )
        self._write_executable(
            "uv",
            """#!/usr/bin/env bash
printf 'uv %s\\n' "$*" >> "$SECURITY_CALLS"
if [[ "${SECURITY_UV_EXPORT_FAILURE:-}" == 1 ]]; then exit 17; fi
""",
        )

    def _write_executable(self, name: str, body: str) -> None:
        command = self.bin / name
        command.write_text(body)
        command.chmod(0o755)

    def run_gate(self, *args: str, **extra_env: str) -> subprocess.CompletedProcess[str]:
        env = os.environ.copy()
        env.update(
            {
                "PATH": f"{self.bin}{os.pathsep}{env['PATH']}",
                "SECURITY_CALLS": str(self.calls),
                "SECURITY_BASE": BASE,
                "SECURITY_HEAD": HEAD,
                **extra_env,
            }
        )
        return subprocess.run(
            ["bash", str(SCRIPT), *args],
            cwd=ROOT,
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )

    def logged_calls(self) -> str:
        return self.calls.read_text() if self.calls.exists() else ""

    def test_pre_push_passes_the_complete_unpublished_commit_range_to_gitleaks(self):
        result = self.run_gate("pre-push", BASE, HEAD)

        self.assertEqual(result.returncode, 0, result.stderr)
        calls = self.logged_calls()
        self.assertIn(f"merge-base --is-ancestor {BASE} {HEAD}", calls)
        self.assertIn(f"rev-list --count {BASE}..{HEAD}", calls)
        self.assertIn(f"git --log-opts={BASE}..{HEAD}", calls)
        self.assertIn("--config=/src/.gitleaks.toml", calls)
        self.assertNotIn("--no-git", calls)

    def test_pre_push_fails_closed_when_base_commit_is_unknown(self):
        result = self.run_gate("pre-push", BASE, HEAD, SECURITY_UNKNOWN_BASE=BASE)

        self.assertEqual(result.returncode, 2)
        self.assertIn("base commit is unavailable", result.stderr)
        self.assertNotIn("docker ", self.logged_calls())

    def test_pre_push_rejects_a_stale_candidate_head(self):
        result = self.run_gate("pre-push", BASE, HEAD, SECURITY_HEAD="c" * 40)

        self.assertEqual(result.returncode, 2)
        self.assertIn("head must be the checked-out commit", result.stderr)
        self.assertNotIn("docker ", self.logged_calls())

    def test_changed_dependencies_fails_closed_for_dirty_manifest_or_lockfile(self):
        for dirty_path in ("apps/web/package.json", "pnpm-lock.yaml", "apps/api/uv.lock"):
            with self.subTest(dirty_path=dirty_path):
                self.calls.unlink(missing_ok=True)
                result = self.run_gate(
                    "changed-dependencies", BASE, HEAD, SECURITY_DIRTY_PATH=dirty_path
                )

                self.assertEqual(result.returncode, 2)
                self.assertIn(
                    "dependency manifests or lockfiles have uncommitted changes", result.stderr
                )
                self.assertNotIn("pnpm ", self.logged_calls())
                self.assertNotIn("uvx ", self.logged_calls())

    def test_python_export_failure_cannot_become_a_green_dependency_audit(self):
        result = self.run_gate(
            "changed-dependencies",
            BASE,
            HEAD,
            SECURITY_CHANGED_PATHS="apps/api/uv.lock",
            SECURITY_UV_EXPORT_FAILURE="1",
        )

        self.assertEqual(result.returncode, 17)
        self.assertIn("uv export --locked --all-groups", self.logged_calls())
        self.assertNotIn("uvx ", self.logged_calls())

    def test_package_scripts_only_change_skips_pnpm_audit(self):
        result = self.run_gate(
            "changed-dependencies",
            BASE,
            HEAD,
            SECURITY_CHANGED_PATHS="apps/web/package.json",
            SECURITY_BASE_MANIFEST_CONTENT='{"scripts":{"test":"old"}}',
            SECURITY_HEAD_MANIFEST_CONTENT='{"scripts":{"test":"new"}}',
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn("\npnpm ", self.logged_calls())
        self.assertIn("no ecosystem audit needed", result.stdout)

    def test_package_dependency_change_runs_pnpm_audit(self):
        result = self.run_gate(
            "changed-dependencies",
            BASE,
            HEAD,
            SECURITY_CHANGED_PATHS="apps/web/package.json",
            SECURITY_BASE_MANIFEST_CONTENT='{"dependencies":{"old":"1.0.0"}}',
            SECURITY_HEAD_MANIFEST_CONTENT='{"dependencies":{"new":"1.0.0"}}',
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("pnpm audit --audit-level high", self.logged_calls())

    def test_pyproject_test_marker_only_change_skips_python_audit(self):
        prefix = '[project]\nname = "example"\ndependencies = ["fastapi"]\n'
        prefix += "\n[tool.pytest.ini_options]\n"
        before = prefix + 'markers = ["pure"]\n'
        after = prefix + 'markers = ["pure", "db"]\n'
        result = self.run_gate(
            "changed-dependencies",
            BASE,
            HEAD,
            SECURITY_CHANGED_PATHS="apps/api/pyproject.toml",
            SECURITY_BASE_MANIFEST_CONTENT=before,
            SECURITY_HEAD_MANIFEST_CONTENT=after,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn("\nuv export ", self.logged_calls())
        self.assertIn("no ecosystem audit needed", result.stdout)

    def test_dependency_group_change_runs_python_audit(self):
        result = self.run_gate(
            "changed-dependencies",
            BASE,
            HEAD,
            SECURITY_CHANGED_PATHS="apps/api/pyproject.toml",
            SECURITY_BASE_MANIFEST_CONTENT='[dependency-groups]\ndev = ["pytest"]\n',
            SECURITY_HEAD_MANIFEST_CONTENT='[dependency-groups]\ndev = ["pytest", "ruff"]\n',
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("uv export --locked --all-groups", self.logged_calls())
        self.assertIn("uvx --from pip-audit==2.10.1", self.logged_calls())

    def test_malformed_dependency_manifest_fails_closed(self):
        malformed = (
            ("apps/web/package.json", "not json", "{}"),
            ("apps/api/pyproject.toml", "not toml", "[project]\nname = 'ok'\n"),
        )
        for path, before, after in malformed:
            with self.subTest(path=path):
                self.calls.unlink(missing_ok=True)
                result = self.run_gate(
                    "changed-dependencies",
                    BASE,
                    HEAD,
                    SECURITY_CHANGED_PATHS=path,
                    SECURITY_BASE_MANIFEST_CONTENT=before,
                    SECURITY_HEAD_MANIFEST_CONTENT=after,
                )

                self.assertEqual(result.returncode, 2)
                self.assertIn("could not classify dependency fields", result.stderr)
                self.assertNotIn("\npnpm ", self.logged_calls())
                self.assertNotIn("\nuv export ", self.logged_calls())

    def test_pnpm_lockfile_and_workspace_policy_always_run_audit(self):
        for changed_path in ("pnpm-lock.yaml", "pnpm-workspace.yaml"):
            with self.subTest(changed_path=changed_path):
                self.calls.unlink(missing_ok=True)
                result = self.run_gate(
                    "changed-dependencies", BASE, HEAD, SECURITY_CHANGED_PATHS=changed_path
                )

                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn("pnpm audit --audit-level high", self.logged_calls())


if __name__ == "__main__":
    unittest.main()
