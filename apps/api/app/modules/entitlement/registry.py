"""Free or paid: the access level of materials, from the generated practice registry.

The registry ships in the API image beside the code (`practice-registry.json`), so a
release changes access together with the content it describes, never by a database edit.
"""

from collections.abc import Iterable, Mapping
from functools import cache
from pathlib import Path
from typing import Any, Literal

from app.modules.practice.schemas import MaterialDefinition, Registry

Access = Literal["free", "paid"]
REGISTRY = Path(__file__).resolve().parents[3] / "practice-registry.json"


@cache
def registry() -> dict[str, MaterialDefinition]:
    parsed = Registry.model_validate_json(REGISTRY.read_bytes())
    return {material.id: material for material in parsed.materials}


def membership_access(material: MaterialDefinition, sections: set[str]) -> Access:
    """A course lesson has one level; in a topic a task belongs to the earliest
    subtopic its theory links point into, as the topic page groups it, and to
    «Практика и итог» otherwise."""
    if material.kind == "course":
        return material.access
    owner = next(
        (subtopic for subtopic in material.subtopics if sections & set(subtopic.sections)),
        None,
    )
    return owner.access if owner else material.final_access


def task_access(content: Mapping[str, Any]) -> Access:
    """A task is paid when it is outside the standalone bank and every published
    lesson that holds it shows it on a paid page; one free page makes it free."""
    if content.get("catalog_visible", True):
        return "free"
    materials = registry()
    links: Iterable[Mapping[str, Any]] = content.get("theory_links") or []
    seen = False
    for membership in content.get("lessons") or []:
        material = materials.get(membership.get("material_id", ""))
        if material is None or material.status != "published":
            continue
        seen = True
        sections = {
            link["section"]
            for link in links
            if link.get("material_id") == material.id and link.get("section")
        }
        if membership_access(material, sections) == "free":
            return "free"
    return "paid" if seen else "free"
