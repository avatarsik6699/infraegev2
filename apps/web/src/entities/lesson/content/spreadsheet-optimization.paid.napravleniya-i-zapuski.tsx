// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./spreadsheet-optimization.paid.napravleniya-i-zapuski.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "drugie-napravleniya",
      navLabel: "Другие направления",
      explanation: (
        <>
          <Typography.Text>
            Что меняется в таблице, если робот ходит влево и вниз, а не вправо и
            вниз?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Меняются соседи: в клетку приходят с тех сторон, откуда идёт
              движение. При ходах влево и вниз — справа и сверху.
            </strong>{" "}
            Вместе с соседями переезжают старт и тупики:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridPreds_3e4fd5}
            caption={
              <>
                Четыре набора команд: в клетку (рамка) приходят с двух сторон,
                противоположных направлениям движения.
              </>
            }
          />
          <LessonTable
            label={"Команды, соседи, старт и тупики"}
            columns={[
              { label: "Команды" },
              { label: "Откуда приходят" },
              { label: "Старт" },
              { label: "Тупик закрыт" },
            ]}
            rows={[
              [
                "вправо и вниз",
                "слева, сверху",
                "левый верхний",
                "справа и снизу",
              ],
              [
                "влево и вниз",
                "справа, сверху",
                "правый верхний",
                "слева и снизу",
              ],
              [
                "вправо и вверх",
                "слева, снизу",
                "левый нижний",
                "справа и сверху",
              ],
              [
                "влево и вверх",
                "справа, снизу",
                "правый нижний",
                "слева и сверху",
              ],
            ]}
          />
          <Typography.Text>
            В Excel меняются только ссылки на соседей. Для ходов влево и вниз на
            поле 4 × 4 старт — в правой верхней клетке, верхняя строка
            накапливается справа налево:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "D6", formula: "=D1" },
              { cell: "C6", formula: "=D6+C1" },
              { cell: "D7", formula: "=D6+D2" },
              { cell: "C7", formula: "=C2+МАКС(D7;C6)" },
            ]}
            label="Формула"
          />
          <Typography.Text>
            <Notation>{"C6"}</Notation> растягивают влево до{" "}
            <Notation>{"A6"}</Notation>, <Notation>{"D7"}</Notation> — вниз до{" "}
            <Notation>{"D9"}</Notation>, а <Notation>{"C7"}</Notation> — на{" "}
            <Notation>{"A7:C9"}</Notation>. Финиш — левая нижняя клетка, ответ в{" "}
            <Notation>{"A9"}</Notation>: наибольшая сумма 29, наименьшая 24.
            Порядок счёта Excel находит{" "}
            <PythonTerm term="xl-recalc">сам</PythonTerm>: важно только, чтобы
            формула ссылалась на правильных соседей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "start-vnutri",
      navLabel: "Старт внутри поля",
      explanation: (
        <>
          <Typography.Text>А если робот начинает не в углу?</Typography.Text>
          <Typography.Text>
            <strong>
              Клетки выше старта и левее него недостижимы — в блоке они пустые.
              В клетку старта пишут просто её монету.
            </strong>{" "}
            Возьмём поле со стенами из прошлой подтемы и начнём в B2:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridWallsStart}
            caption={
              <>
                Пусты вся первая строка и столбец A. Пусты и B4 с C4: к ним
                ведут только стена и недостижимые клетки.
              </>
            }
          />
          <Typography.Text>
            Из прежних трёх тупиков остались два: B3 с суммой 7 и D4 с суммой
            23. Так же решают задачи, где задан и старт, и финиш внутри поля:
            лишнее в блоке пусто, а ответ берут в клетке под финишем.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vklad-kletki",
      navLabel: "Вклад клетки",
      explanation: (
        <>
          <Typography.Text>
            Что, если клетка добавляет к сумме не просто свою монету?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если вклад один и тот же, откуда бы робот ни пришёл, в формуле
              меняют только монету. Если вклад зависит от того, откуда пришли,
              сумму считают для каждого прихода отдельно и выбирают лучшую.
            </strong>{" "}
            Выбери правило из подборок задания:
          </Typography.Text>
          <VariantPicker
            label={"Правило и формула клетки B2"}
            variants={[
              {
                label: "берут только нечётные монеты",
                value: (
                  <Notation>{"=ЕСЛИ(ОСТАТ(B2;2)=1;B2;0)+МАКС(A7;B6)"}</Notation>
                ),
                note: <>вклад не зависит от прихода</>,
              },
              {
                label: "шаг вправо — утроенная монета, вниз — удвоенная",
                value: <Notation>{"=МАКС(A7+3*B2;B6+2*B2)"}</Notation>,
                note: <>у каждого прихода свой вклад</>,
              },
              {
                label: "расход на шаг — модуль разности чисел",
                value: (
                  <Notation>{"=МИН(A7+ABS(B2-A2);B6+ABS(B2-B1))"}</Notation>
                ),
                note: <>разность с той клеткой, откуда пришли</>,
              },
            ]}
          />
          <Typography.Text>
            Почему нельзя сначала выбрать лучшего соседа, а потом прибавить
            вклад? Пусть число клетки берут, только если оно больше числа
            предыдущей клетки. В клетке 10; слева число 30 и сумма 50, сверху
            число 5 и сумма 47. Слева 10 не больше 30 — получится 50. Сверху 10
            больше 5 — получится 47 + 10 = 57. Лучше прийти сверху, хотя сумма
            там была меньше.
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="xl-mod">
              <Notation>{"ОСТАТ"}</Notation>
            </PythonTerm>{" "}
            даёт остаток от деления, <Notation>{"ABS"}</Notation> — модуль. У
            клеток на краю один приход, поэтому и сумма одна, например{" "}
            <Notation>{"=A6+ABS(B1-A1)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapas-energii",
      navLabel: "Запас энергии",
      explanation: (
        <>
          <Typography.Text>
            Какой запас энергии нужен роботу, чтобы дойти до финиша?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Расход энергии считают как сумму, а вопрос решает, какое число
              взять из таблицы.
            </strong>{" "}
            Робот тратит на клетку её число. В клетки с −1 (на экзамене у них
            тёмный фон) заходить нельзя — в блоке они пустые. Финальная клетка —
            та, из которой нельзя сделать ни одного хода:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridWalls_d4af02}
            caption={
              <>
                Финальные клетки (рамки): из D1 вниз — закрытая D2, из B4 вправо
                — закрытая C4, D4 — угол поля. Наименьшие расходы до них 14, 16
                и 27.
              </>
            }
          />
          <VariantPicker
            label={"Вопрос и что взять"}
            variants={[
              {
                label: "хватит, чтобы дойти до какой-нибудь финальной клетки",
                value: <>наименьший из наименьших расходов: 14</>,
              },
              {
                label: "хватит, чтобы дойти до любой финальной клетки",
                value: <>наибольший из наименьших расходов: 27</>,
                note: <>к каждой клетке идём самым экономным путём</>,
              },
              {
                label: "хватит на любой маршрут",
                value: <>наибольший из наибольших расходов: 34</>,
                note: <>нужен блок с МАКС</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "pravila-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Соседи",
                note: <>с тех сторон, откуда идёт движение</>,
              },
              {
                key: "Влево и вниз",
                note: (
                  <>
                    <Notation>{"=C2+МАКС(D7;C6)"}</Notation>, старт справа
                    сверху
                  </>
                ),
              },
              {
                key: "Старт внутри",
                note: <>выше и левее старта — пустые клетки</>,
              },
              {
                key: "Вклад один",
                note: <>меняют только монету в формуле</>,
              },
              {
                key: "Вклад от прихода",
                note: <Notation>{"=МАКС(A7+…;B6+…)"}</Notation>,
              },
              {
                key: "Запас",
                note: (
                  <>
                    «какой-нибудь» — наименьший из наименьших, «любой» —
                    наибольший из наименьших
                  </>
                ),
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
          Робот ходит вправо и вверх, поле в <Notation>{"A1:D4"}</Notation>,
          блок в <Notation>{"A6:D9"}</Notation>. Какая формула стоит в{" "}
          <Notation>{"B8"}</Notation>?
        </>
      ),
      reveal: (
        <>
          <Notation>{"=B3+МАКС(A8;B9)"}</Notation>: приходят слева и снизу.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Робот ходит влево и вниз. С каких сторон закрыт тупик?</>,
      reveal: <>Слева и снизу: оттуда робот уже не может сделать ход.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Поле 4 × 4 без стен, робот ходит вправо и вниз и начинает в C2.
          Сколько клеток недостижимы?
        </>
      ),
      reveal: (
        <>
          10: вся первая строка (4 клетки) и столбцы A и B во второй–четвёртой
          строках (6 клеток).
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Монеты берут только нечётные. В клетке 6, лучшая сумма слева 20,
          сверху 25. Какая наибольшая сумма до клетки?
        </>
      ),
      reveal: <>25: монету 6 не берут, остаётся лучшая сумма соседа.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Наименьшие расходы до трёх финальных клеток — 30, 18 и 41. Какой запас
          нужен, чтобы дойти до какой-нибудь финальной клетки, а какой — до
          любой?
        </>
      ),
      reveal: <>18 и 41.</>,
    },
  ],
};

export default content;
