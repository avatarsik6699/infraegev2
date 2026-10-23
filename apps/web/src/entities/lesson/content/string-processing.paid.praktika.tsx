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
import { lessonMedia } from "./string-processing.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="24-obrabotka-simvolnyh-strok" subtopic={props.slug}>
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
              Все подтемы учат одному — проходу по строке, где по дороге помнят
              только нужное; задача темы о самом длинном корректном выражении
              решается в подтеме 6.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Один проход: от цепочки до выражения"}
          />
          <Typography.Text>
            От подтемы к подтеме меняется только то, что помнят: длину цепочки,
            предыдущий символ, место в образце, границы окна. Подтема 5 помнит
            позиции нужных символов, а дополнительный урок — выражения с
            условиями и баланс.
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
              Каждая подтема дала свой способ помнить нужное, и любое решение
              собирается из них.
            </strong>{" "}
            Сверху — путь от файла к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 24 на одной схеме"}
            flow={[
              { name: "Строка", note: "open(…).readline().strip()" },
              { name: "Один проход", note: "что помнить по дороге" },
              { name: "Ответ", note: "длина, позиция или число" },
            ]}
            groups={[
              {
                number: 1,
                title: <Sub slug="stroka-i-cepochka">Строка и цепочка</Sub>,
                rows: [
                  {
                    key: <Notation>{"current"}</Notation>,
                    note: <>длина цепочки, которая кончается здесь</>,
                  },
                  {
                    key: <Notation>{"best"}</Notation>,
                    note: <>обновлять после каждого символа</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="sosedi">Условия на соседей</Sub>,
                rows: [
                  { key: <>запретный символ</>, note: <>сброс до 0</> },
                  { key: <>запретная пара</>, note: <>сброс до 1</> },
                  {
                    key: <Notation>{"range(1, len(s))"}</Notation>,
                    note: <>у первого символа нет соседа слева</>,
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="obrazcy-i-bloki">Образцы и блоки</Sub>,
                rows: [
                  {
                    key: <Notation>{"pattern[current % m]"}</Notation>,
                    note: <>какой символ ждём следующим</>,
                  },
                  {
                    key: <>вхождения</>,
                    note: <>с перекрытиями — не count</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="skolzyashchee-okno">Скользящее окно</Sub>,
                rows: [
                  {
                    key: <>не более K</>,
                    note: <>while count {">"} K двигает левый край</>,
                  },
                  {
                    key: <>ровно K</>,
                    note: <>ответ только при count == K</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="pozicii-i-granicy">Позиции и границы</Sub>,
                rows: [
                  {
                    key: <>K подряд</>,
                    note: <>по списку позиций нужных символов</>,
                  },
                  {
                    key: <>−1 и len(s)</>,
                    note: <>искусственные границы по краям</>,
                  },
                ],
              },
              {
                number: 6,
                title: <Sub slug="chisla-i-vyrazheniya">Числа и выражения</Sub>,
                rows: [
                  {
                    key: <Notation>{"(?:0|[1-9][0-9]*)"}</Notation>,
                    note: <>число без ведущих нулей</>,
                  },
                  {
                    key: <Notation>{"re.finditer"}</Notation>,
                    note: <>все совпадения, длина каждого</>,
                  },
                ],
              },
              {
                number: 7,
                title: (
                  <Sub slug="usloviya-i-balans">
                    Выражения с условиями и баланс
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>баланс</>,
                    note: <>первые появления разности в словаре</>,
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
              Любое задание 24 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — решить, что помнить по дороге: цепочку, окно или
                позиции. Проверка — короткая строка из урока, где ответ виден
                глазами.
              </>
            }
          />
          <Typography.Text>
            Для сложного условия напиши медленную проверку: перебери все куски
            строки из десяти символов и сравни ответ с быстрой программой. Для
            файла такой перебор не годится, а для короткой строки — в самый раз.
          </Typography.Text>
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
              Семь ошибок встречаются чаще других, и каждую ловит один вопрос к
              себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "перевод строки",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"open(…).readline()"}</Notation>}
                    right={<Notation>{"open(…).readline().strip()"}</Notation>}
                    question="нет ли лишнего символа в конце строки?"
                  />
                ),
                note: <Sub slug="stroka-i-cepochka">подтема 1</Sub>,
              },
              {
                label: "best при обрыве",
                value: (
                  <FinalMistake
                    wrong="best обновляют только при разрыве цепочки"
                    right="после каждого символа"
                    question="а если лучшая цепочка — в самом конце?"
                  />
                ),
                note: <Sub slug="stroka-i-cepochka">подтема 1</Sub>,
              },
              {
                label: "s[i − 1] при i = 0",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"range(len(s))"}</Notation>}
                    right={<Notation>{"range(1, len(s))"}</Notation>}
                    question="с кем сравнится первый символ?"
                  />
                ),
                note: <Sub slug="sosedi">подтема 2</Sub>,
              },
              {
                label: "сброс до 0",
                value: (
                  <FinalMistake
                    wrong="на запретной паре current = 0"
                    right="current = 1"
                    question="не начинает ли второй символ новую цепочку?"
                  />
                ),
                note: <Sub slug="sosedi">подтема 2</Sub>,
              },
              {
                label: "count и перекрытия",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"'ABABA'.count('ABA')"}</Notation>}
                    right="проход с перекрытиями: ABA дважды"
                    question="могут ли вхождения налезать друг на друга?"
                  />
                ),
                note: <Sub slug="obrazcy-i-bloki">подтема 3</Sub>,
              },
              {
                label: "if вместо while",
                value: (
                  <FinalMistake
                    wrong="левую границу окна сдвинули один раз"
                    right="while, пока окно не станет допустимым"
                    question="а если лишняя буква не первая в окне?"
                  />
                ),
                note: <Sub slug="skolzyashchee-okno">подтема 4</Sub>,
              },
              {
                label: "числа как строки",
                value: (
                  <FinalMistake
                    wrong="наибольшее число — max по строкам"
                    right="max по int"
                    question="что больше: '45' или '131'?"
                  />
                ),
                note: <Sub slug="chisla-i-vyrazheniya">подтема 6</Sub>,
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
            Почему все куски строки из миллиона символов не перебрать?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Их около 5 · 10¹¹. Поэтому строку проходят один раз и помнят только
            нужное.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Самая длинная цепочка одинаковых подряд в AABBBBCCAAA?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>4 — BBBB.</Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Окно «не более двух A» в строке BABAACB: какое самое длинное?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            5 — BAACB: в нём две A, а любой кусок длиннее захватывает третью.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Корректное ли выражение 12+05*3? А 12+0*3?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Первое нет: у 05 ведущий ноль. Второе да: 0 — само число без ведущих
            нулей.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: от цепочки одинаковых символов до задачи темы с ответом
        172. Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Строка, что помнить, проход, ответ, проверка.</>,
          },
          {
            key: "Цепочка",
            note: <>current и best после каждого символа.</>,
          },
          {
            key: "Окно",
            note: <>while двигает левый край, пока окно недопустимо.</>,
          },
          {
            key: "Выражения",
            note: <>Регулярное выражение и re.finditer.</>,
          },
          {
            key: "Задача темы",
            note: <>Самое длинное корректное выражение — 172 символа.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
