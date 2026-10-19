import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelTextDatesLessonPublication } from "./course-publication.mjs";

export const excelTextDatesLesson = defineCourseLesson({
  ...excelTextDatesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Привести данные к одному виду",
    "Взять часть текста",
    "Построить дату и задать период",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Одинаковые на вид значения" },
      { id: "s2", navLabel: "Части текста" },
      { id: "s3", navLabel: "Склейка текста" },
      { id: "s4", navLabel: "ДАТА и её части" },
      { id: "s5", navLabel: "Период" },
    ],
    preview: (
      <>
        <Typography.Text>
          <strong>
            Перед поиском и подсчётом данные нужно привести к одному виду: текст
            очищают и режут функциями, даты строят функцией{" "}
            <Notation>{"ДАТА"}</Notation>, а период задают началом и следующей
            за концом границей.
          </strong>{" "}
          Урок опирается на типы значений из урока 3 и на сравнения из урока 7:
          проверка периода — это два сравнения дат.
        </Typography.Text>
      </>
    ),
    selfCheck: 6,
    load: () => import("./excel-text-dates.paid.lesson"),
  },
  status: "published",
});
