"""Topic 19–21 bank tasks for the site lesson (Change 184, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``):

    python3 -I content/lesson-design/topic-19/bank.py          # check only
    python3 -I content/lesson-design/topic-19/bank.py --write  # update the bank

The rules are those of ``scripts/lesson_design/topic_bank.py``. Every program is
the lesson's: the rules of the game as ``moves`` and ``finished`` and the
recursion ``f(p, m)`` of subtopic 6 (or ``win`` for a game played to the end,
subtopic 7). ``apps/api/tests/test_task_19_bank.py`` recomputes every answer
independently.
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
from topic_bank import NUMBER, main  # noqa: E402

JOINED = "Введите два числа подряд, без пробела, в порядке возрастания."
SPACED = "Введите два числа через пробел: наименьшее, затем наибольшее."

F = """

@cache
def f(p, m):
    if finished(p):
        return m % 2 == 0
    if m == 0:
        return False
    results = [f(q, m - 1) for q in moves(p)]
    if m % 2 == 1:
        return any(results)
    return all(results)


"""


def game(moves: str, finished: str, question: str, pair: bool = False) -> str:
    """The lesson's program: the rules, the recursion and the question."""
    arg = "p" if pair else "s"
    head = "    a, b = p\n" if pair else ""
    return (
        "from functools import cache\n\n\n"
        f"def moves({arg}):\n{head}    return {moves}\n\n\n"
        f"def finished({arg}):\n{head}    return {finished}\n" + F + question
    )


MISTAKE = """def mistake(p):
    return any(not finished(q) and f(q, 1) for q in moves(p))


"""

