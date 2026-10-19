// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  runUnwind: {
    kind: "run",
    code: "def f(x, y):\n    if x > y:\n        return 0\n    if x == y:\n        return 1\n    return f(x + 1, y) + f(x * 2, y)\n\nprint(f(3, 6))",
    fileName: "unwind.py",
    output: "2",
    steps: [
      {
        line: null,
        text: "Программа ещё не запущена.",
        kind: "start",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "Создана функция `f`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `3`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: false },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `x == y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: false },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `4`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: false },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `x == y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `5`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `x == y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `6`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `x == y` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Функция возвращает `1` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `10`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(10, 6)",
            names: [
              { n: "x", v: "10", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(10, 6)",
            names: [
              { n: "x", v: "10", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Функция возвращает `0` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(10, 6)",
            names: [
              { n: "x", v: "10", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Функция возвращает `1` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(5, 6)",
            names: [
              { n: "x", v: "5", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `8`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(8, 6)",
            names: [
              { n: "x", v: "8", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(8, 6)",
            names: [
              { n: "x", v: "8", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Функция возвращает `0` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(8, 6)",
            names: [
              { n: "x", v: "8", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Функция возвращает `1` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(4, 6)",
            names: [
              { n: "x", v: "4", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Вызывается функция `f`. У вызова свои переменные: `x` = `6`, `y` = `6`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `x > y` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `x == y` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Функция возвращает `1` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
          {
            title: "вызов f(6, 6)",
            names: [
              { n: "x", v: "6", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Функция возвращает `2` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов f(3, 6)",
            names: [
              { n: "x", v: "3", ref: null, ch: true },
              { n: "y", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "На экран выводится «2».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "f", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "2\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
