"""Topic 22 bank tasks for the site lesson (Change 190, pipeline stage 9).

Usage (from the repository root, after ``node scripts/practice-registry.mjs``
and ``uv run --no-project --with openpyxl python -I content/lesson-design/topic-22/datasets.py --write``):

    python3 -I content/lesson-design/topic-22/bank.py          # check only
    python3 -I content/lesson-design/topic-22/bank.py --write  # update the bank
    python3 -I content/lesson-design/topic-22/bank.py --checkpoints  # and site.checkpoints

The rules are those of ``scripts/lesson_design/topic_bank.py``. The topic is
solved in a spreadsheet and its lesson has no Python, so a task gives its
``answer`` from the stand's own solver: the early schedule of
``process_figures.schedule`` for the systems of the text, ``datasets.py`` for the
books (attached to the task, with the spreadsheet formulas of the solution).
``apps/api/tests/test_task_22_bank.py`` recomputes every answer independently.
"""

import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1].parent / "scripts" / "lesson_design"))
# figures registers the builders first: process_figures imports it back
import figures as _builders  # noqa: E402, F401
from process_figures import schedule  # noqa: E402
from topic_bank import NUMBER, TWO, main  # noqa: E402

_spec = importlib.util.spec_from_file_location("datasets22", HERE / "datasets.py")
assert _spec and _spec.loader
ds = importlib.util.module_from_spec(_spec)
sys.modules["datasets22"] = ds
_spec.loader.exec_module(ds)

# the main example of subtopic 2, the four processes of subtopic 6, the exam system
MAIN = [
    (1, 4, ()),
    (2, 6, ()),
    (3, 3, (1,)),
    (4, 2, (1, 2)),
    (5, 5, (2,)),
    (6, 4, (3, 4)),
    (7, 2, (4, 5)),
    (8, 1, (6, 7)),
]
FOUR = [(1, 4, ()), (2, 4, ()), (3, 2, (2,)), (4, 4, (2,))]
EXAM = [
    (1, 3, ()),
    (2, 8, ()),
    (3, 2, (1,)),
    (4, 5, (1, 3)),
    (5, 4, (2, 4)),
    (6, 6, (3,)),
    (7, 1, (5, 6)),
]
IDS = "Введите номера процессов через пробел в порядке возрастания."


def total(procs, starts=None) -> int:
    return max(f for _, f in schedule(procs, starts).values())


def changed(procs, i: int, d: int):
    return [(j, d if j == i else dj, deps) for j, dj, deps in procs]


def working(procs, t: int) -> list[int]:
    return [i for i, (s, f) in schedule(procs).items() if s <= t < f]


def counts(procs) -> list[int]:
    return [len(working(procs, t)) for t in range(total(procs))]


def longest(values: list[int], ok) -> int:
    best = run = 0
    for v in values:
        run = run + 1 if ok(v) else 0
        best = max(best, run)
    return best


def overlap(a, b) -> int:
    return max(0, min(a[1], b[1]) - max(a[0], b[0]))


def late_starts(procs) -> dict[int, int]:
    """The backward pass of subtopic 6: latest starts that keep the total."""
    end = total(procs)
    dur = {i: d for i, d, _ in procs}
    takers = {i: [j for j, _, deps in procs if i in deps] for i in dur}
    late: dict[int, int] = {}
    for i in sorted(dur, reverse=True):
        late[i] = min((late[j] for j in takers[i]), default=end) - dur[i]
    return late


def limited(procs, places: int, exclusive=()) -> int:
    """Places for at most ``places`` processes; the smaller ID among the ready ones first."""
    dur = {i: d for i, d, _ in procs}
    deps = {i: set(p) for i, _, p in procs}
    done: dict[int, int] = {}
    running: dict[int, int] = {}
    t = 0
    while len(done) < len(dur):
        for i, f in list(running.items()):
            if f <= t:
                done[i] = f
                del running[i]
        ready = sorted(
            i for i in dur if i not in done and i not in running and deps[i] <= set(done)
        )
        for i in ready:
            clash = any(i in pair and (set(pair) - {i}) & set(running) for pair in exclusive)
            if len(running) < places and not clash:
                running[i] = t + dur[i]
        t = min(running.values()) if running else t + 1
    return max(done.values())


