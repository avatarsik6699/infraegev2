import importlib.util
import json
import pathlib
import sys
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError

ROOT = pathlib.Path(__file__).parents[2]
OPS = ROOT / "ops/observability"
sys.path.insert(0, str(OPS))


def load(name: str, path: pathlib.Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


TELEMETRY = load("traffic_telemetry", OPS / "traffic_telemetry.py")
PUBLISHER = load("push_nginx_traffic", OPS / "push-nginx-traffic.py")


def journal_entry(cursor: str, message: str, timestamp: int = 1_786_375_056_518_149) -> bytes:
    return (
        json.dumps(
            {
                "__CURSOR": cursor,
                "__REALTIME_TIMESTAMP": str(timestamp),
                "CONTAINER_NAME": "infraege-nginx-1",
                "MESSAGE": message,
            }
        ).encode()
        + b"\n"
    )


class FixtureHandler(BaseHTTPRequestHandler):
    journal_responses: list[bytes] = []
    post_statuses: list[int] = []
    ranges: list[str] = []
    posts: list[dict[str, object]] = []

    def do_GET(self):
        type(self).ranges.append(self.headers.get("Range", ""))
        index = min(len(type(self).ranges) - 1, len(type(self).journal_responses) - 1)
        body = type(self).journal_responses[index]
        self.send_response(200)
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        body = self.rfile.read(int(self.headers["Content-Length"]))
        type(self).posts.append(
            {
                "authorization": self.headers.get("Authorization"),
                "key": self.headers.get("Idempotency-Key"),
                "body": json.loads(body),
                "raw": body.decode(),
            }
        )
        index = min(len(type(self).posts) - 1, len(type(self).post_statuses) - 1)
        self.send_response(type(self).post_statuses[index])
        self.end_headers()
        self.wfile.write(b"{}")

    def log_message(self, format, *_args):
        del format
        return


class FixtureServer:
    def __init__(self, journal_responses: list[bytes], post_statuses: list[int]):
        FixtureHandler.journal_responses = journal_responses
        FixtureHandler.post_statuses = post_statuses
        FixtureHandler.ranges = []
        FixtureHandler.posts = []
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), FixtureHandler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)

    def __enter__(self):
        self.thread.start()
        host = str(self.server.server_address[0])
        port = int(self.server.server_address[1])
        self.url = f"http://{host}:{port}"
        return self

    def __exit__(self, *_args):
        self.server.shutdown()
        self.thread.join()
        self.server.server_close()


