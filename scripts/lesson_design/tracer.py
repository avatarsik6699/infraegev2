"""Step-by-step run of a short lesson program for the runnable code block.

The program really runs under ``sys.settrace``. Each step is the state right
after one line finished: the line, the variables of the program and of every
active function call, the lists, dictionaries and sets they refer to, what is
printed so far, and a plain-language explanation built from the code (``ast``)
and the recorded values. The page only shows these steps, so they can never
disagree with Python.
"""

import ast
import builtins
import contextlib
import io
import re
import sys
import types

FILE = "<lesson>"
PURE = {"len", "abs", "min", "max", "sum", "int", "str", "bool", "all", "any"}
MUTABLE = (list, dict, set)
MAX_STEPS = 30
GENERATOR = 0x20


def _value(v) -> str:
    # an imported built-in (from math import dist) or an imported class used as a
    # function (from itertools import product) is a function to the student too
    imported = isinstance(v, type) and v.__module__ != "__main__"
    if imported or isinstance(v, (types.FunctionType, types.BuiltinFunctionType)):
        return "функция"
    if isinstance(v, types.GeneratorType):
        return "генератор"
    text = repr(v)
    return text if len(text) <= 40 else text[:39] + "…"


def _src(node: ast.AST) -> str:
    return ast.unparse(node)


def _pure(node: ast.AST) -> bool:
    """An expression that can be evaluated again without side effects."""
    for sub in ast.walk(node):
        if isinstance(sub, ast.Call) and not (
            isinstance(sub.func, ast.Name) and sub.func.id in PURE
        ):
            return False
        if isinstance(sub, (ast.NamedExpr, ast.Await, ast.Yield, ast.YieldFrom)):
            return False
    return True


def _literal(node: ast.AST) -> bool:
    """5, "abc", [] or {}: a value written as is, nothing to compute."""
    if isinstance(node, ast.Constant):
        return True
    if isinstance(node, ast.UnaryOp) and isinstance(node.operand, ast.Constant):
        return True
    return isinstance(node, (ast.List, ast.Dict, ast.Tuple, ast.Set)) and all(
        isinstance(n, (ast.Constant, ast.List, ast.Dict, ast.Tuple, ast.Set, ast.Load))
        for n in ast.walk(node)
    )


def _printed(text: str) -> str:
    lines = text.rstrip("\n").split("\n")
    return "«" + "», «".join(lines) + "»"


AUG = {ast.Add: "увеличилось", ast.Sub: "уменьшилось", ast.Mult: "умножилось"}


