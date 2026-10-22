// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./winning-strategy.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Программу проверяют на маленькой игре, где ответы известны: +1 или ×2
          до 21 должна дать 6, [10], [5, 9] и [8].
        </strong>{" "}
        Если получилось другое, ошибка в программе, а не в правилах новой
        задачи. Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "одна партия вместо стратегии",
            value: <>Нашёл удачную партию и решил, что победа гарантирована</>,
            note: <>на ходе соперника проверить все его ходы</>,
          },
          {
            label: "неудачный ход как гарантия",
            value: (
              <>
                В задании 19 про неудачный ход взята группа{" "}
                <Notation>{"g(s) == -1"}</Notation>
              </>
            ),
            note: (
              <>
                неудачный ход — возможность: функция{" "}
                <Notation>{"mistake"}</Notation>
              </>
            ),
          },
          {
            label: "второй ход — второй ход игры",
            value: <>«Петя выиграл вторым ходом» проверено на два хода</>,
            note: <>второй ход Пети — третий ход игры</>,
          },
          {
            label: "сравнение в finished",
            value: (
              <>
                «не менее» записано как <Notation>{">"}</Notation>
              </>
            ),
            note: <>перечитать слова условия: не менее — ≥, более — {">"}</>,
          },
          {
            label: "сумма вместо пары",
            value: <>Позиция двух куч хранится суммой</>,
            note: <>позиция — пара (a, b), ход меняет одну кучу</>,
          },
          {
            label: "округление",
            value: (
              <>
                Вместо округления вниз — <Notation>{"/"}</Notation> или{" "}
                <Notation>{"round"}</Notation>
              </>
            ),
            note: (
              <>
                вниз — <Notation>{"s // 2"}</Notation>, вверх —{" "}
                <Notation>{"(s + 1) // 2"}</Notation>
              </>
            ),
          },
          {
            label: "граница для наибольшего",
            value: <>Наибольшее S найдено перебором до случайного числа</>,
            note: <>граница — самый быстрый спуск до порога</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Задания 19–21 — три вопроса об одной игре: правила записывают в{" "}
          <Notation>{"moves"}</Notation> и <Notation>{"finished"}</Notation>, а
          ответы дают группы позиций от конца игры.
        </strong>{" "}
        Ошибаются чаще не в программе, а в чтении условия: возможность принимают
        за гарантию, второй ход Пети — за второй ход игры, «нет гарантии» — за
        «невозможно».
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задания 19–21 на одной схеме"}
        flow={[
          { name: "Правила", note: "moves и finished дословно по условию" },
          { name: "Группы", note: "g(s): 1, −1, 2, −2 — В1, П1, В2, П2" },
          { name: "Ответ", note: "перебор S и то, что просят: min, два, max" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="igra-i-strategiya">
                Игра и вопросы 19–21
              </SubtopicLink>
            ),
            rows: [
              { key: <>свой ход</>, note: <>хватает одного удачного</> },
              { key: <>ход соперника</>, note: <>годиться должны все</> },
              {
                key: <>неудачный ход Пети</>,
                note: <>возможность: два сильнейших хода подряд</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="pozicii-ot-konca">
                Позиции от конца игры
              </SubtopicLink>
            ),
            rows: [
              { key: <>В1</>, note: <>есть ход, который кончает игру</> },
              { key: <>П1</>, note: <>все ходы в В1</> },
              { key: <>В2</>, note: <>не В1, есть ход в П1</> },
              { key: <>П2</>, note: <>не П1, все ходы в В1 или В2</> },
              { key: <>20 и 21</>, note: <>В2 и П2 начальной позиции</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="programma">
                Программа
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"any / all"}</Notation>,
                note: <>свой ход / ход соперника</>,
              },
              {
                key: <Notation>{"@cache"}</Notation>,
                note: <>каждая позиция один раз</>,
              },
              {
                key: <Notation>{"mistake"}</Notation>,
                note: <>неудачный ход Пети</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="dve-kuchi">
                Две кучи
              </SubtopicLink>
            ),
            rows: [
              { key: <>(a, b)</>, note: <>позиция — кортеж</> },
              {
                key: <>четыре хода</>,
                note: <>каждая операция с каждой кучей</>,
              },
              { key: <>24; 23 42; 39</>, note: <>ответы задачи темы</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="umenshenie-i-usloviya">
                Уменьшение кучи и ходы с условием
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"s // 2"}</Notation>,
                note: <>округление вниз</>,
              },
              { key: <>перебор вверх</>, note: <>от порога</> },
              { key: <>наибольшее S</>, note: <>граница из рассуждения</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="pozitsiya-shire">
                Третий ход и позиция шире числа
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>В3, П3</>, note: <>ещё один шаг от конца</> },
              { key: <>(s, last)</>, note: <>запрет повторить ход</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Какие ходы разрешены и когда игра кончается?</>,
              <>О чём вопрос: о возможности или о гарантии?</>,
              <>
                Что записать в ответ: одно число, два, наименьшее, наибольшее?
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
