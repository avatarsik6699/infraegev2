// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonSummary,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./spreadsheet-optimization.paid.steny.media";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "stena-na-vhode",
      navLabel: "Стена на входе",
      explanation: (
        <>
          <Typography.Text>
            В задаче темы между клетками стоят стены. Что стена меняет в правиле
            клетки?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Стена запрещает переход между двумя клетками, а не саму клетку.
              При ходах вправо и вниз важны только стены слева и сверху от
              клетки: каждая из них убирает одного из двух соседей.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridPreds_0d7f60}
            caption={
              <>
                Стена слева отнимает приход слева, стена сверху — приход сверху.
                Стены справа и снизу закрывают выходы и сумму до клетки не
                меняют.
              </>
            }
          />
          <Typography.Text>
            Поставим на поле 4 × 4 две стены: между C1 и C2 и между C4 и D4. В
            C2 теперь приходят только слева, из B2: 8 + 10 = 18, а не 8 + 13 =
            21, как раньше. В D4 — только сверху: 2 + 30 = 32.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "stena-v-formule",
      navLabel: "Стена в формуле",
      explanation: (
        <>
          <Typography.Text>Как записать это в Excel?</Typography.Text>
          <Typography.Text>
            <strong>
              Из формулы убирают соседа за стеной: остаётся монета плюс сумма
              единственного соседа.
            </strong>{" "}
            Блок, как и раньше, — в <Notation>{"A6:D9"}</Notation> под полем:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "C7", formula: "=C2+B7" },
              { cell: "D9", formula: "=D4+D8" },
            ]}
            label="Формула"
          />
          <Typography.Text>
            У C2 стена сверху — остаётся сосед слева,{" "}
            <Notation>{"B7"}</Notation>. У D4 стена слева — остаётся сосед
            сверху, <Notation>{"D8"}</Notation>. Удобный порядок: заполнить весь
            блок общей формулой, как в прошлой подтеме, а потом исправить клетки
            у стен. В листе стены нарисованы и на поле, и на блоке:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheetWalls} label={"Лист «Стены»"} />
          <Typography.Text>
            Выбери <Notation>{"C7"}</Notation>: рамки только на монете C2 и на{" "}
            <Notation>{"B7"}</Notation>. Наибольшая сумма теперь 32. Блок
            минимума строят так же — он даёт 27.
          </Typography.Text>
          <Typography.Text>
            Толстая линия в Excel — только оформление: формула её не видит. Пока
            формулу не исправили, робот проходит сквозь стену.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "steny-v-fajle",
      navLabel: "Стены в файле",
      explanation: (
        <>
          <Typography.Text>
            Как не пропустить ни одной стены на поле 20 × 20?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перенеси рисунок стен на блок и исправляй формулы там, где стены
              видно.
            </strong>{" "}
            Порядок такой:
          </Typography.Text>
          <ol>
            <li>
              Скопируй поле и вставь его в первую клетку блока только форматами:
              «Специальная вставка» → «Форматы» (в LibreOffice — «Вставить как»
              → «Только форматы»). Блок получит те же толстые линии.
            </li>
            <li>Заполни весь блок общей формулой.</li>
            <li>
              В клетках со стеной сверху поставь формулу «только слева»,
              например <Notation>{"=B2+A7"}</Notation>, и скопируй её вдоль всей
              стены.
            </li>
            <li>
              В клетках со стеной слева — «только сверху», например{" "}
              <Notation>{"=B2+B6"}</Notation>, тоже вдоль всей стены.
            </li>
          </ol>
          <Typography.Text>
            Стена обычно тянется на несколько клеток, поэтому формулу правят на
            всём отрезке сразу. Копируй формулы вставкой «только формулы»: так
            рисунок стен на блоке не сотрётся.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "steny-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Стена", note: <>запрещает переход, а не клетку</> },
              {
                key: "Важны",
                note: <>стены слева и сверху от клетки</>,
              },
              {
                key: "Стена сверху",
                note: (
                  <>
                    <Notation>{"=B2+A7"}</Notation> — только слева
                  </>
                ),
              },
              {
                key: "Стена слева",
                note: (
                  <>
                    <Notation>{"=B2+B6"}</Notation> — только сверху
                  </>
                ),
              },
              {
                key: "Порядок",
                note: <>общая формула на весь блок, потом клетки у стен</>,
              },
              {
                key: "Рисунок стен",
                note: <>на блок — вставкой только форматов</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Клетка C3 закрыта стенами справа и снизу. Изменится ли лучшая сумма до
          самой C3?
        </>
      ),
      reveal: (
        <>
          Нет: стены справа и снизу закрывают выходы из C3. Они повлияют на
          клетки D3 и C4, куда из C3 теперь не попасть.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Монета в клетке — 6. До соседа слева лучшие суммы 30 и 21, до соседа
          сверху — 25 и 17. Сверху стоит стена. Найди наибольшую и наименьшую
          сумму до клетки.
        </>
      ),
      reveal: <>36 и 27: остаётся только сосед слева, 6 + 30 и 6 + 21.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          На поле 4 × 4 стена между B1 и B2. Какая формула должна стоять в{" "}
          <Notation>{"B7"}</Notation>?
        </>
      ),
      reveal: (
        <>
          <Notation>{"=B2+A7"}</Notation>: сверху стена, остаётся сосед слева.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Стена между C4 и D4. Какие формулы стоят в <Notation>{"D9"}</Notation>{" "}
          блока максимума и в <Notation>{"D14"}</Notation> блока минимума?
        </>
      ),
      reveal: (
        <>
          <Notation>{"=D4+D8"}</Notation> и <Notation>{"=D4+D13"}</Notation>:
          монета поля, а сосед сверху — из своего блока.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          На поле нарисовали толстую линию, а ответ в блоке не изменился.
          Почему?
        </>
      ),
      reveal: (
        <>
          Формулы не видят оформление. Стену нужно учесть в формулах клеток
          рядом с ней.
        </>
      ),
    },
  ],
};

export default content;
