// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./number-sequences.paid.sosednie-gruppy.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "granica-perebora",
      navLabel: "Граница перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Соседние пары и тройки перебираются по индексу начала, а граница
              перебора выводится из последнего индекса списка.
            </strong>{" "}
            Соседние группы — в 75 задачах подборки из 85 и во всех 15 задачах
            реальных экзаменов; в 37 из них это тройки и четвёрки.
          </Typography.Text>
          <Typography.Text>
            Считать, что в задании 17 всегда нужны только соседи, всё же нельзя:
            в подборке есть задачи, где пара — любые два элемента с разными
            номерами. Их разбирает дополнительный урок «Любые пары».
          </Typography.Text>
          <Typography.Text>
            Вернёмся к последовательности 8, −12, 5, 20, −3, 14 из подтемы 1 —
            на ней разберём перебор и первую полную задачу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sosednie-pary",
      navLabel: "Соседние пары",
      explanation: (
        <>
          <Typography.Text>
            <strong>Соседние пары перебираются с шагом в один элемент.</strong>
          </Typography.Text>
          <Typography.Text>
            Соседние пары нашей последовательности — (8, −12), (−12, 5), (5,
            20), (20, −3), (−3, 14). Обрати внимание:{" "}
            <strong>пары пересекаются</strong>. Число{" "}
            <Notation>{"-12"}</Notation> участвует как второй элемент первой
            пары и как первый элемент второй пары. Это правильно.
          </Typography.Text>
          <Typography.Text>
            Если брать (8, −12), затем (5, 20), затем (−3, 14), мы пропустим две
            соседние пары.
          </Typography.Text>
          <Typography.Text>
            Для перебора используется{" "}
            <PythonTerm term="for">
              <Notation>{"range"}</Notation>
            </PythonTerm>
            : <Notation>{"range(m)"}</Notation> последовательно даёт целые числа
            0, 1, 2, …, m − 1. Правая граница не включается. Пара с началом{" "}
            <Notation>{"i"}</Notation> — это элементы{" "}
            <Notation>{"a[i]"}</Notation> и <Notation>{"a[i + 1]"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "a = [8, -12, 5, 20, -3, 14]\nfor i in range(len(a) - 1):\n    x = a[i]\n    y = a[i + 1]\n    print(i, x, y)"
            }
            label={"Пара с началом i — это элементы a[i] и a[i + 1]"}
            language="python"
            output={"0 8 -12\n1 -12 5\n2 5 20\n3 20 -3\n4 -3 14"}
          />
          <Typography.Text>
            Теперь выведем границу цикла, а не просто запомним её. Пусть длина
            списка равна <Notation>{"n"}</Notation>:
          </Typography.Text>
          <ol>
            <li>В паре используются индексы i и i + 1.</li>
            <li>Последний индекс списка — n − 1, значит, i + 1 ≤ n − 1.</li>
            <li>Отсюда i ≤ n − 2: нужны начала 0, 1, …, n − 2.</li>
          </ol>
          <Typography.Text>
            Именно их даёт{" "}
            <strong>
              <Notation>{"range(n - 1)"}</Notation>
            </strong>
            .
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqWindows2}
            caption={
              <>
                Каждая скобка — соседняя пара, у неё общий элемент с соседней
                скобкой. Последняя пара начинается с индекса i = 4 = n − 2: её
                второй элемент — последний элемент списка a[5].
              </>
            }
          />
          <Typography.Text>
            Для последовательности из <Notation>{"n"}</Notation> элементов при{" "}
            <Notation>{"n ≥ 2"}</Notation> существует{" "}
            <Notation>{"n - 1"}</Notation> соседняя пара.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sosednie-trojki",
      navLabel: "Соседние тройки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для троек рассуждение такое же, но последний используемый индекс —{" "}
              <Notation>{"i + 2"}</Notation>.
            </strong>
          </Typography.Text>
          <Typography.Text>Перебор:</Typography.Text>
          <CodeBlock
            code={
              "for i in range(len(a) - 2):\n    x = a[i]\n    y = a[i + 1]\n    z = a[i + 2]"
            }
            label={"Перебор"}
            language="python"
          />
          <Typography.Text>
            Требуется i + 2 ≤ n − 1, поэтому i ≤ n − 3. Начала троек — 0, 1, …,
            n − 3. Их даёт{" "}
            <strong>
              <Notation>{"range(n - 2)"}</Notation>
            </strong>
            . Для нашего списка получаются (8, −12, 5), (−12, 5, 20), (5, 20,
            −3), (20, −3, 14):
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqWindows3}
            caption={
              <>
                Четыре соседние тройки шести элементов: каждая следующая
                сдвинута на один элемент. Последняя начинается с индекса n − 3 =
                3.
              </>
            }
          />
          <Typography.Text>
            Общее правило для группы из <Notation>{"k"}</Notation> соседних
            элементов:
          </Typography.Text>
          <CodeBlock
            code={"for i in range(len(a) - k + 1):\n    ..."}
            label={"Общее правило для группы из k соседних элементов"}
            language="python"
          />
          <Typography.Text>
            При <Notation>{"n ≥ k"}</Notation> таких групп n − k + 1. Например,
            соседние четвёрки — это <Notation>{"range(len(a) - 3)"}</Notation> и
            элементы <Notation>{"a[i]"}</Notation>,{" "}
            <Notation>{"a[i + 1]"}</Notation>, <Notation>{"a[i + 2]"}</Notation>
            , <Notation>{"a[i + 3]"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Группу соседних элементов иногда называют <strong>окном</strong>.
            Перемещение её начала на одну позицию — движением окна по
            последовательности. Для задания 17 с парами и тройками за этим
            названием стоит именно описанный перебор.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervaya-zadacha",
      navLabel: "Первая задача целиком",
      explanation: (
        <>
          <Typography.Text>
            <strong>Теперь можно полностью решить первую задачу.</strong>
          </Typography.Text>
          <Typography.Text>Учебное условие:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти количество соседних пар, в которых хотя бы одно число
              делится на четыре. Среди таких пар найти максимальную сумму.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Пока разберём ответ вручную для 8, −12, 5, 20, −3, 14:
          </Typography.Text>
          <LessonTable
            label={"Пока разберём ответ вручную для 8, −12, 5, 20, −3, 14"}
            columns={[
              { label: "Пара" },
              { label: "Хотя бы одно число кратно 4?" },
              { label: "Сумма", numeric: true },
            ]}
            rows={[
              [
                <>
                  <Notation>{"(8, -12)"}</Notation>
                </>,
                "Да",
                "−4",
              ],
              [
                <>
                  <Notation>{"(-12, 5)"}</Notation>
                </>,
                "Да",
                "−7",
              ],
              [
                <>
                  <Notation>{"(5, 20)"}</Notation>
                </>,
                "Да",
                "25",
              ],
              [
                <>
                  <Notation>{"(20, -3)"}</Notation>
                </>,
                "Да",
                "17",
              ],
              [
                <>
                  <Notation>{"(-3, 14)"}</Notation>
                </>,
                "Нет",
                "11",
              ],
            ]}
          />
          <Typography.Text>
            Подходят четыре пары. Их суммы −4, −7, 25, 17. Максимальная —{" "}
            <Notation>{"25"}</Notation>. Ответ: <Notation>{"4 25"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Самый наглядный способ программирования — сохранять суммы подходящих
            пар в отдельный список. Функция{" "}
            <PythonTerm term="agg">
              <Notation>{"max"}</Notation>
            </PythonTerm>{" "}
            возвращает наибольшее значение:{" "}
            <Notation>{"max([-4, -7, 25, 17])"}</Notation> равно 25.
          </Typography.Text>
          <Typography.Text>Программа:</Typography.Text>
          <CodeBlock
            code={
              'with open("17.txt") as f:\n    a = [int(part) for part in f.read().split()]\n\nsums = []\n\nfor i in range(len(a) - 1):\n    x = a[i]\n    y = a[i + 1]\n\n    if x % 4 == 0 or y % 4 == 0:\n        sums.append(x + y)\n\nif len(sums) > 0:\n    print(len(sums), max(sums))\nelse:\n    print("Подходящих пар нет")'
            }
            label={"Программа"}
            language="python"
            output={"4 25"}
          />
          <Typography.Text>
            Почему <Notation>{"len(sums)"}</Notation> даёт количество пар?
            Потому что{" "}
            <strong>
              на каждую подходящую пару добавляется ровно одна сумма
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Если две разные пары имеют одинаковые суммы, одинаковое значение
            добавится дважды. Удалять такие повторения не нужно: пары разные.
          </Typography.Text>
          <Typography.Text>
            Обрати внимание на отступ:{" "}
            <Notation>{"sums.append(x + y)"}</Notation> стоит внутри{" "}
            <Notation>{"if"}</Notation>, поэтому добавление происходит только
            после проверки. Если перенести <Notation>{"append"}</Notation> за
            пределы <Notation>{"if"}</Notation>, в список попадут суммы всех
            пар.
          </Typography.Text>
          <Typography.Text>
            Последняя ветка с текстом — диагностическая. На экзамене, если
            подходящих групп нет, нужно действовать по условию: например,
            вывести <Notation>{"0 0"}</Notation>,{" "}
            <strong>если именно это предписано</strong>. Нельзя самостоятельно
            считать ноль универсальным значением отсутствующего максимума.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bez-spiska-summ",
      navLabel: "Без списка сумм",
      explanation: (
        <>
          <Typography.Text>
            <strong>Тот же ответ можно находить, не сохраняя все суммы.</strong>
          </Typography.Text>
          <Typography.Text>
            Нам нужны лишь количество найденных пар и наибольшая сумма среди уже
            найденных.
          </Typography.Text>
          <Typography.Text>
            Для количества создадим переменную{" "}
            <Notation>{"count = 0"}</Notation>. Она называется{" "}
            <strong>счётчиком</strong>, потому что хранит количество событий.
            При обнаружении подходящей пары выполняется{" "}
            <PythonTerm term="augassign">
              <Notation>{"count += 1"}</Notation>
            </PythonTerm>
            : к старому значению прибавляется единица, результат сохраняется
            обратно.
          </Typography.Text>
          <Typography.Text>
            Для максимума нужно выбрать начальное состояние.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Начинать максимум с нуля в общем случае неправильно.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Предположим, подходящие суммы −15, −8, −20. Максимальная из них —{" "}
            <Notation>{"-8"}</Notation>. Если начать с нуля и заменять его
            только на большее число, останется <Notation>{"0"}</Notation>,
            которого среди результатов вообще нет.
          </Typography.Text>
          <Typography.Text>
            Удобно использовать{" "}
            <PythonTerm term="none">
              <Notation>{"best = None"}</Notation>
            </PythonTerm>
            . <Notation>{"None"}</Notation> — специальное значение, которым
            здесь обозначаем:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Подходящего результата пока не было.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            При появлении очередной суммы: если результата ещё не было,
            запоминаем первый; иначе заменяем его, только если новая сумма
            больше. Запусти пример по шагам и посмотри, как меняется{" "}
            <Notation>{"best"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runBest}
            label={"Запусти пример по шагам и посмотри, как меняется best"}
          />
          <Typography.Text>
            Python проверяет части <Notation>{"or"}</Notation> слева направо.
            Когда <Notation>{"best is None"}</Notation> истинно, сравнение{" "}
            <Notation>{"s > best"}</Notation> уже не выполняется. Поэтому число
            не сравнивается с <Notation>{"None"}</Notation>.
          </Typography.Text>
          <Typography.Text>Полная программа:</Typography.Text>
          <CodeBlock
            code={
              'with open("17.txt") as f:\n    a = [int(part) for part in f.read().split()]\n\ncount = 0\nbest = None\n\nfor i in range(len(a) - 1):\n    x = a[i]\n    y = a[i + 1]\n\n    if x % 4 == 0 or y % 4 == 0:\n        count += 1\n        current_sum = x + y\n\n        if best is None or current_sum > best:\n            best = current_sum\n\nif count > 0:\n    print(count, best)\nelse:\n    print("Подходящих пар нет")'
            }
            label={"Полная программа"}
            language="python"
            output={"4 25"}
          />
          <Typography.Text>
            Для поиска минимума изменяется знак сравнения:{" "}
            <Notation>{"if best is None or value < best:"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Оба способа — список результатов и счётчик с лучшим значением —
            правильные.
          </Typography.Text>
          <LessonTable
            label={
              "Оба способа — список результатов и счётчик с лучшим значением — правильные"
            }
            columns={[{ label: "Способ" }, { label: "Что удобно" }]}
            rows={[
              [
                "Список результатов",
                "Легко посмотреть все найденные значения и проверить себя",
              ],
              ["Счётчик и лучшее значение", "Не нужно хранить все результаты"],
            ]}
          />
          <Typography.Text>
            Для освоения темы список часто нагляднее. После понимания логики
            переход к счётчику несложен.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pochemu-verno",
      navLabel: "Почему это верно",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Правильность такого решения можно объяснить без формальных
              доказательств.
            </strong>
          </Typography.Text>
          <Typography.Text>
            После обработки каждой очередной пары:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"count"}</Notation> равен количеству подходящих пар
              среди уже проверенных;
            </li>
            <li>
              <Notation>{"best"}</Notation> равен максимальной сумме среди них
              либо остаётся <Notation>{"None"}</Notation>, если подходящих ещё
              не было.
            </li>
          </ul>
          <Typography.Text>
            Изначально проверенных пар нет, поэтому{" "}
            <Notation>{"count = 0"}</Notation>. Если очередная пара не подходит,
            ответ не меняется. Если подходит, количество увеличивается на
            единицу, а максимум при необходимости обновляется.
          </Typography.Text>
          <Typography.Text>
            Цикл рассматривает каждое допустимое начало пары ровно один раз.
            Поэтому к его завершению учтены все нужные пары.
          </Typography.Text>
          <Typography.Text>
            Это и есть смысл алгоритма: мы поддерживаем правильный частичный
            ответ и постепенно распространяем его на всю последовательность.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gruppy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Соседние группы пересекаются; пара с началом{" "}
                    <Notation>{"i"}</Notation> — <Notation>{"a[i]"}</Notation>,{" "}
                    <Notation>{"a[i + 1]"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Граница выводится из последнего индекса: пары —{" "}
                    <Notation>{"range(n - 1)"}</Notation>, тройки —{" "}
                    <Notation>{"range(n - 2)"}</Notation>, группы из{" "}
                    <Notation>{"k"}</Notation> —{" "}
                    <Notation>{"range(n - k + 1)"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Ответ копится списком подходящих значений или счётчиком с
                    лучшим значением.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Лучшее значение начинается с <Notation>{"None"}</Notation>,
                    а не с нуля: подходящие суммы бывают отрицательными.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Если подходящих групп нет, выводится то, что предписано
                    условием.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-6",
      prompt: (
        <>
          Последовательность −5, −2, −9, 4. Найди количество соседних пар, в
          которых оба числа отрицательные, и максимальную сумму. Что выведет
          программа, если начать <Notation>{"best = 0"}</Notation>?
        </>
      ),
      reveal: (
        <>
          <Notation>{"2 -7"}</Notation>: суммы −7 и −11. С{" "}
          <Notation>{"best = 0"}</Notation> программа выведет{" "}
          <Notation>{"2 0"}</Notation> — нуля среди сумм нет.
        </>
      ),
    },
  ],
};

export default content;
