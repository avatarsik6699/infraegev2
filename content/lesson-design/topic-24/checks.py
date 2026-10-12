"""Independent recomputation of every task answer in topic 24.

Usage: python3 -I content/lesson-design/topic-24/checks.py

The lessons (and datasets.py, which prints the answers of the exam-format
tasks) use one pass with the current length, the sliding window, positions
and re.finditer. Here every answer is recomputed by another method:

- the search of all substrings for the short strings of the tasks;
- for the files: forbidden windows between consecutive bad positions instead
  of the current length, positions instead of the window and the window
  instead of positions, per-letter queues of the last occurrences, split and
  Counter instead of loops, a hand-written scan of numbers and signs (dynamic
  programming over digit runs) instead of regular expressions.

The lesson methods of datasets.py are also compared with the search of all
substrings on thousands of short random strings (generators, no lists of all
substrings), typical errors must change the answer of a file task (TRAPS),
and every expected answer must appear verbatim in the answers of its page.
All programs run in seconds on the exam-size file. Exit code 1 on any failure.
"""

from __future__ import annotations

import importlib.util
import random
import re
import sys
from bisect import bisect_left
from collections import Counter, deque
from itertools import groupby
from pathlib import Path

sys.dont_write_bytecode = True
D = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("datasets24", D / "datasets.py")
assert spec and spec.loader
ds = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ds)

VOWELS = "AEIOUY"
checks: list[tuple[str, str, bool]] = []


def answers(f: str) -> str:
    text = (D / f).read_text(encoding="utf-8")
    return text.split("**Ответы для проверки:**", 1)[1]


def expect(f: str, needle: str) -> None:
    checks.append((f, needle, needle in answers(f)))


def same(label: str, a: object, b: object) -> None:
    checks.append(("—", f"{label}: {a!r} = {b!r}", a == b))


def differ(label: str, right: object, wrong: object) -> None:
    checks.append(("—", f"{label}: ошибка даёт {wrong!r}, а не {right!r}", right != wrong))


def read(name: str) -> str:
    return (D / "files" / name).read_text(encoding="ascii").split("\n")[0]


def lines(name: str) -> list[str]:
    return (D / "files" / name).read_text(encoding="ascii").splitlines()


# --- the search of all substrings (short strings only) -------------------------------


def substrings(s: str):
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            yield i, s[i:j]


def brute_max(s: str, ok) -> int:
    return max((len(t) for _, t in substrings(s) if ok(t)), default=0)


def brute_min(s: str, ok) -> int:
    return min((len(t) for _, t in substrings(s) if ok(t)), default=0)


def occurrences(t: str, word: str) -> int:
    return sum(t.startswith(word, i) for i in range(len(t)))


def neighbours_ok(t: str, good) -> bool:
    return all(good(a, b) for a, b in zip(t, t[1:], strict=False))


# --- second methods for the files -------------------------------------------------------


def avoiding(n: int, bad_starts: list[int], m: int) -> int:
    """Longest fragment that holds no bad window of length m entirely:
    between consecutive bad starts b1 < b2 it runs from b1 + 1 to b2 + m − 2."""
    marks = [-1] + bad_starts + [n - m + 1]
    return max(b2 - b1 + m - 2 for b1, b2 in zip(marks, marks[1:], strict=False))


def max_with_at_most(s: str, letter: str, k: int) -> int:
    """At most k letters: between the occurrences j and j + k + 1 (positions)."""
    p = [-1] + [i for i, c in enumerate(s) if c == letter] + [len(s)]
    if len(p) - 2 <= k:
        return len(s)
    return max(p[j + k + 1] - p[j] - 1 for j in range(len(p) - k - 1))


def max_each_queue(s: str, letters: str, k: int) -> int:
    """Every letter at most k times: the left end for right r is one after the
    (k + 1)-th last occurrence of some letter up to r."""
    last = {c: deque(maxlen=k + 1) for c in letters}
    left = best = 0
    for r, c in enumerate(s):
        if c in last:
            last[c].append(r)
            if len(last[c]) == k + 1:
                left = max(left, last[c][0] + 1)
        best = max(best, r - left + 1)
    return best


def max_exact_words(s: str, word: str, k: int) -> int:
    """Exactly k whole occurrences of word (they may overlap), positions."""
    m = len(word)
    p = [-1] + [i for i in range(len(s) - m + 1) if s.startswith(word, i)] + [len(s) - m + 1]
    return max(p[j + k] - p[j - 1] + m - 2 for j in range(1, len(p) - k))


