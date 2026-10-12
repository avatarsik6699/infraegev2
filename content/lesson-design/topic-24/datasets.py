"""Generate the data files of topic 24 and print the answers of their tasks.

Usage:
    python3 -I content/lesson-design/topic-24/datasets.py
        print the answer of every exam-format task (from the files on disk)
    python3 -I content/lesson-design/topic-24/datasets.py --write
        write files/24-N.txt and the textbook files
    python3 -I content/lesson-design/topic-24/datasets.py --check
        every file on disk equals what the generator gives

Every exam-format task works on our own file, never on a file of the
collection. On the exam a file holds about a million characters; here the
files of the subtopics hold 200–300 thousand (enough to rule out the search
of all substrings), and 24-9.txt has the exam size of 10⁶ characters for the
final page. Files are generated from fixed seeds and written piece by piece:
random runs of characters with a few planted fragments, so that the answer is
not hidden in the noise and a typical error gives another answer (TRAPS).

The answers here are computed by the programs of the lessons (one pass,
current length, window, positions, re.finditer); checks.py recomputes them
by other methods and compares both with the search of all substrings on short
random strings.
"""

from __future__ import annotations

import random
import re
import sys
from collections.abc import Callable, Iterator
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = HERE / "files"
CHUNK = 10_000

LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
DIGITS = "0123456789"
VOWELS = "AEIOUY"

# Textbook files: the worked examples that the lesson programs open.
TEXTBOOK = {
    "24.txt": "XXAXXXXBXX\n",
    "24-stroki.txt": "ABBACAB\nBCCB\nCAXXXAB\nAAB\n",
}


# --- generation ---------------------------------------------------------------


def random_run(rnd: random.Random, n: int, alphabet: str, weights=None) -> Iterator[str]:
    """n random characters in pieces of at most CHUNK."""
    while n > 0:
        k = min(n, CHUNK)
        yield "".join(rnd.choices(alphabet, weights, k=k))
        n -= k


def with_plants(
    rnd: random.Random, size: int, alphabet: str, plants: dict[int, str], weights=None
) -> Iterator[str]:
    """Random characters with fragments planted at fixed offsets; total = size."""
    pos = 0
    for at in sorted(plants):
        yield from random_run(rnd, at - pos, alphabet, weights)
        yield plants[at]
        pos = at + len(plants[at])
    yield from random_run(rnd, size - pos, alphabet, weights)


def xyz_chain(start: str, length: int) -> str:
    return "".join("XYZ"[("XYZ".index(start) + i) % 3] for i in range(length))


def file_1() -> Iterator[str]:
    """24-1.txt: X, Y, Z. A chain XYZ… that starts with Y, a long fragment
    without Y at the very end of the file."""
    rnd = random.Random(2401)
    tail = "".join(rnd.choice("XZ") for _ in range(47))
    plants = {
        61_000: "Y" + xyz_chain("Y", 53) + "Y",
        143_000: "Y" + xyz_chain("X", 44) + "X",
        200_000 - 48: "Y" + tail,
    }
    yield from with_plants(rnd, 200_000, "XYZ", plants)
    yield "\n"


def file_2() -> Iterator[str]:
    """24-2.txt: digits. A long fragment with the outer digits of every
    triple greater than the middle one, and an equality right after it."""
    rnd = random.Random(2402)
    zig = []
    for i in range(29):
        zig.append(rnd.choice("6789") if i % 2 == 0 else rnd.choice("0123"))
    plants = {
        120_000: "".join(zig) + "9",  # 3 + 9 > middle? see the task: the last triple breaks
        199_000: "".join(rnd.choice("6789") if i % 2 == 0 else "0" for i in range(25)),
    }
    yield from with_plants(rnd, 200_000, DIGITS, plants)
    yield "\n"


