import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelNeighbourCellsLessonPublication } from "./course-publication.mjs";

export const excelNeighbourCellsLesson = defineCourseLesson({
  ...excelNeighbourCellsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Построить накопление",
    "Расчёт по соседним парам и таблицу из уже вычисленных ячеек",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Накопленная сумма" },
      { id: "s2", navLabel: "Соседние пары" },
      { id: "s3", navLabel: "Таблица из таблицы" },
      { id: "s4", navLabel: "Порядок пересчёта" },
      { id: "s5", navLabel: "Перебор вариантов" },
      { id: "s6", navLabel: "Таблица или программа" },
    ],
    preview: (
      <>
        <Typography.Text>
          <strong>
            Формула может опираться не только на исходные данные, но и на уже
            вычисленные ячейки — соседние или далёкие; так таблица строит новый
            результат из предыдущего.
          </strong>{" "}
          Урок опирается на копирование и закрепление ссылок из урока 5, на
          условия из урока 7 и на <Notation>{"ОСТАТ"}</Notation> из урока 8.
          Здесь копирование одной формулы превращается в пошаговый расчёт.
        </Typography.Text>
      </>
    ),
    selfCheck: 2,
    load: () => import("./excel-neighbour-cells.paid.lesson"),
  },
  status: "published",
});
