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
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "chisla-ideya",
      navLabel: "Главная идея",
      explanation: (
        <>
          <Typography.Text>
            Главная идея подтемы:{" "}
            <strong>
              задача «найти числа с нужными делителями» — это перебор чисел из
              подтемы 1, внутри которого работает поиск делителей из подтемы 2
            </strong>
            . Меняется только то, что мы вычисляем по найденным делителям и как
            выбираем ответ.
          </Typography.Text>
          <Typography.Text>
            Функции <Notation>{"get_divisors"}</Notation> и{" "}
            <Notation>{"count_divisors"}</Notation> из подтемы 2 считаем
            определёнными выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rovno-k-delitelej",
      navLabel: "Ровно k делителей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разберём полностью задачу на точное количество делителей.
            </strong>{" "}
            Возьмём небольшой диапазон, чтобы результат можно было проверить
            вручную.
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти все числа от 10 до 30 включительно, у которых ровно два
              различных делителя, не считая единицы и самого числа. Вывести
              число и эти два делителя.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Переведём условие: перебираем <Notation>{"n"}</Notation> от 10 до
            30, получаем все делители, исключаем 1 и <Notation>{"n"}</Notation>,
            проверяем, что осталось ровно два, и выводим нужные значения.
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(10, 31):\n    D = [d for d in get_divisors(n) if 1 < d < n]\n\n    if len(D) == 2:\n        print(n, D[0], D[1])"
            }
            label={"Код на Python: for n in range(10, 31):"}
            language="python"
            output={"10 2 5\n14 2 7\n15 3 5\n21 3 7\n22 2 11\n26 2 13\n27 3 9"}
          />
          <Typography.Text>
            Проверим на отдельных числах. У 10 делители 1, 2, 5, 10: без крайних
            остаются 2 и 5 — подходит. У 12 остаются 2, 3, 4, 6 — четыре, не
            подходит. У 27 остаются 3 и 9 — подходит. Это хороший пример того,
            почему нельзя заменять условие «два делителя» условием «два простых
            делителя»: среди делителей 27 есть составное число 9.
          </Typography.Text>
          <Typography.Text>
            Если требуются ровно четыре чётных делителя, меняются только отбор и
            количество. <Notation>{"print(n, *D)"}</Notation> выводит число, а
            затем все элементы списка через пробел: звёздочка передаёт элементы
            списка как отдельные аргументы.
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(10, 31):\n    D = [d for d in get_divisors(n) if d % 2 == 0]\n\n    if len(D) == 4:\n        print(n, *D)"
            }
            label={"Код на Python: for n in range(10, 31):"}
            language="python"
            output={
              "12 2 4 6 12\n16 2 4 8 16\n20 2 4 10 20\n28 2 4 14 28\n30 2 6 10 30"
            }
          />
          <Typography.Text>
            Само число здесь может учитываться: условие требует чётные делители
            и не исключает <Notation>{"n"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maksimum-delitelej",
      navLabel: "Максимум делителей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В задачах на максимальное количество делителей нужно хранить
              текущий лучший результат.
            </strong>{" "}
            Рассмотрим условие:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Среди чисел от 10 до 30 найти число с наибольшим количеством
              делителей. Если таких чисел несколько, выбрать наименьшее.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Нужны две переменные: лучшее найденное количество делителей и число,
            которому оно соответствует.
          </Typography.Text>
          <CodeBlock
            code={
              "L = 10\nR = 30\n\nbest_count = 0\nbest_number = L\n\nfor n in range(L, R + 1):\n    current_count = count_divisors(n)\n\n    if current_count > best_count:\n        best_count = current_count\n        best_number = n\n\nprint(best_count, best_number)"
            }
            label={"Код на Python: L = 10"}
            language="python"
            output={"8 24"}
          />
          <Typography.Text>
            Почему при равном количестве делителей сохраняется наименьшее число?
            Перебор идёт по возрастанию, и 24 встретится раньше 30. У обоих по
            восемь делителей, но проверка{" "}
            <Notation>{"current_count > best_count"}</Notation> при равенстве не
            выполнится, поэтому 24 не заменится на 30. Со знаком{" "}
            <Notation>{">="}</Notation> при равенстве предыдущее число
            заменялось бы новым, большим, и выбралось бы наибольшее из чисел с
            одинаковым количеством делителей.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Знак <Notation>{">"}</Notation> или <Notation>{">="}</Notation>{" "}
              здесь определяется правилом выбора при равенстве.
            </strong>
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
            <strong>
              Буква M в условии обычно обозначает некоторую вычисляемую
              величину, а не особый алгоритм.
            </strong>{" "}
            Нужно внимательно прочитать, как она определена. Например:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              M — сумма двух наибольших различных делителей числа, не считая
              самого числа и единицы. Если таких делителей меньше двух, M = 0.
            </Typography.Text>
          </blockquote>
          <CodeBlock
            code={
              "D = [d for d in get_divisors(n) if 1 < d < n]\n\nif len(D) >= 2:\n    M = D[-1] + D[-2]\nelse:\n    M = 0"
            }
            label={"Например"}
            language="python"
          />
          <Typography.Text>
            Для 48 отобранный список — D = [2, 3, 4, 6, 8, 12, 16, 24]. Два
            наибольших — 24 и 16, поэтому M = 24 + 16 = 40. Другие определения
            требуют других вычислений по такому же списку. Выберите определение,
            чтобы увидеть вычисление и его значение для 48:
          </Typography.Text>
          <VariantPicker
            label={"Определение величины и вычисление после отбора"}
            variants={[
              {
                label: "сумма всех выбранных делителей",
                value: (
                  <>
                    <Notation>{"sum(D)"}</Notation> → 75
                  </>
                ),
              },
              {
                label: "разность наибольшего и наименьшего",
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
              {
                label: "количество выбранных делителей",
                value: (
                  <>
                    <Notation>{"len(D)"}</Notation> → 8
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            У каждой формулы нужно проверить, что нужные элементы существуют.
            Особенно внимательно относитесь к значению 0, которое задают при
            отсутствии делителей: проверка <Notation>{"M % 10 == 0"}</Notation>{" "}
            истинна и при <Notation>{"M == 0"}</Notation>. Поэтому, если условие
            требует <strong>положительное</strong> M, оканчивающееся нулём,
            проверка должна быть <Notation>{"M > 0 and M % 10 == 0"}</Notation>.
            Но если условие допускает ноль, исключать его самостоятельно нельзя.
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
            <strong>
              Наименьший и наибольший делители, кроме 1 и самого числа, связаны
              друг с другом.
            </strong>{" "}
            Это позволяет иногда обойтись без полного списка.
          </Typography.Text>
          <Typography.Text>Посмотрим на пары делителей 84:</Typography.Text>
          <LessonDiagram
            {...lessonMedia.arcs84_0fb5b7}
            caption={
              <>
                Пары делителей 84; делители расставлены по порядку на равных
                расстояниях, чтобы подписи читались. Внешняя дуга (1, 84) по
                условию не учитывается — она пунктирная. Следующая, выделенная
                дуга (2, 42) — самая широкая из оставшихся: её левый конец —
                наименьший делитель больше 1, правый — наибольший делитель
                меньше 84.
              </>
            }
          />
          <Typography.Text>
            Дуги вложены друг в друга: чем левее начинается дуга, тем правее она
            заканчивается. Поэтому наименьший делитель больше 1 и наибольший
            делитель меньше n всегда оказываются концами одной дуги. Достаточно
            найти наименьший — второй получится делением. Для 84 наименьший
            делитель больше единицы — 2, значит, наибольший меньше 84 — это 84 :
            2 = 42. Для 105 это 3 и 105 : 3 = 35.
          </Typography.Text>
          <ProofDisclosure summary="Почему так для любого составного n">
            <Typography.Text>
              Пусть a — наименьший делитель числа n, больший единицы, и число
              составное, то есть a {"<"} n. Тогда b = n / a — наибольший
              делитель, меньший самого числа. Действительно, любой делитель b{" "}
              {"<"} n образует пару с a = n / b {">"} 1. При фиксированном
              произведении n чем больше один множитель, тем меньше другой.
              Поэтому самому маленькому делителю больше 1 соответствует самый
              большой делитель меньше n.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Если M определено как сумма наименьшего и наибольшего делителей без
            единицы и самого числа, можно написать:
          </Typography.Text>
          <CodeBlock
            code={
              "def calc_m(n):\n    for d in range(2, isqrt(n) + 1):\n        if n % d == 0:\n            return d + n // d\n\n    return 0"
            }
            label={"Код на Python: def calc_m(n):"}
            language="python"
          />
          <Typography.Text>
            Перебор начинается с 2, потому что единица исключена, и идёт по
            возрастанию. Поэтому первый найденный делитель — наименьший, а
            парный к нему — наибольший: функция сразу возвращает их сумму. Если
            делителей не найдено, она возвращает 0.
          </Typography.Text>
          <CodeBlock
            code={"print(calc_m(84), calc_m(105), calc_m(13))"}
            label={"Если делителей не найдено, она возвращает 0"}
            language="python"
            output={"44 38 0"}
          />
          <Typography.Text>
            У числа 49 единственный делитель без 1 и 49 — это 7, он одновременно
            наименьший и наибольший. Для определения{" "}
            <strong>«сумма наименьшего и наибольшего»</strong> получится 7 + 7 =
            14, если условие допускает такой случай. Но для определения{" "}
            <strong>«сумма двух различных делителей»</strong> одного делителя
            недостаточно. Это два разных условия, хотя формулировки выглядят
            похожими.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervye-posle-granicy",
      navLabel: "Первые после границы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если нужно найти первые несколько подходящих чисел после заданной
              границы, верхнюю границу не следует придумывать.
            </strong>{" "}
            Лучше продолжать поиск, пока не найдено нужное количество ответов.
            Для этого используется цикл{" "}
            <PythonTerm term="while">
              <Notation>{"while"}</Notation>
            </PythonTerm>{" "}
            — «пока»: перед каждым повторением Python проверяет условие и, пока
            оно истинно, выполняет действия.
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти пять наименьших чисел, больших 100, для которых сумма
              наименьшего и наибольшего делителей без единицы и самого числа
              положительна и оканчивается на 0.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Функция <Notation>{"calc_m"}</Notation> уже определена выше.
          </Typography.Text>
          <CodeBlock
            code={
              "n = 101\nfound = 0\n\nwhile found < 5:\n    M = calc_m(n)\n\n    if M > 0 and M % 10 == 0:\n        print(n, M)\n        found += 1\n\n    n += 1"
            }
            label={"Функция calc_m уже определена выше"}
            language="python"
            output={"111 40\n116 60\n125 30\n136 70\n141 50"}
          />
          <Typography.Text>
            Начинаем с 101, потому что требуется число <strong>больше</strong>{" "}
            100. Счётчик <Notation>{"found"}</Notation> увеличиваем только после
            успешной проверки, а к следующему числу (
            <Notation>{"n += 1"}</Notation>) переходим всегда — подошло текущее
            или нет. Цикл продолжается, пока найдено меньше пяти.
          </Typography.Text>
          <Typography.Text>
            Почему получаются именно пять наименьших? Числа просматриваются
            строго по возрастанию, и ни один кандидат не пропускается. Значит,
            первые пять успешных проверок соответствуют пяти наименьшим
            решениям. Такой поиск предполагает, что решения существуют; если
            задача задаёт конечный диапазон, нужно соблюдать и его верхнюю
            границу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chisla-korotko",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Сначала переводим определение величины из условия в код:
                    какие делители отбираем, что по ним считаем, что делать,
                    если делителей не хватает.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Для «максимального количества» храним лучший результат. Знак{" "}
                    <Notation>{">"}</Notation> или <Notation>{">="}</Notation>{" "}
                    выбираем по правилу при равенстве.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Наименьший делитель больше 1 и наибольший меньше n — это
                    одна пара: хватает поиска до первого делителя.
                  </>
                ),
              },
              {
                note: (
                  <>
                    «Первые пять после границы» ищем циклом{" "}
                    <Notation>{"while"}</Notation> без придуманной верхней
                    границы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Значение 0 «при отсутствии делителей» проверяем отдельно:{" "}
                    <Notation>{"M > 0"}</Notation>, если условие требует
                    положительное M.
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
      id: "maksimum-pri-ravenstve",
      prompt: (
        <>
          Изменится ли ответ задачи о числе с наибольшим количеством делителей
          на отрезке [1000; 1100], если при равенстве выбирать наибольшее число?
          Почему?
        </>
      ),
      reveal: <>Нет: на этом отрезке 32 делителя есть только у 1080.</>,
    },
  ],
};

export default content;
