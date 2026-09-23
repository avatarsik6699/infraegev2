"""Focused release evidence tests with mocked GitHub and public HTTP transport."""

from __future__ import annotations

import importlib.util
import io
import json
import stat
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
MODULE_SPEC = importlib.util.spec_from_file_location(
    "release_checkpoint", ROOT / "scripts/release_checkpoint.py"
)
assert MODULE_SPEC and MODULE_SPEC.loader
checkpoint = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(checkpoint)

SHA = "a" * 40
REPOSITORY = "example/infraege"


def run(
    identifier: int, *, workflow: str, status: str = "completed", conclusion: str | None = "success"
) -> dict:
    result = {
        "id": identifier,
        "head_sha": SHA,
        "status": status,
        "conclusion": conclusion,
        "html_url": f"https://github.example/runs/{identifier}",
        "workflow": workflow,
        "event": "workflow_dispatch" if workflow == "deploy.yml" else "push",
        "head_branch": "main",
    }
    if workflow == "deploy.yml":
        result["display_title"] = f"Deploy {SHA}"
    return result


def response(payload: object):
    return type("Result", (), {"returncode": 0, "stdout": json.dumps(payload), "stderr": ""})()


# GitHub's default name for an unnamed matrix job lists every matrix value (images.yml).
MATRIX_JOB_NAMES = {
    "web": "images (web, apps/web/Dockerfile, web-v3)",
    "api": "images (api, apps/api/Dockerfile, api)",
    "nginx": "images (nginx, infra/nginx/Dockerfile, nginx)",
}


def image_jobs(*, successful: set[str] | None = None) -> dict:
    successful = successful if successful is not None else {"web", "api", "nginx"}
    return {
        "jobs": [
            {
                "name": MATRIX_JOB_NAMES[name],
                "status": "completed",
                "conclusion": "success",
                "steps": [
                    {
                        "name": "Scan published image",
                        "status": "completed",
                        "conclusion": "success" if name in successful else "failure",
                    }
                ],
            }
            for name in ("web", "api", "nginx")
        ]
    }


class FakeHttp:
    def __init__(self, status: int, body: bytes):
        self.status = status
        self._body = io.BytesIO(body)

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self, size: int = -1) -> bytes:
        return self._body.read(size)


class ReleaseCheckpointTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.state = Path(self.temp.name) / "state"
        self.gh_calls: list[list[str]] = []

    def tearDown(self):
        self.temp.cleanup()

    def gh_success(self, command, **_kwargs):
        self.gh_calls.append(command)
        endpoint = command[-1]
        if "quality.yml/runs" in endpoint:
            return response({"workflow_runs": [run(11, workflow="quality.yml")]})
        if "images.yml/runs" in endpoint:
            return response({"workflow_runs": [run(12, workflow="images.yml")]})
        if "/jobs?" in endpoint:
            return response(image_jobs())
        if "deploy.yml/runs" in endpoint:
            return response({"workflow_runs": [run(13, workflow="deploy.yml")]})
        raise AssertionError(command)

    def invoke(self, phase: str = "predeploy") -> int:
        return checkpoint.main(
            [
                phase,
                "--sha",
                SHA,
                "--repo",
                REPOSITORY,
                "--state-dir",
                str(self.state),
                "--gh",
                "fake-gh",
            ]
        )

    @property
    def checkpoint_file(self) -> Path:
        return self.state / REPOSITORY.replace("/", "--") / f"{SHA}.json"

    def test_predeploy_records_fresh_ci_and_published_digest_scan_evidence(self):
        with patch.object(checkpoint.subprocess, "run", side_effect=self.gh_success):
            self.assertEqual(self.invoke(), 0)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertEqual(stored["current"]["status"], "pass")
        self.assertEqual(
            stored["current"]["evidence"]["images"]["published_digest_scans"],
            ["api", "nginx", "web"],
        )
        self.assertTrue(any("quality.yml/runs" in call[-1] for call in self.gh_calls))
        self.assertTrue(any("images.yml/runs" in call[-1] for call in self.gh_calls))
        self.assertEqual(stat.S_IMODE(self.state.stat().st_mode), 0o700)
        self.assertEqual(stat.S_IMODE(self.checkpoint_file.stat().st_mode), 0o600)

    def test_previous_pass_cannot_mask_a_fresh_failed_workflow(self):
        with patch.object(checkpoint.subprocess, "run", side_effect=self.gh_success):
            self.assertEqual(self.invoke(), 0)

        def failed_quality(command, **_kwargs):
            if "quality.yml/runs" in command[-1]:
                return response(
                    {
                        "workflow_runs": [
                            run(11, workflow="quality.yml"),
                            run(12, workflow="quality.yml", conclusion="failure"),
                        ]
                    }
                )
            return self.gh_success(command)

        with patch.object(checkpoint.subprocess, "run", side_effect=failed_quality):
            self.assertEqual(self.invoke(), 1)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertEqual(stored["current"]["status"], "fail")
        self.assertIn("latest quality.yml run", stored["current"]["error"])
        self.assertEqual(stored["history"][0]["status"], "pass")

    def test_missing_pending_and_malformed_workflow_evidence_fail_closed(self):
        for payload, expected in (
            ({"workflow_runs": []}, "no main push quality.yml run"),
            (
                {
                    "workflow_runs": [
                        run(11, workflow="quality.yml", status="in_progress", conclusion=None)
                    ]
                },
                "latest quality.yml run",
            ),
            ({"workflow_runs": "not-a-list"}, "no workflow_runs list"),
        ):
            with self.subTest(payload=payload):

                def fake(command, payload=payload, **_kwargs):
                    if "quality.yml/runs" in command[-1]:
                        return response(payload)
                    return self.gh_success(command)

                with patch.object(checkpoint.subprocess, "run", side_effect=fake):
                    self.assertEqual(self.invoke(), 1)
                stored = json.loads(self.checkpoint_file.read_text())
                self.assertEqual(stored["current"]["status"], "fail")
                self.assertIn(expected, stored["current"]["error"])

    def test_missing_published_digest_scan_fails(self):
        def fake(command, **_kwargs):
            if "/jobs?" in command[-1]:
                return response(image_jobs(successful={"web", "api"}))
            return self.gh_success(command)

        with patch.object(checkpoint.subprocess, "run", side_effect=fake):
            self.assertEqual(self.invoke(), 1)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertIn("nginx", stored["current"]["error"])

    def test_image_name_is_the_first_matrix_value_not_a_prefix(self):
        jobs = image_jobs()
        jobs["jobs"][0]["name"] = "images (web-extra, apps/web/Dockerfile, web-v3)"

        def fake(command, **_kwargs):
            if "/jobs?" in command[-1]:
                return response(jobs)
            return self.gh_success(command)

        with patch.object(checkpoint.subprocess, "run", side_effect=fake):
            self.assertEqual(self.invoke(), 1)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertIn("web", stored["current"]["error"])

    def test_postdeploy_rejects_workflow_head_sha_without_matching_dispatch_target(self):
        def fake(command, **_kwargs):
            if "deploy.yml/runs" in command[-1]:
                wrong = run(13, workflow="deploy.yml")
                wrong["display_title"] = f"Deploy {'b' * 40}"
                return response({"workflow_runs": [wrong]})
            return self.gh_success(command)

        with patch.object(checkpoint.subprocess, "run", side_effect=fake):
            self.assertEqual(self.invoke("postdeploy"), 1)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertIn("workflow_dispatch run proves target", stored["current"]["error"])

    def test_postdeploy_requires_well_formed_public_identity_and_homepage(self):
        calls = iter((FakeHttp(200, b'{"status":"ok","version":"wrong"}'),))
        with (
            patch.object(checkpoint.subprocess, "run", side_effect=self.gh_success),
            patch.object(checkpoint, "urlopen", side_effect=lambda *_args, **_kwargs: next(calls)),
        ):
            self.assertEqual(self.invoke("postdeploy"), 1)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertEqual(stored["current"]["status"], "fail")
        self.assertIn("exact SHA", stored["current"]["error"])

    def test_postdeploy_rejects_redirect_to_different_target(self):
        response = FakeHttp(200, json.dumps({"status": "ok", "version": SHA}).encode())
        with (
            patch.object(checkpoint.subprocess, "run", side_effect=self.gh_success),
            patch.object(checkpoint, "urlopen", return_value=response),
            patch.object(FakeHttp, "geturl", create=True, return_value="https://other.example/"),
        ):
            self.assertEqual(self.invoke("postdeploy"), 1)
        stored = json.loads(self.checkpoint_file.read_text())
        self.assertEqual(stored["current"]["status"], "fail")
        self.assertIn("redirected", stored["current"]["error"])

    def test_postdeploy_rejects_mismatched_endpoint_origins_before_network(self):
        with patch.object(checkpoint, "urlopen") as request:
            with self.assertRaisesRegex(checkpoint.CheckpointError, "same configured"):
                checkpoint.verify_public_release(
                    "https://infraege.ru/health/ready", "https://other.example/", SHA
                )
            request.assert_not_called()

    def test_public_probe_rejects_non_https_urls_before_network(self):
        rejected = (
            "file:///etc/passwd",
            "http://infraege.ru/health/ready",
            "https://user:secret@infraege.ru/health/ready",
            "https://infraege.ru/health/ready?x=1",
            "https://infraege.ru/health/ready#frag",
        )
        with patch.object(checkpoint, "urlopen") as request:
            for url in rejected:
                with self.subTest(url=url):
                    with self.assertRaisesRegex(
                        checkpoint.CheckpointError, "credential-free HTTPS"
                    ):
                        checkpoint.http_json(url)
                    with self.assertRaisesRegex(
                        checkpoint.CheckpointError, "credential-free HTTPS"
                    ):
                        checkpoint.verify_public_release(url, url, SHA)
            request.assert_not_called()

    def test_invalid_sha_does_not_create_state(self):
        self.assertEqual(
            checkpoint.main(["predeploy", "--sha", "not-a-sha", "--state-dir", str(self.state)]),
            1,
        )
        self.assertFalse(self.state.exists())

    def test_atomic_write_keeps_previous_checkpoint_when_replace_fails(self):
        with patch.object(checkpoint.subprocess, "run", side_effect=self.gh_success):
            self.assertEqual(self.invoke(), 0)
        before = self.checkpoint_file.read_bytes()
        with (
            patch.object(checkpoint.subprocess, "run", side_effect=self.gh_success),
            patch.object(checkpoint.os, "replace", side_effect=OSError("synthetic interruption")),
        ):
            self.assertEqual(
                checkpoint.main(
                    [
                        "predeploy",
                        "--sha",
                        SHA,
                        "--repo",
                        REPOSITORY,
                        "--state-dir",
                        str(self.state),
                        "--gh",
                        "fake-gh",
                    ]
                ),
                1,
            )
        self.assertEqual(self.checkpoint_file.read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
