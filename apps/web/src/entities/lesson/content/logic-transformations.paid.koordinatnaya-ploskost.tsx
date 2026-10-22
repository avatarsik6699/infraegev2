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
import { lessonMedia } from "./logic-transformations.paid.koordinatnaya-ploskost.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "tochki-ploskosti",
      navLabel: "Точки, где всё решает A",
      explanation: (
        <>
          <Typography.Text>
            Что меняется, когда в формуле две переменные — x и y? Например:
          </Typography.Text>
          <Typography.Text>
            «Для какого наименьшего целого A формула (x ≥ 12) ∨ (y {">"} 5) ∨
            (A {">"} x · y) тождественно истинна, то есть принимает значение 1
            при любых натуральных x и y?»
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пара (x; y) — точка на клетчатой плоскости. Точки, где ложны все
              части без A, образуют область, и в каждой её точке часть с A
              обязана быть истинной.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Части без A ложны, когда x {"<"} 12 и y ≤ 5. Для натуральных чисел
            это x от 1 до 11 и y от 1 до 5 — прямоугольник из 55 точек. В каждой
            из них нужно A {">"} x · y.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfPlanex12andy5_14_8_1f314e}
            caption={
              <>
                Тёмные точки — где всё решает A: x ≤ 11, y ≤ 5. Произведение x
                · y больше всего в углу (11; 5).
              </>
            }
          />
          <Typography.Text>
            <strong>
              A должно быть больше x · y во всех этих точках — значит, больше
              самого большого произведения.
            </strong>{" "}
            Оба числа положительные, поэтому произведение наибольшее при самых
            больших x и y: 11 · 5 = 55. Нужно A {">"} 55, наименьшее целое A =
            56.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: натуральные или неотрицательные"
          >
            <Typography.Text>
              Если x и y — неотрицательные целые, к точкам добавляются x = 0 и y
              = 0. Здесь ответ не меняется: произведение с нулём равно 0. Но в
              выражениях вроде x − y такие точки могут стать самыми трудными —
              всегда смотри, с какого числа начинаются x и y.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "naibolshee-ne-v-uglu",
      navLabel: "Не прямоугольная область",
      explanation: (
        <>
          <Typography.Text>
            Как найти наибольшее значение, если область — не прямоугольник?
            Возьмём формулу (2x + 3y ≥ 30) ∨ (x + 2y {"<"} A) и найдём
            наименьшее целое A для натуральных x и y.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебирают x и для каждого берут самый большой допустимый y:
              выражение, которое растёт вместе с y, наибольшее на верхнем краю
              области.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Всё решает A в точках, где 2x + 3y {"<"} 30. Для каждого x найдём
            самый большой y и значение x + 2y:
          </Typography.Text>
          <LessonTable
            label={"Верхний край области 2x + 3y < 30"}
            columns={[
              { label: "x" },
              { label: "Самый большой y" },
              { label: "x + 2y" },
            ]}
            rows={[
              ["1", "9: 2 + 27 = 29", "19"],
              ["2", "8: 4 + 24 = 28", "18"],
              ["3", "7: 6 + 21 = 27", "17"],
              ["4", "7: 8 + 21 = 29", "18"],
              ["5", "6: 10 + 18 = 28", "17"],
              ["…", "y дальше только уменьшается", "не больше 17"],
            ]}
          />
          <LessonDiagram
            {...lessonMedia.pfPlane2x3y30_14_10_c0a1e1}
            caption={
              <>
                Точки, где 2x + 3y {"<"} 30. Наибольшее x + 2y = 19 — в точке
                (1; 9), а не там, где x и y «самые большие по отдельности».
              </>
            }
          />
          <Typography.Text>
            Выгоднее маленький x и большой y: в x + 2y игрек идёт с множителем
            2. Наибольшее значение 19, нужно 19 {"<"} A — наименьшее A = 20.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "strogie-znaki",
      navLabel: "Строгие знаки",
      explanation: (
        <>
          <Typography.Text>
            Почему ответ часто на единицу отличается от «очевидного»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Для целых чисел строгий знак сдвигает границу на единицу: x {"<"}{" "}
              12 — это x ≤ 11, а A {">"} 30 — это A ≥ 31.
            </strong>{" "}
            Нестрогий знак границу оставляет: x ≥ 12 включает и само 12.
          </Typography.Text>
          <Typography.Text>
            Пример: (y {">"} 10) ∨ (x {">"} y) ∨ (2x + y {"<"} A), x и y —
            натуральные, нужно наименьшее A. Всё решает A, когда y ≤ 10 и x ≤ y
            — точки не выше 10 и не правее диагонали x = y.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfPlaney10andxy_12_12_c787af}
            caption={
              <>
                Треугольник точек y ≤ 10, x ≤ y. Точка (10; 10) лежит на границе
                обеих частей: y {">"} 10 и x {">"} y в ней ложны, поэтому она
                тоже требует A.
              </>
            }
          />
          <Typography.Text>
            Наибольшее 2x + y — в точке (10; 10): 30. Знак строгий: нужно 30{" "}
            {"<"} A, поэтому A = 30 не подходит — в точке (10; 10) формула
            ложна. Наименьшее A = 31.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naibolshee-a-ploskost",
      navLabel: "Наибольшее A",
      explanation: (
        <>
          <Typography.Text>
            Что, если A должно быть меньше выражения? Пример: (x ≥ 8) ∨ (A {"<"}{" "}
            x · y) ∨ (y ≤ 7), x и y натуральные, нужно наибольшее A.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда A должно быть меньше выражения во всех точках области — и
              ищут наименьшее значение выражения.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Всё решает A, когда x ≤ 7 и y ≥ 8. Сверху область не ограничена, но
            это не мешает: наименьшее x · y — в точке (1; 8), оно равно 8. Нужно
            A {"<"} 8, наибольшее A = 7.
          </Typography.Text>
          <Typography.Text>
            Сравни с первой задачей подтемы: там A было больше x · y, и всё
            решало самое большое произведение. Здесь A меньше — решает самое
            маленькое.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "a-mnozhitelem",
      navLabel: "A множителем",
      explanation: (
        <>
          <Typography.Text>
            Как быть, если A стоит множителем при переменной? Пример: (y ≥ 10) ∨
            (A · x ≥ 2y + 5), x и y натуральные, нужно наименьшее целое A.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала выясняют знак A, потом ищут самую трудную точку: где левая
              часть меньше всего, а правая — больше всего.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Всё решает A, когда y ≤ 9, а x — любое натуральное. Если A ≤ 0, то A
            · x ≤ 0, а 2y + 5 положительно — формула ложна. Значит, A {">"} 0, и
            тогда A · x меньше всего при x = 1. Правая часть больше всего при y =
            9: 2 · 9 + 5 = 23.
          </Typography.Text>
          <Typography.Text>
            Нужно A · 1 ≥ 23, наименьшее A = 23. Проверка: при A = 23 и любом x ≥
            1 левая часть не меньше 23, а правая при y ≤ 9 не больше 23.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ploskost-programmoj",
      navLabel: "Программой",
      explanation: (
        <>
          <Typography.Text>Как решить такую задачу программой?</Typography.Text>
          <Typography.Text>
            <strong>
              Так же, как задачу темы, только перебирают пары x и y — двумя
              циклами внутри{" "}
              <PythonTerm term="anyall">
                <Notation>{"all(...)"}</Notation>
              </PythonTerm>
              .
            </strong>{" "}
            Первая задача подтемы:
          </Typography.Text>
          <CodeBlock
            code={
              "def f(x, y, A):\n    return x >= 12 or y > 5 or A > x * y\n\n\nfor A in range(-100, 1000):\n    if all(f(x, y, A) for x in range(1, 100) for y in range(1, 100)):\n        print(A)\n        break"
            }
            label={"Наименьшее A перебором пар x, y"}
            language="python"
            output={"56"}
          />
          <Typography.Text>
            x и y — до 99 с запасом: все числа условия меньше 12. A перебираем
            начиная с отрицательных: заранее неизвестно, что ответ больше нуля.
            Нужно наименьшее A, поэтому печатаем первое подходящее и
            останавливаемся —{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>
            .
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: область без верхней границы"
          >
            <Typography.Text>
              Программа проверяет только точки из диапазона. В задаче с A · x
              переменная x не ограничена, но самая трудная точка — x = 1, и она
              в диапазоне есть. Если область уходит в бесконечность, сначала
              убедись, что самая трудная точка внутри диапазона.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "ploskost-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Точка", note: <>пара (x; y) на клетчатой плоскости</> },
              {
                key: "Область",
                note: <>точки, где все части без A ложны</>,
              },
              {
                key: "A больше выражения",
                note: <>наибольшее значение в области — наименьшее A</>,
              },
              {
                key: "A меньше выражения",
                note: <>наименьшее значение в области — наибольшее A</>,
              },
              {
                key: "Не прямоугольник",
                note: <>для каждого x — самый большой y</>,
              },
              { key: "Строгий знак", note: <>граница сдвигается на 1</> },
              {
                key: "Python",
                note: <>два цикла внутри all, A с запасом в обе стороны</>,
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
      prompt: <>Для натуральных x что означает условие x {"<"} 9?</>,
      reveal: <>x ≤ 8: x от 1 до 8.</>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          (x ≥ 6) ∨ (y ≥ 4) ∨ (A {">"} x + y), x и y натуральные. Какое
          наименьшее A?
        </>
      ),
      reveal: <>9: всё решает A при x ≤ 5, y ≤ 3, наибольшее x + y = 8.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          (x + y {">"} 10) ∨ (A {">"} x · y), x и y натуральные. Какое
          наименьшее A?
        </>
      ),
      reveal: (
        <>26: при x + y ≤ 10 наибольшее произведение — 5 · 5 = 25.</>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          (x ≥ 5) ∨ (y ≤ 3) ∨ (A {"<"} x + y), x и y натуральные. Какое
          наибольшее A?
        </>
      ),
      reveal: <>4: всё решает A при x ≤ 4, y ≥ 4, наименьшее x + y = 5.</>,
    },
    {
      id: "zadacha-5",
      prompt: <>Зачем в программе для наименьшего A нужен break?</>,
      reveal: (
        <>
          Без него программа напечатает все подходящие A подряд, а ответ —
          первое из них.
        </>
      ),
    },
  ],
};

export default content;
