"""Independent answer and content checks for the EGE topic 1 lesson «Анализ информационных моделей».

The bank builder tries every map letter → number at once. Here every answer is recomputed
another way: the letters are assigned one at a time, most roads first, and a partial map is
dropped as soon as one road or one absence between assigned letters breaks. The table is read
from the bank task itself (its ``table`` block); the scheme, drawn as a picture in the bank, is
written out here again as its list of roads (data, not the method). The example of the
subtopic «Единственные степени и соседи» is written out the same way.
"""

import hashlib
import re
from itertools import combinations
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "information-models"
Roads = dict[frozenset[str], int | None]

# The roads of every scheme drawn as a picture: «АБ» is the road between А and Б.
SCHEMES = {
    "task-1-1-07": "АБ АВ АГ АД БВ ГД ДЕ",
    "task-1-1-08": "АБ АВ АГ АД БВ ВЕ",
    "task-1-2-06": "АБ АВ БВ БГ ВД ГД ГЕ",
    "task-1-2-07": "АБ АВ АГ БВ ВД ГД ДЕ",
    "task-1-3-02": "AB BC CA AD BE CF DG DH EG EH FG FH",
    "task-1-3-07": "ВД БГ АЕ АГ АЖ ДЕ АД БЖ ВЖ",
    "task-1-3-08": "АД АЕ ВГ ДЖ БД ГЖ БГ ЕЖ ДЕ",
    "task-1-3-09": "АБ АЖ АГ БЕ БД ЕЖ ЖГ ГВ ДВ",
    "task-1-4-05": "АБ АВ БВ БГ ВГ ГД ДЕ",
    "task-1-4-06": "АБ АВ АГ БВ ГД ГЕ ДЕ ЕЖ",
    "task-1-4-07": "BC CF DF AF BD DE BE AE",
    "task-1-4-08": "АБ БВ АД БЕ ВК ДЕ ЕК ВГ КГ",
    "task-1-4-09": "АБ АВ АГ АД АЕ АК БВ ВГ ГД ДЕ ЕК",
    "task-1-4-10": "ВГ ВА ГЗ ГЖ ЗД ЗБ ДЖ АБ АЕ ЕБ БЖ",
    "task-1-4-11": "FD FE FC FI DA AE CB CG CH BG BE GE HI IE",
    "task-1-5-01": "AB AC AD AE BD BF CD",
    "task-1-5-06": "АБ АВ АГ БВ БД ВЕ ГЕ ДЕ",
    "task-1-5-07": "АБ БВ ВГ ГД ДА БД ГЕ",
    "task-1-6-07": "АБ АВ БВ БГ ВГ ГД ДЕ",
    "task-1-6-09": "AC AB CB BE BF BD EF DF",
    "task-1-7-01": "АВ БД ДЕ АБ ВД БВ БГ АГ",
    "task-1-7-02": "БГ АГ БЖ БВ АД АЖ ЕЖ БЕ ДЖ",
    "task-1-7-03": "АГ ВД ГЕ ГД АБ ВЕ ВГ",
    "task-1-7-04": "БВ ВЕ ВГ АД ДЕ АГ АЕ БД",
    "task-1-7-05": "БВ АБ АВ ДЕ АЕ БД ВГ БЕ",
}
# The example of the subtopic «Единственные степени и соседи»: its scheme and its table.
EXAMPLE_SCHEME = "AB BC BD BE CD CE DF"
EXAMPLE_TABLE = [(1, 3, 5), (1, 4, 7), (1, 5, 9), (2, 5, 8), (3, 5, 11), (3, 6, 12), (5, 6, 6)]
FINAL = {f"task-1-7-0{i}" for i in range(1, 6)}
ARCHIVED = {"task-1-6-05", "task-1-6-08"}


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _scheme(spec: str) -> Roads:
    return {frozenset(road): None for road in spec.split()}


def _text_scheme(task: TaskData) -> Roads:
    text = " ".join(b.data.markdown for b in task.statement if b.type == "text")
    names = re.search(r"дороги ((?:[A-ZА-Я]{2}, )*[A-ZА-Я]{2})", text)
    assert names
    return {frozenset(p): None for p in names.group(1).split(", ")}


