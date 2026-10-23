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
  // run notes: "1: Функция расстояния из модуля `math`.\n4: Ищем самую далёкую пару точек из двух кластеров.\n5: Лучшего расстояния пока нет: `-1` меньше любого настоящего.\n6: Пары пока нет — `None`.\n7.1: Точка первого кластера — `(0, 0)`.\n8.1: Точка второго кластера — `(12, 0)`.\n9.1: Между ними `12`.\n10.1: `12 > -1` — новая лучшая пара.\n11.1: Наибольшее расстояние — `12`.\n12.1: Запоминаем и саму пару: её концы понадобятся в ответе.\n8.2: Во втором кластере точек больше нет.\n7.2: Следующая точка первого кластера — `(0, 2)`.\n8.3: Снова `(12, 0)`.\n9.2: Расстояние ≈ `12,166`.\n10.2: `12,166 > 12` — пара лучше прежней.\n11.2: Наибольшее расстояние ≈ `12,166`.\n12.2: Пара — `(0, 2)` и `(12, 0)`.\n8.4: Точки второго кластера кончились.\n7.3: Первый кластер тоже пройден.\n13: Возвращаем расстояние и пару вместе.\n16.1: Межкластерный диаметр ≈ `12,166` — между `(0, 2)` и `(12, 0)`."
  runFarthestPair: {
    kind: "run",
    code: "from math import dist\n\n\ndef farthest_pair(cluster1, cluster2):\n    best_distance = -1.0\n    best_pair = None\n    for point1 in cluster1:\n        for point2 in cluster2:\n            d = dist(point1, point2)\n            if d > best_distance:\n                best_distance = d\n                best_pair = (point1, point2)\n    return best_distance, best_pair\n\n\nprint(farthest_pair([(0, 0), (0, 2)], [(12, 0)]))",
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
        text: "Функция расстояния из модуля `math`.",
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
        text: "Ищем самую далёкую пару точек из двух кластеров.",
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
        line: 16,
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
        text: "Лучшего расстояния пока нет: `-1` меньше любого настоящего.",
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
        text: "Пары пока нет — `None`.",
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
        line: 7,
        text: "Точка первого кластера — `(0, 0)`.",
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
        line: 8,
        text: "Точка второго кластера — `(12, 0)`.",
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
        line: 9,
        text: "Между ними `12`.",
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
        line: 10,
        text: "`12 > -1` — новая лучшая пара.",
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
        line: 11,
        text: "Наибольшее расстояние — `12`.",
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
        line: 12,
        text: "Запоминаем и саму пару: её концы понадобятся в ответе.",
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
        line: 8,
        text: "Во втором кластере точек больше нет.",
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
        line: 7,
        text: "Следующая точка первого кластера — `(0, 2)`.",
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
        line: 8,
        text: "Снова `(12, 0)`.",
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
        line: 9,
        text: "Расстояние ≈ `12,166`.",
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
        line: 10,
        text: "`12,166 > 12` — пара лучше прежней.",
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
        line: 11,
        text: "Наибольшее расстояние ≈ `12,166`.",
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
        line: 12,
        text: "Пара — `(0, 2)` и `(12, 0)`.",
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
        line: 8,
        text: "Точки второго кластера кончились.",
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
        line: 7,
        text: "Первый кластер тоже пройден.",
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
        line: 13,
        text: "Возвращаем расстояние и пару вместе.",
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
        line: 16,
        text: "Межкластерный диаметр ≈ `12,166` — между `(0, 2)` и `(12, 0)`.",
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
