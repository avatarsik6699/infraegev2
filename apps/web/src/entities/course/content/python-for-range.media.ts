// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%range(2, 9, 3)%%
  range2_9_3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 120"><line x1="30" y1="70" x2="630" y2="70" stroke="#17191e" stroke-width="1.5"/><line x1="30.0" y1="66" x2="30.0" y2="74" stroke="#4d535e"/><text x="30.0" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="96.7" y1="66" x2="96.7" y2="74" stroke="#4d535e"/><text x="96.7" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="163.3" y1="66" x2="163.3" y2="74" stroke="#4d535e"/><text x="163.3" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="230.0" y1="66" x2="230.0" y2="74" stroke="#4d535e"/><text x="230.0" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="296.7" y1="66" x2="296.7" y2="74" stroke="#4d535e"/><text x="296.7" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="363.3" y1="66" x2="363.3" y2="74" stroke="#4d535e"/><text x="363.3" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="430.0" y1="66" x2="430.0" y2="74" stroke="#4d535e"/><text x="430.0" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="496.7" y1="66" x2="496.7" y2="74" stroke="#4d535e"/><text x="496.7" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="563.3" y1="66" x2="563.3" y2="74" stroke="#4d535e"/><text x="563.3" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="630.0" y1="66" x2="630.0" y2="74" stroke="#4d535e"/><text x="630.0" y="96.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><circle cx="96.7" cy="70" r="9" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><circle cx="296.7" cy="70" r="9" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><path d="M 96.7 58 Q 196.7 28 296.7 58" fill="none" stroke="#4d535e" stroke-width="1.25"/><text x="196.7" y="36.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+3</text><circle cx="496.7" cy="70" r="9" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><path d="M 296.7 58 Q 396.7 28 496.7 58" fill="none" stroke="#4d535e" stroke-width="1.25"/><text x="396.7" y="36.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">+3</text><line x1="563.3" y1="50" x2="563.3" y2="78" stroke="#17191e" stroke-width="1.5" stroke-dasharray="4 3"/><text x="563.3" y="18.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">stop = 9, не входит</text></svg>',
    width: 660,
    height: 120,
    alt: "Значения range",
  },
  // %%loop_grid(2, 3)%%
  loopGrid2_3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 176"><text x="202.0" y="30.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="78.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">column = 0</text><text x="306.0" y="30.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="78.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">column = 1</text><text x="410.0" y="30.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="78.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">column = 2</text><text x="136.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="end" textLength="54.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">row = 0</text><rect x="150" y="44" width="98" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="199.0" y="74.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(0, 0)</text><text x="158.0" y="59.0" font-family="inherit" font-size="11" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">1</text><rect x="254" y="44" width="98" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="303.0" y="74.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(0, 1)</text><text x="262.0" y="59.0" font-family="inherit" font-size="11" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><rect x="358" y="44" width="98" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="407.0" y="74.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(0, 2)</text><text x="366.0" y="59.0" font-family="inherit" font-size="11" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">3</text><text x="136.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="end" textLength="54.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">row = 1</text><rect x="150" y="98" width="98" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="199.0" y="128.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(1, 0)</text><text x="158.0" y="113.0" font-family="inherit" font-size="11" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">4</text><rect x="254" y="98" width="98" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="303.0" y="128.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(1, 1)</text><text x="262.0" y="113.0" font-family="inherit" font-size="11" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">5</text><rect x="358" y="98" width="98" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="407.0" y="128.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(1, 2)</text><text x="366.0" y="113.0" font-family="inherit" font-size="11" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">6</text></svg>',
    width: 660,
    height: 176,
    alt: "Порядок вложенных циклов",
  },
  // %%control_flow()%%
  controlFlow: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 300"><text x="110.0" y="22.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Подряд</text><text x="110.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="112.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">a = 1; print(a)</text><text x="330.0" y="22.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Выбор</text><text x="330.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="67.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if … else</text><path d="M 220 12 V 288" stroke="#d9d9d4"/><text x="550.0" y="22.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Повтор</text><text x="550.0" y="42.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="52.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">while …</text><path d="M 440 12 V 288" stroke="#d9d9d4"/><rect x="50.0" y="64.0" width="120.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="110.0" y="87.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строка 1</text><line x1="110.0" y1="100.0" x2="110.0" y2="119.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 110.0 128.0 L 105.5 119.0 L 114.5 119.0 Z" fill="#4d535e"/><rect x="50.0" y="130.0" width="120.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="110.0" y="153.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строка 2</text><line x1="110.0" y1="166.0" x2="110.0" y2="185.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 110.0 194.0 L 105.5 185.0 L 114.5 185.0 Z" fill="#4d535e"/><rect x="50.0" y="196.0" width="120.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="110.0" y="219.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">строка 3</text><line x1="110.0" y1="232.0" x2="110.0" y2="251.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 110.0 260.0 L 105.5 251.0 L 114.5 251.0 Z" fill="#4d535e"/><text x="110.0" y="282.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">дальше</text><path d="M 330 72.0 L 388.0 98 L 330 124.0 L 272.0 98 Z" fill="#fff" stroke="#ff6a00" stroke-width="1.75"/><text x="330.0" y="103.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">условие?</text><path d="M 272 98 H 278" stroke="#4d535e" fill="none"/><line x1="278.0" y1="98.0" x2="278.0" y2="141.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 278.0 150.0 L 273.5 141.0 L 282.5 141.0 Z" fill="#4d535e"/><text x="272.0" y="90.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="230.0" y="152.0" width="96.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="278.0" y="175.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">блок if</text><path d="M 278 188 V 222 H 330" stroke="#4d535e" fill="none"/><path d="M 388 98 H 382" stroke="#4d535e" fill="none"/><line x1="382.0" y1="98.0" x2="382.0" y2="141.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 382.0 150.0 L 377.5 141.0 L 386.5 141.0 Z" fill="#4d535e"/><text x="388.0" y="90.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">нет</text><rect x="334.0" y="152.0" width="96.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="382.0" y="175.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">блок else</text><path d="M 382 188 V 222 H 330" stroke="#4d535e" fill="none"/><line x1="330.0" y1="222.0" x2="330.0" y2="251.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 330.0 260.0 L 325.5 251.0 L 334.5 251.0 Z" fill="#4d535e"/><text x="330.0" y="282.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">дальше</text><path d="M 550 72.0 L 608.0 98 L 550 124.0 L 492.0 98 Z" fill="#fff" stroke="#ff6a00" stroke-width="1.75"/><text x="550.0" y="103.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">условие?</text><line x1="550.0" y1="124.0" x2="550.0" y2="141.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 550.0 150.0 L 545.5 141.0 L 554.5 141.0 Z" fill="#4d535e"/><text x="558.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">да</text><rect x="502.0" y="152.0" width="96.0" height="36.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="550.0" y="175.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">тело</text><path d="M 502 170 H 458 V 98 H 484" stroke="#ff6a00" stroke-width="1.75" fill="none"/><line x1="480.0" y1="98.0" x2="482.0" y2="98.0" stroke="#ff6a00" stroke-width="1.5"/><path d="M 491.0 98.0 L 482.0 102.5 L 482.0 93.5 Z" fill="#ff6a00"/><text x="452.0" y="140.0" font-family="inherit" font-size="12" font-weight="400" fill="#ff6a00" text-anchor="end" style="font-variant-numeric:tabular-nums">снова</text><path d="M 608 98 H 634 V 236 H 550" stroke="#4d535e" fill="none"/><text x="642.0" y="90.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">нет</text><line x1="550.0" y1="236.0" x2="550.0" y2="251.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 550.0 260.0 L 545.5 251.0 L 554.5 251.0 Z" fill="#4d535e"/><text x="550.0" y="282.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">дальше</text></svg>',
    width: 660,
    height: 300,
    alt: "Три способа управлять порядком строк",
  },
  runNestedLoops: {
    kind: "run",
    code: "for row in range(2):\n    for column in range(3):\n        print(row, column)",
    fileName: "nested_loops.py",
    output: "0 0\n0 1\n0 2\n1 0\n1 1\n1 2",
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
        text: "`for` берёт первое значение: `row` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "row", v: "0", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`for` берёт первое значение: `column` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "На экран выводится «0 0».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `column` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0\n",
      },
      {
        line: 3,
        text: "На экран выводится «0 1».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `column` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n",
      },
      {
        line: 3,
        text: "На экран выводится «0 2».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n",
      },
      {
        line: 2,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "0", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n",
      },
      {
        line: 1,
        text: "`for` берёт следующее значение: `row` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: true },
              { n: "column", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n",
      },
      {
        line: 2,
        text: "`for` берёт первое значение: `column` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n",
      },
      {
        line: 3,
        text: "На экран выводится «1 0».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `column` = `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n",
      },
      {
        line: 3,
        text: "На экран выводится «1 1».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n1 1\n",
      },
      {
        line: 2,
        text: "`for` берёт следующее значение: `column` = `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n1 1\n",
      },
      {
        line: 3,
        text: "На экран выводится «1 2».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n1 1\n1 2\n",
      },
      {
        line: 2,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n1 1\n1 2\n",
      },
      {
        line: 1,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "row", v: "1", ref: null, ch: false },
              { n: "column", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "0 0\n0 1\n0 2\n1 0\n1 1\n1 2\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