def file_3() -> Iterator[str]:
    """24-3.txt: 1000 lines of capital letters; every line has its own
    favourite letters. Two lines share the largest number of letters Q."""
    rnd = random.Random(2403)
    for k in range(1000):
        n = rnd.randint(20, 400)
        weights = [rnd.random() ** 3 for _ in LETTERS]
        if k in (311, 702):
            weights[LETTERS.index("Q")] = 0
            line = list("".join(rnd.choices(LETTERS, weights, k=n - 40)) + "Q" * 40)
            rnd.shuffle(line)
            yield "".join(line) + "\n"
            continue
        weights[LETTERS.index("Q")] = min(weights[LETTERS.index("Q")], 0.05)
        yield "".join(rnd.choices(LETTERS, weights, k=n)) + "\n"


F4_WEIGHTS = [8 if c in "AEIO" else 0.5 if c == "Q" else 1.5 if c in "JKXZ" else 4 for c in LETTERS]


def file_4() -> Iterator[str]:
    """24-4.txt: capital letters with unequal frequencies: Q rare, A E I O
    frequent. Runs TTTT are planted, so pairs TT overlap."""
    rnd = random.Random(2404)
    plants = {at: "TTTT" for at in range(20_000, 300_000, 37_000)}
    yield from with_plants(rnd, 300_000, LETTERS, plants, F4_WEIGHTS)
    yield "\n"


F5_ALPHABET = LETTERS + DIGITS
F5_WEIGHTS = [2.6] * 26 + [3.4] * 10


def vowel_block(rnd: random.Random, n: int) -> str:
    """Letters only, with every vowel at least once."""
    others = [c for c in LETTERS if c not in VOWELS]
    block = list(VOWELS) + rnd.choices(others, k=n - 6)
    rnd.shuffle(block)
    return "".join(block)


def equal_block(rnd: random.Random, digit: str, pairs: int) -> str:
    """digit, letters with as many vowels as consonants, the same digit."""
    others = [c for c in LETTERS if c not in VOWELS]
    letters = rnd.choices(VOWELS, k=pairs) + rnd.choices(others, k=pairs)
    rnd.shuffle(letters)
    return digit + "".join(letters) + digit


def file_5() -> Iterator[str]:
    """24-5.txt: capital letters and digits. Planted: letter blocks with all
    vowels, «digit — letters — the same digit» with equal numbers of vowels
    and consonants (two of the same length), and the word 2025."""
    rnd = random.Random(2405)
    plants: dict[int, str] = {}
    for at, n in ((40_000, 31), (150_000, 44), (260_000, 38)):
        plants[at] = "7" + vowel_block(rnd, n) + "1"
    plants[90_000] = "4" + equal_block(rnd, "6", 7) + "B"
    plants[210_000] = "C" + equal_block(rnd, "9", 7) + "5"
    plants[230_000] = "C" + equal_block(rnd, "4", 8) + "5"
    at = 1_000
    while at < 295_000:
        if all(abs(at - p) > 120 for p in plants):
            plants[at] = "2025"
        at += rnd.randint(200, 1_200)
    yield from with_plants(rnd, 300_000, F5_ALPHABET, plants, F5_WEIGHTS)
    yield "\n"


def file_6() -> Iterator[str]:
    """24-6.txt: digits and signs + and *."""
    rnd = random.Random(2406)
    yield from random_run(rnd, 200_000, DIGITS + "+*", [6] * 10 + [9, 9])
    yield "\n"


def file_7() -> Iterator[str]:
    """24-7.txt: digits and signs − and * (the minus is the ASCII «-»)."""
    rnd = random.Random(2407)
    yield from random_run(rnd, 200_000, DIGITS + "-*", [6] * 8 + [3, 3] + [9, 9])
    yield "\n"


def file_8() -> Iterator[str]:
    """24-8.txt: digits 1–9, signs +, −, * and letters A–D, made of tokens: a
    number of 1–4 digits, then a sign or a letter, sometimes two signs."""
    rnd = random.Random(2408)
    size, pieces, total = 200_000, [], 0
    while total < size:
        number = "".join(rnd.choices("123456789", k=rnd.choices((1, 2, 3, 4), (4, 3, 2, 1))[0]))
        sep = rnd.choices("+-*ABCD", (30, 25, 20, 6, 6, 6, 6))[0]
        if rnd.random() < 0.08:
            sep += rnd.choice("+-*")
        pieces.append(number + sep)
        total += len(number) + len(sep)
        if len(pieces) == 1000:
            yield from _cut(pieces, total, size)
            pieces = []
    yield from _cut(pieces, total, size)
    yield "\n"


