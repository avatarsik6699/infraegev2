import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelTablesPivotsLessonPublication } from "./course-publication.mjs";

export const excelTablesPivotsLesson = defineCourseLesson({
  ...excelTablesPivotsLessonPublication,
  masteryThreshold: 0.8,
  level: "advanced",
  learningOutcomes: [
    "Оформить таблицу",
    "Подсветить строки правилом",
    "Собрать сводную и выбрать диаграмму",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "«Таблица» Excel" },
      { id: "s2", navLabel: "Условное форматирование" },
      { id: "s3", navLabel: "Сводная таблица" },
      { id: "s4", navLabel: "Диаграммы" },
    ],
    preview: (
      <>
        <Typography.Text>
          В таблице сто покупок по городам и товарам. Какой город принёс больше
          всего выручки? В каких строках сумма больше 50? Формулами курса ты
          ответишь на оба вопроса, а Excel умеет ещё и показать ответ:
          подсветить строки, собрать итоги перетаскиванием полей, нарисовать
          диаграмму.{" "}
          <strong>
            Оформление помогает увидеть данные, а вычисляет по-прежнему формула.
          </strong>
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-tables-pivots.paid.lesson"),
  },
  status: "published",
});