class TrafficTelemetryTest(unittest.TestCase):
    def test_classifies_and_drops_identifiers(self):
        batch = TELEMETRY.build(
            [
                '{"path":"/ege/16?answer=secret","status":200,"user_agent":"Mozilla/5.0","analytics_consent":true,"ip":"203.0.113.8"}',
                '{"path":"/robots.txt","status":200,"user_agent":"Googlebot/2.1"}',
                '{"path":"/health","status":503,"user_agent":"curl/8"}',
                '{"path":"/","status":200,"user_agent":"Mozilla/5.0"}',
            ],
            "2026-08-21T10:00:00Z",
        )
        encoded = str(batch)
        self.assertNotIn("203.0.113.8", encoded)
        self.assertNotIn("answer", encoded)
        classes = {record["labels"]["traffic_class"] for record in batch["records"]}
        self.assertEqual(classes, {"known_bot", "suspected_automation", "unclassified"})

    def test_parses_combined_log_without_retaining_raw_identifiers(self):
        record = PUBLISHER.parse_access_record(
            "203.0.113.8 - - [21/Aug/2026:10:00:00 +0000] "
            '"GET /ege/16?answer=secret HTTP/2.0" 200 42 '
            '"https://example.test/private" "Mozilla/5.0"'
        )
        self.assertEqual(
            record,
            {"path": "/ege/16?answer=secret", "status": 200, "user_agent": "Mozilla/5.0"},
        )
        self.assertIsNone(PUBLISHER.parse_access_record("nginx: configuration reloaded"))

    def test_bounds_malformed_and_probe_paths(self):
        batch = TELEMETRY.build_rows(
            [
                {"path": "/.env.production", "status": 404, "user_agent": "Mozilla/5.0"},
                {"path": "/wp-admin/install.php", "status": 404, "user_agent": "Mozilla/5.0"},
                {"path": "\x84\xb4,\x85", "status": 400, "user_agent": "Mozilla/5.0"},
                {"path": "/ege/16-rekursiya", "status": 200, "user_agent": "Mozilla/5.0"},
            ],
            "2026-08-21T10:00:00Z",
        )
        labels = [record["labels"] for record in batch["records"]]
        self.assertEqual(
            {label["path"] for label in labels},
            {"__probe__", "__invalid_path__", "/ege/16-rekursiya"},
        )
        bounded = [label for label in labels if label["path"].startswith("__")]
        self.assertTrue(all(label["traffic_class"] == "suspected_automation" for label in bounded))

    def test_publishes_incrementally_and_persists_only_cursor(self):
        first = journal_entry(
            "cursor-one",
            "203.0.113.8 - - [21/Aug/2026:10:00:00 +0000] "
            '"GET /ege/16?answer=secret HTTP/2.0" 200 42 "-" "Mozilla/5.0"',
        )
        second = journal_entry(
            "cursor-two",
            "198.51.100.2 - - [21/Aug/2026:10:01:00 +0000] "
            '"GET /robots.txt HTTP/2.0" 200 12 "-" "Googlebot/2.1"',
            1_786_375_116_518_149,
        )
        with tempfile.TemporaryDirectory() as directory, FixtureServer(
            [first, second], [202, 202]
        ) as fixture:
            root = pathlib.Path(directory)
            token = root / "token"
            token.write_text("synthetic-token\n")
            token.chmod(0o600)
            state = root / "state/cursor.json"
            config = PUBLISHER.Config(
                fixture.url,
                fixture.url,
                "391530b3-8484-48af-a0eb-461846bfbc92",
                token,
                state,
                "infraege-nginx-1",
                500,
            )

            self.assertEqual(PUBLISHER.publish_once(config), (1, 1))
            self.assertEqual(PUBLISHER.publish_once(config), (1, 1))

            self.assertEqual(FixtureHandler.ranges[0], "entries=:-500:500")
            self.assertEqual(FixtureHandler.ranges[1], "entries=cursor-one:1:500")
            self.assertEqual(
                json.loads(state.read_text()), {"schema_version": 1, "cursor": "cursor-two"}
            )
            self.assertEqual(state.stat().st_mode & 0o777, 0o600)
            transmitted = " ".join(str(post) for post in FixtureHandler.posts)
            self.assertNotIn("203.0.113.8", transmitted)
            self.assertNotIn("198.51.100.2", transmitted)
            self.assertNotIn("answer", transmitted)
            self.assertNotEqual(FixtureHandler.posts[0]["key"], FixtureHandler.posts[1]["key"])

    def test_failed_push_keeps_cursor_and_retry_key_stable(self):
        response = journal_entry(
            "retry-cursor",
            '203.0.113.8 - - [21/Aug/2026:10:00:00 +0000] "GET / HTTP/2.0" 200 42 "-" "curl/8"',
        )
        with tempfile.TemporaryDirectory() as directory, FixtureServer(
            [response, response], [500, 202]
        ) as fixture:
            root = pathlib.Path(directory)
            token = root / "token"
            token.write_text("synthetic-token\n")
            token.chmod(0o600)
            state = root / "state/cursor.json"
            config = PUBLISHER.Config(
                fixture.url,
                fixture.url,
                "391530b3-8484-48af-a0eb-461846bfbc92",
                token,
                state,
                "infraege-nginx-1",
                500,
            )

            with self.assertRaises(HTTPError):
                PUBLISHER.publish_once(config)
            self.assertFalse(state.exists())
            PUBLISHER.publish_once(config)
            self.assertEqual(FixtureHandler.posts[0]["key"], FixtureHandler.posts[1]["key"])
            self.assertEqual(json.loads(state.read_text())["cursor"], "retry-cursor")

    def test_empty_access_window_advances_cursor_without_push(self):
        response = journal_entry("non-access-cursor", "nginx: configuration reloaded")
        with (
            tempfile.TemporaryDirectory() as directory,
            FixtureServer([response], [202]) as fixture,
        ):
            root = pathlib.Path(directory)
            token = root / "token"
            token.write_text("synthetic-token\n")
            token.chmod(0o600)
            state = root / "state/cursor.json"
            config = PUBLISHER.Config(
                fixture.url,
                fixture.url,
                "391530b3-8484-48af-a0eb-461846bfbc92",
                token,
                state,
                "infraege-nginx-1",
                500,
            )

            self.assertEqual(PUBLISHER.publish_once(config), (1, 0))
            self.assertEqual(FixtureHandler.posts, [])
            self.assertEqual(json.loads(state.read_text())["cursor"], "non-access-cursor")


if __name__ == "__main__":
    unittest.main()
