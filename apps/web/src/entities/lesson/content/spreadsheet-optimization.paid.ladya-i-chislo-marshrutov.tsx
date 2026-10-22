// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./spreadsheet-optimization.paid.ladya-i-chislo-marshrutov.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "diagonali",
      navLabel: "Диагонали",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Изредка в
            задании 18 робот ходит по диагонали или на несколько клеток,
            спрашивают число маршрутов или сумму нескольких запусков. Задачи
            основных подтем решаются без этого урока.
          </Typography.Text>
          <Typography.Text>
            Что, если разрешён ещё и шаг по диагонали вправо-вниз?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Появляется третий сосед — клетка слева сверху. Он просто
              добавляется в МАКС или МИН.
            </strong>{" "}
            Шаг влево-вниз добавил бы соседа справа сверху:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridPreds_576cc4}
            caption={
              <>
                Каждая новая команда — ещё один сосед: диагональ вправо-вниз
                приходит слева сверху, влево-вниз — справа сверху.
              </>
            }
          />
          <FormulaBlock
            lines={[{ cell: "B7", formula: "=B2+МИН(A7;B6;A6)" }]}
            label="Формула"
          />
          <Typography.Text>
            На поле 4 × 4 минимум падает с 25 до 7: маршрут A1 → B2 → C3 → D4
            собирает 2 + 1 + 2 + 2 и проходит всего четыре клетки. С диагоналями
            маршруты бывают разной длины. Верхняя строка и левый столбец
            считаются по-прежнему: у них диагонального соседа нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ladya",
      navLabel: "Ладья",
      explanation: (
        <>
          <Typography.Text>
            А если робот ходит, как ладья, — сразу на несколько клеток вправо
            или вниз?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда соседи — вся строка левее клетки и весь столбец выше неё.
            </strong>{" "}
            Ладья собирает числа только тех клеток, где останавливается, и может
            перепрыгивать отрицательные. В формуле — два диапазона, которые
            растут при растягивании:
          </Typography.Text>
          <FormulaBlock
            lines={[{ cell: "B7", formula: "=B2+МАКС($A7:A7;B$6:B6)" }]}
            label="Формула"
          />
          <Typography.Text>
            Начало диапазона закреплено знаком <Notation>{"$"}</Notation>, а
            конец сдвигается: в <Notation>{"C8"}</Notation> формула станет{" "}
            <Notation>{"=C3+МАКС($A8:B8;C$6:C7)"}</Notation> — вся строка левее
            и весь столбец выше. Такие{" "}
            <PythonTerm term="xl-ref">смешанные ссылки</PythonTerm> и делают
            диапазон растущим:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheetRook} label={"Лист «Ладья»"} />
          <Typography.Text>
            Ладья собирает до 16, а робот обычными шагами на этом поле — только
            10: длинные ходы перепрыгивают отрицательные числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-marshrutov",
      navLabel: "Число маршрутов",
      explanation: (
        <>
          <Typography.Text>
            Сколько разных маршрутов ведёт из A1 в D4?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждый маршрут приходит в клетку слева или сверху, и это разные
              маршруты. Поэтому их число не выбирают, а складывают:{" "}
              <Notation>{"=A7+B6"}</Notation>. В старте — 1.
            </strong>
          </Typography.Text>
          <LessonTable
            label={"Число маршрутов до клеток поля 4 × 4"}
            columns={[
              { label: "Строка" },
              { label: "A", numeric: true },
              { label: "B", numeric: true },
              { label: "C", numeric: true },
              { label: "D", numeric: true },
            ]}
            rows={[
              ["1", "1", "1", "1", "1"],
              ["2", "1", "2", "3", "4"],
              ["3", "1", "3", "6", "10"],
              ["4", "1", "4", "10", "20"],
            ]}
          />
          <Typography.Text>
            До D4 ведут 20 маршрутов. Приход сквозь стену даёт 0: со стенами
            между C1 и C2 и между C4 и D4 маршрутов остаётся 8.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-zapuskov",
      navLabel: "Несколько запусков",
      explanation: (
        <>
          <Typography.Text>
            Робота запускают дважды, и финиши должны быть разными. Какую
            наибольшую общую сумму он соберёт?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Монеты перед каждым запуском возвращаются, поэтому запуски
              независимы: берут два лучших результата разных финишей.
            </strong>{" "}
            На поле 4 × 4 со стенами из подтемы о тупиках наибольшие суммы в
            тупиках — 16, 23 и 32, наименьшие — 14, 23 и 28. Выпишем их в
            столбец и сложим два лучших:
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                cell: "F1",
                formula: "=НАИБОЛЬШИЙ(F2:F4;1)+НАИБОЛЬШИЙ(F2:F4;2)",
              },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Общий максимум 32 + 23 = 55, общий минимум 14 + 23 = 37 — через{" "}
            <PythonTerm term="xl-range-functions">
              <Notation>{"НАИМЕНЬШИЙ"}</Notation>
            </PythonTerm>
            . Удвоить лучший результат нельзя: это дважды один и тот же финиш.
          </Typography.Text>
          <Typography.Text>
            Если различаться должны старты, таблицу считают в обратную сторону —
            от клетки до финиша: монета плюс лучшая из сумм соседей справа и
            снизу. Тогда в клетке каждого старта окажется его результат, и два
            лучших снова складывают.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dop-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Диагональ",
                note: (
                  <>
                    третий сосед: <Notation>{"=B2+МИН(A7;B6;A6)"}</Notation>
                  </>
                ),
              },
              {
                key: "Ладья",
                note: <Notation>{"=B2+МАКС($A7:A7;B$6:B6)"}</Notation>,
              },
              {
                key: "Число маршрутов",
                note: (
                  <>
                    <Notation>{"=A7+B6"}</Notation>, в старте 1, сквозь стену 0
                  </>
                ),
              },
              {
                key: "Несколько запусков",
                note: <>сумма k лучших результатов разных финишей</>,
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
          Разрешены шаги вправо, вниз и вправо-вниз, блок в{" "}
          <Notation>{"A6:D9"}</Notation>. Какая формула наибольших сумм стоит в{" "}
          <Notation>{"C8"}</Notation>?
        </>
      ),
      reveal: <Notation>{"=C3+МАКС(B8;C7;B7)"}</Notation>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>Сколько маршрутов вправо и вниз ведёт из угла в угол поля 3 × 3?</>
      ),
      reveal: <>6: числа по клеткам 1, 1, 1 / 1, 2, 3 / 1, 3, 6.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Наибольшие суммы в четырёх тупиках — 70, 95, 60 и 81. Какую наибольшую
          сумму дадут два запуска к разным финишам?
        </>
      ),
      reveal: <>176: 95 + 81.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Почему в формуле ладьи диапазон <Notation>{"$A7:A7"}</Notation> при
          растягивании вправо расширяется?
        </>
      ),
      reveal: (
        <>
          Начало закреплено знаком <Notation>{"$"}</Notation>, а конец
          сдвигается вместе с формулой: в D7 будет{" "}
          <Notation>{"$A7:C7"}</Notation>.
        </>
      ),
    },
  ],
};

export default content;
