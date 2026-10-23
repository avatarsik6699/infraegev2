// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./array-processing.paid.pary-okno-i-cepochki.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "podschyot-i-razbienie",
      navLabel: "Подсчёт пар",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для редких задач.</strong> Пары чисел
            с проверкой по множеству, маршрут альпиниста, матрёшки из двух
            материалов встречаются в сборниках, но на реальных экзаменах их не
            было. Задачи основных подтем решаются без этого урока.
          </Typography.Text>
          <Typography.Text>
            Сколько пар чисел из списка дают сумму не больше S, если одно число
            может входить во многие пары?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Отсортировать список и двигать два указателя: если a[left] +
              a[right] ≤ S, то с a[left] подходят все числа до right — их right
              − left.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В подтеме «Цепочки коробок и пары» каждый объект использовался один
            раз. Здесь одно число может входить во многие пары.
          </Typography.Text>
          <Typography.Text>
            Почему пар ровно <Notation>{"right − left"}</Notation>? Это элементы
            с индексами <Notation>{"left + 1, …, right"}</Notation>: каждый не
            больше <Notation>{"a[right]"}</Notation>, значит, и с{" "}
            <Notation>{"a[left]"}</Notation> даёт сумму не больше S.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "a = [1, 3, 4, 10, 11, 13]\nlimit = 14\na.sort()\nleft = 0\nright = len(a) - 1\ncount = 0\nwhile left < right:\n    if a[left] + a[right] <= limit:\n        count += right - left\n        left += 1\n    else:\n        right -= 1\nprint(count)"
            }
            label={"Пары с суммой не больше S"}
            language="python"
            output={"9"}
          />
          <Typography.Text>
            Если сумма слишком велика, уменьшаем правую границу. Почему можно
            отбросить текущий правый элемент? Даже с минимальным доступным левым
            он не подходит, а с более крупными левыми сумма будет ещё больше.
            После сортировки оба индекса проходят список только один раз,
            поэтому сам подсчёт имеет порядок O(N).{" "}
            <strong>
              Этот приём работает благодаря упорядоченному условию на сумму.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-par",
      navLabel: "Перебор пар",
      explanation: (
        <>
          <Typography.Text>
            «Среднее арифметическое пары встречается среди чисел файла» — здесь
            два указателя не помогут. Что делать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все пары, а наличие числа проверять по множеству: это
              быстро, но сам перебор остаётся квадратичным.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для проверки наличия значения удобно использовать{" "}
            <PythonTerm term="set">множество</PythonTerm>{" "}
            <Notation>{"values = set(a)"}</Notation>: операция{" "}
            <Notation>{"x in values"}</Notation> проверяет наличие значения и в
            обычных условиях работает существенно быстрее последовательного
            просмотра списка.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "a = [2, 5, 8, 11, 14, 20]\nvalues = set(a)\ncount = 0\nbest = None\nfor i in range(len(a)):\n    for j in range(i + 1, len(a)):\n        total = a[i] + a[j]\n        if total % 2 == 0:\n            average = total // 2\n            if average in values:\n                count += 1\n                if best is None or average > best:\n                    best = average\nprint(count, best)"
            }
            label={"Среднее пары есть среди чисел"}
            language="python"
            output={"6 14"}
          />
          <Typography.Text>
            <Notation>{"total % 2 == 0"}</Notation> проверяет чётность суммы —
            это нужно, чтобы среднее было целым. Почему{" "}
            <Notation>{"j"}</Notation> начинается с{" "}
            <Notation>{"i + 1"}</Notation>? Чтобы не образовывать пару элемента
            с самим собой и не считать <Notation>{"(a, b)"}</Notation> и{" "}
            <Notation>{"(b, a)"}</Notation> дважды.
          </Typography.Text>
          <Typography.Text>
            Здесь остаётся O(N²) пар: при N = 5000 это 12,5 миллиона проверок —
            несколько секунд, а при 100 000 уже почти пять миллиардов.{" "}
            <strong>
              Множество ускоряет проверку наличия, но не отменяет сам перебор.
            </strong>{" "}
            Допустимость такого решения зависит от размера входных данных; в
            задачах подборки чисел несколько тысяч.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skolzyashchee-okno",
      navLabel: "Скользящее окно",
      explanation: (
        <>
          <Typography.Text>
            Выбрать как можно больше чисел так, чтобы наибольшее и наименьшее
            отличались не больше чем на D. Как?
          </Typography.Text>
          <Typography.Text>
            <strong>
              После сортировки подходящие числа идут подряд: двигать правую
              границу окна, а левую подтягивать, пока разность больше D.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Почему подряд? Если минимальное и максимальное допустимы, любое
            число между ними тоже можно добавить: границы диапазона не
            изменятся. Для чисел 1, 3, 4, 10, 11, 13 и D = 4 подходят, например,
            1, 3, 4 и 10, 11, 13.
          </Typography.Text>
          <Typography.Text>
            Участок между границами <Notation>{"left"}</Notation> и{" "}
            <Notation>{"right"}</Notation> называют <strong>окном</strong>.
            Посмотри, как оно движется:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.greedyWindow4}
            label={"Окно чисел с разностью не больше 4: шаг за шагом"}
          />
          <CodeBlock
            collapsible={false}
            code={
              "a = [1, 3, 4, 10, 11, 13]\ndistance = 4\na.sort()\nleft = 0\nbest = 0\nfor right in range(len(a)):\n    while a[right] - a[left] > distance:\n        left += 1\n    length = right - left + 1\n    if length > best:\n        best = length\nprint(best)"
            }
            label={"Окно с разностью не больше D"}
            language="python"
            output={"3"}
          />
          <Typography.Text>
            Длина — <Notation>{"right − left + 1"}</Notation>, потому что обе
            границы входят в участок: индексы от 2 до 4 включительно — это три
            элемента. Почему вложенный <Notation>{"while"}</Notation> не делает
            алгоритм квадратичным?{" "}
            <strong>
              <Notation>{"left"}</Notation> за всю работу только увеличивается
            </strong>{" "}
            и проходит не более N позиций; он не возвращается в начало для
            каждого <Notation>{"right"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Принципиальное основание метода: при расширении окна нарушение
            исправляется удалением элементов слева, а пропущенные внутри
            элементы не нужны. Для произвольного набора ограничений это свойство
            нужно доказывать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "osobye-perehody",
      navLabel: "Особые переходы",
      explanation: (
        <>
          <Typography.Text>
            Альпинист спускается по лагерям; перепад больше D разрешён только со
            страховкой, и таких переходов не больше K. Как найти самый длинный
            маршрут?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Это окно по отсортированным различным высотам, в котором особых
              переходов не больше K, — но только при условии 2(D + 1) {">"} E.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Предположим: альпинист идёт по лагерям только на строго меньшую
            высоту; обычный переход имеет перепад не более D, специальный (со
            страховкой) — не более E, специальных переходов не больше K. Нужен
            самый длинный маршрут, а при равной длине — с наибольшей высотой
            последнего лагеря. Возникает вопрос: можно ли считать, что
            оптимальный маршрут проходит по всем высотам подряд в
            отсортированном списке?
          </Typography.Text>
          <Typography.Text>
            Не всегда. Но это можно доказать, например, при целых высотах и
            условии <strong>E {"<"} 2(D + 1)</strong>. Минимальный целый
            перепад, уже требующий специального перехода, равен D + 1; два таких
            перепада вместе дают хотя бы 2(D + 1).
          </Typography.Text>
          <Typography.Text>
            Если это больше E, один допустимый специальный прыжок не может
            перескочить сразу через два промежутка, каждый из которых требует
            специального перехода. Следовательно, добавление пропущенных
            промежуточных высот внутрь допустимого перехода не увеличивает число
            специальных переходов: обычный переход разбивается на обычные, а
            специальный — на обычные и не более одного специального. А лагерей в
            маршруте от этого только больше.
          </Typography.Text>
          <Typography.Text>
            Значит, оптимальный маршрут можно искать среди непрерывных участков
            отсортированных различных высот. Перепад больше E разрывает участок;
            перепад от D + 1 до E расходует один специальный переход; при
            превышении K сдвигаем левую границу.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "heights = [30, 28, 23, 21, 17, 15, 9, 8]\nnormal_limit, special_limit, allowed_special = 3, 6, 1\nheights = sorted(set(heights), reverse=True)\nleft = special_count = 0\nbest_length = best_finish = 0\nfor right in range(len(heights)):\n    if right > 0:\n        gap = heights[right - 1] - heights[right]\n        if gap > special_limit:\n            left = right\n            special_count = 0\n        elif gap > normal_limit:\n            special_count += 1\n    while special_count > allowed_special:\n        if heights[left] - heights[left + 1] > normal_limit:\n            special_count -= 1\n        left += 1\n    length = right - left + 1\n    if (length, heights[right]) > (best_length, best_finish):\n        best_length, best_finish = length, heights[right]\nprint(best_length, best_finish)"
            }
            label={"Маршрут альпиниста"}
            language="python"
            output={"4 21"}
          />
          <Typography.Text>
            Один из лучших маршрутов — 30 → 28 → 23 → 21: переход 28 → 23
            специальный. Удаление повторных высот <Notation>{"set"}</Notation>{" "}
            допустимо именно потому, что маршрут строго убывает и у лагерей нет
            других различающих условий: на одной высоте можно посетить не более
            одного лагеря.
          </Typography.Text>
          <Typography.Text>
            <strong>Условие на D и E нельзя отбросить.</strong> При D = 3, E =
            12, K = 1 и высотах 53, 52, 51, 50, 44, 38, 37, 36, 35 можно
            пропустить 44 и пройти 53, 52, 51, 50, 38, 37, 36, 35 — восемь
            лагерей, один специальный переход 50 → 38. А прохождение через 44
            потребовало бы двух специальных переходов, и окно найдёт только пять
            лагерей. Здесь 12 ≥ 2 · 4 — условие нарушено. Это пример того,
            почему для усложнённой задачи нужно заново обосновывать возможность
            свести выбор к соседним элементам.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kucha",
      navLabel: "Куча",
      explanation: (
        <>
          <Typography.Text>
            В камере хранения десятки тысяч ячеек и заявок. Как быстро находить
            свободную ячейку с наименьшим номером?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Хранить свободные ячейки и занятые в кучах — структурах, которые
              быстро отдают наименьший элемент.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Алгоритм камеры хранения из подтемы о моделировании в худшем случае
            проверяет <Notation>{"k"}</Notation> ячеек для каждой из{" "}
            <Notation>{"n"}</Notation> заявок — порядка O(N · K) действий. Если
            оба числа большие, это становится дорого. Нужны две операции: быстро
            узнать, какая занятая ячейка освободится раньше, и быстро выбрать
            минимальный номер среди уже свободных.
          </Typography.Text>
          <Typography.Text>
            Для этого используют <strong>очередь приоритетов</strong> —
            структуру, из которой удобно извлекать элемент с наименьшим ключом.
            В Python её реализует модуль <Notation>{"heapq"}</Notation>{" "}
            (подключается так же, как другие модули:{" "}
            <Notation>
              {"from heapq import heapify, heappush, heappop"}
            </Notation>
            ). Основные операции:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"heapify(a)"}</Notation> — организовать существующий
              список как такую структуру;
            </li>
            <li>
              <Notation>{"heappush(a, value)"}</Notation> — добавить элемент;
            </li>
            <li>
              <Notation>{"heappop(a)"}</Notation> — удалить и вернуть
              минимальный элемент;
            </li>
            <li>
              <Notation>{"a[0]"}</Notation> — посмотреть минимальный элемент без
              удаления.
            </li>
          </ul>
          <Typography.Text>
            Остальные элементы при этом не обязаны идти в полностью
            отсортированном порядке: куча гарантирует только, что наименьший —
            первый. Каждая операция занимает порядка log N действий.
          </Typography.Text>
          <Typography.Text>
            Храним <Notation>{"free_cells"}</Notation> — номера свободных ячеек
            и <Notation>{"busy"}</Notation> — пары «время освобождения, номер
            ячейки». На примере двух ячеек и пяти заявок:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from heapq import heapify, heappush, heappop\n\nk = 2\nrequests = [(1, 5), (2, 4), (3, 7), (4, 8), (5, 6)]\nrequests.sort(key=lambda x: x[0])\nfree_cells = list(range(k))\nheapify(free_cells)\nbusy = []\naccepted = 0\nlast_cell = None\nfor start, finish in requests:\n    while busy and busy[0][0] <= start:\n        _, cell = heappop(busy)\n        heappush(free_cells, cell)\n    if free_cells:\n        cell = heappop(free_cells)\n        heappush(busy, (finish, cell))\n        accepted += 1\n        last_cell = cell + 1\nprint(accepted, last_cell)"
            }
            label={"Камера хранения на кучах"}
            language="python"
            output={"4 1"}
          />
          <Typography.Text>
            <Notation>{"list(range(k))"}</Notation> создаёт список индексов 0,
            1, …, k − 1. Почему нужны две структуры? В занятой ячейке нас
            интересует <strong>время освобождения</strong>, в свободной —{" "}
            <strong>номер ячейки</strong>; один и тот же порядок не решает обе
            задачи. Обработка после сортировки занимает порядка O(N log K). Если
            выбирается самая дешёвая свободная ячейка, а при равенстве —
            минимальный номер, в свободной очереди приоритетов можно хранить
            пары <Notation>{"(price, cell_number)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chereduyushchiesya-cveta",
      navLabel: "Чередование цветов",
      explanation: (
        <>
          <Typography.Text>
            Коробки двух цветов, и в цепочке цвета соседних коробок должны
            различаться. Как найти самую длинную цепочку?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сделать два жадных прохода — с внешней коробкой каждого цвета — и
              взять лучший: на каждой глубине нужный цвет известен.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть коробки двух цветов, 0 и 1, вкладываются друг в друга с
            разницей сторон хотя бы 5, а цвета соседних коробок обязаны
            различаться. Если известно, какого цвета внешняя коробка, цвета всех
            следующих определены: 0, 1, 0, 1, … или 1, 0, 1, 0, … На каждой
            глубине нужна коробка известного цвета, и снова{" "}
            <strong>выгодно брать самую большую из подходящих</strong>: она
            оставляет больше места внутри.
          </Typography.Text>
          <Typography.Text>
            Программа делает оба прохода и берёт лучший:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "boxes = [(40, 0), (37, 1), (33, 1), (31, 0), (26, 0),\n         (24, 1), (20, 0), (18, 1), (12, 1)]\ngap = 5\nbest = (0, 0)\nfor first in (0, 1):\n    need, count, last = first, 0, None\n    for size, color in sorted(boxes, reverse=True):\n        if color != need:\n            continue\n        if last is None or last - size >= gap:\n            count += 1\n            last = size\n            need = 1 - need\n    best = max(best, (count, last))\nprint(*best)"
            }
            label={"Цепочка с чередованием цветов"}
            language="python"
            output={"4 18"}
          />
          <Typography.Text>
            Снаружи коробка цвета 0 даёт цепочку 40, 33, 26, 18; снаружи коробка
            цвета 1 — только три коробки. Кортеж{" "}
            <Notation>{"(count, last)"}</Notation> сравнивает сначала длину,
            затем самую маленькую коробку — оба критерия задачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rastushchiy-zazor",
      navLabel: "Растущий зазор",
      explanation: (
        <>
          <Typography.Text>
            А если зазор растёт с номером коробки и материалы чередуются?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Строить изнутри наружу, тоже двумя проходами — с каждым материалом
              первой коробки, — и брать каждый раз самую маленькую подходящую
              коробку.
            </strong>
          </Typography.Text>
          <Typography.Text>Пусть правило имеет вид:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Между k-й и (k + 1)-й коробкой нужен зазор хотя бы C + k,
              материалы должны различаться.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Нумерация идёт изнутри наружу, а второй критерий — наименьшая
            внешняя коробка. Если известно, из какого материала сделана первая
            коробка, материалы всех следующих определены. Программа делает оба
            прохода:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "boxes = [(10, 0), (11, 1), (13, 1), (14, 0), (17, 0),\n         (18, 1), (22, 1), (23, 0), (27, 0), (28, 1),\n         (33, 1)]\nbase_gap = 2\nboxes.sort()\nbest_count = 0\nbest_outer = None\nfor first_type in (0, 1):\n    expected_type = first_type\n    count = 0\n    last_size = None\n    for size, material in boxes:\n        if material != expected_type:\n            continue\n        gap = base_gap + count\n        if last_size is None or size - last_size >= gap:\n            count += 1\n            last_size = size\n            expected_type = 1 - expected_type\n    if count > best_count or (\n        count == best_count and last_size is not None\n        and (best_outer is None or last_size < best_outer)\n    ):\n        best_count = count\n        best_outer = last_size\nprint(best_count, best_outer)"
            }
            label={"Растущий зазор и два материала"}
            language="python"
            output={"5 33"}
          />
          <Typography.Text>
            Здесь <Notation>{"base_gap"}</Notation> соответствует C. Почему
            перед добавлением новой коробки используется{" "}
            <Notation>{"count"}</Notation>? Потому что уже выбрано{" "}
            <Notation>{"count"}</Notation> коробок: последняя из них имеет номер{" "}
            <Notation>{"count"}</Notation>, значит, следующий зазор должен быть
            не меньше C + count. Цепочка из материала 1 — 11, 14, 18, 23, 33:
            зазоры 3, 4, 5 и 10, а коробка 28 не подошла, потому что 28 − 23 = 5{" "}
            {"<"} 6.
          </Typography.Text>
          <Typography.Text>
            Почему жадность работает при фиксированном первом материале? На
            одной и той же позиции цепочки нужный материал одинаков, требуемая
            прибавка к следующей коробке одинакова, а меньшая текущая коробка
            оставляет не меньше возможностей продолжения.
          </Typography.Text>
          <Typography.Text>
            <strong>Но если бы материал влиял на другую характеристику</strong>,
            например на суммарную стоимость или ограниченный запас переходов,
            одного такого состояния могло бы не хватить. Утверждение проверено
            полным перебором всех цепочек на тысячах маленьких случайных
            наборов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naimenshee-chislo-blokov",
      navLabel: "Наименьшее число блоков",
      explanation: (
        <>
          <Typography.Text>
            Все коробки убирают на склад блоками вложенных друг в друга коробок.
            Сколько нужно блоков как минимум?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Столько, сколько коробок умещается в промежуток короче зазора: их
              никак нельзя вложить друг в друга. Это число находит окно.
            </strong>
          </Typography.Text>
          <Typography.Text>
            <strong>Блок</strong> занимает одну ячейку склада, одиночная коробка
            — тоже. Возьмём коробки 12, 14, 18, 21, 22, 27, 34, 40, 45 и зазор
            6.
          </Typography.Text>
          <Typography.Text>
            Коробки 18, 21 и 22 попарно отличаются меньше чем на 6 — ни одну из
            них нельзя вложить в другую. Значит,{" "}
            <strong>они лежат в трёх разных блоках</strong>, и меньше трёх
            блоков не бывает. Это оценка снизу, и её дают любые коробки, размеры
            которых умещаются в промежуток короче зазора. Наибольшее число таких
            коробок находит окно из этого урока: участок отсортированного
            списка, где <Notation>{"a[right] - a[left] < gap"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyBlocks6}
            caption={
              <>
                Коробки по возрастанию раскладываются в блоки: каждая ложится на
                блок, верхняя коробка которого меньше хотя бы на 6. Получилось
                три блока — столько же, сколько коробок 18, 21, 22 с разницей
                меньше 6.
              </>
            }
          />
          <Typography.Text>
            Жадная раскладка этой оценки достигает: идём по коробкам по
            возрастанию и кладём каждую на любой блок, верх которого меньше её
            хотя бы на зазор; если такого нет, начинаем новый блок.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "sizes = [12, 14, 18, 21, 22, 27, 34, 40, 45]\ngap = 6\nsizes.sort()\nblocks = []\nfor size in sizes:\n    placed = False\n    for block in blocks:\n        if size - block[-1] >= gap:\n            block.append(size)\n            placed = True\n            break\n    if not placed:\n        blocks.append([size])\nleft = widest = 0\nfor right in range(len(sizes)):\n    while sizes[right] - sizes[left] >= gap:\n        left += 1\n    widest = max(widest, right - left + 1)\nprint(len(blocks), widest)"
            }
            label={"Наименьшее число блоков"}
            language="python"
            output={"3 3"}
          />
          <Typography.Text>
            Флаг <Notation>{"placed"}</Notation> отмечает, нашёлся ли подходящий
            блок. Для ответа достаточно окна: раскладка нужна, только чтобы
            увидеть сами блоки. Наибольшее число коробок в одном блоке — это
            длина самой длинной цепочки из подтемы 3.
          </Typography.Text>
          <ProofDisclosure summary="Почему жадных блоков ровно столько, сколько коробок в самом широком окне">
            <Typography.Text>
              Пусть раскладка начала новый блок для коробки s. Значит, верх
              каждого уже начатого блока больше s − gap, а поскольку коробки
              идут по возрастанию, он не больше s. Верхние коробки всех блоков
              вместе с s умещаются в промежуток (s − gap, s] — короче зазора, и
              они различны как коробки. Их столько, сколько стало блоков.
              Значит, число блоков не больше наибольшего числа коробок с
              разницей меньше зазора, а меньше его быть не может — по оценке
              выше.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "luchshiy-nabor",
      navLabel: "Лучший набор",
      explanation: (
        <>
          <Typography.Text>
            При наибольшем количестве файлов нужен набор, где самый большой файл
            наибольший, при равенстве — второй и так далее. Как его построить?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Начать с самых маленьких и улучшать места сверху вниз: на каждое
              место ставить наибольший файл, который ещё помещается.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Это повторение приёма из подтемы 2 «Жадный выбор» для каждого места
            набора.
          </Typography.Text>
          <Typography.Text>
            Возьмём вместимость 62 и файлы 8, 12, 15, 19, 22, 34. Четыре самых
            маленьких занимают 54 — свободно 8, пятый не помещается. Сначала
            улучшаем самый большой элемент набора: вместо 19 можно взять любой
            файл не больше 19 + 8 = 27 — берём 22, свободно 5. Затем второй:
            вместо 15 — любой файл не больше 20 среди файлов между 15 и 22 — это
            19, свободно 1. Третий, 12, заменить нечем.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "sizes = sorted([8, 12, 15, 19, 22, 34])\ncapacity = 62\nused = k = 0\nfor x in sizes:\n    if used + x > capacity:\n        break\n    used += x\n    k += 1\nchosen = list(range(k))\nfree = capacity - used\nupper = len(sizes)\nfor j in range(k - 1, -1, -1):\n    best = chosen[j]\n    for i in range(chosen[j] + 1, upper):\n        if sizes[i] - sizes[chosen[j]] <= free:\n            best = i\n    free -= sizes[best] - sizes[chosen[j]]\n    chosen[j] = best\n    upper = best\nprint(*[sizes[i] for i in chosen])"
            }
            label={"Лучший набор заменами сверху вниз"}
            language="python"
            output={"8 12 19 22"}
          />
          <Typography.Text>
            <Notation>{"chosen"}</Notation> хранит индексы выбранных файлов,{" "}
            <Notation>{"upper"}</Notation> не даёт взять файл, уже занятый
            местом выше. Почему замены идут сверху вниз и каждый раз берут
            наибольший возможный файл? Самый большой элемент важнее всех
            остальных, а остальные пока самые маленькие — они оставляют ему
            наибольшее место; затем то же рассуждение повторяется для второго
            места при закреплённом первом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dop-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Подсчёт пар",
                note: <>два указателя, + (right − left)</>,
              },
              { key: "Все пары", note: <>перебор и проверка по множеству</> },
              { key: "Окно", note: <>правая граница идёт, левая догоняет</> },
              { key: "Куча", note: <>быстрый наименьший элемент</> },
              { key: "Чередование", note: <>два прохода — по цвету начала</> },
              {
                key: "Блоки",
                note: <>столько, сколько коробок в промежутке короче зазора</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Из списка <Notation>{"[5, 1, 4]"}</Notation> сделали кучу{" "}
          <Notation>{"heapify"}</Notation> и дважды вызвали{" "}
          <Notation>{"heappop"}</Notation>. Что вернули вызовы и что осталось в
          куче?
        </>
      ),
      reveal: (
        <>
          1 и 4, в куче осталось <Notation>{"[5]"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Коробки 10, 12, 15, 20, 21, зазор 5. Сколько блоков нужно как минимум?
        </>
      ),
      reveal: (
        <>
          Два: в промежуток короче 5 умещаются не больше двух коробок, например
          10 и 12. Блоки — 10, 15, 20 и 12, 21.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Числа 1, 3, 4, 10, 11, 13, D = 4. Сколько чисел можно выбрать, чтобы
          наибольшее и наименьшее отличались не больше чем на 4?
        </>
      ),
      reveal: <>3: например, 1, 3, 4 или 10, 11, 13.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Сколько пар с суммой не больше 14 в списке 2, 5, 8, 11?</>,
      reveal: <>4: (2, 5), (2, 8), (2, 11), (5, 8).</>,
    },
  ],
};

export default content;