class _Recorder:
    def __init__(self, code: str):
        self.code = code
        self.lines = code.splitlines()
        self.tree = ast.parse(code)
        self.stmts: dict[int, ast.AST] = {}
        for node in ast.walk(self.tree):
            if isinstance(node, (ast.stmt, ast.ExceptHandler)):
                self.stmts.setdefault(node.lineno, node)
        self.out = io.StringIO()
        self.steps: list[dict] = []
        self.pending: dict[int, int] = {}
        self.seen: set[int] = set()
        self.raising: set[int] = set()
        self.prev: dict[tuple[str, str], str] = {}
        self.prev_obj: dict[int, str] = {}
        self.objects: dict[int, int] = {}  # id(obj) -> number on the page
        self.keep: list = []  # keeps recorded objects alive: ids are not reused
        self.loops: set[tuple[int, int]] = set()
        self.titles: dict[int, str] = {}  # call title fixed at the moment of the call
        self.paused: dict[int, object] = {}  # generators waiting after yield
        self.failed = False

    # --- state -----------------------------------------------------------
    def chain(self, frame) -> list:
        frames, f = [], frame
        while f is not None:
            if f.f_code.co_filename == FILE:
                frames.append(f)
            f = f.f_back
        return frames[::-1]

    def ref(self, v) -> int | None:
        if not isinstance(v, MUTABLE):
            return None
        if id(v) not in self.objects:
            self.objects[id(v)] = len(self.objects)
            self.keep.append(v)
        return self.objects[id(v)]

    def state(self, frame) -> tuple[list[dict], dict[int, object]]:
        frames, used = [], {}
        chain = self.chain(frame)
        chain += [f for f in self.paused.values() if f not in chain]
        for f in chain:
            if f.f_code.co_name == "<module>":
                title, key = "программа", "<module>"
                items = [
                    (k, v)
                    for k, v in f.f_globals.items()
                    if not k.startswith("_") and not isinstance(v, types.ModuleType)
                ]
            else:
                title = self.titles.get(id(f), f"вызов {f.f_code.co_name}")
                if id(f) in self.paused:
                    title += " — на паузе"
                key = f.f_code.co_name
                items = list(f.f_locals.items())
            names = []
            for k, v in items:
                r = self.ref(v)
                if r is not None:
                    used[r] = v
                names.append({"n": k, "v": _value(v), "ref": r, "key": (key, k)})
            frames.append({"title": title, "names": names})
        return frames, used

    def changes(self, frame) -> list[tuple[str, str | None, str]]:
        frames, _ = self.state(frame)
        return [
            (item["n"], self.prev.get(item["key"]), item["v"])
            for f in frames
            for item in f["names"]
            if self.prev.get(item["key"]) != item["v"]
        ]

    def add(self, frame, line, text, kind="line", **extra):
        frames, used = self.state(frame)
        for f in frames:
            for item in f["names"]:
                key = item.pop("key")
                item["ch"] = self.prev.get(key) != item["v"]
                self.prev[key] = item["v"]
        objs = {}
        for k, v in sorted(used.items()):
            shown = _value(v)
            objs[str(k)] = {"v": shown, "ch": self.prev_obj.get(k) != shown}
            self.prev_obj[k] = shown
        self.steps.append(
            {
                "line": line,
                "text": text,
                "kind": kind,
                "frames": frames,
                "objs": objs,
                "out": self.out.getvalue(),
            }
            | extra
        )

    # --- explanations ------------------------------------------------------
    def evaluate(self, node, frame):
        if not _pure(node):
            return None
        try:
            return eval(compile(_src(node), FILE, "eval"), frame.f_globals, dict(frame.f_locals))  # noqa: S307
        except Exception:  # noqa: BLE001
            return None

    def explain(self, frame, line, nxt, printed) -> str:
        node = self.stmts.get(line)
        changed = self.changes(frame)
        said = ""
        if isinstance(node, ast.If):
            ok = self.evaluate(node.test, frame)
            test = f"Проверка `{_src(node.test)}` даёт `{ok}`"
            if ok:
                said = f"{test} — выполняется блок под этим условием."
            elif node.orelse:
                said = f"{test} — блок пропускается, дальше следующая проверка."
            else:
                said = f"{test} — блок пропускается."
        elif isinstance(node, ast.While):
            ok = self.evaluate(node.test, frame)
            test = f"Проверка `{_src(node.test)}` даёт `{ok}`"
            said = test + (
                " — тело цикла выполняется." if ok else " — цикл закончен, программа идёт дальше."
            )
        elif isinstance(node, ast.For):
            first, last = node.body[0].lineno, node.body[-1].end_lineno or line
            if nxt is not None and first <= nxt <= last:
                key = (id(frame), line)
                which = "следующее" if key in self.loops else "первое"
                self.loops.add(key)
                value = self.evaluate(node.target, frame)
                said = f"`for` берёт {which} значение: `{_src(node.target)}` = `{_value(value)}`."
            else:
                self.loops.discard((id(frame), line))
                said = "Значения закончились — цикл `for` завершён."
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            said = f"Создана функция `{node.name}`. Её тело выполнится, когда функцию вызовут."
        elif isinstance(node, ast.Break):
            said = "`break` прерывает цикл."
        elif isinstance(node, ast.Continue):
            said = "`continue`: остаток тела пропускается, цикл переходит к следующему шагу."
        elif isinstance(node, ast.ExceptHandler):
            said = "Ошибка перехвачена: выполняется блок `except`."
        elif isinstance(node, ast.Try):
            said = "Начинается блок `try`: если в нём возникнет ошибка, сработает `except`."
        elif isinstance(node, ast.Assign) and len(node.targets) == 1:
            target = node.targets[0]
            shown = _value(self.evaluate(target, frame))
            if isinstance(target, ast.Name):
                old = next((o for n, o, _ in changed if n == target.id), None)
                if _literal(node.value):
                    said = f"`{target.id}` получает значение `{shown}`."
                elif isinstance(node.value, ast.Name):
                    said = (
                        f"`{target.id}` получает то же, что `{node.value.id}`: "
                        f"теперь оба имени ведут к `{shown}`."
                    )
                else:
                    said = (
                        f"Python вычисляет `{_src(node.value)}` → `{shown}`, "
                        f"и `{target.id}` получает это значение."
                    )
                if old is not None:
                    said += f" Прежнее значение `{old}` больше не связано с `{target.id}`."
            elif isinstance(target, ast.Subscript):
                place = _src(target)
                if _pure(target.slice):
                    key = self.evaluate(target.slice, frame)
                    place = f"{_src(target.value)}[{_value(key)}]"
                said = (
                    f"Python вычисляет `{_src(node.value)}` → `{shown}` "
                    f"и записывает это в `{place}`."
                )
        elif isinstance(node, ast.AugAssign) and isinstance(node.target, ast.Name):
            name = node.target.id
            old = next((o for n, o, _ in changed if n == name), None)
            new = next((v for n, _, v in changed if n == name), None)
            if old is not None and new is not None:
                verb = AUG.get(type(node.op), "изменилось")
                said = f"`{_src(node)}`: значение `{name}` {verb} — было `{old}`, стало `{new}`."
        elif (
            isinstance(node, ast.Expr)
            and isinstance(node.value, ast.Call)
            and isinstance(node.value.func, ast.Attribute)
            and not printed
        ):
            said = self.method(node.value, frame)
        elif (
            isinstance(node, ast.Expr)
            and isinstance(node.value, ast.Call)
            and isinstance(node.value.func, ast.Name)
            and node.value.func.id in frame.f_globals
            and isinstance(frame.f_globals[node.value.func.id], types.FunctionType)
            and not printed
        ):
            said = f"Вызов `{_src(node.value)}` закончен; программа идёт дальше."
        if not said:
            parts = [
                f"`{n}` = `{v}`" if o is None else f"`{n}`: было `{o}`, стало `{v}`"
                for n, o, v in changed
            ]
            if parts:
                said = "; ".join(parts) + "."
        typed = re.findall(r"⟪(.*?)⟫", printed)
        if typed:
            said = f"`input` ждёт, пока пользователь наберёт текст; набрано «{typed[-1]}»." + (
                f" `{node.targets[0].id}` получает этот текст."
                if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name)
                else ""
            )
        elif printed:
            said = (said + " " if said else "") + f"На экран выводится {_printed(printed)}."
        return said or "Строка выполнена."

    def method(self, call: ast.Call, frame) -> str:
        """`b.append(3)` changes the list itself — and every name that leads to it."""
        assert isinstance(call.func, ast.Attribute)
        owner = call.func.value
        obj = self.evaluate(owner, frame) if _pure(owner) else None
        kind = {list: "список", dict: "словарь", set: "множество"}.get(type(obj), "объект")
        said = f"`{_src(call)}` меняет сам {kind}, к которому ведёт `{_src(owner)}`; новый не создаётся."
        if obj is not None:
            others = sorted(
                {
                    k
                    for f in self.chain(frame)
                    for k, v in (
                        f.f_globals.items()
                        if f.f_code.co_name == "<module>"
                        else f.f_locals.items()
                    )
                    if v is obj and k != _src(owner)
                }
            )
            if others:
                said += (
                    " Поэтому изменение видно и через " + ", ".join(f"`{k}`" for k in others) + "."
                )
        return said

    # --- tracing ---------------------------------------------------------
    def finish(self, frame, nxt=None):
        line = self.pending.pop(id(frame), None)
        if line is None:
            return
        printed = self.out.getvalue()[len(self.steps[-1]["out"]) :]
        self.add(frame, line, self.explain(frame, line, nxt, printed))

    def call_title(self, frame) -> str:
        """«вызов square(4)»: the arguments as passed, defaults left out."""
        code = frame.f_code
        func = frame.f_globals.get(code.co_name)
        defaults = getattr(func, "__defaults__", None) or ()
        args = code.co_varnames[: code.co_argcount]
        first_default = len(args) - len(defaults)
        shown = [
            _value(frame.f_locals[a])
            for i, a in enumerate(args)
            if not (i >= first_default and frame.f_locals[a] is defaults[i - first_default])
        ]
        return f"вызов {code.co_name}({', '.join(shown)})"

    def caller_line(self, frame):
        back = frame.f_back
        if back is not None and back.f_code.co_filename == FILE:
            return self.pending.get(id(back), back.f_lineno)
        return frame.f_lineno

    def tracer(self, frame, event, arg):
        if frame.f_code.co_filename != FILE:
            return None
        key = id(frame)
        name = frame.f_code.co_name
        if event == "call":
            if name == "<module>":
                self.add(frame, None, "Программа ещё не запущена.", "start")
            elif frame.f_code.co_flags & GENERATOR and key in self.seen:
                self.paused.pop(key, None)
                self.add(
                    frame,
                    self.caller_line(frame),
                    f"Нужно следующее значение: `{name}` продолжает работу "
                    "с места, где остановился, и помнит свои переменные.",
                    "call",
                )
            else:
                self.seen.add(key)
                self.titles[key] = self.call_title(frame)
                args = frame.f_code.co_varnames[: frame.f_code.co_argcount]
                given = ", ".join(f"`{a}` = `{_value(frame.f_locals[a])}`" for a in args)
                text = f"Вызывается функция `{name}`. У вызова свои переменные"
                text += f": {given}." if given else "."
                self.add(frame, self.caller_line(frame), text, "call")
            return self.tracer
        if event == "line":
            self.raising.discard(key)
            if key in self.pending:
                self.finish(frame, frame.f_lineno)
            self.pending[key] = frame.f_lineno
        elif event == "exception":
            exc = arg[1]
            line = self.pending.pop(key, frame.f_lineno)
            self.raising.add(key)
            self.add(frame, line, "", "error", error=f"{type(exc).__name__}: {exc}")
        elif event == "return":
            line = self.pending.pop(key, None)
            if key in self.raising or name == "<module>":
                if line is not None and name == "<module>":
                    self.pending[key] = line
                    self.finish(frame)
                return self.tracer
            if line is None:
                return self.tracer
            node = self.stmts.get(line)
            printed = self.out.getvalue()[len(self.steps[-1]["out"]) :]
            if frame.f_code.co_flags & GENERATOR and not isinstance(node, ast.Return):
                if arg is None:
                    text = f"Тело `{name}` закончилось: значений больше нет."
                else:
                    self.paused[key] = frame
                    text = (
                        f"`yield` отдаёт `{_value(arg)}` и ставит `{name}` на паузу; "
                        "его переменные сохраняются до следующего запроса."
                    )
            else:
                text = (
                    f"Функция возвращает `{_value(arg)}` в строку, откуда её вызвали. "
                    "Переменные вызова больше не нужны и исчезают."
                )
            if printed:
                text = f"На экран выводится {_printed(printed)}. " + text
            self.add(frame, line, text, "return")
        return self.tracer

    def run(self, stdin: str):
        code = compile(self.code, FILE, "exec")
        env = {"__name__": "__main__", "__builtins__": builtins}
        old_in = sys.stdin
        sys.stdin = io.StringIO(stdin)

        def echo_input(prompt=""):
            print(prompt, end="")
            text = sys.stdin.readline().rstrip("\n")
            print(f"⟪{text}⟫")
            return text

        old_input = builtins.input
        builtins.input = echo_input
        try:
            with contextlib.redirect_stdout(self.out):
                sys.settrace(self.tracer)
                try:
                    exec(code, env)  # noqa: S102
                except Exception:  # noqa: BLE001
                    self.failed = True
                finally:
                    sys.settrace(None)
        finally:
            sys.stdin = old_in
            builtins.input = old_input


