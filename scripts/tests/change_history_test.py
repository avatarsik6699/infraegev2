"""Exercise the SDD contract using disposable real Git repositories."""

import copy
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "change_history.py"
spec = importlib.util.spec_from_file_location("change_history", SCRIPT)
assert spec and spec.loader
history = importlib.util.module_from_spec(spec)
spec.loader.exec_module(history)


class HistoryTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git("init", "-q")
        self.git("config", "user.name", "History test")
        self.git("config", "user.email", "history@example.invalid")
        self.git("commit", "--allow-empty", "-qm", "initial")
        self.archive = self.root / "docs/changes/archive"
        self.archive.mkdir(parents=True)

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.root), *args]).decode().strip()

    def commit(self):
        self.git("add", ".")
        self.git("commit", "-qm", "fixture")
        return self.git("rev-parse", "HEAD")

    def cli(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--root", str(self.root), *args],
            capture_output=True,
            check=False,
        )

    def compact(self):
        for number in (1, 3):
            (self.archive / f"{number:02d}-example.md").write_text(f"history {number}\n")
        asset = self.root / "docs/artifacts/example.bin"
        asset.parent.mkdir()
        asset.write_bytes(b"\x00\xffexact\r\n")
        paths = sorted(
            str(p.relative_to(self.root)) for p in self.root.glob("docs/**/*") if p.is_file()
        )
        source = self.commit()
        data = history.snapshot(self.root, source, 3, paths)
        self.write_metadata(data)
        for path in paths:
            (self.root / path).unlink()
        self.commit()
        return data

    def write_metadata(self, data):
        (self.root / history.CHECKPOINT).write_text(
            f"# Compacted\n\n{history.MARKER}\n```json\n{json.dumps(data)}\n```\n"
        )

    def test_initial_number_and_ordinary_ship(self):
        self.assertEqual(self.cli("next").stdout, b"01\n")
        active = self.root / "docs/changes/01-first.md"
        active.write_text("active")
        self.assertEqual(history.inspect(self.root)["active"], ["docs/changes/01-first.md"])
        self.assertNotEqual(self.cli("next").returncode, 0)
        active.rename(self.archive / active.name)
        self.assertEqual(self.cli("next").stdout, b"02\n")

    def test_compact_numbering_and_normal_archive_afterward(self):
        data = self.compact()
        self.assertEqual(data["missing_numbers"], [2])
        self.assertEqual(self.cli("next").stdout, b"04\n")
        active = self.root / "docs/changes/04-next.md"
        active.write_text("active")
        self.assertEqual(len(history.inspect(self.root)["active"]), 1)
        active.rename(self.archive / active.name)
        self.assertEqual(self.cli("next").stdout, b"05\n")
        result = self.cli("read", "docs/artifacts/example.bin")
        self.assertEqual(result.stdout, b"\x00\xffexact\r\n")
        self.assertFalse((self.root / "docs/artifacts/example.bin").exists())
        self.assertNotEqual(self.cli("read", "../../secret").returncode, 0)

    def test_corrupt_and_missing_metadata_fail_closed(self):
        original = self.compact()
        for key, value in (
            ("covered_through", True),
            ("source_commit", "main"),
            ("missing_numbers", [1, 2]),
            ("source_digest", "wrong"),
            ("date", "invalid"),
            ("source_paths", ["docs/../secret"]),
        ):
            with self.subTest(key=key):
                data = copy.deepcopy(original)
                data[key] = value
                self.write_metadata(data)
                self.assertNotEqual(self.cli("next").returncode, 0)
        data = copy.deepcopy(original)
        del data["source_digest"]
        self.write_metadata(data)
        self.assertNotEqual(self.cli("next").returncode, 0)
        checkpoint = self.root / history.CHECKPOINT
        checkpoint.write_text("# Missing metadata\n")
        self.assertNotEqual(self.cli("next").returncode, 0)
        self.write_metadata(original)
        checkpoint.write_text(checkpoint.read_text() * 2)
        self.assertNotEqual(self.cli("next").returncode, 0)
        checkpoint.unlink()
        self.assertNotEqual(self.cli("next").returncode, 0)
        self.git("add", "-u")
        self.assertNotEqual(self.cli("next").returncode, 0)

    def test_shallow_source_unavailable(self):
        self.compact()
        with tempfile.TemporaryDirectory() as temp:
            clone = Path(temp) / "shallow"
            subprocess.run(
                ["git", "clone", "-q", "--depth=1", self.root.as_uri(), str(clone)], check=True
            )
            with self.assertRaisesRegex(history.HistoryError, "Fetch the recorded"):
                history.inspect(clone)

    def test_snapshot_requires_exact_bytes_and_complete_coverage(self):
        one = self.archive / "01-first.md"
        two = self.archive / "02-second.md"
        one.write_text("one")
        two.write_text("two")
        source = self.commit()
        paths = sorted(str(p.relative_to(self.root)) for p in (one, two))
        with self.assertRaisesRegex(history.HistoryError, "Unrepresented"):
            history.snapshot(self.root, source, 2, paths[:1])
        one.write_text("changed")
        with self.assertRaisesRegex(history.HistoryError, "differs"):
            history.snapshot(self.root, source, 2, paths)
        one.unlink()
        one.symlink_to(two)
        with self.assertRaisesRegex(history.HistoryError, "differs"):
            history.snapshot(self.root, source, 2, paths)

    def test_duplicate_numbers_and_active_changes_fail(self):
        self.compact()
        (self.archive / "03-collision.md").write_text("collision")
        with self.assertRaisesRegex(history.HistoryError, "compacted"):
            history.inspect(self.root)
        (self.archive / "03-collision.md").unlink()
        for number in (4, 5):
            (self.archive.parent / f"{number:02d}-active.md").write_text("active")
        with self.assertRaisesRegex(history.HistoryError, "Multiple active"):
            history.inspect(self.root)


if __name__ == "__main__":
    unittest.main()
