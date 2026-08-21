import importlib.util
import pathlib
import unittest

PATH = pathlib.Path(__file__).parents[2] / "ops/observability/build-traffic-telemetry.py"
SPEC = importlib.util.spec_from_file_location("traffic_telemetry", PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(MODULE)


class TrafficTelemetryTest(unittest.TestCase):
    def test_classifies_and_drops_identifiers(self):
        batch = MODULE.build([
            '{"path":"/ege/16?answer=secret","status":200,"user_agent":"Mozilla/5.0","analytics_consent":true,"ip":"203.0.113.8"}',
            '{"path":"/robots.txt","status":200,"user_agent":"Googlebot/2.1"}',
            '{"path":"/health","status":503,"user_agent":"curl/8"}',
            '{"path":"/","status":200,"user_agent":"Mozilla/5.0"}',
        ], "2026-08-21T10:00:00Z")
        encoded = str(batch)
        self.assertNotIn("203.0.113.8", encoded)
        self.assertNotIn("answer", encoded)
        classes = {record["labels"]["traffic_class"] for record in batch["records"]}
        self.assertEqual(classes, {"known_bot", "suspected_automation", "unclassified"})


if __name__ == "__main__":
    unittest.main()
