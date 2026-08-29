import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonCompoundConditionsLessonPublication } from "./course-publication.mjs";

export const pythonCompoundConditionsLesson = defineCourseLesson({
  ...pythonCompoundConditionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Выбирать одну из нескольких взаимоисключающих ветвей",
    "Читать цепочку if/elif/else сверху вниз",
    "Собирать условия с помощью and, or и not",
    "Проверять границы диапазонов и порядок ветвей",
  ],
  practiceTaskIds: pythonCompoundConditionsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Как выбирается одна ветвь",
      explanation: (
        <>
          <Typography.Text>
            {
              "Цепочка из нескольких ветвей нужна, когда у программы больше двух возможных действий. Python проверяет условия сверху вниз и выполняет только тело первой подходящей ветви. Остальные условия после выбора уже не проверяются."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Порядок поэтому является частью алгоритма. Сначала ставят более узкие или приоритетные случаи, затем общие, а завершающий else оставляют для всех значений, которые не подошли раньше."
            }
          </Typography.Text>
          <CodeBlock
            code={
              'score = 73\nif score >= 90:\n    grade = "5"\nelif score >= 70:\n    grade = "4"\nelif score >= 50:\n    grade = "3"\nelse:\n    grade = "2"'
            }
            label={"Одна оценка из четырёх вариантов"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как работают and, or и not",
      explanation: (
        <>
          <Typography.Text>
            {
              "Составное условие соединяет законченные проверки. Оператор and требует истинности обеих частей, оператор or — хотя бы одной. Оператор not меняет логический результат на противоположный."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Полезно сначала вычислить каждую простую проверку отдельно и только потом соединить результаты. Так легче заметить, какая часть отвечает за итог."
            }
          </Typography.Text>
          <WorkedExample
            title={"Разберём допуск к занятию"}
            prompt={
              "Ученик допускается, если ему не меньше 14 лет и у него есть билет."
            }
            steps={[
              "При возрасте 15 лет сравнение с границей 14 даёт True.",
              "Наличие билета также даёт True.",
              "True and True даёт True, поэтому выполняется ветвь допуска.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Почему ветка elif может не выполниться, хотя её условие истинно?",
          reveal:
            "Потому что расположенная выше ветвь уже могла получить True. После выбора первой подходящей ветви Python пропускает остаток цепочки.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Почему порядок меняет результат",
      explanation: (
        <>
          <Typography.Text>
            {
              "Если широкое условие стоит раньше узкого, оно перехватывает значение. Например, проверка температуры не ниже нуля сработает и для двадцати градусов, поэтому более точная ветвь про тепло ниже неё уже не будет достигнута."
            }
          </Typography.Text>
          <Mistake
            claim={
              "Можно расположить elif в любом порядке: Python всё равно выберет самый точный случай."
            }
            explanation={
              "Python не сравнивает точность условий. Он выбирает первое истинное условие, поэтому диапазоны нужно располагать осознанно и проверять значения на стыках."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить цепочку",
      explanation: (
        <>
          <Typography.Text>
            {
              "Для проверки выпишите по одному значению из каждой ветви и отдельные значения на границах. Затем пройдите условия именно в том порядке, в котором их увидит Python."
            }
          </Typography.Text>
          <Procedure
            title={"Проверяем без догадки"}
            steps={[
              {
                label: "Отметьте все ветви.",
                detail:
                  "Для каждой ветви назовите условие и ожидаемое действие.",
              },
              {
                label: "Выберите граничные значения.",
                detail:
                  "Проверьте число перед границей, саму границу и число после неё.",
              },
              {
                label: "Вычисляйте сверху вниз.",
                detail: "Остановитесь на первой истинной проверке.",
              },
              {
                label: "Запустите примеры.",
                detail:
                  "Сравните фактическую ветвь с ожидаемой для каждого значения.",
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
          "Теперь вы умеете строить выбор из нескольких вариантов и объяснять, почему выполнилась конкретная ветвь."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Возьмите шкалу из трёх диапазонов, выпишите значения на каждой границе и подтвердите локальным запуском, что ни одно значение не потерялось."
        }
      </Typography.Text>
    </>
  ),
});
