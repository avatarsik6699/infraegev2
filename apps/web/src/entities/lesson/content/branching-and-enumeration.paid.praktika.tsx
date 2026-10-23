// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { FinalMistake } from "./final-mistake";
import { lessonMedia } from "./branching-and-enumeration.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink
    routeSlug="13-analiz-hoda-ispolneniya-algoritma"
    subtopic={props.slug}
  >
    {props.children}
  </SubtopicLink>
);

const content: LessonContent.PaidPracticeContent = {
  sections: [
    {
      id: "odna-zadacha",
      navLabel: "Одна задача — вся тема",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Задача темы — сколько программ из команд «+1» и «×2» ведут из 2 в
              20 через 6 и мимо 9 — прошла через первые три подтемы, и каждая
              добавляла к решению новый шаг.
            </strong>{" "}
            Пролистай черновик: точками отмечены строки, которых не было после
            предыдущей подтемы.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 3"}
          />
          <Typography.Text>
            Дальше та же таблица работает с другими командами: условными и
            новыми (подтема 4), убывающими и делением (подтема 5), а
            дополнительные уроки — с группами программ и длиной программы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "karta-temy",
      navLabel: "Карта темы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждая подтема дала одно правило таблицы, и любое решение
              собирается из них.
            </strong>{" "}
            Сверху — путь от команд к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 13 на одной схеме"}
            flow={[
              { name: "Команды", note: "откуда каждая ведёт в n" },
              { name: "Участки", note: "разрез по обязательным, 0 в запретах" },
              { name: "Таблица", note: "1 в старте, ответ в цели" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="komandy-i-derevo">Команды, программы и дерево</Sub>
                ),
                rows: [
                  {
                    key: <>программа</>,
                    note: <>номера команд по порядку: 12 и 21 — разные</>,
                  },
                  {
                    key: <Notation>{"f(x + 1, y) + f(x * 2, y)"}</Notation>,
                    note: <>то же дерево рекурсией</>,
                  },
                ],
              },
              {
                number: 2,
                title: (
                  <Sub slug="tablica-kolichestv">
                    Таблица количества программ
                  </Sub>
                ),
                rows: [
                  {
                    key: <>K(старт) = 1</>,
                    note: <>туда ведёт пустая программа</>,
                  },
                  {
                    key: <>K(n)</>,
                    note: <>сумма K чисел, из которых команды ведут в n</>,
                  },
                  {
                    key: <Notation>{"k[n] += k[n // 2]"}</Notation>,
                    note: <>вклад «×2» — только для чётного n</>,
                  },
                ],
              },
              {
                number: 3,
                title: (
                  <Sub slug="etapy-i-zaprety">
                    Обязательные и запрещённые числа
                  </Sub>
                ),
                rows: [
                  {
                    key: <>через число</>,
                    note: <>участки перемножают</>,
                  },
                  { key: <>без числа</>, note: <>в нём K = 0</> },
                  {
                    key: <>новый участок</>,
                    note: <>снова начинается с 1</>,
                  },
                ],
              },
              {
                number: 4,
                title: (
                  <Sub slug="smysl-novoj-komandy">Новые и условные команды</Sub>
                ),
                rows: [
                  {
                    key: <>2x + 1</>,
                    note: <>в нечётное n из (n − 1) / 2</>,
                  },
                  {
                    key: <>условная команда</>,
                    note: <>вклад только там, где она выполняется</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="ubyvanie-i-delenie">Убывание и деление</Sub>,
                rows: [
                  {
                    key: <>таблица</>,
                    note: <>сверху вниз, обрыв ниже цели</>,
                  },
                  {
                    key: <>÷2 нацело</>,
                    note: <>в n ведут 2n и 2n + 1</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="gruppy-programm">
                    Группы программ и обратные вопросы
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>через A или B</>,
                    note: <>через A + через B − через оба</>,
                  },
                ],
              },
              {
                number: 7,
                title: (
                  <Sub slug="dlina-i-pamyat">Длина и память программы</Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>ровно L команд</>,
                    note: <>в состоянии — остаток длины</>,
                  },
                  {
                    key: <>не подряд</>,
                    note: <>в состоянии — последняя команда</>,
                  },
                ],
              },
            ]}
            caption={
              <>
                Карта темы: путь к ответу сверху и главное из каждой подтемы.
                Номер блока — номер подтемы.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "kak-reshat",
      navLabel: "Как решать",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Любое задание 13 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — таблица: в старте 1, в каждом числе — сумма
                вкладов команд, которые в него ведут. Проверка — вторым
                способом: таблицу программой, программу — таблицей или деревом
                на коротком участке.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "chastye-oshibki",
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
                label: "0 в старте",
                value: (
                  <FinalMistake
                    wrong="K(старт) = 0"
                    right="K(старт) = 1"
                    question="не осталась ли вся таблица нулевой?"
                  />
                ),
                note: <Sub slug="tablica-kolichestv">подтема 2</Sub>,
              },
              {
                label: "округлённое деление",
                value: (
                  <FinalMistake
                    wrong="в 7 по «×2» ведёт 7 // 2 = 3"
                    right="у нечётного числа такого вклада нет"
                    question="3 · 2 — это 7?"
                  />
                ),
                note: <Sub slug="tablica-kolichestv">подтема 2</Sub>,
              },
              {
                label: "совпавшие переходы",
                value: (
                  <FinalMistake
                    wrong="из 2 в 4 ведут «+2» и «×2», а K(2) взят раз"
                    right="слагаемых столько, сколько команд ведут в n"
                    question="сколько команд ведут в это число?"
                  />
                ),
                note: <Sub slug="tablica-kolichestv">подтема 2</Sub>,
              },
              {
                label: "сложили участки",
                value: (
                  <FinalMistake
                    wrong="через 6: 3 + 6"
                    right="3 · 6 — каждая первая часть с каждой второй"
                    question="сколько пар «первая часть — вторая»?"
                  />
                ),
                note: <Sub slug="etapy-i-zaprety">подтема 3</Sub>,
              },
              {
                label: "старое значение",
                value: (
                  <FinalMistake
                    wrong="второй участок начали с K(6) = 3"
                    right="новый участок начинается с 1"
                    question="не умножу ли я на 3 дважды?"
                  />
                ),
                note: <Sub slug="etapy-i-zaprety">подтема 3</Sub>,
              },
              {
                label: "обнулён хвост",
                value: (
                  <FinalMistake
                    wrong="после 9 обнулили всё до 20"
                    right="ноль только в 9: в 12 ведёт прыжок из 6"
                    question="есть ли путь в это число мимо 9?"
                  />
                ),
                note: <Sub slug="etapy-i-zaprety">подтема 3</Sub>,
              },
              {
                label: "отсечение при убывании",
                value: (
                  <FinalMistake
                    wrong="при убывающих командах обрыв по x > y"
                    right="обрывают, когда x < y"
                    question="в какую сторону идёт число?"
                  />
                ),
                note: <Sub slug="ubyvanie-i-delenie">подтема 5</Sub>,
              },
              {
                label: "«или» без поправки",
                value: (
                  <FinalMistake
                    wrong="через 3 или 4: 2 + 2"
                    right="вычесть программы через оба"
                    question="нет ли программ, которые идут через оба?"
                  />
                ),
                note: <Sub slug="gruppy-programm">подтема 6</Sub>,
              },
            ]}
          />
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
            Команды «+1» и «×2». Из каких чисел можно попасть в 14?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Из 13 по «+1» и из 7 по «×2»: K(14) = K(13) + K(7).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Из 2 в 6 ведут 3 программы, из 6 в 20 — 6. Сколько программ из 2 в
            20 через 6?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            3 · 6 = 18: каждая первая часть соединяется с каждой второй.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Траектория не должна содержать 9. Что ставят в таблицу в клетку 9?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            0: через 9 программ нет. Остальные клетки считают как обычно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Команды «−1» и «÷2 нацело». Из каких чисел попадают в 5?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Из 6 по «−1», из 10 и 11 по «÷2»: K(5) = K(6) + K(10) + K(11).
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от дерева до ответа 9. Вот что взять с
        собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Команды, участки, таблица, запреты, проверка.</>,
          },
          {
            key: "Таблица",
            note: <>1 в старте, в n — сумма вкладов команд.</>,
          },
          {
            key: "Участки",
            note: <>Обязательное число делит путь — участки перемножают.</>,
          },
          {
            key: "Запреты",
            note: <>В запрещённом числе 0, остальное как обычно.</>,
          },
          {
            key: "Задача темы",
            note: <>3 программы до 6, 3 после — ответ 9.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
