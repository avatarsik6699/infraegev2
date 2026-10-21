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
import { defineCourseLesson } from "../lib/define-course-lesson";
import { CourseLessonLink, ExamTopicLink } from "./course-links";
import { pythonPracticeLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-practice.media";

/** An exam task on the course map: its number, linked to the topic page. */
const Task: React.FC<{ slug: string; number: string; title: string }> = (
  props,
) => (
  <>
    <ExamTopicLink routeSlug={props.slug}>{props.number}</ExamTopicLink>{" "}
    {props.title}
  </>
);

const Tasks: React.FC<{ items: readonly [string, string, string][] }> = (
  props,
) => (
  <>
    {props.items.map(([slug, number, title], index) => (
      <span key={slug}>
        {index ? "; " : ""}
        <Task slug={slug} number={number} title={title} />
      </span>
    ))}
  </>
);

/** A typical mistake on the switcher: the wrong code, the right one, the question. */
const Mistake: React.FC<{
  wrong: string;
  right: string;
  question: string;
}> = (props) => (
  <>
    <Notation>{props.wrong}</Notation> → <Notation>{props.right}</Notation>.{" "}
    Спроси себя: {props.question}
  </>
);

export const pythonPracticeLesson = defineCourseLesson({
  ...pythonPracticeLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Видеть курс целиком",
    "Порядок работы над задачей",
    "Типичные ошибки",
  ],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Шесть модулей позади: от первого <Notation>{"print"}</Notation> до
            программы, которая читает файл и сама сообщает об ошибках.{" "}
            <strong>
              Здесь весь курс на одной странице: как росла одна задача, какие
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
      navLabel: "Одна задача — весь курс",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сумма и наибольшее из 5, −2, 10, 7 прошли через весь курс — и
              каждый модуль добавлял к решению новый инструмент.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.courseTask}
            label={"Сквозная задача от урока 2.2 до урока 7.1"}
          />
          <Typography.Text>
            Задача не менялась — менялся способ: сначала каждое число отдельным
            именем, потом цикл, список, готовые <Notation>{"sum"}</Notation> и{" "}
            <Notation>{"max"}</Notation>, функция, файл и, наконец, программа,
            которая проверяет вход. Так и растёт умение программировать.
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
              Каждый модуль дал несколько навыков, и любая программа собирается
              из них.
            </strong>{" "}
            Сверху — путь данных в любой программе, ниже — по блоку на модуль.
            Заголовок блока ведёт к его первому уроку.
          </Typography.Text>
          <TopicCheatSheet
            label={"Курс Python на одной схеме"}
            flow={[
              {
                name: "Данные",
                note: "ввод, файл, строка — в числа и коллекции",
              },
              {
                name: "Обработка",
                note: "условия, циклы, функции, готовые средства",
              },
              {
                name: "Результат",
                note: "вывод в нужном формате, проверка крайних случаев",
              },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <CourseLessonLink lessonSlug="pervaya-programma">
                    Старт
                  </CourseLessonLink>
                ),
                rows: [
                  {
                    key: <Notation>{"print(…)"}</Notation>,
                    note: "показать значение; выражение без print молчит",
                  },
                  {
                    key: <Notation>{"x = …"}</Notation>,
                    note: "имя связывается со значением",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"//"}</Notation>, <Notation>{"%"}</Notation>
                      </>
                    ),
                    note: "частное и остаток; / даёт дробное",
                  },
                  {
                    key: <Notation>{"int(input())"}</Notation>,
                    note: "ввод — всегда строка",
                  },
                ],
              },
              {
                number: 2,
                title: (
                  <CourseLessonLink lessonSlug="logicheskie-vyrazheniya">
                    Условия
                  </CourseLessonLink>
                ),
                rows: [
                  {
                    key: (
                      <>
                        <Notation>{"and"}</Notation>,{" "}
                        <Notation>{"or"}</Notation>,{" "}
                        <Notation>{"not"}</Notation>
                      </>
                    ),
                    note: "правая часть — только если нужна",
                  },
                  {
                    key: <Notation>{"if / elif / else"}</Notation>,
                    note: "выполняется одна ветка",
                  },
                  {
                    key: <Notation>{"x == 2 or x == 3"}</Notation>,
                    note: "сравнение в каждой части",
                  },
                ],
              },
              {
                number: 3,
                title: (
                  <CourseLessonLink lessonSlug="while">Циклы</CourseLessonLink>
                ),
                rows: [
                  {
                    key: <Notation>{"while условие"}</Notation>,
                    note: "пока истинно; тело меняет состояние",
                  },
                  {
                    key: <Notation>{"range(a, b)"}</Notation>,
                    note: "от a до b − 1",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"total"}</Notation>,{" "}
                        <Notation>{"best"}</Notation>
                      </>
                    ),
                    note: "накопитель и лучший — по ходу цикла",
                  },
                ],
              },
              {
                number: 4,
                title: (
                  <CourseLessonLink lessonSlug="stroki">
                    Строки и коллекции
                  </CourseLessonLink>
                ),
                rows: [
                  {
                    key: <Notation>{"s[a:b]"}</Notation>,
                    note: "срез, b не входит",
                  },
                  {
                    key: "список",
                    note: "по порядку, меняется на месте",
                  },
                  {
                    key: "словарь",
                    note: "значение по ключу, частоты",
                  },
                  {
                    key: "множество",
                    note: "без повторов, быстрое in",
                  },
                ],
              },
              {
                number: 5,
                title: (
                  <CourseLessonLink lessonSlug="funktsii">
                    Функции
                  </CourseLessonLink>
                ),
                rows: [
                  {
                    key: <Notation>{"def … return"}</Notation>,
                    note: "договорённость: что принимает, что возвращает",
                  },
                  {
                    key: <Notation>{"return a, b"}</Notation>,
                    note: "два результата кортежем",
                  },
                  {
                    key: <Notation>{"sorted(…, key=…)"}</Notation>,
                    note: "порядок по ключу",
                  },
                  {
                    key: <Notation>{"@cache"}</Notation>,
                    note: "рекурсия без повторных вызовов",
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <CourseLessonLink lessonSlug="fayly">
                    Файлы и инструменты
                  </CourseLessonLink>
                ),
                rows: [
                  {
                    key: <Notation>{"with open(…)"}</Notation>,
                    note: "файл по строкам, заголовок отдельно",
                  },
                  {
                    key: <Notation>{"try / except"}</Notation>,
                    note: "только ожидаемая ошибка",
                  },
                  {
                    key: (
                      <>
                        <Notation>{"Counter"}</Notation>,{" "}
                        <Notation>{"product"}</Notation>
                      </>
                    ),
                    note: "частоты и перебор слов готовыми",
                  },
                  {
                    key: <Notation>{"O(n²)"}</Notation>,
                    note: "сначала порядок роста, потом секунды",
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
            {...lessonMedia.solveCycle}
            caption={
              <>
                Главный шаг — состояние: что программа хранит и как меняет на
                каждом элементе. Если проверка не сошлась, возвращаются к
                примеру руками, а не правят код наугад.
              </>
            }
          />
          <Typography.Text>
            Пример руками — это то же, что запуск по шагам в уроках: выписать
            значения переменных после каждой строки. А в проверку всегда входят
            пустой вход, один элемент и отрицательные числа, как в уроке об
            исключениях.
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
                label: "range(a, b)",
                value: (
                  <Mistake
                    wrong="range(1, 10)"
                    right="range(1, 11)"
                    question="какое последнее число нужно? b в range не входит."
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="for-i-range">
                    урок 3.2
                  </CourseLessonLink>
                ),
              },
              {
                label: "x == 2 or 3",
                value: (
                  <Mistake
                    wrong="x == 2 or 3"
                    right="x == 2 or x == 3"
                    question="с чем сравнивается каждая часть or?"
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="logicheskie-vyrazheniya">
                    урок 2.1
                  </CourseLessonLink>
                ),
              },
              {
                label: "best = 0",
                value: (
                  <Mistake
                    wrong="best = 0"
                    right="best = numbers[0]"
                    question="что, если все числа отрицательные?"
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="usloviya">
                    урок 2.2
                  </CourseLessonLink>
                ),
              },
              {
                label: "b = a",
                value: (
                  <Mistake
                    wrong="b = a"
                    right="b = a.copy()"
                    question="нужен второй список или второе имя того же?"
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="spiski">
                    урок 4.2
                  </CourseLessonLink>
                ),
              },
              {
                label: "a = a.sort()",
                value: (
                  <Mistake
                    wrong="a = a.sort()"
                    right="a.sort()"
                    question="метод меняет список или возвращает новый? sort возвращает None."
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="sortirovka-i-poisk">
                    урок 5.4
                  </CourseLessonLink>
                ),
              },
              {
                label: "int(2.9)",
                value: (
                  <Mistake
                    wrong="int(2.9)"
                    right="round(2.9)"
                    question="отбросить дробную часть или округлить? int отбрасывает."
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="vvod-i-vyvod">
                    урок 1.4
                  </CourseLessonLink>
                ),
              },
              {
                label: "заголовок файла",
                value: (
                  <Mistake
                    wrong="sum(int(line) for line in file)"
                    right="count = int(file.readline())"
                    question="первая строка — данные или описание формата?"
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="fayly">
                    урок 6.1
                  </CourseLessonLink>
                ),
              },
              {
                label: "map дважды",
                value: (
                  <Mistake
                    wrong="sum(m), max(m)"
                    right="m = list(map(…))"
                    question="источник одноразовый? map после прохода пуст."
                  />
                ),
                note: (
                  <CourseLessonLink lessonSlug="iteratory-i-generatory">
                    урок 6.3
                  </CourseLessonLink>
                ),
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
              Задания ЕГЭ, которые решают программой, опираются на модули курса.
            </strong>{" "}
            Номер задания ведёт на тему сайта. В теме разобраны приёмы самого
            задания — пары делителей, окна, обход графа, выигрышные позиции, — а
            язык для них уже твой.
          </Typography.Text>
          <LessonTable
            label={"Модули курса и задания ЕГЭ"}
            columns={[{ label: "Модуль курса" }, { label: "Задания ЕГЭ" }]}
            rows={[
              [
                "2–3. Условия и циклы",
                <Tasks
                  key="loops"
                  items={[
                    ["2-tablicy-istinnosti", "2", "таблицы истинности"],
                    [
                      "5-preobrazovanie-zapisey-chisel",
                      "5",
                      "формальное исполнение алгоритма",
                    ],
                    [
                      "6-prostejshie-algoritmy-dlya-ispolnitelej",
                      "6",
                      "простейшие алгоритмы для исполнителей",
                    ],
                    [
                      "12-ispolnenie-algoritma-dlya-ispolnitelya",
                      "12",
                      "исполнение алгоритма",
                    ],
                    [
                      "15-zakony-matematicheskoj-logiki",
                      "15",
                      "законы математической логики",
                    ],
                  ]}
                />,
              ],
              [
                "4. Строки и коллекции",
                <Tasks
                  key="data"
                  items={[
                    ["9-obrabotka-tablicy-chisel", "9", "электронные таблицы"],
                    [
                      "17-chislovye-posledovatelnosti",
                      "17",
                      "числовая последовательность",
                    ],
                    [
                      "24-obrabotka-simvolnyh-strok",
                      "24",
                      "символьная информация",
                    ],
                  ]}
                />,
              ],
              [
                "5. Функции",
                <Tasks
                  key="functions"
                  items={[
                    ["16-rekursiya", "16", "рекуррентные выражения"],
                    [
                      "19-21-vyigryshnaya-strategiya",
                      "19–21",
                      "выигрышная стратегия",
                    ],
                    ["23-analiz-grafov", "23", "анализ графов"],
                    [
                      "26-sortirovka-i-otbor",
                      "26",
                      "обработка данных с сортировкой",
                    ],
                  ]}
                />,
              ],
              [
                "6. Файлы и инструменты",
                <Tasks
                  key="tools"
                  items={[
                    ["8-perebor-slov", "8", "перебор слов"],
                    ["10-ip-adresa-i-maski", "10", "маска подсети"],
                    ["14-sistemy-schisleniya", "14", "системы счисления"],
                    ["25-deliteli-i-maski", "25", "целочисленная информация"],
                    [
                      "27-analiz-dannyh-i-klasterizatsiya",
                      "27",
                      "анализ данных",
                    ],
                  ]}
                />,
              ],
            ]}
          />
          <Typography.Text>
            Кроме тем ЕГЭ, у курса есть три дополнительных урока:{" "}
            <CourseLessonLink lessonSlug="klassy">классы</CourseLessonLink>,{" "}
            <CourseLessonLink lessonSlug="dopolnitelnye-mekhanizmy">
              дополнительные механизмы языка
            </CourseLessonLink>{" "}
            и{" "}
            <CourseLessonLink lessonSlug="chitaemost-i-testy">
              тесты
            </CourseLessonLink>
            . Они не нужны для экзамена, но с них начинаются большие программы.
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
            Нужно для миллиона чисел проверять, встречалось ли число раньше.
            Какую структуру взять и почему?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Множество: <Notation>{"x in seen"}</Notation> — примерно один шаг, а
            в списке — проход по всем элементам.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает <Notation>{"print(list(range(2, 10, 3)))"}</Notation>
            ?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"[2, 5, 8]"}</Notation>: шаг 3, а 10 не входит.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Поиск наибольшего начали с <Notation>{"best = 0"}</Notation>. Что
            получится для <Notation>{"[-4, -2]"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            0 — числа, которого в списке нет. Начинать надо с первого элемента
            или с <Notation>{"None"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Функция <Notation>{"f"}</Notation> печатает результат через{" "}
            <Notation>{"print"}</Notation>, но не возвращает его. Что окажется в{" "}
            <Notation>{"x"}</Notation> после <Notation>{"x = f(3)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"None"}</Notation>: без <Notation>{"return"}</Notation>{" "}
            функция ничего не возвращает.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            В файле первая строка — количество чисел, дальше сами числа. Как
            прочитать его, чтобы количество не попало в сумму?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Сначала <Notation>{"int(file.readline())"}</Notation> — заголовок,
            затем цикл по файлу: он продолжит со второй строки.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Курс пройден: одна задача выросла от трёх <Notation>{"if"}</Notation> до
        программы. Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Путь данных",
            note: <>Данные → обработка → результат в нужном формате.</>,
          },
          {
            key: "Новая задача",
            note: (
              <>
                Понять, пример руками, состояние, код, проверка — и назад к
                примеру, если не сошлось.
              </>
            ),
          },
          {
            key: "Проверка",
            note: <>Пустой вход, один элемент, отрицательные числа, повторы.</>,
          },
          {
            key: "Ошибки",
            note: (
              <>
                Граница <Notation>{"range"}</Notation>, начало максимума,{" "}
                <Notation>{"b = a"}</Notation>, результат{" "}
                <Notation>{"sort"}</Notation>, заголовок файла.
              </>
            ),
          },
          {
            key: "Дальше",
            note: <>Темы ЕГЭ на сайте: язык для них уже есть.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