def min_window(s: str, letter: str, k: int) -> int:
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


def runs_of(s: str, alphabet: str):
    """(start, text) of maximal runs of characters of alphabet."""
    pos = 0
    for inside, group in groupby(s, key=lambda c: c in alphabet):
        text = "".join(group)
        if inside:
            yield pos, text
        pos += len(text)


def longest_expression(s: str, signs: str, zero_alone: bool, digits: str = "0123456789") -> int:
    """Dynamic programming over digit runs, no regular expressions.

    L[i] — the longest correct expression ending at the digit i. Its last
    number is a suffix of the digit run ending at i; if there are several
    numbers, every number but the first is a whole run preceded by a sign.
    """
    n = len(s)
    run_start = [0] * n
    best_end = [0] * n
    best = 0
    for i, c in enumerate(s):
        if c not in digits:
            continue
        a = run_start[i] = run_start[i - 1] if i > 0 and s[i - 1] in digits else i
        k = a
        while k <= i and s[k] == "0":
            k += 1
        single = i - k + 1 if k <= i else (1 if zero_alone else 0)
        whole_ok = s[a] != "0" or (zero_alone and a == i)
        longer = 0
        if whole_ok and a >= 2 and s[a - 1] in signs and best_end[a - 2] > 0:
            longer = best_end[a - 2] + 1 + (i - a + 1)
        best_end[i] = max(single, longer)
        best = max(best, best_end[i])
    return best


def tokens(text: str) -> list[str]:
    """«12+3*45» -> ['12', '+', '3', '*', '45'] by hand."""
    out: list[str] = []
    for c in text:
        if c.isdigit() and out and out[-1].isdigit():
            out[-1] += c
        else:
            out.append(c)
    return out


def expressions(s: str, digits: str, signs: str):
    """Maximal well-formed expressions by a hand-written scan: a run of digits
    and signs is cut where two signs meet, signs at the ends are dropped."""
    for _, text in runs_of(s, digits + signs):
        for chunk in re.split(f"[{re.escape(signs)}]{{2,}}", text):
            chunk = chunk.strip(signs)
            if chunk:
                yield chunk


def numbers_window(s: str, k: int) -> int:
    best = 0
    for expr in expressions(s, "123456789", "+-*"):
        toks = [t for t in tokens(expr) if t[0].isdigit()]
        ends, pos = [], 0
        for t in tokens(expr):
            pos += len(t)
            if t[0].isdigit():
                ends.append((pos - len(t), pos))
        for j in range(len(ends)):
            i = max(0, j - k + 1)
            best = max(best, ends[j][1] - ends[i][0])
        assert len(toks) == len(ends)
    return best


def no_mult_after_minus(frag: str) -> bool:
    return "-" not in frag or "*" not in frag[frag.index("-") :]


def order_brute(s: str) -> int:
    """Base 8, − and *: every fragment of a maximal run of allowed characters."""
    number = "(?:0|[1-7][0-7]*)"
    full = re.compile(number + f"(?:[-*]{number})*")
    best = 0
    for _, text in runs_of(s, "01234567-*"):
        for i in range(len(text)):
            for j in range(len(text), i + best, -1):
                frag = text[i:j]
                if full.fullmatch(frag) and no_mult_after_minus(frag):
                    best = j - i
                    break
    return best


def sums_after(s: str, letter: str, signs: str):
    """(text, prefix values) of every sum right after letter, by hand."""
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


def combo_window(s: str, letter: str, k: int, word: str, t: int) -> int:
    """Exactly k letters, at least t words: the widest windows by two pointers
    with the words counted incrementally."""
    m, n = len(word), len(s)
    starts = set(i for i in range(n - m + 1) if s.startswith(word, i))
    pos = [i for i, c in enumerate(s) if c == letter]
    best = 0
    left, words, right = 0, 0, -1
    for j in range(len(pos) - k + 1):
        lo = pos[j - 1] + 1 if j > 0 else 0
        hi = pos[j + k] - 1 if j + k < len(pos) else n - 1
        while right < hi:
            right += 1
            if right - m + 1 >= left and right - m + 1 in starts:
                words += 1
        while left < lo:
            if left in starts and left + m - 1 <= right:
                words -= 1
            left += 1
        if words >= t:
            best = max(best, hi - lo + 1)
    return best


