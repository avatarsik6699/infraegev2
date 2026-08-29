import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonSelectResultLessonPublication } from "./course-publication.mjs";

export const pythonSelectResultLesson = defineCourseLesson({
  ...pythonSelectResultLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Отделять допустимость от сравнения результатов",
    "Находить минимум и максимум среди отфильтрованных",
    "Корректно работать с отрицательными значениями",
    "Обрабатывать отсутствие подходящего варианта",
  ],
  practiceTaskIds: pythonSelectResultLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Сначала допустимость, потом качество",
      explanation: (
        <>
          <Typography.Text>
            {
              "В задачах отбора каждый кандидат сначала проходит ограничения. Только допустимый результат можно сравнивать с текущим лучшим. Такая последовательность не позволяет запрещённому значению случайно стать минимумом или максимумом."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Если числа могут быть отрицательными или допустимый диапазон неизвестен, безопасно начать best со значения None и заменить его первым подходящим кандидатом."
            }
          </Typography.Text>
          <CodeBlock
            code={
              "best = None\nfor number in [-5, -2, -8]:\n    if best is None or number > best:\n        best = number\nprint(best)"
            }
            label={"Максимум без выдуманного начального числа"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как обновляется лучший результат",
      explanation: (
        <>
          <Typography.Text>
            {
              "Переменная best хранит лучший из уже просмотренных допустимых вариантов, а не лучший вообще. После каждой итерации это утверждение должно оставаться истинным."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Первый допустимый кандидат создаёт начальный ориентир. Каждый следующий заменяет его только при более хорошем результате."
            }
          </Typography.Text>
          <WorkedExample
            title={"Выберем максимум отрицательных"}
            prompt={"Кандидаты равны -5, -2 и -8."}
            steps={[
              "Первый кандидат заменяет None, best становится -5.",
              "Число -2 больше -5, поэтому best обновляется.",
              "Число -8 меньше -2; итоговый максимум равен -2.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt: "Почему best описывает только уже просмотренные варианты?",
          reveal:
            "Будущие кандидаты ещё не проверены. Инвариант позволяет доказать корректность пошагово: после каждой итерации best лучший среди обработанных.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Ноль не всегда безопасная инициализация",
      explanation: (
        <>
          <Typography.Text>
            {
              "Если все допустимые значения отрицательны, начальный ноль останется больше каждого кандидата, хотя его вообще не было среди вариантов."
            }
          </Typography.Text>
          <Mistake
            claim={"Для поиска максимума всегда удобно начинать с нуля."}
            explanation={
              "Ноль подходит только когда контракт гарантирует неотрицательный допустимый результат. В общем случае нужен None или первый кандидат."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверять отбор",
      explanation: (
        <>
          <Typography.Text>
            {
              "Составьте пример без подходящих вариантов, пример с одним и пример с несколькими. Это проверяет и фильтр, и инициализацию, и правило сравнения."
            }
          </Typography.Text>
          <Procedure
            title={"Проверяем лучший вариант"}
            steps={[
              {
                label: "Проверьте допустимость.",
                detail: "Запрещённый кандидат не должен менять best.",
              },
              {
                label: "Обработайте первый результат.",
                detail: "Он заменяет состояние отсутствия.",
              },
              {
                label: "Сравните следующие.",
                detail: "Обновляйте best только при улучшении.",
              },
              {
                label: "Учтите пустой итог.",
                detail:
                  "Опишите, что программа делает, если ничего не найдено.",
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
          "Теперь вы можете отделить фильтр от выбора минимума или максимума и корректно обработать отсутствие ответа."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Возьмите список с отрицательными и положительными числами, задайте два ограничения и вручную проследите изменение best на каждой итерации."
        }
      </Typography.Text>
    </>
  ),
});
