import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonIteratorsGeneratorsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-iterators-generators.media";

export const pythonIteratorsGeneratorsLesson = defineCourseLesson({
  ...pythonIteratorsGeneratorsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["map и filter", "Генераторные выражения", "yield"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Сквозная задача ещё раз: числа пришли строкой{" "}
            <Notation>{'"5 -2 10 7"'}</Notation>. Переведём их в числа через{" "}
            <Notation>{"map"}</Notation> и посчитаем сумму и наибольшее:
          </Typography.Text>
          <CodeBlock
            code={
              'numbers = map(int, "5 -2 10 7".split())\nprint(sum(numbers))\nprint(max(numbers))'
            }
            label={"Сумма и наибольшее по одному map"}
            language="python"
            fileName="main.py"
            output={"20"}
            error={"ValueError: max() iterable argument is empty"}
          />
          <Typography.Text>
            Сумма верная, а <Notation>{"max"}</Notation> жалуется, что чисел
            нет.{" "}
            <strong>
              <Notation>{"map"}</Notation> выдаёт значения по одному и не хранит
              их: <Notation>{"sum"}</Notation> забрал все, и второму проходу
              ничего не осталось
            </strong>
            . В этом уроке разберём, как <Notation>{"for"}</Notation> получает
            элементы, почему одни источники одноразовые, а другие нет, и как
            написать свой источник значений.
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
            label={"Что выдаёт for для знакомых источников"}
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
            Общее у них одно: <Notation>{"for"}</Notation> просит у источника
            следующий элемент, пока элементы не кончатся. Кто их выдаёт —
            разберём дальше.
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
              Итератор помнит текущую позицию и по запросу выдаёт следующий
              элемент.
            </strong>{" "}
            Список, строка, <Notation>{"range"}</Notation> —{" "}
            <strong>перебираемые объекты</strong>: каждый из них умеет создать
            новый итератор. <Notation>{"for"}</Notation> так и делает: берёт у
            источника итератор и просит у него элементы. Это можно сделать
            вручную:
          </Typography.Text>
          <CodeBlock
            code={
              "numbers = [10, 20, 30]\niterator = iter(numbers)\nprint(next(iterator))\nprint(next(iterator))\nprint(list(iterator))\nprint(list(iterator))"
            }
            label={"iter и next для списка"}
            language="python"
            fileName="main.py"
            output={"10\n20\n[30]\n[]"}
          />
          <Typography.Text>
            <Notation>{"iter"}</Notation> создаёт итератор,{" "}
            <Notation>{"next"}</Notation> берёт следующий элемент. Позиция
            движется только вперёд — как у открытого файла в уроке о файлах:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.cursoriternumbers}
            label={"Позиция итератора списка [10, 20, 30]"}
          />
          <Typography.Text>
            Когда элементы кончились, <Notation>{"next"}</Notation> вызывает
            ошибку <Notation>{"StopIteration"}</Notation>, а{" "}
            <Notation>{"for"}</Notation> принимает её за обычный конец цикла.
            Сам список при этом не меняется: новый <Notation>{"for"}</Notation>{" "}
            по нему создаст новый итератор. Открытый файл и{" "}
            <Notation>{"map"}</Notation> — сами себе итераторы, поэтому второй
            проход по ним пуст.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: next с запасным значением"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"next(iterator, None)"}</Notation> вместо ошибки вернёт{" "}
              <Notation>{"None"}</Notation>, когда элементы кончились. Если сам{" "}
              <Notation>{"None"}</Notation> может быть элементом, такой ответ
              неотличим от конца.
            </Typography.Text>
          </ProofDisclosure>
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
              <Notation>{"filter"}</Notation> оставляет подходящие — оба выдают
              результаты по одному.
            </strong>{" "}
            <Notation>{"map(функция, источник)"}</Notation> — результаты функции
            для каждого элемента.{" "}
            <Notation>{"filter(функция, источник)"}</Notation> — только те
            элементы, для которых функция вернула истину. Чтобы пройти по
            результатам дважды, их один раз собирают в список:
          </Typography.Text>
          <CodeBlock
            code={
              'numbers = list(map(int, "5 -2 10 7".split()))\nprint(sum(numbers), max(numbers))\nprint(list(filter(lambda x: x > 0, numbers)))'
            }
            label={"Сумма, наибольшее и положительные числа"}
            language="python"
            fileName="main.py"
            output={"20 10\n[5, 10, 7]"}
          />
          <Typography.Text>
            <Notation>{"list"}</Notation> забрал все значения{" "}
            <Notation>{"map"}</Notation> и сохранил их, а по списку можно ходить
            сколько угодно. <Notation>{"lambda"}</Notation> — короткая функция
            из урока об аргументах.
          </Typography.Text>
          <Typography.Text>
            Частая запись{" "}
            <Notation>{"a, b = map(int, input().split())"}</Notation> означает:
            прочитать строку, разбить её, перевести части в числа и распаковать
            в два имени. Если частей не две, распаковка завершится ошибкой.
          </Typography.Text>
          <CodeBlock
            code={"a, b = map(int, input().split())\nprint(a + b)"}
            label={"Два числа из одной строки ввода"}
            language="python"
            fileName="main.py"
            output={"⟪3 4⟫\n7"}
          />
          <Typography.Text>
            Списковое включение <Notation>{"[int(x) for x in parts]"}</Notation>{" "}
            делает то же, что <Notation>{"list(map(int, parts))"}</Notation>.
            Выбирай запись, которая понятнее.
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
            </strong>{" "}
            Оно записывается как списковое включение, только в круглых скобках.
            Если оно — единственный аргумент функции, хватает её скобок:
          </Typography.Text>
          <CodeBlock
            code={
              "numbers = [2, 4, 6]\ntotal = sum(x * x for x in numbers)\nprint(total)\nprint(sum(1 for x in range(1, 101) if x % 7 == 0))"
            }
            label={"Генераторные выражения в sum"}
            language="python"
            fileName="main.py"
            output={"56\n14"}
          />
          <Typography.Text>
            <Notation>{"sum"}</Notation> получает квадраты по одному и сразу
            складывает — список квадратов не создаётся. Вторая строка считает
            кратные 7: каждое даёт единицу, а <Notation>{"sum"}</Notation> их
            складывает.
          </Typography.Text>
          <Typography.Text>
            Это экономит память, когда элементы нужны один раз. Но генератор
            тоже одноразовый. И быстрее алгоритм от него не становится: миллиард
            вариантов он переберёт так же долго.
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
              Функция с <Notation>{"yield"}</Notation> выдаёт значения по одному
              и между ними стоит на паузе.
            </strong>{" "}
            Такая функция при вызове ничего не считает, а создаёт{" "}
            <strong>генератор</strong>. Тело начинает выполняться, когда у
            генератора просят элемент. <Notation>{"yield"}</Notation> отдаёт
            значение и ставит функцию на паузу, сохранив её переменные; при
            следующем запросе выполнение продолжается со строки после{" "}
            <Notation>{"yield"}</Notation>. <Notation>{"return"}</Notation>, в
            отличие от него, завершает вызов окончательно.
          </Typography.Text>
          <Typography.Text>
            Запусти программу по шагам: на каждом <Notation>{"yield"}</Notation>{" "}
            переменные функции остаются на месте с пометкой «на паузе», а{" "}
            <Notation>{"n"}</Notation> при продолжении сохраняет прежнее
            значение.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runSquaresUpTo}
            label={"Генератор квадратов squares_up_to"}
          />
          <Typography.Text>
            <Notation>{"list"}</Notation> просит у генератора элементы, пока он
            не закончится: после 16 следующий квадрат 25 больше 20, цикл{" "}
            <Notation>{"while"}</Notation> завершается, и генератор кончается.
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
            Как исправить программу из вступления, чтобы она напечатала и сумму,
            и наибольшее?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Один раз собрать значения в список:{" "}
            <Notation>
              {'numbers = list(map(int, "5 -2 10 7".split()))'}
            </Notation>
            . По списку можно пройти дважды.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            После <Notation>{"it = iter([1, 2, 3])"}</Notation> выполнили{" "}
            <Notation>{"next(it)"}</Notation>. Что вернёт{" "}
            <Notation>{"list(it)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"[2, 3]"}</Notation>: первый элемент уже забран.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт <Notation>{"list(squares_up_to(10))"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"[1, 4, 9]"}</Notation>: следующий квадрат 16 больше 10.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает{" "}
            <Notation>
              {"print(sum(1 for x in range(1, 31) if x % 7 == 0))"}
            </Notation>
            ?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>4: кратны 7 числа 7, 14, 21, 28.</Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{"sum(x * x for x in range(1_000_000))"}</Notation>{" "}
            требует меньше памяти, чем{" "}
            <Notation>{"sum([x * x for x in range(1_000_000)])"}</Notation>?
            Запись <Notation>{"1_000_000"}</Notation> — то же число 1000000:
            подчёркивания только облегчают чтение.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В первом случае каждый квадрат сразу идёт в сумму. Во втором сначала
            в памяти хранится список из миллиона квадратов. Квадратов
            вычисляется столько же — экономится память, а не время.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        За каждым <Notation>{"for"}</Notation> стоит итератор, который выдаёт
        элементы по одному и не возвращается назад. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Итератор",
            note: (
              <>
                Помнит позицию и выдаёт следующий элемент;{" "}
                <Notation>{"iter"}</Notation> и <Notation>{"next"}</Notation>{" "}
                делают вручную то, что делает <Notation>{"for"}</Notation>.
              </>
            ),
          },
          {
            key: "Одноразовые",
            note: (
              <>
                Файл, <Notation>{"map"}</Notation>,{" "}
                <Notation>{"filter"}</Notation> и генераторы после прохода
                пусты; список и <Notation>{"range"}</Notation> обходят снова.
              </>
            ),
          },
          {
            key: (
              <>
                <Notation>{"map"}</Notation>, <Notation>{"filter"}</Notation>
              </>
            ),
            note: (
              <>
                Функция к каждому элементу и отбор подходящих;{" "}
                <Notation>{"list(...)"}</Notation> собирает результаты, чтобы
                пройти дважды.
              </>
            ),
          },
          {
            key: "Генераторное выражение",
            note: (
              <>
                <Notation>{"sum(x * x for x in numbers)"}</Notation> — без
                промежуточного списка.
              </>
            ),
          },
          {
            key: <Notation>{"yield"}</Notation>,
            note: (
              <>
                Выдаёт значение и ставит функцию на паузу до следующего запроса.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
