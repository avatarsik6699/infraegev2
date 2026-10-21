// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%digits_stepper(5072, tone="python")%%
  digitsStepper5072: {
    kind: "stepper",
    width: 660,
    height: 160,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 160"><rect x="16" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="30.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">n — что осталось</text><text x="30.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">5072</text><rect x="176" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="190.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">digit_sum</text><text x="190.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><text x="336.0" y="40.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n &gt; 0: 5072 &gt; 0</text><text x="336.0" y="64.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">берём цифру</text><text x="16.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">снятые цифры справа налево</text><text x="16.0" y="142.0" font-family="inherit" font-size="20" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">пока нет</text></svg>',
        caption: "n = 5072: последняя цифра n % 10 = 2, n // 10 = 507.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 160"><rect x="16" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="30.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">n — что осталось</text><text x="30.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">507</text><rect x="176" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="190.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">digit_sum</text><text x="190.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text><text x="336.0" y="40.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n &gt; 0: 507 &gt; 0</text><text x="336.0" y="64.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">берём цифру</text><text x="16.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">снятые цифры справа налево</text><text x="16.0" y="142.0" font-family="inherit" font-size="20" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2</text></svg>',
        caption: "n = 507: последняя цифра n % 10 = 7, n // 10 = 50.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 160"><rect x="16" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="30.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">n — что осталось</text><text x="30.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">50</text><rect x="176" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="190.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">digit_sum</text><text x="190.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">9</text><text x="336.0" y="40.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n &gt; 0: 50 &gt; 0</text><text x="336.0" y="64.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">берём цифру</text><text x="16.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">снятые цифры справа налево</text><text x="16.0" y="142.0" font-family="inherit" font-size="20" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2 7</text></svg>',
        caption: "n = 50: последняя цифра n % 10 = 0, n // 10 = 5.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 160"><rect x="16" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="30.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">n — что осталось</text><text x="30.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">5</text><rect x="176" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="190.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">digit_sum</text><text x="190.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">9</text><text x="336.0" y="40.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n &gt; 0: 5 &gt; 0</text><text x="336.0" y="64.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">берём цифру</text><text x="16.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">снятые цифры справа налево</text><text x="16.0" y="142.0" font-family="inherit" font-size="20" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2 7 0</text></svg>',
        caption: "n = 5: последняя цифра n % 10 = 5, n // 10 = 0.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 160"><rect x="16" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="30.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">n — что осталось</text><text x="30.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">0</text><rect x="176" y="14" width="146" height="64" rx="10" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="190.0" y="36.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">digit_sum</text><text x="190.0" y="66.0" font-family="inherit" font-size="24" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">14</text><text x="336.0" y="40.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">n &gt; 0: 0 &gt; 0</text><text x="336.0" y="64.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">цифры кончились</text><text x="16.0" y="112.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">снятые цифры справа налево</text><text x="16.0" y="142.0" font-family="inherit" font-size="20" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">2 7 0 5</text></svg>',
        caption: "n = 0 — цикл закончен. Сумма цифр 5072 равна 14.",
      },
    ],
  },
  // %%loop_checks("i = 1\ntotal = 0\nwhile i <= 4:\n    total += i\n    i += 1\nprint(total)", ["i", "total"], tone="python")%%
  loopChecks: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 226"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">значения перед каждой проверкой условия</text><rect x="16.0" y="44.0" width="96.8" height="128.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="64.4" y="64.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">проверка 1</text><text x="64.4" y="90.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 1</text><text x="64.4" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="75.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">total = 0</text><path d="M 26.0 130 H 102.8" stroke="#d9d9d4"/><text x="64.4" y="148.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="43.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i &lt;= 4</text><text x="64.4" y="165.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="33.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">True</text><line x1="115.8" y1="108.0" x2="136.8" y2="108.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 145.8 108.0 L 136.8 112.5 L 136.8 103.5 Z" fill="#4d535e"/><text x="130.8" y="126.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">тело</text><rect x="148.8" y="44.0" width="96.8" height="128.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="197.2" y="64.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">проверка 2</text><text x="197.2" y="90.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 2</text><text x="197.2" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="75.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">total = 1</text><path d="M 158.8 130 H 235.6" stroke="#d9d9d4"/><text x="197.2" y="148.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="43.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i &lt;= 4</text><text x="197.2" y="165.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="33.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">True</text><line x1="248.6" y1="108.0" x2="269.6" y2="108.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 278.6 108.0 L 269.6 112.5 L 269.6 103.5 Z" fill="#4d535e"/><text x="263.6" y="126.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">тело</text><rect x="281.6" y="44.0" width="96.8" height="128.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="330.0" y="64.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">проверка 3</text><text x="330.0" y="90.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 3</text><text x="330.0" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="75.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">total = 3</text><path d="M 291.6 130 H 368.4" stroke="#d9d9d4"/><text x="330.0" y="148.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="43.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i &lt;= 4</text><text x="330.0" y="165.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="33.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">True</text><line x1="381.4" y1="108.0" x2="402.4" y2="108.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 411.4 108.0 L 402.4 112.5 L 402.4 103.5 Z" fill="#4d535e"/><text x="396.4" y="126.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">тело</text><rect x="414.4" y="44.0" width="96.8" height="128.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="462.8" y="64.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">проверка 4</text><text x="462.8" y="90.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 4</text><text x="462.8" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="75.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">total = 6</text><path d="M 424.4 130 H 501.2" stroke="#d9d9d4"/><text x="462.8" y="148.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="43.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i &lt;= 4</text><text x="462.8" y="165.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="33.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">True</text><line x1="514.2" y1="108.0" x2="535.2" y2="108.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 544.2 108.0 L 535.2 112.5 L 535.2 103.5 Z" fill="#4d535e"/><text x="529.2" y="126.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">тело</text><rect x="547.2" y="44.0" width="96.8" height="128.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="595.6" y="64.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">проверка 5</text><text x="595.6" y="90.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 5</text><text x="595.6" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="84.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">total = 10</text><path d="M 557.2 130 H 634.0" stroke="#d9d9d4"/><text x="595.6" y="148.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="43.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i &lt;= 4</text><text x="595.6" y="165.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#3f6aa6" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">False</text><text x="16.0" y="202.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">условие ложно — цикл закончен</text><text x="595.6" y="196.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">вывод</text><text x="595.6" y="214.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="16.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">10</text></svg>',
    width: 660,
    height: 226,
    alt: "Значения перед каждой проверкой условия",
  },
  runCount: {
    kind: "run",
    code: "i = 1\nwhile i <= 4:\n    print(i)\n    i += 1",
    fileName: "main.py",
    output: "1\n2\n3\n4",
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
        text: "`i` получает значение `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "1", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "1", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "На экран выводится «1».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "1", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "2", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "1\n",
      },
      {
        line: 2,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "2", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n",
      },
      {
        line: 3,
        text: "На экран выводится «2».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "2", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n2\n",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "3", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "1\n2\n",
      },
      {
        line: 2,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "3", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n2\n",
      },
      {
        line: 3,
        text: "На экран выводится «3».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "3", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n2\n3\n",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "4", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "1\n2\n3\n",
      },
      {
        line: 2,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "4", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n2\n3\n",
      },
      {
        line: 3,
        text: "На экран выводится «4».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "4", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n2\n3\n4\n",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `4`, стало `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "5", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "1\n2\n3\n4\n",
      },
      {
        line: 2,
        text: "Проверка `i <= 4` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "5", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "1\n2\n3\n4\n",
      },
    ],
  },
  runOdd: {
    kind: "run",
    code: "i = 0\ntotal = 0\nwhile i < 6:\n    i += 1\n    if i % 2 == 0:\n        continue\n    total += i\nprint(total)",
    fileName: "main.py",
    output: "9",
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
        text: "`i` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "0", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`total` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "0", ref: null, ch: false },
              { n: "total", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "0", ref: null, ch: false },
              { n: "total", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: true },
              { n: "total", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `i % 2 == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: false },
              { n: "total", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`total += i`: значение `total` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: true },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `i % 2 == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "`continue`: остаток тела пропускается, цикл переходит к следующему шагу.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: true },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `i % 2 == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`total += i`: значение `total` увеличилось — было `1`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: false },
              { n: "total", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: false },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: true },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `i % 2 == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: false },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "`continue`: остаток тела пропускается, цикл переходит к следующему шагу.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: false },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: false },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `4`, стало `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: true },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `i % 2 == 0` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: false },
              { n: "total", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`total += i`: значение `total` увеличилось — было `4`, стало `9`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: false },
              { n: "total", v: "9", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: false },
              { n: "total", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`i += 1`: значение `i` увеличилось — было `5`, стало `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "6", ref: null, ch: true },
              { n: "total", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Проверка `i % 2 == 0` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "6", ref: null, ch: false },
              { n: "total", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "`continue`: остаток тела пропускается, цикл переходит к следующему шагу.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "6", ref: null, ch: false },
              { n: "total", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i < 6` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "6", ref: null, ch: false },
              { n: "total", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "На экран выводится «9».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "6", ref: null, ch: false },
              { n: "total", v: "9", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "9\n",
      },
    ],
  },
  runSum1To4: {
    kind: "run",
    code: "i = 1\ntotal = 0\nwhile i <= 4:\n    total += i\n    i += 1\nprint(total)",
    fileName: "main.py",
    output: "10",
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
        text: "`i` получает значение `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "i", v: "1", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`total` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: false },
              { n: "total", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: false },
              { n: "total", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`total += i`: значение `total` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "1", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i += 1`: значение `i` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: true },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: false },
              { n: "total", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`total += i`: значение `total` увеличилось — было `1`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "2", ref: null, ch: false },
              { n: "total", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i += 1`: значение `i` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: true },
              { n: "total", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: false },
              { n: "total", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`total += i`: значение `total` увеличилось — было `3`, стало `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "3", ref: null, ch: false },
              { n: "total", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i += 1`: значение `i` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: true },
              { n: "total", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i <= 4` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: false },
              { n: "total", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`total += i`: значение `total` увеличилось — было `6`, стало `10`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "4", ref: null, ch: false },
              { n: "total", v: "10", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i += 1`: значение `i` увеличилось — было `4`, стало `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: true },
              { n: "total", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `i <= 4` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: false },
              { n: "total", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "На экран выводится «10».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "i", v: "5", ref: null, ch: false },
              { n: "total", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "10\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
