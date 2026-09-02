import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
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
            В прошлом уроке программа выбирала один из двух вариантов с помощью
            <Notation> if</Notation> и <Notation>else</Notation>. Но у привычной
            шкалы оценок вариантов больше: результат может соответствовать
            оценке 2, 3, 4 или 5. Для такого выбора одной проверки недостаточно.
          </Typography.Text>
          <Typography.Text>
            Дополнительную ветвь записывают словом <Notation>elif</Notation> —
            это сокращение от «иначе, если». Последовательность
            <Notation> if</Notation>, одного или нескольких
            <Notation> elif</Notation> и завершающего
            <Notation> else</Notation> называют цепочкой ветвей. Python
            проверяет её сверху вниз и выполняет тело только первой подходящей
            ветви. Завершающая ветвь <Notation>else</Notation> принимает все
            значения, которые не подошли ни одному условию выше.
          </Typography.Text>
          <CodeBlock
            code={
              'score = 73\nif score >= 90:\n    grade = "5"\nelif score >= 70:\n    grade = "4"\nelif score >= 50:\n    grade = "3"\nelse:\n    grade = "2"'
            }
            label={"Одна оценка из четырёх вариантов"}
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Для <Notation>score = 73</Notation> первая проверка
            <Notation> score &gt;= 90</Notation> даёт
            <Notation> False</Notation>, а следующая
            <Notation> score &gt;= 70</Notation> — <Notation>True</Notation>.
            Поэтому в <Notation>grade</Notation> сохраняется
            <Notation> "4"</Notation>, а оставшиеся ветви пропускаются. Порядок
            проверок — часть алгоритма: сначала ставят более узкие или
            приоритетные случаи, затем общие.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как работают and, or и not",
      explanation: (
        <>
          <Typography.Text>
            Иногда одной ветви нужна не одна, а сразу несколько проверок.
            Например, для допуска важны и возраст, и наличие билета. Условие,
            которое соединяет несколько законченных проверок, называют
            составным.
          </Typography.Text>
          <Typography.Text>
            Логический оператор <Notation>and</Notation> требует, чтобы обе
            части дали <Notation>True</Notation>. Оператор{" "}
            <Notation>or</Notation>
            требует <Notation>True</Notation> хотя бы от одной части, а
            <Notation> not</Notation> меняет логический результат на
            противоположный. Сначала вычисляйте каждую простую проверку отдельно
            и только потом соединяйте результаты — так видно, какая часть
            определила итог.
          </Typography.Text>
          <WorkedExample
            title={"Разберём допуск к занятию"}
            prompt={
              "Ученик допускается, если ему не меньше 14 лет и у него есть билет."
            }
            steps={[
              <>
                При возрасте 15 лет сравнение с границей 14 даёт
                <Notation> True</Notation>.
              </>,
              <>
                Проверка наличия билета также даёт
                <Notation> True</Notation>.
              </>,
              <>
                <Notation>True and True</Notation> даёт
                <Notation> True</Notation>, поэтому выполняется ветвь допуска.
              </>,
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
            Составные проверки помогают точнее описать случай, но порядок ветвей
            всё равно решает, какая из них выполнится. Если широкое условие
            стоит раньше узкого, оно перехватывает значение. Например, проверка
            температуры не ниже нуля сработает и для двадцати градусов, поэтому
            более точная ветвь про тепло ниже неё уже не будет достигнута.
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
            Теперь объединим оба источника сложности: несколько ветвей и
            несколько проверок внутри условия. Выпишите по одному значению из
            каждой ветви и отдельные значения на границах. Затем пройдите
            условия именно в том порядке, в котором их увидит Python.
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
        Теперь вы умеете строить выбор из нескольких вариантов, соединять
        проверки с помощью <Notation>and</Notation>, <Notation>or</Notation> и
        <Notation> not</Notation> и объяснять, почему выполнилась конкретная
        ветвь.
      </Typography.Text>
      <Typography.Text>
        Возьмите шкалу из трёх диапазонов, выпишите значения на каждой границе и
        подтвердите локальным запуском, что ни одно значение не потерялось.
      </Typography.Text>
    </>
  ),
});
