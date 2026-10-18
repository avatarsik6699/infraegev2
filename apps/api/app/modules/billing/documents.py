"""The public offer a buyer accepts by paying (Change 192, SPEC §8.2).

Versions live as `content/legal/oferta/<YYYY-MM-DD>.md` (in the image `/app/legal/oferta`);
the newest file is current. The API records the version and the SHA-256 of its text, so a
later edit of the page cannot change what a buyer accepted.
"""

import hashlib
from dataclasses import dataclass
from functools import cache
from pathlib import Path

HERE = Path(__file__).resolve()
# The image keeps the offer next to the app (`/app/legal`); a checkout keeps it under
# `content/legal`, two levels further up. The image path is too short for the second.
CANDIDATES = tuple(
    root / sub
    for depth, sub in ((3, "legal"), (5, "content/legal"))
    if depth < len(HERE.parents)
    for root in (HERE.parents[depth],)
)


@dataclass(frozen=True)
class Offer:
    version: str
    text_sha256: str


def legal_dir() -> Path:
    for candidate in CANDIDATES:
        if (candidate / "oferta").is_dir():
            return candidate
    raise RuntimeError("the public offer is missing from the build")


@cache
def current_offer() -> Offer:
    versions = sorted((legal_dir() / "oferta").glob("????-??-??.md"))
    if not versions:
        raise RuntimeError("the public offer has no versions")
    latest = versions[-1]
    return Offer(latest.stem, hashlib.sha256(latest.read_bytes()).hexdigest())
