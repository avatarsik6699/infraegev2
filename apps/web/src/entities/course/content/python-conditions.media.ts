// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%branch(73, 90)%%
  branch73_90: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="8.0" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">score = 73: верный порядок</text><rect x="8" y="40" width="168" height="38" rx="19" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="92.0" y="65.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 85</text><line x1="176.0" y1="59.0" x2="205.0" y2="59.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 214.0 59.0 L 205.0 63.5 L 205.0 54.5 Z" fill="#d9d9d4"/><text x="195.0" y="52.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="216" y="40" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="266.0" y="65.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">высокий</text><line x1="92.0" y1="78.0" x2="92.0" y2="97.0" stroke="#ff6a00" stroke-width="1.5"/><path d="M 92.0 106.0 L 87.5 97.0 L 96.5 97.0 Z" fill="#ff6a00"/><text x="100.0" y="96.0" font-family="inherit" font-size="12" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="8" y="106" width="168" height="38" rx="19" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="92.0" y="131.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 60</text><line x1="176.0" y1="125.0" x2="205.0" y2="125.0" stroke="#ff6a00" stroke-width="1.5"/><path d="M 214.0 125.0 L 205.0 129.5 L 205.0 120.5 Z" fill="#ff6a00"/><text x="195.0" y="118.0" font-family="inherit" font-size="12" font-weight="400" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="216" y="106" width="100" height="38" rx="8" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="266.0" y="131.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">средний</text><line x1="92.0" y1="144.0" x2="92.0" y2="163.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 92.0 172.0 L 87.5 163.0 L 96.5 163.0 Z" fill="#d9d9d4"/><text x="100.0" y="162.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="42" y="172" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="92.0" y="197.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">начальный</text><text x="344.0" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">score = 90: проверки переставлены</text><rect x="344" y="40" width="168" height="38" rx="19" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="428.0" y="65.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 60</text><line x1="512.0" y1="59.0" x2="541.0" y2="59.0" stroke="#ff6a00" stroke-width="1.5"/><path d="M 550.0 59.0 L 541.0 63.5 L 541.0 54.5 Z" fill="#ff6a00"/><text x="531.0" y="52.0" font-family="inherit" font-size="12" font-weight="400" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="552" y="40" width="100" height="38" rx="8" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="602.0" y="65.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">средний</text><line x1="428.0" y1="78.0" x2="428.0" y2="97.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 428.0 106.0 L 423.5 97.0 L 432.5 97.0 Z" fill="#d9d9d4"/><text x="436.0" y="96.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="344" y="106" width="168" height="38" rx="19" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="428.0" y="131.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 85</text><line x1="512.0" y1="125.0" x2="541.0" y2="125.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 550.0 125.0 L 541.0 129.5 L 541.0 120.5 Z" fill="#d9d9d4"/><text x="531.0" y="118.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="552" y="106" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="602.0" y="131.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">высокий</text><line x1="428.0" y1="144.0" x2="428.0" y2="163.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 428.0 172.0 L 423.5 163.0 L 432.5 163.0 Z" fill="#d9d9d4"/><text x="436.0" y="162.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="378" y="172" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="428.0" y="197.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">начальный</text></svg>',
    width: 660,
    height: 230,
    alt: "Порядок проверок elif",
  },
  runLevel: {
    kind: "run",
    code: 'score = 73\nif score >= 85:\n    level = "высокий"\nelif score >= 60:\n    level = "средний"\nelse:\n    level = "начальный"\nprint(level)',
    fileName: "level.py",
    output: "средний",
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
        text: "`score` получает значение `73`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "score", v: "73", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `score >= 85` даёт `False` — блок пропускается, дальше следующая проверка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "score", v: "73", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `score >= 60` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "score", v: "73", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`level` получает значение `'средний'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "score", v: "73", ref: null, ch: false },
              { n: "level", v: "'средний'", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "На экран выводится «средний».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "score", v: "73", ref: null, ch: false },
              { n: "level", v: "'средний'", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "средний\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