def _cut(pieces: list[str], total: int, size: int) -> Iterator[str]:
    text = "".join(pieces)
    yield text[: len(text) - max(0, total - size)]


F9_WEIGHTS = [6 if c in "AEIOU" else 1 if c in "QXZJ" else 3 for c in LETTERS]


def file_9() -> Iterator[str]:
    """24-9.txt: the exam size, 10⁶ capital letters."""
    rnd = random.Random(2409)
    yield from random_run(rnd, 1_000_000, LETTERS, F9_WEIGHTS)
    yield "\n"


GENERATED: dict[str, Callable[[], Iterator[str]]] = {
    "24-1.txt": file_1,
    "24-2.txt": file_2,
    "24-3.txt": file_3,
    "24-4.txt": file_4,
    "24-5.txt": file_5,
    "24-6.txt": file_6,
    "24-7.txt": file_7,
    "24-8.txt": file_8,
    "24-9.txt": file_9,
}


# --- the lesson programs --------------------------------------------------------


def read(name: str) -> str:
    with open(FILES / name) as f:
        return f.readline().rstrip("\r\n")


def lines_of(name: str) -> list[str]:
    with open(FILES / name) as f:
        return [line.rstrip("\r\n") for line in f]


def run_without(s: str, bad: str) -> int:
    """Longest run of characters other than bad (subtopic 2)."""
    current = best = 0
    for c in s:
        current = current + 1 if c != bad else 0
        best = max(best, current)
    return best


def no_pair_from(s: str, group: str) -> int:
    """No two characters of group stand side by side (subtopic 2)."""
    current = best = 0
    for i in range(len(s)):
        if i > 0 and s[i - 1] in group and s[i] in group:
            current = 1
        else:
            current += 1
        best = max(best, current)
    return best


def outer_triples(s: str) -> int:
    """Every triple: the sum of the outer digits is greater than the middle."""
    current = min(len(s), 2)
    best = current
    for i in range(2, len(s)):
        if int(s[i - 2]) + int(s[i]) > int(s[i - 1]):
            current += 1
        else:
            current = 2
        best = max(best, current)
    return best


def periodic(s: str, pattern: str) -> int:
    """Chain pattern·pattern·… that starts with pattern[0] (subtopic 3)."""
    current = best = 0
    for c in s:
        if c == pattern[current % len(pattern)]:
            current += 1
        elif c == pattern[0]:
            current = 1
        else:
            current = 0
        best = max(best, current)
    return best


def most_before(s: str, letter: str) -> str:
    """The character most often right before letter; ties — earlier in the alphabet."""
    freq: dict[str, int] = {}
    for i in range(1, len(s)):
        if s[i] == letter:
            freq[s[i - 1]] = freq.get(s[i - 1], 0) + 1
    answer, best_count = "", 0
    for c in sorted(freq):
        if freq[c] > best_count:
            best_count, answer = freq[c], c
    return answer


def blocks_pairs(s: str, first: str, second: str) -> int:
    """Longest chain of whole pairs «first + second» (subtopic 3)."""
    best = 0
    for offset in range(2):
        current = 0
        for i in range(offset, len(s) - 1, 2):
            if s[i] in first and s[i + 1] in second:
                current += 1
            else:
                current = 0
            best = max(best, current)
    return best


def window_at_most(s: str, letter: str, k: int) -> int:
    left = count = best = 0
    for right in range(len(s)):
        if s[right] == letter:
            count += 1
        while count > k:
            if s[left] == letter:
                count -= 1
            left += 1
        best = max(best, right - left + 1)
    return best


def window_each(s: str, letters: str, k: int) -> int:
    """Every letter of letters at most k times (a dictionary of counters)."""
    count = {c: 0 for c in letters}
    left = best = 0
    for right in range(len(s)):
        c = s[right]
        if c in count:
            count[c] += 1
            while count[c] > k:
                if s[left] in count:
                    count[s[left]] -= 1
                left += 1
        best = max(best, right - left + 1)
    return best


