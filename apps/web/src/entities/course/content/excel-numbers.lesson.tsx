import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelNumbersLessonPublication } from "./course-publication.mjs";

export const excelNumbersLesson = defineCourseLesson({
  ...excelNumbersLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Посчитать проценты",
    "Округлить в нужную сторону",
    "Проверить делимость остатком",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Проценты" },
      { id: "s2", navLabel: "Округление" },
      { id: "s3", navLabel: "Число коробок" },
      { id: "s4", navLabel: "Остаток" },
    ],
    preview: (
      <>
        <Typography.Text>
          Цена 200 рублей со скидкой 10%, число коробок по 8 для 19 тетрадей,
          последняя цифра числа — в этих задачах формуле мало четырёх действий
          арифметики.{" "}
          <strong>
            Процент — это множитель, округление — функция с выбранным
            направлением, а остаток от деления отвечает на вопрос о делимости
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-numbers.paid.lesson"),
  },
  status: "published",
});
