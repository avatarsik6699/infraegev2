// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  runBalance: {
    kind: "run",
    code: "s = 'MKL1N'\nbalance = 0\nfirst = {0: -1}\nbest = 0\nfor i in range(len(s)):\n    balance += -2 if s[i].isdigit() else 1\n    if balance in first:\n        best = max(best, i - first[balance])\n    else:\n        first[balance] = i\n\nprint(best)",
    fileName: "balance.py",
    output: "3",
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
        text: "`s` получает значение `'MKL1N'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "s", v: "'MKL1N'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`balance` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Python вычисляет `{0: -1}` → `{0: -1}`, и `first` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "0", ref: null, ch: false },
              { n: "first", v: "{0: -1}", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1}", ch: true } },
        out: "",
      },
      {
        line: 4,
        text: "`best` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "0", ref: null, ch: false },
              { n: "first", v: "{0: -1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1}", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт первое значение: `i` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "0", ref: null, ch: false },
              { n: "first", v: "{0: -1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1}", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`balance += -2 if s[i].isdigit() else 1`: значение `balance` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: true },
              { n: "first", v: "{0: -1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1}", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `balance in first` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: false },
              { n: "first", v: "{0: -1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1}", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `i` → `0` и записывает это в `first[1]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0}", ref: 0, ch: true },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0}", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `i` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0}", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`balance += -2 if s[i].isdigit() else 1`: значение `balance` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: true },
              { n: "first", v: "{0: -1, 1: 0}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0}", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `balance in first` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0}", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `i` → `1` и записывает это в `first[2]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1}", ref: 0, ch: true },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1}", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `i` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1}", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`balance += -2 if s[i].isdigit() else 1`: значение `balance` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "3", ref: null, ch: true },
              { n: "first", v: "{0: -1, 1: 0, 2: 1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1}", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `balance in first` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "3", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1}", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `i` → `2` и записывает это в `first[3]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "3", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: true },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: true } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `i` = `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "3", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`balance += -2 if s[i].isdigit() else 1`: значение `balance` увеличилось — было `3`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: true },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `balance in first` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Python вычисляет `max(best, i - first[balance])` → `3`, и `best` получает это значение. Прежнее значение `0` больше не связано с `best`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: true },
              { n: "i", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "`for` берёт следующее значение: `i` = `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "1", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`balance += -2 if s[i].isdigit() else 1`: значение `balance` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: true },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `balance in first` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Python вычисляет `max(best, i - first[balance])` → `3`, и `best` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "",
      },
      {
        line: 12,
        text: "На экран выводится «3».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'MKL1N'", ref: null, ch: false },
              { n: "balance", v: "2", ref: null, ch: false },
              { n: "first", v: "{0: -1, 1: 0, 2: 1, 3: 2}", ref: 0, ch: false },
              { n: "best", v: "3", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{0: -1, 1: 0, 2: 1, 3: 2}", ch: false } },
        out: "3\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
