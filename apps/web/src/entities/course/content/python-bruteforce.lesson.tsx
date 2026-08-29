import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonBruteforceLessonPublication } from "./course-publication.mjs";

export const pythonBruteforceLesson = defineCourseLesson({
  ...pythonBruteforceLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Задавать конечное пространство вариантов",
    "Проверять каждый вариант одним условием",
    "Считать и сохранять найденные решения",
    "Использовать вложенный перебор для пар",
  ],
  practiceTaskIds: pythonBruteforceLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Полный перебор проверяет все допустимые варианты",
      explanation: (
        <>
          <Typography.Text>
            {
              "Перебор надёжен, когда пространство вариантов конечно и достаточно мало. Сначала программа порождает каждый кандидат, затем проверяет ограничения и только после этого учитывает подходящий результат."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Корректность зависит от двух частей: диапазон не должен терять возможный ответ, а условие не должно принимать запрещённый."
            }
          </Typography.Text>
          <CodeBlock
            code={
              "solutions = []\nfor number in range(1, 21):\n    if number % 4 == 0 and number % 6 == 0:\n        solutions.append(number)"
            }
            label={"Поиск общих кратных"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как доказывается полнота",
      explanation: (
        <>
          <Typography.Text>
            {
              "Перед запуском назовите первый и последний кандидат и объясните, почему за границами ответа быть не может. Затем проверьте условие на подходящем и почти подходящем варианте."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Если задача ищет пары, вложенные циклы порождают декартово множество сочетаний. Дополнительное условие может убрать равные или зеркальные пары."
            }
          </Typography.Text>
          <WorkedExample
            title={"Найдём пары a меньше b"}
            prompt={"Обе переменные принимают значения 1, 2 и 3."}
            steps={[
              "Внешний цикл выбирает a, внутренний перебирает все b.",
              "Условие оставляет пары (1,2), (1,3) и (2,3).",
              "Каждая допустимая пара встречается один раз; равные и обратные пары исключены.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Почему проверка диапазона так же важна, как условие внутри цикла?",
          reveal:
            "Идеальное условие не сможет принять вариант, который цикл вообще не породил.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Найденный пример ещё не доказывает полноту",
      explanation: (
        <>
          <Typography.Text>
            {
              "Программа может обнаружить один подходящий вариант и всё же пропустить лучший или требуемое количество решений, если диапазон выбран слишком узко."
            }
          </Typography.Text>
          <Mistake
            claim={
              "Если цикл нашёл правдоподобный ответ, границы перебора можно не проверять."
            }
            explanation={
              "Правдоподобие одного результата не доказывает, что рассмотрены все допустимые кандидаты."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как строить перебор",
      explanation: (
        <>
          <Typography.Text>
            {
              "Отделите генерацию кандидатов от проверки. Сначала убедитесь, что range или коллекция покрывает пространство, затем выразите ограничения как проверяемое условие."
            }
          </Typography.Text>
          <Procedure
            title={"Четыре вопроса к перебору"}
            steps={[
              {
                label: "Что является кандидатом?",
                detail: "Число, строка, пара или другая конечная конструкция.",
              },
              {
                label: "Каковы границы?",
                detail:
                  "Докажите включение первого и последнего возможного ответа.",
              },
              {
                label: "Как проверяется допустимость?",
                detail: "Соберите условие из независимых ограничений.",
              },
              {
                label: "Что сохраняется?",
                detail:
                  "Количество, список, первый или лучший подходящий результат.",
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
          "Теперь вы можете задать конечный перебор, проверить варианты и объяснить, почему ответ не потерян."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Выберите числа от 1 до 30, найдите удовлетворяющие двум условиям и сначала вручную проверьте границы и один отклонённый кандидат."
        }
      </Typography.Text>
    </>
  ),
});
