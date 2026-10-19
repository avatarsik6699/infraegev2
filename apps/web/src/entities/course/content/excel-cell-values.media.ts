// Lesson media: a figure is rebuilt from the builder call above it, a run is
// recorded again from its code — scripts/lesson_design/site_media.py.
import type { LessonMediaTypes } from "~/shared/components/learning-content";

export const lessonMedia = {
  sheet1: {
    kind: "sheet",
    sheets: [
      {
        name: "Типы",
        cols: [1, 2],
        rows: [1, 5],
        inputs: {
          A1: "Набрано",
          B1: "Что получилось",
          A2: "120",
          B2: "число",
          A3: "120 руб.",
          B3: "текст",
          A4: "00127",
          B4: "число 127: нули пропали",
          A5: "'00127",
          B5: "текст из пяти символов",
        },
        formats: {},
        filtered: [],
        hidden: [],
        edit: [],
        formulas: [],
      },
    ],
    select: ["Типы", "A3"],
  },
  sheet2: {
    kind: "sheet",
    sheets: [
      {
        name: "Формат",
        cols: [1, 2],
        rows: [1, 4],
        inputs: {
          A1: "Видно",
          B1: "Хранится",
          A2: "1,23456",
          B2: "формат «два знака»",
          A3: "1,231",
          B3: "формат «два знака»",
          A4: "1,234",
          B4: "формат «два знака»",
        },
        formats: { A2: "0,00", A3: "0,00", A4: "0,00" },
        filtered: [],
        hidden: [],
        edit: [],
        formulas: [],
      },
    ],
    select: ["Формат", "A2"],
  },
  sheet3: {
    kind: "sheet",
    sheets: [
      {
        name: "Проценты",
        cols: [1, 2],
        rows: [1, 4],
        inputs: {
          A1: "Видно",
          B1: "Хранится",
          A2: "0,15",
          B2: "0,15 в процентном формате",
          A3: "15",
          B3: "15 в процентном формате",
          A4: "15%",
          B4: "набрано 15% — хранится 0,15",
        },
        formats: { A2: "%", A3: "%", A4: "%" },
        filtered: [],
        hidden: [],
        edit: [],
        formulas: [],
      },
    ],
    select: ["Проценты", "A3"],
  },
  sheet4: {
    kind: "sheet",
    sheets: [
      {
        name: "Даты",
        cols: [1, 2],
        rows: [1, 4],
        inputs: {
          A1: "Формат даты",
          B1: "Общий формат",
          A2: "05.10.2026",
          B2: "05.10.2026",
          A3: "06.10.2026",
          B3: "06.10.2026",
          A4: "=A2+12/24",
          B4: "=B2+12/24",
        },
        formats: { A2: "дата", A3: "дата", A4: "дата" },
        filtered: [],
        hidden: [],
        edit: [],
        formulas: [
          { cell: "A4", formula: "=A2+12/24" },
          { cell: "B4", formula: "=B2+12/24" },
        ],
      },
    ],
    select: ["Даты", "B2"],
  },
} as const satisfies Record<string, LessonMediaTypes.Generated>;
