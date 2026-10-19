import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
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
            <strong>
              <Notation>{"for"}</Notation> берёт значения из готового источника
              по одному, а <Notation>{"range(start, stop, step)"}</Notation> —
              источник чисел, в котором начало включено, а остановка исключена
            </strong>
            . Опора — <Notation>{"while"}</Notation> прошлого урока:{" "}
            <Notation>{"for"}</Notation> делает то же повторение, но счётчик и
            границу ведёт за тебя.
          </Typography.Text>
          <Typography.Text>
            Числа возьмём от 100 до 200, а делитель — 17: найдём первое кратное,
            научимся перебирать только кратные и считать их.
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
              <Notation>{"for"}</Notation> по очереди получает элементы
              источника и выполняет тело для каждого.
            </strong>{" "}
            Источник, из которого можно последовательно получать элементы,
            называют <strong>перебираемым объектом</strong>. Примерами будут
            строка, диапазон и список.
          </Typography.Text>
          <CodeBlock
            code={'for letter in "CODE":\n    print(letter)'}
            label={"Примерами будут строка, диапазон и список"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"C\nO\nD\nE"}
          />
          <Typography.Text>
            На каждой итерации <Notation>{"letter"}</Notation> связывается с
            очередной буквой. Получатся четыре строки. Имя можно выбрать другое;
            слово <Notation>{"letter"}</Notation> не является специальной
            командой. В отличие от <Notation>{"while"}</Notation>, здесь не
            нужно самому увеличивать номер и следить за границей: источник сам
            кончается.
          </Typography.Text>
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
              <Notation>{"range"}</Notation> описывает арифметическую
              последовательность целых чисел.
            </strong>{" "}
            Он хранит её параметры, а не заранее созданный список всех чисел.{" "}
            <Notation>{"range(4)"}</Notation> даёт 0, 1, 2, 3, а{" "}
            <Notation>{"range(2, 6)"}</Notation> — 2, 3, 4, 5: сама остановка, 4
            в первом случае и 6 во втором, в перебор не попадает.
          </Typography.Text>
          <Typography.Text>
            В форме <Notation>{"range(start, stop, step)"}</Notation> начало
            включено, остановка исключена. При положительном шаге перебор
            продолжается, пока значение меньше <Notation>{"stop"}</Notation>;
            при отрицательном — пока больше <Notation>{"stop"}</Notation>:{" "}
            <Notation>{"range(5, 0, -2)"}</Notation> даёт 5, 3, 1. Шаг 0
            запрещён. <Notation>{"range(5, 0)"}</Notation> пуст: шаг по
            умолчанию 1, а 5 уже не меньше 0.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.range2_9_3}
            caption={
              <>
                <Notation>{"range(2, 9, 3)"}</Notation>: от 2 шагами по 3
                получаются 2, 5 и 8; следующее значение 11 уже не меньше 9. Сама
                остановка 9 в перебор не входит, даже если на неё попал бы шаг.
              </>
            }
          />
          <Typography.Text>
            Чтобы пройти целые от <Notation>{"a"}</Notation> до{" "}
            <Notation>{"b"}</Notation> включительно при{" "}
            <Notation>{"a <= b"}</Notation>, используют{" "}
            <Notation>{"range(a, b + 1)"}</Notation>. Исключённая правая граница
            удобна: количество целых от 0 до <Notation>{"n - 1"}</Notation>{" "}
            равно <Notation>{"n"}</Notation>; соседние диапазоны{" "}
            <Notation>{"range(0, k)"}</Notation> и{" "}
            <Notation>{"range(k, n)"}</Notation> не перекрываются.
          </Typography.Text>
          <Typography.Text>
            Проверь правило на своих числах: меняй start, stop и step — схема и
            список значений пересчитываются сразу.
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
            showLineNumbers={false}
            outputLayout="lines"
            output={"0\n1\n2"}
          />
          <Typography.Text>
            Присваивание меняет текущее имя, но не источник будущих значений.
            Следующая итерация снова получает очередной элемент{" "}
            <Notation>{"range"}</Notation>. Для изменения правил перехода чаще
            нужен <Notation>{"while"}</Notation>.
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
            </strong>
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
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "answer = None\nfor n in range(100, 201):\n    if n % 17 == 0:\n        answer = n\n        break\nprint(answer)"
            }
            label={
              "Перебор по возрастанию с break находит наименьшее подходящее значение"
            }
            language="python"
            fileName="answer.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"102"}
          />
          <Typography.Text>
            Перебор идёт по возрастанию, поэтому первый найденный результат
            минимален. Если подходящего числа нет, сохраняется{" "}
            <Notation>{"None"}</Notation>. Проверять отсутствие результата
            следует как <Notation>{"answer is None"}</Notation>; слово{" "}
            <Notation>{"is"}</Notation> сравнивает тождественность объектов.
            Подробно отличим его от <Notation>{"=="}</Notation> в уроке о
            списках.
          </Typography.Text>
          <Typography.Text>
            У цикла также бывает <Notation>{"else"}</Notation>: он выполняется
            при нормальном исчерпании перебора, если{" "}
            <Notation>{"break"}</Notation> не был выполнен. Для{" "}
            <Notation>{"while"}</Notation> это завершение по ложному условию.{" "}
            <Notation>{"else"}</Notation> может выполниться и при нуле итераций.
            Это конструкция «не встретился выход через break», а не «условие
            последней итерации было ложным». Пока такая запись непривычна, явное{" "}
            <Notation>{"answer = None"}</Notation> обычно понятнее. Вот как
            выглядит поиск кратного 17 там, где его нет:
          </Typography.Text>
          <CodeBlock
            code={
              'for n in range(103, 119):\n    if n % 17 == 0:\n        print(n)\n        break\nelse:\n    print("нет")'
            }
            label={"Вот как выглядит поиск кратного 17 там, где его нет"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"нет"}
          />
          <Typography.Text>
            Между 103 и 118 кратных 17 нет (102 и 119 — за границами),{" "}
            <Notation>{"break"}</Notation> не сработал, и выполнилась ветка{" "}
            <Notation>{"else"}</Notation>.
          </Typography.Text>
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
              "Найдём количество и сумму чисел от 1 до 100 включительно, кратных 7"
            }
            language="python"
            fileName="count.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"14 735"}
          />
          <Typography.Text>
            Можно перебирать только нужные числа с помощью{" "}
            <Notation>{"range(7, 101, 7)"}</Notation>: тогда проверка не нужна,
            а цикл делает 14 итераций вместо 100. Такой переход полезен, когда
            понятно, почему он охватывает все и только нужные значения: 7 —
            первое кратное, шаг 7 даёт каждое следующее, а 100 {"<"} 105.
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
              Порядок выполнения строк задают три способа — и других нет.
            </strong>{" "}
            Модули «Старт», «Условия» и «Циклы» вместе дали всё, чем программа
            управляет своим ходом:
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
            Любая программа курса — сочетание этих трёх способов, вложенных друг
            в друга. Поэтому чтение незнакомого кода сводится к одному вопросу
            на каждой строке: какая строка выполнится следующей и какие значения
            у имён сейчас. Именно это показывает запуск примера по шагам:
            подсвеченная строка и значения переменных.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t2",
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
      id: "t3",
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
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Что выведет цикл <Notation>{"for i in range(3)"}</Notation>, в теле
            которого сначала <Notation>{"i = i * 10"}</Notation>, а потом{" "}
            <Notation>{"print(i)"}</Notation>? Какое значение получит{" "}
            <Notation>{"i"}</Notation> в начале следующей итерации?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            0, 10 и 20; в начале каждой итерации <Notation>{"i"}</Notation>{" "}
            снова получает очередное значение <Notation>{"range"}</Notation>: 1,
            затем 2.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <LessonSummary
        items={[
          {
            note: (
              <>
                <Notation>{"for x in источник"}</Notation> берёт значения по
                одному; источник сам кончается.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"range(a, b)"}</Notation> — числа от{" "}
                <Notation>{"a"}</Notation> до <Notation>{"b − 1"}</Notation>;
                чтобы включить <Notation>{"b"}</Notation>, пишут{" "}
                <Notation>{"range(a, b + 1)"}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                Отрицательный шаг идёт вниз, пока значение больше{" "}
                <Notation>{"stop"}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                Вложенный цикл выполняется целиком для каждого значения
                внешнего.
              </>
            ),
          },
          {
            note: (
              <>
                Первый найденный при переборе по возрастанию — наименьший;
                отсутствие ответа — <Notation>{"None"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
