"""Bounded local packages and content-addressed immutable storage."""

import hashlib
import io
import json
import os
import shutil
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

from PIL import Image

from app.modules.practice.schemas import (
    DiagramBlock,
    ImageBlock,
    Manifest,
    PackageFile,
    Registry,
    TaskEdit,
)


def configured_limit(name: str, ceiling: int) -> int:
    value = int(os.environ.get(name, str(ceiling)))
    if not 0 < value <= ceiling:
        raise ValueError(f"{name} must be positive and within its documented ceiling")
    return value


MAX_PACKAGE = configured_limit("PRACTICE_PACKAGE_MAX_BYTES", 1024**3)
MAX_TASK = 4 * 1024**2
IMAGE_LIMIT = configured_limit("PRACTICE_IMAGE_MAX_BYTES", 5 * 1024**2)
ATTACHMENT_LIMIT = configured_limit("PRACTICE_ATTACHMENT_MAX_BYTES", 20 * 1024**2)
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


def safe_path(root: Path, relative: str) -> Path:
    path = PurePosixPath(relative)
    if (
        not relative
        or path.is_absolute()
        or "\\" in relative
        or "\x00" in relative
        or any(part in {"", ".", ".."} for part in relative.split("/"))
    ):
        raise ValueError("unsafe package path")
    current = root
    if root.is_symlink():
        raise ValueError("symlink package root")
    for part in path.parts:
        current = current / part
        if current.is_symlink():
            raise ValueError("symlink in package path")
    if not current.is_file():
        raise ValueError("package file missing")
    return current


def image_dimensions(data: bytes, kind: str) -> tuple[int, int]:
    formats = {"png": "PNG", "jpg": "JPEG", "jpeg": "JPEG", "webp": "WEBP", "avif": "AVIF"}
    try:
        with Image.open(io.BytesIO(data), formats=[formats[kind]]) as image:
            if image.width * image.height > 16_000_000 or getattr(image, "n_frames", 1) != 1:
                raise ValueError("image pixel/frame limit exceeded")
            dimensions = image.size
            image.verify()
        with Image.open(io.BytesIO(data), formats=[formats[kind]]) as image:
            image.load()
        return dimensions
    except (OSError, SyntaxError, Image.DecompressionBombError) as exc:
        raise ValueError("invalid or unsupported image encoding") from exc


def inspect_file(path: Path, entry: PackageFile) -> int:
    """Return expanded bytes charged to the total package budget."""
    size = path.stat().st_size
    if size > ATTACHMENT_LIMIT:
        raise ValueError("attachment exceeds limit")
    if size != entry.size_bytes or checksum(path) != entry.checksum:
        raise ValueError("file size/checksum mismatch")
    if entry.format in {"png", "jpg", "jpeg", "webp", "avif"}:
        if size > IMAGE_LIMIT:
            raise ValueError("image exceeds limit")
        width, height = image_dimensions(path.read_bytes(), entry.format)
        if not 0 < width <= 50000 or not 0 < height <= 50000:
            raise ValueError("invalid image dimensions")
    elif entry.format in {"zip", "xlsx", "docx", "ods", "odt"}:
        expanded = 0
        with zipfile.ZipFile(path) as archive:
            infos = archive.infolist()
            if len(infos) > 10000 or len({i.filename for i in infos}) != len(infos):
                raise ValueError("archive entry limit or duplicate names")
            for info in infos:
                name = PurePosixPath(info.filename)
                if (
                    name.is_absolute()
                    or ".." in name.parts
                    or "\\" in info.filename
                    or (info.external_attr >> 16) & 0o170000 == 0o120000
                    or info.flag_bits & 1
                ):
                    raise ValueError("unsafe archive entry")
                expanded += info.file_size
                if expanded > MAX_PACKAGE:
                    raise ValueError("expanded archive exceeds limit")
                if name.suffix.lower() in {".zip", ".xlsx", ".docx", ".ods", ".odt"}:
                    raise ValueError("nested archives must be supplied as separate package files")
                with archive.open(info) as stream:
                    actual = 0
                    while chunk := stream.read(1024 * 1024):
                        actual += len(chunk)
                        if actual > info.file_size:
                            raise ValueError("expanded archive size mismatch")
            names = {i.filename for i in infos}
            if entry.format in {"xlsx", "docx"}:
                required = "xl/workbook.xml" if entry.format == "xlsx" else "word/document.xml"
                if "[Content_Types].xml" not in names or required not in names:
                    raise ValueError("document format mismatch")
            if entry.format in {"ods", "odt"}:
                if (
                    "mimetype" not in names
                    or archive.read("mimetype") != MIME[entry.format].encode()
                ):
                    raise ValueError("document MIME mismatch")
        return size + expanded
    elif entry.format == "pdf":
        with path.open("rb") as stream:
            if stream.read(5) != b"%PDF-":
                raise ValueError("PDF format mismatch")
    else:
        data = path.read_bytes()
        if b"\x00" in data:
            raise ValueError("binary data declared as text")
        # Keep bytes unchanged; text encodings are described by the author, not transcoded.
        if entry.format == "json":
            json.loads(data)
    return size


