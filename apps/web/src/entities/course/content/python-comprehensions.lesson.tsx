import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonComprehensionsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-comprehensions.media";

export const pythonComprehensionsLesson = defineCourseLesson({
  ...pythonComprehensionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Включения", "Sum/min/max/all/any"],
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
              Списковое включение — короткая запись уже понятного цикла с{" "}
              <Notation>{"append"}</Notation>, а <Notation>{"sum"}</Notation>,{" "}
              <Notation>{"min"}</Notation>, <Notation>{"max"}</Notation>,{" "}
              <Notation>{"all"}</Notation> и <Notation>{"any"}</Notation>{" "}
              заменяют типовые циклы-накопители
            </strong>
            . Опора — цикл с <Notation>{"append"}</Notation> из урока о списках
            и накопители из урока о <Notation>{"while"}</Notation>: здесь у них
            появляется короткая запись.
          </Typography.Text>
          <Typography.Text>
            Начнём с квадратов чисел от 1 до 5, а потом превратим строку{" "}
            <Notation>{'"10 -2 7"'}</Notation> в список чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Включение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Включение записывает правило построения списка, которое раньше
              давал цикл.
            </strong>{" "}
            Построим квадраты чисел:
          </Typography.Text>
          <CodeBlock
            code={
              "squares = []\nfor n in range(1, 6):\n    squares.append(n * n)\nprint(squares)"
            }
            label={"Построим квадраты чисел"}
            language="python"
            fileName="squares.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[1, 4, 9, 16, 25]"}
          />
          <Typography.Text>
            Тот же смысл можно выразить <strong>списковым включением</strong> —
            записью правила построения списка:
          </Typography.Text>
          <CodeBlock
            code={"squares = [n * n for n in range(1, 6)]\nprint(squares)"}
            label={
              "Тот же смысл можно выразить списковым включением — записью правила построения списка"
            }
            language="python"
            fileName="squares.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[1, 4, 9, 16, 25]"}
          />
          <Typography.Text>
            Читай по смыслу: «для каждого <Notation>{"n"}</Notation> из
            диапазона взять <Notation>{"n * n"}</Notation>». Хотя выражение
            результата стоит слева, значение <Notation>{"n"}</Notation>{" "}
            появляется из части <Notation>{"for"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.loopToComp}
            caption={
              <>
                Части цикла и включения одного цвета делают одно и то же: что
                положить в список, откуда брать значения и какие из них
                оставить. Меняется только порядок записи.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Фильтр и условное выражение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"if"}</Notation> после источника отбирает элементы, а
              условное выражение перед <Notation>{"for"}</Notation> выбирает
              значение.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "even_squares = [n * n for n in range(1, 8) if n % 2 == 0]\nprint(even_squares)"
            }
            label={
              "if после источника отбирает элементы, а условное выражение перед for выбирает значение"
            }
            language="python"
            fileName="even_squares.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[4, 16, 36]"}
          />
          <Typography.Text>
            <Notation>{"if"}</Notation> после источника — фильтр: неподходящий
            элемент вовсе не попадает в результат. Условное выражение перед{" "}
            <Notation>{"for"}</Notation> решает другую задачу:
          </Typography.Text>
          <CodeBlock
            code={
              'a = [-3, 0, 5]\nlabels = ["plus" if x > 0 else "other" for x in a]\nprint(labels)'
            }
            label={"Условное выражение перед for решает другую задачу"}
            language="python"
            fileName="labels.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"['other', 'other', 'plus']"}
          />
          <Typography.Text>
            Здесь результат имеет столько же элементов, сколько исходный список.
            Меняется выбираемое значение, а не число элементов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Несколько for",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Несколько <Notation>{"for"}</Notation> во включении идут в том же
              порядке, что вложенные циклы.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "pairs = [(x, y) for x in range(2) for y in range(3)]\nprint(pairs)"
            }
            label={
              "Несколько for во включении идут в том же порядке, что вложенные циклы"
            }
            language="python"
            fileName="pairs.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]"}
          />
          <Typography.Text>
            Части <Notation>{"for"}</Notation> идут в том же порядке, что
            обычные вложенные циклы. Внешний — по <Notation>{"x"}</Notation>,
            внутренний — по <Notation>{"y"}</Notation>. Не используй чрезмерно
            длинные включения: если пояснение становится труднее исходного
            цикла, лучше оставить цикл.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.loopGrid2_3_x_y}
            caption={
              <>
                Та же таблица очерёдности, что для вложенных циклов в уроке о{" "}
                <Notation>{"for"}</Notation>: внешний <Notation>{"x"}</Notation>{" "}
                выбирает строку, внутренний <Notation>{"y"}</Notation> проходит
                её целиком.
              </>
            }
          />
          <Typography.Text>
            Независимые строки таблицы теперь можно создавать так:
          </Typography.Text>
          <CodeBlock
            code={
              "table = [[0] * 3 for _ in range(2)]\ntable[0][0] = 9\nprint(table)"
            }
            label={"Независимые строки таблицы теперь можно создавать так"}
            language="python"
            fileName="table.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[[9, 0, 0], [0, 0, 0]]"}
          />
          <Typography.Text>
            Каждое повторение вычисляет <Notation>{"[0] * 3"}</Notation> заново,
            поэтому строки не связаны — в отличие от{" "}
            <Notation>{"[[0] * 3] * 2"}</Notation> из урока о списках. Имя{" "}
            <Notation>{"_"}</Notation> — обычная переменная, которой по
            соглашению обозначают ненужное значение.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "sum, min, max, all, any",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Бывают включения для множеств и словарей, а частые циклы заменяют
              готовые функции.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'unique_lengths = {len(word) for word in ["кот", "дом", "окно"]}\nsquares_by_number = {n: n * n for n in range(4)}\nprint(unique_lengths)\nprint(squares_by_number)'
            }
            label={
              "Бывают включения для множеств и словарей, а частые циклы заменяют готовые функции"
            }
            language="python"
            fileName="unique_lengths.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"{3, 4}\n{0: 0, 1: 1, 2: 4, 3: 9}"}
          />
          <Typography.Text>
            Фигурные скобки с одним выражением дают множество, с парой{" "}
            <Notation>{"ключ: значение"}</Notation> — словарь.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"sum(a)"}</Notation> складывает элементы,{" "}
            <Notation>{"min(a)"}</Notation> и <Notation>{"max(a)"}</Notation>{" "}
            находят крайние значения. <Notation>{"sum([])"}</Notation> равно 0,
            но <Notation>{"min([])"}</Notation> и{" "}
            <Notation>{"max([])"}</Notation> без значения по умолчанию вызывают
            ошибку: у пустого набора нет минимума или максимума.
          </Typography.Text>
          <CodeBlock
            code={"print(sum([]))\nprint(min([]))"}
            label={"Программа на Python"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"0"}
            error={"ValueError: min() iterable argument is empty"}
          />
          <Typography.Text>
            <Notation>{"all(...)"}</Notation> проверяет, что все элементы
            истинны, <Notation>{"any(...)"}</Notation> — что истинен хотя бы
            один. Они останавливаются, когда ответ уже известен. Для пустого
            источника <Notation>{"all"}</Notation> возвращает{" "}
            <Notation>{"True"}</Notation>, а <Notation>{"any"}</Notation> —{" "}
            <Notation>{"False"}</Notation>: нет ни одного нарушения первого
            требования и ни одного подтверждения второго.
          </Typography.Text>
          <CodeBlock
            code={
              "numbers = [2, 4, 8]\nprint(all([x % 2 == 0 for x in numbers]))\nprint(any([x < 0 for x in numbers]))"
            }
            label={"Программа на Python"}
            language="python"
            fileName="numbers.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"True\nFalse"}
          />
          <Typography.Text>
            Позднее уберём создание промежуточного списка с помощью
            генераторного выражения. На этом этапе явный список помогает увидеть
            логические значения, которые получает функция:{" "}
            <Notation>{"[True, True, True]"}</Notation> и{" "}
            <Notation>{"[False, False, False]"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Числа из строки",
      explanation: (
        <>
          <Typography.Text>
            <strong>Числа из строки собирает одно включение.</strong>{" "}
            Преобразуем строку <Notation>{'"10 -2 7"'}</Notation> в список целых
            одной понятной записью:
          </Typography.Text>
          <CodeBlock
            code={
              'line = "10 -2 7"\nnumbers = [int(part) for part in line.split()]\nprint(numbers)\nprint(sum(numbers), min(numbers), max(numbers))'
            }
            label={
              'Преобразуем строку "10 -2 7" в список целых одной понятной записью'
            }
            language="python"
            fileName="line.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"[10, -2, 7]\n15 -2 10"}
          />
          <Typography.Text>
            В этой строке нет новой магии: <Notation>{"split"}</Notation>{" "}
            создаёт части, цикл перебирает их, <Notation>{"int"}</Notation>{" "}
            преобразует каждую, включение собирает список.
          </Typography.Text>
          <Typography.Text>
            Сквозная задача курса — сумма и наибольшее из 5, −2, 10, 7 — теперь
            записывается одной строкой:{" "}
            <Notation>{"print(sum(numbers), max(numbers))"}</Notation> для{" "}
            <Notation>{"numbers = [5, -2, 10, 7]"}</Notation> выводит{" "}
            <Notation>{"20 10"}</Notation>. Внутри <Notation>{"sum"}</Notation>{" "}
            и <Notation>{"max"}</Notation> — тот же накопитель и тот же поиск
            лучшего, что мы писали руками в уроках о{" "}
            <Notation>{"while"}</Notation> и списках.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Модуль целиком",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Модуль целиком: пять видов данных и одна запись для их построения.
            </strong>{" "}
            Строки и коллекции различаются тем, что они хранят и что с ними
            можно делать, а включение строит любую из изменяемых коллекций одной
            записью:
          </Typography.Text>
          <LessonTable
            label={"Тип, Что хранит, Изменяется, Доступ, Построение включением"}
            columns={[
              { label: "Тип" },
              { label: "Что хранит" },
              { label: "Изменяется" },
              { label: "Доступ" },
              { label: "Построение включением" },
            ]}
            rows={[
              [
                <>
                  <Notation>{"str"}</Notation>
                </>,
                "Символы по порядку",
                "Нет",
                "По индексу и срезу",
                "—",
              ],
              [
                <>
                  <Notation>{"list"}</Notation>
                </>,
                "Значения по порядку, с повторами",
                "Да",
                "По индексу и срезу",
                <>
                  <Notation>{"[x * x for x in a]"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"tuple"}</Notation>
                </>,
                "Короткую запись",
                "Нет",
                "По индексу, распаковкой",
                "—",
              ],
              [
                <>
                  <Notation>{"dict"}</Notation>
                </>,
                "Пары «ключ — значение»",
                "Да",
                "По ключу",
                <>
                  <Notation>{"{x: x * x for x in a}"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"set"}</Notation>
                </>,
                "Различные значения",
                "Да",
                <>
                  Только проверкой <Notation>{"in"}</Notation>
                </>,
                <>
                  <Notation>{"{x % 10 for x in a}"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            Все пять — перебираемые объекты: по каждому ходит{" "}
            <Notation>{"for"}</Notation>, к каждому применимы{" "}
            <Notation>{"len"}</Notation>, <Notation>{"in"}</Notation>,{" "}
            <Notation>{"sum"}</Notation>, <Notation>{"min"}</Notation>,{" "}
            <Notation>{"max"}</Notation>. Выбор между ними — по нужным
            действиям, как в уроке о множествах.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что даст{" "}
            <Notation>{'[w[0] for w in "кот дом сад".split()]'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>['к', 'д', 'с'].</Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что даст{" "}
            <Notation>{'["+" if x > 0 else "-" for x in [3, -1, 0]]'}</Notation>
            ?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>['+', '-', '-'].</Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Сколько элементов в{" "}
            <Notation>
              {"[(a, b) for a in range(3) for b in range(a)]"}
            </Notation>
            ? Выпиши их.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>3: (1, 0), (2, 0), (2, 1).</Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Чему равны <Notation>{"sum([])"}</Notation>,{" "}
            <Notation>{"all([])"}</Notation> и <Notation>{"any([])"}</Notation>?
            Что сделает <Notation>{"max([])"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            0, True и False; <Notation>{"max([])"}</Notation> —{" "}
            <Notation>{"ValueError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Что дадут <Notation>{"{n % 4 for n in range(10)}"}</Notation> и{" "}
            <Notation>{'{c: "abca".count(c) for c in "abca"}'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}0, 1, 2, 3{"}"} и {"{"}'a': 2, 'b': 1, 'c': 1{"}"}.
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
                <Notation>{"[выражение for x in источник]"}</Notation> — тот же
                цикл с <Notation>{"append"}</Notation>, записанный правилом.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"if"}</Notation> в конце отбирает элементы;{" "}
                <Notation>{"a if c else b"}</Notation> в начале выбирает
                значение.
              </>
            ),
          },
          {
            note: (
              <>
                Несколько <Notation>{"for"}</Notation> — вложенные циклы в том
                же порядке.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"{x for …}"}</Notation> — множество,{" "}
                <Notation>{"{k: v for …}"}</Notation> — словарь.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"sum"}</Notation> пустого — 0,{" "}
                <Notation>{"min"}</Notation>/<Notation>{"max"}</Notation>{" "}
                пустого — ошибка; <Notation>{"all"}</Notation> пустого —{" "}
                <Notation>{"True"}</Notation>, <Notation>{"any"}</Notation>{" "}
                пустого — <Notation>{"False"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
