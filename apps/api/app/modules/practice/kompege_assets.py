"""Bounded, allowlisted source assets for the one-time KEGE preparation command."""

from __future__ import annotations

import base64
import binascii
import hashlib
import os
import re
import struct
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from urllib.error import URLError
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from app.modules.practice.files import MIME

MAX_BYTES = 64 * 1024 * 1024
EXTERNAL_IMAGES = {
    "https://sun9-40.userapi.com/impg/IXmQVTl9-9w6TCMWMmDnFvEvY2LHK28YMd4Qug/TkmnLM_8aCc.jpg?size=654x322&quality=96&sign=e633c5fc87548071e2f11d921f6bdf34&type=album",
    "https://ucarecdn.com/e88f1207-0c22-4a72-90a2-c1ac539e5329/",
}


def source_url(value: str) -> str:
    """Only immutable-looking KEGE file paths; no credentials, ports or traversal."""
    url = urljoin("https://kompege.ru", value)
    parts = urlsplit(url)
    path = unquote(parts.path)
    allowed = (
        parts.netloc == "kompege.ru"
        and path.startswith(("/files/", "/images/"))
        or parts.netloc == "kpolyakov.spb.ru"
        and path.startswith("/cms/images/")
        or url in EXTERNAL_IMAGES
    )
    if (
        parts.scheme != "https"
        or not allowed
        or (parts.query and url not in EXTERNAL_IMAGES)
        or parts.fragment
        or any(p in {".", ".."} for p in path.split("/"))
        or "\\" in path
        or any(ord(c) < 32 for c in path)
    ):
        raise ValueError(f"asset URL outside allowlist: {value[:180]}")
    return url


