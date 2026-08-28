import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonConditionsLessonPublication } from "./course-publication.mjs";

export const pythonConditionsLesson = defineCourseLesson({
  ...pythonConditionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Объяснять, какое значение True или False даёт сравнение",
    "Прослеживать выполнение программы с if и else",
    "Выбирать строгий или нестрогий знак сравнения для граничного значения",
    "Писать программу, которая выбирает один из двух вариантов",
    "Проверять обе ветви программы на своём компьютере",
  ],
  practiceTaskIds: pythonConditionsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "comparison-result",
      navLabel: "Что получается при сравнении",
      explanation: (
        <>
          <Typography.Text>
            Сравнение отвечает на один вопрос: верно ли указанное условие. У
            ответа только два возможных значения — <Notation>True</Notation>
            («да, верно») и <Notation>False</Notation> («нет, неверно»).
          </Typography.Text>
          <CodeBlock
            code={
              "temperature = 3\nprint(temperature < 0)\nprint(temperature >= 0)"
            }
            label="Два сравнения одного значения"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            При <Notation>temperature = 3</Notation> первое сравнение даёт
            <Notation> False</Notation>, а второе — <Notation>True</Notation>.
            Python ещё ничего не выбирает: пока он только вычисляет результаты
            двух сравнений.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Проверим условие без догадки"
          prompt="Пусть score = 10. Вычислим score >= 10 по частям."
          steps={[
            <>
              Слева стоит текущее значение <Notation>score</Notation>, то есть
              <Notation> 10</Notation>.
            </>,
            <>
              Знак <Notation>&gt;=</Notation> означает «больше или равно»,
              поэтому равенство тоже подходит.
            </>,
            <>
              Условие <Notation>10 &gt;= 10</Notation> верно, его результат —
              <Notation> True</Notation>.
            </>,
          ]}
        />
      ),
    },
    {
      id: "if-branch",
      navLabel: "Как if выбирает действие",
      explanation: (
        <>
          <Typography.Text>
            Команда <Notation>if</Notation> выполняет вложенный блок только
            тогда, когда условие после неё равно <Notation>True</Notation>.
            После условия ставится двоеточие, а команды внутри ветви сдвигаются
            вправо одинаковым отступом.
          </Typography.Text>
          <CodeBlock
            code={
              'temperature = int(input())\nif temperature < 0:\n    print("На улице мороз")\nprint("Проверка закончена")'
            }
            label="Одна условная ветвь"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Строка про мороз появится только для отрицательной температуры.
            Последняя команда не входит в ветвь: у неё нет отступа, поэтому она
            выполняется при любом вводе.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="Отступ нужен только для красоты, поэтому его можно убрать."
          explanation={
            <>
              В Python отступ показывает, какие команды принадлежат ветви
              <Notation> if</Notation>. Если после двоеточия нет вложенного
              блока, программа останавливается с
              <Notation> IndentationError</Notation>.
            </>
          }
        />
      ),
      checkpoint: [
        {
          id: "checkpoint-if",
          prompt:
            "Что напечатает программа выше, если пользователь введёт число 2?",
          reveal: (
            <>
              Только <Notation>Проверка закончена</Notation>. Сравнение
              <Notation> 2 &lt; 0</Notation> даёт <Notation>False</Notation>,
              поэтому вложенная команда пропускается.
            </>
          ),
        },
      ],
    },
    {
      id: "if-else",
      navLabel: "Как выбрать одну из двух ветвей",
      explanation: (
        <>
          <Typography.Text>
            Если программа должна выполнить одно действие при верном условии и
            другое — при неверном, после <Notation>if</Notation> добавляют
            <Notation> else</Notation>. За один запуск выполняется ровно одна из
            этих ветвей.
          </Typography.Text>
          <CodeBlock
            code={
              'age = int(input())\nif age >= 14:\n    print("Можно участвовать")\nelse:\n    print("Пока рано")'
            }
            label="Выбор между двумя сообщениями"
            language="python"
            showLineNumbers
          />
          <Procedure
            title="Прослеживаем программу с if/else"
            steps={[
              {
                label: "Подставьте введённое значение.",
                detail: "Замените имя переменной в условии конкретным числом.",
              },
              {
                label: "Вычислите результат сравнения.",
                detail: "Получите True или False до выбора ветви.",
              },
              {
                label: "Выполните одну подходящую ветвь.",
                detail: "При True работает блок if, при False — блок else.",
              },
              {
                label: "Продолжите после условия.",
                detail:
                  "Команды без отступа после обеих ветвей выполняются дальше по порядку.",
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "comparison-boundaries",
      navLabel: "Как не потерять граничное значение",
      explanation: (
        <>
          <Typography.Text>
            Знаки <Notation>&gt;</Notation> и <Notation>&lt;</Notation> не
            включают границу, а <Notation>&gt;=</Notation> и{" "}
            <Notation>&lt;=</Notation>
            включают её. Для правила «14 лет и старше» нужен знак
            <Notation> &gt;=</Notation>: значение 14 должно попасть в первую
            ветвь.
          </Typography.Text>
          <Typography.Text>
            Для проверки равенства используют <Notation>==</Notation>, а для
            неравенства — <Notation>!=</Notation>. Один знак
            <Notation> =</Notation> не сравнивает значения: он сохраняет
            значение в переменной.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="Если условие age > 14 работает для 15, оно подходит и для правила «14 и старше»."
          explanation={
            <>
              Проверьте саму границу. При <Notation>age = 14</Notation>{" "}
              сравнение
              <Notation> 14 &gt; 14</Notation> даёт <Notation>False</Notation>.
              Нужен знак <Notation>&gt;=</Notation>, который включает равенство.
            </>
          }
        />
      ),
      checkpoint: [
        {
          id: "checkpoint-boundary",
          prompt:
            "Какой знак подойдёт для правила «температура не выше 5 градусов»?",
          reveal: (
            <>
              Знак <Notation>&lt;=</Notation>. Формулировка «не выше» включает и
              все значения меньше 5, и саму границу 5.
            </>
          ),
        },
      ],
    },
    {
      id: "test-both-branches",
      navLabel: "Как проверить обе ветви",
      explanation: (
        <>
          <Typography.Text>
            Один удачный запуск проверяет только одну ветвь. Подберите минимум
            два значения: одно делает условие верным, другое — неверным. Если в
            условии есть граница, проверьте и её отдельно.
          </Typography.Text>
          <CodeBlock
            code={
              'number = int(input())\nif number > 0:\n    print("Положительное")\nelse:\n    print("Ноль или отрицательное")'
            }
            label="Программа для самостоятельного запуска"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Запустите программу со значениями <Notation>3</Notation>,
            <Notation> −2</Notation> и <Notation>0</Notation>. Ноль особенно
            важен: он стоит на границе и не является положительным числом.
          </Typography.Text>
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-tests",
          prompt:
            "Почему для условия number > 0 недостаточно проверить только число 3?",
          reveal:
            "Такой запуск показывает лишь ветвь if. Нужны ещё значение для else и сама граница 0.",
        },
      ],
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-whole-condition",
      prompt:
        "Какие три шага нужны, чтобы проследить программу с if/else для конкретного ввода?",
      reveal:
        "Подставить значение, получить True или False и выполнить только соответствующую ветвь.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь вы можете объяснить результат сравнения, проследить выбор ветви и
        написать программу, которая по одному условию выбирает один из двух
        вариантов.
      </Typography.Text>
      <Typography.Text>
        Следующий урок добавит несколько ветвей и составные условия. Перед ним
        проверьте свои программы на значениях по обе стороны границы и на самой
        границе.
      </Typography.Text>
    </>
  ),
});
