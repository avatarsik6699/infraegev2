// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./divisors-and-masks.paid.chisla-po-delitelyam.media";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "rovno-k-delitelej",
      navLabel: "Ровно k делителей",
      explanation: (
        <>
          <Typography.Text>
            Как найти числа, у которых ровно два делителя, не считая единицы и
            самого числа?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать числа, у каждого найти делители, отобрать нужные и
              сравнить их количество с двумя.
            </strong>{" "}
            Функция <Notation>{"get_divisors"}</Notation> из подтемы 2 делает
            самую трудную часть, остаётся перевести условие. Возьмём отрезок
            [10; 30], чтобы ответ можно было проверить в уме:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "for n in range(10, 31):\n    D = [d for d in get_divisors(n) if 1 < d < n]\n    if len(D) == 2:\n        print(n, D[0], D[1])"
            }
            label={"Ровно два делителя без 1 и n"}
            language="python"
            output={"10 2 5\n14 2 7\n15 3 5\n21 3 7\n22 2 11\n26 2 13\n27 3 9"}
          />
          <Typography.Text>
            У 10 без крайних остаются 2 и 5 — подходит. У 12 остаются 2, 3, 4, 6
            — четыре, не подходит. У 27 остаются 3 и 9: подходит, хотя 9 не
            простое. «Два делителя» и «два простых делителя» — разные условия.
          </Typography.Text>
          <Typography.Text>
            Для «ровно четыре чётных делителя» меняются только условие отбора и
            число: <Notation>{"d % 2 == 0"}</Notation> и{" "}
            <Notation>{"len(D) == 4"}</Notation>. Само число тогда считается,
            если оно чётное: условие его не исключало.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maksimum-delitelej",
      navLabel: "Больше всего делителей",
      explanation: (
        <>
          <Typography.Text>
            На отрезке [10; 30] найди число с наибольшим количеством делителей.
            Если таких несколько — наименьшее. Что нужно помнить по дороге?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Лучшее количество и число, у которого оно получилось. Новое число
              занимает их место, только если у него делителей больше.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "best_count = 0\nbest_number = 0\nfor n in range(10, 31):\n    count = count_divisors(n)\n    if count > best_count:\n        best_count = count\n        best_number = n\n\nprint(best_number, best_count)"
            }
            label={"Число с наибольшим количеством делителей"}
            language="python"
            output={"24 8"}
          />
          <Typography.Text>
            По восемь делителей у 24 и у 30. Перебор идёт по возрастанию, 24
            встречается раньше, а строгое <Notation>{">"}</Notation> не даёт 30
            его заменить. Со знаком <Notation>{">="}</Notation> при равенстве
            побеждало бы более позднее число, и ответом стало бы 30. Знак
            выбирают по правилу «если таких несколько».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "velichina-m",
      navLabel: "Величина M",
      explanation: (
        <>
          <Typography.Text>
            В условии часто вводят букву: «M — сумма двух наибольших делителей
            числа, не считая единицы и самого числа; если таких делителей нет, M
            = 0». Как с ней работать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              M — просто величина, которую считают по списку делителей. Главное
              — прочитать определение дословно и не забыть случай, когда
              делителей не хватает.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 48\nD = [d for d in get_divisors(n) if 1 < d < n]\nif len(D) >= 2:\n    M = D[-1] + D[-2]\nelse:\n    M = 0\nprint(D, M)"
            }
            label={"Сумма двух наибольших делителей"}
            language="python"
            output={"[2, 3, 4, 6, 8, 12, 16, 24] 40"}
          />
          <Typography.Text>
            Два наибольших делителя 48 — 24 и 16, M = 40. Другие определения
            считаются по тому же списку D — выбери:
          </Typography.Text>
          <VariantPicker
            label={"Определение M и вычисление для 48"}
            variants={[
              {
                label: "сумма всех",
                value: (
                  <>
                    <Notation>{"sum(D)"}</Notation> → 75
                  </>
                ),
              },
              {
                label: "наибольший − наименьший",
                value: (
                  <>
                    <Notation>{"D[-1] - D[0]"}</Notation> → 22
                  </>
                ),
              },
              {
                label: "произведение двух наименьших",
                value: (
                  <>
                    <Notation>{"D[0] * D[1]"}</Notation> → 6
                  </>
                ),
              },
              {
                label: "сумма трёх наибольших",
                value: (
                  <>
                    <Notation>{"sum(D[-3:])"}</Notation> → 52
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Осторожнее с нулём. У простого числа делителей без 1 и n нет, M = 0,
            а <Notation>{"0 % 10 == 0"}</Notation> — истина. Если условие хочет
            M, оканчивающееся на 0, все простые числа пройдут проверку по
            ошибке. Поэтому пишут <Notation>{"M > 0 and M % 10 == 0"}</Notation>{" "}
            — если, конечно, условие само не разрешает M = 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naimenshij-i-naibolshij",
      navLabel: "Наименьший и наибольший",
      explanation: (
        <>
          <Typography.Text>
            M — сумма наименьшего и наибольшего делителей без единицы и самого
            числа. Нужен ли для неё весь список делителей?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: наименьший делитель больше 1 и наибольший меньше n — это одна
              пара. Найди первый делитель, начиная с 2, — второй даст деление.
            </strong>{" "}
            На парах делителей 84 это видно сразу:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.arcs84_0fb5b7}
            caption={
              <>
                Пары делителей 84. Внешняя пара (1, 84) не учитывается — она
                пунктирная. Следующая, выделенная (2, 42) — самая широкая из
                оставшихся: слева наименьший делитель больше 1, справа
                наибольший меньше 84.
              </>
            }
          />
          <Typography.Text>
            Дуги вложены друг в друга: чем левее начало, тем правее конец. Для
            84 это 2 и <Notation>{"84 // 2"}</Notation> = 42, для 105 — 3 и 35.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def calc_m(n):\n    for d in range(2, isqrt(n) + 1):\n        if n % d == 0:\n            return d + n // d\n    return 0\n\nprint(calc_m(84), calc_m(105), calc_m(13))"
            }
            label={"Сумма наименьшего и наибольшего делителей"}
            language="python"
            output={"44 38 0"}
          />
          <Typography.Text>
            Перебор начинается с 2 — единица исключена — и останавливается на
            первом делителе: <Notation>{"return"}</Notation> сразу выходит из
            функции. У простого 13 делителей нет, функция вернёт 0. У 49
            единственный такой делитель — 7, он и наименьший, и наибольший: M =
            7 + 7 = 14, если условие не требует двух разных делителей.
          </Typography.Text>
          <ProofDisclosure summary="Почему так для любого составного n">
            <Typography.Text>
              Пусть a — наименьший делитель n больше 1. Любой делитель b {"<"} n
              стоит в паре с n / b {">"} 1, а чем больше один множитель пары,
              тем меньше другой. Самому маленькому a соответствует самый большой
              делитель меньше n — это n / a.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "pervye-posle-granicy",
      navLabel: "Первые после границы",
      explanation: (
        <>
          <Typography.Text>
            Найди пять первых чисел больше 100, у которых M — сумма наименьшего
            и наибольшего делителей без 1 и n — оканчивается на 0. Как собрать
            программу?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Цикл из подтемы 1 — <Notation>{"while found < 5"}</Notation> — с
              проверкой через <Notation>{"calc_m"}</Notation> внутри.
            </strong>{" "}
            Задачи этой подтемы так и устроены: перебор чисел снаружи, работа с
            делителями внутри.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 101\nfound = 0\nwhile found < 5:\n    M = calc_m(n)\n    if M > 0 and M % 10 == 0:\n        print(n, M)\n        found += 1\n    n += 1"
            }
            label={"Пять чисел больше 100 с M на 0"}
            language="python"
            output={"111 40\n116 60\n125 30\n136 70\n141 50"}
          />
          <Typography.Text>
            111 = 3 · 37, M = 40. 125 = 5 · 25 — наибольший делитель 25 не
            простой, но условие о простоте ничего не говорит. Без{" "}
            <Notation>{"M > 0"}</Notation> первым ответом стало бы простое 101.
          </Typography.Text>
          <Typography.Text>
            На экзамене граница бывает и 700 000, и 5 000 000 — программа та же.{" "}
            <Notation>{"calc_m"}</Notation> обычно находит делитель за несколько
            шагов, до √n идёт только для простых чисел, поэтому перебор
            укладывается в секунды.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chisla-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Ровно k",
                note: (
                  <>
                    отобрать D и проверить <Notation>{"len(D) == k"}</Notation>
                  </>
                ),
              },
              {
                key: "Больше всего",
                note: <>помнить лучшее количество и число</>,
              },
              {
                key: "При равенстве",
                note: <>«&gt;» — первое из равных, «&gt;=» — последнее</>,
              },
              {
                key: "Величина M",
                note: <>определение дословно, M = 0 — проверить отдельно</>,
              },
              {
                key: "Наименьший и наибольший",
                note: (
                  <>
                    одна пара: d и <Notation>{"n // d"}</Notation>
                  </>
                ),
              },
              {
                key: "Первые после N",
                note: (
                  <>
                    <Notation>{"while found < k"}</Notation> из подтемы 1
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
          Подходят ли 27 и 16 под условие «ровно два делителя, не считая единицы
          и самого числа»?
        </>
      ),
      reveal: (
        <>
          27 подходит: 3 и 9. 16 не подходит: у него три таких делителя — 2, 4 и
          8.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          В программе поиска числа с наибольшим количеством делителей на [10;
          30] заменили <Notation>{">"}</Notation> на <Notation>{">="}</Notation>
          . Что она выведет?
        </>
      ),
      reveal: (
        <>
          30 8: у 24 и 30 по восемь делителей, и при равенстве теперь побеждает
          более позднее число.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          M — сумма двух наибольших делителей без единицы и самого числа, а если
          их меньше двух, M = 0. Чему равно M для 49 и для 50?
        </>
      ),
      reveal: (
        <>
          Для 49 — 0: у него один такой делитель, 7. Для 50 — 35: делители 2, 5,
          10, 25, два наибольших — 25 и 10.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Что вернёт <Notation>{"calc_m(91)"}</Notation>? Сколько кандидатов d
          она проверит?
        </>
      ),
      reveal: (
        <>
          20: 91 = 7 · 13. Она проверит d = 2, 3, 4, 5, 6, 7 — шесть кандидатов
          — и остановится на 7.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Почему в поиске «M оканчивается на 0» нужно{" "}
          <Notation>{"M > 0 and M % 10 == 0"}</Notation>, а не просто{" "}
          <Notation>{"M % 10 == 0"}</Notation>?
        </>
      ),
      reveal: (
        <>
          У простых чисел M = 0, а 0 % 10 == 0 — истина. Без M {">"} 0 в ответ
          попадут все простые числа.
        </>
      ),
    },
  ],
};

export default content;
