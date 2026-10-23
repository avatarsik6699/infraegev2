import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { executorsLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./executors.media";
import { Program, THEME_TASK, ThemeTable } from "./executors.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const R = "12-ispolnenie-algoritma-dlya-ispolnitelya";

export const executorsLesson = defineLesson({
  ...executorsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Выполнять таблицу машины Тьюринга такт за тактом вручную и программой run_tm",
    "Решать обратные задачи однократного прохода через количества символов",
    "Читать действие таблицы над двоичной записью числа по разрядам",
    "Описывать неизменную часть и хвост слова и находить наибольший и наименьший вход",
    "Делить таблицу из нескольких состояний на фазы и выводить результат для любой длины",
    "Для редких задач — наибольшая и наименьшая сумма и простота результата (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "lenta-i-komanda",
      title: "Лента, команда и такт",
      lead: "Что такое лента, головка и команда машины и как выполнять таблицу такт за тактом — вручную и программой.",
      conceptIds: [
        "kak-ustroena-tema-12",
        "lenta-i-golovka",
        "komanda",
        "trassa",
        "lenta-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              В ячейке 5 записан <Notation>{"0"}</Notation>, головка на ней в
              состоянии <Notation>{"q1"}</Notation>, выбрана команда{" "}
              <Notation>{"1, L, q2"}</Notation>. Что будет в ячейке 5, где
              окажется головка и в каком состоянии?
            </>
          ),
          reveal: (
            <>
              В ячейке 5 — единица, головка на ячейке 4, состояние{" "}
              <Notation>{"q2"}</Notation>: запись идёт до сдвига.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Та же ситуация, команда <Notation>{"1, S, q2"}</Notation>. Что
              изменится на ленте?
            </>
          ),
          reveal: (
            <>
              В ячейке 5 появится единица, головка останется на ней, и машина
              остановится: при <Notation>{"S"}</Notation> запись тоже
              выполняется.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Таблица задачи темы получает слово <Notation>{"1000"}</Notation>.
              Какое слово получится и сколько будет тактов?
            </>
          ),
          reveal: (
            <>
              <Notation>{"0111"}</Notation>, пять тактов: вход, три нуля стали
              единицами, единица стала нулём с остановкой.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Что будет, если таблицу задачи темы запустить в{" "}
              <Notation>{"q0"}</Notation> с головкой на последней цифре слова{" "}
              <Notation>{"10100"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Для пары (<Notation>{"q0"}</Notation>, <Notation>{"0"}</Notation>)
              команды нет: такой запуск условием не предусмотрен, головка должна
              начинать в пустой ячейке.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Что вернёт <Notation>{"tape.get(7, 'λ')"}</Notation>, если{" "}
              <Notation>{"tape = {0: '1'}"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"'λ'"}</Notation>: ячейки 7 в словаре нет, значит, она
              пустая.
            </>
          ),
        },
      ],
    },
    {
      slug: "prohod-i-kolichestva",
      title: "Однократный проход и количества",
      lead: "Таблицы, которые меняют каждый символ один раз, и что по результату можно сказать о входе.",
      conceptIds: [
        "odnokratnyj-prohod",
        "kolichestva-simvolov",
        "dva-v-odin",
        "uslovie-na-rezultat",
        "summa-rezultata",
        "prohod-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Таблица заменяет 0 → 2, 1 → 0, 2 → 1. Что получится из строки{" "}
              <Notation>{"0120"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"2012"}</Notation>: каждая цифра меняется сама по себе.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              После той же замены в строке четыре нуля, одна единица и две
              двойки. Сколько единиц было до замены?
            </>
          ),
          reveal: <>4: конечный ноль получается только из единицы.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Таблица заменяет 5 и 7 на 1, а 9 на 0. Сколько разных строк могли
              дать результат <Notation>{"11010"}</Notation>?
            </>
          ),
          reveal: (
            <>8: каждая из трёх единиц — пятёрка или семёрка, 2 · 2 · 2.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              При той же замене результат из 6 символов чередуется. Найди
              наименьшую сумму цифр исходной строки.
            </>
          ),
          reveal: (
            <>42: три единицы из пятёрок и три нуля из девяток, 15 + 27.</>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему при замене 5 → 1 и 7 → 1 по результату нельзя узнать число
              пятёрок?
            </>
          ),
          reveal: (
            <>
              Обе цифры дают единицу: известна только сумма количеств пятёрок и
              семёрок.
            </>
          ),
        },
      ],
    },
    {
      slug: "slovo-i-chislo",
      title: "Двоичное число на ленте",
      lead: "Как читать строку на ленте как двоичное число: таблица задачи темы вычитает единицу, другие — прибавляют, дописывают и меняют цифры.",
      access: "paid",
      conceptIds: [
        "minus-odin",
        "slovo-i-chislo",
        "pripisyvanie",
        "inversiya",
        "pribavlenie-edinicy",
        "slovo-itogo",
      ],
      paid: {
        outline: [
          { id: "minus-odin", navLabel: "Минус один" },
          { id: "slovo-i-chislo", navLabel: "Слово и число" },
          { id: "pripisyvanie", navLabel: "Цифра слева и справа" },
          { id: "inversiya", navLabel: "Инверсия" },
          { id: "pribavlenie-edinicy", navLabel: "Плюс один" },
          { id: "slovo-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что таблица задачи темы делает с числом, если на ленте его
              двоичная запись?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./executors.paid.slovo-i-chislo"),
      },
    },
    {
      slug: "hvost-i-obratnaya-zadacha",
      title: "Хвост и обратная задача",
      lead: "Какую часть строки меняет таблица задачи темы — и ответ: 11 нулей.",
      access: "paid",
      conceptIds: [
        "hvost",
        "otkuda-nuli",
        "otvet-zadachi",
        "osobye-sluchai",
        "hvost-itogo",
      ],
      paid: {
        outline: [
          { id: "hvost", navLabel: "Хвост" },
          { id: "otkuda-nuli", navLabel: "Откуда нули" },
          { id: "otvet-zadachi", navLabel: "Ответ задачи темы" },
          { id: "osobye-sluchai", navLabel: "Особые случаи" },
          { id: "hvost-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Вернёмся к задаче темы: строка из 12 символов, после работы
              таблицы ровно 5 нулей. Сколько нулей могло быть до?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./executors.paid.hvost-i-obratnaya-zadacha"),
      },
    },
    {
      slug: "sostoyaniya-i-fazy",
      title: "Состояния и фазы",
      lead: "Таблицы из нескольких состояний: этапы работы, результат для любой длины и состояние как память.",
      access: "paid",
      conceptIds: [
        "fazy-raboty",
        "rezultat-dlya-lyuboj-dliny",
        "razryady-na-krayah",
        "sostoyanie-kak-pamyat",
        "fazy-itogo",
      ],
      paid: {
        outline: [
          { id: "fazy-raboty", navLabel: "Фазы работы" },
          {
            id: "rezultat-dlya-lyuboj-dliny",
            navLabel: "Результат для любой длины",
          },
          { id: "razryady-na-krayah", navLabel: "Цифры на краях" },
          { id: "sostoyanie-kak-pamyat", navLabel: "Состояние как память" },
          { id: "fazy-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что сделает таблица из четырёх состояний со словом{" "}
              <Notation>{"101"}</Notation>?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./executors.paid.sostoyaniya-i-fazy"),
      },
    },
    {
      slug: "ogranicheniya-na-summu",
      title: "Сумма, простота и ограничения на количества",
      lead: "Как найти наименьшую или наибольшую сумму цифр, считая количества символов, а не строки.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "summa-pri-ogranicheniyah",
        "naimenshaya-summa",
        "naibolshaya-summa",
        "prostaya-summa",
        "summa-itogo",
      ],
      paid: {
        outline: [
          {
            id: "summa-pri-ogranicheniyah",
            navLabel: "Сумма через количества",
          },
          { id: "naimenshaya-summa", navLabel: "Наименьшая сумма" },
          { id: "naibolshaya-summa", navLabel: "Наибольшая сумма" },
          { id: "prostaya-summa", navLabel: "Простая сумма" },
          { id: "summa-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Дополнительный урок — для продвинутых: такие вопросы редки.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./executors.paid.ogranicheniya-na-summu"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-12",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 12 дана машина, которая по таблице команд переписывает
            символы на ленте. Нужно понять, что она делает со строкой, и
            ответить на вопрос о результате — или о том, какой могла быть
            исходная строка. Вот задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <ThemeTable />
          <Typography.Text>
            <strong>
              Прогонять машину по всей ленте не нужно: достаточно выполнить
              несколько тактов, понять, что таблица делает с любой строкой, — и
              ответ получится рассуждением.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "12 символов 0 или 1, остальные ячейки — λ",
                "на ленте строка из 12 цифр, вокруг пустые ячейки",
              ],
              [
                "головка справа от последовательности, в состоянии q0",
                "машина начинает сразу за последней цифрой",
              ],
              [
                "программа задана таблицей",
                "в каждой клетке: что записать, куда сдвинуться, в какое состояние перейти",
              ],
              ["после выполнения ровно 5 нулей", "так стало в конце"],
              [
                "наибольшее количество нулей в исходной",
                "вопрос обратный: каким мог быть вход",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем — у каждой своя страница. Идём по ним
            по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Лента, команда и такт</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="prohod-i-kolichestva">
                Однократный проход и количества
              </SubtopicLink>{" "}
              — таблицы, которые меняют каждый символ один раз.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="slovo-i-chislo">
                Двоичное число на ленте
              </SubtopicLink>{" "}
              — что таблица задачи темы делает с числом.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="hvost-i-obratnaya-zadacha">
                Хвост и обратная задача
              </SubtopicLink>{" "}
              — ответ задачи темы: 11.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="sostoyaniya-i-fazy">
                Состояния и фазы
              </SubtopicLink>{" "}
              — таблицы из нескольких состояний.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="ogranicheniya-na-summu">
                Сумма, простота и ограничения на количества
              </SubtopicLink>{" "}
              — дополнительный урок для редких вопросов.
            </li>
          </ol>
          <Typography.Text>
            Таблицу можно выполнить и вручную, и программой — выбирай вкладку
            «Вручную» или «Python». Программа помогает проверить ответ на
            коротких строках, но экзаменационную ленту из сотен символов
            перебором не решить: сначала нужно понять, что делает таблица.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "lenta-i-golovka",
      navLabel: "Лента и головка",
      explanation: (
        <>
          <Typography.Text>Что видит машина в начале работы?</Typography.Text>
          <Typography.Text>
            <strong>
              Лента — ряд ячеек, в каждой ровно один символ; λ — пустой символ,
              а не цифра 0. Головка читает одну ячейку и находится в одном
              состоянии.
            </strong>{" "}
            Возьмём короткое слово <Notation>{"10100"}</Notation>. Пронумеруем
            ячейки с цифрами от 0 до 4 — это наши метки для решения. Головка
            стоит в ближайшей пустой ячейке справа, на ячейке 5, в состоянии{" "}
            <Notation>{"q0"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmTape10100_3b536b}
            caption={
              <>
                Слово 10100 в ячейках 0–4, вокруг — пустые ячейки λ. Головка над
                ячейкой 5, состояние q0.
              </>
            }
          />
          <Typography.Text>
            Состояние — режим работы, а не номер шага:{" "}
            <Notation>{"q0"}</Notation> — состояние, в котором машина начинает,
            а дальше она может много тактов подряд оставаться в одном состоянии.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: бесконечная лента">
            <Typography.Text>
              За записанными символами в обе стороны всегда есть пустые ячейки,
              поэтому машина может писать левее ячейки 0 — у неё будут
              отрицательные номера. Запись λ стирает символ, но ячейка остаётся
              на месте, соседние не сдвигаются.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "komanda",
      navLabel: "Команда",
      explanation: (
        <>
          <Typography.Text>
            Что означает команда <Notation>{"0, L, q3"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Команда — тройка: что записать в текущую ячейку, куда сдвинуться и
              в какое состояние перейти. Запись всегда идёт до сдвига.
            </strong>{" "}
            <Notation>{"0, L, q3"}</Notation>: записать 0 в ту ячейку, где
            головка стоит сейчас, сдвинуться на одну ячейку влево, перейти в{" "}
            <Notation>{"q3"}</Notation>.
          </Typography.Text>
          <LessonTable
            label={"Второй элемент команды"}
            columns={[{ label: "Обозначение" }, { label: "Действие" }]}
            rows={[
              [<Notation key="L">{"L"}</Notation>, "сдвиг на ячейку влево"],
              [<Notation key="R">{"R"}</Notation>, "сдвиг на ячейку вправо"],
              [<Notation key="N">{"N"}</Notation>, "остаться на месте"],
              [
                <Notation key="S">{"S"}</Notation>,
                "записать символ и остановиться",
              ],
            ]}
          />
          <Typography.Text>
            Команду выбирают по паре «состояние, прочитанный символ»: строка
            таблицы — состояние, столбец — символ. Команда{" "}
            <Notation>{"1, S, q2"}</Notation> сначала запишет единицу и только
            потом остановит машину: остановочный такт тоже меняет ленту и тоже
            считается.
          </Typography.Text>
          <Typography.Text>
            Прочерк в таблице — пара, которая при правильном запуске не
            встретится. Это не команда остановки: если ты в неё попал, проверь
            начальное положение и предыдущие такты.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "trassa",
      navLabel: "Трасса",
      explanation: (
        <>
          <Typography.Text>
            Что таблица задачи темы сделает со словом{" "}
            <Notation>{"10100"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              За один такт машина выполняет одну клетку таблицы — ту, что стоит
              на пересечении текущего состояния и символа под головкой.
            </strong>
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <LessonStepper
                      {...lessonMedia.tmTrace10100_q0Lq1q1Sq11Lq10Sq1}
                      label={
                        "Таблица задачи темы на слове 10100 такт за тактом"
                      }
                    />
                    <LessonTable
                      label={"Такты таблицы задачи темы на слове 10100"}
                      columns={[
                        { label: "Такт" },
                        { label: "Состояние, ячейка, символ" },
                        { label: "Команда" },
                        { label: "Слово после" },
                      ]}
                      rows={[
                        [
                          "1",
                          <Notation key="a">{"q0, 5, λ"}</Notation>,
                          <Notation key="b">{"λ, L, q1"}</Notation>,
                          <Notation key="c">{"10100"}</Notation>,
                        ],
                        [
                          "2",
                          <Notation key="a">{"q1, 4, 0"}</Notation>,
                          <Notation key="b">{"1, L, q1"}</Notation>,
                          <Notation key="c">{"10101"}</Notation>,
                        ],
                        [
                          "3",
                          <Notation key="a">{"q1, 3, 0"}</Notation>,
                          <Notation key="b">{"1, L, q1"}</Notation>,
                          <Notation key="c">{"10111"}</Notation>,
                        ],
                        [
                          "4",
                          <Notation key="a">{"q1, 2, 1"}</Notation>,
                          <Notation key="b">{"0, S, q1"}</Notation>,
                          <Notation key="c">{"10011"}</Notation>,
                        ],
                      ]}
                    />
                    <Typography.Text>
                      Получилось <Notation>{"10011"}</Notation>, головка
                      остановилась на ячейке 2, тактов четыре — остановочный
                      тоже считается. Нули справа стали единицами, встреченная
                      единица — нулём, левее ничего не изменилось.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Таблицу удобно хранить{" "}
                      <PythonTerm term="dict">словарём</PythonTerm>: ключ — пара
                      «состояние, символ» (
                      <PythonTerm term="tuple">кортеж</PythonTerm>), значение —
                      тройка команды. Ленту — тоже словарём «номер ячейки →
                      символ»;{" "}
                      <PythonTerm term="dictget">
                        <Notation>{"tape.get(pos, 'λ')"}</Notation>
                      </PythonTerm>{" "}
                      возвращает λ для ячейки, которой нет в словаре. Каждый
                      проход <PythonTerm term="while">цикла while</PythonTerm> —
                      один такт:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runTm}
                      label={"Таблица задачи темы на слове 10100 по шагам"}
                    />
                    <Typography.Text>
                      Чтобы запускать любую таблицу на любом слове, оформим то
                      же функцией <Notation>{"run_tm"}</Notation>. Она
                      возвращает итоговое слово без пустых краёв, ячейку
                      остановки и число тактов и пригодится до конца темы:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "def run_tm(word, rules, pos, state='q0'):\n    tape = {}\n    for i in range(len(word)):\n        tape[i] = word[i]\n    steps = 0\n    while True:\n        symbol = tape.get(pos, 'λ')\n        write, move, state = rules[(state, symbol)]\n        tape[pos] = write\n        steps += 1\n        if move == 'S':\n            break\n        if move == 'L':\n            pos -= 1\n        if move == 'R':\n            pos += 1\n    result = ''\n    for i in range(min(tape), max(tape) + 1):\n        result += tape.get(i, 'λ')\n    return result.strip('λ'), pos, steps"
                      }
                      label={"Исполнитель МТ"}
                      language="python"
                    />
                    <CodeBlock
                      code={
                        "rules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', 'λ'): ('λ', 'S', 'q1'),\n    ('q1', '0'): ('1', 'L', 'q1'),\n    ('q1', '1'): ('0', 'S', 'q1'),\n}\nprint(run_tm('10100', rules, 5))"
                      }
                      label={"Таблица задачи темы на слове 10100"}
                      language="python"
                      output={"('10011', 2, 4)"}
                    />
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Головка шла справа налево, но результат читают как обычно — слева
            направо. Строка не переворачивается.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: начальная ячейка и цикл"
          >
            <Typography.Text>
              Начальное положение берут буквально: «в ближайшей пустой ячейке
              справа» и «на последней цифре» — разные запуски. Запуск этой
              таблицы в <Notation>{"q0"}</Notation> на последней цифре сразу
              приводит к прочерку, а <Notation>{"run_tm"}</Notation> сообщит об
              ошибке <Notation>{"KeyError"}</Notation>.
            </Typography.Text>
            <Typography.Text>
              Несколько тактов подряд в <Notation>{"q1"}</Notation> — не цикл:
              головка каждый раз в новой ячейке. Если же в таблице нет пути к{" "}
              <Notation>{"S"}</Notation>, программа будет работать бесконечно —
              на проверке ограничь число тактов.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "lenta-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Лента", note: <>в ячейке один символ, λ — не 0</> },
              {
                key: "Состояние",
                note: <>режим работы; q0 — начало, не остановка</>,
              },
              { key: "Команда", note: <>записать → сдвинуться → состояние</> },
              { key: "S", note: <>записать и остановиться; такт считается</> },
              {
                key: "Прочерк",
                note: <>при правильном запуске не встретится</>,
              },
              {
                key: "Python",
                note: <Notation>{"run_tm(word, rules, pos)"}</Notation>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "odnokratnyj-prohod",
      navLabel: "Однократный проход",
      explanation: (
        <>
          <Typography.Text>
            Что таблица ниже сделает со строкой <Notation>{"111220"}</Notation>?
            Головка начинает в ближайшей пустой ячейке справа, в{" "}
            <Notation>{"q0"}</Notation>.
          </Typography.Text>
          <Program
            label={"Таблица замены 0 → 2, 1 → 0, 2 → 1"}
            symbols={["λ", "0", "1", "2"]}
            rows={[
              ["q0", "λ, L, q1", "—", "—", "—"],
              ["q1", "λ, S, q1", "2, L, q1", "0, L, q1", "1, L, q1"],
            ]}
          />
          <Typography.Text>
            <strong>
              Если в рабочем состоянии каждая команда пишет символ и сдвигает
              головку в одну сторону, машина проходит строку один раз, и каждая
              ячейка меняется сама по себе.
            </strong>{" "}
            Здесь в <Notation>{"q1"}</Notation> 0 → 2, 1 → 0, 2 → 1, головка
            идёт влево до пустой ячейки. Из <Notation>{"111220"}</Notation>{" "}
            получится <Notation>{"000112"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmMap111220_021021}
            caption={
              <>
                Каждая ячейка меняется по своей стрелке: единицы стали нулями,
                двойки — единицами, ноль — двойкой. Порядок ячеек тот же.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Трассу на всей строке писать не нужно: достаточно убедиться,
                    что в <Notation>{"q1"}</Notation> каждая команда сдвигает
                    влево и не меняет состояния, и выписать замену символов.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Функция <Notation>{"run_tm"}</Notation> из подтемы 1
                      подтверждает замену:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "rules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', 'λ'): ('λ', 'S', 'q1'),\n    ('q1', '0'): ('2', 'L', 'q1'),\n    ('q1', '1'): ('0', 'L', 'q1'),\n    ('q1', '2'): ('1', 'L', 'q1'),\n}\nprint(run_tm('111220', rules, 6))"
                      }
                      label={"Замена 0 → 2, 1 → 0, 2 → 1"}
                      language="python"
                      output={"('000112', -1, 8)"}
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
      id: "kolichestva-simvolov",
      navLabel: "Количества символов",
      explanation: (
        <>
          <Typography.Text>
            После этой замены в строке три нуля, две единицы и одна двойка.
            Сколько каких цифр было до?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если разные символы превращаются в разные, по результату можно
              точно сказать, сколько каких символов было во входе.
            </strong>{" "}
            Конечный ноль был единицей, конечная единица — двойкой, конечная
            двойка — нулём. Значит, во входе три единицы, две двойки и один
            ноль. Порядок символов восстанавливать не нужно.
          </Typography.Text>
          <LessonTable
            label={"Что восстанавливается по результату"}
            columns={[
              { label: "Символ результата" },
              { label: "Из какого символа получился" },
            ]}
            rows={[
              ["0", "1"],
              ["1", "2"],
              ["2", "0"],
            ]}
          />
        </>
      ),
    },
    {
      id: "dva-v-odin",
      navLabel: "Два символа в один",
      explanation: (
        <>
          <Typography.Text>
            А если таблица заменяет 5 и 7 на 1, а 9 на 0? Какая строка дала
            результат <Notation>{"101101"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если два исходных символа дают один и тот же результат, по
              результату известна только их общая численность.
            </strong>{" "}
            Каждая конечная единица — пятёрка или семёрка, каждый ноль — точно
            девятка. Разных подходящих строк здесь 2⁴ = 16.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmMap597595_517190}
            caption={
              <>
                Одна из подходящих строк: пятёрки и семёрки стали единицами,
                девятки — нулями. По результату их уже не различить.
              </>
            }
          />
          <Typography.Text>
            Эта свобода и нужна в задачах: когда спрашивают наименьшую или
            наибольшую исходную сумму, для каждой единицы выбирают выгодный
            источник.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uslovie-na-rezultat",
      navLabel: "Условие на результат",
      explanation: (
        <>
          <Typography.Text>
            При той же замене результат из 9 символов чередуется: соседние цифры
            разные. Какая наименьшая сумма цифр могла быть во входе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Условие на результат задаёт количества: чередование из 9 символов
              — это пять единиц и четыре нуля или четыре единицы и пять нулей.
            </strong>{" "}
            Единица выгоднее всего из пятёрки, ноль — только из девятки, поэтому
            лучше больше единиц: 5 · 5 + 4 · 9 = 61. Строка{" "}
            <Notation>{"595959595"}</Notation> даёт{" "}
            <Notation>{"101010101"}</Notation>.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Сравни оба варианта: 5 · 5 + 4 · 9 = 61 и 4 · 5 + 5 · 9 =
                    65. Меньше 61 не бывает: девяток не меньше четырёх, а каждая
                    единица стоит хотя бы 5.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      На коротких строках можно перебрать все входы (
                      <PythonTerm term="product">product</PythonTerm>) и
                      запустить каждый: 3⁹ = 19 683 строки.
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from itertools import product\nrules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', 'λ'): ('λ', 'S', 'q1'),\n    ('q1', '5'): ('1', 'L', 'q1'),\n    ('q1', '7'): ('1', 'L', 'q1'),\n    ('q1', '9'): ('0', 'L', 'q1'),\n}\nbest = None\nfor digits in product('579', repeat=9):\n    word = ''.join(digits)\n    result, pos, steps = run_tm(word, rules, 9)\n    if '00' not in result and '11' not in result:\n        s = sum(int(d) for d in word)\n        if best is None or s < best:\n            best = s\nprint(best)"
                      }
                      label={"Наименьшая сумма перебором"}
                      language="python"
                      output={"61"}
                    />
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: условие на вход">
            <Typography.Text>
              Условие на вход читают дословно. Пусть в результате шесть единиц и
              три нуля, а пятёрок во входе больше, чем семёрок. Для наибольшей
              суммы нужно больше семёрок, но при трёх семёрках пятёрок тоже три
              — не больше. Значит, семёрок две: 4 · 5 + 2 · 7 + 3 · 9 = 61. При
              «не меньше» подошли бы три семёрки, и ответ был бы 63.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "summa-rezultata",
      navLabel: "Сумма результата",
      explanation: (
        <>
          <Typography.Text>
            Строка длины 10 из цифр 0, 1, 2 прошла замену 0 → 2, 1 → 0, 2 → 1,
            сумма цифр результата — 12. Какое наибольшее число двоек могло быть
            во входе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сумму результата выражают через количества входа, а наибольшее или
              наименьшее ищут по границам.
            </strong>{" "}
            Пусть во входе a нулей и c двоек. Нули дают двойки, двойки —
            единицы, единицы — нули: сумма 2a + c = 12, то есть c = 12 − 2a.
            Двоек больше всего при наименьшем a, но нулей и двоек вместе не
            больше 10. При a = 0 вышло бы c = 12, при a = 1 — c = 10 и 11
            символов. При a = 2 — c = 8, ровно 10 символов: подходит.
          </Typography.Text>
          <Typography.Text>
            Ответ 8. Проверка: <Notation>{"0022222222"}</Notation> →{" "}
            <Notation>{"2211111111"}</Notation>, сумма 2 + 2 + 8 = 12.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "prohod-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Однократный проход",
                note: <>каждая ячейка меняется сама по себе</>,
              },
              {
                key: "Количества",
                note: <>по результату — без порядка символов</>,
              },
              {
                key: "Два в один",
                note: <>известна только сумма их количеств</>,
              },
              {
                key: "Условие на результат",
                note: <>задаёт количества: чередование, сумма</>,
              },
              {
                key: "Условие на вход",
                note: <>«больше» и «не меньше» дают разные ответы</>,
              },
              {
                key: "Проверка",
                note: <>вход, на котором ответ достигается</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  finalLead:
    "Вся тема на одной странице: как решилась задача темы, главное из подтем, порядок решения и частые ошибки.",
  paidPractice: {
    sections: [
      { id: "odna-zadacha", navLabel: "Одна задача — вся тема" },
      { id: "karta-temy", navLabel: "Карта темы" },
      { id: "kak-reshat", navLabel: "Как решать" },
      { id: "chastye-oshibki", navLabel: "Частые ошибки" },
    ],
    checkpoint: 4,
    load: () => import("./executors.paid.praktika"),
  },
  status: "published",
});