def min_objects_runs(s: str, k: int) -> int:
    objects = []
    for start, text in runs_of(s, ds.LETTERS):
        end = start + len(text) - 1
        if start > 0 and end + 1 < len(s) and s[start - 1].isdigit() and s[end + 1].isdigit():
            objects.append((start - 1, end + 1))
    return min(objects[j + k - 1][1] - objects[j][0] + 1 for j in range(len(objects) - k + 1))


def first_alphabet(counter: Counter, pick_max: bool = True) -> str:
    best = max(counter.values()) if pick_max else min(counter.values())
    return min(c for c, v in counter.items() if v == best)


# --- the lesson methods against the search of all substrings ----------------------------


def random_strings(seed: int, alphabet: str, count: int, longest: int):
    rnd = random.Random(seed)
    for _ in range(count):
        yield "".join(rnd.choices(alphabet, k=rnd.randint(1, longest)))


def compare(label: str, gen, lesson, brute) -> None:
    bad = next((s for s in gen if lesson(s) != brute(s)), None)
    checks.append(
        (
            "—",
            f"{label}: урок = перебор подстрок" + (f" (не так на {bad!r})" if bad else ""),
            bad is None,
        )
    )


def is_expr(t: str, number: str, signs: str) -> bool:
    return re.fullmatch(number + f"(?:[{re.escape(signs)}]{number})*", t) is not None


