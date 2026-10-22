// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./logic-transformations.paid.porazryadnaya-konyunkciya.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "operaciya-i",
      navLabel: "Операция &",
      explanation: (
        <>
          <Typography.Text>Что означает запись x & 22?</Typography.Text>
          <Typography.Text>
            <strong>
              Числа записывают в двоичной системе друг под другом. В каждом
              разряде результата стоит 1, только если в этом разряде у обоих
              чисел 1.
            </strong>{" "}
            Операцию называют поразрядной конъюнкцией: это логическое И,
            применённое к каждой паре цифр.
          </Typography.Text>
          <Typography.Text>
            Посчитаем 26 & 13. Веса разрядов справа налево — 1, 2, 4, 8, 16, как
            в теме о системах счисления: 26 = 16 + 8 + 2 = 11010₂, 13 = 8 + 4 +
            1 = 01101₂.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfBits5_803832}
            caption={
              <>
                Единица у обоих чисел только в разряде 8 — поэтому 26 & 13 = 8.
              </>
            }
          />
          <Typography.Text>
            В формулах чаще важен не сам результат, а равен ли он нулю. x & M ≠
            0 — у x и M есть общая единица хотя бы в одном разряде. x & M = 0 —
            общих единиц нет. Например, 26 & 13 ≠ 0, а 26 & 5 = 0: у 5 = 101₂
            единицы в разрядах 4 и 1, а у 26 там нули.
          </Typography.Text>
          <Typography.Text>
            В Python операция записывается так же:{" "}
            <PythonTerm term="bitand">
              <Notation>{"26 & 13"}</Notation>
            </PythonTerm>{" "}
            даёт 8.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naimenshee-a-bity",
      navLabel: "Наименьшее A",
      explanation: (
        <>
          <Typography.Text>
            Найдём наименьшее неотрицательное A, при котором формула (x & 22 ≠
            0) → ((x & 10 = 0) → (x & A ≠ 0)) тождественно истинна при любом
            неотрицательном целом x.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Всё решает A при тех x, у которых есть единица из 22 и нет единиц
              из 10. A должно иметь общую единицу с каждым таким x.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Заменим стрелки: ¬(x & 22 ≠ 0) ∨ ¬(x & 10 = 0) ∨ (x & A ≠ 0). Части
            без A ложны, когда x & 22 ≠ 0 и x & 10 = 0. Разложим маски: 22 = 16
            + 4 + 2, 10 = 8 + 2. У такого x нет весов 8 и 2, но есть 16 или 4 —
            единственные веса 22, которых нет в 10.
          </Typography.Text>
          <Typography.Text>
            Возьмём x = 16. У него одна единица, значит, A обязано содержать
            вес 16 — иначе общей единицы не будет. Так же x = 4 требует вес 4.
            Значит, в A есть веса 16 и 4, и наименьшее такое A = 16 + 4 = 20.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfBits5_66cd11}
            caption={
              <>
                Веса 16 и 4 есть в 22 и нет в 10 (в рамках). Оба должны быть в
                A: A = 20.
              </>
            }
          />
          <Typography.Text>
            Проверка: любой x, где решает A, содержит 16 или 4 — общая единица с
            20 найдётся. A = 19 = 16 + 2 + 1 не подходит: при x = 4 общих единиц
            нет, и формула ложна.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему хватает x с одной единицей"
          >
            <Typography.Text>
              У x с одной единицей меньше всего шансов совпасть с A. Если A
              подходит для x = 16 и x = 4, то подходит и для x = 20, 22 или 30:
              в них есть хотя бы один из этих весов.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "naibolshee-a-bity",
      navLabel: "Наибольшее A",
      explanation: (
        <>
          <Typography.Text>
            Теперь A стоит слева от стрелки: найдём наибольшее A, при котором
            (x & A ≠ 0) → ((x & 12 = 0) → (x & 5 ≠ 0)) тождественно истинна.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Когда A стоит слева от стрелки, ищут разряды, которые брать в A
              нельзя, — и берут все остальные.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Заменим стрелки: (x & A = 0) ∨ (x & 12 ≠ 0) ∨ (x & 5 ≠ 0). Части без
            A ложны, когда у x нет единиц ни из 12 = 8 + 4, ни из 5 = 4 + 1 —
            то есть нет весов 8, 4 и 1. Тогда нужно x & A = 0.
          </Typography.Text>
          <Typography.Text>
            Такой x может содержать любой другой вес — 2, 16, 32, … Значит, этих
            весов в A быть не должно. Разрешены только 8, 4 и 1: наибольшее A =
            8 + 4 + 1 = 13.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfBits4_62e4cd}
            caption={
              <>
                Веса 8, 4 и 1 есть в 12 или в 5 — только их A может взять. A =
                13.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "bity-programmoj",
      navLabel: "Программой",
      explanation: (
        <>
          <Typography.Text>
            Как проверить ответ 20 программой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Шаблон тот же, что для задачи темы; меняется только формула и
              диапазон x.
            </strong>{" "}
            В Python знак & выполняется раньше сравнения, поэтому{" "}
            <Notation>{"x & 22 != 0"}</Notation> означает (x & 22) ≠ 0.
          </Typography.Text>
          <CodeBlock
            code={
              "def imp(p, q):\n    return (not p) or q\n\n\ndef f(x, A):\n    return imp(x & 22 != 0, imp(x & 10 == 0, x & A != 0))"
            }
            label={"Формула с масками 22 и 10"}
            language="python"
          />
          <CodeBlock
            code={
              "for A in range(0, 256):\n    if all(f(x, A) for x in range(0, 256)):\n        print(A)\n        break"
            }
            label={"Наименьшее A для масок 22 и 10"}
            language="python"
            output={"20"}
          />
          <Typography.Text>
            Почему x до 255? Все маски меньше 32 — в них пять разрядов. Разряды x
            старше пятого с масками не совпадают и на формулу не влияют.
            Диапазон до 256 берёт все сочетания восьми младших разрядов — с
            запасом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bity-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "x & M", note: <>1 там, где 1 у обоих чисел</> },
              { key: "x & M ≠ 0", note: <>есть общая единица</> },
              {
                key: "Наименьшее A",
                note: <>веса, которые обязаны быть в A</>,
              },
              {
                key: "Наибольшее A",
                note: <>все разрешённые веса</>,
              },
              { key: "Проверка", note: <>x с одной единицей</> },
              { key: "Python", note: <>x до 256 — с запасом</> },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: <>Чему равно 13 & 7?</>,
      reveal: <>5: 1101₂ & 0111₂ = 0101₂.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>Что означает x & 8 ≠ 0?</>,
      reveal: <>В двоичной записи x есть единица с весом 8.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Какое наименьшее A, при котором (x & 27 ≠ 0) → ((x & 10 = 0) → (x & A
          ≠ 0)) тождественно истинна?
        </>
      ),
      reveal: <>17: 27 = 16 + 8 + 2 + 1, 10 = 8 + 2; обязательны 16 и 1.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Какое наибольшее A, при котором (x & A ≠ 0) → ((x & 34 = 0) → (x & 8 ≠
          0)) тождественно истинна?
        </>
      ),
      reveal: <>42: разрешены веса 32 и 2 из 34 и вес 8.</>,
    },
    {
      id: "zadacha-5",
      prompt: <>Почему A проверяют на x с одной единицей?</>,
      reveal: (
        <>
          У такого x меньше всего общих разрядов с A: если A подходит для него,
          подходит и для остальных.
        </>
      ),
    },
  ],
};

export default content;
