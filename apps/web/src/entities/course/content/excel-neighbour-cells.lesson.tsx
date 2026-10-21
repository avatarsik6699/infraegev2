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
    ],
    preview: (
      <>
        <Typography.Text>
          Расходы по дням нужно превратить в «сколько потрачено к этому дню»:
          итог каждого дня — итог предыдущего плюс новый расход. Формула здесь
          берёт не только исходные данные.{" "}
          <strong>
            Формула может опираться на уже вычисленные ячейки — соседние или
            далёкие; так таблица строит новый результат из предыдущего
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-neighbour-cells.paid.lesson"),
  },
  status: "published",
});