N0 = "(?:0|[1-9][0-9]*)"
compare(
    "цепочка без буквы",
    random_strings(1, "XYZ", 3000, 12),
    lambda s: ds.run_without(s, "Y"),
    lambda s: brute_max(s, lambda t: "Y" not in t),
)
compare(
    "запрещённые пары",
    random_strings(2, "XYZ", 3000, 12),
    lambda s: ds.no_pair_from(s, "XZ"),
    lambda s: brute_max(s, lambda t: neighbours_ok(t, lambda a, b: not (a in "XZ" and b in "XZ"))),
)
compare(
    "тройки",
    random_strings(3, "0123456789", 3000, 10),
    ds.outer_triples,
    lambda s: brute_max(
        s, lambda t: all(int(t[i]) + int(t[i + 2]) > int(t[i + 1]) for i in range(len(t) - 2))
    ),
)
compare(
    "повторяющийся образец",
    random_strings(4, "XYZ", 3000, 12),
    lambda s: ds.periodic(s, "XYZ"),
    lambda s: brute_max(s, lambda t: all(c == "XYZ"[i % 3] for i, c in enumerate(t))),
)
compare(
    "окно: не более K",
    random_strings(5, "AB", 3000, 12),
    lambda s: ds.window_at_most(s, "A", 2),
    lambda s: brute_max(s, lambda t: t.count("A") <= 2),
)
compare(
    "окно: каждая буква не более K",
    random_strings(6, "ABC", 3000, 12),
    lambda s: ds.window_each(s, "AB", 1),
    lambda s: brute_max(s, lambda t: t.count("A") <= 1 and t.count("B") <= 1),
)
compare(
    "окно: ровно K пар",
    random_strings(7, "TA", 3000, 12),
    lambda s: ds.window_pairs_exact(s, "TT", 2),
    lambda s: brute_max(s, lambda t: occurrences(t, "TT") == 2),
)
compare(
    "позиции: минимум с K",
    random_strings(8, "QA", 3000, 12),
    lambda s: ds.min_with(s, "Q", 2),
    lambda s: brute_min(s, lambda t: t.count("Q") >= 2) or len(s) + 1,
)
compare(
    "гласная в конце",
    random_strings(9, "K0A1", 3000, 12),
    lambda s: ds.min_end_digit(s, "0", "K", 2),
    lambda s: (
        brute_min(s, lambda t: t.endswith("0") and t.count("0") == 1 and t.count("K") == 2)
        or len(s) + 1
    ),
)
compare(
    "все гласные в блоке",
    random_strings(10, "AEIOUYB1", 3000, 14),
    ds.all_vowels_block,
    lambda s: brute_max(s, lambda t: t.isalpha() and set(VOWELS) <= set(t)),
)
compare(
    "выражение + и *",
    random_strings(11, "0123+*", 3000, 12),
    lambda s: ds.longest(N0 + f"(?:[+*]{N0})*", s),
    lambda s: brute_max(s, lambda t: is_expr(t, N0, "+*")),
)
compare(
    "выражение с натуральными числами",
    random_strings(12, "0123-*", 3000, 12),
    lambda s: ds.longest(r"[1-9][0-9]*(?:[-*][1-9][0-9]*)*", s),
    lambda s: brute_max(s, lambda t: is_expr(t, "[1-9][0-9]*", "-*")),
)
compare(
    "наибольшее чётное число",
    random_strings(13, "0123ABZ", 3000, 10),
    lambda s: ds.max_even(s, "0123456789ABCDEF"),
    lambda s: len(
        max(
            (
                t.lstrip("0") or "0"
                for _, t in substrings(s)
                if re.fullmatch("[0-9A-F]+", t) and int(t, 16) % 2 == 0
            ),
            key=lambda t: (len(t), int(t, 16)),
            default="",
        )
    ),
)
compare(
    "не более K чисел",
    random_strings(14, "12+-*", 3000, 12),
    lambda s: ds.at_most_numbers(s, 2),
    lambda s: brute_max(
        s, lambda t: is_expr(t, "[1-9]+", "-+*") and len(re.findall("[1-9]+", t)) <= 2
    ),
)
compare(
    "порядок действий",
    random_strings(15, "0129-*", 3000, 12),
    lambda s: ds.order_ok(s, "01234567"),
    lambda s: brute_max(
        s,
        lambda t: (
            is_expr(t, "(?:0|[1-7][0-7]*)", "-*") and ("-" not in t or "*" not in t[t.index("-") :])
        ),
    ),
)
compare(
    "наибольшая сумма после буквы",
    (s for s in random_strings(16, "12+-C", 3000, 12) if re.search("C[1-9]", s)),
    lambda s: ds.best_sum_after(s, "C", "+-"),
    lambda s: max(
        eval(t)  # noqa: S307 — a short string of digits and signs made here
        for i, t in substrings(s)
        if i > 0 and s[i - 1] == "C" and is_expr(t, "[1-9]+", "+-")
    ),
)
compare(
    "ровно K букв и не менее T слов",
    random_strings(17, "YAB", 1500, 12),
    lambda s: ds.combo(s, "Y", 1, "AB", 2),
    lambda s: brute_max(s, lambda t: t.count("Y") == 1 and occurrences(t, "AB") >= 2),
)
compare(
    "объекты с общими границами",
    (
        s
        for s in random_strings(18, "AB12", 3000, 12)
        if len(re.findall(r"(?=([0-9][A-Z]+[0-9]))", s)) >= 2
    ),
    lambda s: ds.min_objects(s, 2),
    lambda s: brute_min(s, lambda t: len(re.findall(r"(?=([0-9][A-Z]+[0-9]))", t)) >= 2),
)
compare(
    "одна буква на краях",
    random_strings(19, "ABX", 3000, 12),
    lambda s: ds.same_letter_ends(s, "AB"),
    lambda s: brute_max(
        s, lambda t: len(t) >= 2 and t[0] == t[-1] and t[0] in "AB" and t[0] not in t[1:-1]
    ),
)


# --- 1. Строка, фрагмент и файл ---
f = "01-stroka-i-fragment.md"
s = "QWERTY"
expect(f, f"1. `{s[1]}`, `{s[-1]}`, `{s[2:5]}` и {len(s)}")
expect(f, f"2. Длина {9 - 4 + 1}, строго между {9 - 4 - 1} символа, разность номеров {9 - 4}")
expect(f, f"3. {max(len(p) for p in 'BBBABBBBAB'.split('A'))}: цепочка `BBBB`")
s = "KLMN"
expect(f, "4. " + ", ".join(f"`{s[i - 1]}`" for i in range(3)))
expect(f, f"5. {sum(1 for _ in substrings('ABCDEFGH'))} = 8 · 9 / 2")
expect(f, f"у строки из 300 000 символов — {300_000 * 300_001 // 2}")
k_more = sum(Counter(line)["K"] > Counter(line)["L"] for line in lines("24-3.txt"))
expect(f, f"8. {k_more}:")
differ(
    "1.8 «не меньше» вместо «больше»",
    k_more,
    sum(line.count("K") >= line.count("L") for line in lines("24-3.txt")),
)