# (page, number in the page) -> task definition; page 8 is «Практика и итог».
TASKS = [
    # ------------------------------------------------------------ subtopic 1
    dict(
        at=(1, 6),
        section="neudachnyj-hod",
        title="+1 или ×3, неудачный ход Пети",
        difficulty=1,
        minutes=3,
        instruction=NUMBER,
        hint="Ваня выигрывает после неудачного хода: проверьте два сильнейших хода подряд.",
        code=game(
            "[s + 1, s * 3]",
            "s >= 40",
            MISTAKE + "print(min(s for s in range(1, 40) if mistake(s)))",
        ),
    ),
    dict(
        at=(1, 7),
        section="neudachnyj-hod",
        title="+7 или ×2, неудачный ход Пети",
        difficulty=2,
        minutes=3,
        instruction=NUMBER,
        hint="Проверьте все пары ходов, а не только два удвоения.",
        code=game(
            "[s + 7, s * 2]",
            "s >= 40",
            MISTAKE + "print(min(s for s in range(1, 40) if mistake(s)))",
        ),
    ),
    dict(
        at=(1, 8),
        section="neudachnyj-hod",
        title="+1, +4 или ×4",
        difficulty=1,
        minutes=4,
        instruction=NUMBER,
        hint="Два умножения на 4 подряд — самый быстрый рост.",
        code=game(
            "[s + 1, s + 4, s * 4]",
            "s >= 90",
            MISTAKE + "print(min(s for s in range(1, 90) if mistake(s)))",
        ),
    ),
    # ------------------------------------------------------------ subtopic 2
    dict(
        at=(2, 7),
        section="poziciya-l1",
        title="Задание 19: все ходы в W1",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Нужна позиция L1: Петя не выигрывает сразу, а каждый его ход отдаёт Ване W1.",
        code=game(
            "[s + 1, s + 2, s * 3]",
            "s >= 60",
            "print(*[s for s in range(1, 60)\n        if not f(s, 1) and f(s, 2)])",
        ),
    ),
    dict(
        at=(2, 8),
        section="poziciya-w2",
        title="Задание 20: позиции W2",
        difficulty=2,
        minutes=5,
        instruction=JOINED,
        hint="W2: нельзя выиграть сразу, но можно отдать сопернику L1.",
        code=game(
            "[s + 1, s + 2, s * 3]",
            "s >= 60",
            "print(*[s for s in range(1, 60)\n        if not f(s, 1) and f(s, 3)], sep='')",
        ),
    ),
    dict(
        at=(2, 9),
        section="poziciya-l2",
        title="Задание 21: позиция L2",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="L2: Ваня гарантирует победу не позднее второго хода, но не первым.",
        code=game(
            "[s + 1, s + 2, s * 3]",
            "s >= 60",
            "print(min(s for s in range(1, 60)\n          if not f(s, 2) and f(s, 4)))",
        ),
    ),
    # ------------------------------------------------------------ subtopic 3
    dict(
        at=(3, 4),
        section="forma-otveta",
        title="Форма ответа задания 20",
        difficulty=2,
        minutes=4,
        instruction="Введите четыре числа через пробел: количество, сумму, наименьшее и наибольшее значения.",
        hint="Сначала соберите все значения, затем возьмите из списка то, что спрашивают.",
        code=game(
            "[s + 2, s + 3, s * 2]",
            "s >= 50",
            "found = [s for s in range(1, 50)\n"
            "         if not f(s, 1) and f(s, 3)]\n"
            "print(len(found), sum(found), min(found), max(found))",
        ),
    ),
    dict(
        at=(3, 6),
        section="chetyre-proverki",
        title="+1, +3 или ×3 до 200",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Позиция L1: каждый ход Пети отдаёт Ване W1.",
        code=game(
            "[s + 1, s + 3, s * 3]",
            "s >= 200",
            "print(*[s for s in range(1, 200)\n        if not f(s, 1) and f(s, 2)])",
        ),
    ),
    dict(
        at=(3, 7),
        section="forma-otveta",
        title="Два наименьших значения",
        difficulty=2,
        minutes=5,
        instruction=JOINED,
        hint="Значений больше двух — возьмите два наименьших.",
        code=game(
            "[s + 1, s + 3, s * 3]",
            "s >= 200",
            "found = [s for s in range(1, 200)\n"
            "         if not f(s, 1) and f(s, 3)]\n"
            "print(*found[:2], sep='')",
        ),
    ),
    dict(
        at=(3, 8),
        section="poisk-znachenij",
        title="Количество значений L2",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Посчитайте позиции L2 во всём диапазоне.",
        code=game(
            "[s + 2, s + 5, s * 2]",
            "s >= 301",
            "print(len([s for s in range(1, 301)\n           if not f(s, 2) and f(s, 4)]))",
        ),
    ),
    # ------------------------------------------------------------ subtopic 4
    dict(
        at=(4, 6),
        section="neudachnyj-hod-kuchi",
        title="Две кучи: неудачный ход Пети",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Два удвоения большей кучи подряд — самый быстрый рост суммы.",
        code=game(
            "[(a + 3, b), (a * 2, b), (a, b + 3), (a, b * 2)]",
            "a + b >= 120",
            MISTAKE + "print(min(s for s in range(1, 111) if mistake((9, s))))",
            pair=True,
        ),
    ),
    dict(
        at=(4, 7),
        section="perebor-3-s",
        title="Две кучи: задание 20",
        difficulty=2,
        minutes=5,
        instruction=JOINED,
        hint="Перебирайте начальные позиции (9, S) теми же функциями.",
        code=game(
            "[(a + 3, b), (a * 2, b), (a, b + 3), (a, b * 2)]",
            "a + b >= 120",
            "found = [s for s in range(1, 111)\n"
            "         if not f((9, s), 1) and f((9, s), 3)]\n"
            "print(*found[:2], sep='')",
            pair=True,
        ),
    ),
    dict(
        at=(4, 8),
        section="perebor-3-s",
        title="Две кучи: задание 21",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="L2 для начальной позиции (9, S).",
        code=game(
            "[(a + 3, b), (a * 2, b), (a, b + 3), (a, b * 2)]",
            "a + b >= 120",
            "print(min(s for s in range(1, 111)\n          if not f((9, s), 2) and f((9, s), 4)))",
            pair=True,
        ),
    ),
    # ------------------------------------------------------------ subtopic 5
    dict(
        at=(5, 1),
        section="granica-deleniya",
        title="Граница деления",
        difficulty=1,
        minutes=1,
        instruction=NUMBER,
        hint="Найдите последнее число, которое после деления ещё не больше 12.",
        code="print(max(s for s in range(1, 100) if s // 3 <= 12))",
    ),
    dict(
        at=(5, 5),
        section="naimenshee-i-naibolshee",
        title="Наибольшее S после неудачного хода",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Два деления подряд дают S // 16 — оттуда граница перебора.",
        code=game(
            "[s - 3, s // 4]",
            "s <= 20",
            MISTAKE + "print(max(s for s in range(21, 1000) if mistake(s)))",
        ),
    ),
    dict(
        at=(5, 7),
        section="umenshenie-kuchi",
        title="Уменьшение кучи: задание 19",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="W1 — до 92: 92 // 3 = 30.",
        code=game(
            "[s - 2, s - 5, s // 3]",
            "s <= 30",
            "print(min(s for s in range(31, 1000)\n          if not f(s, 1) and f(s, 2)))",
        ),
    ),
    dict(
        at=(5, 8),
        section="blizhajshie-gruppy",
        title="Уменьшение кучи: задание 20",
        difficulty=2,
        minutes=5,
        instruction=JOINED,
        hint="W2: ход в позицию L1.",
        code=game(
            "[s - 2, s - 5, s // 3]",
            "s <= 30",
            "found = [s for s in range(31, 1000)\n"
            "         if not f(s, 1) and f(s, 3)]\n"
            "print(*found[:2], sep='')",
        ),
    ),
    dict(
        at=(5, 9),
        section="blizhajshie-gruppy",
        title="Уменьшение кучи: задание 21",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="L2: все ходы отдают W1 или W2, но не все — W1.",
        code=game(
            "[s - 2, s - 5, s // 3]",
            "s <= 30",
            "print(min(s for s in range(31, 1000)\n          if not f(s, 2) and f(s, 4)))",
        ),
    ),
    dict(
        at=(5, 10),
        section="naimenshee-i-naibolshee",
        title="Наибольшее S при неудачном ходе",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Два деления подряд: S // 9 ≤ 30.",
        code=game(
            "[s - 2, s - 5, s // 3]",
            "s <= 30",
            MISTAKE + "print(max(s for s in range(31, 1000) if mistake(s)))",
        ),
    ),
    # ------------------------------------------------------------ subtopic 6
    dict(
        at=(6, 7),
        section="tretij-hod",
        title="Победа третьим ходом",
        difficulty=3,
        minutes=6,
        instruction=JOINED,
        hint="«Не за один и не за два хода, но третьим» — not f(p, 3) and f(p, 5).",
        code=game(
            "[(a + 2, b), (a * 2, b), (a, b + 2), (a, b * 2)]",
            "a + b >= 100",
            "found = [s for s in range(1, 90)\n"
            "         if not f((10, s), 3) and f((10, s), 5)]\n"
            "print(*found[:2], sep='')",
            pair=True,
        ),
    ),
    dict(
        at=(6, 8),
        section="tretij-hod",
        title="Ваня: вторым или третьим ходом",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Вторым или третьим, но не гарантированно вторым: not f(p, 4) and f(p, 6).",
        code=game(
            "[(a + 2, b), (a * 2, b), (a, b + 2), (a, b * 2)]",
            "a + b >= 100",
            "print(min(s for s in range(1, 90)\n          if not f((10, s), 4) and f((10, s), 6)))",
            pair=True,
        ),
    ),
    # ------------------------------------------------------------ subtopic 7
    dict(
        at=(7, 3),
        section="do-konca",
        title="Взять 1, 2 или 3 камня",
        difficulty=2,
        minutes=3,
        instruction="Введите значения S через пробел в порядке возрастания.",
        hint="Игра до конца: позиция проигрышна, если любой ход отдаёт выигрышную.",
        code="""from functools import cache


@cache
def win(s):
    return any(s - k == 0 or not win(s - k)
               for k in (1, 2, 3) if k <= s)


print(*[s for s in range(1, 15) if not win(s)])""",
    ),
    dict(
        at=(7, 4),
        section="vse-pozicii",
        title="Наименьшая сумма для победы сразу",
        difficulty=2,
        minutes=4,
        instruction=NUMBER,
        hint="Перебирайте пары куч, а не начальное S.",
        code="""def moves(p):
    a, b = p
    return [(a + 1, b), (a * 3, b), (a, b + 1), (a, b * 3)]


def finished(p):
    return p[0] + p[1] >= 50


best = None
for a in range(1, 50):
    for b in range(1, 50):
        p = (a, b)
        wins = any(finished(q) for q in moves(p))
        if not finished(p) and wins:
            if best is None or a + b < best:
                best = a + b
print(best)""",
    ),
    dict(
        at=(7, 5),
        section="sostoyanie-shire",
        title="Нельзя повторить ход: задание 19",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Позиция — пара: число камней и последний ход.",
        code="""from functools import cache


def moves(p):
    s, last = p
    result = []
    if last != '+1':
        result.append((s + 1, '+1'))
    if last != '+2':
        result.append((s + 2, '+2'))
    if last != '×2':
        result.append((s * 2, '×2'))
    return result


def finished(p):
    return p[0] >= 30
"""
        + F
        + """starts = [(s, '') for s in range(1, 30)]
print(*[p[0] for p in starts if not f(p, 1) and f(p, 2)])""",
    ),
    dict(
        at=(7, 6),
        section="sostoyanie-shire",
        title="Нельзя повторить ход: задание 20",
        difficulty=3,
        minutes=6,
        instruction=SPACED,
        hint="Та же позиция-пара, проверка W2.",
        code="""from functools import cache


def moves(p):
    s, last = p
    result = []
    if last != '+1':
        result.append((s + 1, '+1'))
    if last != '+2':
        result.append((s + 2, '+2'))
    if last != '×2':
        result.append((s * 2, '×2'))
    return result


def finished(p):
    return p[0] >= 30
"""
        + F
        + """found = [s for s in range(1, 30)
         if not f((s, ''), 1) and f((s, ''), 3)]
print(min(found), max(found))""",
    ),
    dict(
        at=(7, 7),
        section="do-konca",
        title="Стратегия Вани без ограничения ходов",
        difficulty=3,
        minutes=6,
        instruction=NUMBER,
        hint="Игра до конца: у Вани стратегия, если начальная позиция проигрышна для Пети.",
        code="""from functools import cache


def moves(p):
    a, b = p
    return [(a + 1, b), (a * 2, b), (a, b + 1), (a, b * 2)]


def finished(p):
    return p[0] + p[1] >= 60


@cache
def win(p):
    return any(finished(q) or not win(q) for q in moves(p))


print(max(s for s in range(1, 54) if not win((6, s))))""",
    ),
    # ---------------------------------------------------- Практика и итог
    dict(
        at=(8, 1),
        title="+2 или ×3: неудачный ход Пети",
        difficulty=1,
        minutes=4,
        instruction=NUMBER,
        hint="Два утроения подряд.",
        code=game(
            "[s + 2, s * 3]",
            "s >= 70",
            MISTAKE + "print(min(s for s in range(1, 70) if mistake(s)))",
        ),
    ),
    dict(
        at=(8, 2),
        title="Задание 20: наименьшее и наибольшее",
        difficulty=2,
        minutes=5,
        instruction=SPACED,
        hint="W2: not f(s, 1) and f(s, 3).",
        code=game(
            "[s + 1, s + 3, s * 2]",
            "s >= 45",
            "found = [s for s in range(1, 45)\n"
            "         if not f(s, 1) and f(s, 3)]\n"
            "print(min(found), max(found))",
        ),
    ),
    dict(
        at=(8, 3),
        title="Две кучи: задание 21",
        difficulty=2,
        minutes=6,
        instruction=NUMBER,
        hint="Начальная позиция (7, S), проверка L2.",
        code=game(
            "[(a + 2, b), (a * 2, b), (a, b + 2), (a, b * 2)]",
            "a + b >= 100",
            "print(min(s for s in range(1, 93)\n          if not f((7, s), 2) and f((7, s), 4)))",
            pair=True,
        ),
    ),
    dict(
        at=(8, 4),
        title="Уменьшение кучи: наибольшее S",
        difficulty=2,
        minutes=5,
        instruction=NUMBER,
        hint="Граница: самый медленный ход −3 должен вести в W1.",
        code=game(
            "[s - 3, s - 4, s // 2]",
            "s <= 40",
            "print(max(s for s in range(41, 1000)\n          if not f(s, 1) and f(s, 2)))",
        ),
    ),
    dict(
        at=(8, 5),
        title="Победа третьим ходом",
        difficulty=3,
        minutes=6,
        instruction=JOINED,
        hint="not f(s, 3) and f(s, 5).",
        code=game(
            "[s + 1, s + 4, s * 3]",
            "s >= 100",
            "found = [s for s in range(1, 100)\n"
            "         if not f(s, 3) and f(s, 5)]\n"
            "print(*found[:2], sep='')",
        ),
    ),
]

# The exam task each question trains: a mistake of Petya or L1 — 19, W2 — 20,
# L2 — 21; questions about the method train all three.
EXAMS = {
    19: [(1, 6), (1, 7), (1, 8), (2, 7), (3, 6), (4, 6), (5, 5), (5, 7), (5, 10), (7, 5)]
    + [(8, 1), (8, 4)],
    20: [(2, 8), (3, 4), (3, 7), (4, 7), (5, 8), (6, 7), (7, 6), (8, 2), (8, 5)],
    21: [(2, 9), (3, 8), (4, 8), (5, 9), (6, 8), (7, 7), (8, 3)],
}
for spec in TASKS:
    spec["exams"] = next(([n] for n, at in EXAMS.items() if spec["at"] in at), [19, 20, 21])

if __name__ == "__main__":
    sys.exit(main(HERE, 19, TASKS))
