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
import { lessonMedia } from "./logic-transformations.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink
    routeSlug="15-zakony-matematicheskoj-logiki"
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
              Задача темы — наибольшее A, при котором ДЕЛ(x, A) ∨ ((x ∈ [50;
              70]) → ¬ДЕЛ(x, 15)) истинна при любом x, — решается в подтеме 1, а
              подтема 4 продолжает её.
            </strong>{" "}
            Пролистай черновик: точками отмечены строки, которых не было в
            предыдущем шаге.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы: от стрелки до ответа"}
          />
          <Typography.Text>
            Остальные подтемы — тот же вопрос «где все части без A ложны» для
            других условий: отрезков и множеств, плоскости, поразрядной
            конъюнкции, а дополнительный урок — для новых условий с A.
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
              Каждая подтема дала правило для своего вида условий, и любое
              решение собирается из них.
            </strong>{" "}
            Сверху — путь от формулы к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 15 на одной схеме"}
            flow={[
              { name: "Стрелки", note: "p → q заменить на ¬p ∨ q" },
              { name: "Где решает A", note: "все части без A ложны" },
              { name: "Ответ", note: "наибольшее, наименьшее, длина, сумма" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="formula-i-parametr">Формула с параметром A</Sub>
                ),
                rows: [
                  { key: <>p → q</>, note: <>ложна только при 1 → 0</> },
                  {
                    key: <>ДЕЛ(n, m)</>,
                    note: <>n делится на m — первое на второе</>,
                  },
                  {
                    key: <Notation>{"all(f(x, A) for x in …)"}</Notation>,
                    note: <>проверка A программой</>,
                  },
                ],
              },
              {
                number: 2,
                title: (
                  <Sub slug="otrezki-i-mnozhestva">Отрезки и множества</Sub>
                ),
                rows: [
                  {
                    key: <>A справа</>,
                    note: <>точки, которые A обязан накрыть</>,
                  },
                  { key: <>¬A</>, note: <>точки, где A быть можно</> },
                  {
                    key: <>длина [a; b]</>,
                    note: <>b − a, а точек b − a + 1</>,
                  },
                ],
              },
              {
                number: 3,
                title: (
                  <Sub slug="koordinatnaya-ploskost">
                    Координатная плоскость
                  </Sub>
                ),
                rows: [
                  {
                    key: <>A {">"} выражения</>,
                    note: <>больше наибольшего в области</>,
                  },
                  {
                    key: <>строгий знак</>,
                    note: <>граница сдвигается на 1</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="delimost">Делимость</Sub>,
                rows: [
                  { key: <>на оба числа</>, note: <>делится на их НОК</> },
                  { key: <>A делит все</>, note: <>наибольшее A — их НОД</> },
                ],
              },
              {
                number: 5,
                title: (
                  <Sub slug="porazryadnaya-konyunkciya">
                    Поразрядная конъюнкция
                  </Sub>
                ),
                rows: [
                  {
                    key: <>наименьшее A</>,
                    note: <>только обязательные двоичные веса</>,
                  },
                  {
                    key: <>наибольшее A</>,
                    note: <>все разрешённые веса</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="novye-usloviya">
                    Треугольник, MAX и условия с A
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>новое условие</>,
                    note: <>читать по определению из условия</>,
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
              Любое задание 15 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — найти x, при которых все части без A ложны: только
                там формула что-то требует от A. Проверка — подставить найденное
                A и соседнее программой.
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
                label: "0 → 1",
                value: (
                  <FinalMistake
                    wrong="0 → 1 посчитали ложью"
                    right="стрелка ложна только при 1 → 0"
                    question="это запрещённая пара 1 → 0?"
                  />
                ),
                note: <Sub slug="formula-i-parametr">подтема 1</Sub>,
              },
              {
                label: "стрелка в Python",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"p or q"}</Notation>}
                    right={<Notation>{"(not p) or q"}</Notation>}
                    question="где отрицание левой части?"
                  />
                ),
                note: <Sub slug="formula-i-parametr">подтема 1</Sub>,
              },
              {
                label: "ДЕЛ наоборот",
                value: (
                  <FinalMistake
                    wrong="ДЕЛ(15, x) — «x кратно 15»"
                    right="15 делится на x: x — делитель 15"
                    question="какое число делится на какое?"
                  />
                ),
                note: <Sub slug="formula-i-parametr">подтема 1</Sub>,
              },
              {
                label: "длина и точки",
                value: (
                  <FinalMistake
                    wrong="длина [25; 40] — 16"
                    right="длина 15, точек 16"
                    question="спрашивают длину или число точек?"
                  />
                ),
                note: <Sub slug="otrezki-i-mnozhestva">подтема 2</Sub>,
              },
              {
                label: "строгий знак",
                value: (
                  <FinalMistake
                    wrong="A > 30 — ответ 30"
                    right="A = 31"
                    question="подходит ли само граничное значение?"
                  />
                ),
                note: <Sub slug="koordinatnaya-ploskost">подтема 3</Sub>,
              },
              {
                label: "угол области",
                value: (
                  <FinalMistake
                    wrong="наибольшее — при самых больших x и y"
                    right="для каждого x — свой наибольший y"
                    question="все ли точки области я сравнил?"
                  />
                ),
                note: <Sub slug="koordinatnaya-ploskost">подтема 3</Sub>,
              },
              {
                label: "break для наибольшего",
                value: (
                  <FinalMistake
                    wrong="для наибольшего A — первое подходящее с break"
                    right="последнее подходящее, без break"
                    question="в какую сторону идёт перебор?"
                  />
                ),
                note: <Sub slug="formula-i-parametr">подтема 1</Sub>,
              },
              {
                label: "узкий диапазон",
                value: (
                  <FinalMistake
                    wrong="x перебран до 50, а отрезок до 70"
                    right="диапазон с запасом накрывает все числа условия"
                    question="все ли важные x попали в перебор?"
                  />
                ),
                note: <Sub slug="formula-i-parametr">подтема 1</Sub>,
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
            В задаче темы делитель 15 заменили на 25. Какое наибольшее A теперь?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Кратное 25 на [50; 70] — только 50 (75 уже вне). A делит 50 —
            наибольшее A = 50.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Формула истинна при x = 7 без A. Влияет ли A на ответ при этом x?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Нет: A решает только при тех x, где все части без A ложны.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            A должно делить 60, 75 и 90. Какое наибольшее A?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>НОД(60, 75, 90) = 15.</Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Нужно A {">"} x + y при всех точках области, наибольшее x + y = 30.
            Какое наименьшее целое A?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            31: строгий знак сдвигает границу на 1.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от замены стрелки до ответа 60. Вот
        что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Стрелки, где решает A, требование, ответ, проверка.</>,
          },
          {
            key: "Стрелка",
            note: <>p → q = ¬p ∨ q: ложна только при 1 → 0.</>,
          },
          {
            key: "Главный вопрос",
            note: <>При каких x все части без A ложны?</>,
          },
          {
            key: "Делимость",
            note: <>На оба — НОК, A делит все — НОД.</>,
          },
          {
            key: "Задача темы",
            note: <>Решает только x = 60 — A делит 60, ответ 60.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
