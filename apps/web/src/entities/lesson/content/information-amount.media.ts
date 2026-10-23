// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%pwd_parts((20, 12), ("буквы", "цифры"), common=(7, 36))%%
  pwdParts2012_b3fb67: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 322"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">буквы — 20 битов + цифры — 12 битов; клетка — байт</text><text x="24.0" y="50.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">части подряд, байты — всей записи</text><rect x="24.0" y="63.0" width="220.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="244.0" y="63.0" width="132.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="24.0" y="60.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="112.0" y="60.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="200.0" y="60.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="288.0" y="60.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><text x="24.0" y="108.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">20 + 12 = 32 бита, 32 / 8 = 4 байта</text><text x="24.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">каждой части свои байты</text><rect x="24.0" y="155.0" width="220.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="244.0" y="155.0" width="44.0" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="152.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="112.0" y="152.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="200.0" y="152.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="24.0" y1="148.0" x2="24.0" y2="182.0" stroke="#17191e" stroke-width="2"/><rect x="288.0" y="155.0" width="132.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="420.0" y="155.0" width="44.0" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="288.0" y="152.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="376.0" y="152.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="288.0" y1="148.0" x2="288.0" y2="182.0" stroke="#17191e" stroke-width="2"/><line x1="464.0" y1="148.0" x2="464.0" y2="182.0" stroke="#17191e" stroke-width="2"/><text x="24.0" y="200.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">20 / 8 = 2,5 → 3; 12 / 8 = 1,5 → 2; 3 + 2 = 5 байтов</text><text x="24.0" y="234.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">один код на все 7 символов: алфавит 36</text><rect x="24.0" y="247.0" width="66.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="90.0" y="247.0" width="66.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="156.0" y="247.0" width="66.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="222.0" y="247.0" width="66.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="288.0" y="247.0" width="66.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="354.0" y="247.0" width="66.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="420.0" y="247.0" width="66.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="486.0" y="247.0" width="66.0" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="244.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="112.0" y="244.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="200.0" y="244.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="288.0" y="244.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="376.0" y="244.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="464.0" y="244.0" width="88.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><text x="24.0" y="292.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">7 · 6 = 42 бита, 42 / 8 = 5,25 → 6 байтов</text><text x="330.0" y="312.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">обведённые клетки — выделенные, но пустые биты</text></svg>',
    width: 660,
    height: 322,
    alt: "Части записи в битах и целые байты",
  },
  // %%pwd_number(3)%%
  pwdNumber3: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 212"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 бита дают 8 кодов: от 000 до 111, то есть от 0 до 7</text><text x="16.0" y="68.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">8 объектов</text><text x="16.0" y="86.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">коды 0 … 7</text><text x="16.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">числа 1 … 8</text><text x="16.0" y="160.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">двоичной записью</text><text x="174.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№1</text><rect x="150.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="174.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">000</text><rect x="150.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="174.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">001</text><text x="174.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="226.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№2</text><rect x="202.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="226.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">001</text><rect x="202.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="226.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">010</text><text x="226.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="278.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№3</text><rect x="254.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="278.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">010</text><rect x="254.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="278.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">011</text><text x="278.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="330.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№4</text><rect x="306.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="330.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">011</text><rect x="306.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="330.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">100</text><text x="330.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="382.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№5</text><rect x="358.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="382.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">100</text><rect x="358.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="382.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">101</text><text x="382.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="434.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№6</text><rect x="410.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="434.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">101</text><rect x="410.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="434.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">110</text><text x="434.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="486.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№7</text><rect x="462.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="486.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">110</text><rect x="462.0" y="132.0" width="48.0" height="30.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><text x="486.0" y="152.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">111</text><text x="486.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="538.0" y="50.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">№8</text><rect x="514.0" y="58.0" width="48.0" height="30.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="538.0" y="78.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">111</text><rect x="514.0" y="132.0" width="62.0" height="30.0" rx="2" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="545.0" y="152.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">1000</text><text x="545.0" y="124.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="16.0" y="202.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">3 бит хватает 8 объектам; число 8 = 1000 — уже 4 бита: 2ʲ &gt; m, а не 2ʲ ≥ m</text></svg>',
    width: 660,
    height: 212,
    alt: "3 бита: коды объектов и двоичная запись чисел до 8",
  },
  // %%pwd_groups(10, 4)%%
  pwdGroups10_4: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 164"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">сообщение 10 байтов, группа — не больше 4, заголовок — 1 байт</text><rect x="24.0" y="46.0" width="40.0" height="36.0" rx="2" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="44.0" y="69.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">з</text><rect x="64.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><rect x="104.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><rect x="144.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><rect x="184.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="144.0" y="102.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="230.0" y="46.0" width="40.0" height="36.0" rx="2" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="250.0" y="69.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">з</text><rect x="270.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="1"/><rect x="310.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="1"/><rect x="350.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="1"/><rect x="390.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="1"/><text x="350.0" y="102.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="436.0" y="46.0" width="40.0" height="36.0" rx="2" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="456.0" y="69.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">з</text><rect x="476.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><rect x="516.0" y="46.0" width="40.0" height="36.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="1"/><text x="516.0" y="102.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="24.0" y="126.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">групп 10 / 4 = 2,5 → 3; всего 10 + 3 · 1 = 13 байтов</text><text x="330.0" y="156.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">неполная последняя группа тоже получает заголовок</text></svg>',
    width: 660,
    height: 164,
    alt: "Сообщение 10 байт группами по 4 с заголовками",
  },
  runPassword: {
    kind: "run",
    code: "from math import ceil\n\n\ndef bits(n):\n    i = 0\n    while 2 ** i < n:\n        i += 1\n    return i\n\n\ni = bits(10 + 26 + 26)\npassword = ceil(15 * i / 8)\nprint(i, 15 * i, password)",
    fileName: "password.py",
    output: "6 90 12",
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
        text: "`ceil` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "ceil", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Создана функция `bits`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Вызывается функция `bits`. У вызова свои переменные: `n` = `62`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [{ n: "n", v: "62", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i` получает значение `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`i += 1`: значение `i` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`i += 1`: значение `i` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`i += 1`: значение `i` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`i += 1`: значение `i` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`i += 1`: значение `i` увеличилось — было `4`, стало `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 7,
        text: "`i += 1`: значение `i` увеличилось — было `5`, стало `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "Проверка `2 ** i < n` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 8,
        text: "Функция возвращает `6` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов bits(62)",
            names: [
              { n: "n", v: "62", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 11,
        text: "Python вычисляет `bits(10 + 26 + 26)` → `6`, и `i` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 12,
        text: "Python вычисляет `ceil(15 * i / 8)` → `12`, и `password` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: false },
              { n: "password", v: "12", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 13,
        text: "На экран выводится «6 90 12».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "bits", v: "функция", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: false },
              { n: "password", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "6 90 12\n",
      },
    ],
  },
  runMinBits: {
    kind: "run",
    code: "from math import ceil\n\ni = 1\nwhile 40 * (ceil(15 * i / 8) + 18) <= 1200:\n    i += 1\nprint(i, 2 ** (i - 1) + 1)",
    fileName: "min_bits.py",
    output: "7 65",
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
        text: "`ceil` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "ceil", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 3,
        text: "`i` получает значение `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "1", ref: null, ch: false },
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
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "2", ref: null, ch: false },
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
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "3", ref: null, ch: false },
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
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "4", ref: null, ch: false },
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
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i += 1`: значение `i` увеличилось — было `5`, стало `6`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `True` — тело цикла выполняется.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "6", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 5,
        text: "`i += 1`: значение `i` увеличилось — было `6`, стало `7`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "7", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Проверка `40 * (ceil(15 * i / 8) + 18) <= 1200` даёт `False` — цикл закончен, программа идёт дальше.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 6,
        text: "На экран выводится «7 65».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "ceil", v: "функция", ref: null, ch: false },
              { n: "i", v: "7", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "7 65\n",
      },
    ],
  },
  // %%vol_ladder(62, 7)%%
  volLadder62_7: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">i бит дают 2ⁱ разных кодов; степени стоят на равных расстояниях</text><line x1="50.0" y1="90.0" x2="620.0" y2="90.0" stroke="#d9d9d4" stroke-width="2"/><text x="16.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">2ⁱ</text><text x="16.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">i</text><circle cx="50.0" cy="90" r="5" fill="#17191e" stroke="#17191e" stroke-width="1"/><text x="50.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="50.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><circle cx="145.0" cy="90" r="5" fill="#17191e" stroke="#17191e" stroke-width="1"/><text x="145.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="145.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><circle cx="240.0" cy="90" r="5" fill="#17191e" stroke="#17191e" stroke-width="1"/><text x="240.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="240.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><circle cx="335.0" cy="90" r="5" fill="#17191e" stroke="#17191e" stroke-width="1"/><text x="335.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">16</text><text x="335.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><circle cx="430.0" cy="90" r="5" fill="#17191e" stroke="#17191e" stroke-width="1"/><text x="430.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">32</text><text x="430.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><circle cx="525.0" cy="90" r="5" fill="#fff" stroke="#ff6a00" stroke-width="2.5"/><text x="525.0" y="120.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">64</text><text x="525.0" y="144.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><circle cx="620.0" cy="90" r="5" fill="#17191e" stroke="#17191e" stroke-width="1"/><text x="620.0" y="120.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">128</text><text x="620.0" y="144.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="519.1" y1="54.0" x2="519.1" y2="73.0" stroke="#ff6a00" stroke-width="1.5"/><path d="M 519.1 82.0 L 514.6 73.0 L 523.6 73.0 Z" fill="#ff6a00"/><text x="519.1" y="46.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">N = 62</text><text x="330.0" y="176.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">32 &lt; 62 ≤ 64: 5 бит мало, нужно 6</text></svg>',
    width: 660,
    height: 184,
    alt: "Степени двойки и 62 объектов",
  },
  // %%pwd_code(15, 6)%%
  pwdCode15_6: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 204"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">15 символов по 6 битов; сверху — номера символов, снизу — байтов</text><rect x="24.0" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="43.1" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="62.2" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="81.4" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="62.2" y1="60.0" x2="62.2" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="100.5" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="119.6" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="100.5" y1="60.0" x2="100.5" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="138.8" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="157.9" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="138.8" y1="60.0" x2="138.8" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="177.0" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="196.1" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="177.0" y1="60.0" x2="177.0" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="215.2" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="234.4" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="215.2" y1="60.0" x2="215.2" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="253.5" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="272.6" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="253.5" y1="60.0" x2="253.5" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="291.8" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="310.9" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="291.8" y1="60.0" x2="291.8" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="330.0" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="349.1" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="330.0" y1="60.0" x2="330.0" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="368.2" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="387.4" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="368.2" y1="60.0" x2="368.2" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="406.5" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="425.6" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><line x1="406.5" y1="60.0" x2="406.5" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="444.8" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="463.9" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><line x1="444.8" y1="60.0" x2="444.8" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="483.0" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="502.1" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><line x1="483.0" y1="60.0" x2="483.0" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="521.2" y="69.0" width="38.2" height="20.0" fill="#d9d9d4" stroke="none"/><text x="540.4" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text><line x1="521.2" y1="60.0" x2="521.2" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="559.5" y="69.0" width="38.2" height="20.0" fill="#f3f3f1" stroke="none"/><text x="578.6" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><line x1="559.5" y1="60.0" x2="559.5" y2="69.0" stroke="#4d535e" stroke-width="1"/><rect x="597.8" y="69.0" width="38.2" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="75.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="126.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="177.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="228.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="279.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="330.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="381.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="432.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="483.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="534.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="585.0" y="66.0" width="51.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><text x="49.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="100.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="151.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="202.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="253.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="304.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="355.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="406.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="457.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="508.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="559.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><text x="610.5" y="112.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="24.0" y="148.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">15 · 6 = 90 битов кода; байтов 90 / 8 = 11,25 → 12</text><text x="24.0" y="172.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">12 · 8 = 96 битов: 6 битов в последнем байте пустуют</text><text x="330.0" y="196.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">код символа может начаться в одном байте и закончиться в следующем</text></svg>',
    width: 660,
    height: 204,
    alt: "Пароль из 15 символов по 6 бит в байтах",
  },
  // %%pwd_bytes(3, 90)%%
  pwdBytes3_90: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 236"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 пароля по 90 битов; клетка — один байт, заливка — биты кода</text><text x="24.0" y="48.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">каждому паролю свои байты</text><rect x="24.0" y="61.0" width="191.2" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="215.2" y="61.0" width="12.8" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="228.0" y="61.0" width="191.2" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="419.2" y="61.0" width="12.8" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="432.0" y="61.0" width="191.2" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="623.2" y="61.0" width="12.8" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="41.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="58.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="75.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="92.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="109.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="126.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="143.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="160.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="177.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="194.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="211.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="228.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="245.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="262.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="279.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="296.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="313.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="330.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="347.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="364.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="381.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="398.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="415.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="432.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="449.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="466.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="483.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="500.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="517.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="534.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="551.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="568.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="585.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="602.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="619.0" y="58.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="24.0" y1="54.0" x2="24.0" y2="88.0" stroke="#17191e" stroke-width="2"/><line x1="228.0" y1="54.0" x2="228.0" y2="88.0" stroke="#17191e" stroke-width="2"/><line x1="432.0" y1="54.0" x2="432.0" y2="88.0" stroke="#17191e" stroke-width="2"/><line x1="636.0" y1="54.0" x2="636.0" y2="88.0" stroke="#17191e" stroke-width="2"/><text x="24.0" y="108.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">90 / 8 = 11,25 → 12, 3 · 12 = 36 байтов; пустует по 6 битов в каждом пароле</text><text x="24.0" y="140.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">все пароли подряд, байты — общей записи</text><rect x="24.0" y="153.0" width="191.2" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="215.2" y="153.0" width="191.2" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="406.5" y="153.0" width="191.2" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="597.8" y="153.0" width="4.2" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="41.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="58.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="75.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="92.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="109.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="126.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="143.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="160.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="177.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="194.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="211.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="228.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="245.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="262.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="279.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="296.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="313.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="330.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="347.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="364.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="381.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="398.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="415.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="432.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="449.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="466.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="483.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="500.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="517.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="534.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="551.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="568.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="585.0" y="150.0" width="17.0" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><text x="24.0" y="200.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">3 · 90 = 270 битов, 270 / 8 = 33,75 → 34 байта</text><text x="330.0" y="226.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">разница — пустые хвосты последних байтов каждого пароля</text></svg>',
    width: 660,
    height: 236,
    alt: "3 пароля по 90 бит: свои байты и подряд",
  },
  // %%pwd_record(12, 1200, 40)%%
  pwdRecord12_1200_40: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 220"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">40 одинаковых записей заняли 1 200 байтов</text><rect x="24.0" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="39.3" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="54.6" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="69.9" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="85.2" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="100.5" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="115.8" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="131.1" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="146.4" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="161.7" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="177.0" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="192.3" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="207.6" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="222.9" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="238.2" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="253.5" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="268.8" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="284.1" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="299.4" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="314.7" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="330.0" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="345.3" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="360.6" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="375.9" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="391.2" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="406.5" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="421.8" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="437.1" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="452.4" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="467.7" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="483.0" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="498.3" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="513.6" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="528.9" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="544.2" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="559.5" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="574.8" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="590.1" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="605.4" y="40.0" width="15.3" height="30.0" rx="0" fill="#f3f3f1" stroke="#17191e" stroke-width="0.75"/><rect x="620.7" y="40.0" width="15.3" height="30.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="0.75"/><rect x="24.0" y="40.0" width="15.3" height="30.0" rx="0" fill="none" stroke="#ff6a00" stroke-width="2"/><line x1="24.0" y1="70.0" x2="24.0" y2="120.0" stroke="#ff6a00" stroke-width="1" stroke-dasharray="4 4"/><line x1="39.3" y1="70.0" x2="636.0" y2="120.0" stroke="#ff6a00" stroke-width="1" stroke-dasharray="4 4"/><rect x="24.0" y="120.0" width="244.8" height="34.0" rx="0" fill="#d9d9d4" stroke="#17191e" stroke-width="1"/><rect x="268.8" y="120.0" width="367.2" height="34.0" rx="0" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="146.4" y="142.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">пароль 12 байтов</text><text x="452.4" y="142.0" font-family="inherit" font-size="13" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">сведения 18 байтов</text><text x="24.0" y="184.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">одна запись: 1 200 / 40 = 30 байтов; сведения: 30 − 12 = 18 байтов</text><text x="330.0" y="212.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">каждая запись — свой пароль и свои сведения</text></svg>',
    width: 660,
    height: 220,
    alt: "40 записей в 1200 байтах: пароль и сведения",
  },
  // %%pwd_parts((90, 20), ("пароль", "сведения"))%%
  pwdParts9020: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">пароль — 90 битов + сведения — 20 битов; клетка — байт</text><text x="24.0" y="50.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">части подряд, байты — всей записи</text><rect x="24.0" y="63.0" width="459.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="483.0" y="63.0" width="102.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="585.0" y="63.0" width="10.2" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="64.8" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="105.6" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="146.4" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="187.2" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="228.0" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="268.8" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="309.6" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="350.4" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="391.2" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="432.0" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="472.8" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="513.6" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="554.4" y="60.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><text x="24.0" y="108.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">90 + 20 = 110 битов, 110 / 8 = 13,75 → 14 байтов</text><text x="24.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">каждой части свои байты</text><rect x="24.0" y="155.0" width="459.0" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="483.0" y="155.0" width="30.6" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="64.8" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="105.6" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="146.4" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="187.2" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="228.0" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="268.8" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="309.6" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="350.4" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="391.2" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="432.0" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="472.8" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="24.0" y1="148.0" x2="24.0" y2="182.0" stroke="#17191e" stroke-width="2"/><rect x="513.6" y="155.0" width="102.0" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="615.6" y="155.0" width="20.4" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="513.6" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="554.4" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="595.2" y="152.0" width="40.8" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="513.6" y1="148.0" x2="513.6" y2="182.0" stroke="#17191e" stroke-width="2"/><line x1="636.0" y1="148.0" x2="636.0" y2="182.0" stroke="#17191e" stroke-width="2"/><text x="24.0" y="200.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">90 / 8 = 11,25 → 12; 20 / 8 = 2,5 → 3; 12 + 3 = 15 байтов</text><text x="330.0" y="220.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">обведённые клетки — выделенные, но пустые биты</text></svg>',
    width: 660,
    height: 230,
    alt: "Части записи в битах и целые байты",
  },
  // %%pwd_range(6, 12, "upper")%%
  pwdRange6_12_upper: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">биты на прямой, засечки — границы байтов; точка — K · 6</text><rect x="40.0" y="68.0" width="386.7" height="32.0" rx="2" fill="#f3f3f1" stroke="none" stroke-width="0"/><line x1="40.0" y1="84.0" x2="620.0" y2="84.0" stroke="#17191e" stroke-width="1.5"/><line x1="40.0" y1="62.0" x2="40.0" y2="106.0" stroke="#4d535e" stroke-width="1"/><text x="40.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">80</text><text x="40.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10 Б</text><line x1="233.3" y1="62.0" x2="233.3" y2="106.0" stroke="#17191e" stroke-width="2"/><text x="233.3" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">88</text><text x="233.3" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11 Б</text><line x1="426.7" y1="62.0" x2="426.7" y2="106.0" stroke="#17191e" stroke-width="2"/><text x="426.7" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">96</text><text x="426.7" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12 Б</text><line x1="620.0" y1="62.0" x2="620.0" y2="106.0" stroke="#4d535e" stroke-width="1"/><text x="620.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">104</text><text x="620.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13 Б</text><circle cx="136.7" cy="84" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="136.7" y="56.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 14</text><circle cx="281.7" cy="84" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="281.7" y="56.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 15</text><circle cx="426.7" cy="84" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="426.7" y="56.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 16</text><circle cx="571.7" cy="84" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="571.7" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 17</text><text x="16.0" y="164.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">не более 12 байтов: K · 6 ≤ 96</text><text x="16.0" y="188.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">наибольшая длина K = 16: 16 · 6 = 96 ≤ 96 &lt; 102</text></svg>',
    width: 660,
    height: 200,
    alt: "Длины кода K · 6 и границы байтов",
  },
  // %%vol_fit(1024, 30, "байт", "пользователь")%%
  volFit1024_30: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 176"><text x="30.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">вместимость 1 024 байт, один пользователь — 30 байт</text><rect x="30.0" y="40.0" width="553.8" height="44.0" rx="2" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><rect x="31.5" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="47.7" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="63.9" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="80.2" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="96.4" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="112.6" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="128.8" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="145.1" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="161.3" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="177.5" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="193.7" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="210.0" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="226.2" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="242.4" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="258.6" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="274.9" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="291.1" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="307.3" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="323.5" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="339.8" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="356.0" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="372.2" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="388.4" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="404.6" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="420.9" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="437.1" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="453.3" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="469.5" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="485.8" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="502.0" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="518.2" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="534.4" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="550.7" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="566.9" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#17191e" stroke-width="1"/><rect x="583.1" y="46.0" width="13.2" height="32.0" rx="2" fill="#fff" stroke="#ff6a00" stroke-width="2" stroke-dasharray="5 4"/><line x1="583.8" y1="32.0" x2="583.8" y2="94.0" stroke="#ff6a00" stroke-width="1.5"/><text x="30.0" y="112.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">1 024 / 30 = 34,1333</text><text x="30.0" y="136.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">целиком помещается 34; следующий выходит за границу</text><text x="30.0" y="160.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">34 · 30 = 1 020 ≤ 1 024 &lt; 1 050 = 35 · 30</text></svg>',
    width: 660,
    height: 176,
    alt: "Сколько целых объектов по 30 байт помещается в 1024 байт",
  },
  // %%pwd_range(6, 13, "lower")%%
  pwdRange6_13_lower: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="16.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">биты на прямой, засечки — границы байтов; точка — K · 6</text><rect x="233.3" y="68.0" width="386.7" height="32.0" rx="2" fill="#f3f3f1" stroke="none" stroke-width="0"/><line x1="40.0" y1="84.0" x2="620.0" y2="84.0" stroke="#17191e" stroke-width="1.5"/><line x1="40.0" y1="62.0" x2="40.0" y2="106.0" stroke="#4d535e" stroke-width="1"/><text x="40.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">88</text><text x="40.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11 Б</text><line x1="233.3" y1="62.0" x2="233.3" y2="106.0" stroke="#17191e" stroke-width="2"/><text x="233.3" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">96</text><text x="233.3" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12 Б</text><line x1="426.7" y1="62.0" x2="426.7" y2="106.0" stroke="#17191e" stroke-width="2"/><text x="426.7" y="124.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">104</text><text x="426.7" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13 Б</text><line x1="620.0" y1="62.0" x2="620.0" y2="106.0" stroke="#4d535e" stroke-width="1"/><text x="620.0" y="124.0" font-family="inherit" font-size="13" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">112</text><text x="620.0" y="142.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14 Б</text><circle cx="88.3" cy="84" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="88.3" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 15</text><circle cx="233.3" cy="84" r="4.5" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="233.3" y="56.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 16</text><circle cx="378.3" cy="84" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="378.3" y="56.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 17</text><circle cx="523.3" cy="84" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="523.3" y="56.0" font-family="inherit" font-size="12" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">K = 18</text><text x="16.0" y="164.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">больше 12 байтов: K · 6 &gt; 96</text><text x="16.0" y="188.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">наименьшая длина K = 17: 16 · 6 = 96 — ещё 12 байтов, 17 · 6 = 102 &gt; 96</text></svg>',
    width: 660,
    height: 200,
    alt: "Длины кода K · 6 и границы байтов",
  },
  // %%pwd_parts((90, 9), ("пароль", "номер"))%%
  pwdParts909: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="24.0" y="22.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">пароль — 90 битов + номер — 9 битов; клетка — байт</text><text x="24.0" y="50.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">части подряд, байты — всей записи</text><rect x="24.0" y="63.0" width="491.8" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="515.8" y="63.0" width="49.2" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="565.0" y="63.0" width="27.3" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="67.7" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="111.4" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="155.1" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="198.9" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="242.6" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="286.3" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="330.0" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="373.7" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="417.4" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="461.1" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="504.9" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="548.6" y="60.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><text x="24.0" y="108.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">90 + 9 = 99 битов, 99 / 8 = 12,375 → 13 байтов</text><text x="24.0" y="142.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">каждой части свои байты</text><rect x="24.0" y="155.0" width="491.8" height="20.0" fill="#f3f3f1" stroke="none"/><rect x="515.8" y="155.0" width="32.8" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="24.0" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="67.7" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="111.4" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="155.1" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="198.9" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="242.6" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="286.3" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="330.0" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="373.7" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="417.4" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="461.1" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="504.9" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="24.0" y1="148.0" x2="24.0" y2="182.0" stroke="#17191e" stroke-width="2"/><rect x="548.6" y="155.0" width="49.2" height="20.0" fill="#d9d9d4" stroke="none"/><rect x="597.8" y="155.0" width="38.2" height="20.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1"/><rect x="548.6" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><rect x="592.3" y="152.0" width="43.7" height="26.0" rx="0" fill="none" stroke="#17191e" stroke-width="1"/><line x1="548.6" y1="148.0" x2="548.6" y2="182.0" stroke="#17191e" stroke-width="2"/><line x1="636.0" y1="148.0" x2="636.0" y2="182.0" stroke="#17191e" stroke-width="2"/><text x="24.0" y="200.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">90 / 8 = 11,25 → 12; 9 / 8 = 1,125 → 2; 12 + 2 = 14 байтов</text><text x="330.0" y="220.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">обведённые клетки — выделенные, но пустые биты</text></svg>',
    width: 660,
    height: 230,
    alt: "Части записи в битах и целые байты",
  },
  // %%final_task_stepper("information-amount")%%
  finalTask: {
    kind: "stepper",
    width: 660,
    height: 184,
    frames: [
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><circle cx="24.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">3</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="296.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 234.0 16 H 288.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="296.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="217.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">N = 10 + 26 + 26 = 62 символа</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="247.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 6 бит: 2⁵ = 32 &lt; 62 ≤ 64 = 2⁶</text><circle cx="20" cy="110" r="3" fill="#ff6a00"/><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="300.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">пароль: 15 · 6 = 90 бит → 12 байт, вверх</text><path d="M 452 58 V 176" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 1</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Пароль в байтах</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">алфавит, биты</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">и байты пароля</text></svg>',
        caption:
          "Подтема 1, «Пароль в байтах»: алфавит, биты и байты пароля. Точками отмечены новые строки.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">3</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="296.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 234.0 16 H 288.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="296.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="start" textLength="217.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">N = 10 + 26 + 26 = 62 символа</text><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="start" textLength="247.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">i = 6 бит: 2⁵ = 32 &lt; 62 ≤ 64 = 2⁶</text><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#4d535e" text-anchor="start" textLength="300.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">пароль: 15 · 6 = 90 бит → 12 байт, вверх</text><circle cx="20" cy="129" r="3" fill="#ff6a00"/><text x="32.0" y="133.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="202.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">запись: 1200 / 40 = 30 байт</text><circle cx="20" cy="148" r="3" fill="#ff6a00"/><text x="32.0" y="152.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="202.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">сведения: 30 − 12 = 18 байт</text><path d="M 452 58 V 176" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 2</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Дополнительные сведения</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">запись — пароль</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">и сведения</text></svg>',
        caption:
          "Подтема 2, «Дополнительные сведения»: запись — пароль и сведения.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#ff6a00" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">3</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="296.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 234.0 16 H 288.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="296.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="307.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">запись: 30 байт, пароль: 12 байт = 96 бит</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="330.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">пароль не более 12 байт: 6 · K ≤ 96 → K ≤ 16</text><circle cx="20" cy="110" r="3" fill="#ff6a00"/><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="255.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">записей в 1 Кбайт: 1024 // 30 = 34</text><path d="M 452 58 V 176" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 3</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">«Не более»</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">наибольшее —</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">округлить вниз</text></svg>',
        caption: "Подтема 3, ««Не более»»: наибольшее — округлить вниз.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#ff6a00" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">3</text><circle cx="228.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#ff6a00" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="296.0" cy="16" r="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><path d="M 234.0 16 H 288.0" stroke="#d9d9d4" stroke-width="1.5"/><text x="296.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="330.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">пароль не менее 13 байт: 6 · K &gt; 96 → K ≥ 17</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="292.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">более 1200 байт на 40: запись ≥ 31 байт</text><path d="M 452 58 V 176" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 4</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">«Более» и «не менее»</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">наименьшее —</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">следующее целое</text></svg>',
        caption:
          "Подтема 4, ««Более» и «не менее»»: наименьшее — следующее целое.",
      },
      {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><circle cx="24.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="24.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">1</text><circle cx="92.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 30.0 16 H 84.0" stroke="#ff6a00" stroke-width="1.5"/><text x="92.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">2</text><circle cx="160.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 98.0 16 H 152.0" stroke="#ff6a00" stroke-width="1.5"/><text x="160.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">3</text><circle cx="228.0" cy="16" r="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><path d="M 166.0 16 H 220.0" stroke="#ff6a00" stroke-width="1.5"/><text x="228.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="500" fill="#4d535e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">4</text><circle cx="296.0" cy="16" r="6" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.5"/><path d="M 234.0 16 H 288.0" stroke="#ff6a00" stroke-width="1.5"/><text x="296.0" y="38.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11.5" font-weight="600" fill="#17191e" text-anchor="middle" style="white-space:pre;font-variant-ligatures:none">5</text><circle cx="20" cy="72" r="3" fill="#ff6a00"/><text x="32.0" y="76.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="367.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">+ номер до 500: 2⁸ = 256 ≤ 500 &lt; 512 = 2⁹ → 9 бит</text><circle cx="20" cy="91" r="3" fill="#ff6a00"/><text x="32.0" y="95.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="270.0" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подряд:    90 + 9 = 99 бит → 13 байт</text><circle cx="20" cy="110" r="3" fill="#ff6a00"/><text x="32.0" y="114.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="12.5" font-weight="500" fill="#17191e" text-anchor="start" textLength="202.5" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">по частям: 12 + 2 = 14 байт</text><path d="M 452 58 V 176" stroke="#d9d9d4"/><text x="468.0" y="72.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">подтема 5</text><text x="468.0" y="94.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">Составной код</text><text x="468.0" y="126.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">новое:</text><text x="468.0" y="146.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">части подряд</text><text x="468.0" y="165.0" font-family="inherit" font-size="13.5" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">или по отдельности</text></svg>',
        caption:
          "Подтема 5, «Составной код»: части подряд или по отдельности. Ответ задачи темы — 18 байт.",
      },
    ],
  },
  // %%final_cycle("information-amount")%%
  finalCycle: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 184"><rect x="11.0" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="68.4" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Алфавит</text><text x="68.4" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">сумма</text><text x="68.4" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">всех наборов</text><text x="68.4" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="59.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтема 1</text><rect x="141.8" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="199.2" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Биты</text><text x="199.2" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">наименьшее i:</text><text x="199.2" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2ⁱ ≥ N</text><text x="199.2" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="59.4" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтема 1</text><line x1="127.8" y1="68.0" x2="130.8" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 139.8 68.0 L 130.8 72.5 L 130.8 63.5 Z" fill="#4d535e"/><rect x="272.6" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="330.0" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">Байты</text><text x="330.0" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">чему выделяют</text><text x="330.0" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">целые байты</text><text x="330.0" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="79.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтемы 1, 5</text><line x1="258.6" y1="68.0" x2="261.6" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 270.6 68.0 L 261.6 72.5 L 261.6 63.5 Z" fill="#4d535e"/><rect x="403.4" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="460.8" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Запись</text><text x="460.8" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">части и</text><text x="460.8" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">число записей</text><text x="460.8" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="79.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтемы 2, 6</text><line x1="389.4" y1="68.0" x2="392.4" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 401.4 68.0 L 392.4 72.5 L 392.4 63.5 Z" fill="#4d535e"/><rect x="534.2" y="16.0" width="114.8" height="104.0" rx="8" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="591.6" y="44.0" font-family="inherit" font-size="13.5" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">Граница</text><text x="591.6" y="68.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">«не более» —</text><text x="591.6" y="86.0" font-family="inherit" font-size="12.5" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">проверь соседа</text><text x="591.6" y="110.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" font-weight="500" fill="#4d535e" text-anchor="middle" textLength="79.2" lengthAdjust="spacing" style="white-space:pre;font-variant-ligatures:none">подтемы 3, 4</text><line x1="520.2" y1="68.0" x2="523.2" y2="68.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 532.2 68.0 L 523.2 72.5 L 523.2 63.5 Z" fill="#4d535e"/><path d="M 591.6 122.0 V 150 H 330.0 V 134.0" fill="none" stroke="#4d535e" stroke-width="1.5"/><line x1="330.0" y1="136.0" x2="330.0" y2="131.0" stroke="#4d535e" stroke-width="1.5"/><path d="M 330.0 122.0 L 334.5 131.0 L 325.5 131.0 Z" fill="#4d535e"/><text x="460.8" y="174.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">сосед подходит — пересчитай байты</text></svg>',
    width: 660,
    height: 184,
    alt: "Порядок решения: Алфавит, Биты, Байты, Запись, Граница",
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
