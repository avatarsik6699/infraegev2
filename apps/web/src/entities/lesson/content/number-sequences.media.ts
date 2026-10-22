// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%seq_strip([125, 1300, -1250, -2100, 7, -325, 2025, 3000])%%
  seqStrip_93ecbe: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 150"><text x="74.0" y="30.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">номер</text><text x="74.0" y="76.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">значение</text><text x="74.0" y="122.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">индекс</text><text x="118.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="86.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="118.0" y="75.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">125</text><text x="118.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[0]</text><text x="190.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="158.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="190.0" y="75.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1300</text><text x="190.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[1]</text><text x="262.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="230.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="262.0" y="75.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1250</text><text x="262.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[2]</text><text x="334.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="302.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="334.0" y="75.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−2100</text><text x="334.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[3]</text><text x="406.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="374.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="406.0" y="75.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="406.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[4]</text><text x="478.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="446.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="478.0" y="75.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−325</text><text x="478.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[5]</text><text x="550.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><rect x="518.0" y="46.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="550.0" y="75.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2025</text><text x="550.0" y="122.0" font-family="inherit" font-size="15" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[6]</text><text x="622.0" y="30.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="590.0" y="46.0" width="64" height="44" rx="6" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="622.0" y="75.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3000</text><text x="622.0" y="122.0" font-family="inherit" font-size="15" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">a[7]</text><text x="330.0" y="145.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">n = len(a) = 8, последний индекс — n − 1 = 7</text></svg>',
    width: 660,
    height: 150,
    alt: "Элементы, их номера и индексы",
  },
  // %%seq_windows([125, 1300, -1250, -2100, 7, -325, 2025, 3000], 2)%%
  seqWindows2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 202"><rect x="62.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="94.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">125</text><text x="94.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="134.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="166.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1300</text><text x="166.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="206.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="238.0" y="59.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1250</text><text x="238.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="278.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="310.0" y="59.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−2100</text><text x="310.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="350.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="382.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="382.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="422.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="454.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−325</text><text x="454.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="494.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="526.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2025</text><text x="526.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="566.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="598.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3000</text><text x="598.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="50.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">индекс</text><path d="M 68.0 108 v 8 H 192.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="130.0" y="134.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 0</text><path d="M 140.0 138 v 8 H 264.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="202.0" y="164.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 1</text><path d="M 212.0 108 v 8 H 336.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="274.0" y="134.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 2</text><path d="M 284.0 138 v 8 H 408.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="346.0" y="164.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 3</text><path d="M 356.0 108 v 8 H 480.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="418.0" y="134.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 4</text><path d="M 428.0 138 v 8 H 552.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="490.0" y="164.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 5</text><path d="M 500.0 108 v 8 H 624.0 v -8" fill="none" stroke="#ff6a00" stroke-width="2" stroke-linejoin="round"/><text x="562.0" y="134.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 6</text><text x="330.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">n = 8: последнее начало i = n − 2 = 6, всего пар n − 1 = 7</text></svg>',
    width: 660,
    height: 202,
    alt: "Соседние группы по 2",
  },
  // run notes: "1: `a` — восемь чисел задачи темы.\n2: `sums` — пустой список: сюда попадут суммы подходящих троек.\n3.1: Первая тройка начинается с индекса `i` = `0`.\n4.1: Тройка `125, 1300, -1250`: сумма `175`.\n5.1: `175 <= 2025` — тройка подходит.\n6.1: Сумма `175` попадает в `sums`.\n3.2: `i` = `1` — тройка сдвинулась на одно число.\n4.2: Тройка `1300, -1250, -2100`: сумма `-2050`.\n4.3: Тройка `-1250, -2100, 7`: сумма `-3343`.\n4.4: Тройка `-2100, 7, -325`: сумма `-2418`.\n4.5: Тройка `7, -325, 2025`: сумма `1707`.\n4.6: Тройка `-325, 2025, 3000`: сумма `4700`.\n5.6: `4700 <= 2025` неверно — тройка не подходит, её сумма в список не попадает.\n5.2: `-2050 <= 2025` — тройка подходит.\n6.2: Сумма `-2050` попадает в `sums`.\n5.3: `-3343 <= 2025` — тройка подходит.\n6.3: Сумма `-3343` попадает в `sums`.\n5.4: `-2418 <= 2025` — тройка подходит.\n6.4: Сумма `-2418` попадает в `sums`.\n5.5: `1707 <= 2025` — тройка подходит.\n6.5: Сумма `1707` попадает в `sums`.\n3.3: `i` = `2` — следующая тройка.\n3.4: `i` = `3` — следующая тройка.\n3.5: `i` = `4` — следующая тройка.\n3.6: `i` = `5` — следующая тройка.\n3.7: Начала от `0` до `5` закончились — все шесть троек проверены.\n7: Подошли пять троек: `len(sums)` = `5`, наибольшая сумма `max(sums)` = `1707`."
  runTriples: {
    kind: "run",
    code: "a = [125, 1300, -1250, -2100, 7, -325, 2025, 3000]\nsums = []\nfor i in range(len(a) - 2):\n    s = a[i] + a[i + 1] + a[i + 2]\n    if s <= 2025:\n        sums.append(s)\nprint(len(sums), max(sums))",
    fileName: "triples.py",
    output: "5 1707",
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
        text: "`a` — восемь чисел задачи темы.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: true,
              },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: true,
          },
        },
        out: "",
      },
      {
        line: 2,
        text: "`sums` — пустой список: сюда попадут суммы подходящих троек.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[]", ref: 1, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[]", ch: true },
        },
        out: "",
      },
      {
        line: 3,
        text: "Первая тройка начинается с индекса `i` = `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[]", ref: 1, ch: false },
              { n: "i", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[]", ch: false },
        },
        out: "",
      },
      {
        line: 4,
        text: "Тройка `125, 1300, -1250`: сумма `175`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[]", ref: 1, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "s", v: "175", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[]", ch: false },
        },
        out: "",
      },
      {
        line: 5,
        text: "`175 <= 2025` — тройка подходит.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[]", ref: 1, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "s", v: "175", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[]", ch: false },
        },
        out: "",
      },
      {
        line: 6,
        text: "Сумма `175` попадает в `sums`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175]", ref: 1, ch: true },
              { n: "i", v: "0", ref: null, ch: false },
              { n: "s", v: "175", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175]", ch: true },
        },
        out: "",
      },
      {
        line: 3,
        text: "`i` = `1` — тройка сдвинулась на одно число.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175]", ref: 1, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
              { n: "s", v: "175", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175]", ch: false },
        },
        out: "",
      },
      {
        line: 4,
        text: "Тройка `1300, -1250, -2100`: сумма `-2050`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175]", ref: 1, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "s", v: "-2050", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175]", ch: false },
        },
        out: "",
      },
      {
        line: 5,
        text: "`-2050 <= 2025` — тройка подходит.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175]", ref: 1, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "s", v: "-2050", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175]", ch: false },
        },
        out: "",
      },
      {
        line: 6,
        text: "Сумма `-2050` попадает в `sums`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050]", ref: 1, ch: true },
              { n: "i", v: "1", ref: null, ch: false },
              { n: "s", v: "-2050", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050]", ch: true },
        },
        out: "",
      },
      {
        line: 3,
        text: "`i` = `2` — следующая тройка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050]", ref: 1, ch: false },
              { n: "i", v: "2", ref: null, ch: true },
              { n: "s", v: "-2050", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050]", ch: false },
        },
        out: "",
      },
      {
        line: 4,
        text: "Тройка `-1250, -2100, 7`: сумма `-3343`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050]", ref: 1, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "s", v: "-3343", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050]", ch: false },
        },
        out: "",
      },
      {
        line: 5,
        text: "`-3343 <= 2025` — тройка подходит.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050]", ref: 1, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "s", v: "-3343", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050]", ch: false },
        },
        out: "",
      },
      {
        line: 6,
        text: "Сумма `-3343` попадает в `sums`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343]", ref: 1, ch: true },
              { n: "i", v: "2", ref: null, ch: false },
              { n: "s", v: "-3343", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343]", ch: true },
        },
        out: "",
      },
      {
        line: 3,
        text: "`i` = `3` — следующая тройка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343]", ref: 1, ch: false },
              { n: "i", v: "3", ref: null, ch: true },
              { n: "s", v: "-3343", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343]", ch: false },
        },
        out: "",
      },
      {
        line: 4,
        text: "Тройка `-2100, 7, -325`: сумма `-2418`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343]", ref: 1, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "s", v: "-2418", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343]", ch: false },
        },
        out: "",
      },
      {
        line: 5,
        text: "`-2418 <= 2025` — тройка подходит.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343]", ref: 1, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "s", v: "-2418", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343]", ch: false },
        },
        out: "",
      },
      {
        line: 6,
        text: "Сумма `-2418` попадает в `sums`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343, -2418]", ref: 1, ch: true },
              { n: "i", v: "3", ref: null, ch: false },
              { n: "s", v: "-2418", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418]", ch: true },
        },
        out: "",
      },
      {
        line: 3,
        text: "`i` = `4` — следующая тройка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343, -2418]", ref: 1, ch: false },
              { n: "i", v: "4", ref: null, ch: true },
              { n: "s", v: "-2418", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418]", ch: false },
        },
        out: "",
      },
      {
        line: 4,
        text: "Тройка `7, -325, 2025`: сумма `1707`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343, -2418]", ref: 1, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
              { n: "s", v: "1707", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418]", ch: false },
        },
        out: "",
      },
      {
        line: 5,
        text: "`1707 <= 2025` — тройка подходит.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              { n: "sums", v: "[175, -2050, -3343, -2418]", ref: 1, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
              { n: "s", v: "1707", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418]", ch: false },
        },
        out: "",
      },
      {
        line: 6,
        text: "Сумма `1707` попадает в `sums`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              {
                n: "sums",
                v: "[175, -2050, -3343, -2418, 1707]",
                ref: 1,
                ch: true,
              },
              { n: "i", v: "4", ref: null, ch: false },
              { n: "s", v: "1707", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418, 1707]", ch: true },
        },
        out: "",
      },
      {
        line: 3,
        text: "`i` = `5` — следующая тройка.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              {
                n: "sums",
                v: "[175, -2050, -3343, -2418, 1707]",
                ref: 1,
                ch: false,
              },
              { n: "i", v: "5", ref: null, ch: true },
              { n: "s", v: "1707", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418, 1707]", ch: false },
        },
        out: "",
      },
      {
        line: 4,
        text: "Тройка `-325, 2025, 3000`: сумма `4700`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              {
                n: "sums",
                v: "[175, -2050, -3343, -2418, 1707]",
                ref: 1,
                ch: false,
              },
              { n: "i", v: "5", ref: null, ch: false },
              { n: "s", v: "4700", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418, 1707]", ch: false },
        },
        out: "",
      },
      {
        line: 5,
        text: "`4700 <= 2025` неверно — тройка не подходит, её сумма в список не попадает.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              {
                n: "sums",
                v: "[175, -2050, -3343, -2418, 1707]",
                ref: 1,
                ch: false,
              },
              { n: "i", v: "5", ref: null, ch: false },
              { n: "s", v: "4700", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418, 1707]", ch: false },
        },
        out: "",
      },
      {
        line: 3,
        text: "Начала от `0` до `5` закончились — все шесть троек проверены.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              {
                n: "sums",
                v: "[175, -2050, -3343, -2418, 1707]",
                ref: 1,
                ch: false,
              },
              { n: "i", v: "5", ref: null, ch: false },
              { n: "s", v: "4700", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418, 1707]", ch: false },
        },
        out: "",
      },
      {
        line: 7,
        text: "Подошли пять троек: `len(sums)` = `5`, наибольшая сумма `max(sums)` = `1707`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "a",
                v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
                ref: 0,
                ch: false,
              },
              {
                n: "sums",
                v: "[175, -2050, -3343, -2418, 1707]",
                ref: 1,
                ch: false,
              },
              { n: "i", v: "5", ref: null, ch: false },
              { n: "s", v: "4700", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": {
            v: "[125, 1300, -1250, -2100, 7, -325, 2025, 3000]",
            ch: false,
          },
          "1": { v: "[175, -2050, -3343, -2418, 1707]", ch: false },
        },
        out: "5 1707\n",
      },
    ],
  },
  // %%seq_windows([125, 1300, -1250, -2100, 7, -325, 2025, 3000], 3)%%
  seqWindows3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 232"><rect x="62.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="94.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">125</text><text x="94.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><rect x="134.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="166.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1300</text><text x="166.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="206.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="238.0" y="59.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1250</text><text x="238.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="278.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="310.0" y="59.0" font-family="inherit" font-size="17" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−2100</text><text x="310.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="350.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="382.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="382.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="422.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="454.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−325</text><text x="454.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="494.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="526.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2025</text><text x="526.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="566.0" y="30.0" width="64" height="44" rx="6" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="598.0" y="59.0" font-family="inherit" font-size="19" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3000</text><text x="598.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="50.0" y="96.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">индекс</text><path d="M 68.0 108 v 8 H 264.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="166.0" y="134.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 0</text><path d="M 140.0 138 v 8 H 336.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="238.0" y="164.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 1</text><path d="M 212.0 168 v 8 H 408.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="310.0" y="194.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 2</text><path d="M 284.0 108 v 8 H 480.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="382.0" y="134.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 3</text><path d="M 356.0 138 v 8 H 552.0 v -8" fill="none" stroke="#17191e" stroke-width="1.5" stroke-linejoin="round"/><text x="454.0" y="164.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 4</text><path d="M 428.0 168 v 8 H 624.0 v -8" fill="none" stroke="#ff6a00" stroke-width="2" stroke-linejoin="round"/><text x="526.0" y="194.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">i = 5</text><text x="330.0" y="224.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">n = 8: последнее начало i = n − 3 = 5, всего троек n − 2 = 6</text></svg>',
    width: 660,
    height: 232,
    alt: "Соседние группы по 3",
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
