import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonStandardLibraryLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-standard-library.media";

export const pythonStandardLibraryLesson = defineCourseLesson({
  ...pythonStandardLibraryLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Counter", "deque", "Точные числа", "itertools"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Сосчитать буквы слова <Notation>{'"BANANA"'}</Notation>, обслужить
            заявки по очереди, сложить 1/3 и 1/6 без погрешности, перебрать все
            слова из букв A, B, C — всё это можно написать циклами и словарями.
            Но такие задачи встречаются так часто, что для них есть готовые
            средства.{" "}
            <strong>
              Стандартная библиотека Python — набор модулей, которые есть в
              любой установке; ими пользуются, когда понятно, что они делают
              внутри
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём подсчёт, очередь, точные дроби и перебор комбинаций — на
            тех же примерах.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Обзор библиотеки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждое средство библиотеки делает то, что ты уже умеешь писать
              сам.
            </strong>{" "}
            Модуль подключают через <Notation>{"import"}</Notation>, как{" "}
            <Notation>{"math"}</Notation> в уроке о модулях. Средства этого и
            прошлых уроков:
          </Typography.Text>
          <LessonTable
            label={"Задачи и средства стандартной библиотеки"}
            columns={[
              { label: "Задача" },
              { label: "Средство" },
              { label: "Где" },
            ]}
            rows={[
              [
                "Частоты значений",
                <>
                  <Notation>{"collections.Counter"}</Notation>
                </>,
                "этот урок",
              ],
              [
                "Словарь со значением по умолчанию",
                <>
                  <Notation>{"collections.defaultdict"}</Notation>
                </>,
                "этот урок",
              ],
              [
                "Очередь",
                <>
                  <Notation>{"collections.deque"}</Notation>
                </>,
                "этот урок",
              ],
              [
                "Точные дроби",
                <>
                  <Notation>{"fractions"}</Notation>,{" "}
                  <Notation>{"decimal"}</Notation>
                </>,
                "этот урок",
              ],
              [
                "Перебор слов и комбинаций",
                <>
                  <Notation>{"itertools"}</Notation>
                </>,
                "этот урок",
              ],
              [
                "Запомнить результаты функции",
                <>
                  <Notation>{"functools.cache"}</Notation>
                </>,
                "урок о рекурсии",
              ],
              [
                "Пути, CSV, JSON",
                <>
                  <Notation>{"pathlib"}</Notation>, <Notation>{"csv"}</Notation>
                  , <Notation>{"json"}</Notation>
                </>,
                "урок о файлах",
              ],
            ]}
          />
          <Typography.Text>
            Перед каждым средством стоит один вопрос: что оно делает внутри и
            при каких условиях ответ верен. <Notation>{"cache"}</Notation>{" "}
            требует, чтобы аргументы полностью определяли результат, а для{" "}
            <Notation>{"itertools"}</Notation> надо заранее понимать, сколько
            вариантов получится.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Counter и defaultdict",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"Counter"}</Notation> — готовый словарь частот,{" "}
              <Notation>{"defaultdict"}</Notation> сам создаёт значение для
              нового ключа.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'from collections import Counter, defaultdict\n\ncounts = Counter("BANANA")\nprint(counts["A"])\nprint(counts["Z"])\nprint(counts.most_common(2))\n\ngroups = defaultdict(list)\ngroups["python"].append("Анна")\nprint(groups["python"])'
            }
            label={"Counter для BANANA и defaultdict(list)"}
            language="python"
            fileName="main.py"
            output={"3\n0\n[('A', 3), ('N', 2)]\n['Анна']"}
          />
          <Typography.Text>
            <Notation>{"Counter"}</Notation> делает то же, что цикл{" "}
            <Notation>{"counts[x] = counts.get(x, 0) + 1"}</Notation> из урока о
            словарях, а для отсутствующего ключа возвращает 0 без ошибки.{" "}
            <Notation>{"most_common(k)"}</Notation> даёт{" "}
            <Notation>{"k"}</Notation> самых частых пар «значение — частота».{" "}
            <Notation>{"defaultdict(list)"}</Notation> получает функцию{" "}
            <Notation>{"list"}</Notation> без скобок и вызывает её для каждого
            нового ключа — так у ключа сразу появляется пустой список.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "deque",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"deque"}</Notation> — очередь: добавляют в конец,
              быстро забирают из начала.
            </strong>{" "}
            <strong>Очередь</strong> работает по правилу «первым пришёл — первым
            вышел», так обслуживают заявки по порядку поступления.
          </Typography.Text>
          <CodeBlock
            code={
              "from collections import deque\n\nqueue = deque([1, 2, 3])\nqueue.append(4)\nfirst = queue.popleft()\nprint(first, list(queue))"
            }
            label={"Очередь deque: append и popleft"}
            language="python"
            fileName="main.py"
            output={"1 [2, 3, 4]"}
          />
          <Typography.Text>
            <Notation>{"append"}</Notation> добавляет справа,{" "}
            <Notation>{"popleft"}</Notation> удаляет и возвращает элемент слева.
            У списка то же делает <Notation>{"pop(0)"}</Notation>, но медленно:
            элементы списка стоят по номерам, и после удаления первого все
            остальные сдвигаются на место левее.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.popleftShift}
            caption={
              <>
                Для очереди из миллиона заявок <Notation>{"pop(0)"}</Notation>{" "}
                сдвигает почти миллион элементов на каждой заявке,{" "}
                <Notation>{"popleft"}</Notation> — ни одного.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Fraction и Decimal",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"Fraction"}</Notation> и{" "}
              <Notation>{"Decimal"}</Notation> считают точно там, где{" "}
              <Notation>{"float"}</Notation> ошибается.
            </strong>{" "}
            В уроке о числах <Notation>{"0.1 + 0.2"}</Notation> дало не ровно
            0.3. Точные числа решают это:
          </Typography.Text>
          <CodeBlock
            code={
              'from fractions import Fraction\nfrom decimal import Decimal\nfrom math import isclose\n\nprint(Fraction(1, 3) + Fraction(1, 6))\nprint(Decimal("0.1") + Decimal("0.2"))\nprint(isclose(0.1 + 0.2, 0.3))'
            }
            label={"Fraction, Decimal и isclose"}
            language="python"
            fileName="main.py"
            output={"1/2\n0.3\nTrue"}
          />
          <Typography.Text>
            <Notation>{"Fraction"}</Notation> хранит числитель и знаменатель,
            поэтому 1/3 + 1/6 даёт ровно 1/2. <Notation>{"Decimal"}</Notation>{" "}
            создают из строки: <Notation>{"Decimal(0.1)"}</Notation> перенёс бы
            уже неточное <Notation>{"float"}</Notation>. Если точность не нужна,
            а нужно сравнить два <Notation>{"float"}</Notation>,{" "}
            <Notation>{"isclose(a, b)"}</Notation> проверяет, что они почти
            равны.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: точность Decimal и сравнение с нулём"
            kind="nuance"
          >
            <Typography.Text>
              У <Notation>{"Decimal"}</Notation> настраиваемая точность: деление
              1 на 3 не станет конечной десятичной дробью. У{" "}
              <Notation>{"isclose"}</Notation> допуск по умолчанию
              относительный, и около нуля он не срабатывает — нужен явный{" "}
              <Notation>{"abs_tol"}</Notation>:{" "}
              <Notation>{"isclose(value, 0.0, abs_tol=1e-9)"}</Notation>. Запись{" "}
              <Notation>{"1e-9"}</Notation> — это 10 в степени −9.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "product и перебор",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"product"}</Notation> перебирает все слова заданной
              длины, и перебор надёжен, только если набор полный.
            </strong>{" "}
            <strong>Полный перебор</strong> рассматривает все допустимые
            варианты и проверяет нужное свойство. Перед кодом ответь: из чего
            состоит один вариант, как получить все без пропусков и сколько их
            будет.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"itertools.product"}</Notation> выдаёт слова по порядку,
            как счётчик пробега: правая позиция перебирает все буквы, затем
            левая сдвигается на следующую, а правая начинает сначала. Пройди по
            шагам слова длины 2 из букв A, B, C:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.productABC}
            label={'product("ABC", repeat=2) по шагам'}
          />
          <Typography.Text>
            Посчитаем слова длины 3 из букв A, B, C, в которых ровно одна A:
          </Typography.Text>
          <CodeBlock
            code={
              'from itertools import product\n\ncount = 0\nfor letters in product("ABC", repeat=3):\n    word = "".join(letters)\n    if word.count("A") == 1:\n        count += 1\nprint(count)'
            }
            label={"Слова длины 3 с одной буквой A"}
            language="python"
            fileName="main.py"
            output={"12"}
          />
          <Typography.Text>
            <Notation>{"product"}</Notation> выдаёт кортежи букв, например{" "}
            <Notation>{"('A', 'B', 'C')"}</Notation>;{" "}
            <Notation>{'"".join'}</Notation> склеивает их в слово. Всего слов{" "}
            <Notation>{"3 ** 3 = 27"}</Notation>. Подходящих 12: одна из трёх
            позиций под A, на двух других — по два варианта, 3 · 2 · 2 = 12.
            Такой ручной подсчёт — независимая проверка программы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Перестановки и сочетания",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перестановки, сочетания и слова различаются тем, важен ли порядок
              и можно ли повторять.
            </strong>{" "}
            <Notation>{"product"}</Notation> строит слова,{" "}
            <Notation>{"permutations"}</Notation> — расстановки разных
            предметов, <Notation>{"combinations"}</Notation> — выбор группы,{" "}
            <Notation>{"combinations_with_replacement"}</Notation> — выбор с
            повторениями без порядка. Разницу видно на парах из букв A, B, C:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.comboGridsABC}
            caption={
              <>
                <Notation>{"product"}</Notation> берёт все 9 клеток.{" "}
                <Notation>{"permutations"}</Notation> убирает диагональ — повтор
                буквы. <Notation>{"combinations"}</Notation> оставляет одну пару
                из AB и BA — порядок не важен. С{" "}
                <Notation>{"_with_replacement"}</Notation> диагональ
                возвращается.
              </>
            }
          />
          <CodeBlock
            code={
              'from itertools import combinations, permutations, product\n\nitems = "ABC"\nprint(len(list(product(items, repeat=2))))\nprint(len(list(permutations(items, 2))))\nprint(len(list(combinations(items, 2))))\nprint(["".join(p) for p in combinations(items, 2)])'
            }
            label={"Число пар у product, permutations и combinations"}
            language="python"
            fileName="main.py"
            output={"9\n6\n3\n['AB', 'AC', 'BC']"}
          />
          <Typography.Text>
            Числа получаются выбором по позициям: 3 · 3 = 9; 3 · 2 = 6 — вторая
            буква не может повторить первую; 6 / 2 = 3 — пары AB и BA становятся
            одной группой.
          </Typography.Text>
          <Typography.Text>
            Функции различают элементы по позиции в источнике. Если в слове есть
            одинаковые буквы, перестановки дадут одинаковые слова, и их убирают
            через <Notation>{"set(...)"}</Notation>. Если вариант — запись
            числа, первая цифра обычно не может быть нулём: это условие
            добавляют отдельно. И не собирай все варианты в список, если их
            можно проверять по одному.
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
            Сколько слов выдаст <Notation>{'product("AB", repeat=4)'}</Notation>{" "}
            и какое из них будет третьим?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2 · 2 · 2 · 2 = 16; по порядку счётчика — AAAA, AAAB, AABA, значит
            третье — AABA.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт{" "}
            <Notation>{'Counter("MISSISSIPPI").most_common(2)'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"[('I', 4), ('S', 4)]"}</Notation>: при равных частотах
            порядок — как буквы впервые встретились в слове.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Сгруппируй слова <Notation>{'["кот", "дом", "кит"]'}</Notation> по
            первой букве через <Notation>{"defaultdict(list)"}</Notation>. Что
            получится?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"{'к': ['кот', 'кит'], 'д': ['дом']}"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Начни с <Notation>{"q = deque([5, 6])"}</Notation>, выполни{" "}
            <Notation>{"q.append(7)"}</Notation>,{" "}
            <Notation>{"q.popleft()"}</Notation>,{" "}
            <Notation>{"q.popleft()"}</Notation>. Что осталось в очереди?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Одно число 7: <Notation>{"popleft"}</Notation> забрал 5 и 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает{" "}
            <Notation>{"print(Fraction(1, 2) + Fraction(1, 3))"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"5/6"}</Notation>: 3/6 + 2/6.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Готовое средство заменяет цикл, который ты умеешь писать сам, — если
        понятно, что оно делает и сколько работы выполнит. Вот что понадобится
        дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"Counter"}</Notation>,
            note: (
              <>
                Словарь частот; <Notation>{"most_common(k)"}</Notation> — самые
                частые; <Notation>{"defaultdict"}</Notation> создаёт значение
                нового ключа.
              </>
            ),
          },
          {
            key: <Notation>{"deque"}</Notation>,
            note: (
              <>
                <Notation>{"append"}</Notation> в конец,{" "}
                <Notation>{"popleft"}</Notation> из начала без сдвига остальных.
              </>
            ),
          },
          {
            key: "Точные числа",
            note: (
              <>
                <Notation>{"Fraction"}</Notation> — дроби,{" "}
                <Notation>{"Decimal"}</Notation> — из строки;{" "}
                <Notation>{"isclose"}</Notation> сравнивает{" "}
                <Notation>{"float"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"itertools"}</Notation>,
            note: (
              <>
                <Notation>{"product"}</Notation> — слова с повторами,{" "}
                <Notation>{"permutations"}</Notation> — порядок без повторов,{" "}
                <Notation>{"combinations"}</Notation> — группы.
              </>
            ),
          },
          {
            key: "Перебор",
            note: (
              <>
                Сначала считают число вариантов и проверяют, что набор полный.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
