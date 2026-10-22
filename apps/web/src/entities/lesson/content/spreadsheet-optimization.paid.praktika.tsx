// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./spreadsheet-optimization.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Таблицу проверяют на поле 4 × 4, посчитанном руками: те же формулы
          должны дать 35 и 25 без стен и 32 и 14 со стенами и тупиками.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "стена только нарисована",
            value: <>Формула у стены осталась общей</>,
            note: <>открыть формулы клеток вдоль каждой стены</>,
          },
          {
            label: "ответ только в углу",
            value: <>Ответ взят в правой нижней клетке</>,
            note: <>найти все тупики и взять МАКС и МИН по ним</>,
          },
          {
            label: "монета в недостижимой клетке",
            value: <>В клетке, куда не попасть, осталось число</>,
            note: <>очистить её — иначе минимум выйдет меньше настоящего</>,
          },
          {
            label: "$ в формуле",
            value: (
              <>
                Монета закреплена: <Notation>{"$B$2"}</Notation>
              </>
            ),
            note: <>в формуле правила клетки ссылки без $</>,
          },
          {
            label: "скопирован блок",
            value: <>Блок минимума скопирован из блока максимума</>,
            note: <>заменить МАКС на МИН или написать четыре формулы заново</>,
          },
          {
            label: "порядок в ответе",
            value: <>Записан сначала минимум, хотя спросили максимум</>,
            note: <>перечитать последнюю фразу условия</>,
          },
        ]}
      />
      <Typography.Text>
        После растягивания открой несколько формул — первую внутреннюю, из
        середины поля, у стен — и проверь, что каждая берёт свою монету и
        правильных соседей из своего блока.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 18 решается в три шага: блок лучших сумм под
          полем, формулы с учётом стен и пустых недостижимых клеток, ответ —
          МАКС и МИН по нужным финишам.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 18 на одной схеме"}
        flow={[
          { name: "Блок", note: "под полем: монета + лучший сосед" },
          { name: "Стены", note: "сосед за стеной убран, недостижимые пусты" },
          { name: "Ответ", note: "МАКС и МИН по тупикам, в порядке условия" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="luchshaya-summa-do-kletki">
                Лучшая сумма до клетки
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>монета + лучший сосед</>,
                note: <>соседи слева и сверху</>,
              },
              { key: <>две таблицы</>, note: <>максимум и минимум отдельно</> },
              { key: <>35 и 25</>, note: <>поле 4 × 4 без стен</> },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="tablica-v-excel">
                Таблица в Excel
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"=B2+МАКС(A7;B6)"}</Notation>,
                note: <>внутренняя клетка, на весь блок</>,
              },
              {
                key: (
                  <>
                    <Notation>{"=A6+B1"}</Notation>,{" "}
                    <Notation>{"=A6+A2"}</Notation>
                  </>
                ),
                note: <>верхняя строка и левый столбец</>,
              },
              { key: <>Ctrl + H</>, note: <>МАКС → МИН</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="steny">
                Стены
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"=B2+A7"}</Notation>,
                note: <>стена сверху</>,
              },
              {
                key: <Notation>{"=B2+B6"}</Notation>,
                note: <>стена слева</>,
              },
              { key: <>форматы</>, note: <>рисунок стен на блоке</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="nedostizhimye-i-finishi">
                Тупики и недостижимые клетки
              </SubtopicLink>
            ),
            rows: [
              { key: <>тупик</>, note: <>закрыт справа и снизу</> },
              { key: <>пусто</>, note: <>в недостижимых клетках блока</> },
              {
                key: <Notation>{"=МАКС(B8;C9;D9)"}</Notation>,
                note: <>ответ по тупикам</>,
              },
              { key: <>2629 378</>, note: <>ответ задачи темы</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="napravleniya-i-zapuski">
                Другие направления и правила
              </SubtopicLink>
            ),
            rows: [
              { key: <>влево и вниз</>, note: <>соседи справа и сверху</> },
              { key: <>старт внутри</>, note: <>выше и левее — пусто</> },
              {
                key: <Notation>{"=МАКС(A7+…;B6+…)"}</Notation>,
                note: <>вклад зависит от прихода</>,
              },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="ladya-i-chislo-marshrutov">
                Диагонали, ладья и число маршрутов
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>диагональ</>, note: <>третий сосед слева сверху</> },
              {
                key: <Notation>{"=A7+B6"}</Notation>,
                note: <>число маршрутов: складывают</>,
              },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Откуда начинает робот и куда он ходит?</>,
              <>
                Где заканчивается маршрут: в одной клетке или в любом тупике?
              </>,
              <>Какое число записать первым — максимум или минимум?</>,
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
