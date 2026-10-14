"""Independent answer and content checks for the EGE topic 4 lesson «Кодирование и условие Фано».

The bank's programs list the shapes of the free branches of the code tree (subtopic 5).
Here every answer is recomputed another way: explicit sets of code words are enumerated —
mutually prefix-free, in increasing order, up to a length that cannot be beaten — and the
frequent letters get the short words of a set; a letter that is not in the word, or the
rest of the alphabet, is a word of weight 0. Decoding and the codes by a record are found
by trying every cut of the bits. The bank's own solution programs must print the same
answers.
"""

import heapq
import math
import subprocess
import sys
from functools import cache
from itertools import permutations, product
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "coding-and-fano"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _prefix_free(codes) -> bool:
    """No word is the beginning of another one (a repeated word included)."""
    return not any(
        i != j and b.startswith(a) for i, a in enumerate(codes) for j, b in enumerate(codes)
    )


def _words(max_len: int):
    for n in range(1, max_len + 1):
        for bits in product("01", repeat=n):
            yield "".join(bits)


def _compatible(fixed, max_len):
    return [w for w in _words(max_len) if _prefix_free([*fixed, w])]


def _sets(fixed, k, max_len):
    """Every set of k new words, prefix-free together with the fixed ones."""
    cands = sorted(_compatible(fixed, max_len))

    def go(start, chosen):
        if len(chosen) == k:
            yield list(chosen)
            return
        for i in range(start, len(cands)):
            w = cands[i]
            if all(not w.startswith(c) and not c.startswith(w) for c in chosen):
                yield from go(i + 1, [*chosen, w])

    yield from go(0, [])


def _best(fixed, weights):
    """Smallest sum of weight · length: a dynamic program over the vertices of the tree.
    A subtree takes a multiset of weights: a fixed word takes none, a vertex on the path to
    a fixed word splits them between its children, a free vertex holds one letter itself
    or splits them (a free subtree depends only on its depth)."""
    fixed = list(fixed)

    def state(v):
        if v in fixed:
            return "word"
        if any(c.startswith(v) for c in fixed):
            return "path"
        if any(v.startswith(c) for c in fixed):
            return "blocked"
        return "free"

    @cache
    def solve(key, ws):
        v, kind = key
        if not ws:
            return 0
        if kind in ("word", "blocked") or len(v) > 12:
            return math.inf
        depth = len(v)
        best = ws[0] * depth if kind == "free" and len(ws) == 1 and depth else math.inf
        if kind == "free" and len(ws) == 1:
            return best
        n = len(ws)
        for mask in range(1 << n):
            left = tuple(w for i, w in enumerate(ws) if mask >> i & 1)
            right = tuple(w for i, w in enumerate(ws) if not mask >> i & 1)
            if kind == "free" and (not left or not right):
                continue
            cost = solve(child(v, "0"), left) + solve(child(v, "1"), right)
            best = min(best, cost)
        return best

    def child(v, b):
        w = v + b
        kind = "free" if v.startswith("#") else state(w)
        # a free subtree is the same at the same depth: key it by depth only
        return ("#" * len(w) if kind == "free" else w, kind)

    return solve(("", state("") if fixed else "free"), tuple(sorted(weights)))


def _shortest(fixed, pick=min, room=False):
    for n in range(1, 8):
        ok = [
            w
            for w in _compatible(fixed, n)
            if len(w) == n and (not room or _compatible([*fixed, w], n + 1))
        ]
        if ok:
            return pick(ok)
    raise AssertionError(fixed)


