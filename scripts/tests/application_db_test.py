"""Host-only maintenance checks; live snapshot proof uses the isolated practice runner."""

import json
import os
import subprocess
import tempfile
import unittest
import uuid
from dataclasses import asdict
from pathlib import Path

from scripts.lib.application_db import bundle
from scripts.lib.application_db.postgres import Database, docker


class BundleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in bundle.BASE_FILES:
            (self.root / name).write_text("fixture\n")
        metadata = bundle.Metadata(
            "test",
            "infraege-db-test-bundle",
            "180006",
            "unknown",
            "fixture",
            "2026-09-13",
            bundle.SCHEMA,
            "task-files",
            "infraege-practice-test-bundle",
            "sha256:" + "a" * 64,
        )
        (self.root / "metadata.json").write_text(json.dumps(asdict(metadata)))
        files = self.root / "task-files"
        files.mkdir()
        self.object = files / "data"
        self.object.write_bytes(b"123\n")
        digest = bundle.checksum(self.object)
        self.object = self.object.rename(files / digest)
        (self.root / "file-references.txt").write_text(f"{digest} 4\n")
        (self.root / "SHA256SUMS").write_text(bundle.sums(self.root, bundle.SCHEMA))

    def test_valid_and_corrupt_object(self):
        bundle.validate(self.root)
        self.object.write_bytes(b"bad\n")
        with self.assertRaisesRegex(ValueError, "corrupt"):
            bundle.validate(self.root)

    def test_missing_reference_and_symlink_rejected(self):
        self.object.unlink()
        with self.assertRaises(ValueError):
            bundle.validate(self.root)
        self.object.symlink_to(self.root / "application.dump")
        with self.assertRaises(ValueError):
            bundle.validate(self.root)

    def test_unknown_schema_is_rejected(self):
        metadata = json.loads((self.root / "metadata.json").read_text())
        metadata["schemaVersion"] = "unknown"
        (self.root / "metadata.json").write_text(json.dumps(metadata))
        with self.assertRaisesRegex(ValueError, "unsupported bundle schema"):
            bundle.validate(self.root)

    def test_subprocess_failure_is_not_swallowed(self):
        # The CLI's exit remains nonzero even through the shell's conditional context.
        script = Path(__file__).resolve().parents[1] / "application_db.py"
        result = subprocess.run(
            [
                "bash",
                "-c",
                'if python3 "$1" validate "$2"; then exit 99; else exit 0; fi',
                "test",
                str(script),
                str(self.root / "missing"),
            ],
            capture_output=True,
        )
        self.assertEqual(result.returncode, 0)


@unittest.skipUnless(
    os.environ.get("PRACTICE_BACKUP_CONTAINER"), "isolated PostgreSQL fixture required"
)
class SnapshotTests(unittest.TestCase):
    def test_dump_and_queries_share_snapshot_during_concurrent_write(self):
        db = Database(os.environ["PRACTICE_BACKUP_CONTAINER"])
        marker = "snapshot-" + uuid.uuid4().hex
        with tempfile.TemporaryDirectory() as temp, db.snapshot() as snapshot:
            before = db.query("SELECT count(*) FROM practice.import_outcome;", snapshot)
            docker(
                "exec",
                db.container,
                "psql",
                "-X",
                "-q",
                "-U",
                "infraege",
                "-d",
                "infraege",
                "-v",
                "ON_ERROR_STOP=1",
                "-c",
                "INSERT INTO practice.import_outcome(package_id,checksum,task_count) "
                f"VALUES ('{marker}', '{'a' * 64}', 0)",
            )
            self.assertEqual(
                db.query("SELECT count(*) FROM practice.import_outcome;", snapshot), before
            )
            self.assertEqual(
                int(db.query("SELECT count(*) FROM practice.import_outcome;")), int(before) + 1
            )
            dump = Path(temp) / "snapshot.dump"
            db.dump(dump, snapshot)
            with dump.open("rb") as stream:
                result = subprocess.run(
                    ["docker", "exec", "-i", db.container, "pg_restore", "--file=-"],
                    stdin=stream,
                    stdout=subprocess.PIPE,
                    check=True,
                )
            self.assertNotIn(marker.encode(), result.stdout)


if __name__ == "__main__":
    unittest.main()
