import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonRecursionLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-recursion.media";

export const pythonRecursionLesson = defineCourseLesson({
  ...pythonRecursionLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Базовый случай", "Стек вызовов", "@cache"],
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
              Рекурсивная функция сводит задачу к меньшему случаю той же задачи;
              незавершённые вызовы ждут в стеке, а{" "}
              <Notation>{"@cache"}</Notation> запоминает уже найденные ответы
            </strong>
            . Опора — рамка вызова из урока о функциях: каждый незавершённый
            вызов хранит свои переменные в своей рамке, и рекурсия просто
            складывает такие рамки стопкой. Алгоритмы на рекурсии разобраны в
            темах экзамена; здесь — механизм языка.
          </Typography.Text>
          <Typography.Text>
            Проследим, как рекурсия считает факториал 4! = 1 · 2 · 3 · 4 = 24.
            Потом на числах Фибоначчи увидим цену повторных вычислений.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Рекурсия",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рекурсия решает задачу через меньший случай той же задачи.
            </strong>{" "}
            <strong>Рекурсия</strong> — вызов функции из самой себя, напрямую
            или через другие функции. Она удобна, когда решение естественно
            выражается через решение меньшего случая.
          </Typography.Text>
          <Typography.Text>
            Факториал неотрицательного целого <Notation>{"n"}</Notation> —
            произведение чисел от 1 до <Notation>{"n"}</Notation>, причём{" "}
            <Notation>{"0! = 1"}</Notation>. Отсюда{" "}
            <Notation>{"n! = n * (n - 1)!"}</Notation> при{" "}
            <Notation>{"n > 0"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'def factorial(n):\n    if n < 0:\n        raise ValueError(\n            "Факториал здесь определён для n >= 0"\n        )\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))'
            }
            label={"при n > 0"}
            language="python"
            fileName="factorial.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"24"}
          />
          <Typography.Text>
            Ветка <Notation>{"n == 0"}</Notation> —{" "}
            <strong>базовый случай</strong>, решаемый без дальнейшего обращения.
            Остальное — переход к меньшему случаю. Для корректности нужно
            убедиться, что переходы обязательно приводят к базе:{" "}
            <Notation>{"n"}</Notation> каждый раз уменьшается на 1 и от
            неотрицательного числа дойдёт до 0. Строка с{" "}
            <Notation>{"raise"}</Notation> останавливает программу с понятным
            сообщением, если договорённость нарушена; подробно{" "}
            <Notation>{"raise"}</Notation> разберём в уроке об исключениях.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Стек вызовов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждый незавершённый вызов ждёт результата следующего и хранится в
              стеке вызовов.
            </strong>{" "}
            Для <Notation>{"factorial(4)"}</Notation> вызов ждёт результата{" "}
            <Notation>{"factorial(3)"}</Notation>, тот —{" "}
            <Notation>{"factorial(2)"}</Notation>, затем{" "}
            <Notation>{"factorial(1)"}</Notation> и{" "}
            <Notation>{"factorial(0)"}</Notation>. После базы возвращения идут в
            обратном порядке: 1, 1, 2, 6, 24. Каждый вызов ждёт, пока ответит
            следующий: <Notation>{"factorial(4)"}</Notation> нужно 4 × результат
            для 3, <Notation>{"factorial(3)"}</Notation> — 3 × результат для 2,
            и так до <Notation>{"factorial(0)"}</Notation>, который сразу знает
            ответ 1. Пошагово это выглядит так:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.stackStepper4}
            label={
              "Каждый незавершённый вызов ждёт результата следующего и хранится в стеке вызовов. Для factorial(4) вызов ждёт результата factorial(3), тот — factorial(2), затем factorial(1) и factorial(0). После базы возвращения идут в обратном порядке: 1, 1, 2, 6, 24. Каждый вызов ждёт, пока ответит следующий: factorial(4) нужно 4 × результат для 3, factorial(3) — 3 × результат для 2, и так до factorial(0), который сразу знает ответ 1. Пошагово это выглядит так:"
            }
          />
          <Typography.Text>
            Каждый незавершённый вызов хранит собственные параметры и место
            продолжения. Эта последовательность хранится в{" "}
            <strong>стеке вызовов</strong>. Стек — структура «последним вошёл,
            первым вышел»: первым завершается самый глубокий вызов.
          </Typography.Text>
          <Typography.Text>
            У Python ограничена глубина рекурсивных вызовов. Если базовый случай
            недостижим, стек переполняется:
          </Typography.Text>
          <CodeBlock
            code={"def down(n):\n    return down(n - 1)\n\ndown(5)"}
            label={"Если базовый случай недостижим, стек переполняется"}
            language="python"
            fileName="down.py"
            showLineNumbers={false}
            outputLayout="lines"
            error={"RecursionError: maximum recursion depth exceeded"}
          />
          <Typography.Text>
            <Notation>{"RecursionError"}</Notation> означает, что вложенных
            вызовов стало больше допустимого. Узнать предел можно через
            стандартный модуль <Notation>{"sys"}</Notation> — набор средств для
            связи с интерпретатором. Он подключается так же, как{" "}
            <Notation>{"math"}</Notation> в уроке о модулях.
          </Typography.Text>
          <CodeBlock
            code={"import sys\n\nprint(sys.getrecursionlimit())"}
            label={"Он подключается так же, как math в уроке о модулях"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"1000"}
          />
          <Typography.Text>
            <Notation>{"sys.setrecursionlimit(5000)"}</Notation> поднимает
            предел. Без необходимости поднимать его до огромного числа нельзя
            считать исправлением алгоритма: стек и память конечны. Python не
            превращает рекурсию в цикл сам, поэтому для длинной цепочки вызовов
            обычно лучше написать цикл.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Мемоизация",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Прямая рекурсия может много раз вычислять одно и то же.
            </strong>{" "}
            Пусть последовательность задана как{" "}
            <Notation>{"F(0) = 0"}</Notation>, <Notation>{"F(1) = 1"}</Notation>
            , а далее <Notation>{"F(n) = F(n - 1) + F(n - 2)"}</Notation>.
            Прямой рекурсивный код многократно вычисляет одинаковые значения.
            Например, при вычислении F(5) значение F(3) понадобится и прямо, и
            внутри F(4). Посчитаем вызовы:
          </Typography.Text>
          <CodeBlock
            code={
              "calls = 0\n\ndef fibonacci_slow(n):\n    global calls\n    calls += 1\n    if n < 2:\n        return n\n    return fibonacci_slow(n - 1) + fibonacci_slow(n - 2)\n\nprint(fibonacci_slow(20), calls)"
            }
            label={"Посчитаем вызовы"}
            language="python"
            fileName="fibonacci_slow.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"6765 21891"}
          />
          <Typography.Text>
            <Notation>{"global calls"}</Notation> разрешает функции менять
            внешний счётчик. Для 21 различного значения F(0)…F(20) понадобилось
            почти 22 тысячи вызовов. Число вызовов растёт очень быстро: для n =
            10 их 177, для 20 — 21 891, для 25 — 242 785, а для 30 — уже 2 692
            537.
          </Typography.Text>
          <Typography.Text>
            <strong>Мемоизация</strong> — сохранение результата для уже
            рассмотренных аргументов. При следующем таком же запросе результат
            берётся из памяти. В Python есть <Notation>{"cache"}</Notation> в
            стандартном модуле <Notation>{"functools"}</Notation>;{" "}
            <Notation>{"from functools import cache"}</Notation> подключает это
            имя:
          </Typography.Text>
          <CodeBlock
            code={
              'from functools import cache\n\n@cache\ndef fibonacci(n):\n    if n < 0:\n        raise ValueError("Нужен неотрицательный индекс")\n    if n < 2:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10), fibonacci(90))'
            }
            label={"Программа на Python"}
            language="python"
            fileName="fibonacci.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"55 2880067194370816120"}
          />
          <Typography.Text>
            Запись <Notation>{"@cache"}</Notation> — применение{" "}
            <strong>декоратора</strong>, средства, которое получает функцию и
            возвращает обёрнутую версию с дополнительным поведением. Здесь
            дополнительное поведение — поиск результата в памяти и его
            сохранение. Смысл близок к{" "}
            <Notation>{"fibonacci = cache(fibonacci)"}</Notation> после
            определения. Механизм собственных декораторов рассмотрим в
            дополнительном уроке.
          </Typography.Text>
          <Typography.Text>
            Теперь каждое F(k) вычисляется один раз: для F(n) нужно всего n + 1
            разных вычислений. Поэтому F(90) считается мгновенно. Но глубина
            первого спуска остаётся линейной, а кэш хранит все результаты. Кэш
            не устраняет ограничения рекурсивной глубины.
          </Typography.Text>
          <Typography.Text>
            Аргументы кэшируемой функции должны быть хешируемыми. Результат
            должен определяться аргументами. Если функция зависит от
            изменяющейся глобальной переменной, файла или времени, кэш может
            возвращать устаревшие данные. Очистить его можно{" "}
            <Notation>{"fibonacci.cache_clear()"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Модель вызова",
      explanation: (
        <>
          <Typography.Text>
            <strong>Модуль «Функции» складывается в одну модель вызова.</strong>{" "}
            Вызов функции — это новая рамка со своими переменными (урок о
            функциях). В неё попадают аргументы — по позиции, по имени или
            значения по умолчанию, созданные один раз при{" "}
            <Notation>{"def"}</Notation> (урок о договорённости функции).
            Функции и имена можно брать из модулей (урок о модулях) и передавать
            другим функциям, как <Notation>{"key"}</Notation> сортировке (урок о
            сортировке). Незавершённые вызовы лежат стопкой — это и есть стек
            вызовов, а рекурсия лишь кладёт в стопку вызовы той же функции.
          </Typography.Text>
          <Typography.Text>
            В пошаговом запуске это видно так: вызов добавляет новую рамку, где
            параметры уже связаны с аргументами; присваивание внутри меняет
            только верхнюю рамку; <Notation>{"return"}</Notation> убирает её и
            отдаёт значение в строку вызова. При рекурсии рамок одной функции
            становится несколько, и у каждой своё <Notation>{"n"}</Notation>.
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
            Составь таблицу вызовов для <Notation>{"factorial(3)"}</Notation>:
            что ждёт каждый вызов и что возвращает.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            factorial(3) ждёт 3 × f(2), f(2) — 2 × f(1), f(1) — 1 × f(0), f(0)
            возвращает 1; ответы 1, 1, 2, 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Функция <Notation>{"s(n)"}</Notation> возвращает 0 при{" "}
            <Notation>{"n == 0"}</Notation> и{" "}
            <Notation>{"n + s(n - 1)"}</Notation> иначе. Чему равно{" "}
            <Notation>{"s(5)"}</Notation>? Что случится при{" "}
            <Notation>{"s(-1)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            15; при <Notation>{"s(-1)"}</Notation> база не достигается —{" "}
            <Notation>{"RecursionError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{"@cache"}</Notation> не поможет функции{" "}
            <Notation>{"down"}</Notation> из урока?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Каждый вызов получает новый аргумент, повторов нет, а база
            недостижима: бесконечный спуск остаётся.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Почему функцию <Notation>{"f(items)"}</Notation>, где{" "}
            <Notation>{"items"}</Notation> — список, нельзя декорировать{" "}
            <Notation>{"@cache"}</Notation> и вызывать со списком?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Список нехешируем, кэш не может сделать его ключом — будет{" "}
            <Notation>{"TypeError"}</Notation>.
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
                Рекурсивная функция: базовый случай без вызова и переход к
                меньшему случаю, который обязательно доходит до базы.
              </>
            ),
          },
          {
            note: (
              <>
                Незавершённые вызовы ждут в стеке; первым завершается самый
                глубокий.
              </>
            ),
          },
          {
            note: (
              <>
                Недостижимая база — <Notation>{"RecursionError"}</Notation>;
                предел — <Notation>{"sys.getrecursionlimit()"}</Notation>,
                поднимать его — не исправление алгоритма.
              </>
            ),
          },
          {
            note: (
              <>
                Повторные вычисления делают прямую рекурсию медленной;{" "}
                <Notation>{"@cache"}</Notation> вычисляет каждое значение один
                раз.
              </>
            ),
          },
          {
            note: (
              <>
                Кэш требует хешируемых аргументов и не убирает ограничение
                глубины.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
