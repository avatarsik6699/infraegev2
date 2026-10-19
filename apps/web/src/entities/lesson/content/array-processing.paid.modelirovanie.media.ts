// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%greedy_cells(2, [[1, 5], [2, 4], [3, 7], [4, 8], [5, 6]])%%
  greedyCells2: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 188"><text x="100.0" y="41.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">ячейка 1</text><line x1="110.0" y1="50.0" x2="610.0" y2="50.0" stroke="#d9d9d4" stroke-width="1"/><text x="100.0" y="85.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">ячейка 2</text><line x1="110.0" y1="94.0" x2="610.0" y2="94.0" stroke="#d9d9d4" stroke-width="1"/><rect x="165.6" y="24.0" width="222.2" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="276.7" y="41.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1–5</text><rect x="221.1" y="68.0" width="111.1" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="276.7" y="85.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2–4</text><rect x="332.2" y="68.0" width="222.2" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.25"/><text x="443.3" y="85.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4–8</text><rect x="387.8" y="24.0" width="55.6" height="24.0" rx="4" fill="#f3f3f1" stroke="#ff6a00" stroke-width="2"/><text x="415.6" y="41.0" font-family="inherit" font-size="13" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5–6</text><line x1="110.0" y1="108.0" x2="610.0" y2="108.0" stroke="#17191e" stroke-width="1"/><text x="110.0" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><text x="165.6" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><text x="221.1" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><text x="276.7" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><text x="332.2" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><text x="387.8" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><text x="443.3" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><text x="498.9" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><text x="554.4" y="126.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><text x="110.0" y="152.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">отказ: (3, 7)</text></svg>',
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
        text: "`clients` получает значение `[(0, 5), (2, 3), (4, 4), (12, 2)]`.",
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
        text: "`max_wait` получает значение `3`.",
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
        text: "`free_at` получает значение `0`.",
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
        text: "`served` = `0`; `rejected` = `0`.",
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
        text: "`for` берёт первое значение: `(arrival, duration)` = `(0, 5)`.",
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
        text: "Python вычисляет `max(arrival, free_at)` → `0`, и `start` получает это значение.",
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
        text: "Проверка `start - arrival <= max_wait` даёт `True` — выполняется блок под этим условием.",
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
        text: "Python вычисляет `start + duration` → `5`, и `free_at` получает это значение. Прежнее значение `0` больше не связано с `free_at`.",
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
        text: "`for` берёт следующее значение: `(arrival, duration)` = `(2, 3)`.",
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
        text: "Python вычисляет `max(arrival, free_at)` → `5`, и `start` получает это значение. Прежнее значение `0` больше не связано с `start`.",
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
        text: "Проверка `start - arrival <= max_wait` даёт `True` — выполняется блок под этим условием.",
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
        text: "Python вычисляет `start + duration` → `8`, и `free_at` получает это значение. Прежнее значение `5` больше не связано с `free_at`.",
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
        text: "`for` берёт следующее значение: `(arrival, duration)` = `(4, 4)`.",
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
        text: "Python вычисляет `max(arrival, free_at)` → `8`, и `start` получает это значение. Прежнее значение `5` больше не связано с `start`.",
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
        text: "Проверка `start - arrival <= max_wait` даёт `False` — блок пропускается, дальше следующая проверка.",
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
        text: "`rejected += 1`: значение `rejected` увеличилось — было `0`, стало `1`.",
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
        text: "`for` берёт следующее значение: `(arrival, duration)` = `(12, 2)`.",
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
        text: "Python вычисляет `max(arrival, free_at)` → `12`, и `start` получает это значение. Прежнее значение `8` больше не связано с `start`.",
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
        text: "Проверка `start - arrival <= max_wait` даёт `True` — выполняется блок под этим условием.",
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
        text: "Python вычисляет `start + duration` → `14`, и `free_at` получает это значение. Прежнее значение `8` больше не связано с `free_at`.",
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
        text: "На экран выводится «3 1».",
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
