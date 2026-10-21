"""Independent answer and content checks for the EGE topic 12 lesson.

The lesson «Исполнение алгоритма для исполнителя» runs Turing machines. The bank's answers
come from the stand's executor (``turing_figures``). Here a number on the tape is
recomputed by the formula the lesson derives for each table (minus one, 2ᵏ added on the left,
inversion 2ᵏ − 1 − N, two digits on the right …); steps and inverse questions run a separate
small simulator over a list tape. The table of every task is read from the bank task itself
(its ``table`` block).
"""

from itertools import product
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "executors"
Rules = dict[tuple[str, str], tuple[str, str, str]]


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _rules(rows: dict[str, str], alphabet: str = "λ01") -> Rules:
    out: Rules = {}
    for state, cells in rows.items():
        for sym, cell in zip(alphabet, cells.split(), strict=True):
            if cell != "-":
                out[(state, sym)] = (cell[0], cell[1], cell[2:])
    return out


SUB = _rules({"q0": "λLq1 - -", "q1": "λSq1 1Lq1 0Sq1"})
LEFT = _rules({"q0": "λLq1 - -", "q1": "1Lq2 0Lq1 1Lq1", "q2": "λSq2 - -"})
PLUS = _rules({"q0": "λLq1 - -", "q1": "1Sq1 1Sq1 0Lq1"})
MIRROR = _rules({"q0": "λRq1 - -", "q1": "λSq1 1Sq1 0Rq1"})
PHASES = _rules({"q0": "λRq1 - -", "q1": "0Lq2 1Rq1 1Rq1", "q2": "0Lq3 - 1Lq2", "q3": "1Sq3 - -"})
PARITY = _rules({"q0": "0Sq0 0Rq0 1Rq1", "q1": "1Sq1 0Rq1 1Rq0"})
CYCLE = _rules({"q0": "λLq1 - - -", "q1": "λSq1 2Lq1 0Lq1 1Lq1"}, "λ012")


def _run(word: str, rules: Rules, head: int, state: str = "q0") -> tuple[str, int, int]:
    """A list tape with a margin: (word left on the tape, steps, head relative to the word)."""
    pad = 40
    cells = ["λ"] * pad + list(word) + ["λ"] * pad
    pos, steps = head + pad, 0
    while True:
        write, move, state = rules[(state, cells[pos])]
        cells[pos] = write
        steps += 1
        if move == "S":
            break
        pos += 1 if move == "R" else -1
    used = [i for i, c in enumerate(cells) if c != "λ"]
    return "".join(cells[used[0] : used[-1] + 1]), steps, pos - pad


def _right(word: str, rules: Rules) -> tuple[str, int, int]:
    return _run(word, rules, len(word))


def _left(word: str, rules: Rules) -> tuple[str, int, int]:
    return _run(word, rules, -1)


def _table(task: TaskData) -> Rules:
    (block,) = [b for b in task.statement if b.type == "table"]
    out: Rules = {}
    for row in block.data.rows:
        for sym, cell in zip(block.data.headers[1:], row[1:], strict=True):
            if cell != "—":
                write, move, state = (part.strip() for part in cell.split(","))
                out[(row[0], sym)] = (write, move, state)
    return out


def _range(
    length: int, k: int, run, rules: Rules, digit: str, canon: bool = False
) -> tuple[int, int]:
    found = [
        w.count(digit)
        for w in ("".join(p) for p in product("01", repeat=length))
        if (not canon or w[0] == "1") and run(w, rules)[0].count(digit) == k
    ]
    return min(found), max(found)


