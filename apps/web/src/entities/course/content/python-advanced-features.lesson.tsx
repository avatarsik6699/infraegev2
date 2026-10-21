import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonAdvancedFeaturesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-advanced-features.media";

export const pythonAdvancedFeaturesLesson = defineCourseLesson({
  ...pythonAdvancedFeaturesLessonPublication,
  masteryThreshold: 0.8,
  level: "advanced",
  learningOutcomes: [
    "Замыкания",
    "Декораторы",
    "with",
    "match",
    "Байты",
    "async",
  ],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет понимать устройство библиотек: в темах ЕГЭ из этих
            механизмов встречается только готовый декоратор{" "}
            <Notation>{"@cache"}</Notation>. Задачи основных уроков решаются без
            него.
          </Typography.Text>
          <Typography.Text>
            Декоратор <Notation>{"@cache"}</Notation> из урока о рекурсии
            запоминает ответы, хотя код функции ты не менял. А{" "}
            <Notation>{"with open(…)"}</Notation> закрывает файл сам, даже при
            ошибке. Как это устроено?{" "}
            <strong>
              Функция в Python — такое же значение, как число: её создают внутри
              другой функции, возвращают и оборачивают; на этом держатся
              замыкания, декораторы и контекстные менеджеры
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём эти три механизма, а в конце — ещё три полезные вещи:{" "}
            <Notation>{"match"}</Notation>, байты и асинхронное ожидание.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Замыкания",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Внутренняя функция помнит имена внешней — это замыкание.
            </strong>{" "}
            Функцию можно определить внутри другой функции, и она видит
            локальные имена внешней. Если внутренняя функция пережила вызов
            внешней и всё ещё пользуется её именами, это{" "}
            <strong>замыкание</strong>:
          </Typography.Text>
          <CodeBlock
            code={
              "def make_multiplier(factor):\n    def multiply(number):\n        return number * factor\n    return multiply\n\ntriple = make_multiplier(3)\ndouble = make_multiplier(2)\nprint(triple(7), double(7))"
            }
            label={"Функция, которая создаёт функции"}
            language="python"
            fileName="main.py"
            output={"21 14"}
          />
          <Typography.Text>
            Возвращается сама функция <Notation>{"multiply"}</Notation>, не её
            вызов. Она сохраняет доступ к <Notation>{"factor"}</Notation> этого
            конкретного вызова <Notation>{"make_multiplier"}</Notation>: у{" "}
            <Notation>{"triple"}</Notation> это 3, у{" "}
            <Notation>{"double"}</Notation> — 2.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.closureCells}
            caption={
              <>
                Два вызова <Notation>{"make_multiplier"}</Notation> — две
                функции, у каждой свой запомненный{" "}
                <Notation>{"factor"}</Notation>.
              </>
            }
          />
          <Typography.Text>
            Замыкание помнит саму переменную, а не её значение в момент
            создания. Поэтому функции, созданные в цикле, видят одну переменную
            цикла — и после цикла все получают её последнее значение:
          </Typography.Text>
          <CodeBlock
            code={
              "late = [lambda: i for i in range(3)]\nsnapshot = [lambda i=i: i for i in range(3)]\nprint([f() for f in late], [f() for f in snapshot])"
            }
            label={"Функции из цикла и переменная цикла"}
            language="python"
            fileName="main.py"
            output={"[2, 2, 2] [0, 1, 2]"}
          />
          <Typography.Text>
            Если нужен снимок, часто используют параметр по умолчанию, как во
            втором списке, или отдельный вызов создающей функции.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Декораторы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Декоратор получает функцию и возвращает обёртку с дополнительным
              поведением.
            </strong>{" "}
            Запись <Notation>{"@announce"}</Notation> над{" "}
            <Notation>{"def add"}</Notation> означает{" "}
            <Notation>{"add = announce(add)"}</Notation>: имя{" "}
            <Notation>{"add"}</Notation> теперь указывает на то, что вернул
            декоратор.
          </Typography.Text>
          <CodeBlock
            code={
              'from functools import wraps\n\ndef announce(function):\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        print("Вызов", function.__name__)\n        result = function(*args, **kwargs)\n        return result\n    return wrapper\n\n@announce\ndef add(a, b):\n    return a + b\n\nprint(add(2, 5))'
            }
            label={"Декоратор announce"}
            language="python"
            fileName="main.py"
            output={"Вызов add\n7"}
          />
          <Typography.Text>
            Сначала сообщение о вызове, затем 7.{" "}
            <Notation>{"wrapper"}</Notation> — замыкание: он помнит исходную{" "}
            <Notation>{"function"}</Notation>. <Notation>{"*args"}</Notation> и{" "}
            <Notation>{"**kwargs"}</Notation> из урока об аргументах принимают
            любые аргументы и передают их дальше без изменений:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.decoratorWrap}
            caption={
              <>
                После <Notation>{"@announce"}</Notation> вызов{" "}
                <Notation>{"add(2, 5)"}</Notation> попадает в обёртку, она
                печатает сообщение и вызывает исходную функцию.
              </>
            }
          />
          <ProofDisclosure summary="Тонкости: зачем wraps" kind="nuance">
            <Typography.Text>
              Без <Notation>{"@wraps(function)"}</Notation> у обёрнутой функции
              было бы имя <Notation>{"wrapper"}</Notation>: атрибут{" "}
              <Notation>{"__name__"}</Notation> и описание взялись бы от
              обёртки. <Notation>{"wraps"}</Notation> копирует их с исходной
              функции.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Если забыть <Notation>{"return result"}</Notation>, обёртка будет
            всегда возвращать <Notation>{"None"}</Notation>, даже если исходная
            функция вычисляла число. Сохранение поведения — часть договорённости
            декоратора. Готовый <Notation>{"@cache"}</Notation> из урока о
            рекурсии устроен так же: обёртка сначала ищет ответ в словаре и
            вызывает исходную функцию, только если его там нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Контекстные менеджеры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Контекстный менеджер задаёт, что делать при входе в блок{" "}
              <Notation>{"with"}</Notation> и при выходе из него.
            </strong>{" "}
            Проще всего написать его генератором с{" "}
            <Notation>{"@contextmanager"}</Notation>: код до{" "}
            <Notation>{"yield"}</Notation> — вход, после — выход:
          </Typography.Text>
          <CodeBlock
            code={
              'from contextlib import contextmanager\n\n@contextmanager\ndef section(title):\n    print("начало:", title)\n    try:\n        yield\n    finally:\n        print("конец:", title)\n\nwith section("подсчёт"):\n    print(sum(range(10)))'
            }
            label={"Контекстный менеджер section"}
            language="python"
            fileName="main.py"
            output={"начало: подсчёт\n45\nконец: подсчёт"}
          />
          <Typography.Text>
            При входе в <Notation>{"with"}</Notation> выполняется код до{" "}
            <Notation>{"yield"}</Notation>, затем блок, затем часть после{" "}
            <Notation>{"yield"}</Notation>. <Notation>{"finally"}</Notation> из
            урока об исключениях гарантирует выход и при ошибке в блоке. Так же
            можно замерить время: <Notation>{"perf_counter()"}</Notation> до{" "}
            <Notation>{"yield"}</Notation> и после. И так же{" "}
            <Notation>{"with open(…)"}</Notation> закрывает файл.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: контекстный менеджер классом"
            kind="nuance"
          >
            <Typography.Text>
              Без декоратора контекстный менеджер — класс с методами{" "}
              <Notation>{"__enter__"}</Notation> (вход) и{" "}
              <Notation>{"__exit__"}</Notation> (выход). Генератор с{" "}
              <Notation>{"@contextmanager"}</Notation> должен выполнить{" "}
              <Notation>{"yield"}</Notation> ровно один раз.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "match",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"match"}</Notation> проверяет форму значения и раздаёт
              его части по именам.
            </strong>{" "}
            Она удобна для разбора небольших команд:
          </Typography.Text>
          <CodeBlock
            code={
              'for line in ["move 3 5", "quit", "jump"]:\n    command = line.split()\n    match command:\n        case ["move", x, y]:\n            print(int(x), int(y))\n        case ["quit"]:\n            print("Завершение")\n        case _:\n            print("Неизвестная команда")'
            }
            label={"Разбор команд через match"}
            language="python"
            fileName="main.py"
            output={"3 5\nЗавершение\nНеизвестная команда"}
          />
          <Typography.Text>
            Шаблон <Notation>{'["move", x, y]'}</Notation> подходит для списка
            из трёх элементов, где первый — <Notation>{'"move"'}</Notation>, и
            связывает два остальных с именами <Notation>{"x"}</Notation> и{" "}
            <Notation>{"y"}</Notation>. <Notation>{"case _"}</Notation> ловит
            всё остальное. Шаблоны проверяются сверху вниз до первого
            подходящего:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.matchPaths}
            caption={
              <>
                Для <Notation>{'"jump"'}</Notation> проверены все три шаблона —
                подошёл только последний.
              </>
            }
          />
          <Typography.Text>
            Имя в шаблоне не сравнивается с переменной, а захватывает значение.
            Если нужно просто сравнить с несколькими константами, понятнее
            обычный <Notation>{"if"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Текст и байты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Текст и байты — разные данные, между ними стоит кодировка.
            </strong>{" "}
            Строка <Notation>{"str"}</Notation> — символы.{" "}
            <Notation>{"bytes"}</Notation> — последовательность целых значений
            от 0 до 255, представляющих сырые байты. Для перевода между ними
            нужна кодировка:
          </Typography.Text>
          <CodeBlock
            code={
              'text = "Привет"\ndata = text.encode("utf-8")\nrestored = data.decode("utf-8")\nprint(restored == text)\nprint(len(text), len(data))'
            }
            label={"Строка и её байты в UTF-8"}
            language="python"
            fileName="main.py"
            output={"True\n6 12"}
          />
          <Typography.Text>
            Количество байтов и количество символов не обязаны совпадать: в
            UTF-8 каждая русская буква занимает два байта. Чтение файла в режиме{" "}
            <Notation>{"rb"}</Notation> даёт байты. Преобразование{" "}
            <Notation>{"str(data)"}</Notation> не заменяет декодирование: оно
            создаёт текстовое представление байтового объекта.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Асинхронность",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Асинхронность позволяет ждать несколько внешних операций сразу, но
              не ускоряет вычисления.
            </strong>{" "}
            Когда программа ждёт сеть или другой внешний источник, она могла бы
            в это время обслужить другую задачу.{" "}
            <strong>Асинхронное выполнение</strong> позволяет описать такие
            ожидания и передавать управление между задачами. Это не обязательно
            одновременные вычисления на разных ядрах.
          </Typography.Text>
          <CodeBlock
            code={
              'import asyncio\n\nasync def report(name, delay):\n    await asyncio.sleep(delay)\n    return name\n\nasync def main():\n    results = await asyncio.gather(\n        report("A", 0.02),\n        report("B", 0.01),\n    )\n    print(results)\n\nif __name__ == "__main__":\n    asyncio.run(main())'
            }
            label={"Два ожидания через asyncio.gather"}
            language="python"
            fileName="main.py"
            output={"['A', 'B']"}
          />
          <Typography.Text>
            <Notation>{"async def"}</Notation> создаёт асинхронную функцию; её
            вызов создаёт объект корутины, выполнение которого надо
            организовать. <Notation>{"await"}</Notation> ожидает результат,
            позволяя циклу событий выполнять другую готовую работу.{" "}
            <Notation>{"gather"}</Notation> организует совместное выполнение
            переданных операций и возвращает результаты в порядке аргументов, а
            не порядке завершения: B закончилась раньше, но стоит второй.{" "}
            <Notation>{"asyncio.run"}</Notation> запускает всё это в обычном
            скрипте.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.asyncTimeline}
            caption={
              <>
                Пока A ждёт, B тоже ждёт: общее время — самое долгое ожидание,
                0,02 с, а не сумма 0,03 с.
              </>
            }
          />
          <Typography.Text>
            Обычное тяжёлое вычисление без точек ожидания блокирует такой цикл.
            Замена <Notation>{"def"}</Notation> на{" "}
            <Notation>{"async def"}</Notation> сама по себе не ускоряет перебор
            делителей.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: ноутбуки, потоки и процессы"
            kind="nuance"
          >
            <Typography.Text>
              В средах, где цикл событий уже запущен (например, некоторые
              ноутбуки), вместо <Notation>{"asyncio.run(main())"}</Notation>{" "}
              пишут <Notation>{"await main()"}</Notation>. Потоки и процессы —
              другие способы выполнять работу одновременно, со своими правилами
              общих данных.
            </Typography.Text>
          </ProofDisclosure>
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
            Что вернёт <Notation>{"double(triple(2))"}</Notation> для функций из
            урока?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            12: <Notation>{"triple(2)"}</Notation> = 6, затем{" "}
            <Notation>{"double(6)"}</Notation> = 12.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает <Notation>{'with section("x"): print(1)'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «начало: x», 1 и «конец: x» — вход, блок и выход.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему список <Notation>{"late"}</Notation> из урока даёт{" "}
            <Notation>{"[2, 2, 2]"}</Notation>, а не{" "}
            <Notation>{"[0, 1, 2]"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Все три функции обращаются к одной переменной{" "}
            <Notation>{"i"}</Notation>, а к моменту вызова цикл закончился и{" "}
            <Notation>{"i"}</Notation> равно 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что выведет <Notation>{"print(mul(3, 4))"}</Notation>, если{" "}
            <Notation>{"mul"}</Notation> умножает два числа и обёрнута{" "}
            <Notation>{"@announce"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>Сначала «Вызов mul», затем 12.</Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает разбор команд из урока для строк{" "}
            <Notation>{'"move 1 2"'}</Notation> и{" "}
            <Notation>{'"move 1"'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            1 2 и «Неизвестная команда»: во второй строке два элемента, а шаблон
            требует три.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Функция — значение: её создают, возвращают и оборачивают. На этом стоят
        замыкания, декораторы и контекстные менеджеры. Вот что понадобится
        дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Замыкание",
            note: (
              <>
                Внутренняя функция помнит переменные внешней — саму переменную,
                а не снимок.
              </>
            ),
          },
          {
            key: "Декоратор",
            note: (
              <>
                <Notation>{"@d"}</Notation> над функцией —{" "}
                <Notation>{"f = d(f)"}</Notation>; обёртка должна вернуть
                результат.
              </>
            ),
          },
          {
            key: <Notation>{"with"}</Notation>,
            note: (
              <>
                Вход — до <Notation>{"yield"}</Notation>, выход — после;{" "}
                <Notation>{"finally"}</Notation> выполняет выход и при ошибке.
              </>
            ),
          },
          {
            key: <Notation>{"match"}</Notation>,
            note: (
              <>
                Проверяет форму значения сверху вниз;{" "}
                <Notation>{"encode"}</Notation> и{" "}
                <Notation>{"decode"}</Notation> — текст и байты.
              </>
            ),
          },
          {
            key: <Notation>{"async"}</Notation>,
            note: <>Ожидания идут вместе, вычисления быстрее не становятся.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
