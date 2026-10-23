import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonCostLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-cost.media";

export const pythonCostLesson = defineCourseLesson({
  ...pythonCostLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Оценивать рост работы и выбирать структуру"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Программа проверяет все пары чисел файла. На десяти числах она
            отвечает мгновенно, на ста тысячах — не дождаться. Код тот же,
            данные больше.{" "}
            <strong>
              Скорость программы определяется тем, как растёт число действий с
              ростом данных, а не тем, насколько коротко она записана
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Научимся оценивать этот рост для одного прохода, всех пар и деления
            пополам, узнаем цену знакомых операций и памяти и измерим время
            сами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Временная сложность",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Временная сложность описывает, как растёт работа с размером входа.
            </strong>{" "}
            Размер входа обозначают <Notation>{"n"}</Notation> — например, число
            строк файла. Один проход по файлу делает около{" "}
            <Notation>{"n"}</Notation> действий, и это записывают{" "}
            <Notation>{"O(n)"}</Notation> — «порядка n». Все пары — около{" "}
            <Notation>{"n²"}</Notation> действий, <Notation>{"O(n²)"}</Notation>
            . Это не секунды, а то, во сколько раз вырастет работа, если данных
            станет больше.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: что строго значит O(n)"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"O(n)"}</Notation> — верхняя оценка: при достаточно
              большом <Notation>{"n"}</Notation> число действий не больше{" "}
              <Notation>{"c · n"}</Notation> для некоторой постоянной{" "}
              <Notation>{"c"}</Notation>. На практике так называют характерный
              порядок роста алгоритма.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Порядки роста удобно сравнить на одном размере входа. Каждая клетка
            шкалы — в тысячу раз больше предыдущей:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.growth100000}
            caption={
              <>
                При ста тысячах элементов один проход — 100 тысяч действий,
                сортировка — около 1,7 миллиона, а все пары — 10 миллиардов.
                Удвоение n удваивает работу <Notation>{"O(n)"}</Notation> и
                учетверяет <Notation>{"O(n²)"}</Notation>. Перебор всех
                подмножеств, <Notation>{"O(2ⁿ)"}</Notation>, растёт ещё быстрее:
                при 30 элементах подмножеств больше миллиарда.
              </>
            }
          />
          <Typography.Text>
            Такой разрыв важнее любых сокращений записи: никакая короткая запись
            не превратит 10 миллиардов действий в 100 тысяч.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Подсчёт шагов",
      explanation: (
        <>
          <Typography.Text>
            <strong>Число шагов считают по реальным границам циклов.</strong>{" "}
            Два вложенных цикла не всегда дают <Notation>{"n²"}</Notation>. Если
            внутренний всегда делает 10 шагов, всего их{" "}
            <Notation>{"10n"}</Notation>, то есть <Notation>{"O(n)"}</Notation>.
            Если внутренний цикл идёт только по номерам после{" "}
            <Notation>{"i"}</Notation>, каждая пара проверяется один раз:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 1000\nsteps = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        steps += 1\nprint(steps, n * (n - 1) // 2)"
            }
            label={"Число пар i < j при n = 1000"}
            language="python"
            fileName="main.py"
            output={"499500 499500"}
          />
          <Typography.Text>
            Откуда формула, видно на сетке всех пар: пары с{" "}
            <Notation>{"i < j"}</Notation> — треугольник над диагональю.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pairsTriangle5}
            caption={
              <>
                Из <Notation>{"n · n"}</Notation> клеток убираем диагональ (
                <Notation>{"n"}</Notation> клеток) и делим остаток пополам: под
                диагональю те же пары. Пар вдвое меньше, чем{" "}
                <Notation>{"n²"}</Notation>, но порядок роста тот же —{" "}
                <Notation>{"O(n²)"}</Notation>.
              </>
            }
          />
          <Typography.Text>
            Если на каждом шаге число делится на 2, после{" "}
            <Notation>{"k"}</Notation> шагов оно уменьшается в{" "}
            <Notation>{"2 ** k"}</Notation> раз. Поэтому до единицы нужно около{" "}
            <Notation>{"log₂(n)"}</Notation> шагов — столько раз{" "}
            <Notation>{"n"}</Notation> можно делить пополам:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 1_000_000\nsteps = 0\nwhile n > 1:\n    n //= 2\n    steps += 1\nprint(steps)"
            }
            label={"Сколько раз миллион делится пополам"}
            language="python"
            fileName="main.py"
            output={"19"}
          />
          <Typography.Text>
            Миллион делится пополам до единицы всего 19 раз: 2¹⁹ ≈ 524 тысячи,
            2²⁰ ≈ 1,05 миллиона. Запись <Notation>{"1_000_000"}</Notation> — то
            же число 1000000, подчёркивания только облегчают чтение.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Стоимость операций",
      explanation: (
        <>
          <Typography.Text>
            <strong>Стоимость скрыта и внутри отдельных операций.</strong> Одна
            строка кода может пройти весь список. Ориентиры для знакомых
            операций:
          </Typography.Text>
          <LessonTable
            label={"Стоимость операций Python"}
            columns={[{ label: "Операция" }, { label: "Обычная оценка" }]}
            rows={[
              [
                <>
                  <Notation>{"len(list)"}</Notation> и{" "}
                  <Notation>{"list[i]"}</Notation>
                </>,
                <>
                  <Notation>{"O(1)"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"x in list"}</Notation>
                </>,
                <>
                  До <Notation>{"O(n)"}</Notation> сравнений
                </>,
              ],
              [
                <>
                  <Notation>{"list.append(x)"}</Notation>,{" "}
                  <Notation>{"list.pop()"}</Notation>
                </>,
                <>
                  <Notation>{"O(1)"}</Notation> в среднем
                </>,
              ],
              [
                <>
                  <Notation>{"list.pop(0)"}</Notation>
                </>,
                <>
                  <Notation>{"O(n)"}</Notation> из-за сдвига
                </>,
              ],
              [
                "Срез длины k",
                <>
                  <Notation>{"O(k)"}</Notation> времени и новой памяти
                </>,
              ],
              [
                <>
                  <Notation>{"sum"}</Notation>, <Notation>{"min"}</Notation>,{" "}
                  <Notation>{"max"}</Notation>
                </>,
                <>
                  <Notation>{"O(n)"}</Notation> — один проход
                </>,
              ],
              [
                "Поиск в dict и set",
                <>
                  Обычно <Notation>{"O(1)"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"sorted"}</Notation>
                </>,
                <>
                  <Notation>{"O(n log n)"}</Notation> сравнений
                </>,
              ],
            ]}
          />
          <Typography.Text>
            Отсюда две частые ошибки. Срез <Notation>{"a[i:i + k]"}</Notation> в
            цикле каждый раз копирует до <Notation>{"k"}</Notation> элементов.
            Множество для проверок <Notation>{"in"}</Notation> строят один раз
            до цикла, а не внутри каждого запроса.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: когда оценки хуже" kind="nuance">
            <Typography.Text>
              Оценки предполагают, что сравнить или захешировать один элемент
              недорого. Для длинных строк и огромных целых это отдельная работа.
              Поиск в <Notation>{"dict"}</Notation> и{" "}
              <Notation>{"set"}</Notation> в редких худших случаях медленнее{" "}
              <Notation>{"O(1)"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Память",
      explanation: (
        <>
          <Typography.Text>
            <strong>Память тоже растёт с данными, если их сохранять.</strong>{" "}
            <strong>Пространственная сложность</strong> описывает, сколько
            памяти нужно алгоритму. В уроке о файлах сумму и наибольшее считали
            двумя способами. Первый сохраняет все числа в список — память растёт
            с числом строк:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("numbers.txt", encoding="utf-8") as file:\n    numbers = [int(line) for line in file]\nprint(sum(numbers), max(numbers))'
            }
            label={"Сумма и наибольшее через список"}
            language="python"
            fileName="main.py"
            output={"20 10"}
          />
          <Typography.Text>
            Второй проходит файл один раз и хранит только{" "}
            <Notation>{"total"}</Notation> и <Notation>{"best"}</Notation> — два
            числа при любом размере файла:
          </Typography.Text>
          <CodeBlock
            code={
              'total = 0\nbest = None\nwith open("numbers.txt", encoding="utf-8") as file:\n    for line in file:\n        number = int(line)\n        total += number\n        if best is None or number > best:\n            best = number\nprint(total, best)'
            }
            label={"Сумма и наибольшее за один проход"}
            language="python"
            fileName="main.py"
            output={"20 10"}
          />
          <Typography.Text>
            Время у обоих <Notation>{"O(n)"}</Notation>, а память — растущая и
            постоянная. Словарь частот занимает место по числу различных
            значений. Если в конце нужен <Notation>{"sorted"}</Notation>, все
            элементы всё равно придётся собрать. Рекурсия хранит незавершённые
            вызовы, кэш — вычисленные результаты; это тоже память.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Измерение времени",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Время измеряют разностью показаний часов, но сначала улучшают
              порядок роста.
            </strong>{" "}
            <Notation>{"perf_counter()"}</Notation> из модуля{" "}
            <Notation>{"time"}</Notation> возвращает показание часов в секундах.
            Само показание ничего не значит, важна разность до и после. Проверим
            таблицу на опыте: ищем отсутствующее число тысячу раз в списке из
            ста тысяч чисел и в множестве из тех же чисел.
          </Typography.Text>
          <CodeBlock
            code={
              'from time import perf_counter\n\nnumbers = list(range(100_000))\nas_set = set(numbers)\n\nstart = perf_counter()\nfor _ in range(1000):\n    found = -1 in numbers\nprint("список:", perf_counter() - start)\n\nstart = perf_counter()\nfor _ in range(1000):\n    found = -1 in as_set\nprint("множество:", perf_counter() - start)'
            }
            label={"Опыт: x in для списка и множества"}
            language="python"
            fileName="main.py"
          />
          <Typography.Text>
            Запусти у себя и сравни два числа. Множество окажется быстрее в
            тысячи раз: в списке каждый поиск проходит все сто тысяч чисел, в
            множестве — сразу смотрит на нужное место. Сами секунды зависят от
            компьютера и немного меняются от запуска к запуску, поэтому вывод
            здесь не показан.
          </Typography.Text>
          <Typography.Text>
            Один запуск шумный: влияют другие программы на компьютере. Поэтому
            сначала улучшают порядок роста алгоритма, а секунды меряют, чтобы
            найти самое медленное место.
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
            Нужно проверить миллион запросов принадлежности среди ста тысяч
            различных целых. Какая структура подходит?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Множество, построенное один раз: подготовка — один проход, каждый
            поиск — примерно один шаг. Поиск по списку для каждого запроса может
            потребовать до ста миллиардов сравнений.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Какие операции выполняются за постоянное время:{" "}
            <Notation>{"a[500]"}</Notation>, <Notation>{"x in a"}</Notation> для
            списка, <Notation>{"d[key]"}</Notation> для словаря,{" "}
            <Notation>{"len(a)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"a[500]"}</Notation>, <Notation>{"d[key]"}</Notation> и{" "}
            <Notation>{"len(a)"}</Notation>; <Notation>{"x in a"}</Notation> для
            списка — до n сравнений.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Почему очередь из миллиона заявок плохо обслуживать через{" "}
            <Notation>{"list.pop(0)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Каждый <Notation>{"pop(0)"}</Notation> сдвигает все оставшиеся
            элементы: всего около n²/2 сдвигов;{" "}
            <Notation>{"deque.popleft"}</Notation> забирает первый без сдвига.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Найти сумму чисел в файле можно, прочитав все числа в список, или
            одним проходом со счётчиком. Чем отличаются эти способы по памяти?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Список занимает память по числу чисел, проход со счётчиком —
            постоянную.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Два цикла: внешний по <Notation>{"n"}</Notation> элементам,
            внутренний всегда ровно 10 шагов. Какой порядок роста?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"O(n)"}</Notation>: всего 10n шагов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Перебор всех подмножеств 30 предметов: сколько вариантов? Сколько
            времени он займёт, если за секунду проверяется 10 миллионов
            вариантов?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2³⁰ = 1 073 741 824 варианта — около 107 секунд. Для 40 предметов —
            уже больше суток.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Быстрая программа — та, у которой работа медленно растёт с данными.
        Сначала оценивают порядок роста, потом меряют секунды. Вот что
        понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Сложность",
            note: <>Рост числа действий с размером входа, а не секунды.</>,
          },
          {
            key: "Порядки",
            note: (
              <>
                Один проход — <Notation>{"O(n)"}</Notation>, все пары —{" "}
                <Notation>{"O(n²)"}</Notation>, деление пополам —{" "}
                <Notation>{"O(log n)"}</Notation>; пар{" "}
                <Notation>{"i < j"}</Notation> — n(n − 1)/2.
              </>
            ),
          },
          {
            key: "Скрытая цена",
            note: (
              <>
                <Notation>{"x in list"}</Notation> — до n сравнений,{" "}
                <Notation>{"x in set"}</Notation> — обычно один шаг;{" "}
                <Notation>{"pop(0)"}</Notation> сдвигает весь список.
              </>
            ),
          },
          {
            key: "Память",
            note: (
              <>
                Список растёт с данными, проход со счётчиками — нет; рекурсия и
                кэш тоже занимают память.
              </>
            ),
          },
          {
            key: <Notation>{"perf_counter"}</Notation>,
            note: <>Разность показаний до и после; один запуск шумный.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
