import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonStandardLibraryLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-standard-library.media";

export const pythonStandardLibraryLesson = defineCourseLesson({
  ...pythonStandardLibraryLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Counter", "Deque", "Точные числа", "Itertools"],
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
              Стандартная библиотека даёт готовые инструменты для частых задач —
              подсчёта, очереди, точных дробей и перебора комбинаций;
              пользоваться ими можно, когда понятно, что они делают внутри
            </strong>
            . Опора — модули и словари: каждое средство урока делает то, что ты
            уже умеешь писать сам, только короче и надёжнее.
          </Typography.Text>
          <Typography.Text>
            Инструменты покажем на слове <Notation>{'"BANANA"'}</Notation> для{" "}
            <Notation>{"Counter"}</Notation> и буквах{" "}
            <Notation>{'"ABC"'}</Notation> для перебора слов.
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
              Каждый инструмент библиотеки опирается на уже знакомую идею.
            </strong>{" "}
            Для подсчёта и хранения есть <Notation>{"collections"}</Notation>:{" "}
            <Notation>{"Counter"}</Notation> — словарь частот,{" "}
            <Notation>{"defaultdict"}</Notation> — словарь, который сам создаёт
            значение для нового ключа, <Notation>{"deque"}</Notation> — очередь
            с быстрыми концами. Куча <Notation>{"heapq"}</Notation> даёт быстрый
            доступ к наименьшему элементу; её разбирает тема ЕГЭ, где она нужна.
            Для перебора — <Notation>{"itertools"}</Notation>, для запоминания
            результатов — <Notation>{"functools.cache"}</Notation>. Точные
            вычисления дают <Notation>{"math"}</Notation>,{" "}
            <Notation>{"decimal"}</Notation> и{" "}
            <Notation>{"fractions"}</Notation>, работу с файлами и текстом —{" "}
            <Notation>{"pathlib"}</Notation>, <Notation>{"csv"}</Notation>,{" "}
            <Notation>{"json"}</Notation>, <Notation>{"re"}</Notation> и{" "}
            <Notation>{"fnmatch"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Перед каждым средством стоит один вопрос: что оно делает внутри и
            какие условия нужны, чтобы ответ был верным.{" "}
            <Notation>{"cache"}</Notation> требует, чтобы аргументы полностью
            определяли результат, а <Notation>{"itertools"}</Notation> —
            понимания, сколько вариантов получится.
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
            label={
              "Counter — готовый словарь частот, defaultdict сам создаёт значение для нового ключа"
            }
            language="python"
            fileName="counts.py"
            output={"3\n0\n[('A', 3), ('N', 2)]\n['Анна']"}
          />
          <Typography.Text>
            <Notation>{"Counter"}</Notation> делает то же, что цикл{" "}
            <Notation>{"counts[x] = counts.get(x, 0) + 1"}</Notation> из урока о
            словарях, и для отсутствующего ключа возвращает 0 без ошибки.{" "}
            <Notation>{"most_common(k)"}</Notation> даёт{" "}
            <Notation>{"k"}</Notation> самых частых пар.{" "}
            <Notation>{"defaultdict(list)"}</Notation> получает функцию{" "}
            <Notation>{"list"}</Notation> без вызова: при новом ключе она
            создаёт новый список.
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
              забирают из начала быстро.
            </strong>{" "}
            У списка <Notation>{"pop(0)"}</Notation> сдвигает все остальные
            элементы, а <Notation>{"deque"}</Notation> забирает первый элемент
            сразу:
          </Typography.Text>
          <CodeBlock
            code={
              "from collections import deque\n\nqueue = deque([1, 2, 3])\nqueue.append(4)\nfirst = queue.popleft()\nprint(first, list(queue))"
            }
            label={
              "У списка pop(0) сдвигает все остальные элементы, а deque забирает первый элемент сразу"
            }
            language="python"
            fileName="queue.py"
            output={"1 [2, 3, 4]"}
          />
          <Typography.Text>
            <Notation>{"append"}</Notation> добавляет справа,{" "}
            <Notation>{"popleft"}</Notation> удаляет и возвращает элемент слева.{" "}
            <strong>Очередь</strong> работает по правилу «первым пришёл, первым
            вышел» — так обслуживают заявки по порядку поступления.
          </Typography.Text>
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
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'from fractions import Fraction\nfrom decimal import Decimal\nfrom math import isclose\n\nprint(Fraction(1, 3) + Fraction(1, 6))\nprint(Decimal("0.1") + Decimal("0.2"))\nprint(isclose(0.1 + 0.2, 0.3))'
            }
            label={"Fraction и Decimal считают точно там, где float ошибается"}
            language="python"
            fileName="main.py"
            output={"1/2\n0.3\nTrue"}
          />
          <Typography.Text>
            <Notation>{"Fraction"}</Notation> хранит числитель и знаменатель,
            поэтому 1/3 + 1/6 даёт ровно 1/2. Для Decimal использованы строки:{" "}
            <Notation>{"Decimal(0.1)"}</Notation> перенёс бы уже имеющееся
            двоичное приближение. Decimal тоже имеет настраиваемую точность
            вычислений; деление 1 на 3 не превращается в конечную точную
            десятичную дробь.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"isclose(a, b)"}</Notation> сравнивает разность с
            допусками. Около нуля часто нужен явно выбранный{" "}
            <Notation>{"abs_tol"}</Notation>: например,{" "}
            <Notation>{"isclose(value, 0.0, abs_tol=1e-9)"}</Notation>, если
            именно такая абсолютная погрешность допустима по смыслу измерений.
            Запись <Notation>{"1e-9"}</Notation> означает 10 в степени −9.
          </Typography.Text>
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
            варианты и проверяет нужное свойство. Он надёжен, если набор
            действительно полный, проверка верна и число вариантов посильно.
            Перед кодом ответь: из чего состоит один вариант, как его породить
            без пропусков и сколько вариантов получится.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"itertools.product"}</Notation> создаёт все комбинации
            выбора по позициям, разрешая повторения:
          </Typography.Text>
          <CodeBlock
            code={
              'from itertools import product\n\ncount = 0\nfor letters in product("ABC", repeat=3):\n    word = "".join(letters)\n    if word.count("A") == 1:\n        count += 1\nprint(count)'
            }
            label={
              "itertools.product создаёт все комбинации выбора по позициям, разрешая повторения"
            }
            language="python"
            fileName="count.py"
            output={"12"}
          />
          <Typography.Text>
            <Notation>{"product"}</Notation> выдаёт кортежи букв, например{" "}
            <Notation>{"('A', 'B', 'C')"}</Notation>;{" "}
            <Notation>{'"".join'}</Notation> склеивает их в слово. На каждой
            позиции три выбора, всего <Notation>{"3 ** 3 = 27"}</Notation> слов.
            Подходящих 12: выбрать одну из трёх позиций A, затем по два варианта
            для двух оставшихся. Это независимая ручная проверка программы.
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
            label={"Разницу видно на парах из букв A, B, C"}
            language="python"
            fileName="items.py"
            output={"9\n6\n3\n['AB', 'AC', 'BC']"}
          />
          <Typography.Text>
            Числа получаются выбором по позициям: 3 · 3 = 9; 3 · 2 = 6 — вторая
            буква не может повторить первую; 6 / 2 = 3 — пары AB и BA становятся
            одной группой.
          </Typography.Text>
          <Typography.Text>
            Функции считают различными позиции исходного источника. Если в нём
            одинаковые символы, текстовые результаты перестановок могут
            повторяться. <Notation>{"set(permutations(...))"}</Notation>{" "}
            устраняет дубликаты, но сначала может потребовать огромного перебора
            и памяти.
          </Typography.Text>
          <Typography.Text>
            Если данные образуют запись числа, первый разряд обычно не ноль.
            Ограничение на первую цифру нужно добавить отдельно. Не сохраняй все
            варианты в <Notation>{"list"}</Notation>, если достаточно
            обрабатывать их по одному.
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
            Что вернёт{" "}
            <Notation>{'Counter("MISSISSIPPI").most_common(2)'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>[('I', 4), ('S', 4)].</Typography.Text>
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
            {"{"}'к': ['кот', 'кит'], 'д': ['дом']{"}"}.
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
          <Typography.Text>[7].</Typography.Text>
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
                <Notation>{"Counter"}</Notation> считает частоты,{" "}
                <Notation>{"most_common"}</Notation> даёт самые частые;{" "}
                <Notation>{"defaultdict"}</Notation> создаёт значение для нового
                ключа.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"deque"}</Notation>: <Notation>{"append"}</Notation>{" "}
                в конец, <Notation>{"popleft"}</Notation> из начала — очередь.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"Fraction"}</Notation> точна для дробей,{" "}
                <Notation>{"Decimal"}</Notation> создают из строк,{" "}
                <Notation>{"isclose"}</Notation> сравнивает приближённые числа.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"product"}</Notation> — слова с повторами,{" "}
                <Notation>{"permutations"}</Notation> — порядок без повторов,{" "}
                <Notation>{"combinations"}</Notation> — группы.
              </>
            ),
          },
          {
            note: (
              <>
                Перед перебором считают число вариантов и проверяют полноту
                набора.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
