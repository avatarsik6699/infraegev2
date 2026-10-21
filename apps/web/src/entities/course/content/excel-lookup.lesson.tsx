import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelLookupLessonPublication } from "./course-publication.mjs";

export const excelLookupLesson = defineCourseLesson({
  ...excelLookupLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Найти свойство записи по ключу на другом листе",
    "Искать в любую сторону",
    "Разобраться с #Н/Д",
  ],
  accessTier: "paid",
  paid: {
    outline: [
      { id: "intro", navLabel: "Вступление", lead: true },
      { id: "s1", navLabel: "Справочник и ключ" },
      { id: "s2", navLabel: "ВПР" },
      { id: "s3", navLabel: "ИНДЕКС и ПОИСКПОЗ" },
      { id: "s4", navLabel: "Ошибка #Н/Д" },
      { id: "s5", navLabel: "Поиск и условная сумма" },
    ],
    preview: (
      <>
        <Typography.Text>
          В продаже записаны только код товара и число упаковок, а категория и
          масса лежат на другом листе — в справочнике. Чтобы посчитать продажи
          напитков, к каждой продаже нужно «подтянуть» категорию.{" "}
          <strong>
            <Notation>{"ВПР"}</Notation> находит по ключу строку справочника и
            возвращает из неё нужное поле
          </strong>
          .
        </Typography.Text>
      </>
    ),
    selfCheck: 5,
    load: () => import("./excel-lookup.paid.lesson"),
  },
  status: "published",
});
