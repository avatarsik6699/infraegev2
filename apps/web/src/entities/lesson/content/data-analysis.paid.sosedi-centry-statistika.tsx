// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./data-analysis.paid.sosedi-centry-statistika.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "porog-sosedstva",
      navLabel: "Порог соседства",
      explanation: (
        <>
          <Typography.Text>
            Как разделить точки на группы, если границы по рисунку провести
            трудно?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Соединить точки, которые ближе порога ε, и считать одной группой
              всё, что связано цепочками таких шагов.
            </strong>{" "}
            Две точки — <strong>соседи</strong>, если d(A, B) ≤ ε. Возьмём A =
            (0; 0), B = (0,8; 0), C = (1,6; 0) и ε = 0,9.
          </Typography.Text>
          <Typography.Text>
            Тогда d(A, B) = 0,8 ≤ 0,9 и d(B, C) = 0,8 ≤ 0,9, но d(A, C) = 1,6{" "}
            {">"} 0,9. Тем не менее все три точки образуют{" "}
            <strong>одну связную группу</strong>: от <Notation>{"A"}</Notation>{" "}
            до <Notation>{"C"}</Notation> можно пройти через{" "}
            <Notation>{"B"}</Notation>, причём каждый шаг достаточно короткий.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Внутри такой группы не требуется, чтобы каждая точка была близка к
              каждой.
            </strong>{" "}
            Требуется возможность добраться от одной точки до другой по цепочке
            соседей.
          </Typography.Text>
          <Typography.Text>
            Если нарисовать отрезки между всеми парами соседей, получится{" "}
            <strong>граф</strong>: точки называются его вершинами, соединяющие
            их отрезки — рёбрами. Группа вершин, между которыми можно пройти по
            рёбрам и к которой нельзя присоединить другие достижимые вершины,
            называется <strong>компонентой связности</strong>. Термин выглядит
            сложнее самой идеи: это отдельный связный кусок рисунка.
          </Typography.Text>
          <Typography.Text>
            Листай кадры схемы: в каждом свой порог. При маленьком значении
            точкам не хватает связей, при подходящем возникают две группы, при
            слишком большом они сливаются.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.clEpsStepper_f679db}
            label={"Одни и те же точки при разных порогах"}
          />
        </>
      ),
    },
    {
      id: "postroenie-gruppy",
      navLabel: "Построение группы",
      explanation: (
        <>
          <Typography.Text>
            Как программа находит всю группу, а не только ближайших соседей
            первой точки?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Группу растят от любой точки: ищут соседей у каждой добавленной
              точки, пока новых не останется.
            </strong>{" "}
            Алгоритм построения одной группы:
          </Typography.Text>
          <ol>
            <li>Взять любую ещё не распределённую точку.</li>
            <li>Найти её нераспределённых соседей.</li>
            <li>Добавить их в текущую группу.</li>
            <li>Найти соседей у добавленных точек.</li>
            <li>
              Продолжать, пока все точки текущей группы не будут обработаны.
            </li>
          </ol>
          <Typography.Text>
            После этого берём следующую нераспределённую точку и начинаем новую
            группу.
          </Typography.Text>
          <Typography.Text>
            Здесь принципиально важен четвёртый шаг. Если искать соседей только
            у первой точки, мы получим лишь её непосредственное окружение, а не
            весь кластер. Вот реализация:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from math import dist\n\n\ndef split_clusters(points, eps):\n    remaining = points.copy()\n    clusters = []\n    while remaining:\n        cluster = [remaining.pop()]\n        pos = 0\n        while pos < len(cluster):\n            point = cluster[pos]\n            rest = []\n            for other in remaining:\n                if dist(point, other) <= eps:\n                    cluster.append(other)\n                else:\n                    rest.append(other)\n            remaining = rest\n            pos += 1\n        clusters.append(cluster)\n    return clusters"
            }
            label={"Функция split_clusters"}
            language="python"
          />
          <Typography.Text>Разберём устройство кода.</Typography.Text>
          <ul>
            <li>
              <Notation>{"remaining"}</Notation> содержит точки, которые ещё не
              отнесены ни к одной группе.{" "}
              <PythonTerm term="listops">
                Метод <Notation>{"copy()"}</Notation>
              </PythonTerm>{" "}
              создаёт отдельный список: сам исходный список{" "}
              <Notation>{"points"}</Notation> мы не будем опустошать.
            </li>
            <li>
              <PythonTerm term="while">
                <Notation>{"while remaining:"}</Notation>
              </PythonTerm>{" "}
              — цикл продолжается, пока список не пуст.
            </li>
            <li>
              <Notation>{"cluster = [remaining.pop()]"}</Notation>:{" "}
              <Notation>{"pop()"}</Notation> извлекает последний элемент списка
              и удаляет его из списка. Эта точка становится первой точкой новой
              группы.
            </li>
            <li>
              <Notation>{"pos"}</Notation> — номер точки текущей группы, соседей
              которой мы сейчас будем искать.
            </li>
            <li>
              <Notation>{"while pos < len(cluster):"}</Notation> — размер{" "}
              <Notation>{"cluster"}</Notation> может увеличиваться по мере
              работы. Поэтому цикл обработает и исходную точку, и всех
              добавленных соседей.
            </li>
            <li>
              В <Notation>{"rest"}</Notation> соберём точки, которые пока
              остались нераспределёнными. Если точка близка к обрабатываемой —{" "}
              <Notation>{"cluster.append(other)"}</Notation>, если нет —{" "}
              <Notation>{"rest.append(other)"}</Notation>.
            </li>
            <li>
              После прохода <Notation>{"remaining = rest"}</Notation>: точки,
              присоединённые к кластеру, исчезают из списка нераспределённых.
            </li>
            <li>
              <Notation>{"pos += 1"}</Notation> — переходим к следующей точке
              растущей группы.
            </li>
          </ul>
          <Typography.Text>
            Пройдём алгоритм по шагам на точках A, B, C и ещё двух точках D =
            (3,5; 0), E = (4,2; 0,4) с порогом 0,9:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.clSplitStepper09}
            label={"Группы соседей при пороге 0,9: шаг за шагом"}
          />
          <ProofDisclosure kind="nuance" summary="Почему находится вся группа">
            <Typography.Text>
              Почему алгоритм находит всю связную группу? Каждая добавленная
              точка рано или поздно обрабатывается. Значит, будут найдены её ещё
              не добавленные соседи. Затем соседи этих соседей — и так далее.
            </Typography.Text>
            <Typography.Text>
              Если существует цепочка из коротких шагов от начальной точки до
              некоторой другой, алгоритм последовательно пройдёт по ней.
            </Typography.Text>
            <Typography.Text>
              И наоборот: точка добавляется только потому, что близка к уже
              включённой. Значит, случайно перескочить в группу, с которой
              вообще нет связей, алгоритм не может.
            </Typography.Text>
            <Typography.Text>
              Однако здесь есть важное ограничение:{" "}
              <strong>
                алгоритм точно находит компоненты связности для выбранного
                порога. Совпадут ли они с кластерами из условия — отдельный
                вопрос.
              </strong>
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "obosnovanie-poroga",
      navLabel: "Выбор порога",
      explanation: (
        <>
          <Typography.Text>Как выбрать порог ε?</Typography.Text>
          <Typography.Text>
            <strong>
              Порог должен быть не меньше шагов внутри кластеров и меньше
              промежутков между кластерами; проверяют несколько значений и
              смотрят на размеры групп.
            </strong>{" "}
            В файле <Notation>{"example27.txt"}</Notation> у каждой группы точки
            связаны шагами √2 {"<"} 1,5, а между группами близких пар нет.
            Функции <Notation>{"read_points"}</Notation> и{" "}
            <Notation>{"center_sum"}</Notation> — из основных подтем:
          </Typography.Text>
          <CodeBlock
            code={
              'points = read_points("example27.txt", has_header=True)\nclusters = split_clusters(points, eps=1.5)\nprint("Количество групп:", len(clusters))\nfor cluster in clusters:\n    print(len(cluster), center_sum(cluster))'
            }
            label={"Порог 1,5 в учебном файле"}
            language="python"
            output={"Количество групп: 2\n3 (11.0, 1.0)\n5 (1.0, 1.0)"}
          />
          <Typography.Text>
            Центры те же, что при границе x = 5. Первой получилась правая
            группа: <Notation>{"pop()"}</Notation> начал с последней точки
            файла. Требования к порогу:
          </Typography.Text>
          <ol>
            <li>
              Внутри каждого требуемого кластера точки соединяются цепочками
              шагов длиной не больше ε.
            </li>
            <li>
              Между разными требуемыми кластерами нет ни одной пары точек на
              расстоянии не больше ε.
            </li>
          </ol>
          <Typography.Text>
            Обрати внимание: первое требование относится к{" "}
            <strong>цепочкам</strong>, а не к наибольшему расстоянию между
            любыми двумя точками внутри кластера. Вытянутый кластер может иметь
            длину 20 единиц, но состоять из точек с промежутками по 0,2. Для его
            связности вовсе не нужен порог 20.
          </Typography.Text>
          <Typography.Text>
            Если порог слишком маленький, одна настоящая группа может распасться
            на несколько. Если слишком большой, отдельные группы могут
            соединиться.
          </Typography.Text>
          <Typography.Text>
            При этом даже правильное количество получившихся групп ещё ничего не
            доказывает. Например, один настоящий кластер распался на два, а два
            других слились в один. Общее количество осталось прежним, но
            распределение неверно.
          </Typography.Text>
          <Typography.Text>
            После автоматического разделения полезно вывести размеры и проверить
            несколько близких значений порога. В файле{" "}
            <Notation>{"27-6.txt"}</Notation> две дуги вложены одна в другую:
            вертикальная или горизонтальная граница здесь не помогает, а цепочки
            — помогают:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatter276txt}
            caption={
              <>
                Файл 27-6.txt: верхняя дуга заходит концами в нижнюю, и любая
                вертикальная или горизонтальная прямая режет хотя бы одну из
                них. Цепочки с порогом 0,5 разделяют дуги: кружки и квадраты —
                две группы из 140 и 120 точек.
              </>
            }
          />
          <CodeBlock
            code={
              'points = read_points("27-6.txt")\n\nfor eps in [0.3, 0.5, 1.0, 2.0]:\n    clusters = split_clusters(points, eps)\n\n    sizes = []\n\n    for cluster in clusters:\n        sizes.append(len(cluster))\n\n    print(eps, len(sizes), sorted(sizes, reverse=True)[:3])'
            }
            label={"Пороги для двух дуг"}
            language="python"
            output={
              "0.3 6 [139, 63, 33]\n0.5 2 [140, 120]\n1.0 2 [140, 120]\n2.0 2 [140, 120]"
            }
          />
          <Typography.Text>
            При пороге 0,3 одна дуга распалась на куски; от 0,5 до 2 разделение
            одно и то же — две дуги из 140 и 120 точек.
          </Typography.Text>
          <Typography.Text>
            Если в некотором диапазоне порогов сохраняется одно и то же разумное
            разделение, это полезный признак устойчивости. Но он не заменяет
            проверку геометрии и требований условия.
          </Typography.Text>
          <Typography.Text>
            Секторы файла <Notation>{"27-5.txt"}</Notation> показывают обе
            ошибки порога. У вершины <Notation>{"C"}</Notation> точки разных
            секторов сходятся, а на дальнем краю сектора точки редкие:
          </Typography.Text>
          <CodeBlock
            code={
              'points = read_points("27-5.txt")\n\nfor eps in [1.2, 3, 5]:\n    clusters = split_clusters(points, eps)\n    print(eps, sorted([len(c) for c in clusters], reverse=True))'
            }
            label={"Пороги для трёх секторов"}
            language="python"
            output={"1.2 [83, 76, 63, 3, 3]\n3 [83, 76, 69]\n5 [228]"}
          />
          <Typography.Text>
            При 1,2 третий сектор из 69 точек распался на куски 63, 3 и 3; при 5
            все секторы слились через вершину; при 3 разделение верное. Угол
            направления из подтемы 2 разделяет эти точки без подбора порога.
          </Typography.Text>
          <Typography.Text>
            <strong>Иногда единого подходящего порога вообще нет.</strong>{" "}
            Например, внутри одного разреженного кластера промежутки больше, чем
            расстояние между двумя другими кластерами. Тогда увеличение порога,
            необходимое для соединения первого, уже склеит два других. Поэтому
            разделение по соседям — важный инструмент, но не универсальная
            замена анализу условия.
          </Typography.Text>
          <Typography.Text>
            Также не следует смешивать три разных понятия: радиус круга,
            упомянутого в условии; расстояние от вычисленного центра до самой
            далёкой точки; порог соседства ε. Это могут быть совершенно разные
            числа.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Маленькие группы — ещё не аномалии"
          >
            <Typography.Text>
              Маленькие группы после автоматического разделения — ещё не
              обязательно аномалии. Допустим, после разделения получились группы
              размеров <Notation>{"2400, 3100, 2800, 1, 2"}</Notation>. Если по
              условию должно быть три содержательных кластера и три аномальные
              точки, последние две группы могут оказаться аномалиями. Но важно
              проверить:
            </Typography.Text>
            <ul>
              <li>где они находятся;</li>
              <li>почему их нужно исключить;</li>
              <li>действительно ли исключается три точки;</li>
              <li>не является ли маленькая группа допустимым кластером.</li>
            </ul>
            <Typography.Text>
              <strong>
                Число аномальных точек и число маленьких групп — не одно и то
                же.
              </strong>{" "}
              Три аномалии могут образовывать три одиночные группы, одну группу
              из трёх точек или группы размеров 1 и 2. Нельзя без обоснования
              писать:
            </Typography.Text>
            <CodeBlock
              code={
                "# Нельзя считать это универсальным правилом!\nif len(cluster) > 10:\n    ..."
              }
              label={"Нельзя без обоснования писать"}
              language="python"
            />
            <Typography.Text>
              В одной задаче это может сработать, в другой удалит настоящий
              кластер.
            </Typography.Text>
            <Typography.Text>
              Есть ещё проблема: аномальная точка может оказаться близко к
              настоящему кластеру и присоединиться к нему при обработке по
              порогу. Несколько аномалий могут даже образовать «мостик» между
              группами. Поэтому автоматическое выделение маленьких компонент не
              решает любую задачу с шумом.
            </Typography.Text>
            <Typography.Text>
              Возможно, ты встретишь название <strong>DBSCAN</strong>. Это
              метод, который дополнительно учитывает плотность: важно не только
              расстояние до соседей, но и их количество. У него есть параметры{" "}
              <Notation>{"eps"}</Notation> и{" "}
              <Notation>{"min_samples"}</Notation>. Описанное выше обычное
              объединение по цепочкам не следует без пояснений считать
              полноценным алгоритмом фильтрации шума.
            </Typography.Text>
            <Typography.Text>
              Для понимания заданий сначала достаточно уверенно владеть
              координатными границами и компонентами связности.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "samaya-dalyokaya-tochka",
      navLabel: "Минимакс",
      explanation: (
        <>
          <Typography.Text>
            Как найти центр, если в условии — наименьшее расстояние до самой
            далёкой точки?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Для каждого кандидата найти самое большое расстояние до точек
              кластера и выбрать кандидата с наименьшим таким максимумом.
            </strong>{" "}
            Такой принцип называют <strong>минимаксом</strong>: минимум среди
            максимумов. Сравним его с суммой расстояний на точках (0; 0), (1;
            0), (2; 0), (5; 0) и (10; 0).
          </Typography.Text>
          <LessonTable
            label={"Сумма и самое большое расстояние"}
            columns={[
              { label: "Кандидат" },
              { label: "Сумма расстояний", numeric: true },
              { label: "Самое большое расстояние", numeric: true },
            ]}
            rows={[
              [
                <>
                  <Notation>{"(0, 0)"}</Notation>
                </>,
                "18",
                "10",
              ],
              [
                <>
                  <Notation>{"(1, 0)"}</Notation>
                </>,
                "15",
                "9",
              ],
              [
                <>
                  <Notation>{"(2, 0)"}</Notation>
                </>,
                <>
                  <strong>14</strong>
                </>,
                "8",
              ],
              [
                <>
                  <Notation>{"(5, 0)"}</Notation>
                </>,
                "17",
                <>
                  <strong>5</strong>
                </>,
              ],
              [
                <>
                  <Notation>{"(10, 0)"}</Notation>
                </>,
                "32",
                "10",
              ],
            ]}
          />
          <Typography.Text>
            По сумме расстояний центр — <Notation>{"(2, 0)"}</Notation>. По
            минимальному максимальному расстоянию —{" "}
            <Notation>{"(5, 0)"}</Notation>. Это{" "}
            <strong>разные задачи с разными ответами</strong>.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'from math import dist\n\n\ndef center_minimax(cluster):\n    best_point = cluster[0]\n    best_radius = float("inf")\n    for candidate in cluster:\n        radius = 0.0\n        for point in cluster:\n            d = dist(candidate, point)\n            if d > radius:\n                radius = d\n        if radius < best_radius:\n            best_radius = radius\n            best_point = candidate\n    return best_point, best_radius'
            }
            label={"Функция center_minimax"}
            language="python"
          />
          <CodeBlock
            code={
              "line = [(0, 0), (1, 0), (2, 0), (5, 0), (10, 0)]\n\ncenter, radius = center_minimax(line)\nprint(center, radius)\nprint(center_sum(line))"
            }
            label={"Минимакс и сумма на одних точках"}
            language="python"
            output={"(5, 0) 5.0\n(2, 0)"}
          />
          <Typography.Text>
            Функция возвращает два значения: <Notation>{"center"}</Notation> —
            выбранную точку, <Notation>{"radius"}</Notation> — расстояние от неё
            до самой далёкой точки. Такое определение встречается в задачах
            подборки, где кластеры — круги, а ответ — средний радиус.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если центр по условию обязан быть точкой кластера, нельзя свободно
              поставить его между точками.
            </strong>{" "}
            Например, для двух точек <Notation>{"(0, 0)"}</Notation> и{" "}
            <Notation>{"(10, 0)"}</Notation> геометрическая середина{" "}
            <Notation>{"(5, 0)"}</Notation> покрывает их кругом радиуса 5. Но
            если разрешено выбирать центр только из этих двух точек, минимальное
            максимальное расстояние равно 10. Ограничение на допустимые центры
            принципиально меняет задачу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "antipod",
      navLabel: "Антицентр",
      explanation: (
        <>
          <Typography.Text>
            Что значат в условии «антицентр» и «антипод»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              То, что написано в определении: по одному слову алгоритм не
              угадать. Переведи определение в два ответа — что считаем для
              кандидата и как выбираем.
            </strong>{" "}
            Выбери определение:
          </Typography.Text>
          <VariantPicker
            label={"Что требуется → что вычисляем для кандидата → как выбираем"}
            variants={[
              {
                label: "минимум суммы расстояний",
                value: <>сумму расстояний до точек кластера</>,
                note: <>наименьшую сумму</>,
              },
              {
                label: "максимум суммы расстояний",
                value: <>ту же сумму</>,
                note: <>наибольшую сумму</>,
              },
              {
                label: "минимум максимального расстояния",
                value: <>самое большое расстояние до точки кластера</>,
                note: <>наименьший максимум</>,
              },
              {
                label: "самая далёкая точка от уже найденного центра",
                value: <>одно расстояние до этого центра</>,
                note: <>наибольшее расстояние</>,
              },
            ]}
          />
          <Typography.Text>
            Последние две части каждой строки помогают буквально перевести
            предложение на язык циклов.
          </Typography.Text>
          <Typography.Text>
            Если «антицентр» определён как точка с{" "}
            <strong>максимальной суммой</strong> расстояний, в функции{" "}
            <Notation>{"center_sum"}</Notation> меняются начальное значение{" "}
            <Notation>{'best_sum = -float("inf")'}</Notation> и сравнение{" "}
            <Notation>{"if total > best_sum:"}</Notation>. Всё остальное
            устройство сохраняется. В подборках так ищут антицентры самых
            крупных кластеров: сначала{" "}
            <Notation>{"sorted(clusters, key=len)"}</Notation>, затем антицентр
            каждого из нужных.
          </Typography.Text>
          <Typography.Text>
            Но найти точку с максимальной суммой расстояний и найти точку, самую
            далёкую от центра, — это не одно и то же вычисление. Для самой
            далёкой от уже известного центра:
          </Typography.Text>
          <CodeBlock
            code={
              "center = (2, 0)\nfarthest_point = line[0]\nmax_distance = -1.0\n\nfor point in line:\n    d = dist(center, point)\n\n    if d > max_distance:\n        max_distance = d\n        farthest_point = point\n\nprint(farthest_point, max_distance)"
            }
            label={"Самая далёкая от центра точка"}
            language="python"
            output={"(10, 0) 8.0"}
          />
          <Typography.Text>
            Здесь нет суммирования: каждой точке соответствует только одно
            расстояние.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summa-kvadratov",
      navLabel: "Сумма квадратов",
      explanation: (
        <>
          <Typography.Text>
            Как найти центр по наименьшей сумме квадратов расстояний?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Это точка кластера, ближайшая к средней точке: сумма квадратов
              растёт с удалением от средней точки, как парабола.
            </strong>{" "}
            На точках 0, 1, 2, 3, 100 сумму квадратов выиграл кандидат 3 —
            ближайший к средней точке 21,2 (подтема 3). Нарисуем сумму квадратов
            T(x) для любого x на прямой:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clParabola_ba6fc2}
            caption={
              <>
                Сумма квадратов расстояний от точки x до точек 0, 1, 2, 3, 100 —
                парабола с вершиной в средней точке 21,2. Кандидаты лежат на
                ней; ниже всех тот, что ближе к вершине, — (3; 0).
              </>
            }
          />
          <Typography.Text>
            Если разрешена любая точка плоскости, минимум достигается в самой
            средней точке. Если разрешены только точки исходного кластера, нужно
            выбрать ближайшую из них.
          </Typography.Text>
          <ProofDisclosure summary="Почему сумма квадратов зависит только от расстояния до средней точки">
            <Typography.Text>
              Пусть в кластере m точек: (x₁; y₁), …, (xₘ; yₘ). Проверяем
              кандидата P = (x; y). Нужная сумма:
            </Typography.Text>
            <Typography.Text>
              T(P) = Σᵢ ((x − xᵢ)² + (y − yᵢ)²).
            </Typography.Text>
            <Typography.Text>
              Знак Σ означает суммирование. Индекс i последовательно принимает
              значения от 1 до m. То есть формула — сокращённая запись ((x −
              x₁)² + (y − y₁)²) + … + ((x − xₘ)² + (y − yₘ)²).
            </Typography.Text>
            <Typography.Text>
              Обозначим средние координаты: x̄ = (x₁ + … + xₘ) / m, ȳ = (y₁ + … +
              yₘ) / m.
            </Typography.Text>
            <Typography.Text>
              После раскрытия скобок и группировки слагаемых получается:
            </Typography.Text>
            <Typography.Text>
              T(P) = m · ((x − x̄)² + (y − ȳ)²) + Σᵢ ((xᵢ − x̄)² + (yᵢ − ȳ)²).
            </Typography.Text>
            <Typography.Text>
              Посмотрим на смысл двух частей. Первая, m · ((x − x̄)² + (y − ȳ)²),
              — количество точек, умноженное на квадрат расстояния от кандидата
              до средней точки. Вторая часть зависит только от исходных точек.
              При смене кандидата она <strong>не изменяется</strong>.
            </Typography.Text>
            <Typography.Text>
              Поэтому при сравнении кандидатов достаточно сравнивать первую
              часть. А множитель m одинаков для всех.
            </Typography.Text>
            <Typography.Text>
              Чтобы увидеть источник преобразования, достаточно раскрыть одну
              часть:
            </Typography.Text>
            <Typography.Text>
              Σᵢ (x − xᵢ)² = m · x² − 2x · Σᵢ xᵢ + Σᵢ xᵢ².
            </Typography.Text>
            <Typography.Text>
              Поскольку Σᵢ xᵢ = m · x̄, получаем квадрат m · (x − x̄)² и остаток,
              не зависящий от <Notation>{"x"}</Notation>. С координатой{" "}
              <Notation>{"y"}</Notation> происходит то же самое.
            </Typography.Text>
          </ProofDisclosure>
          <CodeBlock
            collapsible={false}
            code={
              'def center_squared(cluster):\n    sum_x = 0.0\n    sum_y = 0.0\n    for x, y in cluster:\n        sum_x += x\n        sum_y += y\n    mean_x = sum_x / len(cluster)\n    mean_y = sum_y / len(cluster)\n    best_point = cluster[0]\n    best_value = float("inf")\n    for point in cluster:\n        x, y = point\n        value = (x - mean_x) ** 2 + (y - mean_y) ** 2\n        if value < best_value:\n            best_value = value\n            best_point = point\n    return best_point'
            }
            label={"Функция center_squared"}
            language="python"
          />
          <CodeBlock
            code={
              "cluster = [(0, 0), (1, 0), (2, 0), (3, 0), (100, 0)]\nprint(center_squared(cluster), center_sum(cluster))"
            }
            label={"Сумма квадратов и сумма расстояний"}
            language="python"
            output={"(3, 0) (2, 0)"}
          />
          <Typography.Text>
            Здесь два прохода по точкам вместо перебора всех пар, и ответ при
            этом точный — он следует из формулы. Но только для суммы{" "}
            <strong>квадратов</strong> обычных расстояний: для суммы самих
            расстояний или для манхэттенской формулы ближайшая к средней точка
            может оказаться не центром — пример был в подтеме 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochka-navedeniya",
      navLabel: "Точка наведения",
      explanation: (
        <>
          <Typography.Text>
            Как выбрать звезду, на которую навести телескоп, чтобы в поле зрения
            попало больше всего звёзд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Для каждой звезды-кандидата посчитать, сколько других звёзд ближе
              радиуса R, и взять кандидата с наибольшим числом, а при равенстве
              — ближайшего к началу координат.
            </strong>{" "}
            Такая задача есть в подборках: поле зрения — круг радиуса R, звёзды
            на самой границе не видны, поэтому неравенство строгое.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clAim}
            caption={
              <>
                У четырёх звёзд по два соседа ближе 1,5 — это наибольшее число.
                Из них к началу координат ближе всех (1; 1): она и есть точка
                наведения.
              </>
            }
          />
          <Typography.Text>
            Это тот же перебор кандидатов, только для кандидата считают не
            сумму, а количество, и правил выбора два. Оба правила укладываются в
            один ключ:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from math import dist\n\nstars = [(1, 1), (2, 1), (2, 2), (5, 4), (6.2, 4.4), (5.6, 5.6)]\nR = 1.5\n\n\ndef visible(c):\n    return sum(dist(c, s) < R for s in stars) - 1\n\n\naim = min(stars, key=lambda c: (-visible(c), dist(c, (0, 0))))\nprint([visible(c) for c in stars])\nprint(aim)"
            }
            label={"Точка наведения"}
            language="python"
            output={"[2, 2, 2, 1, 2, 1]\n(1, 1)"}
          />
          <ul>
            <li>
              <Notation>{"sum(dist(c, s) < R for s in stars)"}</Notation>{" "}
              складывает истинные сравнения как единицы. Сама звезда тоже
              попадает в счёт — расстояние 0 — поэтому вычитаем 1. Так звёзды с
              одинаковыми координатами посчитаются верно.
            </li>
            <li>
              Ключ — пара: сначала <Notation>{"-visible(c)"}</Notation> (чем
              больше видно, тем меньше ключ), при равенстве — расстояние до
              начала координат. <Notation>{"min"}</Notation> сравнивает пары по
              порядку.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "korrelyaciya",
      navLabel: "Корреляция",
      explanation: (
        <>
          <Typography.Text>
            Как проверить, что два параметра измерений связаны — растёт один,
            растёт и другой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Посчитать коэффициент корреляции Пирсона r: он лежит от −1 до 1, и
              чем ближе |r| к 1, тем точнее точки ложатся на прямую.
            </strong>{" "}
            r около 0 — облако без наклона, r {"<"} 0 — один параметр растёт, а
            другой убывает. В подборках связь называют сильной, если |r| ≥ 0,9.
          </Typography.Text>
          <Typography.Text>
            r = Σ(xᵢ − x̄)(yᵢ − ȳ) / √(Σ(xᵢ − x̄)² · Σ(yᵢ − ȳ)²), где x̄ и ȳ —
            средние. Для точек (1; 2), (2; 3), (3; 5), (4; 4), (5; 6): x̄ = 3, ȳ
            = 4, отклонения x — −2, −1, 0, 1, 2, отклонения y — −2, −1, 1, 0, 2.
            Сумма произведений 4 + 1 + 0 + 0 + 4 = 9, суммы квадратов 10 и 10, r
            = 9 / √100 = 0,9:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def pearson(points):\n    n = len(points)\n    mx = sum(p[0] for p in points) / n\n    my = sum(p[1] for p in points) / n\n    sxy = sum((p[0] - mx) * (p[1] - my) for p in points)\n    sxx = sum((p[0] - mx) ** 2 for p in points)\n    syy = sum((p[1] - my) ** 2 for p in points)\n    return sxy / (sxx * syy) ** 0.5\n\n\nprint(pearson([(1, 2), (2, 3), (3, 5), (4, 4), (5, 6)]))"
            }
            label={"Коэффициент Пирсона"}
            language="python"
            output={"0.9"}
          />
          <Typography.Text>
            В файле <Notation>{"27-9.txt"}</Notation> записаны результаты трёх
            экспериментов вперемешку. На рисунке они разделены пустыми полосами
            — делим границами и считаем r для каждого:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clCorr}
            caption={
              <>
                Три эксперимента файла 27-9.txt. У первого и третьего точки
                вытянуты вдоль прямой — сильная связь, у среднего облако без
                наклона.
              </>
            }
          />
          <CodeBlock
            collapsible={false}
            code={
              'points = read_points("27-9.txt")\ngroups = [[], [], []]\nfor x, y in points:\n    if x < 15:\n        groups[0].append((x, y))\n    elif x < 35:\n        groups[1].append((x, y))\n    else:\n        groups[2].append((x, y))\nfor g in groups:\n    print(len(g), round(pearson(g), 3))'
            }
            label={"Корреляция трёх экспериментов"}
            language="python"
            output={"60 0.941\n50 -0.016\n70 0.918"}
          />
          <Typography.Text>
            Сильная связь — у первого и третьего экспериментов: в них 60 + 70 =
            130 измерений. В Python 3.10 и новее то же число считает{" "}
            <Notation>{"statistics.correlation(xs, ys)"}</Notation>. В подборке
            эксперименты разделяют цепочками соседей с порогом из условия —
            функцией <Notation>{"split_clusters"}</Notation> из начала урока.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vybrosy",
      navLabel: "Выбросы по квартилям",
      explanation: (
        <>
          <Typography.Text>
            Как найти выбросы — случайные ошибочные измерения, которые надо
            убрать перед расчётом?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Методом межквартильного размаха: найти квартили Q1 и Q3, размах
              IQR = Q3 − Q1 и считать выбросом всё, что дальше 1,5 · IQR от
              квартилей.
            </strong>{" "}
            Квартили считают так, как сказано в условии. В подборке: Q1 —
            медиана нижней половины упорядоченных значений, Q3 — медиана
            верхней; при нечётном количестве срединное значение не входит ни в
            одну половину.
          </Typography.Text>
          <Typography.Text>
            Значения 3, 9, 10, 10, 11, 12, 12, 13, 14, 29: нижняя половина 3, 9,
            10, 10, 11 — Q1 = 10, верхняя 12, 12, 13, 14, 29 — Q3 = 13. IQR = 3,
            границы 10 − 4,5 = 5,5 и 13 + 4,5 = 17,5:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clIqr}
            caption={
              <>
                Прямоугольник — от Q1 до Q3, пунктир — границы 5,5 и 17,5. За
                ними два выброса: 3 и 29.
              </>
            }
          />
          <CodeBlock
            collapsible={false}
            code={
              "def median(v):\n    n = len(v)\n    if n % 2:\n        return v[n // 2]\n    return (v[n // 2 - 1] + v[n // 2]) / 2\n\n\ndef quartiles(values):\n    v = sorted(values)\n    n = len(v)\n    return median(v[:n // 2]), median(v[(n + 1) // 2:])\n\n\ndata = [12, 3, 10, 14, 11, 29, 9, 12, 13, 10]\nq1, q3 = quartiles(data)\niqr = q3 - q1\nlo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\nprint(q1, q3, lo, hi)\nprint([v for v in data if v < lo or v > hi])"
            }
            label={"Квартили и выбросы"}
            language="python"
            output={"10 13 5.5 17.5\n[3, 29]"}
          />
          <Typography.Text>
            Срез <Notation>{"v[:n // 2]"}</Notation> — нижняя половина,{" "}
            <Notation>{"v[(n + 1) // 2:]"}</Notation> — верхняя: при нечётном n
            срединный элемент пропускается. Если точки двумерные, границы
            считают отдельно для x и для y, и точка — выброс, когда{" "}
            <strong>хотя бы одна</strong> её координата за границей.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Почему не statistics.quantiles"
          >
            <Typography.Text>
              Квартили можно считать по-разному. Функция{" "}
              <Notation>{"statistics.quantiles(data, n=4)"}</Notation> для тех
              же данных даёт 9,75 и 13,25 — другие границы и, в других данных,
              другие выбросы. Поэтому квартили пишут по описанию из условия.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "uskoreniya",
      navLabel: "Ускорения перебора",
      explanation: (
        <>
          <Typography.Text>
            Можно ли искать центр быстрее, не рискуя ответом?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Да: считать каждое расстояние один раз и прибавлять его сразу к
              двум суммам, а кандидата бросать, как только его сумма догнала
              лучшую.
            </strong>{" "}
            В основном переборе d(A, B) считается дважды — когда кандидат A и
            когда кандидат B. Но d(A, B) = d(B, A).
          </Typography.Text>
          <Typography.Text>
            Для этого создаём отдельную сумму для каждой точки:{" "}
            <Notation>{"totals = [0.0] * len(cluster)"}</Notation>. Если точек
            четыре, получится <Notation>{"[0.0, 0.0, 0.0, 0.0]"}</Notation>.
            Полная функция:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def center_sum_pairs(cluster):\n    n = len(cluster)\n    totals = [0.0] * n\n    for i in range(n):\n        for j in range(i + 1, n):\n            d = dist(cluster[i], cluster[j])\n            totals[i] += d\n            totals[j] += d\n    best_index = totals.index(min(totals))\n    return cluster[best_index]"
            }
            label={"Функция center_sum_pairs"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"range(n)"}</Notation> создаёт последовательность номеров
            0, 1, 2, …, n − 1. Внутренний цикл начинается с{" "}
            <Notation>{"i + 1"}</Notation>, поэтому перебираются только пары, в
            которых второй номер больше первого. Для четырёх точек это (0, 1),
            (0, 2), (0, 3), (1, 2), (1, 3), (2, 3).
          </Typography.Text>
          <Typography.Text>
            Пара <Notation>{"(1, 0)"}</Notation> не нужна: она уже учтена как{" "}
            <Notation>{"(0, 1)"}</Notation>. Расстояние от точки до самой себя
            тоже не вычисляется.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clPairsGrid4}
            caption={
              <>
                Все пары номеров четырёх точек: нужны только 6 клеток над
                диагональю. Диагональ — расстояние до себя, под ней — те же пары
                в обратном порядке.
              </>
            }
          />
          <Typography.Text>
            Число различных пар — m(m − 1) / 2, примерно вдвое меньше исходных
            m². После завершения циклов <Notation>{"min(totals)"}</Notation>{" "}
            находит наименьшую сумму,{" "}
            <PythonTerm term="listops">
              <Notation>{"totals.index(...)"}</Notation>
            </PythonTerm>{" "}
            — номер её первого появления, и по этому номеру возвращаем исходную
            точку <Notation>{"cluster[best_index]"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"print(center_sum_pairs(cluster), center_sum_pairs(line))"}
            label={"Парный подсчёт на двух кластерах"}
            language="python"
            output={"(2, 0) (2, 0)"}
          />
          <Typography.Text>
            Порядок роста остаётся квадратичным, но вычислений расстояния
            становится меньше. Таблица всех попарных расстояний не нужна —
            хватает списка сумм длины m.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Досрочный отказ от кандидата">
            <Typography.Text>
              Второе точное ускорение — досрочно прекращать проверку заведомо
              проигравшего кандидата. Допустим, для уже проверенной точки сумма
              равна 500. Для нового кандидата посчитана только часть расстояний,
              а сумма уже равна 520.
            </Typography.Text>
            <Typography.Text>
              Оставшиеся расстояния неотрицательны. Следовательно, итоговая
              сумма <strong>не станет меньше 520</strong> и не сможет улучшить
              результат 500. Можно остановить внутренний цикл —{" "}
              <PythonTerm term="break">
                <Notation>{"break"}</Notation>
              </PythonTerm>{" "}
              завершает ближайший цикл, внутри которого находится, здесь —
              внутренний. Запусти по шагам на двух точках и посмотри, на каком
              кандидате срабатывает <Notation>{"break"}</Notation>:
            </Typography.Text>
            <CodeRunner
              {...lessonMedia.runCenterSumEarly}
              label={"Досрочный отказ по шагам"}
            />
            <Typography.Text>
              Первый кандидат (0; 0) даёт сумму 0 + 5 = 5. У второго, (5; 0),
              уже первое слагаемое 5 не меньше лучшей суммы 5 — внутренний цикл
              прерывается, второе слагаемое не считается. Равный результат не
              заменяет найденную точку.
            </Typography.Text>
            <Typography.Text>
              Почему ускорение точное? Потому что мы отбрасываем кандидата
              только после доказательства, что он уже не может улучшить ответ.
              Это отличается от предположения «точка выглядит слишком далёкой,
              поэтому проверять её не будем».
            </Typography.Text>
            <Typography.Text>
              Такое ускорение не меняет худший квадратичный порядок работы и не
              обязано давать одинаковый выигрыш на любых данных.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            А вот проверять только часть точек — ближайшие к средней, каждую
            десятую, случайные — нельзя: если центр не попал в проверенные,
            программа его не найдёт.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sosedi-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Цепочки соседей",
                note: <>группа — всё, что связано шагами не длиннее ε</>,
              },
              {
                key: "Порог",
                note: <>больше шагов внутри, меньше промежутков между</>,
              },
              {
                key: "Другие центры",
                note: <>минимакс, антицентр, ближайшая к средней точке</>,
              },
              {
                key: "Точка наведения",
                note: (
                  <>
                    ключ{" "}
                    <Notation>{"(-видимых, до начала координат)"}</Notation>
                  </>
                ),
              },
              {
                key: "Корреляция",
                note: <>r Пирсона; сильная связь — |r| ≥ 0,9</>,
              },
              {
                key: "Выбросы",
                note: <>за пределами Q1 − 1,5 · IQR и Q3 + 1,5 · IQR</>,
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
          Даны точки <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(0.8, 0)"}</Notation>, <Notation>{"(1.6, 0)"}</Notation>.
          Сколько связных групп получится при пороге 0,9 и при пороге 0,7?
        </>
      ),
      reveal: (
        <>
          При 0,9 — одна: крайние точки связаны цепочкой через среднюю. При 0,7
          — три: ни одна пара не проходит порог.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Точки <Notation>{"(0, 0)"}</Notation>, <Notation>{"(1, 0)"}</Notation>
          , <Notation>{"(2, 0)"}</Notation>, <Notation>{"(5, 0)"}</Notation>,{" "}
          <Notation>{"(6, 0)"}</Notation>. Сколько групп при пороге 1, 2,9 и 3?
        </>
      ),
      reveal: (
        <>
          При 1 и при 2,9 — две группы: 0–2 и 5–6. При 3 — одна: промежуток от 2
          до 5 равен 3.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Среди точек <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(2, 0)"}</Notation>, <Notation>{"(3, 0)"}</Notation>,{" "}
          <Notation>{"(7, 0)"}</Notation>, <Notation>{"(12, 0)"}</Notation>{" "}
          найди центр по минимаксу и центр по наименьшей сумме расстояний.
        </>
      ),
      reveal: (
        <>
          По минимаксу — <Notation>{"(7, 0)"}</Notation>: самая далёкая точка на
          расстоянии 7. По сумме — <Notation>{"(3, 0)"}</Notation>: сумма 17.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Значения 2, 4, 5, 5, 6, 7, 8, 30. Найди Q1, Q3, границы выбросов и
          сами выбросы — квартили как медианы половин.
        </>
      ),
      reveal: (
        <>Q1 = 4,5, Q3 = 7,5, IQR = 3, границы 0 и 12 — выброс один: 30.</>
      ),
    },
  ],
};

export default content;
