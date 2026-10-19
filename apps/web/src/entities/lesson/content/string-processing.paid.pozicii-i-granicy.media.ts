// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%string_positions("BABAACB", "A", 2)%%
  stringPositionsBABAACB_A_2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 246"><text x="146.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">-1</text><text x="192.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="238.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="284.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="330.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="376.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="422.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="468.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="514.0" y="20.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><rect x="123.0" y="30" width="46" height="46" fill="#fff" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="4 4"/><text x="146.0" y="61.3" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">|</text><rect x="491.0" y="30" width="46" height="46" fill="#fff" stroke="#4d535e" stroke-width="1.25" stroke-dasharray="4 4"/><text x="514.0" y="61.3" font-family="inherit" font-size="18" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">|</text><rect x="169.0" y="30.0" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="192.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><rect x="215.0" y="30.0" width="46" height="46" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="238.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><rect x="261.0" y="30.0" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="284.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><rect x="307.0" y="30.0" width="46" height="46" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="330.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><rect x="353.0" y="30.0" width="46" height="46" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="376.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><rect x="399.0" y="30.0" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="422.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><rect x="445.0" y="30.0" width="46" height="46" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="468.0" y="61.3" font-family="inherit" font-size="20" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><text x="330.0" y="100.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">positions = [−1, 1, 3, 4, 7]</text><path d="M 172.0 125.0 v 7 H 350.0 v -7" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="261.0" y="154.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A на 1, 3: от 0 до 3, длина 4</text><path d="M 264.0 173.0 v 7 H 488.0 v -7" fill="none" stroke="#ff6a00" stroke-width="2" stroke-linejoin="round"/><text x="376.0" y="202.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">A на 3, 4: от 2 до 6, длина 5</text><text x="330.0" y="238.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">длина = positions[j + 2] − positions[j − 1] − 1</text></svg>',
    width: 660,
    height: 246,
    alt: "Позиции и искусственные границы",
  },
  runChain: {
    kind: "run",
    code: "s = 'BFAAFCFAAAFDFAB'\nparts = s.split('F')\ncurrent = 0\nbest = 0\n\nfor part in parts[1:-1]:\n    if part.count('A') <= 2:\n        if current == 0:\n            current = 1\n        current += len(part) + 1\n    else:\n        current = 0\n\n    best = max(best, current)\n\nprint(best)",
    fileName: "chain.py",
    output: "6",
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
        text: "`s` получает значение `'BFAAFCFAAAFDFAB'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Python вычисляет `s.split('F')` → `['B', 'AA', 'C', 'AAA', 'D', 'AB']`, и `parts` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: true,
              },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`current` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
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
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`for` берёт первое значение: `part` = `'AA'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "part", v: "'AA'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `part.count('A') <= 2` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "part", v: "'AA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Проверка `current == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "part", v: "'AA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`current` получает значение `1`. Прежнее значение `0` больше не связано с `current`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "1", ref: null, ch: true },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "part", v: "'AA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`current += len(part) + 1`: значение `current` увеличилось — было `1`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "4", ref: null, ch: true },
              { n: "best", v: "0", ref: null, ch: false },
              { n: "part", v: "'AA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 14,
        text: "Python вычисляет `max(best, current)` → `4`, и `best` получает это значение. Прежнее значение `0` больше не связано с `best`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "4", ref: null, ch: false },
              { n: "best", v: "4", ref: null, ch: true },
              { n: "part", v: "'AA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`for` берёт следующее значение: `part` = `'C'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "4", ref: null, ch: false },
              { n: "best", v: "4", ref: null, ch: false },
              { n: "part", v: "'C'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `part.count('A') <= 2` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "4", ref: null, ch: false },
              { n: "best", v: "4", ref: null, ch: false },
              { n: "part", v: "'C'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Проверка `current == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "4", ref: null, ch: false },
              { n: "best", v: "4", ref: null, ch: false },
              { n: "part", v: "'C'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`current += len(part) + 1`: значение `current` увеличилось — было `4`, стало `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "6", ref: null, ch: true },
              { n: "best", v: "4", ref: null, ch: false },
              { n: "part", v: "'C'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 14,
        text: "Python вычисляет `max(best, current)` → `6`, и `best` получает это значение. Прежнее значение `4` больше не связано с `best`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "6", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: true },
              { n: "part", v: "'C'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`for` берёт следующее значение: `part` = `'AAA'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "6", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'AAA'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `part.count('A') <= 2` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "6", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'AAA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 12,
        text: "`current` получает значение `0`. Прежнее значение `6` больше не связано с `current`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: true },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'AAA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 14,
        text: "Python вычисляет `max(best, current)` → `6`, и `best` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'AAA'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "`for` берёт следующее значение: `part` = `'D'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Проверка `part.count('A') <= 2` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Проверка `current == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "0", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`current` получает значение `1`. Прежнее значение `0` больше не связано с `current`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "1", ref: null, ch: true },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`current += len(part) + 1`: значение `current` увеличилось — было `1`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "3", ref: null, ch: true },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 14,
        text: "Python вычисляет `max(best, current)` → `6`, и `best` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "3", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "3", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "",
      },
      {
        line: 16,
        text: "На экран выводится «6».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "s", v: "'BFAAFCFAAAFDFAB'", ref: null, ch: false },
              {
                n: "parts",
                v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']",
                ref: 0,
                ch: false,
              },
              { n: "current", v: "3", ref: null, ch: false },
              { n: "best", v: "6", ref: null, ch: false },
              { n: "part", v: "'D'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "['B', 'AA', 'C', 'AAA', 'D', 'AB']", ch: false } },
        out: "6\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