def window_pairs_exact(s: str, word: str, k: int) -> int:
    """Exactly k whole occurrences of a two-letter word (they may overlap)."""
    left = count = best = 0
    for right in range(len(s)):
        if right >= 1 and s[right - 1 : right + 1] == word and right - 1 >= left:
            count += 1
        while count > k:
            if s[left : left + 2] == word and left + 1 <= right:
                count -= 1
            left += 1
        if count == k:
            best = max(best, right - left + 1)
    return best


def min_with(s: str, letter: str, k: int) -> int:
    positions = [i for i in range(len(s)) if s[i] == letter]
    best = len(s) + 1
    for j in range(len(positions) - k + 1):
        best = min(best, positions[j + k - 1] - positions[j] + 1)
    return best


def min_end_digit(s: str, end: str, letter: str, k: int) -> int:
    """Ends with digit end, holds it once and exactly k letters (subtopic 5)."""
    positions: list[int] = []
    best = len(s) + 1
    for i in range(len(s)):
        if s[i] == letter:
            positions.append(i)
        elif s[i] == end:
            if len(positions) >= k:
                best = min(best, i - positions[-k] + 1)
            positions = []
    return best


def equal_between(s: str, ends: str) -> int:
    """Start index of the longest «digit, letters, the same digit» with as many
    vowels as consonants; the digit is one of ends; ties — the larger start."""
    digits_at = [i for i in range(len(s)) if s[i] in DIGITS]
    best_length, best_start = 0, -1
    for a, b in zip(digits_at, digits_at[1:], strict=False):
        if s[a] == s[b] and s[a] in ends and b - a > 1:
            inside = s[a + 1 : b]
            vowels = sum(c in VOWELS for c in inside)
            if 2 * vowels == len(inside):
                length = b - a + 1
                if length > best_length or (length == best_length and a > best_start):
                    best_length, best_start = length, a
    return best_start


def all_vowels_block(s: str) -> int:
    current, seen, best = 0, set(), 0
    for c in s:
        if c in LETTERS:
            current += 1
            if c in VOWELS:
                seen.add(c)
        else:
            current, seen = 0, set()
        if len(seen) == len(VOWELS):
            best = max(best, current)
    return best


NUMBER = r"(?:0|[1-9][0-9]*)"


def longest(pattern: str, s: str) -> int:
    return max((m.end() - m.start() for m in re.finditer(pattern, s)), default=0)


def base_number(s: str, digits: str) -> int:
    """Longest record of a number with these digits and no leading zero."""
    return longest(f"[{re.escape(digits[1:])}][{re.escape(digits)}]*", s)


def max_even(s: str, digits: str) -> int:
    """Length of the largest even number in an even base (record without
    leading zeros; the number 0 has length 1)."""
    best = ""
    for m in re.finditer(f"[{digits}]+", s):
        block = m.group().lstrip("0")
        end = max((i for i, c in enumerate(block) if digits.index(c) % 2 == 0), default=-1)
        candidate = block[: end + 1] if end >= 0 else ("0" if "0" in m.group() else "")
        if (len(candidate), candidate) > (len(best), best):
            best = candidate
    return len(best)


def at_most_numbers(s: str, k: int) -> int:
    best = 0
    for expression in re.finditer(r"[1-9]+(?:[-+*][1-9]+)*", s):
        numbers = list(re.finditer(r"[1-9]+", expression.group()))
        for j in range(len(numbers)):
            i = max(0, j - k + 1)
            best = max(best, numbers[j].end() - numbers[i].start())
    return best


def order_ok(s: str, digits: str) -> int:
    """Longest correct expression (− and *, numbers of the base without
    leading zeros) where no * comes after a −: left to right is the math order."""
    number = f"(?:0|[{digits[1:]}][{digits}]*)"
    best = 0
    for m in re.finditer(number + f"(?:[-*]{number})*", s):
        text = m.group()
        start = 0
        for i, c in enumerate(text):
            if c == "*":
                minus = text.rfind("-", start, i)
                if minus != -1:
                    start = minus + 1
            best = max(best, i - start + 1)
    return best


