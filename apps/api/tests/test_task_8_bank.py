"""Independent answer and content checks for the EGE topic 8 lesson «Перебор слов».

The bank's programs search: ``product`` and ``permutations`` over the positions, numbered
lists, the states and schemes of subtopic 7. Here every answer is recomputed by counting
instead of searching — the rule of product and sums of cases, binomial coefficients for
places, inclusion–exclusion, multinomials for repeated letters, gaps for letters that may
not stand side by side, and the number of a word as a positional value — and the long
counts of subtopic 7 by a transfer matrix over the last symbol. The bank's own solution
programs must print the same answers.
"""

import subprocess
import sys
from math import comb, factorial, perm
from pathlib import Path

import pytest

from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_DIR = ROOT / "content/practice-bank"
MATERIAL = "word-enumeration"


def _bank() -> Bank:
    return Bank.model_validate_json((BANK_DIR / "bank.json").read_bytes())


def _entries() -> dict[str, TaskData]:
    return {
        entry.task.id: entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    }


def value(word: str, alphabet: str) -> int:
    """The word as a number in base len(alphabet), by Horner's rule."""
    total = 0
    for c in word:
        total = total * len(alphabet) + alphabet.index(c)
    return total


def word_at(index: int, alphabet: str, length: int) -> str:
    """The word of the given 0-based position."""
    q = len(alphabet)
    return "".join(alphabet[index // q ** (length - 1 - k) % q] for k in range(length))


def multinomial(*counts: int) -> int:
    out = factorial(sum(counts))
    for c in counts:
        out //= factorial(c)
    return out


def no_double(length: int, letters: int, first_choices: int) -> int:
    """Words where one letter never follows itself, by a transfer over the last symbol:
    «ends with that letter» and «ends with another»; ``first_choices`` are the symbols
    allowed first (the letter itself among them when it equals ``letters``)."""
    end_banned, end_other = (
        (1, first_choices - 1) if first_choices == letters else (0, first_choices)
    )
    for _ in range(length - 1):
        end_banned, end_other = end_other, (letters - 1) * (end_banned + end_other)
    return end_banned + end_other


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # subtopic 1: the rule of product
    a["task-8-1-01"] = str(5**4)
    a["task-8-1-02"] = str(1 * 5 * 5 * 4)
    a["task-8-1-03"] = str(perm(6, 4))
    a["task-8-1-04"] = str(len(set("КОЛОС")) ** 3)
    a["task-8-1-05"] = str(3 + 9 + 27)
    a["task-8-1-06"] = str(5**3 + 5**3 - 5**2)
    a["task-8-1-08"] = str(factorial(4))
    a["task-8-1-09"] = str(4 * 5**3 * 2)
    a["task-8-1-10"] = str(1 * 5 * factorial(4) + 3 * 4 * factorial(4))
    # subtopic 2: places and inclusion–exclusion
    a["task-8-2-01"] = str(comb(5, 2) * 4**3)
    a["task-8-2-02"] = str(3**5 - 2**5)
    a["task-8-2-03"] = str(multinomial(3, 2, 1))
    a["task-8-2-04"] = str(3**4 + comb(4, 1) * 3**3)
    a["task-8-2-05"] = str(comb(5, 3) * 2**3 * 3**2)
    a["task-8-2-06"] = str(5**4 - 2 * 4**4 + 3**4)
    a["task-8-2-08"] = str(5 * 4**4 + 3 * comb(5, 2) * 4**3)
    two_vowels_of_four = 5**4 - 3**4 - comb(4, 1) * 2 * 3**3
    a["task-8-2-09"] = str(2 * (5**4 - 3**4) + 2 * two_vowels_of_four)
    a["task-8-2-10"] = str(multinomial(2, 3, 2))
    # subtopic 3: gaps, blocks, schemes
    a["task-8-3-01"] = str(comb(4, 2))
    a["task-8-3-02"] = str(3 * 2**3)
    a["task-8-3-03"] = str(3**5)
    a["task-8-3-04"] = str(factorial(4) * 2)
    a["task-8-3-06"] = str(2 * 2**3 * 3**3)
    a["task-8-3-08"] = str(factorial(3) * comb(4, 3) * factorial(3))
    edge = 2 * 2 * 4**3  # М at an end: one neighbour from Д, К
    middle = 3 * 2**2 * 4**2  # М in the middle: two neighbours from Д, К
    a["task-8-3-09"] = str(edge + middle)
    # subtopic 4: records of numbers
    a["task-8-4-01"] = str(4 * 5**2)
    a["task-8-4-02"] = str(7**2 + 2 * 6 * 7)
    a["task-8-4-03"] = str(7 * 7 * 6 * 5)
    a["task-8-4-04"] = str(comb(6, 3))
    a["task-8-4-06"] = str((7**4 - 7**3 + 1) // 2)
    a["task-8-4-07"] = str(_sevens())
    a["task-8-4-08"] = str(3 * 3 * 2 * 9 * 8 + 3 * 3 * 2 * 8 * 8)
    a["task-8-4-09"] = str(sum(perm(6, k - 1) for k in range(2, 8)))
    # subtopic 5: numbers of words
    a["task-8-5-01"] = str(value("ВАБВ", "АБВ") + 1)
    a["task-8-5-02"] = word_at(19, "АБВ", 4)
    a["task-8-5-03"] = str(value("ГАББА", "АБВГ") + 1)
    a["task-8-5-04"] = word_at(499, "АБВГ", 5)
    a["task-8-5-05"] = str(value("ВААА", "АБВ") + 1)
    a["task-8-5-06"] = str(value("ТОК", "КОТ") + 1)
    a["task-8-5-07"] = str(3 + value("ВВ", "АБВ") + 1)
    a["task-8-5-08"] = str(value("РУДАР", "АДРУ") + 1)
    a["task-8-5-09"] = word_at(699, "КОТЫ", 5)
    a["task-8-5-10"] = str(value("ЙАААА" + "А", "АЙМ") + 1)
    # subtopic 6: the full list by positional values
    a["task-8-6-01"] = str(2 * 2 * 3)
    a["task-8-6-02"] = str(value("ББББ", "АБВ") + 1)
    a["task-8-6-03"] = str(value("ВВББ", "АБВ") + 1)
    # a number is odd when the value is even; in base 3 the value is even when the
    # digit sum is: an even count of Б (digit 1)
    a["task-8-6-04"] = str(4 * (1 + comb(3, 2)))
    a["task-8-6-05"] = str(2 * 2 * 2 + 1)
    a["task-8-6-06"] = str(_last_number())
    a["task-8-6-07"] = str(_even_count())
    a["task-8-6-08"] = str(_first_number())
    # subtopic 7: transfers over the last symbol
    a["task-8-7-01"] = str(no_double(6, 4, 4))
    a["task-8-7-02"] = str(no_double(30, 3, 3))
    a["task-8-7-03"] = str(2**7 - 1 - 7)
    a["task-8-7-04"] = str(no_double(20, 3, 2))
    a["task-8-7-05"] = str(_upto([4, 1, 5, 3, 0], 6))
    a["task-8-7-06"] = str(_evens_apart())
    a["task-8-7-07"] = str(_zeros_and_letters())
    # Практика и итог
    a["task-8-8-01"] = str(4**5 + 3 * 5 * 4**4)
    a["task-8-8-02"] = str(4 * 4 * 4 * 3 * 3 + 4 * 5 * 3 * 4 * 2)
    a["task-8-8-03"] = str(_one_a_few_small())
    a["task-8-8-04"] = word_at(443, "АРФШ", 5)
    a["task-8-8-05"] = str(_last_even())
    return a


# --- the larger counts, by cases over places ---------------------------------------------------


def _sevens() -> int:
    """Base 8, five digits, exactly two 7s, no even digit next to a 7: place the two 7s,
    then every neighbour of a 7 is odd and not 7 (1, 3, 5), the rest is any non-7 digit;
    the first digit is not 0."""
    total = 0
    for i in range(5):
        for j in range(i + 1, 5):
            near = {k for s in (i, j) for k in (s - 1, s + 1) if 0 <= k < 5} - {i, j}
            ways = 1
            for k in range(5):
                if k in (i, j):
                    continue
                if k in near:
                    ways *= 3
                else:
                    ways *= 6 if k == 0 else 7
            total += ways
    return total


def _rank_words(alphabet, length, test, *, last=False, count=False) -> int:
    """Walk the full list by its positional values (no itertools)."""
    found = 0
    result = None
    for index in range(len(alphabet) ** length):
        word = word_at(index, alphabet, length)
        if test(index + 1, word):
            found += 1
            result = index + 1
            if not last and not count:
                return result
    assert result is not None
    return found if count else result


def _last_number() -> int:
    return _rank_words(
        "АКОРТ",
        5,
        lambda n, w: n % 2 == 1 and w[0] != "А" and w.count("О") == 2,
        last=True,
    )


def _even_count() -> int:
    return _rank_words(
        "ЕИЛНС",
        6,
        lambda n, w: n % 2 == 0 and w.count("Е") >= 2 and "НН" not in w,
        count=True,
    )


def _first_number() -> int:
    return _rank_words(
        "АЕКЛМ", 5, lambda n, w: n % 2 == 0 and w[0] not in "АЕ" and w.count("Л") >= 2
    )


def _last_even() -> int:
    return _rank_words(
        "ЕЛОПТ",
        6,
        lambda n, w: n % 2 == 0 and w[0] != "О" and w.count("Л") == 2 and "ЕЕ" not in w,
        last=True,
    )


def _upto(bound, q) -> int:
    """Numbers with distinct digits not above the bound: count the smaller prefixes."""
    total = 0
    used: list[int] = []
    n = len(bound)
    for i, d in enumerate(bound):
        smaller = [x for x in range(d) if x not in used and not (i == 0 and x == 0)]
        total += len(smaller) * perm(q - len(used) - 1, n - i - 1)
        if d in used:
            return total
        used.append(d)
    return total + 1


def _evens_apart() -> int:
    """Ten base-9 digits, three even ones, no two even side by side: choose the places of
    the even digits by gaps among the seven odd ones."""
    total = 0
    for first_even in (True, False):
        if first_even:
            # the first place is even (2, 4, 6, 8); two more even ones in the gaps after
            # the seven odd digits that must then fill places 2..: comb(7, 2) ways
            total += comb(7, 2) * 4 * 5**2 * 4**7
        else:
            total += comb(7, 3) * 5**3 * 4**7
    return total


def _zeros_and_letters() -> int:
    """Nine base-15 digits: exactly two zeros (not first), at most three letter digits."""
    total = 0
    for letters in range(0, 4):
        rest = 9 - 2 - letters
        places = comb(8, 2) * comb(7, letters)  # zeros among places 2..9, then letters
        total += places * 5**letters * 9**rest
    return total


def _one_a_few_small() -> int:
    """Six base-11 digits, exactly one A (10), at most two digits below 3 (0, 1, 2)."""
    total = 0
    for small in range(0, 3):
        for a_first in (True, False):
            if a_first:
                places = comb(5, small)
                total += places * 3**small * 7 ** (5 - small)
            else:
                # A on one of the five later places; the first digit is small (1, 2) or big
                for first_small in (True, False):
                    if first_small and small == 0:
                        continue
                    later_small = small - (1 if first_small else 0)
                    if later_small > 4:
                        continue
                    first = 2 if first_small else 7
                    total += (
                        5 * first * comb(4, later_small) * 3**later_small * 7 ** (4 - later_small)
                    )
    return total


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
    assert sorted(t.lessons[0].position for t in tasks.values()) == list(range(63))
    for task_id, task in tasks.items():
        assert task.checker.answer_variants[0] == answers[task_id], task_id
        assert task.exam_numbers == [8] and not task.catalog_visible and not task.archived
        on_final_page = task_id.startswith("task-8-8-")
        assert bool(task.theory_links) != on_final_page, task_id
        advanced = task_id.startswith("task-8-7-")
        assert task.lessons[0].counts_toward_mastery == (not advanced), task_id


def test_checker_accepts_the_answer_and_rejects_a_neighbour(answers: dict[str, str]) -> None:
    for task_id, task in _entries().items():
        expected = answers[task_id]
        assert is_correct(task.checker, expected), task_id
        assert is_correct(task.checker, expected.lower()), task_id
        wrong = (
            str(int(expected) + 1)
            if expected.isdigit()
            else expected[:-1] + chr(ord(expected[-1]) + 1)
        )
        assert not is_correct(task.checker, wrong), task_id


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