# --- 2. Цепочка ---
f = "02-cepochka.md"
expect(f, f"1. {brute_max('AXXXBXXXXXAX', lambda t: set(t) == {'X'})}: цепочка `XXXXX`")
diff_ok = lambda t: neighbours_ok(t, lambda a, b: a != b)  # noqa: E731
expect(f, f"2. {brute_max('CAABCBCC', diff_ok)}: фрагмент `ABCBC`")
expect(f, f"3. {brute_max('ZZYYYZYYYYZ', lambda t: len(set(t)) == 1)}: цепочка `YYYY`")
triple_ok = lambda t: all(int(t[i]) + int(t[i + 1]) > int(t[i + 2]) for i in range(len(t) - 2))  # noqa: E731
expect(f, f"4. {brute_max('12456', triple_ok)}: фрагмент `2456`")
kl = lambda t: neighbours_ok(t, lambda a, b: {a, b} != {"K", "L"})  # noqa: E731
expect(f, f"5. {brute_max('KLAKKLB', kl)}: фрагмент `LAKK`")
expect(f, f"6. 2 вместо {brute_max('XXAXXX', lambda t: set(t) == {'X'})}")
s1, s2 = read("24-1.txt"), read("24-2.txt")
a27 = max(len(p) for p in s1.split("Y"))
a28 = avoiding(len(s1), [i for i in range(len(s1) - 1) if s1[i] in "XZ" and s1[i + 1] in "XZ"], 2)
a29 = avoiding(
    len(s2),
    [i for i in range(len(s2) - 2) if int(s2[i]) + int(s2[i + 2]) <= int(s2[i + 1])],
    3,
)
expect(f, f"7. {a27}:")
expect(f, f"8. {a28}:")
expect(f, f"9. {a29}:")


def best_at_break(s: str, bad: str) -> int:
    current = best = 0
    for c in s:
        if c != bad:
            current += 1
        else:
            best, current = max(best, current), 0
    return best


def reset_to(s: str, group: str, value: int) -> int:
    current = best = 0
    for i in range(len(s)):
        current = value if i > 0 and s[i - 1] in group and s[i] in group else current + 1
        best = max(best, current)
    return best


differ("2.7 ответ только при разрыве", a27, best_at_break(s1, "Y"))
differ("2.8 сброс до 0", a28, reset_to(s1, "XZ", 0))


def triples_reset(s: str, value: int) -> int:
    current = best = min(len(s), 2)
    for i in range(2, len(s)):
        good = int(s[i - 2]) + int(s[i]) > int(s[i - 1])
        current = current + 1 if good else value
        best = max(best, current)
    return best


differ("2.9 сброс до 0", a29, triples_reset(s2, 0))
differ("2.9 сброс до 1", a29, triples_reset(s2, 1))

# --- 3. Образцы, блоки и частоты ---
f = "03-obrazcy-i-chastoty.md"
expect(f, f"1. {occurrences('ABABABA', 'ABA')}: начала на позициях 0, 2, 4")
expect(
    f,
    f"2. {sum(a == c for a, _, c in zip('ABABBAB', 'ABABBAB'[1:], 'ABABBAB'[2:], strict=False))}:",
)
period_ok = lambda t: t[0] == "A" and all(c == "ABC"[i % 3] for i, c in enumerate(t))  # noqa: E731
expect(f, f"3. {brute_max('ABABCABCA', period_ok)}: `ABCABCA`")
pairs4 = brute_max(
    "BABEDACA",
    lambda t: (
        len(t) % 2 == 0 and all(t[i] in "BCDF" and t[i + 1] in "AE" for i in range(0, len(t), 2))
    ),
)
expect(f, f"4. {pairs4 // 2} пары, {pairs4} символов")
after_a = Counter(b for a, b in zip("CADACABAA", "CADACABAA"[1:], strict=False) if a == "A")
expect(f, f"5. `{first_alphabet(after_a)}`:")
chains = [m.start() for m in re.finditer("X+", "YXXYXXYXX") if len(m.group()) == 2]
expect(
    f,
    f"6. {max(chains)}: цепочки `XX` начинаются на позициях 1, 4, 7. При нумерации с единицы — {max(chains) + 1}",
)
a37 = max(len(m.group()) for m in re.finditer(r"X(?:YZX)*(?:YZ?)?", s1))
expect(f, f"7. {a37}:")
s4 = read("24-4.txt")
consonants = "".join(c for c in ds.LETTERS if c not in VOWELS)
best38 = 0
chain = [0] * len(s4)
for i in range(len(s4) - 1):
    if s4[i] in VOWELS and s4[i + 1] in consonants:
        chain[i] = (chain[i - 2] if i >= 2 else 0) + 1
        best38 = max(best38, chain[i])
