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
import { lessonMedia } from "./winning-strategy.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="19-21-vyigryshnaya-strategiya" subtopic={props.slug}>
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
              Задача темы — игра с двумя кучами, ходы «+3» и «×2» до 100 и три
              вопроса 19–21 — прошла через подтемы, и каждая добавляла к решению
              новый шаг.
            </strong>{" "}
            Пролистай черновик: точками отмечены строки, которых не было после
            предыдущей подтемы.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 4"}
          />
          <Typography.Text>
            Функция g не меняется от игры к игре — меняются только moves и
            finished. Подтема 5 переносит её на уменьшение кучи и ходы с
            условием, а дополнительный урок — на третий ход и позиции шире
            одного числа.
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
              Каждая подтема дала одно правило, и любое решение собирается из
              них.
            </strong>{" "}
            Сверху — путь от условия к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задания 19–21 на одной схеме"}
            flow={[
              { name: "Правила", note: "moves и finished дословно по условию" },
              { name: "Группы", note: "В1, П1, В2, П2 от конца игры" },
              { name: "Ответ", note: "перебор S и то, что просят" },
            ]}
            groups={[
              {
                number: 1,
                title: <Sub slug="igra-i-strategiya">Игра и вопросы 19–21</Sub>,
                rows: [
                  { key: <>свой ход</>, note: <>хватает одного удачного</> },
                  {
                    key: <>ход соперника</>,
                    note: <>годиться должны все его ходы</>,
                  },
                  {
                    key: <>неудачный ход Пети</>,
                    note: <>возможность, а не гарантия</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="pozicii-ot-konca">Позиции от конца игры</Sub>,
                rows: [
                  { key: <>В1</>, note: <>есть ход, который кончает игру</> },
                  { key: <>П1</>, note: <>все ходы ведут в В1</> },
                  {
                    key: <>В2</>,
                    note: <>не В1, есть ход в П1 — задание 20</>,
                  },
                  {
                    key: <>П2</>,
                    note: <>не П1, все ходы в В1 или В2 — задание 21</>,
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="programma">Программа</Sub>,
                rows: [
                  {
                    key: <Notation>{"any / all"}</Notation>,
                    note: <>свой ход / ход соперника</>,
                  },
                  {
                    key: <Notation>{"@cache"}</Notation>,
                    note: <>каждая позиция считается один раз</>,
                  },
                  {
                    key: <Notation>{"mistake"}</Notation>,
                    note: <>неудачный ход Пети — задание 19</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="dve-kuchi">Две кучи</Sub>,
                rows: [
                  { key: <>(a, b)</>, note: <>позиция — пара, а не сумма</> },
                  {
                    key: <>четыре хода</>,
                    note: <>каждая операция с каждой кучей</>,
                  },
                ],
              },
              {
                number: 5,
                title: (
                  <Sub slug="umenshenie-i-usloviya">
                    Уменьшение кучи и ходы с условием
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"s // 2"}</Notation>,
                    note: <>округление вниз; вверх — (s + 1) // 2</>,
                  },
                  {
                    key: <>наибольшее S</>,
                    note: <>граница — самый быстрый путь до порога</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="pozitsiya-shire">
                    Третий ход и позиция шире числа
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  { key: <>В3, П3</>, note: <>ещё один шаг от конца</> },
                  {
                    key: <>(s, last)</>,
                    note: <>позиция помнит последний ход</>,
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
              Любые задания 19–21 решаются одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — прочитать вопрос: возможность это или гарантия,
                второй ход Пети или второй ход игры. Проверка — маленькая игра
                «+1 или ×2 до 21»: если ответы на ней не сошлись, ошибка в
                правилах программы.
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
                label: "партия вместо стратегии",
                value: (
                  <FinalMistake
                    wrong="нашли удачную партию — победа гарантирована"
                    right="на ходе соперника проверяют все его ходы"
                    question="а если соперник ответит иначе?"
                  />
                ),
                note: <Sub slug="igra-i-strategiya">подтема 1</Sub>,
              },
              {
                label: "неудачный ход как гарантия",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"g(s) == -1"}</Notation>}
                    right={<Notation>{"mistake(s)"}</Notation>}
                    question="спрашивают о гарантии или о возможности?"
                  />
                ),
                note: <Sub slug="igra-i-strategiya">подтема 1</Sub>,
              },
              {
                label: "второй ход",
                value: (
                  <FinalMistake
                    wrong="«Петя выиграл вторым ходом» — два хода игры"
                    right="второй ход Пети — третий ход игры"
                    question="чей это ход по счёту?"
                  />
                ),
                note: <Sub slug="pozicii-ot-konca">подтема 2</Sub>,
              },
              {
                label: "сравнение в finished",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"a + b > 100"}</Notation>}
                    right={<Notation>{"a + b >= 100"}</Notation>}
                    question="«не менее» — это ≥?"
                  />
                ),
                note: <Sub slug="programma">подтема 3</Sub>,
              },
              {
                label: "сумма вместо пары",
                value: (
                  <FinalMistake
                    wrong="позиция двух куч — их сумма"
                    right="позиция — пара (a, b)"
                    question="одинаковы ли ходы из (7, 10) и (10, 7)?"
                  />
                ),
                note: <Sub slug="dve-kuchi">подтема 4</Sub>,
              },
              {
                label: "округление",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"round(s / 2)"}</Notation>}
                    right={<Notation>{"s // 2"}</Notation>}
                    question="вниз или вверх сказано в условии?"
                  />
                ),
                note: <Sub slug="umenshenie-i-usloviya">подтема 5</Sub>,
              },
              {
                label: "граница для наибольшего",
                value: (
                  <FinalMistake
                    wrong="наибольшее S — перебором до случайного числа"
                    right="граница — самый быстрый путь до порога"
                    question="почему больше S не бывает?"
                  />
                ),
                note: <Sub slug="umenshenie-i-usloviya">подтема 5</Sub>,
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
            В позиции все ходы ведут в позиции В1. Кто выигрывает и к какой
            группе она относится?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            П1: какой бы ход ни сделал игрок, соперник сразу заканчивает игру.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Чем вопрос задания 19 отличается от заданий 20 и 21?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В 19 — возможность: Петя ошибся, хватит одной такой партии. В 20 и
            21 — гарантия при любой игре соперника.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему в программе свой ход проверяют через any, а ход соперника —
            через all?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Игроку достаточно одного удачного хода, а против соперника должны
            сработать все его ответы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Сколько ходов из позиции (7, 10) в задаче темы?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Четыре: (10, 10), (14, 10), (7, 13), (7, 20).
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от смысла вопросов до ответов 24; 23
        42; 39. Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Правила, вопрос, группы, программа, ответ.</>,
          },
          {
            key: "Ходы",
            note: <>Свой — хватит одного, соперника — все.</>,
          },
          {
            key: "Группы",
            note: <>В2 — задание 20, П2 — задание 21, mistake — 19.</>,
          },
          {
            key: "Программа",
            note: <>Меняются только moves и finished.</>,
          },
          {
            key: "Задача темы",
            note: <>19 — 24, 20 — 23 и 42, 21 — 39.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