def _table(task: TaskData) -> Roads:
    (block,) = [b for b in task.statement if b.type == "table"]
    out: Roads = {}
    for row in block.data.rows:
        for name, cell in zip(block.data.headers[1:], row[1:], strict=True):
            if cell and name != row[0]:
                out[frozenset((row[0], name))] = None if cell == "*" else int(cell)
    return out


def _maps(g: Roads, t: Roads) -> list[dict[str, str]]:
    """Letters one by one, most roads first; a broken partial map is dropped."""
    letters = sorted({x for e in g for x in e}, key=lambda x: -sum(x in e for e in g))
    numbers = sorted({x for e in t for x in e})
    found: list[dict[str, str]] = []

    def extend(m: dict[str, str]) -> None:
        if len(m) == len(letters):
            found.append(dict(m))
            return
        x = letters[len(m)]
        for n in numbers:
            if n in m.values():
                continue
            if all((frozenset((x, y)) in g) == (frozenset((n, m[y])) in t) for y in m):
                m[x] = n
                extend(m)
                del m[x]

    extend({})
    return found


def _unique(values) -> str:
    found = {str(v) for v in values if v is not None}
    assert len(found) == 1, found
    return found.pop()


def _length(t: Roads, m: dict[str, str], a: str, b: str) -> int:
    value = t[frozenset((m[a], m[b]))]
    assert value is not None
    return value


