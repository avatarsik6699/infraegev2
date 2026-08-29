import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonProgramPartsLessonPublication } from "./course-publication.mjs";

export const pythonProgramPartsLesson = defineCourseLesson({
  ...pythonProgramPartsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Разделять ввод, вычисление и вывод",
    "Задавать одной функции одну понятную ответственность",
    "Передавать результаты между функциями",
    "Проверять части программы независимо",
  ],
  practiceTaskIds: pythonProgramPartsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Одна функция — одна ответственность",
      explanation: (
        <>
          <Typography.Text>
            {
              "Обычно программа не становится большой за один раз. Сначала в ней появляется ввод, затем новое вычисление, повторяющийся поиск и сохранение. Когда фрагмент уже можно назвать человеческими словами, его удобно вынести в функцию."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Это не призыв дробить каждую строку. Граница полезна там, где часть делает одно понятное дело: прочитать число, найти запись, вычислить результат или показать его."
            }
          </Typography.Text>
          <CodeBlock
            code={
              "def read_number():\n    return int(input())\n\ndef double(number):\n    return number * 2\n\nvalue = read_number()\nprint(double(value))"
            }
            label={"Ввод и вычисление разделены"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как данные проходят между частями",
      explanation: (
        <>
          <Typography.Text>
            {
              "Основная программа связывает функции в последовательность. Возвращённое значение первой части становится аргументом второй, а вывод происходит только после завершения вычисления."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "При трассировке следуйте по значениям, а не прыгайте между всеми строками сразу: вход, результат первой функции, результат второй, вывод."
            }
          </Typography.Text>
          <WorkedExample
            title={"Проследим два вызова"}
            prompt={"read_number возвращает 6, затем вызывается double."}
            steps={[
              "Переменная value получает число 6.",
              "Вызов double получает 6 как параметр number.",
              "Функция возвращает 12, и только это число передаётся print.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Какой признак показывает, что часть программы стоит оформить отдельной функцией?",
          reveal:
            "Эту часть можно ясно назвать, описать её вход и возвращаемый результат и проверить независимо от ввода или вывода.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Смешанные обязанности затрудняют проверку",
      explanation: (
        <>
          <Typography.Text>
            {
              "Если функция одновременно спрашивает input, вычисляет и печатает, её трудно попробовать на заранее выбранном значении. Когда вычисление получает аргумент и возвращает результат, его можно спокойно проверить отдельно."
            }
          </Typography.Text>
          <Mistake
            claim={
              "Чем больше действий внутри одной функции, тем меньше строк в основной программе и тем лучше решение."
            }
            explanation={
              "Короткая основная программа полезна только тогда, когда назначение частей видно по именам и движению данных. Скрытая смесь ввода, вычисления и вывода усложняет понимание."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как находить границы функций",
      explanation: (
        <>
          <Typography.Text>
            {
              "Выпишите этапы решения обычными словами. Объединяйте команды, которые вместе дают один называемый результат, и передавайте этот результат следующей части."
            }
          </Typography.Text>
          <Procedure
            title={"Собираем программу"}
            steps={[
              {
                label: "Опишите вход и итог.",
                detail: "Зафиксируйте формат данных и требуемый результат.",
              },
              {
                label: "Выделите вычисления.",
                detail:
                  "Каждая функция должна иметь понятный возвращаемый результат.",
              },
              {
                label: "Соедините вызовы.",
                detail: "Передавайте данные явно через аргументы и return.",
              },
              {
                label: "Проверьте отдельно.",
                detail:
                  "Для вычислительных функций используйте маленькие готовые аргументы.",
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
          "Теперь вы можете собирать программу из частей с ясным движением данных между ними."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Возьмите линейную программу из ввода, двух вычислений и вывода. Разделите её на функции и проверьте вычислительную часть без input."
        }
      </Typography.Text>
    </>
  ),
});
