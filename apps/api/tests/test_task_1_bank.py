"""Independent answer and content checks for the EGE topic 1 lesson «Анализ информационных моделей».

The bank's answers try every map letter → number (``topic-1/bank.py``). Here every answer
is recomputed another way: the letters are assigned one at a time, most roads first, and a
partial map is dropped as soon as one road or one absence between assigned letters breaks.
The table is read from the bank task itself (its ``table`` block); the scheme, drawn as a
picture in the bank, is read from the stand's ``gm_graph`` call of the same task (data, not
the method). A task with a scheme shows it as a PNG image of the bank.
"""

import ast
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
TOPIC = ROOT / "content/lesson-design/topic-1"
MATERIAL = "information-models"
PAGES = [
    "01-model-i-stepeni.md",
    "02-sosedi-i-opory.md",
    "03-kandidaty-i-proverka.md",
    "04-simmetriya-i-otvet.md",
    "05-dliny-i-format.md",
    "06-dopolnitelnye-usloviya-i-marshruty.md",
    "07-praktika-i-itog.md",
]
Roads = dict[frozenset[str], int | None]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _question(page: int, number: int) -> str:
    text = (TOPIC / PAGES[page - 1]).read_text()
    block = next(
        s
        for s in text.split("\n---\n")
        if s.strip().startswith(("**Чтобы проверить понимание", "**Задачи основных подтем"))
    )
    items = re.split(r"(?m)^(\d+)\. ", block.split("**Ответы для проверки:**")[0])
    return dict(zip(map(int, items[1::2]), items[2::2], strict=True))[number]


def _scheme(text: str) -> Roads:
    call = re.search(r"%%gm_graph\((.*?)\)%%", text, re.S)
    if call is None:
        names = re.search(r"дороги ((?:[A-ZА-Я]{2}, )*[A-ZА-Я]{2})", text)
        assert names
        return {frozenset(p): None for p in names.group(1).split(", ")}
    tree = ast.parse(f"f({call.group(1)})", mode="eval").body
    assert isinstance(tree, ast.Call)
    first = ast.literal_eval(tree.args[0])
    return {frozenset(p[:2]): None for p in (first.split() if isinstance(first, str) else first)}


def _table(task: TaskData) -> Roads:
    (block,) = [b for b in task.statement if b.type == "table"]
    out: Roads = {}
    for row in block.data.rows:
        for name, cell in zip(block.data.headers[1:], row[1:], strict=True):
            if cell not in ("—", "") and name != row[0]:
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
    found = {str(v) for v in values}
    assert len(found) == 1, found
    return found.pop()


def _length(t: Roads, m: dict[str, str], a: str, b: str) -> int:
    value = t[frozenset((m[a], m[b]))]
    assert value is not None
    return value


def _solve(task: TaskData, page: int, number: int, fn) -> str:
    text = _question(page, number)
    t = _table(task)
    return _unique(fn(m, t) for m in _maps(_scheme(text), t))


