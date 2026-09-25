"""Host-only maintenance checks; live snapshot proof uses the isolated practice runner."""

import json
import os
import subprocess
import tempfile
import unittest
import uuid
from dataclasses import asdict
from pathlib import Path
from unittest.mock import Mock, patch

from scripts.lib.application_db import bundle, recovery, sql
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

    def test_previous_schema_requires_archived_tools(self):
        metadata = json.loads((self.root / "metadata.json").read_text())
        metadata["schemaVersion"] = "121_01"
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

    def test_smoke_uses_private_storage_owner_and_keeps_restrictions(self):
        storage = self.root / "task-files"
        storage.chmod(0o700)
        original_stat = Path.stat
        for uid, gid in ((0, 0), (1000, 1000), (1234, 5678)):
            with self.subTest(uid=uid, gid=gid):

                def stat(path, *args, owner_uid=uid, owner_gid=gid, **kwargs):
                    value = original_stat(path, *args, **kwargs)
                    if path == storage:
                        fields = list(value)
                        fields[4:6] = [owner_uid, owner_gid]
                        return os.stat_result(fields)
                    return value

                with (
                    patch.object(Path, "stat", stat),
                    patch.object(recovery, "require_disposable") as disposable,
                    patch.object(recovery, "docker", return_value="sha256:" + "a" * 64),
                    patch.object(recovery.subprocess, "run") as run,
                ):
                    run.return_value.returncode = 0
                    recovery.smoke(self.root, "isolated-restore")
                disposable.assert_called_once_with("isolated-restore")
                command = run.call_args.args[0]
                self.assertEqual(command[command.index("--user") + 1], f"{uid}:{gid}")
                self.assertIn("--read-only", command)
                for flag, expected in (
                    ("--cap-drop", "ALL"),
                    ("--security-opt", "no-new-privileges"),
                    ("--network", "container:isolated-restore"),
                    ("--mount", f"type=bind,source={storage},target=/task-files,readonly"),
                ):
                    self.assertEqual(command[command.index(flag) + 1], expected)
                self.assertTrue(
                    command[command.index("--env") + 1].startswith(
                        "DATABASE_URL=postgresql://infraege_runtime:"
                    )
                )
                self.assertTrue(run.call_args.kwargs["check"])
                self.assertEqual(storage.stat().st_mode & 0o777, 0o700)

    def test_account_restore_rejects_missing_grants_or_progress_contract(self):
        restored = Mock()
        restored.query.side_effect = ["140_01", "f"]
        with (
            patch.object(recovery, "require_disposable"),
            patch.object(recovery, "docker", return_value="0"),
            patch.object(recovery, "Database", return_value=restored),
            patch.object(recovery.subprocess, "run"),
            patch.object(recovery, "schema_version", return_value="140_01"),
        ):
            with self.assertRaisesRegex(ValueError, "account schema or application grants"):
                recovery.restore(self.root, "isolated-restore")
        restored.query.assert_called_once_with(sql.ACCOUNT_RESTORE)


@unittest.skipUnless(
    os.environ.get("PRACTICE_BACKUP_CONTAINER"), "isolated PostgreSQL fixture required"
)
class SnapshotTests(unittest.TestCase):
    def test_dump_and_queries_share_snapshot_during_concurrent_write(self):
        db = Database(os.environ["PRACTICE_BACKUP_CONTAINER"])
        marker = "snapshot-" + uuid.uuid4().hex
        with tempfile.TemporaryDirectory() as temp, db.snapshot() as snapshot:
            before = db.query("SELECT count(*) FROM practice.task;", snapshot)
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
                "INSERT INTO practice.task(id,content,solution_revision,catalog_visible,archived) "
                f"VALUES ('{marker}', '{{}}'::jsonb, 1, false, true)",
            )
            self.assertEqual(db.query("SELECT count(*) FROM practice.task;", snapshot), before)
            self.assertEqual(int(db.query("SELECT count(*) FROM practice.task;")), int(before) + 1)
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
