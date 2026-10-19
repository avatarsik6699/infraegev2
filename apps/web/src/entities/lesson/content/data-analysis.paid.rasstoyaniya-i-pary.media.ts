// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%cl_scatter("example27.txt", "x5", pairs=True, centers=True)%%
  clScatterexample27txt_x5_3d2c1d: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><rect x="46" y="14" width="560.0" height="160.0" fill="#fff" stroke="#d9d9d4"/><line x1="46.0" y1="14.0" x2="46.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="46.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="86.0" y1="14.0" x2="86.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="86.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="126.0" y1="14.0" x2="126.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="126.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="166.0" y1="14.0" x2="166.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="166.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="206.0" y1="14.0" x2="206.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="206.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="246.0" y1="14.0" x2="246.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="246.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="286.0" y1="14.0" x2="286.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="286.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="326.0" y1="14.0" x2="326.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="326.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="366.0" y1="14.0" x2="366.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="366.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="406.0" y1="14.0" x2="406.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="406.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="446.0" y1="14.0" x2="446.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="446.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="486.0" y1="14.0" x2="486.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="486.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="526.0" y1="14.0" x2="526.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="526.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><line x1="566.0" y1="14.0" x2="566.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="566.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><line x1="606.0" y1="14.0" x2="606.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="606.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><line x1="46.0" y1="174.0" x2="606.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="178.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−1</text><line x1="46.0" y1="134.0" x2="606.0" y2="134.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="138.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="46.0" y1="94.0" x2="606.0" y2="94.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="98.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">1</text><line x1="46.0" y1="54.0" x2="606.0" y2="54.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="58.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="46.0" y1="14.0" x2="606.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">3</text><line x1="46.0" y1="134.0" x2="606.0" y2="134.0" stroke="#4d535e" stroke-width="1"/><line x1="86.0" y1="14.0" x2="86.0" y2="174.0" stroke="#4d535e" stroke-width="1"/><circle cx="86.0" cy="134.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="86.0" cy="54.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="126.0" cy="94.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="166.0" cy="134.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="166.0" cy="54.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><rect x="481.8" y="129.8" width="8.4" height="8.4" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="561.8" y="129.8" width="8.4" height="8.4" fill="#fff" stroke="#17191e" stroke-width="1.3"/><rect x="521.8" y="89.8" width="8.4" height="8.4" fill="#fff" stroke="#17191e" stroke-width="1.3"/><circle cx="126.0" cy="94.0" r="9" fill="none" stroke="#ff6a00" stroke-width="2"/><circle cx="526.0" cy="94.0" r="9" fill="none" stroke="#ff6a00" stroke-width="2"/><line x1="526.0" y1="94.0" x2="486.0" y2="134.0" stroke="#17191e" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="486.0" y1="134.0" x2="566.0" y2="134.0" stroke="#ff6a00" stroke-width="2.5"/><line x1="86.0" y1="54.0" x2="566.0" y2="134.0" stroke="#4d535e" stroke-width="1.25"/><text x="326.0" y="44.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">межкластерный диаметр 12,166</text><text x="526.0" y="156.0" font-family="inherit" font-size="12" font-weight="400" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">радиус 1,414 (пунктир), диаметр 2</text></svg>',
    width: 660,
    height: 200,
    alt: "Точечная диаграмма файла example27.txt",
  },
  // %%cl_scatter("example27.txt", circle=(1, 1, 10))%%
  clScatterexample27txt_96f239: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 222"><rect x="46" y="14" width="560.0" height="160.0" fill="#fff" stroke="#d9d9d4"/><line x1="46.0" y1="14.0" x2="46.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="46.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">−1</text><line x1="86.0" y1="14.0" x2="86.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="86.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">0</text><line x1="126.0" y1="14.0" x2="126.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="126.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><line x1="166.0" y1="14.0" x2="166.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="166.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><line x1="206.0" y1="14.0" x2="206.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="206.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><line x1="246.0" y1="14.0" x2="246.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="246.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><line x1="286.0" y1="14.0" x2="286.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="286.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><line x1="326.0" y1="14.0" x2="326.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="326.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><line x1="366.0" y1="14.0" x2="366.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="366.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><line x1="406.0" y1="14.0" x2="406.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="406.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="446.0" y1="14.0" x2="446.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="446.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">9</text><line x1="486.0" y1="14.0" x2="486.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="486.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">10</text><line x1="526.0" y1="14.0" x2="526.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="526.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">11</text><line x1="566.0" y1="14.0" x2="566.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="566.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><line x1="606.0" y1="14.0" x2="606.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="606.0" y="190.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">13</text><line x1="46.0" y1="174.0" x2="606.0" y2="174.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="178.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">−1</text><line x1="46.0" y1="134.0" x2="606.0" y2="134.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="138.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">0</text><line x1="46.0" y1="94.0" x2="606.0" y2="94.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="98.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">1</text><line x1="46.0" y1="54.0" x2="606.0" y2="54.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="58.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">2</text><line x1="46.0" y1="14.0" x2="606.0" y2="14.0" stroke="#d9d9d4" stroke-width="0.6"/><text x="40.0" y="18.0" font-family="inherit" font-size="11" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">3</text><line x1="46.0" y1="134.0" x2="606.0" y2="134.0" stroke="#4d535e" stroke-width="1"/><line x1="86.0" y1="14.0" x2="86.0" y2="174.0" stroke="#4d535e" stroke-width="1"/><circle cx="86.0" cy="134.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="86.0" cy="54.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="126.0" cy="94.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="166.0" cy="134.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="166.0" cy="54.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="486.0" cy="134.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="566.0" cy="134.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><circle cx="526.0" cy="94.0" r="4.2" fill="#fff" stroke="#17191e" stroke-width="1.4"/><clipPath id="clced739122"><rect x="46" y="14" width="560.0" height="160.0"/></clipPath><circle cx="126.0" cy="94.0" r="400.0" fill="none" stroke="#ff6a00" stroke-width="1.75" stroke-dasharray="6 4" clip-path="url(#clced739122)"/><circle cx="126.0" cy="94.0" r="3.5" fill="#ff6a00" stroke="#ff6a00" stroke-width="1.4"/><text x="46.0" y="208.0" font-family="inherit" font-size="12" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">r = 10: внутри 6, на окружности 1, снаружи 1</text></svg>',
    width: 660,
    height: 222,
    alt: "Точечная диаграмма файла example27.txt",
  },
  runFarthestPair: {
    kind: "run",
    code: "from math import dist\n\n\ndef farthest_pair(cluster1, cluster2):\n    best_distance = -1.0\n    best_pair = None\n\n    for point1 in cluster1:\n        for point2 in cluster2:\n            d = dist(point1, point2)\n\n            if d > best_distance:\n                best_distance = d\n                best_pair = (point1, point2)\n\n    return best_distance, best_pair\n\n\nprint(farthest_pair([(0, 0), (0, 2)], [(12, 0)]))",
    fileName: "farthest_pair.py",
    output: "(12.165525060596439, ((0, 2), (12, 0)))",
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
        text: "`dist` = `функция`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [{ n: "dist", v: "функция", ref: null, ch: true }],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 4,
        text: "Создана функция `farthest_pair`. Её тело выполнится, когда функцию вызовут.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: true },
            ],
          },
        ],
        objs: {},
        out: "",
      },
      {
        line: 19,
        text: "Вызывается функция `farthest_pair`. У вызова свои переменные: `cluster1` = `[(0, 0), (0, 2)]`, `cluster2` = `[(12, 0)]`.",
        kind: "call",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: true },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: true },
          "1": { v: "[(12, 0)]", ch: true },
        },
        out: "",
      },
      {
        line: 5,
        text: "`best_distance` получает значение `-1.0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "-1.0", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 6,
        text: "`best_pair` получает значение `None`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "-1.0", ref: null, ch: false },
              { n: "best_pair", v: "None", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 8,
        text: "`for` берёт первое значение: `point1` = `(0, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "-1.0", ref: null, ch: false },
              { n: "best_pair", v: "None", ref: null, ch: false },
              { n: "point1", v: "(0, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "`for` берёт первое значение: `point2` = `(12, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "-1.0", ref: null, ch: false },
              { n: "best_pair", v: "None", ref: null, ch: false },
              { n: "point1", v: "(0, 0)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `dist(point1, point2)` → `12.0`, и `d` получает это значение.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "-1.0", ref: null, ch: false },
              { n: "best_pair", v: "None", ref: null, ch: false },
              { n: "point1", v: "(0, 0)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 12,
        text: "Проверка `d > best_distance` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "-1.0", ref: null, ch: false },
              { n: "best_pair", v: "None", ref: null, ch: false },
              { n: "point1", v: "(0, 0)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 13,
        text: "`best_distance` получает то же, что `d`: теперь оба имени ведут к `12.0`. Прежнее значение `-1.0` больше не связано с `best_distance`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: true },
              { n: "best_pair", v: "None", ref: null, ch: false },
              { n: "point1", v: "(0, 0)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 14,
        text: "Python вычисляет `(point1, point2)` → `((0, 0), (12, 0))`, и `best_pair` получает это значение. Прежнее значение `None` больше не связано с `best_pair`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: false },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: true },
              { n: "point1", v: "(0, 0)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: false },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 0)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 8,
        text: "`for` берёт следующее значение: `point1` = `(0, 2)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: false },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: true },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "`for` берёт первое значение: `point2` = `(12, 0)`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: false },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.0", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 10,
        text: "Python вычисляет `dist(point1, point2)` → `12.165525060596439`, и `d` получает это значение. Прежнее значение `12.0` больше не связано с `d`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: false },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: true },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 12,
        text: "Проверка `d > best_distance` даёт `True` — выполняется блок под этим условием.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              { n: "best_distance", v: "12.0", ref: null, ch: false },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 13,
        text: "`best_distance` получает то же, что `d`: теперь оба имени ведут к `12.165525060596439`. Прежнее значение `12.0` больше не связано с `best_distance`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              {
                n: "best_distance",
                v: "12.165525060596439",
                ref: null,
                ch: true,
              },
              { n: "best_pair", v: "((0, 0), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 14,
        text: "Python вычисляет `(point1, point2)` → `((0, 2), (12, 0))`, и `best_pair` получает это значение. Прежнее значение `((0, 0), (12, 0))` больше не связано с `best_pair`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              {
                n: "best_distance",
                v: "12.165525060596439",
                ref: null,
                ch: false,
              },
              { n: "best_pair", v: "((0, 2), (12, 0))", ref: null, ch: true },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 9,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              {
                n: "best_distance",
                v: "12.165525060596439",
                ref: null,
                ch: false,
              },
              { n: "best_pair", v: "((0, 2), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 8,
        text: "Значения закончились — цикл `for` завершён.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              {
                n: "best_distance",
                v: "12.165525060596439",
                ref: null,
                ch: false,
              },
              { n: "best_pair", v: "((0, 2), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 16,
        text: "Функция возвращает `(12.165525060596439, ((0, 2), (12, 0)))` в строку, откуда её вызвали. Переменные вызова больше не нужны и исчезают.",
        kind: "return",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
          {
            title: "вызов farthest_pair([(0, 0), (0, 2)], [(12, 0)])",
            names: [
              { n: "cluster1", v: "[(0, 0), (0, 2)]", ref: 0, ch: false },
              { n: "cluster2", v: "[(12, 0)]", ref: 1, ch: false },
              {
                n: "best_distance",
                v: "12.165525060596439",
                ref: null,
                ch: false,
              },
              { n: "best_pair", v: "((0, 2), (12, 0))", ref: null, ch: false },
              { n: "point1", v: "(0, 2)", ref: null, ch: false },
              { n: "point2", v: "(12, 0)", ref: null, ch: false },
              { n: "d", v: "12.165525060596439", ref: null, ch: false },
            ],
          },
        ],
        objs: {
          "0": { v: "[(0, 0), (0, 2)]", ch: false },
          "1": { v: "[(12, 0)]", ch: false },
        },
        out: "",
      },
      {
        line: 19,
        text: "На экран выводится «(12.165525060596439, ((0, 2), (12, 0)))».",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "dist", v: "функция", ref: null, ch: false },
              { n: "farthest_pair", v: "функция", ref: null, ch: false },
            ],
          },
        ],
        objs: {},
        out: "(12.165525060596439, ((0, 2), (12, 0)))\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