class Package:
    def __init__(self, root: Path):
        self.root = root
        manifest_path = safe_path(root, "manifest.json")
        if manifest_path.stat().st_size > MAX_TASK:
            raise ValueError("manifest too large")
        self.manifest = Manifest.model_validate_json(manifest_path.read_bytes())
        self.checksum = hashlib.sha256(self.manifest.model_dump_json().encode()).hexdigest()
        self.files = {f.checksum: f for f in self.manifest.files}
        if len(self.files) != len(self.manifest.files):
            raise ValueError("duplicate file checksum")

    def edits(self):
        for entry in self.manifest.tasks:
            path = safe_path(self.root, entry.path)
            if path.stat().st_size > MAX_TASK or checksum(path) != entry.checksum:
                raise ValueError("task size/checksum mismatch")
            yield TaskEdit.model_validate_json(path.read_bytes())

    def validate(self, registry: Registry) -> None:
        allowed = {
            "manifest.json",
            *(e.path for e in self.manifest.tasks),
            *(f.path for f in self.manifest.files),
        }
        if len(allowed) != 1 + len(self.manifest.tasks) + len(self.manifest.files):
            raise ValueError("duplicate package path")
        total = 0
        for path in self.root.rglob("*"):
            if path.is_symlink():
                raise ValueError("symlink package entry")
            if path.is_file():
                if path.relative_to(self.root).as_posix() not in allowed:
                    raise ValueError("unlisted package file")
                total += path.stat().st_size
                if total > MAX_PACKAGE:
                    raise ValueError("package exceeds limit")
            elif not path.is_dir():
                raise ValueError("special filesystem objects are not package files")
        for entry in self.manifest.files:
            path = safe_path(self.root, entry.path)
            total += inspect_file(path, entry) - entry.size_bytes
            if total > MAX_PACKAGE:
                raise ValueError("expanded package exceeds limit")
        materials = {m.id: set(m.sections) for m in registry.materials}
        ids = set()
        for edit in self.edits():
            task = edit.task
            if task.id in ids:
                raise ValueError("duplicate task ID")
            ids.add(task.id)
            for link in task.lessons:
                if link.material_id not in materials:
                    raise ValueError("unknown application material")
            for reference in task.theory_links:
                if reference.section not in materials.get(reference.material_id, set()):
                    raise ValueError("unknown application section")
            usages = {f.id: f for f in task.files}
            for usage in task.files:
                entry = self.files.get(usage.checksum)
                if entry is None or Path(usage.filename).suffix.lower().lstrip(".") != entry.format:
                    raise ValueError("file missing or download extension mismatch")
                is_image = MIME[entry.format].startswith("image/")
                if (usage.purpose == "image") != is_image:
                    raise ValueError("file usage format mismatch")
            for block in task.statement + task.hint + task.explanation:
                if isinstance(block, ImageBlock | DiagramBlock):
                    entry = self.files[usages[block.data.usage_id].checksum]
                    dimensions = image_dimensions(
                        safe_path(self.root, entry.path).read_bytes(), entry.format
                    )
                    if dimensions != (block.data.width, block.data.height):
                        raise ValueError("image dimensions mismatch")

    def stage(self, storage: Path) -> None:
        storage.mkdir(parents=True, exist_ok=True)
        if storage.is_symlink():
            raise ValueError("symlink storage root")
        staging = storage / ".staging"
        staging.mkdir(mode=0o700, exist_ok=True)
        if staging.is_symlink() or not staging.is_dir():
            raise ValueError("invalid staging directory")
        for entry in self.manifest.files:
            source = safe_path(self.root, entry.path)
            inspect_file(source, entry)
            destination = storage / entry.checksum
            if destination.exists():
                if destination.is_symlink() or checksum(destination) != entry.checksum:
                    raise ValueError("immutable storage corruption")
                continue
            with tempfile.NamedTemporaryFile(dir=staging) as temporary:
                with source.open("rb") as stream:
                    shutil.copyfileobj(stream, temporary, length=1024 * 1024)
                temporary.flush()
                os.fsync(temporary.fileno())
                if checksum(Path(temporary.name)) != entry.checksum:
                    raise ValueError("file changed while staging")
                os.chmod(temporary.name, 0o444)
                try:
                    os.link(temporary.name, destination)
                except FileExistsError:
                    if destination.is_symlink() or checksum(destination) != entry.checksum:
                        raise ValueError("immutable storage conflict") from None
            descriptor = os.open(storage, os.O_RDONLY | os.O_DIRECTORY)
            try:
                os.fsync(descriptor)
            finally:
                os.close(descriptor)
