// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./divisors-and-masks.paid.vid-chisla.media";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "formula-kolichestva",
      navLabel: "Количество делителей",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для огромных диапазонов.</strong>{" "}
            Когда чисел так много, что искать делители у каждого не успеть,
            помогает разложение: по количеству делителей видно, как выглядит
            число, и строят только таких кандидатов. Задачи основных подтем
            решаются без этого урока.
          </Typography.Text>
          <Typography.Text>
            Как узнать количество делителей по разложению, не выписывая их?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждый делитель собирают из тех же простых множителей: двоек — от
              0 до трёх штук, троек — от 0 до двух. Для 72 = 2³ · 3² это 4 · 3 =
              12 вариантов.
            </strong>{" "}
            Разложим делители 72 сеткой: строка — сколько взяли двоек, столбец —
            сколько троек.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.divisorGrid2_3_3_2}
            caption={
              <>
                Делители 72 = 2³ · 3². В клетке — произведение степени двойки из
                строки и степени тройки из столбца. Строк 4, столбцов 3, клеток
                12.
              </>
            }
          />
          <Typography.Text>
            В общем виде: если n = p₁<sup>a₁</sup> · p₂<sup>a₂</sup> · … · pₖ
            <sup>aₖ</sup>, то делителей (a₁ + 1)(a₂ + 1)…(aₖ + 1). Единица
            прибавляется, потому что множитель можно не брать вовсе. 360 = 2³ ·
            3² · 5, делителей 4 · 3 · 2 = 24. Формула считает и 1, и само число;
            без них делителей на 2 меньше.
          </Typography.Text>
          <Typography.Text>
            Сетка заодно делит делители на чётные и нечётные. В верхней строке
            двоек нет — там три нечётных делителя: 1, 3, 9. В остальных строках
            двойка есть хотя бы одна, это девять чётных делителей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "forma-chisla",
      navLabel: "Вид числа",
      explanation: (
        <>
          <Typography.Text>
            Какие числа имеют ровно три делителя?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Только квадраты простых чисел, p²: 3 нельзя разложить в
              произведение чисел больше 1, значит, простой множитель один и
              стоит во второй степени.
            </strong>{" "}
            4, 9, 25, 49, 121 — у 25 делители 1, 5, 25. Так же выводятся и
            другие случаи — выбери количество (p и q — разные простые):
          </Typography.Text>
          <VariantPicker
            label={"Количество делителей и вид числа"}
            defaultIndex={2}
            variants={[
              { label: "2 делителя", value: <>p</> },
              { label: "3 делителя", value: <>p²</> },
              {
                label: "4 делителя",
                value: <>p³ или pq</>,
                note: (
                  <>4 = 4 даёт p³, 4 = 2 · 2 даёт pq: 8 = 2³ и 15 = 3 · 5</>
                ),
              },
              { label: "5 делителей", value: <>p⁴</> },
              { label: "6 делителей", value: <>p⁵ или p²q</> },
            ]}
          />
          <Typography.Text>
            Где тут выигрыш? Числа до 10¹² ровно с пятью делителями — это p⁴, а
            p⁴ ≤ 10¹² значит p ≤ 1000. Вместо триллиона чисел — простые до
            тысячи, их 168:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "found = [p ** 4 for p in range(2, 1001) if is_prime(p)]\nprint(len(found), found[:5])"
            }
            label={"Числа до 10¹² ровно с пятью делителями"}
            language="python"
            output={"168 [16, 81, 625, 2401, 14641]"}
          />
        </>
      ),
    },
    {
      id: "nechetnoe-kolichestvo",
      navLabel: "Нечётное количество",
      explanation: (
        <>
          <Typography.Text>
            У каких чисел нечётное количество делителей?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Только у квадратов: делители идут парами, и лишь у квадрата одна
              пара — √n и √n — даёт один делитель.
            </strong>{" "}
            Сравни 36 и 40:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.twoArcs36_40}
            caption={
              <>
                Слева 36: четыре дуги и кружок у 6 — делитель без пары, всего 4
                · 2 + 1 = 9. Справа 40: только дуги, 4 · 2 = 8.
              </>
            }
          />
          <Typography.Text>
            Поэтому «нечётное количество делителей» проверяют без делителей:{" "}
            <Notation>{"isqrt(n) ** 2 == n"}</Notation> — n полный квадрат.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vid-vmesto-perebora",
      navLabel: "Вид вместо перебора",
      explanation: (
        <>
          <Typography.Text>
            Найди числа на отрезке [10⁹; 10⁹ + 2 000 000] ровно с тремя
            делителями и для каждого — наибольший делитель меньше самого числа.
            Два миллиона чисел, у каждого до 31 600 кандидатов в делители — это
            6 · 10¹⁰ проверок. Как успеть?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебирать не числа, а простые p, у которых p² попадает на
              отрезок. Делители p² — 1, p и p², поэтому наибольший делитель
              меньше числа — это p.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "low = 10**9\nhigh = 10**9 + 2_000_000\nfor p in range(isqrt(low - 1) + 1, isqrt(high) + 1):\n    if is_prime(p):\n        print(p * p, p)"
            }
            label={"Ровно три делителя на огромном отрезке"}
            language="python"
            output={"1000267129 31627\n1001279449 31643\n1001659201 31649"}
          />
          <Typography.Text>
            Кандидатов p около тридцати. Нижняя граница{" "}
            <Notation>{"isqrt(low - 1) + 1"}</Notation> — наименьшее p, у
            которого p² ≥ low: если low не квадрат,{" "}
            <Notation>{"isqrt(low)"}</Notation> дал бы p² меньше low.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vid-i-maska",
      navLabel: "Вид числа и маска",
      explanation: (
        <>
          <Typography.Text>
            Числа до 10⁸ по маске <Notation>{"1*369"}</Notation> ровно с тремя
            делителями. Строить по маске или по виду числа?
          </Typography.Text>
          <Typography.Text>
            <strong>
              По виду: чисел p² до 10⁸ мало — p не больше 10 000, — и у каждого
              проверяем только маску.
            </strong>{" "}
            По маске вышло бы 1111 кандидатов, и у каждого пришлось бы искать
            делители.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from fnmatch import fnmatch\n\nfor p in range(2, 10**4 + 1):\n    if is_prime(p) and fnmatch(str(p * p), '1*369'):\n        print(p * p)"
            }
            label={"p² по маске 1*369"}
            language="python"
            output={"1369\n1471369\n11992369\n19918369"}
          />
          <Typography.Text>
            Перебор p не растёт, если маска станет сложнее: он зависит только от
            границы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vid-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Количество",
                note: <>(a₁ + 1)(a₂ + 1)…(aₖ + 1) по разложению</>,
              },
              { key: "3 делителя", note: <>p²</> },
              { key: "4 делителя", note: <>p³ или p · q</> },
              { key: "5 делителей", note: <>p⁴</> },
              {
                key: "Нечётное количество",
                note: <>только полные квадраты</>,
              },
              {
                key: "Огромный отрезок",
                note: <>перебирать p, а не числа</>,
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
      prompt: <>Сколько делителей у 360 = 2³ · 3² · 5?</>,
      reveal: <>24: (3 + 1)(2 + 1)(1 + 1) = 4 · 3 · 2.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>Выпиши все числа до 100, у которых ровно три делителя.</>,
      reveal: <>4, 9, 25, 49 — квадраты простых 2, 3, 5, 7.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Сколько делителей у числа 96 = 2⁵ · 3? А без единицы и самого числа?
        </>
      ),
      reveal: <>12: (5 + 1)(1 + 1). Без 1 и 96 — 10.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Почему у 40 чётное количество делителей, а у 36 — нечётное?</>,
      reveal: (
        <>
          40 не квадрат: все делители разбиваются на пары. У 36 = 6 · 6 делитель
          6 стоит в паре сам с собой.
        </>
      ),
    },
  ],
};

export default content;
