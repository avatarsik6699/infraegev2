// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  runTm: {
    kind: "run",
    code: "rules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', '0'): ('1', 'L', 'q1'),\n    ('q1', '1'): ('0', 'S', 'q1'),\n}\ntape = {0: '1', 1: '0', 2: '1', 3: '0'}\npos, state = 4, 'q0'\nwhile True:\n    write, move, state = rules[(state, tape.get(pos, 'λ'))]\n    tape[pos] = write\n    if move == 'S':\n        break\n    pos += -1 if move == 'L' else 1\nprint(tape[0] + tape[1] + tape[2] + tape[3])",
    fileName: "tm.py",
    output: "1001",
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
        line: 2,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Строка выполнена.",
        kind: "line",
        frames: [{ title: "программа", names: [] }],
        objs: {},
        out: "",
      },
      {
        line: 1,
        text: "`rules` получает значение `{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: true,
              },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: true },
        },
        out: "",
      },
      {
        line: 6,
        text: "`tape` получает значение `{0: '1', 1: '0', 2: '1', 3: '0'}`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0'}",
                ref: 1,
                ch: true,
              },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0'}", ch: true },
        },
        out: "",
      },
      {
        line: 7,
        text: "`pos` = `4`; `state` = `'q0'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: true },
              { n: "state", v: "'q0'", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0'}", ch: false },
        },
        out: "",
      },
      {
        line: 8,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q0'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0'}", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "`state`: было `'q0'`, стало `'q1'`; `write` = `'λ'`; `move` = `'L'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: true },
              { n: "write", v: "'λ'", ref: null, ch: true },
              { n: "move", v: "'L'", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0'}", ch: false },
        },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `write` → `'λ'` и записывает это в `tape[4]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}", ch: true },
        },
        out: "",
      },
      {
        line: 11,
        text: "Проверка `move == 'S'` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "4", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 13,
        text: "`pos += -1 if move == 'L' else 1`: значение `pos` увеличилось — было `4`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: true },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 8,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'λ'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "`write`: было `'λ'`, стало `'1'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: true },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '0', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `write` → `'1'` и записывает это в `tape[3]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}", ch: true },
        },
        out: "",
      },
      {
        line: 11,
        text: "Проверка `move == 'S'` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "3", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 13,
        text: "`pos += -1 if move == 'L' else 1`: значение `pos` увеличилось — было `3`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: true },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 8,
        text: "Проверка `True` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'1'", ref: null, ch: false },
              { n: "move", v: "'L'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "`write`: было `'1'`, стало `'0'`; `move`: было `'L'`, стало `'S'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: true },
              { n: "move", v: "'S'", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '1', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `write` → `'0'` и записывает это в `tape[2]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: true,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}", ch: true },
        },
        out: "",
      },
      {
        line: 11,
        text: "Проверка `move == 'S'` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 12,
        text: "`break` прерывает цикл.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "",
      },
      {
        line: 14,
        text: "На экран выводится «1001».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "rules",
                v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …",
                ref: 0,
                ch: false,
              },
              {
                n: "tape",
                v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}",
                ref: 1,
                ch: false,
              },
              { n: "pos", v: "2", ref: null, ch: false },
              { n: "state", v: "'q1'", ref: null, ch: false },
              { n: "write", v: "'0'", ref: null, ch: false },
              { n: "move", v: "'S'", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "{('q0', 'λ'): ('λ', 'L', 'q1'), ('q1', …", ch: false },
          "1": { v: "{0: '1', 1: '0', 2: '0', 3: '1', 4: 'λ'}", ch: false },
        },
        out: "1001\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
