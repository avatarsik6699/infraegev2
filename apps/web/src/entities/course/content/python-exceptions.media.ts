// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%code_paths([["text = \"21\"", "text = \"21\"\ntry:\n    number = int(text)\nexcept ValueError:\n    print(\"Нужно ввести целое число\")\nelse:\n    print(number * 2)"], ["text = \"abc\"", "text = \"abc\"\ntry:\n    number = int(text)\nexcept ValueError:\n    print(\"Нужно ввести целое число\")\nelse:\n    print(number * 2)"]], tone="python")%%
  tryPaths: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 286"><text x="16.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">text = &quot;21&quot;</text><circle cx="20.0" cy="53" r="3.5" fill="#3f6aa6"/><text x="32.0" y="58.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="85.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">text = &quot;21&quot;</text><circle cx="20.0" cy="77" r="3.5" fill="#3f6aa6"/><text x="32.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="31.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">try:</text><path d="M 36.0 89 V 113" stroke="#d9d9d4" stroke-width="2"/><circle cx="20.0" cy="101" r="3.5" fill="#3f6aa6"/><text x="32.0" y="106.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="171.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    number = int(text)</text><text x="32.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="140.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">except ValueError:</text><path d="M 36.0 137 V 161" stroke="#d9d9d4" stroke-width="2"/><text x="32.0" y="154.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="288.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(&quot;Нужно ввести целое число&quot;)</text><circle cx="20.0" cy="173" r="3.5" fill="#3f6aa6"/><text x="32.0" y="178.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="39.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">else:</text><path d="M 36.0 185 V 209" stroke="#d9d9d4" stroke-width="2"/><circle cx="20.0" cy="197" r="3.5" fill="#3f6aa6"/><text x="32.0" y="202.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="163.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(number * 2)</text><text x="32.0" y="240.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вывод:</text><text x="32.0" y="260.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="15.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">42</text><text x="346.0" y="22.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">text = &quot;abc&quot;</text><circle cx="350.0" cy="53" r="3.5" fill="#3f6aa6"/><text x="362.0" y="58.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="93.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">text = &quot;abc&quot;</text><circle cx="350.0" cy="77" r="3.5" fill="#3f6aa6"/><text x="362.0" y="82.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="31.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">try:</text><path d="M 366.0 89 V 113" stroke="#d9d9d4" stroke-width="2"/><circle cx="350.0" cy="101" r="3.5" fill="#3f6aa6"/><text x="362.0" y="106.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="171.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    number = int(text)</text><circle cx="350.0" cy="125" r="3.5" fill="#3f6aa6"/><text x="362.0" y="130.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="140.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">except ValueError:</text><path d="M 366.0 137 V 161" stroke="#d9d9d4" stroke-width="2"/><circle cx="350.0" cy="149" r="3.5" fill="#3f6aa6"/><text x="362.0" y="154.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#17191e" text-anchor="start" textLength="288.6" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(&quot;Нужно ввести целое число&quot;)</text><text x="362.0" y="178.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="39.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">else:</text><path d="M 366.0 185 V 209" stroke="#d9d9d4" stroke-width="2"/><text x="362.0" y="202.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="500" fill="#d9d9d4" text-anchor="start" textLength="163.8" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">    print(number * 2)</text><text x="362.0" y="240.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вывод:</text><text x="362.0" y="260.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="600" fill="#17191e" text-anchor="start" textLength="187.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">Нужно ввести целое число</text><path d="M 330.0 8 V 278" stroke="#d9d9d4"/></svg>',
    width: 660,
    height: 286,
    alt: "Какие строки программы выполняются",
  },
  // run notes: "7: Ошибки не было — выполняется блок `else`: на экран выводится «14».\n9: `finally` выполняется в любом случае: на экран выводится «проверено 7».\n9.2: И после перехваченной ошибки `finally` выполняется: на экран выводится «проверено x»."
  runParseNumbers: {
    kind: "run",
    code: 'for text in ["7", "x"]:\n    try:\n        number = int(text)\n    except ValueError:\n        print(text, "— не число")\n    else:\n        print(number * 2)\n    finally:\n        print("проверено", text)',
    fileName: "main.py",
    output: "14\nпроверено 7\nx — не число\nпроверено x",
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
        text: "`for` берёт первое значение: `text` = `'7'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "text", v: "'7'", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "Начинается блок `try`: если в нём возникнет ошибка, сработает `except`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "text", v: "'7'", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Python вычисляет `int(text)` → `7`, и `number` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'7'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Ошибки не было — выполняется блок `else`: на экран выводится «14».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'7'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\n",
      },
      {
        line: 9,
        text: "`finally` выполняется в любом случае: на экран выводится «проверено 7».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'7'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\n",
      },
      {
        line: 1,
        text: "`for` берёт следующее значение: `text` = `'x'`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: true },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\n",
      },
      {
        line: 2,
        text: "Начинается блок `try`: если в нём возникнет ошибка, сработает `except`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\n",
      },
      {
        line: 3,
        text: "Ошибка `ValueError: invalid literal for int() with base 10: 'x'`: выполнение переходит к блоку `except`.",
        kind: "error",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\n",
        error: "ValueError: invalid literal for int() with base 10: 'x'",
      },
      {
        line: 4,
        text: "Ошибка перехвачена: выполняется блок `except`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\n",
      },
      {
        line: 5,
        text: "На экран выводится «x — не число».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\nx — не число\n",
      },
      {
        line: 9,
        text: "И после перехваченной ошибки `finally` выполняется: на экран выводится «проверено x».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\nx — не число\nпроверено x\n",
      },
      {
        line: 1,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "text", v: "'x'", ref: null, ch: false },
              { n: "number", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "14\nпроверено 7\nx — не число\nпроверено x\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
