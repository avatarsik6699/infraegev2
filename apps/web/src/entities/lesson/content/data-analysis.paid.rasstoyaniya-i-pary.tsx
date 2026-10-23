// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { DownloadLink } from "~/shared/components/download-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./data-analysis.paid.rasstoyaniya-i-pary.media";
import { THEME_TASK } from "./data-analysis.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "svoy-i-chuzhoy",
      navLabel: "Радиус",
      explanation: (
        <>
          <Typography.Text>
            Как найти, насколько далеко от центра разбросаны точки кластера?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Радиус кластера — расстояние от центра до самой далёкой точки
              своего кластера.
            </strong>{" "}
            Возьмём кластеры файла <Notation>{"example27.txt"}</Notation>:{" "}
            <Notation>{"small"}</Notation> — правый из трёх точек,{" "}
            <Notation>{"big"}</Notation> — левый из пяти. Функция{" "}
            <Notation>{"center_sum"}</Notation> — из подтемы 3:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "small = [(10, 0), (12, 0), (11, 1)]\nbig = [(0, 0), (0, 2), (1, 1), (2, 0), (2, 2)]\nc_small, c_big = center_sum(small), center_sum(big)\n\nr_small = max(dist(c_small, p) for p in small)\nr_big = max(dist(c_big, p) for p in big)\nprint(r_small, r_big)\n\nfar = max(dist(c_small, p) for p in big)\nprint(far)"
            }
            label={"Радиус и расстояние до чужого кластера"}
            language="python"
            output={"1.4142135623730951 1.4142135623730951\n11.045361017187261"}
          />
          <Typography.Text>
            Радиусы обоих кластеров — √2 ≈ 1,414: от центров (11; 1) и (1; 1) до
            самых далёких точек — по диагонали клетки. Последнее число — уже не
            радиус: это расстояние от центра малого кластера до самой далёкой
            точки <strong>чужого</strong>, большого кластера — до (0; 0) или (0;
            2). Перед каждым расчётом реши два вопроса: от чего до чего считаем
            и среди каких точек выбираем.
          </Typography.Text>
          <Typography.Text>
            Центр ищут один раз, до цикла. В записи{" "}
            <Notation>
              {"max(dist(center_sum(cluster), p) for p in cluster)"}
            </Notation>{" "}
            поиск центра повторится для каждой точки, и программа, которая
            работала секунду, будет работать часами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "diametr",
      navLabel: "Диаметр кластера",
      explanation: (
        <>
          <Typography.Text>
            Как найти наибольшее расстояние между двумя точками кластера?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все пары точек кластера — каждую один раз — и запомнить
              наибольшее расстояние. Это диаметр кластера.
            </strong>{" "}
            Определение, как всегда, сверяй с условием: D = max d(A, B), где A и
            B — точки одного кластера.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def diameter_of(cluster):\n    diameter = 0.0\n    for i in range(len(cluster)):\n        for j in range(i + 1, len(cluster)):\n            diameter = max(\n                diameter,\n                dist(cluster[i], cluster[j])\n            )\n    return diameter"
            }
            label={"Функция diameter_of"}
            language="python"
          />
          <CodeBlock
            code={"print(diameter_of(small), diameter_of(big))"}
            label={"Диаметры двух кластеров"}
            language="python"
            output={"2.0 2.8284271247461903"}
          />
          <Typography.Text>
            Внутренний цикл начинается с <Notation>{"i + 1"}</Notation>: каждая
            пара проверяется один раз, а точка не сравнивается сама с собой.
          </Typography.Text>
          <Typography.Text>
            Если требуется не только расстояние, но и координаты точек,
            образующих диаметр, нужно запоминать найденную пару. У левого
            кластера диаметр 2√2 дают сразу две пары — две диагонали квадрата;
            поэтому в задачах, где важны концы диаметра, условие гарантирует,
            что пара единственная.
          </Typography.Text>
          <Typography.Text>
            Диаметр не обязан совпадать с расстоянием от выбранного центра до
            самой далёкой точки. Если известен центр и его радиус R, то диаметр
            не больше 2R, но равенство выполняется не всегда. Поэтому{" "}
            <strong>
              автоматически писать{" "}
              <Notation>{"diameter = 2 * radius"}</Notation> нельзя
            </strong>
            . У правого кластера радиус √2 ≈ 1,414, а диаметр 2 — меньше, чем
            2√2.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatterexample27txt_x5_3d2c1d}
            caption={
              <>
                Правый кластер: радиус от центра (11; 1) — √2 ≈ 1,414 (пунктир),
                диаметр — отрезок (10; 0)–(12; 0) длиной 2, меньше 2R. Тонкая
                линия — межкластерный диаметр (0; 2)–(12; 0) ≈ 12,166.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "mezhklasternyy-diametr",
      navLabel: "Межкластерный диаметр",
      explanation: (
        <>
          <Typography.Text>
            Как найти самые далёкие друг от друга точки двух разных кластеров?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Брать по одной точке из каждого кластера и запоминать не только
              наибольшее расстояние, но и саму пару.
            </strong>{" "}
            Это межкластерный диаметр; в задачах часто что-то считают и по его
            концам. Запусти функцию по шагам: сначала лучшая пара даёт 12, затем
            ≈ 12,166.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runFarthestPair}
            label={"Межкластерный диаметр по шагам"}
          />
          <Typography.Text>
            <PythonTerm term="none">
              <Notation>{"None"}</Notation>
            </PythonTerm>{" "}
            — специальное значение, означающее, что результат пока не
            установлен. Оба кластера здесь предполагаются непустыми, поэтому
            пара обязательно будет найдена. Функция возвращает{" "}
            <PythonTerm term="multiret">два значения</PythonTerm>, их
            раскладывают по именам — и теперь можно вычислить, например, модуль
            разности абсцисс концов и сумму их ординат:
          </Typography.Text>
          <CodeBlock
            code={
              "diameter, pair = farthest_pair(small, big)\npoint1, point2 = pair\n\nx_difference = abs(point1[0] - point2[0])\ny_sum = point1[1] + point2[1]\nprint(diameter, pair, x_difference, y_sum)"
            }
            label={"Концы межкластерного диаметра"}
            language="python"
            output={"12.165525060596439 ((12, 0), (0, 2)) 12 2"}
          />
          <Typography.Text>
            Если кластеров три, межкластерных диаметров тоже три — по одному на
            каждую пару кластеров. Пары номеров перебирают так же, как пары
            точек, — с <Notation>{"i + 1"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "clusters = [small, big]\ntotal = 0.0\nfor i in range(len(clusters)):\n    for j in range(i + 1, len(clusters)):\n        d, pair = farthest_pair(clusters[i], clusters[j])\n        total += d\n\nprint(total)"
            }
            label={"Сумма межкластерных диаметров"}
            language="python"
            output={"12.165525060596439"}
          />
          <Typography.Text>
            Здесь кластеров два, и сумма состоит из одного диаметра.
          </Typography.Text>
          <Typography.Text>
            Если требуется минимальное расстояние между кластерами, организация
            похожая, но начальное значение — положительная бесконечность, а
            сравнение — <Notation>{"<"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Расстояние между центрами не заменяет расстояния между крайними
              или ближайшими точками кластеров.
            </strong>{" "}
            Здесь расстояние между центрами — 10, а межкластерный диаметр ≈
            12,166.
          </Typography.Text>
          <Typography.Text>
            И ещё: когда нужно найти минимальное расстояние между{" "}
            <strong>различными</strong> точками одного кластера, нельзя включать
            пару точки с самой собой. Иначе минимум всегда получится нулевым.
            Для различения записей надёжнее использовать разные индексы.
            Проверка <Notation>{"point1 != point2"}</Notation> исключит также
            разные записи с одинаковыми координатами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochki-okolo-centra",
      navLabel: "Точки около центра",
      explanation: (
        <>
          <Typography.Text>
            Как посчитать точки на расстоянии не больше r от центра?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала точно определить, среди каких точек считаем и строгое ли
              неравенство, — и только потом писать цикл.
            </strong>{" "}
            Подсчёт выглядит так:
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\n\nfor point in points:\n    if dist(center, point) <= r:\n        count += 1"
            }
            label={"Подсчёт точек в радиусе"}
            language="python"
          />
          <Typography.Text>
            Фраза «на плоскости» может означать все допустимые точки файла.
            Фраза «этого кластера» — только точки соответствующего кластера:{" "}
            <Notation>{"for point in cluster:"}</Notation>. Нельзя менять
            область перебора по привычке. Слова в условии переводятся буквально:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка в условии и проверка в Python"}
            variants={[
              {
                label: "меньше r",
                value: (
                  <>
                    <Notation>{"dist(center, point) < r"}</Notation>
                  </>
                ),
              },
              {
                label: "не больше r",
                value: (
                  <>
                    <Notation>{"dist(center, point) <= r"}</Notation>
                  </>
                ),
              },
              {
                label: "больше r",
                value: (
                  <>
                    <Notation>{"dist(center, point) > r"}</Notation>
                  </>
                ),
              },
              {
                label: "не меньше r",
                value: (
                  <>
                    <Notation>{"dist(center, point) >= r"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Если центр является одной из перебираемых точек, его расстояние до
            себя равно нулю. При условии <Notation>{"<= r"}</Notation> и
            неотрицательном <Notation>{"r"}</Notation>{" "}
            <strong>он будет посчитан</strong>. Это правильно, если условие
            включает центр. Если требуется считать только остальные точки, его
            нужно исключить как конкретную запись.
          </Typography.Text>
          <Typography.Text>
            Посчитаем для центра (1; 1) и r = 10 все три варианта:
          </Typography.Text>
          <CodeBlock
            code={
              "points = small + big\ncenter = (1, 1)\n\nprint(sum(1 for p in points if dist(center, p) <= 10))\nprint(sum(1 for p in points if dist(center, p) < 10))\nprint(sum(1 for p in big if dist(center, p) <= 10))"
            }
            label={"Три варианта подсчёта"}
            language="python"
            output={"7\n6\n5"}
          />
          <Typography.Text>
            Те же точки и окружность на рисунке:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatterexample27txt_96f239}
            caption={
              <>
                Окружность радиуса 10 вокруг (1; 1): точка (11; 1) лежит ровно
                на ней, (10; 0) — внутри на расстоянии √82 ≈ 9,06, (12; 0) —
                снаружи.
              </>
            }
          />
          <Typography.Text>
            «На плоскости, не больше 10» — 7 точек: к пяти точкам своего
            кластера добавились (10; 0) и (11; 1). «Меньше 10» — 6: точка (11;
            1) на самой окружности выпала. «Этого кластера» — 5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "blizhayshiy-obekt",
      navLabel: "Объекты нужного вида",
      explanation: (
        <>
          <Typography.Text>
            Как найти ближайшую к центру звезду нужного вида или пару таких
            звёзд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала отобрать объекты нужного вида, потом искать среди них —
              внутри одного кластера; центр при этом ищут по всем точкам
              кластера.
            </strong>{" "}
            В задачах ЕГЭ-2026 спрашивают, например, координаты ближайшего к
            центру красного гиганта или расстояние между двумя жёлтыми карликами
            одного кластера. Найдём белый карлик, ближайший к центру самого
            большого кластера файла <Notation>{"27-3.txt"}</Notation>. Функция{" "}
            <Notation>{"read_stars"}</Notation> — из подтемы 1,{" "}
            <Notation>{"split_stars"}</Notation> — из подтемы 4:
          </Typography.Text>
          <CodeBlock
            code={
              'clusters = split_stars(read_stars("27-3.txt"))\nbig = max(clusters, key=len)\ncenter = center_sum([s[:2] for s in big])\n\ndwarfs = [s for s in big if s[2] == "VII"]\nnearest = min(dwarfs, key=lambda s: dist(center, s[:2]))\n\nprint(center, len(dwarfs))\nprint(nearest, dist(center, nearest[:2]))'
            }
            label={"Ближайший белый карлик"}
            language="python"
            output={
              "(3.943346, 1.288606) 20\n(3.107868, 1.047377, 'VII') 0.8696061861124266"
            }
          />
          <Typography.Text>
            Центр ищем по координатам <Notation>{"s[:2]"}</Notation> —{" "}
            <strong>по всем звёздам кластера</strong>, а не только по белым
            карликам.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"max(clusters, key=len)"}</Notation> возвращает сам
            кластер с наибольшим числом точек,{" "}
            <Notation>{"min(dwarfs, key=…)"}</Notation> — сам ближайший объект,
            а не расстояние до него; запись <Notation>{"lambda s: …"}</Notation>{" "}
            — короткая функция для ключа. Если нужен вид, который определяется
            буквой и светимостью, отбор пишут через{" "}
            <Notation>{"parse_kind"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Пары объектов одного вида внутри одного кластера перебирают по
            индексам, как пары точек для диаметра. Наименьшее расстояние между
            двумя <strong>разными</strong> белыми карликами одного кластера:
          </Typography.Text>
          <CodeBlock
            code={
              'best = float("inf")\n\nfor cluster in clusters:\n    dw = [s[:2] for s in cluster if s[2] == "VII"]\n\n    for i in range(len(dw)):\n        for j in range(i + 1, len(dw)):\n            best = min(best, dist(dw[i], dw[j]))\n\nprint(best)'
            }
            label={"Пара белых карликов"}
            language="python"
            output={"0.014400764736637813"}
          />
          <Typography.Text>
            Пары из разных кластеров сюда не попадают: список{" "}
            <Notation>{"dw"}</Notation> собирается заново для каждого кластера.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы",
      explanation: (
        <>
          <Typography.Text>Вернёмся к задаче темы:</Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Все шаги уже разобраны: прочитать частицы (подтема 1), разделить
              по энергии (подтема 2), найти центры по разности энергий (подтема
              3) и посчитать два ответа на одних и тех же кластерах.
            </strong>{" "}
            Q₁ — наибольшее расстояние между частицами с признаком II внутри
            одного кластера — это пары, как у диаметра, только среди отобранных
            частиц. Q₂ — наибольшая энергия центра.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'from math import dist\n\n\ndef read_particles(filename):\n    particles = []\n    with open(filename, encoding="utf-8-sig") as f:\n        for line in f:\n            parts = line.replace(",", ".").split()\n            x, y, vx, vy, m = [float(v) for v in parts[:5]]\n            particles.append((x, y, vx, vy, m, parts[5]))\n    return particles\n\n\ndef energy(p):\n    return p[4] * (p[2] ** 2 + p[3] ** 2) / 2\n\n\ndef energy_gap(a, b):\n    return abs(energy(a) - energy(b))\n\n\ndef center_sum(cluster, d=dist):\n    best_point = cluster[0]\n    best_sum = float("inf")\n    for candidate in cluster:\n        total = 0.0\n        for point in cluster:\n            total += d(candidate, point)\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n    return best_point\n\n\nparticles = read_particles("27-4.txt")\nbounds = [3.5, 7, 10.5]\ngroups = [[] for _ in range(len(bounds) + 1)]\nfor p in particles:\n    groups[sum(energy(p) > b for b in bounds)].append(p)\n\nq1 = 0.0\nfor g in groups:\n    tagged = [p[:2] for p in g if p[5] == "II"]\n    for i in range(len(tagged)):\n        for j in range(i + 1, len(tagged)):\n            q1 = max(q1, dist(tagged[i], tagged[j]))\n\nq2 = max(energy(center_sum(g, energy_gap)) for g in groups)\nprint(int(q1 * 10000), int(q2 * 10000))'
            }
            label={"Задача темы"}
            language="python"
            output={"772010 125026"}
          />
          <Typography.Text>
            Ответ: <strong>772010 125026</strong>. Новое в программе только одно
            место — номер группы: это число границ, которые энергия частицы
            превысила, а <Notation>{"sum"}</Notation> считает истинные сравнения
            как единицы. Файл задачи —{" "}
            <DownloadLink
              presentation="inline"
              href="/api/tasks/task-27-9-04/files/statement-1"
            >
              27-4.txt
            </DownloadLink>
            .
          </Typography.Text>
          <Typography.Text>
            Q₁ считают по координатам — <Notation>{"p[:2]"}</Notation>, хотя
            кластеры и центры выбирали по энергии. А список частиц с признаком
            II собирают заново в каждом кластере: пары из разных кластеров в Q₁
            не входят.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rasstoyaniya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Радиус",
                note: <>от центра до самой далёкой точки своего кластера</>,
              },
              {
                key: "Центр",
                note: <>ищут один раз, до цикла по точкам</>,
              },
              {
                key: "Диаметр",
                note: (
                  <>
                    пары с <Notation>{"j"}</Notation> от{" "}
                    <Notation>{"i + 1"}</Notation>; не обязан быть 2R
                  </>
                ),
              },
              {
                key: "Межкластерный",
                note: <>по точке из двух кластеров; запоминай и пару</>,
              },
              {
                key: "В радиусе",
                note: <>среди каких точек и строгое ли неравенство</>,
              },
              {
                key: "Нужный вид",
                note: <>сначала отбор, потом поиск — внутри кластера</>,
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
          Для Q₁ задачи темы список частиц с признаком II собирают заново в
          каждом кластере. Что получится, если собрать его один раз по всему
          файлу?
        </>
      ),
      reveal: (
        <>
          В пары попадут частицы разных кластеров, и выйдет ≈ 79,087 вместо
          77,201: самая далёкая пара признака II лежит в разных кластерах.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          <Typography.Text>
            Почему следующий код может быть очень медленным?
          </Typography.Text>
          <CodeBlock
            code={
              "for point in cluster:\n    d = dist(center_sum(cluster), point)"
            }
            label={"Медленный радиус"}
            language="python"
          />
        </>
      ),
      reveal: (
        <>
          Центр заново ищется на каждом проходе. Его нужно вычислить один раз до
          цикла.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Кластер: <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(4, 0)"}</Notation>, <Notation>{"(4, 3)"}</Notation>.
          Найди его центр, радиус и диаметр. Равен ли диаметр удвоенному
          радиусу?
        </>
      ),
      reveal: (
        <>
          Центр <Notation>{"(4, 0)"}</Notation> (суммы: 9, 7 и 8), радиус 4,
          диаметр 5 — между <Notation>{"(0, 0)"}</Notation> и{" "}
          <Notation>{"(4, 3)"}</Notation>; 5 меньше 2 · 4 = 8.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          В кластере три записи: <Notation>{"(1, 1)"}</Notation>,{" "}
          <Notation>{"(1, 1)"}</Notation>, <Notation>{"(3, 1)"}</Notation>. Чему
          равно минимальное расстояние между разными записями? А если пары
          отбирать проверкой <Notation>{"point1 != point2"}</Notation>?
        </>
      ),
      reveal: (
        <>
          0: две разные записи совпадают по координатам. С проверкой{" "}
          <Notation>{"point1 != point2"}</Notation> пара одинаковых координат
          пропускается, и получится 2 — это уже другой вопрос.
        </>
      ),
    },
    {
      id: "zadacha-6",
      prompt: (
        <>
          Найди диаметр самого маленького кластера файла{" "}
          <DownloadLink
            presentation="inline"
            href="/api/tasks/task-27-2-05/files/statement-1"
          >
            27-3.txt
          </DownloadLink>
          .
        </>
      ),
      reveal: <>≈ 5,692.</>,
    },
  ],
};

export default content;
