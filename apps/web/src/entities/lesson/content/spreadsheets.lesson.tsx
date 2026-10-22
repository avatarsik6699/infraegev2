import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  FormulaBlock,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
  SheetBlock,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { spreadsheetsLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./spreadsheets.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const THEME_TASK = (
  <>
    «В каждой строке таблицы записаны шесть натуральных чисел. Определи
    количество строк, для которых выполнены оба условия: в строке одно число
    повторяется дважды, остальные четыре числа различны; среднее арифметическое
    неповторяющихся чисел строки больше суммы повторяющихся чисел.»
  </>
);

const R = "9-obrabotka-tablicy-chisel";

export const spreadsheetsLesson = defineLesson({
  ...spreadsheetsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Переводить условие строки в точные проверки: «не меньше», «ровно одно», «хотя бы одно»",
    "Считать подходящие строки признаком в таблице и счётчиком в программе",
    "Находить сумму остальных, второе по величине, пары с равными суммами и сравнивать средние без деления",
    "Определять структуру повторов полосой частот, через count и множество",
    "Сравнивать группы повторяющихся и неповторяющихся, чётных и нечётных чисел",
    "Находить номер, сумму номеров или число нужной строки и проверять порядок чисел",
    "Для редких задач — столбец, вся таблица и соседние ячейки (дополнительный урок)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "stroka-i-uslovie",
      title: "Строка и условие",
      lead: "Как перевести условие в точные проверки и посчитать подходящие строки — в таблице и программой.",
      conceptIds: [
        "kak-ustroena-tema",
        "bukvalnyj-perevod",
        "neskolko-uslovij",
        "priznak-i-schetchik",
        "fajl-zadachi",
        "stroka-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Переведи в неравенства и равенства: «a не превышает b», «a больше
              b на 7», «a больше b в 3 раза», «x более чем в 4 раза меньше y».
            </>
          ),
          reveal: <>a ≤ b; a = b + 7; a = 3b; 4x {"<"} y.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Для строки 2, 2, 5, 7, 9, 11 и проверок «сумма больше 34» и
              «наименьшее больше 2» ответь: выполнены ли оба условия, хотя бы
              одно, ровно одно?
            </>
          ),
          reveal: (
            <>
              Сумма 36 больше 34, а наименьшее 2 не больше 2: оба — нет, хотя бы
              одно — да, ровно одно — да.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              В строке 4, 9, 13 есть чётное число? Есть число больше 10? Есть
              чётное число больше 10?
            </>
          ),
          reveal: (
            <>Да (4), да (13), нет: чётное 4 не больше 10, а 13 нечётное.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сколько строк учебной таблицы имеют сумму больше 30, а сколько —
              не меньше 30?
            </>
          ),
          reveal: (
            <>
              4 и 6: суммы второй и пятой строк равны 30 — они подходят только
              под «не меньше».
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Запиши признак строки 1 для условия «сумма больше 30 и наименьшее
              число не больше 2». Сколько строк учебной таблицы подходят?
            </>
          ),
          reveal: (
            <>
              <Notation>
                {"=ЕСЛИ(И(СУММ(A1:F1)>30;МИН(A1:F1)<=2);1;0)"}
              </Notation>
              ; подходят 3 строки — первая, третья и четвёртая. У шестой строки
              сумма 106, но наименьшее 7.
            </>
          ),
        },
      ],
    },
    {
      slug: "summa-krajnie-srednie",
      title: "Сумма, наибольшее и наименьшее",
      lead: "Наибольшие и наименьшие числа строки, сумма остальных, пары и средние — без деления.",
      conceptIds: [
        "dva-naibolshih",
        "summa-ostalnyh",
        "pary",
        "kvadrat-summy",
        "srednie-bez-deleniya",
        "summa-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Найди второе наибольшее число строки 5, 8, 8, 2.</>,
          reveal: (
            <>
              8: в упорядоченной строке 2, 5, 8, 8 повторяющаяся восьмёрка
              занимает два последних места.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: <>Чему равно S − m − M для строки 4, 4, 6, 9, 9?</>,
          reveal: (
            <>
              19: S = 32, убираем одну четвёрку и одну девятку — остаются 4, 6 и
              9.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Можно ли числа 2, 9, 5, 6 разбить на две пары с равными суммами?
            </>
          ),
          reveal: (
            <>
              Да: после упорядочивания 2, 5, 6, 9 сумма крайних 2 + 9 = 11 равна
              сумме средних 5 + 6 = 11.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сравни без деления: среднее трёх чисел с суммой 20 и среднее двух
              чисел с суммой 14.
            </>
          ),
          reveal: (
            <>
              Второе больше: 20 · 2 = 40 {"<"} 14 · 3 = 42. Действительно, 20 /
              3 ≈ 6,7 {"<"} 7.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: <>Могут ли числа 3, 4, 8 быть сторонами треугольника?</>,
          reveal: (
            <>
              Нет: сумма двух меньших 3 + 4 = 7 не больше наибольшего 8 (иначе:
              S = 15 не больше 2M = 16).
            </>
          ),
        },
      ],
    },
    {
      slug: "povtory-v-stroke",
      title: "Повторы в строке",
      lead: "Как узнать, сколько раз встречается каждое число строки, и проверить условие о повторах.",
      conceptIds: [
        "chastota",
        "struktura-povtorov",
        "polosa-chastot",
        "vse-razlichny",
        "povtory-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Запиши полосу частот строки 4, 4, 7, 9, 9, 9 — частоту под каждым
              числом.
            </>
          ),
          reveal: <>2, 2, 1, 3, 3, 3.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>Какая структура повторов у строки 1, 1, 6, 6, 6, 6, 3?</>,
          reveal: <>4 + 2 + 1: четыре шестёрки, две единицы и одна тройка.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              В строке шесть чисел: одно встречается трижды, остальные различны.
              Сколько в полосе частот троек и сколько единиц?
            </>
          ),
          reveal: <>Три тройки и три единицы.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              В строке из семи чисел пять различных значений. Значит ли это, что
              одно число встречается трижды?
            </>
          ),
          reveal: (
            <>
              Нет: два «лишних» появления дают и одна тройка (3 + 1 + 1 + 1 +
              1), и две пары (2 + 2 + 1 + 1 + 1).
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Что напечатает{" "}
              <Notation>{"print(len(set([3, 1, 3, 1, 2])))"}</Notation>?
            </>
          ),
          reveal: <>3: различных значений три — 1, 2 и 3.</>,
        },
      ],
    },
    {
      slug: "povtoryayushchiesya-i-odinochnye",
      title: "Две группы чисел",
      lead: "Повторяющиеся и одиночные числа: их суммы и средние — и ответ задачи темы.",
      conceptIds: [
        "dve-gruppy",
        "summy-grupp",
        "srednie-grupp",
        "chetnye-i-nechetnye",
        "gruppy-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Найди сумму неповторяющихся и сумму повторяющихся чисел строки 6,
              6, 1, 2, 3, 4.
            </>
          ),
          reveal: <>10 и 12: 1 + 2 + 3 + 4 = 10, 6 + 6 = 12.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>Подходит ли строка 6, 6, 1, 2, 3, 4 под задачу темы?</>,
          reveal: (
            <>
              Нет: структура подходит, но среднее неповторяющихся 10 / 4 = 2,5
              не больше 12 (без деления: 10 {"<"} 4 · 12).
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Строка 3, 3, 3, 8, 8, 1. Чему равна сумма повторяющихся чисел с
              учётом всех появлений и без учёта повторений?
            </>
          ),
          reveal: <>25 и 11: 3 + 3 + 3 + 8 + 8 = 25, а 3 + 8 = 11.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Числа строки — в <Notation>{"A1:F1"}</Notation>, их частоты — в{" "}
              <Notation>{"G1:L1"}</Notation>. Запиши формулу суммы
              неповторяющихся чисел.
            </>
          ),
          reveal: (
            <>
              <Notation>{"=СУММЕСЛИ(G1:L1;1;A1:F1)"}</Notation>: выбрать позиции
              с частотой 1 и сложить числа на этих позициях.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Сколько в строке 2, 7, 4, 9, 6 чётных и нечётных чисел и чему
              равны их суммы?
            </>
          ),
          reveal: (
            <>
              Чётных три, сумма 12; нечётных два, сумма 16 — нечётных меньше, а
              их сумма больше.
            </>
          ),
        },
      ],
    },
    {
      slug: "poryadok-i-nomer-stroki",
      title: "Порядок и номер строки",
      lead: "Когда спрашивают номер или сумму подходящей строки — и как проверить порядок чисел в строке.",
      conceptIds: [
        "vopros-zadachi",
        "nomer-stroki",
        "poryadok",
        "poryadok-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Подходят строки с номерами 2, 5 и 9. Назови номер последней, номер
              первой и сумму номеров.
            </>
          ),
          reveal: <>9, 2 и 16.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              На листе первая строка — заголовки. После фильтра подходящая
              строка видна под номером 15. Какой это номер в данных задачи?
            </>
          ),
          reveal: <>14: заголовок сдвигает номера строк данных на единицу.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Числа 3, 5, 5, 8 расположены в неубывающем порядке? По
              возрастанию?
            </>
          ),
          reveal: <>В неубывающем — да, по возрастанию — нет: 5 не больше 5.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Почему для последней подходящей строки достаточно{" "}
              <Notation>{"last = number"}</Notation>, а для первой нужен ещё{" "}
              <Notation>{"break"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Каждая следующая подходящая строка перезаписывает{" "}
              <Notation>{"last"}</Notation>, и после цикла в нём последняя. Без{" "}
              <Notation>{"break"}</Notation> первая подходящая тоже была бы
              перезаписана.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Для чисел −5, −2, 4 найди модуль наименьшего числа и наименьший из
              модулей.
            </>
          ),
          reveal: <>5 и 2: |−5| = 5, а модули 5, 2, 4 дают наименьший 2.</>,
        },
      ],
    },
    {
      slug: "yachejka-stolbec-sosedi",
      title: "Вся таблица и соседние ячейки",
      lead: "Условия на столбец, всю таблицу или соседние ячейки — два прохода и перебор соседей.",
      level: "advanced",
      conceptIds: [
        "oblast-podscheta",
        "yachejka-i-stroka",
        "dva-prohoda",
        "sosedi",
        "sosedi-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Число встречается во всей таблице 30 раз, в своей строке — 2 раза.
              Сколько раз оно встречается в других строках?
            </>
          ),
          reveal: <>28: вычитают все появления в своей строке, а не одно.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Число 5 встречается в первой строке трижды, во второй — один раз,
              в остальных его нет. Сколько у него появлений и в скольких строках
              оно есть?
            </>
          ),
          reveal: <>4 появления в 2 строках.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Почему сумма всех отметок «хороших» ячеек не отвечает на вопрос
              «сколько строк содержат хорошую ячейку»?
            </>
          ),
          reveal: (
            <>
              В строке может быть несколько хороших ячеек — сумма считает
              ячейки. Сначала строке ставят отметку 1, если в ней есть хотя бы
              одна хорошая ячейка, и суммируют отметки строк.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сколько соседей с общей стороной или углом у ячейки на краю
              таблицы, если она не в углу?
            </>
          ),
          reveal: <>5.</>,
        },
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 9 дан файл с таблицей чисел. Нужно проверить каждую строку
            по условию и посчитать, сколько строк подошло, — или найти номер
            нужной строки. Вот задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Каждую строку проверяют отдельно: в электронной таблице —
              вспомогательными столбцами, в Python — циклом по строкам файла.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "одно число повторяется дважды, остальные четыре различны",
                "в строке ровно одна пара одинаковых чисел",
              ],
              [
                "среднее неповторяющихся больше суммы повторяющихся",
                "сравнить среднее четырёх чисел с суммой пары",
              ],
              [
                "выполнены оба условия",
                "подходят строки, где верно и то и другое",
              ],
              ["определи количество строк", "ответ — сколько строк подошло"],
            ]}
          />
          <Typography.Text>
            В экзаменационном файле тысячи строк. Учиться удобнее на маленькой
            таблице — шесть строк по шесть чисел: каждую проверку можно
            повторить вручную.
          </Typography.Text>
          <LessonTable
            label={"Учебная таблица"}
            columns={[
              { label: "Строка", numeric: true },
              { label: "A", numeric: true },
              { label: "B", numeric: true },
              { label: "C", numeric: true },
              { label: "D", numeric: true },
              { label: "E", numeric: true },
              { label: "F", numeric: true },
            ]}
            rows={[
              ["1", "2", "2", "5", "7", "9", "11"],
              ["2", "5", "5", "1", "3", "7", "9"],
              ["3", "2", "2", "5", "5", "9", "11"],
              ["4", "2", "2", "2", "7", "9", "11"],
              ["5", "3", "3", "4", "5", "7", "8"],
              ["6", "7", "7", "20", "22", "24", "26"],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем — у каждой своя страница. Идём по ним
            по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Строка и условие</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="summa-krajnie-srednie">
                Сумма, наибольшее и наименьшее
              </SubtopicLink>{" "}
              — наибольшие числа, сумма остальных и средние.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="povtory-v-stroke">
                Повторы в строке
              </SubtopicLink>{" "}
              — сколько раз встречается каждое число.
            </li>
            <li>
              <SubtopicLink
                routeSlug={R}
                subtopic="povtoryayushchiesya-i-odinochnye"
              >
                Две группы чисел
              </SubtopicLink>{" "}
              — повторяющиеся и одиночные числа — и ответ задачи темы: 2.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="poryadok-i-nomer-stroki">
                Порядок и номер строки
              </SubtopicLink>{" "}
              — когда спрашивают не количество, а номер.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="yachejka-stolbec-sosedi">
                Вся таблица и соседние ячейки
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
          <Typography.Text>
            Задачу можно решить и в электронной таблице, и программой — выбирай
            вкладку «Таблица» или «Python». На экзамене подойдёт любой способ, а
            второй пригодится для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bukvalnyj-perevod",
      navLabel: "Условие — буквально",
      explanation: (
        <>
          <Typography.Text>
            Пятая строка — 3, 3, 4, 5, 7, 8. Среднее неповторяющихся чисел (4 +
            5 + 7 + 8) / 4 = 6, сумма повторяющихся 3 + 3 = 6. Подходит ли она
            под задачу темы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Условие переводят в сравнения дословно: «больше» — знак {">"}, «не
              меньше» — знак ≥.
            </strong>{" "}
            Среднее 6 не больше 6, поэтому пятая строка не подходит. Если бы в
            условии было «не меньше», она бы подошла, и ответ стал бы 3.
            Равенство — первый случай, на котором проверяют решение. Выбери
            формулировку, чтобы увидеть запись:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка и математическая запись"}
            variants={[
              { label: "a больше b", value: <>a {">"} b</> },
              {
                label: "a не меньше b",
                value: <>a ≥ b</>,
                note: <>равенство подходит</>,
              },
              {
                label: "a не больше b",
                value: <>a ≤ b</>,
                note: <>равенство подходит</>,
              },
              {
                label: "a не превышает b",
                value: <>a ≤ b</>,
                note: <>то же, что «не больше»</>,
              },
              { label: "ровно три числа", value: <>количество = 3</> },
              { label: "не менее трёх", value: <>количество ≥ 3</> },
              { label: "хотя бы одно", value: <>количество ≥ 1</> },
              { label: "ни одного", value: <>количество = 0</> },
            ]}
          />
          <Typography.Text>
            Различай «на» и «в»: «a больше b на 5» — a = b + 5, «a больше b в 5
            раз» — a = 5b, «a больше b более чем в три раза» — a {">"} 3b.
            Например, «наименьшее число более чем в шесть раз меньше суммы
            остальных» — это 6 · m {"<"} S − m, где m — наименьшее, S — сумма
            строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-uslovij",
      navLabel: "Несколько условий",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Проверки строки соединяют так, как сказано в условии: «оба» — и,
              «хотя бы одно» — или, «ровно одно» — одно из двух, но не оба.
            </strong>{" "}
            Результат отдельной проверки — да или нет: в таблице{" "}
            <Notation>{"ИСТИНА"}</Notation> и <Notation>{"ЛОЖЬ"}</Notation>, в
            Python <Notation>{"True"}</Notation> и{" "}
            <Notation>{"False"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Пусть P — «сумма больше 35», Q — «наибольшее меньше 10». У первой
            строки сумма 36, а наибольшее 11: P верна, Q нет. Под «оба условия»
            строка не подходит, под «хотя бы одно» и «ровно одно» — подходит.
          </Typography.Text>
          <LessonTable
            label={"Две проверки и три способа их соединить"}
            columns={[
              { label: "P" },
              { label: "Q" },
              { label: "Оба" },
              { label: "Хотя бы одно" },
              { label: "Ровно одно" },
            ]}
            rows={[
              ["нет", "нет", "нет", "нет", "нет"],
              ["нет", "да", "нет", "да", "да"],
              ["да", "нет", "нет", "да", "да"],
              ["да", "да", "да", "да", "нет"],
            ]}
          />
          <Typography.Text>
            Главное различие — в последней строке таблицы: «хотя бы одно»
            допускает оба, «ровно одно» — нет.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: одно число или разные"
          >
            <Typography.Text>
              В строке 3, 8, 11 есть чётное число — 8 и есть число больше 10 —
              11. Поэтому «есть чётное число и есть число больше 10» верно. А
              «есть чётное число, которое больше 10», неверно: здесь оба условия
              должно выполнять одно и то же число.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "priznak-i-schetchik",
      navLabel: "Признак и счётчик",
      explanation: (
        <>
          <Typography.Text>
            Сколько строк учебной таблицы имеют сумму больше 30?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждую строку проверяют отдельно и учитывают один раз: в таблице —
              признаком 1 или 0, в программе — счётчиком.
            </strong>{" "}
            Ответ — сколько строк прошли проверку.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      Числа строки 1 занимают{" "}
                      <PythonTerm term="xl-address">диапазон</PythonTerm>{" "}
                      <Notation>{"A1:F1"}</Notation>. Справа от них ставят
                      вспомогательные столбцы:{" "}
                      <PythonTerm term="xl-range-functions">функция</PythonTerm>{" "}
                      <Notation>{"СУММ"}</Notation> даёт сумму, а{" "}
                      <PythonTerm term="xl-if">признак</PythonTerm>{" "}
                      <Notation>{"ЕСЛИ"}</Notation> превращает проверку в 1 или
                      0:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        { cell: "G1", formula: "=СУММ(A1:F1)" },
                        { cell: "H1", formula: "=ЕСЛИ(G1>30;1;0)" },
                      ]}
                      label="Формула"
                    />
                    <Typography.Text>
                      Обе формулы{" "}
                      <PythonTerm term="xl-fill">протягивают вниз</PythonTerm>{" "}
                      до последней строки данных: каждая строка проверяет свои
                      числа. Ответ — сумма признаков в{" "}
                      <Notation>{"H7"}</Notation>:
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheet1}
                      label={"Лист «Признак»"}
                    />
                    <Typography.Text>
                      Подходят строки 1, 3, 4 и 6. Вторая и пятая дают ровно 30
                      и получают 0. Поменяй любое число второй строки — её
                      признак пересчитается.
                    </Typography.Text>
                    <Typography.Text>
                      Несколько проверок соединяют функциями{" "}
                      <Notation>{"И"}</Notation> и <Notation>{"ИЛИ"}</Notation>,
                      «ровно одно» — сравнением двух проверок знаком{" "}
                      <Notation>{"<>"}</Notation> («не равно»):
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        {
                          formula:
                            "=ЕСЛИ(И(СУММ(A1:F1)>35;МАКС(A1:F1)<10);1;0)",
                        },
                        {
                          formula:
                            "=ЕСЛИ(ИЛИ(СУММ(A1:F1)>35;МАКС(A1:F1)<10);1;0)",
                        },
                        {
                          formula:
                            "=ЕСЛИ((СУММ(A1:F1)>35)<>(МАКС(A1:F1)<10);1;0)",
                        },
                      ]}
                      label="Формула"
                    />
                    <Typography.Text>
                      При протягивании вниз{" "}
                      <Notation>{"=СУММ(A1:F1)"}</Notation> становится{" "}
                      <Notation>{"=СУММ(A2:F2)"}</Notation> — так работают{" "}
                      <PythonTerm term="xl-ref">
                        относительные ссылки
                      </PythonTerm>
                      . Вместо суммы признаков можно включить фильтр по столбцу
                      признака — он покажет только подходящие строки (подтема
                      5).
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Строки таблицы можно записать{" "}
                      <PythonTerm term="list">списком</PythonTerm> строк, где
                      каждая строка — тоже список. Цикл{" "}
                      <PythonTerm term="for">
                        <Notation>{"for"}</Notation>
                      </PythonTerm>{" "}
                      берёт строки по очереди,{" "}
                      <PythonTerm term="if">
                        <Notation>{"if"}</Notation>
                      </PythonTerm>{" "}
                      проверяет сумму, а{" "}
                      <PythonTerm term="augassign">счётчик</PythonTerm>{" "}
                      <Notation>{"answer += 1"}</Notation> учитывает подходящую
                      строку. Нажми «Запуск» и пройди программу по шагам:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runCount}
                      label={"Пройди программу по шагам"}
                    />
                    <Typography.Text>
                      С файлом меняется только начало: программа{" "}
                      <PythonTerm term="file">читает файл</PythonTerm> по
                      строкам,{" "}
                      <PythonTerm term="split">
                        <Notation>{"split"}</Notation>
                      </PythonTerm>{" "}
                      делит строку на части, а{" "}
                      <PythonTerm term="comp">включение</PythonTerm> с{" "}
                      <PythonTerm term="str">
                        <Notation>{"int"}</Notation>
                      </PythonTerm>{" "}
                      переводит их в числа:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        'answer = 0\nwith open("9.txt") as f:\n    for line in f:\n        a = [int(part) for part in line.split()]\n        if sum(a) > 30:\n            answer += 1\nprint(answer)'
                      }
                      label={"Счётчик строк файла"}
                      language="python"
                      output={"4"}
                    />
                    <Typography.Text>
                      <Notation>{"answer = 0"}</Notation> стоит до цикла, чтобы
                      ответ не обнулялся; список <Notation>{"a"}</Notation>{" "}
                      строится заново для каждой строки;{" "}
                      <Notation>{"print(answer)"}</Notation> — после цикла.
                    </Typography.Text>
                    <Typography.Text>
                      <PythonTerm term="agg">
                        <Notation>{"sum"}</Notation>,{" "}
                        <Notation>{"min"}</Notation> и{" "}
                        <Notation>{"max"}</Notation>
                      </PythonTerm>{" "}
                      дают сумму, наименьшее и наибольшее число строки. Проверки
                      соединяют{" "}
                      <PythonTerm term="andor">
                        <Notation>{"and"}</Notation> и{" "}
                        <Notation>{"or"}</Notation>
                      </PythonTerm>
                      , «ровно одно» — сравнением <Notation>{"!="}</Notation>:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "a = [2, 2, 5, 7, 9, 11]\np = sum(a) > 35\nq = max(a) < 10\nprint(p, q)\nprint(p and q, p or q, p != q)"
                      }
                      label={"Проверки P и Q для первой строки"}
                      language="python"
                      output={"True False\nFalse True True"}
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "fajl-zadachi",
      navLabel: "Файл задачи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Файл задачи открывают в электронной таблице как есть, а для
              программы сохраняют текстом.
            </strong>{" "}
            На экзамене дают таблицу — <Notation>{".xlsx"}</Notation>,{" "}
            <Notation>{".ods"}</Notation> или <Notation>{".csv"}</Notation>.
            Файл <Notation>{".xlsx"}</Notation> или{" "}
            <Notation>{".ods"}</Notation> нельзя прочитать программой как текст:
            внутри хранятся листы и ячейки в сжатом виде.
          </Typography.Text>
          <ol>
            <li>Открой файл в электронной таблице.</li>
            <li>
              Сохрани его как текст — «Текст (разделитель — табуляция)» или{" "}
              <PythonTerm term="xl-csv">CSV</PythonTerm> — в папку с программой.
            </li>
            <li>
              Открой получившийся файл в блокноте и посмотри, чем разделены
              числа.
            </li>
          </ol>
          <Typography.Text>
            От разделителя зависит запись <Notation>{"split"}</Notation>.
            Выбери, как выглядит строка файла:
          </Typography.Text>
          <VariantPicker
            label={"Строка файла и как её делить"}
            variants={[
              {
                label: "2 2 5 7 9 11",
                value: <Notation>{"line.split()"}</Notation>,
              },
              {
                label: "числа разделены табуляциями",
                value: <Notation>{"line.split()"}</Notation>,
              },
              {
                label: "2;2;5;7;9;11",
                value: <Notation>{'line.split(";")'}</Notation>,
              },
              {
                label: "2,2,5,7,9,11",
                value: <Notation>{'line.split(",")'}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            Без аргумента <Notation>{"split()"}</Notation> делит строку по любым
            пробелам и табуляциям. Для задач ниже даны оба файла: таблица{" "}
            <Notation>{".xlsx"}</Notation> и та же таблица текстом{" "}
            <Notation>{".txt"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: что не должно попасть в файл"
          >
            <Typography.Text>
              В текстовый файл должны попасть только исходные числа: без строки
              заголовков, вспомогательных столбцов с формулами и пустых строк.
              Иначе <Notation>{"int"}</Notation> встретит текст и программа
              остановится с ошибкой.
            </Typography.Text>
            <Typography.Text>
              В чужих решениях строку переводят в числа записью{" "}
              <PythonTerm term="mapint">
                <Notation>{"list(map(int, line.split()))"}</Notation>
              </PythonTerm>{" "}
              — она делает то же, что включение{" "}
              <Notation>{"[int(part) for part in line.split()]"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "stroka-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Условие",
                note: (
                  <>
                    дословно: «больше» — {">"}, «не меньше» — ≥; проверь
                    равенство
                  </>
                ),
              },
              {
                key: "Оба, хотя бы, ровно",
                note: (
                  <>
                    <Notation>{"И"}</Notation>, <Notation>{"ИЛИ"}</Notation>,{" "}
                    <Notation>{"<>"}</Notation>; <Notation>{"and"}</Notation>,{" "}
                    <Notation>{"or"}</Notation>, <Notation>{"!="}</Notation>
                  </>
                ),
              },
              {
                key: "Признак",
                note: (
                  <>
                    <Notation>{"=ЕСЛИ(…;1;0)"}</Notation>, протянуть, сложить
                  </>
                ),
              },
              {
                key: "Счётчик",
                note: (
                  <>
                    <Notation>{"answer = 0"}</Notation> до цикла,{" "}
                    <Notation>{"+= 1"}</Notation> после проверки строки
                  </>
                ),
              },
              {
                key: "Файл",
                note: <>сохранить текстом, делить по разделителю</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dva-naibolshih",
      navLabel: "Два наибольших",
      explanation: (
        <>
          <Typography.Text>
            В каких строках учебной таблицы сумма двух наибольших чисел не
            больше суммы остальных?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Числа по величине берут из упорядоченной копии строки: последнее —
              наибольшее, предпоследнее — второе по величине.
            </strong>{" "}
            Повторы при этом сохраняются: у строки 9, 3, 9, 5 упорядоченная
            копия 3, 5, 9, 9, и второе по величине — тоже 9, а не 5.
          </Typography.Text>
          <Typography.Text>
            В пятой строке 3, 3, 4, 5, 7, 8 два наибольших — 8 и 7, их сумма 15,
            а сумма остальных 3 + 3 + 4 + 5 = 15: «не больше» выполнено. В
            шестой 26 + 24 = 50 и 7 + 7 + 20 + 22 = 56 — тоже подходит. В
            остальных строках два наибольших больше: в первой 11 + 9 = 20 {">"}{" "}
            16. Ответ — 2 строки.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      <Notation>{"=НАИБОЛЬШИЙ(A1:F1;k)"}</Notation> даёт k-е по
                      величине число строки, считая с наибольшего,{" "}
                      <Notation>{"=НАИМЕНЬШИЙ(A1:F1;k)"}</Notation> — с
                      наименьшего. Строку при этом не сортируют:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        {
                          cell: "G1",
                          formula: "=НАИБОЛЬШИЙ(A1:F1;1)+НАИБОЛЬШИЙ(A1:F1;2)",
                        },
                        {
                          cell: "H1",
                          formula: "=ЕСЛИ(G1<=СУММ(A1:F1)-G1;1;0)",
                        },
                      ]}
                      label="Формула"
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      <PythonTerm term="sorted">
                        <Notation>{"sorted(a)"}</Notation>
                      </PythonTerm>{" "}
                      возвращает новый список по возрастанию, исходный{" "}
                      <Notation>{"a"}</Notation> не меняется.{" "}
                      <PythonTerm term="listindex">Индекс</PythonTerm>{" "}
                      <Notation>{"-1"}</Notation> — последний элемент,{" "}
                      <Notation>{"-2"}</Notation> — предпоследний:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "a = [3, 3, 4, 5, 7, 8]\nb = sorted(a)\nprint(b)\nprint(b[-1] + b[-2], sum(a) - b[-1] - b[-2])"
                      }
                      label={"Два наибольших пятой строки"}
                      language="python"
                      output={"[3, 3, 4, 5, 7, 8]\n15 15"}
                    />
                    <CodeBlock
                      code={
                        "a = [9, 3, 9, 5]\nb = sorted(a)\nprint(a, b)\nprint(b[-1], b[-2], b[0], b[1])"
                      }
                      label={"Второе по величине с повторами"}
                      language="python"
                      output={"[9, 3, 9, 5] [3, 5, 9, 9]\n9 9 3 5"}
                    />
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: когда сортировать нельзя"
          >
            <Typography.Text>
              Сортировка теряет исходный порядок. Если условие говорит о первом
              или последнем числе, о первых четырёх столбцах или о возрастании
              слева направо, нужна исходная строка — поэтому сортируют копию.
              Запись <Notation>{"a.sort()"}</Notation>, в отличие от{" "}
              <Notation>{"sorted(a)"}</Notation>, меняет сам список.
            </Typography.Text>
            <Typography.Text>
              В электронной таблице нельзя сортировать отдельные столбцы
              независимо: числа разных строк перемешаются, и проверяться будут
              уже другие строки.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "summa-ostalnyh",
      navLabel: "Сумма остальных",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сумму остальных получают вычитанием: без наибольшего — S − M, без
              наименьшего и наибольшего — S − m − M.
            </strong>{" "}
            Здесь S — сумма строки, m — наименьшее, M — наибольшее число.
            Условие «наибольшее число меньше суммы остальных» — это M {"<"} S −
            M.
          </Typography.Text>
          <Typography.Text>
            При повторах вычитание убирает <strong>одно</strong> наименьшее и{" "}
            <strong>одно</strong> наибольшее число. Для строки 2, 2, 5, 9, 9: S
            = 27, S − m − M = 27 − 2 − 9 = 16 — это 2 + 5 + 9. Убрать все двойки
            и девятки — другая операция, останется только 5.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tbMinus_23f64f}
            caption={
              <>
                S − m − M вычёркивает одну ячейку с наименьшим числом и одну с
                наибольшим: от 2, 2, 5, 9, 9 остаются 2, 5, 9 с суммой 16, от
                пяти четвёрок — три четвёрки с суммой 12. Вычеркнуть все двойки
                и девятки — другая операция: остаётся только 5.
              </>
            }
          />
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <FormulaBlock
                    lines={[
                      { formula: "=МАКС(A1:E1)<СУММ(A1:E1)-МАКС(A1:E1)" },
                      { formula: "=СУММ(A1:E1)-МИН(A1:E1)-МАКС(A1:E1)" },
                    ]}
                    label="Формула"
                  />
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "a = [2, 2, 5, 9, 9]\nprint(sum(a) - max(a), sum(a) - min(a) - max(a))\nprint(max(a) < sum(a) - max(a))"
                    }
                    label={"Сумма остальных"}
                    language="python"
                    output={"18 16\nTrue"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: три числа как стороны треугольника"
          >
            <Typography.Text>
              Три положительных числа — стороны треугольника, если сумма двух
              меньших больше наибольшего: после упорядочивания a ≤ b ≤ c это a +
              b {">"} c. Без сортировки то же самое — сумма остальных больше
              наибольшего: S − M {">"} M, то есть S {">"} 2M. Остальные
              неравенства треугольника выполняются сами: короткая сторона всегда
              меньше суммы двух других.
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.tbTriangle_196a7d}
              caption={
                <>
                  Две меньшие стороны, отложенные вдоль наибольшей: 4 + 6 ровно
                  достают до 10 — треугольник вырожден; 4 + 5 = 9 больше 7 —
                  треугольник есть.
                </>
              }
            />
            <Typography.Text>
              Вид треугольника решает знак разности a² + b² − c² для
              упорядоченных сторон: больше нуля — остроугольный, ноль —
              прямоугольный, меньше нуля — тупоугольный. Для тупоугольного
              сначала проверяют, что треугольник существует: у чисел 1, 2, 10
              разность тоже отрицательна.
            </Typography.Text>
            <CodeBlock
              code={
                "for a in [[4, 6, 10], [7, 4, 5], [5, 3, 4]]:\n    b = sorted(a)\n    d = b[0] ** 2 + b[1] ** 2 - b[2] ** 2\n    print(b, sum(a) > 2 * max(a), d)"
              }
              label={"Существование и вид треугольника"}
              language="python"
              output={
                "[4, 6, 10] False -48\n[4, 5, 7] True -8\n[3, 4, 5] True 0"
              }
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "pary",
      navLabel: "Пары с равными суммами",
      explanation: (
        <>
          <Typography.Text>
            Можно ли числа 7, 3, 8, 4 разбить на две пары с равными суммами?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Четыре числа разбиваются на две пары с равными суммами, только
              если после упорядочивания сумма крайних равна сумме средних.
            </strong>{" "}
            Упорядочим: 3, 4, 7, 8. Крайние 3 + 8 = 11, средние 4 + 7 = 11 —
            можно.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tbPairs_bd52fa}
            caption={
              <>
                Все три разбиения чисел 3 ≤ 4 ≤ 7 ≤ 8. В первых двух пара с
                меньшими числами проигрывает: 7 {"<"} 15 и 10 {"<"} 12.
                Сравняться могут только крайние и средние: 3 + 8 = 4 + 7 = 11.
              </>
            }
          />
          <Typography.Text>
            Упорядоченная строка помогает и с арифметической прогрессией —
            числами с равными разностями соседей, как 2, 5, 8, 11. Если в
            условии сказано «после упорядочивания образуют прогрессию»,
            сравнивают разности соседей упорядоченной копии.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      Упорядоченные числа ставят во вспомогательные столбцы
                      функцией <Notation>{"НАИМЕНЬШИЙ"}</Notation> с k = 1, 2,
                      3, 4. Столбец <Notation>{"I"}</Notation> проверяет
                      прогрессию, <Notation>{"J"}</Notation> — пары:
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheet4}
                      label={"Лист «Упорядоченные»"}
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "for a in [[7, 3, 8, 4], [1, 2, 3, 8]]:\n    b = sorted(a)\n    print(b, b[0] + b[3] == b[1] + b[2])"
                    }
                    label={"Пары с равными суммами"}
                    language="python"
                    output={"[3, 4, 7, 8] True\n[1, 2, 3, 8] False"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure summary="Почему достаточно сравнить крайние и средние">
            <Typography.Text>
              Разбить четыре числа a ≤ b ≤ c ≤ d на две пары можно тремя
              способами: a, b и c, d; a, c и b, d; a, d и b, c. Если a + b = c +
              d, то меньшие числа сравнялись с большими — это возможно, только
              когда все четыре равны, и тогда a + d = b + c тоже верно. Если a +
              c = b + d, то (b − a) + (d − c) = 0, оба слагаемых неотрицательны,
              значит a = b и c = d, и снова a + d = b + c.
            </Typography.Text>
            <Typography.Text>
              Чётности суммы недостаточно: у 1, 2, 3, 8 сумма 14 чётная, но пар
              с суммой 7 нет.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "kvadrat-summy",
      navLabel: "Квадрат суммы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Квадрат суммы и сумма квадратов — разные числа: сначала сложить и
              возвести в квадрат или возвести каждое и сложить.
            </strong>{" "}
            (3 + 5)² = 64, а 3² + 5² = 34.
          </Typography.Text>
          <Typography.Text>
            Условие «квадрат суммы наименьшего и наибольшего больше суммы
            квадратов остальных» — это (m + M)² {">"} Q − m² − M², где Q — сумма
            квадратов всей строки.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      Сумму квадратов даёт <Notation>{"СУММКВ"}</Notation>,
                      степень — знак <Notation>{"^"}</Notation>:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        {
                          formula:
                            "=(МИН(A1:F1)+МАКС(A1:F1))^2>СУММКВ(A1:F1)-МИН(A1:F1)^2-МАКС(A1:F1)^2",
                        },
                      ]}
                      label="Формула"
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Степень в Python —{" "}
                      <PythonTerm term="intdiv">
                        <Notation>{"**"}</Notation>
                      </PythonTerm>
                      ; знак <Notation>{"^"}</Notation> здесь означает другую
                      операцию:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "a = [2, 5, 7, 10]\nq = sum([x ** 2 for x in a])\nprint(sum(a) ** 2, q, q - min(a) ** 2 - max(a) ** 2)"
                      }
                      label={"Квадрат суммы и сумма квадратов"}
                      language="python"
                      output={"576 178 74"}
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "srednie-bez-deleniya",
      navLabel: "Средние без деления",
      explanation: (
        <>
          <Typography.Text>
            Вторая проверка задачи темы: среднее неповторяющихся больше суммы
            повторяющихся. Как записать её без деления?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Среднее сравнивают без деления: обе части неравенства умножают на
              количество чисел.
            </strong>{" "}
            Неповторяющихся чисел в подходящей строке ровно четыре. Если их
            сумма O, а сумма пары P, то O / 4 {">"} P — то же, что O {">"} 4P.
            Для пятой строки 24 {">"} 4 · 6 = 24 неверно — тот же ответ, что и с
            делением, но без дробей.
          </Typography.Text>
          <Typography.Text>
            Два средних сравнивают так же: S₁ / k₁ {">"} S₂ / k₂ — то же, что S₁
            · k₂ {">"} S₂ · k₁. Например, среднее двух чисел с суммой 18 и
            среднее трёх чисел с суммой 24: 18 · 3 = 54 {">"} 24 · 2 = 48,
            первое больше. Просто сравнивать суммы можно, только если чисел в
            группах поровну. И обе группы должны быть непустыми: у пустой группы
            среднего нет.
          </Typography.Text>
          <CodeBlock
            code={
              "single = [4, 5, 7, 8]\npair = [3, 3]\nprint(sum(single) / len(single), sum(pair))\nprint(sum(single) > len(single) * sum(pair))"
            }
            label={"Среднее без деления для пятой строки"}
            language="python"
            output={"6.0 6\nFalse"}
          />
          <Typography.Text>
            В таблице то же сравнение — <Notation>{"=M1>4*N1"}</Notation>, если
            в <Notation>{"M1"}</Notation> сумма неповторяющихся, а в{" "}
            <Notation>{"N1"}</Notation> — сумма пары (подтема 4). Скрытое
            среднее переводят так же: «наибольшее больше среднего пяти остальных
            более чем в три раза» — M {">"} 3 · (S − M) / 5, то есть 5M {">"}{" "}
            3(S − M).
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: целая часть среднего и квадраты чисел"
          >
            <Typography.Text>
              Целая часть среднего натуральных чисел —{" "}
              <PythonTerm term="intdiv">целочисленное деление</PythonTerm>{" "}
              <Notation>{"sum(a) // len(a)"}</Notation>, в таблице —{" "}
              <Notation>{"ЦЕЛОЕ(СРЗНАЧ(A1:G1))"}</Notation>. Есть ли такое число
              в строке, проверяет{" "}
              <PythonTerm term="in">
                <Notation>{"in"}</Notation>
              </PythonTerm>
              .
            </Typography.Text>
            <Typography.Text>
              Число x — квадрат натурального числа, если{" "}
              <Notation>{"isqrt(x) ** 2 == x"}</Notation>:{" "}
              <Notation>{"isqrt"}</Notation> из модуля{" "}
              <PythonTerm term="import">
                <Notation>{"math"}</Notation>
              </PythonTerm>{" "}
              даёт целую часть квадратного корня — у 81 и у 82 это 9, но 9² =
              81.
            </Typography.Text>
            <CodeBlock
              code={
                "from math import isqrt\na = [2, 8, 4, 9, 11, 13, 12]\nprint(sum(a) // len(a), sum(a) // len(a) in a)\nprint([x for x in a if isqrt(x) ** 2 == x])"
              }
              label={"Целая часть среднего и квадраты"}
              language="python"
              output={"8 True\n[4, 9]"}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "summa-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "По величине",
                note: (
                  <>
                    <Notation>{"sorted(a)[-2]"}</Notation>,{" "}
                    <Notation>{"НАИБОЛЬШИЙ(…;2)"}</Notation> — с повторами
                  </>
                ),
              },
              {
                key: "Сумма остальных",
                note: <>S − M, S − m − M — по одному экземпляру</>,
              },
              {
                key: "Пары",
                note: <>после упорядочивания a + d = b + c</>,
              },
              {
                key: "Квадраты",
                note: <>(a + b)² ≠ a² + b²</>,
              },
              {
                key: "Средние",
                note: <>S₁ · k₂ {">"} S₂ · k₁, группы непустые</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "chastota",
      navLabel: "Частота",
      explanation: (
        <>
          <Typography.Text>
            Первая проверка задачи темы: в каких строках учебной таблицы одно
            число повторяется дважды, а остальные четыре различны?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Повторы описывают частотой — сколько раз значение встречается в
              строке.
            </strong>{" "}
            В строке 2, 2, 5, 5, 5, 9 значение 2 встречается два раза, 5 — три
            раза, 9 — один раз. «Число встречается дважды» означает два
            появления всего, включая первое.
          </Typography.Text>
          <Typography.Text>
            <strong>Неповторяющиеся</strong> числа — с частотой 1: здесь только
            9. <strong>Повторяющиеся</strong> — с частотой больше 1: 2, 2, 5, 5,
            5. А <strong>различные значения</strong> — каждое по одному разу: 2,
            5 и 9. «Различные» и «неповторяющиеся» — не одно и то же.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "struktura-povtorov",
      navLabel: "Структура повторов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие о повторах задаёт размеры групп одинаковых чисел — их
              сумма всегда равна длине строки.
            </strong>{" "}
            В строке 4, 4, 4, 7, 7, 2, 9 три четвёрки, две семёрки, одна двойка
            и одна девятка: структура 3 + 2 + 1 + 1 = 7. Сами значения для
            структуры не важны:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tbGroups_c3c798}
            caption={
              <>
                Одинаковые значения соединены скобкой, под каждой ячейкой —
                сколько раз встречается её значение. У обеих строк группы
                размеров 3, 2, 1, 1: структура 3 + 2 + 1 + 1, хотя числа разные.
              </>
            }
          />
          <Typography.Text>
            Задача темы требует структуру 2 + 1 + 1 + 1 + 1: одна пара и четыре
            одиночных числа. Выбери требование, чтобы увидеть его структуру:
          </Typography.Text>
          <VariantPicker
            label={"Требование и размеры групп одинаковых значений"}
            variants={[
              {
                label: "все шесть чисел различны",
                value: <>1 + 1 + 1 + 1 + 1 + 1</>,
              },
              {
                label: "в шести числах одна пара, остальные различны",
                value: <>2 + 1 + 1 + 1 + 1</>,
              },
              {
                label: "в шести числах две пары, остальные различны",
                value: <>2 + 2 + 1 + 1</>,
              },
              {
                label: "в шести числах одна тройка, остальные различны",
                value: <>3 + 1 + 1 + 1</>,
              },
              {
                label: "в семи числах одна тройка и одна пара",
                value: <>3 + 2 + 1 + 1</>,
              },
              {
                label: "в семи числах одна четвёрка, остальные различны",
                value: <>4 + 1 + 1 + 1</>,
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: числа различных значений мало"
          >
            <Typography.Text>
              Проверка «в строке пять различных значений» не отличает одну
              тройку от двух пар:
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.tbGroups_839ca1}
              caption={
                <>
                  В обеих строках семь элементов и пять различных значений, но у
                  первой одна тройка — 3 + 1 + 1 + 1 + 1, а у второй две пары —
                  2 + 2 + 1 + 1 + 1.
                </>
              }
            />
            <Typography.Text>
              Число различных значений решает только два случая: если их столько
              же, сколько чисел, повторов нет; если на одно меньше — ровно одна
              пара.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "polosa-chastot",
      navLabel: "Полоса частот",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Под каждым числом строки ставят его частоту — получается полоса
              частот. Структуру проверяют, считая в полосе нужные частоты.
            </strong>{" "}
            У строки 2, 2, 5, 5, 5, 9 полоса 2, 2, 3, 3, 3, 1. Значение с
            частотой k занимает k ячеек, поэтому одна пара — это две двойки в
            полосе, а «одна пара и четыре одиночных» — две двойки и четыре
            единицы.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      <PythonTerm term="xl-countif">
                        <Notation>{"СЧЁТЕСЛИ"}</Notation>
                      </PythonTerm>{" "}
                      считает ячейки диапазона, равные значению:{" "}
                      <Notation>{"=СЧЁТЕСЛИ($A1:$F1;A1)"}</Notation> — сколько
                      раз в строке встречается число из{" "}
                      <Notation>{"A1"}</Notation>. Формулу копируют вправо до{" "}
                      <Notation>{"L1"}</Notation> и вниз: знак{" "}
                      <Notation>{"$"}</Notation> закрепляет исходные столбцы
                      A–F, а <Notation>{"A1"}</Notation> становится{" "}
                      <Notation>{"B1"}</Notation>, <Notation>{"C1"}</Notation> и
                      так далее. Так получается{" "}
                      <PythonTerm term="xl-frequency">полоса частот</PythonTerm>{" "}
                      в <Notation>{"G:L"}</Notation>:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        { cell: "G1", formula: "=СЧЁТЕСЛИ($A1:$F1;A1)" },
                        {
                          cell: "M1",
                          formula:
                            "=И(СЧЁТЕСЛИ(G1:L1;2)=2;СЧЁТЕСЛИ(G1:L1;1)=4)",
                        },
                      ]}
                      label="Формула"
                    />
                    <SheetBlock
                      {...lessonMedia.sheet2}
                      label={"Лист «Частоты»"}
                    />
                    <Typography.Text>
                      Перепечатай одну из пятёрок третьей строки на 4 — вторая
                      пара исчезнет, и проверка даст{" "}
                      <Notation>{"ИСТИНА"}</Notation>. Выбери требование, чтобы
                      увидеть проверку по полосе:
                    </Typography.Text>
                    <VariantPicker
                      label={"Требование и проверка по полосе G1:L1"}
                      variants={[
                        {
                          label: "все числа различны",
                          value: <Notation>{"=МАКС(G1:L1)=1"}</Notation>,
                        },
                        {
                          label: "есть повторяющееся число",
                          value: <Notation>{"=МАКС(G1:L1)>1"}</Notation>,
                        },
                        {
                          label: "одна пара и четыре одиночных",
                          value: (
                            <Notation>
                              {"=И(СЧЁТЕСЛИ(G1:L1;2)=2;СЧЁТЕСЛИ(G1:L1;1)=4)"}
                            </Notation>
                          ),
                        },
                        {
                          label: "две пары и два одиночных",
                          value: (
                            <Notation>
                              {"=И(СЧЁТЕСЛИ(G1:L1;2)=4;СЧЁТЕСЛИ(G1:L1;1)=2)"}
                            </Notation>
                          ),
                        },
                        {
                          label: "одна тройка и три одиночных",
                          value: (
                            <Notation>
                              {"=И(СЧЁТЕСЛИ(G1:L1;3)=3;СЧЁТЕСЛИ(G1:L1;1)=3)"}
                            </Notation>
                          ),
                        },
                      ]}
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      <PythonTerm term="listcount">
                        <Notation>{"a.count(x)"}</Notation>
                      </PythonTerm>{" "}
                      — сколько раз <Notation>{"x"}</Notation> встречается в
                      списке <Notation>{"a"}</Notation>. Включение собирает
                      частоту каждого элемента — ту же полосу, что в таблице, —
                      а <Notation>{"count"}</Notation> полосы считает в ней
                      двойки и единицы:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "a = [2, 2, 5, 5, 5, 9]\nfrequencies = [a.count(x) for x in a]\nprint(frequencies)\nprint(frequencies.count(2), frequencies.count(1))"
                      }
                      label={"Полоса частот строки"}
                      language="python"
                      output={"[2, 2, 3, 3, 3, 1]\n2 1"}
                    />
                    <CodeBlock
                      code={
                        'with open("9.txt") as f:\n    for line in f:\n        a = [int(part) for part in line.split()]\n        frequencies = [a.count(x) for x in a]\n        pair = frequencies.count(2) == 2\n        print(frequencies, pair and frequencies.count(1) == 4)'
                      }
                      label={"Структура каждой строки учебной таблицы"}
                      language="python"
                      output={
                        "[2, 2, 1, 1, 1, 1] True\n[2, 2, 1, 1, 1, 1] True\n[2, 2, 2, 2, 1, 1] False\n[3, 3, 3, 1, 1, 1] False\n[2, 2, 1, 1, 1, 1] True\n[2, 2, 1, 1, 1, 1] True"
                      }
                    />
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Структура задачи темы — у строк 1, 2, 5 и 6. Третья не подходит
            из-за второй пары, четвёртая — из-за тройки двоек.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vse-razlichny",
      navLabel: "Все числа различны",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Все числа различны» — в полосе одни единицы; в Python{" "}
              <PythonTerm term="set">множество</PythonTerm> строки такой же
              длины, как сама строка.
            </strong>{" "}
            Множество хранит каждое значение один раз: для 2, 2, 5, 5, 5, 9 это
            2, 5 и 9. Если множество короче строки, в ней есть повторы.
          </Typography.Text>
          <Typography.Text>
            Частоту одного конкретного значения проверяют напрямую: «наибольшее
            число встречается один раз» — частота максимума равна 1.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <FormulaBlock
                    lines={[
                      { formula: "=МАКС(G1:L1)=1" },
                      { formula: "=СЧЁТЕСЛИ(A1:F1;МАКС(A1:F1))=1" },
                    ]}
                    label="Формула"
                  />
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "a = [2, 2, 5, 5, 5, 9]\nprint(len(set(a)), len(a), len(set(a)) == len(a))\nprint(a.count(max(a)) == 1)"
                    }
                    label={"Все различны и единственный максимум"}
                    language="python"
                    output={"3 6 False\nTrue"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: Counter">
            <Typography.Text>
              <PythonTerm term="counter">
                <Notation>{"Counter"}</Notation>
              </PythonTerm>{" "}
              из модуля <Notation>{"collections"}</Notation> хранит частоту
              каждого различного значения. Отсортированный набор частот и есть
              структура повторов, записанная по возрастанию: 3 + 2 + 1 + 1 — это{" "}
              <Notation>{"[1, 1, 2, 3]"}</Notation>.
            </Typography.Text>
            <CodeBlock
              code={
                "from collections import Counter\na = [4, 4, 4, 7, 7, 2, 9]\nprint(Counter(a)[4], sorted(Counter(a).values()))"
              }
              label={"Структура повторов через Counter"}
              language="python"
              output={"3 [1, 1, 2, 3]"}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "povtory-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Частота",
                note: (
                  <>сколько раз встречается значение; «дважды» — два раза</>
                ),
              },
              {
                key: "Структура",
                note: <>размеры групп; их сумма — длина строки</>,
              },
              {
                key: "Полоса",
                note: (
                  <>
                    <Notation>{"=СЧЁТЕСЛИ($A1:$F1;A1)"}</Notation>,{" "}
                    <Notation>{"[a.count(x) for x in a]"}</Notation>
                  </>
                ),
              },
              {
                key: "Пара и четыре",
                note: <>в полосе две двойки и четыре единицы</>,
              },
              {
                key: "Все различны",
                note: (
                  <>
                    <Notation>{"=МАКС(G1:L1)=1"}</Notation>,{" "}
                    <Notation>{"len(set(a)) == len(a)"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dve-gruppy",
      navLabel: "Две группы",
      explanation: (
        <>
          <Typography.Text>
            Решим задачу темы целиком. Структура подходит у строк 1, 2, 5 и 6 —
            осталось сравнить среднее неповторяющихся с суммой повторяющихся.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Числа строки делят на две группы — неповторяющиеся (частота 1) и
              повторяющиеся (частота больше 1) — и сравнивают их суммы,
              количества или средние.
            </strong>
          </Typography.Text>
          <LessonTable
            label={"Вторая проверка задачи темы для строк с нужной структурой"}
            columns={[
              { label: "Строка", numeric: true },
              { label: "Неповторяющиеся" },
              { label: "Пара" },
              { label: "O > 4P" },
            ]}
            rows={[
              ["1", "5, 7, 9, 11 — сумма 32", "2, 2 — сумма 4", "32 > 16, да"],
              ["2", "1, 3, 7, 9 — сумма 20", "5, 5 — сумма 10", "20 > 40, нет"],
              ["5", "4, 5, 7, 8 — сумма 24", "3, 3 — сумма 6", "24 > 24, нет"],
              [
                "6",
                "20, 22, 24, 26 — сумма 92",
                "7, 7 — сумма 14",
                "92 > 56, да",
              ],
            ]}
          />
          <Typography.Text>
            Подходят первая и шестая строки — ответ задачи темы{" "}
            <strong>2</strong>. Заметь: у четвёртой строки 2, 2, 2, 7, 9, 11
            сравнение тоже выполнено (27 {">"} 24), но структура не та — поэтому
            сначала проверяют структуру.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summy-grupp",
      navLabel: "Суммы групп",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В таблице сумму группы складывает СУММЕСЛИ по полосе частот, в
              Python группы собирают в два списка.
            </strong>
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      <PythonTerm term="xl-countif">
                        <Notation>{"СУММЕСЛИ"}</Notation>
                      </PythonTerm>{" "}
                      проверяет условие в одном диапазоне и складывает числа из
                      другого: <Notation>{"=СУММЕСЛИ(G1:L1;1;A1:F1)"}</Notation>{" "}
                      — посмотреть частоты в <Notation>{"G1:L1"}</Notation>,
                      выбрать позиции с частотой 1 и сложить числа на этих
                      позициях из <Notation>{"A1:F1"}</Notation>. Условие{" "}
                      <Notation>{'">1"'}</Notation> в кавычках выбирает
                      повторяющиеся:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        { cell: "G1", formula: "=СЧЁТЕСЛИ($A1:$F1;A1)" },
                        { cell: "M1", formula: "=СУММЕСЛИ(G1:L1;1;A1:F1)" },
                        { cell: "N1", formula: '=СУММЕСЛИ(G1:L1;">1";A1:F1)' },
                        {
                          cell: "O1",
                          formula:
                            "=ЕСЛИ(И(СЧЁТЕСЛИ(G1:L1;2)=2;СЧЁТЕСЛИ(G1:L1;1)=4;M1>4*N1);1;0)",
                        },
                      ]}
                      label="Формула"
                    />
                    <Typography.Text>
                      Отметка в <Notation>{"O"}</Notation> соединяет структуру и
                      сравнение. Формулы протягивают вниз и складывают отметки:
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheet3}
                      label={"Лист «Решение»"}
                    />
                    <Typography.Text>
                      Таблица широкая — прокрути её вправо. Поменяй 8 в пятой
                      строке на 9 — сумма одиночных станет 25 {">"} 24, и строка
                      начнёт подходить.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Пустой список — <Notation>{"[]"}</Notation>,{" "}
                      <Notation>{".append(x)"}</Notation>{" "}
                      <PythonTerm term="list">добавляет элемент</PythonTerm> в
                      конец. Пройди по шагам, куда попадает каждое число первой
                      строки:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runGroups}
                      label={"Две группы первой строки по шагам"}
                    />
                    <Typography.Text>
                      В <Notation>{"else"}</Notation> («иначе») попадают числа с
                      частотой больше 1: частота числа из строки не бывает
                      нулевой. Короче те же списки собирает{" "}
                      <PythonTerm term="comp">включение с условием</PythonTerm>.
                      Структуру удобно проверить по длинам групп: в строке из
                      шести чисел одна пара и четыре одиночных — это ровно 4
                      неповторяющихся и 2 повторяющихся.
                    </Typography.Text>
                    <CodeBlock
                      code={
                        'answer = 0\nwith open("9.txt") as f:\n    for line in f:\n        a = [int(part) for part in line.split()]\n        single = [x for x in a if a.count(x) == 1]\n        repeated = [x for x in a if a.count(x) > 1]\n        if len(single) == 4 and len(repeated) == 2:\n            if sum(single) > 4 * sum(repeated):\n                answer += 1\nprint(answer)'
                      }
                      label={"Решение задачи темы"}
                      language="python"
                      output={"2"}
                    />
                    <Typography.Text>
                      Два вложенных <Notation>{"if"}</Notation> проверяют
                      условия по очереди: сначала структуру, потом сравнение.
                      Такую программу проще проверить по частям, чем одно
                      длинное условие.
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "srednie-grupp",
      navLabel: "Средние групп",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Средние двух групп сравнивают произведениями: сумма одной группы
              на количество чисел другой.
            </strong>{" "}
            В строке 2, 2, 5, 5, 5, 9 одно неповторяющееся число (сумма 9) и
            пять повторяющихся (сумма 19): 9 · 5 = 45 {">"} 19 · 1 = 19 —
            среднее неповторяющихся больше.
          </Typography.Text>
          <Typography.Text>
            Количество чисел группы в таблице даёт{" "}
            <Notation>{"=СЧЁТЕСЛИ(G1:L1;1)"}</Notation> или{" "}
            <Notation>{'=СЧЁТЕСЛИ(G1:L1;">1")'}</Notation>, в Python —{" "}
            <PythonTerm term="len">
              <Notation>{"len"}</Notation>
            </PythonTerm>{" "}
            списка:
          </Typography.Text>
          <CodeBlock
            code={
              "a = [2, 2, 5, 5, 5, 9]\nsingle = [x for x in a if a.count(x) == 1]\nrepeated = [x for x in a if a.count(x) > 1]\nprint(sum(single) * len(repeated), sum(repeated) * len(single))"
            }
            label={"Средние двух групп без деления"}
            language="python"
            output={"45 19"}
          />
          <Typography.Text>
            Сначала проверяют структуру, потом средние и наибольшие числа групп:
            структура гарантирует, что обе группы непустые. У пустого списка нет
            ни среднего, ни максимума — <Notation>{"max([])"}</Notation>{" "}
            остановит программу ошибкой, а в таблице деление на ноль даст{" "}
            <PythonTerm term="xl-check">ошибку</PythonTerm>{" "}
            <Notation>{"#ДЕЛ/0!"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: повторяющиеся без учёта повторений"
          >
            <Typography.Text>
              «Сумма повторяющихся чисел без учёта повторений» берёт каждое
              значение один раз: для 2, 2, 5, 5, 5 это 2 + 5 = 7, а с учётом
              всех появлений — 19. В Python такую сумму даёт множество группы.
            </Typography.Text>
            <CodeBlock
              code={
                "repeated = [2, 2, 5, 5, 5]\nprint(sum(repeated), sum(set(repeated)))"
              }
              label={"С повторами и без"}
              language="python"
              output={"19 7"}
            />
            <Typography.Text>
              Делить сумму повторяющихся на 2 можно, только если каждое значение
              встречается ровно дважды: 4, 4, 7, 7 → 22 / 2 = 11. Для 4, 4, 7,
              7, 7 это уже неверно.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "chetnye-i-nechetnye",
      navLabel: "Чётные и нечётные",
      explanation: (
        <>
          <Typography.Text>
            В строке 1, 3, 5, 20, 30 нечётных чисел больше, чем чётных. А чья
            сумма больше?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Чётные и нечётные числа — тоже две группы: их делят по остатку от
              деления на 2.
            </strong>{" "}
            Чётное число делится на 2 без остатка. Количество и сумма группы —
            независимые условия: нечётных три, но их сумма 9 меньше суммы чётных
            50.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      <PythonTerm term="xl-mod">
                        <Notation>{"ОСТАТ"}</Notation>
                      </PythonTerm>{" "}
                      даёт остаток. Полоса остатков в{" "}
                      <Notation>{"G1:L1"}</Notation> работает как полоса частот:{" "}
                      <Notation>{"СЧЁТЕСЛИ"}</Notation> считает чётные,{" "}
                      <Notation>{"СУММЕСЛИ"}</Notation> складывает их:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        { cell: "G1", formula: "=ОСТАТ(A1;2)" },
                        { formula: "=СЧЁТЕСЛИ(G1:L1;0)" },
                        { formula: "=СУММЕСЛИ(G1:L1;0;A1:F1)" },
                      ]}
                      label="Формула"
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Остаток в Python —{" "}
                      <PythonTerm term="intdiv">
                        <Notation>{"%"}</Notation>
                      </PythonTerm>
                      : <Notation>{"x % 2 == 0"}</Notation> — чётное,{" "}
                      <Notation>{"x % 2 != 0"}</Notation> — нечётное.
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "a = [1, 3, 5, 20, 30]\neven = [x for x in a if x % 2 == 0]\nodd = [x for x in a if x % 2 != 0]\nprint(even, odd)\nprint(len(odd) > len(even), sum(odd) < sum(even))"
                      }
                      label={"Чётные и нечётные"}
                      language="python"
                      output={"[20, 30] [1, 3, 5]\nTrue True"}
                    />
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: «выше среднего» и ноль"
          >
            <Typography.Text>
              Число выше среднего строки, если x {">"} S / n, то есть n · x{" "}
              {">"} S — снова без деления. Слова «выше среднего» относятся
              только к той части условия, где они стоят: если количества
              сравнивают среди чисел выше среднего, а суммы — по всей строке,
              для сумм берут все числа.
            </Typography.Text>
            <CodeBlock
              code={
                "a = [1, 3, 5, 20, 30]\nprint([x for x in a if len(a) * x > sum(a)])"
              }
              label={"Числа выше среднего"}
              language="python"
              output={"[20, 30]"}
            />
            <Typography.Text>
              Ноль чётный: <Notation>{"0 % 2 == 0"}</Notation>. Для
              отрицательных чисел проверка тоже работает:{" "}
              <Notation>{"-7 % 2"}</Notation> в Python равно 1.
            </Typography.Text>
          </ProofDisclosure>
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
                key: "Две группы",
                note: <>частота 1 и частота больше 1</>,
              },
              {
                key: "СУММЕСЛИ",
                note: (
                  <>
                    <Notation>{"=СУММЕСЛИ(G1:L1;1;A1:F1)"}</Notation>, для
                    повторяющихся <Notation>{'">1"'}</Notation>
                  </>
                ),
              },
              {
                key: "Два списка",
                note: (
                  <>
                    <Notation>{"[x for x in a if a.count(x) == 1]"}</Notation>
                  </>
                ),
              },
              {
                key: "Средние",
                note: <>сначала структура, потом S₁ · k₂ {">"} S₂ · k₁</>,
              },
              {
                key: "Чётность",
                note: (
                  <>
                    <Notation>{"x % 2 == 0"}</Notation>,{" "}
                    <Notation>{"=ОСТАТ(A1;2)"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "vopros-zadachi",
      navLabel: "Что спрашивают",
      explanation: (
        <>
          <Typography.Text>
            Изменим вопрос задачи темы: найди номер последней подходящей строки
            и сумму её чисел.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Проверка строки остаётся прежней — меняется только то, что делают
              с подходящей строкой.
            </strong>{" "}
            Подходят строки 1 и 6, последняя — шестая, сумма её чисел 7 + 7 + 20
            + 22 + 24 + 26 = 106. Выбери вопрос, чтобы увидеть, что делать с
            подходящей строкой в программе:
          </Typography.Text>
          <VariantPicker
            label={"Вопрос и действие с подходящей строкой"}
            variants={[
              {
                label: "количество строк",
                value: <Notation>{"answer += 1"}</Notation>,
              },
              {
                label: "номер последней строки",
                value: <Notation>{"last = number"}</Notation>,
                note: <>каждая следующая перезаписывает</>,
              },
              {
                label: "номер первой строки",
                value: <Notation>{"first = number"}</Notation>,
                note: <>и сразу break</>,
              },
              {
                label: "сумма номеров",
                value: <Notation>{"total += number"}</Notation>,
              },
              {
                label: "сумма чисел последней строки",
                value: <Notation>{"row_sum = sum(a)"}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            Поэтому, кроме условий, всегда выделяй заключительный вопрос задачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nomer-stroki",
      navLabel: "Номер строки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Номер строки — её место в данных, считая с 1: в таблице его видно
              слева, в Python его даёт enumerate.
            </strong>
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      Подходящие строки удобно найти{" "}
                      <PythonTerm term="xl-filter">фильтром</PythonTerm>: включи
                      фильтр по столбцу «Подходит» и оставь{" "}
                      <Notation>{"ИСТИНА"}</Notation>. Видны только подходящие
                      строки, слева — их номера на листе; сколько строк найдено,
                      программа пишет внизу окна.
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheet5}
                      label={"Лист «Фильтр»"}
                    />
                    <Typography.Text>
                      Первая строка листа — подписи столбцов, поэтому каждая
                      строка данных сдвинулась вниз на одну:{" "}
                      <strong>
                        строки листа 2 и 7 — это строки данных 1 и 6.
                      </strong>{" "}
                      Если в вопросе номер строки, вычти строку заголовков.
                    </Typography.Text>
                    <Typography.Text>
                      Без фильтра номер даёт{" "}
                      <PythonTerm term="xl-row">
                        <Notation>{"=СТРОКА()"}</Notation>
                      </PythonTerm>{" "}
                      — номер строки листа, где стоит формула. Её ставят в
                      подходящих строках, в остальных — пустой текст{" "}
                      <Notation>{'""'}</Notation>; затем{" "}
                      <Notation>{"МАКС"}</Notation> даёт последнюю строку,{" "}
                      <Notation>{"МИН"}</Notation> — первую,{" "}
                      <Notation>{"СУММ"}</Notation> — сумму номеров:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        { cell: "P2", formula: '=ЕСЛИ(O2;СТРОКА()-1;"")' },
                        { cell: "P8", formula: "=МАКС(P2:P7)" },
                      ]}
                      label="Формула"
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      <PythonTerm term="enumerate">
                        <Notation>{"enumerate"}</Notation>
                      </PythonTerm>{" "}
                      выдаёт строки файла вместе с номерами: в{" "}
                      <Notation>
                        {"for number, line in enumerate(f, start=1)"}
                      </Notation>{" "}
                      <Notation>{"number"}</Notation> — номер, начиная с 1,{" "}
                      <Notation>{"line"}</Notation> — сама строка. Проверка — та
                      же, что в подтеме 4, меняется действие:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        'last = 0\nrow_sum = 0\nwith open("9.txt") as f:\n    for number, line in enumerate(f, start=1):\n        a = [int(part) for part in line.split()]\n        single = [x for x in a if a.count(x) == 1]\n        repeated = [x for x in a if a.count(x) > 1]\n        if len(single) == 4 and len(repeated) == 2:\n            if sum(single) > 4 * sum(repeated):\n                last = number\n                row_sum = sum(a)\nprint(last, row_sum)'
                      }
                      label={"Номер и сумма последней подходящей строки"}
                      language="python"
                      output={"6 106"}
                    />
                    <Typography.Text>
                      Файл читается сверху вниз, и каждая новая подходящая
                      строка заменяет прежний ответ — после цикла в{" "}
                      <Notation>{"last"}</Notation> последняя. Для первой строки
                      после <Notation>{"first = number"}</Notation> цикл
                      останавливают{" "}
                      <PythonTerm term="break">
                        <Notation>{"break"}</Notation>
                      </PythonTerm>
                      .
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: строка с наибольшей суммой и модуль"
          >
            <Typography.Text>
              Чтобы найти строку с наибольшей суммой, хранят и сумму, и номер.
              Пока подходящих строк не было, лучшей суммы нет — это значение{" "}
              <PythonTerm term="none">
                <Notation>{"None"}</Notation>
              </PythonTerm>
              . Ноль вместо него ошибётся, если все суммы отрицательные:
            </Typography.Text>
            <CodeRunner
              {...lessonMedia.runBest}
              label={"Наибольшая из сумм −7, −3 и −9 по шагам"}
            />
            <Typography.Text>
              При равных суммах сравнение {">"} оставит первую строку, а ≥ —
              последнюю.
            </Typography.Text>
            <Typography.Text>
              Модуль — расстояние от нуля:{" "}
              <PythonTerm term="absval">
                <Notation>{"abs(-8)"}</Notation>
              </PythonTerm>{" "}
              равно 8, в таблице — <Notation>{"=ABS(A1)"}</Notation>. Его берут
              там, где сказано: модуль наименьшего числа −8, −2 — это 8, а
              наименьший из модулей — 2.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "poryadok",
      navLabel: "Порядок в строке",
      explanation: (
        <>
          <Typography.Text>
            Числа строки 2, 5, 5, 9 расположены по возрастанию?
          </Typography.Text>
          <Typography.Text>
            <strong>
              «По возрастанию» — каждое следующее число больше предыдущего, «в
              неубывающем порядке» — больше или равно.
            </strong>{" "}
            У 2, 5, 5, 9 порядок неубывающий, но не возрастающий: 5 не больше 5.
            Порядок проверяют на исходной строке — сортировка перед проверкой
            сделала бы любую строку упорядоченной.
          </Typography.Text>
          <LessonTabs
            label={"Способ решения"}
            tabs={[
              {
                label: "Таблица",
                content: (
                  <>
                    <Typography.Text>
                      Цепочка сравнений соседей — по возрастанию и в неубывающем
                      порядке:
                    </Typography.Text>
                    <FormulaBlock
                      lines={[
                        { formula: "=И(A1<B1;B1<C1;C1<D1;D1<E1;E1<F1)" },
                        { formula: "=И(A1<=B1;B1<=C1;C1<=D1;D1<=E1;E1<=F1)" },
                      ]}
                      label="Формула"
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Строка неубывающая, если совпадает со своей упорядоченной
                      копией; возрастающая — если к тому же в ней нет повторов:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "a = [2, 5, 5, 9]\nprint(a == sorted(a))\nprint(a == sorted(a) and len(set(a)) == len(a))"
                      }
                      label={"Неубывание и возрастание"}
                      language="python"
                      output={"True\nFalse"}
                    />
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: части строки">
            <Typography.Text>
              Условия о частях строки — «первые четыре числа», «вторая половина»
              — тоже требуют исходного порядка. В Python часть списка даёт{" "}
              <PythonTerm term="slice">срез</PythonTerm>:{" "}
              <Notation>{"a[:4]"}</Notation> — индексы 0, 1, 2, 3,{" "}
              <Notation>{"a[4:]"}</Notation> — с индекса 4 до конца. В таблице у
              частей свои диапазоны, например <Notation>{"A1:D1"}</Notation> и{" "}
              <Notation>{"E1:H1"}</Notation>.
            </Typography.Text>
            <CodeBlock
              code={
                "a = [3, 9, 2, 6, 5, 4, 8, 7]\nfirst = a[:4]\nsecond = a[4:]\nprint(first, second)\nprint(max(a) in first, sum(first) < sum(second))"
              }
              label={"Две половины строки"}
              language="python"
              output={"[3, 9, 2, 6] [5, 4, 8, 7]\nTrue True"}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "poryadok-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Вопрос",
                note: (
                  <>проверка та же, меняется действие с подходящей строкой</>
                ),
              },
              {
                key: "Фильтр",
                note: <>номера листа; заголовок сдвигает на 1</>,
              },
              {
                key: "enumerate",
                note: (
                  <>
                    <Notation>
                      {"for number, line in enumerate(f, start=1)"}
                    </Notation>
                  </>
                ),
              },
              {
                key: "Последняя и первая",
                note: (
                  <>
                    перезаписывать; первую — с <Notation>{"break"}</Notation>
                  </>
                ),
              },
              {
                key: "Порядок",
                note: (
                  <>{"<"} — возрастание, ≤ — неубывание; на исходной строке</>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "oblast-podscheta",
      navLabel: "Где считаем",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> В нём редкие
            задачи, где условие на ячейку зависит от её столбца, всей таблицы
            или соседних ячеек; на экзаменах такие задачи не встречались. Задачи
            основных подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            Ячейка «интересная», если её число встречается в своей строке один
            раз, а в других строках таблицы — 160 раз. Как посчитать «в других
            строках»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала определяют область подсчёта: своя строка, свой столбец,
              вся таблица, другие ячейки или другие строки.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tbScope}
            caption={
              <>
                Одна и та же четвёрка во второй строке (жирная рамка)
                встречается 2 раза в своей строке, 3 раза в своём столбце и 6
                раз во всей таблице. В других строках — 6 − 2 = 4 раза, в других
                ячейках столбца — 3 − 1 = 2.
              </>
            }
          />
          <Typography.Text>
            Пусть данные занимают <Notation>{"A1:F5000"}</Notation>. Выбери, где
            считаем значение <Notation>{"A1"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Где считаем и формула"}
            variants={[
              {
                label: "в своей строке",
                value: <Notation>{"=СЧЁТЕСЛИ($A1:$F1;A1)"}</Notation>,
              },
              {
                label: "в своём столбце",
                value: <Notation>{"=СЧЁТЕСЛИ(A$1:A$5000;A1)"}</Notation>,
              },
              {
                label: "во всей таблице",
                value: <Notation>{"=СЧЁТЕСЛИ($A$1:$F$5000;A1)"}</Notation>,
              },
              {
                label: "в других ячейках столбца",
                value: <Notation>{"=СЧЁТЕСЛИ(A$1:A$5000;A1)-1"}</Notation>,
              },
              {
                label: "в других строках",
                value: (
                  <Notation>
                    {"=СЧЁТЕСЛИ($A$1:$F$5000;A1)-СЧЁТЕСЛИ($A1:$F1;A1)"}
                  </Notation>
                ),
              },
            ]}
          />
          <Typography.Text>
            Знак <Notation>{"$"}</Notation> из{" "}
            <PythonTerm term="xl-ref">урока о ссылках</PythonTerm> закрепляет
            границы области при копировании. Подсчёт всегда включает саму
            ячейку: для «других ячеек столбца» вычитают 1, а для «других строк»
            — <strong>все</strong> появления в своей строке. Если число
            встречается в таблице 17 раз, а в своей строке 3, в других строках
            оно встречается 14 раз, а не 16.
          </Typography.Text>
          <Typography.Text>
            Появления и строки — разные величины: если 5 встречается в первой
            строке трижды, а во второй дважды, появлений пять, а строк с
            пятёркой — две.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "yachejka-i-stroka",
      navLabel: "Ячейка и строка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие на ячейку проверяют в два уровня: сначала отмечают
              подходящие ячейки, затем по их отметкам — строки.
            </strong>{" "}
            Пусть ячейка подходит, если её число встречается в своей строке один
            раз и ещё хотя бы раз — в других ячейках своего столбца. Для{" "}
            <Notation>{"A1"}</Notation> таблицы из четырёх строк по три числа
            отметка в <Notation>{"D1"}</Notation>:
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                formula:
                  "=ЕСЛИ(И(СЧЁТЕСЛИ($A1:$C1;A1)=1;СЧЁТЕСЛИ(A$1:A$4;A1)-1>=1);1;0)",
              },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Формулу копируют вправо до <Notation>{"F1"}</Notation> и вниз.
            Строка с хотя бы одной подходящей ячейкой получает отметку{" "}
            <Notation>{"=ЕСЛИ(СУММ(D1:F1)>=1;1;0)"}</Notation>, и только эти
            отметки складывают:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet6} label={"Лист «Ячейки»"} />
          <Typography.Text>
            Подходят вторая строка (двойка единственна в строке, и в столбце B
            есть ещё двойка) и третья (двойка в столбце A). Тройка первой строки
            единственна в строке, но в своём столбце больше не встречается.{" "}
            <strong>
              Сумма отметок всех ячеек дала бы число ячеек, а не строк.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-prohoda",
      navLabel: "Два прохода",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Когда условие зависит от всего столбца или всей таблицы, программа
              сначала читает все данные, а потом проходит по ним второй раз.
            </strong>{" "}
            При чтении первой строки ещё неизвестно, сколько раз её числа
            встретятся ниже. Таблицу собирают в список строк:
          </Typography.Text>
          <CodeBlock
            code={
              'table = []\nwith open("9.txt") as f:\n    for line in f:\n        a = [int(part) for part in line.split()]\n        table.append(a)\nprint(len(table), table[0])'
            }
            label={"Вся таблица в списке"}
            language="python"
            output={"6 [2, 2, 5, 7, 9, 11]"}
          />
          <Typography.Text>
            Первый проход считает частоты каждого столбца, второй проверяет
            ячейки и строки. <Notation>{"column_counts[j]"}</Notation> —{" "}
            <PythonTerm term="counter">счётчик</PythonTerm> столбца{" "}
            <Notation>{"j"}</Notation>, перебор строк и столбцов —{" "}
            <PythonTerm term="nested">вложенные циклы</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              "from collections import Counter\n\ntable = [\n    [2, 3, 2],\n    [4, 2, 5],\n    [2, 6, 7],\n    [8, 2, 2],\n]\nwidth = len(table[0])\n\ncolumn_counts = []\nfor j in range(width):\n    column_counts.append(Counter())\n\nfor a in table:\n    for j in range(width):\n        column_counts[j][a[j]] += 1\n\nanswer = 0\nfor a in table:\n    row_counts = Counter(a)\n    good_cells = 0\n    for j in range(width):\n        x = a[j]\n        if (\n            row_counts[x] == 1\n            and column_counts[j][x] - 1 >= 1\n        ):\n            good_cells += 1\n    if good_cells >= 1:\n        answer += 1\n\nprint(answer)"
            }
            label={"Два прохода по таблице"}
            language="python"
            output={"2"}
          />
          <Typography.Text>
            Ответ тот же, что на листе «Ячейки». У{" "}
            <Notation>{"Counter"}</Notation> частота ещё не встречавшегося числа
            равна нулю, поэтому её можно сразу увеличивать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sosedi",
      navLabel: "Соседи ячейки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Соседей ячейки перебирают, меняя индексы строки и столбца на −1, 0
              и 1, без самой ячейки и с проверкой границ таблицы.
            </strong>{" "}
            Если соседними считаются ячейки с общей стороной или углом, у ячейки
            в углу три соседа, на краю — пять, внутри — восемь:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tbNeighbours4_5}
            caption={
              <>
                В таблице 4 × 5 у угловой ячейки 3 соседа, у ячейки на краю вне
                угла — 5, у внутренней — 8.
              </>
            }
          />
          <Typography.Text>
            Проверим для каждой ячейки квадрата 3 × 3, есть ли у неё больший
            сосед. Сдвиг (0, 0) оставляет на месте, его пропускает{" "}
            <PythonTerm term="continue">
              <Notation>{"continue"}</Notation>
            </PythonTerm>
            ; проверку оформим <PythonTerm term="def">функцией</PythonTerm>{" "}
            <Notation>{"has_larger"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "table = [[2, 2, 7], [4, 5, 9], [6, 1, 8]]\n\ndef has_larger(r, c):\n    x = table[r][c]\n    found = False\n    for dr in [-1, 0, 1]:\n        for dc in [-1, 0, 1]:\n            if dr == 0 and dc == 0:\n                continue\n            nr = r + dr\n            nc = c + dc\n            if (\n                0 <= nr < len(table)\n                and 0 <= nc < len(table[0])\n            ):\n                if table[nr][nc] > x:\n                    found = True\n    return found\n\nfor r in range(len(table)):\n    print([int(has_larger(r, c)) for c in range(3)])"
            }
            label={"Есть ли больший сосед"}
            language="python"
            output={"[1, 1, 1]\n[1, 1, 0]\n[0, 1, 1]"}
          />
          <Typography.Text>
            Большего соседа нет у девятки и у шестёрки в левом нижнем углу.{" "}
            <strong>Проверять границы необходимо:</strong> индекс{" "}
            <Notation>{"-1"}</Notation> в Python означает последний элемент, и
            без проверки шестёрка «увидела» бы соседей с правого края — 9 и 8.
          </Typography.Text>
          <Typography.Text>
            В таблице для внутренней ячейки <Notation>{"B2"}</Notation> больший
            сосед есть, если <Notation>{"=МАКС(A1:C3)>B2"}</Notation>: сама{" "}
            <Notation>{"B2"}</Notation> в диапазоне не мешает — она не больше
            самой себя.
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
                key: "Область",
                note: <>строка, столбец, таблица; $ закрепляет границы</>,
              },
              {
                key: "Другие строки",
                note: <>минус все появления в своей строке, а не 1</>,
              },
              {
                key: "Появления и строки",
                note: <>разные величины</>,
              },
              {
                key: "Два уровня",
                note: <>отметки ячеек, затем строк; в Python два прохода</>,
              },
              {
                key: "Соседи",
                note: <>сдвиги −1, 0, 1 без (0, 0), с проверкой границ</>,
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
          Готовое решение проверяют вручную на одной подходящей и одной
          неподходящей строке, а потом ищут типичные ошибки.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "строгость",
            value: <>посчитали «больше» как «не меньше»</>,
            note: <>проверь строку, где выполняется равенство</>,
          },
          {
            label: "лишняя пара",
            value: <>проверили только две двойки в полосе частот</>,
            note: <>считать и единицы: четыре одиночных числа</>,
          },
          {
            label: "пустая группа",
            value: <>взяли среднее или максимум несуществующей группы</>,
            note: <>сначала структура, потом группы</>,
          },
          {
            label: "S − m − M",
            value: <>убрали все числа, равные наименьшему и наибольшему</>,
            note: <>вычитается по одному экземпляру</>,
          },
          {
            label: "сортировка",
            value: <>отсортировали строку и проверили порядок или половины</>,
            note: <>порядок — на исходной строке</>,
          },
          {
            label: "формулы не до конца",
            value: <>протянули формулы не до последней строки данных</>,
            note: <>сравни число признаков с числом строк файла</>,
          },
          {
            label: "номер с заголовком",
            value: <>ответили номером строки листа</>,
            note: <>вычесть строку заголовков</>,
          },
          {
            label: "счётчик не там",
            value: (
              <>
                <Notation>{"answer = 0"}</Notation> внутри цикла или{" "}
                <Notation>{"+= 1"}</Notation> в цикле по числам
              </>
            ),
            note: <>обнулить до файла, увеличить один раз на строку</>,
          },
        ]}
      />
      <Typography.Text>
        Распознаны ли числа таблицы как числа, проверяет{" "}
        <Notation>{"=СЧЁТ(A1:F1)"}</Notation>: для шести чисел в строке должно
        получиться 6.{" "}
        <PythonTerm term="xl-format">Текстовые записи чисел</PythonTerm>{" "}
        <Notation>{"СЧЁТ"}</Notation> не учитывает.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 9 решается одним порядком: разложить условие на
          отдельные проверки строки, проверить их на одной строке вручную,
          применить ко всем строкам и вывести то, что спросили.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 9 на одной схеме"}
        flow={[
          { name: "Условие", note: "отдельные проверки строки" },
          { name: "Проверка", note: "признак в таблице или if в программе" },
          { name: "Ответ", note: "количество, номер или число из строки" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="9-obrabotka-tablicy-chisel"
                subtopic="stroka-i-uslovie"
              >
                Строка и условие
              </SubtopicLink>
            ),
            rows: [
              { key: <>«не меньше»</>, note: <>≥: равенство подходит</> },
              {
                key: <Notation>{"=ЕСЛИ(И(…);1;0)"}</Notation>,
                note: <>признак строки, ответ — сумма</>,
              },
              {
                key: <Notation>{"p != q"}</Notation>,
                note: <>ровно одно из двух условий</>,
              },
              {
                key: <Notation>{"line.split()"}</Notation>,
                note: <>файл сохранён текстом</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="9-obrabotka-tablicy-chisel"
                subtopic="summa-krajnie-srednie"
              >
                Сумма, наибольшее, наименьшее
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"sorted(a)[-2]"}</Notation>,
                note: <>второе по величине с повторами</>,
              },
              { key: <>S − m − M</>, note: <>по одному экземпляру крайних</> },
              {
                key: <>a + d = b + c</>,
                note: <>две пары с равными суммами</>,
              },
              {
                key: <>S₁ · k₂ {">"} S₂ · k₁</>,
                note: <>средние без деления</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="9-obrabotka-tablicy-chisel"
                subtopic="povtory-v-stroke"
              >
                Повторы
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"=СЧЁТЕСЛИ($A1:$F1;A1)"}</Notation>,
                note: <>полоса частот</>,
              },
              {
                key: <Notation>{"[a.count(x) for x in a]"}</Notation>,
                note: <>та же полоса в Python</>,
              },
              {
                key: <>2 + 1 + 1 + 1 + 1</>,
                note: <>две двойки, четыре единицы</>,
              },
              {
                key: <Notation>{"len(set(a)) == len(a)"}</Notation>,
                note: <>все числа различны</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="9-obrabotka-tablicy-chisel"
                subtopic="povtoryayushchiesya-i-odinochnye"
              >
                Две группы
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"=СУММЕСЛИ(G1:L1;1;A1:F1)"}</Notation>,
                note: <>сумма неповторяющихся</>,
              },
              {
                key: <Notation>{"single, repeated"}</Notation>,
                note: <>два списка включением</>,
              },
              { key: <>сначала структура</>, note: <>потом средние групп</> },
              {
                key: <Notation>{"x % 2 == 0"}</Notation>,
                note: <>чётные и нечётные — тоже группы</>,
              },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="9-obrabotka-tablicy-chisel"
                subtopic="poryadok-i-nomer-stroki"
              >
                Порядок и номер
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"enumerate(f, start=1)"}</Notation>,
                note: <>номер строки с единицы</>,
              },
              { key: <>фильтр</>, note: <>номер листа минус заголовок</> },
              {
                key: <Notation>{"last = number"}</Notation>,
                note: <>последняя; первая — с break</>,
              },
              {
                key: <Notation>{"a == sorted(a)"}</Notation>,
                note: <>неубывающий порядок</>,
              },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="9-obrabotka-tablicy-chisel"
                subtopic="yachejka-stolbec-sosedi"
              >
                Вся таблица и соседи
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              {
                key: <>другие строки</>,
                note: <>минус частота своей строки</>,
              },
              { key: <>отметки ячеек → строки</>, note: <>два прохода</> },
              {
                key: <>сдвиги −1, 0, 1</>,
                note: <>без (0, 0), с проверкой границ</>,
              },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к готовому решению",
            steps: [
              <>Что учитывается: числа, ячейки или строки?</>,
              <>
                Совпадает ли результат с ручным разбором одной подходящей и
                одной неподходящей строки?
              </>,
              <>Выведено ли то, что спросили: количество, номер или число?</>,
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
        Перед формулами или программой полезно расписать условие так:
      </Typography.Text>
      <LessonTable
        label={"Условие словами и точная проверка"}
        columns={[
          { label: "Условие словами" },
          { label: "Что нужно" },
          { label: "Точная проверка" },
        ]}
        rows={[
          [
            "Одно число дважды, остальные четыре различны",
            "Полоса частот",
            "Две двойки и четыре единицы",
          ],
          [
            "Среднее неповторяющихся больше суммы повторяющихся",
            "Суммы двух групп",
            "O > 4P",
          ],
          [
            "Наибольшее число встречается один раз",
            "Наибольшее и его частота",
            "Частота наибольшего = 1",
          ],
          [
            "Номер последней такой строки",
            "Номер строки",
            "Перезаписывать номер в каждой подходящей",
          ],
        ]}
      />
    </>
  ),
  status: "published",
});
