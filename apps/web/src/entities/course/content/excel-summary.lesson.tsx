import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelSummaryLessonPublication } from "./course-publication.mjs";

export const excelSummaryLesson = defineCourseLesson({
  ...excelSummaryLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Видеть курс целиком",
    "Порядок работы над задачей",
    "Частые ошибки",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Одна таблица — весь курс" },
      { id: "s2", navLabel: "Карта навыков" },
      { id: "s3", navLabel: "Новая задача" },
      { id: "s4", navLabel: "Частые ошибки" },
      { id: "s5", navLabel: "Куда дальше" },
    ],
    preview: (
      <>
        <Typography.Text>
          Четыре модуля позади: от адреса ячейки до таблицы, которая сама
          проверяет тысячи строк.{" "}
          <strong>
            Здесь весь курс на одной странице: как росла одна таблица, какие
            навыки ты собрал, как браться за новую задачу и куда идти дальше
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-summary.paid.lesson"),
  },
  status: "published",
});
