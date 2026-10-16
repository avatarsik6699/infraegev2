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


# Commands whose names start with a shorter command of the table below
# (\leftrightarrow with \left, \neg with \ne, \leq with \le, \notin with \in):
# they are replaced first, longest names first.
LONG = [
    (r"\not\leftrightarrow", " ↮ "),
    (r"\Longleftrightarrow", " ⟺ "),
    (r"\Longrightarrow", " ⟹ "),
    (r"\Leftrightarrow", " ⇔ "),
    (r"\leftrightarrow", " ↔ "),
    (r"\leftarrow", " ← "),
    (r"\mathbin{\&}", "&"),
    (r"\varnothing", "∅"),
    (r"\varepsilon", "ε"),
    (r"\setminus", " ∖ "),
    (r"\emptyset", "∅"),
    (r"\subseteq", "⊆"),
    (r"\supseteq", "⊇"),
    (r"\subset", "⊂"),
    (r"\supset", "⊃"),
    (r"\forall", "∀"),
    (r"\exists", "∃"),
    (r"\notin", "∉"),
    (r"\equiv", "≡"),
    (r"\oplus", "⊕"),
    (r"\lambda", "λ"),
    (r"\land", "∧"),
    (r"\wedge", "∧"),
    (r"\lnot", "¬"),
    (r"\neg", "¬"),
    (r"\lor", "∨"),
    (r"\vee", "∨"),
    (r"\nmid", "∤"),
    (r"\mid", "∣"),
    (r"\neq", "≠"),
    (r"\leq", "≤"),
    (r"\geq", "≥"),
    (r"\cup", "∪"),
    (r"\cap", "∩"),
    (r"\pm", "±"),
    (r"\&", "&"),
    (r"^\circ", "°"),
    (r"^{\circ}", "°"),
    (r"\circ", "°"),
    (r"\lceil", "⌈"),
    (r"\rceil", "⌉"),
]


def conv(m):
    t = m
    # weighted arrow u —w→ v (topic 23) and plain arrows,
    # before the table below strips \right
    t = re.sub(r"\s*\\xrightarrow\{([^{}]*)\}\s*", r" —\1→ ", t)
    t = re.sub(r"\s*\\(?:long)?rightarrow\s*", " → ", t)
    t = re.sub(r"\\text\{([^{}]*)\}", r"\1", t)
    t = re.sub(r"\\math(?:rm|bf|it|op)\{([^{}]*)\}", r"\1", t)
    for a, b in LONG:
        t = t.replace(a, b)
    t = re.sub(r"\\operatorname\{([^{}]*)\}", r"\1", t)
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
        (r"\{", "\x01"),  # escaped braces of a set survive the brace stripping below
        (r"\}", "\x02"),
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
    t = re.sub(r"\\frac\s*(\w)\s*\{([^{}]*)\}", r"\1/\2", t)
    t = re.sub(r"\\frac\{([^{}]*)\}\s*(\w)", r"(\1)/\2", t)
    t = re.sub(r"\\frac\s*(\w)\s*(\w)", r"\1/\2", t)
    t = re.sub(r"\\sqrt\{([^{}]*)\}", r"√\1", t)
    t = re.sub(r"\\sqrt\s*(\w+)", r"√\1", t)
    t = re.sub(r"\^\{([0-9+\-ni]+)\}", lambda m: m.group(1).translate(SUP), t)
    t = re.sub(r"\^([0-9n])", lambda m: m.group(1).translate(SUP), t)
    t = re.sub(r"_\{?([0-9ik])\}?", lambda m: m.group(1).translate(SUB), t)
    t = re.sub(r"\{,\}", ",", t)
    t = t.replace("{", "").replace("}", "") if "\\" not in t else t
    t = re.sub(r"([⌊⌈])\s+", r"\1", t)
    t = t.replace("\x01", "{").replace("\x02", "}")
    return re.sub(r"\s+", " ", t).strip()


def _display(m):
    body = m.group(1)
    plain = body.replace("\\_", "_")
    # Markdown-escaped brackets of code (dp\[6\], dp\[next\_x\]): short, one
    # line, no LaTeX command and no equation — keep them as plain brackets
    if "\\" not in plain and "\n" not in plain and "=" not in plain and len(plain) <= 25:
        return "[" + plain + "]"
    return "\n" + conv(body) + "\n"


def _dollars(s):
    """$$…$$ and $…$ formulas outside code blocks (topic 15 writes LaTeX so)."""
    parts = re.split(r"(^```.*?^```)", s, flags=re.S | re.M)
    for i in range(0, len(parts), 2):
        t = re.sub(r"\$\$(.*?)\$\$", lambda m: "\n" + conv(m.group(1)) + "\n", parts[i], flags=re.S)
        parts[i] = re.sub(r"\$([^$\n]+?)\$", lambda m: conv(m.group(1)), t)
    return "".join(parts)


def convert(s):
    s = re.sub(r"\\\[(.*?)\\\]", _display, s, flags=re.S)
    s = re.sub(r"\\\((.*?)\\\)", lambda m: conv(m.group(1)), s, flags=re.S)
    s = _dollars(s)
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
