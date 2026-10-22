// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { SubtopicLink } from "./subtopic-link";

const R = "15-zakony-matematicheskoj-logiki";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Ответ проверяют вторым способом: рассуждение — программой, программу —
          подстановкой найденного A и соседнего.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "1 → 0 и 0 → 1",
            value: <>Импликация 0 → 1 посчитана ложной</>,
            note: <>стрелка ложна только при 1 → 0</>,
          },
          {
            label: "стрелка в Python",
            value: <>Импликация в программе записана как p or q</>,
            note: <>нужно (not p) or q — или функция imp</>,
          },
          {
            label: "ДЕЛ наоборот",
            value: <>ДЕЛ(15, x) прочитано как «x кратно 15»</>,
            note: <>первое число делится на второе: x — делитель 15</>,
          },
          {
            label: "конец отрезка",
            value: <>Кратное на конце отрезка не учтено</>,
            note: <>концы входят в [a; b]; проверь их отдельно</>,
          },
          {
            label: "длина и точки",
            value: <>Вместо длины отрезка посчитаны целые точки</>,
            note: <>длина [25; 40] — 15, а точек 16</>,
          },
          {
            label: "строгий знак",
            value: <>Ответ ровно равен наибольшему значению выражения</>,
            note: <>при A {">"} 30 нужно A = 31, а не 30</>,
          },
          {
            label: "угол области",
            value: <>Наибольшее значение взято при самых больших x и y</>,
            note: <>для каждого x — самый большой y, сравнить все</>,
          },
          {
            label: "break для наибольшего",
            value: <>Для наибольшего A напечатано первое подходящее</>,
            note: <>наибольшее — последнее подходящее, без break</>,
          },
          {
            label: "узкий диапазон",
            value: <>x перебран до 50, а в условии отрезок до 70</>,
            note: <>диапазон x накрывает все числа условия с запасом</>,
          },
          {
            label: "A только положительные",
            value: <>A перебрано с 1, а ответ мог быть меньше</>,
            note: <>для «целого A» начинай с отрицательных</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Задание 15 всегда решается одним вопросом: при каких x все части
          формулы без A ложны? В этих x часть с A обязана быть истинной — отсюда
          и ответ.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
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
              <SubtopicLink routeSlug={R} subtopic="formula-i-parametr">
                Формула с параметром A
              </SubtopicLink>
            ),
            rows: [
              { key: <>p → q</>, note: <>ложна только при 1 → 0</> },
              { key: <>задача темы</>, note: <>решает x = 60 → A = 60</> },
              {
                key: <Notation>{"all(f(x, A) …)"}</Notation>,
                note: <>проверка A программой</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="otrezki-i-mnozhestva">
                Отрезки и множества
              </SubtopicLink>
            ),
            rows: [
              { key: <>A справа</>, note: <>обязательные точки</> },
              { key: <>¬A</>, note: <>разрешённые точки</> },
              { key: <>длина</>, note: <>правый конец минус левый</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="koordinatnaya-ploskost">
                Координатная плоскость
              </SubtopicLink>
            ),
            rows: [
              { key: <>A {">"} выражения</>, note: <>наибольшее в области</> },
              { key: <>A {"<"} выражения</>, note: <>наименьшее в области</> },
              { key: <>строгий знак</>, note: <>граница сдвигается на 1</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="delimost">
                Делимость
              </SubtopicLink>
            ),
            rows: [
              { key: <>на оба</>, note: <>на их НОК</> },
              { key: <>A делит все</>, note: <>их НОД</> },
              { key: <>A — граница</>, note: <>больше самого большого</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="porazryadnaya-konyunkciya">
                Поразрядная конъюнкция
              </SubtopicLink>
            ),
            rows: [
              { key: <>наименьшее A</>, note: <>обязательные веса</> },
              { key: <>наибольшее A</>, note: <>все разрешённые веса</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="novye-usloviya">
                Треугольник, MAX и условия с A
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>новое условие</>, note: <>по определению</> },
              { key: <>числа зависят от A</>, note: <>условие на само A</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Где в формуле A и какие части от A не зависят?</>,
              <>При каких x все части без A ложны?</>,
              <>
                Что эти x требуют от A и что спрашивают: наибольшее, наименьшее,
                длину или сумму?
              </>,
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
    </>
  ),
};

export default content;
