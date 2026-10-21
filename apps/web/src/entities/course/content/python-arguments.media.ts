// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%arg_binding(tone="python")%%
  argBinding: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 262"><text x="16.0" y="22.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="start" textLength="273.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">def final_price(price, discount=0):</text><text x="16.0" y="74.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="124.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">final_price(200)</text><rect x="360.0" y="52.0" width="136.0" height="34.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="1.5"/><text x="428.0" y="74.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="middle" textLength="85.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">price = 200</text><text x="428.0" y="104.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">по позиции</text><rect x="510.0" y="52.0" width="136.0" height="34.0" rx="8" fill="#fff" stroke="#d9d9d4" stroke-width="1.5" stroke-dasharray="5 4"/><text x="578.0" y="74.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="middle" textLength="93.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">discount = 0</text><text x="578.0" y="104.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">по умолчанию</text><text x="16.0" y="144.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="156.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">final_price(200, 10)</text><rect x="360.0" y="122.0" width="136.0" height="34.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="1.5"/><text x="428.0" y="144.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="middle" textLength="85.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">price = 200</text><text x="428.0" y="174.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">по позиции</text><rect x="510.0" y="122.0" width="136.0" height="34.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="1.5"/><text x="578.0" y="144.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="middle" textLength="101.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">discount = 10</text><text x="578.0" y="174.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">по позиции</text><text x="16.0" y="214.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="273.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">final_price(discount=10, price=200)</text><rect x="360.0" y="192.0" width="136.0" height="34.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="1.5"/><text x="428.0" y="214.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="middle" textLength="85.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">price = 200</text><text x="428.0" y="244.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">по имени</text><rect x="510.0" y="192.0" width="136.0" height="34.0" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="1.5"/><text x="578.0" y="214.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="middle" textLength="101.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">discount = 10</text><text x="578.0" y="244.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">по имени</text></svg>',
    width: 660,
    height: 262,
    alt: "Как параметры получают значения",
  },
  // %%tuple_return(tone="python")%%
  tupleReturn: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 150"><text x="16.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">функция при a = 23, b = 5</text><rect x="16.0" y="34.0" width="236.0" height="40.0" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="28.0" y="59.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="500" fill="#17191e" text-anchor="start" textLength="168.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">return a // b, a % b</text><line x1="256.0" y1="54.0" x2="283.0" y2="54.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 292.0 54.0 L 283.0 58.5 L 283.0 49.5 Z" fill="#4d535e"/><rect x="296" y="32" width="104" height="44" rx="22" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="348.0" y="59.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">(4, 3)</text><text x="348.0" y="22.0" font-family="inherit" font-size="12" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">один кортеж</text><line x1="404.0" y1="46.0" x2="461.1" y2="37.3" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 470.0 36.0 L 461.8 41.8 L 460.4 32.9 Z" fill="#3f6aa6"/><line x1="404.0" y1="62.0" x2="461.2" y2="74.1" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 470.0 76.0 L 460.3 78.5 L 462.1 69.7 Z" fill="#3f6aa6"/><rect x="474.0" y="18.0" width="90.0" height="32.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="519.0" y="39.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">q = 4</text><rect x="474.0" y="60.0" width="90.0" height="32.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="519.0" y="81.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" textLength="42.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">r = 3</text><text x="16.0" y="118.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">строка вызова раскладывает кортеж на два имени:</text><text x="16.0" y="140.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#4d535e" text-anchor="start" textLength="280.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">q, r = quotient_and_remainder(23, 5)</text></svg>',
    width: 660,
    height: 150,
    alt: "Несколько результатов — один кортеж",
  },
  // %%refs([["last_digit", 0], ["rule", 0], ["short_rule", 1]], ["функция last_digit", "функция lambda"], accent=["rule", "short_rule"], tone="python")%%
  functionNames: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 192"><rect x="230.0" y="18.0" width="222" height="40" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="341.0" y="44.0" font-family="inherit" font-size="16" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">функция last_digit</text><rect x="230.0" y="76.0" width="178" height="40" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="319.0" y="102.0" font-family="inherit" font-size="16" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">функция lambda</text><rect x="16" y="18" width="120" height="40" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="76.0" y="44.0" font-family="inherit" font-size="16" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">last_digit</text><line x1="136.0" y1="38.0" x2="221.0" y2="38.0" stroke="#17191e" stroke-width="1.5"/><path d="M 230.0 38.0 L 221.0 42.5 L 221.0 33.5 Z" fill="#17191e"/><rect x="16" y="76" width="120" height="40" rx="8" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="76.0" y="102.0" font-family="inherit" font-size="16" font-weight="600" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">rule</text><line x1="136.0" y1="96.0" x2="222.3" y2="42.7" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 230.0 38.0 L 224.7 46.6 L 220.0 38.9 Z" fill="#3f6aa6"/><rect x="16" y="134" width="120" height="40" rx="8" fill="#fff" stroke="#3f6aa6" stroke-width="2"/><text x="76.0" y="160.0" font-family="inherit" font-size="16" font-weight="600" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">short_rule</text><line x1="136.0" y1="154.0" x2="222.3" y2="100.7" stroke="#3f6aa6" stroke-width="1.5"/><path d="M 230.0 96.0 L 224.7 104.6 L 220.0 96.9 Z" fill="#3f6aa6"/></svg>',
    width: 660,
    height: 192,
    alt: "Имена и объекты",
  },
  runDefaultList: {
    kind: "run",
    code: "def add_item_bad(item, items=[]):\n    items.append(item)\n    return items\n\nprint(add_item_bad(1))\nprint(add_item_bad(2))",
    fileName: "main.py",
    output: "[1]\n[1, 2]",
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
        text: "Создана функция `add_item_bad`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "Вызывается функция `add_item_bad`. У вызова свои переменные: `item` = `1`, `items` = `[]`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов add_item_bad(1)",
            names: [
              { n: "item", v: "1", ref: null, ch: true },
              { n: "items", v: "[]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[]", ch: true } },
        out: "",
      },
      {
        line: 2,
        text: "`items.append(item)` меняет сам список, к которому ведёт `items`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов add_item_bad(1)",
            names: [
              { n: "item", v: "1", ref: null, ch: false },
              { n: "items", v: "[1]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[1]", ch: true } },
        out: "",
      },
      {
        line: 3,
        text: "Функция возвращает `[1]` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов add_item_bad(1)",
            names: [
              { n: "item", v: "1", ref: null, ch: false },
              { n: "items", v: "[1]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "На экран выводится «[1]».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "[1]\n",
      },
      {
        line: 6,
        text: "Вызывается функция `add_item_bad`. У вызова свои переменные: `item` = `2`, `items` = `[1]`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов add_item_bad(2)",
            names: [
              { n: "item", v: "2", ref: null, ch: true },
              { n: "items", v: "[1]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1]", ch: false } },
        out: "[1]\n",
      },
      {
        line: 2,
        text: "`items.append(item)` меняет сам список, к которому ведёт `items`; новый не создаётся.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов add_item_bad(2)",
            names: [
              { n: "item", v: "2", ref: null, ch: false },
              { n: "items", v: "[1, 2]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: true } },
        out: "[1]\n",
      },
      {
        line: 3,
        text: "Функция возвращает `[1, 2]` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов add_item_bad(2)",
            names: [
              { n: "item", v: "2", ref: null, ch: false },
              { n: "items", v: "[1, 2]", ref: 0, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[1, 2]", ch: false } },
        out: "[1]\n",
      },
      {
        line: 6,
        text: "На экран выводится «[1, 2]».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "add_item_bad", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "[1]\n[1, 2]\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
