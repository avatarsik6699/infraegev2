import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import { dataAnalysisLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./data-analysis.media";
import { R, THEME_TASK } from "./data-analysis.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const dataAnalysisLesson = defineLesson({
  ...dataAnalysisLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Хранить точки кортежами, считать расстояние и читать файл с характеристиками и полярными координатами",
    "Делить точки на кластеры границами, наклонными прямыми, углом и вычисленной величиной, откладывая аномалии",
    "Находить центр кластера перебором кандидатов по определению и формуле расстояния из условия",
    "Собирать ответ по центрам: средние, наибольший и наименьший кластер, целая часть произведения",
    "Считать радиус, диаметр и расстояния между объектами нужного вида и решать задачу темы",
    "Для редких задач — цепочки соседей, другие центры, точка наведения, корреляция и выбросы (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "tochki-i-rasstoyaniya",
      title: "Точки, расстояния и файл",
      lead: "Что спрашивают в задании 27, точка и кластер в Python, расстояние, чтение файла с характеристиками, строка частицы и полярные координаты.",
      conceptIds: [
        "kak-ustroena-tema-27",
        "chto-v-fayle",
        "teorema-pifagora",
        "kvadrat-rasstoyaniya",
        "chtenie-fayla",
        "kod-zvezdy",
        "stroka-chasticy",
        "polyarnye-koordinaty",
        "tochki-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Какая из точек <Notation>{"(3, 4)"}</Notation>,{" "}
              <Notation>{"(-4, 2)"}</Notation>, <Notation>{"(1, -5)"}</Notation>{" "}
              ближе всех к началу координат? Чему равно это расстояние?
            </>
          ),
          reveal: (
            <>
              <Notation>{"(-4, 2)"}</Notation>: квадраты расстояний 25, 20 и 26,
              расстояние √20 ≈ 4,472.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Точки <Notation>{"(4, 7)"}</Notation> и{" "}
              <Notation>{"(1, 3)"}</Notation>. Верно ли, что расстояние между
              ними не больше 5? А что оно меньше 5? Проверь без извлечения
              корня.
            </>
          ),
          reveal: (
            <>
              Не больше 5 — да: 3² + 4² = 25 ≤ 25. Меньше 5 — нет: 25 {"<"} 25
              неверно.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Что вернут <Notation>{'"-2,5\\t4,75".split(" ")'}</Notation> и{" "}
              <Notation>{'"-2,5   4,75".replace(",", ".").split()'}</Notation>?
            </>
          ),
          reveal: (
            <>
              Первое — <Notation>{"['-2,5\\t4,75']"}</Notation>: по пробелу
              строку с табуляцией не разделить. Второе —{" "}
              <Notation>{"['-2.5', '4.75']"}</Notation>:{" "}
              <Notation>{"split()"}</Notation> делит по любым пробельным
              символам, сколько бы их ни было подряд.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Разбери коды <Notation>{"K7V"}</Notation>,{" "}
              <Notation>{"VII"}</Notation> и <Notation>{"A0III"}</Notation>:
              спектральный класс, цвет и класс светимости.
            </>
          ),
          reveal: (
            <>
              <Notation>{"K7V"}</Notation> — класс K (оранжевая), светимость V
              (карлик); <Notation>{"VII"}</Notation> — белый карлик без
              спектрального класса; <Notation>{"A0III"}</Notation> — класс A
              (белая), светимость III (гигант).
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              В файле записаны полярные координаты <Notation>{"90 5"}</Notation>{" "}
              и <Notation>{"180 2"}</Notation>. Какие это точки на обычной
              плоскости?
            </>
          ),
          reveal: (
            <>
              (0; 5) и (−2; 0): x = r · cos φ, y = r · sin φ, cos 90° = 0, sin
              90° = 1, cos 180° = −1, sin 180° = 0. В Python угол сначала
              переводят в радианы — <Notation>{"radians(phi)"}</Notation>.
            </>
          ),
        },
      ],
    },
    {
      slug: "razdelenie-na-klastery",
      title: "Разделение на кластеры",
      lead: "Диаграмма рассеяния, координатные границы, аномалии, наклонные прямые и треугольники между ними, кольца и секторы, деление частиц по энергии.",
      conceptIds: [
        "diagramma-rasseyaniya",
        "koordinatnye-granicy",
        "tri-gruppy",
        "anomalii",
        "naklonnaya-granica",
        "oblasti-mezhdu-pryamymi",
        "razdelyayushchiy-priznak",
        "vychislyaemyy-priznak",
        "razdelenie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Точки <Notation>{"(4, 2)"}</Notation>,{" "}
              <Notation>{"(6, 1)"}</Notation>, <Notation>{"(3, 5)"}</Notation>,{" "}
              <Notation>{"(7, 8)"}</Notation> распределяются цепочкой:{" "}
              <Notation>{"y < 3"}</Notation> — группа 1, иначе{" "}
              <Notation>{"x < 5"}</Notation> — группа 2, иначе — группа 3. Куда
              попадёт каждая точка?
            </>
          ),
          reveal: (
            <>
              <Notation>{"(4, 2)"}</Notation> и <Notation>{"(6, 1)"}</Notation>{" "}
              — группа 1 (y {"<"} 3); <Notation>{"(3, 5)"}</Notation> — группа
              2; <Notation>{"(7, 8)"}</Notation> — группа 3.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Для тех же точек вместо цепочки записали два независимых условия:{" "}
              <Notation>{"x < 5"}</Notation> — в группу 1,{" "}
              <Notation>{"y < 3"}</Notation> — в группу 2. Какие точки окажутся
              сразу в двух группах, а какие — ни в одной?
            </>
          ),
          reveal: (
            <>
              <Notation>{"(4, 2)"}</Notation> — сразу в двух группах;{" "}
              <Notation>{"(7, 8)"}</Notation> — ни в одной;{" "}
              <Notation>{"(6, 1)"}</Notation> — только в группе 2,{" "}
              <Notation>{"(3, 5)"}</Notation> — только в группе 1.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Кластеры лежат в треугольниках между прямыми y = x, y = 10 − x и
              осями, как в файле 27-8.txt. Куда попадут точки{" "}
              <Notation>{"(6, 2)"}</Notation>, <Notation>{"(2, 6)"}</Notation>,{" "}
              <Notation>{"(7, 5)"}</Notation> и <Notation>{"(-1, 3)"}</Notation>
              ?
            </>
          ),
          reveal: (
            <>
              <Notation>{"(6, 2)"}</Notation> — нижний треугольник: 2 {"<"} 4 и
              2 {"<"} 6; <Notation>{"(2, 6)"}</Notation> — левый: 6 {"<"} 8, но
              6 {">"} 2; <Notation>{"(7, 5)"}</Notation> — аномалия: 5 {">"} 3;{" "}
              <Notation>{"(-1, 3)"}</Notation> — аномалия: x {"<"} 0.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сектор начинается с угла 340° и имеет ширину 30°. Лежат ли в нём
              направления 355°, 5°, 15° и 335°?
            </>
          ),
          reveal: (
            <>
              355° — да (15 ≤ 30), 5° — да (25), 15° — нет (35), 335° — нет
              ((335 − 340) % 360 = 355).
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Энергии частиц: 1,1; 1,8; 2,6; 5,2; 5,9; 6,4; 9,7. Сколько
              кластеров дают большие промежутки и выполняется ли в каждом
              условие «разность энергий не больше 2»?
            </>
          ),
          reveal: (
            <>
              Три: 1,1–2,6, 5,2–6,4 и 9,7 — промежутки 2,6 и 3,3 больше
              остальных. Ширина групп 1,5, 1,2 и 0 — условие выполняется.
            </>
          ),
        },
      ],
    },
    {
      slug: "centr-klastera",
      title: "Центр кластера",
      lead: "Центр — точка кластера с наименьшей суммой расстояний: перебор кандидатов, почему средняя точка не подходит, своя формула расстояния и взвешенная сумма.",
      access: "paid",
      conceptIds: [
        "centr-tochka-klastera",
        "programma-centra",
        "srednee-ne-centr",
        "tri-vyrazheniya",
        "formula-rasstoyaniya",
        "vzveshennaya-summa",
        "centr-itogo",
      ],
      paid: {
        outline: [
          { id: "centr-tochka-klastera", navLabel: "Центр — точка кластера" },
          { id: "programma-centra", navLabel: "Программа" },
          { id: "srednee-ne-centr", navLabel: "Среднее — не центр" },
          { id: "tri-vyrazheniya", navLabel: "Сумма квадратов" },
          { id: "formula-rasstoyaniya", navLabel: "Своя формула расстояния" },
          { id: "vzveshennaya-summa", navLabel: "Взвешенная сумма" },
          { id: "centr-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Какую точку кластера считать его центром?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Ту, у которой сумма расстояний до остальных точек кластера
                наименьшая. Найти её помогает перебор: каждую точку проверяют
                как кандидата.
              </strong>{" "}
              В задаче темы «расстояние» между частицами — разность энергий, а
              перебор тот же.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./data-analysis.paid.centr-klastera"),
      },
    },
    {
      slug: "otvet-po-centram",
      title: "Ответ по центрам",
      lead: "Средние и минимумы координат центров, наименьший и наибольший кластер, объекты нужного вида, исключение кластера и целая часть произведения.",
      access: "paid",
      conceptIds: [
        "srednee-centrov",
        "minimalnye-koordinaty",
        "malenkiy-i-bolshoy",
        "obekty-nuzhnogo-vida",
        "isklyuchenie-klasterov",
        "masshtabirovanie",
        "polnyy-primer",
        "otvet-itogo",
      ],
      paid: {
        outline: [
          { id: "srednee-centrov", navLabel: "Среднее центров" },
          { id: "minimalnye-koordinaty", navLabel: "Минимальные координаты" },
          { id: "malenkiy-i-bolshoy", navLabel: "Маленький и большой кластер" },
          { id: "obekty-nuzhnogo-vida", navLabel: "Объекты нужного вида" },
          { id: "isklyuchenie-klasterov", navLabel: "Исключение кластеров" },
          { id: "masshtabirovanie", navLabel: "Целая часть" },
          { id: "polnyy-primer", navLabel: "Полный пример" },
          { id: "otvet-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>Центры найдены — что дальше?</Typography.Text>
            <Typography.Text>
              <strong>
                Ответ собирают из центров так, как сказано в условии: среднее
                координат, минимум, центр самого большого кластера. Каждое слово
                условия — отдельное действие.
              </strong>{" "}
              Даже верные центры не спасут, если усреднить не те координаты или
              взять модуль не на том шаге.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./data-analysis.paid.otvet-po-centram"),
      },
    },
    {
      slug: "rasstoyaniya-i-pary",
      title: "Расстояния и пары точек",
      lead: "Радиус, расстояния до точек своего и чужого кластера, диаметр, межкластерный диаметр, точки около центра, объекты нужного вида и задача темы.",
      access: "paid",
      conceptIds: [
        "svoy-i-chuzhoy",
        "diametr",
        "mezhklasternyy-diametr",
        "tochki-okolo-centra",
        "blizhayshiy-obekt",
        "zadacha-temy",
        "rasstoyaniya-itogo",
      ],
      paid: {
        outline: [
          { id: "svoy-i-chuzhoy", navLabel: "Радиус" },
          { id: "diametr", navLabel: "Диаметр кластера" },
          { id: "mezhklasternyy-diametr", navLabel: "Межкластерный диаметр" },
          { id: "tochki-okolo-centra", navLabel: "Точки около центра" },
          { id: "blizhayshiy-obekt", navLabel: "Объекты нужного вида" },
          { id: "zadacha-temy", navLabel: "Задача темы" },
          { id: "rasstoyaniya-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>Что спрашивают после центров?</Typography.Text>
            <Typography.Text>
              <strong>
                Чаще всего — расстояния: от центра до точек, между центрами,
                между самыми далёкими точками. Сначала реши, от чего до чего
                считать и среди каких точек выбирать.
              </strong>{" "}
              Здесь же решим задачу темы: наибольшее расстояние между частицами
              с признаком II и энергия центров.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./data-analysis.paid.rasstoyaniya-i-pary"),
      },
    },
    {
      slug: "sosedi-centry-statistika",
      title: "Соседи, другие центры и статистика",
      lead: "Цепочки соседей вместо границ, минимакс, антицентр и сумма квадратов, точка наведения, корреляция Пирсона и выбросы по квартилям.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "porog-sosedstva",
        "postroenie-gruppy",
        "obosnovanie-poroga",
        "samaya-dalyokaya-tochka",
        "antipod",
        "summa-kvadratov",
        "tochka-navedeniya",
        "korrelyaciya",
        "vybrosy",
        "uskoreniya",
        "sosedi-itogo",
      ],
      paid: {
        outline: [
          { id: "porog-sosedstva", navLabel: "Порог соседства" },
          { id: "postroenie-gruppy", navLabel: "Построение группы" },
          { id: "obosnovanie-poroga", navLabel: "Выбор порога" },
          { id: "samaya-dalyokaya-tochka", navLabel: "Минимакс" },
          { id: "antipod", navLabel: "Антицентр" },
          { id: "summa-kvadratov", navLabel: "Сумма квадратов" },
          { id: "tochka-navedeniya", navLabel: "Точка наведения" },
          { id: "korrelyaciya", navLabel: "Корреляция" },
          { id: "vybrosy", navLabel: "Выбросы по квартилям" },
          { id: "uskoreniya", navLabel: "Ускорения перебора" },
          { id: "sosedi-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что делать, если границы по рисунку не провести, центр определён
              иначе или в условии статистика?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Это дополнительный урок для редких задач: цепочки соседей вместо
                границ, минимакс и антицентр, точка наведения, корреляция
                Пирсона и выбросы по квартилям.
              </strong>{" "}
              На экзаменах и в демоверсиях таких задач не было; задачи основных
              подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./data-analysis.paid.sosedi-centry-statistika"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-27",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 27 дают файл с сотнями точек — звёзд, частиц, измерений —
            и просят разбить их на группы, найти в каждой группе центр и собрать
            из центров и расстояний ответ. Вот задача, которую мы решим в этой
            теме:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Любое задание 27 решается в четыре шага: прочитать записи файла,
              разделить их на кластеры, найти центры по определению из условия и
              собрать ответ.
            </strong>{" "}
            Каждому шагу посвящена своя подтема. Разберём, что значат слова
            условия:
          </Typography.Text>
          <LessonTable
            label={"Слова условия задания 27"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "точка, звезда, частица",
                "одна строка файла: координаты x и y и, может быть, характеристики",
              ],
              [
                "расстояние d(A, B) = √((x₂ − x₁)² + (y₂ − y₁)²)",
                "обычная длина отрезка: в Python — dist(a, b)",
              ],
              [
                "кластер, точки лежат внутри квадратов",
                "группы видны на рисунке, их разделяют границами",
              ],
              [
                "модуль разности энергий не превышает 2",
                "группы делят по вычисленной величине, а не по координатам",
              ],
              ["аномалии", "точки вне всех кластеров: их откладывают отдельно"],
              [
                "центр — точка, сумма расстояний от которой до остальных минимальна",
                "одна из точек кластера: проверяют каждую как кандидата",
              ],
              [
                "целая часть произведения на 10 000",
                "int(value * 10000) — дробную часть отбрасывают",
              ],
            ]}
          />
          <Typography.Text>
            Начнём с точек, расстояния и чтения файла — без них не обходится ни
            одна задача. Тема состоит из пяти подтем и дополнительного урока — у
            каждой своя страница:
          </Typography.Text>
          <ol>
            <li>
              <strong>Точки, расстояния и файл</strong> — ты сейчас здесь:
              точка, расстояние, чтение строк с характеристиками.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="razdelenie-na-klastery">
                Разделение на кластеры
              </SubtopicLink>{" "}
              — рисунок, границы, аномалии, деление по энергии.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="centr-klastera">
                Центр кластера
              </SubtopicLink>{" "}
              — перебор кандидатов и своя формула расстояния.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="otvet-po-centram">
                Ответ по центрам
              </SubtopicLink>{" "}
              — средние, наибольший и наименьший кластер, целая часть.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="rasstoyaniya-i-pary">
                Расстояния и пары точек
              </SubtopicLink>{" "}
              — радиус, диаметр, пары одного вида; решим задачу темы.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="sosedi-centry-statistika">
                Соседи, другие центры и статистика
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "chto-v-fayle",
      navLabel: "Точка и кластер",
      explanation: (
        <>
          <Typography.Text>
            Что записано в строке файла и как хранить это в программе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Строка файла — одна точка: пара чисел x и y. В Python точку хранят
              кортежем, кластер — списком точек, все кластеры — списком списков.
            </strong>{" "}
            Сюжет бывает любой — звёзды, частицы, деревья, — а программа видит
            пары чисел:
          </Typography.Text>
          <CodeBlock
            code={"1.5 3.2\n2.1 4.8\n7.3 1.4"}
            label={"Строки файла file.txt"}
            language="text"
            fileName="file.txt"
          />
          <Typography.Text>
            Координата <Notation>{"x"}</Notation> — положение по горизонтали,{" "}
            <Notation>{"y"}</Notation> — по вертикали. A = (2; 5) — на 2 единицы
            правее начала координат и на 5 выше. Отрицательная координата задаёт{" "}
            <strong>противоположное направление</strong>: B = (−3; 4) — на 3
            левее и на 4 выше. В условиях x называют <strong>абсциссой</strong>,
            y — <strong>ординатой</strong>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clPlane}
            caption={
              <>
                Пунктир от точки к осям показывает её координаты: A на 2 правее
                и на 5 выше начала координат, B — на 3 левее и на 4 выше.
              </>
            }
          />
          <Typography.Text>
            Упорядоченная пара <Notation>{"(2.0, 5.0)"}</Notation> в Python —{" "}
            <PythonTerm term="tuple">кортеж</PythonTerm>: элемент{" "}
            <Notation>{"point[0]"}</Notation> — координата x,{" "}
            <Notation>{"point[1]"}</Notation> — координата y. Точки собирают в{" "}
            <PythonTerm term="list">список</PythonTerm>, а кластеры — в список
            списков:
          </Typography.Text>
          <CodeBlock
            code={
              "point = (2.0, 5.0)\nx, y = point\nprint(point[0], y)\n\nclusters = [\n    [(0, 0), (1, 1), (2, 0)],\n    [(10, 8), (11, 9)]\n]\nclusters[1].append((12, 8))\n\nprint(len(clusters))      # сколько кластеров\nprint(len(clusters[1]))   # сколько точек во втором\nfor x, y in clusters[1]:\n    print(x, y)"
            }
            label={"Точка, кластер и список кластеров"}
            language="python"
            output={"2.0 5.0\n2\n3\n10 8\n11 9\n12 8"}
          />
          <Typography.Text>
            <Notation>{"x, y = point"}</Notation> раскладывает пару по двум
            переменным, <Notation>{"append"}</Notation> добавляет точку в конец
            списка, а цикл <Notation>{"for x, y in …"}</Notation> перебирает
            точки сразу с координатами. Не путай два количества:{" "}
            <Notation>{"len(clusters)"}</Notation> — сколько групп,{" "}
            <Notation>{"len(clusters[1])"}</Notation> — сколько точек в группе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "teorema-pifagora",
      navLabel: "Расстояние",
      explanation: (
        <>
          <Typography.Text>
            Как найти расстояние между двумя точками, зная их координаты?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разности координат — катеты прямоугольного треугольника, а
              расстояние — его гипотенуза: d(A, B) = √((x₂ − x₁)² + (y₂ − y₁)²).
            </strong>{" "}
            Для A = (1; 2) и B = (4; 6) по горизонтали точки отличаются на 4 − 1
            = 3, по вертикали — на 6 − 2 = 4:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clPlane_f9adec}
            caption={
              <>
                Катеты треугольника — разности координат 3 и 4, гипотенуза —
                расстояние между точками: √(3² + 4²) = √25 = 5.
              </>
            }
          />
          <Typography.Text>
            Такое расстояние называют <strong>евклидовым</strong> — это обычная
            длина отрезка. Формулу можно записать самому:{" "}
            <Notation>{"** 2"}</Notation> — квадрат,{" "}
            <Notation>{"** 0.5"}</Notation> — корень. Но в модуле{" "}
            <Notation>{"math"}</Notation> уже есть функция{" "}
            <Notation>{"dist"}</Notation>, ею и будем пользоваться:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import dist\n\na, b = (1, 2), (4, 6)\ndx, dy = b[0] - a[0], b[1] - a[1]\nprint((dx ** 2 + dy ** 2) ** 0.5)\nprint(dist(a, b))\nprint(int(dist((0, 0), (1, 1)) * 10000))"
            }
            label={"Формула и функция dist"}
            language="python"
            output={"5.0\n5.0\n14142"}
          />
          <Typography.Text>
            Последняя строка — формат ответа задания 27: значение умножают на 10
            000 и <strong>отбрасывают дробную часть</strong>. √2 ≈ 1,41421356, а
            ответ — 14142. Это делает{" "}
            <PythonTerm term="num">
              <Notation>{"int"}</Notation>
            </PythonTerm>
            , а не <Notation>{"round"}</Notation>: подробнее — в подтеме 4.
          </Typography.Text>
          <Typography.Text>
            Пригодятся три свойства: d(A, B) = d(B, A), d(A, A) = 0 и d(A, B) ≥
            0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kvadrat-rasstoyaniya",
      navLabel: "Сравнение с порогом",
      explanation: (
        <>
          <Typography.Text>
            Нужно ли извлекать корень, чтобы проверить, что точки ближе
            заданного расстояния?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: при r ≥ 0 условие d(A, B) ≤ r равносильно (x₂ − x₁)² + (y₂ −
              y₁)² ≤ r², и корень не нужен.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'a, b, r = (1, 2), (4, 6), 5\n\ndx = a[0] - b[0]\ndy = a[1] - b[1]\n\nif dx * dx + dy * dy <= r * r:\n    print("Точки достаточно близки")'
            }
            label={"Проверка без корня"}
            language="python"
            output={"Точки достаточно близки"}
          />
          <Typography.Text>
            Почему это допустимо? Для неотрицательных чисел возведение в квадрат
            сохраняет порядок: если одно расстояние меньше другого, его квадрат
            тоже меньше. Здесь 25 ≤ 25 — ровно потому, что 5 ≤ 5.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Но заменять сумму расстояний суммой их квадратов нельзя.
            </strong>{" "}
            Это уже другая величина. В подтеме о центре кластера разберём
            конкретный пример, где из-за такой замены выбирается другая точка.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chtenie-fayla",
      navLabel: "Чтение файла",
      explanation: (
        <>
          <Typography.Text>
            Как прочитать точки из файла и ни одной не потерять?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала посмотри на первые строки файла, потом разбирай каждую
              строку в три действия: заменить запятые точками, разделить,
              превратить части в числа.
            </strong>{" "}
            Форматы бывают разные — выбери, чтобы увидеть, что с ним делать:
          </Typography.Text>
          <VariantPicker
            label={"Первые строки файла и что с ними делать"}
            variants={[
              {
                label: "числа через пробел",
                value: <Notation>{"1.25 3.70"}</Notation>,
                note: <>читаем как есть</>,
              },
              {
                label: "запятая в дробях",
                value: <Notation>{"1,25 3,70"}</Notation>,
                note: <>заменить запятые точками</>,
              },
              {
                label: "заголовок",
                value: <Notation>{"X Y"}</Notation>,
                note: <>пропустить первую строку</>,
              },
              {
                label: "табуляция",
                value: <Notation>{"1,25→3,70→K3V"}</Notation>,
                note: <>split() делит и по табуляции</>,
              },
            ]}
          />
          <Typography.Text>
            Метод{" "}
            <PythonTerm term="strmeth">
              <Notation>{"replace"}</Notation>
            </PythonTerm>{" "}
            меняет запятые на точки,{" "}
            <PythonTerm term="split">
              <Notation>{"split()"}</Notation>
            </PythonTerm>{" "}
            без аргументов делит строку по пробелам и табуляциям, сколько бы их
            ни было подряд, а{" "}
            <PythonTerm term="num">
              <Notation>{"float"}</Notation>
            </PythonTerm>{" "}
            превращает текст в дробное число:
          </Typography.Text>
          <CodeBlock
            code={
              'line = "1,25   3,70"\nparts = line.replace(",", ".").split()\nprint(parts)\nprint(float(parts[0]) + float(parts[1]))'
            }
            label={"Разбор одной строки"}
            language="python"
            output={"['1.25', '3.70']\n4.95"}
          />
          <Typography.Text>
            Функция чтения делает это для каждой строки. Координаты берём из
            первых двух частей — так она подойдёт и для файлов, где после
            координат записано что-то ещё:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'def read_points(filename, has_header=False):\n    points = []\n    with open(filename, encoding="utf-8-sig") as f:\n        if has_header:\n            f.readline()\n        for line in f:\n            if not line.strip():\n                continue\n            parts = line.replace(",", ".").split()\n            points.append((float(parts[0]), float(parts[1])))\n    return points\n\n\npoints = read_points("example27.txt", has_header=True)\nprint(len(points), points[:3])'
            }
            label={"Функция read_points"}
            language="python"
            output={"8 [(0.0, 0.0), (0.0, 2.0), (1.0, 1.0)]"}
          />
          <ul>
            <li>
              <PythonTerm term="file">
                <Notation>{"with open(...) as f"}</Notation>
              </PythonTerm>{" "}
              открывает файл и сам закрывает его после блока;{" "}
              <Notation>{"for line in f"}</Notation> перебирает строки.
            </li>
            <li>
              <Notation>{"f.readline()"}</Notation> читает одну строку — так
              пропускаем заголовок, если <Notation>{"has_header"}</Notation>{" "}
              истинно. По умолчанию заголовка нет.
            </li>
            <li>
              <Notation>{"if not line.strip(): continue"}</Notation> пропускает
              пустые строки — обычно пустую последнюю.
            </li>
            <li>
              <Notation>{"points[:3]"}</Notation> —{" "}
              <PythonTerm term="slice">срез</PythonTerm>, первые три точки.
              После чтения всегда выводи количество и первые точки.
            </li>
          </ul>
          <ProofDisclosure
            kind="nuance"
            summary="Заголовок: пропустить лишнее опаснее, чем забыть"
          >
            <Typography.Text>
              Если заголовок не пропустить, программа сразу остановится:{" "}
              <Notation>
                {"ValueError: could not convert string to float: 'X'"}
              </Notation>
              . Это хотя бы заметно. Обратная ошибка тише: в файле{" "}
              <Notation>{"27-1.txt"}</Notation> заголовка нет, и пропуск первой
              строки «на всякий случай» молча теряет точку:
            </Typography.Text>
            <CodeBlock
              code={
                'print(len(read_points("27-1.txt")))\nprint(len(read_points("27-1.txt", has_header=True)))'
              }
              label={"Пропуск строки без заголовка"}
              language="python"
              output={"205\n204"}
            />
            <Typography.Text>
              И ещё: латинская <Notation>{"A"}</Notation> и кириллическая{" "}
              <Notation>{"А"}</Notation> в имени файла выглядят одинаково, но
              для компьютера это разные символы.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "kod-zvezdy",
      navLabel: "Код звезды",
      explanation: (
        <>
          <Typography.Text>
            Как прочитать строку, где после координат записан код звезды?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Код хранят в той же записи, что и координаты, а разбирают по
              позициям символов.
            </strong>{" "}
            В задачах ЕГЭ-2026 у каждой звезды записан код вроде{" "}
            <Notation>{"K3V"}</Notation> слитно: латинская буква — спектральный
            класс (цвет), цифра — подкласс, римское число — класс светимости.
            Так устроен и наш файл <Notation>{"27-3.txt"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "4,387365 8,408613 A0III\n1,932849 1,048969 K3V\n3,921424 2,369304 VII"
            }
            label={"Строки файла 27-3.txt"}
            language="text"
            fileName="27-3.txt"
          />
          <Typography.Text>
            Буква задаёт цвет, римское число — размер звезды. Таблицы
            соответствия даны в условии; выбери обозначение, чтобы увидеть, что
            оно значит:
          </Typography.Text>
          <VariantPicker
            label={"Спектральный класс → цвет"}
            defaultIndex={4}
            variants={[
              { label: "O", value: <>голубая</> },
              { label: "B", value: <>бело-голубая</> },
              { label: "A", value: <>белая</> },
              { label: "F", value: <>жёлто-белая</> },
              { label: "G", value: <>жёлтая</> },
              { label: "K", value: <>оранжевая</> },
              { label: "M", value: <>красная</> },
            ]}
          />
          <VariantPicker
            label={"Класс светимости → размер"}
            defaultIndex={2}
            variants={[
              { label: "I", value: <>сверхгигант</> },
              { label: "II", value: <>яркий гигант</> },
              { label: "III", value: <>гигант</> },
              { label: "IV", value: <>субгигант</> },
              { label: "V", value: <>карлик</> },
              { label: "VI", value: <>субкарлик</> },
              { label: "VII", value: <>белый карлик</> },
            ]}
          />
          <Typography.Text>
            «Красный гигант» в условии буквально переводится в{" "}
            <strong>две проверки</strong>: класс <Notation>{"M"}</Notation> и
            светимость <Notation>{"III"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Обрати внимание на третью строку: у белых карликов в файле записан{" "}
            <strong>только класс светимости</strong>{" "}
            <Notation>{"VII"}</Notation>, без буквы и цифры. Поэтому{" "}
            <Notation>{"code[0]"}</Notation> не всегда спектральный класс.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clCodeParts}
            caption={
              <>
                Код разбирается по позициям символов: нулевой — класс, первый —
                подкласс, остальное — светимость. У VII нулевой символ — уже
                часть светимости.
              </>
            }
          />
          <Typography.Text>
            Сначала проверяем, буква ли это, и только потом разбираем код по
            позициям. Запусти функцию по шагам и посмотри, какую ветвь проходит
            каждый код:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runParseKind}
            label={"Разбор кода звезды по шагам"}
          />
          <Typography.Text>
            Для <Notation>{"M4III"}</Notation> выполняется строка 3: буква,
            цифра и всё остальное — срез <Notation>{"code[2:]"}</Notation>. Для{" "}
            <Notation>{"VII"}</Notation> проверка в строке 2 ложна, и функция
            возвращает пустой класс. Записи файла читаем так же, как точки,
            только сохраняем ещё и код:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'def read_stars(filename):\n    stars = []\n\n    with open(filename, encoding="utf-8-sig") as f:\n        for line in f:\n            parts = line.replace(",", ".").split()\n            x, y = float(parts[0]), float(parts[1])\n            stars.append((x, y, parts[2]))\n\n    return stars'
            }
            label={"Функция read_stars"}
            language="python"
          />
          <CodeBlock
            code={
              'stars = read_stars("27-3.txt")\nprint(len(stars))\nprint(stars[:2])'
            }
            label={"Первые звёзды файла 27-3.txt"}
            language="python"
            output={
              "601\n[(4.387365, 8.408613, 'A0III'), (1.932849, 1.048969, 'K3V')]"
            }
          />
          <Typography.Text>
            Для расстояния берут только координаты — срез{" "}
            <Notation>{"s[:2]"}</Notation>, первые два элемента записи:{" "}
            <Notation>{"dist(s[:2], t[:2])"}</Notation>. Код в расчёт не идёт,
            по нему только отбирают звёзды нужного вида.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "stroka-chasticy",
      navLabel: "Строка частицы",
      explanation: (
        <>
          <Typography.Text>
            Как прочитать строку частицы из задачи темы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Строка частицы — шесть частей: пять чисел и признак. Кластер здесь
              определяют не координаты, а энергия, вычисленная по скорости и
              массе.
            </strong>{" "}
            В файле <Notation>{"27-4.txt"}</Notation> записаны координаты{" "}
            <Notation>{"x"}</Notation> и <Notation>{"y"}</Notation>, проекции
            скорости <Notation>{"vx"}</Notation> и <Notation>{"vy"}</Notation>,
            масса <Notation>{"m"}</Notation> и признак — римское число. Значения
            разделены табуляцией, дробная часть — запятой.{" "}
            <Notation>{"split()"}</Notation> справляется и с табуляцией:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'def read_particles(filename):\n    particles = []\n\n    with open(filename, encoding="utf-8-sig") as f:\n        for line in f:\n            parts = line.replace(",", ".").split()\n            x, y, vx, vy, m = [float(v) for v in parts[:5]]\n            particles.append((x, y, vx, vy, m, parts[5]))\n\n    return particles'
            }
            label={"Функция read_particles"}
            language="python"
          />
          <Typography.Text>
            Первые пять частей становятся числами и раскладываются по именам,
            признак остаётся строкой. В записи частицы{" "}
            <Notation>{"p"}</Notation> номер части — номер элемента кортежа:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clColumns}
            caption={
              <>
                Первая строка файла 27-4.txt: шесть частей через табуляцию.
                Скорость — p[2] и p[3], масса — p[4], признак p[5] остаётся
                строкой.
              </>
            }
          />
          <Typography.Text>
            Кинетическая энергия частицы массы m со скоростью (vx; vy) — E = m ·
            (vx² + vy²) / 2. Например, для массы 0,8 и скорости (2; −1,5): E =
            0,8 · (4 + 2,25) / 2 = 2,5. Запишем формулу функцией и проверим её
            на этом примере и на первой частице файла:
          </Typography.Text>
          <CodeBlock
            code={
              "def energy(p):\n    vx, vy, m = p[2], p[3], p[4]\n    return m * (vx ** 2 + vy ** 2) / 2"
            }
            label={"Функция energy"}
            language="python"
          />
          <CodeBlock
            code={
              'print(energy((1.25, -3.4, 2.0, -1.5, 0.8, "III")))\n\nparticles = read_particles("27-4.txt")\nprint(len(particles))\nprint(particles[0], energy(particles[0]))'
            }
            label={"Энергия на примере и в файле"}
            language="python"
            output={
              "2.5\n402\n(-12.554, 9.248, 1.957, 1.743, 1.768, 'VII') 6.071221832"
            }
          />
          <Typography.Text>
            У первой частицы файла энергия около 6,07. По энергиям частицы и
            разделим на кластеры в подтеме 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "polyarnye-koordinaty",
      navLabel: "Полярные координаты",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если в строке файла записаны не x и y, а угол и
            расстояние до начала координат?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Это полярные координаты: угол φ и радиус r. До всех расчётов их
              переводят в обычные: x = r · cos φ, y = r · sin φ.
            </strong>{" "}
            Угол отсчитывают от положительного направления оси x против часовой
            стрелки, радиус — расстояние от начала координат до точки:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clPolar}
            caption={
              <>
                Точка с углом 60° и радиусом 4 — это (2; 3,464), точка с углом
                210° и радиусом 2 — (−1,732; −1). Пунктир — её координаты x и y.
              </>
            }
          />
          <Typography.Text>
            Функции <Notation>{"cos"}</Notation> и <Notation>{"sin"}</Notation>{" "}
            из модуля <Notation>{"math"}</Notation> ждут угол в радианах, а в
            файле он в градусах. Переводит <Notation>{"radians"}</Notation>; без
            неё <Notation>{"cos(60)"}</Notation> считает косинус 60 радиан:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'from math import cos, sin, radians\n\n\ndef polar_to_xy(phi, r):\n    a = radians(phi)\n    return r * cos(a), r * sin(a)\n\n\nx, y = polar_to_xy(60, 4)\nprint(round(x, 3), round(y, 3))\nprint(round(cos(60), 3), round(cos(radians(60)), 3))\n\n\ndef read_polar(filename):\n    points = []\n    with open(filename, encoding="utf-8-sig") as f:\n        for line in f:\n            parts = line.replace(",", ".").split()\n            phi, r = float(parts[0]), float(parts[1])\n            points.append(polar_to_xy(phi, r))\n    return points\n\n\npoints = read_polar("27-7.txt")\nprint(len(points), [round(v, 3) for v in points[0]])'
            }
            label={"Перевод из полярных координат"}
            language="python"
            output={"2.0 3.464\n-0.952 0.5\n250 [5.76, 2.757]"}
          />
          <Typography.Text>
            В файле <Notation>{"27-7.txt"}</Notation> первая строка —{" "}
            <Notation>{"25,581 6,386"}</Notation>: угол 25,581°, радиус 6,386.
            После перевода это точка (5,76; 2,757), и дальше с ней работают как
            с любой другой: расстояния считают по x и y.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochki-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Точка и кластер",
                note: (
                  <>
                    кортеж <Notation>{"(x, y)"}</Notation>, список точек, список
                    списков
                  </>
                ),
              },
              {
                key: "Расстояние",
                note: (
                  <>
                    <Notation>{"dist(a, b)"}</Notation>; с порогом сравнивают
                    квадраты
                  </>
                ),
              },
              {
                key: "Ответ",
                note: (
                  <>
                    <Notation>{"int(value * 10000)"}</Notation> — целая часть
                  </>
                ),
              },
              {
                key: "Чтение",
                note: (
                  <>
                    <Notation>{'replace(",", ".")'}</Notation>,{" "}
                    <Notation>{"split()"}</Notation>,{" "}
                    <Notation>{"float"}</Notation>; заголовок — только если он
                    есть
                  </>
                ),
              },
              {
                key: "Характеристики",
                note: (
                  <>рядом с координатами; код звезды — сначала проверь букву</>
                ),
              },
              {
                key: "Частица и полярные",
                note: (
                  <>E = m · (vx² + vy²) / 2; x = r · cos φ, y = r · sin φ</>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "diagramma-rasseyaniya",
      navLabel: "Диаграмма рассеяния",
      explanation: (
        <>
          <Typography.Text>
            Как понять, на какие группы делятся точки и где проходят границы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Построй диаграмму рассеяния — каждая запись файла становится
              точкой на плоскости — и посмотри на неё.
            </strong>{" "}
            Функцию <Notation>{"read_points"}</Notation> из подтемы 1 считаем
            определённой выше в программе.
          </Typography.Text>
          <Typography.Text>
            В табличном редакторе выдели два столбца координат и построй{" "}
            <strong>точечную диаграмму</strong>. Не линейный график: он соединит
            точки в порядке строк файла, а порядок строк ничего не говорит о
            том, какие точки рядом.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatterexample27txt_5d0645}
            caption={
              <>
                Восемь точек файла example27.txt в одинаковом масштабе по осям:
                пять слева около x = 1, три справа около x = 11, между ними
                пустая полоса шириной 8.
              </>
            }
          />
          <Typography.Text>
            В Python можно использовать <Notation>{"matplotlib"}</Notation>,
            если эта библиотека доступна в твоей среде:
          </Typography.Text>
          <CodeBlock
            code={
              'import matplotlib.pyplot as plt\n\nxs = []\nys = []\n\nfor x, y in points:\n    xs.append(x)\n    ys.append(y)\n\nplt.scatter(xs, ys, s=3)\nplt.axis("equal")\nplt.grid()\nplt.show()'
            }
            label={"Диаграмма рассеяния в matplotlib"}
            language="python"
          />
          <Typography.Text>
            Здесь <Notation>{"scatter"}</Notation> рисует отдельные точки,{" "}
            <Notation>{"s=3"}</Notation> задаёт небольшой размер маркеров,{" "}
            <Notation>{'axis("equal")'}</Notation> устанавливает одинаковый
            масштаб по обеим осям, <Notation>{"grid()"}</Notation> добавляет
            сетку, <Notation>{"show()"}</Notation> показывает рисунок.
            Одинаковый масштаб важен: иначе круг может выглядеть вытянутым
            эллипсом, а расстояния по горизонтали и вертикали будут
            восприниматься неправильно.
          </Typography.Text>
          <Typography.Text>
            <strong>Строй рисунок по самому файлу.</strong> Картинка в условии
            может быть только иллюстрацией и не соответствовать данным задания —
            такое предупреждение прямо встречается в условиях подборки.
          </Typography.Text>
          <Typography.Text>
            После построения рисунка спроси себя:
          </Typography.Text>
          <ul>
            <li>Сколько отчётливых групп видно?</li>
            <li>Есть ли между ними пустые полосы?</li>
            <li>Можно ли провести разделяющую прямую?</li>
            <li>Есть ли отдельно стоящие точки?</li>
            <li>
              Похожи ли группы на компактные облака, дуги, кольца или вытянутые
              цепочки?
            </li>
          </ul>
          <Typography.Text>
            От ответов зависит, чем делить: границами по координатам, углом,
            вычисленной величиной или цепочками соседей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "koordinatnye-granicy",
      navLabel: "Координатные границы",
      explanation: (
        <>
          <Typography.Text>
            Как записать правило, если на рисунке группы разделяет пустая
            полоса?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Провести по полосе границу и сравнивать с ней координату точки.
            </strong>{" "}
            В файле <Notation>{"example27.txt"}</Notation> все точки одной
            группы левее <Notation>{"x = 5"}</Notation>, а другой — правее:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'points = read_points("example27.txt", has_header=True)\n\nclusters = [[], []]\n\nfor point in points:\n    x, y = point\n\n    if x < 5:\n        clusters[0].append(point)\n    else:\n        clusters[1].append(point)\n\nprint(len(clusters[0]), len(clusters[1]))\nprint(clusters[1])'
            }
            label={"Граница x = 5"}
            language="python"
            output={"5 3\n[(10.0, 0.0), (12.0, 0.0), (11.0, 1.0)]"}
          />
          <Typography.Text>
            На диаграмме рассеяния граница видна сразу:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatterexample27txt_x5_16734b}
            caption={
              <>
                Граница x = 5 проходит по пустой полосе: пять точек слева
                (кружки) — первый кластер, три справа (квадраты) — второй.
              </>
            }
          />
          <Typography.Text>
            Почему это работает? Мы нашли правило, которое однозначно определяет
            принадлежность каждой точки: x {"<"} 5 — первый кластер, x ≥ 5 —
            второй.
          </Typography.Text>
          <Typography.Text>
            Число <Notation>{"5"}</Notation> здесь —{" "}
            <strong>граница для конкретных данных</strong>, а не универсальная
            константа задания 27. Если группы разделены горизонтально,
            используется координата <Notation>{"y"}</Notation>:{" "}
            <Notation>{"if y < 8:"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tri-gruppy",
      navLabel: "Три группы",
      explanation: (
        <>
          <Typography.Text>
            Как разделить три группы, если одной границы мало?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Условия комбинируют цепочкой{" "}
              <Notation>{"if / elif / else"}</Notation>: выполняется первая
              истинная проверка, поэтому порядок проверок важен.
            </strong>{" "}
            <PythonTerm term="if">
              <Notation>{"elif"}</Notation>
            </PythonTerm>{" "}
            означает «иначе, если». Например:
          </Typography.Text>
          <ol>
            <li>
              Сначала выделяется нижняя группа: <Notation>{"y < 3"}</Notation>.
            </li>
            <li>
              Среди оставшихся точек выделяется левая:{" "}
              <Notation>{"x < 5"}</Notation>.
            </li>
            <li>Всё остальное попадает в третью.</li>
          </ol>
          <LessonDiagram
            {...lessonMedia.clRegions}
            caption={
              <>
                Цепочка делит плоскость на три области. Нижняя полоса y меньше 3
                забирает и точку (2; 1), хотя у неё x тоже меньше 5: выполняется
                первая истинная проверка.
              </>
            }
          />
          <Typography.Text>
            Запусти цепочку по шагам на трёх точках и посмотри, какую ветвь
            проходит каждая:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runRegions}
            label={"Цепочка проверок по шагам"}
          />
          <Typography.Text>
            Для <Notation>{"(2, 1)"}</Notation> проверка в строке 4 истинна, и
            до строки 6 дело не доходит. Числа 3 и 5 — границы для этих точек: в
            другом файле их снова находят по рисунку.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Почему часто удобнее <Notation>{"if / elif / else"}</Notation>, а
              не несколько независимых <Notation>{"if"}</Notation>?
            </strong>{" "}
            При независимых проверках точка может удовлетворить сразу двум
            условиям:
          </Typography.Text>
          <CodeBlock
            code={
              "if x < 5:\n    clusters[0].append(point)\n\nif y < 3:\n    clusters[1].append(point)"
            }
            label={"Две независимые проверки"}
            language="python"
          />
          <Typography.Text>
            Если у точки одновременно <Notation>{"x < 5"}</Notation> и{" "}
            <Notation>{"y < 3"}</Notation>, она попадёт в оба списка. Цепочка{" "}
            <Notation>{"if / elif / else"}</Notation> выполняет только одну
            ветвь. Правильные границы она за тебя не выберет, но гарантирует,
            что каждая точка попадёт ровно в одну группу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "anomalii",
      navLabel: "Аномалии",
      explanation: (
        <>
          <Typography.Text>
            Что делать с точками, которые не входят ни в один кластер?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Задать области кластеров явно, а всё, что в них не попало,
              отложить в отдельный список аномалий.
            </strong>{" "}
            Аномалия — запись, которая не относится ни к одному из кластеров.
            Например, в демоверсии 2026 года сказано, что в файле Б три лишние
            точки и их нужно исключить.
          </Typography.Text>
          <Typography.Text>
            Привычное последнее <Notation>{"else"}</Notation> здесь опасно: оно
            отправит в последний кластер всё, что не подошло раньше, — и
            аномалии тоже. Поэтому каждую область задают прямоугольником из двух
            условий через{" "}
            <PythonTerm term="andor">
              <Notation>{"and"}</Notation>
            </PythonTerm>
            , а в <Notation>{"else"}</Notation> остаются только аномалии. Так
            устроен наш файл <Notation>{"27-2.txt"}</Notation>: три кластера и
            три аномалии.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatter272txt_boxes2_611cef}
            caption={
              <>
                Файл 27-2.txt: три облака в квадратах (повёрнутых) и три далёкие
                точки-аномалии (крестики). Пунктирные прямоугольники — явные
                области кластеров; всё, что вне их, — аномалии.
              </>
            }
          />
          <CodeBlock
            collapsible={false}
            code={
              'points = read_points("27-2.txt")\n\nclusters = [[], [], []]\nnoise = []\n\nfor point in points:\n    x, y = point\n\n    if -8 < x < 0 and 2 < y < 10:\n        clusters[0].append(point)\n    elif 1 < x < 10 and 2 < y < 10:\n        clusters[1].append(point)\n    elif -2 < x < 5 and -7 < y < 1:\n        clusters[2].append(point)\n    else:\n        noise.append(point)\n\nfor cluster in clusters:\n    print("Размер:", len(cluster))\n\nprint("Аномалий:", len(noise))\nprint(sum(len(c) for c in clusters) + len(noise), len(points))'
            }
            label={"Файл 27-2.txt: три кластера и аномалии"}
            language="python"
            output={
              "Размер: 251\nРазмер: 193\nРазмер: 156\nАномалий: 3\n603 603"
            }
          />
          <Typography.Text>
            И здесь все границы — только учебный пример для этого файла.
            Последние две строки — проверка: число аномалий совпало с условием,
            а все прочитанные точки распределены.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Совпадение количества — необходимая проверка, но не доказательство
            </strong>
            : одну точку можно потерять, а другую случайно учесть дважды.
            Поэтому стоит ещё раз взглянуть на рисунок: каждая граница должна
            проходить по пустому месту.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naklonnaya-granica",
      navLabel: "Наклонная граница",
      explanation: (
        <>
          <Typography.Text>
            Как разделить группы, если пустая полоса между ними идёт наискосок?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Провести наклонную прямую и сравнить y точки с высотой прямой при
              том же x.
            </strong>{" "}
            Пусть группы разделяет прямая y = 2x + 1. Точки выше неё
            удовлетворяют условию y {">"} 2x + 1, а ниже — y {"<"} 2x + 1:
          </Typography.Text>
          <CodeBlock
            code={
              "if y < 2 * x + 1:\n    clusters[0].append(point)\nelse:\n    clusters[1].append(point)"
            }
            label={"Наклонная граница"}
            language="python"
          />
          <Typography.Text>
            Чтобы понять проверку, возьми конкретное <Notation>{"x"}</Notation>.
            Выражение <Notation>{"2*x + 1"}</Notation> вычисляет высоту прямой
            при этом <Notation>{"x"}</Notation>. Затем программа сравнивает с
            ней высоту точки.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Квадраты из условия — не способ разделения"
          >
            <Typography.Text>
              В некоторых задачах сказано, что кластеры помещаются в
              прямоугольники или квадраты заданных размеров. Это{" "}
              <strong>ограничение на расположение точек</strong>, а не готовая
              инструкция, как их разделить. Из него нельзя автоматически
              заключить:
            </Typography.Text>
            <ul>
              <li>что границы проходят через начало координат;</li>
              <li>
                что точки нужно группировать по <Notation>{"x // W"}</Notation>;
              </li>
              <li>что стороны прямоугольников параллельны осям;</li>
              <li>
                что ширину прямоугольника можно использовать как порог
                соседства.
              </li>
            </ul>
            <Typography.Text>
              В подборке есть условия, прямо разрешающие поворот квадратов
              относительно осей. Если прямоугольник заведомо расположен
              параллельно осям, для его точек необходимо x_max − x_min ≤ W и
              y_max − y_min ≤ H.
            </Typography.Text>
            <Typography.Text>
              Но для повёрнутого прямоугольника{" "}
              <strong>
                его проекции на оси могут быть шире соответствующих сторон
              </strong>
              . Поэтому такая проверка уже не является универсальной.
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.clProjection}
              caption={
                <>
                  Прямоугольник 4 × 2, повёрнутый на 30°. Разброс абсцисс его
                  точек — 4,46, больше стороны 4: проверка x_max − x_min ≤ W
                  отвергла бы правильный кластер.
                </>
              }
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "oblasti-mezhdu-pryamymi",
      navLabel: "Между прямыми",
      explanation: (
        <>
          <Typography.Text>
            Как разделить точки, если кластеры лежат в треугольниках, которые
            образуют две наклонные прямые и оси координат?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Треугольник между прямыми — это несколько условий «по какую
              сторону прямой лежит точка», соединённых через and.
            </strong>{" "}
            В файле <Notation>{"27-8.txt"}</Notation> прямые y = x и y = 10 − x
            вместе с осями ограничивают два треугольника — это кластеры. Точки
            вне треугольников — аномалии:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clLines}
            caption={
              <>
                Нижний треугольник лежит под обеими прямыми, левый — над y = x и
                под y = 10 − x. Четыре крестика вне треугольников — аномалии.
              </>
            }
          />
          <Typography.Text>
            Обе области лежат правее оси y, выше оси x и ниже прямой y = 10 − x.
            Внутри этого большого треугольника их делит прямая y = x:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'points = read_points("27-8.txt")\nclusters = [[], []]\nnoise = []\n\nfor x, y in points:\n    if x > 0 and y > 0 and y < 10 - x:\n        if y < x:\n            clusters[0].append((x, y))\n        else:\n            clusters[1].append((x, y))\n    else:\n        noise.append((x, y))\n\nprint(len(clusters[0]), len(clusters[1]), len(noise))'
            }
            label={"Два треугольника и аномалии"}
            language="python"
            output={"170 130 4"}
          />
          <Typography.Text>
            Проверим на точке (6; 2): 6 {">"} 0, 2 {">"} 0 и 2 {"<"} 10 − 6 = 4
            — она внутри большого треугольника, а 2 {"<"} 6 — значит, в нижнем.
            Точка (7; 5) не проходит третью проверку: 5 {"<"} 3 — ложь, это
            аномалия.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razdelyayushchiy-priznak",
      navLabel: "Расстояние и угол",
      explanation: (
        <>
          <Typography.Text>
            Как разделить группы, которые не отделить прямой: кольца вокруг
            точки или узкие секторы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Вычислить по координатам другую величину — расстояние до точки или
              угол направления — и делить по ней.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, группы могут располагаться в разных кольцевых областях
            вокруг известной точки C = (x₀; y₀). Тогда вычисляем расстояние до
            неё, r = √((x − x₀)² + (y − y₀)²), и разделяем точки по диапазонам{" "}
            <Notation>{"r"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "r = dist(point, (x0, y0))\n\nif r < 3:\n    ...\nelif r < 7:\n    ...\nelse:\n    ..."
            }
            label={"Кольца по расстоянию до C"}
            language="python"
          />
          <Typography.Text>
            Границы опять выбираются по конкретным данным. Здесь точка{" "}
            <Notation>{"C"}</Notation>, относительно которой расположены кольца,
            не обязана быть тем «центром кластера», который затем требуется
            найти по сумме расстояний. У этих точек разное назначение.
          </Typography.Text>
          <Typography.Text>
            Если группы лежат в разных <strong>секторах</strong>, разделяющим
            признаком может быть направление от известной точки{" "}
            <Notation>{"C"}</Notation>. Сектор можно представить как кусок круга
            между двумя лучами. Для точки, не совпадающей с{" "}
            <Notation>{"C"}</Notation>, угол направления вычисляется так:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import atan2, degrees\n\nangle = degrees(atan2(y - y0, x - x0))\nangle = angle % 360"
            }
            label={"Угол направления"}
            language="python"
          />
          <Typography.Text>
            Здесь <Notation>{"atan2"}</Notation> определяет угол направления с
            учётом обеих координат; <Notation>{"degrees"}</Notation> переводит
            его из радиан в градусы; <Notation>{"% 360"}</Notation> приводит
            угол к диапазону от 0 включительно до 360 не включительно.
            Направление вправо соответствует 0°, вверх — 90°, влево — 180°.
          </Typography.Text>
          <Typography.Text>
            Почему лучше не использовать обычное деление{" "}
            <Notation>{"(y-y0)/(x-x0)"}</Notation>? У противоположных
            направлений оно одинаковое: точки (1; 1) и (−1; −1) от начала
            координат дают одно и то же отношение 1. А на вертикальном луче
            получается деление на ноль.
          </Typography.Text>
          <Typography.Text>
            Есть тонкость: направления 359° и 1° очень близки. Их нельзя считать
            далёкими только потому, что одно число почти 360, а другое почти 0.
            Чтобы проверить сектор, начинающийся с угла{" "}
            <Notation>{"start"}</Notation> и имеющий ширину{" "}
            <Notation>{"width"}</Notation>, удобно написать:
          </Typography.Text>
          <CodeBlock
            code={
              "relative_angle = (angle - start) % 360\n\nif relative_angle <= width:\n    ..."
            }
            label={"Проверка сектора"}
            language="python"
          />
          <Typography.Text>
            Так выглядит сектор, который переходит через направление 0°:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clSector}
            caption={
              <>
                Сектор от 350° до 10° пересекает направление 0°. Угол от начала
                сектора (angle − 350) % 360 равен 15 для 5° и 5 для 355° — оба
                внутри; 15° даёт 25 — снаружи.
              </>
            }
          />
          <Typography.Text>
            <strong>Не дели угол на ширину сектора автоматически.</strong> Из
            того, что ширина равна 20°, не следует, что границы проходят именно
            по 0°, 20°, 40° и так далее. Положение секторов тоже нужно
            установить. В файле <Notation>{"27-5.txt"}</Notation> три сектора по
            20° вокруг C = (2; −1):
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatter275txt_e67c00}
            caption={
              <>
                Файл 27-5.txt: три узких сектора с общей вершиной C. Один
                смотрит вправо — через направление 0°, второй — вверх-влево,
                третий — вниз-влево.
              </>
            }
          />
          <Typography.Text>
            По рисунку и углам крайних точек начала секторов — 350°, 110° и
            230°:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'from math import atan2, degrees\n\npoints = read_points("27-5.txt")\nx0, y0 = 2, -1\nstarts = [350, 110, 230]\nclusters = [[], [], []]\n\nfor x, y in points:\n    angle = degrees(atan2(y - y0, x - x0)) % 360\n\n    for k in range(3):\n        if (angle - starts[k]) % 360 <= 20:\n            clusters[k].append((x, y))\n\nprint([len(c) for c in clusters], len(points))'
            }
            label={"Три сектора файла 27-5.txt"}
            language="python"
            output={"[83, 76, 69] 228"}
          />
          <Typography.Text>
            Сумма размеров совпала с числом точек: каждая точка попала ровно в
            один сектор.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vychislyaemyy-priznak",
      navLabel: "Энергия частиц",
      explanation: (
        <>
          <Typography.Text>
            Как разделить частицы из задачи темы, если их координаты тут ни при
            чём?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Делить по величине, вычисленной по нескольким столбцам строки, —
              по кинетической энергии.
            </strong>{" "}
            По условию модуль разности энергий любых двух частиц одного кластера
            не больше R = 2. Посчитаем энергию каждой частицы файла{" "}
            <Notation>{"27-4.txt"}</Notation> функцией{" "}
            <Notation>{"energy"}</Notation> из подтемы 1 и посмотрим на неё так
            же, как на точки, — только на одной оси:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clEnergy274txt}
            caption={
              <>
                Энергии всех 402 частиц файла 27-4.txt — штрихи на одной оси.
                Видны четыре группы и три пустых промежутка шириной около 1,6–2;
                пунктирные границы 3,5, 7 и 10,5 стоят в этих промежутках.
              </>
            }
          />
          <Typography.Text>
            Без рисунка большие промежутки находит программа: отсортируем
            энергии и выведем соседние значения, между которыми больше 0,5.
            Затем делим по границам из этих промежутков. Номер группы частицы —
            сколько границ её энергия уже превысила:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def energy_groups(particles, bounds):\n    groups = [[] for _ in range(len(bounds) + 1)]\n\n    for p in particles:\n        k = 0\n        while k < len(bounds) and energy(p) > bounds[k]:\n            k += 1\n        groups[k].append(p)\n\n    return groups"
            }
            label={"Функция energy_groups"}
            language="python"
          />
          <Typography.Text>
            Проверим и условие задачи: в каждой группе наибольшая и наименьшая
            энергии должны отличаться не больше чем на 2.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'particles = read_particles("27-4.txt")\nes = sorted(energy(p) for p in particles)\n\nfor a, b in zip(es, es[1:]):\n    if b - a > 0.5:\n        print(round(a, 3), round(b, 3))\n\ngroups = energy_groups(particles, [3.5, 7, 10.5])\n\nfor g in groups:\n    e = [energy(p) for p in g]\n    print(len(g), round(max(e) - min(e), 3))'
            }
            label={"Промежутки и группы файла 27-4.txt"}
            language="python"
            output={
              "2.857 4.424\n6.174 8.127\n9.879 11.745\n125 1.736\n103 1.751\n93 1.752\n81 1.596"
            }
          />
          <Typography.Text>
            <Notation>{"zip(es, es[1:])"}</Notation> даёт пары соседних значений
            отсортированного списка, а{" "}
            <PythonTerm term="comp">включение</PythonTerm>{" "}
            <Notation>{"[[] for _ in …]"}</Notation> создаёт нужное число пустых
            групп (имя <Notation>{"_"}</Notation> пишут для переменной, которая
            не нужна). Ширина каждой группы меньше 2, значит, разбиение подходит
            под условие.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razdelenie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Рисунок",
                note: <>по самому файлу, одинаковый масштаб по осям</>,
              },
              {
                key: "Границы",
                note: (
                  <>
                    цепочка <Notation>{"if / elif / else"}</Notation>: каждая
                    точка — ровно в одну группу
                  </>
                ),
              },
              {
                key: "Аномалии",
                note: (
                  <>
                    явные области, остальное — в <Notation>{"noise"}</Notation>;
                    сверь количество с условием
                  </>
                ),
              },
              {
                key: "Наклонная прямая",
                note: <>подставь x в уравнение и сравни с y</>,
              },
              {
                key: "Угол и расстояние",
                note: (
                  <>
                    <Notation>{"atan2"}</Notation> и{" "}
                    <Notation>{"(angle − start) % 360"}</Notation>;{" "}
                    <Notation>{"dist"}</Notation> до точки
                  </>
                ),
              },
              {
                key: "Энергия",
                note: <>сортировка и большие промежутки; ширина группы ≤ R</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  paidPractice: {
    examFocus: true,
    checkpoint: 0,
    load: () => import("./data-analysis.paid.praktika"),
  },
  status: "published",
});
