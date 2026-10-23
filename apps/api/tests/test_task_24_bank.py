"""Independent answer and content checks for the EGE topic 24 lesson «Обработка символьных строк».

The lesson makes one pass with the current length, the sliding window, positions and
``re.finditer``. Here every answer is recomputed another way: the short strings of the
tasks by the search of all substrings; the files by windows between consecutive bad
positions, positions instead of the window, queues of the last occurrences, ``split``,
``groupby`` and ``Counter``, dynamic programming over digit runs and a hand-written scan of
sums instead of regular expressions. The bank's own solution programs, run next to their
attachments, must print the same answers.
"""

import math
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter, deque
from itertools import groupby
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
FILES = ROOT / "content/lesson-files/topic-24"
MATERIAL = "string-processing"
RETIRED = [f"task-24-{number:02d}" for number in range(1, 9)] + [
    f"task-24-{n}"
    for n in (
        "3-05",
        "3-09",
        "3-10",
        "4-04",
        "5-05",
        "5-06",
        "8-03",
        "8-05",
        "8-06",
        "8-07",
        "8-08",
        "9-02",
    )
]
FINAL_PAGE = {"task-24-9-01", "task-24-9-03", "task-24-9-04", "task-24-9-05"}
VOWELS = "AEIOUY"
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
NUMBER = "(?:0|[1-9][0-9]*)"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def _read(name: str) -> str:
    return (FILES / name).read_text(encoding="ascii").split("\n")[0]


def _lines(name: str) -> list[str]:
    return (FILES / name).read_text(encoding="ascii").splitlines()


# --- the search of all substrings (short strings only) -------------------------------


def _substrings(s: str):
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            yield i, s[i:j]


def _max(s: str, ok) -> int:
    return max((len(t) for _, t in _substrings(s) if ok(t)), default=0)


def _min(s: str, ok) -> int:
    return min(len(t) for _, t in _substrings(s) if ok(t))


def _occurrences(t: str, word: str) -> int:
    return sum(t.startswith(word, i) for i in range(len(t)))


def _neighbours(t: str, good) -> bool:
    return all(good(a, b) for a, b in zip(t, t[1:], strict=False))


def _expression(t: str, number: str, signs: str) -> bool:
    return re.fullmatch(number + f"(?:[{re.escape(signs)}]{number})*", t) is not None


def _avoiding(n: int, bad_starts: list[int], m: int) -> int:
    """Longest fragment holding no bad window of length m entirely: between consecutive
    bad starts b1 < b2 it runs from b1 + 1 to b2 + m − 2."""
    marks = [-1, *bad_starts, n - m + 1]
    return max(b2 - b1 + m - 2 for b1, b2 in zip(marks, marks[1:], strict=False))


def _at_most(s: str, letter: str, k: int) -> int:
    """At most k letters: from one after the occurrence j to one before j + k + 1."""
    p = [-1, *(i for i, c in enumerate(s) if c == letter), len(s)]
    return max(p[j + k + 1] - p[j] - 1 for j in range(len(p) - k - 1))


def _each_queue(s: str, letters: str, k: int) -> int:
    """Every letter at most k times: the left end is one after the (k + 1)-th last
    occurrence of some letter."""
    last = {c: deque(maxlen=k + 1) for c in letters}
    left = best = 0
    for r, c in enumerate(s):
        if c in last:
            last[c].append(r)
            if len(last[c]) == k + 1:
                left = max(left, last[c][0] + 1)
        best = max(best, r - left + 1)
    return best


def _exact_words(s: str, word: str, k: int) -> int:
    """Exactly k whole occurrences of word (they may overlap), by their starts."""
    m = len(word)
    p = [-1, *(i for i in range(len(s) - m + 1) if s.startswith(word, i)), len(s) - m + 1]
    return max(p[j + k] - p[j - 1] + m - 2 for j in range(1, len(p) - k))


def _shortest(s: str, letter: str, k: int) -> int:
    """At least k letters, the shortest: the window that shrinks while good."""
    left = count = 0
    best = len(s) + 1
    for right, c in enumerate(s):
        count += c == letter
        while count >= k:
            best = min(best, right - left + 1)
            count -= s[left] == letter
            left += 1
    return best


