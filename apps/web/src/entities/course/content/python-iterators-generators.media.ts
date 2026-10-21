// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%cursor(["10", "20", "30"], [["next(iterator)", 1, "10", "next выдаёт элемент на позиции и сдвигает её."], ["next(iterator)", 1, "20", "Ещё один next — следующий элемент."], ["list(iterator)", "rest", "[30]", "list забирает всё, что осталось после позиции."], ["list(iterator)", "rest", "[]", "Позиция уже в конце: итератор исчерпан, второй list пуст. Сам список numbers не изменился — из него можно получить новый итератор."]], "iter(numbers) создаёт итератор: позиция перед первым элементом.", tone="python")%%
  cursoriternumbers: {
    kind: "stepper",
    width: 660,
    height: 170,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 170"><rect x="205.0" y="16" width="78" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="244.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">10</text><rect x="291.0" y="16" width="78" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="330.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">20</text><rect x="377.0" y="16" width="78" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="416.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">30</text><line x1="201.0" y1="98.0" x2="201.0" y2="79.0" stroke="#3f6aa6" stroke-width="2"/><path d="M 201.0 70.0 L 205.5 79.0 L 196.5 79.0 Z" fill="#3f6aa6"/><text x="201.0" y="116.0" font-family="inherit" font-size="13" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">позиция</text></svg>',
        caption:
          "iter(numbers) создаёт итератор: позиция перед первым элементом.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 170"><rect x="205.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="244.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">10</text><rect x="291.0" y="16" width="78" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="330.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">20</text><rect x="377.0" y="16" width="78" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="416.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">30</text><line x1="287.0" y1="98.0" x2="287.0" y2="79.0" stroke="#3f6aa6" stroke-width="2"/><path d="M 287.0 70.0 L 291.5 79.0 L 282.5 79.0 Z" fill="#3f6aa6"/><text x="287.0" y="116.0" font-family="inherit" font-size="13" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">позиция</text><text x="16.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="start" textLength="126.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">next(iterator)</text><text x="644.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#3f6aa6" text-anchor="end" textLength="36.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">→ 10</text></svg>',
        caption: "next выдаёт элемент на позиции и сдвигает её.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 170"><rect x="205.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="244.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">10</text><rect x="291.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="330.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">20</text><rect x="377.0" y="16" width="78" height="48" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="416.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">30</text><line x1="373.0" y1="98.0" x2="373.0" y2="79.0" stroke="#3f6aa6" stroke-width="2"/><path d="M 373.0 70.0 L 377.5 79.0 L 368.5 79.0 Z" fill="#3f6aa6"/><text x="373.0" y="116.0" font-family="inherit" font-size="13" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">позиция</text><text x="16.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="start" textLength="126.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">next(iterator)</text><text x="644.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#3f6aa6" text-anchor="end" textLength="36.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">→ 20</text></svg>',
        caption: "Ещё один next — следующий элемент.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 170"><rect x="205.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="244.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">10</text><rect x="291.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="330.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">20</text><rect x="377.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#3f6aa6" stroke-width="2"/><text x="416.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#17191e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">30</text><line x1="459.0" y1="98.0" x2="459.0" y2="79.0" stroke="#3f6aa6" stroke-width="2"/><path d="M 459.0 70.0 L 463.5 79.0 L 454.5 79.0 Z" fill="#3f6aa6"/><text x="459.0" y="116.0" font-family="inherit" font-size="13" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">позиция</text><text x="16.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="start" textLength="126.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">list(iterator)</text><text x="644.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#3f6aa6" text-anchor="end" textLength="54.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">→ [30]</text></svg>',
        caption: "list забирает всё, что осталось после позиции.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 170"><rect x="205.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="244.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">10</text><rect x="291.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="330.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">20</text><rect x="377.0" y="16" width="78" height="48" rx="8" fill="#f3f3f1" stroke="#d9d9d4" stroke-width="1.5"/><text x="416.0" y="46.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="19.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">30</text><line x1="459.0" y1="98.0" x2="459.0" y2="79.0" stroke="#3f6aa6" stroke-width="2"/><path d="M 459.0 70.0 L 463.5 79.0 L 454.5 79.0 Z" fill="#3f6aa6"/><text x="459.0" y="116.0" font-family="inherit" font-size="13" font-weight="400" fill="#3f6aa6" text-anchor="middle" style="font-variant-numeric:tabular-nums">позиция</text><text x="16.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#17191e" text-anchor="start" textLength="126.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">list(iterator)</text><text x="644.0" y="150.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="15" font-weight="500" fill="#3f6aa6" text-anchor="end" textLength="36.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">→ []</text></svg>',
        caption:
          "Позиция уже в конце: итератор исчерпан, второй list пуст. Сам список numbers не изменился — из него можно получить новый итератор.",
      },
    ],
  },
  runSquaresUpTo: {
    kind: "run",
    code: "def squares_up_to(limit):\n    n = 1\n    while n * n <= limit:\n        yield n * n\n        n += 1\n\nprint(list(squares_up_to(20)))",
    fileName: "main.py",
    output: "[1, 4, 9, 16]",
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
        text: "Создана функция `squares_up_to`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Вызывается функция `squares_up_to`. У вызова свои переменные: `limit` = `20`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [{ n: "limit", v: "20", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 2,
        text: "`n` получает значение `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `n * n <= limit` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`yield` отдаёт `1` и ставит `squares_up_to` на паузу; его переменные сохраняются до следующего запроса.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20) — на паузе",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Нужно следующее значение: `squares_up_to` продолжает работу с места, где остановился, и помнит свои переменные.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`n += 1`: значение `n` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `n * n <= limit` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`yield` отдаёт `4` и ставит `squares_up_to` на паузу; его переменные сохраняются до следующего запроса.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20) — на паузе",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Нужно следующее значение: `squares_up_to` продолжает работу с места, где остановился, и помнит свои переменные.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`n += 1`: значение `n` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `n * n <= limit` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`yield` отдаёт `9` и ставит `squares_up_to` на паузу; его переменные сохраняются до следующего запроса.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20) — на паузе",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Нужно следующее значение: `squares_up_to` продолжает работу с места, где остановился, и помнит свои переменные.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`n += 1`: значение `n` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Проверка `n * n <= limit` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "`yield` отдаёт `16` и ставит `squares_up_to` на паузу; его переменные сохраняются до следующего запроса.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20) — на паузе",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "Нужно следующее значение: `squares_up_to` продолжает работу с места, где остановился, и помнит свои переменные.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`n += 1`: значение `n` увеличилось — было `4`, стало `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "Тело `squares_up_to` закончилось: значений больше нет.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
          {
            title: "вызов squares_up_to(20)",
            names: [
              { n: "limit", v: "20", ref: null, ch: false },
              { n: "n", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "На экран выводится «[1, 4, 9, 16]».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "squares_up_to", v: "функция", ref: null, ch: false }],
          },
        ],
        objs: {},
        out: "[1, 4, 9, 16]\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
