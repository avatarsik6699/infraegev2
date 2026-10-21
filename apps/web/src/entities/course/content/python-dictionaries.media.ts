// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%freq_table("BANANA", tone="python")%%
  freqTable: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 194"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">буквы по очереди</text><rect x="16.0" y="44.0" width="40.0" height="40.0" rx="0" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="36.0" y="70.0" font-family="inherit" font-size="18" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><text x="36.0" y="102.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1-я</text><rect x="56.0" y="44.0" width="40.0" height="40.0" rx="0" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="76.0" y="70.0" font-family="inherit" font-size="18" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><text x="76.0" y="102.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2-я</text><rect x="96.0" y="44.0" width="40.0" height="40.0" rx="0" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="116.0" y="70.0" font-family="inherit" font-size="18" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N</text><text x="116.0" y="102.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3-я</text><rect x="136.0" y="44.0" width="40.0" height="40.0" rx="0" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="156.0" y="70.0" font-family="inherit" font-size="18" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><text x="156.0" y="102.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4-я</text><rect x="176.0" y="44.0" width="40.0" height="40.0" rx="0" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="196.0" y="70.0" font-family="inherit" font-size="18" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N</text><text x="196.0" y="102.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5-я</text><rect x="216.0" y="44.0" width="40.0" height="40.0" rx="0" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="236.0" y="70.0" font-family="inherit" font-size="18" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><text x="236.0" y="102.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6-я</text><text x="300.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">словарь counts</text><rect x="300.0" y="44.0" width="48.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="324.0" y="68.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="27.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">&#x27;B&#x27;</text><line x1="352.0" y1="62.0" x2="371.0" y2="62.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 380.0 62.0 L 371.0 66.5 L 371.0 57.5 Z" fill="#4d535e"/><rect x="384.0" y="44.0" width="44.0" height="36.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="406.0" y="68.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><text x="440.0" y="67.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">+1 на буквах 1</text><rect x="300.0" y="92.0" width="48.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="324.0" y="116.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="27.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">&#x27;A&#x27;</text><line x1="352.0" y1="110.0" x2="371.0" y2="110.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 380.0 110.0 L 371.0 114.5 L 371.0 105.5 Z" fill="#4d535e"/><rect x="384.0" y="92.0" width="44.0" height="36.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="406.0" y="116.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">3</text><text x="440.0" y="115.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">+1 на буквах 2, 4, 6</text><rect x="300.0" y="140.0" width="48.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="324.0" y="164.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="27.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">&#x27;N&#x27;</text><line x1="352.0" y1="158.0" x2="371.0" y2="158.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 380.0 158.0 L 371.0 162.5 L 371.0 153.5 Z" fill="#4d535e"/><rect x="384.0" y="140.0" width="44.0" height="36.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="406.0" y="164.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><text x="440.0" y="163.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">+1 на буквах 3, 5</text></svg>',
    width: 660,
    height: 194,
    alt: "Частоты букв BANANA",
  },
  runLetterCounts: {
    kind: "run",
    code: 'text = "BANANA"\ncounts = {}\nfor letter in text:\n    counts[letter] = counts.get(letter, 0) + 1\nprint(counts)',
    fileName: "main.py",
    output: "{'B': 1, 'A': 3, 'N': 2}",
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
        text: "`text` получает значение `'BANANA'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "text", v: "'BANANA'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`counts` получает значение `{}`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{}", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт первое значение: `letter` = `'B'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{}", ref: 0, ch: false },
              { n: "letter", v: "'B'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{}", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `counts.get(letter, 0) + 1` → `1` и записывает это в `counts['B']`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1}", ref: 0, ch: true },
              { n: "letter", v: "'B'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `letter` = `'A'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1}", ref: 0, ch: false },
              { n: "letter", v: "'A'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1}", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `counts.get(letter, 0) + 1` → `1` и записывает это в `counts['A']`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 1}", ref: 0, ch: true },
              { n: "letter", v: "'A'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 1}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `letter` = `'N'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 1}", ref: 0, ch: false },
              { n: "letter", v: "'N'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 1}", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `counts.get(letter, 0) + 1` → `1` и записывает это в `counts['N']`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 1, 'N': 1}", ref: 0, ch: true },
              { n: "letter", v: "'N'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 1, 'N': 1}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `letter` = `'A'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 1, 'N': 1}", ref: 0, ch: false },
              { n: "letter", v: "'A'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 1, 'N': 1}", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `counts.get(letter, 0) + 1` → `2` и записывает это в `counts['A']`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 2, 'N': 1}", ref: 0, ch: true },
              { n: "letter", v: "'A'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 2, 'N': 1}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `letter` = `'N'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 2, 'N': 1}", ref: 0, ch: false },
              { n: "letter", v: "'N'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 2, 'N': 1}", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `counts.get(letter, 0) + 1` → `2` и записывает это в `counts['N']`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 2, 'N': 2}", ref: 0, ch: true },
              { n: "letter", v: "'N'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 2, 'N': 2}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "`for` берёт следующее значение: `letter` = `'A'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 2, 'N': 2}", ref: 0, ch: false },
              { n: "letter", v: "'A'", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 2, 'N': 2}", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Python вычисляет `counts.get(letter, 0) + 1` → `3` и записывает это в `counts['A']`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 3, 'N': 2}", ref: 0, ch: true },
              { n: "letter", v: "'A'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 3, 'N': 2}", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 3, 'N': 2}", ref: 0, ch: false },
              { n: "letter", v: "'A'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 3, 'N': 2}", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "На экран выводится «{'B': 1, 'A': 3, 'N': 2}».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'BANANA'", ref: null, ch: false },
              { n: "counts", v: "{'B': 1, 'A': 3, 'N': 2}", ref: 0, ch: false },
              { n: "letter", v: "'A'", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "{'B': 1, 'A': 3, 'N': 2}", ch: false } },
        out: "{'B': 1, 'A': 3, 'N': 2}\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
