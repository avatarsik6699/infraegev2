// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { CourseTypes } from "../course.types";
import { CourseLessonLink, ExamTopicLink } from "./course-links";
import { lessonMedia } from "./excel-summary.paid.media";

/** A lesson of the Excel course, linked from the course map. */
const Lesson: React.FC<{ slug: string; children: React.ReactNode }> = (
  props,
) => (
  <CourseLessonLink courseSlug="excel" lessonSlug={props.slug}>
    {props.children}
  </CourseLessonLink>
);

/** A typical mistake on the switcher: the wrong way, the right one, the question. */
const Mistake: React.FC<{
  wrong: React.ReactNode;
  right: React.ReactNode;
  question: string;
}> = (props) => (
  <>
    {props.wrong} → {props.right}. Спроси себя: {props.question}
  </>
);

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Четыре модуля позади: от адреса ячейки до таблицы, которая сама
            проверяет тысячи строк.{" "}
            <strong>
              Здесь весь курс на одной странице: как росла одна таблица, какие
              навыки ты собрал, как браться за новую задачу и куда идти дальше
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Читай сверху вниз. Если строка карты не вспоминается сразу — ссылка
            ведёт на урок, где это объяснено.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Одна таблица — весь курс",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Таблица покупок прошла через весь курс, и каждый модуль добавлял к
              ней новый инструмент.
            </strong>{" "}
            Пролистай версии: подкрашены ячейки, которых не было в предыдущей, а
            в строке формул — то, что в них записано.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.courseTable_d76f06}
            label={"Таблица покупок от урока 1.1 до урока 5.1"}
          />
          <Typography.Text>
            Данные не менялись — менялись вопросы и способы ответа: сначала
            стоимость одной формулой, потом скидка из одной ячейки, итог,
            признак для каждой покупки, сумма по условию, фильтр и, наконец,
            второй способ, который подтверждает ответ.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Карта навыков",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждый модуль дал несколько навыков, и любая таблица вычислений
              собирается из них.
            </strong>{" "}
            Сверху — путь данных в любой задаче, ниже — по блоку на модуль.
            Заголовок блока ведёт к его первому уроку.
          </Typography.Text>
          <TopicCheatSheet
            label={"Курс Excel на одной схеме"}
            flow={[
              { name: "Данные", note: "числа, текст и даты в ячейках" },
              {
                name: "Вычисления",
                note: "формулы и признаки для каждой строки",
              },
              { name: "Ответ", note: "итог и проверка другим способом" },
            ]}
            groups={[
              {
                number: 1,
                title: <Lesson slug="list-i-yacheyka">Лист и данные</Lesson>,
                rows: [
                  {
                    key: <Notation>{"B3"}</Notation>,
                    note: "адрес: столбец, затем строка",
                  },
                  {
                    key: <Notation>{"B2:D4"}</Notation>,
                    note: "диапазон: 3 строки × 3 столбца",
                  },
                  {
                    key: "число и текст",
                    note: "текст вместо числа функции пропускают",
                  },
                  {
                    key: "CSV",
                    note: "при открытии — верный разделитель",
                  },
                ],
              },
              {
                number: 2,
                title: <Lesson slug="pervye-formuly">Формулы</Lesson>,
                rows: [
                  {
                    key: <Notation>{"=B2*C2"}</Notation>,
                    note: "формула — со знака =",
                  },
                  {
                    key: <Notation>{"$G$2"}</Notation>,
                    note: "адрес не сдвигается при копировании",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"СУММ"}</Notation>,{" "}
                        <Notation>{"СЧЁТ"}</Notation>,{" "}
                        <Notation>{"СРЗНАЧ"}</Notation>
                      </>
                    ),
                    note: "итог диапазона",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"МИН"}</Notation>,{" "}
                        <Notation>{"МАКС"}</Notation>
                      </>
                    ),
                    note: "крайние значения",
                  },
                ],
              },
              {
                number: 3,
                title: <Lesson slug="usloviya">Условия</Lesson>,
                rows: [
                  {
                    key: <Notation>{"=ЕСЛИ(…;1;0)"}</Notation>,
                    note: "признак; сумма признаков — количество",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"И"}</Notation>, <Notation>{"ИЛИ"}</Notation>
                      </>
                    ),
                    note: "все условия или хотя бы одно",
                  },
                  {
                    key: <Notation>{"ОСТАТ(A2;3)=0"}</Notation>,
                    note: "делимость; ЦЕЛОЕ — полные группы",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"СЧЁТЕСЛИ"}</Notation>,{" "}
                        <Notation>{"СУММЕСЛИ"}</Notation>
                      </>
                    ),
                    note: "подсчёт и сумма по критерию",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"ПСТР"}</Notation>,{" "}
                        <Notation>{"ДАТА"}</Notation>
                      </>
                    ),
                    note: "часть текста, дата из чисел",
                  },
                ],
              },
              {
                number: 4,
                title: (
                  <Lesson slug="sortirovka-i-filtr">Таблицы и связи</Lesson>
                ),
                rows: [
                  {
                    key: "сортировка",
                    note: "переставляет строки целиком",
                  },
                  {
                    key: <Notation>{"ПРОМЕЖУТОЧНЫЕ.ИТОГИ"}</Notation>,
                    note: "итог только видимых строк",
                  },
                  {
                    key: <Notation>{"ВПР(…;0)"}</Notation>,
                    note: "свойство по ключу, точное совпадение",
                  },
                  {
                    key: <Notation>{"=СУММ($A$2:A2)"}</Notation>,
                    note: "расчёт из уже вычисленных ячеек",
                  },
                ],
              },
              {
                number: 5,
                title: (
                  <Lesson slug="ot-usloviya-k-tablitse">
                    От условия к таблице
                  </Lesson>
                ),
                rows: [
                  {
                    key: "объект",
                    note: "одна строка, проверка — свой столбец",
                  },
                  {
                    key: "второй способ",
                    note: "признаки и СЧЁТЕСЛИ должны совпасть",
                  },
                ],
              },
            ]}
            caption={
              <>
                Карта курса: путь данных сверху и главное из каждого модуля.
                Номер блока — номер модуля.
              </>
            }
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: русские и английские имена функций курса"
          >
            <Typography.Text>
              В английском Excel функции называются иначе, а аргументы разделяет
              запятая, а не точка с запятой (урок 2.3).
            </Typography.Text>
            <LessonTable
              label={"Функции курса: русское и английское имя"}
              columns={[
                { label: "Русское имя" },
                { label: "Английское имя" },
                { label: "Для чего нужно" },
              ]}
              rows={[
                ["СУММ", "SUM", "Сумма"],
                ["СУММКВ", "SUMSQ", "Сумма квадратов"],
                ["СЧЁТ", "COUNT", "Количество числовых ячеек"],
                ["СЧЁТЗ", "COUNTA", "Количество непустых значений"],
                ["СЧИТАТЬПУСТОТЫ", "COUNTBLANK", "Подсчёт пустот"],
                ["СРЗНАЧ", "AVERAGE", "Среднее арифметическое"],
                ["МИН", "MIN", "Минимум"],
                ["МАКС", "MAX", "Максимум"],
                [
                  "НАИМЕНЬШИЙ",
                  "SMALL",
                  "Элемент по месту в порядке возрастания",
                ],
                ["НАИБОЛЬШИЙ", "LARGE", "Элемент по месту в порядке убывания"],
                ["ЕСЛИ", "IF", "Выбор результата по условию"],
                ["И", "AND", "Все условия истинны"],
                ["ИЛИ", "OR", "Хотя бы одно условие истинно"],
                ["НЕ", "NOT", "Логическое отрицание"],
                ["СЧЁТЕСЛИ", "COUNTIF", "Подсчёт по одному критерию"],
                ["СЧЁТЕСЛИМН", "COUNTIFS", "Подсчёт по нескольким критериям"],
                ["СУММЕСЛИ", "SUMIF", "Сумма по одному критерию"],
                ["СУММЕСЛИМН", "SUMIFS", "Сумма по нескольким критериям"],
                ["СРЗНАЧЕСЛИ", "AVERAGEIF", "Среднее по одному критерию"],
                [
                  "СРЗНАЧЕСЛИМН",
                  "AVERAGEIFS",
                  "Среднее по нескольким критериям",
                ],
                ["ОСТАТ", "MOD", "Остаток от деления"],
                ["ABS", "ABS", "Модуль числа"],
                ["ЦЕЛОЕ", "INT", "Округление вниз до целого"],
                ["ОТБР", "TRUNC", "Отбрасывание дробной части"],
                ["ОКРУГЛ", "ROUND", "Округление до заданного разряда"],
                ["ОКРУГЛВВЕРХ", "ROUNDUP", "Округление от нуля"],
                ["ОКРУГЛВНИЗ", "ROUNDDOWN", "Округление к нулю"],
                ["ВПР", "VLOOKUP", "Поиск в первом столбце диапазона"],
                ["ИНДЕКС", "INDEX", "Получение элемента по позиции"],
                ["ПОИСКПОЗ", "MATCH", "Поиск позиции элемента"],
                [
                  "ПРОМЕЖУТОЧНЫЕ.ИТОГИ",
                  "SUBTOTAL",
                  "Итог с учётом видимости строк",
                ],
                ["СТРОКА", "ROW", "Номер строки"],
                ["ДЛСТР", "LEN", "Длина текста"],
                ["ЛЕВСИМВ", "LEFT", "Начало текста"],
                ["ПРАВСИМВ", "RIGHT", "Конец текста"],
                ["ПСТР", "MID", "Фрагмент текста"],
                ["СЖПРОБЕЛЫ", "TRIM", "Удаление лишних обычных пробелов"],
                ["ПОДСТАВИТЬ", "SUBSTITUTE", "Замена заданного текста"],
                ["СОВПАД", "EXACT", "Сравнение текста с учётом регистра"],
                ["ЗНАЧЕН", "VALUE", "Преобразование числового текста"],
                ["ЕЧИСЛО", "ISNUMBER", "Проверка числового типа"],
                ["ЕТЕКСТ", "ISTEXT", "Проверка текстового типа"],
                ["ДАТА", "DATE", "Построение даты из года, месяца и дня"],
                ["ДЕНЬ", "DAY", "День месяца"],
                ["МЕСЯЦ", "MONTH", "Номер месяца"],
                ["ГОД", "YEAR", "Год"],
                ["ЕСЛИОШИБКА", "IFERROR", "Заданный результат при ошибке"],
              ]}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Новая задача",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Незнакомую задачу решают одним и тем же порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера уроков:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.examOrder_d76f06}
            caption={
              <>
                Главный шаг — столбцы: что вычислить для одной строки и как
                объединить строки. Если проверка не сошлась, возвращаются к
                столбцам на маленьком наборе, а не правят формулы наугад.
              </>
            }
          />
          <Typography.Text>
            Вопрос — это и единица ответа: штуки, записи или разные значения.
            Файл открывают на рабочей копии и сначала смотрят, где заголовки,
            где первая и последняя строки и нет ли чисел, записанных текстом.
          </Typography.Text>
          <Typography.Text>
            Какая программа будет на экзаменационном компьютере, заранее не
            всегда известно. Способы курса держатся на распространённых функциях
            и вспомогательных столбцах, но перед экзаменом потренируйся в том
            редакторе, который будет доступен.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Частые ошибки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Восемь ошибок встречаются чаще других, и каждую ловит один вопрос
              к себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "Адрес без $",
                value: (
                  <Mistake
                    wrong={<Notation>{"=D2*(1-G2)"}</Notation>}
                    right={<Notation>{"=D2*(1-$G$2)"}</Notation>}
                    question="должен ли адрес остаться на месте, когда формулу копируют вниз?"
                  />
                ),
                note: <Lesson slug="kopirovanie-i-dollar">урок 2.2</Lesson>,
              },
              {
                label: "Число текстом",
                value: (
                  <Mistake
                    wrong={<Notation>{"120 руб."}</Notation>}
                    right={<Notation>{"120"}</Notation>}
                    question="в ячейке число или текст? Единицы пишут в заголовке, иначе СУММ пропустит ячейку."
                  />
                ),
                note: <Lesson slug="chto-v-yacheyke">урок 1.3</Lesson>,
              },
              {
                label: "> вместо >=",
                value: (
                  <Mistake
                    wrong={<Notation>{"=ЕСЛИ(A2>60;1;0)"}</Notation>}
                    right={<Notation>{"=ЕСЛИ(A2>=60;1;0)"}</Notation>}
                    question="входит ли граница? «Не меньше 60» — это >=."
                  />
                ),
                note: <Lesson slug="usloviya">урок 3.1</Lesson>,
              },
              {
                label: "ОКРУГЛ вместо ЦЕЛОЕ",
                value: (
                  <Mistake
                    wrong={<Notation>{"=ОКРУГЛ(A2/12;0)"}</Notation>}
                    right={<Notation>{"=ЦЕЛОЕ(A2/12)"}</Notation>}
                    question="нужно ближайшее целое или только полные коробки?"
                  />
                ),
                note: <Lesson slug="chisla">урок 3.2</Lesson>,
              },
              {
                label: "Критерий без &",
                value: (
                  <Mistake
                    wrong={<Notation>{'=СЧЁТЕСЛИ(A2:A7;">E9")'}</Notation>}
                    right={<Notation>{'=СЧЁТЕСЛИ(A2:A7;">"&E9)'}</Notation>}
                    question="критерий — готовый текст или собирается из ячейки?"
                  />
                ),
                note: <Lesson slug="podschet-po-usloviyu">урок 3.3</Lesson>,
              },
              {
                label: "Сортировка столбца",
                value: (
                  <Mistake
                    wrong="отсортирован один столбец"
                    right="отсортирована вся таблица"
                    question="остались ли строки целыми — цена рядом со своим товаром?"
                  />
                ),
                note: <Lesson slug="sortirovka-i-filtr">урок 4.1</Lesson>,
              },
              {
                label: "СУММ после фильтра",
                value: (
                  <Mistake
                    wrong={<Notation>{"=СУММ(C2:C7)"}</Notation>}
                    right={
                      <Notation>{"=ПРОМЕЖУТОЧНЫЕ.ИТОГИ(109;C2:C7)"}</Notation>
                    }
                    question="нужны все строки или только видимые?"
                  />
                ),
                note: <Lesson slug="sortirovka-i-filtr">урок 4.1</Lesson>,
              },
              {
                label: "ВПР без 0",
                value: (
                  <Mistake
                    wrong={<Notation>{"=ВПР(A2;$F$2:$G$9;2)"}</Notation>}
                    right={<Notation>{"=ВПР(A2;$F$2:$G$9;2;0)"}</Notation>}
                    question="нужно точное совпадение ключа? Без 0 ВПР ищет приблизительно."
                  />
                ),
                note: <Lesson slug="poisk-po-klyuchu">урок 4.2</Lesson>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Куда дальше",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Четыре задания ЕГЭ решают таблицей, и каждое опирается на уроки
              курса.
            </strong>{" "}
            Номер задания ведёт на тему сайта: там разобраны приёмы самого
            задания, а таблица для них у тебя уже есть.
          </Typography.Text>
          <LessonTable
            label={"Задания ЕГЭ и уроки курса"}
            columns={[
              { label: "Задание ЕГЭ" },
              { label: "Что делает таблица" },
            ]}
            rows={[
              [
                <span key="3">
                  <ExamTopicLink routeSlug="3-svyazannye-tablicy">
                    3
                  </ExamTopicLink>{" "}
                  базы данных
                </span>,
                "связывает таблицы по ключу и складывает по условию — уроки 3.3 и 4.2",
              ],
              [
                <span key="9">
                  <ExamTopicLink routeSlug="9-obrabotka-tablicy-chisel">
                    9
                  </ExamTopicLink>{" "}
                  электронные таблицы
                </span>,
                "проверяет условия в каждой строке и считает подходящие — уроки 3.1 и 3.3",
              ],
              [
                <span key="18">
                  <ExamTopicLink routeSlug="18-robot-sborshchik-monet">
                    18
                  </ExamTopicLink>{" "}
                  Робот на клетчатом поле
                </span>,
                "находит лучший путь из уже вычисленных соседних клеток — урок 4.3",
              ],
              [
                <span key="22">
                  <ExamTopicLink routeSlug="22-mnogoprocessornye-sistemy">
                    22
                  </ExamTopicLink>{" "}
                  многопроцессорные системы
                </span>,
                "считает время окончания процесса по процессам, от которых он зависит — уроки 4.2 и 4.3",
              ],
            ]}
          />
          <Typography.Text>
            Кроме тем ЕГЭ, у курса есть дополнительный урок{" "}
            <Lesson slug="oformlenie-i-svodnye">
              «Таблица, оформление и сводные»
            </Lesson>
            . Экзамену он не нужен, но с него начинается работа с таблицами вне
            экзамена: отчёты, подсветка, диаграммы.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Формулу <Notation>{"=B2*$C$1"}</Notation> из B2 скопировали в D5.
            Что получится?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=D5*$C$1"}</Notation>: относительный адрес сдвинулся на
            два столбца вправо и три строки вниз, закреплённый остался на месте.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            В A1:A4 стоят 10, «нет», пустая ячейка и 20. Что вернут{" "}
            <Notation>{"=СЧЁТ(A1:A4)"}</Notation> и{" "}
            <Notation>{"=СЧЁТЗ(A1:A4)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2 и 3: <Notation>{"СЧЁТ"}</Notation> считает только числа,{" "}
            <Notation>{"СЧЁТЗ"}</Notation> — все непустые ячейки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В B2 записано <Notation>{"=ЕСЛИ(И(A2>=10;A2<=20);1;0)"}</Notation>.
            Что будет в B2 при A2 = 20 и при A2 = 25?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            1 и 0: 20 входит в промежуток вместе с границей, 25 — нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            <Notation>{"ВПР"}</Notation> вернула <Notation>{"#Н/Д"}</Notation>,
            хотя товар в справочнике есть. Что проверить?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Совпадают ли ключи по-настоящему: число и число, записанное текстом,
            для Excel разные, лишний пробел тоже мешает. И не съехал ли
            справочник при копировании — он должен быть закреплён знаком $.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            После фильтра <Notation>{"СУММ"}</Notation> по столбцу дала больше,
            чем складывается из видимых строк. Почему и чем её заменить?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"СУММ"}</Notation> складывает и скрытые строки. Сумма
            только видимых —{" "}
            <Notation>{"=ПРОМЕЖУТОЧНЫЕ.ИТОГИ(109;…)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Курс пройден: таблица покупок выросла от трёх столбцов данных до ответа,
        который проверяет сам себя. Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Таблица",
            note: <>Объект — строка, свойство или проверка — столбец.</>,
          },
          {
            key: "Формула",
            note: (
              <>
                Одна строка, затем весь столбец; <Notation>{"$"}</Notation> —
                то, что не должно сдвигаться.
              </>
            ),
          },
          {
            key: "Признак",
            note: <>1 или 0 для строки; сумма признаков — количество.</>,
          },
          {
            key: "Новая задача",
            note: <>Вопрос → файл → столбцы → формулы → проверка.</>,
          },
          {
            key: "Дальше",
            note: (
              <>Задания 3, 9, 18 и 22 на сайте: таблица для них уже есть.</>
            ),
          },
        ]}
      />
    </>
  ),
};

export default content;
