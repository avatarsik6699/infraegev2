// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { CourseTypes } from "../course.types";
import { lessonMedia } from "./excel-numbers.paid.media";

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Цена 200 рублей со скидкой 10%, число коробок по 8 для 19 тетрадей,
            последняя цифра числа — в этих задачах формуле мало четырёх действий
            арифметики.{" "}
            <strong>
              Процент — это множитель, округление — функция с выбранным
              направлением, а остаток от деления отвечает на вопрос о делимости
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            В отличие от формата из урока 1.3, здесь меняется само значение, а
            не только его вид.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Проценты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Изменить число на p процентов — умножить его на 1 − p или 1 + p,
              где p — доля: 10% — это 0,1.
            </strong>{" "}
            Скидка 10% с цены 200 — это 200 × 0,1 = 20 рублей, остаётся 200 − 20
            = 180. То же одним умножением: 200 × (1 − 0,1) = 180. Наценка 15% —
            множитель 1 + 0,15 = 1,15.
          </Typography.Text>
          <Typography.Text>
            Ячейка с процентом — 10% или 15% — уже хранит долю, и формула{" "}
            <Notation>{"=A2*(1-B2)"}</Notation> верна. Если в ячейке просто
            число 15, его сначала делят на 100:{" "}
            <Notation>{"=A3*(1+B3/100)"}</Notation>.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Проценты»"} />
          <Typography.Text>
            Изменение в процентах считают от старого значения: (новое − старое)
            / старое. От 80 к 100 — рост на 25%, а обратно от 100 к 80 — падение
            на 20%: основание другое.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Изменение»"} />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Округление",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"ОКРУГЛ"}</Notation> округляет по обычному правилу,{" "}
              <Notation>{"ОКРУГЛВВЕРХ"}</Notation> и{" "}
              <Notation>{"ОКРУГЛВНИЗ"}</Notation> — от нуля и к нулю; второй
              аргумент — разряд.
            </strong>{" "}
            ОКРУГЛ(<Notation>{"A2"}</Notation>;2) округляет до двух знаков после
            запятой. Второй аргумент 0 означает целое число, −1 — десятки, −2 —
            сотни. Например, <Notation>{"=ОКРУГЛ(126;-1)"}</Notation> даёт 130, а ровно
            половина округляется от нуля: <Notation>{"=ОКРУГЛ(2,5;0)"}</Notation>{" "}
            даёт 3.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"ОКРУГЛВВЕРХ"}</Notation> округляет от нуля,{" "}
            <Notation>{"ОКРУГЛВНИЗ"}</Notation> — к нулю. На положительных
            числах это выглядит как привычное увеличение или уменьшение. На
            отрицательных направление нужно понимать именно относительно нуля:{" "}
            <Notation>{"ОКРУГЛВВЕРХ(-2,3;0)"}</Notation> даёт -3,{" "}
            <Notation>{"ОКРУГЛВНИЗ(-2,3;0)"}</Notation> даёт -2.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"ЦЕЛОЕ"}</Notation> округляет вниз по числовой прямой:{" "}
            <Notation>{"ЦЕЛОЕ(-2,3)"}</Notation> равно -3.{" "}
            <Notation>{"ОТБР"}</Notation> отбрасывает дробную часть и даёт -2.
            Для неотрицательных чисел при нуле десятичных знаков эти операции
            совпадают; для отрицательных — нет.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.roundLine_5a9f54}
            caption={
              <>
                Куда каждая функция переносит −2,3 и 2,3. «От нуля» и «к нулю» —
                направления относительно нуля, поэтому у отрицательного числа
                стрелки ОКРУГЛВВЕРХ и ОКРУГЛВНИЗ смотрят в другую сторону. ЦЕЛОЕ
                всегда идёт влево.
              </>
            }
          />
          <Typography.Text>
            Пять способов на одних и тех же числах — поменяй числа в столбце A и
            сравни:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Округление»"} />
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Число коробок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Число коробок — частное, округлённое вверх.</strong> В
            коробку помещается 8 тетрадей, тетрадей 19. Частное 19 / 8 = 2,375:
            две коробки полны, а для трёх оставшихся тетрадей нужна третья.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.groups19_8_boxes_3aab2d}
            caption={
              <>
                Две полные коробки и третья неполная:{" "}
                <Notation>{"ОКРУГЛВВЕРХ"}</Notation> поднимает 2,375 до 3.
              </>
            }
          />
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Коробки»"} />
          <Typography.Text>
            Округляй там, где этого требует задача: сумма округлённых значений
            может отличаться от округлённой суммы. 0,6 + 0,6 = 1,2 округляется
            до 1, а 1 + 1 после округления каждого слагаемого — это 2.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: коробки без ОКРУГЛВВЕРХ"
            kind="nuance"
          >
            <Typography.Text>
              Для целых n ≥ 0 и k {">"} 0 то же число коробок даёт{" "}
              <Notation>{"=ЦЕЛОЕ((n+k-1)/k)"}</Notation>: прибавка k − 1
              переводит любой неполный остаток в ещё одну целую коробку, а
              точное деление оставляет как есть. Столбец D листа считает так.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Остаток",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"ОСТАТ(n;k)"}</Notation> — сколько остаётся от n после
              всех полных групп по k; ноль означает «делится».
            </strong>{" "}
            17 по 5: три полные пятёрки и 2 в остатке, 17 = 3 × 5 + 2, и{" "}
            <Notation>{"=ОСТАТ(17;5)"}</Notation> возвращает 2.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.groups17_5_rest_75ed6d}
            caption={
              <>
                Три полные группы по 5, в остатке 2 — это и возвращает{" "}
                <Notation>{"ОСТАТ"}</Notation>.
              </>
            }
          />
          <Typography.Text>
            Число делится на k, когда <Notation>{"=ОСТАТ(A2;k)=0"}</Notation>.
            Чётность — при k = 2. Последняя цифра неотрицательного целого —{" "}
            <Notation>{"ОСТАТ(A2;10)"}</Notation>, две последние цифры —{" "}
            <Notation>{"ОСТАТ(A2;100)"}</Notation>.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Остаток»"} />
          <Typography.Text>
            У отрицательного числа «последней цифрой» обычно называют цифру его
            модуля — числа без знака. Модуль даёт <Notation>{"ABS"}</Notation>:{" "}
            <Notation>{"ABS(-27)"}</Notation> = 27, и цифра —{" "}
            <Notation>{"=ОСТАТ(ABS(A2);10)"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: ОСТАТ отрицательного числа"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"ОСТАТ"}</Notation> в Excel берёт частное, округлённое
              вниз, поэтому остаток не меняет знак вслед за числом:{" "}
              <Notation>{"ОСТАТ(-7;3)"}</Notation> = 2, ведь −7 = (−3) × 3 + 2.
              Для проверки кратности это не важно: у кратного числа остаток 0 и
              при минусе.
            </Typography.Text>
            <SheetBlock {...lessonMedia.sheet6} label={"Лист «Знак»"} />
          </ProofDisclosure>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t9",
      prompt: (
        <>
          <Typography.Text>
            Сколько коробок по 6 нужно для 25 предметов? Запиши формулу.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=ОКРУГЛВВЕРХ(25/6;0)"}</Notation> = 5: четыре коробки
            вмещают только 24 предмета.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2"}</Notation> отрицательное целое -127. Как
            проверить, оканчивается ли модуль числа на 7?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=ОСТАТ(ABS(A2);10)=7"}</Notation>. Сначала убирается
            знак, затем берётся остаток по основанию 10.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Цена выросла с 250 до 300 рублей. На сколько процентов? А если бы
            упала с 300 до 250?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            На 20%; при падении с 300 до 250 — примерно на 16,7%: (250 −
            300)/300.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Найди <Notation>{"ОСТАТ(100;7)"}</Notation> и запиши равенство вида
            100 = 7·q + r.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>2: 100 = 7·14 + 2.</Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Проверь одной формулой, делится ли число в{" "}
            <Notation>{"A2"}</Notation> одновременно на 3 и на 5. Что она вернёт
            для 45 и для 50?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=И(ОСТАТ(A2;3)=0;ОСТАТ(A2;5)=0)"}</Notation>: для 45 —{" "}
            <Notation>{"ИСТИНА"}</Notation>, для 50 —{" "}
            <Notation>{"ЛОЖЬ"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Процент, округление и остаток меняют само число — значит, их пишут
        формулой там, где этого требует задача. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Проценты",
            note: (
              <>
                Скидка — множитель 1 − p, наценка — 1 + p; изменение — (новое −
                старое) / старое.
              </>
            ),
          },
          {
            key: "Округление",
            note: (
              <>
                <Notation>{"ОКРУГЛ"}</Notation> — по правилу,{" "}
                <Notation>{"ОКРУГЛВВЕРХ"}</Notation> — от нуля,{" "}
                <Notation>{"ОКРУГЛВНИЗ"}</Notation> — к нулю;{" "}
                <Notation>{"ЦЕЛОЕ"}</Notation> — влево по прямой.
              </>
            ),
          },
          {
            key: "Коробки",
            note: (
              <>
                n предметов по k — <Notation>{"ОКРУГЛВВЕРХ(n/k;0)"}</Notation>.
              </>
            ),
          },
          {
            key: "Делимость",
            note: (
              <>
                <Notation>{"ОСТАТ(n;k)=0"}</Notation>; последняя цифра —{" "}
                <Notation>{"ОСТАТ(n;10)"}</Notation>, у отрицательных — от{" "}
                <Notation>{"ABS(n)"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
};

export default content;
