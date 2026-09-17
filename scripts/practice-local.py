"""Host-only shortcut for the explicitly labelled local development database."""

import json
import os
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
container = json.loads(subprocess.check_output(["docker", "inspect", "infraege-dev-postgres-1"]))[0]
if container["Config"]["Labels"].get("com.docker.compose.project") != "infraege-dev":
    raise SystemExit("not the development database")
values = dict(value.split("=", 1) for value in container["Config"]["Env"] if "=" in value)
port = container["NetworkSettings"]["Ports"]["5432/tcp"][0]["HostPort"]
env = dict(os.environ)
env["IMPORT_DATABASE_URL"] = (
    f"postgresql://infraege_import:{values['DB_IMPORT_PASSWORD']}@127.0.0.1:{port}/infraege"
)
env["TASK_FILES_DIR"] = str(root / "infra/task-files.local")
args = sys.argv[1:]
if len(args) != 2 or args[0] not in {"import", "export"}:
    raise SystemExit("usage: practice-local.py import|export DIRECTORY")
raise SystemExit(
    subprocess.run(
        [
            "uv",
            "run",
            "--project",
            str(root / "apps/api"),
            "python",
            "-m",
            "app.modules.practice.cli",
            args[0],
            str(Path(args[1]).resolve()),
        ],
        cwd=root / "apps/api",
        env=env,
    ).returncode
)