expect(f, f"8. {best38}:")
before_r = Counter(a for a, b in zip(s4, s4[1:], strict=False) if b == "R")
a39 = first_alphabet(before_r)
expect(f, f"9. `{a39}`.")
lines3 = lines("24-3.txt")
q_most = max(line.count("Q") for line in lines3)
last_line = [line for line in lines3 if line.count("Q") == q_most][-1]
first_line = [line for line in lines3 if line.count("Q") == q_most][0]
a310 = first_alphabet(Counter(last_line), pick_max=False)
expect(f, f"10. `{a310}`:")
differ(
    "3.10 первая строка вместо последней", a310, first_alphabet(Counter(first_line), pick_max=False)
)


def any_start(s: str) -> int:
    """The chain may start with any letter of the cycle XYZ."""
    current = best = 0
    for i, c in enumerate(s):
        follows = i > 0 and "XYZ".index(c) == ("XYZ".index(s[i - 1]) + 1) % 3
        current = current + 1 if follows else 1
        best = max(best, current)
    return best


differ("3.7 цепочка с любой буквы", a37, any_start(s1))

# --- 4. Скользящее окно ---
f = "04-skolzyashchee-okno.md"
w = "ABCABBACB"
expect(f, f"1. {brute_max(w, lambda t: t.count('A') <= 2)}: `BCABBACB`")
expect(f, f"2. {brute_max(w, lambda t: t.count('A') == 2)}: тот же фрагмент")
expect(f, f"3. {brute_min(w, lambda t: t.count('A') >= 2)}: `ABBA` или `ABCA`")
expect(f, f"4. {brute_max('ABCXABYABCZ', lambda t: 'ABC' not in t)}: `BCXABYAB`")
expect(f, f"5. {brute_max('ABCBADAB', lambda t: t.count('A') <= 1 and t.count('B') <= 1)}: `CBAD`")
expect(f, f"6. {brute_max('AAABAAB', lambda t: occurrences(t, 'AA') <= 1)}: `ABAAB`")
a47 = max_with_at_most(s4, "Q", 12)
a48 = max_each_queue(s4, "JKXZ", 6)
a49 = max_exact_words(s4, "TT", 25)
expect(f, f"8. {a47}.")
expect(f, f"9. {a48}:")
expect(f, f"10. {a49}:")
differ("4.10 count('TT') без перекрытий", occurrences(s4, "TT"), s4.count("TT"))

# --- 5. Позиции, разбиение и границы ---
f = "05-pozicii-i-granicy.md"
w = "CAABACAB"
expect(f, f"1. {brute_min(w, lambda t: t.count('A') >= 3)}: три подряд")
expect(f, f"2. {brute_max(w, lambda t: t.count('A') == 2)}: список с границами")
expect(f, f"3. {brute_min('ABACABAABA', lambda t: occurrences(t, 'ABA') >= 2)}: начала `ABA`")
expect(f, f"4. {brute_max('ABYCDXEFGHYXI', lambda t: 'X' not in t and 'Y' not in t)}: `EFGH`")


def f_chain(t: str) -> bool:
    return (
        len(t) >= 2
        and t[0] == "F"
        and t[-1] == "F"
        and all(p.count("A") <= 1 for p in t[1:-1].split("F"))
    )


expect(f, f"5. {brute_max('AFBAFCFAAFDF', f_chain)}: `FBAFCF`")
sep = "KLMNBCABXYZACBQ"
covered = {
    j
    for i in range(len(sep) - 2)
    if sorted(sep[i : i + 3]) == ["A", "B", "C"]
    for j in range(i, i + 3)
}
expect(
    f,
    f"6. {max(len(p) for p in ''.join('|' if i in covered else c for i, c in enumerate(sep)).split('|'))}:",
)
s5 = read("24-5.txt")
a57 = min_window(s4, "Q", 50)
expect(f, f"7. {a57}.")
k_at = [i for i, c in enumerate(s5) if c == "K"]
zeros = [i for i, c in enumerate(s5) if c == "0"]
a58 = len(s5) + 1
for z_prev, z in zip([-1] + zeros, zeros, strict=False):
    idx = bisect_left(k_at, z)
    if idx >= 6 and k_at[idx - 6] > z_prev:
        a58 = min(a58, z - k_at[idx - 6] + 1)
