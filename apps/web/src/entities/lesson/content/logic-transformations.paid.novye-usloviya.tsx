// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Typography } from "~/shared/components/typography";
import {
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "treugolnik",
      navLabel: "Треугольник существует",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если в формуле встречается незнакомое условие —
            например, «треугольник со сторонами x, 4 и 7 существует»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Незнакомое условие сначала переводят в знакомые неравенства по его
              определению, а дальше решают как обычно: ищут x, при которых всё
              решает A.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Треугольник со сторонами a, b, c существует, когда каждая сторона
            меньше суммы двух других: a {"<"} b + c, b {"<"} a + c, c {"<"} a +
            b. Для сторон x, 4 и 7 получаем x {"<"} 11, 4 {"<"} x + 7 (верно
            всегда) и 7 {"<"} x + 4, то есть x {">"} 3. Для натуральных x — от 4
            до 10.
          </Typography.Text>
          <Typography.Text>
            Неравенства строгие: при x = 3 стороны 3 и 4 вместе дают ровно 7 и
            складываются в отрезок — треугольника нет.
          </Typography.Text>
          <Typography.Text>
            Пусть T(x, 4, 7) — «треугольник со сторонами x, 4, 7 существует», и
            нужно наименьшее натуральное A, при котором T(x, 4, 7) → (x {"<"} A)
            тождественно истинна. Всё решает A при x от 4 до 10: каждое должно
            быть меньше A. Наименьшее A = 11.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "max-dvuh-chisel",
      navLabel: "MAX",
      explanation: (
        <>
          <Typography.Text>
            Как быть с MAX(x, 8) — большим из двух чисел?
          </Typography.Text>
          <Typography.Text>
            <strong>MAX разбирают на два случая: какое из чисел больше.</strong>{" "}
            MAX(x, 8) равно 8, пока x ≤ 8, и равно x, когда x ≥ 8.
          </Typography.Text>
          <LessonTable
            label={"Значения MAX(x, 8)"}
            columns={[{ label: "x" }, { label: "MAX(x, 8)" }]}
            rows={[
              ["1, 2, …, 8", "8"],
              ["9", "9"],
              ["20", "20"],
            ]}
          />
          <Typography.Text>
            Пример: наименьшее целое A, при котором (MAX(x, 8) {"<"} A) ∨ (x{" "}
            {">"} 20) тождественно истинна для натуральных x. Всё решает A при x
            ≤ 20. Самое большое значение MAX(x, 8) на них — 20, при x = 20.
            Нужно 20 {"<"} A, наименьшее A = 21.
          </Typography.Text>
          <Typography.Text>
            Если бы A решало только при x ≤ 7, MAX(x, 8) там всегда равнялся бы
            8, и ответ был бы 9.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otrezok-s-a",
      navLabel: "Отрезок с концом A",
      explanation: (
        <>
          <Typography.Text>
            Что, если A стоит в конце отрезка? Найдём наибольшее натуральное A ≤
            50, при котором (x ∈ [A; A + 5]) → ¬ДЕЛ(x, 7) тождественно истинна.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если числа, где всё решает A, сами зависят от A, их нельзя
              выписать один раз. Ищут условие на само A.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Формула требует, чтобы среди шести чисел A, A + 1, …, A + 5 не было
            кратного 7. Из семи подряд идущих чисел ровно одно кратно 7. Шесть
            чисел обходят его, только если начинаются сразу после кратного: A
            при делении на 7 даёт остаток 1.
          </Typography.Text>
          <Typography.Text>
            Подходят A = 1, 8, 15, …, 50. Наибольшее A ≤ 50 — 50 = 7 · 7 + 1:
            числа от 50 до 55 на 7 не делятся. А при A = 49 само 49 кратно 7.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "delimost-a",
      navLabel: "Делители самого A",
      explanation: (
        <>
          <Typography.Text>
            Найдём наибольшее натуральное A ≤ 100, при котором (ДЕЛ(A, x) ∧
            ДЕЛ(x, 2)) → ДЕЛ(60, x) тождественно истинна.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Бывает, что при некоторых A чисел, где всё решает A, нет вовсе —
              тогда такое A подходит сразу.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Всё решает A при чётных делителях A, которые не делят 60. Если A
            чётное, то само A — свой чётный делитель, поэтому A должно делить
            60, и наибольшее такое A — 60.
          </Typography.Text>
          <Typography.Text>
            Но у нечётного A чётных делителей нет совсем: левая часть всегда
            ложна, и формула истинна при любом x. Наибольшее нечётное A ≤ 100 —
            99. Ответ — 99, а не 60.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "usloviya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Новое условие",
                note: <>перевести в неравенства по определению</>,
              },
              {
                key: "Треугольник",
                note: <>каждая сторона меньше суммы двух других</>,
              },
              { key: "MAX(x, c)", note: <>c при x ≤ c, x при x ≥ c</> },
              {
                key: "Числа зависят от A",
                note: <>найти условие на само A</>,
              },
              {
                key: "Таких чисел нет",
                note: <>формула истинна при любом x</>,
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
          При каких натуральных x существует треугольник со сторонами x, 5 и 9?
        </>
      ),
      reveal: (
        <>
          x от 5 до 13: 9 − 5 {"<"} x {"<"} 9 + 5.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Какое наименьшее A, при котором T(x, 5, 9) → (x {"<"} A) тождественно
          истинна?
        </>
      ),
      reveal: <>14: наибольший подходящий x — 13.</>,
    },
    {
      id: "zadacha-3",
      prompt: <>Чему равно MAX(x, 12) при x = 5 и при x = 15?</>,
      reveal: <>12 и 15.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Сколько чисел, кратных 7, среди любых семи чисел подряд?</>,
      reveal: <>Ровно одно.</>,
    },
  ],
};

export default content;