def delayed(procs, delay: int) -> dict[int, tuple[int, int]]:
    out: dict[int, tuple[int, int]] = {}
    for i, d, deps in procs:
        s = max((out[j][1] + delay for j in deps), default=0)
        out[i] = (s, s + d)
    return out


def events(procs) -> list[int]:
    return sorted({t for s, f in schedule(procs).values() for t in (s, f)})


def book(name: str) -> tuple[str, str]:
    return (f"{name}.xlsx", "Процессы — Excel-файл, как на экзамене")


SPLIT = "C: разделить по «;» на C, D, E, пустые — 0\nСтрока 2 — процесс 0 со временем 0"
EARLY = (
    SPLIT
    + "\nF3: =МАКС(ВПР(C3;$A$2:$G2;7;0);ВПР(D3;$A$2:$G2;7;0);\n"
    + "          ВПР(E3;$A$2:$G2;7;0))\nG3: =F3+B3 — обе формулы протянуть вниз"
)


def task(at, section, title, difficulty, minutes, hint, answer, instruction=NUMBER, **extra):
    spec = dict(at=at, title=title, difficulty=difficulty, minutes=minutes)
    spec.update(instruction=instruction, hint=hint, answer=answer, **extra)
    if section:
        spec["section"] = section
    return spec


S = schedule(MAIN)
LATE = late_starts(MAIN)
C3 = changed(FOUR, 3, 3)

