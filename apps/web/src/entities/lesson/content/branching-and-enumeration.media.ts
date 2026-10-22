// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%ex_tree(2, 6, ['+1', '*2'])%%
  exTree2_6: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 312 366"><line x1="56.0" y1="227.0" x2="36.0" y2="259.0" stroke="#4d535e" stroke-width="1.3"/><line x1="56.0" y1="227.0" x2="76.0" y2="259.0" stroke="#d9d9d4" stroke-width="1.3"/><line x1="76.0" y1="165.0" x2="56.0" y2="197.0" stroke="#4d535e" stroke-width="1.3"/><line x1="76.0" y1="165.0" x2="116.0" y2="197.0" stroke="#d9d9d4" stroke-width="1.3"/><line x1="96.0" y1="103.0" x2="76.0" y2="135.0" stroke="#4d535e" stroke-width="1.3"/><line x1="96.0" y1="103.0" x2="156.0" y2="135.0" stroke="#4d535e" stroke-width="1.3"/><line x1="156.0" y1="41.0" x2="96.0" y2="73.0" stroke="#4d535e" stroke-width="1.3"/><line x1="216.0" y1="165.0" x2="196.0" y2="197.0" stroke="#4d535e" stroke-width="1.3"/><line x1="216.0" y1="165.0" x2="236.0" y2="197.0" stroke="#d9d9d4" stroke-width="1.3"/><line x1="236.0" y1="103.0" x2="216.0" y2="135.0" stroke="#4d535e" stroke-width="1.3"/><line x1="236.0" y1="103.0" x2="276.0" y2="135.0" stroke="#d9d9d4" stroke-width="1.3"/><line x1="156.0" y1="41.0" x2="236.0" y2="73.0" stroke="#4d535e" stroke-width="1.3"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="46.0" y="247.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="66.0" y="247.0" font-family="inherit" font-size="12" font-weight="500" fill="#9a9a94" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="66.0" y="185.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="96.0" y="185.0" font-family="inherit" font-size="12" font-weight="500" fill="#9a9a94" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="86.0" y="123.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="126.0" y="123.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="126.0" y="61.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="206.0" y="185.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="226.0" y="185.0" font-family="inherit" font-size="12" font-weight="500" fill="#9a9a94" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="226.0" y="123.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="256.0" y="123.0" font-family="inherit" font-size="12" font-weight="500" fill="#9a9a94" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><text stroke="#fff" stroke-width="4" paint-order="stroke" x="196.0" y="61.0" font-family="inherit" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><circle cx="36.0" cy="274.0" r="15" fill="#fff" stroke="#ff6a00" stroke-width="2.4"/><text x="36.0" y="279.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="36.0" y="308.0" font-family="inherit" font-size="13" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1111</text><circle cx="76.0" cy="274.0" r="15" fill="#fff" stroke="#9a9a94" stroke-width="1.3" stroke-dasharray="3 3"/><text x="76.0" y="279.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><circle cx="56.0" cy="212.0" r="15" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="56.0" y="217.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><circle cx="116.0" cy="212.0" r="15" fill="#fff" stroke="#9a9a94" stroke-width="1.3" stroke-dasharray="3 3"/><text x="116.0" y="217.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><circle cx="76.0" cy="150.0" r="15" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="76.0" y="155.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><circle cx="156.0" cy="150.0" r="15" fill="#fff" stroke="#ff6a00" stroke-width="2.4"/><text x="156.0" y="155.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="156.0" y="184.0" font-family="inherit" font-size="13" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><circle cx="96.0" cy="88.0" r="15" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="96.0" y="93.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><circle cx="196.0" cy="212.0" r="15" fill="#fff" stroke="#ff6a00" stroke-width="2.4"/><text x="196.0" y="217.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="196.0" y="246.0" font-family="inherit" font-size="13" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">211</text><circle cx="236.0" cy="212.0" r="15" fill="#fff" stroke="#9a9a94" stroke-width="1.3" stroke-dasharray="3 3"/><text x="236.0" y="217.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><circle cx="216.0" cy="150.0" r="15" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="216.0" y="155.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><circle cx="276.0" cy="150.0" r="15" fill="#fff" stroke="#9a9a94" stroke-width="1.3" stroke-dasharray="3 3"/><text x="276.0" y="155.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><circle cx="236.0" cy="88.0" r="15" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="236.0" y="93.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><circle cx="156.0" cy="26.0" r="15" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="156.0" y="31.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="156.0" y="338.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">команды: 1 — +1, 2 — ×2</text><text x="156.0" y="356.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">пунктир — цель перепрыгнута</text></svg>',
    width: 312,
    height: 366,
    alt: "Дерево программ",
  },
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
  // %%ex_fill(6, 20, ['+1', '*2'])%%
  exFill6_20: {
    kind: "stepper",
    width: 648,
    height: 204,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="34.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(6) = 1: в старте одна пустая программа.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="35.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="74.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 60.0 104.0 Q 72.6 78.0 81.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 85.2 104.0 L 78.1 98.5 L 85.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="72.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(7) = K(6) = 1: в 7 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="75.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="114.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 100.0 104.0 Q 112.6 78.0 121.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 125.2 104.0 L 118.1 98.5 L 125.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="112.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(8) = K(7) = 1: в 8 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="115.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="154.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 140.0 104.0 Q 152.6 78.0 161.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 165.2 104.0 L 158.1 98.5 L 165.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="152.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(9) = K(8) = 1: в 9 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="155.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="194.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 180.0 104.0 Q 192.6 78.0 201.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 205.2 104.0 L 198.1 98.5 L 205.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="192.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(10) = K(9) = 1: в 10 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="195.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="234.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 220.0 104.0 Q 232.6 78.0 241.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 245.2 104.0 L 238.1 98.5 L 245.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="232.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(11) = K(10) = 1: в 11 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="35.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="235.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="274.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 54.0 104.0 Q 178.4 -27.5 297.3 98.2" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 302.8 104.0 L 294.4 100.9 L 300.2 95.4 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="178.4" y="42.2" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 260.0 104.0 Q 272.6 78.0 281.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 285.2 104.0 L 278.1 98.5 L 285.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="272.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(12) = K(6) + K(11) = 1 + 1 = 2.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="275.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="314.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 300.0 104.0 Q 312.6 78.0 321.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 325.2 104.0 L 318.1 98.5 L 325.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="312.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(13) = K(12) = 2: в 13 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="75.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="315.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="354.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 94.0 104.0 Q 238.4 -43.5 377.2 98.3" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 382.8 104.0 L 374.3 101.1 L 380.1 95.5 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="238.4" y="34.2" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 340.0 104.0 Q 352.6 78.0 361.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 365.2 104.0 L 358.1 98.5 L 365.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="352.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(14) = K(7) + K(13) = 1 + 2 = 3.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="355.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="394.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 380.0 104.0 Q 392.6 78.0 401.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 405.2 104.0 L 398.1 98.5 L 405.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="392.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(15) = K(14) = 3: в 15 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="454.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="115.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="395.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="434.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 134.0 104.0 Q 298.4 -52.0 457.0 98.5" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 462.8 104.0 L 454.2 101.4 L 459.8 95.6 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="298.4" y="30.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 420.0 104.0 Q 432.6 78.0 441.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 445.2 104.0 L 438.1 98.5 L 445.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="432.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(16) = K(8) + K(15) = 1 + 3 = 4.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="454.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="494.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="435.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="474.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 460.0 104.0 Q 472.6 78.0 481.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 485.2 104.0 L 478.1 98.5 L 485.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="472.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(17) = K(16) = 4: в 17 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="454.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="494.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="534.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="155.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="475.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="514.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 174.0 104.0 Q 358.4 -52.0 536.7 98.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 542.8 104.0 L 534.1 101.9 L 539.3 95.8 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="358.4" y="30.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 500.0 104.0 Q 512.6 78.0 521.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 525.2 104.0 L 518.1 98.5 L 525.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="512.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(18) = K(9) + K(17) = 1 + 4 = 5.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="454.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="494.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="534.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="574.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><rect x="515.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="554.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 540.0 104.0 Q 552.6 78.0 561.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 565.2 104.0 L 558.1 98.5 L 565.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="552.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(19) = K(18) = 5: в 19 ведёт только «+1».",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 204"><text x="24.0" y="125.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="157.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="104.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="136.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="174.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="214.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="254.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="294.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="334.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="374.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="414.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="454.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="454.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="494.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="494.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="534.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="534.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="574.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="574.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="614.0" y="125.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="614.0" y="157.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="195.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="555.5" y="137.5" width="37.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="594.0" y="104.0" width="40.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 214.0 104.0 Q 418.4 -52.0 616.4 99.1" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 622.8 104.0 L 614.0 102.3 L 618.9 96.0 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="418.4" y="30.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 580.0 104.0 Q 592.6 78.0 601.7 96.8" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 605.2 104.0 L 598.1 98.5 L 605.3 95.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="592.6" y="89.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="324.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
        caption: "K(20) = K(10) + K(19) = 1 + 5 = 6.",
      },
    ],
  },
  // %%ex_line(2, 6, ['+1', '*2'])%%
  exLine2_6_ff6440: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 288 218"><text x="24.0" y="82.2" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="114.2" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="61.2" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="93.2" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="82.0" y="61.2" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="82.0" y="93.2" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="130.0" y="61.2" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="130.0" y="93.2" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="178.0" y="61.2" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="178.0" y="93.2" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="226.0" y="61.2" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="226.0" y="93.2" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="58.0" y="82.2" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="58.0" y="114.2" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="106.0" y="82.2" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="106.0" y="114.2" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="154.0" y="82.2" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="154.0" y="114.2" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="202.0" y="82.2" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="202.0" y="114.2" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="250.0" y="82.2" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="250.0" y="114.2" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><path d="M 58.0 61.2 Q 106.0 -9.2 149.5 54.6" fill="none" stroke="#4d535e" stroke-width="1.4" stroke-linecap="round"/><path d="M 154.0 61.2 L 146.2 56.8 L 152.8 52.3 Z" fill="#4d535e"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="106.0" y="30.0" font-family="inherit" font-size="12" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 106.0 125.2 Q 178.0 214.8 245.0 131.4" fill="none" stroke="#4d535e" stroke-width="1.4" stroke-linecap="round"/><path d="M 250.0 125.2 L 248.1 133.9 L 241.9 128.9 Z" fill="#4d535e"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="178.0" y="174.0" font-family="inherit" font-size="12" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><text x="144.0" y="208.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
    width: 288,
    height: 218,
    alt: "Таблица количеств программ",
  },
  // %%ex_line(2, 20, ['+1', '*2'], must=(6,), forbid=(9,), rows=True, arcs=False)%%
  exLine2_20_2e2b22: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 648 250"><text x="34.0" y="24.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">участок 2 → 6: 3</text><text x="24.0" y="57.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="89.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="36.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="68.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="36.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="68.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="36.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="68.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="36.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="68.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="36.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="68.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="57.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="54.0" y="89.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="57.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="94.0" y="89.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="57.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="134.0" y="89.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="174.0" y="57.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="174.0" y="89.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="214.0" y="57.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="214.0" y="89.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="34.0" y="130.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">участок 6 → 20: 3</text><text x="24.0" y="163.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="195.0" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="74.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="74.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="114.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="114.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="154.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="154.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="194.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="194.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="234.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="234.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="314.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="314.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="354.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="354.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="394.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="394.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="434.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="434.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="474.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="474.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="514.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="514.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="554.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="554.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="594.0" y="142.0" width="40.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="594.0" y="174.0" width="40.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="54.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="54.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="94.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="94.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="134.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="134.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="174.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="159.0" y1="169.0" x2="189.0" y2="147.0" stroke="#4d535e" stroke-width="1.6"/><text x="174.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="214.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="214.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="254.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="254.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="294.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="294.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="334.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><text x="334.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="374.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><text x="374.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="414.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="414.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="454.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="454.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="494.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">17</text><text x="494.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="534.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">18</text><text x="534.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="574.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><text x="574.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="614.0" y="163.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">20</text><text x="614.0" y="195.0" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="34.0" y="238.0" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">программ: 3 · 3 = 9</text></svg>',
    width: 648,
    height: 250,
    alt: "Участки пути",
  },
  // %%ex_run(3, ['12', '21'], ['+1', '*2'])%%
  exRun3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 245 216"><text x="8.0" y="39.0" font-family="inherit" font-size="16" font-weight="700" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">12</text><path d="M 81.0 34.0 Q 101.0 34.0 113.0 34.0" fill="none" stroke="#4d535e" stroke-width="1.5" stroke-linecap="round"/><path d="M 121.0 34.0 L 113.0 38.0 L 113.0 30.0 Z" fill="#4d535e"/><text x="101.0" y="25.0" font-family="inherit" font-size="12" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1: +1</text><path d="M 155.0 34.0 Q 175.0 34.0 187.0 34.0" fill="none" stroke="#4d535e" stroke-width="1.5" stroke-linecap="round"/><path d="M 195.0 34.0 L 187.0 38.0 L 187.0 30.0 Z" fill="#4d535e"/><text x="175.0" y="25.0" font-family="inherit" font-size="12" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2: ×2</text><circle cx="64.0" cy="34" r="17" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.4"/><text x="64.0" y="39.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><circle cx="138.0" cy="34" r="17" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="138.0" y="39.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><circle cx="212.0" cy="34" r="17" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="212.0" y="39.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="64.0" y="71.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">старт</text><path d="M 121.0 59 v 6 H 229.0 v -6" fill="none" stroke="#ff6a00" stroke-width="1.4"/><text x="175.0" y="83.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">траектория: 4, 8</text><text x="8.0" y="143.0" font-family="inherit" font-size="16" font-weight="700" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">21</text><path d="M 81.0 138.0 Q 101.0 138.0 113.0 138.0" fill="none" stroke="#4d535e" stroke-width="1.5" stroke-linecap="round"/><path d="M 121.0 138.0 L 113.0 142.0 L 113.0 134.0 Z" fill="#4d535e"/><text x="101.0" y="129.0" font-family="inherit" font-size="12" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2: ×2</text><path d="M 155.0 138.0 Q 175.0 138.0 187.0 138.0" fill="none" stroke="#4d535e" stroke-width="1.5" stroke-linecap="round"/><path d="M 195.0 138.0 L 187.0 142.0 L 187.0 134.0 Z" fill="#4d535e"/><text x="175.0" y="129.0" font-family="inherit" font-size="12" font-weight="600" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1: +1</text><circle cx="64.0" cy="138" r="17" fill="#f3f3f1" stroke="#4d535e" stroke-width="1.4"/><text x="64.0" y="143.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><circle cx="138.0" cy="138" r="17" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="138.0" y="143.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><circle cx="212.0" cy="138" r="17" fill="#fff" stroke="#17191e" stroke-width="1.4"/><text x="212.0" y="143.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="64.0" y="175.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">старт</text><path d="M 121.0 163 v 6 H 229.0 v -6" fill="none" stroke="#ff6a00" stroke-width="1.4"/><text x="175.0" y="187.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">траектория: 6, 7</text></svg>',
    width: 245,
    height: 216,
    alt: "Выполнение программ",
  },
  // %%ex_line(6, 12, ['+1', '*2'], focus=12)%%
  exLine6_12_274d46: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 384 200"><text x="24.0" y="120.6" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">n</text><text x="24.0" y="152.6" font-family="inherit" font-size="13" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">K</text><rect x="34.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="34.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="82.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="82.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="130.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="130.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="178.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="178.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="226.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="226.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="274.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="274.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><rect x="322.0" y="99.6" width="48.0" height="32" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="322.0" y="131.6" width="48.0" height="32" fill="#fff" stroke="#d9d9d4"/><text x="58.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="58.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="106.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="106.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="154.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="154.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="202.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="202.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="250.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="250.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="298.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="298.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="346.0" y="120.6" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="346.0" y="152.6" font-family="inherit" font-size="15" font-weight="700" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="35.5" y="133.1" width="45.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="275.5" y="133.1" width="45.0" height="29" fill="none" stroke="#ff6a00" stroke-width="1.4" rx="3"/><rect x="322.0" y="99.6" width="48.0" height="64" fill="none" stroke="#ff6a00" stroke-width="2.4" rx="2"/><path d="M 58.0 99.6 Q 207.3 -51.8 350.9 93.9" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 356.6 99.6 L 348.1 96.7 L 353.8 91.1 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="207.3" y="27.9" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">×2</text><path d="M 305.2 99.6 Q 320.3 73.6 331.4 92.7" fill="none" stroke="#ff6a00" stroke-width="2.2" stroke-linecap="round"/><path d="M 335.4 99.6 L 328.0 94.7 L 334.9 90.7 Z" fill="#ff6a00"/><text stroke="#fff" stroke-width="4" paint-order="stroke" x="320.3" y="84.6" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">+1</text><text x="192.0" y="189.6" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">соседняя клетка — +1 · дуга — ×2</text></svg>',
    width: 384,
    height: 200,
    alt: "Таблица количеств программ",
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
