import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelFromTaskToTableLessonPublication } from "./course-publication.mjs";

export const excelFromTaskToTableLesson = defineCourseLesson({
  ...excelFromTaskToTableLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Разложить условие на столбцы проверок",
    "Выбрать функцию по единице ответа",
    "Найти ошибку по сообщению и проверить ответ вторым способом",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Один объект — одна строка" },
      { id: "s2", navLabel: "Единица ответа" },
      { id: "s3", navLabel: "Проверка на малом наборе" },
      { id: "s4", navLabel: "Сообщения об ошибках" },
      { id: "s5", navLabel: "Ошибки без сообщения" },
      { id: "s6", navLabel: "Таблица покупок" },
    ],
    preview: (
      <>
        <Typography.Text>
          Сколько покупок после скидки 10% стоят больше 100 рублей и на какую
          сумму? Все нужные формулы ты уже знаешь: стоимость, скидку со знаком
          $, признак через <Notation>{"ЕСЛИ"}</Notation>,{" "}
          <Notation>{"СУММЕСЛИ"}</Notation>. Осталось собрать их в таблицу,
          которой можно верить.{" "}
          <strong>
            Условие задачи превращается в таблицу вычислений так: один объект —
            одна строка, каждая проверка — свой столбец, ответ — итог по столбцу
            признаков, и каждый шаг проверяется на маленьком наборе.
          </strong>
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-from-task-to-table.paid.lesson"),
  },
  status: "published",
});
