import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonFunctionsLessonPublication } from "./course-publication.mjs";

export const pythonFunctionsLesson = defineCourseLesson({
  ...pythonFunctionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Определять функцию с параметрами",
    "Связывать аргументы с параметрами",
    "Возвращать результат через return",
    "Отделять вычисление от печати",
  ],
  practiceTaskIds: pythonFunctionsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Функция задаёт именованное вычисление",
      explanation: (
        <>
          <Typography.Text>
            {
              "Мы уже повторяли одинаковые вычисления для разных чисел и элементов коллекций. Чтобы не переписывать команды каждый раз, их можно объединить под одним именем. Такую именованную часть программы называют функцией."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Параметры обозначают данные, которые функция ожидает получить. Конкретные значения при вызове называют аргументами. Тело функции выполняется только при вызове, а хорошее имя позволяет понять результат, не перечитывая все команды внутри."
            }
          </Typography.Text>
          <CodeBlock
            code={
              "def rectangle_area(width, height):\n    return width * height\n\narea = rectangle_area(3, 5)"
            }
            label={"Параметры и вызов функции"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "От аргумента к результату",
      explanation: (
        <>
          <Typography.Text>
            {
              "При вызове каждый аргумент связывается со своим параметром, затем Python выполняет тело функции. Команда return завершает этот вызов и передаёт результат точно туда, где стояло выражение вызова."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Поэтому print и return решают разные задачи. print показывает значение человеку в консоли, а return передаёт его следующей части программы."
            }
          </Typography.Text>
          <WorkedExample
            title={"Проследим rectangle_area"}
            prompt={"Функция вызывается с аргументами 3 и 5."}
            steps={[
              "Параметр width получает 3, height получает 5.",
              "Тело вычисляет произведение 15.",
              "return передаёт 15 в присваивание переменной area.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Почему функция с print вместо return может показать правильное число, но сломать следующее вычисление?",
          reveal:
            "print выводит число, но сам вызов возвращает None. Следующее вычисление получает не показанное число, а None.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Печать не заменяет возврат",
      explanation: (
        <>
          <Typography.Text>
            {
              "Если функция только печатает ответ, выражение с её вызовом получает None. Такой результат нельзя надёжно передать другой функции или использовать в дальнейшей формуле."
            }
          </Typography.Text>
          <Mistake
            claim={
              "Если число видно в консоли, функция уже вернула его вызывающему коду."
            }
            explanation={
              "Вывод в консоль — побочный эффект. Для передачи вычисленного значения нужна явная команда return."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить функцию",
      explanation: (
        <>
          <Typography.Text>
            {
              "Перед проверкой сформулируйте контракт функции — договорённость о том, какие значения она получает и что возвращает. Затем подставьте маленькие аргументы и проследите только переменные одного вызова."
            }
          </Typography.Text>
          <Procedure
            title={"Проверяем контракт вызова"}
            steps={[
              {
                label: "Назовите вход.",
                detail: "Сопоставьте каждый аргумент с параметром.",
              },
              {
                label: "Выполните тело.",
                detail: "Используйте локальные значения текущего вызова.",
              },
              {
                label: "Найдите return.",
                detail: "Определите значение, которое уйдёт наружу.",
              },
              {
                label: "Используйте результат.",
                detail: "Проверьте место присваивания или внешний вызов.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        {
          "Теперь вы можете описать вход и выход функции, проследить вызов и вернуть значение для дальнейших вычислений."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Напишите функцию с двумя параметрами, сначала предскажите три результата вручную, затем используйте один вызов как аргумент другой функции."
        }
      </Typography.Text>
    </>
  ),
});
