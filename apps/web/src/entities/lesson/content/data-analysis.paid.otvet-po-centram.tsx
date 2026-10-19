// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { DownloadLink } from "~/shared/components/download-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./data-analysis.paid.otvet-po-centram.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "vychislenie-otveta",
      navLabel: "Вычисление ответа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              После нахождения центров начинается отдельная часть задачи:
              вычисление ответа.
            </strong>{" "}
            Её легко недооценить. Даже идеально найденные центры не помогут,
            если затем усреднить не те координаты или посчитать расстояние между
            не теми объектами. Средние и минимумы координат центров нужны в 36
            задачах подборок, выбор наименьшего или наибольшего кластера и
            исключение кластера — в 20.
          </Typography.Text>
          <Typography.Text>
            Будем собирать ответ из центров кластеров. Функции{" "}
            <Notation>{"read_points"}</Notation> (подтема 2) и{" "}
            <Notation>{"center_sum"}</Notation> (подтема 4) считаем
            определёнными выше в программе; в конце соберём от файла до ответа
            пример <Notation>{"example27.txt"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "korotkaya-zapis",
      navLabel: "Короткая запись перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала познакомимся с короткой записью перебора, которая часто
              встречается в решениях.
            </strong>{" "}
            Запись <Notation>{"xs = [point[0] for point in centers]"}</Notation>{" "}
            означает: для каждой точки из <Notation>{"centers"}</Notation> взять
            первую координату и собрать результаты в список. Это{" "}
            <PythonTerm term="comp">списковое включение</PythonTerm> — короткая
            запись цикла с <Notation>{"append"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            А выражение{" "}
            <Notation>{"sum(point[0] for point in centers)"}</Notation>{" "}
            последовательно передаёт координаты функции{" "}
            <Notation>{"sum"}</Notation>, которая их складывает, — это{" "}
            <PythonTerm term="genexp">генераторное выражение</PythonTerm>. По
            такому же принципу работают <Notation>{"min"}</Notation> и{" "}
            <Notation>{"max"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "centers = [(-4, 10), (6, 2)]\n\nxs = [point[0] for point in centers]\nprint(xs)\nprint(sum(point[0] for point in centers))\nprint(min(point[0] for point in centers))\nprint(max(point[1] for point in centers))"
            }
            label={"По такому же принципу работают min и max"}
            language="python"
            output={"[-4, 6]\n2\n-4\n10"}
          />
          <Typography.Text>Теперь разберём основные варианты.</Typography.Text>
        </>
      ),
    },
    {
      id: "srednee-centrov",
      navLabel: "Среднее центров",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если нужно среднее арифметическое координат центров, каждый центр
              учитывается один раз.
            </strong>{" "}
            Пусть центры C₁ = (x₁; y₁), …, Cₖ = (xₖ; yₖ). Тогда Pₓ = (x₁ + … +
            xₖ) / k и P_y = (y₁ + … + yₖ) / k:
          </Typography.Text>
          <CodeBlock
            code={
              "px = sum(center[0] for center in centers) / len(centers)\npy = sum(center[1] for center in centers) / len(centers)\nprint(px, py)"
            }
            label={"Тогда Pₓ = (x₁ + … + xₖ) / k и P_y = (y₁ + … + yₖ) / k"}
            language="python"
            output={"1.0 6.0"}
          />
          <Typography.Text>
            Если один кластер содержит 100 точек, а другой — 5000, их центры всё
            равно имеют одинаковый вес, когда условие требует именно среднее{" "}
            <strong>центров</strong>. Не нужно усреднять все точки файла или
            дополнительно умножать координаты центра на размер его кластера.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "minimalnye-koordinaty",
      navLabel: "Минимальные координаты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если нужны минимальные координаты центров, минимумы ищутся
              независимо.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "px = min(center[0] for center in centers)\npy = min(center[1] for center in centers)\nprint(px, py)"
            }
            label={
              "Если нужны минимальные координаты центров, минимумы ищутся независимо"
            }
            language="python"
            output={"-4 2"}
          />
          <Typography.Text>
            Для центров (−4; 10) и (6; 2) минимальная абсцисса −4, минимальная
            ордината 2, пара результата — (−4; 2). Она не совпадает ни с одним
            центром. Это нормально: условие просит две отдельные характеристики.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "malenkiy-i-bolshoy",
      navLabel: "Маленький и большой кластер",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если нужно сравнить самый маленький и самый большой кластеры,
              сначала сохраняем связь между кластером и его центром.
            </strong>{" "}
            Удобно упорядочить кластеры по числу точек:{" "}
            <Notation>{"clusters = sorted(clusters, key=len)"}</Notation>.{" "}
            <Notation>{"sorted"}</Notation> создаёт новый упорядоченный список.{" "}
            <PythonTerm term="sortkey">
              <Notation>{"key=len"}</Notation>
            </PythonTerm>{" "}
            означает: сравнивать элементы по их длинам. Поскольку каждый элемент
            — кластер, его длина равна числу точек.
          </Typography.Text>
          <Typography.Text>
            Обрати внимание: передаётся сама функция{" "}
            <Notation>{"len"}</Notation>, без скобок. Мы сообщаем, каким
            способом получать величину для сравнения.
          </Typography.Text>
          <Typography.Text>
            Теперь <Notation>{"clusters[0]"}</Notation> — самый маленький,{" "}
            <Notation>{"clusters[-1]"}</Notation> — самый большой: индекс{" "}
            <Notation>{"-1"}</Notation> означает последний элемент. После этого
            найдём центры в том же порядке. Возьмём кластеры файла{" "}
            <Notation>{"example27.txt"}</Notation> — левый из пяти точек и
            правый из трёх:
          </Typography.Text>
          <CodeBlock
            code={
              "clusters = [\n    [(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)],\n    [(10, 0), (12, 0), (11, 1)]\n]\nclusters = sorted(clusters, key=len)\n\ncenters = []\n\nfor cluster in clusters:\n    centers.append(center_sum(cluster))\n\nprint([len(c) for c in clusters], centers)\nprint(dist(centers[0], centers[-1]))"
            }
            label={
              "Возьмём кластеры файла example27.txt — левый из пяти точек и правый из трёх"
            }
            language="python"
            output={"[3, 5] [(11, 1), (1, 1)]\n10.0"}
          />
          <Typography.Text>
            Последняя строка — расстояние между центрами самого маленького и
            самого большого кластеров. Если центры были вычислены до сортировки
            кластеров, а затем переставили только кластеры, соответствие может
            нарушиться. Также нужно проверить, гарантирует ли условие
            однозначность выбора при одинаковых размерах.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obekty-nuzhnogo-vida",
      navLabel: "Объекты нужного вида",
      explanation: (
        <>
          <Typography.Text>
            <strong>Кластер выбирают и по числу объектов нужного вида.</strong>{" "}
            В обеих задачах основной волны ЕГЭ-2026 нужен кластер, где больше
            всего или меньше всего звёзд определённого вида. Если кластер
            выбирается по количеству объектов некоторого вида, это не то же
            самое, что выбор по общему количеству точек.
          </Typography.Text>
          <Typography.Text>
            Ключом сортировки может быть и своя функция: она получает кластер и
            возвращает число, по которому его сравнивают. Разделим звёзды файла{" "}
            <Notation>{"27-3.txt"}</Notation> по границам из подтемы 3 и
            посчитаем в каждом кластере красных гигантов. Функции{" "}
            <Notation>{"read_stars"}</Notation> и{" "}
            <Notation>{"parse_kind"}</Notation> — из подтемы 2.
          </Typography.Text>
          <CodeBlock
            code={
              'def split_stars(stars):\n    clusters = [[], [], []]\n\n    for s in stars:\n        if s[1] < 5:\n            clusters[0].append(s)\n        elif s[0] < 10:\n            clusters[1].append(s)\n        else:\n            clusters[2].append(s)\n\n    return clusters\n\n\ndef red_giants(cluster):\n    count = 0\n\n    for s in cluster:\n        cls, sub, lum = parse_kind(s[2])\n        if cls == "M" and lum == "III":\n            count += 1\n\n    return count'
            }
            label={"Функции read_stars и parse_kind — из подтемы 2"}
            language="python"
          />
          <CodeBlock
            code={
              'clusters = split_stars(read_stars("27-3.txt"))\nprint([len(c) for c in clusters])\nprint([red_giants(c) for c in clusters])\n\nby_red = sorted(clusters, key=red_giants)\nprint(len(by_red[0]), len(by_red[-1]))'
            }
            label={"Функции read_stars и parse_kind — из подтемы 2"}
            language="python"
            output={"[231, 198, 172]\n[11, 17, 9]\n172 198"}
          />
          <Typography.Text>
            Меньше всего красных гигантов (9) — в кластере из 172 звёзд, больше
            всего (17) — в кластере из 198 звёзд, хотя самый большой кластер —
            из 231. Кластеризацию по расположению, поиск центра и последующий
            подсчёт объектов определённого типа нужно выполнять в том порядке,
            который задан условием.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "isklyuchenie-klasterov",
      navLabel: "Исключение кластеров",
      explanation: (
        <>
          <Typography.Text>
            <strong>Теперь об исключении целых кластеров.</strong> Если условие
            требует удалить самый маленький кластер, это отдельное действие
            после правильного разделения. При гарантии единственности самого
            маленького:
          </Typography.Text>
          <CodeBlock
            code={
              "clusters = sorted(clusters, key=len)\nclusters = clusters[1:]"
            }
            label={"При гарантии единственности самого маленького"}
            language="python"
          />
          <Typography.Text>
            Срез <Notation>{"[1:]"}</Notation> берёт все элементы, начиная со
            второго. После исключения вычисляем нужные характеристики оставшихся
            кластеров. Если требуется удалить самый большой —{" "}
            <Notation>{"clusters = clusters[:-1]"}</Notation>: срез{" "}
            <Notation>{"[:-1]"}</Notation> берёт все элементы, кроме последнего.
          </Typography.Text>
          <Typography.Text>Важно не спутать:</Typography.Text>
          <ul>
            <li>удалить один кластер с минимальным размером;</li>
            <li>удалить все кластеры минимального размера;</li>
            <li>
              удалить все кластеры, в которых меньше заданного числа точек.
            </li>
          </ul>
          <Typography.Text>
            Это разные правила. И после удаления нужно делить среднее на{" "}
            <strong>новое</strong> количество кластеров —{" "}
            <Notation>{"average_radius = sum(radii) / len(radii)"}</Notation>, а
            не на исходное число групп.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "masshtabirovanie",
      navLabel: "Масштабирование",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Последний этап — масштабирование и получение целого числа.
            </strong>{" "}
            Пусть по условию нужно вывести целую часть произведения результата
            на 10 000. Для неотрицательного <Notation>{"value"}</Notation> ответ
            — <Notation>{"int(value * 10000)"}</Notation>. Например, value =
            2,718281, value · 10000 = 27182,81, ответ 27182.
          </Typography.Text>
          <Typography.Text>
            Здесь нельзя заменять <Notation>{"int"}</Notation> на{" "}
            <Notation>{"round"}</Notation>.{" "}
            <strong>
              При отрицательных значениях нужно понимать поведение Python:
            </strong>{" "}
            <Notation>{"int"}</Notation> отбрасывает дробную часть в направлении
            нуля, а округление вниз <Notation>{"floor"}</Notation> даёт другое
            число:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import floor\n\nprint(int(2.718281 * 10000))\nprint(int(2.9), round(2.9))\nprint(int(-2.9), floor(-2.9))"
            }
            label={"Код на Python: from math import floor"}
            language="python"
            output={"27182\n2 3\n-2 -3"}
          />
          <Typography.Text>
            На числовой оси разница видна наглядно:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clTruncLine}
            caption={
              <>
                Для 2,9 int и floor совпадают — обе дают 2, round даёт 3. Для
                −2,9 int идёт к нулю (−2), а floor и round — к −3.
              </>
            }
          />
          <Typography.Text>
            Поведение <Notation>{"int"}</Notation> прямо описано в документации
            Python. Если условие допускает отрицательный итог, нужно внимательно
            различать отбрасывание дробной части и требование округления вниз.
          </Typography.Text>
          <Typography.Text>
            Если требуется модуль —{" "}
            <Notation>{"int(abs(value) * 10000)"}</Notation>. Но модуль нужно
            брать <strong>именно на том шаге, который указан в условии</strong>.
          </Typography.Text>
          <Typography.Text>
            Например, абсциссы центров −6 и 4. Модуль среднего: |(−6 + 4) / 2| =
            1. Среднее модулей: (|−6| + |4|) / 2 = 5. Это разные ответы.
          </Typography.Text>
          <Typography.Text>
            Аналогично <Notation>{"abs(min(values))"}</Notation> и{" "}
            <Notation>{"min(abs(value) for value in values)"}</Notation>{" "}
            неравнозначны:
          </Typography.Text>
          <CodeBlock
            code={
              "values = [-8, 3]\nprint(abs(min(values)), min(abs(v) for v in values))"
            }
            label={
              "Аналогично abs(min(values)) и min(abs(value) for value in values) неравнозначны"
            }
            language="python"
            output={"8 3"}
          />
          <Typography.Text>
            Также не нужно округлять каждый центр перед усреднением. Сначала
            выполняются требуемые вычисления с исходными координатами, затем
            преобразуется конечный результат. Множитель тоже нельзя заучивать: в
            конкретной задаче могут требоваться 100, 1000, 10 000 или разные
            множители для разных величин.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "float",
      navLabel: "Дробные числа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              У дробных вычислений есть ещё одна особенность:{" "}
              <Notation>{"float"}</Notation> хранит многие десятичные числа
              приближённо.
            </strong>{" "}
            Например, математически целое произведение иногда может оказаться в
            памяти чуть меньше или чуть больше целого. Поэтому полезно помнить:
          </Typography.Text>
          <ul>
            <li>не округлять координаты заранее;</li>
            <li>
              не добавлять произвольное <Notation>{"0.0001"}</Notation> «для
              надёжности»;
            </li>
            <li>
              при подозрительно близком к целому итоговом значении проверить
              вычисления с большей точностью;
            </li>
            <li>
              при почти равных суммах кандидатов отдельно проверить,
              действительно ли их различие устойчиво.
            </li>
          </ul>
          <Typography.Text>
            Функция <Notation>{"math.fsum"}</Notation> может уменьшить ошибку
            суммирования:{" "}
            <Notation>
              {"total = fsum(dist(candidate, point) for point in cluster)"}
            </Notation>
            . Но это{" "}
            <strong>
              не превращает все вычисления с <Notation>{"float"}</Notation> в
              абсолютно точные
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Для обычного первоначального решения достаточно понять алгоритм и
            использовать исходные значения без лишнего округления. Повышенную
            точность имеет смысл подключать при конкретном обнаруженном
            пограничном случае.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "polnyy-primer",
      navLabel: "Полный пример",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Соберём полноценный небольшой пример от файла до ответа.
            </strong>{" "}
            Файл <Notation>{"example27.txt"}</Notation> содержит:
          </Typography.Text>
          <CodeBlock
            code={"X Y\n0 0\n0 2\n1 1\n2 0\n2 2\n10 0\n12 0\n11 1"}
            label={"Строки файла example27.txt"}
            language="text"
            fileName="example27.txt"
          />
          <Typography.Text>Условие нашего учебного примера:</Typography.Text>
          <ul>
            <li>точки образуют два кластера;</li>
            <li>
              первый расположен левее <Notation>{"x = 5"}</Notation>, второй —
              правее;
            </li>
            <li>центр — исходная точка с минимальной суммой расстояний;</li>
            <li>нужно найти средние координаты двух центров;</li>
            <li>вывести целые части этих средних, умноженных на 10 000.</li>
          </ul>
          <Typography.Text>Полная программа:</Typography.Text>
          <CodeBlock
            code={
              'from math import dist\n\n\ndef read_points(filename):\n    points = []\n\n    with open(filename, encoding="utf-8-sig") as f:\n        f.readline()  # В нашем файле есть заголовок X Y\n\n        for line in f:\n            if not line.strip():\n                continue\n\n            sx, sy = line.replace(",", ".").split()\n\n            x = float(sx)\n            y = float(sy)\n\n            points.append((x, y))\n\n    return points\n\n\ndef center_sum(cluster):\n    best_point = cluster[0]\n    best_sum = float("inf")\n\n    for candidate in cluster:\n        total = 0.0\n\n        for point in cluster:\n            total += dist(candidate, point)\n\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n\n    return best_point\n\n\npoints = read_points("example27.txt")\n\nclusters = [[], []]\n\nfor point in points:\n    x, y = point\n\n    if x < 5:\n        clusters[0].append(point)\n    else:\n        clusters[1].append(point)\n\ncenters = []\n\nfor cluster in clusters:\n    centers.append(center_sum(cluster))\n\nsum_x = 0.0\nsum_y = 0.0\n\nfor x, y in centers:\n    sum_x += x\n    sum_y += y\n\npx = sum_x / len(centers)\npy = sum_y / len(centers)\n\nprint(int(px * 10000), int(py * 10000))'
            }
            label={"Полная программа"}
            language="python"
            output={"60000 10000"}
          />
          <Typography.Text>
            Центры кластеров — (1; 1) и (11; 1), их средние координаты Pₓ = (1 +
            11) / 2 = 6 и P_y = (1 + 1) / 2 = 1, отсюда 60000 и 10000. Значение{" "}
            <Notation>{"5"}</Notation> в этом примере подходит{" "}
            <strong>именно этому файлу</strong>.
          </Typography.Text>
          <ProofDisclosure summary="Ручная проверка центров">
            <Typography.Text>
              Первый кластер — <Notation>{"(0, 0)"}</Notation>,{" "}
              <Notation>{"(0, 2)"}</Notation>, <Notation>{"(1, 1)"}</Notation>,{" "}
              <Notation>{"(2, 0)"}</Notation>, <Notation>{"(2, 2)"}</Notation>.
              Его центр — (1; 1). Расстояния от него до четырёх углов одинаковы
              и равны √2: S = 4√2 ≈ 5,657. Для любого угла сумма 2 + 2 + 2√2 +
              √2 = 4 + 3√2 ≈ 8,243. Значит, <Notation>{"(1, 1)"}</Notation>{" "}
              действительно лучше.
            </Typography.Text>
            <Typography.Text>
              Второй кластер — <Notation>{"(10, 0)"}</Notation>,{" "}
              <Notation>{"(12, 0)"}</Notation>, <Notation>{"(11, 1)"}</Notation>
              . Для <Notation>{"(11, 1)"}</Notation>: S = √2 + √2 = 2√2. Для
              каждой из двух других точек: S = 2 + √2. Поскольку 2√2 {"<"} 2 +
              √2, центр второго кластера — (11; 1).
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "otvet-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Среднее, минимум и максимум по центрам —{" "}
                    <Notation>{"sum"}</Notation>, <Notation>{"min"}</Notation>,{" "}
                    <Notation>{"max"}</Notation> от генераторного выражения;
                    каждый центр учитывается один раз.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Минимальные координаты ищутся независимо; пара минимумов не
                    обязана быть центром.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"sorted(clusters, key=len)"}</Notation>{" "}
                    упорядочивает кластеры по размеру; центры ищут после
                    сортировки, чтобы не потерять соответствие. Ключом может
                    быть и своя функция — число объектов нужного вида.
                  </>
                ),
              },
              {
                note: <>После исключения кластера делят на новое количество.</>,
              },
              {
                note: (
                  <>
                    <Notation>{"int(value * 10000)"}</Notation> — целая часть;{" "}
                    <Notation>{"round"}</Notation> и{" "}
                    <Notation>{"floor"}</Notation> дают другое; модуль берут на
                    том шаге, который указан в условии.
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
      id: "zadacha-4",
      prompt: (
        <>
          Что дают <Notation>{"int(-2.718281 * 10000)"}</Notation>,{" "}
          <Notation>{"floor(-2.718281 * 10000)"}</Notation> и{" "}
          <Notation>{"int(abs(-2.718281) * 10000)"}</Notation>?
        </>
      ),
      reveal: (
        <>−27182 (отбрасывание к нулю), −27183 (округление вниз) и 27182.</>
      ),
    },
    {
      id: "zadacha-6",
      prompt: (
        <>
          Сколько жёлтых карликов (класс <Notation>{"G"}</Notation>, светимость{" "}
          <Notation>{"V"}</Notation>) в каждом кластере файла{" "}
          <DownloadLink
            presentation="inline"
            href="/api/tasks/task-27-2-05/files/statement-1"
          >
            27-3.txt
          </DownloadLink>
          ? Сколько всего звёзд в кластере, где жёлтых карликов больше всего?
        </>
      ),
      reveal: <>14, 13 и 11; больше всего — в нижнем кластере из 231 звезды.</>,
    },
  ],
};

export default content;