expect(f, f"8. {a58}:")
found = []
for m in re.finditer(r"(?=([0369])([A-Z]+)\1)", s5):
    inside = m.group(2)
    if 2 * sum(c in VOWELS for c in inside) == len(inside):
        found.append((len(inside) + 2, m.start()))
a59 = max(found)[1]
expect(f, f"9. {a59}:")
differ("5.9 при равенстве — меньший номер", a59, min(st for ln, st in found if ln == max(found)[0]))
a510 = max((len(t) for _, t in runs_of(s5, ds.LETTERS) if set(VOWELS) <= set(t)), default=0)
expect(f, f"10. {a510}.")

# --- 6. Числа и выражения ---
f = "06-chisla-i-vyrazheniya.md"
expect(f, "1. `0`, `80`, `105`.")
expect(
    f, "2. " + ", ".join(f"`{t}` ({len(t)})" for _, t in runs_of("X10Y2025Z3", "0123456789")) + "."
)
expect(f, f"3. {longest_expression('5+*12+0*07+3', '+*', True)}: `12+0*0`")
expect(f, "4. Под `AB+` — `ABBB` и `AB`; под `(?:AB)+` — `ABAB` и `AB`.")
expect(f, f"5. `0`–`9` и `A`–`F`. `1A3` нечётно — последняя цифра {int('1A3', 16) % 16}")
b12 = max(len(t.lstrip("0")) for _, t in runs_of("0A9BC00B1A20X", "0123456789AB"))
expect(f, f"6. {b12}: `B1A20`")
s6, s7 = read("24-6.txt"), read("24-7.txt")
a67 = longest_expression(s6, "+*", True)
a68 = longest_expression(s7, "-*", False)
a69 = max(len(t.lstrip("0")) for _, t in runs_of(s5, "0123456789ABCDEFGHIJ"))
expect(f, f"7. {a67}.")
expect(f, f"8. {a68}:")
expect(f, f"9. {a69}.")
best_even = (0, 0)
for _, block in runs_of(s5, "0123456789ABCDEF"):
    for i in range(len(block)):
        for j in range(len(block), i, -1):
            t = block[i:j].lstrip("0") or "0"
            if int(t, 16) % 2 == 0:
                best_even = max(best_even, (len(t), int(t, 16)))
                break
expect(f, f"10. {best_even[0]}.")
differ("6.7 ведущие нули разрешены", a67, ds.longest(r"[0-9]+(?:[+*][0-9]+)*", s6))

# --- 7. Выражения с дополнительными условиями ---
f = "07-usloviya-na-vyrazhenie.md"


def k_numbers(t: str, k: int) -> bool:
    return is_expr(t, "[1-9]+", "+*") and len(re.findall("[1-9]+", t)) <= k


expect(f, f"1. {brute_max('9*8+76+5+4321', lambda t: k_numbers(t, 2))}: `5+4321`")
expect(f, f"2. {brute_max('1+22*333+4444', lambda t: k_numbers(t, 3))}: `22*333+4444`")


def math_order(t: str) -> bool:
    ops = [c for c in t if c in "+-*"]
    return all(not (a in "+-" and b == "*") for i, a in enumerate(ops) for b in ops[i + 1 :])


chosen = [e for e in ["7*2-5", "7-2*5", "7-2-5", "3*4*5-1"] if math_order(e)]
expect(f, "3. " + ", ".join(f"`{e}`" for e in chosen[:-1]) + f" и `{chosen[-1]}`")
expect(
    f, f"4. {brute_max('4-3*2*5-1', lambda t: is_expr(t, N0, '+-*') and math_order(t))}: `3*2*5-1`"
)
expect(f, f"5. {max(v for t, vals in sums_after('A12-25+3', 'A', '+-') for v in vals)}:")
longest_b = max(sums_after("B12-3CB21+5", "B", "+-"), key=lambda tv: (len(tv[0]), tv[1][-1]))
expect(f, f"6. {longest_b[1][-1]}:")
s8 = read("24-8.txt")
a77 = numbers_window(s8, 20)
a78 = order_brute(s7)
a79 = max(v for _, vals in sums_after(s8, "C", "+") for v in vals)
longest_8 = max(sums_after(s8, "B", "+-"), key=lambda tv: (len(tv[0]), tv[1][-1]))
a710 = longest_8[1][-1]
expect(f, f"7. {a77}.")
expect(f, f"8. {a78}:")
expect(f, f"9. {a79}:")
expect(f, f"10. {str(a710).replace('-', '−')}.")
differ(
    "7.7 жадный поиск выражений сразу с ограничением",
    a77,
    ds.longest(r"[1-9]+(?:[-+*][1-9]+){0,19}", s8),
)

