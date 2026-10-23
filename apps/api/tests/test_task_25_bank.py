"""Independent answer and content checks for the EGE topic 25 lesson «Делители и маски».

Every answer is recomputed here by a method other than the lesson's: divisors and prime
factors by sieving a window of numbers, masks by regular expressions, the number form by
generating 3-smooth numbers. The bank's own solution programs must print the same answers.
"""

import json
import re
import subprocess
import sys
from collections.abc import Callable, Iterator
from pathlib import Path

import pytest

from app.modules.practice.models import TaskRecord
from app.modules.practice.readers import public_task
from app.modules.practice.schemas import Bank, TaskData
from app.shared.checker import is_correct

pytestmark = pytest.mark.pure

ROOT = Path(__file__).resolve().parents[3]
BANK_PATH = ROOT / "content/practice-bank/bank.json"
MATERIAL = "divisors-and-masks"
RETIRED = [f"task-25-{number:02d}" for number in range(1, 9)]


def _bank() -> Bank:
    return Bank.model_validate_json(BANK_PATH.read_bytes())


def _divisor_window(low: int, high: int) -> dict[int, list[int]]:
    """All divisors of every number in [low, high], by marking multiples of each d."""
    found: dict[int, list[int]] = {n: [] for n in range(low, high + 1)}
    for d in range(1, high + 1):
        first = max(d, (low + d - 1) // d * d)
        for multiple in range(first, high + 1, d):
            found[multiple].append(d)
    return found


def _small_primes(limit: int) -> list[int]:
    sieve = bytearray([1]) * (limit + 1)
    sieve[:2] = b"\0\0"
    for p in range(2, int(limit**0.5) + 1):
        if sieve[p]:
            sieve[p * p :: p] = bytearray(len(sieve[p * p :: p]))
    return [p for p in range(limit + 1) if sieve[p]]


def _factor_window(low: int, high: int) -> dict[int, list[int]]:
    """Prime factors with repetition of every number in [low, high] (segmented sieve)."""
    rest = {n: n for n in range(low, high + 1)}
    factors: dict[int, list[int]] = {n: [] for n in rest}
    for p in _small_primes(int(high**0.5) + 1):
        for multiple in range((low + p - 1) // p * p, high + 1, p):
            while rest[multiple] % p == 0:
                factors[multiple].append(p)
                rest[multiple] //= p
    for n, left in rest.items():
        if left > 1:
            factors[n].append(left)
    return factors


def _is_prime(n: int) -> bool:
    return n > 1 and n in _small_primes(n)


def _first(
    start: int, width: int, window: Callable[[int, int], dict[int, list[int]]]
) -> Iterator[tuple[int, list[int]]]:
    """Numbers after start with their window data, in order; the window must suffice."""
    data = window(start, start + width)
    yield from ((n, data[n]) for n in range(start, start + width + 1))


def _pick(rows: Iterator[list[int]], take: int) -> list[list[int]]:
    out = []
    for row in rows:
        out.append(row)
        if len(out) == take:
            return out
    raise AssertionError("search window too small")


def _proper(divisors: list[int], n: int) -> list[int]:
    return [d for d in divisors if 1 < d < n]


def _mask(mask: str) -> re.Pattern[str]:
    return re.compile("".join({"?": "[0-9]", "*": "[0-9]*"}.get(ch, re.escape(ch)) for ch in mask))


def _smooth(limit: int) -> list[int]:
    """All 2^m·3^n up to limit, by repeated multiplication from 1."""
    seen, frontier = {1}, [1]
    while frontier:
        n = frontier.pop()
        for k in (2, 3):
            if n * k <= limit and n * k not in seen:
                seen.add(n * k)
                frontier.append(n * k)
    return sorted(seen)


def _valuation(n: int, p: int) -> int:
    count = 0
    while n % p == 0:
        n //= p
        count += 1
    return count


def _rows(rows: list[list[int]] | list[int]) -> str:
    return " ".join(" ".join(map(str, row)) if isinstance(row, list) else str(row) for row in rows)


def _independent_answers() -> dict[str, str]:
    a: dict[str, str] = {}
    # Subtopic 1: literal checks over the range.
    a["task-25-1-01"] = _rows([divmod(145, 12)[0], divmod(145, 12)[1]])
    a["task-25-1-02"] = str(sum(1 for n in range(1000, 2001) if n % 7 == 0 and n % 35 != 0))
    a["task-25-1-04"] = str(
        sum(1 for n in range(10000, 20001) if str(n).endswith("37") and n % 3 == 0)
    )
    a["task-25-1-05"] = str(sum(1 for n in range(1, 1001) if sum(map(int, str(n))) == 10))
    a["task-25-1-06"] = _rows(
        ["7777".count("77"), len(re.findall(r"(?=77)", "7777"))]  # lookahead counts overlaps
    )
    a["task-25-1-07"] = _rows(
        [n for n in range(499999, 0, -1) if n % 13 == 0 and str(n)[-1] == "9" and "0" in str(n)][:3]
    )
    # Subtopic 2.
    d = _divisor_window(1, 400)
    a["task-25-2-03"] = str(len(d[360]))
    a["task-25-2-04"] = _rows([x for x in d[90] if x % 2 == 0])
    w = _divisor_window(312400, 312450)
    a["task-25-2-07"] = _rows(
        [[n, *_proper(w[n], n)] for n in range(312400, 312451) if len(_proper(w[n], n)) == 4]
    )
    # Subtopic 3.
    a["task-25-3-01"] = _rows(
        [[n, *_proper(d[n], n)] for n in range(20, 41) if len(_proper(d[n], n)) == 4]
    )
    a["task-25-3-02"] = str(sum(_proper(d[48], 48)[-2:]))

    def calc_m(divisors: list[int], n: int) -> int:
        inner = _proper(divisors, n)
        return inner[0] + inner[-1] if inner else 0

    a["task-25-3-03"] = _rows([calc_m(d[n], n) for n in (91, 97, 121)])
    w = _divisor_window(1000, 1100)
    best = max(range(1000, 1101), key=lambda n: (len(w[n]), -n))
    a["task-25-3-04"] = _rows([len(w[best]), best])
    a["task-25-3-06"] = _rows(
        _pick(
            (
                [n, calc_m(ds, n)]
                for n, ds in _first(600001, 400, _divisor_window)
                if calc_m(ds, n) > 0 and calc_m(ds, n) % 10 == 6
            ),
            5,
        )
    )

    def m2(divisors: list[int], n: int) -> int:
        inner = _proper(divisors, n)
        return inner[-1] + inner[-2] if len(inner) >= 2 else 0

    a["task-25-3-07"] = _rows(
        _pick(
            (
                [n, m2(ds, n)]
                for n, ds in _first(2000001, 1000, _divisor_window)
                if m2(ds, n) > 0 and m2(ds, n) % 101 == 0
            ),
            5,
        )
    )
    # Subtopic 4.
    f = _factor_window(2, 1_000_000)
    a["task-25-4-02"] = _rows(f[1960])
    a["task-25-4-03"] = _rows([len(set(f[72])), len(f[72])])
    a["task-25-4-04"] = str(max(f[999999]))
    a["task-25-4-05"] = _rows(sorted(set(f[990])))

    def distinct(factors: list[int], n: int) -> list[int]:
        return sorted({p for p in factors if p != n})

    a["task-25-4-06"] = _rows(
        _pick(
            (
                [n, max(fs)]
                for n, fs in _first(3000001, 1000, _factor_window)
                if len(fs) == 2 and all("7" in str(p) for p in fs)
            ),
            5,
        )
    )
    a["task-25-4-07"] = _rows(
        _pick(
            (
                [n, sum(distinct(fs, n))]
                for n, fs in _first(2500001, 500, _factor_window)
                if 0 < sum(distinct(fs, n)) <= 5000 and sum(distinct(fs, n)) % 10 == 7
            ),
            5,
        )
    )
    a["task-25-4-08"] = _rows(
        _pick(
            (
                [n, distinct(fs, n)[0] + distinct(fs, n)[-1]]
                for n, fs in _first(5000001, 500, _factor_window)
                if distinct(fs, n)
                and distinct(fs, n)[0] + distinct(fs, n)[-1] > 1000
                and _is_prime(distinct(fs, n)[0] + distinct(fs, n)[-1])
            ),
            5,
        )
    )
    # Subtopic 5: masks as regular expressions over full ranges or multiples.
    mask = _mask("12*3?")
    a["task-25-5-01"] = _rows(
        [int(s) for s in ["1234", "12304", "120034", "123", "12934"] if mask.fullmatch(s)]
    )
    a["task-25-5-02"] = str(sum(1 for n in range(1, 100000) if _mask("4?*7").fullmatch(str(n))))
    a["task-25-5-03"] = _rows(
        [[n, n // 7] for n in range(1, 1001) if n % 7 == 0 and _mask("1?2").fullmatch(str(n))]
    )
    a["task-25-5-05"] = str(sum(1 for n in range(1, 100000) if _mask("1?2*").fullmatch(str(n))))
    a["task-25-5-06"] = _rows(
        [[n, n // 53] for n in range(53, 10**7 + 1, 53) if _mask("3?8?405").fullmatch(str(n))]
    )
    a["task-25-5-07"] = _rows(
        [[n, n // 2027] for n in range(2027, 10**8 + 1, 2027) if _mask("12?4*76").fullmatch(str(n))]
    )
    # Subtopic 6 (advanced): full enumeration where small, smooth numbers where huge.
    d = _divisor_window(1, 10000)
    a["task-25-6-01"] = _rows([n for n in range(1, 101) if len(d[n]) == 5])
    a["task-25-6-02"] = _rows([n for n in range(51, 10000) if len(d[n]) == 3][:3])
    a["task-25-6-03"] = _rows(
        [len(d[72]), sum(1 for x in d[72] if x % 2 == 0), sum(1 for x in d[72] if x % 2)]
    )
    a["task-25-6-04"] = str(len(d[1960]))
    a["task-25-6-05"] = str(sum(1 for n in range(1, 10001) if len(d[n]) % 2))
    a["task-25-6-06"] = _rows(
        [
            n
            for n in _smooth(6 * 10**8)
            if n >= 2 * 10**8 and _valuation(n, 2) % 2 == 0 and _valuation(n, 3) % 2 == 1
        ]
    )
    # «Практика и итог».
    w = _divisor_window(500035, 500055)
    a["task-25-7-01"] = _rows(
        [[n, *_proper(w[n], n)] for n in range(500035, 500056) if len(_proper(w[n], n)) == 2]
    )
    a["task-25-7-02"] = _rows(
        _pick(
            (
                [n, max(distinct(fs, n))]
                for n, fs in _first(1200001, 500, _factor_window)
                if distinct(fs, n)
                and max(distinct(fs, n)) <= 1000
                and max(distinct(fs, n)) % 10 == 7
            ),
            5,
        )
    )
    a["task-25-7-03"] = _rows(
        [[n, n // 1301] for n in range(1301, 10**8 + 1, 1301) if _mask("8?4*21").fullmatch(str(n))]
    )
    a["task-25-7-04"] = _rows(
        _pick(
            (
                [n, *fs]
                for n, fs in _first(1000001, 1000, _factor_window)
                if len(fs) == 3 and all("3" in str(p) for p in fs)
            ),
            5,
        )
    )
    w = _divisor_window(200000, 200100)
    best = max(range(200000, 200101), key=lambda n: (len(w[n]), -n))
    a["task-25-7-05"] = _rows([len(w[best]), best])
    a.update(_yandex_like_answers())
    return a


def _starting_with(digit: int, lengths: range, step: int) -> Iterator[int]:
    """Multiples of step whose record starts with digit, by the ranges of each length."""
    for length in lengths:
        low, high = digit * 10 ** (length - 1), (digit + 1) * 10 ** (length - 1)
        yield from range((low + step - 1) // step * step, high, step)


def _yandex_like_answers() -> dict[str, str]:
    """Tasks after the Yandex collections, recomputed by other means than the bank's."""
    a: dict[str, str] = {}
    first = (1000001 + 16) // 17 * 17
    a["task-25-8-01"] = _rows(
        [n for n in range(first, first + 17 * 5000, 17) if sum(ch == "7" for ch in str(n)) == 2][:5]
    )
    # Six-digit strings with leading zeros: inclusion–exclusion over «no 1» and «no 6».
    a["task-25-8-02"] = str(10**6 - 2 * 9**6 + 8**6)
    a["task-25-8-03"] = str((_valuation(10**6, 2) + 1) * (_valuation(10**6, 5) + 1))
    a["task-25-8-04"] = str(next(d for d in range(10**6) if (d + 1) ** 2 > 10**10))
    w = _divisor_window(512340, 512360)
    a["task-25-8-05"] = _rows(
        [
            [n, max(d for d in w[n] if d % 2 == 0 and d != n)]
            for n in range(512340, 512361)
            if sum(1 for d in w[n] if d % 2 == 0) >= 16
        ]
    )
    w = _divisor_window(235400, 235420)
    a["task-25-8-06"] = _rows(
        [_proper(w[n], n) for n in range(235400, 235421) if len(_proper(w[n], n)) == 2]
    )
    a["task-25-8-07"] = _rows(
        _pick(
            (
                [n, ends[0]]
                for n, ds in _first(600001, 200, _divisor_window)
                if (ends := [d for d in ds if str(d).endswith("14") and d not in (14, n)])
            ),
            5,
        )
    )
    w = _divisor_window(221000, 221040)
    sums = {n: sum(d for d in w[n] if str(d)[-1] == "8" and d != n) for n in w}
    a["task-25-8-08"] = _rows([[n, r] for n, r in sums.items() if str(r)[-1] == "6"])
    a["task-25-8-09"] = _rows(
        _pick(
            (
                [n, ds[2] - ds[1]]
                for n, ds in _first(800001, 80000, _divisor_window)
                if len(ds) == 4 and ds[2] - ds[1] <= 15
            ),
            6,
        )
    )
    a["task-25-8-10"] = _rows(
        _pick(
            (
                [n, max(fs)]
                for n, fs in _first(7000001, 4000, _factor_window)
                if len(fs) == 2 and all({"1", "6"} <= set(str(p)) for p in fs)
            ),
            5,
        )
    )
    primes = set(_small_primes(5_000_000))
    a["task-25-8-11"] = _rows(
        [
            [n, s]
            for n in range(251000, 251101)
            if n in primes and (s := sum(map(int, str(n)))) in primes
        ]
    )
    a["task-25-8-12"] = _rows(
        _pick(
            (
                [n, sum(_proper(ds, n))]
                for n, ds in _first(2000001, 200, _divisor_window)
                if sum(_proper(ds, n)) in primes
            ),
            5,
        )
    )
    f = _factor_window(400000, 700000)
    a["task-25-8-13"] = _rows(
        [
            [n, fs[2] - fs[0]]
            for n, fs in f.items()
            if len(set(fs)) == len(fs) == 3 and fs[2] - fs[0] <= 12
        ]
    )
    mask = _mask("54321?7?9")
    a["task-25-8-14"] = _rows(
        [[n, n // 37] for n in range(543210709 // 37 * 37, 543219800, 37) if mask.fullmatch(str(n))]
    )
    mask = _mask("?2*34*91")
    a["task-25-8-15"] = _rows(
        [[n, n // 6131] for n in range(6131, 10**9, 6131) if mask.fullmatch(str(n))]
    )
    mask = _mask("2?3157*6")
    a["task-25-8-16"] = _rows(
        [[n, n // 3039] for n in _starting_with(2, range(8, 11), 3039) if mask.fullmatch(str(n))]
    )
    good, bad = _mask("?3*5*0"), _mask("2*8*")
    top = [
        n
        for n in range(3 * 10**8 // 46 * 46, 0, -46)
        if good.fullmatch(str(n)) and not bad.fullmatch(str(n))
    ][:5]
    a["task-25-8-17"] = _rows([[n, n // 46] for n in sorted(top)])
    built = {
        int("19" + str(value).zfill(length) * (length > 0) + "024" + str(q) + "7")
        for length in range(4)
        for value in range(10**length)
        for q in range(10)
    }
    fit = sorted(n for n in built if n <= 10**10 and sum(map(int, str(n))) % 13 == 0)
    a["task-25-8-18"] = _rows([[n, sum(map(int, str(n))) // 13] for n in fit[-5:]])
    inside = re.compile("13[0-9]*57[0-9]*2")
    a["task-25-8-19"] = _rows(
        [[n, n // 2971] for n in range(2971, 10**8, 2971) if inside.search(str(n))]
    )
    odd = re.compile("5[13579]13[13579]72[0-9]*4")
    a["task-25-8-20"] = _rows(
        [[n, n // 2028] for n in _starting_with(5, range(8, 11), 2028) if odd.fullmatch(str(n))]
    )
    return a


@pytest.fixture(scope="module")
def answers() -> dict[str, str]:
    return _independent_answers()


def _entries() -> list[TaskData]:
    return [
        entry.task
        for entry in _bank().tasks
        if any(link.material_id == MATERIAL for link in entry.task.lessons)
    ]


def _solution_code(task: TaskData) -> str:
    examples = [
        block.data.code
        for block in task.explanation
        if block.type == "code_example" and block.data.language == "python"
    ]
    assert len(examples) == 1, task.id
    return examples[0]


def test_material_replaces_the_retired_lesson() -> None:
    bank = _bank()
    bank.validate_references()
    ids = [material.id for material in bank.materials]
    assert MATERIAL in ids and "integer-processing" not in ids
    material = next(item for item in bank.materials if item.id == MATERIAL)
    assert material.kind == "topic" and material.status == "published"
    for task_id in RETIRED:
        task = next(entry.task for entry in bank.tasks if entry.task.id == task_id)
        assert task.archived and not task.catalog_visible
        assert task.lessons == [] and task.theory_links == []


def test_every_answer_matches_independent_recomputation(answers: dict[str, str]) -> None:
    tasks = _entries()
    assert sorted(task.id for task in tasks) == sorted(answers)
    assert len(tasks) == 59
    assert sorted(task.lessons[0].position for task in tasks) == list(range(59))
    sections = next(m for m in _bank().materials if m.id == MATERIAL).sections
    for task in tasks:
        expected = answers[task.id]
        assert task.checker.answer_variants == [expected], task.id
        assert task.exam_numbers == [25] and not task.catalog_visible and not task.archived
        assert task.sources[0].kind == "original" and task.hint and task.explanation
        # The final page's tasks train no single step; subtopic tasks link to their steps.
        on_final_page = task.id.startswith("task-25-7-")
        assert bool(task.theory_links) != on_final_page, task.id
        assert all(link.section in sections for link in task.theory_links)
        # Advanced-subtopic tasks stay outside mastery (B1).
        assert task.lessons[0].counts_toward_mastery == (not task.id.startswith("task-25-6-"))


def test_checker_accepts_the_answer_and_rejects_an_off_by_one(
    answers: dict[str, str],
) -> None:
    for task in _entries():
        expected = answers[task.id]
        assert is_correct(task.checker, expected), task.id
        assert is_correct(task.checker, expected.replace(" ", "\n")), task.id
        numbers = expected.split()
        numbers[-1] = str(int(numbers[-1]) + 1)
        assert not is_correct(task.checker, " ".join(numbers)), task.id


def test_solution_programs_print_the_answer(answers: dict[str, str]) -> None:
    for task in _entries():
        result = subprocess.run(
            [sys.executable, "-I", "-c", _solution_code(task)],
            capture_output=True,
            text=True,
            check=True,
            timeout=300,
        )
        assert " ".join(result.stdout.split()) == answers[task.id], task.id
        assert all(len(line) <= 64 for line in _solution_code(task).splitlines()), task.id


@pytest.mark.parametrize("number", [1, 2, 36, 49, 97, 360])
def test_window_oracles_agree_on_boundary_cases(number: int) -> None:
    divisors = _divisor_window(1, 400)[number]
    assert divisors == [d for d in range(1, number + 1) if number % d == 0]
    factors = _factor_window(1, 400)[number]
    product = 1
    for p in factors:
        product *= p
    assert product == number and all(_is_prime(p) for p in factors)


def test_public_projection_hides_the_answers() -> None:
    for task in _entries():
        row = TaskRecord(
            id=task.id,
            content=task.model_dump(mode="json", exclude={"checker"}),
            solution_revision=1,
            catalog_visible=False,
            archived=False,
        )
        public_json = json.dumps(public_task(row, {}).model_dump(), ensure_ascii=False)
        assert "checker" not in public_json and "answer_variants" not in public_json
