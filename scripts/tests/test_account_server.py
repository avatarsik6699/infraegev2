"""Guard rails for the browser-only account API launcher; no Docker required."""

from __future__ import annotations

import importlib.util
import os
import stat
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "test_account_server", ROOT / "scripts/test-account-server.py"
)
assert SPEC and SPEC.loader
server = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(server)


class AccountServerGuardsTest(unittest.TestCase):
    def test_listener_rejects_any_non_dedicated_address(self) -> None:
        server.validate_listener("127.0.0.2", 8100)
        for host, port in (("127.0.0.1", 8100), ("127.0.0.2", 8101)):
            with self.assertRaises(SystemExit):
                server.validate_listener(host, port)

    def test_mailbox_refuses_insecure_or_symlinked_targets(self) -> None:
        original = os.environ.get("INFRAEGE_ACCOUNT_MAILBOX")
        try:
            with tempfile.TemporaryDirectory() as root:
                directory = Path(root) / "mailbox"
                directory.mkdir(mode=0o700)
                mailbox = directory / "mailbox.json"
                os.environ["INFRAEGE_ACCOUNT_MAILBOX"] = str(mailbox)
                self.assertEqual(server.mailbox_path(), mailbox)

                mailbox.symlink_to("/tmp/not-a-mailbox")
                with self.assertRaises(SystemExit):
                    server.mailbox_path()
                mailbox.unlink()

                directory.chmod(0o755)
                with self.assertRaises(SystemExit):
                    server.mailbox_path()
                self.assertEqual(stat.S_IMODE(directory.stat().st_mode), 0o755)
        finally:
            if original is None:
                os.environ.pop("INFRAEGE_ACCOUNT_MAILBOX", None)
            else:
                os.environ["INFRAEGE_ACCOUNT_MAILBOX"] = original

    def test_mailbox_write_is_private_and_replaces_one_capture(self) -> None:
        with tempfile.TemporaryDirectory() as root:
            directory = Path(root) / "mailbox"
            directory.mkdir(mode=0o700)
            mailbox = directory / "mailbox.json"
            server.write_mailbox(
                mailbox, {"recipient": "test@example.test", "subject": "x", "body": "y"}
            )
            self.assertEqual(stat.S_IMODE(mailbox.stat().st_mode), 0o600)
            self.assertFalse((directory / ".mailbox.json.tmp").exists())


if __name__ == "__main__":
    unittest.main()
