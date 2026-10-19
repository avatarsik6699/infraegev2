import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import { dataAnalysisLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./data-analysis.media";
import { PythonTerm } from "./python-term";

export const dataAnalysisLesson = defineLesson({
  ...dataAnalysisLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Хранить точки кортежами и считать расстояние формулой или math.dist",
    "Читать файл с точками по его формату: запятые, заголовок, дополнительные столбцы",
    "Делить точки на кластеры по границам или вычисленному признаку",
    "Находить центр кластера перебором кандидатов по определению из условия",
    "Собирать ответ по центрам и расстояниям и получать целую часть произведения",
    "Для редких задач — цепочки соседей, другие центры и точные ускорения (дополнительные уроки)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "tochki-i-rasstoyaniya",
      title: "Точки и расстояния",
      lead: "Точка — пара чисел, кластер — список точек; евклидово расстояние по теореме Пифагора и функция dist.",
      conceptIds: [
        "kak-ustroena-tema-27",
        "chto-v-fayle",
        "tochka-kortezh",
        "klaster-spisok",
        "teorema-pifagora",
        "math-dist",
        "kvadrat-rasstoyaniya",
        "celaya-chast-otveta",
        "tochki-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-2",
          prompt: (
            <>
              Точка P = (−4; 1). На сколько единиц и в какую сторону она смещена
              от начала координат по горизонтали и по вертикали? Чему равны её
              абсцисса и ордината?
            </>
          ),
          reveal: (
            <>На 4 единицы влево и на 1 вверх; абсцисса −4, ордината 1.</>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Точка <Notation>{"(4, 7)"}</Notation> и точка{" "}
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
          id: "zadacha-6",
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
          id: "zadacha-7",
          prompt: (
            <>
              Объясни на числах, почему суммы расстояний нельзя сравнивать по
              суммам квадратов: найди две пары расстояний, у которых суммы
              сравниваются в одну сторону, а суммы квадратов — в другую.
            </>
          ),
          reveal: (
            <>
              Например, 1 + 5 = 6 меньше 3 + 4 = 7, но 1 + 25 = 26 больше 9 + 16
              = 25.
            </>
          ),
        },
      ],
    },
    {
      slug: "fajl-s-tochkami",
      title: "Файл с точками",
      lead: "Заголовок, десятичная запятая и лишние столбцы: как прочитать координаты и характеристики и проверить прочитанное.",
      conceptIds: [
        "chtenie-bez-poter",
        "pervye-stroki",
        "razbor-stroki",
        "funkciya-chteniya",
        "zagolovok",
        "dopolnitelnye-stolbcy",
        "kod-zvezdy",
        "stroka-chasticy",
        "fayl-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Какие части и какие числа получатся из строки{" "}
              <Notation>{'"-2,5   4,75"'}</Notation> после{" "}
              <Notation>{'replace(",", ".")'}</Notation>,{" "}
              <Notation>{"split()"}</Notation> и <Notation>{"float"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"['-2.5', '4.75']"}</Notation>, числа −2,5 и 4,75:
              несколько пробелов подряд <Notation>{"split()"}</Notation> считает
              одним разделителем.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Почему для строки из задачи 1 нельзя писать{" "}
              <Notation>{'line.split(" ")'}</Notation>? Что получится?
            </>
          ),
          reveal: (
            <>
              <Notation>{'split(" ")'}</Notation> делит по каждому пробелу и
              возвращает пустые строки между соседними пробелами:{" "}
              <Notation>{"['-2.5', '', '', '4.75']"}</Notation>;{" "}
              <Notation>{"parts[1]"}</Notation> окажется пустой строкой.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Файл с заголовком прочитали без пропуска первой строки, а файл без
              заголовка — с пропуском. В каком случае программа сообщит об
              ошибке, а в каком молча даст неверный ответ?
            </>
          ),
          reveal: (
            <>
              Заголовок без пропуска даёт ошибку{" "}
              <Notation>{"ValueError"}</Notation> на первой строке. Пропуск
              строки без заголовка ошибки не даёт — просто теряется первая
              точка.
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
      ],
    },
    {
      slug: "razdelenie-na-klastery",
      title: "Разделение на кластеры",
      lead: "Точечная диаграмма, координатные границы, аномалии и разделение по вычисленной величине: углу, расстоянию, энергии.",
      conceptIds: [
        "pravilo-razdeleniya",
        "diagramma-rasseyaniya",
        "koordinatnye-granicy",
        "tri-gruppy",
        "anomalii",
        "naklonnaya-granica",
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
              Какие из точек <Notation>{"(1, 4)"}</Notation>,{" "}
              <Notation>{"(2, 4)"}</Notation>, <Notation>{"(0, 0.5)"}</Notation>{" "}
              лежат выше прямой y = 2x + 1, какие ниже, какие на ней?
            </>
          ),
          reveal: (
            <>
              <Notation>{"(1, 4)"}</Notation> выше: 4 {">"} 3;{" "}
              <Notation>{"(2, 4)"}</Notation> ниже: 4 {"<"} 5;{" "}
              <Notation>{"(0, 0.5)"}</Notation> ниже: 0,5 {"<"} 1.
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
          id: "zadacha-6",
          prompt: (
            <>
              Квадрат со стороной 3 повернули на 45°. Чему равен разброс абсцисс
              его вершин? Почему для такого кластера нельзя проверять x_max −
              x_min ≤ 3?
            </>
          ),
          reveal: (
            <>
              3√2 ≈ 4,243 — это диагональ квадрата. Проверка с шириной 3
              отвергла бы правильный кластер.
            </>
          ),
        },
      ],
    },
    {
      slug: "centr-klastera",
      title: "Центр кластера",
      lead: "Центр по сумме расстояний: перебор кандидатов, почему средняя точка не подходит и сколько работы требует двойной цикл.",
      access: "paid",
      conceptIds: [
        "centr-tochka-klastera",
        "summa-rasstoyaniy",
        "perebor-kandidatov",
        "programma-centra",
        "rasstoyanie-do-sebya",
        "srednee-ne-centr",
        "tri-vyrazheniya",
        "srednee-rasstoyanie",
        "formula-rasstoyaniya",
        "vremya-poiska",
        "centr-itogo",
      ],
      paid: {
        outline: [
          { id: "centr-tochka-klastera", navLabel: "Центр — точка кластера" },
          { id: "summa-rasstoyaniy", navLabel: "Сумма расстояний" },
          { id: "perebor-kandidatov", navLabel: "Перебор кандидатов" },
          { id: "programma-centra", navLabel: "Программа" },
          { id: "rasstoyanie-do-sebya", navLabel: "Расстояние до себя" },
          { id: "srednee-ne-centr", navLabel: "Среднее — не центр" },
          { id: "tri-vyrazheniya", navLabel: "Три разных выражения" },
          { id: "srednee-rasstoyanie", navLabel: "Среднее расстояние" },
          { id: "formula-rasstoyaniya", navLabel: "Формула расстояния" },
          { id: "vremya-poiska", navLabel: "Время поиска" },
          { id: "centr-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Центр кластера в задании 27 — одна из точек самого кластера, и
                выбирают её по величине, которую задаёт условие.
              </strong>{" "}
              Чаще всего это сумма расстояний до остальных точек: так определён
              центр в 40 задачах из 50, во всех задачах экзаменов и демоверсий.
              Демоверсия 2027 года меняет только «расстояние»: вместо длины
              отрезка — разность энергий.
            </Typography.Text>
          </>
        ),
        selfCheck: 7,
        load: () => import("./data-analysis.paid.centr-klastera"),
      },
    },
    {
      slug: "otvet-po-centram",
      title: "Ответ по центрам",
      lead: "Средние и минимумы координат центров, наименьший и наибольший кластер, исключение кластера и целая часть произведения.",
      access: "paid",
      conceptIds: [
        "vychislenie-otveta",
        "korotkaya-zapis",
        "srednee-centrov",
        "minimalnye-koordinaty",
        "malenkiy-i-bolshoy",
        "obekty-nuzhnogo-vida",
        "isklyuchenie-klasterov",
        "masshtabirovanie",
        "float",
        "polnyy-primer",
        "otvet-itogo",
      ],
      paid: {
        outline: [
          { id: "vychislenie-otveta", navLabel: "Вычисление ответа" },
          { id: "korotkaya-zapis", navLabel: "Короткая запись перебора" },
          { id: "srednee-centrov", navLabel: "Среднее центров" },
          { id: "minimalnye-koordinaty", navLabel: "Минимальные координаты" },
          { id: "malenkiy-i-bolshoy", navLabel: "Маленький и большой кластер" },
          { id: "obekty-nuzhnogo-vida", navLabel: "Объекты нужного вида" },
          { id: "isklyuchenie-klasterov", navLabel: "Исключение кластеров" },
          { id: "masshtabirovanie", navLabel: "Масштабирование" },
          { id: "float", navLabel: "Дробные числа" },
          { id: "polnyy-primer", navLabel: "Полный пример" },
          { id: "otvet-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                После нахождения центров начинается отдельная часть задачи:
                вычисление ответа.
              </strong>{" "}
              Её легко недооценить. Даже идеально найденные центры не помогут,
              если затем усреднить не те координаты или посчитать расстояние
              между не теми объектами. Средние и минимумы координат центров
              нужны в 36 задачах подборок, выбор наименьшего или наибольшего
              кластера и исключение кластера — в 20.
            </Typography.Text>
          </>
        ),
        selfCheck: 2,
        load: () => import("./data-analysis.paid.otvet-po-centram"),
      },
    },
    {
      slug: "rasstoyaniya-i-pary",
      title: "Расстояния и пары точек",
      lead: "Радиус, расстояния до точек своего и чужого кластера, диаметр, межкластерный диаметр и подсчёт точек в радиусе.",
      access: "paid",
      conceptIds: [
        "iz-rasstoyaniy",
        "svoy-i-chuzhoy",
        "diametr",
        "mezhklasternyy-diametr",
        "tochki-okolo-centra",
        "blizhayshiy-obekt",
        "rasstoyaniya-itogo",
      ],
      paid: {
        outline: [
          { id: "iz-rasstoyaniy", navLabel: "Ответ из расстояний" },
          { id: "svoy-i-chuzhoy", navLabel: "Свой и чужой кластер" },
          { id: "diametr", navLabel: "Диаметр кластера" },
          { id: "mezhklasternyy-diametr", navLabel: "Межкластерный диаметр" },
          { id: "tochki-okolo-centra", navLabel: "Точки около центра" },
          { id: "blizhayshiy-obekt", navLabel: "Ближайший объект" },
          { id: "rasstoyaniya-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                После центров ответ чаще всего собирают из расстояний: между
                центрами, от центра до точек и между самими точками.
              </strong>{" "}
              С демоверсии 2026 года это главный тип вопроса: расстояния после
              центров нужны в 17 задачах подборок, диаметры и пары точек — ещё в
              9, все 2025–2026 годов. Каждый раз важно ответить на два вопроса:
              от чего до чего считаем расстояние и среди каких точек выбираем.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./data-analysis.paid.rasstoyaniya-i-pary"),
      },
    },
    {
      slug: "cepochki-sosedej",
      title: "Цепочки соседей",
      lead: "Автоматическое разделение по порогу соседства: связные группы, обоснование порога и аномалии как маленькие группы.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "dopolnitelnyy-urok-sosedi",
        "porog-sosedstva",
        "postroenie-gruppy",
        "pochemu-vsya-gruppa",
        "porog-v-primere",
        "obosnovanie-poroga",
        "malenkie-gruppy",
        "dve-operacii",
        "sosedi-itogo",
      ],
      paid: {
        outline: [
          { id: "dopolnitelnyy-urok-sosedi", navLabel: "Дополнительный урок" },
          { id: "porog-sosedstva", navLabel: "Порог соседства" },
          { id: "postroenie-gruppy", navLabel: "Построение группы" },
          { id: "pochemu-vsya-gruppa", navLabel: "Почему вся группа" },
          { id: "porog-v-primere", navLabel: "Порог в примере" },
          { id: "obosnovanie-poroga", navLabel: "Обоснование порога" },
          { id: "malenkie-gruppy", navLabel: "Маленькие группы" },
          { id: "dve-operacii", navLabel: "Две операции" },
          { id: "sosedi-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет второй, автоматический способ разделения на
              кластеры. Ни одна задача подборок его не требует: во всех файлах
              кластеры отделяются координатными границами или углом. Но цепочки
              соседей разделяют группы без подбора границ по рисунку и помогают
              проверить границы. Задачи основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 6,
        load: () => import("./data-analysis.paid.cepochki-sosedej"),
      },
    },
    {
      slug: "drugie-centry-i-uskoreniya",
      title: "Другие центры и ускорения",
      lead: "Минимакс, антицентр и сумма квадратов, а также точные ускорения поиска центра без потери правильности.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "dopolnitelnyy-urok-centry",
        "samaya-dalyokaya-tochka",
        "antipod",
        "summa-kvadratov",
        "simmetriya",
        "dosrochnaya-ostanovka",
        "bez-garantii",
        "centry-itogo",
      ],
      paid: {
        outline: [
          { id: "dopolnitelnyy-urok-centry", navLabel: "Дополнительный урок" },
          { id: "samaya-dalyokaya-tochka", navLabel: "Самая далёкая точка" },
          { id: "antipod", navLabel: "Антицентр и антипод" },
          { id: "summa-kvadratov", navLabel: "Сумма квадратов" },
          { id: "simmetriya", navLabel: "Симметрия расстояния" },
          { id: "dosrochnaya-ostanovka", navLabel: "Досрочная остановка" },
          { id: "bez-garantii", navLabel: "Сокращения без гарантии" },
          { id: "centry-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 27: 6 задач
              подборок 2024–2025 годов определяют центр иначе — минимаксом,
              наибольшей суммой или суммой квадратов, — а на экзаменах и в
              демоверсиях таких задач не было. Здесь же точные ускорения поиска
              центра; ни одна задача подборок их не требует. Задачи основных
              подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./data-analysis.paid.drugie-centry-i-uskoreniya"),
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
            <strong>
              Задание 27 на кластеризацию удобнее понимать как несколько
              отдельных задач:
            </strong>{" "}
            прочитать точки, правильно распределить их по группам, вычислить
            характеристики этих групп и собрать ответ по условию. Если
            разобраться в каждом шаге, решение можно будет строить
            самостоятельно.
          </Typography.Text>
          <Typography.Text>
            В задачах подборок встречаются разные определения центра: через
            сумму расстояний, через сумму квадратов расстояний, через расстояние
            до самой далёкой точки. Есть задания с исключением отдельных
            кластеров, точками-аномалиями и дополнительными вычислениями после
            кластеризации. Поэтому одного неизменного шаблона для всей подборки
            недостаточно.
          </Typography.Text>
          <Typography.Text>
            Но <strong>все 50 задач начинаются одинаково</strong>: точка — это
            пара чисел, а расстояние между точками считается по формуле. С этого
            и начнём.
          </Typography.Text>
          <Typography.Text>
            Ниже будем писать на <strong>Python</strong>. Все небольшие числовые
            примеры — учебные: их координаты подобраны так, чтобы вычисления
            можно было проверить вручную. Первые примеры — точки A (2; 5) и B
            (−3; 4).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chto-v-fayle",
      navLabel: "Что в файле",
      explanation: (
        <>
          <Typography.Text>
            <strong>Начнём с того, что именно находится в файле.</strong> Обычно
            каждая строка описывает одну точку на плоскости:
          </Typography.Text>
          <CodeBlock
            code={"1.5 3.2\n2.1 4.8\n7.3 1.4"}
            label={"Строки файла file.txt"}
            language="text"
            fileName="file.txt"
          />
          <Typography.Text>
            У точки есть две координаты: <Notation>{"x"}</Notation> — положение
            по горизонтали, <Notation>{"y"}</Notation> — положение по вертикали.
            Например, запись A = (2; 5) означает: точка расположена на 2 единицы
            правее начала координат и на 5 единиц выше него. Отрицательная
            координата задаёт <strong>противоположное направление</strong>: B =
            (−3; 4) — это 3 единицы влево и 4 единицы вверх.
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
            В условиях часто используют слова <strong>абсцисса</strong> и{" "}
            <strong>ордината</strong>. За ними не скрывается ничего
            дополнительного: абсцисса — это координата{" "}
            <Notation>{"x"}</Notation>, ордината — координата{" "}
            <Notation>{"y"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Звёзды, результаты эксперимента, населённые пункты — это сюжет. Для
            программы во всех этих случаях важны прежде всего пары чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tochka-kortezh",
      navLabel: "Точка — кортеж",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Python одну точку удобно хранить кортежем, а несколько точек —
              списком.
            </strong>{" "}
            Упорядоченная группа значений <Notation>{"(2.0, 5.0)"}</Notation>{" "}
            называется <PythonTerm term="tuple">кортежем</PythonTerm>; здесь в
            нём два элемента. Нумерация элементов в Python начинается с нуля:{" "}
            <Notation>{"point[0]"}</Notation> — координата{" "}
            <Notation>{"x"}</Notation>, <Notation>{"point[1]"}</Notation> —
            координата <Notation>{"y"}</Notation>. Можно сразу разложить пару по
            двум переменным: <Notation>{"x, y = point"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Несколько точек будем хранить в{" "}
            <PythonTerm term="list">списке</PythonTerm>. Список отличается от
            кортежа, в частности, тем, что его удобно изменять: добавлять и
            удалять элементы.
          </Typography.Text>
          <Typography.Text>
            Метод <Notation>{"append"}</Notation> добавляет один элемент в конец
            списка,{" "}
            <PythonTerm term="len">
              <Notation>{"len"}</Notation>
            </PythonTerm>{" "}
            даёт количество элементов, а цикл{" "}
            <PythonTerm term="for">
              <Notation>{"for"}</Notation>
            </PythonTerm>{" "}
            перебирает точки — сразу с координатами:
          </Typography.Text>
          <CodeBlock
            code={
              "point = (2.0, 5.0)\nx, y = point\nprint(point[0], point[1], x, y)\n\npoints = [\n    (2.0, 5.0),\n    (-3.0, 4.0),\n    (7.0, 1.0)\n]\npoints.append((8.0, 2.0))\nprint(len(points))\n\nfor x, y in points:\n    print(x, y)"
            }
            label={"Код на Python: point = (2.0, 5.0)"}
            language="python"
            output={"2.0 5.0 2.0 5.0\n4\n2.0 5.0\n-3.0 4.0\n7.0 1.0\n8.0 2.0"}
          />
          <Typography.Text>
            Переменные <Notation>{"x"}</Notation> и <Notation>{"y"}</Notation> в
            заголовке цикла последовательно принимают координаты каждой точки.
            Запись <Notation>{"for point in points:"}</Notation> перебрала бы те
            же точки целиком.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "klaster-spisok",
      navLabel: "Кластер — список",
      explanation: (
        <>
          <Typography.Text>
            <strong>Кластер в программе — это тоже список точек.</strong> А все
            кластеры вместе — список таких списков:
          </Typography.Text>
          <CodeBlock
            code={
              "clusters = [\n    [(0, 0), (1, 1), (2, 0)],\n    [(10, 8), (11, 9), (12, 8)]\n]\n\nprint(len(clusters))      # количество кластеров\nprint(len(clusters[0]))   # количество точек первого кластера\nprint(clusters[1])        # второй кластер"
            }
            label={
              "Кластер в программе — это тоже список точек. А все кластеры вместе — список таких списков"
            }
            language="python"
            output={"2\n3\n[(10, 8), (11, 9), (12, 8)]"}
          />
          <Typography.Text>
            <Notation>{"clusters[0]"}</Notation> — первый кластер,{" "}
            <Notation>{"clusters[1]"}</Notation> — второй. Важно различать два
            количества: <strong>сколько групп</strong> —{" "}
            <Notation>{"len(clusters)"}</Notation> — и{" "}
            <strong>сколько точек внутри группы</strong> —{" "}
            <Notation>{"len(clusters[0])"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "teorema-pifagora",
      navLabel: "Расстояние по Пифагору",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Расстояние между точками получается из теоремы Пифагора.
            </strong>{" "}
            Возьмём A = (1; 2) и B = (4; 6). По горизонтали точки отличаются на
            4 − 1 = 3, по вертикали — на 6 − 2 = 4. Эти два перемещения образуют
            катеты прямоугольного треугольника, а отрезок между точками — его
            гипотенузу.
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
            Поэтому для точек A = (x₁; y₁) и B = (x₂; y₂) длина отрезка:
          </Typography.Text>
          <Typography.Text>
            d(A, B) = √((x₂ − x₁)² + (y₂ − y₁)²).
          </Typography.Text>
          <Typography.Text>
            Буквой d здесь обозначено расстояние. Для нашего примера d(A, B) =
            √(3² + 4²) = √25 = 5. Такое расстояние называется{" "}
            <strong>евклидовым</strong>: это обычная длина прямого отрезка.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "math-dist",
      navLabel: "Функция math.dist",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Python формулу можно записать самостоятельно, но в модуле{" "}
              <Notation>{"math"}</Notation> уже есть нужная функция.
            </strong>{" "}
            Своя функция (
            <PythonTerm term="def">
              <Notation>{"def"}</Notation>
            </PythonTerm>{" "}
            создаёт функцию, <Notation>{"return"}</Notation> возвращает
            результат) повторяет формулу: <Notation>{"** 2"}</Notation> —
            возведение в квадрат, <Notation>{"** 0.5"}</Notation> — извлечение
            квадратного корня.
          </Typography.Text>
          <CodeBlock
            code={
              "from math import dist\n\n\ndef distance(a, b):\n    dx = a[0] - b[0]\n    dy = a[1] - b[1]\n\n    return (dx ** 2 + dy ** 2) ** 0.5\n\n\nprint(distance((1, 2), (4, 6)))\nprint(dist((1, 2), (4, 6)))"
            }
            label={"Код на Python: from math import dist"}
            language="python"
            output={"5.0\n5.0"}
          />
          <Typography.Text>
            <PythonTerm term="import">
              <Notation>{"from math import dist"}</Notation>
            </PythonTerm>{" "}
            означает: взять функцию <Notation>{"dist"}</Notation> из
            математического модуля. Она вычисляет евклидово расстояние между
            точками. Дальше будем в основном использовать её.
          </Typography.Text>
          <Typography.Text>
            Заметь несколько свойств: d(A, B) = d(B, A); d(A, A) = 0; d(A, B) ≥
            0. Они пригодятся при объяснении алгоритмов и ускорений.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kvadrat-rasstoyaniya",
      navLabel: "Квадрат расстояния",
      explanation: (
        <>
          <Typography.Text>
            <strong>Иногда достаточно квадрата расстояния.</strong> Если нужно
            лишь проверить d(A, B) ≤ r, где r ≥ 0, можно проверить равносильное
            условие (x₂ − x₁)² + (y₂ − y₁)² ≤ r². Корень не понадобится:
          </Typography.Text>
          <CodeBlock
            code={
              'a, b, r = (1, 2), (4, 6), 5\n\ndx = a[0] - b[0]\ndy = a[1] - b[1]\n\nif dx * dx + dy * dy <= r * r:\n    print("Точки достаточно близки")'
            }
            label={"Корень не понадобится"}
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
      id: "celaya-chast-otveta",
      navLabel: "Целая часть ответа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ответ задания 27 обычно просят как целую часть произведения на 10
              000.
            </strong>{" "}
            Значение 2,718281 умножают на 10 000 и{" "}
            <strong>отбрасывают дробную часть</strong>: 27182,81 → 27182. В
            Python это одна строка — <Notation>{"int(value * 10000)"}</Notation>
            :{" "}
            <PythonTerm term="num">
              <Notation>{"int"}</Notation>
            </PythonTerm>{" "}
            отбрасывает дробную часть. Чем <Notation>{"int"}</Notation>{" "}
            отличается от <Notation>{"round"}</Notation> и где брать модуль,
            разберём в подтеме 5; до неё все значения в задачах положительные.
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
                note: (
                  <>
                    Точка — пара чисел; в Python — кортеж{" "}
                    <Notation>{"(x, y)"}</Notation>, кластер — список точек, все
                    кластеры — список списков.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"len(clusters)"}</Notation> — сколько групп,{" "}
                    <Notation>{"len(clusters[0])"}</Notation> — сколько точек в
                    первой группе.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Евклидово расстояние — гипотенуза треугольника с катетами
                    |x₂ − x₁| и |y₂ − y₁|; в Python —{" "}
                    <Notation>{"dist(a, b)"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сравнить одно расстояние с порогом можно по квадратам, а
                    суммы расстояний — нельзя.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Ответ — <Notation>{"int(value * 10000)"}</Notation>: целая
                    часть, а не округление.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "chtenie-bez-poter",
      navLabel: "Чтение без потерь",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перед тем как делить точки на группы, их нужно без потерь
              прочитать из файла.
            </strong>{" "}
            Чтение нужно во всех 50 задачах подборок, а в семи из них — в том
            числе в обеих задачах основной волны ЕГЭ-2026 и в демоверсии 2027
            года — в строке кроме координат есть характеристика объекта. Ошибка
            при чтении (пропущенная точка, запятая вместо точки, лишний столбец)
            портит ответ так же, как ошибка в алгоритме.
          </Typography.Text>
          <Typography.Text>
            Будем читать файл <Notation>{"example27.txt"}</Notation> — восемь
            точек с заголовком <Notation>{"X Y"}</Notation>; к нему мы вернёмся,
            когда соберём решение целиком. Точки и расстояния — из подтемы 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervye-stroki",
      navLabel: "Первые строки файла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перед написанием алгоритма нужно посмотреть первые строки файла.
            </strong>{" "}
            В разных заданиях формат немного различается. Возможен файл без
            заголовка:
          </Typography.Text>
          <CodeBlock
            code={"1.25 3.70\n2.80 4.10"}
            label={"Строки файла file.txt"}
            language="text"
            fileName="file.txt"
          />
          <Typography.Text>Возможен файл с заголовком:</Typography.Text>
          <CodeBlock
            code={"X Y\n1.25 3.70\n2.80 4.10"}
            label={"Строки файла file.txt"}
            language="text"
            fileName="file.txt"
          />
          <Typography.Text>
            Дробная часть может отделяться запятой:
          </Typography.Text>
          <CodeBlock
            code={"1,25 3,70\n2,80 4,10"}
            label={"Строки файла file.txt"}
            language="text"
            fileName="file.txt"
          />
          <Typography.Text>
            Для Python запись <Notation>{'"1,25"'}</Notation> не является
            стандартной записью дробного числа. Перед преобразованием запятую
            заменяют точкой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razbor-stroki",
      navLabel: "Разбор строки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Одна строка разбирается в три действия: заменить запятые,
              разделить, превратить части в числа.
            </strong>{" "}
            Метод{" "}
            <PythonTerm term="strmeth">
              <Notation>{"replace"}</Notation>
            </PythonTerm>{" "}
            заменяет запятые точками,{" "}
            <PythonTerm term="split">
              <Notation>{"split()"}</Notation>
            </PythonTerm>{" "}
            делит строку на части, а{" "}
            <PythonTerm term="num">
              <Notation>{"float"}</Notation>
            </PythonTerm>{" "}
            превращает часть в дробное число:
          </Typography.Text>
          <CodeBlock
            code={
              'line = "1,25 3,70"\nline = line.replace(",", ".")\nparts = line.split()\nprint(line)\nprint(parts)\n\nx = float(parts[0])\ny = float(parts[1])\nprint(x, y)'
            }
            label={'Код на Python: line = "1,25 3,70"'}
            language="python"
            output={"1.25 3.70\n['1.25', '3.70']\n1.25 3.7"}
          />
          <Typography.Text>
            <Notation>{"split()"}</Notation> без аргументов разделяет строку по
            пробельным символам. Поэтому ему подходят и несколько пробелов
            подряд, и табуляция. Пока элементы списка{" "}
            <Notation>{"parts"}</Notation> — <strong>строки</strong>, то есть
            текст. Числами они становятся только после{" "}
            <Notation>{"float"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "funkciya-chteniya",
      navLabel: "Функция чтения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Полная функция чтения собирает точки файла в список.
            </strong>{" "}
            Координаты берём из первых двух частей строки — так функция подойдёт
            и для файлов, где после координат записано что-то ещё:
          </Typography.Text>
          <CodeBlock
            code={
              'def read_points(filename, has_header=False):\n    points = []\n\n    with open(filename, encoding="utf-8-sig") as f:\n        if has_header:\n            f.readline()\n\n        for line in f:\n            if not line.strip():\n                continue\n\n            parts = line.replace(",", ".").split()\n\n            x = float(parts[0])\n            y = float(parts[1])\n\n            points.append((x, y))\n\n    return points'
            }
            label={
              "Код на Python: def read_points(filename, has_header=False):"
            }
            language="python"
          />
          <Typography.Text>Что здесь происходит:</Typography.Text>
          <ul>
            <li>
              <Notation>{"has_header"}</Notation> сообщает, есть ли в начале
              строка с названиями столбцов; <Notation>{"False"}</Notation> —{" "}
              <PythonTerm term="defarg">значение по умолчанию</PythonTerm>,
              «нет».
            </li>
            <li>
              <PythonTerm term="file">
                <Notation>{"with open(...) as f"}</Notation>
              </PythonTerm>{" "}
              открывает файл, а после окончания блока автоматически его
              закрывает; <Notation>{"for line in f"}</Notation> перебирает
              оставшиеся строки.
            </li>
            <li>
              <Notation>{"f.readline()"}</Notation> читает одну строку. В данном
              случае мы её намеренно пропускаем.
            </li>
            <li>
              <PythonTerm term="strip">
                <Notation>{"line.strip()"}</Notation>
              </PythonTerm>{" "}
              убирает пробелы и перевод строки по краям, поэтому{" "}
              <Notation>{"if not line.strip()"}</Notation> проверяет, не
              является ли строка пустой;{" "}
              <PythonTerm term="continue">
                <Notation>{"continue"}</Notation>
              </PythonTerm>{" "}
              пропускает оставшуюся часть текущего прохода цикла.
            </li>
            <li>
              <Notation>{'encoding="utf-8-sig"'}</Notation> подходит для UTF-8 и
              корректно обрабатывает возможную служебную метку в начале такого
              файла.
            </li>
          </ul>
          <Typography.Text>
            После чтения полезно проверить, что программа действительно
            прочитала ожидаемые данные. Запись{" "}
            <Notation>{"points[:5]"}</Notation> —{" "}
            <PythonTerm term="slice">срез</PythonTerm>: первые пять элементов
            списка.
          </Typography.Text>
          <CodeBlock
            code={
              'points = read_points("example27.txt", has_header=True)\n\nprint("Количество точек:", len(points))\nprint("Первые точки:", points[:5])'
            }
            label={
              "Запись points[:5] — {{slice|срез}}: первые пять элементов списка"
            }
            language="python"
            output={
              "Количество точек: 8\nПервые точки: [(0.0, 0.0), (0.0, 2.0), (1.0, 1.0), (2.0, 0.0), (2.0, 2.0)]"
            }
          />
        </>
      ),
    },
    {
      id: "zagolovok",
      navLabel: "Заголовок",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Не пропускай первую строку автоматически в любом файле.
            </strong>{" "}
            Если в файле есть заголовок, а мы его не пропустили, программа
            остановится на первой же строке — это хотя бы заметно:
          </Typography.Text>
          <CodeBlock
            code={'points = read_points("example27.txt")'}
            label={'Код на Python: points = read_points("example27.txt")'}
            language="python"
          />
          <CodeBlock
            code={"ValueError: could not convert string to float: 'X'"}
            label={"Результат"}
            language="text"
          />
          <Typography.Text>
            Опаснее обратная ошибка. В файле <Notation>{"27-1.txt"}</Notation>{" "}
            заголовка нет, но если пропустить первую строку «на всякий случай»,
            программа молча потеряет первую точку:
          </Typography.Text>
          <CodeBlock
            code={
              'print(len(read_points("27-1.txt")))\nprint(len(read_points("27-1.txt", has_header=True)))'
            }
            label={'Код на Python: print(len(read_points("27-1.txt")))'}
            language="python"
            output={"205\n204"}
          />
          <Typography.Text>
            Если в начале указано количество точек, эту строку тоже нужно
            обрабатывать отдельно, но уже в соответствии с таким форматом. И ещё
            одна мелочь: латинская <Notation>{"A"}</Notation> и кириллическая{" "}
            <Notation>{"А"}</Notation> в имени файла выглядят почти одинаково,
            но для компьютера это разные символы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dopolnitelnye-stolbcy",
      navLabel: "Дополнительные столбцы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Дополнительные столбцы не нужно смешивать с координатами.
            </strong>{" "}
            В некоторых вариантах у объекта кроме положения есть тип, категория
            или другой признак:
          </Typography.Text>
          <CodeBlock
            code={"1.25 3.70 red\n2.80 4.10 blue"}
            label={"Строки файла file.txt"}
            language="text"
            fileName="file.txt"
          />
          <Typography.Text>
            Третий столбец здесь — текстовая характеристика, а не третья
            пространственная координата. Её сохраняют вместе с координатами в
            одной записи, а для расстояния используют только координаты — срез{" "}
            <Notation>{"[:2]"}</Notation> берёт первые два элемента:
          </Typography.Text>
          <CodeBlock
            code={
              'from math import dist\n\nrecord1 = (1.25, 3.70, "red")\nrecord2 = (2.80, 4.10, "blue")\n\nprint(record1[2], record2[2])\nprint(dist(record1[:2], record2[:2]))'
            }
            label={"Код на Python: from math import dist"}
            language="python"
            output={"red blue\n1.600781059358212"}
          />
        </>
      ),
    },
    {
      id: "kod-zvezdy",
      navLabel: "Код звезды",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Характеристику звезды разбирают по позициям символов.
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
            label={
              "Запусти функцию по шагам и посмотри, какую ветвь проходит каждый код"
            }
          />
          <Typography.Text>
            Для <Notation>{"M4III"}</Notation> выполняется строка 3: буква,
            цифра и всё остальное — срез <Notation>{"code[2:]"}</Notation>. Для{" "}
            <Notation>{"VII"}</Notation> проверка в строке 2 ложна, и функция
            возвращает пустой класс. Записи файла читаем так же, как точки,
            только сохраняем ещё и код:
          </Typography.Text>
          <CodeBlock
            code={
              'def read_stars(filename):\n    stars = []\n\n    with open(filename, encoding="utf-8-sig") as f:\n        for line in f:\n            parts = line.replace(",", ".").split()\n            x, y = float(parts[0]), float(parts[1])\n            stars.append((x, y, parts[2]))\n\n    return stars'
            }
            label={
              "Записи файла читаем так же, как точки, только сохраняем ещё и код"
            }
            language="python"
          />
          <CodeBlock
            code={
              'stars = read_stars("27-3.txt")\nprint(len(stars))\nprint(stars[:2])'
            }
            label={
              "Записи файла читаем так же, как точки, только сохраняем ещё и код"
            }
            language="python"
            output={
              "601\n[(4.387365, 8.408613, 'A0III'), (1.932849, 1.048969, 'K3V')]"
            }
          />
        </>
      ),
    },
    {
      id: "stroka-chasticy",
      navLabel: "Строка частицы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строка частицы содержит шесть значений, и кластер определяется
              величиной, вычисленной по ним.
            </strong>{" "}
            В демоверсии 2027 года каждая строка — частица: координаты{" "}
            <Notation>{"x"}</Notation> и <Notation>{"y"}</Notation>, проекции
            скорости <Notation>{"vx"}</Notation> и <Notation>{"vy"}</Notation>,
            масса <Notation>{"m"}</Notation> и признак — римское число. Значения
            разделены табуляцией, дробная часть — запятой. Так устроен файл{" "}
            <Notation>{"27-4.txt"}</Notation>. <Notation>{"split()"}</Notation>{" "}
            справляется и с табуляцией, поэтому чтение не меняется:
          </Typography.Text>
          <CodeBlock
            code={
              'def read_particles(filename):\n    particles = []\n\n    with open(filename, encoding="utf-8-sig") as f:\n        for line in f:\n            parts = line.replace(",", ".").split()\n            x, y, vx, vy, m = [float(v) for v in parts[:5]]\n            particles.append((x, y, vx, vy, m, parts[5]))\n\n    return particles'
            }
            label={
              "split() справляется и с табуляцией, поэтому чтение не меняется"
            }
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
            label={
              "Запишем формулу функцией и проверим её на этом примере и на первой частице файла"
            }
            language="python"
          />
          <CodeBlock
            code={
              'print(energy((1.25, -3.4, 2.0, -1.5, 0.8, "III")))\n\nparticles = read_particles("27-4.txt")\nprint(len(particles))\nprint(particles[0], energy(particles[0]))'
            }
            label={
              "Запишем формулу функцией и проверим её на этом примере и на первой частице файла"
            }
            language="python"
            output={
              "2.5\n402\n(-12.554, 9.248, 1.957, 1.743, 1.768, 'VII') 6.071221832"
            }
          />
          <Typography.Text>
            У первой частицы файла энергия около 6,07.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fayl-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Сначала посмотри на первые строки файла: заголовок,
                    количество записей, запятая в дробях, лишние столбцы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Строка разбирается так:{" "}
                    <Notation>{'replace(",", ".")'}</Notation>,{" "}
                    <Notation>{"split()"}</Notation>,{" "}
                    <Notation>{"float"}</Notation> для чисел.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Первую строку пропускают, только если это заголовок; иначе
                    потеряется точка.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Характеристику хранят рядом с координатами, а расстояние
                    считают по <Notation>{"[:2]"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Код звезды разбирают по позициям, но сначала проверяют, есть
                    ли в нём буква класса.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Строка частицы — шесть частей: числа{" "}
                    <Notation>{"p[0]"}</Notation> …{" "}
                    <Notation>{"p[4]"}</Notation> и признак{" "}
                    <Notation>{"p[5]"}</Notation>; энергия E = m · (vx² + vy²) /
                    2.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "pravilo-razdeleniya",
      navLabel: "Правило разделения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы разделить точки на кластеры, сначала смотрят на их
              расположение, а потом записывают правило, которое однозначно
              относит каждую точку к одной группе.
            </strong>{" "}
            В 47 задачах из 50 таким правилом служат координатные границы,
            найденные по рисунку; в семи, в том числе в демоверсии 2026 года,
            часть точек — аномалии, которые не входят ни в один кластер; в трёх,
            в том числе в демоверсии 2027 года, группы разделяет не координата,
            а вычисленная величина.
          </Typography.Text>
          <Typography.Text>
            Точки файла <Notation>{"example27.txt"}</Notation> и функция{" "}
            <Notation>{"read_points"}</Notation> из подтемы 2 — наш первый
            пример; функцию считаем определённой выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "diagramma-rasseyaniya",
      navLabel: "Диаграмма рассеяния",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы понять, как разделять точки, полезно сначала увидеть их
              расположение.
            </strong>{" "}
            Такой рисунок называется <strong>диаграммой рассеяния</strong>:
            каждой записи файла соответствует отдельная точка.
          </Typography.Text>
          <Typography.Text>
            В табличном редакторе для этого выбирают два столбца координат и
            строят <strong>точечную диаграмму XY</strong>. Нужна именно
            диаграмма по координатам, а не обычный линейный график, который
            может располагать записи по их порядковым номерам. Для построения
            такого рисунка не нужно соединять точки линиями в порядке их
            появления в файле: порядок строк обычно ничего не говорит о
            соседстве точек.
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
            label={
              "В Python можно использовать matplotlib, если эта библиотека доступна в твоей среде"
            }
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
            Ответы определят способ кластеризации.
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
            <strong>
              Самый простой способ разделения — использовать координатные
              границы.
            </strong>{" "}
            На рисунке все точки одной группы находятся левее{" "}
            <Notation>{"x = 5"}</Notation>, а все точки другой — правее. Тогда:
          </Typography.Text>
          <CodeBlock
            code={
              'points = read_points("example27.txt", has_header=True)\n\nclusters = [[], []]\n\nfor point in points:\n    x, y = point\n\n    if x < 5:\n        clusters[0].append(point)\n    else:\n        clusters[1].append(point)\n\nprint(len(clusters[0]), len(clusters[1]))\nprint(clusters[1])'
            }
            label={"Тогда"}
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
            <strong>
              Если групп три, условия комбинируют цепочкой{" "}
              <Notation>{"if / elif / else"}</Notation>, и порядок проверок
              существенен.
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
            label={
              "Запусти цепочку по шагам на трёх точках и посмотри, какую ветвь проходит каждая"
            }
          />
          <Typography.Text>
            Для <Notation>{"(2, 1)"}</Notation> проверка в строке 4 истинна, и
            до строки 6 дело не доходит. Такой код допустим только тогда, когда
            рисунок и данные действительно соответствуют этим условиям.
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
            label={
              "При независимых проверках точка может удовлетворить сразу двум условиям"
            }
            language="python"
          />
          <Typography.Text>
            Если у точки одновременно <Notation>{"x < 5"}</Notation> и{" "}
            <Notation>{"y < 3"}</Notation>, она попадёт в оба списка. Цепочка{" "}
            <Notation>{"if / elif / else"}</Notation> выполняет только одну
            ветвь. Но и она не исправляет неправильно выбранные границы: она
            лишь предотвращает многократное добавление в рамках этой цепочки.
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
            <strong>
              Точки-аномалии обрабатывают только по правилам конкретной задачи.
            </strong>{" "}
            Аномалия здесь означает запись, которая не относится ни к одному из
            требуемых кластеров. Например, в демоверсии 2026 года сказано, что в
            файле Б есть три лишние точки, которые нужно исключить.
          </Typography.Text>
          <Typography.Text>
            При наличии аномалий{" "}
            <strong>
              последнее <Notation>{"else"}</Notation> может быть опасным
            </strong>
            . Оно отправит в последний кластер вообще всё, что не подошло
            раньше, включая лишние точки.
          </Typography.Text>
          <Typography.Text>
            В таком случае лучше{" "}
            <strong>выделять допустимые области явно</strong>, а остальные точки
            сохранять отдельно —{" "}
            <PythonTerm term="andor">
              <Notation>{"and"}</Notation>
            </PythonTerm>{" "}
            требует, чтобы одновременно выполнялись оба условия. Так устроен наш
            файл <Notation>{"27-2.txt"}</Notation>: три кластера и три аномалии.
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
            code={
              'points = read_points("27-2.txt")\n\nclusters = [[], [], []]\nnoise = []\n\nfor point in points:\n    x, y = point\n\n    if -8 < x < 0 and 2 < y < 10:\n        clusters[0].append(point)\n    elif 1 < x < 10 and 2 < y < 10:\n        clusters[1].append(point)\n    elif -2 < x < 5 and -7 < y < 1:\n        clusters[2].append(point)\n    else:\n        noise.append(point)\n\nfor cluster in clusters:\n    print("Размер:", len(cluster))\n\nprint("Аномалий:", len(noise))\nprint(sum(len(c) for c in clusters) + len(noise), len(points))'
            }
            label={"Так устроен наш файл 27-2.txt: три кластера и три аномалии"}
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
            <strong>
              Разделяющая граница не обязана быть вертикальной или
              горизонтальной.
            </strong>{" "}
            Иногда две группы удобно разделить наклонной прямой y = 2x + 1.
            Точки выше неё удовлетворяют условию y {">"} 2x + 1, а ниже — y{" "}
            {"<"} 2x + 1. В коде:
          </Typography.Text>
          <CodeBlock
            code={
              "if y < 2 * x + 1:\n    clusters[0].append(point)\nelse:\n    clusters[1].append(point)"
            }
            label={"В коде"}
            language="python"
          />
          <Typography.Text>
            Чтобы понять проверку, возьми конкретное <Notation>{"x"}</Notation>.
            Выражение <Notation>{"2*x + 1"}</Notation> вычисляет высоту прямой
            при этом <Notation>{"x"}</Notation>. Затем программа сравнивает с
            ней высоту точки.
          </Typography.Text>
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
              что ширину прямоугольника можно использовать как порог соседства.
            </li>
          </ul>
          <Typography.Text>
            В подборке есть условия, прямо разрешающие поворот квадратов
            относительно осей. Если прямоугольник заведомо расположен
            параллельно осям, для его точек необходимо x_max − x_min ≤ W и y_max
            − y_min ≤ H.
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
        </>
      ),
    },
    {
      id: "razdelyayushchiy-priznak",
      navLabel: "Разделяющий признак",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если форма кластеров необычная, полезно искать признак, который их
              разделяет.
            </strong>{" "}
            Это может быть не сама координата <Notation>{"x"}</Notation> или{" "}
            <Notation>{"y"}</Notation>, а вычисленная по ним величина.
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
            label={"Код на Python: r = dist(point, (x0, y0))"}
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
            label={
              "Для точки, не совпадающей с C, угол направления вычисляется так"
            }
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
            <Notation>{"(y-y0)/(x-x0)"}</Notation>? Потому что оно не различает
            все направления и приводит к делению на ноль на вертикальном луче.
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
            label={
              "Чтобы проверить сектор, начинающийся с угла start и имеющий ширину width, удобно написать"
            }
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
            code={
              'from math import atan2, degrees\n\npoints = read_points("27-5.txt")\nx0, y0 = 2, -1\nstarts = [350, 110, 230]\nclusters = [[], [], []]\n\nfor x, y in points:\n    angle = degrees(atan2(y - y0, x - x0)) % 360\n\n    for k in range(3):\n        if (angle - starts[k]) % 360 <= 20:\n            clusters[k].append((x, y))\n\nprint([len(c) for c in clusters], len(points))'
            }
            label={
              "По рисунку и углам крайних точек начала секторов — 350°, 110° и 230°"
            }
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
      navLabel: "Вычисляемый признак",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Признаком может быть величина, вычисленная по нескольким столбцам
              строки.
            </strong>{" "}
            В демоверсии 2027 года частицы делят на кластеры по кинетической
            энергии: модуль разности энергий любых двух частиц одного кластера
            не больше R = 2. Координаты здесь вообще ни при чём. Посчитаем
            энергию каждой частицы файла <Notation>{"27-4.txt"}</Notation>{" "}
            функцией <Notation>{"energy"}</Notation> из подтемы 2 и посмотрим на
            неё так же, как на точки, — только на одной оси:
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
            code={
              "def energy_groups(particles, bounds):\n    groups = [[] for _ in range(len(bounds) + 1)]\n\n    for p in particles:\n        k = 0\n        while k < len(bounds) and energy(p) > bounds[k]:\n            k += 1\n        groups[k].append(p)\n\n    return groups"
            }
            label={
              "Номер группы частицы — сколько границ её энергия уже превысила"
            }
            language="python"
          />
          <Typography.Text>
            Проверим и условие задачи: в каждой группе наибольшая и наименьшая
            энергии должны отличаться не больше чем на 2.
          </Typography.Text>
          <CodeBlock
            code={
              'particles = read_particles("27-4.txt")\nes = sorted(energy(p) for p in particles)\n\nfor a, b in zip(es, es[1:]):\n    if b - a > 0.5:\n        print(round(a, 3), round(b, 3))\n\ngroups = energy_groups(particles, [3.5, 7, 10.5])\n\nfor g in groups:\n    e = [energy(p) for p in g]\n    print(len(g), round(max(e) - min(e), 3))'
            }
            label={'Код на Python: particles = read_particles("27-4.txt")'}
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
                note: (
                  <>
                    Сначала рисунок по самому файлу, в одинаковом масштабе по
                    осям; потом правило.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Границы записывают цепочкой{" "}
                    <Notation>{"if / elif / else"}</Notation>: каждая точка
                    попадает ровно в одну группу, порядок проверок важен.
                  </>
                ),
              },
              {
                note: (
                  <>
                    При аномалиях кластеры задают явными областями, а всё
                    остальное откладывают в <Notation>{"noise"}</Notation>;
                    проверяют, что аномалий столько, сколько сказано в условии.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Размеры прямоугольников из условия — ограничение, а не
                    способ разделения; повёрнутый прямоугольник шире своей
                    стороны на оси.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Признаком может быть вычисленная величина: расстояние до
                    точки, угол направления, энергия частицы.
                  </>
                ),
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
