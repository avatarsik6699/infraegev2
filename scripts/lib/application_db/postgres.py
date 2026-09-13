"""Bounded Docker/psql transport. Exported snapshots outlive every reader and dump."""

import os
import re
import selectors
import subprocess
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path

TIMEOUT = 600


def run(argv: list[str], *, input: str | None = None) -> str:
    return subprocess.run(
        argv, input=input, text=True, stdout=subprocess.PIPE, check=True, timeout=TIMEOUT
    ).stdout


def docker(*args: str) -> str:
    return run(["docker", *args]).strip()


@dataclass(frozen=True)
class Database:
    container: str

    def command(self) -> list[str]:
        # Only this fixed shell adapter expands container-owned credentials/identity.
        return [
            "docker",
            "exec",
            "-i",
            self.container,
            "sh",
            "-ec",
            """
          export PGOPTIONS="-c statement_timeout=60000 -c lock_timeout=2000
                            -c idle_in_transaction_session_timeout=600000"
          exec psql -X -qAt -U "$POSTGRES_USER" -d infraege -v ON_ERROR_STOP=1
        """,
        ]

    def query(self, sql: str, snapshot: str | None = None) -> str:
        prefix = "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;\n"
        if snapshot:
            if not re.fullmatch(r"[0-9A-Fa-f-]+", snapshot):
                raise ValueError("invalid snapshot ID")
            prefix += f"SET TRANSACTION SNAPSHOT '{snapshot}';\n"
        return run(self.command(), input=prefix + sql + "\nCOMMIT;\n")

    @contextmanager
    def snapshot(self) -> Iterator[str]:
        with subprocess.Popen(
            self.command(), stdin=subprocess.PIPE, stdout=subprocess.PIPE
        ) as proc:
            assert proc.stdin is not None and proc.stdout is not None
            try:
                proc.stdin.write(
                    b"BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;\n"
                    b"SELECT pg_advisory_xact_lock_shared(114001);\n"
                    b"SELECT 'snapshot:' || pg_export_snapshot();\n"
                )
                proc.stdin.flush()
                # Read one byte at a time: no buffered reader can hide the second line from select.
                data = b""
                with selectors.DefaultSelector() as selector:
                    selector.register(proc.stdout, selectors.EVENT_READ)
                    while b"snapshot:" not in data or not data.endswith(b"\n"):
                        if not selector.select(timeout=10):
                            raise TimeoutError("snapshot export timed out")
                        chunk = os.read(proc.stdout.fileno(), 1)
                        if not chunk:
                            raise ValueError("snapshot exporter terminated")
                        data += chunk
                        if len(data) > 256:
                            raise ValueError("invalid snapshot response")
                identifier = data.decode().strip().removeprefix("snapshot:")
                if not re.fullmatch(r"[0-9A-Fa-f-]+", identifier):
                    raise ValueError("invalid exported snapshot")
                yield identifier
            finally:
                proc.stdin.close()
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    proc.wait()
            if proc.returncode:
                raise ValueError("snapshot holder failed")

    def dump(self, destination: Path, snapshot: str) -> None:
        with destination.open("wb") as output:
            subprocess.run(
                [
                    "docker",
                    "exec",
                    self.container,
                    "sh",
                    "-ec",
                    """
                if test -n "${DB_BACKUP_PASSWORD:-}"; then
                  export PGPASSWORD="$DB_BACKUP_PASSWORD"
                  exec pg_dump -h 127.0.0.1 -U infraege_backup --create -Fc \
                    --snapshot="$1" "$POSTGRES_DB"
                fi
                exec pg_dump -U "$POSTGRES_USER" --create -Fc --snapshot="$1" "$POSTGRES_DB"
                """,
                    "dump",
                    snapshot,
                ],
                stdout=output,
                check=True,
                timeout=TIMEOUT,
            )
