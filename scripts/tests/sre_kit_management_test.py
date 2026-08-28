import importlib.util
import json
import pathlib
import sys
import tempfile
import unittest
from typing import Any
from unittest import mock

ROOT = pathlib.Path(__file__).parents[2]
MODULE_PATH = ROOT / "ops/management/reconcile-sources.py"
SPEC = importlib.util.spec_from_file_location("reconcile_sources", MODULE_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("could not load source reconciler")
MODULE: Any = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class FakeAPI:
    def __init__(self) -> None:
        self.projects: list[dict[str, Any]] = []
        self.sources: list[dict[str, Any]] = []
        self.rotations = 0

    def request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        *,
        expected: set[int],
    ) -> Any:
        del expected
        if method == "GET" and path == "/api/projects":
            return self.projects
        if method == "POST" and path == "/api/projects":
            assert payload is not None
            project = {"id": "project-1", **payload}
            self.projects.append(project)
            return project
        if method == "GET" and path == "/api/sources":
            return self.sources
        if method == "POST" and path == "/api/sources":
            assert payload is not None
            source = {
                "id": f"source-{len(self.sources) + 1}",
                "project_id": payload["project_id"],
                "name": payload["name"],
                "adapter_id": payload["adapter_id"],
                "enabled": True,
            }
            config = dict(payload["config"])
            for field in MODULE.SECRET_FIELDS.get(source["name"], set()):
                config[field] = f"secret-ref:{source['name']}:{field}"
            source["config"] = json.dumps(config, separators=(",", ":"), sort_keys=True)
            self.sources.append(source)
            return source
        if method == "PATCH" and path.startswith("/api/sources/"):
            assert payload is not None
            source = next(item for item in self.sources if path.endswith(item["id"]))
            if "config" in payload:
                source["config"] = json.dumps(
                    payload["config"], separators=(",", ":"), sort_keys=True
                )
            if "enabled" in payload:
                source["enabled"] = payload["enabled"]
            return source
        if method == "POST" and path.endswith("/ingest-token"):
            self.rotations += 1
            return {"token": "synthetic-push-token"}
        raise AssertionError((method, path, payload))


def source_env() -> dict[str, str]:
    return {
        "INFRAEGE_TARGET_SSH_PASSWORD": "synthetic-target-password",
        "INFRAEGE_TARGET_HOST_KEY_FINGERPRINT": "SHA256:" + "A" * 43,
        "INFRAEGE_BESZEL_EMAIL": "ops@example.test",
        "INFRAEGE_BESZEL_PASSWORD": "synthetic-beszel-password",
        "INFRAEGE_BESZEL_SYSTEM_NAME": "infraege.ru",
        "INFRAEGE_UMAMI_USERNAME": "operator",
        "INFRAEGE_UMAMI_PASSWORD": "synthetic-umami-password",
        "INFRAEGE_UMAMI_WEBSITE_ID": "website-id",
    }


class ManagementSourceTest(unittest.TestCase):
    def test_admin_origin_uses_verified_tls_for_secure_session_cookie(self):
        self.assertEqual(MODULE.API_ORIGIN, "https://sre.infraege.ru")

    def test_api_login_accepts_no_content_contract(self):
        with mock.patch.object(MODULE.API, "request") as request:
            MODULE.API("synthetic-admin-password")

        request.assert_called_once_with(
            "POST",
            "/api/auth/login",
            {"password": "synthetic-admin-password"},
            expected={204},
        )

    def test_beszel_transport_is_pinned_to_the_wireguard_endpoint(self):
        self.assertEqual(MODULE.BESZEL_MANAGEMENT_HOST, "10.77.0.1")
        self.assertEqual(MODULE.BESZEL_MANAGEMENT_PORT, 8090)

        connection = mock.MagicMock()
        connection.getresponse.return_value.status = 200
        connection.getresponse.return_value.read.return_value = b'{"token":"token"}'
        with mock.patch.object(MODULE.http.client, "HTTPConnection", return_value=connection) as open_:
            self.assertEqual(MODULE.beszel_request("GET", "/api/health"), {"token": "token"})

        open_.assert_called_once_with("10.77.0.1", 8090, timeout=15)
        connection.request.assert_called_once_with(
            "GET", "/api/health", body=None, headers={"Accept": "application/json"}
        )
        connection.close.assert_called_once_with()

    def test_beszel_system_discovery_requires_one_named_record(self):
        with mock.patch.object(
            MODULE,
            "beszel_request",
            side_effect=[{"token": "token"}, {"items": [{"id": "current-id"}]}],
        ) as request:
            self.assertEqual(MODULE.discover_beszel_system_id(source_env()), "current-id")
        self.assertEqual(request.call_count, 2)
        self.assertEqual(request.call_args_list[1].kwargs, {"token": "token"})

        for items in ([], [{"id": "one"}, {"id": "two"}]):
            with mock.patch.object(
                MODULE,
                "beszel_request",
                side_effect=[{"token": "token"}, {"items": items}],
            ):
                with self.assertRaises(RuntimeError):
                    MODULE.discover_beszel_system_id(source_env())

    def test_reconcile_is_idempotent_and_writes_only_protected_runtime_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = pathlib.Path(directory)
            MODULE.TOKEN_FILE = root / "token"
            MODULE.PUBLISHER_ENV = root / "publisher.env"
            api = FakeAPI()

            with mock.patch.object(MODULE, "discover_beszel_system_id", return_value="system-id"):
                MODULE.reconcile(api, source_env())
                MODULE.reconcile(api, source_env())

            self.assertEqual(len(api.sources), 7)
            self.assertEqual({item["name"] for item in api.sources}, MODULE.EXPECTED_NAMES)
            self.assertTrue(all(item["enabled"] for item in api.sources))
            self.assertEqual(api.rotations, 1)
            self.assertEqual(MODULE.TOKEN_FILE.stat().st_mode & 0o777, 0o600)
            self.assertEqual(MODULE.PUBLISHER_ENV.stat().st_mode & 0o777, 0o600)
            encoded = " ".join(item["config"] for item in api.sources)
            self.assertNotIn("synthetic-target-password", encoded)
            self.assertNotIn("synthetic-beszel-password", encoded)
            self.assertNotIn("synthetic-umami-password", encoded)
            container = next(item for item in api.sources if item["name"] == "Container telemetry")
            self.assertTrue(json.loads(container["config"])["require_container_stats"])

    def test_source_env_requires_exact_mode_and_keys(self):
        with tempfile.TemporaryDirectory() as directory:
            path = pathlib.Path(directory) / "sources.env"
            path.write_text("\n".join(f"{key}={value}" for key, value in source_env().items()))
            path.chmod(0o600)
            self.assertEqual(MODULE.load_env(path), source_env())
            path.chmod(0o644)
            with self.assertRaises(RuntimeError):
                MODULE.load_env(path)


if __name__ == "__main__":
    unittest.main()
