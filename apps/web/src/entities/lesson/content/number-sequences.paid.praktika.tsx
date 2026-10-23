// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
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
import { lessonMedia } from "./number-sequences.paid.praktika.media";
import { SAMPLE_LIST } from "./number-sequences.theme";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink
    routeSlug="17-chislovye-posledovatelnosti"
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
              Задача темы — тройки, в которых не более двух четырёхзначных, а
              сумма не больше наибольшего числа на 25, — прошла через подтемы, и
              каждая добавляла к программе новую строку.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 5"}
          />
          <Typography.Text>
            Каждую версию проверяли на восьми числах 125, 1300, −1250, −2100, 7,
            −325, 2025, 3000 — ответ на них 4 1707. Подтема 6 разбирает длинные
            формулировки, а дополнительный урок — тройки как стороны
            треугольника.
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
              Каждая подтема дала одну проверку или приём, и любое решение
              собирается из них.
            </strong>{" "}
            Сверху — путь от файла к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 17 на одной схеме"}
            flow={[
              { name: "Порог", note: "до цикла, по всему списку" },
              { name: "Перебор", note: "соседние группы с проверками" },
              { name: "Ответ", note: "количество и max или min" },
            ]}
            groups={[
              {
                number: 1,
                title: <Sub slug="chisla-i-proverki">Файл и условие</Sub>,
                rows: [
                  {
                    key: <Notation>{"[int(x) for x in f]"}</Notation>,
                    note: <>файл → список чисел</>,
                  },
                  {
                    key: <Notation>{"x % d == 0"}</Notation>,
                    note: <>кратно d; ноль кратен любому</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="sosednie-gruppy">Соседние пары и тройки</Sub>,
                rows: [
                  {
                    key: <Notation>{"range(len(a) - 2)"}</Notation>,
                    note: <>тройки; пары — len(a) − 1</>,
                  },
                  {
                    key: <Notation>{"sums.append(s)"}</Notation>,
                    note: <>внутри if; ответ — len и max</>,
                  },
                ],
              },
              {
                number: 3,
                title: (
                  <Sub slug="skolko-podhodit">
                    Сколько чисел группы подходит
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"k = int(…) + int(…) + int(…)"}</Notation>,
                    note: <>сколько чисел прошло проверку</>,
                  },
                  {
                    key: (
                      <>
                        <Notation>{"k == 1"}</Notation>,{" "}
                        <Notation>{"k <= 2"}</Notation>
                      </>
                    ),
                    note: <>ровно одно, не более двух</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="cifry-i-znak">Цифры и знак числа</Sub>,
                rows: [
                  {
                    key: <Notation>{"abs(x) % 100 == 25"}</Notation>,
                    note: <>оканчивается на 25, и −325 тоже</>,
                  },
                  {
                    key: <Notation>{"1000 <= abs(x) <= 9999"}</Notation>,
                    note: <>четырёхзначное, в том числе отрицательное</>,
                  },
                ],
              },
              {
                number: 5,
                title: (
                  <Sub slug="vsya-posledovatelnost">
                    Порог по всей последовательности
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"[x for x in a if …]"}</Notation>,
                    note: <>отбор исходных чисел, не их модулей</>,
                  },
                  {
                    key: <>порог</>,
                    note: <>до цикла: max, min, среднее по всему списку</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="chto-proveryat-i-vyvodit">
                    Длинные формулировки
                  </Sub>
                ),
                rows: [
                  {
                    key: <>что выводить</>,
                    note: <>последняя фраза условия, слово за словом</>,
                  },
                ],
              },
              {
                number: 7,
                title: (
                  <Sub slug="treugolniki">Тройка как стороны треугольника</Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>треугольник</>,
                    note: <>каждая сторона меньше суммы двух других</>,
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
              Любое задание 17 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — порог: его находят до перебора по всему списку, а
                не по ходу чтения. Если на коротком списке ответ не сошёлся,
                проверяют условия группы.
              </>
            }
          />
          <Typography.Text>
            Проверка на коротком списке — заменить чтение файла восемью числами
            темы и вывести каждую тройку:
          </Typography.Text>
          <CodeBlock
            code={
              "def four(x):\n    return 1000 <= abs(x) <= 9999\n\n\n" +
              SAMPLE_LIST +
              "\nfor i in range(len(a) - 2):\n    x, y, z = a[i], a[i + 1], a[i + 2]\n    k = int(four(x)) + int(four(y)) + int(four(z))\n    print(i, x, y, z, k, x + y + z)"
            }
            label={"Отладочный вывод троек"}
            language="python"
            output={
              "0 125 1300 -1250 2 175\n1 1300 -1250 -2100 3 -2050\n2 -1250 -2100 7 2 -3343\n3 -2100 7 -325 1 -2418\n4 7 -325 2025 1 1707\n5 -325 2025 3000 2 4700"
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
                label: "граница range",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"range(len(a))"}</Notation>}
                    right={<Notation>{"range(len(a) - 2)"}</Notation>}
                    question="есть ли у последней тройки третий элемент?"
                  />
                ),
                note: <Sub slug="sosednie-gruppy">подтема 2</Sub>,
              },
              {
                label: "«не более двух»",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"k == 2"}</Notation>}
                    right={<Notation>{"k <= 2"}</Notation>}
                    question="подходят ли тройки с 0 и 1 таким числом?"
                  />
                ),
                note: <Sub slug="skolko-podhodit">подтема 3</Sub>,
              },
              {
                label: "цифры без модуля",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"1000 <= x <= 9999"}</Notation>}
                    right={<Notation>{"1000 <= abs(x) <= 9999"}</Notation>}
                    question="−1250 — четырёхзначное?"
                  />
                ),
                note: <Sub slug="cifry-i-znak">подтема 4</Sub>,
              },
              {
                label: "окончание без модуля",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"x % 100 == 25"}</Notation>}
                    right={<Notation>{"abs(x) % 100 == 25"}</Notation>}
                    question="что даёт -325 % 100?"
                  />
                ),
                note: <Sub slug="cifry-i-znak">подтема 4</Sub>,
              },
              {
                label: "модуль в списке",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"[abs(x) for x in a if …]"}</Notation>}
                    right={<Notation>{"[x for x in a if …]"}</Notation>}
                    question="в порог попало исходное число?"
                  />
                ),
                note: <Sub slug="vsya-posledovatelnost">подтема 5</Sub>,
              },
              {
                label: "порог по ходу",
                value: (
                  <FinalMistake
                    wrong="порог считают в том же цикле, что и тройки"
                    right="порог — до цикла, по всему списку"
                    question="известен ли порог, когда проверяю первую тройку?"
                  />
                ),
                note: <Sub slug="vsya-posledovatelnost">подтема 5</Sub>,
              },
              {
                label: "строгое и нестрогое",
                value: (
                  <FinalMistake
                    wrong="«не больше» записано как <"
                    right="«не больше» — <="
                    question="подходит ли тройка с суммой, равной порогу?"
                  />
                ),
                note: <Sub slug="chto-proveryat-i-vyvodit">подтема 6</Sub>,
              },
              {
                label: "что выводить",
                value: (
                  <FinalMistake
                    wrong="вывели наибольшую сумму, а спросили наименьшую"
                    right="выводят ровно то, что просят"
                    question="что в последней фразе условия?"
                  />
                ),
                note: <Sub slug="chto-proveryat-i-vyvodit">подтема 6</Sub>,
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
            Почему порог задачи темы нельзя считать в цикле по тройкам?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Порог — наибольшее число на 25 во всём файле. Пока цикл не дошёл до
            конца, он может ещё вырасти, и ранние тройки проверятся не с тем
            порогом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>Что вернёт -325 % 100 в Python?</Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            75: остаток в Python не отрицателен. Окончание проверяют по
            abs(-325) % 100 = 25.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Сколько четырёхзначных в тройке 1300, −1250, −2100? Подходит ли она
            под «не более двух»?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>Три — не подходит.</Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Сколько соседних троек в списке из 8 чисел?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            6: тройки начинаются с индексов 0–5, range(len(a) − 2).
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от чтения файла до ответа 8358 99821.
        Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Файл, порог, группы, условия, ответ.</>,
          },
          {
            key: "Порог",
            note: <>До цикла, по всему списку, исходными числами.</>,
          },
          {
            key: "Знак",
            note: <>Цифры и окончание — по abs(x), остаток — без модуля.</>,
          },
          {
            key: "Проверка",
            note: <>Восемь чисел вручную — ответ 4 1707.</>,
          },
          {
            key: "Задача темы",
            note: <>Порог 99825 — 8358 троек, наибольшая сумма 99821.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
