import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import { spreadsheetOptimizationLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./spreadsheet-optimization.media";
import { FieldTable, R, THEME_TASK } from "./spreadsheet-optimization.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const spreadsheetOptimizationLesson = defineLesson({
  ...spreadsheetOptimizationLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Находить лучшую сумму до клетки по последнему шагу, а не перебором маршрутов",
    "Строить в Excel блок лучших сумм четырьмя формулами и получать минимум заменой МАКС на МИН",
    "Учитывать стены на входе в клетку",
    "Находить «угловые» финиши и недостижимые клетки и решать задачу темы целиком",
    "Менять соседей и вклад клетки для других направлений, старта внутри поля, цены шага и запаса энергии",
    "Для редких задач — диагонали, ладья, число маршрутов и несколько запусков (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "luchshaya-summa-do-kletki",
      title: "Лучшая сумма до клетки",
      lead: "Что спрашивают в задании 18 и как найти наибольшую и наименьшую сумму маршрута, не перебирая маршруты.",
      conceptIds: [
        "kak-ustroena-tema",
        "pole-i-marshrut",
        "poslednij-shag",
        "tolko-luchshaya",
        "tablica-summ",
        "summa-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Монета в клетке — 6. До соседа слева лучшие суммы: наибольшая 30,
              наименьшая 21; до соседа сверху — 25 и 17. Найди наибольшую и
              наименьшую сумму до клетки.
            </>
          ),
          reveal: <>36 и 23: 6 + max(30; 25) и 6 + min(21; 17).</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Почему нельзя сложить суммы слева и сверху: монета + 30 + 25?</>
          ),
          reveal: (
            <>
              Это суммы двух разных маршрутов. В клетку робот приходит один раз
              — либо слева, либо сверху, — поэтому берут одну из сумм.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>Найди наибольшую и наименьшую сумму до клетки C2 поля 4 × 4.</>
          ),
          reveal: (
            <>
              21 и 16. Слева B2: 10 и 8, сверху C1: 13. Наибольшая 8 + 13 = 21,
              наименьшая 8 + 8 = 16.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Почему в верхней строке и левом столбце наибольшая и наименьшая
              суммы совпадают?
            </>
          ),
          reveal: (
            <>
              В эти клетки ведёт единственный маршрут: в верхнюю строку — только
              слева, в левый столбец — только сверху.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему нельзя на каждом шаге идти к самой дорогой из двух соседних
              монет?
            </>
          ),
          reveal: (
            <>
              Ближайшая дорогая монета может увести от выгодной части поля: в
              клетки левее и выше робот уже не вернётся.
            </>
          ),
        },
      ],
    },
    {
      slug: "tablica-v-excel",
      title: "Таблица в Excel",
      lead: "Как записать правило клетки формулами: блок под полем, четыре формулы и замена МАКС на МИН.",
      conceptIds: [
        "raschyotnyj-blok",
        "chetyre-formuly",
        "kopirovanie",
        "blok-minimuma",
        "pole-iz-fajla",
        "excel-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Формулу <Notation>{"=B2+МАКС(A7;B6)"}</Notation> растянули на{" "}
              <Notation>{"B7:D9"}</Notation>. Какая формула окажется в{" "}
              <Notation>{"C8"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=C3+МАКС(B8;C7)"}</Notation>: монета C3 и суммы
              соседей слева и сверху в блоке.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              В <Notation>{"B6"}</Notation> записали{" "}
              <Notation>{"=B1"}</Notation>. Что не так?
            </>
          ),
          reveal: (
            <>
              Пропала сумма до соседа слева: получился маршрут, который начался
              в B1. Нужно <Notation>{"=A6+B1"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Что получится, если в формуле написать{" "}
              <Notation>{"$B$2"}</Notation> вместо <Notation>{"B2"}</Notation> и
              растянуть её на весь блок?
            </>
          ),
          reveal: (
            <>
              Все клетки блока будут прибавлять одну и ту же монету из B2, а не
              свою. Здесь ссылки должны сдвигаться вместе с формулой.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Блок максимума <Notation>{"A6:D9"}</Notation> скопировали целиком
              в <Notation>{"A11:D14"}</Notation>. Какая формула окажется в{" "}
              <Notation>{"B12"}</Notation> и что в ней не так?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=B7+МАКС(A12;B11)"}</Notation>: вместо монеты из B2
              она берёт число из блока максимума.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Поле 20 × 20 занимает <Notation>{"A1:T20"}</Notation>, блок
              начинается в <Notation>{"A22"}</Notation>. В какой ячейке будет
              лучшая сумма до правой нижней клетки?
            </>
          ),
          reveal: (
            <>
              В <Notation>{"T41"}</Notation>: блок сдвинут на 21 строку вниз, а
              T20 + 21 строка = T41.
            </>
          ),
        },
      ],
    },
    {
      slug: "steny",
      title: "Стены",
      lead: "Как стена меняет формулу клетки: приход сквозь стену убирают, и остаётся один сосед.",
      access: "paid",
      conceptIds: [
        "stena-na-vhode",
        "stena-v-formule",
        "steny-v-fajle",
        "steny-itogo",
      ],
      paid: {
        outline: [
          { id: "stena-na-vhode", navLabel: "Стена на входе" },
          { id: "stena-v-formule", navLabel: "Стена в формуле" },
          { id: "steny-v-fajle", navLabel: "Стены в файле" },
          { id: "steny-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              В задаче темы между клетками стоят стены. Что стена меняет в
              правиле клетки?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./spreadsheet-optimization.paid.steny"),
      },
    },
    {
      slug: "nedostizhimye-i-finishi",
      title: "Тупики и недостижимые клетки",
      lead: "Где робот может закончить маршрут, куда он не попадёт вовсе — и задача темы целиком: ответ 2629 378.",
      access: "paid",
      conceptIds: [
        "uglovye-finishi",
        "nedostizhimye",
        "zadacha-temy",
        "finishi-itogo",
      ],
      paid: {
        outline: [
          { id: "uglovye-finishi", navLabel: "«Угловые» клетки" },
          { id: "nedostizhimye", navLabel: "Недостижимые клетки" },
          { id: "zadacha-temy", navLabel: "Задача темы целиком" },
          { id: "finishi-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              В задаче темы маршрут заканчивается в любой «угловой» клетке, а в
              некоторые клетки робот не попадает вовсе. Где тогда искать ответ?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () =>
          import("./spreadsheet-optimization.paid.nedostizhimye-i-finishi"),
      },
    },
    {
      slug: "napravleniya-i-zapuski",
      title: "Другие направления и правила",
      lead: "Робот ходит влево или вверх, стартует в середине поля, платит за шаг или тратит энергию — меняются только соседи и вклад клетки.",
      access: "paid",
      conceptIds: [
        "drugie-napravleniya",
        "start-vnutri",
        "vklad-kletki",
        "zapas-energii",
        "pravila-itogo",
      ],
      paid: {
        outline: [
          { id: "drugie-napravleniya", navLabel: "Другие направления" },
          { id: "start-vnutri", navLabel: "Старт внутри поля" },
          { id: "vklad-kletki", navLabel: "Вклад клетки" },
          { id: "zapas-energii", navLabel: "Запас энергии" },
          { id: "pravila-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что меняется в таблице, если робот ходит влево и вниз, а не вправо
              и вниз?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () =>
          import("./spreadsheet-optimization.paid.napravleniya-i-zapuski"),
      },
    },
    {
      slug: "ladya-i-chislo-marshrutov",
      title: "Диагонали, ладья и число маршрутов",
      lead: "Когда соседей больше двух, когда приходы складывают, а не выбирают, и как сложить результаты нескольких запусков.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "diagonali",
        "ladya",
        "chislo-marshrutov",
        "neskolko-zapuskov",
        "dop-itogo",
      ],
      paid: {
        outline: [
          { id: "diagonali", navLabel: "Диагонали" },
          { id: "ladya", navLabel: "Ладья" },
          { id: "chislo-marshrutov", navLabel: "Число маршрутов" },
          { id: "neskolko-zapuskov", navLabel: "Несколько запусков" },
          { id: "dop-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Изредка в
              задании 18 робот ходит по диагонали или на несколько клеток,
              спрашивают число маршрутов или сумму нескольких запусков. Задачи
              основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () =>
          import("./spreadsheet-optimization.paid.ladya-i-chislo-marshrutov"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 18 дают файл Excel: квадратное поле, в каждой клетке —
            монета. Робот идёт по полю по заданным правилам и собирает монеты.
            Нужно найти, какую наибольшую и какую наименьшую сумму он может
            собрать. Вот задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Маршрутов на поле 20 × 20 — миллиарды, перебрать их не выйдет.
            </strong>{" "}
            Поэтому задачу решают таблицей в Excel: для каждой клетки считают
            лучшую сумму, с которой в неё можно прийти. Каждый шаг сначала
            проверим руками на маленьком поле 4 × 4. Разберём условие:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "вправо или вниз",
                "назад робот не возвращается: каждую клетку он проходит не больше одного раза",
              ],
              [
                "внутренние стены",
                "между некоторыми соседними клетками перейти нельзя",
              ],
              [
                "забирает монету, в том числе в начальной и конечной клетках",
                "сумма маршрута — монеты всех его клеток, первой и последней тоже",
              ],
              [
                "«угловые» клетки, ограниченные справа и снизу",
                "тупики: здесь маршрут заканчивается",
              ],
              [
                "конечных клеток может быть несколько",
                "ответ ищут среди всех тупиков, а не только в правой нижней клетке",
              ],
              [
                "сначала максимальную сумму, затем минимальную",
                "ответ — два числа в этом порядке",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из пяти подтем и дополнительного урока — у каждой своя
            страница. Идём по ним по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Лучшая сумма до клетки</strong> — ты сейчас здесь: правило
              клетки на поле 4 × 4.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="tablica-v-excel">
                Таблица в Excel
              </SubtopicLink>{" "}
              — то же правило формулами.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="steny">
                Стены
              </SubtopicLink>{" "}
              — как стена меняет формулу.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="nedostizhimye-i-finishi">
                Тупики и недостижимые клетки
              </SubtopicLink>{" "}
              — решим задачу темы целиком: ответ 2629 378.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="napravleniya-i-zapuski">
                Другие направления и правила
              </SubtopicLink>{" "}
              — влево и вверх, старт в середине поля, цена шага, запас энергии.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="ladya-i-chislo-marshrutov">
                Диагонали, ладья и число маршрутов
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "pole-i-marshrut",
      navLabel: "Поле и маршрут",
      explanation: (
        <>
          <Typography.Text>
            Что такое маршрут и как посчитать его сумму?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Маршрут — цепочка клеток от старта до финиша, а его сумма — сумма
              монет всех этих клеток.
            </strong>{" "}
            Начнём без стен: робот идёт из левой верхней клетки A1 в правую
            нижнюю D4. Буквы — столбцы, числа — строки, как адреса ячеек Excel:
          </Typography.Text>
          <FieldTable label={"Поле 4 × 4"} />
          <Typography.Text>
            Маршрут A1 → B1 → B2 → C2 → C3 → D3 → D4 собирает 2 + 7 + 1 + 8 + 2
            + 9 + 2 = 31, а маршрут A1 → A2 → B2 → B3 → B4 → C4 → D4 — 26. Нам
            нужны наибольшая и наименьшая суммы среди всех маршрутов. На этом
            поле маршрутов 20, а на поле 20 × 20 — больше 35 миллиардов, так что
            перебирать их не будем.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему не идти к самой дорогой монете"
          >
            <Typography.Text>
              Ближайшая дорогая монета может увести робота от выгодной части
              поля. На поле 1, 9, 1 / 8, 1, 1 / 100, 100, 1 шаг к девятке
              оставляет позади обе сотни: лучший маршрут после него — 112, а
              маршрут вниз через сотни — 210.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "poslednij-shag",
      navLabel: "Последний шаг",
      explanation: (
        <>
          <Typography.Text>
            Как найти лучшую сумму до клетки B2, не перебирая маршруты?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Посмотри, откуда робот сделал последний шаг. В B2 он пришёл либо
              слева, из A2, либо сверху, из B1. Лучшая сумма до B2 — её монета
              плюс лучшая из сумм до A2 и до B1.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridPreds_122f4b}
            caption={
              <>
                Робот ходит вправо и вниз, поэтому в клетку (рамка) последний
                шаг приходит слева или сверху.
              </>
            }
          />
          <Typography.Text>
            До A2 путь один: 2 + 5 = 7. До B1 тоже один: 2 + 7 = 9. Значит,
            наибольшая сумма до B2 — 1 + 9 = 10, а наименьшая — 1 + 7 = 8.
          </Typography.Text>
          <Typography.Text>
            Сравнивают суммы всего пути до соседей, а не монеты в них. А
            складывать суммы слева и сверху нельзя: это два разных маршрута, а в
            клетку робот приходит один раз.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tolko-luchshaya",
      navLabel: "Почему хватает лучшей суммы",
      explanation: (
        <>
          <Typography.Text>
            Почему для клетки достаточно помнить одну лучшую сумму?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Два маршрута, пришедшие в одну клетку, дальше могут идти одинаково
              — и тот, что впереди, так и останется впереди.
            </strong>{" "}
            В C3 можно прийти с суммой 23 (A1 → B1 → C1 → C2 → C3) или с суммой
            17 (A1 → A2 → A3 → B3 → C3). Продолжим оба одинаково, через D3 в D4:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridRoutes}
            caption={
              <>
                К обоим путям прибавилось 11: 34 против 28. Разница 6 никуда не
                делась.
              </>
            }
          />
          <Typography.Text>
            Какое бы продолжение мы ни выбрали, к обеим суммам прибавится одно и
            то же. Поэтому маршрут с суммой 17 уже не обгонит маршрут с 23, и
            для максимума в C3 достаточно помнить 23.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tablica-summ",
      navLabel: "Таблица лучших сумм",
      explanation: (
        <>
          <Typography.Text>
            Как посчитать лучшие суммы для всех клеток поля?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Идём по строкам сверху вниз, а в строке — слева направо: к каждой
              клетке суммы её соседей слева и сверху уже готовы.
            </strong>{" "}
            Старт A1 — просто его монета, 2. В верхнюю строку приходят только
            слева, в левый столбец — только сверху: там суммы просто
            накапливаются. Остальные клетки — по правилу последнего шага.
            Наибольшие и наименьшие суммы считают в двух отдельных таблицах.
            Пройди заполнение по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.gridFillStepper}
            label={"Заполнение таблиц максимума и минимума на поле 4 × 4"}
          />
          <Typography.Text>
            В D4 получилось 35 — это наибольшая сумма маршрута, и 25 —
            наименьшая. Маршруты 31 и 26 из начала урока лежат между ними.
          </Typography.Text>
          <Typography.Text>
            Такой способ — решить задачу для каждой клетки и записать ответы в
            таблицу — называют динамическим программированием. Слово
            «программирование» тут историческое: считать можно и в Excel, и
            руками.
          </Typography.Text>
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
                key: "Маршрут",
                note: <>клетки от старта до финиша, сумма — их монеты</>,
              },
              {
                key: "Последний шаг",
                note: <>при ходах вправо и вниз — слева или сверху</>,
              },
              {
                key: "Правило клетки",
                note: <>монета + лучшая из сумм соседей слева и сверху</>,
              },
              {
                key: "Края",
                note: (
                  <>
                    старт — своя монета; верхняя строка и левый столбец —
                    накопленные суммы
                  </>
                ),
              },
              {
                key: "Две таблицы",
                note: <>максимум и минимум считают отдельно</>,
              },
              { key: "Поле 4 × 4", note: <>наибольшая 35, наименьшая 25</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "raschyotnyj-blok",
      navLabel: "Расчётный блок",
      explanation: (
        <>
          <Typography.Text>Где в Excel считать лучшие суммы?</Typography.Text>
          <Typography.Text>
            <strong>
              Под полем, в блоке той же формы: каждой клетке поля соответствует
              своя клетка блока.
            </strong>{" "}
            Поле 4 × 4 занимает <Notation>{"A1:D4"}</Notation>. Оставим пустую
            строку 5, и блок наибольших сумм займёт{" "}
            <Notation>{"A6:D9"}</Notation>: клетке B2 поля соответствует{" "}
            <Notation>{"B7"}</Notation> блока — ровно на 5 строк ниже.
          </Typography.Text>
          <Typography.Text>
            Блок ставят под полем, а не справа: на экзамене поле широкое, а вниз
            места сколько угодно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetyre-formuly",
      navLabel: "Четыре формулы",
      explanation: (
        <>
          <Typography.Text>Какие формулы записать в блок?</Typography.Text>
          <Typography.Text>
            <strong>
              Хватит четырёх: для старта, верхней строки, левого столбца и одной
              внутренней клетки. Остальное заполнит{" "}
              <PythonTerm term="xl-fill">растягивание</PythonTerm>.
            </strong>
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "A6", formula: "=A1" },
              { cell: "B6", formula: "=A6+B1" },
              { cell: "A7", formula: "=A6+A2" },
              { cell: "B7", formula: "=B2+МАКС(A7;B6)" },
            ]}
            label="Формула"
          />
          <ul>
            <li>
              <Notation>{"A6"}</Notation> — старт: монета A1, 2.
            </li>
            <li>
              <Notation>{"B6"}</Notation> — верхняя строка: сумма слева плюс
              монета, 2 + 7 = 9. Растягиваем вправо до{" "}
              <Notation>{"D6"}</Notation>.
            </li>
            <li>
              <Notation>{"A7"}</Notation> — левый столбец: сумма сверху плюс
              монета. Растягиваем вниз до <Notation>{"A9"}</Notation>.
            </li>
            <li>
              <Notation>{"B7"}</Notation> — монета B2 плюс большая из сумм слева
              (<Notation>{"A7"}</Notation>) и сверху (
              <Notation>{"B6"}</Notation>): 1 + 9 = 10. Растягиваем на весь{" "}
              <Notation>{"B7:D9"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            В <Notation>{"D9"}</Notation>, под финишем D4, получится 35 — как и
            руками.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kopirovanie",
      navLabel: "Почему одна формула подходит всем",
      explanation: (
        <>
          <Typography.Text>
            Почему одну и ту же формулу можно растянуть на весь блок?
          </Typography.Text>
          <Typography.Text>
            <strong>
              При копировании ссылки сдвигаются вместе с формулой, и смысл
              сохраняется: «моя монета плюс лучшая из сумм слева и сверху».
            </strong>{" "}
            Такие ссылки называют{" "}
            <PythonTerm term="xl-ref">относительными</PythonTerm>. Копии формулы
            из <Notation>{"B7"}</Notation> на клетку вправо и на клетку вниз:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "B7", formula: "=B2+МАКС(A7;B6)" },
              { cell: "C7", formula: "=C2+МАКС(B7;C6)" },
              { cell: "B8", formula: "=B3+МАКС(A8;B7)" },
            ]}
            label="Формула"
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: знак $">
            <Typography.Text>
              Знак <Notation>{"$"}</Notation> закрепляет адрес. Здесь он только
              мешает: если написать <Notation>{"$B$2"}</Notation>, все клетки
              блока будут прибавлять одну и ту же монету из B2, и в D9 вместо 35
              получится 17.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "blok-minimuma",
      navLabel: "Минимум",
      explanation: (
        <>
          <Typography.Text>А как получить наименьшую сумму?</Typography.Text>
          <Typography.Text>
            <strong>
              Так же, только с МИН. Проще всего записать максимум и заменить{" "}
              <Notation>{"МАКС"}</Notation> на <Notation>{"МИН"}</Notation> в
              блоке командой «Найти и заменить» (
              <KeyCombo keys={["Ctrl", "H"]} />
              ).
            </strong>{" "}
            Блок пересчитается, и в D9 появится минимум. Можно и построить
            второй блок ниже, в <Notation>{"A11:D14"}</Notation>, — в листе ниже
            оба блока. Поменяй любую монету: пересчитаются оба.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист с двумя блоками"} />
          <Typography.Text>
            Ответы — в <Notation>{"D9"}</Notation> и{" "}
            <Notation>{"D14"}</Notation>: 35 и 25. Выбери{" "}
            <Notation>{"C13"}</Notation> — рамки покажут монету C3 поля и двух
            соседей в блоке минимума.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему нельзя скопировать готовый блок"
          >
            <Typography.Text>
              Если скопировать <Notation>{"A6:D9"}</Notation> целиком в{" "}
              <Notation>{"A11:D14"}</Notation>, сдвинутся и ссылки на монеты: в{" "}
              <Notation>{"B12"}</Notation> окажется{" "}
              <Notation>{"=B7+МАКС(A12;B11)"}</Notation>, и вместо монеты 1 из
              B2 прибавится 10 из блока максимума. Поэтому второй блок строят
              теми же четырьмя формулами, а замена МАКС на МИН внутри блока
              ссылки не трогает.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "pole-iz-fajla",
      navLabel: "Поле из файла",
      explanation: (
        <>
          <Typography.Text>Что меняется на поле экзамена?</Typography.Text>
          <Typography.Text>
            <strong>
              Только адреса: те же четыре формулы, блок под полем через пустую
              строку.
            </strong>{" "}
            Поле задачи темы — 20 × 20, оно занимает{" "}
            <Notation>{"A1:T20"}</Notation>. Блок начнём со строки 22:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "A22", formula: "=A1" },
              { cell: "B22", formula: "=A22+B1" },
              { cell: "A23", formula: "=A22+A2" },
              { cell: "B23", formula: "=B2+МАКС(A23;B22)" },
            ]}
            label="Формула"
          />
          <Typography.Text>
            <Notation>{"B22"}</Notation> растягивают вправо до{" "}
            <Notation>{"T22"}</Notation>, <Notation>{"A23"}</Notation> — вниз до{" "}
            <Notation>{"A41"}</Notation>, а <Notation>{"B23"}</Notation> — на
            весь прямоугольник <Notation>{"B23:T41"}</Notation>. Большой
            диапазон удобно выделить, вписав его адрес в{" "}
            <PythonTerm term="xl-address">поле имени</PythonTerm> слева от
            строки формул. Лучшая сумма до правой нижней клетки — в{" "}
            <Notation>{"T41"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            После растягивания открой две-три формулы — первую внутреннюю, из
            середины и последнюю — и проверь, что они ссылаются на свою монету и
            на соседей слева и сверху. Ответ записывай в том порядке, который
            требует условие: у нас — сначала максимум, потом минимум, через
            пробел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "excel-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Блок",
                note: <>под полем через пустую строку, той же формы</>,
              },
              {
                key: "Старт",
                note: <Notation>{"=A1"}</Notation>,
              },
              {
                key: "Края",
                note: (
                  <>
                    <Notation>{"=A6+B1"}</Notation> вправо,{" "}
                    <Notation>{"=A6+A2"}</Notation> вниз
                  </>
                ),
              },
              {
                key: "Внутри",
                note: (
                  <>
                    <Notation>{"=B2+МАКС(A7;B6)"}</Notation> на весь блок
                  </>
                ),
              },
              {
                key: "Минимум",
                note: (
                  <>
                    замена МАКС на МИН (<KeyCombo keys={["Ctrl", "H"]} />) или
                    второй блок
                  </>
                ),
              },
              {
                key: "Ответ",
                note: <>в клетке блока под финишем, в порядке условия</>,
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
    load: () => import("./spreadsheet-optimization.paid.praktika"),
  },
  status: "published",
});