# --- 8. Накопленные количества ---
f = "08-nakoplennye-kolichestva.md"
t8 = "ABBAB"
prefix = [sum(c == "B" for c in t8[:i]) for i in range(len(t8) + 1)]
expect(
    f,
    f"1. `{prefix}`; во фрагменте `{t8[1:4]}` — `prefix[4] - prefix[1]` = {prefix[4] - prefix[1]}",
)
expect(f, f"2. {brute_max('ABBBAAB', lambda t: t.count('A') == t.count('B'))}: `ABBBAA`")
expect(f, f"3. {brute_max('ABCADEB', lambda t: len(set(t)) == len(t))}: `BCADE` или `CADEB`")
look = re.findall(r"(?=(B[0-9]+B))", "B7B12B3B")
plain = re.findall(r"B[0-9]+B", "B7B12B3B")
expect(
    f,
    f"4. Три фрагмента: `{look[0]}`, `{look[1]}`, `{look[2]}`, самый длинный — {max(map(len, look))}. Без просмотра вперёд — два: `{plain[0]}` и `{plain[1]}`",
)
expect(
    f, f"5. {brute_min('X12Y3Z45W', lambda t: len(re.findall(r'(?=([A-Z][0-9]+[A-Z]))', t)) >= 2)}:"
)
expect(
    f,
    f"6. {brute_max('ABAYABABAYXYABA', lambda t: t.count('Y') == 1 and occurrences(t, 'ABA') >= 2)}:",
)
a87 = combo_window(s5, "Y", 30, "2025", 4)
a88 = min_objects_runs(s5, 500)
expect(f, f"7. {a87}.")
expect(f, f"8. {a88}.")

# --- 9. Практика и итог ---
f = "09-praktika-i-itog.md"
s9 = read("24-9.txt")
a91 = avoiding(
    len(s9), [i for i in range(len(s9) - 1) if s9[i] in VOWELS and s9[i + 1] in VOWELS], 2
)
a92 = first_alphabet(Counter(b for a, b, c in zip(s9, s9[1:], s9[2:], strict=False) if a == c))
a93 = max_each_queue(s9, "QXZ", 40)
a94 = max(len(p) + 2 for c in "ABCDEF" for p in s9.split(c)[1:-1])
a95 = longest_expression(s6, "+", True)
expect(f, f"1. {a91}:")
expect(f, f"2. `{a92}`.")
expect(f, f"3. {a93}:")
expect(f, f"4. {a94}:")
expect(f, f"5. {a95}:")
differ("9.1 сброс до 0", a91, reset_to(s9, VOWELS, 0))

# --- the answers of datasets.py equal the second methods ---
printed = ds.answers()
for label, value in {
    "1.8": k_more,
    "2.7": a27,
    "2.8": a28,
    "2.9": a29,
    "3.7": a37,
    "3.8": best38,
    "3.9": a39,
    "3.10": a310,
    "4.7": a47,
    "4.8": a48,
    "4.9": a49,
    "5.7": a57,
    "5.8": a58,
    "5.9": a59,
    "5.10": a510,
    "6.7": a67,
    "6.8": a68,
    "6.9": a69,
    "6.10": best_even[0],
    "7.7": a77,
    "7.8": a78,
    "7.9": a79,
    "7.10": a710,
    "8.7": a87,
    "8.8": a88,
    "9.1": a91,
    "9.2": a92,
    "9.3": a93,
    "9.4": a94,
    "9.5": a95,
}.items():
    same(f"datasets.py {label}", printed[label], value)

bad = [c for c in checks if not c[2]]
for page, needle, ok in checks:
    if not ok:
        print(f"FAIL {page}: {needle}")
print(f"checked {len(checks)}, failed {len(bad)}")
sys.exit(1 if bad else 0)
