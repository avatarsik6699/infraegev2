import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { simpleAlgorithmsLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./simple-algorithms.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const simpleAlgorithmsLesson = defineLesson({
  ...simpleAlgorithmsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Выполнять команды Черепахи по шагам и следить за положением, направлением и хвостом",
    "Строить рисунок программы на turtle в масштабе с сеткой целочисленных точек",
    "Различать точки внутри, на границе и снаружи и считать их по рядам",
    "Находить пересечение и объединение нескольких фигур",
    "Считать точки фигур с наклонными сторонами по столбцам и проверять спорные точки",
    "Для редких задач — параметр в команде, посещения, подсчёт программой и дуги (дополнительные уроки)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "sostoyanie-i-komandy",
      title: "Состояние и точное исполнение",
      lead: "Положение, направление и перо; вперёд и назад, повороты, повторения и таблица состояния после каждой команды.",
      conceptIds: [
        "kak-ustroena-tema-6",
        "sostoyanie-cherepahi",
        "koordinaty",
        "celochislennye-tochki",
        "dvizhenie-i-povorot",
        "napravlenie-kak-ugol",
        "ugol-povorota-i-ugol-figury",
        "modul-turtle",
        "nachalnoe-napravlenie",
        "povtori-i-cikl",
        "otstupy",
        "neskolko-storon-za-povtorenie",
        "povtornyj-prohod",
        "konechnoe-sostoyanie",
        "chertezhnik",
        "sostoyanie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              <Typography.Text>
                Проследи движение без построения фигуры.
              </Typography.Text>
              <Typography.Text>
                Начальное положение (0;0), направление вверх.
              </Typography.Text>
              <CodeBlock
                code={
                  "Вперёд 5\nНаправо 90\nВперёд 3\nНазад 1\nНалево 90\nВперёд 2"
                }
                label={"Алгоритм для исполнителя"}
                language="text"
              />
              <Typography.Text>
                Определи конечные координаты и направление головы.
              </Typography.Text>
            </>
          ),
          reveal: <>(2; 7), голова вверх.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Начальное положение (0; 0), голова вверх. Выполни: Вперёд 4,
              Налево 90, Вперёд 3, Назад 5, Направо 90. Где Черепаха и куда она
              смотрит?
            </>
          ),
          reveal: (
            <>
              (2; 4), голова вверх: (0; 4), затем голова влево, (−3; 4), «Назад
              5» — вправо до (2; 4), голова всё ещё влево, «Направо 90» — вверх.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Начальное положение (0; 0), голова вверх. Где окажется Черепаха и
              куда будет смотреть после «Повтори 3 [Вперёд 2 Направо 90]»?
              Нарисован ли замкнутый квадрат?
            </>
          ),
          reveal: (
            <>
              (2; 0), голова влево: нарисованы только три стороны квадрата 2 ×
              2, четвёртая — нет.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Переведи на Python алгоритм «Повтори 3 [Вперёд 4 Направо 120]» с
              началом вверх. Какую фигуру он рисует?
            </>
          ),
          reveal: (
            <>
              <Notation>{"t.setheading(90)"}</Notation>, затем{" "}
              <Notation>{"for _ in range(3):"}</Notation> и в блоке{" "}
              <Notation>{"t.forward(4)"}</Notation>,{" "}
              <Notation>{"t.right(120)"}</Notation> — равносторонний треугольник
              со стороной 4.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              <Typography.Text>
                Что нарисует программа и где будет голова?
              </Typography.Text>
              <CodeBlock
                code={
                  "t.setheading(90)\nfor _ in range(4):\n    t.forward(5)\nt.right(90)"
                }
                label={"Что нарисует программа и где будет голова?"}
                language="python"
              />
            </>
          ),
          reveal: (
            <>
              Вертикальный отрезок длиной 20 вверх (четыре раза по 5), голова в
              конце смотрит вправо: поворот вне цикла выполнился один раз.
            </>
          ),
        },
        {
          id: "zadacha-7",
          prompt: (
            <>
              Черепахе был дан для исполнения алгоритм «Повтори 5 [Вперёд 3
              Направо 90 Вперёд 2 Направо 90]». Начальное положение (0; 0),
              голова вверх. Определите координаты Черепахи после выполнения
              алгоритма и направление её головы.
            </>
          ),
          reveal: (
            <>
              (2; 3), голова вниз: каждое повторение — две стороны
              прямоугольника 2 × 3, пять повторений — два с половиной обхода.
            </>
          ),
        },
        {
          id: "zadacha-9",
          prompt: (
            <>
              Чертёжник из (0; 0) выполнил: Сместиться на (6, 0), Сместиться на
              (−6, 5), Сместиться в точку (0, 0). Какие точки — вершины
              нарисованной фигуры?
            </>
          ),
          reveal: (
            <>
              (0; 0), (6; 0), (0; 5): второе смещение ведёт из (6; 0) в (0; 5),
              третье — обратно в начало.
              {"<"}details class="proof" markdown="1"{">"}
              {"<"}summary{">"}Разбор задачи 1 подробно{"<"}/summary{">"}
            </>
          ),
        },
      ],
    },
    {
      slug: "postroenie-i-reshetka",
      title: "Рисунок и целочисленная решётка",
      lead: "Программа рисунка: масштаб, координаты задачи против экранных, сетка целых точек с поднятым пером и проверка положения до неё.",
      conceptIds: [
        "risunok-kak-proverka",
        "masshtab",
        "masshtab-i-koordinaty",
        "pervaya-programma",
        "sluzhebnye-komandy",
        "setka-tochek",
        "peremennye-cikla",
        "hvost-pered-setkoj",
        "odin-masshtab",
        "diapazony-setki",
        "setka-ne-schitaet",
        "risunok-ne-pomeshchaetsya",
        "gde-zapuskat",
        "gotovyj-shablon",
        "postroenie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              <Typography.Text>Исправь нанесение сетки.</Typography.Text>
              <Typography.Text>Фигура построена с масштабом:</Typography.Text>
              <CodeBlock
                code={
                  'k = 25\n\nfor _ in range(4):\n    t.forward(6 * k)\n    t.right(90)\n\nfor x in range(-2, 9):\n    for y in range(-2, 9):\n        t.goto(x, y)\n        t.dot(3, "red")'
                }
                label={"Фигура построена с масштабом"}
                language="python"
              />
              <Typography.Text>
                Найди две ошибки в части нанесения точек.
              </Typography.Text>
            </>
          ),
          reveal: (
            <>
              Перед сеткой нужно поднять перо и использовать тот же масштаб:{" "}
              <Notation>{"t.penup()"}</Notation> и{" "}
              <Notation>{"t.goto(x * k, y * k)"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Какая из строк ошибочна при масштабе k:{" "}
              <Notation>{"t.forward(5 * k)"}</Notation>,{" "}
              <Notation>{"t.right(90 * k)"}</Notation>,{" "}
              <Notation>{"t.goto(2 * k, 3 * k)"}</Notation>? Почему?
            </>
          ),
          reveal: (
            <>
              <Notation>{"t.right(90 * k)"}</Notation>: угол не масштабируется,
              иначе меняется сам алгоритм.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Фигура занимает область −3 ≤ x ≤ 4, −2 ≤ y ≤ 5. Какие диапазоны{" "}
              <Notation>{"range"}</Notation> нужны, чтобы сетка охватила её с
              запасом в одну точку с каждой стороны?
            </>
          ),
          reveal: (
            <>
              <Notation>{"range(-4, 6)"}</Notation> для x и{" "}
              <Notation>{"range(-3, 7)"}</Notation> для y.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              Почему печать <Notation>{"t.xcor() / k"}</Notation> после
              нанесения сетки не показывает конец алгоритма?
            </>
          ),
          reveal: (
            <>
              Сетка рисуется перемещениями <Notation>{"goto"}</Notation>, и
              Черепаха оказывается в последней точке сетки.
            </>
          ),
        },
      ],
    },
    {
      slug: "granica-i-velichiny",
      title: "Точки, граница, площадь и периметр",
      lead: "Точки строго внутри и на границе, точки отрезка и открытой линии, площадь, периметр и расстояние — разные ответы.",
      conceptIds: [
        "chto-sprashivaet-vopros",
        "vnutri-na-granice-snaruzhi",
        "podschet-po-ryadam",
        "tochki-i-promezhutki",
        "pryamougolnik-po-osyam",
        "tochki-ploshchad-perimetr",
        "nezamknutaya-liniya",
        "rasstoyanie-i-dlina-puti",
        "ploshchad-treugolnika",
        "granica-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              <Typography.Text>
                Разбери повторения, которые заканчиваются после дополнительного
                обхода части контура.
              </Typography.Text>
              <Typography.Text>
                Начальное положение (0;0), направление вверх.
              </Typography.Text>
              <CodeBlock
                code={
                  "Повтори 3 [\n    Вперёд 4\n    Направо 90\n    Вперёд 7\n    Направо 90\n]"
                }
                label={"Алгоритм для исполнителя"}
                language="text"
              />
              <Typography.Text>Определи:</Typography.Text>
              <ul>
                <li>какую область ограничивает рисунок;</li>
                <li>количество целочисленных точек строго внутри;</li>
                <li>количество вместе с границей;</li>
                <li>конечное положение и направление.</li>
              </ul>
            </>
          ),
          reveal: (
            <>
              Прямоугольник 7 × 4; строго внутри 18, с границей 40; Черепаха в
              (7; 4), голова вниз.
            </>
          ),
        },
      ],
    },
    {
      slug: "neskolko-figur",
      title: "Пересечение, объединение и части",
      lead: "Переход ко второй фигуре, пересечение и объединение с границей и без, «ровно в одной», касание по стороне и три фигуры.",
      conceptIds: [
        "dve-figury",
        "perehod-mezhdu-figurami",
        "peresechenie",
        "granicy-peresecheniya",
        "obedinenie",
        "tolko-v-odnoj-figure",
        "tri-figury",
        "peresechenie-po-granice",
        "granica-obedineniya",
        "figury-itogo",
      ],
    },
    {
      slug: "naklonnaya-geometriya",
      title: "Наклонные стороны и точная граница",
      lead: "Вершины наклонных сторон, точные неравенства вместо рисунка, целые точки по горизонтальным строкам и разбиение невыпуклой фигуры.",
      conceptIds: [
        "naklonnye-storony",
        "naklon-na-setke",
        "polozhenie-treugolnika",
        "tochki-mezhdu-naklonnymi",
        "granica-treugolnika",
        "sedmoe-povtorenie",
        "naklonnyj-chetyrehugolnik",
        "spornaya-tochka",
        "pogreshnost-koordinat",
        "proverka-konechnogo-polozheniya",
        "nevypuklaya-figura",
        "naklon-itogo",
      ],
    },
    {
      slug: "obratnyj-vopros-i-poseshcheniya",
      title: "Обратные вопросы и повторные посещения",
      lead: "Наименьшая сторона по числу точек, положение второй фигуры для наибольшего пересечения и число повторно пройденных точек.",
      level: "advanced",
      conceptIds: [
        "obratnyj-vopros",
        "chislo-tochek-ot-parametra",
        "strogij-i-nestrogij-porog",
        "naibolshee-peresechenie",
        "figura-ne-pomeshchaetsya",
        "poseshcheniya",
        "schetchik-poseshchenij",
        "obratnyj-itogo",
      ],
    },
    {
      slug: "tochnyj-podschet-i-dugi",
      title: "Подсчёт точек программой и дуги",
      lead: "Условие принадлежности в коде, перебор целых узлов, общие формулы с округлением и команда дуги с центром и радиусом.",
      level: "advanced",
      conceptIds: [
        "podschet-programmoj",
        "uslovie-prinadlezhnosti",
        "koordinaty-bez-masshtaba",
        "dva-pryamougolnika",
        "treugolnik-programmoj",
        "necelye-granicy",
        "proizvolnyj-povorot",
        "komanda-dugi",
        "krivolinejnaya-granica",
        "dugi-itogo",
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-6",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Задание 6 удобно понимать как две последовательные задачи: сначала
              точно выполнить алгоритм Черепахи, затем исследовать получившийся
              рисунок.
            </strong>{" "}
            Буквальное исполнение команд нужно во всех 54 задачах подборок;
            основные подтемы 1–5 закрывают 47 из них, в том числе все задачи
            реальных экзаменов.
          </Typography.Text>
          <Typography.Text>
            В этой подтеме выполняем команды по шагам и переводим их на Python —
            главный пример: прямоугольник 8 × 6 из алгоритма «Повтори 2 [Вперёд
            6 Направо 90 Вперёд 8 Направо 90]». Формулировка вопроса здесь так
            же важна, как сам алгоритм: в задачах встречаются точки только
            внутри фигуры и точки внутри вместе с границей — это разберём в
            подтеме 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyanie-cherepahi",
      navLabel: "Состояние Черепахи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Черепаха выполняет команды буквально и хранит своё текущее
              состояние.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В информатике *исполнитель* — это объект, который умеет выполнять
            определённые команды. В нашем случае исполнитель называется
            Черепахой.
          </Typography.Text>
          <Typography.Text>
            Представь, что по листу бумаги перемещается маленькая стрелка. У неё
            есть:
          </Typography.Text>
          <ul>
            <li>положение на листе;</li>
            <li>направление, в которое она смотрит;</li>
            <li>перо, которое можно опустить или поднять.</li>
          </ul>
          <Typography.Text>
            Когда перо опущено, перемещение оставляет линию. Когда перо поднято,
            Черепаха перемещается без линии.
          </Typography.Text>
          <Typography.Text>
            В условиях ЕГЭ вместо слова «перо» обычно используется слово{" "}
            <strong>«хвост»</strong>. Для понимания задачи это одно и то же.
          </Typography.Text>
          <Typography.Text>
            Чтобы описать состояние Черепахи, нужно знать четыре вещи:
          </Typography.Text>
          <LessonTable
            label={"Чтобы описать состояние Черепахи, нужно знать четыре вещи"}
            columns={[{ label: "Что нужно знать" }, { label: "Пример" }]}
            rows={[
              ["Координату по горизонтали", "x=3"],
              ["Координату по вертикали", "y=5"],
              ["Направление головы", "Вверх"],
              ["Состояние хвоста", "Опущен"],
            ]}
          />
          <Typography.Text>
            Почему одного положения недостаточно?
          </Typography.Text>
          <Typography.Text>
            Допустим, две Черепахи находятся в одной точке (3;5). Одна смотрит
            вверх, другая вправо. После команды{" "}
            <Notation>{"Вперёд 2"}</Notation> они окажутся в разных точках.
          </Typography.Text>
          <Typography.Text>
            Почему нужно помнить состояние хвоста?
          </Typography.Text>
          <Typography.Text>
            Две Черепахи могут пройти по одному маршруту, но одна нарисует
            линию, а другая — нет.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Алгоритм определяет не только маршрут, но и то, какие части
              маршрута становятся рисунком.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "koordinaty",
      navLabel: "Координаты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Координаты позволяют точно описывать положение на плоскости.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В задании используется система из двух числовых осей:
          </Typography.Text>
          <ul>
            <li>горизонтальная ось Ox;</li>
            <li>вертикальная ось Oy.</li>
          </ul>
          <Typography.Text>
            Они пересекаются в точке (0;0), которая называется{" "}
            <strong>началом координат</strong>.
          </Typography.Text>
          <Typography.Text>Направления положительных значений:</Typography.Text>
          <ul>
            <li>по Ox — вправо;</li>
            <li>по Oy — вверх.</li>
          </ul>
          <Typography.Text>
            Отрицательные значения идут в противоположные стороны.
          </Typography.Text>
          <Typography.Text>
            Точка (3;2) находится на 3 единицы правее и на 2 единицы выше начала
            координат.
          </Typography.Text>
          <Typography.Text>
            Точка (-4;1) находится на 4 единицы левее и на 1 единицу выше начала
            координат.
          </Typography.Text>
          <Typography.Text>
            Точка (2;-3) находится на 2 единицы правее и на 3 единицы ниже
            начала координат.
          </Typography.Text>
          <Typography.Text>
            В паре координат <strong>сначала записывается x, затем y</strong>.
          </Typography.Text>
          <Typography.Text>В условиях могут встретиться слова:</Typography.Text>
          <LessonTable
            label={"В условиях могут встретиться слова"}
            columns={[{ label: "Термин" }, { label: "Значение" }]}
            rows={[
              ["Ось абсцисс", "Ось Ox"],
              ["Ось ординат", "Ось Oy"],
              ["Положительное направление оси абсцисс", "Вправо"],
              ["Положительное направление оси ординат", "Вверх"],
            ]}
          />
          <Typography.Text>Например, фраза:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Голова направлена вдоль положительного направления оси ординат.
            </Typography.Text>
          </blockquote>
          <Typography.Text>означает:</Typography.Text>
          <blockquote>
            <Typography.Text>Черепаха смотрит вверх.</Typography.Text>
          </blockquote>
          <Typography.Text>
            Это нужно прочитать до написания программы. Начальное направление
            нельзя выбирать по привычке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "celochislennye-tochki",
      navLabel: "Целочисленные точки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Точка с целочисленными координатами — это точка, у которой обе
              координаты являются целыми числами.
            </strong>
          </Typography.Text>
          <Typography.Text>Целые числа:</Typography.Text>
          <Typography.Text>…,-3,-2,-1,0,1,2,3,…</Typography.Text>
          <Typography.Text>Поэтому подходят точки:</Typography.Text>
          <Typography.Text>(0;0), (2;5), (-3;4), (7;-1).</Typography.Text>
          <Typography.Text>Не подходят:</Typography.Text>
          <Typography.Text>(1,5;2), (3;0,7), (√3;4).</Typography.Text>
          <Typography.Text>
            Достаточно, чтобы хотя бы одна координата была нецелой, — и точка
            уже не соответствует условию.
          </Typography.Text>
          <Typography.Text>Обрати внимание:</Typography.Text>
          <ul>
            <li>ноль — целое число;</li>
            <li>отрицательные числа тоже целые;</li>
            <li>
              точки на осях могут учитываться, если формулировка задачи их
              допускает.
            </li>
          </ul>
          <Typography.Text>
            Иногда спрашивают количество точек{" "}
            <strong>с положительными целочисленными координатами</strong>. Тогда
            дополнительно требуется:
          </Typography.Text>
          <Typography.Text>
            x{">"}0, y{">"}0.
          </Typography.Text>
          <Typography.Text>
            При таком условии точки на осях уже не подходят.
          </Typography.Text>
          <Typography.Text>
            Если на плоскости отметить все точки с целыми координатами,
            получится регулярная сетка точек. Её называют{" "}
            <strong>целочисленной решёткой</strong>.
          </Typography.Text>
          <Typography.Text>
            Именно такую сетку мы будем наносить поверх рисунка Черепахи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dvizhenie-i-povorot",
      navLabel: "Движение и поворот",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Движение изменяет положение, а поворот изменяет направление.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим команды отдельно.</Typography.Text>
          <Typography.Text>
            <strong>
              Команда <Notation>{"Вперёд n"}</Notation> перемещает Черепаху
              туда, куда смотрит её голова.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если Черепаха находится в (2;3) и смотрит вверх, то после{" "}
            <Notation>{"Вперёд 4"}</Notation> она окажется в:
          </Typography.Text>
          <Typography.Text>(2;7).</Typography.Text>
          <Typography.Text>
            Координата x не изменилась. Координата y увеличилась на 4.
          </Typography.Text>
          <Typography.Text>
            Если из той же точки Черепаха смотрит вправо, результат будет:
          </Typography.Text>
          <Typography.Text>(6;3).</Typography.Text>
          <Typography.Text>Если вниз:</Typography.Text>
          <Typography.Text>(2;-1).</Typography.Text>
          <Typography.Text>Если влево:</Typography.Text>
          <Typography.Text>(-2;3).</Typography.Text>
          <Typography.Text>
            Слово «вперёд» связано с головой Черепахи. Оно не означает
            автоматически «вверх».
          </Typography.Text>
          <Typography.Text>
            <strong>
              Команда <Notation>{"Назад n"}</Notation> перемещает Черепаху в
              сторону, противоположную направлению головы.
            </strong>
          </Typography.Text>
          <Typography.Text>
            При этом голова остаётся направленной туда же.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <ol>
            <li>Черепаха смотрит вправо.</li>
            <li>
              Выполняет <Notation>{"Назад 3"}</Notation>.
            </li>
            <li>Перемещается на 3 единицы влево.</li>
            <li>Продолжает смотреть вправо.</li>
          </ol>
          <Typography.Text>
            Это существенно для следующей команды.
          </Typography.Text>
          <Typography.Text>
            Если затем выполнить <Notation>{"Вперёд 5"}</Notation>, Черепаха
            пойдёт вправо.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Команда <Notation>{"Направо m"}</Notation> поворачивает голову на
              m градусов по часовой стрелке.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Положение Черепахи при этом не меняется.
          </Typography.Text>
          <Typography.Text>Например, если она смотрела вверх:</Typography.Text>
          <LessonTable
            label={"Например, если она смотрела вверх"}
            columns={[{ label: "Команда" }, { label: "Новое направление" }]}
            rows={[
              ["Направо 90", "Вправо"],
              ["Направо 180", "Вниз"],
              ["Направо 270", "Влево"],
              ["Направо 360", "Снова вверх"],
            ]}
          />
          <Typography.Text>
            <strong>
              Команда <Notation>{"Налево m"}</Notation> поворачивает голову на m
              градусов против часовой стрелки.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если Черепаха смотрела вверх, после{" "}
            <Notation>{"Налево 90"}</Notation> она будет смотреть влево.
          </Typography.Text>
          <Typography.Text>
            Поворот выполняется <strong>от текущего направления</strong>.
            Поэтому одна и та же команда может давать разные итоговые
            направления.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <ul>
            <li>смотрела вверх, повернула направо на 90° — смотрит вправо;</li>
            <li>смотрела вправо, повернула направо на 90° — смотрит вниз.</li>
          </ul>
          <Typography.Text>
            <strong>
              Команды поднятия и опускания хвоста меняют только режим рисования.
            </strong>
          </Typography.Text>
          <Typography.Text>Они сами по себе:</Typography.Text>
          <ul>
            <li>не перемещают Черепаху;</li>
            <li>не поворачивают её;</li>
            <li>не стирают уже нарисованное.</li>
          </ul>
        </>
      ),
    },
    {
      id: "napravlenie-kak-ugol",
      navLabel: "Направление как угол",
      explanation: (
        <>
          <Typography.Text>
            <strong>В Python направление удобно описывать углом.</strong>
          </Typography.Text>
          <Typography.Text>
            Во всех примерах дальше используется стандартный режим{" "}
            <Notation>{"turtle"}</Notation>.
          </Typography.Text>
          <Typography.Text>В нём направления задаются так:</Typography.Text>
          <LessonTable
            label={"В нём направления задаются так"}
            columns={[
              { label: "Направление" },
              { label: "Угол", numeric: true },
            ]}
            rows={[
              ["Вправо", "0°"],
              ["Вверх", "90°"],
              ["Влево", "180°"],
              ["Вниз", "270°"],
            ]}
          />
          <Typography.Text>
            Положительное изменение этого угла соответствует повороту против
            часовой стрелки.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <Typography.Text>0°+90°=90°,</Typography.Text>
          <Typography.Text>
            то есть из направления вправо получаем направление вверх.
          </Typography.Text>
          <Typography.Text>
            При правом повороте угол уменьшается:
          </Typography.Text>
          <Typography.Text>90°-90°=0°.</Typography.Text>
          <Typography.Text>
            Отрицательные значения можно заменить равнозначными положительными.
            Например:
          </Typography.Text>
          <Typography.Text>-90°=270°</Typography.Text>
          <Typography.Text>в смысле направления.</Typography.Text>
          <Typography.Text>
            Оба угла обозначают направление вниз.
          </Typography.Text>
          <Typography.Text>
            Полный оборот составляет 360°, поэтому:
          </Typography.Text>
          <Typography.Text>30°, 390°, -330°</Typography.Text>
          <Typography.Text>задают одно направление.</Typography.Text>
          <Typography.Text>
            <strong>
              По умолчанию новая Черепаха в стандартном режиме Python смотрит
              вправо.
            </strong>{" "}
            Если в условии указано направление вверх, его нужно установить в
            программе. Соответствие направлений и поведение команд описаны в
            документации Python.{" "}
            <ExternalLink href="https://docs.python.org/3/library/turtle.html">
              Python 3.15.0 documentation
            </ExternalLink>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ugol-povorota-i-ugol-figury",
      navLabel: "Угол поворота и угол фигуры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Угол поворота Черепахи и внутренний угол фигуры — разные величины.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Этот момент особенно важен для треугольников и наклонных
            четырёхугольников.
          </Typography.Text>
          <Typography.Text>
            Внутренний угол фигуры образуют две стороны, если смотреть{" "}
            <strong>внутрь</strong> фигуры.
          </Typography.Text>
          <Typography.Text>
            Черепаха же приходит по одной стороне и поворачивает от направления,
            в котором продолжала бы двигаться прямо.
          </Typography.Text>
          <Typography.Text>
            Например, у равностороннего треугольника внутренний угол равен:
          </Typography.Text>
          <Typography.Text>60°.</Typography.Text>
          <Typography.Text>
            Но при обходе такого треугольника Черепаха поворачивает на:
          </Typography.Text>
          <Typography.Text>180°-60°=120°.</Typography.Text>
          <Typography.Text>Поэтому алгоритм:</Typography.Text>
          <CodeBlock
            code={"Повтори 3 [\n    Вперёд 8\n    Направо 120\n]"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>рисует равносторонний треугольник.</Typography.Text>
          <Typography.Text>
            Если написать поворот на 60°, получится другой рисунок.
          </Typography.Text>
          <Typography.Text>
            Для обычного правильного многоугольника — фигуры с одинаковыми
            сторонами и одинаковыми углами — полный обход даёт суммарный поворот
            360°.
          </Typography.Text>
          <Typography.Text>
            Если сторон n, одинаковый поворот на каждом шаге равен:
          </Typography.Text>
          <Typography.Text>360°/n.</Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <LessonTable
            label={"Например"}
            columns={[
              { label: "Фигура" },
              { label: "Число сторон", numeric: true },
              { label: "Поворот при обходе", numeric: true },
            ]}
            rows={[
              ["Равносторонний треугольник", "3", "120°"],
              ["Квадрат", "4", "90°"],
              ["Правильный шестиугольник", "6", "60°"],
              ["Правильный восьмиугольник", "8", "45°"],
            ]}
          />
          <Typography.Text>
            Эта связь применима к последовательному обходу такого
            многоугольника. В алгоритмах с несколькими перемещениями и разными
            поворотами внутри одного повторения рисунок нужно исследовать по
            самим командам.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "modul-turtle",
      navLabel: "Модуль turtle",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Модуль <Notation>{"turtle"}</Notation> — это готовый набор команд
              для управления Черепахой.
            </strong>
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="import">Модулем</PythonTerm> в Python называют
            набор заранее написанных инструментов, которые можно подключить к
            своей программе.
          </Typography.Text>
          <Typography.Text>
            Подключим <Notation>{"turtle"}</Notation> так:
          </Typography.Text>
          <CodeBlock
            code={"import turtle as t"}
            label={"Подключим turtle так"}
            language="python"
          />
          <Typography.Text>Разберём запись:</Typography.Text>
          <ul>
            <li>
              <Notation>{"import turtle"}</Notation> — подключить модуль{" "}
              <Notation>{"turtle"}</Notation>;
            </li>
            <li>
              <Notation>{"as t"}</Notation> — обращаться к нему под коротким
              именем <Notation>{"t"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            После этого команда движения записывается так:
          </Typography.Text>
          <CodeBlock
            code={"t.forward(100)"}
            label={"После этого команда движения записывается так"}
            language="python"
          />
          <Typography.Text>
            Точка между <Notation>{"t"}</Notation> и{" "}
            <Notation>{"forward"}</Notation> показывает, что мы используем
            команду из подключённого модуля.
          </Typography.Text>
          <Typography.Text>
            Число в скобках сообщает команде, насколько далеко нужно
            переместиться. Значения, передаваемые команде в скобках, называют{" "}
            <strong>аргументами</strong>.
          </Typography.Text>
          <Typography.Text>
            Для ЕГЭ основные соответствия такие:
          </Typography.Text>
          <LessonTable
            label={"Для ЕГЭ основные соответствия такие"}
            columns={[
              { label: "Команда в условии" },
              { label: "Команда Python" },
            ]}
            rows={[
              [
                "Вперёд n",
                <>
                  <Notation>{"t.forward(n)"}</Notation>
                </>,
              ],
              [
                "Назад n",
                <>
                  <Notation>{"t.backward(n)"}</Notation>
                </>,
              ],
              [
                "Направо m",
                <>
                  <Notation>{"t.right(m)"}</Notation>
                </>,
              ],
              [
                "Налево m",
                <>
                  <Notation>{"t.left(m)"}</Notation>
                </>,
              ],
              [
                "Поднять хвост",
                <>
                  <Notation>{"t.penup()"}</Notation>
                </>,
              ],
              [
                "Опустить хвост",
                <>
                  <Notation>{"t.pendown()"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            У некоторых команд есть короткие формы:
          </Typography.Text>
          <LessonTable
            label={"У некоторых команд есть короткие формы"}
            columns={[{ label: "Полная запись" }, { label: "Короткая запись" }]}
            rows={[
              [
                <>
                  <Notation>{"t.forward(n)"}</Notation>
                </>,
                <>
                  <Notation>{"t.fd(n)"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"t.backward(n)"}</Notation>
                </>,
                <>
                  <Notation>{"t.bk(n)"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"t.right(m)"}</Notation>
                </>,
                <>
                  <Notation>{"t.rt(m)"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"t.left(m)"}</Notation>
                </>,
                <>
                  <Notation>{"t.lt(m)"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"t.penup()"}</Notation>
                </>,
                <>
                  <Notation>{"t.up()"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"t.pendown()"}</Notation>
                </>,
                <>
                  <Notation>{"t.down()"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>Обе формы выполняют одно действие.</Typography.Text>
          <Typography.Text>
            На первых этапах полные названия удобнее: по ним легче увидеть смысл
            программы.
          </Typography.Text>
          <Typography.Text>В чужих решениях также встречается:</Typography.Text>
          <CodeBlock
            code={"from turtle import *"}
            label={"В чужих решениях также встречается"}
            language="python"
          />
          <Typography.Text>
            Тогда команды пишут без <Notation>{"t."}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"forward(100)\nright(90)"}
            label={"Тогда команды пишут без t"}
            language="python"
          />
          <Typography.Text>
            В наших примерах используется первый вариант:
          </Typography.Text>
          <CodeBlock
            code={"import turtle as t"}
            label={"В наших примерах используется первый вариант"}
            language="python"
          />
          <Typography.Text>
            Поэтому команды Черепахи будут иметь начало{" "}
            <Notation>{"t."}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nachalnoe-napravlenie",
      navLabel: "Начальное направление",
      explanation: (
        <>
          <Typography.Text>
            <strong>Начальное направление лучше устанавливать явно.</strong>
          </Typography.Text>
          <Typography.Text>
            Чтобы направить Черепаху вверх, используем:
          </Typography.Text>
          <CodeBlock
            code={"t.setheading(90)"}
            label={"Чтобы направить Черепаху вверх, используем"}
            language="python"
          />
          <Typography.Text>
            Название можно понимать как «установить направление».
          </Typography.Text>
          <Typography.Text>
            Эта команда задаёт конкретное направление независимо от того, куда
            Черепаха смотрела раньше.
          </Typography.Text>
          <Typography.Text>Сравни:</Typography.Text>
          <CodeBlock code={"t.left(90)"} label={"Сравни"} language="python" />
          <Typography.Text>и:</Typography.Text>
          <CodeBlock
            code={"t.setheading(90)"}
            label={"Код на Python: t.setheading(90)"}
            language="python"
          />
          <Typography.Text>Первая команда означает:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Повернуть налево на 90 градусов от текущего направления.
            </Typography.Text>
          </blockquote>
          <Typography.Text>Вторая:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Установить направление 90 градусов, то есть вверх.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Если Черепаха смотрит вправо, результат совпадёт.
          </Typography.Text>
          <Typography.Text>
            Если она смотрит влево, результат будет различаться:
          </Typography.Text>
          <ul>
            <li>
              после <Notation>{"left(90)"}</Notation> она будет смотреть вниз;
            </li>
            <li>
              после <Notation>{"setheading(90)"}</Notation> — вверх.
            </li>
          </ul>
          <Typography.Text>
            Для начала программы явная установка помогает избежать ошибки:
          </Typography.Text>
          <CodeBlock
            code={"t.setheading(90)"}
            label={
              "Для начала программы явная установка помогает избежать ошибки"
            }
            language="python"
          />
          <Typography.Text>
            Но дальше нужно выполнять повороты из условия. Если произвольно
            устанавливать направление в середине алгоритма, мы изменим его
            работу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "povtori-i-cikl",
      navLabel: "Повтори и цикл",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Запись «Повтори» переводится в Python с помощью цикла.
            </strong>
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="for">Цикл</PythonTerm> — это конструкция, которая
            несколько раз выполняет один и тот же блок команд.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <CodeBlock
            code={"Повтори 4 [\n    Вперёд 5\n    Направо 90\n]"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>переводится так:</Typography.Text>
          <CodeBlock
            code={"for i in range(4):\n    t.forward(5)\n    t.right(90)"}
            label={"переводится так"}
            language="python"
          />
          <Typography.Text>Запись:</Typography.Text>
          <CodeBlock code={"range(4)"} label={"Запись"} language="python" />
          <Typography.Text>даёт последовательность:</Typography.Text>
          <CodeBlock
            code={"0, 1, 2, 3"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            В ней четыре числа. Для каждого числа выполняются команды с
            отступом.
          </Typography.Text>
          <Typography.Text>
            Переменная <Notation>{"i"}</Notation> — имя, которому
            последовательно присваиваются эти значения:
          </Typography.Text>
          <ul>
            <li>
              при первом выполнении блока <Notation>{"i = 0"}</Notation>;
            </li>
            <li>
              при втором <Notation>{"i = 1"}</Notation>;
            </li>
            <li>
              при третьем <Notation>{"i = 2"}</Notation>;
            </li>
            <li>
              при четвёртом <Notation>{"i = 3"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            В этом алгоритме значение <Notation>{"i"}</Notation> не
            используется. Оно только сопровождает повторения.
          </Typography.Text>
          <Typography.Text>Поэтому часто пишут:</Typography.Text>
          <CodeBlock
            code={"for _ in range(4):\n    t.forward(5)\n    t.right(90)"}
            label={"Поэтому часто пишут"}
            language="python"
          />
          <Typography.Text>
            Символ <Notation>{"_"}</Notation> здесь — обычное имя переменной.
            Его принято использовать, когда само значение не понадобится.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Один проход по повторяемому блоку называют итерацией.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В нашем примере одна итерация — это:
          </Typography.Text>
          <CodeBlock
            code={"t.forward(5)\nt.right(90)"}
            label={"В нашем примере одна итерация — это"}
            language="python"
          />
          <Typography.Text>
            Сначала выполняются обе команды первого повторения. Потом обе
            команды второго. И так далее.
          </Typography.Text>
          <Typography.Text>
            Алгоритм не означает «сначала четыре раза двигаться, затем четыре
            раза поворачиваться».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otstupy",
      navLabel: "Отступы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Отступы в Python определяют, какие команды входят в повторение.
            </strong>
          </Typography.Text>
          <Typography.Text>Правильный перевод:</Typography.Text>
          <CodeBlock
            code={"for _ in range(4):\n    t.forward(5)\n    t.right(90)"}
            label={"Правильный перевод"}
            language="python"
          />
          <Typography.Text>
            Здесь и перемещение, и поворот повторяются четыре раза.
          </Typography.Text>
          <Typography.Text>Другая программа:</Typography.Text>
          <CodeBlock
            code={"for _ in range(4):\n    t.forward(5)\n\nt.right(90)"}
            label={"Другая программа"}
            language="python"
          />
          <Typography.Text>работает иначе:</Typography.Text>
          <ol>
            <li>Черепаха четыре раза идёт вперёд.</li>
            <li>Один раз поворачивается.</li>
          </ol>
          <Typography.Text>
            При начальном направлении вверх получится длинный вертикальный
            отрезок, после которого Черепаха повернёт голову.
          </Typography.Text>
          <Typography.Text>
            Поэтому при переводе команды <Notation>{"Повтори"}</Notation> нужно
            сохранить:
          </Typography.Text>
          <ul>
            <li>число повторений;</li>
            <li>порядок команд;</li>
            <li>состав повторяемого блока.</li>
          </ul>
          <Typography.Text>
            Удобно использовать четыре пробела для каждого уровня отступа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-storon-za-povtorenie",
      navLabel: "Несколько сторон за повторение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В одном повторении может рисоваться несколько сторон.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим алгоритм:</Typography.Text>
          <CodeBlock
            code={
              "Повтори 2 [\n    Вперёд 6\n    Направо 90\n    Вперёд 8\n    Направо 90\n]"
            }
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            Предположим, что Черепаха начинает в (0;0), смотрит вверх, хвост
            опущен.
          </Typography.Text>
          <Typography.Text>Первое повторение:</Typography.Text>
          <ol>
            <li>Поднимается на 6 единиц.</li>
            <li>Поворачивается вправо.</li>
            <li>Идёт вправо на 8 единиц.</li>
            <li>Поворачивается вниз.</li>
          </ol>
          <Typography.Text>Второе повторение:</Typography.Text>
          <ol>
            <li>Идёт вниз на 6 единиц.</li>
            <li>Поворачивается влево.</li>
            <li>Идёт влево на 8 единиц.</li>
            <li>Поворачивается вверх.</li>
          </ol>
          <Typography.Text>
            Получается прямоугольник шириной 8 и высотой 6.
          </Typography.Text>
          <Typography.Text>Перевод:</Typography.Text>
          <CodeBlock
            code={
              "for _ in range(2):\n    t.forward(6)\n    t.right(90)\n    t.forward(8)\n    t.right(90)"
            }
            label={"Перевод"}
            language="python"
          />
          <Typography.Text>
            В одной итерации рисуются две стороны. Поэтому двух повторений
            достаточно для четырёх сторон.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Количество повторений не обязано совпадать с количеством сторон
              фигуры.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Весь путь по командам — положение, голова и хвост после каждой
            команды — удобно пройти по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.ttState2690890}
            label={"Выполнение команд Черепахи: шаг за шагом"}
          />
        </>
      ),
    },
    {
      id: "povtornyj-prohod",
      navLabel: "Повторный проход",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Повторное прохождение по линии не создаёт новых математических
              точек.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим:</Typography.Text>
          <CodeBlock
            code={"Повтори 8 [\n    Вперёд 5\n    Направо 90\n]"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            Первые четыре повторения рисуют квадрат.
          </Typography.Text>
          <Typography.Text>
            Следующие четыре повторения проходят по тому же квадрату ещё раз.
          </Typography.Text>
          <Typography.Text>
            Если спрашивают количество точек внутри области, квадрат учитывается
            один раз.
          </Typography.Text>
          <Typography.Text>
            Но если бы спрашивали, какое расстояние прошла Черепаха, учитывались
            бы все восемь перемещений:
          </Typography.Text>
          <Typography.Text>8·5=40.</Typography.Text>
          <Typography.Text>Различай:</Typography.Text>
          <ul>
            <li>нарисованную геометрическую фигуру;</li>
            <li>весь пройденный путь.</li>
          </ul>
          <Typography.Text>
            Одна линия может быть пройдена несколько раз.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "konechnoe-sostoyanie",
      navLabel: "Конечное состояние",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Повторяющийся рисунок ещё не означает одинаковое конечное
              состояние Черепахи.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Это особенно важно, если после одного цикла начинается следующий
            алгоритм.
          </Typography.Text>
          <Typography.Text>
            Например, треугольник может быть полностью нарисован после трёх
            повторений. Но если в условии указано семь, нужно выполнить семь.
          </Typography.Text>
          <Typography.Text>
            После лишнего повторения Черепаха может оказаться в другой вершине и
            смотреть в другую сторону.
          </Typography.Text>
          <Typography.Text>
            Если сократить цикл ради «того же рисунка», следующий участок
            алгоритма начнётся неправильно.
          </Typography.Text>
          <Typography.Text>
            При анализе повторений полезно проверять:
          </Typography.Text>
          <ol>
            <li>Вернулась ли Черепаха в прежнюю точку?</li>
            <li>Вернулось ли прежнее направление?</li>
            <li>Совпадает ли состояние хвоста?</li>
          </ol>
          <Typography.Text>
            Если полностью совпало состояние и дальше выполняются те же команды,
            маршрут повторится.
          </Typography.Text>
          <Typography.Text>
            Сам по себе суммарный поворот 360° гарантирует восстановление
            направления, но не гарантирует возвращение в исходную точку.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <CodeBlock
            code={"Вперёд 5\nНаправо 90\nВперёд 7\nНаправо 270"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            даёт полный суммарный правый поворот 360°. Однако при старте вверх
            Черепаха заканчивает в (7;5), а не в (0;0).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chertezhnik",
      navLabel: "Чертёжник",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чертёжник перемещается не по направлению головы, а на заданный
              вектор или в заданную точку.
            </strong>{" "}
            В некоторых задачах вместо Черепахи — Чертёжник. Головы у него нет,
            поэтому нет и поворотов. Команда «Сместиться на (a, b)» прибавляет a
            к координате x и b к координате y; команда «Сместиться в точку (x,
            y)» переносит его в эту точку, где бы он ни был.
          </Typography.Text>
          <Typography.Text>
            Например, из (0; 0): «Сместиться на (3, 4)» — в (3; 4); «Сместиться
            на (−3, 0)» — в (0; 4); «Сместиться в точку (0, 0)» — обратно в
            начало. Три отрезка образуют треугольник с вершинами (0; 0), (3; 4),
            (0; 4). Это тот же путь по координатам, что у Черепахи, только
            записанный без направления: состояние Чертёжника — одно положение.
          </Typography.Text>
          <Typography.Text>
            Относительное смещение зависит от того, где Чертёжник сейчас;
            абсолютное — нет. Поэтому одна и та же команда «Сместиться на (1,
            2)» в разных местах алгоритма ведёт в разные точки, а «Сместиться в
            точку (1, 2)» — всегда в одну.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyanie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Состояние Черепахи — положение, направление головы и хвост;
                    «Вперёд» идёт туда, куда смотрит голова, «Назад» — в
                    обратную сторону без поворота головы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Поворот меняет только направление и считается от текущего;
                    угол поворота при обходе фигуры — внешний, 180° минус
                    внутренний.
                  </>
                ),
              },
              {
                note: (
                  <>
                    На Python: <Notation>{"forward"}</Notation>,{" "}
                    <Notation>{"backward"}</Notation>,{" "}
                    <Notation>{"right"}</Notation>,{" "}
                    <Notation>{"left"}</Notation>,{" "}
                    <Notation>{"penup"}</Notation>,{" "}
                    <Notation>{"pendown"}</Notation>; начальное направление —{" "}
                    <Notation>{"setheading"}</Notation>; «Повтори k [ … ]» —
                    цикл <Notation>{"for _ in range(k)"}</Notation> с отступом у
                    всех команд блока.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Повторы могут проходить по уже нарисованной линии; конечное
                    состояние после лишних повторений другое — число повторений
                    берут из условия.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Чертёжник смещается на вектор (относительно) или в точку
                    (абсолютно); головы и поворотов у него нет.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "risunok-kak-proverka",
      navLabel: "Рисунок как проверка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рисунок программы — инструмент проверки: фигура строится в
              выбранном масштабе, а сетка целочисленных точек того же масштаба
              показывает, какие точки попали в область.
            </strong>{" "}
            Сетка нужна в 38 задачах подборок из 54, где спрашивают о
            целочисленных точках; рисовать при этом не обязательно — подтема 3
            покажет, как считать без рисунка.
          </Typography.Text>
          <Typography.Text>
            Главный пример — тот же прямоугольник 8 × 6: построим его программой
            при масштабе k = 30 и нанесём сетку. Команды Черепахи и их перевод
            на Python из подтемы 1 считаем известными.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "masshtab",
      navLabel: "Масштаб",
      explanation: (
        <>
          <Typography.Text>
            <strong>Для удобного рисунка нужно ввести масштаб.</strong>
          </Typography.Text>
          <Typography.Text>Если выполнить:</Typography.Text>
          <CodeBlock
            code={"t.forward(6)"}
            label={"Если выполнить"}
            language="python"
          />
          <Typography.Text>
            на экране появится очень короткий отрезок.
          </Typography.Text>
          <Typography.Text>
            В стандартных настройках единица движения{" "}
            <Notation>{"turtle"}</Notation> соответствует примерно одному
            пикселю — маленькому элементу изображения на экране.
          </Typography.Text>
          <Typography.Text>
            Для задачи это неудобно: фигуру нужно рассматривать и считать точки.
          </Typography.Text>
          <Typography.Text>
            Поэтому договоримся, что одна единица из условия занимает, например,
            30 экранных единиц.
          </Typography.Text>
          <Typography.Text>Запишем:</Typography.Text>
          <CodeBlock code={"k = 30"} label={"Запишем"} language="python" />
          <Typography.Text>
            Переменная — это имя, которому в программе соответствует некоторое
            значение. Здесь имени <Notation>{"k"}</Notation> соответствует число
            30.
          </Typography.Text>
          <Typography.Text>
            Тогда команда <Notation>{"Вперёд 6"}</Notation> переводится так:
          </Typography.Text>
          <CodeBlock
            code={"t.forward(6 * k)"}
            label={"Тогда команда Вперёд 6 переводится так"}
            language="python"
          />
          <Typography.Text>Черепаха пройдёт:</Typography.Text>
          <Typography.Text>6·30=180</Typography.Text>
          <Typography.Text>экранных единиц.</Typography.Text>
          <Typography.Text>
            При этом в самой задаче длина стороны по-прежнему равна 6.
          </Typography.Text>
          <Typography.Text>Важно различать:</Typography.Text>
          <LessonTable
            label={"Важно различать"}
            columns={[
              { label: "Величина" },
              { label: "Значение", numeric: true },
            ]}
            rows={[
              ["Длина в условии", "6"],
              ["Масштаб", "30"],
              ["Длина на экране", "180"],
            ]}
          />
          <Typography.Text>
            Масштаб увеличивает изображение, чтобы его было удобно исследовать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "masshtab-i-koordinaty",
      navLabel: "Масштаб и координаты",
      explanation: (
        <>
          <Typography.Text>
            <strong>На масштаб умножаются расстояния и координаты.</strong>
          </Typography.Text>
          <Typography.Text>
            Если одна единица задачи занимает 30 экранных единиц, то:
          </Typography.Text>
          <ul>
            <li>расстояние 5 нужно изображать как 5·30;</li>
            <li>
              точку (2;3) нужно изображать в экранных координатах (60;90).
            </li>
          </ul>
          <Typography.Text>Поэтому:</Typography.Text>
          <CodeBlock
            code={"t.forward(5 * k)"}
            label={"Поэтому"}
            language="python"
          />
          <Typography.Text>и:</Typography.Text>
          <CodeBlock
            code={"t.goto(2 * k, 3 * k)"}
            label={"Код на Python: t.goto(2 * k, 3 * k)"}
            language="python"
          />
          <Typography.Text>используют один масштаб.</Typography.Text>
          <Typography.Text>
            Поворот при увеличении рисунка остаётся тем же:
          </Typography.Text>
          <CodeBlock
            code={"t.right(90)"}
            label={"Поворот при увеличении рисунка остаётся тем же"}
            language="python"
          />
          <Typography.Text>Запись:</Typography.Text>
          <CodeBlock
            code={"t.right(90 * k)"}
            label={"Запись"}
            language="python"
          />
          <Typography.Text>
            изменила бы угол поворота и сам алгоритм.
          </Typography.Text>
          <Typography.Text>
            Размер отметки точки мы тоже обычно оставляем небольшим:
          </Typography.Text>
          <CodeBlock
            code={'t.dot(3, "red")'}
            label={"Размер отметки точки мы тоже обычно оставляем небольшим"}
            language="python"
          />
          <Typography.Text>
            Здесь число 3 — размер видимого кружочка. Он нужен только для
            удобства просмотра.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervaya-programma",
      navLabel: "Первая программа",
      explanation: (
        <>
          <Typography.Text>
            <strong>Построим первую полную программу.</strong>
          </Typography.Text>
          <Typography.Text>Алгоритм задачи:</Typography.Text>
          <CodeBlock
            code={
              "Повтори 2 [\n    Вперёд 6\n    Направо 90\n    Вперёд 8\n    Направо 90\n]"
            }
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>Начальное состояние:</Typography.Text>
          <ul>
            <li>координаты (0;0);</li>
            <li>направление вверх;</li>
            <li>хвост опущен.</li>
          </ul>
          <Typography.Text>Программа:</Typography.Text>
          <CodeBlock
            code={
              'import turtle as t\n\nk = 30\n\nt.setup(900, 800)\nt.tracer(0)\nt.pensize(2)\n\nt.setheading(90)\nt.pendown()\n\nfor _ in range(2):\n    t.forward(6 * k)\n    t.right(90)\n    t.forward(8 * k)\n    t.right(90)\n\nt.penup()\nt.hideturtle()\n\nfor x in range(-2, 13):\n    for y in range(-2, 11):\n        t.goto(x * k, y * k)\n        t.dot(3, "red")\n\nt.update()\nt.done()'
            }
            label={"Программа"}
            language="python"
          />
          <Typography.Text>
            В программе есть три смысловые части:
          </Typography.Text>
          <ol>
            <li>Подготовка окна и Черепахи.</li>
            <li>Выполнение алгоритма из условия.</li>
            <li>Нанесение целочисленных точек.</li>
          </ol>
          <Typography.Text>
            Две последние строки показывают результат и оставляют окно открытым.
          </Typography.Text>
          <Typography.Text>
            В окне появится такой рисунок: стороны прямоугольника и красные
            точки решётки от −2 до 12 по x и от −2 до 10 по y. Принадлежность
            точек фигуре программа не определяет — это мы будем делать сами.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw2690890_29928a}
            caption={
              <>
                Что нарисует программа: контур 8 × 6 и сетка целочисленных точек
                одного масштаба. Оранжевая стрелка — Черепаха в конце алгоритма:
                снова в (0; 0), голова вверх.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "sluzhebnye-komandy",
      navLabel: "Служебные команды",
      explanation: (
        <>
          <Typography.Text>
            <strong>Служебные команды управляют отображением рисунка.</strong>
          </Typography.Text>
          <Typography.Text>
            Разберём строки, которые пока не объясняли.
          </Typography.Text>
          <CodeBlock
            code={"t.setup(900, 800)"}
            label={"Разберём строки, которые пока не объясняли"}
            language="python"
          />
          <Typography.Text>
            Задаёт размер окна: ширина 900, высота 800.
          </Typography.Text>
          <CodeBlock
            code={"t.tracer(0)"}
            label={"Задаёт размер окна: ширина 900, высота 800"}
            language="python"
          />
          <Typography.Text>
            Отключает постепенную анимацию. Это ускоряет построение, особенно
            когда нужно нанести много точек.
          </Typography.Text>
          <Typography.Text>
            После такого режима мы явно показываем итог:
          </Typography.Text>
          <CodeBlock
            code={"t.update()"}
            label={"После такого режима мы явно показываем итог"}
            language="python"
          />
          <CodeBlock
            code={"t.pensize(2)"}
            label={"После такого режима мы явно показываем итог"}
            language="python"
          />
          <Typography.Text>Задаёт толщину нарисованной линии.</Typography.Text>
          <CodeBlock
            code={"t.hideturtle()"}
            label={"Задаёт толщину нарисованной линии"}
            language="python"
          />
          <Typography.Text>
            Скрывает значок Черепахи. Сам рисунок остаётся.
          </Typography.Text>
          <Typography.Text>
            Это удобно: стрелка не закрывает точки у границы.
          </Typography.Text>
          <CodeBlock
            code={"t.done()"}
            label={"Это удобно: стрелка не закрывает точки у границы"}
            language="python"
          />
          <Typography.Text>
            Запускает ожидание событий окна, чтобы рисунок можно было
            рассматривать до закрытия.
          </Typography.Text>
          <Typography.Text>Эту строку ставят в конце.</Typography.Text>
          <Typography.Text>
            Для учебного просмотра движения можно временно убрать{" "}
            <Notation>{"tracer(0)"}</Notation> и задать:
          </Typography.Text>
          <CodeBlock
            code={"t.speed(3)"}
            label={
              "Для учебного просмотра движения можно временно убрать tracer(0) и задать"
            }
            language="python"
          />
          <Typography.Text>
            Тогда Черепаха будет двигаться постепенно.
          </Typography.Text>
          <Typography.Text>Значение:</Typography.Text>
          <CodeBlock code={"t.speed(0)"} label={"Значение"} language="python" />
          <Typography.Text>
            означает максимальную скорость без анимации перемещения. Ноль здесь
            не означает остановку.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "setka-tochek",
      navLabel: "Сетка точек",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Целочисленные точки наносятся двумя вложенными циклами.
            </strong>
          </Typography.Text>
          <Typography.Text>Посмотрим на фрагмент:</Typography.Text>
          <CodeBlock
            code={
              'for x in range(-2, 13):\n    for y in range(-2, 11):\n        t.goto(x * k, y * k)\n        t.dot(3, "red")'
            }
            label={"Посмотрим на фрагмент"}
            language="python"
          />
          <Typography.Text>
            Сначала разберём <Notation>{"range"}</Notation>.
          </Typography.Text>
          <Typography.Text>Запись:</Typography.Text>
          <CodeBlock code={"range(a, b)"} label={"Запись"} language="python" />
          <Typography.Text>
            даёт целые числа от <Notation>{"a"}</Notation> до{" "}
            <Notation>{"b - 1"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Правая граница <Notation>{"b"}</Notation> не включается.
          </Typography.Text>
          <Typography.Text>Поэтому:</Typography.Text>
          <CodeBlock
            code={"range(-2, 13)"}
            label={"Поэтому"}
            language="python"
          />
          <Typography.Text>даёт:</Typography.Text>
          <CodeBlock
            code={"-2, -1, 0, 1, ..., 11, 12"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>А:</Typography.Text>
          <CodeBlock
            code={"range(-2, 11)"}
            label={"Код на Python: range(-2, 11)"}
            language="python"
          />
          <Typography.Text>даёт:</Typography.Text>
          <CodeBlock
            code={"-2, -1, 0, 1, ..., 9, 10"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            Теперь посмотрим на два цикла вместе.
          </Typography.Text>
          <Typography.Text>Внешний цикл выбирает значение x.</Typography.Text>
          <Typography.Text>
            Для каждого выбранного x внутренний цикл перебирает все значения y.
          </Typography.Text>
          <Typography.Text>
            Например, при x=-2 отмечаются точки:
          </Typography.Text>
          <Typography.Text>(-2;-2), (-2;-1), (-2;0),…,(-2;10).</Typography.Text>
          <Typography.Text>
            После этого внешний цикл выбирает x=-1, и отмечаются:
          </Typography.Text>
          <Typography.Text>(-1;-2), (-1;-1),…,(-1;10).</Typography.Text>
          <Typography.Text>
            Получаются все сочетания выбранных целых значений x и y.
          </Typography.Text>
          <Typography.Text>
            Цикл, находящийся внутри другого цикла, называют{" "}
            <PythonTerm term="nested">
              <strong>вложенным</strong>
            </PythonTerm>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "peremennye-cikla",
      navLabel: "Переменные цикла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Переменные <Notation>{"x"}</Notation> и <Notation>{"y"}</Notation>{" "}
              сами по себе не перемещают Черепаху.
            </strong>
          </Typography.Text>
          <Typography.Text>Строка:</Typography.Text>
          <CodeBlock
            code={"for x in range(-2, 13):"}
            label={"Строка"}
            language="python"
          />
          <Typography.Text>
            только присваивает переменной <Notation>{"x"}</Notation> очередное
            число.
          </Typography.Text>
          <Typography.Text>Перемещение выполняет команда:</Typography.Text>
          <CodeBlock
            code={"t.goto(x * k, y * k)"}
            label={"Перемещение выполняет команда"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"goto"}</Notation> означает «перейти в указанную точку».
          </Typography.Text>
          <Typography.Text>
            Это переход по абсолютным координатам.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <CodeBlock
            code={"t.goto(100, 50)"}
            label={"Например"}
            language="python"
          />
          <Typography.Text>
            перемещает Черепаху в точку (100;50), независимо от её прежнего
            положения и направления.
          </Typography.Text>
          <Typography.Text>
            При этом направление головы не меняется.
          </Typography.Text>
          <Typography.Text>Это отличается от:</Typography.Text>
          <CodeBlock
            code={"t.forward(100)"}
            label={"Это отличается от"}
            language="python"
          />
          <Typography.Text>
            Здесь новая точка зависит от текущего положения и направления.
          </Typography.Text>
          <Typography.Text>
            Для нанесения сетки удобнее <Notation>{"goto"}</Notation>: нам
            известны координаты каждой нужной точки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "hvost-pered-setkoj",
      navLabel: "Хвост перед сеткой",
      explanation: (
        <>
          <Typography.Text>
            <strong>Перед нанесением сетки хвост нужно поднять.</strong>
          </Typography.Text>
          <Typography.Text>Используем:</Typography.Text>
          <CodeBlock
            code={"t.penup()"}
            label={"Используем"}
            language="python"
          />
          <Typography.Text>
            Если оставить хвост опущенным, переходы между точками сетки будут
            оставлять линии.
          </Typography.Text>
          <Typography.Text>
            Вместо аккуратных отметок получится множество дополнительных
            отрезков, которые затруднят чтение фигуры.
          </Typography.Text>
          <Typography.Text>При поднятом хвосте:</Typography.Text>
          <CodeBlock
            code={"t.goto(...)"}
            label={"При поднятом хвосте"}
            language="python"
          />
          <Typography.Text>перемещает Черепаху без линии.</Typography.Text>
          <Typography.Text>Но:</Typography.Text>
          <CodeBlock
            code={'t.dot(3, "red")'}
            label={'Код на Python: t.dot(3, "red")'}
            language="python"
          />
          <Typography.Text>
            всё равно рисует точку. Эта команда специально ставит отметку
            независимо от состояния пера.
          </Typography.Text>
          <Typography.Text>Следовательно:</Typography.Text>
          <CodeBlock
            code={'t.penup()\nt.goto(60, 90)\nt.dot(3, "red")'}
            label={"Следовательно"}
            language="python"
          />
          <Typography.Text>означает:</Typography.Text>
          <ol>
            <li>Переместиться в (60;90) без линии.</li>
            <li>Поставить там красную отметку.</li>
          </ol>
        </>
      ),
    },
    {
      id: "odin-masshtab",
      navLabel: "Один масштаб",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Фигура и сетка обязательно должны использовать один масштаб.
            </strong>
          </Typography.Text>
          <Typography.Text>Правильное сочетание:</Typography.Text>
          <CodeBlock
            code={"t.forward(6 * k)"}
            label={"Правильное сочетание"}
            language="python"
          />
          <Typography.Text>и:</Typography.Text>
          <CodeBlock
            code={"t.goto(x * k, y * k)"}
            label={"Код на Python: t.goto(x * k, y * k)"}
            language="python"
          />
          <Typography.Text>Предположим, k=30.</Typography.Text>
          <Typography.Text>
            Сторона длиной 6 занимает на экране 180 единиц. Соседние точки
            решётки находятся через 30 экранных единиц. Получается ровно шесть
            единичных промежутков вдоль стороны.
          </Typography.Text>
          <Typography.Text>Если фигуру построить с масштабом:</Typography.Text>
          <CodeBlock
            code={"t.forward(6 * k)"}
            label={"Если фигуру построить с масштабом"}
            language="python"
          />
          <Typography.Text>а сетку нанести без него:</Typography.Text>
          <CodeBlock
            code={"t.goto(x, y)"}
            label={"а сетку нанести без него"}
            language="python"
          />
          <Typography.Text>
            точки окажутся скучены около начала координат. Они будут
            соответствовать другой системе единиц.
          </Typography.Text>
          <Typography.Text>
            Аналогичная проблема возникнет, если фигура использует один
            коэффициент, а сетка другой.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Значение масштаба можно менять, но оно должно согласованно
              применяться ко всему рисунку и сетке.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "diapazony-setki",
      navLabel: "Диапазоны сетки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Диапазоны сетки нужно выбирать по расположению фигуры.
            </strong>
          </Typography.Text>
          <Typography.Text>В нашем прямоугольнике:</Typography.Text>
          <Typography.Text>0≤ x≤8, 0≤ y≤6.</Typography.Text>
          <Typography.Text>
            Поэтому достаточно нанести точки в этой области. Мы взяли немного
            больше:
          </Typography.Text>
          <CodeBlock
            code={"range(-2, 13)\nrange(-2, 11)"}
            label={
              "Поэтому достаточно нанести точки в этой области. Мы взяли немного больше"
            }
            language="python"
          />
          <Typography.Text>
            Запас полезен: вокруг фигуры видны внешние точки, и легче различать
            границу.
          </Typography.Text>
          <Typography.Text>
            У другой задачи рисунок может оказаться:
          </Typography.Text>
          <ul>
            <li>левее начала координат;</li>
            <li>ниже начала координат;</li>
            <li>сразу в нескольких частях плоскости.</li>
          </ul>
          <Typography.Text>
            Тогда диапазоны должны охватывать соответствующие координаты.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <CodeBlock
            code={
              'for x in range(-15, 16):\n    for y in range(-12, 13):\n        t.goto(x * k, y * k)\n        t.dot(3, "red")'
            }
            label={"Например"}
            language="python"
          />
          <Typography.Text>отмечает точки для:</Typography.Text>
          <Typography.Text>-15≤ x≤15, -12≤ y≤12.</Typography.Text>
          <Typography.Text>
            Здесь числа в <Notation>{"range"}</Notation> — координаты{" "}
            <strong>в единицах задачи</strong>. Умножение на{" "}
            <Notation>{"k"}</Notation> выполняется при переходе к экранным
            координатам.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "setka-ne-schitaet",
      navLabel: "Сетка не считает",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рисование сетки само по себе не подсчитывает ответ автоматически.
            </strong>
          </Typography.Text>
          <Typography.Text>В программе:</Typography.Text>
          <CodeBlock
            code={
              'for x in range(...):\n    for y in range(...):\n        t.goto(x * k, y * k)\n        t.dot(3, "red")'
            }
            label={"В программе"}
            language="python"
          />
          <Typography.Text>отмечаются все выбранные точки:</Typography.Text>
          <ul>
            <li>внутри;</li>
            <li>на границе;</li>
            <li>снаружи.</li>
          </ul>
          <Typography.Text>
            Команда <Notation>{"dot"}</Notation> не определяет, к какой
            категории относится точка.
          </Typography.Text>
          <Typography.Text>
            Поэтому основной способ через <Notation>{"turtle"}</Notation>{" "}
            состоит из:
          </Typography.Text>
          <ol>
            <li>построения фигуры;</li>
            <li>нанесения решётки;</li>
            <li>визуального подсчёта нужных отметок.</li>
          </ol>
          <Typography.Text>
            Если точек очень много, можно дополнить рисунок проверкой координат.
          </Typography.Text>
          <Typography.Text>
            Для этого сначала нужно понять, каким условиям удовлетворяют точки
            нужной области.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "risunok-ne-pomeshchaetsya",
      navLabel: "Рисунок не помещается",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если рисунок не помещается, сначала проверь масштаб и размеры
              окна.
            </strong>
          </Typography.Text>
          <Typography.Text>Есть несколько разных ситуаций.</Typography.Text>
          <Typography.Text>
            <strong>Фигура слишком маленькая.</strong>
          </Typography.Text>
          <Typography.Text>Увеличь:</Typography.Text>
          <CodeBlock code={"k = 30"} label={"Увеличь"} language="python" />
          <Typography.Text>например до:</Typography.Text>
          <CodeBlock code={"k = 40"} label={"например до"} language="python" />
          <Typography.Text>
            После этого и стороны, и сетка увеличатся одинаково.
          </Typography.Text>
          <Typography.Text>
            <strong>Фигура слишком большая.</strong>
          </Typography.Text>
          <Typography.Text>Уменьши масштаб:</Typography.Text>
          <CodeBlock
            code={"k = 15"}
            label={"Уменьши масштаб"}
            language="python"
          />
          <Typography.Text>
            Но при большом количестве точек уменьшение может сделать подсчёт
            неудобным.
          </Typography.Text>
          <Typography.Text>
            <strong>Фигура уходит за край окна.</strong>
          </Typography.Text>
          <Typography.Text>Команда:</Typography.Text>
          <CodeBlock
            code={"t.setup(900, 800)"}
            label={"Команда"}
            language="python"
          />
          <Typography.Text>управляет размером видимого окна.</Typography.Text>
          <Typography.Text>В чужих решениях часто встречается:</Typography.Text>
          <CodeBlock
            code={"t.screensize(2000, 2000)"}
            label={"В чужих решениях часто встречается"}
            language="python"
          />
          <Typography.Text>
            Эта команда меняет размер области для рисования, а не размер самого
            окна. Скрытые части можно просматривать с помощью полос прокрутки.
            Разница между <Notation>{"setup"}</Notation> и{" "}
            <Notation>{"screensize"}</Notation> указана в документации Python.{" "}
            <ExternalLink href="https://docs.python.org/3/library/turtle.html">
              Python 3.15.0 documentation
            </ExternalLink>
          </Typography.Text>
          <Typography.Text>
            <strong>Фигура видна, но часть её не покрыта точками.</strong>
          </Typography.Text>
          <Typography.Text>Тогда проблема в диапазонах:</Typography.Text>
          <CodeBlock
            code={"range(...)"}
            label={"Тогда проблема в диапазонах"}
            language="python"
          />
          <Typography.Text>
            Нужно расширить диапазон x, y или оба.
          </Typography.Text>
          <Typography.Text>
            Расширение сетки само по себе не уменьшает фигуру и не увеличивает
            окно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gde-zapuskat",
      navLabel: "Где запускать",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для первых запусков лучше использовать обычный локальный Python с
              графическим окном.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Можно работать в редакторе, который запускает установленный Python,
            например в IDLE.
          </Typography.Text>
          <Typography.Text>Практический порядок:</Typography.Text>
          <ol>
            <li>Создай файл программы.</li>
            <li>Вставь полный код.</li>
            <li>Сохрани файл.</li>
            <li>Запусти его.</li>
            <li>Рассмотри открывшееся окно Черепахи.</li>
          </ol>
          <Typography.Text>
            В IDLE код удобно запускать из окна редактора через{" "}
            <Notation>{"Run → Run Module"}</Notation>, обычно клавишей{" "}
            <Notation>{"F5"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Некоторые онлайн-среды умеют выполнять Python, но не умеют открывать
            графическое окно <Notation>{"turtle"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если возникает ошибка об отсутствии{" "}
            <Notation>{"_tkinter"}</Notation>, среде не хватает графической
            части Tk, необходимой для работы <Notation>{"turtle"}</Notation>.{" "}
            <ExternalLink href="https://docs.python.org/3/library/turtle.html">
              Python 3.15.0 documentation
            </ExternalLink>
          </Typography.Text>
          <Typography.Text>
            <strong>
              Не называй свой файл <Notation>{"turtle.py"}</Notation>.
            </strong>
          </Typography.Text>
          <Typography.Text>Иначе при:</Typography.Text>
          <CodeBlock
            code={"import turtle"}
            label={"Иначе при"}
            language="python"
          />
          <Typography.Text>
            Python может попытаться подключить твой файл вместо стандартного
            модуля.
          </Typography.Text>
          <Typography.Text>Подходящее имя:</Typography.Text>
          <CodeBlock
            code={"ege6_solution.py"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
        </>
      ),
    },
    {
      id: "gotovyj-shablon",
      navLabel: "Готовый шаблон",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Готовый шаблон собирает все части программы в одном файле.
            </strong>{" "}
            Его удобно скопировать и заменять только блок алгоритма;
            диагностическая печать стоит до сетки, а комментарии напоминают, что
            умножается на масштаб и почему поднимается перо.
          </Typography.Text>
          <CodeBlock
            code={
              '# ЕГЭ, задание 6. Построение фигуры и целочисленных точек.\n# Сохраните файл под этим именем, а не под именем turtle.py.\n# Запускайте в локальном Python с графическим интерфейсом,\n# например в IDLE.\n#\n# Пример: старт в (0, 0), направление вверх, хвост опущен.\n# Повтори 2 [Вперёд 6 Направо 90 Вперёд 8 Направо 90].\n# Результат: прямоугольник 0 <= x <= 8, 0 <= y <= 6.\n# Строго внутри: 35 точек. Вместе с границей: 63 точки.\n# Программа рисует точки; их принадлежность области\n# нужно определить отдельно.\n\nimport turtle as t\n\n# Один шаг Черепахи из условия занимает k единиц на экране.\n# Множитель применяется к расстояниям и координатам,\n# но не к углам.\nk = 30\n\nt.setup(900, 800)  # размер видимого окна\nt.title("ЕГЭ 6 — Черепаха и целочисленные точки")\nt.tracer(0)  # отключаем анимацию ради быстрого построения\nt.pensize(2)\nt.setheading(90)  # в turtle: 90 градусов = вверх\nt.pendown()\n\n# Заменяйте этот блок алгоритмом конкретной задачи.\n# Порядок команд и число повторений — как в условии.\nfor _ in range(2):\n    t.forward(6 * k)\n    t.right(90)\n    t.forward(8 * k)\n    t.right(90)\n\n# Проверяем положение ДО нанесения сетки:\n# goto() далее изменит координаты.\nprint("Финальные координаты в единицах задачи:",\n      round(t.xcor() / k, 6), round(t.ycor() / k, 6))\nprint("Финальное направление в градусах:",\n      round(t.heading(), 6))\n\n# Поднимаем перо, чтобы переходы не оставляли линий.\n# Правая граница range не включается.\nt.penup()\nt.hideturtle()\nfor x in range(-2, 13):  # -2, -1, ..., 12\n    for y in range(-2, 11):  # -2, -1, ..., 10\n        t.goto(x * k, y * k)\n        t.dot(3, "red")  # центр отметки = точка\n\nt.update()  # показываем рисунок после tracer(0)\nt.done()  # окно остаётся открытым до закрытия'
            }
            label={
              "Код на Python: # ЕГЭ, задание 6. Построение фигуры и целочисленных точек."
            }
            language="python"
          />
        </>
      ),
    },
    {
      id: "postroenie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Масштаб k умножает расстояния и координаты, но не углы;
                    фигура и сетка используют один масштаб.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сетку наносят с поднятым пером:{" "}
                    <Notation>{"goto(x * k, y * k)"}</Notation> и{" "}
                    <Notation>{"dot"}</Notation>; диапазоны{" "}
                    <Notation>{"range"}</Notation> берут с запасом и помнят, что
                    правая граница не включается.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Служебные команды (<Notation>{"setup"}</Notation>,{" "}
                    <Notation>{"tracer"}</Notation>,{" "}
                    <Notation>{"update"}</Notation>,{" "}
                    <Notation>{"hideturtle"}</Notation>,{" "}
                    <Notation>{"done"}</Notation>) управляют окном, а не
                    алгоритмом.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Программа рисует, но не считает: принадлежность точек
                    области определяем сами.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Положение Черепахи проверяют печатью сразу после алгоритма,
                    до сетки; файл не называют{" "}
                    <Notation>{"turtle.py"}</Notation>.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "chto-sprashivaet-vopros",
      navLabel: "Что спрашивает вопрос",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ответ задания определяет вопрос: точки строго внутри, точки вместе
              с границей, площадь или периметр — у одной и той же фигуры это
              разные числа.
            </strong>{" "}
            Точки решётки спрашивают в 38 задачах подборок из 54, площадь,
            периметр или расстояние — в 16.
          </Typography.Text>
          <Typography.Text>
            Главный пример — снова прямоугольник 8 × 6: у него 35 точек строго
            внутри, 63 вместе с границей, площадь 48 и периметр 28. Построение
            фигуры и сетку из подтем 1–2 считаем известными — здесь считаем без
            рисунка.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vnutri-na-granice-snaruzhi",
      navLabel: "Внутри, на границе, снаружи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При подсчёте нужно различать точки внутри, точки на границе и
              точки снаружи.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Граница фигуры — линия, которая отделяет её внутреннюю область от
            внешней.
          </Typography.Text>
          <Typography.Text>
            У нашего прямоугольника границу составляют четыре стороны.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <ul>
            <li>(3;2) — внутри;</li>
            <li>(0;4) — на левой стороне;</li>
            <li>(8;6) — вершина, то есть тоже граница;</li>
            <li>(9;3) — снаружи.</li>
          </ul>
          <Typography.Text>
            Если спрашивают <strong>строго внутри</strong>, точки на сторонах и
            вершинах исключаются.
          </Typography.Text>
          <Typography.Text>
            Если спрашивают <strong>внутри и на границе</strong>, они
            включаются.
          </Typography.Text>
          <Typography.Text>
            Вершины не являются отдельной категорией, которую можно забыть. Они
            принадлежат границе.
          </Typography.Text>
          <Typography.Text>
            На рисунке линия имеет некоторую толщину, а точка выглядит
            кружочком. В математической задаче точка не имеет размера, а линия
            не имеет толщины.
          </Typography.Text>
          <Typography.Text>
            Поэтому проверяется положение <strong>центра отметки</strong>.
          </Typography.Text>
          <Typography.Text>
            Если красный кружочек немного касается чёрной линии, это ещё не
            означает, что математическая точка лежит на границе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "podschet-po-ryadam",
      navLabel: "Подсчёт по рядам",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Точки удобнее считать по горизонтальным рядам или вертикальным
              столбцам.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Считать их в случайном порядке неудобно: можно пропустить точку или
            учесть её дважды.
          </Typography.Text>
          <Typography.Text>
            У нашего прямоугольника строго внутри находятся точки с
            координатами:
          </Typography.Text>
          <Typography.Text>x=1,2,3,4,5,6,7</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>y=1,2,3,4,5.</Typography.Text>
          <Typography.Text>
            Есть 7 допустимых значений x и 5 допустимых значений y.
          </Typography.Text>
          <Typography.Text>
            Каждому значению y соответствует горизонтальный ряд из 7 точек.
          </Typography.Text>
          <Typography.Text>Всего:</Typography.Text>
          <Typography.Text>7·5=35.</Typography.Text>
          <Typography.Text>
            Это число можно получить и по столбцам: 7 столбцов по 5 точек.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw2690890_bd795d}
            caption={
              <>
                Прямоугольник 8 × 6: оранжевые точки — строго внутри, их 7 · 5 =
                35; белые кружки — на сторонах и в вершинах, их 28; серые —
                снаружи.
              </>
            }
          />
          <Typography.Text>
            При наклонной границе длина рядов обычно различается. Тогда удобнее
            записать количество точек в каждом ряду и сложить результаты.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <Typography.Text>3+5+7+7+5+3.</Typography.Text>
          <Typography.Text>
            Такая запись позволяет проверить каждый ряд отдельно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochki-i-promezhutki",
      navLabel: "Точки и промежутки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество точек на отрезке связано с количеством промежутков
              между ними.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим отрезок от 0 до 8.</Typography.Text>
          <Typography.Text>Целые координаты на нём:</Typography.Text>
          <Typography.Text>0,1,2,3,4,5,6,7,8.</Typography.Text>
          <Typography.Text>
            Его длина равна 8, но точек вместе с концами — 9.
          </Typography.Text>
          <Typography.Text>
            Между соседними точками находится один единичный промежуток. У
            восьми промежутков девять концов.
          </Typography.Text>
          <Typography.Text>
            Если исключить концы отрезка, останутся:
          </Typography.Text>
          <Typography.Text>1,2,3,4,5,6,7,</Typography.Text>
          <Typography.Text>то есть 7 точек.</Typography.Text>
          <Typography.Text>
            Для горизонтального или вертикального отрезка с целочисленными
            концами и длиной a:
          </Typography.Text>
          <ul>
            <li>вместе с концами — a+1 целых точек;</li>
            <li>строго между концами — a-1, если a≥1.</li>
          </ul>
          <Typography.Text>
            Для наклонного отрезка это правило по его длине не действует.
            Например, отрезок из (0;0) в (3;4) имеет длину 5, но только две
            целочисленные точки — его концы. Внутри него целых точек нет: на
            прямой y=4x/3 при x=1 и x=2 координата y нецелая.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttSegment00_34}
            caption={
              <>
                Отрезок из (0; 0) в (3; 4): длина 5, но через узлы решётки он
                проходит только в концах.
              </>
            }
          />
          <Typography.Text>
            Именно отсюда берутся добавление и вычитание единицы в формулах для
            прямоугольника.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pryamougolnik-po-osyam",
      navLabel: "Прямоугольник по осям",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для прямоугольника с целочисленными вершинами и сторонами вдоль
              осей подсчёт сводится к умножению.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть ширина прямоугольника равна a, высота — b, причём обе
            положительны и целочисленны.
          </Typography.Text>
          <Typography.Text>Тогда:</Typography.Text>
          <Typography.Text>N_внутри=(a-1)(b-1).</Typography.Text>
          <Typography.Text>Почему?</Typography.Text>
          <Typography.Text>Внутри есть:</Typography.Text>
          <ul>
            <li>a-1 допустимых целых координат по горизонтали;</li>
            <li>b-1 по вертикали.</li>
          </ul>
          <Typography.Text>
            Каждая горизонтальная координата может сочетаться с каждой
            вертикальной.
          </Typography.Text>
          <Typography.Text>Вместе с границей:</Typography.Text>
          <Typography.Text>N_вместе с границей=(a+1)(b+1).</Typography.Text>
          <Typography.Text>Для нашего примера a=8, b=6:</Typography.Text>
          <Typography.Text>N_внутри=7·5=35,</Typography.Text>
          <Typography.Text>N_вместе с границей=9·7=63.</Typography.Text>
          <Typography.Text>Только на границе:</Typography.Text>
          <Typography.Text>N_граница=63-35=28.</Typography.Text>
          <Typography.Text>
            Для такого прямоугольника можно получить общую формулу:
          </Typography.Text>
          <Typography.Text>N_граница=2a+2b.</Typography.Text>
          <Typography.Text>Её можно вывести непосредственно:</Typography.Text>
          <ul>
            <li>на двух горизонтальных сторонах по a+1 точке;</li>
            <li>на двух вертикальных по b+1;</li>
            <li>каждая из четырёх вершин посчитана дважды.</li>
          </ul>
          <Typography.Text>Следовательно:</Typography.Text>
          <Typography.Text>2(a+1)+2(b+1)-4=2a+2b.</Typography.Text>
          <Typography.Text>
            Условия применения здесь существенны: стороны должны идти вдоль
            осей, а координаты вершин должны быть целыми.
          </Typography.Text>
          <Typography.Text>
            Для наклонного прямоугольника такой подсчёт по ширине и высоте
            автоматически использовать нельзя.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochki-ploshchad-perimetr",
      navLabel: "Точки, площадь, периметр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество точек, площадь и периметр отвечают на разные вопросы.
            </strong>
          </Typography.Text>
          <Typography.Text>Для прямоугольника 8×6:</Typography.Text>
          <LessonTable
            label={"Для прямоугольника 8×6"}
            columns={[
              { label: "Что требуется найти" },
              { label: "Расчёт" },
              { label: "Результат", numeric: true },
            ]}
            rows={[
              ["Точки строго внутри", "7·5", "35"],
              ["Точки внутри и на границе", "9·7", "63"],
              ["Точки только на границе", "63-35", "28"],
              ["Площадь", "8·6", "48"],
              ["Периметр", "2(8+6)", "28"],
            ]}
          />
          <Typography.Text>
            Площадь показывает, сколько единичных квадратов занимает область.
          </Typography.Text>
          <Typography.Text>
            Периметр показывает длину её контура.
          </Typography.Text>
          <Typography.Text>
            Количество целочисленных точек показывает, сколько узлов
            координатной решётки попало в указанную область.
          </Typography.Text>
          <Typography.Text>
            В этом примере число граничных точек совпало с числом, выражающим
            периметр. Такое совпадение объясняется расположением сторон вдоль
            осей и целыми координатами вершин.
          </Typography.Text>
          <Typography.Text>
            Из него нельзя делать общий вывод для любых фигур.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nezamknutaya-liniya",
      navLabel: "Незамкнутая линия",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              На незамкнутой линии спрашивают о точках самой линии: области у
              неё нет.
            </strong>{" "}
            Если алгоритм не возвращает Черепаху в начало контура, линия только
            огибает часть плоскости. Например, «Вперёд 3 Направо 90 Вперёд 4
            Направо 90 Вперёд 3» из (0; 0) вверх рисует три стороны
            прямоугольника 4 × 3 — без нижней. Внутренней области нет; вопрос
            может быть только о точках на нарисованных линиях.
          </Typography.Text>
          <Typography.Text>
            Считаем их по отрезкам, не повторяя общие концы: на левой стороне 4
            точки, на верхней ещё 4 (её левый конец уже посчитан), на правой ещё
            3. Всего 4 + 4 + 3 = 11 различных точек. Дорисовывать недостающую
            сторону и считать «внутренность» нельзя: в условии её нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rasstoyanie-i-dlina-puti",
      navLabel: "Расстояние и длина пути",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Расстояние между началом и концом пути — не длина пути.
            </strong>{" "}
            Путь «Вперёд 6 Направо 90 Вперёд 8» из (0; 0) вверх имеет длину 6 +
            8 = 14, а Черепаха оказывается в (8; 6). Прямое расстояние от начала
            до конца — гипотенуза прямоугольного треугольника с катетами 6 и 8:
            √(6² + 8²) = √100 = 10. Если ответ нецелый, условие говорит, как его
            округлить; без такого указания вычисляют точно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ploshchad-treugolnika",
      navLabel: "Площадь треугольника",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Площадь треугольника с вершинами в узлах решётки считают через
              прямоугольник, в который он вписан.
            </strong>{" "}
            Чертёжник из подтемы 1 рисует, например, треугольник с вершинами (0;
            0), (3; 4), (0; 4). Он — половина прямоугольника 3 × 4, разрезанного
            диагональю, поэтому его площадь 3 · 4 / 2 = 6. Для треугольника, у
            которого две стороны идут вдоль осей, это всегда так: площадь —
            половина произведения этих сторон.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Внутри, на границе, снаружи — три разных класса точек;
                    вершины принадлежат границе; проверяется центр отметки, а не
                    её касание линии.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Точки считают рядами или столбцами; на отрезке длины a вдоль
                    оси — a + 1 точка с концами, a − 1 без них.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Прямоугольник a × b со сторонами по осям и целыми вершинами:
                    (a − 1)(b − 1) строго внутри, (a + 1)(b + 1) с границей, 2a
                    + 2b на границе.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Площадь, периметр, число точек и расстояние от начала до
                    конца — разные ответы; повторная линия не добавляет точек.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Незамкнутая линия не ограничивает область: её не
                    дорисовывают.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dve-figury",
      navLabel: "Две фигуры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если фигур две, сначала находят общую часть или объединение, а уже
              потом считают точки.
            </strong>{" "}
            Операции над несколькими фигурами нужны в 22 задачах подборок из 54,
            в том числе в 12 из 24 задач 2025–2026 годов; задание 6 демоверсии
            2027 года — тоже два прямоугольника и точки их пересечения.
          </Typography.Text>
          <Typography.Text>
            Главный пример — прямоугольник 8 × 6 из подтем 1–3 и второй, 7 × 5,
            нарисованный после перехода с поднятым хвостом. Каждую фигуру
            считаем приёмами подтемы 3; новое — только то, как фигуры
            складываются.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perehod-mezhdu-figurami",
      navLabel: "Переход между фигурами",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При рисовании нескольких фигур положение и направление продолжают
              сохраняться.
            </strong>
          </Typography.Text>
          <Typography.Text>Разберём более сложный алгоритм:</Typography.Text>
          <CodeBlock
            code={
              "Повтори 2 [\n    Вперёд 6\n    Направо 90\n    Вперёд 8\n    Направо 90\n]\n\nПоднять хвост\n\nВперёд 2\nНаправо 90\nВперёд 3\nНалево 90\n\nОпустить хвост\n\nПовтори 2 [\n    Вперёд 5\n    Направо 90\n    Вперёд 7\n    Направо 90\n]"
            }
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>Начальное направление — вверх.</Typography.Text>
          <Typography.Text>
            Первый блок рисует уже знакомый прямоугольник:
          </Typography.Text>
          <Typography.Text>0≤ x≤8, 0≤ y≤6.</Typography.Text>
          <Typography.Text>
            После двух повторений Черепаха вернулась в (0;0) и смотрит вверх.
          </Typography.Text>
          <Typography.Text>Далее хвост поднимается.</Typography.Text>
          <Typography.Text>Перемещения между фигурами:</Typography.Text>
          <LessonTable
            label={"Перемещения между фигурами"}
            columns={[
              { label: "Команда" },
              { label: "Положение после команды" },
              { label: "Направление" },
            ]}
            rows={[
              ["Вперёд 2", "(0;2)", "Вверх"],
              ["Направо 90", "(0;2)", "Вправо"],
              ["Вперёд 3", "(3;2)", "Вправо"],
              ["Налево 90", "(3;2)", "Вверх"],
            ]}
          />
          <Typography.Text>Теперь хвост опускается.</Typography.Text>
          <Typography.Text>
            Вторая фигура начинается в (3;2). Её высота 5, ширина 7.
          </Typography.Text>
          <Typography.Text>Поэтому она занимает область:</Typography.Text>
          <Typography.Text>3≤ x≤10, 2≤ y≤7.</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw26908902903902590790_f92b6e}
            caption={
              <>
                Два прямоугольника одной программы: переход между ними с
                поднятым хвостом не оставил линии.
              </>
            }
          />
          <Typography.Text>
            Для построения замени в полном шаблоне блок алгоритма таким:
          </Typography.Text>
          <CodeBlock
            code={
              "# Первая фигура\nfor _ in range(2):\n    t.forward(6 * k)\n    t.right(90)\n    t.forward(8 * k)\n    t.right(90)\n\n# Переход к началу второй фигуры без рисования\nt.penup()\n\nt.forward(2 * k)\nt.right(90)\nt.forward(3 * k)\nt.left(90)\n\nt.pendown()\n\n# Вторая фигура\nfor _ in range(2):\n    t.forward(5 * k)\n    t.right(90)\n    t.forward(7 * k)\n    t.right(90)"
            }
            label={
              "Для построения замени в полном шаблоне блок алгоритма таким"
            }
            language="python"
          />
          <Typography.Text>
            После этого, как и раньше, поднимаем перо и наносим сетку.
          </Typography.Text>
          <Typography.Text>
            Поднятие хвоста позволяет переместиться к началу второй фигуры, не
            добавляя соединительную линию.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "peresechenie",
      navLabel: "Пересечение",
      explanation: (
        <>
          <Typography.Text>
            <strong>Пересечение фигур — это их общая часть.</strong>
          </Typography.Text>
          <Typography.Text>
            Точка принадлежит пересечению, если она принадлежит{" "}
            <strong>обеим</strong> фигурам.
          </Typography.Text>
          <Typography.Text>
            В нашем примере первая фигура занимает:
          </Typography.Text>
          <Typography.Text>0≤ x≤8, 0≤ y≤6.</Typography.Text>
          <Typography.Text>Вторая:</Typography.Text>
          <Typography.Text>3≤ x≤10, 2≤ y≤7.</Typography.Text>
          <Typography.Text>
            Чтобы точка находилась в обеих фигурах, её координата x должна
            одновременно удовлетворять двум условиям:
          </Typography.Text>
          <Typography.Text>0≤ x≤8</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>3≤ x≤10.</Typography.Text>
          <Typography.Text>Общие значения:</Typography.Text>
          <Typography.Text>3≤ x≤8.</Typography.Text>
          <Typography.Text>Для координаты y:</Typography.Text>
          <Typography.Text>2≤ y≤6.</Typography.Text>
          <Typography.Text>
            Поэтому пересечение — прямоугольник:
          </Typography.Text>
          <Typography.Text>3≤ x≤8, 2≤ y≤6.</Typography.Text>
          <Typography.Text>Его ширина:</Typography.Text>
          <Typography.Text>8-3=5.</Typography.Text>
          <Typography.Text>Высота:</Typography.Text>
          <Typography.Text>6-2=4.</Typography.Text>
          <Typography.Text>
            Если граница учитывается, допустимы:
          </Typography.Text>
          <Typography.Text>x=3,4,5,6,7,8</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>y=2,3,4,5,6.</Typography.Text>
          <Typography.Text>Получаем:</Typography.Text>
          <Typography.Text>6·5=30</Typography.Text>
          <Typography.Text>точек.</Typography.Text>
          <Typography.Text>
            Если нужны точки строго внутри пересечения:
          </Typography.Text>
          <Typography.Text>
            3{"<"}x{"<"}8, 2{"<"}y{"<"}6.
          </Typography.Text>
          <Typography.Text>Допустимы:</Typography.Text>
          <Typography.Text>x=4,5,6,7</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>y=3,4,5.</Typography.Text>
          <Typography.Text>Получаем:</Typography.Text>
          <Typography.Text>4·3=12.</Typography.Text>
          <Typography.Text>Площадь пересечения:</Typography.Text>
          <Typography.Text>5·4=20.</Typography.Text>
          <Typography.Text>Периметр пересечения:</Typography.Text>
          <Typography.Text>2(5+4)=18.</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttRects080631027_both}
            caption={
              <>
                Пересечение 3 ≤ x ≤ 8, 2 ≤ y ≤ 6: 6 · 5 = 30 точек вместе с
                границей.
              </>
            }
          />
          <Typography.Text>
            Сначала определяется общая область, затем к ней применяется нужный
            способ подсчёта.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granicy-peresecheniya",
      navLabel: "Границы пересечения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Границы пересечения прямоугольников можно находить через максимумы
              и минимумы.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть первый прямоугольник задан границами:
          </Typography.Text>
          <Typography.Text>x₁≤ x≤ x₂, y₁≤ y≤ y₂.</Typography.Text>
          <Typography.Text>Второй:</Typography.Text>
          <Typography.Text>u₁≤ x≤ u₂, v₁≤ y≤ v₂.</Typography.Text>
          <Typography.Text>Тогда общая область имеет границы:</Typography.Text>
          <Typography.Text>x_лев=max(x₁,u₁),</Typography.Text>
          <Typography.Text>x_прав=min(x₂,u₂),</Typography.Text>
          <Typography.Text>y_низ=max(y₁,v₁),</Typography.Text>
          <Typography.Text>y_верх=min(y₂,v₂).</Typography.Text>
          <Typography.Text>Почему слева берём максимум?</Typography.Text>
          <Typography.Text>
            Чтобы находиться в обоих прямоугольниках, точка должна пройти более
            строгую из двух левых границ.
          </Typography.Text>
          <Typography.Text>Почему справа минимум?</Typography.Text>
          <Typography.Text>
            Она не должна выйти за более близкую из двух правых границ.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <Typography.Text>x≥0, x≥3</Typography.Text>
          <Typography.Text>вместе означают:</Typography.Text>
          <Typography.Text>x≥3.</Typography.Text>
          <Typography.Text>А:</Typography.Text>
          <Typography.Text>x≤8, x≤10</Typography.Text>
          <Typography.Text>вместе означают:</Typography.Text>
          <Typography.Text>x≤8.</Typography.Text>
          <Typography.Text>Если получилось:</Typography.Text>
          <Typography.Text>x_лев{">"}x_прав</Typography.Text>
          <Typography.Text>или:</Typography.Text>
          <Typography.Text>y_низ{">"}y_верх,</Typography.Text>
          <Typography.Text>общих точек нет.</Typography.Text>
        </>
      ),
    },
    {
      id: "obedinenie",
      navLabel: "Объединение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Объединение фигур содержит точки, которые находятся хотя бы в
              одной фигуре.
            </strong>
          </Typography.Text>
          <Typography.Text>Для объединения подходят точки:</Typography.Text>
          <ul>
            <li>только в первой фигуре;</li>
            <li>только во второй;</li>
            <li>в обеих одновременно.</li>
          </ul>
          <Typography.Text>В нашем примере, с учётом границ:</Typography.Text>
          <ul>
            <li>в первой фигуре 63 точки;</li>
            <li>во второй:</li>
          </ul>
          <Typography.Text>(7+1)(5+1)=48</Typography.Text>
          <Typography.Text>точек;</Typography.Text>
          <ul>
            <li>в пересечении 30 точек.</li>
          </ul>
          <Typography.Text>Если сложить:</Typography.Text>
          <Typography.Text>63+48,</Typography.Text>
          <Typography.Text>общие точки будут посчитаны дважды.</Typography.Text>
          <Typography.Text>
            Поэтому один их экземпляр нужно убрать:
          </Typography.Text>
          <Typography.Text>N_объединение=63+48-30=81.</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttRects080631027_any}
            caption={
              <>
                Объединение: каждая общая точка отмечена один раз, 63 + 48 − 30
                = 81.
              </>
            }
          />
          <Typography.Text>Общий принцип:</Typography.Text>
          <Typography.Text>
            N_объединение = N_первая + N_вторая - N_пересечение.
          </Typography.Text>
          <Typography.Text>
            Он работает для количества различных точек в соответствующих
            областях.
          </Typography.Text>
          <Typography.Text>Аналогично для площади:</Typography.Text>
          <Typography.Text>
            S_объединение = S_первая + S_вторая - S_пересечение.
          </Typography.Text>
          <Typography.Text>В нашем примере:</Typography.Text>
          <Typography.Text>48+35-20=63.</Typography.Text>
          <Typography.Text>
            Число 63 здесь выражает площадь объединения. Ранее таким же числом
            выражалось количество точек первого прямоугольника вместе с
            границей. Это разные величины, которые случайно совпали численно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tolko-v-odnoj-figure",
      navLabel: "Только в одной фигуре",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Фраза «только в одной фигуре» исключает общую часть.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если требуется посчитать точки, принадлежащие ровно одной из двух
            фигур, подходят:
          </Typography.Text>
          <ul>
            <li>точки первой фигуры вне второй;</li>
            <li>точки второй фигуры вне первой.</li>
          </ul>
          <Typography.Text>
            Точки пересечения исключаются полностью.
          </Typography.Text>
          <Typography.Text>
            При сложении N_первая+N_вторая они входят дважды. Поэтому нужно
            вычесть их дважды:
          </Typography.Text>
          <Typography.Text>
            N_ровно одна = N_первая + N_вторая - 2N_пересечение.
          </Typography.Text>
          <Typography.Text>Для нашего примера с границами:</Typography.Text>
          <Typography.Text>63+48-2·30=51.</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttRects080631027_one}
            caption={
              <>
                Ровно в одной фигуре: общая часть исключена целиком, 63 + 48 − 2
                · 30 = 51.
              </>
            }
          />
          <Typography.Text>
            Если требуется только часть первой фигуры, которая не принадлежит
            второй:
          </Typography.Text>
          <Typography.Text>63-30=33.</Typography.Text>
          <Typography.Text>Смысл формулировок удобно сравнить:</Typography.Text>
          <LessonTable
            label={"Смысл формулировок удобно сравнить"}
            columns={[
              { label: "Формулировка" },
              { label: "Какие точки подходят" },
            ]}
            rows={[
              ["В пересечении", "В обеих фигурах"],
              ["В объединении", "Хотя бы в одной"],
              ["Ровно в одной", "В одной, но не в обеих"],
              ["В первой, вне второй", "В первой и одновременно не во второй"],
            ]}
          />
          <Typography.Text>
            При использовании этих формул условия принадлежности должны
            совпадать: нельзя одно количество брать вместе с границей, другое
            строго внутри, а третье по ещё одному правилу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tri-figury",
      navLabel: "Три фигуры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для трёх фигур общие части вычитают попарно, а общую часть всех
              трёх возвращают.
            </strong>{" "}
            Пусть A: 0 ≤ x ≤ 4, 0 ≤ y ≤ 4; B: 2 ≤ x ≤ 6, 0 ≤ y ≤ 4; C: 1 ≤ x ≤
            5, 2 ≤ y ≤ 6 — в каждой 25 точек с границей. Попарные пересечения: A
            и B — 2 ≤ x ≤ 4, 0 ≤ y ≤ 4, 15 точек; A и C — 1 ≤ x ≤ 4, 2 ≤ y ≤ 4,
            12; B и C — 2 ≤ x ≤ 5, 2 ≤ y ≤ 4, 12. Все три — 2 ≤ x ≤ 4, 2 ≤ y ≤
            4, 9 точек.
          </Typography.Text>
          <Typography.Text>
            N_объединение = 25 + 25 + 25 − 15 − 12 − 12 + 9 = 45.
          </Typography.Text>
          <Typography.Text>
            Почему 9 прибавляют обратно: точка общей части всех трёх посчитана в
            сумме трижды и трижды вычтена с попарными пересечениями — без
            поправки её бы не было вовсе. Для трёх и более фигур надёжнее
            проверить ответ перебором точек: точка входит в объединение, если
            она в A, или в B, или в C.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "peresechenie-po-granice",
      navLabel: "Пересечение по границе",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При включении границ пересечение может оказаться отрезком или
              одной точкой.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим два прямоугольника:</Typography.Text>
          <Typography.Text>A: 0≤ x≤3, 0≤ y≤2,</Typography.Text>
          <Typography.Text>B: 3≤ x≤5, 0≤ y≤2.</Typography.Text>
          <Typography.Text>Они соприкасаются по стороне:</Typography.Text>
          <Typography.Text>x=3, 0≤ y≤2.</Typography.Text>
          <Typography.Text>
            Общая область не имеет положительной площади. Но в ней есть три
            целочисленные точки:
          </Typography.Text>
          <Typography.Text>(3;0), (3;1), (3;2).</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttRects03023502_both_3e0862}
            caption={
              <>
                Прямоугольники соприкасаются по стороне x = 3: площадь общей
                части 0, общих целых точек 3.
              </>
            }
          />
          <Typography.Text>Поэтому:</Typography.Text>
          <ul>
            <li>площадь пересечения — 0;</li>
            <li>количество общих точек с учётом границ — 3;</li>
            <li>количество точек строго внутри пересечения — 0.</li>
          </ul>
          <Typography.Text>
            Если две фигуры соприкасаются только в одной целочисленной вершине,
            при включении границ ответ может быть 1.
          </Typography.Text>
          <Typography.Text>
            Поэтому нулевая площадь не означает автоматически отсутствие общих
            точек.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica-obedineniya",
      navLabel: "Граница объединения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Граница объединения и границы отдельных фигур требуют
              внимательного чтения условия.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим два соседних квадрата:</Typography.Text>
          <Typography.Text>A: 0≤ x≤2, 0≤ y≤2,</Typography.Text>
          <Typography.Text>B: 2≤ x≤4, 0≤ y≤2.</Typography.Text>
          <Typography.Text>Вместе они образуют прямоугольник:</Typography.Text>
          <Typography.Text>0≤ x≤4, 0≤ y≤2.</Typography.Text>
          <Typography.Text>Точка:</Typography.Text>
          <Typography.Text>(2;1)</Typography.Text>
          <Typography.Text>
            лежит на общей стороне двух квадратов.
          </Typography.Text>
          <Typography.Text>
            Относительно каждого отдельного квадрата она находится на границе.
          </Typography.Text>
          <Typography.Text>
            Но относительно их объединения она находится <strong>внутри</strong>{" "}
            большого прямоугольника: общая сторона проходит внутри общей
            области.
          </Typography.Text>
          <Typography.Text>Отсюда различие:</Typography.Text>
          <ul>
            <li>
              «строго внутри хотя бы одной из исходных фигур» — точка не
              подходит;
            </li>
            <li>«строго внутри объединения» — точка подходит;</li>
            <li>
              «точки на всех нарисованных линиях не учитывать» — точка не
              подходит, поскольку общая сторона была нарисована.
            </li>
          </ul>
          <Typography.Text>
            Для объединения с включёнными границами обычная проверка{" "}
            <Notation>{"in_A or in_B"}</Notation> подходит.
          </Typography.Text>
          <Typography.Text>
            Если исключается именно внешняя граница объединения, нельзя во всех
            случаях просто заменить принадлежность каждой фигуре на строгое
            вхождение. Сначала нужно понять, где проходит внешний контур
            объединённой области.
          </Typography.Text>
          <Typography.Text>
            Это более тонкий случай. Его полезно знать, чтобы не превращать
            формулы в механическое правило.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "figury-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Переход между фигурами делают с поднятым хвостом: положение
                    и направление сохраняются, линии нет.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Пересечение прямоугольников: левая и нижняя границы —
                    максимумы, правая и верхняя — минимумы; если левая больше
                    правой, общих точек нет.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Объединение: N₁ + N₂ − N_общ; ровно в одной: N₁ + N₂ −
                    2N_общ; в первой, вне второй: N₁ − N_общ.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Все три числа берут при одном правиле границ: либо все с
                    границей, либо все строго внутри.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Нулевая площадь общей части не значит, что общих точек нет:
                    соприкосновение по стороне даёт точки на ней.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "naklonnye-storony",
      navLabel: "Наклонные стороны",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наклонную сторону нельзя считать по ширине и высоте: целые точки
              ищут по столбцам, проверяя каждую точной формулой стороны.
            </strong>{" "}
            Наклонные стороны есть в 22 задачах подборок из 54; реальная задача
            ЕГЭ-2026 (Дальний Восток) — наклонный параллелограмм.
          </Typography.Text>
          <Typography.Text>
            Главный пример — равносторонний треугольник со стороной 8. Счёт по
            рядам и столбцам из подтемы 3 остаётся тем же; новое — нецелые
            вершины и проверка спорной точки по уравнению стороны.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naklon-na-setke",
      navLabel: "Наклон на сетке",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наклонные стороны удобно исследовать по той же сетке.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Модуль <Notation>{"turtle"}</Notation> самостоятельно выполняет
            движения под любыми указанными углами.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <CodeBlock
            code={"Повтори 7 [\n    Вперёд 8\n    Направо 120\n]"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>Начальное направление — вверх.</Typography.Text>
          <Typography.Text>Перевод:</Typography.Text>
          <CodeBlock
            code={"for _ in range(7):\n    t.forward(8 * k)\n    t.right(120)"}
            label={"Перевод"}
            language="python"
          />
          <Typography.Text>
            После трёх повторений получается равносторонний треугольник со
            стороной 8.
          </Typography.Text>
          <Typography.Text>
            Следующие три повторения проходят по нему ещё раз.
          </Typography.Text>
          <Typography.Text>
            Седьмое повторение проходит по первой стороне в третий раз.
          </Typography.Text>
          <Typography.Text>
            Таким образом, область остаётся одним треугольником.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Семь повторений здесь не означают семь разных сторон.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "polozhenie-treugolnika",
      navLabel: "Положение треугольника",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рассчитаем положение треугольника, чтобы понять его границы.
            </strong>
          </Typography.Text>
          <Typography.Text>Обозначим вершины:</Typography.Text>
          <Typography.Text>A=(0;0), B=(0;8).</Typography.Text>
          <Typography.Text>
            Третья вершина находится справа от вертикальной стороны AB.
          </Typography.Text>
          <Typography.Text>
            Поскольку расстояния от неё до A и B одинаковы, она расположена на
            уровне середины этой стороны:
          </Typography.Text>
          <Typography.Text>y=4.</Typography.Text>
          <Typography.Text>
            Обозначим её горизонтальное удаление от оси Oy через h.
          </Typography.Text>
          <Typography.Text>
            Получается прямоугольный треугольник:
          </Typography.Text>
          <ul>
            <li>одна сторона равна 4;</li>
            <li>другая равна h;</li>
            <li>наклонная сторона равна 8.</li>
          </ul>
          <Typography.Text>По теореме Пифагора:</Typography.Text>
          <Typography.Text>h²+4²=8².</Typography.Text>
          <Typography.Text>Значит:</Typography.Text>
          <Typography.Text>h²=64-16=48,</Typography.Text>
          <Typography.Text>h=√48=4√3.</Typography.Text>
          <Typography.Text>Поэтому третья вершина:</Typography.Text>
          <Typography.Text>C=(4√3;4).</Typography.Text>
          <Typography.Text>Приближённо:</Typography.Text>
          <Typography.Text>C ≈ (6,928;4).</Typography.Text>
          <Typography.Text>
            Черепаха может оказаться в точке с нецелыми координатами, хотя длины
            всех движений были целыми.
          </Typography.Text>
          <Typography.Text>Причина — наклонное направление.</Typography.Text>
          <Typography.Text>
            Целочисленные длины команд не гарантируют целочисленные координаты
            всех вершин.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochki-mezhdu-naklonnymi",
      navLabel: "Точки между наклонными",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Внутри этого треугольника нужно считать точки между двумя
              наклонными сторонами.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Нижняя наклонная сторона проходит через:
          </Typography.Text>
          <Typography.Text>(0;0)</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>(4√3;4).</Typography.Text>
          <Typography.Text>
            При увеличении x на 4√3 координата y увеличивается на 4.
          </Typography.Text>
          <Typography.Text>
            Поэтому отношение вертикального изменения к горизонтальному равно:
          </Typography.Text>
          <Typography.Text>4/4√3=1/√3.</Typography.Text>
          <Typography.Text>На этой стороне:</Typography.Text>
          <Typography.Text>y=x/√3.</Typography.Text>
          <Typography.Text>
            Верхняя наклонная сторона начинается в (0;8) и спускается с такой же
            крутизной:
          </Typography.Text>
          <Typography.Text>y=8-x/√3.</Typography.Text>
          <Typography.Text>Строго внутри треугольника:</Typography.Text>
          <Typography.Text>x{">"}0</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>
            x/√3{"<"}y{"<"}8-x/√3.
          </Typography.Text>
          <Typography.Text>
            Но для основного способа через <Notation>{"turtle"}</Notation> можно
            просто построить треугольник и посчитать отметки по столбцам.
          </Typography.Text>
          <Typography.Text>Для целых положительных x получаем:</Typography.Text>
          <LessonTable
            label={"Для целых положительных x получаем"}
            columns={[
              { label: "x", numeric: true },
              { label: "Допустимые целые y внутри" },
              { label: "Количество", numeric: true },
            ]}
            rows={[
              ["1", "1, 2, 3, 4, 5, 6, 7", "7"],
              ["2", "2, 3, 4, 5, 6", "5"],
              ["3", "2, 3, 4, 5, 6", "5"],
              ["4", "3, 4, 5", "3"],
              ["5", "3, 4, 5", "3"],
              ["6", "4", "1"],
            ]}
          />
          <Typography.Text>
            При x=7 мы уже правее третьей вершины, поскольку:
          </Typography.Text>
          <Typography.Text>7{">"}4√3.</Typography.Text>
          <Typography.Text>Сумма:</Typography.Text>
          <Typography.Text>7+5+5+3+3+1=24.</Typography.Text>
          <Typography.Text>
            <strong>
              Строго внутри треугольника находятся 24 целочисленные точки.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw78120_ea0785}
            caption={
              <>
                Равносторонний треугольник со стороной 8: по столбцам 7, 5, 5,
                3, 3, 1 — всего 24 внутри; на линиях только 9 точек вертикальной
                стороны.
              </>
            }
          />
          <Typography.Text>
            Такой подсчёт хорошо проверяется: для каждого столбца отдельно
            определяются нижняя и верхняя допустимые точки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica-treugolnika",
      navLabel: "Граница треугольника",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для треугольника граница тоже должна исследоваться отдельно.
            </strong>
          </Typography.Text>
          <Typography.Text>
            На вертикальной стороне x=0 находятся точки:
          </Typography.Text>
          <Typography.Text>(0;0),(0;1),…,(0;8).</Typography.Text>
          <Typography.Text>Их 9.</Typography.Text>
          <Typography.Text>На наклонной стороне:</Typography.Text>
          <Typography.Text>y=x/√3</Typography.Text>
          <Typography.Text>
            при ненулевом целом x значение y не будет целым.
          </Typography.Text>
          <Typography.Text>
            На второй наклонной стороне ситуация аналогичная.
          </Typography.Text>
          <Typography.Text>
            Поэтому целочисленные точки на границе этого треугольника — только 9
            точек вертикальной стороны.
          </Typography.Text>
          <Typography.Text>Вместе с границей:</Typography.Text>
          <Typography.Text>24+9=33.</Typography.Text>
          <Typography.Text>
            Обрати внимание: третья вершина не учитывается как целочисленная
            точка, потому что её координата x=4√3 нецелая.
          </Typography.Text>
          <Typography.Text>
            И ещё один важный вывод:{" "}
            <strong>
              наклонная сторона в других задачах вполне может проходить через
              целочисленные точки
            </strong>
            .
          </Typography.Text>
          <Typography.Text>Например, отрезок на прямой:</Typography.Text>
          <Typography.Text>y=x</Typography.Text>
          <Typography.Text>может содержать точки:</Typography.Text>
          <Typography.Text>(1;1),(2;2),(3;3).</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw445645_e89b03}
            caption={
              <>
                Квадрат со стороной 6, повёрнутый на 45°: его вершины нецелые,
                но стороны на прямых y = x и y = −x проходят через целые точки
                (1; 1), (2; 2) …
              </>
            }
          />
          <Typography.Text>
            Нельзя исключать все точки на наклонных сторонах только из-за
            наклона.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sedmoe-povtorenie",
      navLabel: "Седьмое повторение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Седьмое повторение в примере с треугольником влияет на конечное
              состояние.
            </strong>
          </Typography.Text>
          <Typography.Text>
            После трёх повторений Черепаха находится в (0;0) и снова смотрит
            вверх.
          </Typography.Text>
          <Typography.Text>После шести — то же самое.</Typography.Text>
          <Typography.Text>На седьмом повторении:</Typography.Text>
          <ol>
            <li>Идёт вверх на 8.</li>
            <li>Оказывается в (0;8).</li>
            <li>Поворачивается направо на 120°.</li>
          </ol>
          <Typography.Text>Новое направление:</Typography.Text>
          <Typography.Text>90°-120°=-30°,</Typography.Text>
          <Typography.Text>то есть:</Typography.Text>
          <Typography.Text>330°.</Typography.Text>
          <Typography.Text>Итог после семи повторений:</Typography.Text>
          <ul>
            <li>положение (0;8);</li>
            <li>направление 330°.</li>
          </ul>
          <Typography.Text>
            Если дальше в условии будут новые команды, они начнут выполняться
            именно из этого состояния.
          </Typography.Text>
          <Typography.Text>
            Поэтому при переводе в Python оставляем:
          </Typography.Text>
          <CodeBlock
            code={"range(7)"}
            label={"Поэтому при переводе в Python оставляем"}
            language="python"
          />
          <Typography.Text>
            даже если для изображения контура хватило бы трёх повторений.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naklonnyj-chetyrehugolnik",
      navLabel: "Наклонный четырёхугольник",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наклонный четырёхугольник строится по тем же правилам.
            </strong>
          </Typography.Text>
          <Typography.Text>Рассмотрим:</Typography.Text>
          <CodeBlock
            code={
              "Повтори 4 [\n    Вперёд 6\n    Направо 60\n    Вперёд 6\n    Направо 120\n]"
            }
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>Начальное направление — вверх.</Typography.Text>
          <Typography.Text>Перевод:</Typography.Text>
          <CodeBlock
            code={
              "for _ in range(4):\n    t.forward(6 * k)\n    t.right(60)\n    t.forward(6 * k)\n    t.right(120)"
            }
            label={"Перевод"}
            language="python"
          />
          <Typography.Text>
            За первое повторение Черепаха рисует две стороны и суммарно
            поворачивается на:
          </Typography.Text>
          <Typography.Text>60°+120°=180°.</Typography.Text>
          <Typography.Text>
            За второе рисует оставшиеся две стороны и возвращается в исходное
            состояние.
          </Typography.Text>
          <Typography.Text>
            Получается <strong>ромб</strong> — четырёхугольник с четырьмя
            равными сторонами.
          </Typography.Text>
          <Typography.Text>
            Третье и четвёртое повторения проходят по нему ещё раз.
          </Typography.Text>
          <Typography.Text>
            После построения и нанесения сетки можно посчитать внутренние точки
            по вертикальным столбцам:
          </Typography.Text>
          <LessonTable
            label={"x, Целые y строго внутри, Количество"}
            columns={[
              { label: "x", numeric: true },
              { label: "Целые y строго внутри" },
              { label: "Количество", numeric: true },
            ]}
            rows={[
              ["1", "1, 2, 3, 4, 5, 6", "6"],
              ["2", "2, 3, 4, 5, 6, 7", "6"],
              ["3", "2, 3, 4, 5, 6, 7", "6"],
              ["4", "3, 4, 5, 6, 7, 8", "6"],
              ["5", "3, 4, 5, 6, 7, 8", "6"],
            ]}
          />
          <Typography.Text>Всего:</Typography.Text>
          <Typography.Text>5·6=30.</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw46606120_a25a85}
            caption={
              <>
                Ромб с углами 60° и 120°: в каждом из пяти столбцов по 6
                внутренних точек.
              </>
            }
          />
          <Typography.Text>
            Здесь у каждого столбца одинаковое количество внутренних точек, хотя
            верхняя и нижняя точки столбцов смещаются.
          </Typography.Text>
          <Typography.Text>
            Для понимания этой задачи важно увидеть, что два поворота на 60° и
            120° не превращают фигуру в прямоугольник. Нужно сохранить реальные
            команды и исследовать рисунок.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "spornaya-tochka",
      navLabel: "Спорная точка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Спорную точку у границы нужно проверять по геометрии, а не по
              толщине линии.
            </strong>
          </Typography.Text>
          <Typography.Text>
            На рисунке отметка может выглядеть почти лежащей на наклонной
            стороне.
          </Typography.Text>
          <Typography.Text>В таком случае:</Typography.Text>
          <ol>
            <li>Определи координаты точки по сетке.</li>
            <li>Установи, через какие вершины проходит сторона.</li>
            <li>
              Проверь точку по уравнению стороны или другой известной связи.
            </li>
          </ol>
          <Typography.Text>Для стороны:</Typography.Text>
          <Typography.Text>y=x</Typography.Text>
          <Typography.Text>
            точка (2;2) лежит на линии, потому что:
          </Typography.Text>
          <Typography.Text>2=2.</Typography.Text>
          <Typography.Text>Точка (2;3) выше линии, потому что:</Typography.Text>
          <Typography.Text>3{">"}2.</Typography.Text>
          <Typography.Text>Для стороны:</Typography.Text>
          <Typography.Text>y=x/√3</Typography.Text>
          <Typography.Text>точка (3;2) находится выше линии:</Typography.Text>
          <Typography.Text>2{">"}3/√3=√3 ≈ 1,732.</Typography.Text>
          <Typography.Text>
            В треугольнике это означает, что точка прошла проверку нижней
            границы. После этого нужно проверить верхнюю.
          </Typography.Text>
          <Typography.Text>Если одновременно:</Typography.Text>
          <Typography.Text>x/√3{"<"}y</Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>y{"<"}8-x/√3,</Typography.Text>
          <Typography.Text>точка находится между сторонами.</Typography.Text>
        </>
      ),
    },
    {
      id: "pogreshnost-koordinat",
      navLabel: "Погрешность координат",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Вычисленные координаты могут содержать небольшую погрешность.
            </strong>
          </Typography.Text>
          <Typography.Text>
            При наклонном движении Python использует приближённые числовые
            вычисления.
          </Typography.Text>
          <Typography.Text>
            Поэтому математический ноль иногда может отображаться как очень
            маленькое число, например:
          </Typography.Text>
          <CodeBlock
            code={"0.00000000000002"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            Для проверки положения можно вывести:
          </Typography.Text>
          <CodeBlock
            code={"print(t.xcor() / k, t.ycor() / k)"}
            label={"Для проверки положения можно вывести"}
            language="python"
          />
          <Typography.Text>Команды:</Typography.Text>
          <ul>
            <li>
              <Notation>{"t.xcor()"}</Notation> возвращает текущую
              горизонтальную координату;
            </li>
            <li>
              <Notation>{"t.ycor()"}</Notation> — вертикальную.
            </li>
          </ul>
          <Typography.Text>
            Деление на <Notation>{"k"}</Notation> возвращает координаты из
            экранных единиц в единицы задачи.
          </Typography.Text>
          <Typography.Text>Для удобного отображения:</Typography.Text>
          <CodeBlock
            code={
              "print(\n    round(t.xcor() / k, 6),\n    round(t.ycor() / k, 6)\n)"
            }
            label={"Для удобного отображения"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"round(число, 6)"}</Notation> округляет число до шести
            знаков после десятичной точки.
          </Typography.Text>
          <Typography.Text>
            Но округление здесь используется для чтения результата. Нельзя
            автоматически округлять все координаты вершин до целых при
            математическом подсчёте.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <Typography.Text>4√3 ≈ 6,928.</Typography.Text>
          <Typography.Text>
            Если заменить эту координату числом 7, мы изменим границу фигуры.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proverka-konechnogo-polozheniya",
      navLabel: "Проверка конечного положения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Конечное положение нужно проверять до нанесения сетки.
            </strong>
          </Typography.Text>
          <Typography.Text>Полезный диагностический фрагмент:</Typography.Text>
          <CodeBlock
            code={
              'print(\n    "Координаты:",\n    round(t.xcor() / k, 6),\n    round(t.ycor() / k, 6)\n)\n\nprint("Направление:", t.heading())'
            }
            label={"Полезный диагностический фрагмент"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"t.heading()"}</Notation> возвращает текущее направление
            в градусах.
          </Typography.Text>
          <Typography.Text>
            Эти строки нужно ставить сразу после алгоритма из условия.
          </Typography.Text>
          <Typography.Text>Почему?</Typography.Text>
          <Typography.Text>Сетка тоже рисуется перемещениями:</Typography.Text>
          <CodeBlock
            code={"t.goto(...)"}
            label={"Сетка тоже рисуется перемещениями"}
            language="python"
          />
          <Typography.Text>
            Поэтому после нанесения всех точек Черепаха окажется в последней
            точке сетки.
          </Typography.Text>
          <Typography.Text>
            Если вывести координаты после этого, ты получишь положение после
            вспомогательных действий, а не после исходного алгоритма.
          </Typography.Text>
          <Typography.Text>
            Для задач с несколькими фигурами можно временно выводить состояние
            после каждого большого блока. Это помогает проверить, откуда
            начнётся следующий.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nevypuklaya-figura",
      navLabel: "Невыпуклая фигура",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Невыпуклую фигуру из прямых углов разбивают на прямоугольники и
              следят за общей стороной.
            </strong>{" "}
            Алгоритм «Вперёд 6 Направо 90 Вперёд 3 Направо 90 Вперёд 3 Налево 90
            Вперёд 3 Направо 90 Вперёд 3 Направо 90 Вперёд 6» из (0; 0) вверх
            рисует букву Г: высокую часть 0 ≤ x ≤ 3, 0 ≤ y ≤ 6 и низкую 3 ≤ x ≤
            6, 0 ≤ y ≤ 3.
          </Typography.Text>
          <Typography.Text>
            Строго внутри высокой части (3 − 1)(6 − 1) = 10 точек, строго внутри
            низкой (3 − 1)(3 − 1) = 4. Но этого мало: линия x = 3 между частями
            при 0 {"<"} y {"<"} 3 <strong>не нарисована</strong> — она проходит
            внутри фигуры. Её точки (3; 1) и (3; 2) тоже внутренние. Всего 10 +
            4 + 2 = 16.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw6903903903903906_c09c90}
            caption={
              <>
                Фигура Г: 10 точек высокой части, 4 низкой и 2 точки на линии
                разреза x = 3, которой на рисунке нет.
              </>
            }
          />
          <Typography.Text>
            Формулы прямоугольника применяют к частям, а точки на линии разреза
            проверяют отдельно: внутри они или на нарисованной стороне. Площадь
            по разбиению — 3 · 6 + 3 · 3 = 27; периметр — сумма нарисованных
            сторон 6 + 3 + 3 + 3 + 3 + 6 = 24, линия разреза в него не входит.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naklon-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Целые длины команд не дают целых вершин: при поворотах на
                    60°, 120°, 45° вершина может оказаться в (4√3; 4) ≈ (6,928;
                    4).
                  </>
                ),
              },
              {
                note: (
                  <>
                    Внутренние точки считают по столбцам: для каждого x — нижняя
                    и верхняя допустимые y.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Спорную точку проверяют по уравнению стороны, а не по
                    рисунку; округлять вершину до целого нельзя.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Наклонная сторона может проходить через целые точки (прямая
                    y = x) — проверяют, а не исключают.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Невыпуклую фигуру разбивают на прямоугольники; точки на
                    ненарисованной линии разреза — внутренние.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Повторы после замыкания не добавляют сторон, но меняют
                    конечное состояние.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "obratnyj-vopros",
      navLabel: "Обратный вопрос",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В обратном вопросе фигура известна с точностью до одного числа, а
              ответ — само это число: наименьшая сторона, лучшее положение
              второй фигуры или сколько раз Черепаха побывала в точке.
            </strong>{" "}
            Такие вопросы встречаются в 5 задачах подборок из 54, среди задач
            2025–2026 годов их нет. Основные задачи и итоговая страница эту
            подтему не требуют.
          </Typography.Text>
          <Typography.Text>
            Главный пример — снова прямоугольник: одна его сторона равна
            неизвестному натуральному A. Подсчёт точек по формулам подтемы 3
            остаётся тем же; новое — неизвестное стоит не в ответе, а в условии.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-tochek-ot-parametra",
      navLabel: "Число точек от параметра",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала записывают число точек как функцию параметра, потом решают
              неравенство из вопроса.
            </strong>{" "}
            Алгоритм:
          </Typography.Text>
          <CodeBlock
            code={
              "Повтори 2 [\n    Вперёд A\n    Направо 90\n    Вперёд 6\n    Направо 90\n]"
            }
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            Из (0; 0) вверх он рисует прямоугольник шириной 6 и высотой A. По
            формуле подтемы 3 строго внутри
          </Typography.Text>
          <Typography.Text>N(A) = (6 − 1)(A − 1) = 5(A − 1).</Typography.Text>
          <Typography.Text>
            Вопрос: при каком наименьшем натуральном A внутри{" "}
            <strong>не менее</strong> 40 точек?
          </Typography.Text>
          <Typography.Text>5(A − 1) ≥ 40, A − 1 ≥ 8, A ≥ 9.</Typography.Text>
          <Typography.Text>
            Проверяем соседей: N(8) = 35 — мало, N(9) = 40 — уже достаточно.
            Ответ 9.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw2990690_d5ed79}
            caption={
              <>
                При A = 9: пять столбцов по 8 точек, ровно 40 — первое A, при
                котором порог «не менее 40» выполнен.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "strogij-i-nestrogij-porog",
      navLabel: "Строгий и нестрогий порог",
      explanation: (
        <>
          <Typography.Text>
            <strong>Строгий и нестрогий порог дают разные ответы.</strong> Если
            спрашивают «<strong>больше</strong> 40», то
          </Typography.Text>
          <Typography.Text>
            5(A − 1) {">"} 40, A − 1 {">"} 8, A ≥ 10.
          </Typography.Text>
          <Typography.Text>
            При A = 9 точек ровно 40 — это не больше 40. Ответ 10.
          </Typography.Text>
          <Typography.Text>
            Поэтому неравенство переписывают из условия дословно: «не менее» —
            ≥, «больше» — {">"}, «не более» — ≤. И всегда проверяют найденное A
            и предыдущее: первое должно подходить, второе — нет. Так ловится
            ошибка на единицу.
          </Typography.Text>
          <Typography.Text>
            Наименьшее A можно найти и перебором: для каждого A посчитать точки,
            остановиться на первом подходящем.
          </Typography.Text>
          <CodeBlock
            code={
              "for A in range(1, 20):\n    count = 0\n    for x in range(0, 7):\n        for y in range(0, A + 1):\n            if 0 < x < 6 and 0 < y < A:\n                count += 1\n    if count >= 40:\n        print(A, count)\n        break"
            }
            label={"Код на Python: for A in range(1, 20):"}
            language="python"
            output={"9 40"}
          />
          <Typography.Text>
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>{" "}
            останавливает внешний цикл на первом подходящем A — оно и есть
            наименьшее, потому что A перебираются по возрастанию.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naibolshee-peresechenie",
      navLabel: "Наибольшее пересечение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если положение второй фигуры можно выбрать, наибольшее пересечение
              оценивают сверху по каждой оси отдельно.
            </strong>{" "}
            Первая фигура — прямоугольник 0 ≤ x ≤ 8, 0 ≤ y ≤ 6. Вторая — квадрат
            4 × 4, его левый нижний угол (p; q) можно поставить в любую целую
            точку. Сколько наибольшее число целых точек в пересечении, включая
            границу?
          </Typography.Text>
          <Typography.Text>
            Пересечение лежит внутри квадрата, поэтому точек в нём не больше,
            чем в квадрате: (4 + 1)(4 + 1) = 25. Это достижимо: квадрат
            помещается в прямоугольник целиком, например при (p; q) = (0; 0).
            Ответ 25.
          </Typography.Text>
          <Typography.Text>
            Сколько таких положений? Квадрат целиком внутри, когда 0 ≤ p и p + 4
            ≤ 8, то есть p = 0 … 4, и 0 ≤ q и q + 4 ≤ 6, то есть q = 0 … 2.
            Всего 5 · 3 = 15 положений.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "figura-ne-pomeshchaetsya",
      navLabel: "Фигура не помещается",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Когда вторая фигура не помещается, общая часть по каждой оси не
              длиннее меньшей из двух сторон.
            </strong>{" "}
            Пусть теперь вторая фигура — квадрат 7 × 7. По высоте он больше
            прямоугольника: общая часть по y не длиннее 6. По ширине общая часть
            не длиннее 7. Значит, в пересечении не больше (7 + 1)(6 + 1) = 56
            точек.
          </Typography.Text>
          <Typography.Text>
            Оценка достигается: при (p; q) = (1; −1) квадрат занимает 1 ≤ x ≤ 8,
            −1 ≤ y ≤ 6, а пересечение — 1 ≤ x ≤ 8, 0 ≤ y ≤ 6.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttRects08061816_both}
            caption={
              <>
                Квадрат 7 × 7 (пунктир) при (p; q) = (1; −1): по ширине общая
                часть 7, по высоте 6 — больше быть не может.
              </>
            }
          />
          <Typography.Text>
            Перебор всех положений подтверждает оценку. Границы общей части — те
            же максимумы и минимумы, что в подтеме 4:
          </Typography.Text>
          <CodeBlock
            code={
              "best = 0\nfor p in range(-8, 9):\n    for q in range(-8, 9):\n        left, right = max(0, p), min(8, p + 7)\n        low, high = max(0, q), min(6, q + 7)\n        if left <= right and low <= high:\n            n = (right - left + 1) * (high - low + 1)\n            best = max(best, n)\nprint(best)"
            }
            label={
              "Границы общей части — те же максимумы и минимумы, что в подтеме 4"
            }
            language="python"
            output={"56"}
          />
        </>
      ),
    },
    {
      id: "poseshcheniya",
      navLabel: "Посещения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Посещение — это момент, когда Черепаха оказывается в точке, а не
              сама точка.
            </strong>{" "}
            Повтор, который проходит часть контура второй раз, не добавляет
            точек на линии, но добавляет посещений. Поэтому в таком вопросе
            Черепаху ведут по единичным шагам и для каждой целой точки ведут
            счётчик.
          </Typography.Text>
          <Typography.Text>
            Алгоритм «Повтори 6 [Вперёд 2 Направо 90]» из (0; 0) вверх. Четыре
            повторения обходят квадрат 2 × 2, ещё два — его левую и верхнюю
            стороны второй раз. По единичным шагам Черепаха проходит точки
          </Typography.Text>
          <Typography.Text>
            (0; 0) → (0; 1) → (0; 2) → (1; 2) → (2; 2) → (2; 1) → (2; 0) → (1;
            0) → (0; 0) → (0; 1) → (0; 2) → (1; 2) → (2; 2).
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw6290_5c0405}
            caption={
              <>
                На линиях 8 различных точек; левая и верхняя стороны пройдены
                дважды, Черепаха остановилась в (2; 2).
              </>
            }
          />
          <Typography.Text>
            Различных точек на линиях 8. Дважды Черепаха была в (0; 0), (0; 1),
            (0; 2), (1; 2), (2; 2) — это 5 точек, если начальное положение
            считается посещением. Если не считается, (0; 0) посещена один раз —
            при возврате, — и ответ 4. Что считать посещением, говорит условие;
            без этого задачу решить нельзя.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "schetchik-poseshchenij",
      navLabel: "Счётчик посещений",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Счётчик посещений программой: шаг на единицу и словарь «точка →
              сколько раз».
            </strong>{" "}
            Направление хранят как пару (dx; dy); поворот направо на 90°
            превращает (dx; dy) в (dy; −dx): вверх (0; 1) → вправо (1; 0) → вниз
            (0; −1) → влево (−1; 0).
          </Typography.Text>
          <CodeBlock
            code={
              "from collections import Counter\n\nx, y = 0, 0\ndx, dy = 0, 1\nseen = Counter([(x, y)])\nfor _ in range(6):\n    for _ in range(2):\n        x, y = x + dx, y + dy\n        seen[(x, y)] += 1\n    dx, dy = dy, -dx\nprint(len(seen), sum(1 for v in seen.values() if v >= 2))"
            }
            label={"Код на Python: from collections import Counter"}
            language="python"
            output={"8 5"}
          />
          <Typography.Text>
            <PythonTerm term="counter">
              <Notation>{"Counter"}</Notation>
            </PythonTerm>{" "}
            начинает со счётчика 1 у начальной точки — это решение «начальное
            положение — посещение». Чтобы его не считать, создают пустой{" "}
            <Notation>{"Counter()"}</Notation>. Такой счётчик годится только для
            поворотов на 90° и целых шагов: на наклонной стороне Черепаха
            проходит через целые точки не на каждом шаге.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obratnyj-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Параметр: число точек записывают формулой от A и решают
                    неравенство условия дословно; проверяют найденное A и
                    предыдущее.
                  </>
                ),
              },
              {
                note: (
                  <>
                    «Не менее» и «больше» отличаются на одно значение параметра.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Наибольшее пересечение при свободном положении: по каждой
                    оси общая часть не длиннее меньшей стороны; оценку
                    подтверждают положением, где она достигается.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Посещения — моменты, а не точки: ведут Черепаху по единичным
                    шагам и считают, сколько раз она была в каждой точке;
                    начальное положение считают, только если так сказано.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "podschet-programmoj",
      navLabel: "Подсчёт программой",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Когда фигура уже понятна, подсчёт можно поручить программе: она
              перебирает целые узлы и проверяет условие принадлежности,
              записанное по геометрии.
            </strong>{" "}
            Сначала рисунок и неравенства — потом код; без условия, выведенного
            из фигуры, программа считает не то. Дуги появляются в 2 задачах
            подборок из 54. Основные задачи и итоговая страница эту подтему не
            требуют.
          </Typography.Text>
          <Typography.Text>
            Главные примеры — прямоугольник 8 × 6 и треугольник со стороной 8 из
            подтем 3–5: программа должна получить уже известные 35, 63, 81 и 24.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uslovie-prinadlezhnosti",
      navLabel: "Условие принадлежности",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Автоматический подсчёт начинается с условия принадлежности точки.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, точка строго внутри нашего прямоугольника удовлетворяет:
          </Typography.Text>
          <Typography.Text>
            0{"<"}x{"<"}8
          </Typography.Text>
          <Typography.Text>и:</Typography.Text>
          <Typography.Text>
            0{"<"}y{"<"}6.
          </Typography.Text>
          <Typography.Text>В Python:</Typography.Text>
          <CodeBlock
            code={"0 < x < 8 and 0 < y < 6"}
            label={"В Python"}
            language="python"
          />
          <Typography.Text>
            <PythonTerm term="andor">
              <Notation>{"and"}</Notation>
            </PythonTerm>{" "}
            требует, чтобы выполнялись обе части. Перебираем целые координаты и
            считаем подходящие:
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\n\nfor x in range(-5, 16):\n    for y in range(-5, 16):\n        if 0 < x < 8 and 0 < y < 6:\n            count += 1\n\nprint(count)"
            }
            label={"Перебираем целые координаты и считаем подходящие"}
            language="python"
            output={"35"}
          />
          <Typography.Text>
            <PythonTerm term="nested">Два вложенных цикла</PythonTerm>{" "}
            перебирают все узлы квадрата −5 ≤ x, y ≤ 15;{" "}
            <PythonTerm term="if">условие</PythonTerm> пропускает только
            внутренние,{" "}
            <PythonTerm term="augassign">
              <Notation>{"count += 1"}</Notation>
            </PythonTerm>{" "}
            добавляет каждую подходящую точку ровно один раз.
          </Typography.Text>
          <Typography.Text>
            Для точек вместе с границей меняются только сравнения:
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\n\nfor x in range(-5, 16):\n    for y in range(-5, 16):\n        if 0 <= x <= 8 and 0 <= y <= 6:\n            count += 1\n\nprint(count)"
            }
            label={"Для точек вместе с границей меняются только сравнения"}
            language="python"
            output={"63"}
          />
          <Typography.Text>
            Сам перебор можно взять с запасом. Лишние внешние точки не будут
            учтены, потому что не пройдут условие.
          </Typography.Text>
          <Typography.Text>
            Но диапазон должен включать все потенциально подходящие точки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "koordinaty-bez-masshtaba",
      navLabel: "Координаты без масштаба",
      explanation: (
        <>
          <Typography.Text>
            <strong>При подсчёте по координатам масштаб уже не нужен.</strong>
          </Typography.Text>
          <Typography.Text>Рисование использует:</Typography.Text>
          <CodeBlock
            code={"t.goto(x * k, y * k)"}
            label={"Рисование использует"}
            language="python"
          />
          <Typography.Text>
            потому что нужно показать точку на экране.
          </Typography.Text>
          <Typography.Text>Проверка:</Typography.Text>
          <CodeBlock code={"0 < x < 8"} label={"Проверка"} language="python" />
          <Typography.Text>
            работает с координатами из условия задачи.
          </Typography.Text>
          <Typography.Text>
            Поэтому в неё не нужно добавлять <Notation>{"k"}</Notation>.
          </Typography.Text>
          <Typography.Text>Это две разные операции:</Typography.Text>
          <LessonTable
            label={"Это две разные операции"}
            columns={[
              { label: "Операция" },
              { label: "Какие координаты используются" },
            ]}
            rows={[
              ["Показать точку в окне", "Экранные: xk, yk"],
              [
                "Проверить её принадлежность области",
                "Координаты задачи: x, y",
              ],
            ]}
          />
          <Typography.Text>
            Если подставлять масштабированные координаты в условие, границы тоже
            пришлось бы масштабировать. Проще и понятнее выполнять
            математическую проверку в исходных единицах.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-pryamougolnika",
      navLabel: "Два прямоугольника",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для двух прямоугольников можно отдельно проверять принадлежность
              каждой фигуре.
            </strong>
          </Typography.Text>
          <Typography.Text>Для нашего примера:</Typography.Text>
          <CodeBlock
            code={
              "in_A = 0 <= x <= 8 and 0 <= y <= 6\nin_B = 3 <= x <= 10 and 2 <= y <= 7"
            }
            label={"Для нашего примера"}
            language="python"
          />
          <Typography.Text>
            Каждое выражение даёт{" "}
            <PythonTerm term="truthy">логическое значение</PythonTerm>{" "}
            <Notation>{"True"}</Notation> или <Notation>{"False"}</Notation>.
            Имена <Notation>{"in_A"}</Notation> и <Notation>{"in_B"}</Notation>{" "}
            хранят ответы на вопросы:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Принадлежит ли точка первой фигуре?
            </Typography.Text>
          </blockquote>
          <blockquote>
            <Typography.Text>
              Принадлежит ли точка второй фигуре?
            </Typography.Text>
          </blockquote>
          <Typography.Text>Для пересечения:</Typography.Text>
          <CodeBlock
            code={"if in_A and in_B:\n    count += 1"}
            label={"Для пересечения"}
            language="python"
          />
          <Typography.Text>Для объединения:</Typography.Text>
          <CodeBlock
            code={"if in_A or in_B:\n    count += 1"}
            label={"Для объединения"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"or"}</Notation> означает «или»: достаточно
            принадлежности хотя бы одной фигуре. Если точка принадлежит обеим,
            она тоже подходит.
          </Typography.Text>
          <Typography.Text>Для первой фигуры вне второй:</Typography.Text>
          <CodeBlock
            code={"if in_A and not in_B:\n    count += 1"}
            label={"Для первой фигуры вне второй"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"not"}</Notation> меняет логическое значение на
            противоположное.
          </Typography.Text>
          <Typography.Text>
            Для принадлежности ровно одной фигуре:
          </Typography.Text>
          <CodeBlock
            code={"if in_A != in_B:\n    count += 1"}
            label={"Для принадлежности ровно одной фигуре"}
            language="python"
          />
          <Typography.Text>
            Знак <Notation>{"!="}</Notation> означает «не равно».
          </Typography.Text>
          <Typography.Text>
            Два логических значения различаются, когда одно равно{" "}
            <Notation>{"True"}</Notation>, а другое{" "}
            <Notation>{"False"}</Notation>. Именно это и соответствует
            принадлежности ровно одной фигуре.
          </Typography.Text>
          <Typography.Text>
            Каждое из этих условий нужно использовать в отдельном подсчёте, в
            зависимости от вопроса задачи. Например, объединение:
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\n\nfor x in range(-1, 12):\n    for y in range(-1, 9):\n        in_A = 0 <= x <= 8 and 0 <= y <= 6\n        in_B = 3 <= x <= 10 and 2 <= y <= 7\n        if in_A or in_B:\n            count += 1\n\nprint(count)"
            }
            label={"Например, объединение"}
            language="python"
            output={"81"}
          />
          <Typography.Text>
            Это то же 63 + 48 − 30 из подтемы 4: программа не складывает фигуры,
            а проверяет каждую точку один раз, поэтому общие точки не
            удваиваются.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "treugolnik-programmoj",
      navLabel: "Треугольник программой",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для треугольника автоматическая проверка опирается на уже
              найденные наклонные границы.
            </strong>
          </Typography.Text>
          <Typography.Text>Мы получили:</Typography.Text>
          <Typography.Text>
            x/√3{"<"}y{"<"}8-x/√3.
          </Typography.Text>
          <Typography.Text>
            Квадратный корень даёт <Notation>{"math.sqrt"}</Notation> из{" "}
            <PythonTerm term="import">модуля</PythonTerm>{" "}
            <Notation>{"math"}</Notation> — это приближённое значение √3.
            Подсчёт:
          </Typography.Text>
          <CodeBlock
            code={
              "import math\n\ncount = 0\n\nfor x in range(1, 7):\n    for y in range(1, 8):\n        if x / math.sqrt(3) < y < 8 - x / math.sqrt(3):\n            count += 1\n\nprint(count)"
            }
            label={"Подсчёт"}
            language="python"
            output={"24"}
          />
          <Typography.Text>Почему выбраны такие диапазоны?</Typography.Text>
          <Typography.Text>По горизонтали:</Typography.Text>
          <Typography.Text>
            0{"<"}x{"<"}4√3 ≈ 6,928.
          </Typography.Text>
          <Typography.Text>Подходящие целые значения:</Typography.Text>
          <Typography.Text>1,2,3,4,5,6.</Typography.Text>
          <Typography.Text>Их даёт:</Typography.Text>
          <CodeBlock code={"range(1, 7)"} label={"Их даёт"} language="python" />
          <Typography.Text>
            По вертикали все внутренние точки должны находиться между уровнями 0
            и 8. Поэтому проверяем:
          </Typography.Text>
          <CodeBlock
            code={"range(1, 8)"}
            label={"Поэтому проверяем"}
            language="python"
          />
          <Typography.Text>
            Наклонные стороны затем отсекают лишние точки внутри этого
            охватывающего прямоугольника.
          </Typography.Text>
          <Typography.Text>
            Этот пример показывает, как рисунок помогает сформулировать точное
            условие для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "necelye-granicy",
      navLabel: "Нецелые границы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Подсчёт целых координат между нецелыми границами тоже можно
              сделать точно.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для начала вспомним целочисленные границы.
          </Typography.Text>
          <Typography.Text>Если:</Typography.Text>
          <Typography.Text>2≤ x≤6,</Typography.Text>
          <Typography.Text>подходят:</Typography.Text>
          <Typography.Text>2,3,4,5,6.</Typography.Text>
          <Typography.Text>Количество:</Typography.Text>
          <Typography.Text>6-2+1=5.</Typography.Text>
          <Typography.Text>Если:</Typography.Text>
          <Typography.Text>
            2{"<"}x{"<"}6,
          </Typography.Text>
          <Typography.Text>подходят:</Typography.Text>
          <Typography.Text>3,4,5.</Typography.Text>
          <Typography.Text>Количество:</Typography.Text>
          <Typography.Text>6-2-1=3.</Typography.Text>
          <Typography.Text>
            Но при нецелых границах правило «длина плюс один» напрямую не
            работает.
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <Typography.Text>2,3≤ x≤6,8.</Typography.Text>
          <Typography.Text>Подходят:</Typography.Text>
          <Typography.Text>3,4,5,6.</Typography.Text>
          <Typography.Text>
            Чтобы описать общий способ, введём две операции.
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="ceil">
              <strong>Округление вниз</strong>
            </PythonTerm>{" "}
            — выбор наибольшего целого числа, которое не больше исходного:
          </Typography.Text>
          <Typography.Text>⌊6,8⌋=6.</Typography.Text>
          <Typography.Text>
            <strong>Округление вверх</strong> — выбор наименьшего целого числа,
            которое не меньше исходного:
          </Typography.Text>
          <Typography.Text>⌈2,3⌉=3.</Typography.Text>
          <Typography.Text>Для условия:</Typography.Text>
          <Typography.Text>a≤ x≤ b</Typography.Text>
          <Typography.Text>первое допустимое целое:</Typography.Text>
          <Typography.Text>⌈a⌉,</Typography.Text>
          <Typography.Text>последнее:</Typography.Text>
          <Typography.Text>⌊b⌋.</Typography.Text>
          <Typography.Text>Количество:</Typography.Text>
          <Typography.Text>N=max(0,⌊b⌋-⌈a⌉+1).</Typography.Text>
          <Typography.Text>
            <Notation>{"max(0, ...)"}</Notation> означает, что при отсутствии
            подходящих целых чисел результат принимается равным нулю.
          </Typography.Text>
          <Typography.Text>Для строгого условия:</Typography.Text>
          <Typography.Text>
            a{"<"}x{"<"}b
          </Typography.Text>
          <Typography.Text>получаем:</Typography.Text>
          <Typography.Text>N=max(0,⌈b⌉-⌊a⌋-1).</Typography.Text>
          <Typography.Text>
            Эти формулы полезны для точного подсчёта в отдельных рядах наклонной
            фигуры.
          </Typography.Text>
          <Typography.Text>
            На первых задачах удобнее выписывать допустимые числа
            непосредственно. Формулы становятся понятнее после нескольких таких
            примеров.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proizvolnyj-povorot",
      navLabel: "Произвольный поворот",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Произвольный поворот фигуры может изменить количество
              целочисленных точек внутри.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Площадь и длины сторон при повороте сохраняются. Но расположение
            фигуры относительно координатной решётки меняется.
          </Typography.Text>
          <Typography.Text>Пример: квадрат со стороной 2.</Typography.Text>
          <Typography.Text>
            Если его стороны идут вдоль осей и он занимает:
          </Typography.Text>
          <Typography.Text>0≤ x≤2, 0≤ y≤2,</Typography.Text>
          <Typography.Text>
            строго внутри находится одна целочисленная точка:
          </Typography.Text>
          <Typography.Text>(1;1).</Typography.Text>
          <Typography.Text>
            Если из начала координат построить квадрат той же стороны с
            начальным направлением 45°, затем каждый раз поворачивать направо на
            90°, внутри окажутся две целочисленные точки:
          </Typography.Text>
          <Typography.Text>(1;0), (2;0).</Typography.Text>
          <LessonDiagram
            {...lessonMedia.ttDraw4290_787c5c}
            caption={
              <>
                Тот же квадрат со стороной 2, начатый под 45°: внутри уже две
                целые точки, а не одна.
              </>
            }
          />
          <Typography.Text>
            Поэтому произвольно менять начальный угол ради удобства нельзя.
          </Typography.Text>
          <Typography.Text>
            Перенос всей фигуры на целое число единиц по каждой оси сохраняет
            количество целочисленных точек. Каждая целочисленная точка при таком
            переносе переходит в целочисленную.
          </Typography.Text>
          <Typography.Text>
            Поворот всей фигуры на 90° вокруг начала координат тоже сохраняет
            решётку.
          </Typography.Text>
          <Typography.Text>
            Но при полном алгоритме безопаснее точно соблюдать условие: неверное
            начальное направление может повлиять на все последующие перемещения
            и взаимное расположение фигур.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "komanda-dugi",
      navLabel: "Команда дуги",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Команду дуги вводит само условие: в нём сказано, где центр, какой
              радиус, в какую сторону и на какой угол поворачивает дуга.
            </strong>{" "}
            Таких задач в подборке 2 из 54, все с исполнителем Цапля. Поскольку
            команда новая, её смысл нельзя угадывать — его читают из условия и
            проверяют на первом шаге.
          </Typography.Text>
          <Typography.Text>
            Пусть, например, условие определяет: «Дуга R α — исполнитель идёт по
            окружности радиуса R, центр которой находится на расстоянии R слева
            от него, поворачиваясь налево на α градусов». Алгоритм
          </Typography.Text>
          <CodeBlock
            code={"Направо 90\nВперёд 8\nНалево 90\nДуга 4 180"}
            label={"Алгоритм для исполнителя"}
            language="text"
          />
          <Typography.Text>
            из (0; 0) вверх: «Направо 90» и «Вперёд 8» ведут вдоль оси x в (8;
            0), «Налево 90» поворачивает вверх. Центр дуги — в 4 слева, то есть
            (4; 0); полуокружность радиуса 4 заканчивается в (0; 0). Получилась
            верхняя половина круга с центром (4; 0) и радиусом 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "krivolinejnaya-granica",
      navLabel: "Криволинейная граница",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Криволинейную границу проверяют неравенством для расстояния до
              центра.
            </strong>{" "}
            Точка (x; y) лежит строго внутри полукруга, когда она выше диаметра
            и ближе к центру, чем радиус:
          </Typography.Text>
          <Typography.Text>
            y {">"} 0 и (x − 4)² + y² {"<"} 16.
          </Typography.Text>
          <Typography.Text>
            С границей — y ≥ 0 и (x − 4)² + y² ≤ 16. Корень не нужен: сравнивают
            квадраты расстояний, и всё остаётся в целых числах, без погрешности.
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\n\nfor x in range(0, 9):\n    for y in range(0, 5):\n        if y > 0 and (x - 4) ** 2 + y ** 2 < 16:\n            count += 1\n\nprint(count)"
            }
            label={"Код на Python: count = 0"}
            language="python"
            output={"19"}
          />
          <Typography.Text>
            По рядам: при y = 1 и y = 2 подходят |x − 4| ≤ 3 — по 7 точек, при y
            = 3 — |x − 4| ≤ 2, 5 точек; 7 + 7 + 5 = 19. Вместе с границей
            добавляются 9 точек диаметра и вершина (4; 4) — всего 29. Других
            целых точек на дуге нет: 16 = a² + b² только при a, b ∈ {"{"}0, ±4
            {"}"}.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dugi-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Программа подсчёта работает в координатах задачи, без
                    масштаба <Notation>{"k"}</Notation>: перебор с запасом,
                    условие принадлежности из геометрии.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Строго внутри — <Notation>{"<"}</Notation>, с границей —{" "}
                    <Notation>{"<="}</Notation>; две фигуры —{" "}
                    <Notation>{"and"}</Notation>, <Notation>{"or"}</Notation>,{" "}
                    <Notation>{"and not"}</Notation>,{" "}
                    <Notation>{"!="}</Notation> для «ровно в одной».
                  </>
                ),
              },
              {
                note: (
                  <>
                    Для наклонных сторон условие берут из уравнений сторон; для
                    дуги — из сравнения квадрата расстояния до центра с R².
                  </>
                ),
              },
              {
                note: (
                  <>
                    Целые числа между нецелыми границами: от ⌈a⌉ до ⌊b⌋, всего
                    max(0, ⌊b⌋ − ⌈a⌉ + 1).
                  </>
                ),
              },
              {
                note: (
                  <>
                    Новую команду (дугу) читают из условия: центр, радиус,
                    сторона, угол.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Поворот фигуры сохраняет площадь, но не число целых точек.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Перед подсчётом проверь, что фигура — та, которую задают команды.
        </strong>{" "}
        Предскажи основные движения словами:
      </Typography.Text>
      <blockquote>
        <Typography.Text>
          Сначала вверх, затем вправо, затем вниз, затем влево. Должен
          получиться прямоугольник.
        </Typography.Text>
      </blockquote>
      <Typography.Text>
        Если рисунок или таблица состояния показывают другую фигуру, ошибку ищут
        в переводе команд, а не в подсчёте. Для повторов отдельно сверь: сколько
        повторений нужно, чтобы замкнуть контур, и где Черепаха после всех
        повторений — это начало следующего блока.
      </Typography.Text>
      <Typography.Text>
        <strong>Частые ошибки удобно связывать с конкретной проверкой.</strong>{" "}
        Выбери ошибку, чтобы увидеть, что получается и как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и что проверить"}
        variants={[
          {
            label: "начальное направление",
            value: (
              <>
                Не учтено начальное направление: рисунок повёрнут или расположен
                иначе
              </>
            ),
            note: (
              <>
                сверить условие и <Notation>{"setheading"}</Notation>
              </>
            ),
          },
          {
            label: "right и left",
            value: (
              <>
                Перепутаны <Notation>{"right"}</Notation> и{" "}
                <Notation>{"left"}</Notation>: поворот в другую сторону
              </>
            ),
            note: <>проверить каждую команду</>,
          },
          {
            label: "угол × масштаб",
            value: <>Угол умножен на масштаб: изменяется геометрия</>,
            note: (
              <>
                на <Notation>{"k"}</Notation> умножать только расстояния
              </>
            ),
          },
          {
            label: "разный масштаб",
            value: (
              <>
                Масштаб сетки отличается от масштаба фигуры: точки не
                соответствуют единицам задачи
              </>
            ),
            note: (
              <>
                проверить <Notation>{"goto(x * k, y * k)"}</Notation>
              </>
            ),
          },
          {
            label: "перо перед сеткой",
            value: <>Перед сеткой не поднято перо: появляются лишние линии</>,
            note: (
              <>
                добавить <Notation>{"penup()"}</Notation>
              </>
            ),
          },
          {
            label: "команды вне цикла",
            value: (
              <>Часть команд вышла из цикла: меняется порядок повторений</>
            ),
            note: <>проверить отступы</>,
          },
          {
            label: "последнее значение range",
            value: (
              <>
                Пропущено последнее значение <Notation>{"range"}</Notation>: не
                нанесён крайний ряд
              </>
            ),
            note: <>помнить об исключённой правой границе</>,
          },
          {
            label: "отрицательные координаты",
            value: (
              <>
                Сетка не охватывает отрицательные координаты: часть точек
                отсутствует
              </>
            ),
            note: <>расширить диапазоны</>,
          },
          {
            label: "условие о границе",
            value: (
              <>
                Не прочитано условие о границе: подсчитана другая категория
                точек
              </>
            ),
            note: <>проверить стороны и вершины</>,
          },
          {
            label: "объединение сложением",
            value: (
              <>
                Объединение посчитано простым сложением: общие точки учтены
                дважды
              </>
            ),
            note: <>вычесть пересечение</>,
          },
          {
            label: "сокращённый повтор",
            value: (
              <>
                Цикл сокращён из-за повторения контура: неверное состояние для
                следующего блока
              </>
            ),
            note: <>выполнить исходное число повторений</>,
          },
          {
            label: "координаты после сетки",
            value: (
              <>
                Координаты проверены после сетки: выведено положение в последней
                точке сетки
              </>
            ),
            note: <>проверять сразу после алгоритма</>,
          },
          {
            label: "дорисованная линия",
            value: (
              <>
                Незамкнутую линию дорисовали и посчитали «область»: её в условии
                нет
              </>
            ),
            note: <>проверить, вернулась ли Черепаха в начало контура</>,
          },
        ]}
      />
      <Typography.Text>
        Есть ещё геометрическая ловушка: если линия не замкнулась, нельзя
        самостоятельно дорисовывать соединение между началом и концом и считать
        появившуюся область. Например, три стороны квадрата ещё не ограничивают
        его внутреннюю область. Команды заливки могут визуально соединять
        контур, поэтому для исследования алгоритма достаточно обычных линий и
        сетки.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          В любой задаче задания 6 сначала точно восстанавливают след по
          командам, затем называют область, о которой спрашивают, и только потом
          считают — точки, площадь или периметр.
        </strong>{" "}
        Ошибки обычно возникают не в подсчёте, а раньше: не то начальное
        направление, сокращённый повтор, не та категория точек.
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 6 на одной схеме"}
        flow={[
          {
            name: "Вопрос и начало",
            note: "что считать, граница, положение и направление",
          },
          { name: "След", note: "таблица состояния или рисунок программой" },
          {
            name: "Область и подсчёт",
            note: "одна фигура, пересечение, объединение; по рядам",
          },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="sostoyanie-i-komandy"
              >
                Состояние и команды
              </SubtopicLink>
            ),
            rows: [
              { key: <>состояние</>, note: <>положение, направление, хвост</> },
              {
                key: <>поворот</>,
                note: <>меняет направление, не положение</>,
              },
              { key: <>Повтори k</>, note: <>выполнить все k раз</> },
              { key: <>хвост поднят</>, note: <>движение без линии</> },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="postroenie-i-reshetka"
              >
                Рисунок и решётка
              </SubtopicLink>
            ),
            rows: [
              { key: <>масштаб k</>, note: <>умножать расстояния, не углы</> },
              {
                key: (
                  <>
                    <Notation>{"setheading(90)"}</Notation>
                  </>
                ),
                note: <>вверх, как в условии</>,
              },
              {
                key: (
                  <>
                    <Notation>{"penup()"}</Notation>
                  </>
                ),
                note: <>перед сеткой</>,
              },
              {
                key: (
                  <>
                    <Notation>{"range(a, b + 1)"}</Notation>
                  </>
                ),
                note: <>крайний ряд включён</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="granica-i-velichiny"
              >
                Точки и величины
              </SubtopicLink>
            ),
            rows: [
              { key: <>(a − 1)(b − 1)</>, note: <>строго внутри a × b</> },
              { key: <>(a + 1)(b + 1)</>, note: <>вместе с границей</> },
              {
                key: <>2a + 2b</>,
                note: <>точек на границе; не путать с периметром</>,
              },
              { key: <>открытая линия</>, note: <>не дорисовывать</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="neskolko-figur"
              >
                Несколько фигур
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>пересечение</>,
                note: <>max левых, min правых границ</>,
              },
              { key: <>объединение</>, note: <>N₁ + N₂ − N_общ</> },
              { key: <>ровно в одной</>, note: <>N₁ + N₂ − 2N_общ</> },
              { key: <>касание</>, note: <>площадь 0, точки есть</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="naklonnaya-geometriya"
              >
                Наклонные стороны
              </SubtopicLink>
            ),
            rows: [
              { key: <>вершины</>, note: <>могут быть нецелыми: (4√3; 4)</> },
              {
                key: <>по столбцам</>,
                note: <>нижняя и верхняя допустимые y</>,
              },
              { key: <>спорная точка</>, note: <>по уравнению стороны</> },
              {
                key: <>невыпуклая</>,
                note: <>разбить, проверить линию разреза</>,
              },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="obratnyj-vopros-i-poseshcheniya"
              >
                Обратные вопросы
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>параметр</>, note: <>N(A) и неравенство дословно</> },
              { key: <>≥ и {">"}</>, note: <>ответы отличаются на 1</> },
              { key: <>лучшее положение</>, note: <>оценка по каждой оси</> },
              { key: <>посещения</>, note: <>моменты, а не точки</> },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink
                routeSlug="6-prostejshie-algoritmy-dlya-ispolnitelej"
                subtopic="tochnyj-podschet-i-dugi"
              >
                Подсчёт программой и дуги
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>условие</>, note: <>в координатах задачи, без k</> },
              {
                key: (
                  <>
                    <Notation>{"in_A != in_B"}</Notation>
                  </>
                ),
                note: <>ровно в одной</>,
              },
              { key: <>⌊b⌋ − ⌈a⌉ + 1</>, note: <>целых между a и b</> },
              { key: <>дуга</>, note: <>(x − a)² + (y − b)² ≤ R²</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Четыре проверки готового ответа",
            steps: [
              <>Совпадает ли начальное направление с условием?</>,
              <>Выполнены ли все повторения и где Черепаха после них?</>,
              <>Та ли область: одна фигура, пересечение, объединение?</>,
              <>Учтена ли граница так, как сказано в вопросе?</>,
            ],
          },
        ]}
        caption={
          <>
            Шпаргалка темы: порядок решения и главное из каждой подтемы. Номер
            раздела ведёт на подтему.
          </>
        }
      />
      <Typography.Text>
        <strong>Практический порядок решения можно сделать постоянным.</strong>{" "}
        Для каждой новой задачи проходи одну последовательность:
      </Typography.Text>
      <ol>
        <li>
          <strong>Прочитай, что требуется найти.</strong> Точки, площадь,
          периметр? Внутри какой области? Учитывается ли граница? (Подтема 3.)
        </li>
        <li>
          <strong>Выпиши начальное состояние.</strong> Координаты, направление,
          состояние хвоста. (Подтема 1.)
        </li>
        <li>
          <strong>Выбери способ.</strong> Если стороны идут вдоль осей и фигура
          одна или две — достаточно таблицы состояния и формул; если стороны
          наклонные или контур сложный — построй рисунок программой.
        </li>
        <li>
          <strong>Восстанови фигуру.</strong> Вершины — по таблице состояния;
          повторы выполняй полностью, хвост — по командам. Для программы:
          переведи команды в Python, сохрани порядок и число повторений, умножь
          расстояния на один масштаб. (Подтемы 1–2.)
        </li>
        <li>
          <strong>Нанеси целочисленные точки</strong> — на черновике или в
          программе с поднятым пером; сетка должна охватывать весь рисунок.
          (Подтема 2.)
        </li>
        <li>
          <strong>Выдели именно ту область, которую спрашивают:</strong> одну
          фигуру, пересечение, объединение, часть. (Подтема 4.)
        </li>
        <li>
          <strong>Посчитай точки по рядам или столбцам.</strong> (Подтемы 3, 5.)
        </li>
        <li>
          <strong>Проверь спорные точки и условие о границе</strong> — по
          уравнению стороны, а не по толщине линии. (Подтема 5.)
        </li>
      </ol>
    </>
  ),
  status: "published",
});