NOTE = re.compile(r"^(\d+)(?:\.(\d+))?:\s*(.+)$")


def _same_state(a: dict, b: dict) -> bool:
    def strip(s):
        return (
            [(f["title"], [(n["n"], n["v"], n["ref"]) for n in f["names"]]) for f in s["frames"]],
            {k: o["v"] for k, o in s["objs"].items()},
            s["out"],
        )

    return a["line"] == b["line"] and strip(a) == strip(b)


def trace_steps(code: str, notes: str = "", stdin: str = "") -> list[dict]:
    """Steps of one run. ``notes`` — author lines «3: текст» (every run of line 3)
    or «3.2: текст» (its second run) replacing the generated explanation."""
    rec = _Recorder(code.strip("\n"))
    rec.run(stdin)
    steps = rec.steps
    last_error = max((i for i, s in enumerate(steps) if s["kind"] == "error"), default=None)
    for i, s in enumerate(steps):
        if s["kind"] != "error":
            continue
        error = f"`{s['error']}`"
        if rec.failed and i == last_error:
            s["stop"] = True
            s["text"] = (
                f"Ошибка {error}: Python останавливает программу, следующие строки не выполняются."
            )
        elif i + 1 < len(steps) and steps[i + 1]["kind"] == "error":
            s["text"] = (
                f"Ошибка {error}: вызов прерывается, "
                "ошибка передаётся в строку, откуда функцию вызвали."
            )
        else:
            s["text"] = f"Ошибка {error}: выполнение переходит к блоку `except`."
    own = {}
    for raw in notes.splitlines():
        if m := NOTE.match(raw.strip()):
            own[(int(m.group(1)), int(m.group(2) or 0))] = m.group(3)
    runs: dict[int, int] = {}
    for s in steps:
        if s["line"] is None or s["kind"] == "call":
            continue
        runs[s["line"]] = runs.get(s["line"], 0) + 1
        text = own.get((s["line"], runs[s["line"]])) or own.get((s["line"], 0))
        if text:
            s["text"] = text
    # one step per line when nothing changed in between: the explanations join
    merged: list[dict] = []
    for s in steps:
        if merged and s["kind"] != "start" and _same_state(merged[-1], s):
            merged[-1]["text"] += " " + s["text"]
            continue
        merged.append(s)
    if len(merged) > MAX_STEPS:
        raise SystemExit(f"run block: {len(merged)} steps > {MAX_STEPS}; shorten the example")
    return merged