def best_sum_after(s: str, letter: str, signs: str) -> int:
    """The largest result of a correct sum right after letter."""
    best = None
    for m in re.finditer(letter + f"([1-9]+(?:[{signs}][1-9]+)*)", s):
        total = 0
        for term in re.finditer(r"([-+]?)([1-9]+)", m.group(1)):
            total += -int(term.group(2)) if term.group(1) == "-" else int(term.group(2))
            if best is None or total > best:
                best = total
    assert best is not None
    return best


def longest_sum_after(s: str, letter: str) -> int:
    """The result of the longest correct sum (+ and −) right after letter;
    ties — the larger result."""
    best_length, best_value = 0, None
    for m in re.finditer(letter + r"([1-9]+(?:[-+][1-9]+)*)", s):
        text = m.group(1)
        value = sum(int(t) for t in re.findall(r"[-+]?[1-9]+", text))
        if len(text) > best_length or (
            len(text) == best_length and (best_value is None or value > best_value)
        ):
            best_length, best_value = len(text), value
    assert best_value is not None
    return best_value


def combo(s: str, letter: str, k: int, word: str, t: int) -> int:
    """Exactly k letters and at least t whole words (subtopic 8)."""
    m, n = len(word), len(s)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + (s[i : i + m] == word)
    positions = [-1] + [i for i in range(n) if s[i] == letter] + [n]
    best = 0
    for j in range(1, len(positions) - k):
        left, right = positions[j - 1] + 1, positions[j + k] - 1
        if right - left + 1 >= m and prefix[right - m + 2] - prefix[left] >= t:
            best = max(best, right - left + 1)
    return best


def min_objects(s: str, k: int) -> int:
    """Shortest fragment with k «words»: letters with a digit on both sides."""
    starts, ends = [], []
    for match in re.finditer(r"(?=([0-9][A-Z]+[0-9]))", s):
        starts.append(match.start(1))
        ends.append(match.end(1) - 1)
    return min(ends[j + k - 1] - starts[j] + 1 for j in range(len(starts) - k + 1))


def lines_more(name: str, a: str, b: str) -> int:
    return sum(line.count(a) > line.count(b) for line in lines_of(name))


def rarest_in_line(name: str) -> str:
    """The line with the most letters Q (the last of equal ones), and the
    letter it holds the fewest times (among present; ties — earlier)."""
    best_line, best_q = "", -1
    for line in lines_of(name):
        q = line.count("Q")
        if q >= best_q:
            best_q, best_line = q, line
    freq: dict[str, int] = {}
    for c in best_line:
        freq[c] = freq.get(c, 0) + 1
    answer, fewest = "", len(best_line) + 1
    for c in sorted(freq):
        if freq[c] < fewest:
            fewest, answer = freq[c], c
    return answer


def same_letter_ends(s: str, letters: str) -> int:
    """Longest fragment that starts and ends with the same letter of letters
    and has no such letter inside."""
    last: dict[str, int] = {}
    best = 0
    for i, c in enumerate(s):
        if c in letters:
            if c in last:
                best = max(best, i - last[c] + 1)
            last[c] = i
    return best


def neighbours_not_vowels(s: str) -> int:
    return no_pair_from(s, VOWELS)


def most_between_equal(s: str) -> str:
    """The letter most often standing between two equal letters; ties — earlier."""
    freq: dict[str, int] = {}
    for i in range(len(s) - 2):
        if s[i] == s[i + 2]:
            freq[s[i + 1]] = freq.get(s[i + 1], 0) + 1
    answer, best_count = "", 0
    for c in sorted(freq):
        if freq[c] > best_count:
            best_count, answer = freq[c], c
    return answer


def plus_only(s: str) -> int:
    return longest(NUMBER + r"(?:\+" + NUMBER + r")*", s)


