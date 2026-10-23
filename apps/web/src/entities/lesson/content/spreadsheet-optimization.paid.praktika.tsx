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
import { lessonMedia } from "./spreadsheet-optimization.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="18-robot-sborshchik-monet" subtopic={props.slug}>
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
              Задача темы — наибольшая и наименьшая сумма монет на поле 20 × 20
              со стенами и несколькими финишами — решалась на поле 4 × 4, и
              каждая подтема добавляла к таблице новое правило.
            </strong>{" "}
            Пролистай решение: в подписи каждого шага — подтема, откуда приём.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы на поле 4 × 4"}
          />
          <Typography.Text>
            На файле экзамена всё то же: блок лучших сумм под полем, формулы у
            стен, пустые недостижимые клетки и МАКС и МИН по тупикам. Подтема 5
            меняет направления и старт, дополнительный урок — добавляет
            диагонали, ладью и число маршрутов.
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
            Сверху — путь от поля к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 18 на одной схеме"}
            flow={[
              { name: "Блок", note: "под полем: монета + лучший сосед" },
              { name: "Стены", note: "сосед за стеной убран, тупики найдены" },
              { name: "Ответ", note: "МАКС и МИН по финишам, по порядку" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="luchshaya-summa-do-kletki">
                    Лучшая сумма до клетки
                  </Sub>
                ),
                rows: [
                  {
                    key: <>монета + лучший сосед</>,
                    note: <>соседи — откуда робот мог прийти</>,
                  },
                  {
                    key: <>две таблицы</>,
                    note: <>для максимума и минимума отдельно</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="tablica-v-excel">Таблица в Excel</Sub>,
                rows: [
                  {
                    key: <Notation>{"=B2+МАКС(A7;B6)"}</Notation>,
                    note: <>внутренняя клетка, растянуть на блок</>,
                  },
                  {
                    key: <>край поля</>,
                    note: <>у верхней строки и левого столбца один сосед</>,
                  },
                  {
                    key: <>без $</>,
                    note: <>ссылки сдвигаются вместе с формулой</>,
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="steny">Стены</Sub>,
                rows: [
                  {
                    key: <Notation>{"=B2+A7"}</Notation>,
                    note: <>стена сверху — остался сосед слева</>,
                  },
                  {
                    key: <>рисунок стен</>,
                    note: <>перенести границы на блок</>,
                  },
                ],
              },
              {
                number: 4,
                title: (
                  <Sub slug="nedostizhimye-i-finishi">
                    Тупики и недостижимые клетки
                  </Sub>
                ),
                rows: [
                  { key: <>тупик</>, note: <>закрыт справа и снизу</> },
                  {
                    key: <>недостижимая</>,
                    note: <>в блоке пусто, иначе минимум испорчен</>,
                  },
                  {
                    key: <Notation>{"=МАКС(B8;C9;D9)"}</Notation>,
                    note: <>ответ по всем тупикам</>,
                  },
                ],
              },
              {
                number: 5,
                title: (
                  <Sub slug="napravleniya-i-zapuski">
                    Другие направления и правила
                  </Sub>
                ),
                rows: [
                  {
                    key: <>влево и вниз</>,
                    note: <>соседи справа и сверху</>,
                  },
                  {
                    key: <>старт внутри</>,
                    note: <>выше и левее старта — пусто</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="ladya-i-chislo-marshrutov">
                    Диагонали, ладья и число маршрутов
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <Notation>{"=A7+B6"}</Notation>,
                    note: <>число маршрутов — сумма, а не МАКС</>,
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
              Любое задание 18 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — стены: формула у стены теряет соседа, и это нужно
                сделать в каждой такой клетке. Проверка — поле 4 × 4: те же
                формулы должны дать 35 и 25 без стен и 32 и 14 со стенами.
              </>
            }
          />
          <Typography.Text>
            После растягивания открой несколько формул — первую внутреннюю, из
            середины, у стен — и проверь, что каждая берёт свою монету и своих
            соседей из своего блока.
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
              Шесть ошибок встречаются чаще других, и каждую ловит один вопрос к
              себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "$ в формуле",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"=$B$2+МАКС(A7;B6)"}</Notation>}
                    right={<Notation>{"=B2+МАКС(A7;B6)"}</Notation>}
                    question="берёт ли каждая клетка свою монету?"
                  />
                ),
                note: <Sub slug="tablica-v-excel">подтема 2</Sub>,
              },
              {
                label: "скопирован блок",
                value: (
                  <FinalMistake
                    wrong="блок минимума скопирован из блока максимума"
                    right="МАКС заменён на МИН во всех формулах"
                    question="какая функция в блоке минимума?"
                  />
                ),
                note: <Sub slug="tablica-v-excel">подтема 2</Sub>,
              },
              {
                label: "стена только нарисована",
                value: (
                  <FinalMistake
                    wrong="у стены осталась общая формула"
                    right="сосед за стеной убран из формулы"
                    question="может ли робот пройти сквозь эту стену?"
                  />
                ),
                note: <Sub slug="steny">подтема 3</Sub>,
              },
              {
                label: "ответ только в углу",
                value: (
                  <FinalMistake
                    wrong="ответ взят в правой нижней клетке"
                    right="МАКС и МИН по всем тупикам"
                    question="где ещё может закончиться маршрут?"
                  />
                ),
                note: <Sub slug="nedostizhimye-i-finishi">подтема 4</Sub>,
              },
              {
                label: "монета в недостижимой",
                value: (
                  <FinalMistake
                    wrong="в недостижимой клетке осталось число"
                    right="клетку очищают"
                    question="можно ли вообще прийти в эту клетку?"
                  />
                ),
                note: <Sub slug="nedostizhimye-i-finishi">подтема 4</Sub>,
              },
              {
                label: "порядок в ответе",
                value: (
                  <FinalMistake
                    wrong="сначала минимум, потом максимум"
                    right="в порядке из условия"
                    question="что просят записать первым?"
                  />
                ),
                note: <Sub slug="nedostizhimye-i-finishi">подтема 4</Sub>,
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
            Почему клетке хватает одной лучшей суммы, а не всех маршрутов в неё?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            После клетки путь продолжается одинаково, с какого бы маршрута ни
            пришли. Лучший результат даёт только лучший приход.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Робот ходит вправо и вниз, между клеткой и её левым соседом стена.
            Какая формула в этой клетке блока максимума?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Монета плюс лучшая сумма соседа сверху: левый сосед из формулы
            убран.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что будет с минимумом, если в недостижимой клетке блока осталось
            число?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Он может получиться меньше настоящего: формулы соседей возьмут сумму
            маршрута, которого нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Нужно не наибольшую сумму, а число маршрутов. Что меняется в
            формуле?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Монета не нужна, а значения соседей складывают: =A7+B6.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от поля 4 × 4 до ответа 2629 378. Вот
        что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Блок, формула, стены, финиши, ответ.</>,
          },
          {
            key: "Правило",
            note: <>Монета плюс лучший сосед, откуда можно прийти.</>,
          },
          {
            key: "Стены",
            note: <>Убрать соседа в каждой формуле у стены.</>,
          },
          {
            key: "Финиши",
            note: <>МАКС и МИН по всем тупикам, недостижимые пусты.</>,
          },
          {
            key: "Задача темы",
            note: <>На 4 × 4 — 32 и 14, на файле — 2629 378.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
