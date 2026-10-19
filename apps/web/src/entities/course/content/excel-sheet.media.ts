// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  // %%range_grid("A2:D6", 6, 8)%%
  rangeGridA2D6_6_8: {
    kind: "diagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 660 304"><rect x="46" y="6" width="64" height="24" fill="#f3f3f1" stroke="#d9d9d4"/><text x="78.0" y="23.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">A</text><rect x="110" y="6" width="64" height="24" fill="#f3f3f1" stroke="#d9d9d4"/><text x="142.0" y="23.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">B</text><rect x="174" y="6" width="64" height="24" fill="#f3f3f1" stroke="#d9d9d4"/><text x="206.0" y="23.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">C</text><rect x="238" y="6" width="64" height="24" fill="#f3f3f1" stroke="#d9d9d4"/><text x="270.0" y="23.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">D</text><rect x="302" y="6" width="64" height="24" fill="#f3f3f1" stroke="#d9d9d4"/><text x="334.0" y="23.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">E</text><rect x="366" y="6" width="64" height="24" fill="#f3f3f1" stroke="#d9d9d4"/><text x="398.0" y="23.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">F</text><rect x="12" y="30" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="50.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">1</text><rect x="46" y="30" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="110" y="30" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="174" y="30" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="238" y="30" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="302" y="30" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="30" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="60" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="80.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">2</text><rect x="46" y="60" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="110" y="60" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="174" y="60" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="238" y="60" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="302" y="60" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="60" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="90" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="110.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">3</text><rect x="46" y="90" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="110" y="90" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="174" y="90" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="238" y="90" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="302" y="90" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="90" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="120" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="140.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">4</text><rect x="46" y="120" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="110" y="120" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="174" y="120" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="238" y="120" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="302" y="120" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="120" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="150" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="170.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">5</text><rect x="46" y="150" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="110" y="150" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="174" y="150" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="238" y="150" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="302" y="150" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="150" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="180" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="200.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">6</text><rect x="46" y="180" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="110" y="180" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="174" y="180" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="238" y="180" width="64" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><rect x="302" y="180" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="180" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="210" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="230.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">7</text><rect x="46" y="210" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="110" y="210" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="174" y="210" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="238" y="210" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="302" y="210" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="210" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="12" y="240" width="34" height="30" fill="#f3f3f1" stroke="#d9d9d4"/><text x="29.0" y="260.0" font-family="inherit" font-size="13" font-weight="500" fill="#4d535e" text-anchor="middle" style="font-variant-numeric:tabular-nums">8</text><rect x="46" y="240" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="110" y="240" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="174" y="240" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="238" y="240" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="302" y="240" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="366" y="240" width="64" height="30" fill="#fff" stroke="#d9d9d4"/><rect x="46" y="60" width="256" height="150" fill="none" stroke="#ff6a00" stroke-width="2.5"/><text x="54.0" y="80.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-ligatures:none">A2</text><text x="294.0" y="200.0" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" font-weight="600" fill="#17191e" text-anchor="end" style="font-variant-ligatures:none">D6</text><text x="448.0" y="82.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">строки 2…6:</text><text x="448.0" y="104.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">6 − 2 + 1 = 5</text><text x="448.0" y="136.0" font-family="inherit" font-size="14" font-weight="400" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">столбцы A…D: 4</text><text x="448.0" y="168.0" font-family="inherit" font-size="14" font-weight="600" fill="#17191e" text-anchor="start" style="font-variant-numeric:tabular-nums">ячеек: 5 × 4 = 20</text></svg>',
    width: 660,
    height: 304,
    alt: "Диапазон A2:D6: 5 строк, 4 столбца, 20 ячеек",
  },
  sheet1: {
    kind: "sheet",
    sheets: [
      {
        name: "База",
        cols: [1, 3],
        rows: [1, 5],
        inputs: {
          A1: "Товар",
          B1: "Цена",
          C1: "Количество",
          A2: "Тетрадь",
          B2: "40",
          C2: "5",
          A3: "Ручка",
          B3: "20",
          C3: "3",
          A4: "Папка",
          B4: "120",
          C4: "2",
          A5: "Карандаш",
          B5: "15",
          C5: "4",
        },
        formats: {},
        filtered: [],
        hidden: [],
        edit: [],
        formulas: [],
      },
    ],
    select: ["База", "C4"],
  },
  sheet2: {
    kind: "sheet",
    sheets: [
      {
        name: "Поле",
        cols: [1, 4],
        rows: [1, 3],
        inputs: {
          A1: "5",
          B1: "1",
          C1: "7",
          D1: "3",
          A2: "2",
          B2: "8",
          C2: "4",
          D2: "6",
          A3: "9",
          B3: "3",
          C3: "1",
          D3: "2",
        },
        formats: {},
        filtered: [],
        hidden: [],
        edit: [],
        formulas: [],
      },
    ],
    select: ["Поле", "B2"],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
