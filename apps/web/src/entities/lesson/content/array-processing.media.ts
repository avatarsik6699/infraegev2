// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%greedy_fill([8, 12, 15, 19, 22, 34], 60)%%
  greedyFill60: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 200"><text x="40.0" y="34.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">вместимость 60</text><rect x="40.0" y="70.0" width="400.0" height="44.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><rect x="40.0" y="76.0" width="53.3" height="32.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="66.7" y="98.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="93.3" y="76.0" width="80.0" height="32.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="133.3" y="98.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><rect x="173.3" y="76.0" width="100.0" height="32.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="223.3" y="98.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><rect x="273.3" y="76.0" width="126.7" height="32.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="336.7" y="98.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><rect x="400.0" y="76.0" width="146.7" height="32.0" rx="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="5 4"/><text x="473.3" y="98.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">22</text><text x="473.3" y="150.0" font-family="inherit" font-size="14" font-weight="400" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">54 + 22 = 76 &gt; 60</text><line x1="440.0" y1="56.0" x2="440.0" y2="120.0" stroke="#17191e" stroke-width="2"/><text x="40.0" y="186.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">дальше: 34 — ещё больше, поэтому break</text><text x="448.0" y="66.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">занято 54 из 60</text></svg>',
    width: 660,
    height: 200,
    alt: "Самые маленькие размеры подряд при вместимости 60",
  },
  // %%greedy_compare([8, 12, 15, 19, 22, 34], [8, 15, 22, 34])%%
  greedyCompare_ffff2d: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 272"><text x="100.0" y="16.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">все размеры; первые 4 — сумма 54</text><text x="86.0" y="47.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">все</text><rect x="123.0" y="26.0" width="44.0" height="30.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="145.0" y="47.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="213.0" y="26.0" width="44.0" height="30.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="235.0" y="47.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><rect x="303.0" y="26.0" width="44.0" height="30.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="325.0" y="47.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><rect x="393.0" y="26.0" width="44.0" height="30.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><text x="415.0" y="47.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">19</text><rect x="483.0" y="26.0" width="44.0" height="30.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="505.0" y="47.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">22</text><rect x="573.0" y="26.0" width="44.0" height="30.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="595.0" y="47.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">34</text><text x="86.0" y="199.0" font-family="inherit" font-size="14" font-weight="400" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">набор</text><rect x="123.0" y="178.0" width="44.0" height="30.0" rx="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="145.0" y="199.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><line x1="145.0" y1="58.0" x2="145.0" y2="176.0" stroke="#4d535e" stroke-width="1.25"/><text x="145.0" y="230.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8 ≥ 8</text><rect x="303.0" y="178.0" width="44.0" height="30.0" rx="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="325.0" y="199.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><line x1="235.0" y1="58.0" x2="325.0" y2="176.0" stroke="#4d535e" stroke-width="1.25"/><text x="325.0" y="230.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15 ≥ 12</text><rect x="483.0" y="178.0" width="44.0" height="30.0" rx="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="505.0" y="199.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">22</text><line x1="325.0" y1="58.0" x2="505.0" y2="176.0" stroke="#4d535e" stroke-width="1.25"/><text x="505.0" y="230.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">22 ≥ 15</text><rect x="573.0" y="178.0" width="44.0" height="30.0" rx="4" fill="#fff" stroke="#ff6a00" stroke-width="1.5"/><text x="595.0" y="199.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">34</text><line x1="415.0" y1="58.0" x2="595.0" y2="176.0" stroke="#4d535e" stroke-width="1.25"/><text x="595.0" y="230.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">34 ≥ 19</text><text x="640.0" y="262.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="end" style="font-variant-numeric:tabular-nums">сумма набора 79 ≥ 54</text></svg>',
    width: 660,
    height: 272,
    alt: "4 самых маленьких и другой набор из 4",
  },
  // %%greedy_room([8, 12, 15, 19, 22, 34], 60)%%
  greedyRoom60: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 242"><text x="40.0" y="30.0" font-family="inherit" font-size="15" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">вместимость 60: закреплены 3 самых маленьких</text><rect x="40.0" y="46.0" width="408.7" height="40.0" rx="4" fill="#f3f3f1" stroke="#17191e" stroke-width="1.5"/><rect x="40.0" y="51.0" width="54.5" height="30.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="67.2" y="71.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="94.5" y="51.0" width="81.7" height="30.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="135.4" y="71.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">12</text><rect x="176.2" y="51.0" width="102.2" height="30.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="227.3" y="71.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="middle" style="font-variant-numeric:tabular-nums">15</text><text x="363.6" y="71.0" font-family="inherit" font-size="14" font-weight="600" fill="#ff6a00" text-anchor="middle" style="font-variant-numeric:tabular-nums">место 25</text><rect x="278.4" y="51.0" width="170.3" height="30.0" rx="4" fill="none" stroke="#ff6a00" stroke-width="1.5" stroke-dasharray="5 4"/><rect x="278.4" y="116.0" width="129.4" height="24.0" rx="4" fill="#fff" stroke="#17191e" stroke-width="1.5"/><text x="268.4" y="133.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">19</text><text x="458.7" y="133.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">помещается</text><rect x="278.4" y="150.0" width="149.9" height="24.0" rx="4" fill="#fff" stroke="#ff6a00" stroke-width="2"/><text x="268.4" y="167.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-numeric:tabular-nums">22</text><text x="458.7" y="167.0" font-family="inherit" font-size="13" font-weight="400" fill="#ff6a00" text-anchor="start" style="font-variant-numeric:tabular-nums">наибольший подходящий</text><rect x="278.4" y="184.0" width="231.6" height="24.0" rx="4" fill="#fff" stroke="#d9d9d4" stroke-width="1.5"/><text x="268.4" y="201.0" font-family="inherit" font-size="14" font-weight="600" fill="#4d535e" text-anchor="end" style="font-variant-numeric:tabular-nums">34</text><text x="520.0" y="201.0" font-family="inherit" font-size="13" font-weight="400" fill="#4d535e" text-anchor="start" style="font-variant-numeric:tabular-nums">не помещается</text><line x1="448.7" y1="38.0" x2="448.7" y2="218.0" stroke="#17191e" stroke-width="1.5" stroke-dasharray="3 3"/></svg>',
    width: 660,
    height: 242,
    alt: "Закреплены 3 самых маленьких, свободно 25",
  },
  // run notes: "3: Сортируем размеры: теперь файлы идут от самых маленьких.\n4: `used` — сколько места уже занято, пока `0`.\n5: `count` — сколько файлов сохранено, пока `0`.\n6.1: Берём самый маленький файл: `size` = `8`.\n7.1: `0 + 8 = 8` не больше `60` — файл помещается.\n6.2: Следующий по размеру — `12`.\n7.2: `8 + 12 = 20` ≤ `60` — помещается.\n6.3: Следующий — `15`.\n7.3: `20 + 15 = 35` ≤ `60` — помещается.\n6.4: Следующий — `19`.\n7.4: `35 + 19 = 54` ≤ `60` — помещается.\n6.5: Следующий — `22`.\n7.5: `54 + 22 = 76` > `60` — файл не помещается.\n8: `break`: дальше файлы ещё больше, проверять их незачем.\n11: Сохранено `4` файла, занято `54` из `60`."
  runCount: {
    kind: "run",
    code: "sizes = [19, 8, 34, 12, 22, 15]\ncapacity = 60\nsizes.sort()\nused = 0\ncount = 0\nfor size in sizes:\n    if used + size > capacity:\n        break\n    used += size\n    count += 1\nprint(count, used)",
    fileName: "count.py",
    output: "4 54",
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
        text: "`sizes` получает значение `[19, 8, 34, 12, 22, 15]`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[19, 8, 34, 12, 22, 15]", ref: 0, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[19, 8, 34, 12, 22, 15]", ch: true } },
        out: "",
      },
      {
        line: 2,
        text: "`capacity` получает значение `60`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[19, 8, 34, 12, 22, 15]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[19, 8, 34, 12, 22, 15]", ch: false } },
        out: "",
      },
      {
        line: 3,
        text: "Сортируем размеры: теперь файлы идут от самых маленьких.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: true },
              { n: "capacity", v: "60", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: true } },
        out: "",
      },
      {
        line: 4,
        text: "`used` — сколько места уже занято, пока `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 5,
        text: "`count` — сколько файлов сохранено, пока `0`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "0", ref: null, ch: false },
              { n: "count", v: "0", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Берём самый маленький файл: `size` = `8`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "0", ref: null, ch: false },
              { n: "count", v: "0", ref: null, ch: false },
              { n: "size", v: "8", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`0 + 8 = 8` не больше `60` — файл помещается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "0", ref: null, ch: false },
              { n: "count", v: "0", ref: null, ch: false },
              { n: "size", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`used += size`: значение `used` увеличилось — было `0`, стало `8`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "8", ref: null, ch: true },
              { n: "count", v: "0", ref: null, ch: false },
              { n: "size", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`count += 1`: значение `count` увеличилось — было `0`, стало `1`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "8", ref: null, ch: false },
              { n: "count", v: "1", ref: null, ch: true },
              { n: "size", v: "8", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Следующий по размеру — `12`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "8", ref: null, ch: false },
              { n: "count", v: "1", ref: null, ch: false },
              { n: "size", v: "12", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`8 + 12 = 20` ≤ `60` — помещается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "8", ref: null, ch: false },
              { n: "count", v: "1", ref: null, ch: false },
              { n: "size", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`used += size`: значение `used` увеличилось — было `8`, стало `20`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "20", ref: null, ch: true },
              { n: "count", v: "1", ref: null, ch: false },
              { n: "size", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`count += 1`: значение `count` увеличилось — было `1`, стало `2`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "20", ref: null, ch: false },
              { n: "count", v: "2", ref: null, ch: true },
              { n: "size", v: "12", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Следующий — `15`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "20", ref: null, ch: false },
              { n: "count", v: "2", ref: null, ch: false },
              { n: "size", v: "15", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`20 + 15 = 35` ≤ `60` — помещается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "20", ref: null, ch: false },
              { n: "count", v: "2", ref: null, ch: false },
              { n: "size", v: "15", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`used += size`: значение `used` увеличилось — было `20`, стало `35`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "35", ref: null, ch: true },
              { n: "count", v: "2", ref: null, ch: false },
              { n: "size", v: "15", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`count += 1`: значение `count` увеличилось — было `2`, стало `3`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "35", ref: null, ch: false },
              { n: "count", v: "3", ref: null, ch: true },
              { n: "size", v: "15", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Следующий — `19`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "35", ref: null, ch: false },
              { n: "count", v: "3", ref: null, ch: false },
              { n: "size", v: "19", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`35 + 19 = 54` ≤ `60` — помещается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "35", ref: null, ch: false },
              { n: "count", v: "3", ref: null, ch: false },
              { n: "size", v: "19", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 9,
        text: "`used += size`: значение `used` увеличилось — было `35`, стало `54`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "54", ref: null, ch: true },
              { n: "count", v: "3", ref: null, ch: false },
              { n: "size", v: "19", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 10,
        text: "`count += 1`: значение `count` увеличилось — было `3`, стало `4`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "54", ref: null, ch: false },
              { n: "count", v: "4", ref: null, ch: true },
              { n: "size", v: "19", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 6,
        text: "Следующий — `22`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "54", ref: null, ch: false },
              { n: "count", v: "4", ref: null, ch: false },
              { n: "size", v: "22", ref: null, ch: true },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 7,
        text: "`54 + 22 = 76` > `60` — файл не помещается.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "54", ref: null, ch: false },
              { n: "count", v: "4", ref: null, ch: false },
              { n: "size", v: "22", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 8,
        text: "`break`: дальше файлы ещё больше, проверять их незачем.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "54", ref: null, ch: false },
              { n: "count", v: "4", ref: null, ch: false },
              { n: "size", v: "22", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "",
      },
      {
        line: 11,
        text: "Сохранено `4` файла, занято `54` из `60`.",
        kind: "line",
        frames: [
          {
            title: "программа",
            names: [
              { n: "sizes", v: "[8, 12, 15, 19, 22, 34]", ref: 0, ch: false },
              { n: "capacity", v: "60", ref: null, ch: false },
              { n: "used", v: "54", ref: null, ch: false },
              { n: "count", v: "4", ref: null, ch: false },
              { n: "size", v: "22", ref: null, ch: false },
            ],
          },
        ],
        objs: { "0": { v: "[8, 12, 15, 19, 22, 34]", ch: false } },
        out: "4 54\n",
      },
    ],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