def _shortest(t: Roads, a: str, b: str) -> int:
    """Floyd–Warshall over the table: every pair through every middle point."""
    points = sorted({x for e in t for x in e})
    inf = 10**9
    d = {(x, y): 0 if x == y else (t.get(frozenset((x, y))) or inf) for x in points for y in points}
    for k in points:
        for x in points:
            for y in points:
                d[x, y] = min(d[x, y], d[x, k] + d[k, y])
    return d[a, b]


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    tasks = _entries()
    a: dict[str, str] = {}

    def at(task_id: str, fn) -> None:
        t = _table(tasks[task_id])
        a[task_id] = _unique(fn(m, t) for m in _maps(_scheme(SCHEMES[task_id]), t))

    def road(*pairs: str):
        return lambda m, t: sum(_length(t, m, p[0], p[1]) for p in pairs)

    def pair(*letters: str):
        return lambda m, t: "".join(sorted(m[x] for x in letters))

    def route(path: str):
        return lambda m, t: sum(_length(t, m, x, y) for x, y in zip(path, path[1:], strict=False))

    def row(x: str):
        return lambda m, t: sum(w or 0 for e, w in t.items() if m[x] in e)

    a["task-1-1-02"] = str(sum([3, 1, 2, 2, 4, 2]) // 2)
    a["task-1-1-03"] = "3"
    theme = _table(tasks["task-1-4-07"])
    a["task-1-1-09"] = str(
        sum(sum(p in e for e in theme) == 3 for p in {x for e in theme for x in e})
    )
    at("task-1-1-07", road("АД"))
    at("task-1-1-08", pair("Б", "В"))
    at("task-1-5-01", row("A"))
    # the neighbours of 5 of degree 2 are 1, 3, 6; 1 and 6 are joined with 2
    a["task-1-2-04"] = _unique({"1", "3", "6"} - {"1", "6"})
    a["task-1-3-04"] = str(len({"C", "D", "E", "F"} & {"D", "F", "G"}))
    t25 = _table(tasks["task-1-2-05"])
    a["task-1-2-05"] = _unique(
        " ".join(m[x] for x in "ABCDEF") for m in _maps(_text_scheme(tasks["task-1-2-05"]), t25)
    )
    example: Roads = {frozenset((str(x), str(y))): w for x, y, w in EXAMPLE_TABLE}
    (m,) = _maps(_scheme(EXAMPLE_SCHEME), example)
    a["task-1-5-02"] = str(sum(w or 0 for e, w in example.items() if m["C"] in e))
    a["task-1-5-03"] = str(route("ABDF")(m, example))
    at("task-1-5-07", route("ЕГДБ"))
    at("task-1-2-06", road("БВ"))
    at("task-1-2-07", lambda m, t: m["Г"])
    at("task-1-3-02", pair("A", "B", "C"))
    roads = {frozenset(r.split("—")) for r in "1—2 1—3 2—3 2—4 3—4 4—5".split()}
    points = sorted({x for r in roads for x in r})
    a["task-1-3-03"] = str(
        sum(
            {frozenset(e) for e in combinations(tri, 2)} <= roads for tri in combinations(points, 3)
        )
    )
    at("task-1-3-07", lambda m, t: m["Ж"])
    at("task-1-3-08", road("АД"))
    at("task-1-3-09", road("ЕБ", "ДВ"))
    at("task-1-4-05", pair("Б", "В"))
    at("task-1-4-06", road("БВ"))
    at("task-1-4-07", road("EA", "BC"))
    at("task-1-4-08", road("АБ", "ДЕ"))
    at("task-1-4-09", road("ВГ", "ДЕ"))
    at("task-1-4-10", pair("Ж", "З"))
    at("task-1-4-11", road("GC", "BC"))
    at("task-1-5-06", road("АБ", "ВЕ"))
    a["task-1-5-04"] = _unique(
        f"{min(m['D'], m['F'])}{max(m['D'], m['F'])} {m['D']}{m['F']}"
        for m in _maps(_scheme(SCHEMES["task-1-4-07"]), theme)
    )
    # 6.1: {A, B} ↔ {3, 5}, C ↔ 1; 3—1 is 14 km, 5—1 is 9 km; A—C is the longer one
    to_c = {"3": 14, "5": 9}
    a["task-1-6-01"] = _unique(x for x, y in (("3", "5"), ("5", "3")) if to_c[x] > to_c[y])
    at(
        "task-1-6-07",
        lambda m, t: (
            _length(t, m, "А", "Б") if _length(t, m, "Б", "Г") < _length(t, m, "В", "Г") else None
        ),
    )
    at(
        "task-1-6-09",
        lambda m, t: _shortest(t, m["B"], m["D"]) if int(m["D"]) < int(m["E"]) else None,
    )
    at("task-1-7-01", road("АВ"))
    at("task-1-7-02", lambda m, t: m["Д"])
    at("task-1-7-03", pair("Д", "Е"))
    at("task-1-7-04", road("АГ", "БД"))
    at("task-1-7-05", row("А"))
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(36))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [1] and not task.catalog_visible and not task.archived
        assert bool(task.theory_links) != (task_id in FINAL), task_id
        advanced = task_id.startswith("task-1-6-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_dropped_tasks_are_archived() -> None:
    archived = {e.task.id: e.task for e in _bank().tasks if e.task.id in ARCHIVED}
    assert sorted(archived) == sorted(ARCHIVED)
    for task in archived.values():
        assert task.archived and not task.lessons and not task.theory_links


def test_the_theme_task_is_the_2027_demo() -> None:
    task = _entries()["task-1-4-07"]
    assert task.checker.answer_variants == ["26"]
    assert len(_maps(_scheme(SCHEMES["task-1-4-07"]), _table(task))) == 2


def test_tables_look_as_in_the_exam() -> None:
    for task_id, task in _entries().items():
        for block in task.statement:
            if block.type == "table":
                cells = [c for row in block.data.rows for c in row[1:]]
                assert "—" not in cells, task_id


def test_scheme_is_a_png_image_of_the_task() -> None:
    files = {f.checksum: f for f in _bank().files}
    for task_id, task in _entries().items():
        images = [b for b in task.statement if b.type == "image"]
        uses = {u.id: u for u in task.files}
        assert len(images) == (task_id in SCHEMES), task_id
        for block in images:
            use = uses[block.data.usage_id]
            assert use.purpose == "image" and use.filename.endswith(".png"), task_id
            data = (BANK_DIR / "files" / use.checksum).read_bytes()
            assert data[:8] == b"\x89PNG\r\n\x1a\n", task_id
            assert hashlib.sha256(data).hexdigest() == use.checksum, task_id
            assert files[use.checksum].mime_type == "image/png", task_id
            assert block.data.alt and block.data.width > 0, task_id


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id
