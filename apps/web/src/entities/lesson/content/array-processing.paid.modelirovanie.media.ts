// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%greedy_cells(2, [[1, 5], [2, 4], [3, 7], [4, 8], [5, 6], [6, 9]], strict=True)%%
  greedyCells2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 188"><text x="100.0" y="41.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">ячейка 1</text><line x1="110.0" y1="50.0" x2="610.0" y2="50.0" stroke="#d9d9d4" stroke-width="1"/><text x="100.0" y="85.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">ячейка 2</text><line x1="110.0" y1="94.0" x2="610.0" y2="94.0" stroke="#d9d9d4" stroke-width="1"/><rect x="160.0" y="24.0" width="200.0" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="260.0" y="41.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1–5</text><rect x="210.0" y="68.0" width="100.0" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="260.0" y="85.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2–4</text><rect x="360.0" y="68.0" width="50.0" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="385.0" y="85.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5–6</text><rect x="410.0" y="24.0" width="150.0" height="24.0" rx="4" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="485.0" y="41.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6–9</text><line x1="110.0" y1="108.0" x2="610.0" y2="108.0" stroke="#17191e" stroke-width="1"/><text x="110.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="160.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="210.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="260.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="310.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="360.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="410.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="460.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="510.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="560.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><text x="110.0" y="152.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">отказ: (3, 7), (4, 8)</text></svg>',
    width: 660,
    height: 188,
    alt: "2 ячейки во времени",
  },
  // %%greedy_queue([[0, 4], [1, 3], [2, 5], [9, 2]])%%
  greedyQueue_cdf0dd: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 230"><text x="92.0" y="18.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ожидание пунктиром, обслуживание — прямоугольником</text><text x="82.0" y="51.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">клиент 1</text><circle cx="92.0" cy="46" r="4" fill="#17191e"/><rect x="92.0" y="34.0" width="106.7" height="24.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="502.0" y="51.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">ждал 0, в очереди 0</text><text x="82.0" y="91.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">клиент 2</text><circle cx="118.7" cy="86" r="4" fill="#17191e"/><line x1="118.7" y1="86.0" x2="198.7" y2="86.0" stroke="#ff6a00" stroke-width="1.75" stroke-dasharray="4 4"/><rect x="198.7" y="74.0" width="80.0" height="24.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="502.0" y="91.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ждал 3, в очереди 1</text><text x="82.0" y="131.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">клиент 3</text><circle cx="145.3" cy="126" r="4" fill="#17191e"/><line x1="145.3" y1="126.0" x2="278.7" y2="126.0" stroke="#ff6a00" stroke-width="1.75" stroke-dasharray="4 4"/><rect x="278.7" y="114.0" width="133.3" height="24.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="502.0" y="131.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ждал 5, в очереди 2</text><text x="82.0" y="171.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">клиент 4</text><circle cx="332.0" cy="166" r="4" fill="#17191e"/><line x1="332.0" y1="166.0" x2="412.0" y2="166.0" stroke="#ff6a00" stroke-width="1.75" stroke-dasharray="4 4"/><rect x="412.0" y="154.0" width="53.3" height="24.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.25"/><text x="502.0" y="171.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">ждал 3, в очереди 1</text><line x1="92.0" y1="194.0" x2="492.0" y2="194.0" stroke="#17191e" stroke-width="1"/><text x="92.0" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="145.3" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="198.7" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="252.0" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="305.3" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="358.7" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><text x="412.0" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><text x="465.3" y="212.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">14</text></svg>',
    width: 660,
    height: 230,
    alt: "Очередь к одному окну",
  },
  // run notes: "1: Клиенты: (время прихода, длительность обслуживания).\n2: Клиент согласен ждать не больше `3` минут.\n3: `free_at` — когда окно освободится; сейчас оно свободно.\n4: Пока никого не обслужили и никому не отказали.\n5.1: Клиент приходит в `0`, обслуживание — `5` минут.\n6.1: Окно свободно — он начинает сразу, в `0`.\n7.1: Ждал `0` минут — согласен.\n8.1: Окно занято до `5`.\n5.2: Клиент приходит в `2`, нужно `3` минуты.\n6.2: Окно освободится в `5` — начало в `5`.\n7.2: Ждать `3` минуты — ещё согласен.\n8.2: Окно занято до `8`.\n5.3: Клиент приходит в `4`.\n6.3: Начать он мог бы только в `8`.\n7.3: Ждать `4` минуты — больше `3`, он уходит.\n11.1: Отказ. `free_at` не меняется: этот клиент окно не занимал.\n5.4: Клиент приходит в `12`.\n6.4: Окно свободно с `8` — он начинает сразу, в `12`.\n7.4: Ждал `0` минут — согласен.\n8.3: Окно занято до `14`.\n12: Обслужены `3` клиента, отказ — `1`."
  runQueue: {
    kind: "run",
    code: "clients = [(0, 5), (2, 3), (4, 4), (12, 2)]\nmax_wait = 3\nfree_at = 0\nserved = rejected = 0\nfor arrival, duration in clients:\n    start = max(arrival, free_at)\n    if start - arrival <= max_wait:\n        free_at = start + duration\n        served += 1\n    else:\n        rejected += 1\nprint(served, rejected)",
    fileName: "queue.py",
    output: "3 1",
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
        text: "Клиенты: (время прихода, длительность обслуживания).",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: true,
              },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: true } },
        out: "",
      },
      {
        line: 2,
        text: "Клиент согласен ждать не больше `3` минут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 3,
        text: "`free_at` — когда окно освободится; сейчас оно свободно.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 4,
        text: "Пока никого не обслужили и никому не отказали.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "0", ref: null, ch: false },
              { n: "served", v: "0", ref: null, ch: true },
              { n: "rejected", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "Клиент приходит в `0`, обслуживание — `5` минут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "0", ref: null, ch: false },
              { n: "served", v: "0", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "0", ref: null, ch: true },
              { n: "duration", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Окно свободно — он начинает сразу, в `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "0", ref: null, ch: false },
              { n: "served", v: "0", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "0", ref: null, ch: false },
              { n: "duration", v: "5", ref: null, ch: false },
              { n: "start", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Ждал `0` минут — согласен.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "0", ref: null, ch: false },
              { n: "served", v: "0", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "0", ref: null, ch: false },
              { n: "duration", v: "5", ref: null, ch: false },
              { n: "start", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Окно занято до `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "5", ref: null, ch: true },
              { n: "served", v: "0", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "0", ref: null, ch: false },
              { n: "duration", v: "5", ref: null, ch: false },
              { n: "start", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`served += 1`: значение `served` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "5", ref: null, ch: false },
              { n: "served", v: "1", ref: null, ch: true },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "0", ref: null, ch: false },
              { n: "duration", v: "5", ref: null, ch: false },
              { n: "start", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "Клиент приходит в `2`, нужно `3` минуты.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "5", ref: null, ch: false },
              { n: "served", v: "1", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "2", ref: null, ch: true },
              { n: "duration", v: "3", ref: null, ch: true },
              { n: "start", v: "0", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Окно освободится в `5` — начало в `5`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "5", ref: null, ch: false },
              { n: "served", v: "1", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "2", ref: null, ch: false },
              { n: "duration", v: "3", ref: null, ch: false },
              { n: "start", v: "5", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Ждать `3` минуты — ещё согласен.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "5", ref: null, ch: false },
              { n: "served", v: "1", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "2", ref: null, ch: false },
              { n: "duration", v: "3", ref: null, ch: false },
              { n: "start", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Окно занято до `8`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: true },
              { n: "served", v: "1", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "2", ref: null, ch: false },
              { n: "duration", v: "3", ref: null, ch: false },
              { n: "start", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`served += 1`: значение `served` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: true },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "2", ref: null, ch: false },
              { n: "duration", v: "3", ref: null, ch: false },
              { n: "start", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "Клиент приходит в `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "4", ref: null, ch: true },
              { n: "duration", v: "4", ref: null, ch: true },
              { n: "start", v: "5", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Начать он мог бы только в `8`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "4", ref: null, ch: false },
              { n: "duration", v: "4", ref: null, ch: false },
              { n: "start", v: "8", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Ждать `4` минуты — больше `3`, он уходит.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "0", ref: null, ch: false },
              { n: "arrival", v: "4", ref: null, ch: false },
              { n: "duration", v: "4", ref: null, ch: false },
              { n: "start", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 11,
        text: "Отказ. `free_at` не меняется: этот клиент окно не занимал.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: true },
              { n: "arrival", v: "4", ref: null, ch: false },
              { n: "duration", v: "4", ref: null, ch: false },
              { n: "start", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "Клиент приходит в `12`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: true },
              { n: "duration", v: "2", ref: null, ch: true },
              { n: "start", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Окно свободно с `8` — он начинает сразу, в `12`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: false },
              { n: "duration", v: "2", ref: null, ch: false },
              { n: "start", v: "12", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "Ждал `0` минут — согласен.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "8", ref: null, ch: false },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: false },
              { n: "duration", v: "2", ref: null, ch: false },
              { n: "start", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "Окно занято до `14`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "14", ref: null, ch: true },
              { n: "served", v: "2", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: false },
              { n: "duration", v: "2", ref: null, ch: false },
              { n: "start", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`served += 1`: значение `served` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "14", ref: null, ch: false },
              { n: "served", v: "3", ref: null, ch: true },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: false },
              { n: "duration", v: "2", ref: null, ch: false },
              { n: "start", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "14", ref: null, ch: false },
              { n: "served", v: "3", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: false },
              { n: "duration", v: "2", ref: null, ch: false },
              { n: "start", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "",
      },
      {
        line: 12,
        text: "Обслужены `3` клиента, отказ — `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              {
                n: "clients",
                v: "[(0, 5), (2, 3), (4, 4), (12, 2)]",
                ref: 0,
                ch: false,
              },
              { n: "max_wait", v: "3", ref: null, ch: false },
              { n: "free_at", v: "14", ref: null, ch: false },
              { n: "served", v: "3", ref: null, ch: false },
              { n: "rejected", v: "1", ref: null, ch: false },
              { n: "arrival", v: "12", ref: null, ch: false },
              { n: "duration", v: "2", ref: null, ch: false },
              { n: "start", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[(0, 5), (2, 3), (4, 4), (12, 2)]", ch: false } },
        out: "3 1\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
