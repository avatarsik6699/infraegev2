import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonErrorsLessonPublication } from "./course-publication.mjs";

export const pythonErrorsLesson = defineCourseLesson({
  ...pythonErrorsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Находить тип ошибки в последней строке сообщения Python",
    "Находить файл и строку, на которой остановилась программа",
    "Различать SyntaxError, NameError, TypeError и ValueError",
    "Связывать сообщение об ошибке с конкретной причиной в коде",
    "Исправлять одну причину и проверять результат повторным запуском",
  ],
  practiceTaskIds: pythonErrorsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "error-as-clue",
      navLabel: "Что сообщает Python",
      explanation: (
        <>
          <Typography.Text>
            Сообщение об ошибке — это не оценка программы и не требование
            переписать всё заново. Python показывает место, где он не смог
            продолжить, называет тип ошибки и добавляет короткое объяснение. Эти
            части помогают проверить одну конкретную причину.
          </Typography.Text>
          <Typography.Text>
            Есть два частых момента остановки. При ошибке синтаксиса Python не
            может разобрать запись программы и не начинает её выполнять. При
            других исключениях программа уже запустилась, дошла до некоторой
            строки и столкнулась с недопустимой операцией или значением.
          </Typography.Text>
          <WorkedExample
            title="Сначала отделим место от причины"
            prompt="В сообщении есть строка File «main.py», line 2 и финальная строка NameError: name 'total' is not defined."
            steps={[
              <>
                <Notation>main.py</Notation> и <Notation>line 2</Notation>
                показывают, где программа остановилась.
              </>,
              <>
                <Notation>NameError</Notation> называет тип ошибки.
              </>,
              <>
                Текст после двоеточия уточняет причину: имя
                <Notation> total</Notation> не было определено.
              </>,
            ]}
          />
        </>
      ),
    },
    {
      id: "read-bottom-up",
      navLabel: "Как читать traceback снизу вверх",
      explanation: (
        <>
          <Typography.Text>
            Сообщение о необработанной ошибке во время выполнения называется
            <Notation> traceback</Notation>. В длинной программе в нём может
            быть несколько строк с файлами и вызовами. Пока мы работаем с одним
            небольшим файлом, достаточно начать с конца и подняться к ближайшей
            строке своего кода.
          </Typography.Text>
          <CodeBlock
            code={
              "Traceback (most recent call last):\n  File \"main.py\", line 2, in <module>\n    print(total)\n          ^^^^^\nNameError: name 'total' is not defined"
            }
            label="Traceback для неизвестного имени"
            language="text"
          />
          <Procedure
            title="Читаем сообщение в рабочем порядке"
            steps={[
              {
                label: "Прочитайте последнюю строку.",
                detail:
                  "До двоеточия стоит тип ошибки, после него — пояснение причины.",
              },
              {
                label: "Найдите строку своего файла.",
                detail:
                  "Фрагмент File показывает имя файла, а line — номер строки.",
              },
              {
                label: "Сопоставьте код и пояснение.",
                detail:
                  "Проверьте только названное имя, операцию, значение или знак рядом с указанным местом.",
              },
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-traceback-order",
          prompt:
            "С какой части traceback полезнее начать, если сообщение занимает несколько строк?",
          reveal:
            "С последней строки: она называет тип ошибки и краткую причину. Затем поднимитесь к строке своего файла.",
        },
      ],
    },
    {
      id: "syntax-error",
      navLabel: "Когда возникает SyntaxError",
      explanation: (
        <>
          <Typography.Text>
            <Notation>SyntaxError</Notation> означает, что запись программы не
            соответствует правилам Python. Интерпретатор ещё не выполняет
            команды: сначала ему нужно понять структуру кода. В сообщении
            показывается строка и указатель примерно под местом, где разбор
            перестал быть возможен.
          </Typography.Text>
          <CodeBlock
            code={'score = 10\nif score >= 10\n    print("зачёт")'}
            label="Условие без двоеточия"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Вторая строка должна заканчиваться двоеточием:
            <Notation> if score &gt;= 10:</Notation>. Указатель помогает найти
            место, но причину всё равно нужно проверить по правилу конструкции.
          </Typography.Text>
          <Mistake
            claim="Указатель всегда стоит точно под символом, который нужно заменить."
            explanation="Python показывает место, где запись перестала складываться в допустимую конструкцию. Причина может находиться немного раньше: например, перед переводом строки пропущено двоеточие."
          />
        </>
      ),
    },
    {
      id: "name-error",
      navLabel: "Почему появляется NameError",
      explanation: (
        <>
          <Typography.Text>
            <Notation>NameError</Notation> появляется во время выполнения, когда
            Python встречает имя, которому ещё не присвоено значение. Частая
            причина — опечатка: переменная создана под одним именем, а ниже
            записана немного иначе.
          </Typography.Text>
          <CodeBlock
            code={"number = 6\nif number > 0:\n    print(nubmer * 2)"}
            label="Две переставленные буквы в имени"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Программа доходит до третьей строки и ищет имя
            <Notation> nubmer</Notation>. Такого имени нет. Сравнение с первой
            строкой показывает исправление: в <Notation>print</Notation> нужно
            написать <Notation>number</Notation>.
          </Typography.Text>
          <Mistake
            claim="Если имя выглядит почти так же, Python поймёт, какую переменную мы имели в виду."
            explanation={
              <>
                Для Python <Notation>number</Notation> и
                <Notation> nubmer</Notation> — два разных имени. Нужно сравнить
                написание полностью, включая порядок букв и регистр.
              </>
            }
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-name-error",
          prompt:
            "Что проверить первым при сообщении NameError: name 'result' is not defined?",
          reveal:
            "Найдите место, где result должно было получить значение, и сравните написание имени в обеих строках.",
        },
      ],
    },
    {
      id: "type-or-value",
      navLabel: "Чем TypeError отличается от ValueError",
      explanation: (
        <>
          <Typography.Text>
            <Notation>TypeError</Notation> сообщает, что операция получила
            неподходящий вид данных. Например, <Notation>input()</Notation>
            возвращает строку, и Python не складывает её с числом без явного
            преобразования.
          </Typography.Text>
          <CodeBlock
            code={"age = input()\nprint(age + 1)"}
            label="Строку пытаются сложить с числом"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            <Notation>ValueError</Notation> означает другую ситуацию: вид данных
            подходит операции, но конкретное содержимое использовать нельзя.
            Функция <Notation>int</Notation> принимает строку, однако строка{" "}
            <Notation>"семь"</Notation> не записывает целое число цифрами.
          </Typography.Text>
          <CodeBlock
            code={'number = int("семь")'}
            label="Строка с неподходящим значением"
            language="python"
            showLineNumbers
          />
          <WorkedExample
            title="Различим две причины"
            prompt="Сравним age + 1 и int(«семь»)."
            steps={[
              <>
                В <Notation>age + 1</Notation> участвуют строка и число — для
                сложения это неподходящее сочетание типов, поэтому возникает
                <Notation> TypeError</Notation>.
              </>,
              <>
                В <Notation>int("семь")</Notation> передана допустимая строка,
                но её содержимое нельзя прочитать как целое число.
              </>,
              <>
                Поэтому второй пример завершается
                <Notation> ValueError</Notation>.
              </>,
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-type-value",
          prompt:
            "Почему int(«12») работает, а int(«двенадцать») завершается с ValueError?",
          reveal:
            "Обе записи — строки, но только «12» содержит допустимую цифровую запись целого числа.",
        },
      ],
    },
    {
      id: "fix-and-rerun",
      navLabel: "Как исправлять без догадки",
      explanation: (
        <>
          <Typography.Text>
            Исправление подтверждается не исчезновением красного текста в
            редакторе, а новым запуском программы с понятным ожидаемым
            результатом. Меняйте одну предполагаемую причину за раз: иначе
            трудно понять, какое изменение действительно помогло.
          </Typography.Text>
          <Procedure
            title="Короткий цикл исправления"
            steps={[
              {
                label: "Назовите тип и место ошибки.",
                detail:
                  "Прочитайте последнюю строку и найдите ближайшую строку своего файла.",
              },
              {
                label: "Сформулируйте одну причину.",
                detail:
                  "Например: пропущено двоеточие, имя написано иначе или строка складывается с числом.",
              },
              {
                label: "Измените только связанную часть.",
                detail:
                  "Не переписывайте соседние команды, если сообщение на них не указывает.",
              },
              {
                label: "Запустите тот же пример снова.",
                detail:
                  "Сравните фактический вывод с тем, который ожидали получить.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-whole-error",
      prompt:
        "Какой порядок действий помогает перейти от длинного сообщения к проверенному исправлению?",
      reveal:
        "Прочитать последнюю строку, найти строку своего файла, связать тип и пояснение с одной причиной, изменить связанную часть и запустить пример снова.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь вы можете разобрать базовое сообщение Python на место, тип и
        пояснение причины. Вы умеете отличать ошибку записи программы от ошибки
        во время выполнения и знаете, что проверить при NameError, TypeError и
        ValueError.
      </Typography.Text>
      <Typography.Text>
        Возьмите одну из своих недавних программ и намеренно измените имя
        переменной. Прочитайте новое сообщение снизу вверх, верните правильное
        имя и убедитесь повторным запуском, что программа снова выдаёт ожидаемый
        результат.
      </Typography.Text>
    </>
  ),
});
