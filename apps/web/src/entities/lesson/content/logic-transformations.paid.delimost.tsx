// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./logic-transformations.paid.delimost.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "del-kto-na-kogo",
      navLabel: "Кто на кого делится",
      explanation: (
        <>
          <Typography.Text>
            Чем ДЕЛ(x, 15) отличается от ДЕЛ(15, x)?
          </Typography.Text>
          <Typography.Text>
            <strong>
              В ДЕЛ(n, m) первое число делится на второе. ДЕЛ(x, 15) — x кратно
              15: 15, 30, 45, … ДЕЛ(15, x) — x делитель 15: 1, 3, 5, 15.
            </strong>{" "}
            Кратных бесконечно много, а делителей — всегда несколько.
          </Typography.Text>
          <Typography.Text>
            Пример: при каком наименьшем x {">"} 1 истинно ДЕЛ(x, 30) ∨ ДЕЛ(15,
            x)? Первая часть требует кратного 30 — это 30, 60, … Вторая —
            делителя 15 — это 1, 3, 5, 15. Хватит одной истинной части, поэтому
            ответ — 3.
          </Typography.Text>
          <Typography.Text>
            На Python ДЕЛ(n, m) записывают остатком:{" "}
            <PythonTerm term="intdiv">
              <Notation>{"n % m == 0"}</Notation>
            </PythonTerm>
            . Порядок тот же: ДЕЛ(15, x) — это{" "}
            <Notation>{"15 % x == 0"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nok",
      navLabel: "Делится на оба",
      explanation: (
        <>
          <Typography.Text>Когда x делится и на 21, и на 35?</Typography.Text>
          <Typography.Text>
            <strong>
              Если число делится на два числа, оно делится и на их наименьшее
              общее кратное — НОК. И наоборот.
            </strong>{" "}
            НОК находят по разложению на простые множители: каждый множитель
            берут столько раз, сколько он встречается в том числе, где его
            больше.
          </Typography.Text>
          <Typography.Text>
            21 = 3 · 7, 35 = 5 · 7. В НОК нужны 3, 5 и одна 7: НОК(21, 35) = 3 ·
            5 · 7 = 105. Значит, ДЕЛ(x, 21) ∧ ДЕЛ(x, 35) — то же, что ДЕЛ(x,
            105).
          </Typography.Text>
          <Typography.Text>
            Теперь задача: наибольшее натуральное A, при котором ДЕЛ(x, A) ∨
            ¬ДЕЛ(x, 21) ∨ ¬ДЕЛ(x, 35) тождественно истинна. Части без A ложны,
            когда x делится и на 21, и на 35, — это x = 105, 210, 315, … Каждое
            из этих чисел должно делиться на A.
          </Typography.Text>
          <Typography.Text>
            Если A делит 105, оно делит и все кратные 105. А A больше 105 не
            делит само 105. Наибольшее A = 105.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-kratnyh",
      navLabel: "Несколько кратных",
      explanation: (
        <>
          <Typography.Text>
            В задаче темы на отрезке было одно кратное 15. А если их несколько?
            Возьмём ту же формулу с отрезком [50; 100]: ДЕЛ(x, A) ∨ ((x ∈ [50;
            100]) → ¬ДЕЛ(x, 15)).
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если A должно делить несколько чисел, наибольшее такое A — их
              наибольший общий делитель, НОД.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Всё решает A при кратных 15 на отрезке: 60, 75 и 90. A должно делить
            каждое из них.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfSet45_105_50x100andDELx15_0863fa}
            caption={
              <>
                Кратные 15 на отрезке [50; 100]: 60, 75 и 90. 45 и 105 лежат вне
                отрезка.
              </>
            }
          />
          <Typography.Text>
            НОД тоже находят по разложению — теперь берут только общие
            множители: 60 = 2² · 3 · 5, 75 = 3 · 5², 90 = 2 · 3² · 5. Общие —
            одна 3 и одна 5: НОД = 15. Ответ — 15.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: НОД без разложения">
            <Typography.Text>
              Общий делитель двух чисел делит и их разность: НОД(60, 75) делит
              75 − 60 = 15. Так быстро видно, что ответ не больше 15, — остаётся
              проверить, что 15 делит все три числа. В Python есть готовая
              функция:{" "}
              <PythonTerm term="import">
                <Notation>{"math.gcd(60, 75, 90)"}</Notation>
              </PythonTerm>{" "}
              даёт 15.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "a-granica",
      navLabel: "A — граница",
      explanation: (
        <>
          <Typography.Text>
            Как быть, если A с x сравнивают, а не делят? Пример: наименьшее
            натуральное A, при котором (x ∈ [10; 40]) → (ДЕЛ(x, 3) ∨ (x {"<"}{" "}
            A)) тождественно истинна.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Всё решает A при числах отрезка, которые не делятся на 3. Каждое
              из них должно быть меньше A — значит, A больше самого большого из
              них.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Стрелка: ¬(x ∈ [10; 40]) ∨ ДЕЛ(x, 3) ∨ (x {"<"} A). Части без A
            ложны, когда x на отрезке и не кратно 3: 10, 11, 13, 14, …, 40.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfSet5_45_10x40andnotDELx3_5d5e98}
            caption={
              <>
                Числа отрезка [10; 40], не кратные 3. Самое большое — его правый
                конец 40.
              </>
            }
          />
          <Typography.Text>
            40 = 3 · 13 + 1 на 3 не делится. Нужно 40 {"<"} A — наименьшее A =
            41. Проверяй конец отрезка: если бы он делился на 3, граница была бы
            на число раньше.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "a-nabor-chisel",
      navLabel: "A — набор чисел",
      explanation: (
        <>
          <Typography.Text>
            Бывает, что A — набор чисел, как в подтеме об отрезках и множествах.
            Пример: A — конечное множество натуральных чисел, и формула (x ∈
            [10; 40]) → (ДЕЛ(x, 5) ∨ (x ∈ A)) тождественно истинна. Какое
            наименьшее количество чисел в A?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Всё решает A при числах отрезка, не кратных 5: каждое из них
              обязано лежать в A. Наименьшее A — ровно эти числа.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Всего на отрезке [10; 40] 40 − 10 + 1 = 31 число. Кратных 5 среди
            них 7: 10, 15, 20, 25, 30, 35, 40. Остальные 31 − 7 = 24 числа и
            есть наименьшее A. Ответ — 24.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: сколько кратных на отрезке"
          >
            <Typography.Text>
              На отрезке от a до b всего b − a + 1 целых чисел. Кратные m
              считают от первого до последнего: (40 − 10) / 5 + 1 = 7. Без «+1»
              легко потерять один из концов.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "delimost-programmoj",
      navLabel: "Программой",
      explanation: (
        <>
          <Typography.Text>Как проверить ответ 105 программой?</Typography.Text>
          <Typography.Text>
            <strong>
              Шаблон тот же, что для задачи темы: ДЕЛ записывают через{" "}
              <Notation>{"%"}</Notation>, а диапазон x берут таким, чтобы в него
              попало несколько чисел, где всё решает A.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "def f(x, A):\n    return x % A == 0 or x % 21 != 0 or x % 35 != 0"
            }
            label={"Формула с ДЕЛ на Python"}
            language="python"
          />
          <CodeBlock
            code={
              "answer = 0\nfor A in range(1, 1000):\n    if all(f(x, A) for x in range(1, 10000)):\n        answer = A\nprint(answer)"
            }
            label={"Наибольшее A для ДЕЛ(x, 21) и ДЕЛ(x, 35)"}
            language="python"
            output={"105"}
          />
          <Typography.Text>
            Всё решает A при x = 105, 210, …, поэтому x до 9999 — с большим
            запасом: в диапазоне 95 таких чисел. A до 999 хватает: A больше 105
            не делит 105.
          </Typography.Text>
          <LessonTable
            label={"Запись условий делимости на Python"}
            columns={[{ label: "В условии" }, { label: "На Python" }]}
            rows={[
              ["ДЕЛ(x, A)", <Notation key="a">{"x % A == 0"}</Notation>],
              ["¬ДЕЛ(x, 21)", <Notation key="b">{"x % 21 != 0"}</Notation>],
              ["ДЕЛ(A, x)", <Notation key="c">{"A % x == 0"}</Notation>],
            ]}
          />
        </>
      ),
    },
    {
      id: "delimost-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "ДЕЛ(x, m)", note: <>x кратно m</> },
              { key: "ДЕЛ(m, x)", note: <>x — делитель m</> },
              { key: "Делится на оба", note: <>делится на их НОК</> },
              {
                key: "A делит несколько чисел",
                note: <>наибольшее A — их НОД</>,
              },
              { key: "A — граница", note: <>больше самого большого числа</> },
              { key: "A — набор", note: <>все числа, где решает A</> },
              { key: "Python", note: <>n % m == 0, x — с запасом</> },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: <>При каких натуральных x истинно ДЕЛ(12, x)?</>,
      reveal: <>x = 1, 2, 3, 4, 6, 12 — делители 12.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>Чему равен НОК(12, 18)?</>,
      reveal: <>36: 12 = 2² · 3, 18 = 2 · 3², НОК = 2² · 3² = 36.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Какое наибольшее A, при котором ДЕЛ(x, A) ∨ ¬ДЕЛ(x, 12) ∨ ¬ДЕЛ(x, 18)
          тождественно истинна?
        </>
      ),
      reveal: <>36: всё решает A при кратных НОК(12, 18) = 36.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Какое наименьшее A, при котором (x ∈ [15; 44]) → (ДЕЛ(x, 4) ∨ (x {"<"}{" "}
          A)) тождественно истинна?
        </>
      ),
      reveal: (
        <>
          44: конец 44 делится на 4, самое большое некратное — 43, нужно 43{" "}
          {"<"} A.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          (x {"<"} 40) → (¬(ДЕЛ(x, 10) ∧ ¬ДЕЛ(x, 4)) ∨ (x {"<"} A)). При каких x
          всё решает A и какое наименьшее A?
        </>
      ),
      reveal: (
        <>
          При кратных 10, но не 4, меньших 40: 10 и 30. Нужно 30 {"<"} A —
          наименьшее A = 31.
        </>
      ),
    },
  ],
};

export default content;
