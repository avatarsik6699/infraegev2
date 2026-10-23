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
      id: "srednee-centrov",
      navLabel: "Среднее центров",
      explanation: (
        <>
          <Typography.Text>
            Центры найдены. Как получить из них среднее координат?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сложить координаты центров и разделить на число центров: каждый
              центр учитывается один раз, сколько бы точек ни было в его
              кластере.
            </strong>{" "}
            Для центров C₁ = (x₁; y₁), …, Cₖ = (xₖ; yₖ) это Pₓ = (x₁ + … + xₖ) /
            k и P_y = (y₁ + … + yₖ) / k. Функции{" "}
            <Notation>{"read_points"}</Notation> (подтема 1) и{" "}
            <Notation>{"center_sum"}</Notation> (подтема 3) считаем
            определёнными выше.
          </Typography.Text>
          <Typography.Text>
            Сумму удобно записать коротко:{" "}
            <Notation>{"sum(c[0] for c in centers)"}</Notation> по очереди берёт
            первую координату каждого центра и складывает — это{" "}
            <PythonTerm term="genexp">генераторное выражение</PythonTerm>. Те же
            скобки работают в <Notation>{"min"}</Notation> и{" "}
            <Notation>{"max"}</Notation>, а в квадратных скобках получается{" "}
            <PythonTerm term="comp">список</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              "centers = [(-4, 10), (6, 2)]\n\nxs = [c[0] for c in centers]\nprint(xs)\npx = sum(c[0] for c in centers) / len(centers)\npy = sum(c[1] for c in centers) / len(centers)\nprint(px, py)"
            }
            label={"Среднее координат центров"}
            language="python"
            output={"[-4, 6]\n1.0 6.0"}
          />
          <Typography.Text>
            Даже если в одном кластере 100 точек, а в другом 5 000, их центры
            входят в среднее одинаково. Усреднять все точки файла или умножать
            центр на размер кластера не нужно.
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
            А если в условии просят минимальные координаты центров?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Минимум ищут по каждой координате отдельно; пара минимумов не
              обязана быть центром.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "px = min(c[0] for c in centers)\npy = min(c[1] for c in centers)\nprint(px, py)"
            }
            label={"Минимумы координат центров"}
            language="python"
            output={"-4 2"}
          />
          <Typography.Text>
            У центров (−4; 10) и (6; 2) наименьшая абсцисса −4, наименьшая
            ордината 2. Точки (−4; 2) среди центров нет — и не должно быть:
            условие просит два отдельных числа.
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
            Как найти центры самого маленького и самого большого кластера?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала упорядочить кластеры по размеру —{" "}
              <Notation>{"sorted(clusters, key=len)"}</Notation>, — и только
              потом искать центры: так центр не оторвётся от своего кластера.
            </strong>{" "}
            <PythonTerm term="sortkey">
              <Notation>{"key=len"}</Notation>
            </PythonTerm>{" "}
            значит «сравнивать кластеры по длине», то есть по числу точек.
            Функцию <Notation>{"len"}</Notation> передают без скобок: мы
            говорим, чем мерить, а не вызываем её.
          </Typography.Text>
          <Typography.Text>
            После сортировки <Notation>{"clusters[0]"}</Notation> — самый
            маленький, <Notation>{"clusters[-1]"}</Notation> — самый большой:
            индекс −1 означает последний элемент. Кластеры файла{" "}
            <Notation>{"example27.txt"}</Notation> — левый из пяти точек и
            правый из трёх:
          </Typography.Text>
          <CodeBlock
            code={
              "clusters = [\n    [(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)],\n    [(10, 0), (12, 0), (11, 1)]\n]\nclusters = sorted(clusters, key=len)\ncenters = [center_sum(c) for c in clusters]\n\nprint([len(c) for c in clusters], centers)\nprint(dist(centers[0], centers[-1]))"
            }
            label={"Центры самого маленького и самого большого кластера"}
            language="python"
            output={"[3, 5] [(11, 1), (1, 1)]\n10.0"}
          />
          <Typography.Text>
            Последняя строка — расстояние между центрами самого маленького и
            самого большого кластеров. Если сначала найти центры, а потом
            переставить только кластеры, центры останутся в старом порядке и
            перепутаются.
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
            Как выбрать кластер, в котором больше всего звёзд нужного вида?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сделать ключом сортировки свою функцию: она получает кластер и
              возвращает, сколько в нём объектов нужного вида.
            </strong>{" "}
            В обеих задачах основной волны ЕГЭ-2026 нужен кластер, где больше
            или меньше всего звёзд определённого вида, — это не то же самое, что
            самый большой кластер. Разделим звёзды файла{" "}
            <Notation>{"27-3.txt"}</Notation> по границам из подтемы 2 и
            посчитаем красных гигантов. Функции{" "}
            <Notation>{"read_stars"}</Notation> и{" "}
            <Notation>{"parse_kind"}</Notation> — из подтемы 1:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'def split_stars(stars):\n    clusters = [[], [], []]\n    for s in stars:\n        if s[1] < 5:\n            clusters[0].append(s)\n        elif s[0] < 10:\n            clusters[1].append(s)\n        else:\n            clusters[2].append(s)\n    return clusters\n\n\ndef red_giants(cluster):\n    count = 0\n    for s in cluster:\n        cls, sub, lum = parse_kind(s[2])\n        if cls == "M" and lum == "III":\n            count += 1\n    return count'
            }
            label={"Функции split_stars и red_giants"}
            language="python"
          />
          <CodeBlock
            code={
              'clusters = split_stars(read_stars("27-3.txt"))\nprint([len(c) for c in clusters])\nprint([red_giants(c) for c in clusters])\n\nby_red = sorted(clusters, key=red_giants)\nprint(len(by_red[0]), len(by_red[-1]))'
            }
            label={"Кластеры по числу красных гигантов"}
            language="python"
            output={"[231, 198, 172]\n[11, 17, 9]\n172 198"}
          />
          <Typography.Text>
            Меньше всего красных гигантов (9) — в кластере из 172 звёзд, больше
            всего (17) — в кластере из 198, хотя самый большой кластер — из 231
            звезды.
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
            Как исключить из ответа самый маленький кластер?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Отсортировать кластеры по размеру и отрезать лишний срезом, а
              среднее делить на новое число кластеров.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "clusters = sorted(clusters, key=len)\nclusters = clusters[1:]    # без самого маленького\n# clusters[:-1] — без самого большого"
            }
            label={"Исключение самого маленького кластера"}
            language="python"
          />
          <Typography.Text>
            Срез <Notation>{"[1:]"}</Notation> берёт всё, начиная со второго
            элемента, <Notation>{"[:-1]"}</Notation> — всё, кроме последнего.
            Потом считают характеристики оставшихся кластеров и делят на их
            число: <Notation>{"sum(radii) / len(radii)"}</Notation>, а не на
            исходное.
          </Typography.Text>
          <Typography.Text>
            Читай условие точно — это три разных правила: удалить{" "}
            <strong>один</strong> самый маленький кластер; удалить{" "}
            <strong>все</strong> кластеры наименьшего размера; удалить все
            кластеры, где точек меньше заданного числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "masshtabirovanie",
      navLabel: "Целая часть",
      explanation: (
        <>
          <Typography.Text>
            Как превратить дробный результат в ответ?
          </Typography.Text>
          <Typography.Text>
            <strong>
              <Notation>{"int(value * 10000)"}</Notation> отбрасывает дробную
              часть, а модуль берут на том шаге, который назван в условии.
            </strong>{" "}
            2,718281 · 10 000 = 27 182,81, ответ 27182. Заменить{" "}
            <Notation>{"int"}</Notation> на <Notation>{"round"}</Notation>{" "}
            нельзя, а у отрицательных чисел <Notation>{"int"}</Notation> идёт к
            нулю, а <Notation>{"floor"}</Notation> — вниз:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import floor\n\nprint(int(2.718281 * 10000))\nprint(int(2.9), round(2.9))\nprint(int(-2.9), floor(-2.9))"
            }
            label={"int, round и floor"}
            language="python"
            output={"27182\n2 3\n-2 -3"}
          />
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
            «Целая часть модуля» — это{" "}
            <Notation>{"int(abs(value) * 10000)"}</Notation>. Но где брать
            модуль, решает условие. Абсциссы центров −6 и 4: модуль среднего
            |(−6 + 4) / 2| = 1, а среднее модулей (6 + 4) / 2 = 5. Так же
            различаются <Notation>{"abs(min(values))"}</Notation> и{" "}
            <Notation>{"min(abs(v) for v in values)"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "values = [-8, 3]\nprint(abs(min(values)), min(abs(v) for v in values))"
            }
            label={"Модуль минимума и минимум модулей"}
            language="python"
            output={"8 3"}
          />
          <ProofDisclosure kind="nuance" summary="Дробные числа и точность">
            <Typography.Text>
              <Notation>{"float"}</Notation> хранит многие десятичные дроби
              приближённо, поэтому ничего не округляй по дороге: ни координаты,
              ни центры перед усреднением. Целую часть берут один раз — у
              итогового значения. Множитель тоже читай в условии: бывает 100, 1
              000, 10 000 или разные множители для разных величин.
            </Typography.Text>
            <Typography.Text>
              Не добавляй «для надёжности» 0.0001. Если итог подозрительно
              близок к целому, пересчитай точнее — например, сложи расстояния
              функцией <Notation>{"math.fsum"}</Notation>, она меньше ошибается
              при сложении.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "polnyy-primer",
      navLabel: "Полный пример",
      explanation: (
        <>
          <Typography.Text>
            Как выглядит решение целиком, от файла до ответа?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Четыре шага подряд: прочитать, разделить, найти центры, собрать
              ответ — каждый шаг уже разобран в своей подтеме.
            </strong>{" "}
            Учебная задача: точки файла <Notation>{"example27.txt"}</Notation>{" "}
            образуют два кластера — левее и правее x = 5; центр — точка с
            наименьшей суммой расстояний; нужны целые части средних координат
            центров, умноженных на 10 000.
          </Typography.Text>
          <CodeBlock
            code={"X Y\n0 0\n0 2\n1 1\n2 0\n2 2\n10 0\n12 0\n11 1"}
            label={"Строки файла example27.txt"}
            language="text"
            fileName="example27.txt"
          />
          <CodeBlock
            collapsible={false}
            code={
              'from math import dist\n\n\ndef read_points(filename):\n    points = []\n    with open(filename, encoding="utf-8-sig") as f:\n        f.readline()  # в этом файле есть заголовок X Y\n        for line in f:\n            if line.strip():\n                x, y = line.replace(",", ".").split()\n                points.append((float(x), float(y)))\n    return points\n\n\ndef center_sum(cluster):\n    best_point = cluster[0]\n    best_sum = float("inf")\n    for candidate in cluster:\n        total = 0.0\n        for point in cluster:\n            total += dist(candidate, point)\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n    return best_point\n\n\npoints = read_points("example27.txt")\nclusters = [[], []]\nfor x, y in points:\n    if x < 5:\n        clusters[0].append((x, y))\n    else:\n        clusters[1].append((x, y))\n\ncenters = [center_sum(c) for c in clusters]\npx = sum(c[0] for c in centers) / len(centers)\npy = sum(c[1] for c in centers) / len(centers)\nprint(centers)\nprint(int(px * 10000), int(py * 10000))'
            }
            label={"Решение от файла до ответа"}
            language="python"
            output={"[(1.0, 1.0), (11.0, 1.0)]\n60000 10000"}
          />
          <Typography.Text>
            Центры — (1; 1) и (11; 1), средние координаты Pₓ = (1 + 11) / 2 = 6
            и P_y = 1, ответ 60000 10000. Граница x = 5 подходит именно этому
            файлу — в другом её снова находят по рисунку.
          </Typography.Text>
          <ProofDisclosure summary="Проверка центров вручную">
            <Typography.Text>
              Левый кластер — (0; 0), (0; 2), (1; 1), (2; 0), (2; 2). От (1; 1)
              до четырёх углов по √2: сумма 4√2 ≈ 5,657. У любого угла сумма 2 +
              2 + 2√2 + √2 = 4 + 3√2 ≈ 8,243 — больше.
            </Typography.Text>
            <Typography.Text>
              Правый кластер — (10; 0), (12; 0), (11; 1). У (11; 1) сумма √2 +
              √2 = 2√2 ≈ 2,828, у двух других 2 + √2 ≈ 3,414.
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
                key: "Среднее центров",
                note: (
                  <>
                    <Notation>
                      {"sum(c[0] for c in centers) / len(centers)"}
                    </Notation>
                  </>
                ),
              },
              {
                key: "Минимумы",
                note: <>по каждой координате отдельно</>,
              },
              {
                key: "По размеру",
                note: (
                  <>
                    <Notation>{"sorted(clusters, key=len)"}</Notation>, потом
                    центры
                  </>
                ),
              },
              {
                key: "Нужный вид",
                note: <>ключ сортировки — своя функция подсчёта</>,
              },
              {
                key: "Исключение",
                note: (
                  <>
                    <Notation>{"[1:]"}</Notation> или{" "}
                    <Notation>{"[:-1]"}</Notation>; делить на новое число
                  </>
                ),
              },
              {
                key: "Целая часть",
                note: (
                  <>
                    <Notation>{"int(value * 10000)"}</Notation>; модуль — где
                    сказано
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
      id: "zadacha-1",
      prompt: (
        <>
          Центры кластеров — (−6; 2), (4; 8) и (1; −1). Найди средние координаты
          центров и модули минимальных координат.
        </>
      ),
      reveal: (
        <>
          Pₓ = (−6 + 4 + 1) / 3 = −1/3 ≈ −0,333, P_y = (2 + 8 − 1) / 3 = 3;
          модули минимумов — 6 и 1.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          В кластерах 120, 45 и 300 точек, их центры C₁, C₂ и C₃. Самый
          маленький кластер исключают. Какие центры усредняют и на что делят?
        </>
      ),
      reveal: (
        <>C₁ и C₃: кластер из 45 точек исключён. Делят на 2, а не на 3.</>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Абсциссы центров −6 и 4. Чему равны модуль среднего и среднее модулей?
        </>
      ),
      reveal: <>|(−6 + 4) / 2| = 1 и (6 + 4) / 2 = 5 — разные ответы.</>,
    },
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
      id: "zadacha-5",
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