# task label -> (file, how the answer is computed)
TASKS: dict[str, tuple[str, Callable[[str], object]]] = {
    "1.8": ("24-3.txt", lambda _: lines_more("24-3.txt", "K", "L")),
    "2.7": ("24-1.txt", lambda s: run_without(s, "Y")),
    "2.8": ("24-1.txt", lambda s: no_pair_from(s, "XZ")),
    "2.9": ("24-2.txt", outer_triples),
    "3.7": ("24-1.txt", lambda s: periodic(s, "XYZ")),
    "3.8": ("24-4.txt", lambda s: blocks_pairs(s, VOWELS, "".join(set(LETTERS) - set(VOWELS)))),
    "3.9": ("24-4.txt", lambda s: most_before(s, "R")),
    "3.10": ("24-3.txt", lambda _: rarest_in_line("24-3.txt")),
    "4.7": ("24-4.txt", lambda s: window_at_most(s, "Q", 12)),
    "4.8": ("24-4.txt", lambda s: window_each(s, "JKXZ", 6)),
    "4.9": ("24-4.txt", lambda s: window_pairs_exact(s, "TT", 25)),
    "5.7": ("24-4.txt", lambda s: min_with(s, "Q", 50)),
    "5.8": ("24-5.txt", lambda s: min_end_digit(s, "0", "K", 6)),
    "5.9": ("24-5.txt", lambda s: equal_between(s, "0369")),
    "5.10": ("24-5.txt", all_vowels_block),
    "6.7": ("24-6.txt", lambda s: longest(NUMBER + f"(?:[+*]{NUMBER})*", s)),
    "6.8": ("24-7.txt", lambda s: longest(r"[1-9][0-9]*(?:[-*][1-9][0-9]*)*", s)),
    "6.9": ("24-5.txt", lambda s: base_number(s, "0123456789ABCDEFGHIJ")),
    "6.10": ("24-5.txt", lambda s: max_even(s, "0123456789ABCDEF")),
    "7.7": ("24-8.txt", lambda s: at_most_numbers(s, 20)),
    "7.8": ("24-7.txt", lambda s: order_ok(s, "01234567")),
    "7.9": ("24-8.txt", lambda s: best_sum_after(s, "C", "+")),
    "7.10": ("24-8.txt", lambda s: longest_sum_after(s, "B")),
    "8.7": ("24-5.txt", lambda s: combo(s, "Y", 30, "2025", 4)),
    "8.8": ("24-5.txt", lambda s: min_objects(s, 500)),
    "9.1": ("24-9.txt", neighbours_not_vowels),
    "9.2": ("24-9.txt", most_between_equal),
    "9.3": ("24-9.txt", lambda s: window_each(s, "QXZ", 40)),
    "9.4": ("24-9.txt", lambda s: same_letter_ends(s, "ABCDEF")),
    "9.5": ("24-6.txt", plus_only),
}


def answers() -> dict[str, object]:
    cache: dict[str, str] = {}
    result = {}
    for label, (name, solve) in TASKS.items():
        if name not in cache:
            cache[name] = read(name)
        result[label] = solve(cache[name])
    return result


def write() -> None:
    FILES.mkdir(exist_ok=True)
    for name, text in TEXTBOOK.items():
        (FILES / name).write_text(text, encoding="utf-8")
    for name, pieces in GENERATED.items():
        with open(FILES / name, "w", encoding="ascii", newline="\n") as f:
            for piece in pieces():
                f.write(piece)
        print(f"{FILES / name}: {(FILES / name).stat().st_size} bytes")


def check() -> int:
    bad = 0
    for name, text in TEXTBOOK.items():
        if (FILES / name).read_text(encoding="utf-8") != text:
            bad += 1
            print(f"DIFFERS {name}")
    for name, pieces in GENERATED.items():
        with open(FILES / name, encoding="ascii", newline="") as f:
            same = all(f.read(len(piece)) == piece for piece in pieces()) and f.read(1) == ""
        if not same:
            bad += 1
            print(f"DIFFERS {name}")
    print(f"checked {len(TEXTBOOK) + len(GENERATED)} files, differ: {bad}")
    return bad


if __name__ == "__main__":
    if "--write" in sys.argv:
        write()
    if "--check" in sys.argv:
        sys.exit(1 if check() else 0)
    for label, value in answers().items():
        print(label, value)
