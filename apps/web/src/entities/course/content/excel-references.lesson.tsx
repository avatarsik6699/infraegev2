import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FillSandbox,
  FormulaBlock,
  LessonDiagram,
  LessonImage,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelReferencesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./excel-references.media";

export const excelReferencesLesson = defineCourseLesson({
  ...excelReferencesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Предсказать формулу после копирования",
    "Закрепить нужную часть адреса знаком $",
  ],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В уроке 2.1 формулу стоимости набирали в каждой строке. Покупок
            четыре — терпимо, а если их тысяча? Хочется набрать формулу один
            раз и протянуть её на весь столбец.{" "}
            <strong>
              При копировании адреса в формуле сдвигаются вместе с ней, а знак
              $ запрещает сдвигаться той части адреса, перед которой стоит
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём, когда сдвиг нужен, а когда мешает, на таблице покупок с
            общей скидкой в ячейке <Notation>{"G2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Относительная ссылка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ссылка без $ называется относительной: при копировании она
              сдвигается на столько же строк и столбцов, что и формула.
            </strong>{" "}
            В <Notation>{"D2"}</Notation> записано{" "}
            <Notation>{"=B2*C2"}</Notation>, а для следующей строки нужно{" "}
            <Notation>{"=B3*C3"}</Notation>: меняется номер строки, а смысл —
            «цена этой строки умножить на количество этой строки» — остаётся.
            Копия на одну строку вниз превращает <Notation>{"B2"}</Notation> в{" "}
            <Notation>{"B3"}</Notation>, копия на два столбца вправо — в{" "}
            <Notation>{"D2"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Поэтому одна формула описывает одно действие для любого числа
            строк: копия помнит не адреса, а где лежат нужные данные
            относительно неё.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «База»"} />
          <Typography.Text>
            Формула набрана один раз — в <Notation>{"D2"}</Notation>. Выбирай{" "}
            <Notation>{"D3"}</Notation>, <Notation>{"D4"}</Notation>,{" "}
            <Notation>{"D5"}</Notation>: в каждой стоит её копия, и рамки
            показывают, что копия берёт цену и количество своей строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Заполнение столбца",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Столбец заполняют, протянув маркер заполнения — квадратик в
              правом нижнем углу рамки.
            </strong>{" "}
            Выдели <Notation>{"D2"}</Notation> и тяни маркер вниз до{" "}
            <Notation>{"D5"}</Notation>:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.fillDown_d76f06}
            label={"Маркер заполнения копирует =B2*C2 из D2 в D3:D5"}
          />
          <Typography.Text>Так это выглядит в окне Excel:</Typography.Text>
          <LessonImage
            src="/images/lessons/excel-sheet/excel-fill-handle.webp"
            width={1280}
            height={800}
            alt="Окно Excel: в D2 формула =B2*C2 и результат 200, курсор-крестик на маркере заполнения, пунктирная рамка D2:D5; метки 1 и 2"
            caption={
              <>
                Курсор на маркере превращается в тонкий крестик (1), пунктир
                показывает, докуда дойдут копии (2).
              </>
            }
          />
          <Typography.Text>
            Другой способ: выдели <Notation>{"D2:D5"}</Notation> и нажми{" "}
            <KeyCombo keys={["Ctrl", "D"]} /> — диапазон заполнится вниз по
            верхней ячейке. <KeyCombo keys={["Ctrl", "R"]} /> так же заполняет
            вправо по левой ячейке. Двойной щелчок по маркеру заполняет столбец
            до конца соседних данных, но на пустой строке останавливается,
            поэтому после заполнения проверь формулу в последней строке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Абсолютная ссылка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ссылку на общую для всех строк ячейку закрепляют знаком $.
            </strong>{" "}
            Общая скидка записана в <Notation>{"G2"}</Notation>. Формула{" "}
            <Notation>{"=D2*(1-G2)"}</Notation> верно считает первую строку, но
            после копирования вниз станет <Notation>{"=D3*(1-G3)"}</Notation>:
            ссылка на скидку сдвинулась, хотя скидка по-прежнему в{" "}
            <Notation>{"G2"}</Notation>.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Скидка»"} />
          <Typography.Text>
            Выбери <Notation>{"E3"}</Notation>: рамка стоит на пустой{" "}
            <Notation>{"G3"}</Notation>, поэтому ручка осталась без скидки.
            Адрес скидки нужно закрепить:
          </Typography.Text>
          <FormulaBlock
            lines={[{ cell: "E2", formula: "=D2*(1-$G$2)" }]}
            label="Формула"
          />
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Скидка»"} />
          <Typography.Text>
            При копировании вниз <Notation>{"D2"}</Notation> превращается в{" "}
            <Notation>{"D3"}</Notation>, а <Notation>{"$G$2"}</Notation>{" "}
            остаётся <Notation>{"$G$2"}</Notation>: $ перед буквой закрепляет
            столбец, перед номером — строку. Закрепляется адрес, а не значение:
            поставь в <Notation>{"G2"}</Notation> 20% — все четыре цены
            пересчитаются.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Четыре вида ссылок",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              У ссылки четыре вида: закреплено всё, ничего, только столбец или
              только строка.
            </strong>{" "}
            Незакреплённая часть адреса получает сдвиг копии, закреплённая
            остаётся:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.refMovesA2_3_2}
            caption={
              <>
                Копия на 3 строки вниз и 2 столбца вправо: A2 → C5, $A$2 не
                меняется, $A2 → $A5, A$2 → C$2.
              </>
            }
          />
          <Typography.Text>
            Полностью закреплённая ссылка называется абсолютной, ссылка с одной
            закреплённой частью — смешанной.
          </Typography.Text>
          <Typography.Text>
            Проверь правило сам: поменяй формулу или ячейку, куда её копируем.
          </Typography.Text>
          <FillSandbox
            defaultFormula={"=$A2*B$1"}
            origin="B2"
            defaultTarget="D4"
          />
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Смешанные ссылки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Смешанная ссылка закрепляет одно направление: она нужна, когда
              формула берёт число из своей строки и из своего столбца.
            </strong>{" "}
            Построим таблицу умножения: в <Notation>{"A2:A6"}</Notation> числа
            1–5, в <Notation>{"B1:F1"}</Notation> — тоже 1–5. Одна формула в{" "}
            <Notation>{"B2"}</Notation>, скопированная на весь прямоугольник,
            должна умножать число слева на число сверху:
          </Typography.Text>
          <FormulaBlock
            lines={[{ cell: "B2", formula: "=$A2*B$1" }]}
            label="Формула"
          />
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Умножение»"} />
          <Typography.Text>
            <Notation>{"$A2"}</Notation> берёт число слева: при движении вправо
            столбец A должен сохраниться, при движении вниз номер строки должен
            измениться. <Notation>{"B$1"}</Notation> берёт число сверху: при
            движении вниз строка 1 должна сохраниться, при движении вправо
            столбец должен измениться. Поэтому оба знака $ стоят в разных местах
            по разным причинам. Выбрана <Notation>{"D4"}</Notation>: рамки стоят
            на <Notation>{"A4"}</Notation> и <Notation>{"D1"}</Notation> — число
            слева и число сверху. Выбирай другие ячейки таблицы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Два вопроса к ссылке",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для каждой ссылки задают два вопроса: должен ли меняться столбец
              при копировании вправо и строка — при копировании вниз.
            </strong>{" "}
            Фиксируй только те части, которые по смыслу должны сохраняться.
          </Typography.Text>
          <Typography.Text>
            Закреплять можно обе границы диапазона. Запись{" "}
            <Notation>{"$A2:$F2"}</Notation> обозначает участок строки в
            столбцах <Notation>{"A:F"}</Notation>. При копировании вправо
            столбцы не меняются, а при копировании вниз номера строк
            увеличиваются. Так одна формула обрабатывает одинаковые участки
            разных строк.
          </Typography.Text>
          <Typography.Text>
            В Excel для Windows при редактировании ссылки{" "}
            <KeyCombo keys={["F4"]} /> по кругу переключает её виды:{" "}
            <Notation>{"A2"}</Notation> → <Notation>{"$A$2"}</Notation> →{" "}
            <Notation>{"A$2"}</Notation> → <Notation>{"$A2"}</Notation>. Какой
            вид нужен, клавиша не знает — проверь запись глазами.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: копирование, перемещение и вставка строк"
            kind="nuance"
          >
            <Typography.Text>
              Копирование и вырезание — разные операции. Правило смещения прежде
              всего относится к копированию и заполнению. При перемещении ячеек,
              вставке или удалении строк Excel может перестраивать ссылки по
              своим правилам. После таких действий проверяй формулы заново.
            </Typography.Text>
          </ProofDisclosure>
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
            В <Notation>{"D2"}</Notation> записано{" "}
            <Notation>{"=B2*C2"}</Notation>. Какой станет формула после
            копирования в <Notation>{"D5"}</Notation>? А после копирования в{" "}
            <Notation>{"F2"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В <Notation>{"D5"}</Notation> получится{" "}
            <Notation>{"=B5*C5"}</Notation>, в <Notation>{"F2"}</Notation> —{" "}
            <Notation>{"=D2*E2"}</Notation>. Сдвиг формулы переносится на обе
            относительные ссылки. Второй вариант сам по себе может не
            соответствовать смыслу покупки — автоматическое копирование не
            оценивает смысл данных.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Формулу <Notation>{"=$B2*C$1+$G$2"}</Notation> скопировали из{" "}
            <Notation>{"D2"}</Notation> в <Notation>{"F5"}</Notation>. Запиши
            новую формулу и объясни каждое изменение.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=$B5*E$1+$G$2"}</Notation>. Копия сместилась на два
            столбца вправо и три строки вниз. В <Notation>{"$B2"}</Notation>{" "}
            меняется только строка; в <Notation>{"C$1"}</Notation> — только
            столбец; последняя ссылка полностью закреплена.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Формулу <Notation>{"=A1*$B$1"}</Notation> из{" "}
            <Notation>{"C1"}</Notation> скопировали в{" "}
            <Notation>{"C3"}</Notation> и в <Notation>{"E1"}</Notation>. Какими
            стали формулы?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В <Notation>{"C3"}</Notation> — <Notation>{"=A3*$B$1"}</Notation>, в{" "}
            <Notation>{"E1"}</Notation> — <Notation>{"=C1*$B$1"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"E2"}</Notation> по ошибке записали{" "}
            <Notation>{"=D2*(1-G2)"}</Notation> и скопировали вниз. Почему для
            второй строки получилась полная стоимость без скидки?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            После копирования во второй строке стоит{" "}
            <Notation>{"=D3*(1-G3)"}</Notation>: <Notation>{"G3"}</Notation>{" "}
            пуста, пустота в вычислении равна нулю, и множитель стал 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            В таблице умножения из урока что будет записано в{" "}
            <Notation>{"E5"}</Notation> и чему равно значение?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=$A5*E$1"}</Notation>, значение 4 × 4 = 16.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Построй таблицу сложения: числа 1–4 в <Notation>{"A2:A5"}</Notation>{" "}
            и в <Notation>{"B1:E1"}</Notation>, в <Notation>{"B2"}</Notation> —
            одна формула, скопированная на весь прямоугольник{" "}
            <Notation>{"B2:E5"}</Notation>. Какая формула стоит в{" "}
            <Notation>{"B2"}</Notation> и что получится в{" "}
            <Notation>{"E5"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=$A2+B$1"}</Notation>; в <Notation>{"E5"}</Notation> —{" "}
            <Notation>{"=$A5+E$1"}</Notation>, значение 8.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Перед копированием формулы реши для каждой ссылки, что в ней должно
        сдвигаться, а что — нет. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Без $",
            note: (
              <>
                Ссылка сдвигается на столько же строк и столбцов, что и
                формула: <Notation>{"=B2*C2"}</Notation> в строке 3 —{" "}
                <Notation>{"=B3*C3"}</Notation>.
              </>
            ),
          },
          {
            key: "Заполнение",
            note: (
              <>
                Маркер заполнения или <KeyCombo keys={["Ctrl", "D"]} />; после
                — проверь последнюю строку.
              </>
            ),
          },
          {
            key: "$G$2",
            note: (
              <>
                Общий для всех строк параметр:{" "}
                <Notation>{"=D2*(1-$G$2)"}</Notation>.
              </>
            ),
          },
          {
            key: "$A2, A$2",
            note: (
              <>
                $ перед буквой держит столбец, перед номером — строку; таблица
                умножения — <Notation>{"=$A2*B$1"}</Notation>.
              </>
            ),
          },
          {
            key: "Два вопроса",
            note: (
              <>
                Меняется ли столбец при копировании вправо и строка — при
                копировании вниз.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
