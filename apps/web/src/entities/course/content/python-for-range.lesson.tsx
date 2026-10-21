import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  RangeSandbox,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonForRangeLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-for-range.media";

export const pythonForRangeLesson = defineCourseLesson({
  ...pythonForRangeLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Перебирать с range", "Находить первое подходящее"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В прошлом уроке цикл <Notation>{"while"}</Notation> сам вёл счётчик:
            задавал начало, проверял границу, делал шаг. Так перебирают числа
            очень часто, и для этого в Python есть запись короче.{" "}
            <strong>
              <Notation>{"for"}</Notation> берёт значения из готового источника
              по одному, а <Notation>{"range"}</Notation> выдаёт нужные числа:
              начало, граница и шаг записываются в одном месте
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            В примерах будем искать и считать кратные: первое кратное 17 среди
            чисел от 100 до 200, кратные 7 до 100.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Цикл for",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"for"}</Notation> по очереди берёт значения источника и
              выполняет тело для каждого.
            </strong>{" "}
            Источник — то, из чего можно брать значения по одному, например
            строка или <Notation>{"range"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={'for letter in "CODE":\n    print(letter)'}
            label={"for по очереди берёт значения источника"}
            language="python"
            fileName="main.py"
            output={"C\nO\nD\nE"}
          />
          <Typography.Text>
            На каждой итерации имя <Notation>{"letter"}</Notation> связывается с
            очередной буквой. Имя можно выбрать любое:{" "}
            <Notation>{"letter"}</Notation> — не команда. В отличие от{" "}
            <Notation>{"while"}</Notation>, здесь не нужно самому увеличивать
            номер и следить за границей: источник сам кончается.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"for"}</Notation> и <Notation>{"while"}</Notation> делают
            одно и то же повторение, просто <Notation>{"for"}</Notation> берёт
            счётчик на себя. Сравни две записи суммы 1 + 2 + 3 + 4:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.forWhile}
            caption={
              <>
                Всё, что в <Notation>{"while"}</Notation> пишут вручную, в{" "}
                <Notation>{"for"}</Notation> лежит внутри{" "}
                <Notation>{"range(1, 5)"}</Notation>: начало 1, граница 5 и шаг
                1, который не пишут, — он подразумевается.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "range",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"range"}</Notation> выдаёт целые числа от начала до
              границы с заданным шагом; сама граница в перебор не входит.
            </strong>{" "}
            У <Notation>{"range"}</Notation> три формы:
          </Typography.Text>
          <CodeBlock
            code={
              'for i in range(4):\n    print(i, end=" ")\nprint()\nfor i in range(2, 6):\n    print(i, end=" ")\nprint()\nfor i in range(5, 0, -2):\n    print(i, end=" ")'
            }
            label={"У range три формы"}
            language="python"
            fileName="main.py"
            output={"0 1 2 3 \n2 3 4 5 \n5 3 1 "}
          />
          <Typography.Text>
            <Notation>{"range(4)"}</Notation> — числа от 0 до 3: одно число —
            это граница, а начало по умолчанию 0.{" "}
            <Notation>{"range(2, 6)"}</Notation> — от 2 до 5.{" "}
            <Notation>{"range(5, 0, -2)"}</Notation> — от 5 вниз шагом 2: при
            отрицательном шаге перебор идёт, пока значение больше границы.
            Пустой <Notation>{"print()"}</Notation> переводит строку после
            каждого цикла.
          </Typography.Text>
          <Typography.Text>
            Чтобы пройти числа от <Notation>{"a"}</Notation> до{" "}
            <Notation>{"b"}</Notation> включительно, пишут{" "}
            <Notation>{"range(a, b + 1)"}</Notation>: например, от 1 до 100 —{" "}
            <Notation>{"range(1, 101)"}</Notation>.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: как устроен range" kind="nuance">
            <Typography.Text>
              <Notation>{"range"}</Notation> не создаёт все числа заранее: он
              хранит начало, границу и шаг и выдаёт числа по одному, поэтому{" "}
              <Notation>{"range(10 ** 9)"}</Notation> не занимает памяти. Шаг 0
              запрещён — <Notation>{"ValueError"}</Notation>.{" "}
              <Notation>{"range(5, 0)"}</Notation> пуст: шаг по умолчанию 1, а 5
              уже не меньше 0. Исключённая граница удобна: в{" "}
              <Notation>{"range(n)"}</Notation> ровно <Notation>{"n"}</Notation>{" "}
              чисел, а <Notation>{"range(0, k)"}</Notation> и{" "}
              <Notation>{"range(k, n)"}</Notation> стыкуются без пересечения.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Здесь показан <Notation>{"range(2, 9, 3)"}</Notation>: от 2 шагами
            по 3 получаются 2, 5 и 8, а следующее значение 11 уже не меньше 9;
            сама граница 9 в перебор не входит. Меняй start, stop и step — схема
            и список значений пересчитываются сразу.
          </Typography.Text>
          <RangeSandbox mode="range" start={2} stop={9} step={3} />
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Переменная цикла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Присваивание переменной цикла не меняет следующие значения{" "}
              <Notation>{"for"}</Notation>.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={"for i in range(3):\n    print(i)\n    i = 100"}
            label={
              "Присваивание переменной цикла не меняет следующие значения for"
            }
            language="python"
            fileName="main.py"
            output={"0\n1\n2"}
          />
          <Typography.Text>
            Присваивание связывает имя <Notation>{"i"}</Notation> с 100 только
            до конца итерации. Следующая итерация снова берёт очередное число из{" "}
            <Notation>{"range"}</Notation>. Если правила перехода должны
            меняться по ходу, нужен <Notation>{"while"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Вложенные циклы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Во вложенных циклах внутренний выполняется целиком для каждого
              значения внешнего.
            </strong>{" "}
            Так перебирают все пары: строки и столбцы таблицы, два числа из
            диапазона. Нажми «Запуск» и пройди по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runNestedLoops}
            label={
              "Во вложенных циклах внутренний выполняется целиком для каждого значения внешнего"
            }
          />
          <Typography.Text>
            Для каждого <Notation>{"row"}</Notation> внутренний цикл выполняется
            целиком: пары <Notation>{"(0, 0)"}</Notation>,{" "}
            <Notation>{"(0, 1)"}</Notation>, <Notation>{"(0, 2)"}</Notation>,
            затем <Notation>{"(1, 0)"}</Notation>,{" "}
            <Notation>{"(1, 1)"}</Notation>, <Notation>{"(1, 2)"}</Notation>.
            Всего 2 × 3 итерации внутреннего тела.{" "}
            <Notation>{"break"}</Notation> внутри него завершает только
            внутренний цикл.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.loopGrid2_3}
            caption={
              <>
                Номер в углу клетки — очередь, в которой выполняется тело
                внутреннего цикла: строка за строкой, внутри строки — все
                значения <Notation>{"column"}</Notation>.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Первое подходящее",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перебор по возрастанию с <Notation>{"break"}</Notation> находит
              наименьшее подходящее значение.
            </strong>{" "}
            Найдём первое число от 100 до 200, кратное 17:
          </Typography.Text>
          <CodeBlock
            code={
              "answer = None\nfor n in range(100, 201):\n    if n % 17 == 0:\n        answer = n\n        break\nprint(answer)"
            }
            label={"Первое число от 100 до 200, кратное 17"}
            language="python"
            fileName="main.py"
            output={"102"}
          />
          <Typography.Text>
            Перебор идёт по возрастанию, поэтому первое найденное число —
            наименьшее, и дальше искать незачем. Запись{" "}
            <Notation>{"answer = None"}</Notation> заранее говорит «ответа пока
            нет»: если подходящего числа не найдётся, программа напечатает{" "}
            <Notation>{"None"}</Notation>. Проверяют это записью{" "}
            <Notation>{"answer is None"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: is None и else у цикла"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"is"}</Notation> проверяет, что это то же самое
              значение <Notation>{"None"}</Notation>, а не просто равное ему;
              для <Notation>{"None"}</Notation> так принято писать. У цикла
              бывает <Notation>{"else"}</Notation>: его блок выполняется, если
              цикл закончился без <Notation>{"break"}</Notation>, в том числе
              при нуле итераций. Поиск кратного 17 там, где его нет:
            </Typography.Text>
            <CodeBlock
              code={
                'for n in range(103, 119):\n    if n % 17 == 0:\n        print(n)\n        break\nelse:\n    print("нет")'
              }
              label={"else у цикла выполняется, если не было break"}
              language="python"
              fileName="main.py"
              output={"нет"}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Шаг range",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Шаг <Notation>{"range"}</Notation> позволяет перебирать только
              нужные числа.
            </strong>{" "}
            Найдём количество и сумму чисел от 1 до 100 включительно, кратных 7:
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\ntotal = 0\nfor n in range(1, 101):\n    if n % 7 == 0:\n        count += 1\n        total += n\nprint(count, total)"
            }
            label={
              "Количество и сумма чисел от 1 до 100 включительно, кратных 7"
            }
            language="python"
            fileName="main.py"
            output={"14 735"}
          />
          <Typography.Text>
            То же можно перебрать сразу по кратным:{" "}
            <Notation>{"range(7, 101, 7)"}</Notation>. Проверка не нужна, а цикл
            делает 14 итераций вместо 100. Такая замена верна, если понятно,
            почему она охватывает все нужные числа и только их: 7 — первое
            кратное, шаг 7 даёт каждое следующее, а следующее кратное, 105, уже
            больше 100.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6-skvoznaya",
      navLabel: "Сквозная задача",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сквозная задача курса: сумма и наибольшее, когда количество чисел
              известно заранее.
            </strong>{" "}
            В прошлом уроке числа вводились до признака 0. Часто данные устроены
            иначе: сначала вводится, сколько будет чисел, затем сами числа.
            Тогда подходит <Notation>{"for"}</Notation>: он повторит ввод нужное
            число раз. Имя переменной цикла здесь не нужно, и его по соглашению
            называют <Notation>{"_"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "count = int(input())\nn = int(input())\ntotal = n\nbest = n\nfor _ in range(count - 1):\n    n = int(input())\n    total += n\n    if n > best:\n        best = n\nprint(total, best)"
            }
            label={
              "Сумма и наибольшее, когда количество чисел известно заранее"
            }
            language="python"
            fileName="main.py"
            output={"⟪4⟫\n⟪5⟫\n⟪-2⟫\n⟪10⟫\n⟪7⟫\n20 10"}
          />
          <Typography.Text>
            Первое число читаем до цикла — с него начинаются и сумма, и лучшее.
            Остальные <Notation>{"count - 1"}</Notation> чисел читает цикл.
            Признак окончания больше не нужен, поэтому среди чисел может быть и
            ноль.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s7",
      navLabel: "Три способа порядка строк",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Порядок выполнения строк задают три основных способа.
            </strong>{" "}
            Модули «Старт», «Условия» и «Циклы» вместе дали всё, чем программа
            управляет своим ходом в первых задачах:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.controlFlow}
            caption={
              <>
                <strong>Подряд</strong>: присваивание,{" "}
                <Notation>{"print"}</Notation>, <Notation>{"input"}</Notation>{" "}
                выполняются сверху вниз по одной. <strong>Выбор</strong>:{" "}
                <Notation>{"if"}</Notation>, <Notation>{"elif"}</Notation>,{" "}
                <Notation>{"else"}</Notation> выполняют один блок из нескольких
                или ни одного. <strong>Повтор</strong>:{" "}
                <Notation>{"while"}</Notation> и <Notation>{"for"}</Notation>{" "}
                возвращаются к началу блока, пока условие истинно или есть
                значения.
              </>
            }
          />
          <Typography.Text>
            Программы курса — сочетания этих способов, вложенных друг в друга.
            Поэтому чтение незнакомого кода сводится к одному вопросу на каждой
            строке: какая строка выполнится следующей и какие значения у имён
            сейчас. Именно это показывает запуск примера по шагам: подсвеченная
            строка и значения переменных.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Какие числа дают <Notation>{"range(3, 15, 4)"}</Notation>,{" "}
            <Notation>{"range(10, 0, -3)"}</Notation> и{" "}
            <Notation>{"range(5, 5)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>3, 7, 11; 10, 7, 4, 1; ни одного.</Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Как записать перебор чисел от 20 до 30 включительно? Сколько в нём
            чисел?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"range(20, 31)"}</Notation>; 11 чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>Перепиши цикл через for:</Typography.Text>
          <CodeBlock
            code={"i = 0\nwhile i < 10:\n    print(i)\n    i += 2"}
            label={"Цикл while с шагом 2"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"for i in range(0, 10, 2):"}</Notation> и в теле{" "}
            <Notation>{"print(i)"}</Notation>: начало 0, граница 10, шаг 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что выведет цикл <Notation>{"for i in range(3)"}</Notation>, в теле
            которого сначала <Notation>{"i = i * 10"}</Notation>, а потом{" "}
            <Notation>{"print(i)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            0, 10 и 20: в начале каждой итерации <Notation>{"i"}</Notation>{" "}
            снова получает очередное число <Notation>{"range"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает программа поиска первого кратного 17, если перебирать{" "}
            <Notation>{"range(103, 119)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"None"}</Notation>: между 103 и 118 кратных 17 нет (102 и
            119 — за границами), и <Notation>{"answer"}</Notation> остался
            прежним.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        <Notation>{"for"}</Notation> и <Notation>{"range"}</Notation> берут
        счётчик на себя — так перебирают числа в большинстве задач курса и ЕГЭ.
        Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"for x in источник"}</Notation>,
            note: <>Берёт значения по одному; источник сам кончается.</>,
          },
          {
            key: <Notation>{"range(a, b, step)"}</Notation>,
            note: (
              <>
                От <Notation>{"a"}</Notation> до границы{" "}
                <Notation>{"b"}</Notation>, не включая её; начало по умолчанию
                0, шаг — 1. Отрицательный шаг идёт вниз.
              </>
            ),
          },
          {
            key: "Включительно",
            note: (
              <>
                От <Notation>{"a"}</Notation> до <Notation>{"b"}</Notation>{" "}
                включительно — <Notation>{"range(a, b + 1)"}</Notation>.
              </>
            ),
          },
          {
            key: "Вложенные циклы",
            note: (
              <>Внутренний выполняется целиком для каждого значения внешнего.</>
            ),
          },
          {
            key: "Первое подходящее",
            note: (
              <>
                Перебор по возрастанию с <Notation>{"break"}</Notation>; нет
                ответа — <Notation>{"None"}</Notation>.
              </>
            ),
          },
          {
            key: "Шаг",
            note: (
              <>
                <Notation>{"range(7, 101, 7)"}</Notation> перебирает только
                кратные — без проверки.
              </>
            ),
          },
          {
            key: <Notation>{"for _ in range(count)"}</Notation>,
            note: <>Повторить действие известное число раз.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