def _prime(x: int) -> bool:
    return x > 1 and not any(x % d == 0 for d in range(2, x))


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    t = _entries()
    a: dict[str, str] = {}
    a["task-12-1-03"] = _right("10100", SUB)[0]
    a["task-12-1-05"] = str(_right("1000", SUB)[1])
    a["task-12-1-07"] = str(37 - 1)
    a["task-12-1-08"] = str(_right(f"{40:b}", SUB)[1])
    # 2.1: 0 → 2, 1 → 0, 2 → 1: zeros came from ones, ones from twos, twos from zeros
    a["task-12-2-01"] = "4"  # the question is the ones of the input
    a["task-12-2-02"] = _right("0120", CYCLE)[0]
    low = {"1": 5, "0": 9}
    a["task-12-2-03"] = str(3 * low["1"] + 3 * low["0"])
    a["task-12-2-04"] = str(2**3)
    a["task-12-2-05"] = str(max(5 * f + 7 * (7 - f) + 2 * 9 for f in range(8) if f >= 7 - f))
    # 2.6: a zeros of the input give twos (2 each), c twos give ones; 2a + c = 12, a + c ≤ 10
    a["task-12-2-06"] = str(
        max(c for a2 in range(11) for c in range(11 - a2) if 2 * a2 + c == 12 and a2 + c <= 10)
    )
    a["task-12-2-07"] = str(max(4 * 7 + 3 * 9, 3 * 7 + 4 * 9))
    a["task-12-3-01"] = str(2 * 37 + 1)
    a["task-12-3-02"] = str(int(_right("101", LEFT)[0], 2))
    a["task-12-3-04"] = _right("101111", PLUS)[0]
    a["task-12-3-05"] = str(4 * 45 + 2)
    a["task-12-3-06"] = str(100 + 2 ** len(f"{100:b}"))
    a["task-12-3-07"] = str(50 + 2 ** (len(f"{50:b}") - 1))
    a["task-12-4-02"] = str(_range(15, 6, _right, SUB, "0")[0])
    a["task-12-4-03"] = str(_right("1000000", SUB)[1])
    a["task-12-4-04"] = str(_range(10, 1, _right, SUB, "0")[1])
    a["task-12-4-05"] = str(_range(7, 0, _right, SUB, "0")[0])
    a["task-12-4-06"] = str(_range(12, 5, _right, SUB, "0", canon=True)[1])
    low4, high4 = _range(10, 4, _left, MIRROR, "1")
    a["task-12-4-07"], a["task-12-4-08"] = str(high4), str(low4)
    # 10, k ones, 0: the value 3 · 2^(k+1) − 2
    a["task-12-5-01"] = str(max(v for k in range(1, 12) if (v := 3 * 2 ** (k + 1) - 2) <= 500))
    a["task-12-5-02"] = str(_left("10110", PHASES)[1])
    a["task-12-5-03"] = _run("110", PARITY, 0)[0]
    a["task-12-5-04"] = _run("100110", PARITY, 0)[0]
    a["task-12-5-05"] = str(2 ** (len(f"{13:b}") + 1) + 2 * 13 + 1)
    a["task-12-5-06"] = str(3 * 2 ** (len(f"{2027:b}") + 1) - 2)
    a["task-12-5-07"] = str(
        next(n for n in range(1, 5000) if 2 ** (len(f"{n:b}") + 1) + 2 * n + 1 > 1000)
    )
    a["task-12-6-06"] = str(2 ** len(f"{200:b}") - 1 - 200)  # inversion
    a["task-12-6-07"] = str(1000 + 2 ** len(f"{1000:b}"))
    a["task-12-7-02"] = "".join({"7": "3", "8": "6", "3": "9"}[c] for c in "7738")
    triples = [
        (n, x, y, n - x - y) for n in range(1, 21) for x in range(n + 1) for y in range(n + 1 - x)
    ]

    def total(x: int, y: int, z: int) -> int:
        return 7 * x + 8 * y + 3 * z

    a["task-12-7-03"] = str(
        min(total(x, y, z) + n for n, x, y, z in triples if min(x, y, z) >= 1 and x + z >= 6)
    )
    a["task-12-7-04"] = str(
        max(total(x, y, z) + n for n, x, y, z in triples if n <= 12 and x + z >= 4)
    )
    a["task-12-7-05"] = str(
        min(
            n
            for n, x, y, z in triples
            if min(x, y, z) >= 1 and y % 2 == 1 and _prime(total(x, y, z))
        )
    )
    a["task-12-7-06"] = str(
        max(
            total(x, y, z)
            for n, x, y, z in triples
            if n == 8 and min(x, y, z) >= 1 and _prime(total(x, y, z))
        )
    )
    a["task-12-8-01"] = str(int(_right(f"{45:b}", _table(t["task-12-8-01"]))[0], 2))
    a["task-12-8-02"] = str(_right(f"{95:b}", _table(t["task-12-8-02"]))[1])
    rules83 = _table(t["task-12-8-03"])
    twos = {
        w.count("2")
        for w in ("".join(p) for p in product("012", repeat=10))
        if sorted(_right(w, rules83)[0]) == sorted("0000011122")
    }
    (a["task-12-8-03"],) = map(str, twos)
    a["task-12-8-04"] = str(_range(15, 6, _right, _table(t["task-12-8-04"]), "0")[1])
    a["task-12-8-05"] = str(int(_left(f"{100:b}", _table(t["task-12-8-05"]))[0], 2))
    return a


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(43))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [12] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-12-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-12-7-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_every_task_shows_its_program_table() -> None:
    # Change 197: a task is solved without the lesson open, as in the exam.
    same = [
        (SUB, ["1-03", "1-05", "1-07", "1-08", "4-02", "4-03", "4-04", "4-05", "4-06"]),
        (LEFT, ["3-02", "3-06", "6-07"]),
        (PLUS, ["3-04"]),
        (MIRROR, ["4-07", "4-08"]),
        (PHASES, ["5-01", "5-02", "5-06"]),
        (PARITY, ["5-03", "5-04"]),
        (CYCLE, ["2-01", "2-02", "2-06"]),
    ]
    tasks = _entries()
    for task_id, task in tasks.items():
        tables = [b for b in task.statement if b.type == "table"]
        assert len(tables) == 1 and tables[0].data.headers[0] == "Состояние", task_id
    for rules, ids in same:
        for short in ids:
            assert _table(tasks[f"task-12-{short}"]) == rules, short


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        tokens[-1] = str(int(tokens[-1]) + 1)
        assert not is_correct(task.checker, " ".join(tokens)), task_id
