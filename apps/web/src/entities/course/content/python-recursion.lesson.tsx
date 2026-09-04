import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonRecursionLessonPublication } from "./course-publication.mjs";

export const pythonRecursionLesson = defineCourseLesson({
  ...pythonRecursionLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Находить базовый случай",
    "Проверять приближение рекурсивного шага к остановке",
    "Трассировать вложенные вызовы",
    "Собирать результат при возврате вызовов",
  ],
  practiceTaskIds: pythonRecursionLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Задача уменьшается до простого случая",
      explanation: (
        <>
          <Typography.Text>
            {
              "Рекурсивная функция вызывает саму себя с более простой версией задачи. Базовый случай даёт ответ без нового вызова, а рекурсивный шаг гарантированно приближает аргумент к нему."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Нужны обе части. Без базового случая вызовы не остановятся; без уменьшения задачи базовый случай может существовать в коде, но никогда не быть достигнут."
            }
          </Typography.Text>
          <CodeBlock
            code={
              "def sum_to(number):\n    if number == 0:\n        return 0\n    return number + sum_to(number - 1)"
            }
            label={"Сумма от числа до нуля"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Вызовы сначала углубляются, потом возвращаются",
      explanation: (
        <>
          <Typography.Text>
            {
              "При sum_to(3) первый вызов не знает окончательного ответа, пока не завершится sum_to(2). Цепочка углубляется до нуля, а затем значения возвращаются в обратном порядке."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Для трассировки разделите лист на две части: аргументы при входе и результаты при возврате. Это не смешивает два направления движения."
            }
          </Typography.Text>
          <WorkedExample
            title={"Развернём sum_to(3)"}
            prompt={"Каждый шаг уменьшает number на единицу."}
            steps={[
              "Входящие аргументы: 3, 2, 1, 0.",
              "Базовый вызов с нулём возвращает 0.",
              "Возвраты собирают 1, затем 3, затем 6.",
            ]}
          />
        </>
      ),
    },
    {
      id: "ege-connection",
      navLabel: "Та же модель встречается в задачах ЕГЭ",
      explanation: (
        <>
          <Typography.Text>
            В заданиях с рекурсивной функцией часто нужно не написать код, а
            аккуратно вычислить значение. Правило остаётся тем же: найдите
            базовые аргументы, раскройте только нужные вызовы и отдельно
            соберите возвраты. Если ветвей две, рисуйте небольшое дерево и не
            считайте один и тот же узел «на глаз» несколько раз.
          </Typography.Text>
          <CodeBlock
            code={
              "def f(number):\n    if number <= 1:\n        return 1\n    return f(number - 1) + f(number - 2)"
            }
            label={"Рекуррентная зависимость с двумя ветвями"}
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Для f(3) понадобятся f(2) и f(1), а для f(2) — f(1) и f(0). Сначала
            подпишите обе единицы в базе, затем сложите возвраты снизу вверх:
            f(2) равно 2, f(3) равно 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pitfall",
      navLabel: "Базовый случай должен быть достижим",
      explanation: (
        <>
          <Typography.Text>
            {
              "Проверка number == 0 не спасёт функцию, если положительный аргумент на каждом шаге увеличивается. Расстояние до нуля растёт, и цепочка закончится RecursionError."
            }
          </Typography.Text>
          <Mistake
            claim={"Достаточно написать if с базовым случаем в начале функции."}
            explanation={
              "Нужно ещё доказать, что рекурсивный аргумент меняется в сторону базового случая и не перескакивает мимо него."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверять рекурсию",
      explanation: (
        <>
          <Typography.Text>
            {
              "Начните с базового аргумента, затем проверьте один шаг над ним и только после этого разбирайте более длинную цепочку. Для каждого вызова записывайте собственное значение параметра."
            }
          </Typography.Text>
          <Procedure
            title={"Трассируем два направления"}
            steps={[
              {
                label: "Найдите базовый случай.",
                detail: "Запишите его аргумент и немедленный результат.",
              },
              {
                label: "Проверьте уменьшение.",
                detail: "Сравните аргумент текущего и следующего вызова.",
              },
              {
                label: "Раскройте вызовы.",
                detail: "Дойдите до базы, не вычисляя возвраты заранее.",
              },
              {
                label: "Соберите ответы.",
                detail: "Возвращайтесь по цепочке в обратном порядке.",
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
          "Теперь вы можете найти базовый случай, доказать приближение к нему и проследить возврат результата."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Возьмите функцию степени двойки, разверните вызов для аргумента 3 до базы и соберите значения обратно, прежде чем запускать код."
        }
      </Typography.Text>
    </>
  ),
  checkpoint: [
    {
      id: "checkpoint-trace",
      prompt:
        "Почему при трассировке рекурсии полезно отдельно записывать входы и возвраты?",
      reveal:
        "Сначала создаётся цепочка вложенных вызовов, затем результаты идут обратно. Раздельная запись не смешивает эти два порядка.",
    },
  ],
});
