// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%branch(73, 90, tone="python")%%
  branch73_90: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="8.0" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">score = 73: верный порядок</text><rect x="8" y="40" width="168" height="38" rx="19" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="92.0" y="65.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 85</text><line x1="176.0" y1="59.0" x2="205.0" y2="59.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 214.0 59.0 L 205.0 63.5 L 205.0 54.5 Z" fill="#d9d9d4"/><text x="195.0" y="52.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="216" y="40" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="266.0" y="65.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">высокий</text><line x1="92.0" y1="78.0" x2="92.0" y2="97.0" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 92.0 106.0 L 87.5 97.0 L 96.5 97.0 Z" fill="#3f6aa6"/><text x="100.0" y="96.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="8" y="106" width="168" height="38" rx="19" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="92.0" y="131.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 60</text><line x1="176.0" y1="125.0" x2="205.0" y2="125.0" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 214.0 125.0 L 205.0 129.5 L 205.0 120.5 Z" fill="#3f6aa6"/><text x="195.0" y="118.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="216" y="106" width="100" height="38" rx="8" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="266.0" y="131.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">средний</text><line x1="92.0" y1="144.0" x2="92.0" y2="163.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 92.0 172.0 L 87.5 163.0 L 96.5 163.0 Z" fill="#d9d9d4"/><text x="100.0" y="162.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="42" y="172" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="92.0" y="197.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">начальный</text><text x="344.0" y="20.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">score = 90: проверки переставлены</text><rect x="344" y="40" width="168" height="38" rx="19" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="428.0" y="65.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 60</text><line x1="512.0" y1="59.0" x2="541.0" y2="59.0" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 550.0 59.0 L 541.0 63.5 L 541.0 54.5 Z" fill="#3f6aa6"/><text x="531.0" y="52.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="552" y="40" width="100" height="38" rx="8" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="602.0" y="65.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">средний</text><line x1="428.0" y1="78.0" x2="428.0" y2="97.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 428.0 106.0 L 423.5 97.0 L 432.5 97.0 Z" fill="#d9d9d4"/><text x="436.0" y="96.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="344" y="106" width="168" height="38" rx="19" fill="#fff" stroke="#d9d9d4" stroke-width="1.25"/><text x="428.0" y="131.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#d9d9d4" text-anchor="middle" textLength="92.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">score &gt;= 85</text><line x1="512.0" y1="125.0" x2="541.0" y2="125.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 550.0 125.0 L 541.0 129.5 L 541.0 120.5 Z" fill="#d9d9d4"/><text x="531.0" y="118.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">да</text><rect x="552" y="106" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="602.0" y="131.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">высокий</text><line x1="428.0" y1="144.0" x2="428.0" y2="163.0" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 428.0 172.0 L 423.5 163.0 L 432.5 163.0 Z" fill="#d9d9d4"/><text x="436.0" y="162.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">нет</text><rect x="378" y="172" width="100" height="38" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="428.0" y="197.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">начальный</text></svg>',
    width: 660,
    height: 230,
    alt: "Порядок проверок elif",
  },
  // %%code_paths([["Сумма 2400: выполнен блок if", "order_total = 2400\nif order_total >= 2000:\n    delivery = 0\nelse:\n    delivery = 300\nprint(delivery)"], ["Сумма 1500: выполнен блок else", "order_total = 1500\nif order_total >= 2000:\n    delivery = 0\nelse:\n    delivery = 300\nprint(delivery)"]], tone="python")%%
  codePathsElse: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 262"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Сумма 2400: выполнен блок if</text><circle cx="20.0" cy="53" r="3.5" fill="#3f6aa6"/><text x="32.0" y="58.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="140.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">order_total = 2400</text><circle cx="20.0" cy="77" r="3.5" fill="#3f6aa6"/><text x="32.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="179.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if order_total &gt;= 2000:</text><path d="M 36.0 89 V 113" stroke="#d9d9d4" stroke-width="2"/><circle cx="20.0" cy="101" r="3.5" fill="#3f6aa6"/><text x="32.0" y="106.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="124.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    delivery = 0</text><text x="32.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="39.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">else:</text><path d="M 36.0 137 V 161" stroke="#d9d9d4" stroke-width="2"/><text x="32.0" y="154.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="140.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    delivery = 300</text><circle cx="20.0" cy="173" r="3.5" fill="#3f6aa6"/><text x="32.0" y="178.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="117.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">print(delivery)</text><text x="32.0" y="216.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вывод:</text><text x="32.0" y="236.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" style="white-space:pre;font-variant-ligatures:none">0</text><text x="346.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Сумма 1500: выполнен блок else</text><circle cx="350.0" cy="53" r="3.5" fill="#3f6aa6"/><text x="362.0" y="58.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="140.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">order_total = 1500</text><circle cx="350.0" cy="77" r="3.5" fill="#3f6aa6"/><text x="362.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="179.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if order_total &gt;= 2000:</text><path d="M 366.0 89 V 113" stroke="#d9d9d4" stroke-width="2"/><text x="362.0" y="106.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="124.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    delivery = 0</text><circle cx="350.0" cy="125" r="3.5" fill="#3f6aa6"/><text x="362.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="39.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">else:</text><path d="M 366.0 137 V 161" stroke="#d9d9d4" stroke-width="2"/><circle cx="350.0" cy="149" r="3.5" fill="#3f6aa6"/><text x="362.0" y="154.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="140.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    delivery = 300</text><circle cx="350.0" cy="173" r="3.5" fill="#3f6aa6"/><text x="362.0" y="178.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="117.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">print(delivery)</text><text x="362.0" y="216.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вывод:</text><text x="362.0" y="236.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="23.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">300</text><path d="M 330.0 8 V 254" stroke="#d9d9d4"/></svg>',
    width: 660,
    height: 262,
    alt: "Какие строки программы выполняются",
  },
  // %%code_paths([["Два отдельных if", "n = 12\nif n % 2 == 0:\n    print(\"чётное\")\nif n % 3 == 0:\n    print(\"делится на 3\")"], ["if и elif", "n = 12\nif n % 2 == 0:\n    print(\"чётное\")\nelif n % 3 == 0:\n    print(\"делится на 3\")"]], tone="python")%%
  codePathsElif: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 258"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Два отдельных if</text><circle cx="20.0" cy="53" r="3.5" fill="#3f6aa6"/><text x="32.0" y="58.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="46.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">n = 12</text><circle cx="20.0" cy="77" r="3.5" fill="#3f6aa6"/><text x="32.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="109.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if n % 2 == 0:</text><path d="M 36.0 89 V 113" stroke="#d9d9d4" stroke-width="2"/><circle cx="20.0" cy="101" r="3.5" fill="#3f6aa6"/><text x="32.0" y="106.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="148.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(&quot;чётное&quot;)</text><circle cx="20.0" cy="125" r="3.5" fill="#3f6aa6"/><text x="32.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="109.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if n % 3 == 0:</text><path d="M 36.0 137 V 161" stroke="#d9d9d4" stroke-width="2"/><circle cx="20.0" cy="149" r="3.5" fill="#3f6aa6"/><text x="32.0" y="154.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="195.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(&quot;делится на 3&quot;)</text><text x="32.0" y="192.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вывод:</text><text x="32.0" y="212.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="46.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">чётное</text><text x="32.0" y="232.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="93.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">делится на 3</text><text x="346.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">if и elif</text><circle cx="350.0" cy="53" r="3.5" fill="#3f6aa6"/><text x="362.0" y="58.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="46.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">n = 12</text><circle cx="350.0" cy="77" r="3.5" fill="#3f6aa6"/><text x="362.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="109.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">if n % 2 == 0:</text><path d="M 366.0 89 V 113" stroke="#d9d9d4" stroke-width="2"/><circle cx="350.0" cy="101" r="3.5" fill="#3f6aa6"/><text x="362.0" y="106.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="148.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(&quot;чётное&quot;)</text><text x="362.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="124.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">elif n % 3 == 0:</text><path d="M 366.0 137 V 161" stroke="#d9d9d4" stroke-width="2"/><text x="362.0" y="154.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="195.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(&quot;делится на 3&quot;)</text><text x="362.0" y="192.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вывод:</text><text x="362.0" y="212.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="46.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">чётное</text><path d="M 330.0 8 V 250" stroke="#d9d9d4"/></svg>',
    width: 660,
    height: 258,
    alt: "Какие строки программы выполняются",
  },
  // run notes: "6: Лучшее пока — первое число: `best` связывается с `5`.\n10: `10` больше лучшего, теперь лучшее — оно: `best` связывается с `10`."
  runTotal: {
    kind: "run",
    code: "a = 5\nb = -2\nc = 10\nd = 7\ntotal = a + b + c + d\nbest = a\nif b > best:\n    best = b\nif c > best:\n    best = c\nif d > best:\n    best = d\nprint(total, best)",
    fileName: "main.py",
    output: "20 10",
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
        text: "`a` получает значение `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "a", v: "5", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`b` получает значение `-2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`c` получает значение `10`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`d` получает значение `7`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Python вычисляет `a + b + c + d` → `20`, и `total` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Лучшее пока — первое число: `best` связывается с `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: false },
              { n: "best", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Проверка `b > best` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: false },
              { n: "best", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 9,
        text: "Проверка `c > best` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: false },
              { n: "best", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 10,
        text: "`10` больше лучшего, теперь лучшее — оно: `best` связывается с `10`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: false },
              { n: "best", v: "10", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Проверка `d > best` даёт `False` — блок пропускается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: false },
              { n: "best", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 13,
        text: "На экран выводится «20 10».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "a", v: "5", ref: null, ch: false },
              { n: "b", v: "-2", ref: null, ch: false },
              { n: "c", v: "10", ref: null, ch: false },
              { n: "d", v: "7", ref: null, ch: false },
              { n: "total", v: "20", ref: null, ch: false },
              { n: "best", v: "10", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "20 10\n",
      },
    ],
  },
  runLevel: {
    kind: "run",
    code: 'score = 73\nif score >= 85:\n    level = "высокий"\nelif score >= 60:\n    level = "средний"\nelse:\n    level = "начальный"\nprint(level)',
    fileName: "main.py",
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
