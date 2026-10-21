import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelSortFilterLessonPublication } from "./course-publication.mjs";

export const excelSortFilterLesson = defineCourseLesson({
  ...excelSortFilterLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Отсортировать таблицу целиком",
    "Отфильтровать строки и посчитать только видимые",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Сортировка" },
      { id: "s2", navLabel: "Фильтр" },
      { id: "s3", navLabel: "Сумма видимых строк" },
    ],
    preview: (
      <>
        <Typography.Text>
          В таблице покупок сто строк, а нужна сумма только по Москве. Можно
          упорядочить строки по городу или спрятать лишние фильтром — но обычная
          сумма всё равно посчитает спрятанное.{" "}
          <strong>
            Сортировка меняет порядок записей, фильтр только прячет строки, а
            обычные функции считают и спрятанное
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 6,
    load: () => import("./excel-sort-filter.paid.lesson"),
  },
  status: "published",
});
