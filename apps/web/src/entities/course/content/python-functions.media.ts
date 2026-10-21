// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%call_flow(tone="python")%%
  callFlow: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><text x="40.0" y="20.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">строка с вызовом</text><text x="40.0" y="50.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" textLength="243.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">area = rectangle_area(3, 5)</text><rect x="99.0" y="30.0" width="188.0" height="28.0" rx="5" fill="none" stroke="#3f6aa6" stroke-width="1.5" stroke-dasharray="5 4"/><rect x="26.0" y="118.0" width="440.0" height="104.0" rx="10" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="40.0" y="110.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">функция</text><text x="40.0" y="152.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="start" textLength="306.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">def rectangle_area(width, height):</text><text x="40.0" y="192.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="start" textLength="225.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    return width * height</text><rect x="209.0" y="134.0" width="49.0" height="24.0" rx="4" fill="none" stroke="#3f6aa6" stroke-width="1.5"/><line x1="242.5" y1="58.0" x2="234.6" y2="121.1" stroke="#3f6aa6" stroke-width="1.75"/><path d="M 233.5 130.0 L 230.2 120.5 L 239.1 121.6 Z" fill="#3f6aa6"/><rect x="272.0" y="134.0" width="58.0" height="24.0" rx="4" fill="none" stroke="#3f6aa6" stroke-width="1.5"/><line x1="269.5" y1="58.0" x2="297.4" y2="121.8" stroke="#3f6aa6" stroke-width="1.75"/><path d="M 301.0 130.0 L 293.3 123.6 L 301.5 120.0 Z" fill="#3f6aa6"/><text x="340.0" y="92.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 → width, 5 → height</text><rect x="73.0" y="174.0" width="195.0" height="25.0" rx="4" fill="none" stroke="#17191e" stroke-width="1.5"/><circle cx="560" cy="186" r="20" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="560.0" y="191.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" textLength="18.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">15</text><line x1="273.0" y1="186.0" x2="527.0" y2="186.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 536.0 186.0 L 527.0 190.5 L 527.0 181.5 Z" fill="#4d535e"/><path d="M 560 164 V 44 H 295.0" fill="none" stroke="#3f6aa6" stroke-width="1.75"/><path d="M 289.0 44 l 8 -4 v 8 z" fill="#3f6aa6"/><text x="40.0" y="262.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">return отдаёт 15 в место вызова: строка становится area = 15</text><text x="40.0" y="284.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">тело выполняется при каждом вызове, а не при def</text></svg>',
    width: 660,
    height: 300,
    alt: "Вызов функции rectangle_area(3, 5)",
  },
  runSquare: {
    kind: "run",
    code: "def square(number):\n    return number * number\n\nresult = square(4) + square(3)\nprint(result)",
    fileName: "main.py",
    output: "25",
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
        text: "Создана функция `square`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "square", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Вызывается функция `square`. У вызова свои переменные: `number` = `4`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "square", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов square(4)",
            names: [{ n: "number", v: "4", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Функция возвращает `16` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "square", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов square(4)",
            names: [{ n: "number", v: "4", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Вызывается функция `square`. У вызова свои переменные: `number` = `3`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "square", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов square(3)",
            names: [{ n: "number", v: "3", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Функция возвращает `9` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "square", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов square(3)",
            names: [{ n: "number", v: "3", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `square(4) + square(3)` → `25`, и `result` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "square", v: "функция", ref: null, ch: false },
              { n: "result", v: "25", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "На экран выводится «25».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "square", v: "функция", ref: null, ch: false },
              { n: "result", v: "25", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "25\n",
      },
    ],
  },
  runLocalNames: {
    kind: "run",
    code: "x = 10\n\ndef calculate():\n    x = 3\n    return x + 1\n\nprint(calculate())\nprint(x)",
    fileName: "main.py",
    output: "4\n10",
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
        text: "`x` получает значение `10`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "x", v: "10", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Создана функция `calculate`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "x", v: "10", ref: null, ch: false },
              { n: "calculate", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Вызывается функция `calculate`. У вызова свои переменные.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "x", v: "10", ref: null, ch: false },
              { n: "calculate", v: "функция", ref: null, ch: false },
            ],
          },
          { title: "вызов calculate()", names: [] },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`x` получает значение `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "x", v: "10", ref: null, ch: false },
              { n: "calculate", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов calculate()",
            names: [{ n: "x", v: "3", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Функция возвращает `4` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "x", v: "10", ref: null, ch: false },
              { n: "calculate", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов calculate()",
            names: [{ n: "x", v: "3", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "На экран выводится «4».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "x", v: "10", ref: null, ch: false },
              { n: "calculate", v: "функция", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "4\n",
      },
      {
        line: 8,
        text: "На экран выводится «10».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "x", v: "10", ref: null, ch: false },
              { n: "calculate", v: "функция", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "4\n10\n",
      },
    ],
  },
  runRebindMutate: {
    kind: "run",
    code: "def rebind(items):\n    items = [99]\n\ndef mutate(items):\n    items.append(99)\n\na = [1, 2]\nrebind(a)\nprint(a)\nmutate(a)\nprint(a)",
    fileName: "main.py",
    output: "[1, 2]\n[1, 2, 99]",
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
        text: "Создана функция `rebind`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "rebind", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Создана функция `mutate`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`a` получает значение `[1, 2]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: true } },
        out: "",
      },
      {
        line: 8,
        text: "Вызывается функция `rebind`. У вызова свои переменные: `items` = `[1, 2]`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2]", ref: 0, ch: false },
            ],
          },
          {
            title: "вызов rebind([1, 2])",
            names: [{ n: "items", v: "[1, 2]", ref: 0, ch: true }],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: false } },
        out: "",
      },
      {
        line: 2,
        text: "Функция возвращает `None` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2]", ref: 0, ch: false },
            ],
          },
          {
            title: "вызов rebind([1, 2])",
            names: [{ n: "items", v: "[99]", ref: 1, ch: true }],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: false }, "1": { v: "[99]", ch: true } },
        out: "",
      },
      {
        line: 8,
        text: "Вызов `rebind(a)` закончен; программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "На экран выводится «[1, 2]».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: false } },
        out: "[1, 2]\n",
      },
      {
        line: 10,
        text: "Вызывается функция `mutate`. У вызова свои переменные: `items` = `[1, 2]`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2]", ref: 0, ch: false },
            ],
          },
          {
            title: "вызов mutate([1, 2])",
            names: [{ n: "items", v: "[1, 2]", ref: 0, ch: true }],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: false } },
        out: "[1, 2]\n",
      },
      {
        line: 5,
        text: "Функция возвращает `None` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2, 99]", ref: 0, ch: true },
            ],
          },
          {
            title: "вызов mutate([1, 2])",
            names: [{ n: "items", v: "[1, 2, 99]", ref: 0, ch: true }],
          },
        ],
        objs: { "0": { v: "[1, 2, 99]", ch: true } },
        out: "[1, 2]\n",
      },
      {
        line: 10,
        text: "Вызов `mutate(a)` закончен; программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2, 99]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2, 99]", ch: false } },
        out: "[1, 2]\n",
      },
      {
        line: 11,
        text: "На экран выводится «[1, 2, 99]».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "rebind", v: "функция", ref: null, ch: false },
              { n: "mutate", v: "функция", ref: null, ch: false },
              { n: "a", v: "[1, 2, 99]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2, 99]", ch: false } },
        out: "[1, 2]\n[1, 2, 99]\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
