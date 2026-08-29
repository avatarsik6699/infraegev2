import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonNumberDigitsLessonPublication } from "./course-publication.mjs";

export const pythonNumberDigitsLesson = defineCourseLesson({
  ...pythonNumberDigitsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Получать последнюю цифру положительного целого числа",
    "Удалять последнюю цифру целым делением",
    "Трассировать обработку всех цифр в цикле",
    "Считать сумму или количество цифр",
  ],
  practiceTaskIds: pythonNumberDigitsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "one-step",
      navLabel: "Две операции отделяют последнюю цифру",
      explanation: (
        <>
          <Typography.Text>
            Мы уже знаем смысл остатка и целого деления. Теперь соединим их.
            Остаток от деления на
            <Notation>10</Notation> даёт последнюю цифру, а целое деление на{" "}
            <Notation>10</Notation>
            удаляет её.
          </Typography.Text>
          <CodeBlock
            code={
              "number = 538\nlast_digit = number % 10\nremaining = number // 10\nprint(last_digit)\nprint(remaining)"
            }
            label="Один шаг обработки"
            language="python"
            showLineNumbers
          />
          <WorkedExample
            title="Разберём число 538"
            prompt="Нужно отделить последнюю цифру и сохранить оставшуюся часть."
            steps={[
              "538 % 10 даёт 8.",
              "538 // 10 даёт 53.",
              "Исходное число не меняется само: новое значение нужно присвоить переменной.",
            ]}
          />
        </>
      ),
    },
    {
      id: "loop",
      navLabel: "Повторяем шаг, пока цифры не закончатся",
      explanation: (
        <>
          <Typography.Text>
            После каждого шага число становится короче. Это знакомый признак
            подходящего
            <Notation>while</Notation>: состояние явно приближается к нулю.
          </Typography.Text>
          <CodeBlock
            code={
              "number = 538\ntotal = 0\n\nwhile number > 0:\n    digit = number % 10\n    total += digit\n    number //= 10\n\nprint(total)"
            }
            label="Сумма цифр"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Цифры приходят справа налево: <Notation>8</Notation>, затем{" "}
            <Notation>3</Notation>, затем <Notation>5</Notation>. Для суммы
            порядок не важен. Если порядок важен, это нужно учесть отдельно.
          </Typography.Text>
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Каким станет number после двух итераций для исходного значения 538?",
          reveal: "Сначала 53, затем 5.",
        },
      ],
    },
    {
      id: "zero",
      navLabel: "Ноль требует отдельного взгляда",
      explanation: (
        <>
          <Typography.Text>
            Для положительного числа цикл выполняется хотя бы один раз. Для
            исходного нуля условие
            <Notation>number &gt; 0</Notation> сразу ложно. Если задача
            спрашивает количество цифр, у числа 0 всё равно одна цифра — значит,
            этот случай нужно назвать явно.
          </Typography.Text>
          <Mistake
            claim="Один цикл одинаково обработает любое целое число без дополнительных решений."
            explanation="Ноль не входит в цикл number > 0, а отрицательный знак не является цифрой. Сначала уточните допустимый вход и отдельно обработайте нужные границы."
          />
        </>
      ),
    },
    {
      id: "procedure",
      navLabel: "Как построить алгоритм по цифрам",
      explanation: (
        <Procedure
          title="От вопроса к циклу"
          steps={[
            {
              label: "Уточните вход.",
              detail:
                "Работаем с положительными числами, нулём или всеми целыми?",
            },
            {
              label: "Выберите накопитель.",
              detail: "Нужны сумма, количество, максимум или новая запись?",
            },
            {
              label: "Получите цифру.",
              detail: "Используйте остаток от деления на 10.",
            },
            {
              label: "Обновите результат.",
              detail: "Примените условие только там, где оно нужно.",
            },
            {
              label: "Укоротите число.",
              detail: "Иначе while никогда не приблизится к остановке.",
            },
          ]}
        />
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-direction",
      prompt: "В каком порядке цикл получает цифры числа 204?",
      reveal: "Справа налево: 4, 0, 2.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Вы превратили знакомые <Notation>%</Notation>, <Notation>//</Notation>,
        условие и накопитель в полноценный алгоритм обработки целого числа.
      </Typography.Text>
      <Typography.Text>
        Дальше тот же принцип «берём один элемент и обновляем состояние»
        перейдёт со цифр на строки и коллекции.
      </Typography.Text>
    </>
  ),
});
