import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelConditionsLessonPublication } from "./course-publication.mjs";

export const excelConditionsLesson = defineCourseLesson({
  ...excelConditionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Записать сравнение и сложное условие",
    "Получить признак 1/0 и сосчитать подходящие строки",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Знаки сравнения" },
      { id: "s2", navLabel: "И, ИЛИ, НЕ" },
      { id: "s3", navLabel: "ЕСЛИ и признак" },
      { id: "s4", navLabel: "Условие по столбцам" },
      { id: "s5", navLabel: "Защита деления" },
    ],
    preview: (
      <>
        <Typography.Text>
          В столбце A — числа. Нужно отметить те, что лежат от 10 до 20
          включительно, и сосчитать их. Формула должна спросить про каждую
          строку «подходит ли?» и записать ответ.{" "}
          <strong>
            Сравнение даёт <Notation>{"ИСТИНА"}</Notation> или{" "}
            <Notation>{"ЛОЖЬ"}</Notation>, а <Notation>{"ЕСЛИ"}</Notation>{" "}
            превращает такой ответ в нужное значение — например, в 1 для
            подходящей строки и 0 для остальных
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-conditions.paid.lesson"),
  },
  status: "published",
});
