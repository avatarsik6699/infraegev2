"""Copy line ranges of an author's source lesson into subtopic drafts.

Usage:
    python3 -I scripts/lesson_design/split_source.py SOURCE.md \
        OUT1.md=1-31,33-241 OUT2.md=243-773 ...

Each OUT gets the listed line ranges of SOURCE (1-based, inclusive), joined by
a horizontal rule. LaTeX math (\\( \\) and \\[ \\]) is converted to plain Unicode
(√, ·, ≤, ², ₁ …) because the stand cannot load a math library, and tracking
parameters (utm_source) are stripped from links. The author's wording is kept
verbatim: edit the drafts afterwards, never rewrite them from scratch.
After conversion, search the drafts for a remaining backslash outside code
blocks and fix such spots by hand.
"""

import re
import sys

SUP = str.maketrans("0123456789+-()ni", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ⁿⁱ")
SUB = str.maketrans("0123456789ik", "₀₁₂₃₄₅₆₇₈₉ᵢₖ")


def conv(m):
    t = m
    for a, b in [
        (r"\qquad", " "),
        (r"\quad", " "),
        (r"\,", " "),
        (r"\;", " "),
        (r"\ ", " "),
        (r"\cdots", "…"),
        (r"\ldots", "…"),
        (r"\dots", "…"),
        (r"\cdot", "·"),
        (r"\leqslant", "≤"),
        (r"\geqslant", "≥"),
        (r"\left", ""),
        (r"\right", ""),
        (r"\Rightarrow", "⇒"),
        (r"\iff", "⇔"),
        (r"\infty", "∞"),
        (r"\in", "∈"),
        (r"\le", "≤"),
        (r"\ge", "≥"),
        (r"\ne", "≠"),
        (r"\to", " → "),
        (r"\approx", " ≈ "),
        (r"\tau", "τ"),
        (r"\infty", "∞"),
        (r"\times", "×"),
        (r"\bmod", "mod"),
        (r"\%", "%"),
        (r"\{", "{"),
        (r"\}", "}"),
        (r"\lfloor", "⌊"),
        (r"\rfloor", "⌋"),
        (r"\left", ""),
        (r"\right", ""),
        (r"\bigl", ""),
        (r"\bigr", ""),
        (r"\max", "max"),
        (r"\min", "min"),
        (r"\sum", "Σ"),
        (r"\overline", "¯"),
    ]:
        t = t.replace(a, b)
    t = re.sub(r"\\boxed\{(.*)\}", r"\1", t)
    t = re.sub(r"\\text\{([^{}]*)\}", r"\1", t)
    t = re.sub(r"\^\{([a-z])_(\d|k)\}", lambda m: "^" + m.group(1) + m.group(2).translate(SUB), t)
    t = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"\1/\2", t)
    t = re.sub(r"\\frac\s*(\w)\s*(\w)", r"\1/\2", t)
    t = re.sub(r"\\sqrt\{([^{}]*)\}", r"√\1", t)
    t = re.sub(r"\\sqrt\s*(\w+)", r"√\1", t)
    t = re.sub(r"\^\{([0-9+\-ni]+)\}", lambda m: m.group(1).translate(SUP), t)
    t = re.sub(r"\^([0-9n])", lambda m: m.group(1).translate(SUP), t)
    t = re.sub(r"_\{?([0-9ik])\}?", lambda m: m.group(1).translate(SUB), t)
    t = re.sub(r"\{,\}", ",", t)
    t = t.replace("{", "").replace("}", "") if "\\" not in t else t
    return re.sub(r"\s+", " ", t).strip()


def convert(s):
    s = re.sub(r"\\\[(.*?)\\\]", lambda m: "\n" + conv(m.group(1)) + "\n", s, flags=re.S)
    s = re.sub(r"\\\((.*?)\\\)", lambda m: conv(m.group(1)), s, flags=re.S)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s


UTM = re.compile(r"[?&]utm_source=[^)\s]*|\\&utm_source=[^)\s]*")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    lines = open(sys.argv[1], encoding="utf-8").read().split("\n")
    for spec in sys.argv[2:]:
        out, ranges = spec.split("=")
        parts = []
        for r in ranges.split(","):
            a, b = map(int, r.split("-"))
            parts.append("\n".join(lines[a - 1 : b]))
        text = convert("\n\n---\n\n".join(parts))
        text = UTM.sub("", text)
        open(out, "w", encoding="utf-8").write(text + "\n")
        print(out)