def _cuts(bits, table):
    """Every way to read the bits with the table, as words."""
    if not bits:
        yield ""
        return
    for code, letter in table.items():
        if bits.startswith(code):
            for rest in _cuts(bits[len(code) :], table):
                yield letter + rest


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    table = {"А": "0", "Б": "10", "В": "110", "Г": "111"}
    vaga = "".join(table[c] for c in "ВАГА")
    a["task-4-1-02"] = f"{vaga} {len(vaga)}"
    sixes = len(list(product("01", repeat=6)))
    uniform = next(n for n in range(1, 9) if len(list(product("01", repeat=n))) >= 20)
    a["task-4-1-03"] = f"{sixes} {uniform}"
    (word,) = set(_cuts("010100011", {"00": "А", "010": "Б", "011": "В", "1": "Г"}))
    a["task-4-2-01"] = word
    a["task-4-2-04"] = _shortest(["00", "01", "110", "111"])
    a["task-4-2-05"] = f"{_shortest(['0', '111', '101'])} {_shortest(['0', '111', '101'], max)}"
    a["task-4-2-06"] = " ".join(w for w in _compatible(["1", "000", "011"], 4) if len(w) == 4)
    a["task-4-2-07"] = _shortest(["01", "001", "11", "100"])
    a["task-4-2-08"] = _shortest(
        ["000", "0010", "0011", "010", "0110", "100", "101", "1100", "111"]
    )
    a["task-4-2-09"] = _shortest(["1", "001", "010"], max)
    a["task-4-3-01"] = _shortest(["1", "01"], room=True)
    a["task-4-3-02"] = str(1 + _best(["1"], [1, 1, 1]))
    a["task-4-3-03"] = str(3 + _best(["0", "10"], [1] * 5))
    a["task-4-3-04"] = str(_best(["00", "011", "10"], [1, 1, 1]))
    a["task-4-3-05"] = str(_best(["1", "011", "0101", "01001"], [1, 1]))
    a["task-4-3-06"] = _shortest(["00", "010", "011", "10"], room=True)
    a["task-4-3-07"] = str(7 + _best(["0", "100", "110"], [1, 1, 1]))
    a["task-4-3-08"] = str(_best(["000", "001", "0100", "011", "10", "1101"], [1, 1]))
    a["task-4-3-09"] = _shortest(["000", "001", "01", "10"], room=True)
    a["task-4-4-01"] = str(sum(len(table[c]) for c in "АББАВ"))
    a["task-4-4-02"] = (
        f"{sum(len(c) for c in table.values())} {len(vaga)} {len(table['В']) * len(table['Г'])}"
    )
    a["task-4-4-03"] = str(min(4 * x + 1 * y for x, y in permutations([2, 3])))
    a["task-4-4-04"] = str(_best(["0"], [2, 1, 0]))
    a["task-4-4-05"] = str(6 + _best(["00", "011", "101"], [2, 0]))
    a["task-4-4-06"] = str(_best(["01", "100"], [2, 2, 1, 1]))
    a["task-4-4-07"] = str(3 + _best(["010", "011", "10"], [2, 1, 0, 0]))
    a["task-4-4-08"] = str(4 + _best(["1", "01"], [3, 1]))
    a["task-4-5-01"] = str(_best(["01", "10", "110"], [6, 2, 1, 1]))
    full = [
        sorted(len(c) for c in s)
        for s in _sets(["0", "10"], 3, 6)
        if not _compatible(["0", "10", *s], 6)
    ]
    a["task-4-5-02"] = " ".join(map(str, min(full, key=sum)))
    a["task-4-5-03"] = f"{_best(['0'], [5, 1, 1, 1])} {_best(['0'], [2, 2, 2, 2])}"
    a["task-4-5-04"] = str(5 + _best(["001", "01"], [2, 1, 1, 1]))
    a["task-4-5-05"] = str(8 + _best(["1100", "1111"], [2, 1, 1, 1, 1]))
    a["task-4-5-06"] = str(2 + _best(["11"], [2, 2, 1, 0]))
    a["task-4-6-01"] = str(len(_compatible(["1", "01"], 5)))
    a["task-4-6-02"] = str(
        sum(1 for w in _compatible(["1", "01"], 5) if _compatible(["1", "01", w], 6))
    )
    a["task-4-6-03"] = str(
        sum(1 for w in _compatible(["0", "100"], 4) if _compatible(["0", "100", w], 5))
    )
    fixed = ["10", "110", "1110", "11111"]
    a["task-4-6-05"] = str(min(len(x) * len(y) for x, y in _sets(fixed, 2, 6)))
    pairs = []
    for s in _sets(["0"], 4, 6):
        ls = sorted(len(c) for c in s)
        pairs.append((2 * ls[0] + ls[1] + ls[2] + ls[3], sum(ls)))
    a["task-4-6-06"] = str(min(pairs)[1])
    records = []
    for o, t in _sets(["10"], 2, 4):
        for oo, tt in ((o, t), (t, o)):
            records.append("10" + oo + tt + oo + "10")
    best = min(records, key=lambda s: (len(s), s))
    a["task-4-6-07"] = format(int(best, 2), "o")
    ones = []
    for v, g, r in _sets(["01", "111"], 3, 5):
        for x, y in permutations([v, g, r], 2):
            ones.append(x.count("1") + 1 + y.count("1"))
    a["task-4-6-08"] = str(min(ones))
    a["task-4-6-09"] = min(
        (w for w in _words(4) if len(w) > 1 and w not in ("01", "11", "001")
         and not _prefix_free(["01", "11", "001", w])),
        key=lambda w: (len(w), w),
    )  # fmt: skip
    s = "0100100"
    a["task-4-7-01"] = next(
        f"{s[:i]} {s[i:j]}"
        for i in range(1, 7)
        for j in range(i + 1, 7)
        if s[:i] + s[i:j] + s[:i] + s[i:j] + s[:i] == s and _prefix_free([s[:i], s[i:j]])
    )
    s = "100111010"
    a["task-4-7-02"] = next(
        s[j:k]
        for i in range(1, 5)
        for j in range(i + 1, 8)
        for k in range(j + 1, 9)
        if s[:i] + s[i:j] + s[j:k] + s[i:j] + s[:i] == s and _prefix_free([s[:i], s[i:j], s[j:k]])
    )
    fixed = ["00", "011", "110"]
    lengths = {
        len(lw) + len(sw) + 5
        for lw, sw in permutations(_compatible(fixed, 5), 2)
        if 2 * len(lw) + 2 + len(sw) == 9
        and _prefix_free([*fixed, lw, sw])
        and _compatible([*fixed, lw, sw], 6)
    }
    (only,) = lengths
    a["task-4-7-03"] = str(only)
    s1, s2 = "110010", "100110"
    a["task-4-7-04"] = next(
        s1[:i] + s1[i:j] + s1[:i] + s1[i:j]
        for i in range(1, 5)
        for j in range(i + 1, 6)
        if s1[j:] + s1[i:j] + s1[:i] == s2 and _prefix_free([s1[:i], s1[i:j], s1[j:]])
    )
    heap = [5, 3, 1, 1]
    heapq.heapify(heap)
    cost = 0
    while len(heap) > 1:
        merged = heapq.heappop(heap) + heapq.heappop(heap)
        cost += merged
        heapq.heappush(heap, merged)
    a["task-4-7-07"] = str(cost)
    a["task-4-8-01"] = _shortest(["00", "01", "101", "11"], room=True)
    a["task-4-8-02"] = str(_best(["000", "01", "100", "11", "1010"], [1, 1, 1]))
    a["task-4-8-03"] = str(3 + _best(["0", "10"], [2, 1, 1]))
    a["task-4-8-04"] = str(3 + _best(["011"], [3, 1, 1, 1, 0]))
    a["task-4-8-05"] = str(2 + _best(["11"], [2, 1, 1, 1, 0]))
    return a


def _solution(task: TaskData) -> str:
    (code,) = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    return code


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(50))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [4] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-4-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith(("task-4-6-", "task-4-7-"))
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_a_neighbour(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        tokens = expected.split()
        last = tokens[-1]
        # a code word loses its leading zero, a number grows by one, a word changes a letter
        tokens[-1] = (
            str(int(last) + 1)
            if last.isdigit() and not set(last) <= {"0", "1"}
            else last[1:] or last + "0"
            if set(last) <= {"0", "1"}
            else last[:-1] + chr(ord(last[-1]) + 1)
        )
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution(task)
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            check=True,
            timeout=300,
        )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
