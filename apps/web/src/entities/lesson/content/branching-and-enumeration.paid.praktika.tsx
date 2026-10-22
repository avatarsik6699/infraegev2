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

const R = "13-analiz-hoda-ispolneniya-algoritma";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Ответ проверяют вторым способом: таблицу — программой, программу —
          таблицей или деревом на маленьком участке.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "0 в старте",
            value: <>В старте поставлен 0 — вся таблица осталась нулевой</>,
            note: <>в старте 1: туда ведёт пустая программа</>,
          },
          {
            label: "совпавшие переходы",
            value: <>Из 2 в 4 ведут «+2» и «×2», а K(2) учтён один раз</>,
            note: <>слагаемых столько, сколько команд ведут в n</>,
          },
          {
            label: "округлённое деление",
            value: <>Предшественником 7 по «×2» взято 3 — 7 // 2</>,
            note: <>у нечётного числа предшественника по «×2» нет</>,
          },
          {
            label: "сложили участки",
            value: <>Для обязательного 6 участки сложены: 3 + 6 вместо 3 · 6</>,
            note: <>каждая первая часть идёт с каждой второй — перемножить</>,
          },
          {
            label: "старое значение",
            value: (
              <>Второй участок начат с K(6) = 3 и потом ещё умножен на 3</>
            ),
            note: <>новый участок начинается с 1</>,
          },
          {
            label: "обнулён хвост",
            value: <>После запрещённого 9 обнулены все числа до 20</>,
            note: <>в 12 ведёт прыжок из 6: K(12) = 1</>,
          },
          {
            label: "отсечение при убывании",
            value: (
              <>
                При убывающих командах ветка обрывается по x {">"} y — прямо на
                старте
              </>
            ),
            note: <>обрывать при x {"<"} y</>,
          },
          {
            label: "цель раньше запрета",
            value: (
              <>
                В функции x == y проверено раньше запрета — запрещённая цель
                засчитана
              </>
            ),
            note: <>сначала запрет, потом цель</>,
          },
          {
            label: "«или» без поправки",
            value: <>«Через 3 или 4» посчитано как 2 + 2</>,
            note: <>вычесть программы через оба числа</>,
          },
          {
            label: "длина без остатка",
            value: <>Для «ровно пять команд» посчитаны программы всех длин</>,
            note: <>добавить в функцию, сколько команд осталось</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 13 считается одной таблицей: в старте 1, в каждом
          следующем числе — сумма вкладов команд, которые в него ведут;
          обязательное число делит путь на участки, запрещённое получает 0.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 13 на одной схеме"}
        flow={[
          {
            name: "Команды",
            note: "откуда команда ведёт в n, рост или убывание",
          },
          { name: "Участки", note: "разрез по обязательным, 0 в запрещённых" },
          { name: "Таблица", note: "1 в старте, сумма вкладов, ответ в цели" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="komandy-i-derevo">
                Команды и дерево
              </SubtopicLink>
            ),
            rows: [
              { key: <>2 → 6</>, note: <>3 программы: 1111, 12, 211</> },
              { key: <>12 и 21</>, note: <>разные программы</> },
              {
                key: <Notation>{"f(x + 1, y) + f(x * 2, y)"}</Notation>,
                note: <>дерево в коде</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="tablica-kolichestv">
                Таблица количеств
              </SubtopicLink>
            ),
            rows: [
              { key: <>K(n)</>, note: <>K(n − 1) + K(n / 2) для чётного n</> },
              { key: <>6 → 20</>, note: <>6 программ</> },
              {
                key: <Notation>{"k[n] += k[n // 2]"}</Notation>,
                note: <>таблица списком</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="etapy-i-zaprety">
                Участки и запреты
              </SubtopicLink>
            ),
            rows: [
              { key: <>через 6</>, note: <>3 · 6 = 18</> },
              { key: <>без 9</>, note: <>K(9) = 0, на участке 6 → 20 — 3</> },
              { key: <>ответ</>, note: <>3 · 3 = 9</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="smysl-novoj-komandy">
                Новые команды
              </SubtopicLink>
            ),
            rows: [
              { key: <>2x + 1</>, note: <>из (n − 1) / 2 для нечётного n</> },
              { key: <>цифра d</>, note: <>n оканчивается на d</> },
              {
                key: <>перестановка</>,
                note: <>только при десятках меньше единиц</>,
              },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="ubyvanie-i-delenie">
                Убывание и деление
              </SubtopicLink>
            ),
            rows: [
              { key: <>сверху вниз</>, note: <>обрыв ниже цели</> },
              { key: <>÷2 нацело</>, note: <>из 2n и 2n + 1</> },
              { key: <>вверх</>, note: <>из 2n − 1 и 2n</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="gruppy-programm">
                Группы программ
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>или</>, note: <>сумма минус пересечение</> },
              { key: <>не оба</>, note: <>все минус через оба</> },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink routeSlug={R} subtopic="dlina-i-pamyat">
                Длина и память
              </SubtopicLink>
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
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>
                Из каких чисел каждая команда ведёт в n и всегда ли она
                применима?
              </>,
              <>Какие числа обязательны, какие запрещены?</>,
              <>
                Растёт число или убывает — в каком порядке заполнять таблицу?
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
