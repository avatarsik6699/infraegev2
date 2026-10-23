// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./divisors-and-masks.paid.prostye-i-razlozhenie.media";
import { THEME_TASK } from "./divisors-and-masks.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "prostye-chisla",
      navLabel: "Простые числа",
      explanation: (
        <>
          <Typography.Text>
            Какое число простое и как это быстро проверить?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Простое число больше 1 и делится только на 1 и на себя. Делитель
              достаточно искать от 2 до √n: не нашёлся — число простое.
            </strong>{" "}
            Это тот же поиск до корня, что в подтеме 2, только останавливаемся
            на первом найденном делителе. Простые числа — 2, 3, 5, 7, 11, 13, …;
            12 составное, а 1 — ни то ни другое: делитель у неё один.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def is_prime(n):\n    if n < 2:\n        return False\n    for d in range(2, isqrt(n) + 1):\n        if n % d == 0:\n            return False\n    return True\n\nprint(is_prime(1), is_prime(2), is_prime(49), is_prime(97))"
            }
            label={"Проверка простоты"}
            language="python"
            output={"False True False True"}
          />
          <Typography.Text>
            <Notation>{"return True"}</Notation> стоит после цикла, а не внутри:
            одна неудачная попытка ещё ничего не доказывает. 25 не делится на 2,
            но делится на 5. У 2 цикл не выполнится ни разу — кандидатов от 2 до{" "}
            <Notation>{"isqrt(2)"}</Notation> = 1 нет, — и функция честно вернёт
            True.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razlozhenie",
      navLabel: "Разложение на множители",
      explanation: (
        <>
          <Typography.Text>
            Из каких простых чисел составлено число — и как это найти?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Делить на 2, пока делится, потом на 3, на 4 и дальше. Каждое
              удачное деление даёт простой множитель, а то, что осталось больше
              1 после цикла, — последний множитель.
            </strong>{" "}
            360 делится на 2 трижды: 360 → 180 → 90 → 45. Потом на 3 дважды: 45
            → 15 → 5. Осталось простое 5. В тетради так раскладывают лесенкой:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ladder360}
            caption={
              <>
                Разложение 360 лесенкой. Каждая строка — одно деление, правый
                столбец — простые множители с повторениями.
              </>
            }
          />
          <Typography.Text>Программа делает то же самое:</Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def prime_factors(n):\n    factors = []\n    m = n\n    d = 2\n    while d * d <= m:\n        while m % d == 0:\n            factors.append(d)\n            m //= d\n        d += 1\n    if m > 1:\n        factors.append(m)\n    return factors\n\nprint(prime_factors(360), prime_factors(7000421))"
            }
            label={"Разложение на простые множители"}
            language="python"
            output={"[2, 2, 2, 3, 3, 5] [61, 114761]"}
          />
          <Typography.Text>
            <Notation>{"m"}</Notation> — то, что осталось от числа;{" "}
            <Notation>{"m //= d"}</Notation> — это{" "}
            <Notation>{"m = m // d"}</Notation>. Внутренний{" "}
            <Notation>{"while"}</Notation>, а не <Notation>{"if"}</Notation>:
            иначе из 360 ушла бы одна двойка из трёх. Второе число — первое из
            ответа задачи темы: 7 000 421 = 61 · 114 761. Посмотри по шагам, как
            раскладывается 1050:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.factorStepper1050}
            label={"Разложение 1050 на простые множители по шагам"}
          />
          <Typography.Text>
            На d = 4 ничего не делится: двойка уже вынута, и составному
            кандидату делить нечего. Поэтому в список попадают только простые
            числа, хотя d перебирает все подряд. Цикл кончается, когда d · d
            больше остатка, — у 1050 остаётся 7, оно и есть последний множитель.
          </Typography.Text>
          <ProofDisclosure summary="Почему остаток после цикла — простое число">
            <Typography.Text>
              Если бы остаток m был составным, у него нашёлся бы делитель не
              больше √m — цикл до него дошёл бы и разделил. Раз цикл закончился,
              а m {">"} 1, у m нет делителей до корня, значит, оно простое.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "prostye-deliteli",
      navLabel: "Простые делители",
      explanation: (
        <>
          <Typography.Text>
            Условие спрашивает о простых делителях: наибольшем, их сумме или
            количестве. Где их взять?
          </Typography.Text>
          <Typography.Text>
            <strong>
              В разложении: простые делители — это его множители без повторов.{" "}
              <PythonTerm term="set">
                <Notation>{"set"}</Notation>
              </PythonTerm>{" "}
              убирает повторы, <Notation>{"sorted"}</Notation> выстраивает по
              возрастанию.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "P = sorted(set(prime_factors(84)))\nprint(prime_factors(84), P)"
            }
            label={"Простые делители 84"}
            language="python"
            output={"[2, 2, 3, 7] [2, 3, 7]"}
          />
          <Typography.Text>
            Это быстрее, чем искать все делители и проверять каждый на простоту.
            Дальше всё считается по списку P — выбери, что требуется:
          </Typography.Text>
          <VariantPicker
            label={"Величина по списку P простых делителей 84"}
            variants={[
              {
                label: "наименьший",
                value: (
                  <>
                    <Notation>{"P[0]"}</Notation> → 2
                  </>
                ),
              },
              {
                label: "наибольший",
                value: (
                  <>
                    <Notation>{"P[-1]"}</Notation> → 7
                  </>
                ),
              },
              {
                label: "наименьший + наибольший",
                value: (
                  <>
                    <Notation>{"P[0] + P[-1]"}</Notation> → 9
                  </>
                ),
              },
              {
                label: "сумма",
                value: (
                  <>
                    <Notation>{"sum(P)"}</Notation> → 12
                  </>
                ),
              },
              {
                label: "количество",
                value: (
                  <>
                    <Notation>{"len(P)"}</Notation> → 3
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            «Не считая самого числа» важно только для простых чисел: у 97
            разложение — <Notation>{"[97]"}</Notation>, и без самого числа
            простых делителей не остаётся. Величину тогда берут такой, как велит
            условие, обычно 0. У 49 = 7 · 7 делитель 7 не равен самому числу и
            остаётся.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "mnozhiteli-i-deliteli",
      navLabel: "Множители и делители",
      explanation: (
        <>
          <Typography.Text>
            «Произведение ровно двух простых множителей» и «ровно два различных
            простых делителя» — это одно и то же?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет. Множители считают с повторами —{" "}
              <Notation>{"len(f)"}</Notation>, различные делители без повторов —{" "}
              <Notation>{"len(set(f))"}</Notation>.
            </strong>{" "}
            Здесь <Notation>{"f = prime_factors(n)"}</Notation>:
          </Typography.Text>
          <LessonTable
            label={"Множители с повторами и различные простые делители"}
            columns={[
              { label: "Число", numeric: true },
              { label: "Разложение" },
              { label: "len(f)", numeric: true },
              { label: "len(set(f))", numeric: true },
            ]}
            rows={[
              ["15", "3 · 5", "2", "2"],
              ["9", "3 · 3", "2", "1"],
              ["12", "2 · 2 · 3", "3", "2"],
              ["30", "2 · 3 · 5", "3", "3"],
            ]}
          />
          <Typography.Text>
            «Ровно два простых множителя, не обязательно различных» — подходят
            15 и 9. «Ровно два различных простых делителя» — 15 и 12. Слова «не
            обязательно различных» разрешают квадраты простых: 9 = 3 · 3, 3721 =
            61 · 61.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы",
      explanation: (
        <>
          <Typography.Text>Вернёмся к задаче темы:</Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Всё готово: перебор вверх от 7 000 001 до пяти найденных,
              разложение каждого числа, ровно два множителя и цифры 1 и 6 в
              каждом из них.
            </strong>{" "}
            Проверку цифр мы написали в подтеме 1 — функция{" "}
            <Notation>{"has_1_and_6"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Сначала проверим программу там, где ответ можно найти вручную.
            Простые числа с цифрами 1 и 6 — это 61, 163, 167, … (16 и 106 не
            простые). Самые маленькие произведения двух таких чисел: 61 · 61 =
            3721, 61 · 163 = 9943, 61 · 167 = 10 187. Значит, после 3000
            программа должна найти именно эти три числа:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 3001\nfound = 0\nwhile found < 3:\n    f = prime_factors(n)\n    if len(f) == 2 and has_1_and_6(f[0]) and has_1_and_6(f[1]):\n        print(n, f)\n        found += 1\n    n += 1"
            }
            label={"Проверка на маленьких числах"}
            language="python"
            output={"3721 [61, 61]\n9943 [61, 163]\n10187 [61, 167]"}
          />
          <Typography.Text>
            Совпало, и 3721 = 61 · 61 тоже нашлось: множители не обязаны быть
            различными. Меняем границу и количество — и печатаем то, что просит
            условие, наибольший множитель:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 7_000_001\nfound = 0\nwhile found < 5:\n    f = prime_factors(n)\n    if len(f) == 2 and has_1_and_6(f[0]) and has_1_and_6(f[1]):\n        print(n, max(f))\n        found += 1\n    n += 1"
            }
            label={"Задача темы"}
            language="python"
            output={
              "7000421 114761\n7000691 2671\n7000909 114769\n7002643 42961\n7003019 6551"
            }
          />
          <Typography.Text>
            Ответ:{" "}
            <strong>
              7000421 114761 7000691 2671 7000909 114769 7002643 42961 7003019
              6551
            </strong>
            . Подчёркивание в <Notation>{"7_000_001"}</Notation> только для
            чтения — это то же число 7000001.
          </Typography.Text>
          <Typography.Text>
            Программа проверила около трёх тысяч чисел и закончила меньше чем за
            секунду: у большинства чисел маленький множитель находится сразу, и
            до √n цикл идёт редко. Проверку двух множителей можно записать и
            короче —{" "}
            <PythonTerm term="anyall">
              <Notation>{"all(has_1_and_6(p) for p in f)"}</Notation>
            </PythonTerm>
            : «у всех множителей из f есть 1 и 6».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "prostye-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Простое",
                note: <>нет делителя от 2 до √n; 1 — не простое</>,
              },
              {
                key: "Разложение",
                note: (
                  <>делить на d, пока делится; остаток &gt; 1 — множитель</>
                ),
              },
              {
                key: "Простые делители",
                note: <Notation>{"sorted(set(prime_factors(n)))"}</Notation>,
              },
              {
                key: "Множители с повторами",
                note: <Notation>{"len(f)"}</Notation>,
              },
              {
                key: "Различные делители",
                note: <Notation>{"len(set(f))"}</Notation>,
              },
              {
                key: "Задача темы",
                note: <>сначала маленькая граница, потом настоящая</>,
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
      prompt: <>Простое ли число 221?</>,
      reveal: <>Нет: 221 = 13 · 17. Делитель 13 найдётся до √221 ≈ 14,9.</>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Что вернёт <Notation>{"prime_factors(1960)"}</Notation>? Какие у 1960
          различные простые делители?
        </>
      ),
      reveal: (
        <>
          <Notation>{"[2, 2, 2, 5, 7, 7]"}</Notation>; различные простые
          делители — 2, 5 и 7.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Чему равны <Notation>{"len(f)"}</Notation> и{" "}
          <Notation>{"len(set(f))"}</Notation> для 12 и для 9, если{" "}
          <Notation>{"f = prime_factors(n)"}</Notation>?
        </>
      ),
      reveal: <>Для 12 — 3 и 2 (2 · 2 · 3), для 9 — 2 и 1 (3 · 3).</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          В <Notation>{"prime_factors"}</Notation> внутренний{" "}
          <Notation>{"while m % d == 0"}</Notation> заменили на{" "}
          <Notation>{"if"}</Notation>. Что вернёт функция для 72?
        </>
      ),
      reveal: (
        <>
          <Notation>{"[2, 3, 12]"}</Notation> вместо{" "}
          <Notation>{"[2, 2, 2, 3, 3]"}</Notation>: каждый d делит только один
          раз, остаток 12 уже меньше 4 · 4, цикл кончается, и составное 12
          попадает в список как «множитель».
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Подходит ли под условие задачи темы число 3721 = 61 · 61, если бы
          граница была 3000?
        </>
      ),
      reveal: (
        <>
          Да: множителей ровно два, «не обязательно различных», и в записи 61
          есть и 1, и 6.
        </>
      ),
    },
  ],
};

export default content;
