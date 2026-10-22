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
import { lessonMedia } from "./parallel-computing.paid.parallelnost.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "setka-millisekund",
      navLabel: "Сетка миллисекунд",
      explanation: (
        <>
          <Typography.Text>
            Как увидеть, сколько процессов идёт одновременно в каждую
            миллисекунду?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Расписание рисуют сеткой: строка — процесс, столбец —
              миллисекунда, закрашены миллисекунды, когда процесс идёт. Сумма
              столбца — сколько процессов идёт в эту миллисекунду.
            </strong>{" "}
            Так выглядит расписание учебного примера:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.prCells_counts}
            caption={
              <>
                Под сеткой — сколько процессов идёт в каждую миллисекунду. Три
                одновременно — только на 7-й мс, по два — почти всё остальное
                время.
              </>
            }
          />
          <Typography.Text>
            Такую сетку называют диаграммой Ганта. На бумаге её рисуют для
            маленьких таблиц, а в Excel её строят формулами — тогда она работает
            и для двадцати процессов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "setka-v-excel",
      navLabel: "Сетка в Excel",
      explanation: (
        <>
          <Typography.Text>Как построить такую сетку в Excel?</Typography.Text>
          <Typography.Text>
            <strong>
              В первой строке — номера миллисекунд, в каждой клетке — 1, если
              процесс идёт в эту миллисекунду, и 0, если нет.
            </strong>{" "}
            Начала — в B, окончания — в C, миллисекунды 1, 2, … — в E1, F1 и
            дальше вправо:
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                cell: "E2",
                formula: "=ЕСЛИ(И(E$1>$B2;E$1<=$C2);1;0)",
              },
              { cell: "E10", formula: "=СУММ(E2:E9)" },
            ]}
            label="Формулы"
          />
          <Typography.Text>
            Условие то же, что в прошлой подтеме: номер миллисекунды больше
            начала и не больше окончания. Знаки{" "}
            <PythonTerm term="xl-ref">$</PythonTerm> расставлены так, чтобы
            формулу можно было протянуть на всю сетку:{" "}
            <Notation>{"E$1"}</Notation> — всегда номер из первой строки,{" "}
            <Notation>{"$B2"}</Notation> и <Notation>{"$C2"}</Notation> — всегда
            начало и окончание из своей строки. В десятой строке — суммы
            столбцов:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheetGrid} label={"Лист «Сетка»"} />
          <Typography.Text>
            Выбери <Notation>{"K5"}</Notation> — клетку процесса 4 на 7-й мс:
            рамки стоят на номере 7 в K1 и на начале и окончании процесса, 6 и
            8. В K10 — 3: на 7-й мс идут три процесса.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bolshe-vsego",
      navLabel: "Больше всего одновременно",
      explanation: (
        <>
          <Typography.Text>
            Какое наибольшее число процессов шло одновременно?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Наибольшее значение в строке сумм:{" "}
              <Notation>{"=МАКС(E10:R10)"}</Notation>.
            </strong>{" "}
            В примере это 3, на 7-й мс. На листе выше ответ — в C15.
          </Typography.Text>
          <Typography.Text>
            Часто вместе с этим спрашивают, сколько времени шло столько
            процессов — в сумме или подряд. В сумме — это{" "}
            <Notation>{"=СЧЁТЕСЛИ(E10:R10;3)"}</Notation>: число миллисекунд,
            где сумма равна 3. Подряд — следующий раздел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "samyj-dlinnyj-otrezok",
      navLabel: "Самый длинный отрезок",
      explanation: (
        <>
          <Typography.Text>
            Как долго подряд шли ровно два процесса?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Добавим строку-счётчик: если в миллисекунду идёт нужное число
              процессов, счётчик растёт на 1, если нет — сбрасывается в 0.
              Наибольшее значение счётчика — длина самого длинного отрезка.
            </strong>{" "}
            Нужное число — в C13, счётчик — в 11-й строке:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "E11", formula: "=ЕСЛИ(E10=$C$13;1;0)" },
              { cell: "F11", formula: "=ЕСЛИ(F10=$C$13;E11+1;0)" },
              { cell: "C14", formula: "=МАКС(E11:R11)" },
            ]}
            label="Формулы"
          />
          <Typography.Text>
            E11 — первая миллисекунда, у неё нет соседа слева. F11 смотрит на
            счётчик слева и протягивается вправо до R11. В примере два процесса
            шли подряд с 1-й по 6-ю мс — ответ 6. Поменяй C13 на 3 на листе выше
            — получится 1.
          </Typography.Text>
          <Typography.Text>
            Если спрашивают «не меньше двух», в условии счётчика ставят{" "}
            <Notation>{"E10>=$C$13"}</Notation>: тогда подходит и 7-я мс с её
            тремя процессами, и отрезок растёт до 12 мс.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "parallelnost-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Сетка",
                note: <>строка — процесс, столбец — миллисекунда</>,
              },
              {
                key: "Клетка",
                note: <Notation>{"=ЕСЛИ(И(E$1>$B2;E$1<=$C2);1;0)"}</Notation>,
              },
              {
                key: "Сумма столбца",
                note: <>сколько процессов идёт в эту миллисекунду</>,
              },
              {
                key: "Больше всего",
                note: <Notation>{"=МАКС(E10:R10)"}</Notation>,
              },
              {
                key: "В сумме",
                note: <Notation>{"=СЧЁТЕСЛИ(E10:R10;k)"}</Notation>,
              },
              {
                key: "Подряд",
                note: <>счётчик: растёт на 1 или сбрасывается в 0</>,
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
          В <Notation>{"E5"}</Notation> стоит{" "}
          <Notation>{"=ЕСЛИ(И(E$1>$B5;E$1<=$C5);1;0)"}</Notation>. Что будет в{" "}
          <Notation>{"F5"}</Notation> после протягивания вправо?
        </>
      ),
      reveal: (
        <>
          <Notation>{"=ЕСЛИ(И(F$1>$B5;F$1<=$C5);1;0)"}</Notation>: меняется
          только номер миллисекунды.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Почему перед B и C стоит $, а перед номером строки — нет?</>,
      reveal: (
        <>
          Начало и окончание всегда в столбцах B и C, а строка у каждого
          процесса своя — при протягивании вниз она должна меняться.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Строка сумм: 2 2 2 2 2 2 3 2 2 2 2 2 1 1. Какой самый длинный отрезок,
          где шли ровно два процесса?
        </>
      ),
      reveal: (
        <>6 мс: с 1-й по 6-ю. Следующий отрезок, с 8-й по 12-ю, — 5 мс.</>
      ),
    },
    {
      id: "zadacha-4",
      prompt: <>Сколько миллисекунд в сумме шли ровно два процесса?</>,
      reveal: <>11: шесть с 1-й по 6-ю и пять с 8-й по 12-ю.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>А какой самый длинный отрезок, где шло не меньше двух процессов?</>
      ),
      reveal: (
        <>12 мс: с 1-й по 12-ю, 7-я мс с тремя процессами тоже подходит.</>
      ),
    },
  ],
};

export default content;
