import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonStepper,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonIteratorsGeneratorsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-iterators-generators.media";

export const pythonIteratorsGeneratorsLesson = defineCourseLesson({
  ...pythonIteratorsGeneratorsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Map", "Генераторные выражения", "Yield"],
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
              <Notation>{"for"}</Notation> получает элементы от итератора,
              который помнит позицию и выдаёт значения по одному; одноразовый
              итератор после исчерпания пуст
            </strong>
            . На этом устроены <Notation>{"map"}</Notation>, генераторные
            выражения и <Notation>{"yield"}</Notation>. Опора — все источники,
            по которым уже ходил <Notation>{"for"}</Notation>, и курсор файла из
            урока о файлах: здесь видно, что у них общий механизм.
          </Typography.Text>
          <Typography.Text>
            Возьмём строку <Notation>{'"10 -2 7"'}</Notation>: превратим её в
            числа через <Notation>{"map"}</Notation> и посмотрим, почему второй
            проход по тому же <Notation>{"map"}</Notation> пуст.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Что выдаёт for",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"for"}</Notation> уже ходил по многим источникам — у
              всех один механизм.
            </strong>{" "}
            Вспомним, что выдаёт <Notation>{"for"}</Notation> для каждого
            знакомого источника:
          </Typography.Text>
          <LessonTable
            label={"Вспомним, что выдаёт for для каждого знакомого источника"}
            columns={[
              { label: "Источник" },
              { label: "Что получает переменная цикла" },
              { label: "Урок" },
            ]}
            rows={[
              [
                <>
                  <Notation>{"range(a, b, step)"}</Notation>
                </>,
                "Числа арифметической последовательности",
                <>
                  о <Notation>{"for"}</Notation>
                </>,
              ],
              ["Строка", "Символы по порядку", "о строках"],
              ["Список, кортеж", "Элементы по порядку", "о списках и кортежах"],
              [
                "Словарь",
                <>
                  Ключи; <Notation>{".items()"}</Notation> — пары
                </>,
                "о словарях",
              ],
              ["Множество", "Элементы без гарантии порядка", "о множествах"],
              [
                <>
                  <Notation>{"enumerate"}</Notation>,{" "}
                  <Notation>{"zip"}</Notation>
                </>,
                "Пары «номер — элемент», элементы по позициям",
                "о кортежах",
              ],
              ["Открытый файл", "Строки файла по одной", "о файлах"],
            ]}
          />
          <Typography.Text>
            Этот урок объясняет, что у них общего: каждый источник выдаёт{" "}
            <Notation>{"for"}</Notation> <strong>итератор</strong>, а итератор
            помнит позицию.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Итератор",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Итератор помнит текущую позицию и выдаёт следующий элемент.
            </strong>{" "}
            Теперь уточним механизм. <strong>Итератор</strong> — объект, который
            помнит текущую позицию и умеет выдавать следующий элемент.{" "}
            <strong>Перебираемый объект</strong> умеет предоставить итератор.
            Список можно обходить заново; отдельный итератор обычно движется
            только вперёд.
          </Typography.Text>
          <CodeBlock
            code={
              "numbers = [10, 20, 30]\niterator = iter(numbers)\nprint(next(iterator))\nprint(next(iterator))\nprint(list(iterator))\nprint(list(iterator))"
            }
            label={
              "Список можно обходить заново; отдельный итератор обычно движется только вперёд"
            }
            language="python"
            fileName="numbers.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"10\n20\n[30]\n[]"}
          />
          <Typography.Text>
            <Notation>{"iter"}</Notation> получает итератор,{" "}
            <Notation>{"next"}</Notation> запрашивает следующий элемент. После
            исчерпания <Notation>{"next"}</Notation> без запасного значения
            вызывает <Notation>{"StopIteration"}</Notation>. Цикл{" "}
            <Notation>{"for"}</Notation> обрабатывает этот сигнал как нормальное
            окончание. Можно использовать{" "}
            <Notation>{"next(iterator, None)"}</Notation>, чтобы при исчерпании
            получить указанное значение, но нужно отличать его от настоящего
            элемента <Notation>{"None"}</Notation>, если такой допустим.
          </Typography.Text>
          <Typography.Text>
            Это объясняет, почему прочитанный файл и использованный{" "}
            <Notation>{"map"}</Notation> не стоит бездумно обходить второй раз:
            это источники с текущим состоянием. <Notation>{"range"}</Notation>,
            напротив, — повторно перебираемый объект, а не одноразовый итератор.
          </Typography.Text>
          <Typography.Text>
            Итератор устроен так же, как открытый файл в уроке о файлах: у него
            есть позиция, и она движется только вперёд. Те же шаги для списка{" "}
            <Notation>{"[10, 20, 30]"}</Notation>:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.cursoriternumbers}
            label={
              "Итератор устроен так же, как открытый файл в уроке о файлах: у него есть позиция, и она движется только вперёд. Те же шаги для списка [10, 20, 30]:"
            }
          />
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "map и filter",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"map"}</Notation> применяет функцию к каждому элементу,{" "}
              <Notation>{"filter"}</Notation> оставляет подходящие — оба
              постепенно.
            </strong>{" "}
            <Notation>{"map(function, source)"}</Notation> постепенно применяет
            функцию к каждому элементу.{" "}
            <Notation>{"filter(function, source)"}</Notation> постепенно
            пропускает только элементы с истинным результатом проверки.
          </Typography.Text>
          <CodeBlock
            code={
              'parts = "10 -2 7".split()\nconverted = map(int, parts)\nnumbers = list(converted)\nprint(numbers)\nprint(list(converted))\nprint(list(filter(lambda x: x > 0, numbers)))'
            }
            label={"Программа на Python"}
            language="python"
            fileName="parts.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[10, -2, 7]\n[]\n[10, 7]"}
          />
          <Typography.Text>
            <Notation>{"map"}</Notation> ещё не список.{" "}
            <Notation>{"list"}</Notation> потребляет его и собирает результаты,
            поэтому второй <Notation>{"list(converted)"}</Notation> пуст. Запись{" "}
            <Notation>{"a, b = map(int, input().split())"}</Notation> означает:
            прочитать строку, разбить, последовательно преобразовать две части,
            распаковать в два имени. Если частей не две, распаковка завершится
            ошибкой.
          </Typography.Text>
          <CodeBlock
            code={"a, b = map(int, input().split())\nprint(a + b)"}
            label={"Если частей не две, распаковка завершится ошибкой"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"⟪3 4⟫\n7"}
          />
          <Typography.Text>
            Списковое включение <Notation>{"[int(x) for x in parts]"}</Notation>{" "}
            часто читается не хуже. Выбор между ними — вопрос ясности, а не
            обязательный приём профессионального кода.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Генераторное выражение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Генераторное выражение выдаёт результаты по одному, не создавая
              список.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "numbers = [2, 4, 6]\ntotal = sum(x * x for x in numbers)\nprint(total)\nprint(sum(1 for x in range(1, 101) if x % 7 == 0))"
            }
            label={
              "Генераторное выражение выдаёт результаты по одному, не создавая список"
            }
            language="python"
            fileName="numbers.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"56\n14"}
          />
          <Typography.Text>
            Выражение <Notation>{"x * x for x in numbers"}</Notation> выдаёт
            результаты по одному. Оно называется{" "}
            <strong>генераторным выражением</strong>. В отличие от спискового
            включения, оно не создаёт сразу весь список квадратов. Если оно
            единственный аргумент вызова, отдельные внешние скобки можно не
            писать. Вторая строка считает подходящие числа: каждое кратное 7
            даёт единицу, а <Notation>{"sum"}</Notation> их складывает.
          </Typography.Text>
          <Typography.Text>
            Это экономит память, когда элементы нужны только один раз. Но
            генератор также исчерпывается. И он не делает автоматически быстрым
            алгоритм, который всё равно рассматривает миллиард комбинаций.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "yield",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Функция с <Notation>{"yield"}</Notation> выдаёт значения и
              приостанавливается между ними.
            </strong>
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runSquaresUpTo}
            label={
              "Функция с yield выдаёт значения и приостанавливается между ними"
            }
          />
          <Typography.Text>
            <Notation>{"yield"}</Notation> выдаёт значение и приостанавливает
            функцию, сохранив её локальное состояние. При следующем запросе
            выполнение продолжается после <Notation>{"yield"}</Notation>.
            Обычный <Notation>{"return"}</Notation> завершает вызов
            окончательно.
          </Typography.Text>
          <Typography.Text>
            Функция, в теле которой есть <Notation>{"yield"}</Notation>, при
            вызове создаёт генератор. Её тело начинает выполняться при запросе
            элементов. Это важно, если внутри находятся проверка аргументов,
            чтение файла или другие действия: они произойдут не обязательно в
            момент создания генератора.
          </Typography.Text>
          <Typography.Text>
            Запусти программу выше по шагам. Каждый{" "}
            <Notation>{"yield"}</Notation> отдаёт значение и ставит функцию на
            паузу: её переменные остаются на месте с пометкой «на паузе», а при
            следующем запросе выполнение продолжается со строки после{" "}
            <Notation>{"yield"}</Notation> с прежним значением{" "}
            <Notation>{"n"}</Notation>.
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
            Почему <Notation>{"sum(x * x for x in range(1_000_000))"}</Notation>{" "}
            требует меньше дополнительной памяти, чем{" "}
            <Notation>{"sum([x * x for x in range(1_000_000)])"}</Notation>?
            Запись <Notation>{"1_000_000"}</Notation> — то же число 1000000:
            подчёркивания только облегчают чтение.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В первом случае очередной квадрат можно сразу включить в сумму,
            затем перейти к следующему. Во втором сначала сохраняется миллион
            квадратов в списке. Количество вычисляемых квадратов одинаково;
            экономия относится прежде всего к памяти.
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
                <Notation>{"for"}</Notation> берёт элементы у итератора;{" "}
                <Notation>{"iter"}</Notation> и <Notation>{"next"}</Notation>{" "}
                делают это вручную.
              </>
            ),
          },
          {
            note: (
              <>
                Итератор одноразовый: после исчерпания он пуст;{" "}
                <Notation>{"range"}</Notation> и список можно обходить снова.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"map"}</Notation> и <Notation>{"filter"}</Notation>{" "}
                работают постепенно; <Notation>{"list(...)"}</Notation> собирает
                их результаты.
              </>
            ),
          },
          {
            note: (
              <>
                Генераторное выражение в <Notation>{"sum(...)"}</Notation>,{" "}
                <Notation>{"any(...)"}</Notation> не создаёт промежуточный
                список.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"yield"}</Notation> выдаёт значение и
                приостанавливает функцию до следующего запроса.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
