// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  runSearch: {
    kind: "run",
    code: "A = 6\nfor x in range(12):\n    if not ((not x <= 7) or x <= A):\n        print('контрпример:', x)\n        break",
    fileName: "search.py",
    output: "контрпример: 7",
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
        text: "`A` получает значение `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "A", v: "6", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт первое значение: `x` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `x` = `7`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "7", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `not (not x <= 7 or x <= A)` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "На экран выводится «контрпример: 7».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "контрпример: 7\n",
      },
      {
        line: 5,
        text: "`break` прерывает цикл.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "A", v: "6", ref: null, ch: false },
              { n: "x", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "контрпример: 7\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
