import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonExceptionsLessonPublication } from "./course-publication.mjs";

export const pythonExceptionsLesson = defineCourseLesson({
  ...pythonExceptionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Отличать ожидаемую ошибку ввода от ошибки программы",
    "Перехватывать конкретное исключение",
    "Повторять ввод после ValueError",
    "Не скрывать неизвестные ошибки широким except",
  ],
  practiceTaskIds: pythonExceptionsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "expected",
      navLabel: "Некоторые ошибки являются частью обычного сценария",
      explanation: (
        <>
          <Typography.Text>
            Раньше мы читали traceback, чтобы исправить код. Но пользователь
            действительно может написать слово там, где программа просит число.
            Код исправен; ему нужен понятный путь восстановления.
          </Typography.Text>
          <CodeBlock
            code={
              'text = input("Количество: ")\ntry:\n    count = int(text)\nexcept ValueError:\n    print("Нужно целое число")\nelse:\n    print(count * 2)'
            }
            label="Одна ожидаемая ошибка"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            В блок <Notation>try</Notation> помещена только рискованная
            операция. В<Notation>except ValueError</Notation> находится
            восстановление именно после неверного преобразования, а{" "}
            <Notation>else</Notation> выполняется после успешного ввода.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "specific",
      navLabel: "У исключения должна быть известная причина",
      explanation: (
        <>
          <WorkedExample
            title="Почему не стоит ловить всё"
            prompt="Внутри try есть преобразование числа и обращение к неизвестной переменной."
            steps={[
              "ValueError от int можно ожидать из-за пользовательского текста.",
              "NameError означает ошибку автора программы и требует исправления кода.",
              "except без типа скрыл бы обе причины под одним сообщением.",
              "Узкий except ValueError сохраняет настоящий NameError видимым.",
            ]}
          />
          <Mistake
            claim="except без типа делает программу надёжной, потому что она больше не падает."
            explanation="Широкий except может скрыть опечатку, повреждение данных и ошибку алгоритма. Обрабатывайте только ту причину, после которой действительно умеете восстановиться."
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-scope",
          prompt:
            "Почему в try лучше оставить только операцию, которая ожидаемо может завершиться ошибкой?",
          reveal:
            "Так except не примет случайный сбой соседнего кода за известную ситуацию.",
        },
      ],
    },
    {
      id: "retry",
      navLabel: "Цикл позволяет спокойно попросить значение ещё раз",
      explanation: (
        <>
          <Typography.Text>
            Если без числа продолжать нельзя, знакомый{" "}
            <Notation>while</Notation> повторяет запрос. Успешное преобразование
            завершает цикл через <Notation>break</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'while True:\n    try:\n        count = int(input("Количество: "))\n    except ValueError:\n        print("Введите целое число")\n    else:\n        break\n\nprint(count)'
            }
            label="Повторный ввод"
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "decision",
      navLabel: "Сначала решаем, можно ли восстановиться",
      explanation: (
        <Procedure
          title="Проверяем необходимость try/except"
          steps={[
            {
              label: "Назовите риск.",
              detail: "Какое конкретное исключение ожидается?",
            },
            {
              label: "Назовите восстановление.",
              detail: "Что полезного программа сделает после него?",
            },
            {
              label: "Сузьте try.",
              detail: "Оставьте только связанную рискованную операцию.",
            },
            {
              label: "Не прячьте неизвестное.",
              detail: "Остальные ошибки должны сохранить traceback.",
            },
            {
              label: "Проверьте два пути.",
              detail: "Запустите успешный и ошибочный ввод.",
            },
          ]}
        />
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-recovery",
      prompt: "Когда исключение стоит обрабатывать, а не просто исправлять?",
      reveal:
        "Когда причина ожидаема во время нормальной работы и программа знает конкретный безопасный способ продолжить.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Вы умеете сохранить понятный пользовательский сценарий после ожидаемой
        ошибки и при этом не спрятать настоящую проблему программы.
      </Typography.Text>
      <Typography.Text>
        Этот навык пригодится при чтении файлов и в финальном менеджере задач,
        где ввод и сохранённые данные не всегда оказываются правильными с
        первого раза.
      </Typography.Text>
    </>
  ),
});