class _Redirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        source_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch_asset(url: str) -> bytes:
    """This is called only by the operator CLI, never while importing the module."""
    url = source_url(url)
    opener = build_opener(_Redirects())
    for attempt in range(3):
        try:
            request = Request(url, headers={"User-Agent": "infraege-one-time-bank-preparation/188"})
            with opener.open(request, timeout=30) as response:
                source_url(response.geturl())
                if int(response.headers.get("Content-Length", "0")) > MAX_BYTES:
                    raise ValueError("source asset exceeds 64 MiB")
                data = response.read(MAX_BYTES + 1)
            if not data or len(data) > MAX_BYTES:
                raise ValueError("empty or oversized source asset")
            return data
        except (URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(attempt + 1)
    raise AssertionError("unreachable")


def _image_dimensions(data: bytes, extension: str) -> tuple[int, int]:
    if extension == "gif" and data[:6] in {b"GIF87a", b"GIF89a"} and len(data) >= 10:
        dimensions = struct.unpack("<HH", data[6:10])
    elif extension == "png" and data[:8] == b"\x89PNG\r\n\x1a\n" and len(data) >= 24:
        dimensions = struct.unpack(">II", data[16:24])
    elif extension in {"jpg", "jpeg"} and data[:2] == b"\xff\xd8":
        offset = 2
        dimensions = None
        while offset + 4 <= len(data):
            if data[offset] != 255:
                raise ValueError("invalid JPEG marker")
            while offset < len(data) and data[offset] == 255:
                offset += 1
            marker = data[offset]
            offset += 1
            if marker in {0xD8, 0xD9} or 0xD0 <= marker <= 0xD7:
                continue
            length = int.from_bytes(data[offset : offset + 2], "big")
            if length < 2:
                raise ValueError("invalid JPEG segment")
            if marker in {
                0xC0,
                0xC1,
                0xC2,
                0xC3,
                0xC5,
                0xC6,
                0xC7,
                0xC9,
                0xCA,
                0xCB,
                0xCD,
                0xCE,
                0xCF,
            }:
                height, width = struct.unpack(">HH", data[offset + 3 : offset + 7])
                dimensions = (width, height)
                break
            offset += length
        if dimensions is None:
            raise ValueError("JPEG has no supported size marker")
    elif extension == "webp" and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        kind = data[12:16]
        if kind == b"VP8X" and len(data) >= 30:
            dimensions = (
                1 + int.from_bytes(data[24:27], "little"),
                1 + int.from_bytes(data[27:30], "little"),
            )
        elif kind == b"VP8L" and len(data) >= 25 and data[20] == 0x2F:
            packed = int.from_bytes(data[21:25], "little")
            dimensions = ((packed & 0x3FFF) + 1, ((packed >> 14) & 0x3FFF) + 1)
        elif kind == b"VP8 " and len(data) >= 30 and data[23:26] == b"\x9d\x01\x2a":
            dimensions = tuple(n & 0x3FFF for n in struct.unpack("<HH", data[26:30]))
        else:
            raise ValueError("unsupported WebP header")
    else:
        raise ValueError("unsupported or invalid source image")
    width, height = dimensions
    if not (0 < width <= 50000 and 0 < height <= 50000):
        raise ValueError("image dimensions outside native contract")
    return width, height


def image_dimensions(data: bytes, extension: str) -> tuple[int, int]:
    try:
        return _image_dimensions(data, extension)
    except (IndexError, struct.error) as error:
        raise ValueError("truncated or invalid source image header") from error


@dataclass(frozen=True)
class Asset:
    data: bytes
    filename: str
    extension: str
    mime_type: str

    @property
    def checksum(self) -> str:
        return hashlib.sha256(self.data).hexdigest()

    def bank_file(self) -> dict:
        return {
            "checksum": self.checksum,
            "storage_key": self.checksum,
            "format": self.extension,
            "mime_type": self.mime_type,
            "size_bytes": len(self.data),
        }


class AssetResolver:
    """Inject a byte transport in tests; cache identical source URLs within one preparation."""

    def __init__(self, fetch=fetch_asset, cache_dir: Path | None = None):
        self.fetch = fetch
        self.cache_dir = cache_dir
        if cache_dir is not None:
            cache_dir.mkdir(mode=0o700, exist_ok=True)
        self.cache: dict[str, bytes] = {}
        self.objects: dict[str, Asset] = {}

    def __call__(self, url: str, filename: str | None = None) -> Asset:
        if url.startswith("data:"):
            match = re.fullmatch(r"data:image/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=\s]+)", url)
            if not match or len(match[2]) > MAX_BYTES * 4 // 3 + 1024:
                raise ValueError("unsupported or oversized embedded source image")
            extension = match[1]
            try:
                data = base64.b64decode(re.sub(r"\s+", "", match[2]), validate=True)
            except binascii.Error as error:
                raise ValueError("invalid embedded image base64") from error
            filename = filename or f"kege-image.{extension}"
        else:
            url = source_url(url)
            filename = filename or PurePosixPath(unquote(urlsplit(url).path)).name
            extension = PurePosixPath(filename).suffix.lstrip(".").lower()
            extensionless_cdn = url == "https://ucarecdn.com/e88f1207-0c22-4a72-90a2-c1ac539e5329/"
            if extension not in MIME and not extensionless_cdn:
                raise ValueError(f"unsupported source attachment format: {extension}")
            if url not in self.cache:
                staged = (
                    self.cache_dir / hashlib.sha256(url.encode()).hexdigest()
                    if self.cache_dir
                    else None
                )
                if staged is not None and staged.is_symlink():
                    raise ValueError("unsafe source asset staging symlink")
                if staged is not None and staged.is_file():
                    if staged.stat().st_size > MAX_BYTES:
                        raise ValueError("oversized staged source asset")
                    data = staged.read_bytes()
                else:
                    data = self.fetch(url)
                    if not data or len(data) > MAX_BYTES:
                        raise ValueError("empty or oversized source asset")
                    if staged is not None:
                        with tempfile.NamedTemporaryFile(dir=self.cache_dir) as stream:
                            stream.write(data)
                            stream.flush()
                            try:
                                os.link(stream.name, staged)
                            except FileExistsError:
                                if staged.read_bytes() != data:
                                    raise ValueError(
                                        "concurrent source asset staging differs"
                                    ) from None
                self.cache[url] = data
            data = self.cache[url]
            if extensionless_cdn:
                if data.startswith(b"\x89PNG\r\n\x1a\n"):
                    extension = "png"
                elif data.startswith(b"\xff\xd8"):
                    extension = "jpg"
                elif data.startswith((b"GIF87a", b"GIF89a")):
                    extension = "gif"
                elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
                    extension = "webp"
                else:
                    raise ValueError("extensionless CDN asset is not a supported image")
                filename = f"kege-cdn-image.{extension}"
        if not filename or len(filename) > 180 or re.search(r"[/\\\x00-\x1f\x7f]", filename):
            raise ValueError("unsafe original filename")
        if not data or len(data) > MAX_BYTES:
            raise ValueError("empty or oversized source asset")
        asset = Asset(data, filename, extension, MIME[extension])
        self.objects.setdefault(asset.checksum, asset)
        return asset
