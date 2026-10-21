import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelConditionalCountLessonPublication } from "./course-publication.mjs";

export const excelConditionalCountLesson = defineCourseLesson({
  ...excelConditionalCountLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Подсчитать и сложить по условию",
    "Собрать критерий из ячейки",
    "Найти частоты значений в строке",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "СЧЁТЕСЛИ" },
      { id: "s2", navLabel: "Критерий из ячейки" },
      { id: "s3", navLabel: "СЧЁТЕСЛИМН" },
      { id: "s4", navLabel: "СУММЕСЛИ" },
      { id: "s5", navLabel: "«Или» без двойного счёта" },
      { id: "s6", navLabel: "Частоты в строке" },
      { id: "s7", navLabel: "Повторы и одиночные" },
    ],
    preview: (
      <>
        <Typography.Text>
          В таблице сотни покупок. Сколько из них — книги и на какую сумму?
          Столбец признаков из урока 3.1 ответит, но короче так:{" "}
          <strong>
            <Notation>{"СЧЁТЕСЛИ"}</Notation> и{" "}
            <Notation>{"СУММЕСЛИ"}</Notation> проверяют условие по каждой
            ячейке диапазона сами — без столбца признаков
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-conditional-count.paid.lesson"),
  },
  status: "published",
});
