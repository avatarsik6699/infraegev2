"""Independent recomputation of every task answer in topic 25.

Usage: python3 -I docs/artifacts/lesson-design/topic-25/checks.py

Each answer is recomputed here (where practical by full divisor enumeration,
a different method than the lesson uses) and every expected answer line must
appear verbatim in the subtopic file. Exit code 1 if any check fails.
Every new topic gets its own checks.py in the same style.
"""

import sys
from pathlib import Path
from math import isqrt
from fnmatch import fnmatch

D = Path(__file__).resolve().parent


def rd(f):
    return open(f"{D}/{f}").read()


def divs_slow(n):
    return [d for d in range(1, n + 1) if n % d == 0]


def divs(n):
    r = []
    for d in range(1, isqrt(n) + 1):
        if n % d == 0:
            r.append(d)
            if d != n // d:
                r.append(n // d)
    return sorted(r)


def isp(n):
    return n > 1 and all(n % d for d in range(2, isqrt(n) + 1))


def pf(n):
    f = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            f.append(d)
            n //= d
        d += 1
    if n > 1:
        f.append(n)
    return f


def first(start, k, pred, step=1):
    r = []
    n = start
    while len(r) < k:
        v = pred(n)
        if v is not None:
            r.append(v)
        n += step
    return r


def lines(rows):
    return ["\n   " + " ".join(map(str, r)) for r in rows]


checks = []


def expect(f, rows):
    t = rd(f)
    for line in lines(rows):
        checks.append((f, line.strip(), line.strip() in t))


# s1
t = rd("01-perebor-i-proverki.md")
checks.append(
    (
        "01",
        "114",
        sum(1 for n in range(1000, 2001) if n % 7 == 0 and n % 5) == 114 and "2. 114" in t,
    )
)
checks.append(
    (
        "01",
        "33",
        sum(1 for n in range(10000, 20001) if n % 100 == 37 and n % 3 == 0) == 33 and "4. 33" in t,
    )
)
checks.append(
    (
        "01",
        "63",
        sum(1 for n in range(1, 1001) if sum(map(int, str(n))) == 10) == 63 and "5. 63" in t,
    )
)
r = [n for n in range(499999, 0, -1) if n % 13 == 0 and n % 10 == 9 and "0" in str(n)][:3]
checks.append(("01", "top3", ", ".join(map(str, r)) in t))
# s2
expect(
    "02-deliteli-parami.md",
    [
        (n, *[d for d in divs_slow(n) if 1 < d < n])
        for n in range(312400, 312451)
        if len([d for d in divs_slow(n) if 1 < d < n]) == 4
    ],
)
t = rd("02-deliteli-parami.md")
checks.append(("02", "24", len(divs(360)) == 24 and "3. 24" in t))
checks.append(("02", "90", ", ".join(map(str, [d for d in divs(90) if d % 2 == 0])) in t))


# s3
def cm(n):
    for d in range(2, isqrt(n) + 1):
        if n % d == 0:
            return d + n // d
    return 0


expect(
    "03-chisla-po-delitelyam.md",
    first(600001, 5, lambda n: (n, cm(n)) if cm(n) > 0 and cm(n) % 10 == 6 else None),
)


def m2(n):
    X = [d for d in divs(n) if 1 < d < n]
    return X[-1] + X[-2] if len(X) >= 2 else 0


expect(
    "03-chisla-po-delitelyam.md",
    first(2000001, 5, lambda n: (n, m2(n)) if m2(n) > 0 and m2(n) % 101 == 0 else None),
)
b = max(range(1000, 1101), key=lambda n: (len(divs(n)), -n))
checks.append(("03", "max", f"`{len(divs(b))} {b}`" in rd("03-chisla-po-delitelyam.md")))


# s4
def pd(n):
    return [p for p in sorted(set(pf(n))) if p != n]


expect(
    "04-prostye-i-razlozhenie.md",
    first(
        3000001,
        5,
        lambda n: (
            (n, max(pf(n))) if len(pf(n)) == 2 and all("7" in str(p) for p in pf(n)) else None
        ),
    ),
)
expect(
    "04-prostye-i-razlozhenie.md",
    first(
        2500001,
        5,
        lambda n: (
            (n, sum(pd(n))) if pd(n) and sum(pd(n)) <= 5000 and sum(pd(n)) % 10 == 7 else None
        ),
    ),
)
expect(
    "04-prostye-i-razlozhenie.md",
    first(
        5000001,
        5,
        lambda n: (
            (n, pd(n)[0] + pd(n)[-1])
            if pd(n) and pd(n)[0] + pd(n)[-1] > 1000 and isp(pd(n)[0] + pd(n)[-1])
            else None
        ),
    ),
)
checks.append(("04", "37", max(pf(999999)) == 37))
# s5
expect(
    "05-maski.md",
    [(n, n // 2027) for n in range(2027, 10**8 + 1, 2027) if fnmatch(str(n), "12?4*76")],
)
expect(
    "05-maski.md",
    [
        (n, n // 53)
        for a in range(10)
        for c in range(10)
        for n in [int(f"3{a}8{c}405")]
        if n % 53 == 0
    ],
)
checks.append(("05", "1?2*", sum(1 for n in range(1, 100000) if fnmatch(str(n), "1?2*")) == 1110))
# s6
expect(
    "06-vid-chisla.md",
    [
        (v,)
        for v in sorted(
            2**m * 3**k
            for m in range(0, 40, 2)
            for k in range(1, 40, 2)
            if 2 * 10**8 <= 2**m * 3**k <= 6 * 10**8
        )
    ],
)
checks.append(("06", "odd", sum(1 for n in range(1, 10001) if len(divs(n)) % 2) == 100))
checks.append(("06", "p4", [n for n in range(1, 101) if len(divs(n)) == 5] == [16, 81]))
checks.append(
    (
        "06",
        "tau72",
        (
            len(divs(72)),
            len([d for d in divs(72) if d % 2 == 0]),
            len([d for d in divs(72) if d % 2]),
        )
        == (12, 9, 3),
    )
)
# practice
P = "07-praktika-i-itog.md"
expect(
    P,
    [
        (n, *sorted(d for d in divs_slow(n) if 1 < d < n))
        for n in range(500035, 500056)
        if len([d for d in divs_slow(n) if 1 < d < n]) == 2
    ],
)
expect(
    P,
    first(
        1200001,
        5,
        lambda n: (
            (n, max(pd(n))) if pd(n) and max(pd(n)) <= 1000 and max(pd(n)) % 10 == 7 else None
        ),
    ),
)
expect(P, [(n, n // 1301) for n in range(1301, 10**8 + 1, 1301) if fnmatch(str(n), "8?4*21")])
expect(
    P,
    first(
        1000001,
        5,
        lambda n: (n, *pf(n)) if len(pf(n)) == 3 and all("3" in str(p) for p in pf(n)) else None,
    ),
)
b = max(range(200000, 200101), key=lambda n: (len(divs(n)), -n))
checks.append((P, "max", f"`{len(divs(b))} {b}`" in rd(P)))
bad = [c for c in checks if not c[2]]
print(len(checks), "checks; failed:", bad)
sys.exit(1 if bad else 0)
