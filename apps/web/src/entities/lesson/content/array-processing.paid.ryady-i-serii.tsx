// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./array-processing.paid.ryady-i-serii.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "mnozhestva-i-slovari",
      navLabel: "Позиции по рядам",
      explanation: (
        <>
          <Typography.Text>
            В строках файла — номер ряда и номер занятого места, вперемешку. Как
            узнать, что происходит в каждом ряду?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разложить позиции по рядам в словарь «ряд → множество мест», а
              потом в каждом ряду отсортировать места и смотреть на соседние.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Ключ <PythonTerm term="dict">словаря</PythonTerm> — номер ряда, а
            позиции удобно хранить{" "}
            <PythonTerm term="set">множеством</PythonTerm>: оно хранит только
            различные значения.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "data = [(5, 3), (9, 13), (5, 2), (5, 8),\n        (9, 10), (5, 4), (9, 20), (5, 3)]\nrows = {}\nfor row, position in data:\n    if row not in rows:\n        rows[row] = set()\n    rows[row].add(position)\nfor row in sorted(rows):\n    print(row, sorted(rows[row]))"
            }
            label={"Позиции по рядам"}
            language="python"
            output={"5 [2, 3, 4, 8]\n9 [10, 13, 20]"}
          />
          <Typography.Text>
            <Notation>{"if row not in rows"}</Notation> проверяет, встречался ли
            такой ряд; <Notation>{"rows[row] = set()"}</Notation> создаёт для
            нового ряда пустое множество,{" "}
            <Notation>{"rows[row].add(position)"}</Notation> добавляет позицию.
            Повторное попадание <Notation>{"(5, 3)"}</Notation> новой позиции не
            создало.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Повторы можно удалять только тогда, когда они не влияют на смысл
              задачи.
            </strong>{" "}
            Выбери, какие данные повторяются:
          </Typography.Text>
          <VariantPicker
            label={"Данные → можно ли удалить одинаковые значения"}
            variants={[
              {
                label: "несколько попаданий в одну светящуюся точку",
                value: <>да, если важен только факт свечения</>,
              },
              {
                label: "несколько записей об одном занятом месте",
                value: <>да, если это повторные сведения</>,
              },
              {
                label: "два файла одинакового размера",
                value: <>нет, это два файла</>,
              },
              {
                label: "два товара одинаковой цены",
                value: <>нет, это два товара</>,
              },
              {
                label: "несколько заявок на один объект",
                value: <>зависит от того, нужны ли ID и число заявок</>,
              },
            ]}
          />
          <Typography.Text>
            Если для одинаковой позиции нужно сохранить, например, минимальный
            номер заявки, одного множества недостаточно. Нужно хранить
            соответствие «позиция → минимальный ID заявки» — тоже словарём.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "svobodnye-mesta",
      navLabel: "Свободные места",
      explanation: (
        <>
          <Typography.Text>
            В ряду заняты места 4, 7, 12, 16. Где есть ровно два свободных места
            подряд между занятыми?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Между соседними занятыми местами a и b свободно b − a − 1 мест:
              ровно два — там, где b − a = 3.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Между местами 4 и 7 свободны 5 и 6: сами занятые места в промежуток
            не входят.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyRow18_ea6afc}
            caption={
              <>
                Между занятыми 4 и 7 — два свободных места, между 7 и 12 —
                четыре, между 12 и 16 — три. Ровно два свободных места даёт
                разность 3.
              </>
            }
          />
          <Typography.Text>
            Соседними здесь называются соседние элементы{" "}
            <strong>отсортированного списка занятых мест</strong>, а не соседние
            строки файла.
          </Typography.Text>
          <Typography.Text>
            Для условия «выбрать максимальный номер ряда, а внутри него
            минимальный номер подходящего свободного места» можно сразу задать
            нужный порядок просмотра: ряды по убыванию, места по возрастанию.
            Тогда подходит первое найденное решение:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "data = [(5, 4), (8, 11), (5, 12), (8, 3),\n        (5, 7), (8, 8), (5, 16)]\nplaces = sorted(set(data), key=lambda x: (-x[0], x[1]))\nanswer = None\nfor i in range(len(places) - 1):\n    row1, seat1 = places[i]\n    row2, seat2 = places[i + 1]\n    if row1 == row2 and seat2 - seat1 == 3:\n        answer = (row1, seat1 + 1)\n        break\nprint(*answer)"
            }
            label={"Ряд с наибольшим номером и ровно два свободных места"}
            language="python"
            output={"8 9"}
          />
          <Typography.Text>
            Сама сортировка уже учитывает приоритеты ответа. Проверка{" "}
            <Notation>{"row1 == row2"}</Notation> обязательна: соседние записи
            списка могут относиться к разным рядам. Выводим{" "}
            <Notation>{"seat1 + 1"}</Notation>, потому что{" "}
            <Notation>{"seat1"}</Notation> — занятое место, а нужно первое
            свободное после него. В ряду 5 тоже есть пара 4 и 7, но ряд 8 больше
            и просматривается раньше.
          </Typography.Text>
          <Typography.Text>
            Различай условия — выбери формулировку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка → проверка соседних занятых a < b"}
            variants={[
              {
                label: "ровно два свободных, с обеих сторон занятые",
                value: (
                  <>
                    <Notation>{"b - a == 3"}</Notation>
                  </>
                ),
              },
              {
                label: "не менее двух свободных между занятыми",
                value: (
                  <>
                    <Notation>{"b - a >= 3"}</Notation>
                  </>
                ),
              },
              {
                label: "любые два соседних свободных места",
                value: <>подходят и части длинного промежутка, и края ряда</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "stolbcy",
      navLabel: "Столбцы",
      explanation: (
        <>
          <Typography.Text>
            «Перед креслом свободны все кресла с тем же номером» — как искать,
            если важны не места в ряду, а один номер кресла во всех рядах?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Собрать столбец: ключом словаря служит номер кресла, а значениями
              — номера рядов. Дальше всё как с местами в ряду.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Так же решается и «перед ним как можно больше свободных кресел
            подряд». Ряды нумеруются от сцены, поэтому «перед» значит «в рядах с
            меньшими номерами».
          </Typography.Text>
          <Typography.Text>
            Пусть в зале 10 рядов, а кресло номер 5 занято в рядах 3 и 7.
            Свободные участки столбца — ряды 1–2, 4–6 и 8–10. Перед креслом в
            конце участка свободны все остальные кресла участка: в ряду 6 перед
            ним свободны ряды 4 и 5. Чтобы не обрабатывать отдельно последний
            участок, после всех занятых рядов добавляют{" "}
            <strong>условный занятый ряд M + 1</strong>, а до них считают
            занятым ряд 0:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyColumn10}
            caption={
              <>
                Столбец кресла номер 5 в зале из 10 рядов, сцена слева; заняты
                ряды 3 и 7. В конце каждого свободного участка — кресло, перед
                которым свободен весь остальной участок: в ряду 6 перед ним два
                свободных кресла, в ряду 10 тоже два, но ряд 6 ближе к сцене.
              </>
            }
          />
          <CodeBlock
            collapsible={false}
            code={
              "m = 10\ncolumn = [3, 7]\nbest = None\nprev = 0\nfor occupied in sorted(column) + [m + 1]:\n    if occupied - prev >= 2:\n        free_before = occupied - prev - 2\n        seat_row = occupied - 1\n        if best is None or free_before > best[0]:\n            best = (free_before, seat_row)\n    prev = occupied\nprint(*best)"
            }
            label={"Свободные кресла перед местом"}
            language="python"
            output={"2 6"}
          />
          <Typography.Text>
            Участок от <Notation>{"prev + 1"}</Notation> до{" "}
            <Notation>{"occupied − 1"}</Notation> содержит{" "}
            <Notation>{"occupied − prev − 1"}</Notation> свободных кресел, а
            перед последним из них — на одно меньше. Строгое сравнение{" "}
            <Notation>{">"}</Notation> оставляет ряд ближе к сцене при
            равенстве: участок 8–10 тоже даёт 2, но ряд 10 дальше. Совсем пустой
            столбец даёт M − 1 свободных кресел перед последним рядом — его
            нельзя пропустить, хотя в файле этого номера нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "serii",
      navLabel: "Серии",
      explanation: (
        <>
          <Typography.Text>
            Отмечены позиции 2, 3, 4, 8, 9, 10, 11, 20. Как найти самую длинную
            непрерывную серию?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Идти по отсортированным позициям со счётчиком серии: следующая
              позиция на 1 больше — серия растёт, иначе начинается заново с 1.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Здесь три непрерывные серии — 2–4, 8–11 и 20 — длиной 3, 4 и 1.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyRow21_203564}
            caption={
              <>
                Отмеченные позиции 2, 3, 4, 8, 9, 10, 11, 20 образуют три серии
                длиной 3, 4 и 1; серия обрывается там, где следующая позиция
                больше предыдущей больше чем на 1.
              </>
            }
          />
          <Typography.Text>Код для максимальной длины серии:</Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "positions = sorted(set([10, 2, 3, 4, 8, 9, 11, 20, 3]))\ncurrent = 0\nbest = 0\nprevious = None\nfor position in positions:\n    if previous is not None and position == previous + 1:\n        current += 1\n    else:\n        current = 1\n    if current > best:\n        best = current\n    previous = position\nprint(best)"
            }
            label={"Самая длинная серия"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Почему при разрыве <Notation>{"current = 1"}</Notation>? Потому что
            текущая позиция уже начинает новую серию. Повтор позиции 3 убран
            множеством: дважды светящаяся точка — одна точка.
          </Typography.Text>
          <Typography.Text>
            Если нужно{" "}
            <strong>
              количество максимальных непрерывных серий длиной не менее трёх
            </strong>
            , серию учитывают в момент разрыва — и ещё раз после цикла. Пройди
            программу по шагам на позициях, где последняя серия заканчивает ряд:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runLines}
            collapsible={false}
            label={"Серии длиной от трёх: шаг за шагом"}
          />
          <Typography.Text>
            <strong>Последняя проверка после цикла обязательна.</strong> Серия
            обычно учитывается при появлении разрыва, а после последнего
            элемента нового значения уже нет — завершающего разрыва программа не
            увидит, и единственная линия 8, 9, 10 потерялась бы: программа
            вывела бы 0. В подборке есть именно такие задачи о линиях,
            ограниченных тёмными точками или краем экрана: длинная непрерывная
            серия считается одной линией.
          </Typography.Text>
          <Typography.Text>
            Одна и та же серия 10, 11, 12, 13, 14 даёт разные ответы в
            зависимости от вопроса — выбери вопрос:
          </Typography.Text>
          <VariantPicker
            label={"Что считаем в серии 10, 11, 12, 13, 14"}
            variants={[
              { label: "максимальную длину серии", value: <>5</> },
              {
                label: "максимальные непрерывные серии длиной ≥ 3",
                value: <>1</>,
              },
              {
                label: "все последовательные тройки внутри неё",
                value: <>3</>,
                note: <>10 11 12, 11 12 13, 12 13 14</>,
              },
            ]}
          />
          <Typography.Text>
            Для сравнения результатов по рядам два приоритета записывают явно:
            больше линий, а при равенстве больше номер ряда —{" "}
            <Notation>
              {
                "line_count > best_count or (line_count == best_count and row > best_row)"
              }
            </Notation>
            . То же самое делает сравнение кортежей{" "}
            <Notation>{"(line_count, row) > (best_count, best_row)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "liniya-s-promezhutkom",
      navLabel: "Линия с промежутком",
      explanation: (
        <>
          <Typography.Text>
            А если внутри линии разрешены тёмные точки — не больше k подряд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Это та же серия, только продолжается она, пока промежуток между
              соседними светлыми точками не больше k.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Длина такой линии — количество всех её точек, светлых и тёмных.
            Тогда новая позиция продолжает серию, если{" "}
            <Notation>{"position - previous <= k + 1"}</Notation>: между ними{" "}
            <Notation>{"position − previous − 1 ≤ k"}</Notation> тёмных точек.
            Длина линии — <strong>последняя позиция − первая + 1</strong>, а не
            число отмеченных позиций.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "positions = [2, 3, 7, 8, 15]\nk = 3\nbest = 0\nfirst = previous = None\nfor position in positions:\n    if previous is None or position - previous > k + 1:\n        first = position\n    best = max(best, position - first + 1)\n    previous = position\nprint(best)"
            }
            label={"Линия с промежутком до k"}
            language="python"
            output={"7"}
          />
          <Typography.Text>
            Между 3 и 7 три тёмные точки — допустимо, линия идёт от 2 до 8 и
            содержит 7 точек. Между 8 и 15 тёмных шесть, поэтому 15 начинает
            новую линию.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "izolirovannaya-tochka",
      navLabel: "Изолированная точка",
      explanation: (
        <>
          <Typography.Text>
            Как найти светлые точки, у которых все другие светлые точки ряда
            дальше чем на D?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Достаточно проверить двух ближайших соседей в отсортированном
              ряду: если и они дальше D, остальные — тем более.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для позиции с индексом <Notation>{"i"}</Notation> отсортированного
            списка:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "positions = [2, 3, 10, 20, 24]\ndistance = 4\ncount = 0\nfor i in range(len(positions)):\n    left_ok = (i == 0\n               or positions[i] - positions[i - 1] > distance)\n    right_ok = (i == len(positions) - 1\n                or positions[i + 1] - positions[i] > distance)\n    if left_ok and right_ok:\n        count += 1\nprint(count)"
            }
            label={"Изолированные точки"}
            language="python"
            output={"1"}
          />
          <Typography.Text>
            Изолирована только точка 10. У точки 20 сосед 24 на расстоянии ровно
            4 — «дальше чем на 4» не выполнено. Проверки{" "}
            <Notation>{"i == 0"}</Notation> и{" "}
            <Notation>{"i == len(positions) - 1"}</Notation> стоят первыми: у
            крайних точек соседа с одной стороны нет, и короткое вычисление{" "}
            <Notation>{"or"}</Notation> не обращается к несуществующему индексу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nakoplenie-po-klyuchu",
      navLabel: "Накопление по ключу",
      explanation: (
        <>
          <Typography.Text>
            Нужен лидер продаж: по каждому артикулу — сколько продано и сколько
            осталось. Как собрать эти числа?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Накапливать суммы и количества в словаре по ключу-артикулу, а
              лучший ключ выбирать кортежем приоритетов.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, по каждому товару известны артикул, цена и статус: 0 —
            продан, 1 — ещё в магазине. Дорогими считаются товары дороже средней
            цены всех товаров. Нужно найти лидера продаж среди дорогих
            артикулов: больше всего проданных единиц, при равенстве — дороже,
            затем — меньше осталось. Количества по артикулу считают через{" "}
            <PythonTerm term="dictget">
              <Notation>{"get"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "items = [(101, 500, 0), (101, 500, 0), (101, 500, 1),\n         (205, 900, 0), (205, 900, 1), (205, 900, 1),\n         (307, 120, 0), (307, 120, 0), (307, 120, 0),\n         (412, 700, 0), (412, 700, 0), (412, 700, 1)]\naverage = sum(p for _, p, _ in items) / len(items)\nsold, left, price = {}, {}, {}\nfor art, p, status in items:\n    price[art] = p\n    if status == 0:\n        sold[art] = sold.get(art, 0) + 1\n    else:\n        left[art] = left.get(art, 0) + 1\nbest = max((sold.get(a, 0), price[a], -left.get(a, 0), a)\n           for a in price if price[a] > average)\nprint(best[3], best[0] * best[1], -best[2])"
            }
            label={"Лидер продаж среди дорогих артикулов"}
            language="python"
            output={"412 1400 1"}
          />
          <Typography.Text>
            Средняя цена 555, дорогих артикулов два: 205 и 412. У 412 продано
            больше — 2 единицы на 1400 рублей, осталась одна. Артикул 307 продан
            трижды, но он дешёвый и в выбор не входит. Кортеж{" "}
            <Notation>{"(продано, цена, −осталось, артикул)"}</Notation>{" "}
            записывает приоритеты так же, как ключ сортировки в рейтинге: минус
            у «меньше осталось».
          </Typography.Text>
          <Typography.Text>
            Так же решаются задачи о домах и подъездах: словарь «дом → (подъезд
            → номер заявки)» хранит для каждого подъезда наибольший или
            наименьший номер заявки, а самая длинная серия подряд идущих
            подъездов ищется счётчиком серии.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ryady-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "По рядам", note: <>словарь «ряд → множество позиций»</> },
              {
                key: "Свободные места",
                note: <>между a и b свободно b − a − 1</>,
              },
              {
                key: "Столбец",
                note: <>ключ — номер кресла, значения — ряды</>,
              },
              {
                key: "Серия",
                note: (
                  <>+1 — продолжение, иначе заново; после цикла — ещё раз</>
                ),
              },
              {
                key: "Изолированная точка",
                note: <>проверить двух ближайших соседей</>,
              },
              {
                key: "По ключу",
                note: <>суммы в словаре, лучший — кортежем приоритетов</>,
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
          В ряду заняты места 3, 9, 13, 14, 20. Сколько свободных мест между
          каждыми соседними занятыми и какие места образуют промежуток ровно из
          трёх свободных?
        </>
      ),
      reveal: (
        <>
          5, 3, 0 и 5 свободных; ровно три свободных — места 10, 11, 12 между 9
          и 13.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Артикулы из примера урока, но средняя цена считается без проданных
          товаров. Изменится ли лидер продаж?
        </>
      ),
      reveal: (
        <>
          Изменится: средняя цена непроданных (500, 900, 900, 700) равна 750,
          дорогим остаётся только артикул 205. Лидер — 205: выручка 900,
          осталось 2.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Отмечены позиции 5, 6, 7, 10, 11, 15. Сколько непрерывных серий и
          какая самая длинная?
        </>
      ),
      reveal: (
        <>Три серии: 5–7, 10–11 и 15. Самая длинная — 5, 6, 7, длина 3.</>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Светлые точки ряда — 4, 9, 12, 20, D = 3. Какие точки изолированы, то
          есть все остальные дальше чем на 3?
        </>
      ),
      reveal: (
        <>
          4 и 20. У 9 и 12 расстояние ровно 3 — «дальше чем на 3» не выполнено.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Кресло номер 5 занято в рядах 2 и 6 зала из 8 рядов. Перед каким
          креслом этого номера больше всего свободных кресел подряд?
        </>
      ),
      reveal: (
        <>
          В ряду 5: перед ним свободны ряды 3 и 4. В ряду 8 перед ним свободен
          только ряд 7.
        </>
      ),
    },
  ],
};

export default content;