def _runs(s: str, alphabet: str):
    """(start, text) of the maximal runs of characters of alphabet."""
    pos = 0
    for inside, group in groupby(s, key=lambda c: c in alphabet):
        text = "".join(group)
        if inside:
            yield pos, text
        pos += len(text)


def _longest_expression(s: str, signs: str, zero_alone: bool) -> int:
    """Dynamic programming over digit runs: the longest correct expression ending at the
    digit i; every number but the first is a whole run preceded by a sign."""
    digits = "0123456789"
    run_start = [0] * len(s)
    best_end = [0] * len(s)
    best = 0
    for i, c in enumerate(s):
        if c not in digits:
            continue
        a = run_start[i] = run_start[i - 1] if i > 0 and s[i - 1] in digits else i
        k = a
        while k <= i and s[k] == "0":
            k += 1
        single = i - k + 1 if k <= i else (1 if zero_alone else 0)
        whole = s[a] != "0" or (zero_alone and a == i)
        longer = 0
        if whole and a >= 2 and s[a - 1] in signs and best_end[a - 2] > 0:
            longer = best_end[a - 2] + 1 + (i - a + 1)
        best_end[i] = max(single, longer)
        best = max(best, best_end[i])
    return best


def _tokens(text: str) -> list[str]:
    out: list[str] = []
    for c in text:
        if c.isdigit() and out and out[-1].isdigit():
            out[-1] += c
        else:
            out.append(c)
    return out


def _numbers_window(s: str, k: int) -> int:
    """At most k numbers: maximal expressions cut where two signs meet, then the
    numbers j − k + 1 … j of each."""
    best = 0
    for _, text in _runs(s, "123456789+-*"):
        for chunk in re.split("[-+*]{2,}", text):
            spans, pos = [], 0
            for token in _tokens(chunk.strip("+-*")):
                pos += len(token)
                if token[0].isdigit():
                    spans.append((pos - len(token), pos))
            for j in range(len(spans)):
                best = max(best, spans[j][1] - spans[max(0, j - k + 1)][0])
    return best


def _no_mult_after_minus(t: str) -> bool:
    return "-" not in t or "*" not in t[t.index("-") :]


def _order_brute(s: str) -> int:
    """Base 8, − and *: every fragment of a maximal run of allowed characters."""
    number = "(?:0|[1-7][0-7]*)"
    best = 0
    for _, text in _runs(s, "01234567-*"):
        for i in range(len(text)):
            for j in range(len(text), i + best, -1):
                t = text[i:j]
                if _expression(t, number, "-*") and _no_mult_after_minus(t):
                    best = j - i
                    break
    return best


def _sums_after(s: str, letter: str, signs: str):
    """(text, values of the initial parts) of every sum right after letter, by hand."""
    for i, c in enumerate(s):
        if c != letter:
            continue
        j, values, total, sign, number, text = i + 1, [], 0, 1, "", ""
        while j < len(s):
            ch = s[j]
            if ch in "123456789":
                number += ch
            elif ch in signs and number:
                total += sign * int(number)
                values.append(total)
                text += number + ch
                sign, number = (-1 if ch == "-" else 1), ""
            else:
                break
            j += 1
        if number:
            total += sign * int(number)
            values.append(total)
            text += number
        elif text:
            text = text[:-1]
        if values:
            yield text, values


def _alphabet_one_vowel(s: str) -> int:
    """Alphabetical runs cut where a letter is smaller than the previous one; inside a
    run, at most one vowel: from one after the vowel j to one before the vowel j + 2."""
    best, start = 0, 0
    for i in range(1, len(s) + 1):
        if i == len(s) or s[i] < s[i - 1]:
            run = s[start:i]
            v = [-1, *(k for k, c in enumerate(run) if c in VOWELS), len(run)]
            if len(v) <= 3:
                best = max(best, len(run))
            else:
                best = max(best, *(v[j + 2] - v[j] - 1 for j in range(len(v) - 2)))
            start = i
    return best


def _zero_value(t: str) -> bool:
    return all("0" in term.split("*") for term in t.split("+"))