TASKS = [
    # ------------------------------------------------------------ subtopic 1
    task(
        (1, 1),
        "dlitelnost-nachalo-okonchanie",
        "Окончание процесса",
        1,
        1,
        "Окончание — начало плюс длительность.",
        12 + 7,
    ),
    task(
        (1, 2),
        "dlitelnost-nachalo-okonchanie",
        "Начало процесса",
        1,
        1,
        "Начало — окончание минус длительность.",
        30 - 8,
    ),
    task(
        (1, 3),
        "process",
        "Два независимых процесса",
        1,
        1,
        "Параллельно — максимум окончаний.",
        total([(1, 5, ()), (2, 9, ())]),
    ),
    task(
        (1, 4),
        "process",
        "Процесс ждёт результат",
        1,
        1,
        "Последовательно — сумма.",
        total([(1, 5, ()), (2, 9, (1,))]),
    ),
    task(
        (1, 7),
        "tablica-processov",
        "Три процесса",
        1,
        2,
        "Процесс 3 ждёт оба результата.",
        total([(1, 5, ()), (2, 3, ()), (3, 4, (1, 2))]),
    ),
    # ------------------------------------------------------------ subtopic 2
    task(
        (2, 1),
        "poslednij-postavshchik",
        "Процесс ждёт двух поставщиков",
        1,
        1,
        "Начало — максимум окончаний.",
        total([(1, 8, ()), (2, 5, ()), (3, 3, (1, 2))]),
    ),
    task(
        (2, 2),
        "nachalo-i-okonchanie",
        "Поставщик запускается позже",
        1,
        1,
        "Окончание поставщика — момент на общей шкале.",
        total([(1, 2, ()), (2, 4, (1,))], {1: 10, 2: 12}),
    ),
    task(
        (2, 3),
        "raschet-tablicy",
        "Начало процесса 3 и общее время",
        1,
        2,
        "Сначала поставщики, потом получатели.",
        (lambda p: f"{schedule(p)[3][0]} {total(p)}")(
            [(1, 4, ()), (2, 7, ()), (3, 2, (1, 2)), (4, 3, (3,))]
        ),
        TWO,
    ),
    task(
        (2, 4),
        "pereputannye-stroki",
        "Перепутанные строки",
        2,
        3,
        "Порядок расчёта — по готовности поставщиков.",
        (lambda p: f"{schedule(p)[50][0]} {total(p)}")(
            [(20, 3, (10,)), (40, 4, (20,)), (10, 5, ()), (30, 8, ()), (50, 2, (30, 40))]
        ),
        TWO,
    ),
    task(
        (2, 5),
        "kriticheskij-put",
        "Удлинение процессов 5 и 3",
        2,
        3,
        "Влияет только удлинение на критическом пути.",
        f"{total(changed(MAIN, 5, 6))} {total(changed(MAIN, 3, 5))}",
        TWO,
    ),
    task(
        (2, 7),
        "raschet-tablicy",
        "Общее время системы из семи процессов",
        2,
        3,
        "Таблица начал и окончаний.",
        total(EXAM),
    ),
    # ------------------------------------------------------------ subtopic 3
    task(
        (3, 1),
        "funkciya-vpr",
        "Результат ВПР",
        1,
        1,
        "Точный поиск в первом столбце.",
        {10: 5, 20: 8, 30: 12}[30],
    ),
    task(
        (3, 7),
        "postavshchiki-po-yachejkam",
        "Общее время по файлу 22-1",
        2,
        6,
        "Разделите поставщиков по столбцам и найдите их окончания через ВПР.",
        ds.task_1(),
        files=[book("22-1")],
        excel=EARLY + "\nОтвет: =МАКС(G3:G20)",
    ),
    # ------------------------------------------------------------ subtopic 4
    task(
        (4, 2),
        "process-rabotaet",
        "Работают в момент 4",
        1,
        2,
        "Работает на [s; f).",
        len(working(MAIN, 4)),
    ),
    task(
        (4, 3),
        "zavershivshiesya-i-nachavshiesya",
        "Завершены к моменту 11",
        1,
        2,
        "Окончание не позже 11.",
        sum(f <= 11 for _, f in S.values()),
    ),
    task(
        (4, 4),
        "k-e-okonchanie",
        "Хотя бы шесть процессов",
        1,
        2,
        "Шестое по величине окончание.",
        sorted(f for _, f in S.values())[5],
    ),
    task(
        (4, 5),
        "vnutri-okna",
        "Внутри окна [4; 12]",
        2,
        3,
        "Два условия: начало не раньше 4, окончание не позже 12.",
        (lambda ids: f"{len(ids)} {sum(ids)}")(
            [i for i, (s, f) in S.items() if s >= 4 and f <= 12]
        ),
        "Введите количество процессов и сумму их ID через пробел.",
    ),
    task(
        (4, 6),
        "moment-i-millisekunda",
        "Двенадцатая миллисекунда",
        1,
        2,
        "12-я миллисекунда — [11; 12).",
        len(working(MAIN, 11)),
    ),
    task(
        (4, 7),
        "moment-i-millisekunda",
        "Десятая миллисекунда",
        2,
        3,
        "10-я миллисекунда — [9; 10).",
        len(working(EXAM, 9)),
    ),
    task(
        (4, 8),
        "k-e-okonchanie",
        "Пять завершённых процессов",
        2,
        3,
        "Пятое по величине окончание.",
        sorted(f for _, f in schedule(EXAM).values())[4],
    ),
    # ------------------------------------------------------------ subtopic 5
    task(
        (5, 1),
        "samyj-dlinnyj-otrezok",
        "Сумма и самый длинный отрезок",
        1,
        2,
        "Самый длинный отрезок — не сумма.",
        f"{(6 - 2) + (12 - 9)} {max(6 - 2, 12 - 9)}",
        TWO,
    ),
    task(
        (5, 2),
        "vmeste-s-processom",
        "Общий участок двух процессов",
        1,
        1,
        "Пересечение промежутков.",
        overlap((1, 8), (5, 10)),
    ),
    task(
        (5, 3),
        "pik-parallelnosti",
        "Время, пик, отрезок, момент 7",
        2,
        4,
        "Постройте строку чисел работающих процессов.",
        (lambda c: f"{len(c)} {max(c)} {longest(c, lambda v: v == max(c))} {c[7]}")(counts(MAIN)),
        "Введите четыре числа через пробел в порядке вопроса.",
    ),
    task(
        (5, 4),
        "samyj-dlinnyj-otrezok",
        "Не более одного процесса",
        2,
        3,
        "Отрезок в конце расписания.",
        longest(counts(MAIN), lambda v: v <= 1),
    ),
    task(
        (5, 5),
        "vmeste-s-processom",
        "Вместе с процессом 6",
        2,
        3,
        "Считайте только на промежутке процесса 6.",
        max(len(working(MAIN, t)) - 1 for t in range(*S[6])),
    ),
    task(
        (5, 6),
        "vmeste-s-processom",
        "Процессы 3 и 4 вместе",
        1,
        2,
        "Пересечение их промежутков.",
        overlap(S[3], S[4]),
    ),
    task(
        (5, 7),
        "pik-parallelnosti",
        "Пик и его длительность",
        2,
        4,
        "Сетка по миллисекундам.",
        (lambda c: f"{max(c)} {longest(c, lambda v: v == max(c))}")(counts(EXAM)),
        TWO,
    ),
    # ------------------------------------------------------------ subtopic 6
    task(
        (6, 1),
        "pozdnie-nachala",
        "Позднее начало и запас",
        2,
        3,
        "Позднее начало — позднее окончание минус длительность.",
        (lambda late: f"{late[1]} {late[2] - schedule(FOUR)[2][0]}")(late_starts(FOUR)),
        "Введите позднее начало процесса 1 и запас процесса 2 через пробел.",
        says=["Позднее начало процесса 1 — 4", "у процесса 2 запаса нет"],
    ),
    task(
        (6, 2),
        "pozdnie-nachala",
        "Позднее начало 4 и запас 1",
        2,
        3,
        "Обратный проход от общего времени.",
        f"{LATE[4]} {LATE[1] - S[1][0]}",
        TWO,
    ),
    task(
        (6, 3),
        "pozdnie-nachala",
        "Процессы без запаса",
        2,
        3,
        "Запас — позднее начало минус раннее.",
        " ".join(str(i) for i in sorted(S) if LATE[i] == S[i][0]),
        IDS,
    ),
    task(
        (6, 4),
        "ne-ranshe-poroga",
        "Не раньше 10 мс",
        2,
        3,
        "Сравнивайте поздние начала с порогом.",
        sum(v >= 10 for v in LATE.values()),
    ),
    task(
        (6, 5),
        "proverka-sdviga",
        "Три процесса вместе после сдвига",
        3,
        4,
        "Переберите допустимые сдвиги.",
        max(
            sum(sum(st[i] <= t < st[i] + d for i, d, _ in C3) >= 3 for t in range(8))
            for st in ({1: a, 2: 0, 3: 4 + b, 4: 4} for a in range(5) for b in range(2))
            if total(C3, st) <= 8
        ),
    ),
    task(
        (6, 7),
        "ne-ranshe-poroga",
        "Не раньше 6 мс",
        2,
        4,
        "Поздние начала системы.",
        sum(v >= 6 for v in late_starts(EXAM).values()),
    ),
    # ------------------------------------------------------------ subtopic 7
    task(
        (7, 2),
        "zaderzhka-peredachi",
        "Задержка 2 мс",
        2,
        3,
        "Начало = максимум (окончание + задержка).",
        (lambda d: f"{d[4][0]} {max(f for _, f in d.values())}")(
            delayed([(1, 3, ()), (2, 5, ()), (3, 4, (1, 2)), (4, 2, (3,))], 2)
        ),
        TWO,
    ),
    task(
        (7, 3),
        "neizvestnaya-dlitelnost",
        "Неизвестная длительность процесса 6",
        2,
        4,
        "Общее время — максимум ветвей.",
        f"{next(x for x in range(1, 30) if total(changed(MAIN, 6, x)) == 16)} "
        f"{max(x for x in range(1, 30) if total(changed(MAIN, 6, x)) == 14)}",
        TWO,
    ),
    task(
        (7, 4),
        "zaderzhka-peredachi",
        "Две задержки",
        1,
        2,
        "Максимум по всем связям.",
        max(6 + 4, 8 + 1),
    ),
    task(
        (7, 5),
        "sobytiya-vmesto-setki",
        "Промежутки между событиями",
        2,
        3,
        "События — все начала и окончания.",
        len(events(EXAM)) - 1,
    ),
    task(
        (7, 6),
        "sobytiya-vmesto-setki",
        "Ровно два процесса",
        2,
        4,
        "Серия растёт на длину промежутка.",
        longest(counts(EXAM), lambda v: v == 2),
    ),
    # ------------------------------------------------------------ subtopic 8
    task(
        (8, 1),
        "gotov-i-zapushchen",
        "Два места, меньший ID",
        2,
        4,
        "Готов — ещё не значит запущен.",
        limited([(1, 4, ()), (2, 4, ()), (3, 3, ()), (4, 2, (1,)), (5, 1, (2, 3))], 2),
    ),
    task(
        (8, 3),
        "vzaimnoe-isklyuchenie",
        "Процессы 4 и 5 не вместе",
        2,
        4,
        "Первым идёт меньший ID.",
        limited(MAIN, len(MAIN), exclusive=((4, 5),)),
    ),
    task(
        (8, 5),
        "pravilo-vybora",
        "Два места, пять процессов",
        2,
        4,
        "Освободить, выбрать, запустить.",
        limited([(1, 3, ()), (2, 2, ()), (3, 4, ()), (4, 1, (1, 2)), (5, 2, (3,))], 2),
    ),
    task(
        (8, 6),
        "pravilo-vybora",
        "Без ограничения мест",
        2,
        3,
        "Сравните с ограниченным расписанием.",
        (lambda p: f"{total(p)} {limited(p, 2) - total(p)}")(
            [(1, 3, ()), (2, 2, ()), (3, 4, ()), (4, 1, (1, 2)), (5, 2, (3,))]
        ),
        TWO,
    ),
    # ---------------------------------------------------- «Практика и итог»
    task(
        (9, 1),
        None,
        "Общее время по файлу 22-6",
        2,
        6,
        "Подтемы 2 и 3.",
        ds.task_6(),
        files=[book("22-6")],
        excel=EARLY + "\nОтвет: =МАКС(G3:G32)",
    ),
    task(
        (9, 2),
        None,
        "21-я миллисекунда по файлу 22-2",
        2,
        6,
        "Подтема 4.",
        ds.task_2(),
        files=[book("22-2")],
        excel=EARLY + '\nОтвет: =СЧЁТЕСЛИМН(F3:F22;"<=20";G3:G22;">20")',
    ),
    task(
        (9, 3),
        None,
        "Десять процессов по файлу 22-4",
        2,
        6,
        "Подтема 4.",
        ds.task_4(),
        files=[book("22-4")],
        excel=EARLY + "\nОтвет: =НАИМЕНЬШИЙ(G3:G22;10)",
    ),
    task(
        (9, 4),
        None,
        "Пик параллельности по файлу 22-3",
        3,
        8,
        "Подтема 5.",
        ds.task_3()[1],
        files=[book("22-3")],
        excel=EARLY
        + "\nI1, J1, …: моменты 0, 1, 2, …"
        + "\nI3: =ЕСЛИ(И($F3<=I$1;I$1<$G3);1;0) — протянуть"
        + "\nI19: =СУММ(I3:I18) — работающих в [t; t + 1)"
        + "\nОтвет: самая длинная серия столбцов с =МАКС(19:19)",
    ),
    task(
        (9, 5),
        None,
        "Не раньше 20 мс по файлу 22-5",
        3,
        8,
        "Подтема 6.",
        ds.task_5(),
        files=[book("22-5")],
        excel=EARLY
        + "\nH: позднее окончание — МИН поздних начал получателей,"
        + "\n   у процесса без получателей — общее время =МАКС(G3:G20)"
        + "\nI3: =H3-B3 — позднее начало"
        + '\nОтвет: =СЧЁТЕСЛИ(I3:I20;">=20")',
    ),
]


if __name__ == "__main__":
    sys.exit(main(HERE, 22, TASKS))