def _example() -> tuple[Roads, Roads, dict[str, str]]:
    page = (TOPIC / PAGES[1]).read_text()
    step = next(s for s in page.split("\n---\n") if s.strip().startswith("**Полный пример"))
    g = _scheme(step)
    table = re.search(r"\| Пункт \| 1 \|.*?(?=\n\s*\n)", step, re.S)
    assert table
    rows = [
        [c.strip().replace("**", "") for c in line.strip().strip("|").split("|")]
        for line in table.group(0).splitlines()
    ]
    t: Roads = {}
    for row in rows[2:]:
        for name, cell in zip(rows[0][1:], row[1:], strict=True):
            if cell not in ("—", "") and name != row[0]:
                t[frozenset((row[0], name))] = None if cell == "*" else int(cell)
    (m,) = _maps(g, t)
    return g, t, m


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    tasks = _entries()
    a: dict[str, str] = {}

    def at(task_id: str, fn) -> None:
        _, _, page, number = task_id.split("-")
        a[task_id] = _solve(tasks[task_id], int(page), int(number), fn)

    def road(x: str, y: str):
        return lambda m, t: _length(t, m, x, y)

    def pair(*letters: str):
        return lambda m, t: "".join(sorted(m[x] for x in letters))

    def route(path: str):
        return lambda m, t: sum(_length(t, m, x, y) for x, y in zip(path, path[1:], strict=False))

    def row(x: str):
        return lambda m, t: sum(w or 0 for e, w in t.items() if m[x] in e)

    a["task-1-1-02"] = str(sum([3, 1, 2, 2, 4, 2]) // 2)
    a["task-1-1-03"] = "3"
    at("task-1-1-07", road("А", "Д"))
    at("task-1-1-08", pair("Б", "В"))
    # 2.4: the neighbours of 5 of degree 2 are 1, 3, 6; 1 and 6 are joined with 2
    a["task-1-2-04"] = _unique({"1", "3", "6"} - {"1", "6"})
    at("task-1-2-05", lambda m, t: " ".join(m[x] for x in "ABCDEF"))
    at("task-1-2-06", road("Б", "В"))
    at("task-1-2-07", lambda m, t: m["Г"])
    at("task-1-3-02", pair("A", "B", "C"))
    roads = {frozenset(r.split("—")) for r in "1—2 1—3 2—3 2—4 3—4 4—5".split()}
    points = sorted({x for r in roads for x in r})
    a["task-1-3-03"] = str(
        sum(
            {frozenset(e) for e in combinations(tri, 2)} <= roads for tri in combinations(points, 3)
        )
    )
    a["task-1-3-04"] = str(len({"C", "D", "E", "F"} & {"D", "F", "G"}))
    at("task-1-3-07", lambda m, t: m["Ж"])
    at("task-1-3-08", road("А", "Д"))
    at("task-1-4-05", pair("Б", "В"))
    at("task-1-4-06", road("Б", "В"))
    a["task-1-5-01"] = " ".join(
        _solve(tasks["task-1-5-01"], 5, 1, fn) for fn in (road("B", "D"), row("A"), route("EABF"))
    )
    g, t, m = _example()
    a["task-1-5-02"] = str(sum(_length(t, m, "D", x) for x in "BCF"))
    a["task-1-5-03"] = str(sum(_length(t, m, x, y) for x, y in ("AC", "CD", "DF")))
    a["task-1-5-04"] = f"{min(m['E'], m['D'])}{max(m['E'], m['D'])} {m['D']}{m['E']}"
    at("task-1-5-06", lambda m, t: _length(t, m, "А", "Б") + _length(t, m, "В", "Е"))
    at("task-1-5-07", route("ЕГДБ"))
    # 6.1: {A, B} ↔ {3, 5}, C ↔ 1; 3—1 is 14 km, 5—1 is 9 km; A—C is the longer one
    to_c = {"3": 14, "5": 9}
    a["task-1-6-01"] = _unique(x for x, y in (("3", "5"), ("5", "3")) if to_c[x] > to_c[y])
    # roads from E to F, the fewest: every path without repeats, the shortest kept
    paths = [["E"]]
    best = None
    while paths and best is None:
        paths = [p + [y] for p in paths for e in g if p[-1] in e for y in e - {p[-1]} if y not in p]
        best = next((len(p) - 1 for p in paths if p[-1] == "F"), None)
    a["task-1-6-05"] = str(best)
    t67 = _table(tasks["task-1-6-07"])
    a["task-1-6-07"] = _unique(
        _length(t67, mm, "А", "Б")
        for mm in _maps(_scheme(_question(6, 7)), t67)
        if _length(t67, mm, "Б", "Г") < _length(t67, mm, "В", "Г")
    )
    g68, t68 = _scheme(_question(6, 8)), _table(tasks["task-1-6-08"])
    letters = sorted({x for e in g68 for x in e})
    lost = set()
    for x in letters:
        for y in letters:
            if x < y and frozenset((x, y)) not in g68:
                for mm in _maps({**g68, frozenset((x, y)): None}, t68):
                    lost.add(_length(t68, mm, x, y))
    a["task-1-6-08"] = _unique(lost)
    at("task-1-7-01", road("А", "В"))
    at("task-1-7-02", lambda m, t: m["Д"])
    at("task-1-7-03", pair("Д", "Е"))
    at("task-1-7-04", lambda m, t: _length(t, m, "А", "Г") + _length(t, m, "Б", "Д"))
    at("task-1-7-05", row("А"))
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(30))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [1] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-1-7-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-1-6-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_scheme_is_a_png_image_of_the_task() -> None:
    files = {f.checksum: f for f in _bank().files}
    for task_id, task in _entries().items():
        images = [b for b in task.statement if b.type == "image"]
        uses = {u.id: u for u in task.files}
        assert len(images) == ("%%gm_graph" in _question(*map(int, task_id.split("-")[2:]))), (
            task_id
        )
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
