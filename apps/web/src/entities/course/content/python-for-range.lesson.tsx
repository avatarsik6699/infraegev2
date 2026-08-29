import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonForRangeLessonPublication } from "./course-publication.mjs";

export const pythonForRangeLesson = defineCourseLesson({
  ...pythonForRangeLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать границы и шаг range",
    "Предсказывать значения переменной цикла",
    "Повторять действие заданное число раз",
    "Проверять цикл по первой и последней итерации",
  ],
  practiceTaskIds: pythonForRangeLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Что именно создаёт range",
      explanation: (
        <>
          <Typography.Text>
            {
              "Цикл for последовательно получает значения из готовой последовательности. Для числового перебора такую последовательность часто создаёт range: левая граница входит, правая не входит, а необязательный третий аргумент задаёт шаг."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Запись range(2, 8, 2) даёт 2, 4 и 6. Число 8 служит стоп-границей и не становится значением переменной цикла."
            }
          </Typography.Text>
          <CodeBlock
            code={"for number in range(2, 8, 2):\n    print(number)"}
            label={"Перебор с шагом два"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как читать цикл по итерациям",
      explanation: (
        <>
          <Typography.Text>
            {
              "Перед трассировкой выпишите значения range. Затем для каждого значения отдельно выполните тело цикла и зафиксируйте изменение результата. Это превращает цикл в понятную таблицу повторяющихся шагов."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Накопитель создаётся до цикла. Если создать его внутри тела, предыдущее значение будет теряться на каждой итерации."
            }
          </Typography.Text>
          <WorkedExample
            title={"Сумма первых трёх чисел"}
            prompt={"Накопитель равен нулю, а цикл перебирает range(1, 4)."}
            steps={[
              "При первом значении 1 сумма становится равной 1.",
              "При втором значении 2 сумма становится равной 3.",
              "При третьем значении 3 сумма становится равной 6; следующего значения в range нет.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt: "Какие значения создаёт range(3, 8, 2)?",
          reveal:
            "3, 5 и 7. Следующее значение 9 уже пересекает стоп-границу 8.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Правая граница не включается",
      explanation: (
        <>
          <Typography.Text>
            {
              "Частая ошибка — ожидать, что range(1, 5) содержит число 5. На самом деле перебор остановится перед ним. Если задача требует значения от 1 до 5 включительно, стоп-границей должно быть 6."
            }
          </Typography.Text>
          <Mistake
            claim={
              "В range последним аргументом всегда указывают последнее нужное значение."
            }
            explanation={
              "Второй аргумент — не последнее значение, а граница остановки. При положительном шаге цикл заканчивается до неё."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить границы цикла",
      explanation: (
        <>
          <Typography.Text>
            {
              "До запуска ответьте на три вопроса: какое значение будет первым, какое последним и сколько значений получится. После этого проверьте первую и последнюю итерации отдельно."
            }
          </Typography.Text>
          <Procedure
            title={"Четыре шага проверки"}
            steps={[
              {
                label: "Раскройте range.",
                detail:
                  "Запишите несколько значений последовательности вручную.",
              },
              {
                label: "Назовите первую итерацию.",
                detail: "Подставьте первое значение в тело цикла.",
              },
              {
                label: "Назовите последнюю итерацию.",
                detail: "Убедитесь, что она ещё находится до стоп-границы.",
              },
              {
                label: "Сверьте количество.",
                detail:
                  "При необходимости используйте len(range(...)) в локальной проверке.",
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
          "Теперь вы можете заранее перечислить значения range и проследить, как for меняет состояние программы на каждой итерации."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Составьте цикл для чисел от 5 до 25 с шагом 5, сначала предскажите вывод на бумаге, затем сравните его с локальным запуском."
        }
      </Typography.Text>
    </>
  ),
});
