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
            В прошлом уроке цикл по очереди брал элементы списка и обновлял
            состояние. С числом можно работать так же, если научиться отделять
            от него по одной цифре. Для этого соединим два уже знакомых
            действия: остаток и целое деление.
          </Typography.Text>
          <Typography.Text>
            Остаток от деления на <Notation>10</Notation> даёт последнюю цифру,
            а целое деление на <Notation>10</Notation> удаляет её. Эти операции
            не меняют исходную переменную сами — результат нужно присвоить.
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
              "Чтобы продолжить с числом 53, результат целого деления нужно присвоить переменной number.",
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
            Один шаг отделяет только одну цифру. Чтобы обработать всё число,
            повторяем этот шаг: после каждой итерации
            <Notation> number</Notation> становится короче и явно приближается к
            нулю. Это знакомая мера прогресса для
            <Notation> while</Notation>.
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
            На первой итерации получается цифра <Notation>8</Notation> и число
            сокращается до <Notation>53</Notation>. Затем приходят цифры
            <Notation> 3</Notation> и <Notation>5</Notation>. Цикл читает их
            справа налево; для суммы порядок не важен, а в задачах, где он
            важен, его нужно учитывать отдельно.
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
            Алгоритм уже работает для положительных чисел, но его границы нужно
            назвать отдельно. Для исходного нуля условие
            <Notation> number &gt; 0</Notation> сразу ложно, поэтому тело цикла
            не выполнится ни разу. Если задача спрашивает количество цифр, у
            числа 0 всё равно одна цифра — этот случай нужно обработать явно.
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
        <>
          <Typography.Text>
            Теперь соберём операции с цифрой, состояние и остановку
            <Notation> while</Notation> в один алгоритм. Сначала уточните, какие
            числа допустимы и какой результат нужно получить.
          </Typography.Text>
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
        </>
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
        Теперь вы можете отделить цифру с помощью <Notation>%</Notation>,
        укоротить число через <Notation>//</Notation> и обновить нужное
        состояние на каждой итерации.
      </Typography.Text>
      <Typography.Text>
        Дальше тот же принцип «берём один элемент и обновляем состояние»
        перейдёт со цифр на строки и коллекции.
      </Typography.Text>
    </>
  ),
});