def _zero_expression(s: str) -> int:
    """Every correct expression is a substring of a maximal one; inside each maximal
    expression all substrings are checked by hand: each product holds the number 0."""
    best = 0
    for m in re.finditer(NUMBER + r"(?:[+*]" + NUMBER + r")*", s):
        e = m.group()
        for i in range(len(e)):
            for j in range(i + 1 + best, len(e) + 1):
                t = e[i:j]
                if _expression(t, NUMBER, "+*") and _zero_value(t):
                    best = j - i
    return best


def _double_letters(s: str) -> int:
    """Letters twice the digits: the first and the last position of every balance."""
    first: dict[int, int] = {0: -1}
    last: dict[int, int] = {0: -1}
    balance = 0
    for i, c in enumerate(s):
        balance += -2 if c.isdigit() else 1
        first.setdefault(balance, i)
        last[balance] = i
    return max(last[b] - first[b] for b in first)


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    f1, f2, f4, f5 = _read("24-1.txt"), _read("24-2.txt"), _read("24-4.txt"), _read("24-5.txt")
    f6, f7, f8, f9 = _read("24-6.txt"), _read("24-7.txt"), _read("24-8.txt"), _read("24-9.txt")
    # subtopic 1
    a["task-24-1-02"] = f"{len(range(4, 10))} {len(range(5, 9))} {9 - 4}"
    pairs = sum(1 for _ in _substrings("A" * 8))
    a["task-24-1-05"] = f"{pairs} {math.comb(300_001, 2)}"
    a["task-24-1-08"] = str(
        sum(Counter(line)["K"] > Counter(line)["L"] for line in _lines("24-3.txt"))
    )
    # subtopic 2
    a["task-24-2-01"] = str(_max("AXXXBXXXXXAX", lambda t: set(t) == {"X"}))
    a["task-24-2-02"] = str(_max("CAABCBCC", lambda t: _neighbours(t, str.__ne__)))
    a["task-24-2-03"] = str(_max("ZZYYYZYYYYZ", lambda t: len(set(t)) == 1))

    def triples_ok(t: str) -> bool:
        d = [int(c) for c in t]
        return all(x + y > z for x, y, z in zip(d, d[1:], d[2:], strict=False))

    a["task-24-2-04"] = str(_max("12456", triples_ok))
    a["task-24-2-05"] = str(_max("KLAKKLB", lambda t: "KL" not in t and "LK" not in t))
    a["task-24-2-07"] = str(max(len(part) for part in f1.split("Y")))
    bad = [i for i in range(len(f1) - 1) if f1[i] in "XZ" and f1[i + 1] in "XZ"]
    a["task-24-2-08"] = str(_avoiding(len(f1), bad, 2))
    d = [int(c) for c in f2]
    bad = [i for i in range(len(d) - 2) if d[i] + d[i + 2] <= d[i + 1]]
    a["task-24-2-09"] = str(_avoiding(len(d), bad, 3))
    # subtopic 3
    a["task-24-3-01"] = str(_occurrences("ABABABA", "ABA"))
    s = "ABABBAB"
    a["task-24-3-02"] = str(sum(x == z for x, z in zip(s, s[2:], strict=False)))
    a["task-24-3-03"] = str(_max("ABABCABCA", lambda t: t == ("ABC" * len(t))[: len(t)]))
    chains = [
        len(t) // 2
        for _, t in _substrings("BABEDACA")
        if len(t) % 2 == 0 and all(t[i] in "BCDF" and t[i + 1] in "AE" for i in range(0, len(t), 2))
    ]
    a["task-24-3-04"] = f"{max(chains)} {2 * max(chains)}"
    runs = [(len(t), i) for i, t in _substrings("YXXYXXYXX") if set(t) == {"X"}]
    start = max(runs)[1]
    a["task-24-3-06"] = f"{start} {start + 1}"
    a["task-24-3-07"] = str(max(len(m.group()) for m in re.finditer(r"X(?:YZX)*(?:YZ|Y)?", f1)))
    vowel_pairs = re.finditer(r"(?=((?:[AEIOUY][B-DF-HJ-NP-TV-XZ])+))", f4)
    a["task-24-3-08"] = str(max(len(m.group(1)) // 2 for m in vowel_pairs))
    # subtopic 4
    s = "ABCABBACB"
    a["task-24-4-01"] = str(_max(s, lambda t: t.count("A") <= 2))
    a["task-24-4-02"] = str(_max(s, lambda t: t.count("A") == 2))
    a["task-24-4-03"] = str(_min(s, lambda t: t.count("A") >= 2))
    a["task-24-4-05"] = str(_max("ABCBADAB", lambda t: t.count("A") <= 1 and t.count("B") <= 1))
    a["task-24-4-06"] = str(_max("AAABAAB", lambda t: _occurrences(t, "AA") <= 1))
    a["task-24-4-08"] = str(_at_most(f4, "Q", 12))
    a["task-24-4-09"] = str(_each_queue(f4, "JKXZ", 6))
    a["task-24-4-10"] = str(_exact_words(f4, "TT", 25))
    # subtopic 5
    s = "CAABACAB"
    a["task-24-5-01"] = str(_min(s, lambda t: t.count("A") >= 3))
    a["task-24-5-02"] = str(_max(s, lambda t: t.count("A") == 2))
    a["task-24-5-03"] = str(_min("ABACABAABA", lambda t: _occurrences(t, "ABA") >= 2))
    a["task-24-5-04"] = str(_max("ABYCDXEFGHYXI", lambda t: not set(t) & {"X", "Y"}))

    a["task-24-5-07"] = str(_shortest(f4, "Q", 50))
    best = len(f5) + 1
    for part in f5.split("0")[:-1]:  # every part but the last is followed by a 0
        ks = [i for i, c in enumerate(part) if c == "K"]
        if len(ks) >= 6:
            best = min(best, len(part) - ks[-6] + 1)
    a["task-24-5-08"] = str(best)
    found = [
        (len(m.group(2)) + 2, m.start())
        for m in re.finditer(r"(?=([0369])([A-Z]+)\1)", f5)
        if 2 * sum(c in VOWELS for c in m.group(2)) == len(m.group(2))
    ]
    a["task-24-5-09"] = str(max(found)[1])
    a["task-24-5-10"] = str(max(len(t) for _, t in _runs(f5, LETTERS) if set(VOWELS) <= set(t)))
    # subtopic 6
    a["task-24-6-03"] = str(_max("5+*12+0*07+3", lambda t: _expression(t, NUMBER, "+*")))
    a["task-24-6-06"] = str(
        _max("0A9BC00B1A20X", lambda t: re.fullmatch(r"[1-9AB][0-9AB]*", t) is not None)
    )
    a["task-24-6-07"] = str(_longest_expression(f6, "+*", zero_alone=True))
    a["task-24-6-08"] = str(_longest_expression(f7, "-*", zero_alone=False))
    a["task-24-6-09"] = str(max(len(t.lstrip("0")) for _, t in _runs(f5, "0123456789ABCDEFGHIJ")))
    largest = -1
    for _, t in _runs(f5, "0123456789ABCDEF"):
        for end in range(len(t)):
            if int(t[end], 16) % 2 == 0:
                largest = max(largest, int(t[: end + 1], 16))
    a["task-24-6-10"] = str(len(format(largest, "X")))

    # subtopic 7
    def numbers(t: str) -> int:
        return sum(token[0].isdigit() for token in _tokens(t))

    a["task-24-7-01"] = str(
        _max("9*8+76+5+4321", lambda t: _expression(t, NUMBER, "+*") and numbers(t) <= 2)
    )
    a["task-24-7-02"] = str(
        _max("1+22*333+4444", lambda t: _expression(t, NUMBER, "+*") and numbers(t) <= 3)
    )
    a["task-24-7-04"] = str(
        _max("4-3*2*5-1", lambda t: _expression(t, NUMBER, "-*") and _no_mult_after_minus(t))
    )
    a["task-24-7-05"] = str(
        max(v for _, values in _sums_after("A12-25+3", "A", "+-") for v in values)
    )
    a["task-24-7-06"] = str(
        max((len(t), v[-1]) for t, v in _sums_after("B12-3CB21+5", "B", "+-"))[1]
    )
    a["task-24-7-07"] = str(_numbers_window(f8, 20))
    a["task-24-7-08"] = str(_order_brute(f7))
    a["task-24-7-09"] = str(max(v[-1] for _, v in _sums_after(f8, "C", "+")))
    a["task-24-7-10"] = str(max((len(t), v[-1]) for t, v in _sums_after(f8, "B", "+-"))[1])
    a["task-24-8-02"] = str(_max("ABBBAAB", lambda t: t.count("A") == t.count("B")))
    # new tasks (Change 197)
    a["task-24-10-01"] = str(max(len(list(g)) for _, g in groupby(f1)))
    same = [i for i in range(len(f1) - 1) if f1[i] == f1[i + 1]]
    a["task-24-10-02"] = str(_avoiding(len(f1), same, 2))
    xx_zz = [i for i in range(len(f1) - 1) if f1[i : i + 2] in ("XX", "ZZ")]
    a["task-24-10-03"] = str(_avoiding(len(f1), xx_zz, 2))
    a["task-24-10-04"] = str(
        sum(f4[i] == f4[i + 4] and f4[i + 1] == f4[i + 3] for i in range(len(f4) - 4))
    )
    a["task-24-10-05"] = str(_max("PSQRPSQRXSQRPSQ", lambda t: t in "SQRP" * 10 and len(t) >= 4))
    a["task-24-10-06"] = str(_alphabet_one_vowel(f4))
    w = [-1, *(i for i, c in enumerate(f4) if c == "W"), len(f4)]
    a["task-24-10-07"] = str(max(w[j + 100] - w[j - 1] - 1 for j in range(1, len(w) - 100)))
    nums = [int(x) for x in re.split("[A-Z]+", f5) if x]
    a["task-24-10-08"] = str(max(nums))
    a["task-24-10-09"] = str(max(x for x in nums if x % 2 == 0))
    a["task-24-10-10"] = str(_zero_expression(f6))
    a["task-24-10-11"] = str(_double_letters(f5))
    a["task-24-10-12"] = str(
        _max(
            "CBABXABCBAB",
            lambda t: (
                len(t) % 2 == 0 and all(t[i : i + 2] in ("AB", "CB") for i in range(0, len(t), 2))
            ),
        )
        // 2
    )
    # Практика и итог
    bad = [i for i in range(len(f9) - 1) if f9[i] in VOWELS and f9[i + 1] in VOWELS]
    a["task-24-9-01"] = str(_avoiding(len(f9), bad, 2))
    a["task-24-9-03"] = str(_each_queue(f9, "QXZ", 40))
    a["task-24-9-04"] = str(max(len(p) + 2 for c in "ABCDEF" for p in f9.split(c)[1:-1]))
    a["task-24-9-05"] = str(_longest_expression(f6, "+", zero_alone=True))
    return a


def _solution(task: TaskData) -> str:
    (code,) = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    return code


def _neighbour(token: str) -> str:
    """A wrong answer next to the right one: the next number or the next letter."""
    if token.isalpha():
        return chr(ord(token) + 1)
    return str(int(token) + 1)


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(tasks) == sorted(answers)
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(66))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [24] and not task.catalog_visible and not task.archived
        assert bool(task.theory_links) != (task_id in FINAL_PAGE), task_id
        advanced = task_id.startswith(("task-24-7-", "task-24-8-")) or task_id in (
            "task-24-10-10",
            "task-24-10-11",
        )
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id
        assert task.files or not re.search(r"24-\d\.txt", str(task.statement)), task_id


def test_tasks_of_the_retired_lesson_are_archived() -> None:
    tasks = {entry.task.id: entry.task for entry in _bank().tasks}
    for task_id in RETIRED:
        task = tasks[task_id]
        assert task.archived and not task.catalog_visible, task_id
        assert not task.lessons and not task.theory_links, task_id


def test_checker_accepts_the_answer_and_rejects_a_neighbour(
    answers: dict[str, str],
) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        assert is_correct(task.checker, expected.lower()), task_id
        tokens = expected.split()
        tokens[-1] = _neighbour(tokens[-1])
        assert not is_correct(task.checker, " ".join(tokens)), task_id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        code = _solution(task)
        with tempfile.TemporaryDirectory() as tmp:
            for usage in task.files:
                shutil.copy(BANK_DIR / "files" / usage.checksum, Path(tmp) / usage.filename)
            result = subprocess.run(
                [sys.executable, "-I", "-c", code],
                capture_output=True,
                text=True,
                check=True,
                timeout=300,
                cwd=tmp,
            )
        assert " ".join(result.stdout.split()) == answers[task_id], task_id
        assert all(len(line) <= 64 for line in code.splitlines()), task_id
