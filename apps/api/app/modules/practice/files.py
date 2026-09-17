"""Content-addressed files, outside the application image."""

import hashlib
import re
from pathlib import Path

MIME = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "webp": "image/webp",
    "avif": "image/avif",
    "txt": "text/plain",
    "csv": "text/csv",
    "json": "application/json",
    "py": "text/x-python",
    "zip": "application/zip",
    "pdf": "application/pdf",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "ods": "application/vnd.oasis.opendocument.spreadsheet",
    "odt": "application/vnd.oasis.opendocument.text",
}


def checksum(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def safe_path(storage: Path, key: str) -> Path:
    if not re.fullmatch(r"[a-f0-9]{64}", key):
        raise ValueError("invalid file key")
    path = storage / key
    if path.is_symlink() or not path.is_file():
        raise ValueError("missing or unsafe task file")
    return path
