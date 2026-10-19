import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelFromTaskToTableLessonPublication } from "./course-publication.mjs";

export const excelFromTaskToTableLesson = defineCourseLesson({
  ...excelFromTaskToTableLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Разложить условие на столбцы проверок",
    "Найти ошибку по сообщению",
    "Проверить ответ вторым способом",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Один объект — одна строка" },
      { id: "s2", navLabel: "Величина, проверка, подсчёт" },
      { id: "s3", navLabel: "Проверка на малом наборе" },
      { id: "s4", navLabel: "Сообщения об ошибках" },
      { id: "s5", navLabel: "Ошибки без сообщения" },
      { id: "s6", navLabel: "Сборка курса" },
      { id: "s7", navLabel: "Порядок на экзамене" },
    ],
    preview: (
      <>
        <Typography.Text>
          <strong>
            Условие задачи превращается в таблицу вычислений так: один объект —
            одна строка, каждая проверка — свой столбец, ответ — итог по столбцу
            признаков, и каждый шаг проверяется на маленьком наборе.
          </strong>{" "}
          Это итоговый урок: он собирает формулы и копирование (уроки 4–6),
          проверки и подсчёт (уроки 7–9), отбор и поиск (уроки 11–13) в один
          порядок действий.
        </Typography.Text>
      </>
    ),
    selfCheck: 6,
    load: () => import("./excel-from-task-to-table.paid.lesson"),
  },
  status: "published",
});
