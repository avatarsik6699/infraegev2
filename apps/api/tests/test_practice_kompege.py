"""Offline content integrity and neutral identity contracts, without solving source tasks."""

import json
from pathlib import Path

import pytest

from app.modules.practice.files import Package
from app.modules.practice.kompege import prepare
from app.modules.practice.kompege_content import blocks, formula
from app.modules.practice.schemas import Registry

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "content/practice-imports/120-ege-5-16"
REGISTRY = Registry.model_validate_json((ROOT / "apps/api/practice-registry.json").read_bytes())


def test_formula_grouping_and_indices():
    assert formula(r"\frac{n+1}{F(n-1)}") == "(n+1) / (F(n-1))"
    assert blocks("<p>101<sub>2</sub> = 5<sub>10</sub></p>")[0]["data"]["markdown"] == "101₂ = 5₁₀"
    assert blocks(r"<p>\(F(n)\) при \(n\geq 2\)</p>")[0]["data"]["markdown"] == "`F(n)` при `n≥ 2`"
    with pytest.raises(ValueError, match="formula command"):
        formula(r"\unsupported{x}")
    with pytest.raises(ValueError, match="unsupported source element"):
        blocks("<script>alert(1)</script>")


def test_code_listings_preserve_indentation_and_remove_external_links():
    content = blocks(
        '<p><a href="https://example.com">Автор</a></p><table><tr><td>Python</td></tr>'
        "<tr><td><pre>def f(n):<br>    return n &lt; 2</pre></td></tr></table>"
    )
    assert content[0]["data"]["markdown"] == "Автор"
    assert content[1]["data"] == {
        "language": "python",
        "code": "def f(n):\n    return n < 2",
        "caption": "Python",
    }
    assert "https://" not in json.dumps(content)


def test_complete_reproducible_package(tmp_path):
    first = prepare(SOURCE, tmp_path / "first", REGISTRY)
    second = prepare(SOURCE, tmp_path / "second", REGISTRY)
    assert first.checksum == second.checksum
    snapshot = json.loads((SOURCE / "source.json").read_bytes())["tasks"]
    identities = json.loads((SOURCE / "identity.json").read_bytes())
    assert len(snapshot) == 547
    assert len(first.manifest.tasks) == len(snapshot)
    assert not first.manifest.files
    edits = {edit.task.id: edit for edit in first.edits()}
    for source in snapshot:
        edit = edits[identities[str(source["taskId"])]]
        task = edit.task
        assert task.checker.answer_variants == [source["key"]]
        assert task.catalog_visible and not task.archived
        assert edit.expected_revision == 0
        assert task.sources[0].title == (source["comment"].strip() or None)
        assert task.sources[0].is_public and not task.sources[1].is_public
        assert task.sources[1].original_id == str(source["taskId"])
        assert task.theory_links[0].section is None
        assert not task.lessons
        assert task.statement and task.explanation
        assert task.exam_numbers == [source["number"]]
    assert "videotype" not in (SOURCE / "source.json").read_text()
    assert "timecode" not in (SOURCE / "source.json").read_text()
    assert "user_id" not in (SOURCE / "source.json").read_text()
    with pytest.raises(FileExistsError):
        prepare(SOURCE, tmp_path / "first", REGISTRY)


def test_delivered_package_matches_editorial_inputs(tmp_path):
    rebuilt = prepare(SOURCE, tmp_path / "rebuilt", REGISTRY)
    delivered = Package(SOURCE / "package")
    assert rebuilt.checksum == delivered.checksum


def test_corrections_only_change_editorial_content():
    original = {edit.task.id: edit.task for edit in Package(SOURCE / "package").edits()}
    corrections = Package(SOURCE / "corrections")
    corrections.validate(REGISTRY)
    edits = list(corrections.edits())
    assert len(edits) == 192
    for edit in edits:
        assert edit.expected_revision == 1
        assert edit.mode == "editorial"
        before = original[edit.task.id].model_dump(exclude={"title", "explanation"})
        after = edit.task.model_dump(exclude={"title", "explanation"})
        assert after == before
    assert {edit.task.id for edit in edits} <= set(original)
